// Spruchmagie-Tab (Nutzer 2026-07-20/21): eigener Tab fuer die Kategorie "Spruchmagie", eine
// collapsible Gruppe je Zauberschule (rule.parent), analog Alchemika-Kategorien in
// ausruestung.ts. Sichtbarkeit/Steigern-Gates siehe engine/spruchmagieGating.ts (bewusst reine
// UI-Ebene, wie kiBaumGating.ts) - beide Gates muessen fuer den "+"-Button erfuellt sein:
// 1. canLearnSpell: Grad <= Weisheit normal, Grad===Weisheit+1 nur mit freiem Hauszauber-Slot,
//    Grad>Weisheit+1 wird komplett ausgeblendet (nicht nur gesperrt).
// 2. canIncreaseSpell: Mindestintelligenz + Vorstufe derselben Schule auf TaW>=10 (ausser Grad 1).
//
// Zeilen-Layout (Nutzer-Vorgabe 2026-07-24: Grad ist jetzt die erste Spalte): Grad | TaW | Name |
// Min.Int | Eig | Wirkung | Gegenprobe | RW | Ziel | Form | Art | Aufr. | VZ | ED | WD |
// "St.1/St.2/St.3" | Mana. St.2/St.3 nur sichtbar mit den Talenten
// talente_spruchmagie_stufe_2/3_zaubern (schulen-uebergreifend). Zauberprobe (nur wenn TaW>0):
// fuer jede freigeschaltete Stufe einzeln Magie+Eig-Bonus+TaW-StufeX berechnet, alle Werte durch
// "/" getrennt (nicht nur die hoechste).
//
// Struktur je Schule (Nutzer 2026-07-24): innerhalb der Schule-Gruppe ist jeder Grad ein eigener
// Block mit Header-Zeile. Bereits gelernte Zauber (TaW>0) dieses Grades sind IMMER sichtbar,
// unabhaengig vom Auf/Zu-Zustand - nur die noch nicht gelernten Zauber dieses Grades stecken
// hinter einem eigenen Auf/Zu-Toggle ("n weitere nicht gelernte Zauber"), damit man die grosse
// Zauberliste ausblenden kann, ohne die eigenen Zauber zu verlieren. Zusaetzlich gibt es oben im
// Tab eine eigene collapsible Gesamtliste ueber alle Schulen hinweg mit allen gewaehlten Zaubern
// (TaW>0), inkl. Schule-Spalte, damit man nicht durch jede Schule einzeln scrollen muss.

import type { ComputedSheet, ComputedRule } from '../engine/characterSheet';
import { canLearnSpell, canIncreaseSpell, getMaxLernbarerGrad } from '../engine/spruchmagieGating';
import { SPRUCHMAGIE_DETAILS, type SpruchmagieDetail } from '../data/spruchmagieDetails';
import { aufrunden } from '../engine/functions';
import { resolveRw, resolveWirkungText } from '../engine/spruchmagieRw';
import { tooltipAttr } from './tooltip';
import { withScrollAnchor } from './scrollAnchor';
import { formatKlickpreis, parseStatInputValue, type OnValueChange } from './categoryView';

const STUFE_2_TALENT_REFERENZ = 'talente_spruchmagie_stufe_2_zaubern';
const STUFE_3_TALENT_REFERENZ = 'talente_spruchmagie_stufe_3_zaubern';

const SPRUCHMAGIE_COLUMNS = [
  'Grad', 'TaW', 'Name', 'Min.Int', 'Eig', 'Wirkung', 'Gegenprobe', 'RW', 'Ziel', 'Form', 'Art',
  'Aufr.', 'VZ', 'ED', 'WD', 'St. 1/2/3', 'Mana',
];
const SPRUCHMAGIE_COLUMNS_MIT_SCHULE = ['Schule', ...SPRUCHMAGIE_COLUMNS];

/** Aufgeklappte Zauberschulen (Nutzer-Persistenz-Muster wie openAlchemikaKategorien in
 *  ausruestung.ts) - alle standardmaessig zu. */
const openSchulen = new Set<string>();

/** Aufgeklappte Grad-Bloecke je Schule (Key "<Schule>::<Grad>") - analog openSchulen, ebenfalls
 *  standardmaessig zu (nur die bereits gelernten Zauber sollen ungefragt sichtbar sein). */
