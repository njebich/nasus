// ARMBRÜSTE / Bögen - siehe kampf.ts-Dateikopf fuer den Gesamtkontext des Kampf-Tabs.

import { makeValueSource } from '../engine/characterSheet';
import { evalReferenz } from '../engine/rules';
import type { CharacterState } from '../state/characterStore';
import { combineDiceNotations, formatSigned } from '../engine/waffenSchaden';
import { fkGuteDivisor, fkMeisterlichDivisor } from '../engine/fernkampfRange';
import { gesBonWert, ladezeitKr, computeArmbrustLadezeitLabel } from '../engine/fernkampfLadezeit';
import { WEAPON_SPECIALIZATION_BY_ID } from '../engine/weaponCatalog';
import {
  escapeHtml, RANGE_HEADERS, formatRangeCell, computeResolvedRangedNkWerte, renderFkNkCells, FK_NK_TABLE_HEAD_CELLS, type FkNkWerte,
} from './kampfShared';

export interface ArmbrustBogenRow {
  key: string;
  label: string;
  rangedUsable: boolean;
  invalidReason?: string;
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
  armbrust: 'fk_basis_spez_schusswaffen_armbrueste',
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
    if (e.invalidReason || !basis || basis.kind !== 'ranged-weapon' || basis.table !== typ) {
      const invalidReason = e.invalidReason
        ?? `Ungültige Waffe: Tabelle '${typ}', sourceRow ${e.baseId}, Waffe '<unbekannt>': Snapshot fehlt`;
      rows.push({
        key: e.id, label: basis?.name ?? 'Ungültige Waffe', rangedUsable: false, invalidReason,
        schaden: '–', rb: 0, munition: '–', ranges: RANGE_HEADERS.map(() => 'x'), rw: '–',
        ladedauer: '–', ini: 0, nk: null,
      });
      continue;
    }
    const specialization = WEAPON_SPECIALIZATION_BY_ID.get(
      e.specializationId ?? basis.specializationId,
    );
    if (!specialization) {
      const invalidReason = `Ungültige Waffe: Tabelle '${typ}', sourceRow ${e.baseId}, `
        + `Waffe '${basis.name}', Spezialisierungs-ID `
        + `'${e.specializationId ?? basis.specializationId ?? '<fehlt>'}': Referenz fehlt`;
      rows.push({
        key: e.id, label: basis.name, rangedUsable: false, invalidReason,
        schaden: '–', rb: 0, munition: '–', ranges: RANGE_HEADERS.map(() => 'x'), rw: '–',
        ladedauer: '–', ini: 0, nk: null,
      });
      continue;
    }
    const ranges = basis.rangeMods.map((rangeMod) => formatRangeCell(rangeMod, basisWert, gutDivisor, meisterlichDivisor));
    const weaponRb = basis.rb;
    const weaponFix = basis.fixschaden;
    const ladedauer = typ === 'boegen'
      ? `${ladezeitKr(basis.nachladezeit, basis.nachladenTawTeiler, gesBon, ladeschuetzeWert)} KR`
      : computeArmbrustLadezeitLabel(basis.armbrustLadedaten, eigKStaerke, gesBon, ladeschuetzeWert);
    const nk = computeResolvedRangedNkWerte(basis, character, values);
    const ownedAmmo = character.equipment.filter(
      (a) => a.family === 'ammo' && a.baseTable === ammoFamily,
    );
    const ammoRows = ownedAmmo.length > 0 ? ownedAmmo : [undefined];
    for (const ammo of ammoRows) {
      const ammoSnapshot = ammo?.rangedSnapshot?.kind === 'ranged-ammo' ? ammo.rangedSnapshot : undefined;
      const invalidReason = ammo?.invalidReason
        ?? (ammo && (!ammoSnapshot || ammoSnapshot.ammunitionTypeId !== basis.ammunitionTypeId)
          ? `Ungültige Munition: Waffe '${basis.name}', Munition '${ammoSnapshot?.name ?? ammo.baseId}', `
            + `erwarteter Munitions-Typ '${basis.ammunitionTypeId}', tatsächlicher Typ `
            + `'${ammoSnapshot?.ammunitionTypeId ?? '<fehlt>'}'`
          : undefined);
      const rangedUsable = !!ammoSnapshot && !invalidReason;
      const ammoFix = ammoSnapshot?.fixschaden ?? 0;
      const ammoRb = ammoSnapshot?.rb ?? 0;
      const totalFix = weaponFix + ammoFix;
      rows.push({
        key: `${e.id}:${ammo?.id ?? 'keine'}`,
        label: basis.name,
        rangedUsable,
        invalidReason: invalidReason
          ?? (!ammo ? `Keine kompatible Munition vom Typ '${basis.ammunitionTypeId}' ausgewählt` : undefined),
        schaden: rangedUsable
          ? `${combineDiceNotations(basis.fernkampfWuerfel, ammoSnapshot.wuerfel)}${totalFix !== 0 ? ` ${formatSigned(totalFix)}` : ''}`
          : '–',
        rb: rangedUsable ? weaponRb + ammoRb : 0,
        munition: ammoSnapshot ? `${ammoSnapshot.name} (${ammo!.quantity} Stück)` : '–',
        ranges: rangedUsable ? ranges : RANGE_HEADERS.map(() => 'x'),
        rw: rangedUsable ? basis.rw : '–',
        ladedauer: rangedUsable ? ladedauer : '–',
        ini: Math.round(Number(evalReferenz('ini', values))) + basis.ini,
        nk,
      });
    }
  }
  return rows;
}

function renderArmbrustBogenRow(row: ArmbrustBogenRow): string {
  return `
    <tr class="${row.rangedUsable ? '' : 'kampf-row-unusable'}"${row.invalidReason ? ` title="${escapeHtml(row.invalidReason)}"` : ''}>
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

export function renderArmbrustBogenTable(heading: string, rows: ArmbrustBogenRow[]): string {
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
