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
import {
  isKiFaehigkeitUnlocked, getKiVorbedingungen, getKiFreischaltungen, getKiTreeDepths, KONZENTRATION_REFERENZ,
} from '../engine/kiBaumGating';
import {
  MEISTER_DER_GRUNDFERTIGKEITEN_REFERENZ, grundfertigkeitSlotCount, getGrundfertigkeitOptionen,
} from '../engine/grundfertigkeitAuswahl';
import { KI_DAUER } from '../data/kiFaehigkeiten';
import type { OnValueChange } from './categoryView';

export type OnGrundfertigkeitPick = (talentReferenz: string, slotIndex: number, grundfertigkeitReferenz: string) => void;

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** talente_me_sparen: "Immer halbe ME" (Nutzer 2026-07-21) - ME-Kosten sind hier (wie bei PSI/
 *  Spruchmagie) nur eine Referenzformel im Info-Kasten, keine live berechnete Zahl (Erschwerung
 *  ist eine situative Tischentscheidung, kein gespeicherter Charakterwert) - deshalb wirkt das
 *  Talent hier als Verdopplung des Teilers (:2 -> :4) statt als numerische Halbierung. */
function renderInfoBlock(sheet: ComputedSheet): string {
  const meSparen = (sheet.byKategorie['Talente'] ?? []).find((r) => r.rule.referenz === 'talente_me_sparen')?.selected ?? false;
  const meTeiler = meSparen ? 4 : 2;
  return `
    <div class="ki-info-block">
      <div class="ki-info-grid">
        <div><b>Probe</b> = (W30-W12) ≤ (TaW + Eig.Bon. + 2 × Magie) − Zuschlag − (ME:${meTeiler})</div>
        <div><b>ME-Kosten</b> = (Erschwerung − Aura) : ${meTeiler}</div>
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

function getAttWert(sheet: ComputedSheet, referenz: string): number {
  return (sheet.byKategorie['Attribute'] ?? []).find((r) => r.rule.referenz === referenz)?.currentValue ?? 0;
}

function getAttMagie(sheet: ComputedSheet): number {
  return getAttWert(sheet, 'att_magie');
}

function getAttAura(sheet: ComputedSheet): number {
  return getAttWert(sheet, 'att_aura');
}

function isTalentSelected(sheet: ComputedSheet, referenz: string): boolean {
  return (sheet.byKategorie['Talente'] ?? []).find((r) => r.rule.referenz === referenz)?.selected ?? false;
}

/** Gute KI-Probe (talente_ki_gute_stufe_1/2): Stufe 1 = Magie, Stufe 2 = Magie + Aura, gedeckelt
 *  auf Normale:2 (Nutzer 2026-07-21, "talente-add-implementation-charaktererstellung.txt"). */
function getGuteProbe(sheet: ComputedSheet, normaleProbe: number): number | undefined {
  const stufe2 = isTalentSelected(sheet, 'talente_ki_gute_stufe_2');
  const stufe1 = stufe2 || isTalentSelected(sheet, 'talente_ki_gute_stufe_1');
  if (!stufe1) return undefined;
  const gute = stufe2 ? getAttMagie(sheet) + getAttAura(sheet) : getAttMagie(sheet);
  return Math.min(gute, Math.floor(normaleProbe / 2));
}

/** Kante(n) + benoetigte(r) TaW als Tooltip-Text fuers "+"-Feld - unabhaengig vom Lock-Status,
 *  damit auch bei bereits freigeschalteten Faehigkeiten sichtbar bleibt, ueber welchen Pfad sie
 *  erreicht wurde bzw. welche Alternativpfade es gibt. Wurzel-Faehigkeiten (keine Vorbedingung)
 *  liefern ''. */
function vorbedingungTitle(referenz: string, sheet: ComputedSheet): string {
  if (referenz === KONZENTRATION_REFERENZ) {
    const aura = getAttWert(sheet, 'att_aura');
    const magie = getAttMagie(sheet);
    return `Benötigt: Aura > 0 (aktuell ${aura}) UND Magie > 0 (aktuell ${magie})`;
  }
  const vorbedingungen = getKiVorbedingungen(referenz);
  if (vorbedingungen.length === 0) return '';
  const parts = vorbedingungen.map(({ vorbedingung, mindestTaw }) => {
    const row = (sheet.byKategorie['KI'] ?? []).find((r) => r.rule.referenz === vorbedingung);
    const name = row?.rule.beschreibung ?? vorbedingung;
    const current = row?.currentValue ?? 0;
    return `${name} ${mindestTaw} (aktuell ${current})`;
  });
  return `Benötigt: ${parts.join(' ODER ')} (kompletter Zweig ab Konzentration erforderlich)`;
}

/** Fuer bereits waehlbare Faehigkeiten (Nutzer 2026-07-20): welche Nachfolger-Faehigkeit(en)
 *  ab welchem TaW freigeschaltet werden, z.B. "TaW 10 schaltet frei: Sprint". Faehigkeiten ohne
 *  Nachfolger (Blaetter im Baum) liefern ''. */
function freischaltungTitle(referenz: string, sheet: ComputedSheet): string {
  const freischaltungen = getKiFreischaltungen(referenz);
  if (freischaltungen.length === 0) return '';
  const namenProTaw = new Map<number, string[]>();
  for (const { faehigkeit, mindestTaw } of freischaltungen) {
    const row = (sheet.byKategorie['KI'] ?? []).find((r) => r.rule.referenz === faehigkeit);
    const name = row?.rule.beschreibung ?? faehigkeit;
    const namen = namenProTaw.get(mindestTaw) ?? [];
    namen.push(name);
    namenProTaw.set(mindestTaw, namen);
  }
  return Array.from(namenProTaw.entries())
    .sort(([a], [b]) => a - b)
    .map(([taw, namen]) => `TaW ${taw} schaltet frei: ${namen.join(', ')}`)
    .join('\n');
}

/** "Meister der Grundfertigkeiten"-Sonderzeile: ein Dropdown je freigeschaltetem Slot (Slot 1 ab
 *  TaW 1, danach alle 5 TaW ein weiteres, siehe grundfertigkeitSlotCount) - Nutzer-Anweisung
 *  2026-07-20. Eine bereits in einem anderen Slot gewaehlte Grundfertigkeit wird in den uebrigen
 *  Dropdowns deaktiviert, damit sich Mehrfachauswahl nicht versehentlich ueberschneidet. */
function renderGrundfertigkeitPicksRow(currentValue: number, gewaehlt: string[]): string {
  const slotCount = grundfertigkeitSlotCount(currentValue);
  if (slotCount === 0) return '';
  const optionen = getGrundfertigkeitOptionen();

  const dropdowns = Array.from({ length: slotCount }, (_, slotIndex) => {
    const selected = gewaehlt[slotIndex] ?? '';
    const options = optionen
      .filter((o) => o.referenz === selected || !gewaehlt.includes(o.referenz))
      .map((o) => `<option value="${o.referenz}"${o.referenz === selected ? ' selected' : ''}>${escapeHtml(o.name)}</option>`)
      .join('');
    return `
      <select class="ki-grundfertigkeit-pick" data-slot-index="${slotIndex}" aria-label="Grundfertigkeit Slot ${slotIndex + 1}">
        <option value="">– wählen –</option>
        ${options}
      </select>`;
  }).join('');

  return `
    <tr class="ki-grundfertigkeit-picks-row" data-referenz="${MEISTER_DER_GRUNDFERTIGKEITEN_REFERENZ}-picks">
      <td colspan="7">
        <span class="ki-grundfertigkeit-picks-label">Gewählte Grundfertigkeiten:</span>
        ${dropdowns}
      </td>
    </tr>`;
}

function renderRow(r: ReturnType<typeof buildRows>[number], sheet: ComputedSheet, gewaehlt: string[]): string {
  const { referenz, name, currentValue, kostenNext, wirkung, unlocked } = r;
  const eigBon = getEigBonusValue(sheet, r.eigBonusReferenz);
  // Probe ist nur sinnvoll, sobald die Faehigkeit ueberhaupt gelernt ist (Nutzer 2026-07-20).
  const normaleProbe = currentValue + (eigBon?.value ?? 0) + 2 * getAttMagie(sheet);
  const guteProbe = currentValue < 1 ? undefined : getGuteProbe(sheet, normaleProbe);
  const probe = currentValue < 1 ? '' : guteProbe !== undefined ? `${normaleProbe} / G${guteProbe}` : `${normaleProbe}`;
  const dauer = KI_DAUER[referenz];
  const rowClass = unlocked ? '' : currentValue > 0 ? 'ki-row-invalid' : 'ki-row-locked';
  const plusTitle = unlocked ? freischaltungTitle(referenz, sheet) : vorbedingungTitle(referenz, sheet);
  const costLabel = kostenNext !== undefined ? `${kostenNext} SP` : '';
  const picksRow = referenz === MEISTER_DER_GRUNDFERTIGKEITEN_REFERENZ ? renderGrundfertigkeitPicksRow(currentValue, gewaehlt) : '';

  return `
    <tr class="${rowClass}" data-referenz="${referenz}">
      <td>${probe}</td>
      <td class="ki-name-cell">${escapeHtml(name)}</td>
      <td class="ki-wirkung-cell">${escapeHtml(wirkung ?? '–')}</td>
      <td>${eigBon ? `${escapeHtml(eigBon.label)} (${eigBon.value})` : '–'}</td>
      <td>${escapeHtml(dauer?.vd ?? '–')}</td>
      <td>${escapeHtml(dauer?.wd ?? '–')}</td>
      <td class="ki-taw-cell">
        <button type="button" class="stat-dec" aria-label="verringern" ${currentValue <= 0 ? 'disabled' : ''}>-</button>
        <span class="kampf-pool-value">${currentValue}</span>
        <button type="button" class="stat-inc" aria-label="erhöhen" ${!unlocked ? 'disabled' : ''}${plusTitle ? ` title="${escapeHtml(plusTitle)}"` : ''}>+</button>
        <span class="stat-cost">${costLabel}</span>
      </td>
    </tr>${picksRow}`;
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
    // Gruppierung (Nutzer 2026-07-20): freigeschaltete Faehigkeiten nach oben, darunter gesperrte -
    // innerhalb "freigeschaltet" wiederum TaW>0 vor TaW=0. Jede Gruppe behaelt die obige
    // Freischalt-Reihenfolge (Tiefe/Alphabet) als Tie-Breaker.
    .sort((a, b) => {
      const groupOf = (r: { unlocked: boolean; currentValue: number }) => (r.unlocked ? (r.currentValue > 0 ? 0 : 1) : 2);
      const ga = groupOf(a);
      const gb = groupOf(b);
      if (ga !== gb) return ga - gb;
      if (a.referenz === 'ki_konzentration') return -1;
      if (b.referenz === 'ki_konzentration') return 1;
      if (a.depth !== b.depth) return a.depth - b.depth;
      return a.name.localeCompare(b.name, 'de');
    });
}

export function renderKiView(
  container: HTMLElement,
  sheet: ComputedSheet,
  onChange: OnValueChange,
  grundfertigkeitAuswahl: Record<string, string[]>,
  onGrundfertigkeitPick: OnGrundfertigkeitPick,
): void {
  const rows = buildRows(sheet);
  const gewaehlt = grundfertigkeitAuswahl[MEISTER_DER_GRUNDFERTIGKEITEN_REFERENZ] ?? [];

  container.innerHTML = `
    ${renderInfoBlock(sheet)}
    <div class="kampf-table-scroll">
      <table class="bogen-table ki-table">
        <thead><tr>
          <th>Probe</th><th>Name</th><th>Wirkung</th><th>Eig.Bon</th><th>VD</th><th>WD</th><th>TaW</th>
        </tr></thead>
        <tbody>${rows.map((r) => renderRow(r, sheet, gewaehlt)).join('')}</tbody>
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

  container.querySelectorAll<HTMLSelectElement>('.ki-grundfertigkeit-pick').forEach((select) => {
    select.addEventListener('change', () => {
      const slotIndex = Number(select.dataset.slotIndex);
      onGrundfertigkeitPick(MEISTER_DER_GRUNDFERTIGKEITEN_REFERENZ, slotIndex, select.value);
    });
  });
}