const openGrade = new Set<string>();

/** Gesamtliste ueber alle Schulen (Nutzer 2026-07-24) - anders als Schulen/Grad-Bloecke per
 *  Default OFFEN, weil sie nur die bereits gewaehlten (also wenigen) Zauber zeigt. */
let openGesamtliste = true;

/** Suchtext (Nutzer 2026-07-24, "add a search field" auf Tab-Top-Level) - filtert Zauber nach
 *  Name, wirkt auf Gesamtliste UND Schul-Gruppen gleichermassen. Analog searchTextByKategorie
 *  in talenteVornachteile.ts, hier aber nur ein einzelnes Feld (kein Per-Kategorie-Map noetig,
 *  da der Spruchmagie-Tab nur eine Such-Domaene hat). */
let spruchmagieSearchText = '';

/** "Nur verfuegbare zeigen"-Toggle (Nutzer 2026-07-24): AN (Default) = bisheriges Verhalten,
 *  Grad>Weisheit+1 bleibt komplett ausgeblendet (siehe buildSchulRows). AUS = alle Zauber jeder
 *  Schule unabhaengig von Gates anzeigen (auch nie erreichbare Grade), weiterhin optisch
 *  gesperrt/opacity ueber row.unlocked. */
let showNurVerfuegbare = true;

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getAttWert(sheet: ComputedSheet, referenz: string): number {
  return (sheet.byKategorie['Attribute'] ?? []).find((r) => r.rule.referenz === referenz)?.currentValue ?? 0;
}

export function getAttMagie(sheet: ComputedSheet): number {
  return getAttWert(sheet, 'att_magie');
}

export function getAttAura(sheet: ComputedSheet): number {
  return getAttWert(sheet, 'att_aura');
}

/** "Macht"/"Mana" sind Formel-Zeilen (Kategorie "Charakterwerte") - Wert kommt ueber
 *  computedValue, NICHT currentValue (letzteres ist bei Formel-Zeilen immer 0, siehe der
 *  bekannte Spruchmagie-Weisheit-Bug). */
export function getCharakterwertFormel(sheet: ComputedSheet, referenz: string): number {
  const row = (sheet.byKategorie['Charakterwerte'] ?? []).find((r) => r.rule.referenz === referenz);
  return Number(row?.computedValue ?? 0);
}

export function getEigBonusValue(sheet: ComputedSheet, eigBonusReferenz: string | undefined): { label: string; value: number } | undefined {
  if (!eigBonusReferenz) return undefined;
  const row = (sheet.byKategorie['Eigenschaftsbonus'] ?? []).find((r) => r.rule.referenz === eigBonusReferenz);
  if (!row) return undefined;
  const value = Number(row.computedValue ?? 0);
  return { label: row.rule.abkuerzung ?? row.rule.beschreibung ?? eigBonusReferenz, value };
}

function isTalentSelected(sheet: ComputedSheet, referenz: string): boolean {
  return (sheet.byKategorie['Talente'] ?? []).find((r) => r.rule.referenz === referenz)?.selected ?? false;
}

/** talente_schnell_zaubern_stufe_1-3 (Nutzer 2026-07-21, nicht kumulativ - nur die hoechste
 *  besessene Stufe zaehlt, siehe Talent-Wirkungstext): VZ-Teiler fuer St.1/St.2/St.3, in
 *  derselben Reihenfolge wie unlockedStufen. Baseline OHNE das Talent ist bereits :1/:2/:3 (das
 *  Zaubern auf hoeherer Stufe verkuerzt die VZ inhaerent) - Schnell Zaubern erhoeht diese Teiler. */
function getSchnellZauberTeiler(sheet: ComputedSheet): [number, number, number] {
  if (isTalentSelected(sheet, 'talente_schnell_zaubern_stufe_3')) return [4, 5, 6];
  if (isTalentSelected(sheet, 'talente_schnell_zaubern_stufe_2')) return [3, 4, 5];
  if (isTalentSelected(sheet, 'talente_schnell_zaubern_stufe_1')) return [2, 3, 4];
  return [1, 2, 3];
}

