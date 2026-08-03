// Charakter-Tab "Verteilung" (Nutzer-Ask): reine Ausgabe-Ansicht, zeigt ausgegebene SP/TaP/
// Dublonen aufgeschluesselt nach Kategorie - hilft beim Pruefen, ob die Punkte wie geplant verteilt
// wurden. Rein abgeleitet aus dem ComputedSheet/CharacterState, kein eigener Zustand.

import type { CharacterState } from '../state/characterStore';
import { type ComputedRule, type ComputedSheet, SSK_MINDEST_SP } from '../engine/characterSheet';
import { getWhkHauptfertigkeitKosten, getWhkSpezialisierungKosten } from '../engine/whkCustomSpezialisierung';
import { equipmentInKategorie, type KaufKategorie } from './ausruestung';
import { formatDublonen } from '../utils/format';

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Kosten-Beitrag einer Zeile zum jeweiligen Waehrungstotal - identische Logik zu
 *  characterSheet.ts's computeSheet-Schleife (kostenCurrent bei currentValue>0, sonst
 *  kostenSelect bei ausgewaehlten Auswahl-Zeilen). */
function rowKosten(row: ComputedRule): number {
  if (row.kostenCurrent !== undefined && (row.currentValue ?? 0) > 0) return row.kostenCurrent;
  if (row.selected && row.kostenSelect !== undefined) return row.kostenSelect;
  return 0;
}

function sumKategorie(sheet: ComputedSheet, kategorie: string): number {
  return (sheet.byKategorie[kategorie] ?? []).reduce((sum, row) => sum + rowKosten(row), 0);
}

const SP_ZEILEN: ReadonlyArray<{ label: string; kategorie: string }> = [
  { label: 'Attribute', kategorie: 'Attribute' },
  { label: 'Eigenschaften', kategorie: 'Eigenschaft' },
  { label: 'Grundfertigkeiten (GF)', kategorie: 'Grundfertigkeit' },
  { label: 'Sonderfertigkeiten (SF)', kategorie: 'Sonderfertigkeit' },
  { label: 'Nahkampf (NK)', kategorie: 'Nahkampf' },
  { label: 'Fernkampf (FK)', kategorie: 'Fernkampf' },
  { label: 'WHK', kategorie: 'WHK' },
  { label: 'KI', kategorie: 'KI' },
  { label: 'PSI', kategorie: 'PSI' },
  { label: 'Spruchmagie', kategorie: 'Spruchmagie' },
];

const GELD_ZEILEN: ReadonlyArray<KaufKategorie> = [
  'Rüstung', 'Schilde', 'Waffen', 'Bögen', 'Armbrüste', 'Feuerwaffen', 'Alchemika', 'Artefakte', 'Preisliste',
];

function renderTableRow(label: string, betrag: number, einheit: string, gesamt: number): string {
  const anteil = gesamt !== 0 ? Math.round((betrag / gesamt) * 1000) / 10 : 0;
  return `
    <tr>
      <td>${escapeHtml(label)}</td>
      <td class="stat-cost">${betrag.toLocaleString('de-DE', { maximumFractionDigits: 3 })} ${einheit}</td>
      <td class="stat-cost">${gesamt !== 0 ? `${anteil}%` : '–'}</td>
    </tr>`;
}

/** Frei benannte WHK-Hauptfertigkeiten/-Spezialisierungen (Punkt 4a/4b) haben keine eigene
 *  RuleEntry und stecken daher nicht in sheet.byKategorie - separat aufaddieren, identisch zu
 *  characterSheet.ts's computeSheet-Schleife. */
function whkCustomSpent(character: CharacterState): number {
  let sum = 0;
  for (const h of character.customWhkHauptfertigkeiten ?? []) sum += getWhkHauptfertigkeitKosten(h.wert);
  for (const list of Object.values(character.customWhkSpezialisierungen ?? {})) {
    for (const s of list) sum += getWhkSpezialisierungKosten(s.wert);
  }
  return sum;
}

function renderSpTable(sheet: ComputedSheet, character: CharacterState): string {
  const zeilen = SP_ZEILEN.map(({ label, kategorie }) => [
    label,
    sumKategorie(sheet, kategorie) + (kategorie === 'WHK' ? whkCustomSpent(character) : 0),
  ] as const);
  const summeGezeigt = zeilen.reduce((sum, [, betrag]) => sum + betrag, 0);
  const sonstige = sheet.spSpent - summeGezeigt;
  return `
    <table class="bogen-table verteilung-table">
      <thead><tr><th>Kategorie</th><th>Ausgegeben (SP)</th><th>Anteil</th></tr></thead>
      <tbody>
        ${zeilen.map(([label, betrag]) => renderTableRow(label, betrag, 'SP', sheet.spSpent)).join('')}
        <tr class="verteilung-sonstige">
          <td>Sonstiges <small>(Sprache &amp; Kultur, Vor-/Nachteile)</small></td>
          <td class="stat-cost">${sonstige.toLocaleString('de-DE', { maximumFractionDigits: 3 })} SP</td>
          <td class="stat-cost">${sheet.spSpent !== 0 ? `${Math.round((sonstige / sheet.spSpent) * 1000) / 10}%` : '–'}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>Gesamt</td>
          <td class="stat-cost">${sheet.spSpent.toLocaleString('de-DE', { maximumFractionDigits: 3 })} / ${sheet.spTotal} SP</td>
          <td class="stat-cost">${sheet.spRemaining} SP übrig</td>
        </tr>
      </tfoot>
    </table>`;
}

