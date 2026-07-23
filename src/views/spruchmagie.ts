// Spruchmagie-Tab (Nutzer 2026-07-20/21): eigener Tab fuer die Kategorie "Spruchmagie", eine
// collapsible Gruppe je Zauberschule (rule.parent), analog Alchemika-Kategorien in
// ausruestung.ts. Sichtbarkeit/Steigern-Gates siehe engine/spruchmagieGating.ts (bewusst reine
// UI-Ebene, wie kiBaumGating.ts) - beide Gates muessen fuer den "+"-Button erfuellt sein:
// 1. canLearnSpell: Grad <= Weisheit normal, Grad===Weisheit+1 nur mit freiem Hauszauber-Slot,
//    Grad>Weisheit+1 wird komplett ausgeblendet (nicht nur gesperrt).
// 2. canIncreaseSpell: Mindestintelligenz + Vorstufe derselben Schule auf TaW>=10 (ausser Grad 1).
//
// Zeilen-Layout (Nutzer-Vorgabe 2026-07-21): TaW | Name | Grad | Min.Int | Eig | Wirkung |
// Gegenprobe | RW | Ziel | Form | Art | Aufr. | VZ | ED | WD | "St.1/St.2/St.3" | Mana.
// St.2/St.3 nur sichtbar mit den Talenten talente_spruchmagie_stufe_2/3_zaubern (schulen-
// uebergreifend). Zauberprobe (nur wenn TaW>0): fuer jede freigeschaltete Stufe einzeln
// Magie+Eig-Bonus+TaW-StufeX berechnet, alle Werte durch "/" getrennt (nicht nur die hoechste).

import type { ComputedSheet, ComputedRule } from '../engine/characterSheet';
import { canLearnSpell, canIncreaseSpell, getMaxLernbarerGrad } from '../engine/spruchmagieGating';
import { SPRUCHMAGIE_DETAILS, type SpruchmagieDetail } from '../data/spruchmagieDetails';
import { aufrunden } from '../engine/functions';
import { tooltipAttr } from './tooltip';
import { withScrollAnchor } from './scrollAnchor';
import type { OnValueChange } from './categoryView';

const STUFE_2_TALENT_REFERENZ = 'talente_spruchmagie_stufe_2_zaubern';
const STUFE_3_TALENT_REFERENZ = 'talente_spruchmagie_stufe_3_zaubern';

/** Aufgeklappte Zauberschulen (Nutzer-Persistenz-Muster wie openAlchemikaKategorien in
 *  ausruestung.ts) - alle standardmaessig zu. */
const openSchulen = new Set<string>();

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getAttWert(sheet: ComputedSheet, referenz: string): number {
  return (sheet.byKategorie['Attribute'] ?? []).find((r) => r.rule.referenz === referenz)?.currentValue ?? 0;
}

function getAttMagie(sheet: ComputedSheet): number {
  return getAttWert(sheet, 'att_magie');
}