/** Teilt einen VZ-Rohwert (ueberwiegend Sekunden-Zahlen, z.T. mit "sec"-Suffix wie "7sec") durch
 *  den Teiler und rundet auf (aufrunden, dieselbe Konvention wie der Rest der Engine) - laesst
 *  nicht-numerische Werte unveraendert statt sie falsch zu verstuemmeln. */
function divideVzValue(raw: string, teiler: number): string {
  if (teiler === 1) return raw;
  const match = /^([\d.,]+)\s*(.*)$/.exec(raw.trim());
  if (!match) return raw;
  const num = Number(match[1].replace(',', '.'));
  if (!Number.isFinite(num)) return raw;
  return `${aufrunden(num / teiler, 0)}${match[2]}`;
}

export interface Row {
  rule: ComputedRule['rule'];
  currentValue: number;
  kostenNext?: number;
  kostenCurrent?: number;
  detail: SpruchmagieDetail | undefined;
  learnGate: ReturnType<typeof canLearnSpell>;
  increaseGate: ReturnType<typeof canIncreaseSpell>;
  unlocked: boolean;
}

function buildSchulRows(sheet: ComputedSheet, schule: string, needle = ''): Row[] {
  const alle = sheet.byKategorie['Spruchmagie'] ?? [];
  const weisheit = getMaxLernbarerGrad(sheet);
  return alle
    .filter((r) => r.rule.art === 'Wert' && r.rule.parent === schule)
    .filter((r) => !needle || (r.rule.beschreibung ?? '').toLowerCase().includes(needle))
    .map((r) => {
      const learnGate = canLearnSpell(sheet, r.rule);
      const increaseGate = canIncreaseSpell(sheet, r.rule);
      return {
        rule: r.rule,
        currentValue: r.currentValue ?? 0,
        kostenNext: r.kostenNext,
        kostenCurrent: r.kostenCurrent,
        detail: SPRUCHMAGIE_DETAILS[r.rule.referenz],
        learnGate,
        increaseGate,
        unlocked: learnGate.allowed && increaseGate.allowed,
      };
    })
    // Grad > Weisheit+1 ist mit keinem Hauszauber jemals erreichbar - per Default komplett
    // ausblenden statt nur zu sperren (Nutzer 2026-07-21: "only show zauber available with
    // wei+1"). Der "Nur verfuegbare"-Toggle (Nutzer 2026-07-24) kann diesen Filter aufheben, um
    // wirklich ALLE Zauber der Schule zu sehen (weiterhin optisch gesperrt via row.unlocked).
    .filter((r) => !showNurVerfuegbare || Number(r.rule.grad ?? 0) <= weisheit + 1);
}

interface GradGruppe {
  grad: number;
  gewaehlt: Row[];
  rest: Row[];
}

/** Gruppiert die Zauber einer Schule nach Grad (aufsteigend) - innerhalb jeder Gruppe getrennt
 *  nach bereits gewaehlt (TaW>0, immer sichtbar) und Rest (freigeschaltet/gesperrt, hinter dem
 *  Grad-Toggle versteckbar). */
function groupRowsByGrad(rows: Row[]): GradGruppe[] {
  const byGrad = new Map<number, Row[]>();
  for (const r of rows) {
    const grad = Number(r.rule.grad ?? 0);
    if (!byGrad.has(grad)) byGrad.set(grad, []);
    byGrad.get(grad)!.push(r);
  }
  const nameCompare = (a: Row, b: Row) => (a.rule.beschreibung ?? '').localeCompare(b.rule.beschreibung ?? '', 'de');
  return [...byGrad.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([grad, gruppenRows]) => ({
      grad,
      gewaehlt: gruppenRows.filter((r) => r.currentValue > 0).sort(nameCompare),
      rest: gruppenRows
        .filter((r) => r.currentValue <= 0)
        .sort((a, b) => (a.unlocked !== b.unlocked ? (a.unlocked ? -1 : 1) : nameCompare(a, b))),
    }));
}

/** Alle gewaehlten Zauber (TaW>0) ueber alle Schulen hinweg, fuer die Gesamtliste (Nutzer
 *  2026-07-24) - sortiert nach Schule, dann Grad, dann Name. */
