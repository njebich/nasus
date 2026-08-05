// Geweihte-Tab (Nutzer 2026-07-22): eigener Tab fuer Klerus-Charaktere, analog KI-/Psi-Tab.
// Die 3 Faehigkeiten (whk_geweihte_stossgebet/wunder/ritual, weiterhin Kategorie=WHK - gleiche
// Kosten-/Kostenformel, siehe whk.jsonl) werden seit Nutzer-Ask (Migration WHK-Tab->Geweihte-Tab)
// NICHT MEHR im WHK-Tab gelistet (siehe categoryView.ts's HIDDEN_REFERENZEN), sondern direkt hier
// als eigene, nicht aufklappbare Gruppe gekauft (renderWhkFaehigkeitenBlock) - bewusst OHNE die
// generische WHK-Custom-Spezialisierung-Funktion (Freitext-Zeile "Neue Spezialisierung...", siehe
// categoryView.ts renderEditableGroup), die nur den festen WHK-Kategorie-Tabellen vorbehalten
// bleibt. Rest des Tabs (Grad/KPP-Info, Wundertabelle) bleibt rein lesend.
//
// Tab-Sichtbarkeit selbst (Gate) wird in main.ts entschieden, nicht hier - dieser View wird nur
// gerendert, wenn bereits ein Geweihte-Gate-Talent gewaehlt ist.

import type { ComputedSheet, ComputedRule } from '../engine/characterSheet';
import {
  GEWEIHTEN_GRADE, getGeweihtenGrad, getGeweihtenGradEintrag, getMaxKpp, getAktiveGeweihteReligion,
} from '../engine/geweihte';
import { GEWEIHTE_WUNDER, type GeweihterWunderEintrag } from '../data/geweihteWunder';
import type { CharacterState } from '../state/characterStore';
import { formatKlickpreis, parseStatInputValue, type OnValueChange } from './categoryView';
import { withScrollAnchor } from './scrollAnchor';
import { resolveRw, resolveWirkungText } from '../engine/spruchmagieRw';
import { getAttAura, getAttMagie, getCharakterwertFormel } from './spruchmagie';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function nl2br(s: string): string {
  return escapeHtml(s).replace(/\n/g, '<br>');
}

function getAttWert(sheet: ComputedSheet, referenz: string): number {
  return (sheet.byKategorie['Attribute'] ?? []).find((r) => r.rule.referenz === referenz)?.currentValue ?? 0;
}

function getWhkTaw(sheet: ComputedSheet, referenz: string): number {
  return (sheet.byKategorie['WHK'] ?? []).find((r) => r.rule.referenz === referenz)?.currentValue ?? 0;
}

function getAusstrahlungsBonus(sheet: ComputedSheet): number {
  const row = (sheet.byKategorie['Eigenschaftsbonus'] ?? []).find((r) => r.rule.referenz === 'eig_bonus_k_ausstrahlung');
  return Number(row?.computedValue ?? 0);
}

/** Die 3 auf diesen Tab migrierten WHK-Faehigkeiten (siehe Datei-Kommentar oben), in fester
 *  Anzeige-Reihenfolge Stoßgebet->Wunder->Ritual (steigende Aufwand-/KPP-Stufe). */
const WHK_GEWEIHTE_REFERENZEN = ['whk_geweihte_stossgebet', 'whk_geweihte_wunder', 'whk_geweihte_ritual'] as const;

