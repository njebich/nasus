// KI-Tab (Nutzer 2026-07-20): eigener Tab fuer die Kategorie "KI" (bisher explizit
// zurueckgestellt, siehe project-nasus-chargen-app-Notiz "kann warten") - Layout nach
// "ki-zaubersheet import.xlsx" (Sheet1, Header Probe/Name/Eig.Bon/VD/WD/Wirkung).
//
// Kosten-/Maximum-Mechanik existiert bereits generisch (characterMutations.ts's setValue
// deckelt Kategorie=KI bereits auf getFertigkeitBaseMax('KI')=24 + Talent-Bonus, Kosten
// ueber SP, siehe engine/fertigkeitenGrenzen.ts) - dieser Tab ist reine UI-Arbeit.
//
// Zwei Bloecke:
// 1. Statischer Info-Kasten (Nachbau des Screenshots "KI-Faehigkeitstabelle v2.8") - keine
//    Charakterwerte, nur die 6 Kernformeln als Referenz.
// 2. Tabelle aller 28 KI-Faehigkeiten: Probe (live berechnet) | Name | Eig.Bon (live) | VD |
//    WD | Wirkung (Tooltip) | TaW (+/- Steigerung mit SP-Kosten). Zeilen ohne erfuellte
//    Vorbedingung (kiBaumGating.ts) werden angezeigt, aber ausgegraut/deaktiviert.

import type { ComputedSheet } from '../engine/characterSheet';
import { isKiFaehigkeitUnlocked, getKiVorbedingungen, getKiTreeDepths } from '../engine/kiBaumGating';
import { KI_DAUER } from '../data/kiFaehigkeiten';
import type { OnValueChange } from './categoryView';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderInfoBlock(): string {
  return `
    <div class="ki-info-block">
      <div class="ki-info-grid">
        <div><b>Probe</b> = (W30-W12) ≤ (TaW + Eig.Bon. + 2 × Magie) − Zuschlag − (ME:2)</div>
        <div><b>ME-Kosten</b> = (Erschwerung − Aura) : 2</div>
        <div><b>MK</b> = Willenskraft + Aura + Vitalität + Stufe + MK</div>
        <div><b>Regeneration</b> = (Aura:2) pro min</div>
        <div><b>V.Dauer verkürzen:</b> V. Dauer : 2/3/4/usw. pro +2/+3/+4/usw.</div>
        <div><b>W.Dauer verlängern:</b> W.Dauer * 2/3/4/usw. pro +2/+3/+4/usw.</div>
      </div>
    </div>`;
}

function getEigBonusValue(sheet: ComputedSheet, eigBonusReferenz: string | undefined): { label: string; value: number } | undefined {
  if (!eigBonusReferenz) return undefined;
  const row = (sheet.byKategorie['Eigenschaftsbonus'] ?? []).find((r) => r.rule.referenz === eigBonusReferenz);
  if (!row) return undefined;
  const value = Number(row.computedValue ?? 0);
  return { label: row.rule.abkuerzung ?? row.rule.beschreibung ?? eigBonusReferenz, value };
}

function getAttMagie(sheet: ComputedSheet): number {
  return (sheet.byKategorie['Attribute'] ?? []).find((r) => r.rule.referenz === 'att_magie')?.currentValue ?? 0;
}

/** Kante(n) + benoetigte(r) TaW als Tooltip-Text fuers "+"-Feld - unabhaengig vom Lock-Status,
 *  damit auch bei bereits freigeschalteten Faehigkeiten sichtbar bleibt, ueber welchen Pfad sie
 *  erreicht wurde bzw. welche Alternativpfade es gibt. Wurzel-Faehigkeiten (keine Vorbedingung)
 *  liefern ''. */
function vorbedingungTitle(referenz: string, sheet: ComputedSheet): string {
  const vorbedingungen = getKiVorbedingungen(referenz);
  if (vorbedingungen.length === 0) return '';
  const parts = vorbedingungen.map(({ vorbedingung, mindestTaw }) => {
    const row = (sheet.byKategorie['KI'] ?? []).find((r) => r.rule.referenz === vorbedingung);
    const name = row?.rule.beschreibung ?? vorbedingung;
    const current = row?.currentValue ?? 0;
    return `${name} ${mindestTaw} (aktuell ${current})`;
  });
  return `Benötigt: ${parts.join(' ODER ')}`;
}

