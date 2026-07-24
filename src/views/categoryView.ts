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
import { uncappedBasisByReferenz } from '../engine/waffenPool';
import { isGeweihterTalentSelectedInSheet } from '../engine/geweihte';
import { computeFormulaImpact } from '../engine/formulaImpact';
import type { CharacterValueSource } from '../engine/rules';
import { tooltipAttr } from './tooltip';
import { withScrollAnchor } from './scrollAnchor';
import { EIGENSCHAFTEN_PAARE } from './charakterbogen';

export type OnValueChange = (referenz: string, newValue: number) => void;
export type OnPoolChange = (referenz: string, allocation: PoolAllocation) => void;

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function errorNote(r: ComputedRule): string {
  return r.error ? `<span class="stat-error" title="${escapeHtml(r.error)}">⚠</span>` : '';
}

/** Klickpreis-Label "<Preis>SP/total <Gesamt>" fuer Wert-Regeln mit kumulativem kostenRaw.
 *  kostenCurrent/kostenNext sind Gesamtkosten bei currentValue/currentValue+1 (siehe
 *  characterSheet.ts) - der Klickpreis ist die Differenz. Alle Wert-Kosten-Formeln sind bei
 *  wert=0 exakt 0 (siehe characterSheet.ts spSpent), daher kein Sockelbetrag-Guard noetig. */
