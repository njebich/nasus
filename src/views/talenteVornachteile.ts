// Auswahl-Ansicht fuer Talente und Vor-/Nachteile: Checkbox-Liste statt Zahlen-Stepper.
// Talente werden zur Uebersicht nach Charakterklasse (Parent) gruppiert - das ist reine
// Kategorisierung, KEINE Kaufsperre: jeder Charakter kann jedes Talent kaufen (siehe Plan).

import type { ComputedSheet, ComputedRule } from '../engine/characterSheet';
import { prettyFormula } from '../engine/formulaDisplay';
import { tooltipAttr } from './tooltip';
import {
  GEWEIHTER_TALENT_PREFIX, GEWEIHTER_RELIGION_BY_REFERENZ, getGeweihtenGrad, getGeweihtenGradEintrag,
  isGeweihterReferenzErlaubt,
} from '../engine/geweihte';

export type OnToggle = (referenz: string, selected: boolean) => void;

/** Aufgeklappte Talente-Gruppen (Parent/Charakterklasse) - Persistenz-Muster wie openSchulen in
 *  spruchmagie.ts/openGroupReferenzen in categoryView.ts. Alle standardmaessig zu. */
const openParents = new Set<string>();

/** Aufgeklappte Vor-/Nachteile-Gruppen ("Nachteile"/"Vorteile"/"Ängste") - eigenes Set statt
 *  openParents, damit ein gleichnamiger Talente-Parent nicht kollidiert. Gleiches Persistenz-
 *  Muster, alle standardmaessig zu. */
const openVnGroups = new Set<string>();

/** Suchtext pro Kategorie (Talente/Vor- und Nachteile teilen sich dieses Modul, brauchen aber
 *  unabhaengige Suchfelder) - gleiches Persistenz-Muster wie searchText in ausruestung.ts. */
const searchTextByKategorie = new Map<string, string>();

/** "Nur kaufbare zeigen"-Filter (Nutzer 2026-07-22, auf Vor-/Nachteile erweitert) - blendet
 *  Eintraege aus, deren kostenSelect den aktuell verfuegbaren Pool (TaP bei Talente, SP bei
 *  Vor-/Nachteile) uebersteigt. Bereits gewaehlte Eintraege bleiben immer sichtbar (sonst liesse
 *  sich ein zu teurer, aber schon gekaufter Eintrag nicht abwaehlen). */
const nurKaufbareByKategorie = new Map<string, boolean>();

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formulaTooltip(raw: string | undefined): string {
  if (!raw) return '';
  return tooltipAttr(prettyFormula(raw));
}

// Eigener Trigger (statt am ganzen Row-Label) - Kosten-Tooltip (formulaTooltip) und
// Wirkung-Tooltip sollen unabhaengig voneinander per Hover erreichbar sein, siehe
// PLAN-Tooltip-System.md Phase 2 Punkt 1: Wirkung statt Kosten im Tooltip.
function wirkungIcon(wirkung: string | undefined): string {
  if (!wirkung) return '';
  return `<span class="stat-info-icon"${tooltipAttr(wirkung)}>ⓘ</span>`;
}

/** Geweihte-Gate-Talente zeigen den aktuellen Geweihtengrad-Titel dynamisch vor dem Basisnamen
 *  (Nutzer 2026-07-22: "dynamic name, no mention at grad 0") - nur wenn das Talent selbst
 *  bereits gewaehlt ist, sonst bleibt der statische xlsx-Name ("Geweihter von X, Orthodox"). */
function geweihterLabel(r: ComputedRule, sheet: ComputedSheet): string {
  const base = r.rule.beschreibung ?? r.rule.referenz;
  if (!r.rule.referenz.startsWith(GEWEIHTER_TALENT_PREFIX) || !r.selected) return base;
  const titel = getGeweihtenGradEintrag(getGeweihtenGrad(sheet)).titel;
  return titel ? `${titel} ${base}` : base;
}

/** Geweihte-Gate-Talente sind hinter der im Charakterheader gewaehlten Religion+Sekte gesperrt
 *  (Nutzer 2026-07-22: "gate talents behind chosen religion") - siehe
 *  engine/geweihte.ts#isGeweihterReferenzErlaubt. Nicht-Gate-Talente sind immer erlaubt. */
