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

/** Probe = Aus.Bon + WHK-TaW - Malus (Nutzer-Antwort 2026-07-22). Leer, wenn die passende
 *  Geweihte-WHK-Faehigkeit noch nicht gelernt ist (TaW<1) oder die Zeile keinen Malus/keine
 *  Art traegt (die 2 Platzhalter-Zeilen der Quelle). */
function computeProbe(eintrag: GeweihterWunderEintrag, sheet: ComputedSheet): string {
  if (eintrag.malus === null) return '–';
  const whkReferenz = whkReferenzForArt(eintrag.art);
  if (!whkReferenz) return '–';
  const taw = getWhkTaw(sheet, whkReferenz);
  if (taw < 1) return '–';
  return String(getAusstrahlungsBonus(sheet) + taw - eintrag.malus);
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
        <div><b>Probe</b> = Aus.Bon + TaW − Malus (je nach Art: Stoß→Stoßgebet, Wunder→Wunder, Ritual→Ritual)</div>
      </div>
      ${renderGradTabelle(grad)}
      <p class="geweihte-grad-hinweis">Grad 2-7 sind nicht spielerseitig steigerbar - Meister-Vergabe, noch nicht umgesetzt (siehe Entwickeln-Sheet).</p>
    </div>`;
}

function renderWunderRow(eintrag: GeweihterWunderEintrag, sheet: ComputedSheet, karma: number): string {
  const gesperrt = eintrag.minKarma === null || karma < eintrag.minKarma;
  const probe = computeProbe(eintrag, sheet);
  return `
    <tr class="${gesperrt ? 'ki-row-locked' : ''}">
      <td>${probe}</td>
      <td>${escapeHtml(eintrag.typ)}</td>
      <td class="ki-name-cell">${escapeHtml(eintrag.name || '–')}</td>
      <td>${escapeHtml(eintrag.art || '–')}</td>
      <td>${eintrag.malus ?? '–'}</td>
      <td>${eintrag.minKarma ?? '–'}</td>
      <td>${escapeHtml(eintrag.rw || '–')}</td>
      <td>${nl2br(eintrag.vd || '–')}</td>
      <td>${nl2br(eintrag.wd || '–')}</td>
      <td class="geweihte-wirkung-cell">${nl2br(eintrag.wirkung || '–')}</td>
      <td>${escapeHtml(eintrag.kpp || '–')}</td>
    </tr>`;
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

  container.innerHTML = `
    ${renderInfoBlock(sheet, character)}
    ${renderWhkFaehigkeitenBlock(sheet, onChange === undefined)}
    <div class="kampf-table-scroll">
      <table class="bogen-table ki-table geweihte-table">
        <thead><tr>
          <th>Probe</th><th>Typ</th><th>Name</th><th>Art</th><th>Malus</th><th>Min. Karma</th>
          <th>RW</th><th>VD</th><th>WD</th><th>Wirkung</th><th>KPP</th>
        </tr></thead>
        <tbody>${zeilen.map((e) => renderWunderRow(e, sheet, karma)).join('')}</tbody>
      </table>
    </div>`;

  if (onChange) wireWhkFaehigkeiten(container, sheet, onChange);
}
