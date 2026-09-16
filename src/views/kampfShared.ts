// Gemeinsame Low-Level-Helfer + FK-NK-Statblock-Logik (Nutzer 2026-07-23, siehe kampf.ts-Kommentar
// "FK-Waffen als Nahkampfwaffen"): von kampfFeuerwaffen.ts und kampfArmbrustBogen.ts geteilt, da
// Feuerwaffen/Armbrust/Bogen denselben NK-Statblock (Schaden/WK/nAT/nPA/KB/KS) und dieselbe
// n/g/m-Reichweitenzelle nutzen.

import type { CharacterState } from '../state/characterStore';
import { evalReferenz, type CharacterValueSource } from '../engine/rules';
import type { RangedWeaponInventorySnapshot } from '../engine/rangedInventorySnapshot';
import type { FernkampfRow } from '../data/equipment/fernkampf';
import { computeWeaponAtPaOverflow, getKampfstilModifier } from '../engine/waffenPool';
import { computeSchaden, formatSigned } from '../engine/waffenSchaden';
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
  // Min-Staerke-Unterschreitung sperrt die Waffe nicht mehr komplett, sondern gibt einen
  // gestuften Malus (DEC-1208, RC-091 §3.6): nAT/nPA -3 je fehlendem Punkt (kein Floor), Schaden
  // -1 je fehlendem Punkt (gefloort bei 0) - die Waffe bleibt nutzbar.
  const staerkeDefizit = Math.max(0, minStaerke - eigKStaerke);
  const overflow = computeWeaponAtPaOverflow(
    hauptfertigkeit, num(basis, 'AT-Basis'), num(basis, 'PA-Basis'), values, getKampfstilModifier(character),
  );
  return {
    usable: true,
    unusableReason: staerkeDefizit > 0
      ? `Mindest-Stärke ${minStaerke} unterschritten (${formatSigned(-staerkeDefizit)}): nAT/nPA ${formatSigned(-3 * staerkeDefizit)}, Schaden ${formatSigned(-staerkeDefizit)}`
      : undefined,
    schaden: computeSchaden(basis, num(basis, 'Staerke-Malus-Basis'), eigKStaerke, undefined, staerkeDefizit),
    wk: String(num(basis, 'WK-Basis')),
    nat: Math.min(20, overflow.uncAtWeapon) - 3 * staerkeDefizit,
    npa: Math.min(20, overflow.uncPaWeapon) - 3 * staerkeDefizit,
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
  // Siehe computeFkNkWerte: gestufter Malus statt Vollsperre (DEC-1208, RC-091 §3.6).
  const staerkeDefizit = Math.max(0, minStaerke - eigKStaerke);
  const overflow = computeWeaponAtPaOverflow(
    basis.hauptfertigkeit, basis.atBasis, basis.paBasis, values, getKampfstilModifier(character),
  );
  const schadenBasis = {
    'Schadenswuerfel-1': basis.schadenswuerfel1,
    'Schadenswuerfel-2': basis.schadenswuerfel2,
    'Staerke-Teiler': String(basis.staerkeTeiler),
  };
  return {
    usable: true,
    unusableReason: staerkeDefizit > 0
      ? `Mindest-Stärke ${minStaerke} unterschritten (${formatSigned(-staerkeDefizit)}): nAT/nPA ${formatSigned(-3 * staerkeDefizit)}, Schaden ${formatSigned(-staerkeDefizit)}`
      : undefined,
    schaden: computeSchaden(schadenBasis, basis.staerkeMalusBasis, eigKStaerke, undefined, staerkeDefizit),
    wk: String(basis.wkBasis),
    nat: Math.min(20, overflow.uncAtWeapon) - 3 * staerkeDefizit,
    npa: Math.min(20, overflow.uncPaWeapon) - 3 * staerkeDefizit,
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