function geweihterSperrTitle(referenz: string): string {
  const info = GEWEIHTER_RELIGION_BY_REFERENZ[referenz.toLowerCase()];
  if (!info) return '';
  return `Erfordert Religion "${info.religion}, ${info.sekte}" (Feld "Religion"/"Sekte" im Charakterheader)`;
}

function renderRow(r: ComputedRule, sheet: ComputedSheet, characterReligion: string | undefined): string {
  const label = escapeHtml(geweihterLabel(r, sheet));
  // Talente kosten TaP (eigener, von SP komplett getrennter Pool), alles andere (z.B.
  // Vor-/Nachteile) kostet SP - siehe characterSheet.ts.
  const waehrung = r.rule.kategorie === 'Talente' ? 'TaP' : 'SP';
  const cost = r.kostenSelect !== undefined ? `${r.kostenSelect > 0 ? '-' : '+'}${Math.abs(r.kostenSelect)} ${waehrung}` : '';
  const errorNote = r.error ? `<span class="stat-error" title="${escapeHtml(r.error)}">⚠</span>` : '';
  const erlaubt = isGeweihterReferenzErlaubt(r.rule.referenz, characterReligion);
  // Analog zu ki-row-locked/ki-row-invalid (views/ki.ts): gesperrt (nicht gewaehlt) wird gedimmt,
  // eine bereits gewaehlte aber nicht mehr passende Auswahl (Religion nachtraeglich geaendert)
  // bleibt sichtbar/abwaehlbar, aber rot markiert statt stillschweigend entfernt zu werden.
  const rowClass = erlaubt ? '' : r.selected ? 'ki-row-invalid' : 'ki-row-locked';
  const sperrTitle = erlaubt ? '' : ` title="${escapeHtml(geweihterSperrTitle(r.rule.referenz))}"`;
  return `
    <label class="auswahl-row${rowClass ? ` ${rowClass}` : ''}" data-referenz="${r.rule.referenz}"${formulaTooltip(r.rule.kostenRaw)}${sperrTitle}>
      <input type="checkbox" class="auswahl-checkbox" ${r.selected ? 'checked' : ''} ${!erlaubt && !r.selected ? 'disabled' : ''} />
      <span class="stat-label">${label}${wirkungIcon(r.rule.wirkung)}${errorNote}</span>
      <span class="stat-cost">${cost}</span>
    </label>`;
}

/** Vor-/Nachteile werden statt nach Parent (siehe groupByParent) nach Kostenvorzeichen sortiert:
 *  ein Eintrag mit kostenSelect < 0 zahlt SP aus (Nachteil), >= 0 kostet SP (Vorteil) - siehe
 *  waehrung/cost in renderRow. Alle Angst:*-Parents (siehe vor-und-nachteile.jsonl) werden
 *  zusaetzlich in einer eigenen "Ängste"-Unterguppe innerhalb Nachteile gebuendelt, statt wie bei
 *  Talente-groupByParent je Angstart eine eigene Top-Level-Gruppe zu bilden. */
/** Immer sichtbare "Gekauft"-Sektion oben in der Liste (Nutzer 2026-07-23: "uncouple all bought
 *  talente, always display on top even if all categories are collapsed") - zusaetzlich zur
 *  gewohnten Parent-/Vor-Nachteile-Gruppierung, nicht ersetzend (Eintraege bleiben dort auch
 *  weiterhin sichtbar). Bewusst KEIN <details>, damit die Sektion sich nicht zuklappen laesst. */
function renderGekauftSection(
  rows: ComputedRule[],
  sheet: ComputedSheet,
  characterReligion: string | undefined,
): string {
  const gekauft = rows.filter((r) => r.selected);
  if (gekauft.length === 0) return '';
  return `
    <div class="stat-card">
      <div class="stat-group gekauft-group">
        <div class="gekauft-header">Gekauft <span class="stat-group-count">(${gekauft.length})</span></div>
        <div class="auswahl-category">${gekauft.map((r) => renderRow(r, sheet, characterReligion)).join('')}</div>
      </div>
    </div>`;
}

