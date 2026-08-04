// FEUERWAFFEN - siehe kampf.ts-Dateikopf fuer den Gesamtkontext des Kampf-Tabs.

import { makeValueSource } from '../engine/characterSheet';
import { evalReferenz } from '../engine/rules';
import type { CharacterState } from '../state/characterStore';
import { combineDiceNotations, formatSigned } from '../engine/waffenSchaden';
import { fkGuteDivisor, fkMeisterlichDivisor } from '../engine/fernkampfRange';
import { gesBonWert, ladezeitKr, feuerwaffenLadeschuetzeReferenz } from '../engine/fernkampfLadezeit';
import { FIREARM_AMMO_BY_ART_AND_CALIBER, FIREARM_BY_SOURCE_ROW, weaponSpecializationForRow, WEAPON_SPECIALIZATION_BY_ID } from '../engine/weaponCatalog';
import { firearmAmmunitionType, firearmAmmoTypeForArt } from '../engine/ammunitionTypes';
import {
  escapeHtml, RANGE_HEADERS, formatRangeCell, computeFkNkWerte, renderFkNkCells, FK_NK_TABLE_HEAD_CELLS, type FkNkWerte,
} from './kampfShared';

export interface FeuerwaffenRow {
  key: string;
  label: string;
  rangedUsable: boolean;
  invalidReason?: string;
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
  Gewehr: 'fk_basis_spez_feuerwaffen_musketen',
  Pistole: 'fk_basis_spez_feuerwaffen_pistolen',
};

export function buildFeuerwaffenRows(character: CharacterState): FeuerwaffenRow[] {
  const values = makeValueSource(character);
  const gutDivisor = fkGuteDivisor(values);
  const meisterlichDivisor = fkMeisterlichDivisor(values);
  const gesBon = gesBonWert(values);
  const rows: FeuerwaffenRow[] = [];

  for (const e of character.equipment) {
    if (e.family !== 'feuerwaffe') continue;
    const basis = FIREARM_BY_SOURCE_ROW.get(e.baseId);
    if (!basis) {
      const invalidReason = e.invalidReason
        ?? `Ungültige Waffe: Tabelle 'Feuerwaffen', sourceRow ${e.baseId}, Waffe '<unbekannt>': Katalogeintrag fehlt`;
      rows.push({
        key: e.id, label: 'Ungültige Waffe', rangedUsable: false, invalidReason,
        schaden: '–', rb: 0, munition: '–', ranges: RANGE_HEADERS.map(() => 'x'), rw: 0,
        ladedauer: '–', ini: 0, nk: null,
      });
      continue;
    }
    const specialization = e.specializationId
      ? WEAPON_SPECIALIZATION_BY_ID.get(e.specializationId)
      : weaponSpecializationForRow('Feuerwaffen', basis);
    if (!specialization) {
      const invalidReason = `Ungültige Waffe: Tabelle 'Feuerwaffen', sourceRow ${basis.sourceRow}, `
        + `Waffe '${basis.name}', Spezialisierungs-ID '${e.specializationId}': Referenz fehlt`;
      rows.push({
        key: e.id, label: basis.name, rangedUsable: false, invalidReason,
        schaden: '–', rb: 0, munition: '–', ranges: RANGE_HEADERS.map(() => 'x'), rw: 0,
        ladedauer: '–', ini: 0, nk: null,
      });
      continue;
    }
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

    const ladeschuetzeReferenz = feuerwaffenLadeschuetzeReferenz(basis['Lademechanik'] ?? '');
    const ladeschuetzeWert = character.values[ladeschuetzeReferenz] ?? 0;
    const ladedauer = `${ladezeitKr(snap.nachladezeit ?? 0, snap.nachladenTawTeiler ?? 0, gesBon, ladeschuetzeWert)} KR`;
    const requiredTypeId = e.ammunitionTypeId
      ?? firearmAmmunitionType(basis['Lademechanik'] ?? '', basis['Munition'] ?? '');
    const caliber = snap.kaliber ?? 0;
    const ownedAmmo = character.equipment.filter(
      (ammo) => ammo.family === 'ammo' && ammo.baseTable === 'feuerwaffen-munition'
        && ammo.selections.kaliber === String(caliber)
        && (ammo.ammunitionTypeId ?? firearmAmmoTypeForArt(ammo.baseId)) === requiredTypeId,
    );
    const ammoRows = ownedAmmo.length > 0 ? ownedAmmo : [undefined];
    for (const ammo of ammoRows) {
      const ammoRow = ammo ? FIREARM_AMMO_BY_ART_AND_CALIBER.get(`${ammo.baseId}:${caliber}`) : undefined;
      const invalidReason = ammo && !ammoRow
        ? `Ungültige Munition: Waffe '${basis.name}', Munition '${ammo.baseId}', `
          + `erwarteter Munitions-Typ '${requiredTypeId}', tatsächlicher Typ `
          + `'${ammo.ammunitionTypeId ?? firearmAmmoTypeForArt(ammo.baseId) ?? '<fehlt>'}': Katalogeintrag fehlt`
        : ammo?.invalidReason;
      const rangedUsable = !!ammoRow && !invalidReason;
      rows.push({
        key: `${e.id}:${ammo?.id ?? 'keine'}`,
        label: basis.name,
        rangedUsable,
        invalidReason: invalidReason ?? (!ammo ? `Keine kompatible Munition vom Typ '${requiredTypeId}' ausgewählt` : undefined),
        schaden: rangedUsable
          ? `${combineDiceNotations(basis['1.W'], basis['2.W'])}${snap.fixschaden ? ` ${formatSigned(snap.fixschaden)}` : ''}`
          : '–',
        rb: rangedUsable ? snap.rb ?? 0 : 0,
        munition: ammoRow ? `${ammoRow.label} (${ammo!.quantity} Stück)` : '–',
        ranges: rangedUsable ? ranges : RANGE_HEADERS.map(() => 'x'),
        rw: rangedUsable ? snap.rw ?? 0 : 0,
        ladedauer: rangedUsable ? ladedauer : '–',
        ini: Math.round(Number(evalReferenz('ini', values))) + (snap.ini ?? 0),
        nk: computeFkNkWerte(basis, character, values),
      });
    }
  }
  return rows;
}

function renderFeuerwaffenRow(row: FeuerwaffenRow): string {
  return `
    <tr class="${row.rangedUsable ? '' : 'kampf-row-unusable'}"${row.invalidReason ? ` title="${escapeHtml(row.invalidReason)}"` : ''}>
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

export function renderFeuerwaffenTable(rows: FeuerwaffenRow[]): string {
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