function renderWhkFaehigkeitenRow(r: ComputedRule, readOnly: boolean): string {
  const label = escapeHtml(r.rule.beschreibung ?? r.rule.referenz);
  const value = r.currentValue ?? 0;
  if (readOnly) {
    return `
      <div class="stat-row stat-row-readonly" data-referenz="${r.rule.referenz}">
        <span class="stat-label">${label}${r.rule.info ? ` <span class="stat-info-icon" title="${escapeHtml(r.rule.info)}">ⓘ</span>` : ''}</span>
        <span class="stat-value-readonly numeric-field-output numeric-field-two">${value}</span>
      </div>`;
  }
  const costNext = formatKlickpreis(r.kostenCurrent, r.kostenNext);
  return `
    <div class="stat-row" data-referenz="${r.rule.referenz}">
      <span class="stat-label">${label}${r.rule.info ? ` <span class="stat-info-icon" title="${escapeHtml(r.rule.info)}">ⓘ</span>` : ''}</span>
      <button type="button" class="stat-dec" aria-label="verringern" ${value <= 0 ? 'disabled' : ''}>-</button>
      <input type="number" class="stat-value numeric-field-two" min="0" value="${value}" aria-label="TaW ${label}" />
      <button type="button" class="stat-inc" aria-label="erhöhen">+</button>
      <span class="stat-cost stat-cost-click">${costNext}</span>
    </div>`;
}

/** Nicht aufklappbare Gruppe (Nutzer-Ask: "show them as non-collapsible group") - bewusst eine
 *  einfache "stat-card" statt eines "stat-group"-<details>-Elements wie im WHK-Tab. */
function renderWhkFaehigkeitenBlock(sheet: ComputedSheet, readOnly: boolean): string {
  const rows = WHK_GEWEIHTE_REFERENZEN
    .map((referenz) => (sheet.byKategorie['WHK'] ?? []).find((r) => r.rule.referenz === referenz))
    .filter((r): r is ComputedRule => r !== undefined);
  if (rows.length === 0) return '';
  return `
    <div class="stat-card geweihte-whk-gruppe">
      <h3 class="stat-section-heading">Fähigkeiten (Probe-Basis)</h3>
      <div class="stat-subgroup">${rows.map((r) => renderWhkFaehigkeitenRow(r, readOnly)).join('')}</div>
    </div>`;
}

function wireWhkFaehigkeiten(container: HTMLElement, sheet: ComputedSheet, onChange: OnValueChange): void {
  const findCurrent = (referenz: string) =>
    (sheet.byKategorie['WHK'] ?? []).find((r) => r.rule.referenz === referenz)?.currentValue ?? 0;
  const scope = container.querySelector<HTMLElement>('.geweihte-whk-gruppe');
  if (!scope) return;
  scope.querySelectorAll<HTMLButtonElement>('.stat-inc').forEach((btn) => {
    const referenz = btn.closest<HTMLElement>('.stat-row')!.dataset.referenz!;
    btn.addEventListener('click', () => {
      withScrollAnchor(`.stat-row[data-referenz="${CSS.escape(referenz)}"]`, () => onChange(referenz, findCurrent(referenz) + 1));
    });
  });
  scope.querySelectorAll<HTMLButtonElement>('.stat-dec').forEach((btn) => {
    const referenz = btn.closest<HTMLElement>('.stat-row')!.dataset.referenz!;
    btn.addEventListener('click', () => {
      withScrollAnchor(`.stat-row[data-referenz="${CSS.escape(referenz)}"]`, () => onChange(referenz, Math.max(0, findCurrent(referenz) - 1)));
    });
  });
  scope.querySelectorAll<HTMLInputElement>('.stat-value').forEach((input) => {
    const referenz = input.closest<HTMLElement>('.stat-row')!.dataset.referenz!;
    input.addEventListener('change', () => {
      withScrollAnchor(`.stat-row[data-referenz="${CSS.escape(referenz)}"]`, () => onChange(referenz, parseStatInputValue(input.value, findCurrent(referenz))));
    });
  });
}

/** Art (Stoß/Wunder/Ritual) bestimmt, welche der 3 Geweihte-WHK-Faehigkeiten die Probe
 *  liefert - siehe scripts/add_geweihte_rows.py fuer die 3 Referenzen. */
function whkReferenzForArt(art: string): string | undefined {
  if (art === 'Stoß') return 'whk_geweihte_stossgebet';
  if (art === 'Wunder') return 'whk_geweihte_wunder';
  if (art === 'Ritual') return 'whk_geweihte_ritual';
  return undefined;
}

