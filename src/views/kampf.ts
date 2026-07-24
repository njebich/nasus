// Kampf-Tab (Nutzer-Mockup "S04 Kampfseite mockup.docx", 2026-07-19/20): Waffentabellen aus
// Ausrüstung mit per-Waffe NK-Pool-Verteilung. Vier Bloecke: NAHKAMPF (interaktiv, gAT/mAT/gPA/
// mPA/nAT/nPA-Pool-Zuteilung), FEUERWAFFEN + ARMBRÜSTE/Bögen (reine Anzeige, keine Pools in
// Fernkampf), Ausweichen/Bewegung (reine Formel-Anzeige). Row-Builder-Funktionen sind exportiert,
// damit charakterbogen.ts dieselben Daten fuer eine read-only Spiegelung wiederverwenden kann.

import type { ComputedSheet } from '../engine/characterSheet';
import { makeValueSource } from '../engine/characterSheet';
import { evalReferenz, type CharacterValueSource } from '../engine/rules';
import type { CharacterState, PoolAllocation, WaffenLoadoutEntry, WaffenLoadoutComboType } from '../state/characterStore';
import { NK_WAFFEN_BASIS, type GenericRow as WeaponRow } from '../data/equipment/weapons';
import { FEUERWAFFEN, type FernkampfRow } from '../data/equipment/fernkampf';
import { feuerwaffenMunitionOptionen, FEUERWAFFEN_MUNITION_PREISE } from '../data/equipment/feuerwaffenMunition';
import {
  resolveWaffenPoolReferenz, computeWeaponAtPaOverflow, resolveWaffenRowBasis, getKampfstilModifier, getZweiWaffenCap,
} from '../engine/waffenPool';
import { GUT_BASIS, MEISTERLICH_BASIS, gutBudget, meisterlichBudget, isPoolBalanceValid } from '../engine/poolCaps';
import { getOwnedKampfmodulTalentInfo } from '../engine/talenteKampfmodulInfo';
import { computeSchaden, formatSigned } from '../engine/waffenSchaden';
import { computeRangeCellValues, formatRangeCellValues, fkGuteDivisor, fkMeisterlichDivisor } from '../engine/fernkampfRange';
import { withScrollAnchor } from './scrollAnchor';
import {
  gesBonWert, ladezeitKr, feuerwaffenLadeschuetzeReferenz, computeArmbrustLadezeitLabel,
} from '../engine/fernkampfLadezeit';
import {
  listEligibleNahkampf1HWaffen, listEligibleSchilde, listEligiblePistolen, resolveLoadout, describeLoadout,
  type LoadoutResult, type PoolSideRef,
} from '../engine/waffenLoadout';
import { xKlingeTooltip, xKlingeWeaponName, xKlingeWirkungForEntry } from '../engine/xKlinge';
import { tooltipAttr } from './tooltip';
import type { RangedWeaponInventorySnapshot } from '../engine/rangedInventorySnapshot';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function num(row: Record<string, string> | undefined, header: string): number {
  const raw = row?.[header];
  if (raw === undefined) return 0;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function hasColumn(row: Record<string, string> | undefined, header: string): boolean {
  return row?.[header] !== undefined;
}

// ---------------------------------------------------------------------------------------------
// NAHKAMPF
// ---------------------------------------------------------------------------------------------

export interface PoolFieldState {
  value: number;
  allocated: number;
  max?: number;
}

export interface NahkampfRow {
  /** Key fuer poolAllocations (`${poolReferenz}::${key}`) - echte EquipmentEntry.id bei
   *  besessenen Waffen, sonst 'unbewaffnet' bzw. 'unbewaffnet:<spezReferenz>'. */
  key: string;
  label: string;
  /** Nutzer 2026-07-24: "Waffe, on Hover, show Spezialisierung" - z.B. "Klingenwaffen" fuer ein
   *  Langschwert. Leer bei Unbewaffnet-Basiszeilen ohne eigene Spezialisierungs-Spalte. */
  spezialisierung: string;
  grip: '1H' | '2H' | '–';
  /** Mindest-Staerke fuer GENAU den hier gezeigten Griff (1H/2H) - Nutzer 2026-07-24: "1H/2H, show
   *  Stä. Requirement regardless if met or not", also unabhaengig von `usable`. */
  minStaerke: number;
  usable: boolean;
  unusableReason?: string;
  schaden: string;
  wk: string;
  rb: number;
  /** Nur die zweite, aktive Zeile einer amalgamierten X-Klinge-Waffe. */
  activeEnchant?: boolean;
  wirkungTooltip?: string;
  poolReferenz: string | null;
  nat: PoolFieldState;
  gat: PoolFieldState;
  mat: PoolFieldState;
  npa: PoolFieldState;
  gpa: PoolFieldState;
  mpa: PoolFieldState;
  /** Poolpunkte (PP) - verbleibendes Budget des geteilten Waffen-Pools (Spez-Punkte + AT/PA-
   *  Ueberschuss ueber 20 minus bereits verteilter Punkte), siehe poolFieldsForRow. */
  pp: number;
  /** AT/PA-Balance-Regel (Nutzer-Diktat 2026-07-23, siehe isPoolBalanceValid): Summe der auf
   *  nAT+gAT+mAT bzw. nPA+gPA+mPA tatsaechlich verteilten Pool-Punkte dieser Zeile, plus ob die
   *  Balance-Regel eingehalten ist. Wird NICHT enforced (kein Throw in setWaffenPoolAllocation) -
   *  nur als Warn-Icon angezeigt (poolCell/renderNahkampfRow) und zum Ausschluss ungueltiger
   *  Zeilen aus dem Charakterbogen-Export (charakterbogen.ts) genutzt. */
  atSpent: number;
  paSpent: number;
  poolValid: boolean;
  kb: number;
  ks: number;
  ini: number;
  /** talente_kampf_mit_zwei_waffen_stufe_1-4 (Nutzer 2026-07-21): Eignungs-Flag pro 1H-Waffe -
   *  WK (unmodifizierter Listenwert) <= Kappungswert der hoechsten besessenen Stufe. `undefined`
   *  = nicht anwendbar (kein Talent besessen, Stangenwaffe, 2H-Griff oder Unbewaffnet-Zeile). Die
   *  eigentliche Kombi-Mechanik (n-Mod/Mindeststaerke-Summe, 1,5x-WK-Attacke, WK-Summe-Parade fuer
   *  ein konkretes Waffenpaar) ist eine Kampfrunden-Entscheidung (welche zwei Waffen genau) und
   *  bleibt bewusst dem geplanten Loadout-System vorbehalten (siehe Entwickeln-Log). */
  zweiWaffenFaehig?: boolean;
}

function findWeaponBasis(baseId: string): WeaponRow | undefined {
  return NK_WAFFEN_BASIS.find((r) => String(r.sourceRow) === baseId);
}

interface PoolContext {
  sheet: ComputedSheet;
  character: CharacterState;
  values: CharacterValueSource;
}

function poolFieldsForRow(
  ctx: PoolContext, poolReferenz: string, key: string, hauptfertigkeit: string, atBonus: number, paBonus: number,
): Pick<NahkampfRow, 'nat' | 'gat' | 'mat' | 'npa' | 'gpa' | 'mpa' | 'pp' | 'atSpent' | 'paSpent' | 'poolValid'> {
  const poolRule = ctx.sheet.byKategorie['Nahkampf']?.find((r) => r.rule.referenz === poolReferenz);
  const allocation = ctx.character.poolAllocations[`${poolReferenz}::${key}`]
    ?? { gat: 0, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 };
  const overflow = computeWeaponAtPaOverflow(hauptfertigkeit, atBonus, paBonus, ctx.values, getKampfstilModifier(ctx.character));
  const caps = poolRule?.poolCaps;
  const rowAllocatedTotal = allocation.gat + allocation.gpa + allocation.mat + allocation.mpa + allocation.nat + allocation.npa;
  // Poolpunkte (PP) sind PRO WAFFE: jede besessene Waffe hat ihr EIGENES unabhaengiges Budget
  // (dieser Waffe eigener AT/PA-Ueberschuss ueber 20 plus die Spez-Punkte des Pools, minus NUR
  // das, was auf DIESE Zeile entfallen ist) - kein gemeinsames Budget mit Geschwister-Waffen
  // desselben Pools mehr (Nutzer-Entscheidung 2026-07-23, revidiert die 2026-07-20-Annahme eines
  // pool-weit geteilten Budgets - siehe setWaffenPoolAllocation).
  const pp = overflow.atOverflow + overflow.paOverflow + Number(poolRule?.computedValue ?? 0) - rowAllocatedTotal;
  // nAT/nPA sind ab 20 hart gedeckelt (jede at_X/pa_X-Formel ist selbst MIN(20;...), siehe
  // waffenPool.ts's stripMin20) - der Ueberschuss darueber fliesst als Pool-Budget ab (oben), darf
  // aber nicht als Anzeigewert >20 stehen bleiben (Bug, User-Repro 2026-07-23).
  const nat: PoolFieldState = { value: Math.min(20, overflow.uncAtWeapon + allocation.nat), allocated: allocation.nat, max: overflow.natMax };
  const gat: PoolFieldState = { value: GUT_BASIS + allocation.gat, allocated: allocation.gat, max: caps ? gutBudget(caps.gatMax) : undefined };
  const mat: PoolFieldState = { value: MEISTERLICH_BASIS + allocation.mat, allocated: allocation.mat, max: caps ? meisterlichBudget(caps.matMax) : undefined };
  const npa: PoolFieldState = { value: Math.min(20, overflow.uncPaWeapon + allocation.npa), allocated: allocation.npa, max: overflow.npaMax };
  const gpa: PoolFieldState = { value: GUT_BASIS + allocation.gpa, allocated: allocation.gpa, max: caps ? gutBudget(caps.gpaMax) : undefined };
  const mpa: PoolFieldState = { value: MEISTERLICH_BASIS + allocation.mpa, allocated: allocation.mpa, max: caps ? meisterlichBudget(caps.mpaMax) : undefined };

  // AT/PA-Balance-Regel (Nutzer-Diktat 2026-07-23, siehe isPoolBalanceValid in poolCaps.ts).
  const atSpent = allocation.nat + allocation.gat + allocation.mat;
  const paSpent = allocation.npa + allocation.gpa + allocation.mpa;
  const atMaxed = nat.value === 20 && !!caps && gat.value === caps.gatMax && mat.value === caps.matMax;
  const paMaxed = npa.value === 20 && !!caps && gpa.value === caps.gpaMax && mpa.value === caps.mpaMax;
  const poolValid = isPoolBalanceValid(atSpent, paSpent, atMaxed, paMaxed);

  return { nat, gat, mat, npa, gpa, mpa, pp, atSpent, paSpent, poolValid };
}

function buildOwnedWeaponRows(ctx: PoolContext, e: CharacterState['equipment'][number], zweiWaffenCap: number | undefined): NahkampfRow[] {
  const basis = findWeaponBasis(e.baseId);
  if (!basis) return [];
  const snap = e.computedStatsSnapshot ?? {};
  const eigKStaerke = Number(evalReferenz('eig_k_staerke', ctx.values));
  const hauptfertigkeit = basis['Hauptfertigkeit'] ?? '';
  const spezialisierung = basis['Spezialisierung'] ?? '';
  let poolReferenz: string | null = null;
  try {
    poolReferenz = resolveWaffenPoolReferenz(hauptfertigkeit, spezialisierung);
  } catch {
    poolReferenz = null;
  }

  const zweihaenderMoeglich = hasColumn(basis, 'Min-Staerke-1H-Basis') && hasColumn(basis, 'Min-Staerke-2H-Basis');
  const grips: Array<'1H' | '2H'> = zweihaenderMoeglich ? ['1H', '2H'] : ['1H'];

  const wirkung = xKlingeWirkungForEntry(e);
  const weaponName = xKlingeWeaponName(e) ?? basis.name;

  return grips.flatMap((grip): NahkampfRow[] => {
    // Schilde (family='shield') speichern ihre Mindeststaerke unter 'minStaerke' statt
    // 'minStaerke1H' (siehe buyShield) - Schilde haben ohnehin nur den 1H-Griff (grips oben).
    const minStaerke = grip === '1H' ? (snap.minStaerke1H ?? snap.minStaerke ?? 0) : (snap.minStaerke2H ?? 0);
    const usable = eigKStaerke >= minStaerke;
    const wk = grip === '1H' ? (snap.wk ?? 0) : Math.ceil((snap.wk ?? 0) * 1.5 * 2) / 2;
    const zweiWaffenFaehig = zweiWaffenCap !== undefined && grip === '1H' && hauptfertigkeit !== 'Stangenwaffen' && usable
      ? wk <= zweiWaffenCap
      : undefined;
    const poolFields = usable && poolReferenz
      ? poolFieldsForRow(ctx, poolReferenz, e.id, hauptfertigkeit, snap.at ?? 0, snap.pa ?? 0)
      : {
        nat: { value: 0, allocated: 0 }, gat: { value: 0, allocated: 0 }, mat: { value: 0, allocated: 0 },
        npa: { value: 0, allocated: 0 }, gpa: { value: 0, allocated: 0 }, mpa: { value: 0, allocated: 0 },
        pp: 0, atSpent: 0, paSpent: 0, poolValid: true,
      };
    const standardRow: NahkampfRow = {
      key: e.id,
      label: weaponName,
      spezialisierung,
      grip,
      minStaerke,
      usable,
      unusableReason: usable ? undefined : 'nicht tragbar (Stärke zu niedrig)',
      schaden: usable ? computeSchaden(basis, snap.staerkeMalus ?? 0, eigKStaerke) : '–',
      wk: usable ? String(wk) : '–',
      rb: snap.rb ?? 0,
      poolReferenz: usable ? poolReferenz : null,
      ...poolFields,
      kb: snap.klingenbrecher ?? 0,
      ks: snap.klingenschutz ?? 0,
      ini: Math.round(Number(evalReferenz('ini', ctx.values))) + num(basis, 'Ini'),
      zweiWaffenFaehig,
    };
    if (!wirkung) return [standardRow];
    return [
      standardRow,
      {
        ...standardRow,
        label: `${weaponName} (aktiv)`,
        activeEnchant: true,
        wirkungTooltip: xKlingeTooltip(wirkung),
        schaden: usable
          ? computeSchaden(basis, snap.staerkeMalus ?? 0, eigKStaerke, wirkung)
          : '–',
        rb: (snap.rb ?? 0) + (wirkung.rb ?? 0),
      },
    ];
  });
}

const UNBEWAFFNET_SPEZ_REFERENZEN: readonly string[] = [
  'nk_spez_unbewaffnet_armklingen', 'nk_spez_unbewaffnet_messer', 'nk_spez_unbewaffnet_peitschen',
  'nk_spez_unbewaffnet_unbewaffnet', 'nk_spez_unbewaffnet_schild', 'nk_spez_unbewaffnet_boxen',
  'nk_spez_unbewaffnet_elfische_kunst_der_selbstverteidigung', 'nk_spez_unbewaffnet_goblinische_kampfkunst',
  'nk_spez_unbewaffnet_katzenmenschen_kampfkunst', 'nk_spez_unbewaffnet_orkisch_raufen',
  'nk_spez_unbewaffnet_ringen', 'nk_spez_unbewaffnet_schattenkampf',
];

function buildUnbewaffnetRow(ctx: PoolContext, key: string, label: string, basis: WeaponRow | undefined): NahkampfRow | null {
  if (!basis) return null;
  const hauptfertigkeit = 'Unbewaffnet';
  let poolReferenz: string | null = null;
  try {
    poolReferenz = resolveWaffenPoolReferenz(hauptfertigkeit, basis['Spezialisierung'] ?? '');
  } catch {
    poolReferenz = null;
  }
  const atBonus = num(basis, 'AT-Basis');
  const paBonus = num(basis, 'PA-Basis');
  const eigKStaerke = Number(evalReferenz('eig_k_staerke', ctx.values));
  const poolFields = poolReferenz
    ? poolFieldsForRow(ctx, poolReferenz, key, hauptfertigkeit, atBonus, paBonus)
    : {
      nat: { value: 0, allocated: 0 }, gat: { value: 0, allocated: 0 }, mat: { value: 0, allocated: 0 },
      npa: { value: 0, allocated: 0 }, gpa: { value: 0, allocated: 0 }, mpa: { value: 0, allocated: 0 },
      pp: 0, atSpent: 0, paSpent: 0, poolValid: true,
    };
  return {
    key,
    label,
    spezialisierung: basis['Spezialisierung'] ?? '',
    grip: '–',
    minStaerke: 0,
    usable: true,
    schaden: computeSchaden(basis, num(basis, 'Staerke-Malus-Basis'), eigKStaerke),
    wk: basis['WK-Basis'] ? String(num(basis, 'WK-Basis')) : '–',
    rb: num(basis, 'RB'),
    poolReferenz,
    ...poolFields,
    kb: num(basis, 'Klingenbrecher-Basis'),
    ks: num(basis, 'Klingenschutz-Basis'),
    ini: Math.round(Number(evalReferenz('ini', ctx.values))) + num(basis, 'Ini'),
  };
}

// Schluessel sind character.spezies-Werte (VOELKER_NAMEN), Werte die singularen Namen aus
// NK-Waffen-Basis's "Volk"-Spalte - siehe gleichnamige Konstante + Kommentar in
// engine/waffenPool.ts (dort seit 2026-07-22 auf die Volk-Spalte umgestellt, weil die
// Basiszeilen den Volk-Namen nicht mehr redundant im "Waffe"-Namen tragen).
const UNBEWAFFNET_SPEZIES_VOLK: Record<string, string> = {
  Gnome: 'Gnom', Orks: 'Ork', Trolle: 'Troll', Zentauren: 'Zentaur', Katzen: 'Katzenmensch',
};

export function buildNahkampfRows(character: CharacterState, sheet: ComputedSheet): NahkampfRow[] {
  const ctx: PoolContext = { sheet, character, values: makeValueSource(character) };
  const rows: NahkampfRow[] = [];

  const unbewaffnetVolk = UNBEWAFFNET_SPEZIES_VOLK[character.spezies] ?? 'andere Voelker';
  const unbewaffnetBasis = NK_WAFFEN_BASIS.find(
    (r) => r['Hauptfertigkeit'] === 'Unbewaffnet' && r.name === 'Unbewaffnet' && r['Volk'] === unbewaffnetVolk,
  );
  const unbewaffnetRow = buildUnbewaffnetRow(ctx, 'unbewaffnet', 'Unbewaffnet', unbewaffnetBasis);
  if (unbewaffnetRow) rows.push(unbewaffnetRow);

  const zweiWaffenCap = getZweiWaffenCap(character);
  for (const e of character.equipment) {
    if (e.family !== 'weapon' && e.family !== 'shield') continue;
    rows.push(...buildOwnedWeaponRows(ctx, e, zweiWaffenCap));
  }

  for (const spezReferenz of UNBEWAFFNET_SPEZ_REFERENZEN) {
    const currentValue = character.values[spezReferenz] ?? 0;
    if (currentValue <= 0) continue;
    const rule = sheet.byKategorie['Nahkampf']?.find((r) => r.rule.referenz === spezReferenz);
    const label = rule?.rule.beschreibung?.replace(/^->\s*/, '') ?? spezReferenz;
    const basis = resolveWaffenRowBasis(character, `unbewaffnet:${spezReferenz}`);
    if (!basis) continue; // vier bewusst ausgesparte Spezialisierungen ohne eindeutige Basiszeile, siehe waffenPool.ts
    const row = NK_WAFFEN_BASIS.find(
      (r) => r['Hauptfertigkeit'] === basis.hauptfertigkeit && r['Spezialisierung'] === basis.spezialisierung,
    );
    const built = buildUnbewaffnetRow(ctx, `unbewaffnet:${spezReferenz}`, label, row);
    if (built) rows.push(built);
  }

  return rows;
}

// ---------------------------------------------------------------------------------------------
// Kombinierte n/g/m-Reichweitenzelle (Feuerwaffen + Armbrüste/Bögen) - fkGuteDivisor/
// fkMeisterlichDivisor/computeRangeCellValues/formatRangeCellValues leben in
// engine/fernkampfRange.ts (siehe Import oben), damit engine/waffenLoadout.ts sie mitnutzen kann.
// ---------------------------------------------------------------------------------------------

function formatRangeCell(
  rangeModRaw: string | number, basisValue: number, gutDivisor: number | null, meisterlichDivisor: number | null,
): string {
  return formatRangeCellValues(computeRangeCellValues(rangeModRaw, basisValue, gutDivisor, meisterlichDivisor));
}

const RANGE_HEADERS = ['10m', '30m', '60m', '100m', '150m', '210m'] as const;

// ---------------------------------------------------------------------------------------------
// FK-Waffen als Nahkampfwaffen (Nutzer 2026-07-23): jede Feuerwaffe/jeder Bogen/jede Armbrust
// traegt in ihrer eigenen Basiszeile einen fixen NK-Statblock (Hauptfertigkeit/Spezialisierung/
// WK-Basis/Schadenswuerfel/Staerke-Teiler/-Malus-Basis/AT-Basis/PA-Basis/Min-Staerke-1H/2H-Basis/
// Klingenbrecher/-schutz-Basis), identisch pro Waffenklassifikation (Pistole -> Hiebwaffen/
// Improvisierte Hiebwaffen, alles andere -> Stangenwaffen/Improvisierte Stangenwaffen). Die
// Spezialisierung selbst ist bewusst NICHT skillbar/sichtbar (kein eigener Talente-Tab-Eintrag,
// keine Pool-Investition/-Zellen hier) - nur das Ergebnis zaehlt, auf Basis der Werte, die der
// Charakter fuer die zugrundeliegende Hauptfertigkeit (Stangenwaffen/Hiebwaffen) bereits
// tatsaechlich investiert hat, analog zu computeWeaponAtPaOverflow ohne Ueberlauf-Pool.
// ---------------------------------------------------------------------------------------------

function numOrUndefined(row: FernkampfRow | undefined, header: string): number | undefined {
  const raw = row?.[header];
  if (raw === undefined) return undefined;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
}

export interface FkNkWerte {
  usable: boolean;
  unusableReason?: string;
  schaden: string;
  wk: string;
  nat: number | null;
  npa: number | null;
  kb: number;
  ks: number;
}

function computeFkNkWerte(
  basis: FernkampfRow | undefined, character: CharacterState, values: CharacterValueSource,
): FkNkWerte | null {
  if (!basis || !hasColumn(basis, 'Hauptfertigkeit')) return null;
  const hauptfertigkeit = basis['Hauptfertigkeit'];
  const eigKStaerke = Number(evalReferenz('eig_k_staerke', values));
  const minStaerke = numOrUndefined(basis, 'Min-Staerke-1H-Basis') ?? numOrUndefined(basis, 'Min-Staerke-2H-Basis') ?? 0;
  const usable = eigKStaerke >= minStaerke;
  const overflow = computeWeaponAtPaOverflow(
    hauptfertigkeit, num(basis, 'AT-Basis'), num(basis, 'PA-Basis'), values, getKampfstilModifier(character),
  );
  return {
    usable,
    unusableReason: usable ? undefined : 'nicht tragbar (Stärke zu niedrig)',
    schaden: usable ? computeSchaden(basis, num(basis, 'Staerke-Malus-Basis'), eigKStaerke) : '–',
    wk: usable ? String(num(basis, 'WK-Basis')) : '–',
    nat: usable ? Math.min(20, overflow.uncAtWeapon) : null,
    npa: usable ? Math.min(20, overflow.uncPaWeapon) : null,
    kb: num(basis, 'Klingenbrecher-Basis'),
    ks: num(basis, 'Klingenschutz-Basis'),
  };
}

function computeResolvedRangedNkWerte(
  basis: RangedWeaponInventorySnapshot, character: CharacterState, values: CharacterValueSource,
): FkNkWerte | null {
  if (!basis.hauptfertigkeit) return null;
  const eigKStaerke = Number(evalReferenz('eig_k_staerke', values));
  const minStaerke = basis.minStaerke1H ?? basis.minStaerke2H ?? 0;
  const usable = eigKStaerke >= minStaerke;
  const overflow = computeWeaponAtPaOverflow(
    basis.hauptfertigkeit, basis.atBasis, basis.paBasis, values, getKampfstilModifier(character),
  );
  const schadenBasis = {
    'Schadenswuerfel-1': basis.schadenswuerfel1,
    'Schadenswuerfel-2': basis.schadenswuerfel2,
    'Staerke-Teiler': String(basis.staerkeTeiler),
  };
  return {
    usable,
    unusableReason: usable ? undefined : 'nicht tragbar (Stärke zu niedrig)',
    schaden: usable ? computeSchaden(schadenBasis, basis.staerkeMalusBasis, eigKStaerke) : '–',
    wk: usable ? String(basis.wkBasis) : '–',
    nat: usable ? Math.min(20, overflow.uncAtWeapon) : null,
    npa: usable ? Math.min(20, overflow.uncPaWeapon) : null,
    kb: basis.klingenbrecherBasis,
    ks: basis.klingenschutzBasis,
  };
}

// ---------------------------------------------------------------------------------------------
// FEUERWAFFEN
// ---------------------------------------------------------------------------------------------

export interface FeuerwaffenRow {
  key: string;
  label: string;
  schaden: string;
  rb: number;
  munition: string;
  ranges: string[];
  rw: number;
  ladedauer: string;
  ini: number;
  nk: FkNkWerte | null;
}

const FEUERWAFFEN_TYP_BASIS_REF: Record<string, string> = {
  Gewehr: 'fk_basis_spez_schusswaffen_musketen',
  Pistole: 'fk_basis_spez_schusswaffen_pistolen',
};

export function buildFeuerwaffenRows(character: CharacterState): FeuerwaffenRow[] {
  const values = makeValueSource(character);
  const gutDivisor = fkGuteDivisor(values);
  const meisterlichDivisor = fkMeisterlichDivisor(values);
  const gesBon = gesBonWert(values);
  const rows: FeuerwaffenRow[] = [];

  for (const e of character.equipment) {
    if (e.family !== 'feuerwaffe') continue;
    const basis = FEUERWAFFEN.find((r) => String(r.sourceRow) === e.baseId);
    if (!basis) continue;
    const snap = e.computedStatsSnapshot ?? {};
    const typ = basis['Typ'] ?? '';
    const basisRef = FEUERWAFFEN_TYP_BASIS_REF[typ];
    let basisWert = 0;
    if (basisRef) {
      try {
        basisWert = Number(evalReferenz(basisRef, values));
      } catch {
        // Referenz nicht auswertbar (z.B. fehlende Grundvoraussetzung) - Zellen bleiben "x".
      }
    }
    const rwMod: number[] = [snap.rw10m ?? 0, snap.rw30m ?? 0, snap.rw60m ?? 0, snap.rw100m ?? 0, snap.rw150m ?? 0, snap.rw210m ?? 0];
    const ranges = basisRef
      ? rwMod.map((mod) => formatRangeCell(mod, basisWert, gutDivisor, meisterlichDivisor))
      : RANGE_HEADERS.map(() => 'x');

    const munitionOptionen = feuerwaffenMunitionOptionen(basis['Lademechanik'] ?? '', basis['Munition'] ?? '', snap.kaliber ?? 0);
    const munitionArten = new Set<string>(munitionOptionen.map((m) => m.art));
    const ammo = character.equipment.find(
      (a) => a.family === 'ammo' && a.baseTable === 'feuerwaffen-munition'
        && munitionArten.has(a.baseId) && a.selections.kaliber === String(snap.kaliber ?? 0),
    );
    const ammoRow = ammo ? FEUERWAFFEN_MUNITION_PREISE.find((m) => m.art === ammo.baseId && m.kaliber === snap.kaliber) : undefined;
    const munition = ammoRow ? `${ammoRow.label} (${ammo!.quantity} Stück)` : '–';

    const ladeschuetzeReferenz = feuerwaffenLadeschuetzeReferenz(basis['Lademechanik'] ?? '');
    const ladeschuetzeWert = character.values[ladeschuetzeReferenz] ?? 0;
    const ladedauer = `${ladezeitKr(snap.nachladezeit ?? 0, snap.nachladenTawTeiler ?? 0, gesBon, ladeschuetzeWert)} KR`;

    rows.push({
      key: e.id,
      label: basis.name,
      schaden: `${basis['1.W'] ?? '–'}${snap.fixschaden ? ` ${formatSigned(snap.fixschaden)}` : ''}`,
      rb: snap.rb ?? 0,
      munition,
      ranges,
      rw: snap.rw ?? 0,
      ladedauer,
      ini: Math.round(Number(evalReferenz('ini', values))) + (snap.ini ?? 0),
      nk: computeFkNkWerte(basis, character, values),
    });
  }
  return rows;
}

// ---------------------------------------------------------------------------------------------
// ARMBRÜSTE / Bögen
// ---------------------------------------------------------------------------------------------

export interface ArmbrustBogenRow {
  key: string;
  label: string;
  schaden: string;
  rb: number;
  munition: string;
  ranges: string[];
  rw: string;
  ladedauer: string;
  ini: number;
  nk: FkNkWerte | null;
}

const ARMBRUST_BOEGEN_BASIS_REF: Record<'boegen' | 'armbrust', string> = {
  boegen: 'fk_basis_spez_boegen_boegen',
  armbrust: 'fk_basis_spez_schusswaffen_armbrust',
};

const ARMBRUST_BOEGEN_LADESCHUETZE_REF: Record<'boegen' | 'armbrust', string> = {
  boegen: 'sf_ladeschuetze_bogen',
  armbrust: 'sf_ladeschuetze_armbrust',
};

export function buildArmbrustBoegenRows(character: CharacterState, typ: 'boegen' | 'armbrust'): ArmbrustBogenRow[] {
  const values = makeValueSource(character);
  const gutDivisor = fkGuteDivisor(values);
  const meisterlichDivisor = fkMeisterlichDivisor(values);
  const basisRef = ARMBRUST_BOEGEN_BASIS_REF[typ];
  let basisWert = 0;
  try {
    basisWert = Number(evalReferenz(basisRef, values));
  } catch {
    // nicht auswertbar - Zellen bleiben "x".
  }
  const gesBon = gesBonWert(values);
  const eigKStaerke = Number(evalReferenz('eig_k_staerke', values));
  const ladeschuetzeWert = character.values[ARMBRUST_BOEGEN_LADESCHUETZE_REF[typ]] ?? 0;
  const ammoFamily = typ === 'boegen' ? 'pfeile' : 'bolzen';
  const rows: ArmbrustBogenRow[] = [];

  for (const e of character.equipment) {
    if (e.family !== 'fernkampfwaffe' || e.baseTable !== typ) continue;
    const basis = e.rangedSnapshot;
    if (!basis || basis.kind !== 'ranged-weapon' || basis.table !== typ) continue;
    const ranges = basis.rangeMods.map((rangeMod) => formatRangeCell(rangeMod, basisWert, gutDivisor, meisterlichDivisor));
    const weaponRb = basis.rb;
    const weaponFix = basis.fixschaden;
    const ladedauer = typ === 'boegen'
      ? `${ladezeitKr(basis.nachladezeit, basis.nachladenTawTeiler, gesBon, ladeschuetzeWert)} KR`
      : computeArmbrustLadezeitLabel(basis.armbrustLadedaten, eigKStaerke, gesBon, ladeschuetzeWert);
    const nk = computeResolvedRangedNkWerte(basis, character, values);
    const ownedAmmo = character.equipment.filter(
      (a) => a.family === 'ammo' && a.baseTable === ammoFamily
        && a.rangedSnapshot?.kind === 'ranged-ammo' && a.rangedSnapshot.table === ammoFamily,
    );
    const ammoRows = ownedAmmo.length > 0 ? ownedAmmo : [undefined];
    for (const ammo of ammoRows) {
      const ammoSnapshot = ammo?.rangedSnapshot?.kind === 'ranged-ammo' ? ammo.rangedSnapshot : undefined;
      const ammoFix = ammoSnapshot?.fixschaden ?? 0;
      const ammoRb = ammoSnapshot?.rb ?? 0;
      const totalFix = weaponFix + ammoFix;
      rows.push({
        key: `${e.id}:${ammo?.id ?? 'keine'}`,
        label: basis.name,
        schaden: `${basis.fernkampfWuerfel}${totalFix !== 0 ? ` ${formatSigned(totalFix)}` : ''}`,
        rb: weaponRb + ammoRb,
        munition: ammoSnapshot ? `${ammoSnapshot.name} (${ammo!.quantity} Stück)` : '–',
        ranges,
        rw: basis.rw,
        ladedauer,
        ini: Math.round(Number(evalReferenz('ini', values))) + basis.ini,
        nk,
      });
    }
  }
  return rows;
}

// ---------------------------------------------------------------------------------------------
// Ausweichen / Bewegung (immer sichtbar, reine Formel-Anzeige)
// ---------------------------------------------------------------------------------------------

export interface AusweichenRow {
  offAw: number;
  defAw: number;
  gutAw: number;
  meisterlichAw: number;
  ini: number;
  ausdauer: number;
  dauerlauf: number;
  sprinten: number;
  hochsprung: number;
  weitsprung: string;
}

export function buildAusweichenRow(character: CharacterState): AusweichenRow {
  const values = makeValueSource(character);
  const v = (referenz: string) => Math.round(Number(evalReferenz(referenz, values)));
  return {
    offAw: v('aw_off_normal'),
    defAw: v('aw_def_normal'),
    gutAw: v('aw_gut'),
    meisterlichAw: v('aw_meisterlich'),
    ini: v('ini'),
    ausdauer: v('f_ausdauer'),
    dauerlauf: v('bewegung_f_dauerlauf'),
    sprinten: v('bewegung_f_sprinten'),
    hochsprung: v('bewegung_f_hochsprung'),
    weitsprung: `${v('bewegung_f_weitsprung_aus_dem_stand')}/${v('bewegung_f_weitsprung_kurzer_anlauf')}/${v('bewegung_f_weitsprung_optimaler_anlauf')}`,
  };
}

// ---------------------------------------------------------------------------------------------
// Waffen-Loadout (2026-07-22): abgeleitete Zwei-Item-Kombinationen aus bereits besessener
// Ausruestung - siehe engine/waffenLoadout.ts fuer die Regelwerks-Mathematik. Reine Anzeige (keine
// +/- Pool-Buttons): gAT/gPA/mAT/mPA/PP werden - wo ueberhaupt vorhanden (nicht bei nk1h_pistole,
// das hat keine Pool-Struktur) - 1:1 von der "hoeheren Pool"-Seite gespiegelt (higherPoolSide),
// indem hier exakt derselbe poolFieldsForRow-Aufruf wie fuer die Solo-Zeile dieser Waffe oben in
// der Nahkampf-Tabelle gemacht wird - Spenden von Pool-Punkten passiert weiterhin ausschliesslich
// dort, nicht in diesem Block.
// ---------------------------------------------------------------------------------------------

export interface LoadoutDisplayRow {
  entry: WaffenLoadoutEntry;
  displayName: string;
  result: LoadoutResult;
  pool?: { gat: number; gpa: number; mat: number; mpa: number; pp: number };
}

function findLoadoutItemInfo(character: CharacterState, equipmentId: string): { hauptfertigkeit: string; atBonus: number; paBonus: number } | undefined {
  return [...listEligibleNahkampf1HWaffen(character), ...listEligibleSchilde(character)].find((i) => i.equipmentId === equipmentId);
}

function poolMirrorFields(ctx: PoolContext, higherPoolSide: PoolSideRef): LoadoutDisplayRow['pool'] {
  if (!higherPoolSide.poolReferenz) return undefined;
  const info = findLoadoutItemInfo(ctx.character, higherPoolSide.equipmentId);
  if (!info) return undefined;
  const fields = poolFieldsForRow(ctx, higherPoolSide.poolReferenz, higherPoolSide.equipmentId, info.hauptfertigkeit, info.atBonus, info.paBonus);
  return { gat: fields.gat.value, gpa: fields.gpa.value, mat: fields.mat.value, mpa: fields.mpa.value, pp: fields.pp };
}

export function buildLoadoutDisplayRows(character: CharacterState, sheet: ComputedSheet): LoadoutDisplayRow[] {
  const ctx: PoolContext = { sheet, character, values: makeValueSource(character) };
  return character.waffenLoadouts.map((entry) => {
    const result = resolveLoadout(character, sheet, ctx.values, entry);
    const pool = result.ok && (result.comboType === 'nk1h_nk1h' || result.comboType === 'nk1h_schild')
      ? poolMirrorFields(ctx, result.higherPoolSide)
      : undefined;
    return { entry, displayName: describeLoadout(character, entry), result, pool };
  });
}

export interface LoadoutCells {
  typ: string;
  schaden: string;
  wk: string;
  nat: string;
  npa: string;
  fkReichweiten: string;
}

export function formatLoadoutCells(result: LoadoutResult): LoadoutCells | { error: string } {
  if (!result.ok) return { error: result.reason };
  switch (result.comboType) {
    case 'nk1h_nk1h':
      if (result.talentActive) {
        return {
          typ: 'NK 1H+1H (Talent)', schaden: result.schaden, wk: `AT ${result.atWk} / PA ${result.paWk}`,
          nat: String(result.nat), npa: String(result.npa), fkReichweiten: '–',
        };
      }
      return {
        typ: 'NK 1H+1H',
        schaden: `${result.primary.schaden} / ${result.secondary.schaden}`,
        wk: `${result.primary.wk} / ${result.secondary.wk}`,
        nat: `${result.primary.nat} / ${result.secondary.nat}`,
        npa: `${result.primary.npa} / ${result.secondary.npa}`,
        fkReichweiten: '–',
      };
    case 'nk1h_pistole':
      return {
        typ: 'NK 1H+Pistole', schaden: result.melee.schaden, wk: result.melee.wk,
        nat: String(result.melee.nat), npa: String(result.melee.npa),
        fkReichweiten: result.pistole.ranges.join(' / '),
      };
    case 'nk1h_schild':
      if (result.talentActive) {
        return {
          typ: 'NK 1H+Schild (Talent)', schaden: result.schaden, wk: `AT ${result.atWk} / PA ${result.paWk}`,
          nat: String(result.nat), npa: String(result.npa), fkReichweiten: '–',
        };
      }
      return {
        typ: 'NK 1H+Schild',
        schaden: `${result.primary.schaden} / ${result.secondary.schaden}`,
        wk: `${result.primary.wk} / ${result.secondary.wk}`,
        nat: `${result.primary.nat} / ${result.secondary.nat}`,
        npa: `${result.primary.npa} / ${result.secondary.npa}`,
        fkReichweiten: '–',
      };
    case 'schild_pistole':
      return {
        typ: 'Schild+Pistole', schaden: result.schild.schaden, wk: result.schild.wk,
        nat: String(result.schild.nat), npa: String(result.schild.npa),
        fkReichweiten: result.pistole.ranges.join(' / '),
      };
    case 'pistole_pistole':
      return {
        typ: 'Pistole+Pistole', schaden: '–', wk: '–', nat: '–', npa: '–',
        fkReichweiten: `${result.primary.ranges.join(' / ')} — ${result.secondary.ranges.join(' / ')}`,
      };
  }
}

export type OnAddWaffenLoadout = (comboType: WaffenLoadoutComboType, primaryEquipmentId: string, secondaryEquipmentId: string) => void;
export type OnRemoveWaffenLoadout = (loadoutId: string) => void;
export type OnToggleWaffenLoadoutFavorite = (loadoutId: string) => void;

function loadoutOptionList(items: ReadonlyArray<{ equipmentId: string; label: string }>): string {
  return items.map((i) => `<option value="${escapeHtml(i.equipmentId)}">${escapeHtml(i.label)}</option>`).join('');
}

function renderLoadoutCombo(comboType: WaffenLoadoutComboType, hidden: boolean, primaryOptions: string, secondaryOptions: string, primaryLabel: string, secondaryLabel: string): string {
  return `
    <div class="loadout-combo-fieldset" data-combo-type="${comboType}" ${hidden ? 'hidden' : ''}>
      <label>${primaryLabel}
        <select data-role="primary"><option value="">–</option>${primaryOptions}</select>
      </label>
      <label>${secondaryLabel}
        <select data-role="secondary"><option value="">–</option>${secondaryOptions}</select>
      </label>
    </div>`;
}

const LOADOUT_COMBO_LABELS: Record<WaffenLoadoutComboType, string> = {
  nk1h_nk1h: 'NK 1H + NK 1H', nk1h_pistole: 'NK 1H + Pistole', nk1h_schild: 'NK 1H + Schild',
  schild_pistole: 'Schild + Pistole', pistole_pistole: 'Pistole + Pistole',
};

function renderLoadoutCreationForm(character: CharacterState): string {
  const nk1h = listEligibleNahkampf1HWaffen(character);
  const schilde = listEligibleSchilde(character);
  const pistolen = listEligiblePistolen(character);
  const nk1hOptions = loadoutOptionList(nk1h);
  const schildOptions = loadoutOptionList(schilde);
  const pistoleOptions = loadoutOptionList(pistolen);

  const available: WaffenLoadoutComboType[] = [];
  if (nk1h.length >= 2) available.push('nk1h_nk1h');
  if (nk1h.length >= 1 && pistolen.length >= 1) available.push('nk1h_pistole');
  if (nk1h.length >= 1 && schilde.length >= 1) available.push('nk1h_schild');
  if (schilde.length >= 1 && pistolen.length >= 1) available.push('schild_pistole');
  if (pistolen.length >= 2) available.push('pistole_pistole');

  if (available.length === 0) {
    return `<p class="kampf-talente-hinweis">Für ein Waffen-Loadout werden mindestens zwei besessene
      1H-Nahkampfwaffen/Pistolen, oder eine Kombination aus 1H-Nahkampfwaffe/Schild/Pistole
      benötigt.</p>`;
  }

  const radios = available.map((comboType, i) => `
      <label><input type="radio" name="loadout-combo-type" value="${comboType}" ${i === 0 ? 'checked' : ''}> ${LOADOUT_COMBO_LABELS[comboType]}</label>`).join('');

  const fieldsets = available.map((comboType, i) => {
    const hidden = i !== 0;
    switch (comboType) {
      case 'nk1h_nk1h':
        return renderLoadoutCombo(comboType, hidden, nk1hOptions, nk1hOptions, 'Primärhand (rechte Hand)', 'Sekundärhand');
      case 'nk1h_pistole':
        return renderLoadoutCombo(comboType, hidden, nk1hOptions, pistoleOptions, 'Nahkampfwaffe (Primärhand)', 'Pistole (Sekundärhand)');
      case 'nk1h_schild': {
        const combinedOptions = loadoutOptionList([...nk1h, ...schilde]);
        return renderLoadoutCombo(comboType, hidden, combinedOptions, combinedOptions, 'Primärhand (rechte Hand)', 'Sekundärhand');
      }
      case 'schild_pistole':
        return renderLoadoutCombo(comboType, hidden, schildOptions, pistoleOptions, 'Schild (Primärhand)', 'Pistole (Sekundärhand)');
      case 'pistole_pistole':
        return renderLoadoutCombo(comboType, hidden, pistoleOptions, pistoleOptions, 'Primärhand (rechte Hand)', 'Sekundärhand');
    }
  }).join('');

  return `
    <div class="loadout-creation-form">
      ${available.length > 1 ? `<div class="loadout-combo-radios">${radios}</div>` : ''}
      ${fieldsets}
      <button type="button" class="loadout-add-btn">Hinzufügen</button>
    </div>`;
}

function renderLoadoutRow(row: LoadoutDisplayRow): string {
  const cells = formatLoadoutCells(row.result);
  const favoriteIcon = row.entry.favorite ? '★' : '☆';
  const favoriteBtn = `<button type="button" class="loadout-favorite-toggle" data-loadout-id="${escapeHtml(row.entry.id)}" aria-label="Favorit umschalten">${favoriteIcon}</button>`;
  const removeBtn = `<button type="button" class="loadout-remove" data-loadout-id="${escapeHtml(row.entry.id)}">Entfernen</button>`;
  if ('error' in cells) {
    return `
      <tr class="kampf-row-unusable" title="${escapeHtml(cells.error)}">
        <td>${escapeHtml(row.displayName)}</td>
        <td colspan="10">${escapeHtml(cells.error)}</td>
        <td>${favoriteBtn}</td>
        <td>${removeBtn}</td>
      </tr>`;
  }
  const pool = row.pool;
  return `
    <tr>
      <td>${escapeHtml(row.displayName)}</td>
      <td>${escapeHtml(cells.typ)}</td>
      <td>${escapeHtml(cells.schaden)}</td>
      <td>${escapeHtml(cells.wk)}</td>
      <td>${escapeHtml(cells.nat)}</td>
      <td>${pool ? pool.gat : '–'}</td>
      <td>${pool ? pool.mat : '–'}</td>
      <td>${escapeHtml(cells.npa)}</td>
      <td>${pool ? pool.gpa : '–'}</td>
      <td>${pool ? pool.mpa : '–'}</td>
      <td>${escapeHtml(cells.fkReichweiten)}</td>
      <td>${favoriteBtn}</td>
      <td>${removeBtn}</td>
    </tr>`;
}

function renderWaffenLoadoutBlock(character: CharacterState, sheet: ComputedSheet): string {
  const rows = buildLoadoutDisplayRows(character, sheet);
  return `
    <h3 class="bogen-section-heading">Waffen-Loadout</h3>
    ${renderLoadoutCreationForm(character)}
    ${rows.length > 0 ? `
    <div class="kampf-table-scroll">
      <table class="bogen-table kampf-loadout-table">
        <thead><tr>
          <th>Loadout</th><th>Typ</th><th>Schaden</th><th>WK</th>
          <th>nAT</th><th>gAT</th><th>mAT</th><th>nPA</th><th>gPA</th><th>mPA</th>
          <th>FK-Reichweiten</th><th>Favorit</th><th></th>
        </tr></thead>
        <tbody>${rows.map(renderLoadoutRow).join('')}</tbody>
      </table>
    </div>` : ''}`;
}

// ---------------------------------------------------------------------------------------------
// Rendering (interaktiv)
// ---------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------
// Talent-Effekte (Kampfmodul) - reine Info-Zeilen, keine Zahl wird hier berechnet
// ---------------------------------------------------------------------------------------------

/** 60 Talente aus data/talenteKampfmodul.ts sind reine Kampfrunden-/Proben-Mechaniken (Manoever,
 *  Haltungswechsel, Situationsmodifikatoren) ohne editierbaren Zielwert - siehe extract_talente_
 *  kampfmodul.py fuer die Gruppenentscheidung. Diese Liste ist bewusst nur eine Anzeige (Name +
 *  Original-Wirkungstext), damit ein kuenftiges Kampfmodul bzw. der Meister am Tisch sieht, welche
 *  vom Charakter gekauften Talente eine Kampfregel veraendern - nichts davon wird hier oder sonst
 *  irgendwo im Chargen-Tool ausgewertet. */
function renderTalenteKampfmodulBlock(character: CharacterState): string {
  const rows = getOwnedKampfmodulTalentInfo(character);
  if (rows.length === 0) return '';
  return `
    <h3 class="bogen-section-heading">Talent-Effekte (Kampfmodul)</h3>
    <p class="kampf-talente-hinweis">Diese Talente veraendern eine Kampfregel (Manoever, Haltung,
      Proben-Sonderfall) statt eines Charakterbogenwerts - Umsetzung folgt im Kampfmodul.
      Hier nur als Erinnerung, welche der Charakter besitzt.</p>
    <div class="kampf-table-scroll">
      <table class="bogen-table kampf-talente-table">
        <thead><tr><th>Talent</th><th>Wirkung</th></tr></thead>
        <tbody>${rows.map((r) => `
          <tr>
            <td>${escapeHtml(r.name)}</td>
            <td>${escapeHtml(r.wirkung)}</td>
          </tr>`).join('')}</tbody>
      </table>
    </div>`;
}

export type OnWaffenPoolChange = (poolReferenz: string, equipmentId: string, allocation: PoolAllocation) => void;

const POOL_FIELDS = ['nat', 'gat', 'mat', 'npa', 'gpa', 'mpa'] as const;
type PoolField = typeof POOL_FIELDS[number];

function allocationForRow(row: NahkampfRow): PoolAllocation {
  return {
    gat: row.gat.allocated, gpa: row.gpa.allocated, mat: row.mat.allocated, mpa: row.mpa.allocated,
    nat: row.nat.allocated, npa: row.npa.allocated,
  };
}

function allocationsEqual(left: PoolAllocation, right: PoolAllocation): boolean {
  return POOL_FIELDS.every((field) => left[field] === right[field]);
}

/** Projects an uncommitted allocation onto a persisted row without mutating CharacterState. */
export function previewWaffenPoolAllocation(row: NahkampfRow, allocation: PoolAllocation): NahkampfRow {
  const oldAllocation = allocationForRow(row);
  const oldTotal = POOL_FIELDS.reduce((sum, field) => sum + oldAllocation[field], 0);
  const newTotal = POOL_FIELDS.reduce((sum, field) => sum + allocation[field], 0);
  const nextState = (field: PoolField): PoolFieldState => {
    const previous = row[field];
    const baseValue = previous.value - previous.allocated;
    return {
      ...previous,
      allocated: allocation[field],
      value: Math.min(
        baseValue + allocation[field],
        field === 'nat' || field === 'npa' ? 20 : Number.POSITIVE_INFINITY,
      ),
    };
  };
  const nat = nextState('nat');
  const gat = nextState('gat');
  const mat = nextState('mat');
  const npa = nextState('npa');
  const gpa = nextState('gpa');
  const mpa = nextState('mpa');
  const atSpent = allocation.nat + allocation.gat + allocation.mat;
  const paSpent = allocation.npa + allocation.gpa + allocation.mpa;
  const sideMaxed = (...states: PoolFieldState[]) => states.every(
    (state) => state.max !== undefined && state.allocated >= state.max,
  );
  return {
    ...row,
    nat, gat, mat, npa, gpa, mpa,
    pp: row.pp + oldTotal - newTotal,
    atSpent,
    paSpent,
    poolValid: isPoolBalanceValid(atSpent, paSpent, sideMaxed(nat, gat, mat), sideMaxed(npa, gpa, mpa)),
  };
}

function poolCell(field: PoolField, row: NahkampfRow): string {
  const state = row[field];
  if (!row.usable || !row.poolReferenz) return `<td class="kampf-pool-cell">–</td>`;
  const incrementDisabled = row.pp <= 0 || (state.max !== undefined && state.allocated >= state.max);
  return `
    <td class="kampf-pool-cell" data-key="${escapeHtml(row.key)}" data-pool-referenz="${escapeHtml(row.poolReferenz)}" data-field="${field}">
      <div class="kampf-pool-cell-inner">
        <button type="button" class="stat-dec" aria-label="${field} verringern" ${state.allocated <= 0 ? 'disabled' : ''}>-</button>
        <span class="kampf-pool-value">${state.value}</span>
        <button type="button" class="stat-inc" aria-label="${field} erhöhen" ${incrementDisabled ? 'disabled' : ''}>+</button>
      </div>
    </td>`;
}

function ppCell(row: NahkampfRow): string {
  if (row.poolValid) return `<td>${row.pp}</td>`;
  const tooltip = `Summe auf AT verteilt: ${row.atSpent}\nSumme auf PA verteilt: ${row.paSpent}`;
  return `<td class="kampf-pp-invalid">${row.pp} <span class="kampf-pp-warn" title="${escapeHtml(tooltip)}">⚠</span></td>`;
}

function renderNahkampfRow(row: NahkampfRow, showZweiWaffen: boolean, rowIndex: number, dirty = false): string {
  const unusable = !row.usable;
  const zweiWaffenCell = row.zweiWaffenFaehig === undefined ? '–' : row.zweiWaffenFaehig ? '✓' : '✗';
  const spezTitle = row.spezialisierung ? ` title="Spezialisierung: ${escapeHtml(row.spezialisierung)}"` : '';
  const allocationActions = !row.poolReferenz
    ? '<td>–</td>'
    : dirty
      ? `<td class="kampf-allocation-actions">
          <button type="button" class="kampf-allocation-apply">Übernehmen</button>
          <button type="button" class="kampf-allocation-discard">Verwerfen</button>
        </td>`
      : '<td class="kampf-allocation-actions"><span class="kampf-allocation-saved">Gespeichert</span></td>';
  return `
    <tr data-kampf-row-index="${rowIndex}" class="${unusable ? 'kampf-row-unusable ' : ''}${row.activeEnchant ? 'kampf-row-xklinge-active ' : ''}${dirty ? 'kampf-row-allocation-dirty' : ''}"${tooltipAttr(row.wirkungTooltip)}${!row.wirkungTooltip && unusable ? ` title="${escapeHtml(row.unusableReason ?? '')}"` : ''}>
      <td${spezTitle}>${escapeHtml(row.label)}</td>
      <td>${escapeHtml(row.schaden)}</td>
      <td title="Mindest-Stärke: ${row.minStaerke}">${row.grip}</td>
      <td>${escapeHtml(row.wk)}</td>
      <td>${row.rb}</td>
      ${ppCell(row)}
      ${poolCell('nat', row)}${poolCell('gat', row)}${poolCell('mat', row)}
      ${poolCell('npa', row)}${poolCell('gpa', row)}${poolCell('mpa', row)}
      <td>${row.kb}</td>
      <td>${row.ks}</td>
      <td>${row.ini}</td>
      ${showZweiWaffen ? `<td title="Kampf mit zwei Waffen: WK-faehig fuer die hoechste besessene Stufe">${zweiWaffenCell}</td>` : ''}
      ${allocationActions}
    </tr>`;
}

function renderNahkampfTable(rows: NahkampfRow[]): string {
  // Spalte "2-Waffen" nur, wenn das Talent (irgend)eine Stufe besessen wird - siehe
  // getZweiWaffenCap/zweiWaffenFaehig-Kommentar in NahkampfRow.
  const showZweiWaffen = rows.some((r) => r.zweiWaffenFaehig !== undefined);
  return `
    <h3 class="bogen-section-heading">Nahkampf</h3>
    <div class="kampf-table-scroll">
      <table class="bogen-table kampf-waffen-table">
        <thead><tr>
          <th>Waffe</th><th>Schaden</th><th>1H/2H</th><th>WK</th><th>RB</th><th>PP</th>
          <th>nAT</th><th>gAT</th><th>mAT</th><th>nPA</th><th>gPA</th><th>mPA</th>
          <th>KB</th><th>KS</th><th>INI</th>
          ${showZweiWaffen ? '<th>2-Waffen</th>' : ''}
          <th>Zuteilung</th>
        </tr></thead>
        <tbody>${rows.map((r, index) => renderNahkampfRow(r, showZweiWaffen, index)).join('')}</tbody>
      </table>
    </div>`;
}

/** Gemeinsame 6 NK-Zellen (Schaden/WK/nAT/nPA/KB/KS) fuer die Feuerwaffen/Armbrust/Boegen-
 *  Tabellen - siehe computeFkNkWerte-Kommentar. Kein eigener Pool: nur Anzeige, kein +/-. */
function renderFkNkCells(nk: FkNkWerte | null): string {
  if (!nk) return '<td>–</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td>';
  const title = nk.unusableReason ? ` title="${escapeHtml(nk.unusableReason)}"` : '';
  return `
      <td${title}>${escapeHtml(nk.schaden)}</td>
      <td${title}>${escapeHtml(nk.wk)}</td>
      <td${title}>${nk.nat ?? '–'}</td>
      <td${title}>${nk.npa ?? '–'}</td>
      <td>${nk.kb}</td>
      <td>${nk.ks}</td>`;
}

const FK_NK_TABLE_HEAD_CELLS = '<th>NK-Schaden</th><th>NK-WK</th><th>NK-nAT</th><th>NK-nPA</th><th>NK-KB</th><th>NK-KS</th>';

function renderFeuerwaffenRow(row: FeuerwaffenRow): string {
  return `
    <tr>
      <td>${escapeHtml(row.label)}</td>
      <td>${escapeHtml(row.schaden)}</td>
      <td>${row.rb}</td>
      <td>${escapeHtml(row.munition)}</td>
      ${row.ranges.map((r) => `<td>${escapeHtml(r)}</td>`).join('')}
      <td>${row.rw}</td>
      <td>${escapeHtml(row.ladedauer)}</td>
      <td>${row.ini}</td>
      ${renderFkNkCells(row.nk)}
    </tr>`;
}

function renderFeuerwaffenTable(rows: FeuerwaffenRow[]): string {
  if (rows.length === 0) return '';
  return `
    <h3 class="bogen-section-heading">Feuerwaffen</h3>
    <div class="kampf-table-scroll">
      <table class="bogen-table kampf-waffen-table">
        <thead><tr>
          <th>Waffe</th><th>Schaden</th><th>RB</th><th>Munition</th>
          <th>10m</th><th>30m</th><th>60m</th><th>100m</th><th>150m</th><th>210m</th>
          <th>RW</th><th>Ladedauer</th><th>INI</th>
          ${FK_NK_TABLE_HEAD_CELLS}
        </tr></thead>
        <tbody>${rows.map(renderFeuerwaffenRow).join('')}</tbody>
      </table>
    </div>`;
}

function renderArmbrustBogenRow(row: ArmbrustBogenRow): string {
  return `
    <tr>
      <td>${escapeHtml(row.label)}</td>
      <td>${escapeHtml(row.schaden)}</td>
      <td>${row.rb}</td>
      <td>${escapeHtml(row.munition)}</td>
      ${row.ranges.map((r) => `<td>${escapeHtml(r)}</td>`).join('')}
      <td>${escapeHtml(row.rw)}</td>
      <td>${escapeHtml(row.ladedauer)}</td>
      <td>${row.ini}</td>
      ${renderFkNkCells(row.nk)}
    </tr>`;
}

function renderArmbrustBogenTable(heading: string, rows: ArmbrustBogenRow[]): string {
  if (rows.length === 0) return '';
  return `
    <h3 class="bogen-section-heading">${heading}</h3>
    <div class="kampf-table-scroll">
      <table class="bogen-table kampf-waffen-table">
        <thead><tr>
          <th>Waffe</th><th>Schaden</th><th>RB</th><th>Munition</th>
          <th>10m</th><th>30m</th><th>60m</th><th>100m</th><th>150m</th><th>210m</th>
          <th>RW</th><th>Ladedauer</th><th>INI</th>
          ${FK_NK_TABLE_HEAD_CELLS}
        </tr></thead>
        <tbody>${rows.map(renderArmbrustBogenRow).join('')}</tbody>
      </table>
    </div>`;
}

function renderAusweichenBlock(row: AusweichenRow): string {
  return `
    <h3 class="bogen-section-heading">Ausweichen / Bewegung</h3>
    <div class="kampf-table-scroll">
      <table class="bogen-table kampf-ausweichen-table">
        <thead><tr>
          <th>n off AW</th><th>n def AW</th><th>g AW</th><th>m AW</th><th>Initiative</th>
          <th>Ausdauer</th><th>Dauerlauf (m/KR)</th><th>Sprinten (m/KR)</th>
          <th>Hochsprung (m)</th><th>Weitsprung (m)</th>
        </tr></thead>
        <tbody><tr>
          <td>${row.offAw}</td><td>${row.defAw}</td><td>${row.gutAw}</td><td>${row.meisterlichAw}</td>
          <td>${row.ini}</td><td>${row.ausdauer}</td><td>${row.dauerlauf}</td><td>${row.sprinten}</td>
          <td>${row.hochsprung}</td><td>${row.weitsprung}</td>
        </tr></tbody>
      </table>
    </div>`;
}

export function renderKampfView(
  container: HTMLElement, sheet: ComputedSheet, character: CharacterState, onWaffenPoolChange: OnWaffenPoolChange,
  onAddWaffenLoadout: OnAddWaffenLoadout, onRemoveWaffenLoadout: OnRemoveWaffenLoadout, onToggleWaffenLoadoutFavorite: OnToggleWaffenLoadoutFavorite,
): void {
  const nahkampfRows = buildNahkampfRows(character, sheet);
  const feuerwaffenRows = buildFeuerwaffenRows(character);
  const boegenRows = buildArmbrustBoegenRows(character, 'boegen');
  const armbrustRows = buildArmbrustBoegenRows(character, 'armbrust');
  const ausweichen = buildAusweichenRow(character);

  container.innerHTML = `
    ${renderNahkampfTable(nahkampfRows)}
    ${renderWaffenLoadoutBlock(character, sheet)}
    ${renderAusweichenBlock(ausweichen)}
    ${renderFeuerwaffenTable(feuerwaffenRows)}
    ${renderArmbrustBogenTable('Armbrüste', armbrustRows)}
    ${renderArmbrustBogenTable('Bögen', boegenRows)}
    ${renderTalenteKampfmodulBlock(character)}
  `;

  // Pool buttons edit a row-local draft. Mutation, persistence and the expensive full render only
  // happen after explicit confirmation.
  const draftAllocations = new Map<string, PoolAllocation>();
  const showZweiWaffen = nahkampfRows.some((row) => row.zweiWaffenFaehig !== undefined);
  const draftKey = (row: NahkampfRow) => `${row.poolReferenz}::${row.key}`;
  const repaintDraftRows = (changedRow: NahkampfRow, allocation?: PoolAllocation): void => {
    const changedKey = draftKey(changedRow);
    container.querySelectorAll<HTMLTableRowElement>('tr[data-kampf-row-index]').forEach((tr) => {
      const index = Number(tr.dataset.kampfRowIndex);
      const persistedRow = nahkampfRows[index];
      if (!persistedRow || draftKey(persistedRow) !== changedKey) return;
      const displayRow = allocation ? previewWaffenPoolAllocation(persistedRow, allocation) : persistedRow;
      const stagingBody = document.createElement('tbody');
      stagingBody.innerHTML = renderNahkampfRow(displayRow, showZweiWaffen, index, allocation !== undefined);
      const replacement = stagingBody.firstElementChild;
      if (replacement) tr.replaceWith(replacement);
    });
  };

  container.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const tableRow = target.closest<HTMLTableRowElement>('tr[data-kampf-row-index]');
    if (!tableRow) return;
    const row = nahkampfRows[Number(tableRow.dataset.kampfRowIndex)];
    if (!row?.poolReferenz) return;
    const key = draftKey(row);

    const poolButton = target.closest<HTMLButtonElement>('.kampf-pool-cell .stat-inc, .kampf-pool-cell .stat-dec');
    if (poolButton) {
      const cell = poolButton.closest<HTMLElement>('.kampf-pool-cell')!;
      const field = cell.dataset.field as PoolField;
      const allocation = { ...(draftAllocations.get(key) ?? allocationForRow(row)) };
      const current = allocation[field];
      const delta = poolButton.classList.contains('stat-inc') ? 1 : -1;
      const next = Math.max(0, current + delta);
      if (next === current) return;
      if (delta > 0) {
        const fieldMax = row[field].max;
        const preview = previewWaffenPoolAllocation(row, { ...allocation, [field]: next });
        if ((fieldMax !== undefined && next > fieldMax) || preview.pp < 0) return;
      }
      allocation[field] = next;
      if (allocationsEqual(allocation, allocationForRow(row))) {
        draftAllocations.delete(key);
        repaintDraftRows(row);
      } else {
        draftAllocations.set(key, allocation);
        repaintDraftRows(row, allocation);
      }
      return;
    }

    if (target.closest('.kampf-allocation-discard')) {
      draftAllocations.delete(key);
      repaintDraftRows(row);
      return;
    }

    if (target.closest('.kampf-allocation-apply')) {
      const allocation = draftAllocations.get(key);
      if (!allocation) return;
      const cellSelector = `.kampf-pool-cell[data-key="${CSS.escape(row.key)}"][data-pool-referenz="${CSS.escape(row.poolReferenz)}"]`;
      withScrollAnchor(cellSelector, () => onWaffenPoolChange(row.poolReferenz!, row.key, allocation));
    }
  });

  container.querySelectorAll<HTMLInputElement>('input[name="loadout-combo-type"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      container.querySelectorAll<HTMLElement>('.loadout-combo-fieldset').forEach((fieldset) => {
        fieldset.hidden = fieldset.dataset.comboType !== radio.value;
      });
    });
  });

  container.querySelector<HTMLButtonElement>('.loadout-add-btn')?.addEventListener('click', () => {
    const checkedRadio = container.querySelector<HTMLInputElement>('input[name="loadout-combo-type"]:checked');
    const soleFieldset = container.querySelector<HTMLElement>('.loadout-combo-fieldset');
    const comboType = (checkedRadio?.value ?? soleFieldset?.dataset.comboType) as WaffenLoadoutComboType | undefined;
    if (!comboType) return;
    const fieldset = container.querySelector<HTMLElement>(`.loadout-combo-fieldset[data-combo-type="${comboType}"]`);
    const primaryId = fieldset?.querySelector<HTMLSelectElement>('[data-role="primary"]')?.value;
    const secondaryId = fieldset?.querySelector<HTMLSelectElement>('[data-role="secondary"]')?.value;
    if (!primaryId || !secondaryId) return;
    onAddWaffenLoadout(comboType, primaryId, secondaryId);
  });

  container.querySelectorAll<HTMLButtonElement>('.loadout-remove').forEach((btn) => {
    btn.addEventListener('click', () => onRemoveWaffenLoadout(btn.dataset.loadoutId!));
  });
  container.querySelectorAll<HTMLButtonElement>('.loadout-favorite-toggle').forEach((btn) => {
    btn.addEventListener('click', () => onToggleWaffenLoadoutFavorite(btn.dataset.loadoutId!));
  });
}
