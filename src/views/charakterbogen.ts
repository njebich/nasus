// Charakterbogen: kompakte, rein lesbare End-Ansicht "wie der Charakter dargestellt werden
// soll, nachdem er fertig gesteigert ist" (Nutzer-Mockup 2026-07-17) - ein zusaetzlicher Tab
// neben den editierbaren Punktekauf-Tabs, kein Ersatz dafuer.

import type { ComputedSheet, ComputedRule } from '../engine/characterSheet';
import type { CharacterState, CharacterHeader } from '../state/characterStore';
import { buildHierarchy, sortHierarchyByValue, type HierarchyNode } from '../engine/hierarchy';
import { describeSkillStufe } from '../engine/skillStufen';

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

function headerField(character: CharacterState, key: keyof CharacterHeader, label: string): string {
  return `<tr><th>${label}</th><td>${escapeHtml(character[key] ?? '')}</td></tr>`;
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
          ${headerField(character, 'heimat', 'Heimat')}
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
    <tr><th>Erfahrungspkt.</th><td>${sheet.epGesamt}</td></tr>
    <tr><th>Steigerungspkt.</th><td>${sheet.spRemaining} / ${sheet.spTotal}</td></tr>`;
  const attributeRows = attribute
    .map((r) => `<tr><th>${escapeHtml(r.rule.beschreibung ?? r.rule.referenz)}</th><td>${r.currentValue ?? formatValue(r.computedValue)}</td></tr>`)
    .join('');
  return `
    <div class="bogen-zwei-spalten">
      <table class="bogen-table">${werteRows}${epSpRows}</table>
      <table class="bogen-table"><tr><th colspan="2">Attribute</th></tr>${attributeRows}</table>
    </div>`;
}

const EIGENSCHAFTEN_PAARE: Array<[string, string]> = [
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
  return `
    <td>${escapeHtml(eig.rule.beschreibung ?? eig.rule.referenz)} (${escapeHtml(eig.rule.abkuerzung ?? '')})</td>
    <td>${eig.currentValue ?? 0}</td>
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
  const items = gewaehlt.map((r) => `<li>${escapeHtml(r.rule.beschreibung ?? r.rule.referenz)}</li>`).join('');
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
  const rows = (sheet.byKategorie['Grundfertigkeit'] ?? [])
    .map((r) => `<tr><td>${escapeHtml(r.rule.beschreibung ?? r.rule.referenz)}</td><td>${r.currentValue ?? 0}</td></tr>`)
    .join('');
  return `
    <div class="bogen-fertigkeit-spalte">
      <h4>Grundfertigkeiten</h4>
      <table class="bogen-table">${rows}</table>
    </div>`;
}

function renderKampffertigkeiten(sheet: ComputedSheet): string {
  const nahkampf = (sheet.byKategorie['Nahkampf'] ?? []).filter((r) => r.rule.art === 'Wert');
  const fernkampf = (sheet.byKategorie['Fernkampf'] ?? []).filter((r) => r.rule.art === 'Wert');
  const hierarchie = sortHierarchyByValue(buildHierarchy([...nahkampf, ...fernkampf]));
  const rows = hierarchie.map(renderFertigkeitGruppe).join('');
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
    </div>`;
}

function renderWhkNurGewaehlt(sheet: ComputedSheet): string {
  const whk = (sheet.byKategorie['WHK'] ?? []).filter((r) => (r.currentValue ?? 0) > 0);
  if (whk.length === 0) return '<h3 class="bogen-section-heading">WHK</h3><p class="bogen-leer">– keine –</p>';
  const hierarchie = sortHierarchyByValue(buildHierarchy(whk));
  const rows = hierarchie.map(renderFertigkeitGruppe).join('');
  return `<h3 class="bogen-section-heading">WHK</h3><table class="bogen-table bogen-table-whk">${rows}</table>`;
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
      ${renderWhkNurGewaehlt(sheet)}
    </div>`;
}