function renderVnGroups(
  rows: ComputedRule[],
  sheet: ComputedSheet,
  characterReligion: string | undefined,
  needle: string,
): string {
  const nachteile = rows.filter((r) => (r.kostenSelect ?? 0) < 0);
  const vorteile = rows.filter((r) => (r.kostenSelect ?? 0) >= 0);
  const isAngst = (r: ComputedRule) => (r.rule.parent ?? '').startsWith('Angst:');
  const angste = nachteile.filter(isAngst);
  const nachteileRest = nachteile.filter((r) => !isAngst(r));

  const openNachteile = needle || openVnGroups.has('Nachteile');
  const openVorteile = needle || openVnGroups.has('Vorteile');
  const openAngste = needle || openVnGroups.has('Ängste');

  const angsteHtml = angste.length ? `
    <details class="stat-group" data-vn-group="Ängste"${openAngste ? ' open' : ''}>
      <summary>Ängste <span class="stat-group-count">(${angste.length})</span></summary>
      <div class="auswahl-category">${angste.map((r) => renderRow(r, sheet, characterReligion)).join('')}</div>
    </details>` : '';

  const nachteileHtml = `
    <div class="stat-card">
      <details class="stat-group" data-vn-group="Nachteile"${openNachteile ? ' open' : ''}>
        <summary>Nachteile <span class="stat-group-count">(${nachteile.length})</span></summary>
        <div class="auswahl-category">${nachteileRest.map((r) => renderRow(r, sheet, characterReligion)).join('')}</div>
        ${angsteHtml}
      </details>
    </div>`;

  const vorteileHtml = `
    <div class="stat-card">
      <details class="stat-group" data-vn-group="Vorteile"${openVorteile ? ' open' : ''}>
        <summary>Vorteile <span class="stat-group-count">(${vorteile.length})</span></summary>
        <div class="auswahl-category">${vorteile.map((r) => renderRow(r, sheet, characterReligion)).join('')}</div>
      </details>
    </div>`;

  return nachteileHtml + vorteileHtml;
}