function getEigBonusValue(sheet: ComputedSheet, eigBonusReferenz: string | undefined): { label: string; value: number } | undefined {
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

interface Row {
  rule: ComputedRule['rule'];
  currentValue: number;
  kostenNext?: number;
  detail: SpruchmagieDetail | undefined;
  learnGate: ReturnType<typeof canLearnSpell>;
  increaseGate: ReturnType<typeof canIncreaseSpell>;
  unlocked: boolean;
}

function buildSchulRows(sheet: ComputedSheet, schule: string): Row[] {
  const alle = sheet.byKategorie['Spruchmagie'] ?? [];
  const weisheit = getMaxLernbarerGrad(sheet);
  return alle
    .filter((r) => r.rule.art === 'Wert' && r.rule.parent === schule)
    .map((r) => {
      const learnGate = canLearnSpell(sheet, r.rule);
      const increaseGate = canIncreaseSpell(sheet, r.rule);
      return {
        rule: r.rule,
        currentValue: r.currentValue ?? 0,
        kostenNext: r.kostenNext,
        detail: SPRUCHMAGIE_DETAILS[r.rule.referenz],
        learnGate,
        increaseGate,
        unlocked: learnGate.allowed && increaseGate.allowed,
      };
    })
    // Grad > Weisheit+1 ist mit keinem Hauszauber jemals erreichbar - komplett ausblenden
    // statt nur zu sperren (Nutzer 2026-07-21: "only show zauber available with wei+1").
    .filter((r) => Number(r.rule.grad ?? 0) <= weisheit + 1)
    .sort((a, b) => {
      const groupOf = (r: Row) => (r.currentValue > 0 ? 0 : r.unlocked ? 1 : 2);
      const ga = groupOf(a);
      const gb = groupOf(b);
      if (ga !== gb) return ga - gb;
      const gradA = Number(a.rule.grad ?? 0);
      const gradB = Number(b.rule.grad ?? 0);
      if (gradA !== gradB) return gradA - gradB;
      return (a.rule.beschreibung ?? '').localeCompare(b.rule.beschreibung ?? '', 'de');
    });
}

/** "St. 1/St. 2/St. 3": St.1 immer, St.2/St.3 nur mit den passenden Talenten (schulen-
 *  uebergreifend). Zauberprobe-Variante berechnet zusaetzlich Magie+Eig-Bonus+TaW-StufeX statt
 *  nur den rohen Erschwerungswert - beide nutzen dieselbe Stufen-Auswahl. */
function unlockedStufen(sheet: ComputedSheet, detail: SpruchmagieDetail | undefined): Array<{ label: string; erschwerung: number }> {
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

function renderStufenCell(stufen: Array<{ label: string; erschwerung: number }>): string {
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

function renderZauberprobeCell(sheet: ComputedSheet, row: Row, stufen: Array<{ label: string; erschwerung: number }>): string {
  if (row.currentValue <= 0 || stufen.length === 0) return '';
  const eigBon = getEigBonusValue(sheet, row.rule.eigBonus)?.value ?? 0;
  const magie = getAttMagie(sheet);
  const werte = stufen.map((s) => {
    const normale = row.currentValue + eigBon + magie - s.erschwerung;
    const gute = getGuteProbe(sheet, normale, eigBon);
    return gute !== undefined ? `${normale}/G${gute}` : `${normale}`;
  });
  return escapeHtml(werte.join(' / '));
}

/** VZ (Vorbereitungszeit) je freigeschalteter Stufe, geteilt durch den Schnell-Zaubern-Teiler
 *  dieser Stufe (talente_schnell_zaubern_stufe_1-3, Baseline :1/:2/:3 - siehe getSchnellZauberTeiler),
 *  analog renderZauberprobeCell. Ohne St.2/St.3-Talent bleibt es bei einem einzelnen Wert. */
function renderVzCell(sheet: ComputedSheet, detail: SpruchmagieDetail | undefined, stufenCount: number): string {
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

function renderRow(sheet: ComputedSheet, row: Row): string {
  const { rule, currentValue, detail } = row;
  const name = rule.beschreibung ?? rule.referenz;
  const stufen = unlockedStufen(sheet, detail);
  const rowClass = row.unlocked ? '' : currentValue > 0 ? 'spruchmagie-row-invalid' : 'spruchmagie-row-locked';
  const disabled = !row.unlocked;
  const plusTitle = gateTitle(row);
  const costLabel = row.kostenNext !== undefined ? `${row.kostenNext} TaW` : '';
  const probe = renderZauberprobeCell(sheet, row, stufen);

  return `
    <tr class="${rowClass}" data-referenz="${rule.referenz}">
      <td class="spruchmagie-taw-cell">
        <button type="button" class="stat-dec" aria-label="verringern" ${currentValue <= 0 ? 'disabled' : ''}>-</button>
        <span class="kampf-pool-value">${currentValue}</span>
        <button type="button" class="stat-inc" aria-label="erhöhen" ${disabled ? 'disabled' : ''}${tooltipAttr(plusTitle)}>+</button>
        <span class="stat-cost">${costLabel}</span>
      </td>
      <td class="spruchmagie-name-cell">${escapeHtml(name)}${probe ? `<div class="spruchmagie-probe">Probe: ${probe}</div>` : ''}</td>
      <td>${escapeHtml(rule.grad ?? '–')}</td>
      <td>${escapeHtml(detail?.minInt ?? '–')}</td>
      <td>${escapeHtml(getEigBonusValue(sheet, rule.eigBonus)?.label ?? '–')}</td>
      <td class="spruchmagie-wirkung-cell">${escapeHtml(rule.wirkung ?? '–')}</td>
      <td class="spruchmagie-wirkung-cell">${escapeHtml(detail?.gegenprobe ?? '–')}</td>
      <td>${escapeHtml(detail?.rw ?? '–')}</td>
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

function renderSchulGruppe(sheet: ComputedSheet, schule: string): string {
  const rows = buildSchulRows(sheet, schule);
  if (rows.length === 0) return '';
  const openAttr = openSchulen.has(schule) ? ' open' : '';
  return `
    <div class="stat-card">
      <details class="stat-group" data-spruchmagie-schule="${escapeHtml(schule)}"${openAttr}>
        <summary>${escapeHtml(schule)} <span class="stat-group-count">(${rows.length} Zauber)</span></summary>
        <div class="kampf-table-scroll">
          <table class="bogen-table spruchmagie-table">
            <thead><tr>
              <th>TaW</th><th>Name</th><th>Grad</th><th>Min.Int</th><th>Eig</th><th>Wirkung</th>
              <th>Gegenprobe</th><th>RW</th><th>Ziel</th><th>Form</th><th>Art</th><th>Aufr.</th>
              <th>VZ</th><th>ED</th><th>WD</th><th>St. 1/2/3</th><th>Mana</th>
            </tr></thead>
            <tbody>${rows.map((r) => renderRow(sheet, r)).join('')}</tbody>
          </table>
        </div>
      </details>
    </div>`;
}

export function renderSpruchmagieView(container: HTMLElement, sheet: ComputedSheet, onChange: OnValueChange): void {
  const schulen = [...new Set((sheet.byKategorie['Spruchmagie'] ?? []).map((r) => r.rule.parent).filter((p): p is string => !!p))]
    .sort((a, b) => a.localeCompare(b, 'de'));

  container.innerHTML = `
    <div class="spruchmagie-info">
      <b>Zauberprobe</b> = Magie + Eig-Bonus + TaW − Stufe-Erschwerung (St. 1/2/3, je nachdem welche Stufe gesprochen wird)
    </div>
    ${schulen.map((s) => renderSchulGruppe(sheet, s)).join('')}`;

  container.querySelectorAll<HTMLDetailsElement>('details[data-spruchmagie-schule]').forEach((details) => {
    const schule = details.dataset.spruchmagieSchule!;
    details.addEventListener('toggle', () => {
      if (details.open) openSchulen.add(schule);
      else openSchulen.delete(schule);
    });
  });

  container.querySelectorAll<HTMLTableRowElement>('tr[data-referenz]').forEach((tr) => {
    const referenz = tr.dataset.referenz!;
    const decBtn = tr.querySelector<HTMLButtonElement>('.stat-dec');
    const incBtn = tr.querySelector<HTMLButtonElement>('.stat-inc');
    const valueSpan = tr.querySelector<HTMLSpanElement>('.kampf-pool-value');
    const currentValue = Number(valueSpan?.textContent ?? 0);
    const rowSelector = `tr[data-referenz="${CSS.escape(referenz)}"]`;
    decBtn?.addEventListener('click', () => {
      if (decBtn.disabled) return;
      withScrollAnchor(rowSelector, () => onChange(referenz, Math.max(0, currentValue - 1)));
    });
    incBtn?.addEventListener('click', () => {
      if (incBtn.disabled) return;
      withScrollAnchor(rowSelector, () => onChange(referenz, currentValue + 1));
    });
  });
}
