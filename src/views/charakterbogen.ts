// Charakterbogen: kompakte, rein lesbare End-Ansicht "wie der Charakter dargestellt werden
// soll, nachdem er fertig gesteigert ist" (Nutzer-Mockup 2026-07-17) - ein zusaetzlicher Tab
// neben den editierbaren Punktekauf-Tabs, kein Ersatz dafuer.

import type { ComputedSheet, ComputedRule } from '../engine/characterSheet';
import type { CharacterState, CharacterHeader } from '../state/characterStore';
import { buildHierarchy, sortHierarchyByValue, type HierarchyNode } from '../engine/hierarchy';
import { describeSkillStufe } from '../engine/skillStufen';
import { tooltipAttr } from './tooltip';
import { renderKampfLeRs } from './kampfLeRs';
import {
  buildAusweichenRow, buildLoadoutDisplayRows, formatLoadoutCells, type LoadoutDisplayRow,
} from './kampf';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatValue(value: unknown): string {
  if (typeof value === 'number') return String(Math.round(value * 100) / 100);
  if (value == null) return '–';
  return String(value);
}

function findRule(rows: ComputedRule[], referenz: string): ComputedRule | undefined {
  return rows.find((r) => r.rule.referenz === referenz);
}

type TextHeaderKey = Exclude<keyof CharacterHeader, 'herkunftSnapshot'>;

function headerField(character: CharacterState, key: TextHeaderKey, label: string): string {
  return `<tr><th>${label}</th><td>${escapeHtml(character[key] ?? '')}</td></tr>`;
}

function herkunftField(character: CharacterState): string {
  const snapshot = character.herkunftSnapshot;
  const text = snapshot ? [snapshot.name, snapshot.region, snapshot.welt].filter(Boolean).join(', ') : '';
  return `<tr><th>Herkunft</th><td>${escapeHtml(text)}</td></tr>`;
}

function renderHeaderTable(character: CharacterState): string {
  return `
    <div class="bogen-header">
      <h2 class="bogen-name">${escapeHtml(character.name)}</h2>
      <div class="bogen-header-columns">
        <table class="bogen-table">
          ${headerField(character, 'spezies', 'Spezies')}
          ${headerField(character, 'beruf', 'Beruf')}
          ${headerField(character, 'alter', 'Alter')}
          ${headerField(character, 'geburtstag', 'Geburtstag')}
          ${herkunftField(character)}
          ${headerField(character, 'familie', 'Familie')}
          ${headerField(character, 'religion', 'Religion')}
        </table>
        <table class="bogen-table">
          ${headerField(character, 'groesse', 'Größe')}
          ${headerField(character, 'gewicht', 'Gewicht')}
          ${headerField(character, 'haarfarbe', 'Haarfarbe')}
          ${headerField(character, 'haarschnitt', 'Haarschnitt')}
          ${headerField(character, 'bartwuchs', 'Bartwuchs')}
          ${headerField(character, 'hautfarbe', 'Hautfarbe')}
          ${headerField(character, 'augenfarbe', 'Augenfarbe')}
        </table>
      </div>
    </div>`;
}

const CHARAKTERWERTE_LEISTE = ['kreis', 'stufe', 'macht', 'mana', 'rerolls'];