function isTalentSelected(sheet: ComputedSheet, referenz: string): boolean {
  return (sheet.byKategorie['Talente'] ?? []).find((r) => r.rule.referenz === referenz)?.selected ?? false;
}

/** Gute Wunder-Probe (talente_geweihte_gute_wunder_stufe_1/2, Nutzer-Ask 2026-08-06): ersetzt
 *  die Basis-Gute (1, gilt implizit fuer jeden Geweihten) durch Karma (Stufe 1) bzw. Karma+Aura
 *  (Stufe 2), gedeckelt auf Normale:2 - gleiches Muster wie Spruchmagie/KI/PSI (siehe z.B.
 *  getGuteProbe in views/spruchmagie.ts; "_stufe_1/2"-Namenskonvention gibt den Vorstufenketten-
 *  Hardblock aus engine/talenteStufenKette.ts kostenlos dazu, Stufe 2 erfordert Stufe 1).
 *  Anzeigeregel "gXX nur anzeigen wenn g>1" (Proben v2.0.md §7, seit 2026-08-06 auch dort normiert). */
function getGuteWunderProbe(sheet: ComputedSheet, normaleProbe: number, karma: number): number | undefined {
  const stufe2 = isTalentSelected(sheet, 'talente_geweihte_gute_wunder_stufe_2');
  const stufe1 = stufe2 || isTalentSelected(sheet, 'talente_geweihte_gute_wunder_stufe_1');
  if (!stufe1) return undefined;
  const gute = stufe2 ? karma + getAttAura(sheet) : karma;
  const capped = Math.min(gute, Math.floor(normaleProbe / 2));
  return capped > 1 ? capped : undefined;
}

/** Probe = Aus.Bon + WHK-TaW - Malus (Nutzer-Antwort 2026-07-22). Leer, wenn die passende
 *  Geweihte-WHK-Faehigkeit noch nicht gelernt ist (TaW<1) oder die Zeile keinen Malus/keine
 *  Art traegt (die 2 Platzhalter-Zeilen der Quelle). Haengt "/g<X>" an, wenn "Gute Wunder"
 *  gewaehlt ist und die daraus resultierende Gute-Probe >1 ist (siehe getGuteWunderProbe). */
function computeProbe(eintrag: GeweihterWunderEintrag, sheet: ComputedSheet, karma: number): string {
  if (eintrag.malus === null) return '–';
  const whkReferenz = whkReferenzForArt(eintrag.art);
  if (!whkReferenz) return '–';
  const taw = getWhkTaw(sheet, whkReferenz);
  if (taw < 1) return '–';
  const normale = getAusstrahlungsBonus(sheet) + taw - eintrag.malus;
  const gute = getGuteWunderProbe(sheet, normale, karma);
  return gute !== undefined ? `${normale}/g${gute}` : String(normale);
}

