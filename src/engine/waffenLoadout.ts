// Waffen-Loadout-Feature (Kampf-Tab, 2026-07-22): reine abgeleitete Sicht ueber bereits besessene
// Ausruestung (kein neues Kauf-/Ausrüst-System) fuer die drei dictierten Zwei-Item-Kombinationen -
// NK 1H + NK 1H (dual wield), NK 1H + FK Pistole, NK 1H + Schild - jeweils mit/ohne das Talent
// "Kampf mit zwei Waffen Stufe 1-4" (amalgamiert beide Seiten zu EINER Kampf-Entitaet) bzw.
// "Linkshaendig Pistolenschiessen" (hebt die Nebenhand-Halbierung fuer eine linkshaendige Pistole
// auf). Regelwerk siehe Projekt-Memory project_waffen_loadout.md, mit dem Nutzer 2026-07-22
// verifiziert (siehe Plan "vectorized-herding-pike"). Alle Funktionen hier sind reine Funktionen
// ueber CharacterState/ComputedSheet - keine Mutation, kein Seiteneffekt.

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
 *  ALLE drei Loadout-Combo-Typen ausgeschlossen (nicht nur fuer das Zwei-Waffen-Talent-Gate) - ein
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
 *  fuer dieses Combo (NK 1H + FK Pistole) nicht vorgesehen (die Regel spricht explizit von
 *  "Pistole", nicht "Feuerwaffe" allgemein). */
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
// nk1h_pistole hat keine solche Pool-Struktur (siehe engine.md-Kommentar in views/kampf.ts).
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
// nk1h_pistole - NK 1H + FK Pistole
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
  primaryIsMelee: boolean;
  linkshaendigPistolenschiessenActive: boolean;
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

export function resolveNk1hPistole(
  character: CharacterState, values: CharacterValueSource,
  primaryEquipmentId: string, secondaryEquipmentId: string,
): LoadoutResolutionError | Nk1hPistoleResult {
  const meleeItems = listEligibleNahkampf1HWaffen(character);
  const pistoleItems = listEligiblePistolen(character);

  const primaryMelee = meleeItems.find((i) => i.equipmentId === primaryEquipmentId);
  const primaryPistole = pistoleItems.find((i) => i.equipmentId === primaryEquipmentId);
  const secondaryMelee = meleeItems.find((i) => i.equipmentId === secondaryEquipmentId);
  const secondaryPistole = pistoleItems.find((i) => i.equipmentId === secondaryEquipmentId);

  const melee = primaryMelee ?? secondaryMelee;
  const pistole = primaryPistole ?? secondaryPistole;
  if (!melee || !pistole) {
    return { ok: false, reason: 'Benötigt genau eine Nahkampfwaffe (1H) und eine Pistole' };
  }
  const primaryIsMelee = primaryMelee !== undefined;
  const pistoleIsOffhand = primaryPistole === undefined;

  const eigKStaerke = Number(evalReferenz('eig_k_staerke', values));
  const kampfstil = getKampfstilModifier(character);
  const meleeNat = cappedNat(melee.hauptfertigkeit, melee.atBonus, melee.paBonus, values, kampfstil);

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

  const linkshaendigOwned = (character.selections['talente_linkshaendig_pistolenschiessen'] ?? 0) > 0;
  const linkshaendigActive = pistoleIsOffhand && linkshaendigOwned;
  const pistoleHalved = pistoleIsOffhand && !linkshaendigActive;
  const meleeHalved = !primaryIsMelee;

  return {
    ok: true, comboType: 'nk1h_pistole',
    melee: {
      equipmentId: melee.equipmentId, label: melee.label, halved: meleeHalved,
      nat: meleeHalved ? floorSigned(meleeNat.nat / 2) : meleeNat.nat,
      npa: meleeHalved ? floorSigned(meleeNat.npa / 2) : meleeNat.npa,
      schaden: computeSchaden(melee.basis, melee.staerkeMalus, eigKStaerke), wk: String(melee.wk),
    },
    pistole: {
      equipmentId: pistole.equipmentId, label: pistole.label, halved: pistoleHalved,
      ranges: (pistoleHalved ? rangesRaw.map(halveRangeCellValues) : rangesRaw).map(formatRangeCellValues),
    },
    primaryIsMelee,
    linkshaendigPistolenschiessenActive: linkshaendigActive,
  };
}