function renderCharakterwerteUndAttribute(sheet: ComputedSheet): string {
  const charakterwerte = sheet.byKategorie['Charakterwerte'] ?? [];
  const attribute = sheet.byKategorie['Attribute'] ?? [];
  const werteRows = CHARAKTERWERTE_LEISTE
    .map((ref) => findRule(charakterwerte, ref))
    .filter((r): r is ComputedRule => r !== undefined)
    .map((r) => `<tr><th>${escapeHtml(r.rule.beschreibung ?? r.rule.referenz)}</th><td>${formatValue(r.computedValue)}</td></tr>`)
    .join('');
  const epSpRows = `
    <tr><th>Erfahrungspkt.</th><td><span class="numeric-field-output numeric-field-signed-five">${sheet.epGesamt}</span></td></tr>
    <tr><th>Steigerungspkt.</th><td><span class="numeric-field-output numeric-field-signed-five">${sheet.spRemaining}</span> / <span class="numeric-field-output numeric-field-signed-five">${sheet.spTotal}</span></td></tr>`;
  // Nutzer 2026-07-24 (categoryView.ts's ATTRIBUTE_KLICKPREIS_TEXT): dieselbe vereinfachte
  // Klickpreis-Formel wie im editierbaren Attribute-Tab, hier auf den Zeilen des read-only
  // Charakterbogens gespiegelt ("wire same tooltips to same values/descriptions").
  const attributeRows = attribute
    .map((r) => `<tr${tooltipAttr('80 + Wert*20')}><th>${escapeHtml(r.rule.beschreibung ?? r.rule.referenz)}</th><td>${r.currentValue ?? formatValue(r.computedValue)}${r.alteredValue !== undefined ? ` (${r.alteredValue})` : ''}</td></tr>`)
    .join('');
  return `
    <div class="bogen-zwei-spalten">
      <table class="bogen-table">${werteRows}${epSpRows}</table>
      <table class="bogen-table"><tr><th colspan="2">Attribute</th></tr>${attributeRows}</table>
    </div>`;
}

export const EIGENSCHAFTEN_PAARE: Array<[string, string]> = [
  ['eig_k_ausstrahlung', 'eig_k_athletik'],
  ['eig_g_intelligenz', 'eig_k_geschicklichkeit'],
  ['eig_g_mut', 'eig_k_konstitution'],
  ['eig_g_sinneschaerfe', 'eig_k_schnelligkeit'],
  ['eig_g_willenskraft', 'eig_k_staerke'],
];

function eigenschaftZellen(eigenschaft: ComputedRule[], bonus: ComputedRule[], referenz: string): string {
  const eig = findRule(eigenschaft, referenz);
  if (!eig) return '<td></td><td></td><td></td>';
  const bonusRef = referenz.replace(/^eig_/, 'eig_bonus_');
  const bon = findRule(bonus, bonusRef);
  // Nutzer 2026-07-24 ("on hover, show (i) text, not sverweis"): gleicher Info-Text wie auf dem
  // editierbaren Eigenschaft-Tab (categoryView.ts's INFO_STATT_KOSTEN_KATEGORIEN), hier gespiegelt.
  return `
    <td${tooltipAttr(eig.rule.info)}>${escapeHtml(eig.rule.beschreibung ?? eig.rule.referenz)} (${escapeHtml(eig.rule.abkuerzung ?? '')})</td>
    <td>${eig.currentValue ?? 0}${eig.alteredValue !== undefined ? ` (${eig.alteredValue})` : ''}</td>
    <td>${bon ? formatValue(bon.computedValue) : ''}</td>`;
}

function renderEigenschaften(sheet: ComputedSheet): string {
  const eigenschaft = sheet.byKategorie['Eigenschaft'] ?? [];
  const bonus = sheet.byKategorie['Eigenschaftsbonus'] ?? [];
  const rows = EIGENSCHAFTEN_PAARE.map(([links, rechts]) => `
    <tr>
      ${eigenschaftZellen(eigenschaft, bonus, links)}
      ${eigenschaftZellen(eigenschaft, bonus, rechts)}
    </tr>`).join('');
  return `
    <h3 class="bogen-section-heading">Eigenschaften</h3>
    <table class="bogen-table bogen-table-eigenschaften">${rows}</table>`;
}

function renderAuswahlListe(sheet: ComputedSheet, kategorie: string, ueberschrift: string): string {
  const gewaehlt = (sheet.byKategorie[kategorie] ?? []).filter((r) => r.selected);
  if (gewaehlt.length === 0) return `<h3 class="bogen-section-heading">${escapeHtml(ueberschrift)}</h3><p class="bogen-leer">– keine –</p>`;
  // Nutzer 2026-07-24 ("show Wirkung, not SP cost"): gleicher Tooltip-Inhalt wie im editierbaren
  // Talente-/Vor-Nachteile-Tab (talenteVornachteile.ts's wirkungTooltip/wirkungIcon), hier gespiegelt.
  const items = gewaehlt.map((r) => `<li${tooltipAttr(r.rule.wirkung)}>${escapeHtml(r.rule.beschreibung ?? r.rule.referenz)}</li>`).join('');
  return `<h3 class="bogen-section-heading">${escapeHtml(ueberschrift)}</h3><ul class="bogen-liste">${items}</ul>`;
}