function renderGradTabelle(aktiverGrad: number): string {
  const rows = GEWEIHTEN_GRADE.map((g) => `
    <tr${g.grad === aktiverGrad ? ' class="geweihte-grad-aktuell"' : ''}>
      <td>${g.grad}</td>
      <td>${escapeHtml(g.titel || '(kein Titel)')}</td>
      <td>${g.kppBasis}</td>
    </tr>`).join('');
  return `
    <table class="bogen-table geweihte-grad-table">
      <thead><tr><th>Grad</th><th>Titel</th><th>KPP-Basis</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function renderInfoBlock(sheet: ComputedSheet, character: CharacterState): string {
  const grad = getGeweihtenGrad(sheet);
  const gradEintrag = getGeweihtenGradEintrag(grad);
  const karma = getAttWert(sheet, 'att_karma');
  const maxKpp = getMaxKpp(grad, karma);
  const aktivReligion = getAktiveGeweihteReligion(character);

  return `
    <div class="ki-info-block">
      <div class="ki-info-grid">
        <div><b>Religion</b> = ${aktivReligion ? escapeHtml(`${aktivReligion.religion}, ${aktivReligion.sekte}`) : '–'}</div>
        <div><b>Geweihtengrad</b> = ${grad} ${gradEintrag.titel ? `(${escapeHtml(gradEintrag.titel)})` : ''}</div>
        <div><b>Karma</b> = ${karma}</div>
        <div><b>Max. KPP</b> = ${gradEintrag.kppBasis} + Karma×10 = ${maxKpp}</div>
        <div><b>Probe</b> = Aus.Bon + TaW − Malus (je nach Art: Stoß→Stoßgebet, Wunder→Wunder, Ritual→Ritual), mit Talent "Gute Wunder": /g&lt;Karma, max. Probe:2&gt;</div>
      </div>
      ${renderGradTabelle(grad)}
      <p class="geweihte-grad-hinweis">Grad 2-7 werden durch die Talente "Geweihter von &lt;Religion&gt;, Orthodox – &lt;Titel&gt;" (Stufe 2-7, je 5 TaP, Tab "Talente" unter "Geweihte") gesteigert - Stufe N erfordert Stufe N-1.</p>
    </div>`;
}

/** WD-Rohtext "P" (aus der Quelltabelle) ist eine Abkuerzung fuer "permanent" (Nutzer-Ask
 *  2026-08-05) - alle anderen WD-Texte (Formeln, Zeitangaben) bleiben unveraendert. */
function formatWd(wd: string): string {
  return wd === 'P' ? 'permanent' : wd;
}

/** Sortierschluessel fuer Min. Karma: fehlende Angabe (die 2 Platzhalter-Zeilen der Quelle)
 *  sortiert ans Tabellenende statt an den Anfang. */
function minKarmaSortKey(minKarma: number | null): number {
  return minKarma ?? Infinity;
}

/** Sortierschluessel fuer KPP: die meisten Werte sind reine Zahlen, manche tragen aber eine
 *  Formel statt einer Zahl (z.B. "Karma * 10", "1KPP pro Min" - siehe Datei-Kommentar in
 *  geweihteWunder.ts). Nutzer-Ask 2026-08-05: fuehrende Zahl auswerten wo vorhanden, reine
 *  Formeltexte ans Ende ihrer Min.-Karma-Gruppe sortieren. */
function kppSortKey(kpp: string): number {
  const match = /^\d+(?:[.,]\d+)?/.exec(kpp.trim());
  return match ? Number(match[0].replace(',', '.')) : Infinity;
}

function sortWunderZeilen(zeilen: GeweihterWunderEintrag[]): GeweihterWunderEintrag[] {
  return [...zeilen].sort((a, b) =>
    minKarmaSortKey(a.minKarma) - minKarmaSortKey(b.minKarma) || kppSortKey(a.kpp) - kppSortKey(b.kpp));
}

/** (M)/Magie/Aura/Karma-Aufloesung fuer RW und Wirkung, analog Spruchmagie (siehe engine/
 *  spruchmagieRw.ts) - Nutzer-Ask 2026-08-05, "wie bereits in Spruchmagie". RW bleibt roher
 *  Formeltext (resolveRw erkennt (M)/Magie/Aura/Karma direkt, keine Marker noetig), Wirkung
 *  ist bereits per Migration auf {M}/{Magie}/{Aura}/{Karma}-Marker umgestellt (geweihteWunder.ts). */
function renderWunderRow(eintrag: GeweihterWunderEintrag, sheet: ComputedSheet, karma: number): string {
  const gesperrt = eintrag.minKarma === null || karma < eintrag.minKarma;
  const probe = computeProbe(eintrag, sheet, karma);
  const macht = getCharakterwertFormel(sheet, 'macht');
  const magie = getAttMagie(sheet);
  const aura = getAttAura(sheet);
  const mana = getCharakterwertFormel(sheet, 'mana');
  const rw = resolveRw(eintrag.rw, macht, magie, aura, mana, karma);
  const wirkung = resolveWirkungText(eintrag.wirkung, macht, magie, aura, karma);
  return `
    <tr class="${gesperrt ? 'ki-row-locked' : ''}">
      <td>${probe}</td>
      <td class="ki-name-cell">${escapeHtml(eintrag.name || '–')}</td>
      <td class="geweihte-wirkung-cell">${nl2br(wirkung)}</td>
      <td>${escapeHtml(rw)}</td>
      <td>${escapeHtml(eintrag.ziel || '–')}</td>
      <td>${nl2br(eintrag.vd || '–')}</td>
      <td>${nl2br(formatWd(eintrag.wd) || '–')}</td>
      <td>${escapeHtml(eintrag.kpp || '–')}</td>
    </tr>`;
}

/** Eine der 3 Wunder-Tabellen (Stoßgebete/Wunder/Ritual - Nutzer-Ask 2026-08-05: Tabelle nach
 *  Art aufteilen). Jede Tabelle traegt ihre eigene Ueberschrift und wird unabhaengig sortiert. */
function renderWunderTabelle(titel: string, zeilen: GeweihterWunderEintrag[], sheet: ComputedSheet, karma: number): string {
  if (zeilen.length === 0) return '';
  return `
    <h3 class="stat-section-heading">${escapeHtml(titel)}</h3>
    <div class="kampf-table-scroll">
      <table class="bogen-table ki-table geweihte-table">
        <thead><tr>
          <th>Probe</th><th>Name</th><th>Wirkung</th><th>RW</th><th>Ziel</th><th>VD</th><th>WD</th><th>KPP</th>
        </tr></thead>
        <tbody>${sortWunderZeilen(zeilen).map((e) => renderWunderRow(e, sheet, karma)).join('')}</tbody>
      </table>
    </div>`;
}

export function renderGeweihteView(
  container: HTMLElement, sheet: ComputedSheet, character: CharacterState, onChange?: OnValueChange,
): void {
  const karma = getAttWert(sheet, 'att_karma');
  const aktivReligion = getAktiveGeweihteReligion(character);

  // Allgemeine Wunder: allen Religionen zugaenglich. Religionsspezifische Wunder: nur bei
  // passender Religion UND Sekte=Orthodox (Nutzer-Vorgabe - die Quelltabelle deckt bisher nur
  // die Orthodox-Sekte ab, siehe [[project-nasus-chargen-app]] Geweihte-Tab-Abschnitt).
  const zeilen = GEWEIHTE_WUNDER.filter((e) => {
    if (e.typ === 'Allgemeine Wunder') return true;
    return aktivReligion?.sekte === 'Orthodox' && e.typ === aktivReligion.religion;
  });

  // Aufteilung nach Art (Nutzer-Ask 2026-08-05: Stoßgebete/Wunder/Ritual als eigene Tabellen).
  // Zeilen ohne erkannte Art (die 1 unvollstaendige Platzhalter-Zeile der Quelle ohne Art-Angabe)
  // fallen in die Wunder-Tabelle, statt unsichtbar zu verschwinden.
  const stossgebete = zeilen.filter((e) => e.art === 'Stoß');
  const ritual = zeilen.filter((e) => e.art === 'Ritual');
  const wunder = zeilen.filter((e) => e.art !== 'Stoß' && e.art !== 'Ritual');

  container.innerHTML = `
    ${renderInfoBlock(sheet, character)}
    ${renderWhkFaehigkeitenBlock(sheet, onChange === undefined)}
    ${renderWunderTabelle('Stoßgebete', stossgebete, sheet, karma)}
    ${renderWunderTabelle('Wunder', wunder, sheet, karma)}
    ${renderWunderTabelle('Ritual', ritual, sheet, karma)}`;

  if (onChange) wireWhkFaehigkeiten(container, sheet, onChange);
}
