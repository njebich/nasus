// Generische Ansicht fuer eine Kategorie: zeigt Art='Wert' editierbar, Art='Fixwert' als
// reinen Referenztext, Art='Formel' als live berechneten (nicht editierbaren) Wert, und
// Art='Pool' als interaktive gAT/gPA/mAT/mPA-Zuteilung mit Budget-/Obergrenzen-Anzeige.
// Art='Auswahl' wird hier NICHT gerendert (siehe views/talenteVornachteile.ts).

import type { ComputedSheet, ComputedRule } from '../engine/characterSheet';
import type { PoolAllocation } from '../state/characterStore';
import { prettyFormula } from '../engine/formulaDisplay';
import { buildHierarchy, type HierarchyNode } from '../engine/hierarchy';
import { describeSkillStufe } from '../engine/skillStufen';
import { LADESCHUETZE_SF_FK_GATE, isLadeschuetzeSfVisible } from '../engine/ladeschuetzeGating';
import { GUT_BASIS, MEISTERLICH_BASIS } from '../engine/poolCaps';
import { isGeweihterTalentSelectedInSheet } from '../engine/geweihte';
import { tooltipAttr } from './tooltip';

export type OnValueChange = (referenz: string, newValue: number) => void;
export type OnPoolChange = (referenz: string, allocation: PoolAllocation) => void;

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function errorNote(r: ComputedRule): string {
  return r.error ? `<span class="stat-error" title="${escapeHtml(r.error)}">⚠</span>` : '';
}

/** Formel-Tooltip fuers Label: zeigt die Formel (formelRaw/poolRaw/kostenRaw) mit Abkuerzungen. */
function formulaTooltip(raw: string | undefined): string {
  if (!raw) return '';
  return tooltipAttr(prettyFormula(raw));
}

// Eigener Trigger (statt am ganzen Row-Label) - Formel-Tooltip und Info-Tooltip sollen
// unabhaengig voneinander per Hover erreichbar sein, siehe PLAN-Tooltip-System.md Phase 2 und
// das gleiche Muster in talenteVornachteile.ts (dort fuer Wirkung statt Info).
function infoIcon(info: string | undefined): string {
  if (!info) return '';
  return `<span class="stat-info-icon"${tooltipAttr(info)}>ⓘ</span>`;
}

/** maxValue: nur bei Spezialisierungen gesetzt (Regel Nutzer 2026-07-17: Spezialisierung
 *  darf nie hoeher als der TaW der Hauptfertigkeit sein) - deckelt Input und "+"-Button. */
function renderEditableRow(r: ComputedRule, maxValue?: number): string {
  const label = escapeHtml(r.rule.beschreibung ?? r.rule.referenz);
  const value = r.currentValue ?? 0;
  const costNext = r.kostenNext !== undefined ? `${r.kostenNext} SP` : '';
  const maxAttr = maxValue !== undefined ? ` max="${maxValue}"` : '';
  const atMax = maxValue !== undefined && value >= maxValue;
  const stufe = describeSkillStufe(r.rule.referenz, value);
  // Eigenschafts-/Attributs-Artefakt-Bonus (Nutzer 2026-07-19): Basiswert bleibt editierbar/
  // unveraendert im Input, der veraenderte Wert steht nur informativ daneben in Klammern -
  // wirkt in allen Formeln, ausser der SP-Kosten-Berechnung (siehe artefaktBonus.ts).
  const alteredHint = r.alteredValue !== undefined
    ? ` <span class="stat-altered" title="Durch Artefakt veraendert">(${r.alteredValue})</span>`
    : '';
  // Formel-Tooltip auf der ganzen Zeile (nicht nur dem Label), damit er auch beim Hover ueber
  // den Wert/die Buttons erscheint - Elemente ohne eigenes title-Attribut fallen auf das des
  // naechsten Vorfahren zurueck.
  return `
    <div class="stat-row" data-referenz="${r.rule.referenz}"${formulaTooltip(r.rule.kostenRaw)}>
      <span class="stat-label">${label}${infoIcon(r.rule.info)}${errorNote(r)}</span>
      <button type="button" class="stat-dec" aria-label="verringern">-</button>
      <input type="number" class="stat-value" min="0"${maxAttr} value="${value}" aria-label="${label}" />${alteredHint}
      <button type="button" class="stat-inc" aria-label="erhöhen" ${atMax ? 'disabled' : ''}>+</button>
      <span class="stat-cost">${stufe ? `(${escapeHtml(stufe)}) ` : ''}${costNext ? `nächster Punkt: ${costNext}` : ''}</span>
    </div>`;
}