/** Rendert eine Hauptfertigkeit + ihre Spezialisierungen als eingerueckte Tabellenzeilen. */
function renderFertigkeitGruppe(node: HierarchyNode): string {
  const hauptzeile = `<tr><td>${escapeHtml(node.row.rule.beschreibung ?? node.row.rule.referenz)}</td><td>${node.row.currentValue ?? 0}</td></tr>`;
  const kinderzeilen = node.children
    .map((r) => `<tr class="bogen-spez"><td>${escapeHtml(r.rule.beschreibung ?? r.rule.referenz)}</td><td>${r.currentValue ?? 0}</td></tr>`)
    .join('');
  return hauptzeile + kinderzeilen;
}

function renderGrundfertigkeiten(sheet: ComputedSheet): string {
  // Nutzer 2026-07-24 ("show (i) text, not Wert*9"): gleicher Info-Text wie im editierbaren
  // Grundfertigkeit-Tab (categoryView.ts's INFO_STATT_KOSTEN_KATEGORIEN), hier gespiegelt.
  const rows = (sheet.byKategorie['Grundfertigkeit'] ?? [])
    .map((r) => `<tr${tooltipAttr(r.rule.info)}><td>${escapeHtml(r.rule.beschreibung ?? r.rule.referenz)}</td><td>${r.currentValue ?? 0}</td></tr>`)
    .join('');
  return `
    <div class="bogen-fertigkeit-spalte">
      <h4>Grundfertigkeiten</h4>
      <table class="bogen-table">${rows}</table>
    </div>`;
}

/** Wie renderFertigkeitGruppe, aber nur TaW>0-Zeilen: Hauptfertigkeit ohne TaW wird nicht
 *  gezeigt, und ihre Spezialisierungen einzeln nur, wenn sie selbst TaW>0 haben. */
function renderFertigkeitGruppeNurTaw(node: HierarchyNode): string {
  const hauptzeile = `<tr><td>${escapeHtml(node.row.rule.beschreibung ?? node.row.rule.referenz)}</td><td>${node.row.currentValue ?? 0}</td></tr>`;
  const kinderzeilen = node.children
    .filter((r) => (r.currentValue ?? 0) > 0)
    .map((r) => `<tr class="bogen-spez"><td>${escapeHtml(r.rule.beschreibung ?? r.rule.referenz)}</td><td>${r.currentValue ?? 0}</td></tr>`)
    .join('');
  return hauptzeile + kinderzeilen;
}

function renderKampffertigkeiten(sheet: ComputedSheet): string {
  const nahkampf = (sheet.byKategorie['Nahkampf'] ?? []).filter((r) => r.rule.art === 'Wert');
  const fernkampf = (sheet.byKategorie['Fernkampf'] ?? []).filter((r) => r.rule.art === 'Wert');
  const hierarchie = sortHierarchyByValue(buildHierarchy([...nahkampf, ...fernkampf]))
    .filter((node) => (node.row.currentValue ?? 0) > 0);
  const rows = hierarchie.map(renderFertigkeitGruppeNurTaw).join('');
  return `
    <div class="bogen-fertigkeit-spalte">
      <h4>Kampffertigkeiten</h4>
      <table class="bogen-table">${rows}</table>
    </div>`;
}

/** Alle besessenen ssk_sprache_.../ssk_kultur_.../ssk_schrift_...-Faehigkeiten (Wert>0) mit
 *  benannter Stufe, wo vorhanden - ersetzt die frueher feste Volk/Sprache/Kultur-Zeile,
 *  seit es keinen kostenlosen Einzel-Grant mehr gibt (Nutzer 2026-07-17). */
function renderSpracheUndKultur(sheet: ComputedSheet): string {
  const alle = (sheet.byKategorie['Sprache & Kultur'] ?? []).filter((r) => (r.currentValue ?? 0) > 0);
  const rows = alle.length > 0
    ? alle.map((r) => {
        const wert = r.currentValue ?? 0;
        const stufe = describeSkillStufe(r.rule.referenz, wert);
        return `<tr><th>${escapeHtml(r.rule.beschreibung ?? r.rule.referenz)}</th><td>${wert}${stufe ? ` (${escapeHtml(stufe)})` : ''}</td></tr>`;
      }).join('')
    : '<tr><td colspan="2">– keine –</td></tr>';
  return `
    <div class="bogen-fertigkeit-spalte">
      <h4>Sprache &amp; Kultur</h4>
      <table class="bogen-table">${rows}</table>
      ${renderWhkNurGewaehlt(sheet)}
    </div>`;
}