export function buildAllGewaehlteRows(sheet: ComputedSheet, schulen: string[], needle = ''): Row[] {
  return schulen
    .flatMap((s) => buildSchulRows(sheet, s, needle))
    .filter((r) => r.currentValue > 0)
    .sort((a, b) => {
      const schuleA = a.rule.parent ?? '';
      const schuleB = b.rule.parent ?? '';
      if (schuleA !== schuleB) return schuleA.localeCompare(schuleB, 'de');
      const gradA = Number(a.rule.grad ?? 0);
      const gradB = Number(b.rule.grad ?? 0);
      if (gradA !== gradB) return gradA - gradB;
      return (a.rule.beschreibung ?? '').localeCompare(b.rule.beschreibung ?? '', 'de');
    });
}

/** "St. 1/St. 2/St. 3": St.1 immer, St.2/St.3 nur mit den passenden Talenten (schulen-
 *  uebergreifend). Zauberprobe-Variante berechnet zusaetzlich Magie+Eig-Bonus+TaW-StufeX statt
 *  nur den rohen Erschwerungswert - beide nutzen dieselbe Stufen-Auswahl. */
export function unlockedStufen(sheet: ComputedSheet, detail: SpruchmagieDetail | undefined): Array<{ label: string; erschwerung: number }> {
  if (!detail) return [];
  const stufen: Array<{ label: string; erschwerung: number }> = [];
  if (detail.stufe1 !== undefined) stufen.push({ label: 'St. 1', erschwerung: Number(detail.stufe1) });
  if (detail.stufe2 !== undefined && isTalentSelected(sheet, STUFE_2_TALENT_REFERENZ)) {
    stufen.push({ label: 'St. 2', erschwerung: Number(detail.stufe2) });
  }
  if (detail.stufe3 !== undefined && isTalentSelected(sheet, STUFE_3_TALENT_REFERENZ)) {
    stufen.push({ label: 'St. 3', erschwerung: Number(detail.stufe3) });
  }
  return stufen;
}

export function renderStufenCell(stufen: Array<{ label: string; erschwerung: number }>): string {
  if (stufen.length === 0) return '–';
  return escapeHtml(stufen.map((s) => s.erschwerung).join(' / '));
}

/** Gute Spruchzauberprobe (talente_spruchgute_stufe_1/2, schulen-uebergreifend): Stufe 1 =
 *  Weisheit, Stufe 2 = Weisheit + Eigenschaftsbonus, gedeckelt auf Normale:2 pro Zauberstufe
 *  (Nutzer 2026-07-21, "talente-add-implementation-charaktererstellung.txt"). */
function getGuteProbe(sheet: ComputedSheet, normaleProbe: number, eigBonWert: number): number | undefined {
  const stufe2 = isTalentSelected(sheet, 'talente_spruchgute_stufe_2');
  const stufe1 = stufe2 || isTalentSelected(sheet, 'talente_spruchgute_stufe_1');
  if (!stufe1) return undefined;
  const weisheit = getMaxLernbarerGrad(sheet);
  const gute = stufe2 ? weisheit + eigBonWert : weisheit;
  return Math.min(gute, Math.floor(normaleProbe / 2));
}

export function renderZauberprobeCell(sheet: ComputedSheet, row: Row, stufen: Array<{ label: string; erschwerung: number }>): string {
  if (row.currentValue <= 0 || stufen.length === 0) return '';
  const eigBon = getEigBonusValue(sheet, row.rule.eigBonus)?.value ?? 0;
  const magie = getAttMagie(sheet);
  const werte = stufen.map((s) => {
    const normale = row.currentValue + eigBon + magie - s.erschwerung;
    const gute = getGuteProbe(sheet, normale, eigBon);
    return gute !== undefined ? `${normale}/g${gute}` : `${normale}`;
  });
  return escapeHtml(werte.join(' / '));
}

/** VZ (Vorbereitungszeit) je freigeschalteter Stufe, geteilt durch den Schnell-Zaubern-Teiler
 *  dieser Stufe (talente_schnell_zaubern_stufe_1-3, Baseline :1/:2/:3 - siehe getSchnellZauberTeiler),
 *  analog renderZauberprobeCell. Ohne St.2/St.3-Talent bleibt es bei einem einzelnen Wert. */