/** SF "Ladeschuetze": eigene Gruppe (kein Hauptfertigkeit/Spezialisierung-Verhaeltnis, daher
 *  ad-hoc statt ueber buildHierarchy). Jede Waffenart ist komplett ausgeblendet, bis die
 *  zugehoerige Fernkampf-Fertigkeit > 0 ist (siehe ladeschuetzeGating.ts) - keine Sperr-Anzeige,
 *  einfaches Weglassen. Rendert gar nichts, wenn (noch) keine Zeile sichtbar ist. */
function renderLadeschuetzeGroup(rows: ComputedRule[], sheet: ComputedSheet): string {
  const visible = rows.filter((r) => isLadeschuetzeSfVisible(sheet, r.rule.referenz));
  if (visible.length === 0) return '';
  const groupKey = 'sf_ladeschuetze_gruppe';
  const openAttr = openGroupReferenzen.has(groupKey) ? ' open' : '';
  const body = visible.map((r) => renderEditableRow(r)).join('');
  return `
    <div class="stat-card">
      <details class="stat-group" data-referenz="${groupKey}"${openAttr}>
        <summary>Ladeschütze <span class="stat-group-count">(${visible.length})</span></summary>
        <div class="stat-subgroup">${body}</div>
      </details>
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
    <div class="stat-row stat-row-readonly"${formulaTooltip(r.rule.formelRaw)}>
      <span class="stat-label">${label}${infoIcon(r.rule.info)}</span>
      <span class="stat-value-readonly">${display}</span>
    </div>`;
}

// Merkt sich, welche Gruppen der Spieler aufgeklappt hat - ueberlebt bewusst modul-weit ueber
// einzelne renderCategoryView()-Aufrufe hinweg (Fix Nutzer 2026-07-17: jede Werteingabe loeste
// vorher ein komplettes Neu-Rendern aus, wodurch <details> ohne persistenten Zustand wieder
// zuklappte - frustrierend beim Verteilen mehrerer Spezialisierungspunkte in Folge).
const openGroupReferenzen = new Set<string>();

/** Rendert eine Hauptfertigkeit + ihre Spezialisierungen als aufklappbare Gruppe (0 Kinder = flach).
 *  Das <details> steckt in einer nicht-grid/flex "stat-card"-Huelle: <details> als DIREKTES
 *  Grid-Item hat einen bekannten Chromium-Renderbug, bei dem der geschlossene Zustand (open=false)
 *  korrekt im DOM steht, der Inhalt aber trotzdem sichtbar aus dem Layout "ausbricht". */
function renderGroup(node: HierarchyNode, renderRow: (r: ComputedRule) => string): string {
  if (node.children.length === 0) return renderRow(node.row);
  const label = escapeHtml(node.row.rule.beschreibung ?? node.row.rule.referenz);
  const openAttr = openGroupReferenzen.has(node.row.rule.referenz) ? ' open' : '';
  return `
    <div class="stat-card">
      <details class="stat-group" data-referenz="${node.row.rule.referenz}"${openAttr}>
        <summary>${label} <span class="stat-group-count">(${node.children.length} Spezialisierungen)</span></summary>
        ${renderRow(node.row)}
        <div class="stat-subgroup">${node.children.map(renderRow).join('')}</div>
      </details>
    </div>`;
}

/** Editierbare Gruppe: Spezialisierungen sind erst ab TaW>0 der Hauptfertigkeit "angeboten"
 *  (Regel Nutzer 2026-07-17) - solange die Hauptfertigkeit 0 ist, zeigt die Gruppe nur einen
 *  Hinweis statt der Steuerelemente. Danach ist jede Spezialisierung durch den TaW gedeckelt
 *  (siehe renderEditableRow maxValue + characterMutations.ts setValue). */