function renderRow(r: ReturnType<typeof buildRows>[number], sheet: ComputedSheet): string {
  const { referenz, name, currentValue, kostenNext, wirkung, unlocked } = r;
  const eigBon = getEigBonusValue(sheet, r.eigBonusReferenz);
  // Probe ist nur sinnvoll, sobald die Faehigkeit ueberhaupt gelernt ist (Nutzer 2026-07-20).
  const probe = currentValue < 1 ? '' : currentValue + (eigBon?.value ?? 0) + 2 * getAttMagie(sheet);
  const dauer = KI_DAUER[referenz];
  const rowClass = unlocked ? '' : 'ki-row-locked';
  const plusTitle = vorbedingungTitle(referenz, sheet);
  const costLabel = kostenNext !== undefined ? `${kostenNext} SP` : '';

  return `
    <tr class="${rowClass}" data-referenz="${referenz}">
      <td>${probe}</td>
      <td class="ki-name-cell">${escapeHtml(name)}</td>
      <td class="ki-wirkung-cell">${escapeHtml(wirkung ?? '–')}</td>
      <td>${eigBon ? `${escapeHtml(eigBon.label)} (${eigBon.value})` : '–'}</td>
      <td>${escapeHtml(dauer?.vd ?? '–')}</td>
      <td>${escapeHtml(dauer?.wd ?? '–')}</td>
      <td class="ki-taw-cell">
        <button type="button" class="stat-dec" aria-label="verringern" ${!unlocked || currentValue <= 0 ? 'disabled' : ''}>-</button>
        <span class="kampf-pool-value">${currentValue}</span>
        <button type="button" class="stat-inc" aria-label="erhöhen" ${!unlocked ? 'disabled' : ''}${plusTitle ? ` title="${escapeHtml(plusTitle)}"` : ''}>+</button>
        <span class="stat-cost">${costLabel}</span>
      </td>
    </tr>`;
}

function buildRows(sheet: ComputedSheet) {
  const ki = sheet.byKategorie['KI'] ?? [];
  // Nur die 28 Faehigkeiten aus "ki-zaubersheet import.xlsx" (KI_DAUER-Keys) - Kategorie=KI
  // enthaelt daneben noch Formel-Stuetzwerte (ki_f_mentale_kapazitaet/-fokus), die nicht Teil
  // dieser Tabelle sind (die generische Sammelreferenz ki_ki_faehigkeiten wurde 2026-07-20 als
  // "#"-Zeile in der xlsx deaktiviert, siehe scripts/generate_data_ts.py's read_rules()).
  const referenzen = ki.filter((r) => r.rule.art === 'Wert' && r.rule.referenz in KI_DAUER).map((r) => r.rule.referenz);
  const depths = getKiTreeDepths(referenzen);
  return ki
    .filter((r) => r.rule.art === 'Wert' && r.rule.referenz in KI_DAUER)
    .map((r) => ({
      referenz: r.rule.referenz,
      name: r.rule.beschreibung ?? r.rule.referenz,
      eigBonusReferenz: r.rule.eigBonus,
      currentValue: r.currentValue ?? 0,
      kostenNext: r.kostenNext,
      wirkung: r.rule.wirkung,
      unlocked: isKiFaehigkeitUnlocked(sheet, r.rule.referenz),
      depth: depths.get(r.rule.referenz) ?? Number.POSITIVE_INFINITY,
    }))
    // Vorschlag (Nutzer 2026-07-20 um eine Reihenfolge gebeten): Baum-Tiefe statt Alphabet -
    // je naeher an einer Wurzel, desto weiter oben, ansonsten alphabetisch. Konzentration wird
    // zusaetzlich explizit an die erste Stelle gezwungen (Nutzer-Anweisung), da sie sonst mit
    // den anderen zwei (aktuell noch fehlerhaften, siehe kiBaumGating.ts) Wurzeln gleichauf laege.
    .sort((a, b) => {
      if (a.referenz === 'ki_konzentration') return -1;
      if (b.referenz === 'ki_konzentration') return 1;
      if (a.depth !== b.depth) return a.depth - b.depth;
      return a.name.localeCompare(b.name, 'de');
    });
}

export function renderKiView(container: HTMLElement, sheet: ComputedSheet, onChange: OnValueChange): void {
  const rows = buildRows(sheet);

  container.innerHTML = `
    ${renderInfoBlock()}
    <div class="kampf-table-scroll">
      <table class="bogen-table ki-table">
        <thead><tr>
          <th>Probe</th><th>Name</th><th>Wirkung</th><th>Eig.Bon</th><th>VD</th><th>WD</th><th>TaW</th>
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
      if (!row.unlocked) return;
      onChange(referenz, Math.max(0, row.currentValue - 1));
    });
  });
}