export function renderVzCell(sheet: ComputedSheet, detail: SpruchmagieDetail | undefined, stufenCount: number): string {
  const raw = detail?.vorbereitungszeit;
  if (!raw) return '–';
  const teiler = getSchnellZauberTeiler(sheet);
  if (stufenCount <= 1) return escapeHtml(divideVzValue(raw, teiler[0]));
  const werte = Array.from({ length: stufenCount }, (_, i) => divideVzValue(raw, teiler[i]));
  return escapeHtml(werte.join(' / '));
}

/** Zeigt ALLE aktuell nicht erfuellten Sperrgruende gleichzeitig (Nutzer 2026-07-24), nicht nur
 *  den zuerst gefundenen - learnGate und increaseGate sind unabhaengig, beide koennen parallel
 *  fehlschlagen (z.B. Hauszauber-Slot belegt UND Mindestintelligenz nicht erreicht). */
function gateTitle(row: Row): string {
  if (row.currentValue > 0) return '';
  const gruende = [
    !row.learnGate.allowed ? row.learnGate.reason : undefined,
    !row.increaseGate.allowed ? row.increaseGate.reason : undefined,
  ].filter((r): r is string => !!r);
  return gruende.join(' | ');
}

/** rowKey identifiziert die konkrete <tr>-Instanz eindeutig im DOM (nicht nur den Zauber) - ein
 *  gewaehlter Zauber taucht sowohl in seiner Schul-Tabelle als auch in der Gesamtliste auf, beide
 *  Zeilen brauchen fuer withScrollAnchor (siehe scrollAnchor.ts) einen je Vorkommen eindeutigen
 *  Selektor, sonst trifft document.querySelector immer nur das erste Vorkommen im DOM. */
function renderRow(sheet: ComputedSheet, row: Row, opts?: { showSchule?: boolean; readOnly?: boolean }): string {
  const { rule, currentValue, detail } = row;
  const name = rule.beschreibung ?? rule.referenz;
  const stufen = unlockedStufen(sheet, detail);
  const rowClass = row.unlocked ? '' : currentValue > 0 ? 'spruchmagie-row-invalid' : 'spruchmagie-row-locked';
  const disabled = !row.unlocked;
  const plusTitle = gateTitle(row);
  // Gleiches Format wie categoryView.ts (Nutzer 2026-07-24, "same currency" wie Eigenschaft/
  // Attribute usw.) - Label war faelschlich "TaW" statt "SP" (kostenNext ist derselbe kumulative
  // SP-Kosten-Wert wie ueberall sonst, siehe characterSheet.ts spSpent, das Spruchmagie mit
  // einrechnet - die WENN(wert=0;0;10+(wert-1)*grad)-Formel ist ein SP-Kosten-Wert, kein TaW).
  const costLabel = formatKlickpreis(row.kostenCurrent, row.kostenNext);
  const probe = renderZauberprobeCell(sheet, row, stufen);
  const showSchule = opts?.showSchule ?? false;
  const readOnly = opts?.readOnly ?? false;
  const rowKey = showSchule ? `gesamt::${rule.referenz}` : `schule::${rule.parent}::${rule.referenz}`;
  const schuleCell = showSchule ? `<td>${escapeHtml(rule.parent ?? '–')}</td>` : '';

  return `
    <tr class="${rowClass}" data-referenz="${rule.referenz}" data-row-key="${escapeHtml(rowKey)}">
      ${schuleCell}
      <td>${escapeHtml(rule.grad ?? '–')}</td>
      <td class="spruchmagie-taw-cell"><div class="spruchmagie-taw-inner">
        ${readOnly ? `
        <span class="kampf-pool-value numeric-field-output numeric-field-two">${currentValue}</span>` : `
        <button type="button" class="stat-dec" aria-label="verringern" ${currentValue <= 0 ? 'disabled' : ''}>-</button>
        <input type="number" class="stat-value kampf-taw-input" min="0" value="${currentValue}" ${disabled && currentValue <= 0 ? 'disabled' : ''} aria-label="TaW ${escapeHtml(name)}" />
        <button type="button" class="stat-inc" aria-label="erhöhen" ${disabled ? 'disabled' : ''}${tooltipAttr(plusTitle)}>+</button>
        <span class="stat-cost stat-cost-click">${costLabel}</span>`}
      </div></td>
      <td class="spruchmagie-name-cell">${escapeHtml(name)}${probe ? `<div class="spruchmagie-probe"${tooltipAttr('Probe = TaW + Eig.Bon. + Magie − Erschwerung (je Zauberstufe)')}>Probe: ${probe}</div>` : ''}</td>
      <td>${escapeHtml(detail?.minInt ?? '–')}</td>
      <td>${escapeHtml(getEigBonusValue(sheet, rule.eigBonus)?.label ?? '–')}</td>
      <td class="spruchmagie-wirkung-cell"${rule.wirkung ? tooltipAttr(`Rohtext: ${rule.wirkung}`) : ''}>${escapeHtml(resolveWirkungText(rule.wirkung, getCharakterwertFormel(sheet, 'macht'), getAttMagie(sheet), getAttAura(sheet)))}</td>
      <td class="spruchmagie-wirkung-cell">${escapeHtml(resolveWirkungText(detail?.gegenprobe, getCharakterwertFormel(sheet, 'macht'), getAttMagie(sheet), getAttAura(sheet)))}</td>
      <td${detail?.rw ? tooltipAttr(`Formel: ${detail.rw}`) : ''}>${escapeHtml(resolveRw(detail?.rw, getCharakterwertFormel(sheet, 'macht'), getAttMagie(sheet), getAttAura(sheet), getCharakterwertFormel(sheet, 'mana')))}</td>
      <td>${escapeHtml(detail?.ziel ?? '–')}</td>
      <td>${escapeHtml(detail?.form ?? '–')}</td>
      <td>${escapeHtml(detail?.zauberArt ?? '–')}</td>
      <td>${escapeHtml(detail?.aufrechterhaltung ?? '–')}</td>
      <td>${renderVzCell(sheet, detail, stufen.length)}</td>
      <td>${escapeHtml(detail?.einwirkdauer ?? '–')}</td>
      <td>${escapeHtml(detail?.wirkungsdauer ?? '–')}</td>
      <td>${renderStufenCell(stufen)}</td>
      <td>${escapeHtml(detail?.mana ?? '–')}</td>
    </tr>`;
}

