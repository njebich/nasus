// NAHKAMPF (interaktiv, gAT/mAT/gPA/mPA/nAT/nPA-Pool-Zuteilung) - siehe kampf.ts-Dateikopf fuer
// den Gesamtkontext des Kampf-Tabs. Row-Builder (buildNahkampfRows) ist exportiert, damit
// charakterbogen.ts/kampfLoadout.ts/xKlingeIntegration.test.ts dieselben Daten wiederverwenden.

import type { ComputedSheet } from '../engine/characterSheet';
import { makeValueSource } from '../engine/characterSheet';
import { evalReferenz, type CharacterValueSource } from '../engine/rules';
import type { CharacterState, PoolAllocation } from '../state/characterStore';
import { NK_WAFFEN_BASIS, type GenericRow as WeaponRow } from '../data/equipment/weapons';
import {
  resolveWaffenPoolReferenz, computeWeaponAtPaOverflow, resolveWaffenRowBasis, getKampfstilModifier, getZweiWaffenCap,
} from '../engine/waffenPool';
import { GUT_BASIS, MEISTERLICH_BASIS, gutBudget, meisterlichBudget, isPoolBalanceValid } from '../engine/poolCaps';
import { computeSchaden } from '../engine/waffenSchaden';
import { xKlingeTooltip, xKlingeWeaponName, xKlingeWirkungForEntry } from '../engine/xKlinge';
import { tooltipAttr } from './tooltip';
import { MELEE_WEAPON_BY_SOURCE_ROW, weaponSpecializationForRow, WEAPON_SPECIALIZATION_BY_ID } from '../engine/weaponCatalog';
import { escapeHtml, num, hasColumn } from './kampfShared';

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
  return MELEE_WEAPON_BY_SOURCE_ROW.get(baseId);
}

export interface PoolContext {
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
  if (!basis) {
    const reason = e.invalidReason
      ?? `Ungültige Waffe: Tabelle '${e.baseTable}', sourceRow ${e.baseId}, Waffe '<unbekannt>': Katalogeintrag fehlt`;
    return [{
      key: e.id, label: e.displayNameSnapshot ?? 'Ungültige Waffe', spezialisierung: '', grip: '–', minStaerke: 0,
      usable: false, unusableReason: reason, schaden: '–', wk: '–', rb: 0, poolReferenz: null,
      nat: { value: 0, allocated: 0 }, gat: { value: 0, allocated: 0 }, mat: { value: 0, allocated: 0 },
      npa: { value: 0, allocated: 0 }, gpa: { value: 0, allocated: 0 }, mpa: { value: 0, allocated: 0 },
      pp: 0, atSpent: 0, paSpent: 0, poolValid: true, kb: 0, ks: 0, ini: 0,
    }];
  }
  const snap = e.computedStatsSnapshot ?? {};
  const eigKStaerke = Number(evalReferenz('eig_k_staerke', ctx.values));
  const hauptfertigkeit = basis['Hauptfertigkeit'] ?? '';
  const spezialisierung = basis['Spezialisierung'] ?? '';
  let poolReferenz: string | null = null;
  let invalidReason: string | undefined;
  try {
    const specialization = e.specializationId
      ? WEAPON_SPECIALIZATION_BY_ID.get(e.specializationId)
      : weaponSpecializationForRow('NK-Waffen-Basis', basis);
    if (!specialization) {
      throw new Error(
        `Ungültige Waffe: Tabelle 'NK-Waffen-Basis', sourceRow ${basis.sourceRow}, `
        + `Waffe '${basis.name}', Spezialisierungs-ID '${e.specializationId}': Referenz fehlt`,
      );
    }
    poolReferenz = specialization.poolReferenz;
  } catch (error) {
    invalidReason = error instanceof Error ? error.message : String(error);
  }

  const zweihaenderMoeglich = hasColumn(basis, 'Min-Staerke-1H-Basis') && hasColumn(basis, 'Min-Staerke-2H-Basis');
  const grips: Array<'1H' | '2H'> = zweihaenderMoeglich ? ['1H', '2H'] : ['1H'];

  const wirkung = xKlingeWirkungForEntry(e);
  const weaponName = xKlingeWeaponName(e) ?? basis.name;

  return grips.flatMap((grip): NahkampfRow[] => {
    // Schilde (family='shield') speichern ihre Mindeststaerke unter 'minStaerke' statt
    // 'minStaerke1H' (siehe buyShield) - Schilde haben ohnehin nur den 1H-Griff (grips oben).
    const minStaerke = grip === '1H' ? (snap.minStaerke1H ?? snap.minStaerke ?? 0) : (snap.minStaerke2H ?? 0);
    const usable = !invalidReason && eigKStaerke >= minStaerke;
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
      unusableReason: usable ? undefined : invalidReason ?? 'nicht tragbar (Stärke zu niedrig)',
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
// Rendering (interaktiv) + Pool-Zuteilungs-Mathematik
// ---------------------------------------------------------------------------------------------

export type OnWaffenPoolChange = (poolReferenz: string, equipmentId: string, allocation: PoolAllocation) => void;

export const POOL_FIELDS = ['nat', 'gat', 'mat', 'npa', 'gpa', 'mpa'] as const;
export type PoolField = typeof POOL_FIELDS[number];

export function allocationForRow(row: NahkampfRow): PoolAllocation {
  return {
    gat: row.gat.allocated, gpa: row.gpa.allocated, mat: row.mat.allocated, mpa: row.mpa.allocated,
    nat: row.nat.allocated, npa: row.npa.allocated,
  };
}

export function allocationsEqual(left: PoolAllocation, right: PoolAllocation): boolean {
  return POOL_FIELDS.every((field) => left[field] === right[field]);
}

/** Projects an uncommitted allocation onto a persisted row without mutating CharacterState. */
export function previewWaffenPoolAllocation(row: NahkampfRow, allocation: PoolAllocation): NahkampfRow {
  const oldAllocation = allocationForRow(row);
  const oldTotal = POOL_FIELDS.reduce((sum, field) => sum + oldAllocation[field], 0);
  const newTotal = POOL_FIELDS.reduce((sum, field) => sum + allocation[field], 0);
  const nextState = (field: PoolField): PoolFieldState => {
    const previous = row[field];
    // Bei nAT/nPA kann der angezeigte Wert bereits auf 20 gedeckelt sein. Dann ist
    // `value - allocated` kein gueltiger Rueckschluss auf die Basis (z.B. 20 angezeigt,
    // natMax=0, alter allocated=1: die echte Basis ist weiterhin mindestens 20, nicht 19).
    const baseValue = (field === 'nat' || field === 'npa') && previous.max !== undefined
      ? 20 - previous.max
      : previous.value - previous.allocated;
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
        <span class="kampf-pool-value numeric-field-output numeric-field-two">${state.value}</span>
        <button type="button" class="stat-inc" aria-label="${field} erhöhen" ${incrementDisabled ? 'disabled' : ''}>+</button>
      </div>
    </td>`;
}

function ppCell(row: NahkampfRow): string {
  if (row.poolValid) return `<td>${row.pp}</td>`;
  const tooltip = `Summe auf AT verteilt: ${row.atSpent}\nSumme auf PA verteilt: ${row.paSpent}`;
  return `<td class="kampf-pp-invalid">${row.pp} <span class="kampf-pp-warn" title="${escapeHtml(tooltip)}">⚠</span></td>`;
}

export function renderNahkampfRow(row: NahkampfRow, showZweiWaffen: boolean, rowIndex: number, dirty = false): string {
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

export function renderNahkampfTable(rows: NahkampfRow[]): string {
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