function renderEditableGroup(node: HierarchyNode): string {
  if (node.children.length === 0) return renderEditableRow(node.row);
  const label = escapeHtml(node.row.rule.beschreibung ?? node.row.rule.referenz);
  const openAttr = openGroupReferenzen.has(node.row.rule.referenz) ? ' open' : '';
  const hauptwert = node.row.currentValue ?? 0;
  const kinder = hauptwert > 0
    ? node.children.map((r) => renderEditableRow(r, hauptwert)).join('')
    : '<p class="stat-subgroup-locked">Spezialisierungen verfügbar, sobald der TaW über 0 liegt.</p>';
  return `
    <div class="stat-card">
      <details class="stat-group" data-referenz="${node.row.rule.referenz}"${openAttr}>
        <summary>${label} <span class="stat-group-count">(${node.children.length} Spezialisierungen)</span></summary>
        ${renderEditableRow(node.row)}
        <div class="stat-subgroup">${kinder}</div>
      </details>
    </div>`;
}

/** Nahkampf-Tab (Nutzer-Mockup 2026-07-22, "S05 Nahkampfwaffen"): Hauptfertigkeit +
 *  Spezialisierungen als feste Tabelle statt aufklappbarer <details>-Karte (renderEditableGroup) -
 *  eine Tabelle pro Hauptfertigkeit. Jede Spalte (Label/-/Wert/+) ist eine EIGENE <td> (nicht ein
 *  gebuendeltes Steuer-Element), damit alle Spezialisierungen dieselbe Spalte teilen (Nutzer-
 *  Korrektur 2026-07-22: "all spezialisierungen are meant to be in the same column"); die ersten 5
 *  Spalten (Waffe/-/Wert/+/Luecke) der Hauptfertigkeit sind ueber die gesamte Tabellenhoehe gespannt
 *  (rowspan), weil es nur EINEN Hauptfertigkeit-Wert gibt, waehrend Spalte 6-9 (Spezialisierung/-/
 *  Wert/+) sich pro Zeile aendert. Jede -/Wert/+-Zelle behaelt die Klasse "stat-row" (statt einer
 *  Huellen-Div), damit die bestehende Event-Delegation (closest('.stat-row')) unveraendert
 *  weiterfunktioniert - ABER die Zelle selbst darf NIE `display:flex/grid` bekommen (das ist,
 *  wonach `.stat-row` normalerweise aussieht): mehrere BENACHBARTE <td> mit nicht-table-cell
 *  display in derselben <tr> lassen den Browser die Zellen faelschlich in EINER Spalte stapeln
 *  statt sie nebeneinander zu setzen (browser-verifiziert 2026-07-22 - mit Grid/Flex direkt auf
 *  der <td> rutschten alle drei -/Wert/+-Zellen visuell in dieselbe x-Position). Deshalb bleibt
 *  die <td> ein normales table-cell (siehe .nahkampf-ctrl-cell in style.css), und ein etwaiges
 *  zweites Kind (Wert-Input + Kosten-Hinweis) wird in einem inneren <div> zentriert, nicht auf
 *  Zellenebene. */
function renderNahkampfControlCells(r: ComputedRule, rowspan: number | undefined, maxValue?: number): string {
  const label = escapeHtml(r.rule.beschreibung ?? r.rule.referenz);
  const value = r.currentValue ?? 0;
  const costNext = r.kostenNext !== undefined ? `${r.kostenNext} SP` : '';
  const maxAttr = maxValue !== undefined ? ` max="${maxValue}"` : '';
  const atMax = maxValue !== undefined && value >= maxValue;
  const rowspanAttr = rowspan !== undefined ? ` rowspan="${rowspan}"` : '';
  return `
    <td class="stat-row nahkampf-ctrl-cell"${rowspanAttr} data-referenz="${r.rule.referenz}"${formulaTooltip(r.rule.kostenRaw)}>
      <button type="button" class="stat-dec" aria-label="verringern">-</button>
    </td>
    <td class="stat-row nahkampf-ctrl-cell"${rowspanAttr} data-referenz="${r.rule.referenz}">
      <div class="nahkampf-value-inner">
        <input type="number" class="stat-value" min="0"${maxAttr} value="${value}" aria-label="${label}" />
        ${costNext ? `<span class="stat-cost">${costNext}</span>` : ''}
      </div>
    </td>
    <td class="stat-row nahkampf-ctrl-cell"${rowspanAttr} data-referenz="${r.rule.referenz}">
      <button type="button" class="stat-inc" aria-label="erhöhen" ${atMax ? 'disabled' : ''}>+</button>
    </td>`;
}