export function formatKlickpreis(
  kostenCurrent: number | undefined,
  kostenNext: number | undefined,
): string {
  if (kostenNext === undefined || kostenCurrent === undefined) return '';
  return `${kostenNext - kostenCurrent}SP/total ${kostenNext}`;
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

/** Kategorien, deren Zeilen-Formel-Tooltip (Nutzer-Direktive 2026-07-24 "Remove Tooltips ... For
 *  now") momentan entfaellt - NUR der Zeilen-Tooltip (rowTooltipForKategorie), NICHT die Kosten-
 *  Tooltips an den +/- Buttons (Nutzer-Klarstellung: "cost tooltips are cool for all -/+ buttons",
 *  siehe stepTooltip, das dieses Set bewusst nicht mehr prueft). */
const NO_TOOLTIP_KATEGORIEN = new Set(['WHK', 'Sprache & Kultur']);

/** Kategorien, die statt der rohen Kosten-Formel (SVERWEIS-Kostentabelle bzw. "wert*9") den
 *  bereits gepflegten (i)-Info-Text als Zeilen-Tooltip zeigen (Nutzer 2026-07-24: "on hover, show
 *  (i) text, not sverweis"/"...not Wert*9" fuer Grundfertigkeiten/Sonderfertigkeiten). */
const INFO_STATT_KOSTEN_KATEGORIEN = new Set(['Eigenschaft', 'Grundfertigkeit', 'Sonderfertigkeit']);

/** Attribute-Kosten sind ueber alle 6 Referenzen identisch kumulativ ("10*wert*wert+70*wert",
 *  siehe attribute.jsonl) - der tatsaechliche Klickpreis (kostenNext-kostenCurrent) ist die
 *  Ableitung davon, 80+20*wert, siehe [[project-attribut-klickpreis-bug-fix]]. Nutzer 2026-07-24
 *  will genau diese vereinfachte Klickpreis-Formel als Zeilen-Tooltip statt der kumulativen
 *  Rohformel. */
const ATTRIBUTE_KLICKPREIS_TEXT = '80 + Wert*20';

/** Referenz-spezifische, fest hinterlegte Tooltip-Texte - analog zu main.ts's TAB_INTRO (kein
 *  xlsx-Feld, weil es sich nur um eine kuratierte Zeile handelt, kein Massen-Content). */
const REFERENZ_TOOLTIP_OVERRIDE: Record<string, string> = {
  gewichtsbelastung: 'Dies ist die Belastung durch das kumulierte Gewicht aller Ausrüstung, die am Körper getragen wird.',
};

function referenzTooltipOverride(referenz: string): string {
  const text = REFERENZ_TOOLTIP_OVERRIDE[referenz];
  return text ? tooltipAttr(text) : '';
}

/** Zeilen-Tooltip fuer editierbare Wert-Zeilen: ersetzt den vorherigen blanket formulaTooltip
 *  (kostenRaw) durch die Nutzer-Vorgaben 2026-07-24 pro Kategorie - siehe die Konstanten oben. */
function rowTooltipForKategorie(r: ComputedRule, kategorie: string): string {
  const override = referenzTooltipOverride(r.rule.referenz);
  if (override) return override;
  if (NO_TOOLTIP_KATEGORIEN.has(kategorie)) return '';
  if (kategorie === 'Attribute') return tooltipAttr(ATTRIBUTE_KLICKPREIS_TEXT);
  if (INFO_STATT_KOSTEN_KATEGORIEN.has(kategorie)) return tooltipAttr(r.rule.info);
  return formulaTooltip(r.rule.kostenRaw);
}

/** Formel-Impact-Liste (Plan-Phase 3, nur Eigenschaften/Attribute): die Formeln, die sich durch
 *  den Klick tatsaechlich aendern wuerden, als "<Formelname>: <neuer Wert>"-Zeilen. Leerer String,
 *  wenn nichts sich aendert oder impactValues fehlt (alle anderen Kategorien) - roher Text (noch
 *  nicht tooltipAttr-verpackt), damit stepTooltip ihn mit der Kosten-Zeile zusammenfuehren kann. */
function impactLines(referenz: string, newWert: number, impactValues: CharacterValueSource | undefined): string {
  if (!impactValues) return '';
  const rows = computeFormulaImpact(referenz, newWert, impactValues);
  if (rows.length === 0) return '';
  return rows.map((row) => `${row.label}: ${row.newValue}`).join('\n');
}

/** Tooltip fuer einen +/- Button: Kosten-Zeile ("+80 SP"/"-80 SP", Nutzer 2026-07-24 "add cost to
 *  + buttons and to - buttons", "-" zeigt die ECHTE Rueckerstattung des zuletzt gekauften Punkts,
 *  siehe kostenPrev in characterSheet.ts) plus die bestehende Formel-Impact-Liste (Eigenschaften/
 *  Attribute), sofern vorhanden - beides zusammen in einem Tooltip, durch Zeilenumbruch getrennt.
 *  Leer (kein Tooltip), wenn beides fehlt. Nutzer-Klarstellung 2026-07-24: "cost tooltips are cool
 *  for all -/+ buttons" - anders als der Zeilen-Tooltip (rowTooltipForKategorie) gilt
 *  NO_TOOLTIP_KATEGORIEN hier NICHT, WHK/Sprache & Kultur behalten also ihre Kosten-Tooltips. */
function stepTooltip(
  kosten: number | undefined, sign: '+' | '-', referenz: string, newWert: number,
  impactValues: CharacterValueSource | undefined,
): string {
  const lines: string[] = [];
  if (kosten !== undefined) lines.push(`${sign}${kosten} SP`);
  const impact = impactLines(referenz, newWert, impactValues);
  if (impact) lines.push(impact);
  return lines.length > 0 ? tooltipAttr(lines.join('\n')) : '';
}

/** maxValue: nur bei Spezialisierungen gesetzt (Regel Nutzer 2026-07-17: Spezialisierung
 *  darf nie hoeher als der TaW der Hauptfertigkeit sein) - deckelt Input und "+"-Button.
 *  impactValues: nur fuer Eigenschaften/Attribute gesetzt (siehe renderCategoryView) - liefert
 *  die Formel-Impact-Tooltips an den +/- Buttons (Plan-Phase 3). kategorie steuert den Zeilen-
 *  Tooltip (rowTooltipForKategorie) und ob ueberhaupt Tooltips gezeigt werden (stepTooltip). */
function renderEditableRow(r: ComputedRule, kategorie: string, maxValue?: number, impactValues?: CharacterValueSource): string {
  const label = escapeHtml(r.rule.beschreibung ?? r.rule.referenz);
  const value = r.currentValue ?? 0;
  // kostenRaw liefert kumulierte Gesamtkosten bei "wert" (siehe characterSheet.ts kostenCurrent/
  // spSpent), nicht die Kosten des einzelnen Punkts - der Klick-Preis ist daher die Differenz
  // kostenNext-kostenCurrent (siehe formatKlickpreis).
  const costNext = formatKlickpreis(r.kostenCurrent, r.kostenNext);
  const maxAttr = maxValue !== undefined ? ` max="${maxValue}"` : '';
  const atMax = maxValue !== undefined && value >= maxValue;
  const stufe = describeSkillStufe(r.rule.referenz, value);
  // Eigenschafts-/Attributs-Artefakt-Bonus (Nutzer 2026-07-19): Basiswert bleibt editierbar/
  // unveraendert im Input, der veraenderte Wert steht nur informativ daneben in Klammern -
  // wirkt in allen Formeln, ausser der SP-Kosten-Berechnung (siehe artefaktBonus.ts).
  const alteredHint = r.alteredValue !== undefined
    ? ` <span class="stat-altered" title="Durch Artefakt veraendert">(${r.alteredValue})</span>`
    : '';
  // Eigener Tooltip-Trigger je Button (statt am ganzen Row-Label) - Kosten-Zeile (Nutzer 2026-07-24
  // "add cost to + and - buttons") plus ggf. die Formel-Impact-Liste, siehe stepTooltip. Faellt auf
  // den Zeilen-Tooltip zurueck (closest('[data-tooltip]') in tooltip.ts), wenn hier nichts anfaellt.
  const minusKosten = value > 0 && r.kostenCurrent !== undefined && r.kostenPrev !== undefined
    ? r.kostenCurrent - r.kostenPrev : undefined;
  const plusKosten = r.kostenCurrent !== undefined && r.kostenNext !== undefined
    ? r.kostenNext - r.kostenCurrent : undefined;
  const minusTooltip = stepTooltip(minusKosten, '-', r.rule.referenz, Math.max(0, value - 1), impactValues);
  const plusTooltip = stepTooltip(plusKosten, '+', r.rule.referenz, value + 1, impactValues);
  // Zeilen-Tooltip auf der ganzen Zeile (nicht nur dem Label), damit er auch beim Hover ueber
  // den Wert/die Buttons erscheint - Elemente ohne eigenes title-Attribut fallen auf das des
  // naechsten Vorfahren zurueck.
  return `
    <div class="stat-row" data-referenz="${r.rule.referenz}"${rowTooltipForKategorie(r, kategorie)}>
      <span class="stat-label">${label}${infoIcon(r.rule.info)}${errorNote(r)}</span>
      <button type="button" class="stat-dec" aria-label="verringern"${minusTooltip}>-</button>
      <input type="number" class="stat-value" min="0"${maxAttr} value="${value}" aria-label="${label}" />${alteredHint}
      <button type="button" class="stat-inc" aria-label="erhöhen" ${atMax ? 'disabled' : ''}${plusTooltip}>+</button>
      <span class="stat-cost stat-cost-click">${stufe ? `(${escapeHtml(stufe)}) ` : ''}${costNext}</span>
    </div>`;
}

/** SF "Ladeschuetze": eigene Gruppe (kein Hauptfertigkeit/Spezialisierung-Verhaeltnis, daher
 *  ad-hoc statt ueber buildHierarchy). Jede Waffenart ist komplett ausgeblendet, bis die
 *  zugehoerige Fernkampf-Fertigkeit > 0 ist (siehe ladeschuetzeGating.ts) - keine Sperr-Anzeige,
 *  einfaches Weglassen. Rendert gar nichts, wenn (noch) keine Zeile sichtbar ist. */
function renderLadeschuetzeGroup(rows: ComputedRule[], sheet: ComputedSheet, kategorie: string): string {
  const visible = rows.filter((r) => isLadeschuetzeSfVisible(sheet, r.rule.referenz));
  if (visible.length === 0) return '';
  const groupKey = 'sf_ladeschuetze_gruppe';
  const openAttr = openGroupReferenzen.has(groupKey) ? ' open' : '';
  const body = visible.map((r) => renderEditableRow(r, kategorie)).join('');
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
  const rowTooltip = referenzTooltipOverride(r.rule.referenz) || formulaTooltip(r.rule.formelRaw);
  return `
    <div class="stat-row stat-row-readonly"${rowTooltip}>
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
function renderEditableGroup(node: HierarchyNode, kategorie: string, impactValues?: CharacterValueSource): string {
  if (node.children.length === 0) return renderEditableRow(node.row, kategorie, undefined, impactValues);
  const label = escapeHtml(node.row.rule.beschreibung ?? node.row.rule.referenz);
  const openAttr = openGroupReferenzen.has(node.row.rule.referenz) ? ' open' : '';
  const hauptwert = node.row.currentValue ?? 0;
  const kinder = hauptwert > 0
    ? node.children.map((r) => renderEditableRow(r, kategorie, hauptwert)).join('')
    : '<p class="stat-subgroup-locked">Spezialisierungen verfügbar, sobald der TaW über 0 liegt.</p>';
  return `
    <div class="stat-card">
      <details class="stat-group" data-referenz="${node.row.rule.referenz}"${openAttr}>
        <summary>${label} <span class="stat-group-count">(${node.children.length} Spezialisierungen)</span></summary>
        ${renderEditableRow(node.row, kategorie, undefined, impactValues)}
        <div class="stat-subgroup">${kinder}</div>
      </details>
    </div>`;
}

/** Nahkampf-/Fernkampf-Tab (Nutzer-Mockup 2026-07-22, "S05 Nahkampfwaffen", spaeter auf Fernkampf
 *  uebertragen): Hauptfertigkeit + Spezialisierungen als feste Tabelle statt aufklappbarer
 *  <details>-Karte (renderEditableGroup) - eine Tabelle pro Hauptfertigkeit. Alle Spezialisierungen
 *  teilen dieselbe "TaW"-Spalte (Nutzer-Korrektur 2026-07-22: "all spezialisierungen are meant to
 *  be in the same column"); die ersten Spalten (Waffe/TaW/Basis-Spalten) der Hauptfertigkeit sind
 *  ueber die gesamte Tabellenhoehe gespannt (rowspan), weil es nur EINEN Hauptfertigkeit-Wert gibt,
 *  waehrend die Spezialisierung/TaW-Spalten sich pro Zeile aendern. -/Wert/+/Kosten stehen in EINER
 *  <td> (Nutzer-Korrektur 2026-07-22: "remove the extra columns next to the TaW containing -/+
 *  buttons, include them next to the TaW value field") statt drei separaten Spalten. Die Zelle
 *  behaelt die Klasse "stat-row" (statt einer Huellen-Div), damit die bestehende Event-Delegation
 *  (closest('.stat-row')) unveraendert weiterfunktioniert - ABER die Zelle selbst darf NIE
 *  `display:flex/grid` bekommen (das ist, wonach `.stat-row` normalerweise aussieht): mehrere
 *  BENACHBARTE <td> mit nicht-table-cell display in derselben <tr> lassen den Browser die Zellen
 *  faelschlich in EINER Spalte stapeln statt sie nebeneinander zu setzen (browser-verifiziert
 *  2026-07-22). Deshalb bleibt die <td> ein normales table-cell (siehe .waffen-ctrl-cell in
 *  style.css), und -/Wert/+/Kosten werden in einem inneren <div> (nicht auf Zellenebene) in einer
 *  Reihe zentriert. */
function renderWaffenControlCells(r: ComputedRule, rowspan: number | undefined, maxValue?: number, costOverride?: number): string {
  const label = escapeHtml(r.rule.beschreibung ?? r.rule.referenz);
  const value = r.currentValue ?? 0;
  const cost = costOverride !== undefined ? costOverride : r.kostenNext;
  const costNext = cost !== undefined ? `(${cost} SP)` : '';
  const maxAttr = maxValue !== undefined ? ` max="${maxValue}"` : '';
  const atMax = maxValue !== undefined && value >= maxValue;
  const rowspanAttr = rowspan !== undefined ? ` rowspan="${rowspan}"` : '';
  // Sowohl Hauptfertigkeit als auch Spezialisierung haben einen flachen Satz pro Punkt (costOverride
  // = klickpreisDelta, siehe dort/waffenSpezKosten.ts) - "+" und "-" kosten/erstatten daher exakt
  // denselben Betrag, anders als die kumulative SVERWEIS-Kostentabelle in renderEditableRow (kein
  // kostenPrev noetig).
  const minusTooltip = costOverride !== undefined && value > 0 ? tooltipAttr(`-${costOverride} SP`) : '';
  const plusTooltip = costOverride !== undefined ? tooltipAttr(`+${costOverride} SP`) : '';
  return `
    <td class="stat-row waffen-ctrl-cell"${rowspanAttr} data-referenz="${r.rule.referenz}">
      <div class="waffen-value-inner">
        <button type="button" class="stat-dec" aria-label="verringern"${minusTooltip}>-</button>
        <input type="number" class="stat-value" min="0"${maxAttr} value="${value}" aria-label="${label}" />
        <button type="button" class="stat-inc" aria-label="erhöhen" ${atMax ? 'disabled' : ''}${plusTooltip}>+</button>
        ${costNext ? `<span class="stat-cost">${costNext}</span>` : ''}
      </div>
    </td>`;
}

function renderWaffenLabelCell(r: ComputedRule, rowspan: number | undefined): string {
  const label = escapeHtml(r.rule.beschreibung ?? r.rule.referenz);
  const rowspanAttr = rowspan !== undefined ? ` rowspan="${rowspan}"` : '';
  return `<td${rowspanAttr}>${label}${infoIcon(r.rule.info)}${errorNote(r)}</td>`;
}

/** Jede Nahkampf-Hauptfertigkeit hat genau eine "Attacke-Basis-Wert"- und eine "Parade-Basis-Wert"-
 *  Formel-Zeile (at_hiebwaffen/pa_hiebwaffen usw.), benannt exakt wie die zugehoerige nk_*-Wert-
 *  Zeile mit "nk_" -> "at_"/"pa_" ersetzt (kein Sonderfall, gilt fuer alle 5 Hauptfertigkeiten -
 *  siehe nahkampf.jsonl). Spezialisierungen haben KEINE eigenen Basis-Formeln, deshalb gibt es nur
 *  je eine AT-/PA-Basis-Spalte, nicht auch welche fuer den Spez-Block. */
function findNahkampfBasisRule(hauptfertigkeitReferenz: string, prefix: 'at_' | 'pa_', readOnly: ComputedRule[]): ComputedRule | undefined {
  const basisReferenz = hauptfertigkeitReferenz.replace(/^nk_/, prefix);
  return readOnly.find((r) => r.rule.referenz === basisReferenz);
}

/** AT-Basis/PA-Basis- bzw. FK-Basis/FKS-Basis-Spalten (Nutzer-Korrektur 2026-07-22: "column 5
 *  header AT-Basis, wire at basis value to the field below", spaeter "add the PA-Basis header...",
 *  spaeter "do the equivalent in Fernkampf with Fernkampf-Basis-Wert and Fernkampf-
 *  Spezialisierungs-Wert") - der Live-Formelwert, rein lesend wie renderReadOnlyRow, aber als
 *  eigene Zelle in der Tabelle statt einer separaten Zeile im "Berechnete Werte"-Block (der diese
 *  Formelzeilen fuer Nahkampf/Fernkampf deshalb jetzt ausblendet, siehe renderCategoryView - sonst
 *  stuende derselbe Wert doppelt auf der Seite).
 *  Nutzer-Korrektur 2026-07-24: die Zelle zeigt die UNGEDECKELTE Basis (via uncappedBasisByReferenz),
 *  nicht rule.computedValue - dessen Formel traegt selbst ein "MIN(20;...)". Das Deckeln bei 20
 *  passiert erst pro Waffe im Kampf-Tab, NACH Anwendung des waffeneigenen AT-/PA-Mods (siehe
 *  waffenPool.ts's computeWeaponAtPaOverflow) - eine hier schon gedeckelte Basis wuerde von diesem
 *  tatsaechlich verrechneten Wert abweichen, sobald die Fertigkeit allein schon ueber 20 traegt. */
// Alle 5 Nahkampf-Hauptfertigkeiten teilen die Formel-Form "MIN(20;(Eig+Eig+Haupt)/3)" (siehe
// nahkampf.jsonl) - MIN(20;...) wird bereits zentral von prettyFormula weggekuerzt. Die eigene
// Hauptfertigkeit (z.B. "nk_hiebwaffen") hat aber keine Abkuerzung und wuerde sonst als ihr voller
// Name ("Hiebwaffen") erscheinen statt als "TaW" - per Nutzer-Entscheidung 2026-07-24 ("real
// substitution" statt eines generischen Platzhaltertexts) wird sie hier gezielt ueberschrieben,
// damit z.B. Hiebwaffen "(Mut + Ath + TaW) / 3" zeigt, Stichwaffen "(Mut + Sch + TaW) / 3" usw. -
// pro Zeile unterschiedlich, nicht ein fester Text fuer alle 10 Zellen.
function renderWaffenBasisCell(rule: ComputedRule | undefined, rowspan: number, values: CharacterValueSource | undefined): string {
  const rowspanAttr = ` rowspan="${rowspan}"`;
  if (!rule) return `<td${rowspanAttr}>–</td>`;
  if (rule.error) {
    return `<td${rowspanAttr}><span class="stat-error" title="${escapeHtml(rule.error)}">nicht definiert ⚠</span></td>`;
  }
  const displayValue = values ? uncappedBasisByReferenz(rule.rule.referenz, values) : (rule.computedValue ?? '–');
  const hauptfertigkeitReferenz = rule.rule.referenz.replace(/^(at_|pa_)/, 'nk_');
  const tooltip = rule.rule.formelRaw
    ? tooltipAttr(prettyFormula(rule.rule.formelRaw, { [hauptfertigkeitReferenz]: 'TaW' }))
    : '';
  return `<td${rowspanAttr} class="stat-value-readonly"${tooltip}>${escapeHtml(formatComputedValue(displayValue))}</td>`;
}

/** Klickpreis (Kosten fuer den naechsten Punkt) fuer eine Nahkampf-/Fernkampf-Zeile - sowohl
 *  Hauptfertigkeit (flacher Satz, xlsx-Formel "wert*25"/"wert*18") als auch Spezialisierung
 *  (flacher, vom Investitions-Rang abhaengiger Satz, siehe engine/waffenSpezKosten.ts) sind
 *  linear, die Differenz kostenNext-kostenCurrent ist also fuer beide der reale, bereits von
 *  characterSheet.ts berechnete SP-Preis - keine eigene Rate-Logik mehr hier noetig (vor
 *  2026-07-24 war das UI-Deko ohne echten SP-Abzug, siehe waffenSpezKosten.ts-Kommentar). */
function klickpreisDelta(r: ComputedRule): number | undefined {
  return r.kostenNext !== undefined && r.kostenCurrent !== undefined ? r.kostenNext - r.kostenCurrent : undefined;
}

/** Eine Zeile (bzw. Zeilengruppe) pro Hauptfertigkeit - Nutzer-Korrektur 2026-07-22: "i want all
 *  lines displayed in a single table", d.h. alle Hauptfertigkeiten EINER Tabelle (nicht mehr eine
 *  <table> pro Hauptfertigkeit); der Aufrufer (renderCategoryView) buendelt diese Zeilen unter
 *  einem gemeinsamen <thead>. Die vier Spezialisierungs-Spalten (Spezialisierung/-/TaW/+) werden
 *  bei fehlenden/gesperrten Spezialisierungen per colspan="4" durch einen Platzhalter ersetzt,
 *  damit die Spaltenzahl fuer jede Zeile gleich bleibt. */
function renderNahkampfHauptfertigkeitRows(node: HierarchyNode, readOnly: ComputedRule[], values: CharacterValueSource | undefined): string {
  const hauptwert = node.row.currentValue ?? 0;
  const atBasisRule = findNahkampfBasisRule(node.row.rule.referenz, 'at_', readOnly);
  const paBasisRule = findNahkampfBasisRule(node.row.rule.referenz, 'pa_', readOnly);
  const basisCells = (rowspan: number) => `${renderWaffenBasisCell(atBasisRule, rowspan, values)}${renderWaffenBasisCell(paBasisRule, rowspan, values)}`;
  if (node.children.length === 0) {
    return `<tr>${renderWaffenLabelCell(node.row, undefined)}${renderWaffenControlCells(node.row, undefined, undefined, klickpreisDelta(node.row))}${basisCells(1)}<td colspan="4">–</td></tr>`;
  }
  if (hauptwert <= 0) {
    return `<tr>${renderWaffenLabelCell(node.row, undefined)}${renderWaffenControlCells(node.row, undefined, undefined, klickpreisDelta(node.row))}${basisCells(1)}<td colspan="4" class="waffen-spez-locked">Spezialisierungen verfügbar, sobald der TaW über 0 liegt.</td></tr>`;
  }
  const n = node.children.length;
  return node.children.map((child, i) => `
    <tr>
      ${i === 0 ? `${renderWaffenLabelCell(node.row, n)}${renderWaffenControlCells(node.row, n, undefined, klickpreisDelta(node.row))}${basisCells(n)}` : ''}
      ${renderWaffenLabelCell(child, undefined)}${renderWaffenControlCells(child, undefined, hauptwert, klickpreisDelta(child))}
    </tr>`).join('');
}

/** Fernkampf-Pendant zu findNahkampfBasisRule - ABER anders als Nahkampf ist "Fernkampf-
 *  Spezialisierungs-Wert" (FKS-Basis) eine EIGENE Formel PRO Spezialisierung (haengt von Haupt-
 *  UND Spez-TaW ab), waehrend Nahkampfs AT-/PA-Basis nur von der Hauptfertigkeit abhaengen - daher
 *  zwei getrennte Lookup-Funktionen statt einer gemeinsamen mit Praefix-Parameter. */
function findFernkampfBasisRule(hauptfertigkeitReferenz: string, prefix: 'fk_basis_' | 'fk_gute_' | 'fk_meisterlich_', readOnly: ComputedRule[]): ComputedRule | undefined {
  const referenz = hauptfertigkeitReferenz.replace(/^fk_/, prefix);
  return readOnly.find((r) => r.rule.referenz === referenz);
}

/** "fk_spez_X_Y" -> "fk_basis_spez_X_Y"/"fk_gute_spez_X_Y"/"fk_meisterlich_spez_X_Y" ist die
 *  Namenskonvention fuer ALLE Fernkampf-Spezialisierungen bis auf eine Ausnahme: die Wert-Zeile
 *  heisst "fk_spez_schusswaffen_armbrueste" (Plural), ihre Formel-Zeilen aber "..._schusswaffen_
 *  armbrust" (Singular, gilt fuer basis/gute/meisterlich gleichermassen) - eine echte
 *  Schreibweisen-Abweichung in der Quelldaten (nahkampf.jsonl las verzeihend das GLEICHE nk_->at_/
 *  pa_-Muster durchgehend; hier verifiziert per grep in fernkampf.jsonl, kein Zufall/Tippfehler
 *  meinerseits). */
const FERNKAMPF_SPEZ_ARMBRUST_REFERENZ = 'fk_spez_schusswaffen_armbrueste';

function findFernkampfSpezBasisRule(spezReferenz: string, prefix: 'fk_basis_spez_' | 'fk_gute_spez_' | 'fk_meisterlich_spez_', readOnly: ComputedRule[]): ComputedRule | undefined {
  const referenz = spezReferenz === FERNKAMPF_SPEZ_ARMBRUST_REFERENZ
    ? `${prefix}schusswaffen_armbrust`
    : spezReferenz.replace(/^fk_spez_/, prefix);
  return readOnly.find((r) => r.rule.referenz === referenz);
}

/** Fernkampf-Basis-Zelle inkl. gFK/mFK (Nutzer-Korrektur 2026-07-22: "include gFK/mFK in the
 *  FK-Basis/FKS-Basis fields like on the kampf sheet") - anders als die Reichweitenzelle im
 *  Kampf-Tab (formatRangeCell in views/kampf.ts) gibt es hier keinen Waffen-/Entfernungs-
 *  Modifikator, deshalb reicht es, die bereits vom Engine berechneten fk_gute- und fk_meisterlich-
 *  Formelzeilen direkt zu uebernehmen statt die Divisor-Logik zu duplizieren. Gating wie dort:
 *  g/m nur anzeigen, wenn ueber dem ungetalenteten Sockelwert (gut>1 / meisterlich>21). */
function renderFernkampfBasisCell(
  basisRule: ComputedRule | undefined, guteRule: ComputedRule | undefined, meisterlichRule: ComputedRule | undefined, rowspan: number,
): string {
  const rowspanAttr = ` rowspan="${rowspan}"`;
  if (!basisRule) return `<td${rowspanAttr}>–</td>`;
  if (basisRule.error) {
    return `<td${rowspanAttr}><span class="stat-error" title="${escapeHtml(basisRule.error)}">nicht definiert ⚠</span></td>`;
  }
  let out = formatComputedValue(basisRule.computedValue ?? '–');
  const guteValue = guteRule && !guteRule.error ? Number(guteRule.computedValue) : undefined;
  if (guteValue !== undefined && Number.isFinite(guteValue) && guteValue > 1) out += ` g${formatComputedValue(guteValue)}`;
  const meisterlichValue = meisterlichRule && !meisterlichRule.error ? Number(meisterlichRule.computedValue) : undefined;
  if (meisterlichValue !== undefined && Number.isFinite(meisterlichValue) && meisterlichValue > 21) out += ` m${formatComputedValue(meisterlichValue)}`;
  return `<td${rowspanAttr} class="stat-value-readonly"${formulaTooltip(basisRule.rule.formelRaw)}>${escapeHtml(out)}</td>`;
}

/** Fernkampf-Pendant zu renderNahkampfHauptfertigkeitRows - eine Zeile(-ngruppe) pro Hauptfertig-
 *  keit statt einer eigenen <table>, siehe dort. Fuenf Spezialisierungs-Spalten (Spezialisierung/-/
 *  TaW/+/FKS-Basis) statt vier, weil Fernkampf zusaetzlich die FKS-Basis-Spalte hat. */
function renderFernkampfHauptfertigkeitRows(node: HierarchyNode, readOnly: ComputedRule[]): string {
  const hauptwert = node.row.currentValue ?? 0;
  const fkBasisRule = findFernkampfBasisRule(node.row.rule.referenz, 'fk_basis_', readOnly);
  const fkGuteRule = findFernkampfBasisRule(node.row.rule.referenz, 'fk_gute_', readOnly);
  const fkMeisterlichRule = findFernkampfBasisRule(node.row.rule.referenz, 'fk_meisterlich_', readOnly);
  if (node.children.length === 0) {
    return `<tr>${renderWaffenLabelCell(node.row, undefined)}${renderWaffenControlCells(node.row, undefined, undefined, klickpreisDelta(node.row))}${renderFernkampfBasisCell(fkBasisRule, fkGuteRule, fkMeisterlichRule, 1)}<td colspan="5">–</td></tr>`;
  }
  if (hauptwert <= 0) {
    return `<tr>${renderWaffenLabelCell(node.row, undefined)}${renderWaffenControlCells(node.row, undefined, undefined, klickpreisDelta(node.row))}${renderFernkampfBasisCell(fkBasisRule, fkGuteRule, fkMeisterlichRule, 1)}<td colspan="5" class="waffen-spez-locked">Spezialisierungen verfügbar, sobald der TaW über 0 liegt.</td></tr>`;
  }
  const n = node.children.length;
  return node.children.map((child, i) => {
    const fksBasisRule = findFernkampfSpezBasisRule(child.rule.referenz, 'fk_basis_spez_', readOnly);
    const fksGuteRule = findFernkampfSpezBasisRule(child.rule.referenz, 'fk_gute_spez_', readOnly);
    const fksMeisterlichRule = findFernkampfSpezBasisRule(child.rule.referenz, 'fk_meisterlich_spez_', readOnly);
    return `
    <tr>
      ${i === 0 ? `${renderWaffenLabelCell(node.row, n)}${renderWaffenControlCells(node.row, n, undefined, klickpreisDelta(node.row))}${renderFernkampfBasisCell(fkBasisRule, fkGuteRule, fkMeisterlichRule, n)}` : ''}
      ${renderWaffenLabelCell(child, undefined)}${renderWaffenControlCells(child, undefined, hauptwert, klickpreisDelta(child))}${renderFernkampfBasisCell(fksBasisRule, fksGuteRule, fksMeisterlichRule, 1)}
    </tr>`;
  }).join('');
}

/** Eigenschaften-Tab (Nutzer "debugging" 2026-07-24, Layout-Korrektur 2026-07-24: "eig.bon next to
 *  the relevant eig"): uebernimmt das Zwei-Spalten-Paar-Layout der read-only Eigenschaften-Tabelle
 *  im Charakterbogen (EIGENSCHAFTEN_PAARE, siehe charakterbogen.ts) fuer die editierbare Ansicht,
 *  ergaenzt um je eine Eig.Bonus-Spalte direkt neben ihrer Eigenschaft (Spaltenreihenfolge
 *  Eigenschaft|Eig.Bon|Eigenschaft|Eig.Bon, wie im Charakterbogen). Die Eigenschaft-Zellen bleiben
 *  unveraendert renderEditableRow (Selektoren/Tooltip/Kosten-Anzeige) - nur in eine <td> statt eines
 *  Top-Level-Divs gepackt. */
function findByReferenz(rows: ComputedRule[], referenz: string): ComputedRule | undefined {
  return rows.find((r) => r.rule.referenz === referenz);
}

function renderEigenschaftsbonusCell(bonus: ComputedRule | undefined): string {
  if (!bonus) return '<td class="stat-eig-bonus-cell"></td>';
  if (bonus.error) {
    return `<td class="stat-eig-bonus-cell"><span class="stat-error" title="${escapeHtml(bonus.error)}">nicht definiert ⚠</span></td>`;
  }
  return `<td class="stat-eig-bonus-cell stat-value-readonly"${formulaTooltip(bonus.rule.formelRaw)}>${escapeHtml(formatComputedValue(bonus.computedValue ?? '–'))}</td>`;
}

function renderEigenschaftenTable(editable: ComputedRule[], bonusRows: ComputedRule[], impactValues?: CharacterValueSource): string {
  const findEig = (referenz: string) => findByReferenz(editable, referenz);
  const rows = EIGENSCHAFTEN_PAARE.map(([links, rechts]) => {
    const eigLinks = findEig(links);
    const eigRechts = findEig(rechts);
    const bonusLinks = findByReferenz(bonusRows, links.replace(/^eig_/, 'eig_bonus_'));
    const bonusRechts = findByReferenz(bonusRows, rechts.replace(/^eig_/, 'eig_bonus_'));
    return `
      <tr>
        <td>${eigLinks ? renderEditableRow(eigLinks, 'Eigenschaft', undefined, impactValues) : ''}</td>
        ${renderEigenschaftsbonusCell(bonusLinks)}
        <td>${eigRechts ? renderEditableRow(eigRechts, 'Eigenschaft', undefined, impactValues) : ''}</td>
        ${renderEigenschaftsbonusCell(bonusRechts)}
      </tr>`;
  }).join('');
  return `
    <table class="bogen-table eigenschaften-edit-table">
      <thead><tr><th>Eigenschaft</th><th>Eig.Bon</th><th>Eigenschaft</th><th>Eig.Bon</th></tr></thead>
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
  // Formel-Impact-Liste (Plan-Phase 3): nur fuer Eigenschaft/Attribute genutzt (siehe unten),
  // deshalb hier optional statt bei jedem Aufruf Pflicht - main.ts uebergibt sie trotzdem immer
  // mit (billig zu bauen, siehe makeValueSource), die Kategorie-Gate entscheidet hier.
  impactValues?: CharacterValueSource,
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
  // Nahkampf-/Fernkampf-Tab (Nutzer-Mockup 2026-07-22): Waffengruppen als feste Tabelle statt
  // aufklappbarer Karte (siehe renderNahkampfWaffenGroup/renderFernkampfWaffenGroup), und die
  // Kampf-Pools-Sektion faellt fuer Nahkampf komplett weg - die AT-Basis-Spalte in der neuen
  // Tabelle deckt das ab, was dort bisher redundant angezeigt wurde. Andere Kategorien (z.B.
  // "Kampf" mit seinem Leberschutz-Pool) behalten das bisherige Verhalten.
  const isNahkampf = kategorie === 'Nahkampf';
  const isFernkampf = kategorie === 'Fernkampf';
  const isEigenschaft = kategorie === 'Eigenschaft';
  // Die "Attacke-/Parade-Basis-Wert"- (Nahkampf) bzw. "Fernkampf-(Spezialisierungs-)Basis-Wert"-
  // Formelzeilen (Fernkampf) stehen jetzt live in den Basis-Spalten der Waffentabelle
  // (renderWaffenBasisCell/renderFernkampfBasisCell) - aus "Berechnete Werte" ausgeblendet, sonst
  // staende derselbe Wert doppelt auf der Seite. Fuer Fernkampf zaehlen dazu seit der gFK/mFK-
  // Erweiterung (Nutzer 2026-07-22) auch "fk_gute_"/"fk_meisterlich_"-praefigierte Zeilen (Haupt-
  // fertigkeit UND Spezialisierung), die jetzt als "g"/"m"-Suffix in derselben Zelle stehen statt
  // als eigene Formelzeile.
  const readOnlyForBerechneteWerte = isNahkampf
    ? readOnly.filter((r) => !r.rule.referenz.startsWith('at_') && !r.rule.referenz.startsWith('pa_'))
    : isFernkampf
      ? readOnly.filter((r) => !r.rule.referenz.startsWith('fk_basis_') && !r.rule.referenz.startsWith('fk_gute_') && !r.rule.referenz.startsWith('fk_meisterlich_'))
      : readOnly;
  const readOnlyHierarchy = buildHierarchy(readOnlyForBerechneteWerte);
  // Formel-Impact-Liste (Plan-Phase 3) ist explizit auf Eigenschaften/Attribute begrenzt (Nutzer-
  // Entscheidung 2026-07-20) - andere Kategorien bekommen nie einen impactValues-Wert durchgereicht.
  const formulaImpactValues = (kategorie === 'Eigenschaft' || kategorie === 'Attribute') ? impactValues : undefined;
  // "i want all lines displayed in a single table" (Nutzer 2026-07-22) - eine gemeinsame <table>
  // mit EINEM <thead> pro Tab statt einer <table> pro Hauptfertigkeit; Nahkampf und Fernkampf
  // bleiben dabei getrennte Tabs/Tabellen ("do not merge tabs").
  const editableBlock = isNahkampf
    ? `
      <table class="bogen-table waffen-basis-table">
        <thead><tr>
          <th>Waffe</th><th class="waffen-th-center">TaW (25 SP)</th><th class="waffen-th-center">AT-Basis</th><th class="waffen-th-center">PA-Basis</th>
          <th>Spezialisierung</th><th class="waffen-th-center">TaW (15/8/4)</th>
        </tr></thead>
        <tbody>${editableHierarchy.map((n) => renderNahkampfHauptfertigkeitRows(n, readOnly, impactValues)).join('')}</tbody>
      </table>`
    : isFernkampf
      ? `
      <table class="bogen-table waffen-basis-table">
        <thead><tr>
          <th>Waffe</th><th class="waffen-th-center">TaW (18 SP)</th><th class="waffen-th-center">FK-Basis</th>
          <th>Spezialisierung</th><th class="waffen-th-center">TaW (10/5/3)</th><th class="waffen-th-center">FKS-Basis</th>
        </tr></thead>
        <tbody>${editableHierarchy.map((n) => renderFernkampfHauptfertigkeitRows(n, readOnly)).join('')}</tbody>
      </table>`
      : isEigenschaft
        ? renderEigenschaftenTable(restEditable, sheet.byKategorie['Eigenschaftsbonus'] ?? [], formulaImpactValues)
        : editableHierarchy.map((n) => renderEditableGroup(n, kategorie, formulaImpactValues)).join('');

  container.innerHTML = `
    <div class="stat-category">${editableBlock}${renderLadeschuetzeGroup(ladeschuetzeRows, sheet, kategorie)}</div>
    ${readOnlyForBerechneteWerte.length > 0 ? `
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
      withScrollAnchor(`.stat-row[data-referenz="${CSS.escape(referenz)}"]`, () => onChange(referenz, findCurrent(referenz) + 1));
    });
  });
  container.querySelectorAll<HTMLButtonElement>('.stat-dec').forEach((btn) => {
    btn.addEventListener('click', () => {
      const row = btn.closest<HTMLElement>('.stat-row')!;
      const referenz = row.dataset.referenz!;
      syncOpenGroups();
      withScrollAnchor(`.stat-row[data-referenz="${CSS.escape(referenz)}"]`, () => onChange(referenz, Math.max(0, findCurrent(referenz) - 1)));
    });
  });
  container.querySelectorAll<HTMLInputElement>('.stat-value').forEach((input) => {
    input.addEventListener('change', () => {
      const row = input.closest<HTMLElement>('.stat-row')!;
      const referenz = row.dataset.referenz!;
      let parsed = Math.max(0, Math.floor(Number(input.value)));
      if (input.max) parsed = Math.min(parsed, Number(input.max));
      syncOpenGroups();
      const rowSelector = `.stat-row[data-referenz="${CSS.escape(referenz)}"]`;
      withScrollAnchor(rowSelector, () => onChange(referenz, Number.isFinite(parsed) ? parsed : findCurrent(referenz)));
    });
  });

  // Pool-Zuteilung ist hier seit dem Kampf-Tab (2026-07-20) reine Anzeige (renderPoolRow) - keine
  // Eingabefelder mehr, daher keine Event-Wiring noetig (Verteilung passiert jetzt pro Waffe auf
  // dem Kampf-Tab, siehe views/kampf.ts).
}
