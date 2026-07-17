// Generische Ansicht fuer eine Kategorie: zeigt Art='Wert' editierbar, Art='Fixwert' als
// reinen Referenztext, Art='Formel' als live berechneten (nicht editierbaren) Wert, und
// Art='Pool' als interaktive gAT/gPA/mAT/mPA-Zuteilung mit Budget-/Obergrenzen-Anzeige.
// Art='Auswahl' wird hier NICHT gerendert (siehe views/talenteVornachteile.ts).

import type { ComputedSheet, ComputedRule } from '../engine/characterSheet';
import type { PoolAllocation } from '../state/characterStore';
import { prettyFormula } from '../engine/formulaDisplay';
import { buildHierarchy, type HierarchyNode } from '../engine/hierarchy';

export type OnValueChange = (referenz: string, newValue: number) => void;
export type OnPoolChange = (referenz: string, allocation: PoolAllocation) => void;

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function errorNote(r: ComputedRule): string {
  return r.error ? `<span class="stat-error" title="${escapeHtml(r.error)}">⚠</span>` : '';
}

/** Formel-Tooltip fuers Label: zeigt die Formel (formelRaw/poolRaw/kostenRaw) mit Abkuerzungen. */
function formulaTitle(raw: string | undefined): string {
  if (!raw) return '';
  return ` title="${escapeHtml(prettyFormula(raw))}"`;
}

function renderEditableRow(r: ComputedRule): string {
  const label = escapeHtml(r.rule.beschreibung ?? r.rule.referenz);
  const value = r.currentValue ?? 0;
  const costNext = r.kostenNext !== undefined ? `${r.kostenNext} SP` : '';
  // Formel-Tooltip auf der ganzen Zeile (nicht nur dem Label), damit er auch beim Hover ueber
  // den Wert/die Buttons erscheint - Elemente ohne eigenes title-Attribut fallen auf das des
  // naechsten Vorfahren zurueck.
  return `
    <div class="stat-row" data-referenz="${r.rule.referenz}"${formulaTitle(r.rule.kostenRaw)}>
      <span class="stat-label">${label}${errorNote(r)}</span>
      <button type="button" class="stat-dec" aria-label="verringern">-</button>
      <input type="number" class="stat-value" min="0" value="${value}" aria-label="${label}" />
      <button type="button" class="stat-inc" aria-label="erhoehen">+</button>
      <span class="stat-cost">${costNext ? `naechster Punkt: ${costNext}` : ''}</span>
    </div>`;
}

function formatComputedValue(value: unknown): string {
  if (typeof value === 'number') {
    // Auf max. 2 Nachkommastellen runden, aber "1" statt "1.00" fuer glatte Zahlen zeigen.
    return String(Math.round(value * 100) / 100);
  }
  return String(value);
}

function renderReadOnlyRow(r: ComputedRule): string {
  const label = escapeHtml(r.rule.beschreibung ?? r.rule.referenz);
  const display = r.error
    ? `<span class="stat-error" title="${escapeHtml(r.error)}">nicht definiert ⚠</span>`
    : escapeHtml(formatComputedValue(r.computedValue ?? r.fixedText ?? '–'));
  return `
    <div class="stat-row stat-row-readonly"${formulaTitle(r.rule.formelRaw)}>
      <span class="stat-label">${label}</span>
      <span class="stat-value-readonly">${display}</span>
    </div>`;
}

/** Rendert eine Hauptfertigkeit + ihre Spezialisierungen als aufklappbare Gruppe (0 Kinder = flach).
 *  Das <details> steckt in einer nicht-grid/flex "stat-card"-Huelle: <details> als DIREKTES
 *  Grid-Item hat einen bekannten Chromium-Renderbug, bei dem der geschlossene Zustand (open=false)
 *  korrekt im DOM steht, der Inhalt aber trotzdem sichtbar aus dem Layout "ausbricht". */
function renderEditableGroup(node: HierarchyNode, renderRow: (r: ComputedRule) => string): string {
  if (node.children.length === 0) return renderRow(node.row);
  const label = escapeHtml(node.row.rule.beschreibung ?? node.row.rule.referenz);
  return `
    <div class="stat-card">
      <details class="stat-group">
        <summary>${label} <span class="stat-group-count">(${node.children.length} Spezialisierungen)</span></summary>
        ${renderRow(node.row)}
        <div class="stat-subgroup">${node.children.map(renderRow).join('')}</div>
      </details>
    </div>`;
}

function poolField(label: string, value: number, max: number | undefined): string {
  const maxAttr = max !== undefined ? `max="${max}"` : '';
  const maxHint = max !== undefined ? ` / ${max}` : '';
  return `
    <label class="pool-field">
      <span>${label}</span>
      <input type="number" class="pool-input" data-field="${label.toLowerCase()}" min="0" ${maxAttr} value="${value}" />
      <span class="pool-max-hint">${maxHint}</span>
    </label>`;
}