function renderNahkampfLabelCell(r: ComputedRule, rowspan: number | undefined): string {
  const label = escapeHtml(r.rule.beschreibung ?? r.rule.referenz);
  const rowspanAttr = rowspan !== undefined ? ` rowspan="${rowspan}"` : '';
  return `<td${rowspanAttr}>${label}${infoIcon(r.rule.info)}${errorNote(r)}</td>`;
}

function renderNahkampfSpacerCell(rowspan: number): string {
  return `<td class="nahkampf-spacer-cell" rowspan="${rowspan}"></td>`;
}

function renderNahkampfWaffenGroup(node: HierarchyNode): string {
  const hauptwert = node.row.currentValue ?? 0;
  if (node.children.length === 0) {
    return `
      <table class="bogen-table nahkampf-waffen-table">
        <thead><tr><th>Waffe</th><th></th><th>AT-Basis</th><th></th></tr></thead>
        <tbody><tr>${renderNahkampfLabelCell(node.row, undefined)}${renderNahkampfControlCells(node.row, undefined)}</tr></tbody>
      </table>`;
  }
  if (hauptwert <= 0) {
    return `
      <table class="bogen-table nahkampf-waffen-table">
        <thead><tr><th>Waffe</th><th></th><th>AT-Basis</th><th></th></tr></thead>
        <tbody>
          <tr>${renderNahkampfLabelCell(node.row, undefined)}${renderNahkampfControlCells(node.row, undefined)}</tr>
          <tr><td colspan="4" class="nahkampf-spez-locked">Spezialisierungen verfügbar, sobald der TaW über 0 liegt.</td></tr>
        </tbody>
      </table>`;
  }
  const n = node.children.length;
  const rows = node.children.map((child, i) => `
    <tr>
      ${i === 0 ? `${renderNahkampfLabelCell(node.row, n)}${renderNahkampfControlCells(node.row, n)}${renderNahkampfSpacerCell(n)}` : ''}
      ${renderNahkampfLabelCell(child, undefined)}${renderNahkampfControlCells(child, undefined, hauptwert)}
    </tr>`).join('');
  return `
    <table class="bogen-table nahkampf-waffen-table">
      <thead><tr>
        <th>Waffe</th><th></th><th>AT-Basis</th><th></th><th></th>
        <th>Spezialisierung</th><th></th><th>AT-Basis</th><th></th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function poolFieldReadOnly(label: string, value: number, max: number | undefined): string {
  const maxHint = max !== undefined ? ` / ${max}` : '';
  return `
    <span class="pool-field pool-field-readonly">
      <span>${label}</span>
      <span class="pool-value-readonly">${value}${maxHint}</span>
    </span>`;
}

/** Pool-Zuteilung ist seit dem Kampf-Tab (2026-07-20) reine Anzeige hier: die eigentliche
 *  Verteilung passiert pro besessener Waffe auf dem Kampf-Tab (siehe views/kampf.ts,
 *  onWaffenPoolChange) - diese aggregierte Summe ueber alle Waffen einer Spezialisierung bleibt
 *  nur zur Uebersicht auf dem Nahkampf-Tab stehen. */
function renderPoolRow(r: ComputedRule): string {
  const label = escapeHtml(r.rule.beschreibung ?? r.rule.referenz);
  if (r.error) {
    return `
      <div class="pool-row">
        <div class="stat-label">${label} <span class="stat-error" title="${escapeHtml(r.error)}">nicht definiert ⚠</span></div>
      </div>`;
  }
  const alloc = r.poolAllocation ?? { gat: 0, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 };
  const caps = r.poolCaps;
  const budget = Number(r.computedValue ?? 0) + (r.weaponOverflowBudget ?? 0);
  return `
    <div class="pool-row pool-row-readonly" data-referenz="${r.rule.referenz}">
      <div class="stat-label">${label}</div>
      <div class="pool-budget">Budget: ${formatComputedValue(budget)} | zugeteilt: ${alloc.gat + alloc.gpa + alloc.mat + alloc.mpa + alloc.nat + alloc.npa} | übrig: ${formatComputedValue(r.poolRemaining)} <span class="pool-hint">(Verteilung im Kampf-Tab)</span></div>
      <div class="pool-fields">
        ${poolFieldReadOnly('nAT', alloc.nat, undefined)}
        ${poolFieldReadOnly('gAT', GUT_BASIS + alloc.gat, caps?.gatMax)}
        ${poolFieldReadOnly('mAT', MEISTERLICH_BASIS + alloc.mat, caps?.matMax)}
        ${poolFieldReadOnly('nPA', alloc.npa, undefined)}
        ${poolFieldReadOnly('gPA', GUT_BASIS + alloc.gpa, caps?.gpaMax)}
        ${poolFieldReadOnly('mPA', MEISTERLICH_BASIS + alloc.mpa, caps?.mpaMax)}
      </div>
    </div>`;
}

/** Referenzen, die aus ihrer Kategorie-Liste ausgeblendet werden (Regel Nutzer 2026-07-17):
 *  ep_steigerungspunkte/ep_verbraucht sind in der xlsx als "SUMME(Kosten aller gewaehlten
 *  Werte)"-Formeln modelliert, die die Engine nicht auswerten kann (das kennt nur die App via
 *  spSpent/spRemaining) - die Kopfzeile zeigt den echten Wert bereits, die Zeilen hier waeren
 *  nur ein redundanter Fehler-Eintrag.
 *  Ab Nutzer-Anfrage 2026-07-19: startbudget/-gehoben, LE (alle Koerperteile), Gesundheit,
 *  Stufe, Kreis, Talentpunkte, Macht, Rerolls, Mana, Selbstbeherrschung im Charakterwerte-Tab
 *  ausgeblendet - diese Werte werden andernorts (Charakterbogen/Kopfzeile) dargestellt. */
const HIDDEN_REFERENZEN = new Set([
  'ep_steigerungspunkte', 'ep_verbraucht',
  'startbudget_ausruestung', 'startbudget_ausruestung_gehoben',
  'le_arm_l', 'le_arm_r', 'le_bein_l', 'le_bein_r', 'le_brust', 'le_kopf', 'le_unterleib',
  'gesundheit', 'stufe', 'kreis', 'talentpunkte', 'macht', 'rerolls', 'mana', 'selbstbeherrschung',
]);

export function renderCategoryView(
  container: HTMLElement,
  sheet: ComputedSheet,
  kategorie: string,
  onChange: OnValueChange,
  // Pool-Zeilen sind hier seit dem Kampf-Tab (2026-07-20) reine Anzeige (siehe renderPoolRow) -
  // Parameter bleibt aus Signatur-/Aufrufer-Kompatibilitaet erhalten, wird aber nicht mehr genutzt.
  _onPoolChange: OnPoolChange,
): void {
  // att_karma bleibt aus dem Attribute-Tab ausgeblendet, solange kein Geweihte-Gate-Talent
  // gewaehlt ist (Nutzer 2026-07-22, "rang 0" = "hiding of att_karma from the app").
  const rows = (sheet.byKategorie[kategorie] ?? [])
    .filter((r) => !HIDDEN_REFERENZEN.has(r.rule.referenz))
    .filter((r) => r.rule.referenz !== 'att_karma' || isGeweihterTalentSelectedInSheet(sheet));
  const editable = rows.filter((r) => r.rule.art === 'Wert');
  const readOnly = rows.filter((r) => r.rule.art === 'Fixwert' || r.rule.art === 'Formel' || r.rule.art === 'Lookup');
  const pools = rows.filter((r) => r.rule.art === 'Pool');

  const ladeschuetzeRows = editable.filter((r) => r.rule.referenz in LADESCHUETZE_SF_FK_GATE);
  const restEditable = editable.filter((r) => !(r.rule.referenz in LADESCHUETZE_SF_FK_GATE));
  const editableHierarchy = buildHierarchy(restEditable);
  const readOnlyHierarchy = buildHierarchy(readOnly);
  // Nahkampf-Tab (Nutzer-Mockup 2026-07-22): Waffengruppen als feste Tabelle statt aufklappbarer
  // Karte (siehe renderNahkampfWaffenGroup), und die Kampf-Pools-Sektion faellt komplett weg - die
  // AT-Basis-Spalte in der neuen Tabelle deckt das ab, was dort bisher redundant angezeigt wurde.
  // Andere Kategorien (z.B. "Kampf" mit seinem Leberschutz-Pool) behalten das bisherige Verhalten.
  const isNahkampf = kategorie === 'Nahkampf';
  const editableBlock = isNahkampf
    ? editableHierarchy.map(renderNahkampfWaffenGroup).join('')
    : editableHierarchy.map(renderEditableGroup).join('');

  container.innerHTML = `
    <div class="stat-category">${editableBlock}${renderLadeschuetzeGroup(ladeschuetzeRows, sheet)}</div>
    ${readOnly.length > 0 ? `
      <h3 class="stat-section-heading">Berechnete Werte</h3>
      <div class="stat-category">${readOnlyHierarchy.map((n) => renderGroup(n, renderReadOnlyRow)).join('')}</div>
    ` : ''}
    ${!isNahkampf && pools.length > 0 ? `
      <h3 class="stat-section-heading">Kampf-Pools</h3>
      <div class="pool-category">${pools.map(renderPoolRow).join('')}</div>
    ` : ''}
  `;

  const findCurrent = (referenz: string) => editable.find((r) => r.rule.referenz === referenz)?.currentValue ?? 0;

  // Aufklapp-Zustand SYNCHRON kurz vor jeder Aenderung sichern (nicht ueber das native
  // 'toggle'-Event, das laut HTML-Spec asynchron/queued feuert - bei "aufklappen und sofort
  // im selben Tick einen Wert aendern" war der Event-Handler sonst noch nicht gelaufen, wenn
  // render() das <details> schon neu aufgebaut hat, und die Gruppe klappte faelschlich zu).
  function syncOpenGroups(): void {
    container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-referenz]').forEach((details) => {
      const referenz = details.dataset.referenz!;
      if (details.open) openGroupReferenzen.add(referenz);
      else openGroupReferenzen.delete(referenz);
    });
  }

  container.querySelectorAll<HTMLButtonElement>('.stat-inc').forEach((btn) => {
    btn.addEventListener('click', () => {
      const row = btn.closest<HTMLElement>('.stat-row')!;
      const referenz = row.dataset.referenz!;
      syncOpenGroups();
      onChange(referenz, findCurrent(referenz) + 1);
    });
  });
  container.querySelectorAll<HTMLButtonElement>('.stat-dec').forEach((btn) => {
    btn.addEventListener('click', () => {
      const row = btn.closest<HTMLElement>('.stat-row')!;
      const referenz = row.dataset.referenz!;
      syncOpenGroups();
      onChange(referenz, Math.max(0, findCurrent(referenz) - 1));
    });
  });
  container.querySelectorAll<HTMLInputElement>('.stat-value').forEach((input) => {
    input.addEventListener('change', () => {
      const row = input.closest<HTMLElement>('.stat-row')!;
      const referenz = row.dataset.referenz!;
      let parsed = Math.max(0, Math.floor(Number(input.value)));
      if (input.max) parsed = Math.min(parsed, Number(input.max));
      syncOpenGroups();
      onChange(referenz, Number.isFinite(parsed) ? parsed : findCurrent(referenz));
    });
  });

  // Pool-Zuteilung ist hier seit dem Kampf-Tab (2026-07-20) reine Anzeige (renderPoolRow) - keine
  // Eingabefelder mehr, daher keine Event-Wiring noetig (Verteilung passiert jetzt pro Waffe auf
  // dem Kampf-Tab, siehe views/kampf.ts).
}