function renderWhkNurGewaehlt(sheet: ComputedSheet): string {
  const whk = (sheet.byKategorie['WHK'] ?? []).filter((r) => (r.currentValue ?? 0) > 0);
  if (whk.length === 0) return '<h4>WHK</h4><p class="bogen-leer">– keine –</p>';
  const hierarchie = sortHierarchyByValue(buildHierarchy(whk));
  const rows = hierarchie.map(renderFertigkeitGruppe).join('');
  return `<h4>WHK</h4><table class="bogen-table bogen-table-whk">${rows}</table>`;
}

/** Read-only Spiegelung NUR der favorisierten Waffen-Loadouts (2026-07-22) - gleiche Zellen wie
 *  die Kampf-Tab-Tabelle, ohne Favorit-/Entfernen-Steuerelemente. */
function renderNkLoadoutMirrorRow(row: LoadoutDisplayRow): string {
  const cells = formatLoadoutCells(row.result);
  if ('error' in cells) {
    return `
      <tr class="kampf-row-unusable" title="${escapeHtml(cells.error)}">
        <td>${escapeHtml(row.displayName)}</td><td colspan="8">${escapeHtml(cells.error)}</td>
      </tr>`;
  }
  const pool = row.pool;
  return `
    <tr>
      <td>${escapeHtml(row.displayName)}</td>
      <td>${escapeHtml(cells.schaden)}</td>
      <td>${escapeHtml(cells.wk)}</td>
      <td>${escapeHtml(cells.nat)}</td>
      <td>${pool ? pool.gat : '–'}</td>
      <td>${pool ? pool.mat : '–'}</td>
      <td>${escapeHtml(cells.npa)}</td>
      <td>${pool ? pool.gpa : '–'}</td>
      <td>${pool ? pool.mpa : '–'}</td>
    </tr>`;
}

function renderFkLoadoutMirrorRow(row: LoadoutDisplayRow, showRight: boolean, showLeft: boolean): string {
  const cells = formatLoadoutCells(row.result);
  if ('error' in cells) {
    const dataColumns = (showRight ? 2 : 0) + (showLeft ? 2 : 0);
    return `
      <tr class="kampf-row-unusable" title="${escapeHtml(cells.error)}">
        <td>${escapeHtml(row.displayName)}</td><td colspan="${dataColumns}">${escapeHtml(cells.error)}</td>
      </tr>`;
  }
  return `
    <tr>
      <td>${escapeHtml(row.displayName)}</td>
      ${showRight ? `<td>${escapeHtml(cells.fkSchadenR)}</td>` : ''}
      ${showLeft ? `<td>${escapeHtml(cells.fkSchadenL)}</td>` : ''}
      ${showRight ? `<td>${escapeHtml(cells.fkReichweitenR)}</td>` : ''}
      ${showLeft ? `<td>${escapeHtml(cells.fkReichweitenL)}</td>` : ''}
    </tr>`;
}

