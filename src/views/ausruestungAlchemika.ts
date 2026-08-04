// Alchemika (reine Preisliste, kein Kompositions-Ergebnis) - siehe ausruestung.ts-Dateikopf
// fuer den Gesamtkontext der Ausruestungs-Ansicht.

import { ALCHEMIKA, type AlchemikaRow } from '../data/equipment/alchemika';
import type { AusruestungCallbacks } from './ausruestung';
import { escapeHtml, kaufenLabel, gesperrtLabel, bestehenderCharakterMode, alchemikaStatTooltip } from './ausruestungShared';

/** Alchemika-Katalog gruppiert nach Kategorie (Gifte/Heiltraenke/Kampftraenke/Parfum/
 *  Zustandstraenke), collapsible je Kategorie (Nutzer 2026-07-19: "Ausgabe collapsible nach
 *  Kategorie") - gleiches Aufklapp-Persistenz-Muster wie openGruppen (ausruestungRuestung.ts). */
export const ALCHEMIKA_KATEGORIEN = [...new Set(ALCHEMIKA.map((r) => r.kategorie))];
export const openAlchemikaKategorien = new Set<string>();

/** Transiente Mengen-Auswahl je Alchemika-Zeile (analog zum Preisliste-Mengenfeld, aber ueber
 *  Re-Renders hinweg gemerkt statt aus dem DOM neu gelesen, da renderAlchemikaRow keine eigene
 *  updatePicker-Funktion braucht). */
const alchemikaQty = new Map<number, number>();

function renderAlchemikaRow(row: AlchemikaRow): string {
  const qty = alchemikaQty.get(row.sourceRow) ?? 1;
  const gesperrt = !bestehenderCharakterMode && row.verfuegbarkeitStufe !== undefined && row.verfuegbarkeitStufe >= 5;
  return `
    <div class="ausruestung-row" data-alchemika="${row.sourceRow}"${alchemikaStatTooltip(row)}>
      <span class="stat-label">${escapeHtml(row.name)}</span>
      <span class="stat-cost">${escapeHtml(row.wirkung)}${row.beschreibung ? ` — ${escapeHtml(row.beschreibung)}` : ''}</span>
      ${row.preisDublonen !== undefined ? `
        <input type="number" class="ausruestung-qty" min="1" value="${qty}" data-alchemika-qty="${row.sourceRow}" ${gesperrt ? 'disabled' : ''}/>
        <button type="button" class="ausruestung-buy-button ausruestung-buy-alchemika${gesperrt ? ' ausruestung-buy-locked' : ''}" data-source-row="${row.sourceRow}" data-unit-price="${row.preisDublonen}" ${gesperrt ? 'disabled' : ''}>${gesperrt ? gesperrtLabel(row.verfuegbarkeitStufe!) : kaufenLabel(row.preisDublonen * qty)}</button>
      ` : `<span class="stat-cost">nicht käuflich (${escapeHtml(row.preisRoh ?? '?')})</span><span></span>`}
    </div>`;
}

export function renderAlchemikaKategorie(kategorie: string, needle: string): string {
  const rows = ALCHEMIKA.filter((r) => r.kategorie === kategorie && (!needle || r.name.toLowerCase().includes(needle)));
  if (rows.length === 0) return '';
  const openAttr = needle || openAlchemikaKategorien.has(kategorie) ? ' open' : '';
  return `
    <div class="stat-card">
      <details class="stat-group" data-alchemika-kategorie="${escapeHtml(kategorie)}"${openAttr}>
        <summary>${escapeHtml(kategorie)} <span class="stat-group-count">(${rows.length} Einträge)</span></summary>
        <div class="stat-subgroup">
          ${rows.map(renderAlchemikaRow).join('')}
        </div>
      </details>
    </div>`;
}

export function wireAlchemikaEvents(container: HTMLElement, callbacks: AusruestungCallbacks): void {
  container.querySelectorAll<HTMLInputElement>('[data-alchemika-qty]').forEach((input) => {
    input.addEventListener('input', () => {
      const sourceRow = Number(input.dataset.alchemikaQty);
      const quantity = Math.max(1, Math.floor(Number(input.value || '1')));
      alchemikaQty.set(sourceRow, quantity);
      const button = container.querySelector<HTMLButtonElement>(`.ausruestung-buy-alchemika[data-source-row="${sourceRow}"]`);
      const unitPrice = Number(button?.dataset.unitPrice);
      if (button && Number.isFinite(unitPrice)) button.textContent = kaufenLabel(unitPrice * quantity);
    });
  });
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy-alchemika').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sourceRow = Number(btn.dataset.sourceRow);
      const quantity = alchemikaQty.get(sourceRow) ?? 1;
      callbacks.onBuyAlchemika(sourceRow, quantity);
    });
  });
}
