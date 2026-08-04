// Gemeinsame Low-Level-Helfer + FK-NK-Statblock-Logik (Nutzer 2026-07-23, siehe kampf.ts-Kommentar
// "FK-Waffen als Nahkampfwaffen"): von kampfFeuerwaffen.ts und kampfArmbrustBogen.ts geteilt, da
// Feuerwaffen/Armbrust/Bogen denselben NK-Statblock (Schaden/WK/nAT/nPA/KB/KS) und dieselbe
// n/g/m-Reichweitenzelle nutzen.

import type { CharacterState } from '../state/characterStore';
import { evalReferenz, type CharacterValueSource } from '../engine/rules';
import type { RangedWeaponInventorySnapshot } from '../engine/rangedInventorySnapshot';
import type { FernkampfRow } from '../data/equipment/fernkampf';
import { computeWeaponAtPaOverflow, getKampfstilModifier } from '../engine/waffenPool';
import { computeSchaden } from '../engine/waffenSchaden';
import { computeRangeCellValues, formatRangeCellValues } from '../engine/fernkampfRange';

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function num(row: Record<string, string> | undefined, header: string): number {
  const raw = row?.[header];
  if (raw === undefined) return 0;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

export function numOrUndefined(row: FernkampfRow | undefined, header: string): number | undefined {
  const raw = row?.[header];
  if (raw === undefined) return undefined;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
}

export function hasColumn(row: Record<string, string> | undefined, header: string): boolean {
  return row?.[header] !== undefined;
}

export const RANGE_HEADERS = ['10m', '30m', '60m', '100m', '150m', '210m'] as const;

export function formatRangeCell(
  rangeModRaw: string | number, basisValue: number, gutDivisor: number | null, meisterlichDivisor: number | null,
): string {
  return formatRangeCellValues(computeRangeCellValues(rangeModRaw, basisValue, gutDivisor, meisterlichDivisor));
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

export function computeFkNkWerte(
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

export function computeResolvedRangedNkWerte(
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

/** Gemeinsame 6 NK-Zellen (Schaden/WK/nAT/nPA/KB/KS) fuer die Feuerwaffen/Armbrust/Boegen-
 *  Tabellen - siehe computeFkNkWerte-Kommentar. Kein eigener Pool: nur Anzeige, kein +/-. */
export function renderFkNkCells(nk: FkNkWerte | null): string {
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

export const FK_NK_TABLE_HEAD_CELLS = '<th>NK-Schaden</th><th>NK-WK</th><th>NK-nAT</th><th>NK-nPA</th><th>NK-KB</th><th>NK-KS</th>';