function renderWaffenLoadoutMirror(sheet: ComputedSheet, character: CharacterState): string {
  const favorites = buildLoadoutDisplayRows(character, sheet).filter((r) => r.entry.favorite);
  if (favorites.length === 0) return '';
  const nkRows = favorites.filter((row) => row.entry.comboType === 'nk1h' || row.entry.comboType === 'nk2h'
    || row.entry.comboType === 'nk1h_nk1h' || row.entry.comboType === 'nk1h_pistole'
    || row.entry.comboType === 'nk1h_schild' || row.entry.comboType === 'schild_pistole');
  const fkRows = favorites.filter((row) => row.entry.comboType === 'pistole' || row.entry.comboType === 'muskete'
    || row.entry.comboType === 'armbrust' || row.entry.comboType === 'bogen'
    || row.entry.comboType === 'nk1h_pistole'
    || row.entry.comboType === 'schild_pistole' || row.entry.comboType === 'pistole_pistole');
  const showFkRight = fkRows.some((row) => row.entry.comboType === 'pistole' || row.entry.comboType === 'muskete'
    || row.entry.comboType === 'armbrust' || row.entry.comboType === 'bogen'
    || row.entry.comboType === 'pistole_pistole');
  const showFkLeft = fkRows.some((row) => row.entry.comboType === 'nk1h_pistole'
    || row.entry.comboType === 'schild_pistole' || row.entry.comboType === 'pistole_pistole');
  return `
    <h3 class="bogen-section-heading">Waffen-Loadout</h3>
    ${nkRows.length > 0 ? `
    <div class="kampf-table-scroll">
      <table class="bogen-table kampf-loadout-table" data-loadout-table="nk">
        <caption class="loadout-table-heading">Nahkampf</caption>
        <thead><tr>
          <th>Loadout</th><th>Schaden</th><th>WK</th>
          <th>nAT</th><th>gAT</th><th>mAT</th><th>nPA</th><th>gPA</th><th>mPA</th>
        </tr></thead>
        <tbody>${nkRows.map(renderNkLoadoutMirrorRow).join('')}</tbody>
      </table>
    </div>` : ''}
    ${fkRows.length > 0 ? `
    <div class="kampf-table-scroll">
      <table class="bogen-table kampf-loadout-table" data-loadout-table="fk">
        <caption class="loadout-table-heading">Fernkampf</caption>
        <thead><tr><th>Loadout</th>
          ${showFkRight ? '<th>Schaden R</th>' : ''}${showFkLeft ? '<th>Schaden L</th>' : ''}
          ${showFkRight ? '<th>FK-Reichweiten R</th>' : ''}${showFkLeft ? '<th>FK-Reichweiten L</th>' : ''}
        </tr></thead>
        <tbody>${fkRows.map((row) => renderFkLoadoutMirrorRow(row, showFkRight, showFkLeft)).join('')}</tbody>
      </table>
    </div>` : ''}`;
}

function renderAusweichenMirror(character: CharacterState): string {
  const ausweichen = buildAusweichenRow(character);

  return `
    <h3 class="bogen-section-heading">Ausweichen / Bewegung</h3>
    <div class="kampf-table-scroll">
      <table class="bogen-table kampf-ausweichen-table">
        <thead><tr>
          <th>n off AW</th><th>n def AW</th><th>g AW</th><th>m AW</th><th>Initiative</th>
          <th>Ausdauer</th><th>Dauerlauf (m/KR)</th><th>Sprinten (m/KR)</th>
          <th>Hochsprung (m)</th><th>Weitsprung (m)</th>
        </tr></thead>
        <tbody><tr>
          <td>${ausweichen.offAw}</td><td>${ausweichen.defAw}</td><td>${ausweichen.gutAw}</td><td>${ausweichen.meisterlichAw}</td>
          <td>${ausweichen.ini}</td><td>${ausweichen.ausdauer}</td><td>${ausweichen.dauerlauf}</td><td>${ausweichen.sprinten}</td>
          <td>${ausweichen.hochsprung}</td><td>${ausweichen.weitsprung}</td>
        </tr></tbody>
      </table>
    </div>`;
}

export function renderCharakterbogen(container: HTMLElement, sheet: ComputedSheet, character: CharacterState): void {
  container.innerHTML = `
    <div class="bogen">
      ${renderHeaderTable(character)}
      ${renderCharakterwerteUndAttribute(sheet)}
      ${renderEigenschaften(sheet)}
      ${renderAuswahlListe(sheet, 'Vor- und Nachteile', 'Vor-/Nachteile')}
      ${renderAuswahlListe(sheet, 'Talente', 'Talente')}
      <h3 class="bogen-section-heading">Fertigkeiten</h3>
      <div class="bogen-fertigkeiten-reihe">
        ${renderGrundfertigkeiten(sheet)}
        ${renderKampffertigkeiten(sheet)}
        ${renderSpracheUndKultur(sheet)}
      </div>
      ${renderKampfLeRs(sheet, character)}
      ${renderAusweichenMirror(character)}
      ${renderWaffenLoadoutMirror(sheet, character)}
    </div>`;
}