function gradToggleLabel(isOpen: boolean, count: number): string {
  return `${isOpen ? '▾' : '▸'} ${count} weitere nicht gelernte Zauber`;
}

function renderGradToggleRow(gradKey: string, count: number, colspan: number, isOpen: boolean): string {
  return `
    <tr class="spruchmagie-grad-toggle-row">
      <td colspan="${colspan}">
        <button type="button" class="spruchmagie-grad-toggle-btn" data-grad-target="${escapeHtml(gradKey)}" data-grad-count="${count}" aria-expanded="${isOpen}">${escapeHtml(gradToggleLabel(isOpen, count))}</button>
      </td>
    </tr>`;
}

function renderGradGruppe(sheet: ComputedSheet, schule: string, gruppe: GradGruppe, colspan: number, needle = '', readOnly = false): string {
  const gradKey = `${schule}::${gruppe.grad}`;
  // Bei aktiver Suche zwangsweise aufklappen, damit Treffer im "Rest"-Bucket nicht hinter dem
  // Grad-Toggle verschwinden (analog renderSchulGruppe).
  const isOpen = readOnly || !!needle || openGrade.has(gradKey);
  const kopfUndGewaehlt = `
    <tbody>
      <tr class="spruchmagie-grad-header"><td colspan="${colspan}">Grad ${gruppe.grad}</td></tr>
      ${gruppe.gewaehlt.map((r) => renderRow(sheet, r, { readOnly })).join('')}
      ${gruppe.rest.length > 0 && !readOnly ? renderGradToggleRow(gradKey, gruppe.rest.length, colspan, isOpen) : ''}
    </tbody>`;
  const restKoerper = gruppe.rest.length > 0
    ? `<tbody data-grad-body="${escapeHtml(gradKey)}" class="${isOpen ? '' : 'spruchmagie-grad-hidden'}">${gruppe.rest.map((r) => renderRow(sheet, r, { readOnly })).join('')}</tbody>`
    : '';
  return kopfUndGewaehlt + restKoerper;
}