function renderPoolRow(r: ComputedRule): string {
  const label = escapeHtml(r.rule.beschreibung ?? r.rule.referenz);
  if (r.error) {
    return `
      <div class="pool-row">
        <div class="stat-label">${label} <span class="stat-error" title="${escapeHtml(r.error)}">nicht definiert ⚠</span></div>
      </div>`;
  }
  const alloc = r.poolAllocation ?? { gat: 0, gpa: 0, mat: 0, mpa: 0 };
  const caps = r.poolCaps;
  return `
    <div class="pool-row" data-referenz="${r.rule.referenz}">
      <div class="stat-label">${label}</div>
      <div class="pool-budget">Budget: ${formatComputedValue(r.computedValue)} | zugeteilt: ${alloc.gat + alloc.gpa + alloc.mat + alloc.mpa} | übrig: ${formatComputedValue(r.poolRemaining)}</div>
      <div class="pool-fields">
        ${poolField('gAT', alloc.gat, caps?.gatMax)}
        ${poolField('gPA', alloc.gpa, caps?.gpaMax)}
        ${poolField('mAT', alloc.mat, caps?.matMax)}
        ${poolField('mPA', alloc.mpa, caps?.mpaMax)}
      </div>
    </div>`;
}

export function renderCategoryView(
  container: HTMLElement,
  sheet: ComputedSheet,
  kategorie: string,
  onChange: OnValueChange,
  onPoolChange: OnPoolChange,
): void {
  const rows = sheet.byKategorie[kategorie] ?? [];
  const editable = rows.filter((r) => r.rule.art === 'Wert');
  const readOnly = rows.filter((r) => r.rule.art === 'Fixwert' || r.rule.art === 'Formel' || r.rule.art === 'Lookup');
  const pools = rows.filter((r) => r.rule.art === 'Pool');

  const editableHierarchy = buildHierarchy(editable);
  const readOnlyHierarchy = buildHierarchy(readOnly);

  container.innerHTML = `
    <div class="stat-category">${editableHierarchy.map((n) => renderEditableGroup(n, renderEditableRow)).join('')}</div>
    ${readOnly.length > 0 ? `
      <h3 class="stat-section-heading">Berechnete Werte</h3>
      <div class="stat-category">${readOnlyHierarchy.map((n) => renderEditableGroup(n, renderReadOnlyRow)).join('')}</div>
    ` : ''}
    ${pools.length > 0 ? `
      <h3 class="stat-section-heading">Kampf-Pools</h3>
      <div class="pool-category">${pools.map(renderPoolRow).join('')}</div>
    ` : ''}
  `;

  const findCurrent = (referenz: string) => editable.find((r) => r.rule.referenz === referenz)?.currentValue ?? 0;

  container.querySelectorAll<HTMLButtonElement>('.stat-inc').forEach((btn) => {
    btn.addEventListener('click', () => {
      const row = btn.closest<HTMLElement>('.stat-row')!;
      const referenz = row.dataset.referenz!;
      onChange(referenz, findCurrent(referenz) + 1);
    });
  });
  container.querySelectorAll<HTMLButtonElement>('.stat-dec').forEach((btn) => {
    btn.addEventListener('click', () => {
      const row = btn.closest<HTMLElement>('.stat-row')!;
      const referenz = row.dataset.referenz!;
      onChange(referenz, Math.max(0, findCurrent(referenz) - 1));
    });
  });
  container.querySelectorAll<HTMLInputElement>('.stat-value').forEach((input) => {
    input.addEventListener('change', () => {
      const row = input.closest<HTMLElement>('.stat-row')!;
      const referenz = row.dataset.referenz!;
      const parsed = Math.max(0, Math.floor(Number(input.value)));
      onChange(referenz, Number.isFinite(parsed) ? parsed : findCurrent(referenz));
    });
  });

  container.querySelectorAll<HTMLElement>('.pool-row[data-referenz]').forEach((row) => {
    const referenz = row.dataset.referenz!;
    const poolRule = pools.find((r) => r.rule.referenz === referenz);
    row.querySelectorAll<HTMLInputElement>('.pool-input').forEach((input) => {
      input.addEventListener('change', () => {
        const current = poolRule?.poolAllocation ?? { gat: 0, gpa: 0, mat: 0, mpa: 0 };
        const field = input.dataset.field as 'gat' | 'gpa' | 'mat' | 'mpa';
        const parsed = Math.max(0, Math.floor(Number(input.value)));
        const next: PoolAllocation = { ...current, [field]: Number.isFinite(parsed) ? parsed : current[field] };
        onPoolChange(referenz, next);
      });
    });
  });
}
