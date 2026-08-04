// Kampf-Tab (Nutzer-Mockup "S04 Kampfseite mockup.docx", 2026-07-19/20): Waffentabellen aus
// Ausrüstung mit per-Waffe NK-Pool-Verteilung. Vier Bloecke: NAHKAMPF (interaktiv, gAT/mAT/gPA/
// mPA/nAT/nPA-Pool-Zuteilung), FEUERWAFFEN + ARMBRÜSTE/Bögen (reine Anzeige, keine Pools in
// Fernkampf), Ausweichen/Bewegung (reine Formel-Anzeige). Auf mehrere Dateien aufgeteilt (siehe
// kampfNahkampf/kampfFeuerwaffen/kampfArmbrustBogen/kampfAusweichen/kampfLoadout/kampfShared.ts) -
// diese Datei orchestriert nur noch renderKampfView + die Pool-/Loadout-Interaktivitaet und
// re-exportiert die Row-Builder, damit charakterbogen.ts/main.ts/Tests dieselben Daten
// wiederverwenden koennen, ohne ihre Imports anzupassen.

import type { ComputedSheet } from '../engine/characterSheet';
import { isWaffenLoadoutSingleType, type CharacterState, type PoolAllocation, type WaffenLoadoutComboType } from '../state/characterStore';
import { getOwnedKampfmodulTalentInfo } from '../engine/talenteKampfmodulInfo';
import { withScrollAnchor } from './scrollAnchor';
import { escapeHtml } from './kampfShared';
import { renderKampfLeRs } from './kampfLeRs';
import {
  buildNahkampfRows, renderNahkampfRow, renderNahkampfTable,
  allocationForRow, allocationsEqual, previewWaffenPoolAllocation,
  type NahkampfRow, type PoolField, type OnWaffenPoolChange,
} from './kampfNahkampf';
import { buildFeuerwaffenRows, renderFeuerwaffenTable } from './kampfFeuerwaffen';
import { buildArmbrustBoegenRows, renderArmbrustBogenTable } from './kampfArmbrustBogen';
import { buildAusweichenRow, renderAusweichenBlock } from './kampfAusweichen';
import {
  renderWaffenLoadoutBlock,
  type OnAddWaffenLoadout, type OnRemoveWaffenLoadout, type OnToggleWaffenLoadoutFavorite,
} from './kampfLoadout';

export {
  buildNahkampfRows, previewWaffenPoolAllocation, type OnWaffenPoolChange,
} from './kampfNahkampf';
export { buildFeuerwaffenRows } from './kampfFeuerwaffen';
export { buildArmbrustBoegenRows } from './kampfArmbrustBogen';
export { buildAusweichenRow } from './kampfAusweichen';
export {
  buildLoadoutDisplayRows, formatLoadoutCells, type LoadoutDisplayRow,
  type OnAddWaffenLoadout, type OnRemoveWaffenLoadout, type OnToggleWaffenLoadoutFavorite,
} from './kampfLoadout';

const openKampfLeRsGruppen = new Set<string>();

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
    ${renderKampfLeRs(sheet, character, openKampfLeRsGruppen)}
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
  const syncKampfLeRsOpenState = (): void => {
    container.querySelectorAll<HTMLDetailsElement>('.kampf-tz-details[data-kampf-tz-gruppe]').forEach((details) => {
      const gruppe = details.dataset.kampfTzGruppe!;
      if (details.open) openKampfLeRsGruppen.add(gruppe);
      else openKampfLeRsGruppen.delete(gruppe);
    });
  };
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
      syncKampfLeRsOpenState();
      const cellSelector = `.kampf-pool-cell[data-key="${CSS.escape(row.key)}"][data-pool-referenz="${CSS.escape(row.poolReferenz)}"]`;
      withScrollAnchor(cellSelector, () => onWaffenPoolChange(row.poolReferenz!, row.key, allocation));
    }
  });

  container.querySelector<HTMLSelectElement>('select[name="loadout-combo-type"]')?.addEventListener('change', (event) => {
    const selectedType = (event.currentTarget as HTMLSelectElement).value;
    container.querySelectorAll<HTMLElement>('.loadout-combo-fieldset').forEach((fieldset) => {
      fieldset.hidden = fieldset.dataset.comboType !== selectedType;
    });
  });

  container.querySelector<HTMLButtonElement>('.loadout-add-btn')?.addEventListener('click', () => {
    const typeSelect = container.querySelector<HTMLSelectElement>('select[name="loadout-combo-type"]');
    const soleFieldset = container.querySelector<HTMLElement>('.loadout-combo-fieldset');
    const comboType = (typeSelect?.value ?? soleFieldset?.dataset.comboType) as WaffenLoadoutComboType | undefined;
    if (!comboType) return;
    const fieldset = container.querySelector<HTMLElement>(`.loadout-combo-fieldset[data-combo-type="${comboType}"]`);
    const primaryId = fieldset?.querySelector<HTMLSelectElement>('[data-role="primary"]')?.value;
    const secondaryId = fieldset?.querySelector<HTMLSelectElement>('[data-role="secondary"]')?.value;
    if (!primaryId || (!isWaffenLoadoutSingleType(comboType) && !secondaryId)) return;
    onAddWaffenLoadout(comboType, primaryId, secondaryId ?? primaryId);
  });

  container.querySelectorAll<HTMLButtonElement>('.loadout-remove').forEach((btn) => {
    btn.addEventListener('click', () => onRemoveWaffenLoadout(btn.dataset.loadoutId!));
  });
  container.querySelectorAll<HTMLButtonElement>('.loadout-favorite-toggle').forEach((btn) => {
    btn.addEventListener('click', () => onToggleWaffenLoadoutFavorite(btn.dataset.loadoutId!));
  });
}
