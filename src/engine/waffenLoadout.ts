// Waffen-Loadout-Feature (Kampf-Tab, urspruenglich 2026-07-22, REWORKED 2026-07-23): reine
// abgeleitete Sicht ueber bereits besessene Ausruestung (kein neues Kauf-/Ausrüst-System) fuer
// fuenf dictierte Zwei-Item-Kombinationen - NK 1H + NK 1H, NK 1H + FK Pistole, NK 1H + Schild,
// Pistole + Pistole, Schild + Pistole - jeweils mit/ohne die Talente "Kampf mit zwei Waffen Stufe
// 1-4" (amalgamiert 1H+1H bzw. 1H+Schild zu EINER Kampf-Entitaet, WK-gated), "Linkshaendig
// Pistolenschiessen"/"Beidhaendig Pistolenschiessen" (heben die Nebenhand-Halbierung fuer eine
// bzw. beide Pistolenhaende auf) und "Schildkampf" (hebt die Nebenhand-Halbierung fuer ein Schild
// in der linken Hand auf). Regelwerk siehe Projekt-Memory project_waffen_loadout.md, mit dem
// Nutzer 2026-07-23 als komplettes Rework der 2026-07-22-Version dictiert. Alle Funktionen hier
// sind reine Funktionen ueber CharacterState/ComputedSheet - keine Mutation, kein Seiteneffekt.

import type { CharacterState, WaffenLoadoutEntry } from '../state/characterStore';
import type { ComputedSheet } from './characterSheet';
import { evalReferenz, type CharacterValueSource } from './rules';
import { computeWeaponAtPaOverflow, getKampfstilModifier, getZweiWaffenCap, resolveWaffenPoolReferenz } from './waffenPool';
import { computeSchaden, averageSchadenValue, floorSigned } from './waffenSchaden';
import { computeRangeCellValues, formatRangeCellValues, fkGuteDivisor, fkMeisterlichDivisor, type RangeCellValues } from './fernkampfRange';
import { NK_WAFFEN_BASIS, type GenericRow as WeaponRow } from '../data/equipment/weapons';
import { FEUERWAFFEN, type FernkampfRow } from '../data/equipment/fernkampf';

function findWeaponBasis(baseId: string): WeaponRow | undefined {
  return NK_WAFFEN_BASIS.find((r) => String(r.sourceRow) === baseId);
}