function renderTapTable(sheet: ComputedSheet): string {
  return `
    <table class="bogen-table verteilung-table">
      <thead><tr><th>Kategorie</th><th>Ausgegeben (TaP)</th><th>Anteil</th></tr></thead>
      <tbody>
        ${renderTableRow('Talente', sheet.tapSpent, 'TaP', sheet.tapSpent)}
      </tbody>
      <tfoot>
        <tr>
          <td>Gesamt</td>
          <td class="stat-cost">${sheet.tapSpent} / ${sheet.tapTotal} TaP</td>
          <td class="stat-cost">${sheet.tapRemaining} TaP übrig</td>
        </tr>
      </tfoot>
    </table>`;
}

function ruestungAusgegeben(character: CharacterState): number {
  return Object.values(character.ruestungSlots).reduce((sum, entry) => sum + entry.computedPriceSnapshot, 0);
}

function geldInKategorie(character: CharacterState, kategorie: KaufKategorie): number {
  if (kategorie === 'Rüstung') return ruestungAusgegeben(character);
  return character.equipment
    .filter((entry) => equipmentInKategorie(entry, kategorie))
    .reduce((sum, entry) => sum + (entry.computedPriceSnapshot ?? 0) * entry.quantity, 0);
}

function renderGeldTable(sheet: ComputedSheet, character: CharacterState): string {
  const zeilen = GELD_ZEILEN.map((kategorie) => [kategorie, geldInKategorie(character, kategorie)] as const);
  return `
    <table class="bogen-table verteilung-table">
      <thead><tr><th>Kategorie</th><th>Ausgegeben (Dublonen)</th><th>Anteil</th></tr></thead>
      <tbody>
        ${zeilen.map(([label, betrag]) => renderTableRow(label, betrag, 'D', sheet.dublonenSpent)).join('')}
      </tbody>
      <tfoot>
        <tr>
          <td>Gesamt</td>
          <td class="stat-cost">${formatDublonen(sheet.dublonenSpent)} / ${formatDublonen(sheet.dublonenTotal)}</td>
          <td class="stat-cost">${formatDublonen(sheet.dublonenRemaining)} übrig</td>
        </tr>
      </tfoot>
    </table>`;
}

/** Bislang einzige im Code hinterlegte Mindestinvestment-Regel (SSK_MINDEST_SP) - siehe
 *  characterSheet.ts. Eine umfassendere "Wieviel SP mindestens wohin"-Tabelle war zum
 *  Implementierungszeitpunkt nicht auffindbar; falls der Nutzer eine solche Liste meint, muss sie
 *  noch ergaenzt werden. */
function renderMindestanforderungen(sheet: ComputedSheet): string {
  const erfuellt = sheet.sskMinimumMet && sheet.sskLanguageMinimumMet;
  return `
    <table class="bogen-table verteilung-table">
      <thead><tr><th>Anforderung</th><th>Status</th></tr></thead>
      <tbody>
        <tr>
          <td>Sprache &amp; Kultur: mindestens ${SSK_MINDEST_SP} SP, davon mindestens eine Sprache auf Stufe 1+</td>
          <td class="stat-cost">${sheet.sskSpent} / ${SSK_MINDEST_SP} SP${erfuellt ? ' ✓' : ' ⚠'}${sheet.sskLanguageMinimumMet ? '' : ' · Sprache fehlt'}</td>
        </tr>
      </tbody>
    </table>`;
}

export function renderVerteilungView(container: HTMLElement, sheet: ComputedSheet, character: CharacterState): void {
  container.innerHTML = `
    <section class="verteilung-view" aria-labelledby="verteilung-heading">
      <h2 id="verteilung-heading">Verteilung</h2>

      <h3 class="stat-section-heading">SP nach Kategorie</h3>
      ${renderSpTable(sheet, character)}

      <h3 class="stat-section-heading">TaP nach Kategorie</h3>
      ${renderTapTable(sheet)}

      <h3 class="stat-section-heading">Dublonen nach Kategorie</h3>
      ${renderGeldTable(sheet, character)}

      <h3 class="stat-section-heading">Mindestanforderungen</h3>
      ${renderMindestanforderungen(sheet)}
    </section>`;
}
