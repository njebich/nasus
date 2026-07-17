// Auswahl-Ansicht fuer Talente und Vor-/Nachteile: Checkbox-Liste statt Zahlen-Stepper.
// Talente werden zur Uebersicht nach Charakterklasse (Parent) gruppiert - das ist reine
// Kategorisierung, KEINE Kaufsperre: jeder Charakter kann jedes Talent kaufen (siehe Plan).

import type { ComputedSheet, ComputedRule } from '../engine/characterSheet';
import { prettyFormula } from '../engine/formulaDisplay';

export type OnToggle = (referenz: string, selected: boolean) => void;

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formulaTitle(raw: string | undefined): string {
  if (!raw) return '';
  return ` title="${escapeHtml(prettyFormula(raw))}"`;
}

function renderRow(r: ComputedRule): string {
  const label = escapeHtml(r.rule.beschreibung ?? r.rule.referenz);
  // Talente kosten TaP (eigener, von SP komplett getrennter Pool), alles andere (z.B.
  // Vor-/Nachteile) kostet SP - siehe characterSheet.ts.
  const waehrung = r.rule.kategorie === 'Talente' ? 'TaP' : 'SP';
  const cost = r.kostenSelect !== undefined ? `${r.kostenSelect > 0 ? '-' : '+'}${Math.abs(r.kostenSelect)} ${waehrung}` : '';
  const errorNote = r.error ? `<span class="stat-error" title="${escapeHtml(r.error)}">⚠</span>` : '';
  return `
    <label class="auswahl-row" data-referenz="${r.rule.referenz}"${formulaTitle(r.rule.kostenRaw)}>
      <input type="checkbox" class="auswahl-checkbox" ${r.selected ? 'checked' : ''} />
      <span class="stat-label">${label}${errorNote}</span>
      <span class="stat-cost">${cost}</span>
    </label>`;
}

export function renderAuswahlView(
  container: HTMLElement,
  sheet: ComputedSheet,
  kategorie: string,
  groupByParent: boolean,
  onToggle: OnToggle,
): void {
  const rows = (sheet.byKategorie[kategorie] ?? []).filter((r) => r.rule.art === 'Auswahl');

  let html: string;
  if (groupByParent) {
    const groups = new Map<string, ComputedRule[]>();
    for (const r of rows) {
      const key = r.rule.parent ?? 'Sonstige';
      (groups.get(key) ?? groups.set(key, []).get(key)!).push(r);
    }
    html = [...groups.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([parent, groupRows]) => `
        <h3 class="stat-section-heading">${escapeHtml(parent)}</h3>
        <div class="auswahl-category">${groupRows.map(renderRow).join('')}</div>
      `).join('');
  } else {
    html = `<div class="auswahl-category">${rows.map(renderRow).join('')}</div>`;
  }

  container.innerHTML = html;

  container.querySelectorAll<HTMLInputElement>('.auswahl-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const row = checkbox.closest<HTMLElement>('.auswahl-row')!;
      const referenz = row.dataset.referenz!;
      onToggle(referenz, checkbox.checked);
    });
  });
}