export function renderAuswahlView(
  container: HTMLElement,
  sheet: ComputedSheet,
  kategorie: string,
  groupByParent: boolean,
  onToggle: OnToggle,
  characterReligion?: string,
): void {
  // VOR dem innerHTML-Ersatz sichern, ob das Suchfeld gerade fokussiert war (und an welcher
  // Cursor-Position) - sonst wuerde JEDER Re-Render dieser View (auch durch Checkbox-Klicks
  // ausgeloest) den Fokus stehlen bzw. verlieren.
  const prevSearchInput = container.querySelector<HTMLInputElement>('#auswahl-search');
  const searchWasFocused = prevSearchInput !== null && document.activeElement === prevSearchInput;
  const prevSelectionStart = prevSearchInput?.selectionStart ?? null;

  // Talente kosten TaP, Vor-/Nachteile kosten SP (siehe waehrung in renderRow) - der Filter
  // vergleicht kostenSelect jeweils gegen den passenden verbleibenden Pool.
  const budgetRemaining = kategorie === 'Talente' ? sheet.tapRemaining : sheet.spRemaining;
  const nurKaufbare = nurKaufbareByKategorie.get(kategorie) ?? false;

  const allRows = (sheet.byKategorie[kategorie] ?? []).filter((r) => r.rule.art === 'Auswahl');
  const searchText = searchTextByKategorie.get(kategorie) ?? '';
  const needle = searchText.trim().toLowerCase();
  let rows = needle ? allRows.filter((r) => geweihterLabel(r, sheet).toLowerCase().includes(needle)) : allRows;
  if (nurKaufbare) {
    rows = rows.filter((r) => r.selected || r.kostenSelect === undefined || r.kostenSelect <= budgetRemaining);
  }

  const filtersHtml = `
    <div class="ausruestung-filters">
      <input type="text" id="auswahl-search" placeholder="Suche..." value="${escapeHtml(searchText)}" />
      <label class="auswahl-filter-checkbox">
        <input type="checkbox" id="auswahl-nur-kaufbare" ${nurKaufbare ? 'checked' : ''} />
        Nur kaufbare zeigen
      </label>
    </div>`;

  let listHtml: string;
  if (rows.length === 0 && needle) {
    listHtml = `<p class="auswahl-empty">Keine Treffer für "${escapeHtml(searchText)}".</p>`;
  } else if (kategorie === 'Vor- und Nachteile') {
    listHtml = renderGekauftSection(rows, sheet, characterReligion) + renderVnGroups(rows, sheet, characterReligion, needle);
  } else if (groupByParent) {
    const groups = new Map<string, ComputedRule[]>();
    for (const r of rows) {
      const key = r.rule.parent ?? 'Sonstige';
      (groups.get(key) ?? groups.set(key, []).get(key)!).push(r);
    }
    listHtml = renderGekauftSection(rows, sheet, characterReligion) + [...groups.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([parent, groupRows]) => {
        // Bei aktiver Suche werden alle Gruppen mit Treffern zwangsweise aufgeklappt, OHNE den
        // manuellen Aufklapp-Zustand (openParents) zu ueberschreiben - nach Leeren des Suchfelds
        // erscheinen die Gruppen wieder so, wie der Nutzer sie zuletzt gelassen hat.
        const openAttr = needle || openParents.has(parent) ? ' open' : '';
        return `
          <div class="stat-card">
            <details class="stat-group" data-parent="${escapeHtml(parent)}"${openAttr}>
              <summary>${escapeHtml(parent)} <span class="stat-group-count">(${groupRows.length})</span></summary>
              <div class="auswahl-category">${groupRows.map((r) => renderRow(r, sheet, characterReligion)).join('')}</div>
            </details>
          </div>`;
      }).join('');
  } else {
    listHtml = `<div class="auswahl-category">${rows.map((r) => renderRow(r, sheet, characterReligion)).join('')}</div>`;
  }

  container.innerHTML = filtersHtml + listHtml;

  const searchInput = container.querySelector<HTMLInputElement>('#auswahl-search');
  if (searchInput) {
    if (searchWasFocused) {
      searchInput.focus();
      const pos = prevSelectionStart ?? searchInput.value.length;
      searchInput.setSelectionRange(pos, pos);
    }
    searchInput.addEventListener('input', (e) => {
      searchTextByKategorie.set(kategorie, (e.target as HTMLInputElement).value);
      renderAuswahlView(container, sheet, kategorie, groupByParent, onToggle, characterReligion);
    });
  }

  const nurKaufbareCheckbox = container.querySelector<HTMLInputElement>('#auswahl-nur-kaufbare');
  nurKaufbareCheckbox?.addEventListener('change', (e) => {
    nurKaufbareByKategorie.set(kategorie, (e.target as HTMLInputElement).checked);
    renderAuswahlView(container, sheet, kategorie, groupByParent, onToggle, characterReligion);
  });

  container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-parent]').forEach((details) => {
    const parent = details.dataset.parent!;
    details.addEventListener('toggle', () => {
      if (details.open) openParents.add(parent);
      else openParents.delete(parent);
    });
  });

  container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-vn-group]').forEach((details) => {
    const group = details.dataset.vnGroup!;
    details.addEventListener('toggle', () => {
      if (details.open) openVnGroups.add(group);
      else openVnGroups.delete(group);
    });
  });

  // Aufklapp-Zustand SYNCHRON vor jeder Aenderung sichern - selbes Muster wie syncOpenGroups in
  // categoryView.ts (das native 'toggle'-Event feuert laut Spec asynchron/queued, ein Checkbox-
  // Klick direkt nach dem Aufklappen koennte sonst vor dem Toggle-Handler re-rendern und die
  // Gruppe faelschlich zuklappen lassen).
  function syncOpenParents(): void {
    container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-parent]').forEach((details) => {
      const parent = details.dataset.parent!;
      if (details.open) openParents.add(parent);
      else openParents.delete(parent);
    });
    container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-vn-group]').forEach((details) => {
      const group = details.dataset.vnGroup!;
      if (details.open) openVnGroups.add(group);
      else openVnGroups.delete(group);
    });
  }

  container.querySelectorAll<HTMLInputElement>('.auswahl-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const row = checkbox.closest<HTMLElement>('.auswahl-row')!;
      const referenz = row.dataset.referenz!;
      syncOpenParents();
      onToggle(referenz, checkbox.checked);
    });
  });
}
