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

import {
  isWaffenLoadoutSingleType, type CharacterState, type PoolAllocation, type WaffenLoadoutEntry,
} from '../state/characterStore';
import type { ComputedSheet } from './characterSheet';
import { evalReferenz, type CharacterValueSource } from './rules';
import { computeWeaponAtPaOverflow, getKampfstilModifier, getZweiWaffenCap, resolveWaffenPoolReferenz } from './waffenPool';
import { computeGutMax, computeMeisterlichMax, GUT_BASIS, MEISTERLICH_BASIS } from './poolCaps';
import { combineDiceNotations, computeSchaden, averageSchadenValue, ceilAwayFromZero, formatSigned } from './waffenSchaden';
import { computeRangeCellValues, formatRangeCellValues, fkGuteDivisor, fkMeisterlichDivisor, type RangeCellValues } from './fernkampfRange';
import type { GenericRow as WeaponRow } from '../data/equipment/weapons';
import type { FernkampfRow } from '../data/equipment/fernkampf';
import {
  FIREARM_BY_SOURCE_ROW, MELEE_WEAPON_BY_SOURCE_ROW, WEAPON_SPECIALIZATION_BY_ID,
} from './weaponCatalog';

function findWeaponBasis(baseId: string): WeaponRow | undefined {
  return MELEE_WEAPON_BY_SOURCE_ROW.get(baseId);
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
    if (e.invalidReason || (e.specializationId && !WEAPON_SPECIALIZATION_BY_ID.has(e.specializationId))) continue;
    const basis = findWeaponBasis(e.baseId);
    if (!basis) continue;
    const hauptfertigkeit = basis['Hauptfertigkeit'] ?? '';
    if (hauptfertigkeit === 'Stangenwaffen') continue;
    const snap = e.computedStatsSnapshot ?? {};
    out.push({
      equipmentId: e.id,
      label: basis.name,
      hauptfertigkeit,
      poolReferenz: e.specializationId
        ? WEAPON_SPECIALIZATION_BY_ID.get(e.specializationId)!.poolReferenz
        : resolveWaffenPoolReferenz(hauptfertigkeit, basis['Spezialisierung'] ?? ''),
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
    if (e.invalidReason || (e.specializationId && !WEAPON_SPECIALIZATION_BY_ID.has(e.specializationId))) continue;
    const basis = findWeaponBasis(e.baseId);
    if (!basis) continue;
    const hauptfertigkeit = basis['Hauptfertigkeit'] ?? '';
    const snap = e.computedStatsSnapshot ?? {};
    out.push({
      equipmentId: e.id,
      label: basis.name,
      hauptfertigkeit,
      poolReferenz: e.specializationId
        ? WEAPON_SPECIALIZATION_BY_ID.get(e.specializationId)!.poolReferenz
        : resolveWaffenPoolReferenz(hauptfertigkeit, basis['Spezialisierung'] ?? ''),
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
    const basis = FIREARM_BY_SOURCE_ROW.get(e.baseId);
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
// Gemeinsame Bausteine
// ---------------------------------------------------------------------------------------------

export interface LoadoutResolutionError {
  ok: false;
  reason: string;
}

/** Einfache nAT/nPA-Projektion fuer Misch-Loadouts ohne zwei vollstaendige Nahkampf-Poolzeilen
 * (Nahkampfwaffe/Schild + Pistole). Zwei NK-Poolzeilen verwenden computeTwoHandPoolValues. */
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
  Gewehr: 'fk_basis_spez_feuerwaffen_musketen',
  Pistole: 'fk_basis_spez_feuerwaffen_pistolen',
};
const RANGE_KEYS = ['rw10m', 'rw30m', 'rw60m', 'rw100m', 'rw150m', 'rw210m'] as const;

function halveRangeCellValues(v: RangeCellValues | 'x'): RangeCellValues | 'x' {
  if (v === 'x') return 'x';
  const halved: RangeCellValues = { normal: ceilAwayFromZero(v.normal / 2) };
  if (v.gut !== undefined) halved.gut = ceilAwayFromZero(v.gut / 2);
  if (v.meisterlich !== undefined) halved.meisterlich = ceilAwayFromZero(v.meisterlich / 2);
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
    beidhaendig:
      (character.selections['talente_mit_zwei_pistolen_schiessen'] ?? 0) > 0
      || (character.selections['talente_beidhaendig_pistolenschiessen'] ?? 0) > 0,
  };
}

export interface LoadoutPoolValues {
  nat: number;
  gat: number;
  mat: number;
  npa: number;
  gpa: number;
  mpa: number;
}

type AtPaSide = 'at' | 'pa';

interface ProjectedTierValues {
  n: number;
  g: number;
  m: number;
  gCap: number;
  mCap: number;
}

interface ProjectedWeaponRow {
  at: ProjectedTierValues;
  pa: ProjectedTierValues;
}

const EMPTY_POOL_ALLOCATION: PoolAllocation = { nat: 0, gat: 0, mat: 0, npa: 0, gpa: 0, mpa: 0 };

function clonePoolAllocation(allocation: PoolAllocation | undefined): PoolAllocation {
  return { ...(allocation ?? EMPTY_POOL_ALLOCATION) };
}

function allocationSpent(allocation: PoolAllocation, side: AtPaSide): number {
  return side === 'at'
    ? allocation.nat + allocation.gat + allocation.mat
    : allocation.npa + allocation.gpa + allocation.mpa;
}

function projectedTierValues(
  overflow: ReturnType<typeof computeWeaponAtPaOverflow>, allocation: PoolAllocation,
  side: AtPaSide, foreignNMod: number,
): ProjectedTierValues {
  const rawN = side === 'at'
    ? overflow.uncAtWeapon + allocation.nat + foreignNMod
    : overflow.uncPaWeapon + allocation.npa + foreignNMod;
  // Ein positiver Zweithand-Mod endet bei 20 und erzeugt ausdruecklich keine neuen PP.
  const n = Math.min(20, rawN);
  const gCap = Math.max(GUT_BASIS, computeGutMax(n));
  const mCap = Math.max(MEISTERLICH_BASIS, computeMeisterlichMax(gCap));
  const gAllocated = side === 'at' ? allocation.gat : allocation.gpa;
  const mAllocated = side === 'at' ? allocation.mat : allocation.mpa;
  return {
    n,
    g: Math.min(gCap, GUT_BASIS + gAllocated),
    m: Math.min(mCap, MEISTERLICH_BASIS + mAllocated),
    gCap,
    mCap,
  };
}

function incrementFirstAvailableTier(
  overflow: ReturnType<typeof computeWeaponAtPaOverflow>, allocation: PoolAllocation,
  side: AtPaSide, foreignNMod: number,
): boolean {
  const values = projectedTierValues(overflow, allocation, side, foreignNMod);
  if (values.n < 20) {
    if (side === 'at') allocation.nat += 1;
    else allocation.npa += 1;
    return true;
  }
  const gField = side === 'at' ? 'gat' : 'gpa';
  if (GUT_BASIS + allocation[gField] < values.gCap) {
    allocation[gField] += 1;
    return true;
  }
  const mField = side === 'at' ? 'mat' : 'mpa';
  if (MEISTERLICH_BASIS + allocation[mField] < values.mCap) {
    allocation[mField] += 1;
    return true;
  }
  return false;
}

function projectWeaponRowWithRestPp(
  character: CharacterState, sheet: ComputedSheet, values: CharacterValueSource,
  item: LoadoutItemInfo, preferredSide: AtPaSide, foreignModSide: AtPaSide, foreignNMod: number,
): ProjectedWeaponRow {
  const allocationKey = item.poolReferenz ? `${item.poolReferenz}::${item.equipmentId}` : '';
  const allocation = clonePoolAllocation(allocationKey ? character.poolAllocations[allocationKey] : undefined);
  const kampfstil = getKampfstilModifier(character);
  const overflow = computeWeaponAtPaOverflow(item.hauptfertigkeit, item.atBonus, item.paBonus, values, kampfstil);
  const poolRule = item.poolReferenz
    ? sheet.byKategorie['Nahkampf']?.find((row) => row.rule.referenz === item.poolReferenz)
    : undefined;
  const allocated = allocationSpent(allocation, 'at') + allocationSpent(allocation, 'pa');
  // Nur der Ueberschuss der Ursprungswaffe gehoert zum Budget. Ein positiver Fremdmod im Loadout
  // darf kein zusaetzliches Budget erzeugen.
  let remaining = Math.max(0, Math.floor(
    Number(poolRule?.computedValue ?? 0) + overflow.atOverflow + overflow.paOverflow - allocated,
  ));
  const modFor = (side: AtPaSide): number => side === foreignModSide ? foreignNMod : 0;

  while (remaining > 0) {
    const atSpent = allocationSpent(allocation, 'at');
    const paSpent = allocationSpent(allocation, 'pa');
    const first: AtPaSide = atSpent < paSpent ? 'at' : paSpent < atSpent ? 'pa' : preferredSide;
    const second: AtPaSide = first === 'at' ? 'pa' : 'at';
    if (!incrementFirstAvailableTier(overflow, allocation, first, modFor(first))
      && !incrementFirstAvailableTier(overflow, allocation, second, modFor(second))) break;
    remaining -= 1;
  }

  return {
    at: projectedTierValues(overflow, allocation, 'at', modFor('at')),
    pa: projectedTierValues(overflow, allocation, 'pa', modFor('pa')),
  };
}

/**
 * Kombi-Regel: Die rechte Hand reicht ihre komplette AT-Seite weiter, die linke Hand ihre
 * komplette PA-Seite. Der jeweilige n-Mod der anderen Hand wird nur auf diese sichtbare Seite
 * angewendet. Freie PP werden weiterhin innerhalb jeder Ursprungszeile balanciert verteilt;
 * rechts gewinnt AT den Gleichstand, links PA. Ohne passendes Talent wird die linke PA-Seite
 * erst nach der Projektion halbiert.
 */
function computeTwoHandPoolValues(
  character: CharacterState, sheet: ComputedSheet, values: CharacterValueSource,
  right: LoadoutItemInfo, left: LoadoutItemInfo, leftHalved: boolean,
): { poolValues: LoadoutPoolValues; rightRow: ProjectedWeaponRow; leftRow: ProjectedWeaponRow } {
  const rightRow = projectWeaponRowWithRestPp(character, sheet, values, right, 'at', 'at', left.atBonus);
  const leftRow = projectWeaponRowWithRestPp(character, sheet, values, left, 'pa', 'pa', right.paBonus);
  const halfLeft = (value: number): number => leftHalved ? ceilAwayFromZero(value / 2) : value;
  return {
    poolValues: {
      nat: rightRow.at.n, gat: rightRow.at.g, mat: rightRow.at.m,
      npa: halfLeft(leftRow.pa.n), gpa: halfLeft(leftRow.pa.g), mpa: halfLeft(leftRow.pa.m),
    },
    rightRow,
    leftRow,
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
  nat: number;
  npa: number;
  poolValues: LoadoutPoolValues;
}

export interface DualWaffenTalentResult {
  ok: true;
  comboType: 'nk1h_nk1h';
  talentActive: true;
  primaryEquipmentId: string;
  secondaryEquipmentId: string;
  nat: number;
  npa: number;
  poolValues: LoadoutPoolValues;
  atWk: string;
  paWk: string;
  minStaerke: number;
  schaden: string;
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
  if (isZweiWaffenTalentEligiblePair(character, primary.wk, secondary.wk)) {
    const projected = computeTwoHandPoolValues(character, sheet, values, primary, secondary, false);
    const { nat, npa } = projected.poolValues;
    const primaryAvg = averageSchadenValue(primary.basis, primary.staerkeMalus, eigKStaerke);
    const secondaryAvg = averageSchadenValue(secondary.basis, secondary.staerkeMalus, eigKStaerke);
    const schaden = primaryAvg >= secondaryAvg
      ? computeSchaden(primary.basis, primary.staerkeMalus, eigKStaerke)
      : computeSchaden(secondary.basis, secondary.staerkeMalus, eigKStaerke);
    return {
      ok: true, comboType: 'nk1h_nk1h', talentActive: true,
      primaryEquipmentId, secondaryEquipmentId, nat, npa, poolValues: projected.poolValues,
      atWk: String(Math.max(primary.wk, secondary.wk) * 1.5),
      paWk: String(primary.wk + secondary.wk),
      minStaerke: primary.minStaerke + secondary.minStaerke,
      schaden,
    };
  }

  const projected = computeTwoHandPoolValues(character, sheet, values, primary, secondary, true);
  return {
    ok: true, comboType: 'nk1h_nk1h', talentActive: false,
    nat: projected.poolValues.nat, npa: projected.poolValues.npa, poolValues: projected.poolValues,
    primary: {
      equipmentId: primary.equipmentId, label: primary.label, isPrimary: true, halved: false,
      nat: projected.rightRow.at.n, npa: projected.rightRow.pa.n,
      schaden: computeSchaden(primary.basis, primary.staerkeMalus, eigKStaerke), wk: String(primary.wk),
    },
    secondary: {
      equipmentId: secondary.equipmentId, label: secondary.label, isPrimary: false, halved: true,
      nat: ceilAwayFromZero(projected.leftRow.at.n / 2), npa: projected.poolValues.npa,
      schaden: computeSchaden(secondary.basis, secondary.staerkeMalus, eigKStaerke), wk: String(secondary.wk),
    },
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
  schaden: string;
  ranges: string[];
}

function computeFeuerwaffenSchaden(pistole: LoadoutPistoleInfo): string {
  const fixschaden = pistole.snap.fixschaden ?? 0;
  return `${combineDiceNotations(pistole.basis['1.W'], pistole.basis['2.W'])}${fixschaden ? ` ${formatSigned(fixschaden)}` : ''}`;
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
      schaden: computeFeuerwaffenSchaden(pistole),
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
      schaden: computeFeuerwaffenSchaden(pistole),
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
  schaden: string;
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
      schaden: computeFeuerwaffenSchaden(primary),
      ranges: computePistoleRanges(primary, values, primaryHalved),
    },
    secondary: {
      equipmentId: secondary.equipmentId, label: secondary.label, isPrimary: false, halved: secondaryHalved,
      schaden: computeFeuerwaffenSchaden(secondary),
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
  nat: number;
  npa: number;
  poolValues: LoadoutPoolValues;
}

export interface SchildTalentResult {
  ok: true;
  comboType: 'nk1h_schild';
  talentActive: true;
  weaponEquipmentId: string;
  schildEquipmentId: string;
  nat: number;
  npa: number;
  poolValues: LoadoutPoolValues;
  atWk: string;
  paWk: string;
  minStaerke: number;
  schaden: string;
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
  const primaryItem = weaponIsPrimary ? weapon : schild;
  const secondaryItem = weaponIsPrimary ? schild : weapon;

  const eigKStaerke = Number(evalReferenz('eig_k_staerke', values));
  if (isZweiWaffenTalentEligiblePair(character, weapon.wk, schild.wk)) {
    // Schild-WK wird VOR den AT/PA-WK-Formeln halbiert (aufgerundet auf 0.5 - gleiche Konvention
    // wie die bestehende 2H-WK-Anzeige in views/kampf.ts) - das Talent-GATE oben prueft aber
    // bewusst die RAW (nicht halbierte) Schild-WK, siehe isZweiWaffenTalentEligiblePair-Aufruf.
    const halvedSchildWk = Math.ceil((schild.wk / 2) * 2) / 2;
    const schaden = computeSchaden(weapon.basis, weapon.staerkeMalus, eigKStaerke);
    const projected = computeTwoHandPoolValues(character, sheet, values, primaryItem, secondaryItem, false);
    const { nat, npa } = projected.poolValues;
    return {
      ok: true, comboType: 'nk1h_schild', talentActive: true,
      weaponEquipmentId: weapon.equipmentId, schildEquipmentId: schild.equipmentId,
      nat, npa, poolValues: projected.poolValues,
      atWk: String(Math.max(weapon.wk, halvedSchildWk) * 1.5),
      paWk: String(weapon.wk + halvedSchildWk),
      minStaerke: weapon.minStaerke + schild.minStaerke,
      schaden,
    };
  }

  const schildkampfOwned = (character.selections['talente_schildkampf'] ?? 0) > 0;
  // Die Halbierungs-Ausnahme durch "Schildkampf" greift nur, wenn das SCHILD tatsaechlich in der
  // Sekundaerhand ist - landet stattdessen die Waffe in der Sekundaerhand, gibt es dafuer kein
  // eigenes Talent (nicht dictiert), sie bleibt halbiert.
  const secondaryHalved = weaponIsPrimary ? !schildkampfOwned : true;

  const projected = computeTwoHandPoolValues(character, sheet, values, primaryItem, secondaryItem, secondaryHalved);
  return {
    ok: true, comboType: 'nk1h_schild', talentActive: false,
    nat: projected.poolValues.nat, npa: projected.poolValues.npa, poolValues: projected.poolValues,
    primary: {
      equipmentId: primaryItem.equipmentId, label: primaryItem.label, isPrimary: true, halved: false,
      nat: projected.rightRow.at.n, npa: projected.rightRow.pa.n,
      schaden: computeSchaden(primaryItem.basis, primaryItem.staerkeMalus, eigKStaerke), wk: String(primaryItem.wk),
    },
    secondary: {
      equipmentId: secondaryItem.equipmentId, label: secondaryItem.label, isPrimary: false, halved: secondaryHalved,
      nat: secondaryHalved ? ceilAwayFromZero(projected.leftRow.at.n / 2) : projected.leftRow.at.n,
      npa: projected.poolValues.npa,
      schaden: computeSchaden(secondaryItem.basis, secondaryItem.staerkeMalus, eigKStaerke), wk: String(secondaryItem.wk),
    },
  };
}

// ---------------------------------------------------------------------------------------------
// Dispatch + Anzeigename
// ---------------------------------------------------------------------------------------------

export type LoadoutResult = Nk1hNk1hResult | LoadoutResolutionError | Nk1hPistoleResult | Nk1hSchildResult | SchildPistoleResult | PistolePistoleResult;

export function resolveLoadout(
  character: CharacterState, sheet: ComputedSheet, values: CharacterValueSource, entry: WaffenLoadoutEntry,
): LoadoutResult {
  if (isWaffenLoadoutSingleType(entry.comboType)) {
    return { ok: false, reason: 'Einzelwaffen-Loadouts werden aus der jeweiligen Kampfzeile dargestellt' };
  }
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
      return FIREARM_BY_SOURCE_ROW.get(e.baseId)?.name ?? e.displayNameSnapshot ?? '???';
    }
    if (e.family === 'fernkampfwaffe') return e.rangedSnapshot?.name ?? e.displayNameSnapshot ?? '???';
    return findWeaponBasis(e.baseId)?.name ?? '???';
  };
  if (isWaffenLoadoutSingleType(entry.comboType)) return labelFor(entry.primaryEquipmentId);
  return `${labelFor(entry.primaryEquipmentId)}+${labelFor(entry.secondaryEquipmentId)}`;
}
