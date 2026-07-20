// Kampf-Tab (Nutzer-Mockup "S04 Kampfseite mockup.docx", 2026-07-19/20): Waffentabellen aus
// Ausrüstung mit per-Waffe NK-Pool-Verteilung. Vier Bloecke: NAHKAMPF (interaktiv, gAT/mAT/gPA/
// mPA/nAT/nPA-Pool-Zuteilung), FEUERWAFFEN + ARMBRÜSTE/Bögen (reine Anzeige, keine Pools in
// Fernkampf), Ausweichen/Bewegung (reine Formel-Anzeige). Row-Builder-Funktionen sind exportiert,
// damit charakterbogen.ts dieselben Daten fuer eine read-only Spiegelung wiederverwenden kann.

import type { ComputedSheet } from '../engine/characterSheet';
import { makeValueSource } from '../engine/characterSheet';
import { evalReferenz, type CharacterValueSource } from '../engine/rules';
import type { CharacterState, PoolAllocation } from '../state/characterStore';
import { NK_WAFFEN_BASIS, type GenericRow as WeaponRow } from '../data/equipment/weapons';
import { BOEGEN, ARMBRUST, PFEILE, BOLZEN, FEUERWAFFEN } from '../data/equipment/fernkampf';
import { feuerwaffenMunitionOptionen, FEUERWAFFEN_MUNITION_PREISE } from '../data/equipment/feuerwaffenMunition';
import { resolveWaffenPoolReferenz, computeWeaponAtPaOverflow, resolveWaffenRowBasis } from '../engine/waffenPool';

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

/** Gleiche AUFRUNDEN-weg-von-Null-Konvention wie engine/rules.ts's applyRoundingRule (dort nicht
 *  exportiert fuer views) - hier bewusst ABRUNDEN (Math.floor), da der Plan fuer die Schaden-
 *  Formel explizit "floor" vorgibt (Rundung war zum Planzeitpunkt nicht abschliessend
 *  spezifiziert, siehe Plan-Kommentar "Rounding is still unspecified"). */
function floorSigned(x: number): number {
  return Math.floor(x);
}

