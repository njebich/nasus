// Psi-Tab (Nutzer 2026-07-21): eigener Tab fuer die Kategorie "PSI", analog KI-Tab (views/ki.ts).
// Kosten-/Maximum-Mechanik existiert bereits generisch (Kategorie=PSI ist bereits auf
// getFertigkeitBaseMax('PSI')=24 gedeckelt, Kosten = wert*9 EP ueber kostenRaw in psi.jsonl) -
// dieser Tab ist reine UI-Arbeit.
//
// Spaltenlayout (Nutzer-Vorgabe 2026-07-21): TaW | Probe | Name | Eig. | ST.1-7 | RW | WD | ED |
// MpZ. ST.1-7/RW/WD/ED/MpZ kommen NICHT aus der xlsx (die hat keine Wirkungs-/Stufentabelle fuer
// PSI), sondern aus psiZaubertabelle.json (extrahiert aus "PSI Magie Zaubertabelle 1.42.docx",
// siehe scripts/extract_psi_zaubertabelle.py) - reine Referenzwerte, nicht live berechnet
// ("i need no deeper understanding of the stufen and proben erschwerung", Nutzer 2026-07-21).
// Probe ist bewusst nur die Basisformel TaW + Eig.Bon + Aura + Magie (ohne Stufen-Erschwerung
// abzuziehen) - anders als spruchmagie.ts's renderZauberprobeCell.
//
// PSI-Zauberbaum (Telekinese/Empathie als Wurzeln) siehe engine/psiBaumGating.ts - Gating nutzt
// direkt rule.parent/rule.mindestTaw aus psi.jsonl, keine separate Kanten-Datei noetig.

import type { ComputedSheet } from '../engine/characterSheet';
import {
  isPsiWertUnlocked, getPsiVorbedingung, getPsiFreischaltungen, getPsiTreeDepths,
} from '../engine/psiBaumGating';
import { PSI_ZAUBERTABELLE } from '../data/psiZaubertabelle';
import { tooltipAttr } from './tooltip';
import type { OnValueChange } from './categoryView';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderInfoBlock(): string {
  return `
    <div class="ki-info-block">
      <div class="ki-info-grid">
        <div><b>Probe</b> = TaW + Eig.Bon. + Aura + Magie</div>
        <div><b>Kosten</b> = 9 EP pro Punkt</div>
        <div><b>ST.1-7</b> = Erschwerung/ASP-Kosten je Zauberstufe (reine Referenz, siehe "PSI Magie Zaubertabelle 1.42")</div>
      </div>
    </div>`;
}

function getAttWert(sheet: ComputedSheet, referenz: string): number {
  return (sheet.byKategorie['Attribute'] ?? []).find((r) => r.rule.referenz === referenz)?.currentValue ?? 0;
}