function renderSchulGruppe(sheet: ComputedSheet, schule: string, needle = '', readOnly = false): string {
  const rows = buildSchulRows(sheet, schule, needle);
  if (rows.length === 0) return '';
  // Bei aktiver Suche zwangsweise aufklappen (Treffer sollen nicht hinter einem zugeklappten
  // Details-Element verschwinden), ohne den manuellen Aufklapp-Zustand zu ueberschreiben -
  // analog openParents-Handling in talenteVornachteile.ts.
  const openAttr = readOnly || needle || openSchulen.has(schule) ? ' open' : '';
  const gruppen = groupRowsByGrad(rows);
  const colspan = SPRUCHMAGIE_COLUMNS.length;
  return `
    <div class="stat-card">
      <details class="stat-group" data-spruchmagie-schule="${escapeHtml(schule)}"${openAttr}>
        <summary>${escapeHtml(schule)} <span class="stat-group-count">(${rows.length} Zauber)</span></summary>
        <div class="kampf-table-scroll">
          <table class="bogen-table spruchmagie-table">
            <thead><tr>${SPRUCHMAGIE_COLUMNS.map((c) => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead>
            ${gruppen.map((g) => renderGradGruppe(sheet, schule, g, colspan, needle, readOnly)).join('')}
          </table>
        </div>
      </details>
    </div>`;
}

function renderGesamtliste(sheet: ComputedSheet, schulen: string[], needle = '', readOnly = false): string {
  const rows = buildAllGewaehlteRows(sheet, schulen, needle);
  const openAttr = readOnly || openGesamtliste ? ' open' : '';
  const colspan = SPRUCHMAGIE_COLUMNS_MIT_SCHULE.length;
  const body = rows.length > 0
    ? rows.map((r) => renderRow(sheet, r, { showSchule: true, readOnly })).join('')
    : `<tr><td colspan="${colspan}" class="spruchmagie-empty">Noch keine Zauber gewählt.</td></tr>`;
  return `
    <div class="stat-card">
      <details class="stat-group" data-spruchmagie-gesamtliste${openAttr}>
        <summary>Alle gewählten Zauber <span class="stat-group-count">(${rows.length})</span></summary>
        <div class="kampf-table-scroll">
          <table class="bogen-table spruchmagie-table">
            <thead><tr>${SPRUCHMAGIE_COLUMNS_MIT_SCHULE.map((c) => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead>
            <tbody>${body}</tbody>
          </table>
        </div>
      </details>
    </div>`;
}