function resolvePoolReferenzSafe(hauptfertigkeit: string, spezialisierung: string): string | null {
  try {
    return resolveWaffenPoolReferenz(hauptfertigkeit, spezialisierung);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------------------------
// Eignungslisten (fuer die Auswahl-Dropdowns im Kampf-Tab und zur Loadout-Aufloesung)
// ---------------------------------------------------------------------------------------------

export interface LoadoutItemInfo {
  equipmentId: string;
  label: string;
  hauptfertigkeit: string;
  poolReferenz: string | null;
  atBonus: number;
  paBonus: number;
  wk: number;
  minStaerke: number;
  staerkeMalus: number;
  basis: WeaponRow;
}

/** Alle besessenen 1H-faehigen Nahkampfwaffen (family='weapon'). Stangenwaffen sind bewusst fuer
 *  ALLE fuenf Loadout-Combo-Typen ausgeschlossen (nicht nur fuer das Zwei-Waffen-Talent-Gate) - ein
 *  zweihaendiger Stangenwaffentyp passt zu keiner der dictierten Hand-Kombinationen, siehe
 *  Plan-Judgment-Call 6a und die analoge bestehende Ausschluss-Logik fuer den Anzeige-Flag
 *  `NahkampfRow.zweiWaffenFaehig` in views/kampf.ts. */
export function listEligibleNahkampf1HWaffen(character: CharacterState): LoadoutItemInfo[] {
  const out: LoadoutItemInfo[] = [];
  for (const e of character.equipment) {
    if (e.family !== 'weapon') continue;
    const basis = findWeaponBasis(e.baseId);
    if (!basis) continue;
    const hauptfertigkeit = basis['Hauptfertigkeit'] ?? '';
    if (hauptfertigkeit === 'Stangenwaffen') continue;
    const snap = e.computedStatsSnapshot ?? {};
    out.push({
      equipmentId: e.id,
      label: basis.name,
      hauptfertigkeit,
      poolReferenz: resolvePoolReferenzSafe(hauptfertigkeit, basis['Spezialisierung'] ?? ''),
      atBonus: snap.at ?? 0,
      paBonus: snap.pa ?? 0,
      wk: snap.wk ?? 0,
      minStaerke: snap.minStaerke1H ?? 0,
      staerkeMalus: snap.staerkeMalus ?? 0,
      basis,
    });
  }
  return out;
}

/** Alle besessenen Schilde (family='shield') - Schilde speichern ihre Mindeststaerke unter
 *  `minStaerke` statt `minStaerke1H` (siehe buyShield), Schilde haben ohnehin nur einen Griff. */
export function listEligibleSchilde(character: CharacterState): LoadoutItemInfo[] {
  const out: LoadoutItemInfo[] = [];
  for (const e of character.equipment) {
    if (e.family !== 'shield') continue;
    const basis = findWeaponBasis(e.baseId);
    if (!basis) continue;
    const hauptfertigkeit = basis['Hauptfertigkeit'] ?? '';
    const snap = e.computedStatsSnapshot ?? {};
    out.push({
      equipmentId: e.id,
      label: basis.name,
      hauptfertigkeit,
      poolReferenz: resolvePoolReferenzSafe(hauptfertigkeit, basis['Spezialisierung'] ?? ''),
      atBonus: snap.at ?? 0,
      paBonus: snap.pa ?? 0,
      wk: snap.wk ?? 0,
      minStaerke: snap.minStaerke ?? 0,
      staerkeMalus: snap.staerkeMalus ?? 0,
      basis,
    });
  }
  return out;
}

export interface LoadoutPistoleInfo {
  equipmentId: string;
  label: string;
  basis: FernkampfRow;
  snap: Record<string, number>;
}

/** Alle besessenen Feuerwaffen mit Typ='Pistole' (family='feuerwaffe') - Musketen/Gewehre sind
 *  fuer diese Loadout-Combos (jede mit "Pistole" im Namen) nicht vorgesehen (die Regel spricht
 *  explizit von "Pistole", nicht "Feuerwaffe" allgemein). */
export function listEligiblePistolen(character: CharacterState): LoadoutPistoleInfo[] {
  const out: LoadoutPistoleInfo[] = [];
  for (const e of character.equipment) {
    if (e.family !== 'feuerwaffe') continue;
    const basis = FEUERWAFFEN.find((r) => String(r.sourceRow) === e.baseId);
    if (!basis || basis['Typ'] !== 'Pistole') continue;
    out.push({ equipmentId: e.id, label: basis.name, basis, snap: e.computedStatsSnapshot ?? {} });
  }
  return out;
}

/** WK-Kappungsgrenze der hoechsten besessenen "Kampf mit zwei Waffen"-Stufe, beide raw (unmodifiziert
 *  gelisteten) WK muessen darunter liegen (Plan: Gate wird immer gegen die RAW WK geprueft, auch
 *  wenn - beim Schild-Fall - die WK anschliessend halbiert in die AT/PA-WK-Formel eingeht). */
export function isZweiWaffenTalentEligiblePair(character: CharacterState, wkA: number, wkB: number): boolean {
  const cap = getZweiWaffenCap(character);
  return cap !== undefined && wkA <= cap && wkB <= cap;
}

// ---------------------------------------------------------------------------------------------
// "Hoehere Pool"-Regel (gAT/gPA/mAT/mPA/PP fuer den ganzen Combo, siehe Plan) - vom Nutzer
// 2026-07-22 nachtraeglich praezisiert: die Seite mit den meisten bereits investierten
// Spezialisierungspunkten in ihrem eigenen Pool "gewinnt" und bestimmt gAT/gPA/mAT/mPA/PP fuer den
// GANZEN Combo (nie gesplittet, nie gemittelt/summiert). Nur fuer nk1h_nk1h/nk1h_schild relevant -
// die drei Pistolen-Combos (nk1h_pistole/schild_pistole/pistole_pistole) haben keine solche
// Pool-Struktur (siehe engine.md-Kommentar in views/kampf.ts).
// ---------------------------------------------------------------------------------------------

export interface PoolSideRef {
  equipmentId: string;
  poolReferenz: string | null;
}

function poolInvestedPoints(sheet: ComputedSheet, poolReferenz: string | null): number {
  if (!poolReferenz) return -Infinity; // kein aufloesbarer Pool -> gewinnt nie gegen eine echte Seite
  const rule = sheet.byKategorie['Nahkampf']?.find((r) => r.rule.referenz === poolReferenz);
  return Number(rule?.computedValue ?? 0);
}

/** Bei Gleichstand gewinnt `primary` (deterministisch, kein Zufall). */
export function pickHigherPoolSide(sheet: ComputedSheet, primary: PoolSideRef, secondary: PoolSideRef): PoolSideRef {
  return poolInvestedPoints(sheet, secondary.poolReferenz) > poolInvestedPoints(sheet, primary.poolReferenz) ? secondary : primary;
}

// ---------------------------------------------------------------------------------------------
// Gemeinsame Bausteine
// ---------------------------------------------------------------------------------------------

export interface LoadoutResolutionError {
  ok: false;
  reason: string;
}

/** nAT/nPA fuer den Loadout-Combo IMMER mit Null Pool-Ueberschuss-Investition (Nutzer 2026-07-22
 *  bestaetigt: "always show a fresh, zero-investment number") - unabhaengig davon, was der
 *  Spieler fuer diese Waffe bereits in ihrer SOLO-Nahkampf-Zeile an nAT/nPA-Ueberschusspunkten
 *  investiert hat. gAT/gPA/mAT/mPA sind davon UNBERUEHRT (siehe pickHigherPoolSide/higherPoolSide -
 *  die werden vom Aufrufer (views/kampf.ts) separat aus der jeweils gewinnenden Seite gespiegelt). */
function cappedNat(
  hauptfertigkeit: string, atBonus: number, paBonus: number, values: CharacterValueSource,
  kampfstil: { at: number; pa: number },
): { nat: number; npa: number } {
  const overflow = computeWeaponAtPaOverflow(hauptfertigkeit, atBonus, paBonus, values, kampfstil);
  return { nat: Math.min(20, overflow.uncAtWeapon), npa: Math.min(20, overflow.uncPaWeapon) };
}

/** Liest den n-Mod (AT-Basis/PA-Basis) und die Hauptfertigkeit aus dem fixen NK-Statblock einer
 *  Feuerwaffe (siehe project_fk_nk_ladezeit.md/computeFkNkWerte in views/kampf.ts, dort fuer die
 *  reine Anzeige der Feuerwaffen-Tabelle - hier fuer die NEUE "n-Mod beider Waffen addiert"-Regel
 *  von NK1H+Pistole/Schild+Pistole wiederverwendet, wie vom Nutzer beim Commissionen jenes
 *  Features bereits als Backlog-Punkt angekuendigt: "das wird im Loadout-System nachgezogen").
 *  Gibt null zurueck, falls die Pistole (defensiv) keinen NK-Statblock traegt - der Aufrufer
 *  behandelt das dann als Null-Beitrag, ohne die restliche Combo-Berechnung zu blockieren. */
interface PistoleNkMod {
  atBonus: number;
  paBonus: number;
}

function fkNum(row: FernkampfRow | undefined, header: string): number {
  const raw = row?.[header];
  if (raw === undefined) return 0;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function pistoleNkMod(basis: FernkampfRow): PistoleNkMod | null {
  if (basis['Hauptfertigkeit'] === undefined) return null;
  return { atBonus: fkNum(basis, 'AT-Basis'), paBonus: fkNum(basis, 'PA-Basis') };
}

const FEUERWAFFEN_TYP_BASIS_REF: Record<string, string> = {
  Gewehr: 'fk_basis_spez_schusswaffen_musketen',
  Pistole: 'fk_basis_spez_schusswaffen_pistolen',
};
const RANGE_KEYS = ['rw10m', 'rw30m', 'rw60m', 'rw100m', 'rw150m', 'rw210m'] as const;

function halveRangeCellValues(v: RangeCellValues | 'x'): RangeCellValues | 'x' {
  if (v === 'x') return 'x';
  const halved: RangeCellValues = { normal: floorSigned(v.normal / 2) };
  if (v.gut !== undefined) halved.gut = floorSigned(v.gut / 2);
  if (v.meisterlich !== undefined) halved.meisterlich = floorSigned(v.meisterlich / 2);
  return halved;
}

/** Reichweitenzellen einer Pistole fuer eine Loadout-Zeile - gemeinsam genutzt von nk1h_pistole,
 *  schild_pistole und pistole_pistole (vorher pro Resolver dupliziert, seit dem 2026-07-23-Rework
 *  mit drei statt einer Pistolen-Combo extrahiert). */
function computePistoleRanges(pistole: LoadoutPistoleInfo, values: CharacterValueSource, halved: boolean): string[] {
  const gutDivisor = fkGuteDivisor(values);
  const meisterlichDivisor = fkMeisterlichDivisor(values);
  const basisRef = FEUERWAFFEN_TYP_BASIS_REF[pistole.basis['Typ'] ?? ''];
  let basisWert = 0;
  if (basisRef) {
    try {
      basisWert = Number(evalReferenz(basisRef, values));
    } catch {
      // nicht auswertbar - Zellen bleiben "x" (siehe computeRangeCellValues's Number.isFinite-Fallback).
    }
  }
  const rangesRaw: Array<RangeCellValues | 'x'> = basisRef
    ? RANGE_KEYS.map((key) => computeRangeCellValues(pistole.snap[key] ?? 0, basisWert, gutDivisor, meisterlichDivisor))
    : RANGE_KEYS.map(() => 'x');
  return (halved ? rangesRaw.map(halveRangeCellValues) : rangesRaw).map(formatRangeCellValues);
}

function pistolenschiessenTalente(character: CharacterState): { linkshaendig: boolean; beidhaendig: boolean } {
  return {
    linkshaendig: (character.selections['talente_linkshaendig_pistolenschiessen'] ?? 0) > 0,
    beidhaendig: (character.selections['talente_beidhaendig_pistolenschiessen'] ?? 0) > 0,
  };
}

// ---------------------------------------------------------------------------------------------
// nk1h_nk1h - NK 1H + NK 1H (dual wield)
// ---------------------------------------------------------------------------------------------

export interface DualWaffenSide {
  equipmentId: string;
  label: string;
  isPrimary: boolean;
  halved: boolean;
  nat: number;
  npa: number;
  schaden: string;
  wk: string;
}

export interface DualWaffenNoTalentResult {
  ok: true;
  comboType: 'nk1h_nk1h';
  talentActive: false;
  primary: DualWaffenSide;
  secondary: DualWaffenSide;
  higherPoolSide: PoolSideRef;
}

export interface DualWaffenTalentResult {
  ok: true;
  comboType: 'nk1h_nk1h';
  talentActive: true;
  primaryEquipmentId: string;
  secondaryEquipmentId: string;
  nat: number;
  npa: number;
  atWk: string;
  paWk: string;
  minStaerke: number;
  schaden: string;
  higherPoolSide: PoolSideRef;
}

export type Nk1hNk1hResult = LoadoutResolutionError | DualWaffenNoTalentResult | DualWaffenTalentResult;

export function resolveNk1hNk1h(
  character: CharacterState, sheet: ComputedSheet, values: CharacterValueSource,
  primaryEquipmentId: string, secondaryEquipmentId: string,
): Nk1hNk1hResult {
  const items = listEligibleNahkampf1HWaffen(character);
  const primary = items.find((i) => i.equipmentId === primaryEquipmentId);
  const secondary = items.find((i) => i.equipmentId === secondaryEquipmentId);
  if (!primary || !secondary) {
    return { ok: false, reason: 'Eine oder beide Waffen sind nicht (mehr) besessen oder nicht 1H-fähig' };
  }

  const eigKStaerke = Number(evalReferenz('eig_k_staerke', values));
  const kampfstil = getKampfstilModifier(character);
  const higherPoolSide = pickHigherPoolSide(
    sheet,
    { equipmentId: primary.equipmentId, poolReferenz: primary.poolReferenz },
    { equipmentId: secondary.equipmentId, poolReferenz: secondary.poolReferenz },
  );
  const atBonusSum = primary.atBonus + secondary.atBonus;
  const paBonusSum = primary.paBonus + secondary.paBonus;

  if (isZweiWaffenTalentEligiblePair(character, primary.wk, secondary.wk)) {
    const { nat, npa } = cappedNat(primary.hauptfertigkeit, atBonusSum, paBonusSum, values, kampfstil);
    const primaryAvg = averageSchadenValue(primary.basis, primary.staerkeMalus, eigKStaerke);
    const secondaryAvg = averageSchadenValue(secondary.basis, secondary.staerkeMalus, eigKStaerke);
    const schaden = primaryAvg >= secondaryAvg
      ? computeSchaden(primary.basis, primary.staerkeMalus, eigKStaerke)
      : computeSchaden(secondary.basis, secondary.staerkeMalus, eigKStaerke);
    return {
      ok: true, comboType: 'nk1h_nk1h', talentActive: true,
      primaryEquipmentId, secondaryEquipmentId, nat, npa,
      atWk: String(Math.max(primary.wk, secondary.wk) * 1.5),
      paWk: String(primary.wk + secondary.wk),
      minStaerke: primary.minStaerke + secondary.minStaerke,
      schaden, higherPoolSide,
    };
  }

  const primaryNat = cappedNat(primary.hauptfertigkeit, atBonusSum, paBonusSum, values, kampfstil);
  const secondaryNat = cappedNat(secondary.hauptfertigkeit, atBonusSum, paBonusSum, values, kampfstil);
  return {
    ok: true, comboType: 'nk1h_nk1h', talentActive: false,
    primary: {
      equipmentId: primary.equipmentId, label: primary.label, isPrimary: true, halved: false,
      nat: primaryNat.nat, npa: primaryNat.npa,
      schaden: computeSchaden(primary.basis, primary.staerkeMalus, eigKStaerke), wk: String(primary.wk),
    },
    secondary: {
      equipmentId: secondary.equipmentId, label: secondary.label, isPrimary: false, halved: true,
      nat: floorSigned(secondaryNat.nat / 2), npa: floorSigned(secondaryNat.npa / 2),
      schaden: computeSchaden(secondary.basis, secondary.staerkeMalus, eigKStaerke), wk: String(secondary.wk),
    },
    higherPoolSide,
  };
}

// ---------------------------------------------------------------------------------------------
// nk1h_pistole - NK 1H + FK Pistole (REWORKED 2026-07-23: die NK-Waffe ist jetzt IMMER primaer,
// keine Spielerwahl mehr; n-Mod beider Waffen wird jetzt addiert statt unabhaengig zu bleiben -
// die Pistole steuert dazu ihren fixen NK-Statblock-n-Mod bei, siehe pistoleNkMod).
// ---------------------------------------------------------------------------------------------

export interface MeleeSideResult {
  equipmentId: string;
  label: string;
  halved: boolean;
  nat: number;
  npa: number;
  schaden: string;
  wk: string;
}

export interface PistoleSideResult {
  equipmentId: string;
  label: string;
  halved: boolean;
  ranges: string[];
}

export interface Nk1hPistoleResult {
  ok: true;
  comboType: 'nk1h_pistole';
  melee: MeleeSideResult;
  pistole: PistoleSideResult;
}

export function resolveNk1hPistole(
  character: CharacterState, values: CharacterValueSource,
  primaryEquipmentId: string, secondaryEquipmentId: string,
): LoadoutResolutionError | Nk1hPistoleResult {
  const melee = listEligibleNahkampf1HWaffen(character).find((i) => i.equipmentId === primaryEquipmentId);
  const pistole = listEligiblePistolen(character).find((i) => i.equipmentId === secondaryEquipmentId);
  if (!melee || !pistole) {
    return { ok: false, reason: 'Benötigt eine besessene Nahkampfwaffe (1H) als Primärhand und eine besessene Pistole als Sekundärhand' };
  }

  const eigKStaerke = Number(evalReferenz('eig_k_staerke', values));
  const kampfstil = getKampfstilModifier(character);
  const nkMod = pistoleNkMod(pistole.basis);
  const meleeNat = cappedNat(
    melee.hauptfertigkeit, melee.atBonus + (nkMod?.atBonus ?? 0), melee.paBonus + (nkMod?.paBonus ?? 0), values, kampfstil,
  );

  const { linkshaendig, beidhaendig } = pistolenschiessenTalente(character);
  const pistoleHalved = !(linkshaendig || beidhaendig);

  return {
    ok: true, comboType: 'nk1h_pistole',
    melee: {
      equipmentId: melee.equipmentId, label: melee.label, halved: false,
      nat: meleeNat.nat, npa: meleeNat.npa,
      schaden: computeSchaden(melee.basis, melee.staerkeMalus, eigKStaerke), wk: String(melee.wk),
    },
    pistole: {
      equipmentId: pistole.equipmentId, label: pistole.label, halved: pistoleHalved,
      ranges: computePistoleRanges(pistole, values, pistoleHalved),
    },
  };
}

// ---------------------------------------------------------------------------------------------
// schild_pistole - Schild + FK Pistole (NEU 2026-07-23): Schild ist immer primaer (analog zur
// NK-Waffe in nk1h_pistole), n-Mod beider Waffen addiert, Pistole halbiert (vorbehaltlich
// Linkshaendig/Beidhaendig Pistolenschiessen).
// ---------------------------------------------------------------------------------------------

export interface SchildPistoleResult {
  ok: true;
  comboType: 'schild_pistole';
  schild: MeleeSideResult;
  pistole: PistoleSideResult;
}

export function resolveSchildPistole(
  character: CharacterState, values: CharacterValueSource,
  primaryEquipmentId: string, secondaryEquipmentId: string,
): LoadoutResolutionError | SchildPistoleResult {
  const schild = listEligibleSchilde(character).find((i) => i.equipmentId === primaryEquipmentId);
  const pistole = listEligiblePistolen(character).find((i) => i.equipmentId === secondaryEquipmentId);
  if (!schild || !pistole) {
    return { ok: false, reason: 'Benötigt ein besessenes Schild als Primärhand und eine besessene Pistole als Sekundärhand' };
  }

  const eigKStaerke = Number(evalReferenz('eig_k_staerke', values));
  const kampfstil = getKampfstilModifier(character);
  const nkMod = pistoleNkMod(pistole.basis);
  const schildNat = cappedNat(
    schild.hauptfertigkeit, schild.atBonus + (nkMod?.atBonus ?? 0), schild.paBonus + (nkMod?.paBonus ?? 0), values, kampfstil,
  );

  const { linkshaendig, beidhaendig } = pistolenschiessenTalente(character);
  const pistoleHalved = !(linkshaendig || beidhaendig);

  return {
    ok: true, comboType: 'schild_pistole',
    schild: {
      equipmentId: schild.equipmentId, label: schild.label, halved: false,
      nat: schildNat.nat, npa: schildNat.npa,
      schaden: computeSchaden(schild.basis, schild.staerkeMalus, eigKStaerke), wk: String(schild.wk),
    },
    pistole: {
      equipmentId: pistole.equipmentId, label: pistole.label, halved: pistoleHalved,
      ranges: computePistoleRanges(pistole, values, pistoleHalved),
    },
  };
}

// ---------------------------------------------------------------------------------------------
// pistole_pistole - Pistole + Pistole (NEU 2026-07-23): beide Haende sind standardmaessig
// halbiert (weder Seite gilt als "volle" Primaerhand) - Linkshaendig Pistolenschiessen hebt nur
// die linke/Sekundaerhand auf, Beidhaendig Pistolenschiessen beide.
// ---------------------------------------------------------------------------------------------

export interface PistolePistoleSide {
  equipmentId: string;
  label: string;
  isPrimary: boolean;
  halved: boolean;
  ranges: string[];
}

export interface PistolePistoleResult {
  ok: true;
  comboType: 'pistole_pistole';
  primary: PistolePistoleSide;
  secondary: PistolePistoleSide;
}

export function resolvePistolePistole(
  character: CharacterState, values: CharacterValueSource,
  primaryEquipmentId: string, secondaryEquipmentId: string,
): LoadoutResolutionError | PistolePistoleResult {
  const items = listEligiblePistolen(character);
  const primary = items.find((i) => i.equipmentId === primaryEquipmentId);
  const secondary = items.find((i) => i.equipmentId === secondaryEquipmentId);
  if (!primary || !secondary) return { ok: false, reason: 'Benötigt zwei besessene Pistolen' };

  const { linkshaendig, beidhaendig } = pistolenschiessenTalente(character);
  const primaryHalved = !beidhaendig;
  const secondaryHalved = !(beidhaendig || linkshaendig);

  return {
    ok: true, comboType: 'pistole_pistole',
    primary: {
      equipmentId: primary.equipmentId, label: primary.label, isPrimary: true, halved: primaryHalved,
      ranges: computePistoleRanges(primary, values, primaryHalved),
    },
    secondary: {
      equipmentId: secondary.equipmentId, label: secondary.label, isPrimary: false, halved: secondaryHalved,
      ranges: computePistoleRanges(secondary, values, secondaryHalved),
    },
  };
}

// ---------------------------------------------------------------------------------------------
// nk1h_schild - NK 1H + Schild (REWORKED 2026-07-23: die No-Talent-Baseline ist jetzt wie
// nk1h_nk1h eine unabhaengige Zwei-Haende-Behandlung mit Spielerwahl der Primaerhand, statt der
// alten festen Amalgamierung - die Amalgamierung lebt jetzt AUSSCHLIESSLICH im talentActive-Zweig
// unten, unveraendert gegenueber der Vorversion. Das neue Talent "Schildkampf" hebt die
// Nebenhand-Halbierung auf, wenn das Schild in der Sekundaerhand landet).
// ---------------------------------------------------------------------------------------------

export interface SchildNoTalentResult {
  ok: true;
  comboType: 'nk1h_schild';
  talentActive: false;
  primary: DualWaffenSide;
  secondary: DualWaffenSide;
  higherPoolSide: PoolSideRef;
}

export interface SchildTalentResult {
  ok: true;
  comboType: 'nk1h_schild';
  talentActive: true;
  weaponEquipmentId: string;
  schildEquipmentId: string;
  nat: number;
  npa: number;
  atWk: string;
  paWk: string;
  minStaerke: number;
  schaden: string;
  higherPoolSide: PoolSideRef;
}

export type Nk1hSchildResult = LoadoutResolutionError | SchildNoTalentResult | SchildTalentResult;

export function resolveNk1hSchild(
  character: CharacterState, sheet: ComputedSheet, values: CharacterValueSource,
  primaryEquipmentId: string, secondaryEquipmentId: string,
): Nk1hSchildResult {
  const weapons = listEligibleNahkampf1HWaffen(character);
  const schilde = listEligibleSchilde(character);
  const primaryWeapon = weapons.find((i) => i.equipmentId === primaryEquipmentId);
  const primarySchild = schilde.find((i) => i.equipmentId === primaryEquipmentId);
  const secondaryWeapon = weapons.find((i) => i.equipmentId === secondaryEquipmentId);
  const secondarySchild = schilde.find((i) => i.equipmentId === secondaryEquipmentId);

  const weapon = primaryWeapon ?? secondaryWeapon;
  const schild = primarySchild ?? secondarySchild;
  if (!weapon || !schild) return { ok: false, reason: 'Waffe oder Schild sind nicht (mehr) besessen' };
  const weaponIsPrimary = primaryWeapon !== undefined;

  const eigKStaerke = Number(evalReferenz('eig_k_staerke', values));
  const kampfstil = getKampfstilModifier(character);
  const higherPoolSide = pickHigherPoolSide(
    sheet,
    { equipmentId: weapon.equipmentId, poolReferenz: weapon.poolReferenz },
    { equipmentId: schild.equipmentId, poolReferenz: schild.poolReferenz },
  );
  const atBonusSum = weapon.atBonus + schild.atBonus;
  const paBonusSum = weapon.paBonus + schild.paBonus;

  if (isZweiWaffenTalentEligiblePair(character, weapon.wk, schild.wk)) {
    // Schild-WK wird VOR den AT/PA-WK-Formeln halbiert (aufgerundet auf 0.5 - gleiche Konvention
    // wie die bestehende 2H-WK-Anzeige in views/kampf.ts) - das Talent-GATE oben prueft aber
    // bewusst die RAW (nicht halbierte) Schild-WK, siehe isZweiWaffenTalentEligiblePair-Aufruf.
    const halvedSchildWk = Math.ceil((schild.wk / 2) * 2) / 2;
    const schaden = computeSchaden(weapon.basis, weapon.staerkeMalus, eigKStaerke);
    const { nat, npa } = cappedNat(weapon.hauptfertigkeit, atBonusSum, paBonusSum, values, kampfstil);
    return {
      ok: true, comboType: 'nk1h_schild', talentActive: true,
      weaponEquipmentId: weapon.equipmentId, schildEquipmentId: schild.equipmentId, nat, npa,
      atWk: String(Math.max(weapon.wk, halvedSchildWk) * 1.5),
      paWk: String(weapon.wk + halvedSchildWk),
      minStaerke: weapon.minStaerke + schild.minStaerke,
      schaden, higherPoolSide,
    };
  }

  const schildkampfOwned = (character.selections['talente_schildkampf'] ?? 0) > 0;
  const primaryItem = weaponIsPrimary ? weapon : schild;
  const secondaryItem = weaponIsPrimary ? schild : weapon;
  // Die Halbierungs-Ausnahme durch "Schildkampf" greift nur, wenn das SCHILD tatsaechlich in der
  // Sekundaerhand ist - landet stattdessen die Waffe in der Sekundaerhand, gibt es dafuer kein
  // eigenes Talent (nicht dictiert), sie bleibt halbiert.
  const secondaryHalved = weaponIsPrimary ? !schildkampfOwned : true;

  const primaryNat = cappedNat(primaryItem.hauptfertigkeit, atBonusSum, paBonusSum, values, kampfstil);
  const secondaryNat = cappedNat(secondaryItem.hauptfertigkeit, atBonusSum, paBonusSum, values, kampfstil);
  return {
    ok: true, comboType: 'nk1h_schild', talentActive: false,
    primary: {
      equipmentId: primaryItem.equipmentId, label: primaryItem.label, isPrimary: true, halved: false,
      nat: primaryNat.nat, npa: primaryNat.npa,
      schaden: computeSchaden(primaryItem.basis, primaryItem.staerkeMalus, eigKStaerke), wk: String(primaryItem.wk),
    },
    secondary: {
      equipmentId: secondaryItem.equipmentId, label: secondaryItem.label, isPrimary: false, halved: secondaryHalved,
      nat: secondaryHalved ? floorSigned(secondaryNat.nat / 2) : secondaryNat.nat,
      npa: secondaryHalved ? floorSigned(secondaryNat.npa / 2) : secondaryNat.npa,
      schaden: computeSchaden(secondaryItem.basis, secondaryItem.staerkeMalus, eigKStaerke), wk: String(secondaryItem.wk),
    },
    higherPoolSide,
  };
}

// ---------------------------------------------------------------------------------------------
// Dispatch + Anzeigename
// ---------------------------------------------------------------------------------------------

export type LoadoutResult = Nk1hNk1hResult | LoadoutResolutionError | Nk1hPistoleResult | Nk1hSchildResult | SchildPistoleResult | PistolePistoleResult;

export function resolveLoadout(
  character: CharacterState, sheet: ComputedSheet, values: CharacterValueSource, entry: WaffenLoadoutEntry,
): LoadoutResult {
  switch (entry.comboType) {
    case 'nk1h_nk1h':
      return resolveNk1hNk1h(character, sheet, values, entry.primaryEquipmentId, entry.secondaryEquipmentId);
    case 'nk1h_pistole':
      return resolveNk1hPistole(character, values, entry.primaryEquipmentId, entry.secondaryEquipmentId);
    case 'nk1h_schild':
      return resolveNk1hSchild(character, sheet, values, entry.primaryEquipmentId, entry.secondaryEquipmentId);
    case 'schild_pistole':
      return resolveSchildPistole(character, values, entry.primaryEquipmentId, entry.secondaryEquipmentId);
    case 'pistole_pistole':
      return resolvePistolePistole(character, values, entry.primaryEquipmentId, entry.secondaryEquipmentId);
  }
}

/** Live abgeleiteter Anzeigename ("Bastardschwert+Krummsäbel") - NIE gespeichert (Ausruestung kann
 *  sich theoretisch aendern), "???" fuer eine Seite, deren EquipmentEntry nicht mehr existiert. */
export function describeLoadout(character: CharacterState, entry: WaffenLoadoutEntry): string {
  const labelFor = (equipmentId: string): string => {
    const e = character.equipment.find((eq) => eq.id === equipmentId);
    if (!e) return '???';
    if (e.family === 'feuerwaffe') {
      return FEUERWAFFEN.find((r) => String(r.sourceRow) === e.baseId)?.name ?? '???';
    }
    return findWeaponBasis(e.baseId)?.name ?? '???';
  };
  return `${labelFor(entry.primaryEquipmentId)}+${labelFor(entry.secondaryEquipmentId)}`;
}