function getAttAura(sheet: ComputedSheet): number {
  return getAttWert(sheet, 'att_aura');
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

/** Kante(n) + benoetigte(r) TaW als Tooltip - die beiden Wurzeln (Telekinese/Empathie, kein
 *  parent) tragen stattdessen das Aura/Magie-Gate aus psiBaumGating.ts (Nutzer 2026-07-21). */
function vorbedingungTitle(referenz: string, sheet: ComputedSheet): string {
  const vorbedingung = getPsiVorbedingung(sheet, referenz);
  if (!vorbedingung) {
    const aura = getAttAura(sheet);
    const magie = getAttMagie(sheet);
    return `Benötigt: Aura > 0 (aktuell ${aura}) UND Magie > 0 (aktuell ${magie})`;
  }
  const row = (sheet.byKategorie['PSI'] ?? []).find((r) => r.rule.referenz === vorbedingung.vorbedingung);
  const name = row?.rule.beschreibung ?? vorbedingung.vorbedingung;
  const current = row?.currentValue ?? 0;
  return `Benötigt: ${name} ${vorbedingung.mindestTaw} (aktuell ${current})`;
}

/** Fuer bereits waehlbare Faehigkeiten: welche Nachfolger-Faehigkeit ab welchem TaW freigeschaltet
 *  wird, z.B. "TaW 15 schaltet frei: Höhere Telekinese". Blaetter im Baum liefern ''. */
function freischaltungTitle(referenz: string, sheet: ComputedSheet): string {
  const freischaltungen = getPsiFreischaltungen(sheet, referenz);
  if (freischaltungen.length === 0) return '';
  return freischaltungen
    .map(({ faehigkeit, mindestTaw }) => {
      const row = (sheet.byKategorie['PSI'] ?? []).find((r) => r.rule.referenz === faehigkeit);
      const name = row?.rule.beschreibung ?? faehigkeit;
      return `TaW ${mindestTaw} schaltet frei: ${name}`;
    })
    .join('\n');
}

interface Row {
  referenz: string;
  name: string;
  eigBonusReferenz: string | undefined;
  currentValue: number;
  kostenNext?: number;
  unlocked: boolean;
  depth: number;
}

function buildRows(sheet: ComputedSheet): Row[] {
  const psi = sheet.byKategorie['PSI'] ?? [];
  const depths = getPsiTreeDepths(sheet);
  return psi
    .filter((r) => r.rule.art === 'Wert')
    .map((r) => ({
      referenz: r.rule.referenz,
      name: r.rule.beschreibung ?? r.rule.referenz,
      eigBonusReferenz: r.rule.eigBonus,
      currentValue: r.currentValue ?? 0,
      kostenNext: r.kostenNext,
      unlocked: isPsiWertUnlocked(sheet, r.rule.referenz),
      depth: depths.get(r.rule.referenz) ?? Number.POSITIVE_INFINITY,
    }))
    // Gruppierung wie im KI-Tab (Nutzer 2026-07-20 dort bestaetigt, hier uebernommen): gelernte
    // Faehigkeiten zuerst, dann freigeschaltete, dann gesperrte - je Gruppe Baum-Tiefe/Alphabet.
    .sort((a, b) => {
      const groupOf = (r: Row) => (r.unlocked ? (r.currentValue > 0 ? 0 : 1) : 2);
      const ga = groupOf(a);
      const gb = groupOf(b);
      if (ga !== gb) return ga - gb;
      if (a.depth !== b.depth) return a.depth - b.depth;
      return a.name.localeCompare(b.name, 'de');
    });
}

function renderRow(r: Row, sheet: ComputedSheet): string {
  const { referenz, name, currentValue, unlocked } = r;
  const eigBon = getEigBonusValue(sheet, r.eigBonusReferenz);
  const probe = currentValue < 1 ? '' : currentValue + (eigBon?.value ?? 0) + getAttAura(sheet) + getAttMagie(sheet);
  const detail = PSI_ZAUBERTABELLE[referenz];
  const rowClass = unlocked ? '' : currentValue > 0 ? 'ki-row-invalid' : 'ki-row-locked';
  const plusTitle = unlocked ? freischaltungTitle(referenz, sheet) : vorbedingungTitle(referenz, sheet);
  const costLabel = r.kostenNext !== undefined ? `${r.kostenNext} EP` : '';

  return `
    <tr class="${rowClass}" data-referenz="${referenz}">
      <td class="ki-taw-cell">
        <button type="button" class="stat-dec" aria-label="verringern" ${currentValue <= 0 ? 'disabled' : ''}>-</button>
        <span class="kampf-pool-value">${currentValue}</span>
        <button type="button" class="stat-inc" aria-label="erhöhen" ${!unlocked ? 'disabled' : ''}${plusTitle ? ` title="${escapeHtml(plusTitle)}"` : ''}>+</button>
        <span class="stat-cost">${costLabel}</span>
      </td>
      <td>${probe}</td>
      <td class="ki-name-cell"${tooltipAttr(detail?.wirkung)}>${escapeHtml(name)}</td>
      <td>${eigBon ? `${escapeHtml(eigBon.label)} (${eigBon.value})` : '–'}</td>
      <td>${escapeHtml(detail?.st1 ?? '–')}</td>
      <td>${escapeHtml(detail?.st2 ?? '–')}</td>
      <td>${escapeHtml(detail?.st3 ?? '–')}</td>
      <td>${escapeHtml(detail?.st4 ?? '–')}</td>
      <td>${escapeHtml(detail?.st5 ?? '–')}</td>
      <td>${escapeHtml(detail?.st6 ?? '–')}</td>
      <td>${escapeHtml(detail?.st7 ?? '–')}</td>
      <td>${escapeHtml(detail?.rw ?? '–')}</td>
      <td>${escapeHtml(detail?.wd ?? '–')}</td>
      <td>${escapeHtml(detail?.ed ?? '–')}</td>
      <td>${escapeHtml(detail?.mpz ?? '–')}</td>
    </tr>`;
}

export function renderPsiView(container: HTMLElement, sheet: ComputedSheet, onChange: OnValueChange): void {
  const rows = buildRows(sheet);

  container.innerHTML = `
    ${renderInfoBlock()}
    <div class="kampf-table-scroll">
      <table class="bogen-table ki-table">
        <thead><tr>
          <th>TaW</th><th>Probe</th><th>Name</th><th>Eig.</th>
          <th>ST.1</th><th>ST.2</th><th>ST.3</th><th>ST.4</th><th>ST.5</th><th>ST.6</th><th>ST.7</th>
          <th>RW</th><th>WD</th><th>ED</th><th>MpZ</th>
        </tr></thead>
        <tbody>${rows.map((r) => renderRow(r, sheet)).join('')}</tbody>
      </table>
    </div>`;

  container.querySelectorAll<HTMLTableRowElement>('tr[data-referenz]').forEach((tr) => {
    const referenz = tr.dataset.referenz!;
    const row = rows.find((r) => r.referenz === referenz);
    if (!row) return;
    tr.querySelector('.stat-inc')?.addEventListener('click', () => {
      if (!row.unlocked) return;
      onChange(referenz, row.currentValue + 1);
    });
    tr.querySelector('.stat-dec')?.addEventListener('click', () => {
      if (row.currentValue <= 0) return;
      onChange(referenz, Math.max(0, row.currentValue - 1));
    });
  });
}