// ---------------------------------------------------------------------------------------------
// nk1h_schild - NK 1H + Schild (immer EIN amalgamierter Combo, primary ist per Konvention die Waffe)
// ---------------------------------------------------------------------------------------------

export interface Nk1hSchildResult {
  ok: true;
  comboType: 'nk1h_schild';
  talentActive: boolean;
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

export function resolveNk1hSchild(
  character: CharacterState, sheet: ComputedSheet, values: CharacterValueSource,
  weaponEquipmentId: string, schildEquipmentId: string,
): LoadoutResolutionError | Nk1hSchildResult {
  const weapon = listEligibleNahkampf1HWaffen(character).find((i) => i.equipmentId === weaponEquipmentId);
  const schild = listEligibleSchilde(character).find((i) => i.equipmentId === schildEquipmentId);
  if (!weapon || !schild) return { ok: false, reason: 'Waffe oder Schild sind nicht (mehr) besessen' };

  const eigKStaerke = Number(evalReferenz('eig_k_staerke', values));
  const kampfstil = getKampfstilModifier(character);
  const higherPoolSide = pickHigherPoolSide(
    sheet,
    { equipmentId: weapon.equipmentId, poolReferenz: weapon.poolReferenz },
    { equipmentId: schild.equipmentId, poolReferenz: schild.poolReferenz },
  );
  const schaden = computeSchaden(weapon.basis, weapon.staerkeMalus, eigKStaerke);
  const atBonusSum = weapon.atBonus + schild.atBonus;
  const paBonusSum = weapon.paBonus + schild.paBonus;

  if (isZweiWaffenTalentEligiblePair(character, weapon.wk, schild.wk)) {
    // Schild-WK wird VOR den AT/PA-WK-Formeln halbiert (aufgerundet auf 0.5 - gleiche Konvention
    // wie die bestehende 2H-WK-Anzeige in views/kampf.ts) - das Talent-GATE oben prueft aber
    // bewusst die RAW (nicht halbierte) Schild-WK, siehe isZweiWaffenTalentEligiblePair-Aufruf.
    const halvedSchildWk = Math.ceil((schild.wk / 2) * 2) / 2;
    const { nat, npa } = cappedNat(weapon.hauptfertigkeit, atBonusSum, paBonusSum, values, kampfstil);
    return {
      ok: true, comboType: 'nk1h_schild', talentActive: true,
      weaponEquipmentId, schildEquipmentId, nat, npa,
      atWk: String(Math.max(weapon.wk, halvedSchildWk) * 1.5),
      paWk: String(weapon.wk + halvedSchildWk),
      minStaerke: weapon.minStaerke + schild.minStaerke,
      schaden, higherPoolSide,
    };
  }

  const { nat, npa } = cappedNat(weapon.hauptfertigkeit, atBonusSum, paBonusSum, values, kampfstil);
  return {
    ok: true, comboType: 'nk1h_schild', talentActive: false,
    weaponEquipmentId, schildEquipmentId, nat, npa,
    atWk: String(weapon.wk), paWk: String(schild.wk),
    minStaerke: weapon.minStaerke, schaden, higherPoolSide,
  };
}

// ---------------------------------------------------------------------------------------------
// Dispatch + Anzeigename
// ---------------------------------------------------------------------------------------------

export type LoadoutResult = Nk1hNk1hResult | LoadoutResolutionError | Nk1hPistoleResult | Nk1hSchildResult;

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
