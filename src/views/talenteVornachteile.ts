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

export function renderAuswahlView(
  container: HTMLElement,
  sheet: ComputedSheet,
  kategorie: string,
  groupByParent: boolean,
  onToggle: OnToggle,
  characterReligion?: string,
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
      .map(([parent, groupRows]) => {
        const openAttr = openParents.has(parent) ? ' open' : '';
        return `
          <div class="stat-card">
            <details class="stat-group" data-parent="${escapeHtml(parent)}"${openAttr}>
              <summary>${escapeHtml(parent)} <span class="stat-group-count">(${groupRows.length})</span></summary>
              <div class="auswahl-category">${groupRows.map((r) => renderRow(r, sheet, characterReligion)).join('')}</div>
            </details>
          </div>`;
      }).join('');
  } else {
    html = `<div class="auswahl-category">${rows.map((r) => renderRow(r, sheet, characterReligion)).join('')}</div>`;
  }

  container.innerHTML = html;

  container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-parent]').forEach((details) => {
    const parent = details.dataset.parent!;
    details.addEventListener('toggle', () => {
      if (details.open) openParents.add(parent);
      else openParents.delete(parent);
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