function renderSpruchmagieContent(container: HTMLElement, sheet: ComputedSheet, onChange?: OnValueChange): void {
  const schulen = [...new Set((sheet.byKategorie['Spruchmagie'] ?? []).map((r) => r.rule.parent).filter((p): p is string => !!p))]
    .sort((a, b) => a.localeCompare(b, 'de'));

  // VOR dem innerHTML-Ersatz sichern, ob das Suchfeld gerade fokussiert war (und an welcher
  // Cursor-Position) - sonst wuerde JEDER Re-Render (auch durch Wert-Klicks ausgeloest) den
  // Fokus stehlen bzw. verlieren. Analog renderAuswahlView in talenteVornachteile.ts.
  const prevSearchInput = container.querySelector<HTMLInputElement>('#spruchmagie-search');
  const searchWasFocused = prevSearchInput !== null && document.activeElement === prevSearchInput;
  const prevSelectionStart = prevSearchInput?.selectionStart ?? null;

  const readOnly = onChange === undefined;
  const needle = readOnly ? '' : spruchmagieSearchText.trim().toLowerCase();

  const filtersHtml = readOnly ? '' : `
    <div class="ausruestung-filters">
      <input type="text" id="spruchmagie-search" placeholder="Suche..." value="${escapeHtml(spruchmagieSearchText)}" />
      <label class="auswahl-filter-checkbox">
        <input type="checkbox" id="spruchmagie-nur-verfuegbare" ${showNurVerfuegbare ? 'checked' : ''} />
        Nur verfügbare zeigen
      </label>
    </div>`;

  container.innerHTML = `
    ${filtersHtml}
    <div class="spruchmagie-info">
      <b>Zauberprobe</b> = Magie + Eig-Bonus + TaW − Stufe-Erschwerung (St. 1/2/3, je nachdem welche Stufe gesprochen wird)
    </div>
    ${renderGesamtliste(sheet, schulen, needle, readOnly)}
    ${schulen.map((s) => renderSchulGruppe(sheet, s, needle, readOnly)).join('')}`;

  if (!onChange) return;

  const searchInput = container.querySelector<HTMLInputElement>('#spruchmagie-search');
  if (searchInput) {
    if (searchWasFocused) {
      searchInput.focus();
      const pos = prevSelectionStart ?? searchInput.value.length;
      searchInput.setSelectionRange(pos, pos);
    }
    searchInput.addEventListener('input', (e) => {
      spruchmagieSearchText = (e.target as HTMLInputElement).value;
      renderSpruchmagieContent(container, sheet, onChange);
    });
  }

  const nurVerfuegbareCheckbox = container.querySelector<HTMLInputElement>('#spruchmagie-nur-verfuegbare');
  nurVerfuegbareCheckbox?.addEventListener('change', (e) => {
    showNurVerfuegbare = (e.target as HTMLInputElement).checked;
    renderSpruchmagieContent(container, sheet, onChange);
  });

  container.querySelectorAll<HTMLDetailsElement>('details[data-spruchmagie-schule]').forEach((details) => {
    const schule = details.dataset.spruchmagieSchule!;
    details.addEventListener('toggle', () => {
      if (details.open) openSchulen.add(schule);
      else openSchulen.delete(schule);
    });
  });

  const gesamtDetails = container.querySelector<HTMLDetailsElement>('details[data-spruchmagie-gesamtliste]');
  gesamtDetails?.addEventListener('toggle', () => {
    openGesamtliste = gesamtDetails.open;
  });

  container.querySelectorAll<HTMLButtonElement>('button[data-grad-target]').forEach((btn) => {
    const key = btn.dataset.gradTarget!;
    btn.addEventListener('click', () => {
      const body = container.querySelector<HTMLTableSectionElement>(`tbody[data-grad-body="${CSS.escape(key)}"]`);
      if (!body) return;
      const isHiddenNow = body.classList.toggle('spruchmagie-grad-hidden');
      const isOpen = !isHiddenNow;
      if (isOpen) openGrade.add(key);
      else openGrade.delete(key);
      const count = Number(btn.dataset.gradCount ?? '0');
      btn.setAttribute('aria-expanded', String(isOpen));
      btn.textContent = gradToggleLabel(isOpen, count);
    });
  });

  container.querySelectorAll<HTMLTableRowElement>('tr[data-referenz]').forEach((tr) => {
    const referenz = tr.dataset.referenz!;
    const rowKey = tr.dataset.rowKey!;
    const decBtn = tr.querySelector<HTMLButtonElement>('.stat-dec');
    const incBtn = tr.querySelector<HTMLButtonElement>('.stat-inc');
    const valueInput = tr.querySelector<HTMLInputElement>('.stat-value');
    const currentValue = Number(valueInput?.value ?? 0);
    const rowSelector = `tr[data-row-key="${CSS.escape(rowKey)}"]`;
    decBtn?.addEventListener('click', () => {
      if (decBtn.disabled) return;
      withScrollAnchor(rowSelector, () => onChange(referenz, Math.max(0, currentValue - 1)));
    });
    incBtn?.addEventListener('click', () => {
      if (incBtn.disabled) return;
      withScrollAnchor(rowSelector, () => onChange(referenz, currentValue + 1));
    });
    valueInput?.addEventListener('change', () => {
      withScrollAnchor(rowSelector, () => onChange(referenz, parseStatInputValue(valueInput.value, currentValue)));
    });
  });
}

export function renderSpruchmagieView(container: HTMLElement, sheet: ComputedSheet, onChange: OnValueChange): void {
  renderSpruchmagieContent(container, sheet, onChange);
}

export function renderReadOnlySpruchmagieView(container: HTMLElement, sheet: ComputedSheet): void {
  renderSpruchmagieContent(container, sheet);
}