function formatSigned(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

/** "W10+W6" bei zwei Wuerfeln, sonst nur der eine - identische Anzeige-Konvention wie
 *  ausruestung.ts's (dort modul-privates) formatSchadenswuerfel. */
function formatSchadenswuerfel(row: Record<string, string> | undefined): string {
  const sw1 = row?.['Schadenswuerfel-1']?.trim();
  const sw2 = row?.['Schadenswuerfel-2']?.trim();
  if (sw1 && sw2) return `${sw1}+${sw2}`;
  return sw1 || sw2 || '–';
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
  grip: '1H' | '2H' | '–';
  usable: boolean;
  unusableReason?: string;
  schaden: string;
  wk: string;
  rb: number;
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
  kb: number;
  ks: number;
  ini: number;
}

function findWeaponBasis(baseId: string): WeaponRow | undefined {
  return NK_WAFFEN_BASIS.find((r) => String(r.sourceRow) === baseId);
}

/** Schaden = Wuerfelnotation + Flachbonus (eig_k_staerke/Staerke-Teiler + Stä-Malus, ABGERUNDET -
 *  siehe Plan-Kommentar zur Rundung). Nutzt den KOMPONIERTEN Stä-Malus aus dem Snapshot (Basis +
 *  Material), nicht nur die rohe Basis-Spalte - konsistent mit jeder anderen Zahl in dieser
 *  Tabelle (die kommen alle aus dem Snapshot, nicht aus der rohen Basiszeile). */
function computeSchaden(basis: WeaponRow | undefined, staerkeMalus: number, eigKStaerke: number): string {
  const staerkeTeiler = num(basis, 'Staerke-Teiler');
  const flatBonus = staerkeTeiler !== 0 ? floorSigned(eigKStaerke / staerkeTeiler + staerkeMalus) : floorSigned(staerkeMalus);
  const dice = formatSchadenswuerfel(basis);
  return flatBonus !== 0 ? `${dice} ${formatSigned(flatBonus)}` : dice;
}

interface PoolContext {
  sheet: ComputedSheet;
  character: CharacterState;
  values: CharacterValueSource;
}

function poolFieldsForRow(
  ctx: PoolContext, poolReferenz: string, key: string, hauptfertigkeit: string, atBonus: number, paBonus: number,
): Pick<NahkampfRow, 'nat' | 'gat' | 'mat' | 'npa' | 'gpa' | 'mpa' | 'pp'> {
  const poolRule = ctx.sheet.byKategorie['Nahkampf']?.find((r) => r.rule.referenz === poolReferenz);
  const allocation = ctx.character.poolAllocations[`${poolReferenz}::${key}`]
    ?? { gat: 0, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 };
  const overflow = computeWeaponAtPaOverflow(hauptfertigkeit, atBonus, paBonus, ctx.values);
  const caps = poolRule?.poolCaps;
  const rowAllocatedTotal = allocation.gat + allocation.gpa + allocation.mat + allocation.mpa + allocation.nat + allocation.npa;
  // Poolpunkte (PP) sind PRO ZEILE: dieser Waffe eigener AT/PA-Ueberschuss ueber 20 plus die
  // Spez-Punkte des Pools (z.B. 7), minus NUR das, was auf DIESE Zeile entfallen ist - NICHT die
  // Summe ueber Geschwister-Waffen desselben Pools (Nutzer 2026-07-20: "spend is per row, not for
  // the total pool"), obwohl das Budget selbst pool-weit geteilt ist (siehe setWaffenPoolAllocation).
  const pp = overflow.atOverflow + overflow.paOverflow + Number(poolRule?.computedValue ?? 0) - rowAllocatedTotal;
  return {
    nat: { value: overflow.uncAtWeapon + allocation.nat, allocated: allocation.nat, max: overflow.natMax },
    gat: { value: allocation.gat, allocated: allocation.gat, max: caps?.gatMax },
    mat: { value: allocation.mat, allocated: allocation.mat, max: caps?.matMax },
    npa: { value: overflow.uncPaWeapon + allocation.npa, allocated: allocation.npa, max: overflow.npaMax },
    gpa: { value: allocation.gpa, allocated: allocation.gpa, max: caps?.gpaMax },
    mpa: { value: allocation.mpa, allocated: allocation.mpa, max: caps?.mpaMax },
    pp,
  };
}

function buildOwnedWeaponRows(ctx: PoolContext, e: CharacterState['equipment'][number]): NahkampfRow[] {
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

  return grips.map((grip): NahkampfRow => {
    // Schilde (family='shield') speichern ihre Mindeststaerke unter 'minStaerke' statt
    // 'minStaerke1H' (siehe buyShield) - Schilde haben ohnehin nur den 1H-Griff (grips oben).
    const minStaerke = grip === '1H' ? (snap.minStaerke1H ?? snap.minStaerke ?? 0) : (snap.minStaerke2H ?? 0);
    const usable = eigKStaerke >= minStaerke;
    const wk = grip === '1H' ? (snap.wk ?? 0) : Math.ceil((snap.wk ?? 0) * 1.5 * 2) / 2;
    const poolFields = usable && poolReferenz
      ? poolFieldsForRow(ctx, poolReferenz, e.id, hauptfertigkeit, snap.at ?? 0, snap.pa ?? 0)
      : {
        nat: { value: 0, allocated: 0 }, gat: { value: 0, allocated: 0 }, mat: { value: 0, allocated: 0 },
        npa: { value: 0, allocated: 0 }, gpa: { value: 0, allocated: 0 }, mpa: { value: 0, allocated: 0 },
        pp: 0,
      };
    return {
      key: e.id,
      label: basis.name,
      grip,
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
    };
  });
}

const UNBEWAFFNET_SPEZ_REFERENZEN: readonly string[] = [
  'nk_spez_unbewaffnet_armklingen', 'nk_spez_unbewaffnet_messer', 'nk_spez_unbewaffnet_peitschen',
  'nk_spez_unbewaffnet_ruestung', 'nk_spez_unbewaffnet_schild', 'nk_spez_unbewaffnet_boxen',
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
      pp: 0,
    };
  return {
    key,
    label,
    grip: '–',
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

const UNBEWAFFNET_SPEZIES_BASIS_ROW: Record<string, string> = {
  Gnom: 'Unbewaffnet (Gnom)', Ork: 'Unbewaffnet (Ork)', Troll: 'Unbewaffnet (Troll)',
  Zentaur: 'Unbewaffnet (Zentaur)', Katzenmensch: 'Unbewaffnet (Katzenmensch)',
};

export function buildNahkampfRows(character: CharacterState, sheet: ComputedSheet): NahkampfRow[] {
  const ctx: PoolContext = { sheet, character, values: makeValueSource(character) };
  const rows: NahkampfRow[] = [];

  const unbewaffnetBasisName = UNBEWAFFNET_SPEZIES_BASIS_ROW[character.spezies] ?? 'Unbewaffnet (andere Voelker)';
  const unbewaffnetBasis = NK_WAFFEN_BASIS.find(
    (r) => r['Hauptfertigkeit'] === 'Unbewaffnet' && r.name === unbewaffnetBasisName,
  );
  const unbewaffnetRow = buildUnbewaffnetRow(ctx, 'unbewaffnet', 'Unbewaffnet', unbewaffnetBasis);
  if (unbewaffnetRow) rows.push(unbewaffnetRow);

  for (const e of character.equipment) {
    if (e.family !== 'weapon' && e.family !== 'shield') continue;
    rows.push(...buildOwnedWeaponRows(ctx, e));
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
// Kombinierte n/g/m-Reichweitenzelle (Feuerwaffen + Armbrüste/Bögen)
// ---------------------------------------------------------------------------------------------

/** "{normal} g{gut} m{meisterlich}" - g/m nur, wenn die Talent-Investition ueber den unge-
 *  talenteten Sockelwert hinausgeht (gut>1 / meisterlich>21, siehe fernkampf.jsonl-Gating-
 *  Kommentar). rangeModRaw kann bei Bögen/Armbrust der Literalstring "x" sein (ausser Reichweite,
 *  Stammdaten-Konvention) - dann ist die ganze Zelle "x". Fuer Feuerwaffen (immer numerisch) ist
 *  die "x"-Zeile nur ein defensiver Fallback fuer den Fall eines nicht-endlichen Rechenergebnisses
 *  (Nutzer 2026-07-20: "formula will not be false [...] if it somehow is, print X" - erwartet,
 *  mit den heutigen Daten NIE aktiv zu werden). */
function formatRangeCell(rangeModRaw: string | number, basisValue: number, gutValue: number, meisterlichValue: number): string {
  if (typeof rangeModRaw === 'string' && rangeModRaw.trim().toLowerCase() === 'x') return 'x';
  const rangeMod = typeof rangeModRaw === 'number' ? rangeModRaw : Number(rangeModRaw.replace(',', '.'));
  const normal = basisValue + rangeMod;
  const gut = gutValue + rangeMod;
  const meisterlich = meisterlichValue + rangeMod;
  if (![normal, gut, meisterlich].every(Number.isFinite)) return 'x';
  let out = `${normal}`;
  if (gut > 1) out += ` g${gut}`;
  if (meisterlich > 21) out += ` m${meisterlich}`;
  return out;
}

const RANGE_HEADERS = ['10m', '30m', '60m', '100m', '150m', '210m'] as const;

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
  ladedauer: number;
  ini: number;
}

const FEUERWAFFEN_TYP_POOL_REFS: Record<string, { basis: string; gut: string; meisterlich: string }> = {
  Gewehr: {
    basis: 'fk_basis_spez_schusswaffen_musketen', gut: 'fk_gute_spez_schusswaffen_musketen',
    meisterlich: 'fk_meisterlich_spez_schusswaffen_musketen',
  },
  Pistole: {
    basis: 'fk_basis_spez_schusswaffen_pistolen', gut: 'fk_gute_spez_schusswaffen_pistolen',
    meisterlich: 'fk_meisterlich_spez_schusswaffen_pistolen',
  },
};

export function buildFeuerwaffenRows(character: CharacterState): FeuerwaffenRow[] {
  const values = makeValueSource(character);
  const rows: FeuerwaffenRow[] = [];

  for (const e of character.equipment) {
    if (e.family !== 'feuerwaffe') continue;
    const basis = FEUERWAFFEN.find((r) => String(r.sourceRow) === e.baseId);
    if (!basis) continue;
    const snap = e.computedStatsSnapshot ?? {};
    const typ = basis['Typ'] ?? '';
    const poolRefs = FEUERWAFFEN_TYP_POOL_REFS[typ];
    let basisWert = 0, gutWert = 0, meisterlichWert = 0;
    if (poolRefs) {
      try {
        basisWert = Number(evalReferenz(poolRefs.basis, values));
        gutWert = Number(evalReferenz(poolRefs.gut, values));
        meisterlichWert = Number(evalReferenz(poolRefs.meisterlich, values));
      } catch {
        // Referenz nicht auswertbar (z.B. fehlende Grundvoraussetzung) - Zellen bleiben "x".
      }
    }
    const rwMod: number[] = [snap.rw10m ?? 0, snap.rw30m ?? 0, snap.rw60m ?? 0, snap.rw100m ?? 0, snap.rw150m ?? 0, snap.rw210m ?? 0];
    const ranges = poolRefs
      ? rwMod.map((mod) => formatRangeCell(mod, basisWert, gutWert, meisterlichWert))
      : RANGE_HEADERS.map(() => 'x');

    const munitionOptionen = feuerwaffenMunitionOptionen(basis['Lademechanik'] ?? '', basis['Munition'] ?? '', snap.kaliber ?? 0);
    const munitionArten = new Set<string>(munitionOptionen.map((m) => m.art));
    const ammo = character.equipment.find(
      (a) => a.family === 'ammo' && a.baseTable === 'feuerwaffen-munition'
        && munitionArten.has(a.baseId) && a.selections.kaliber === String(snap.kaliber ?? 0),
    );
    const ammoRow = ammo ? FEUERWAFFEN_MUNITION_PREISE.find((m) => m.art === ammo.baseId && m.kaliber === snap.kaliber) : undefined;
    const munition = ammoRow ? `${ammoRow.label} (${ammo!.quantity} Stück)` : '–';

    rows.push({
      key: e.id,
      label: basis.name,
      schaden: `${basis['1.W'] ?? '–'}${snap.fixschaden ? ` ${formatSigned(snap.fixschaden)}` : ''}`,
      rb: snap.rb ?? 0,
      munition,
      ranges,
      rw: snap.rw ?? 0,
      ladedauer: snap.nachladezeit ?? 0,
      ini: Math.round(Number(evalReferenz('ini', values))) + (snap.ini ?? 0),
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
}

const ARMBRUST_BOEGEN_POOL_REFS: Record<'boegen' | 'armbrust', { basis: string; gut: string; meisterlich: string }> = {
  boegen: { basis: 'fk_basis_spez_boegen_boegen', gut: 'fk_gute_spez_boegen_boegen', meisterlich: 'fk_meisterlich_spez_boegen_boegen' },
  armbrust: {
    basis: 'fk_basis_spez_schusswaffen_armbrust', gut: 'fk_gute_spez_schusswaffen_armbrust',
    meisterlich: 'fk_meisterlich_spez_schusswaffen_armbrust',
  },
};

export function buildArmbrustBoegenRows(character: CharacterState, typ: 'boegen' | 'armbrust'): ArmbrustBogenRow[] {
  const values = makeValueSource(character);
  const poolRefs = ARMBRUST_BOEGEN_POOL_REFS[typ];
  let basisWert = 0, gutWert = 0, meisterlichWert = 0;
  try {
    basisWert = Number(evalReferenz(poolRefs.basis, values));
    gutWert = Number(evalReferenz(poolRefs.gut, values));
    meisterlichWert = Number(evalReferenz(poolRefs.meisterlich, values));
  } catch {
    // nicht auswertbar - Zellen bleiben "x".
  }
  const ammoFamily = typ === 'boegen' ? 'pfeile' : 'bolzen';
  const ammoTable = typ === 'boegen' ? PFEILE : BOLZEN;
  const rows: ArmbrustBogenRow[] = [];

  for (const e of character.equipment) {
    if (e.family !== 'fernkampfwaffe' || e.baseTable !== typ) continue;
    const basis = (typ === 'boegen' ? BOEGEN : ARMBRUST).find((r) => String(r.sourceRow) === e.baseId);
    if (!basis) continue;
    const ranges = RANGE_HEADERS.map((h) => formatRangeCell(basis[h] ?? 'x', basisWert, gutWert, meisterlichWert));
    const weaponRb = num(basis, 'RB');
    const weaponFix = num(basis, 'Fixschaden');
    const ownedAmmo = character.equipment.filter((a) => a.family === 'ammo' && a.baseTable === ammoFamily);
    const ammoRows = ownedAmmo.length > 0 ? ownedAmmo : [undefined];
    for (const ammo of ammoRows) {
      const ammoBasis = ammo ? ammoTable.find((r) => String(r.sourceRow) === ammo.baseId) : undefined;
      const ammoMod = ammo?.selections.modifikator ? ammoTable.find((r) => String(r.sourceRow) === ammo.selections.modifikator) : undefined;
      const ammoFix = ammo?.computedStatsSnapshot?.fixschaden ?? 0;
      const ammoRb = ammo?.computedStatsSnapshot?.rb ?? 0;
      const totalFix = weaponFix + ammoFix;
      const ammoName = ammoBasis ? (ammoMod ? `${ammoMod.name} (${ammoBasis.name})` : ammoBasis.name) : undefined;
      rows.push({
        key: `${e.id}:${ammo?.id ?? 'keine'}`,
        label: basis.name,
        schaden: `${basis['1.W'] ?? '–'}${totalFix !== 0 ? ` ${formatSigned(totalFix)}` : ''}`,
        rb: weaponRb + ammoRb,
        munition: ammoName ? `${ammoName} (${ammo!.quantity} Stück)` : '–',
        ranges,
        rw: basis['RW'] ?? '–',
        ladedauer: basis['Nachladezeit'] ?? '–',
        ini: Math.round(Number(evalReferenz('ini', values))) + num(basis, 'Ini'),
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
// Rendering (interaktiv)
// ---------------------------------------------------------------------------------------------

export type OnWaffenPoolChange = (poolReferenz: string, equipmentId: string, allocation: PoolAllocation) => void;

function poolCell(field: 'nat' | 'gat' | 'mat' | 'npa' | 'gpa' | 'mpa', row: NahkampfRow): string {
  const state = row[field];
  if (!row.usable || !row.poolReferenz) return `<td class="kampf-pool-cell">–</td>`;
  const atMax = state.max !== undefined && state.allocated >= state.max;
  return `
    <td class="kampf-pool-cell" data-key="${escapeHtml(row.key)}" data-pool-referenz="${escapeHtml(row.poolReferenz)}" data-field="${field}">
      <div class="kampf-pool-cell-inner">
        <button type="button" class="stat-dec" aria-label="${field} verringern" ${state.allocated <= 0 ? 'disabled' : ''}>-</button>
        <span class="kampf-pool-value">${state.value}</span>
        <button type="button" class="stat-inc" aria-label="${field} erhöhen" ${atMax ? 'disabled' : ''}>+</button>
      </div>
    </td>`;
}

function renderNahkampfRow(row: NahkampfRow): string {
  const unusable = !row.usable;
  return `
    <tr class="${unusable ? 'kampf-row-unusable' : ''}" title="${unusable ? escapeHtml(row.unusableReason ?? '') : ''}">
      <td>${escapeHtml(row.label)}</td>
      <td>${escapeHtml(row.schaden)}</td>
      <td>${row.grip}</td>
      <td>${escapeHtml(row.wk)}</td>
      <td>${row.rb}</td>
      <td>${row.pp}</td>
      ${poolCell('nat', row)}${poolCell('gat', row)}${poolCell('mat', row)}
      ${poolCell('npa', row)}${poolCell('gpa', row)}${poolCell('mpa', row)}
      <td>${row.kb}</td>
      <td>${row.ks}</td>
      <td>${row.ini}</td>
    </tr>`;
}

function renderNahkampfTable(rows: NahkampfRow[]): string {
  return `
    <h3 class="bogen-section-heading">Nahkampf</h3>
    <div class="kampf-table-scroll">
      <table class="bogen-table kampf-waffen-table">
        <thead><tr>
          <th>Waffe</th><th>Schaden</th><th>1H/2H</th><th>WK</th><th>RB</th><th>PP</th>
          <th>nAT</th><th>gAT</th><th>mAT</th><th>nPA</th><th>gPA</th><th>mPA</th>
          <th>KB</th><th>KS</th><th>INI</th>
        </tr></thead>
        <tbody>${rows.map(renderNahkampfRow).join('')}</tbody>
      </table>
    </div>`;
}

function renderFeuerwaffenRow(row: FeuerwaffenRow): string {
  return `
    <tr>
      <td>${escapeHtml(row.label)}</td>
      <td>${escapeHtml(row.schaden)}</td>
      <td>${row.rb}</td>
      <td>${escapeHtml(row.munition)}</td>
      ${row.ranges.map((r) => `<td>${escapeHtml(r)}</td>`).join('')}
      <td>${row.rw}</td>
      <td>${row.ladedauer}</td>
      <td>${row.ini}</td>
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
): void {
  const nahkampfRows = buildNahkampfRows(character, sheet);
  const feuerwaffenRows = buildFeuerwaffenRows(character);
  const boegenRows = buildArmbrustBoegenRows(character, 'boegen');
  const armbrustRows = buildArmbrustBoegenRows(character, 'armbrust');
  const ausweichen = buildAusweichenRow(character);

  container.innerHTML = `
    ${renderNahkampfTable(nahkampfRows)}
    ${renderAusweichenBlock(ausweichen)}
    ${renderFeuerwaffenTable(feuerwaffenRows)}
    ${renderArmbrustBogenTable('Armbrüste', armbrustRows)}
    ${renderArmbrustBogenTable('Bögen', boegenRows)}
  `;

  container.querySelectorAll<HTMLButtonElement>('.kampf-pool-cell .stat-inc, .kampf-pool-cell .stat-dec').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cell = btn.closest<HTMLElement>('.kampf-pool-cell')!;
      const key = cell.dataset.key!;
      const poolReferenz = cell.dataset.poolReferenz!;
      const field = cell.dataset.field as 'nat' | 'gat' | 'mat' | 'npa' | 'gpa' | 'mpa';
      const row = nahkampfRows.find((r) => r.key === key && r.poolReferenz === poolReferenz);
      if (!row) return;
      const current = row[field].allocated;
      const delta = btn.classList.contains('stat-inc') ? 1 : -1;
      const next = Math.max(0, current + delta);
      const allocation: PoolAllocation = {
        gat: row.gat.allocated, gpa: row.gpa.allocated, mat: row.mat.allocated, mpa: row.mpa.allocated,
        nat: row.nat.allocated, npa: row.npa.allocated,
        [field]: next,
      };
      onWaffenPoolChange(poolReferenz, key, allocation);
    });
  });
}
