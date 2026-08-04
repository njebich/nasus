// Rüstung (Basis+Verarbeitung+Anpassung-Komposition je TZ-Gruppe x Lage) - siehe
// ausruestung.ts-Dateikopf fuer den Gesamtkontext der Ausruestungs-Ansicht.

import { ruestungSlotKey, type CharacterState } from '../state/characterStore';
import type { RsGruppe } from '../data/trefferzonen';
import { RUESTUNG_BASIS, RUESTUNG_VERARBEITUNG, RUESTUNG_ANPASSUNG } from '../data/equipment/armor';
import { composeArmor } from '../engine/armorComposition';
import { formatDublonen } from '../utils/format';
import { escapeHtml, kaufenLabel } from './ausruestungShared';
import type { AusruestungCallbacks, RuestungGruppenSelection } from './ausruestung';

// TZ-Gruppen x Lagen (Regel Nutzer 2026-07-17: "im character state muss die ruestung erfasst
// werden" + "feste Slots: TZ-Gruppe x Lage"). Lage 0 (Kleidung) bewusst kein Slot, siehe
// characterStore.ts. Beschriftung wie auf dem Charakterblatt ("nur Kopf/Torso/Arme/Beine
// genannt, Zuordnung ist den Spielern bekannt").
export const RS_GRUPPEN: ReadonlyArray<{ gruppe: RsGruppe; label: string }> = [
  { gruppe: 'kopf', label: 'Kopf' },
  { gruppe: 'torso', label: 'Torso' },
  { gruppe: 'arme', label: 'Arme' },
  { gruppe: 'beine', label: 'Beine' },
];
export const RUESTUNG_LAGEN = [1, 2, 3, 4, 5] as const;
// Sentinel-Wert im Basis-Select: "Keine Ruestung" muss auf jeder Lage waehlbar sein (Nutzer
// 2026-07-22), damit eine Lage explizit leer bleibt statt implizit die erste Basis-Option
// vorauszuwaehlen - relevant v.a. fuer "Für alle TZ kaufen" (leere Lage wird dort uebersprungen).
export const RUESTUNG_KEINE = -1;

/** Transiente Picker-Auswahl je unbelegtem Slot (ueberlebt Re-Renders, bis "Ausruesten" geklickt
 *  wird) - analog zum frueheren globalen armorBasisRow/.../-Muster, jetzt aber pro Slot. */
const slotPicker = new Map<string, { basisSourceRow: number; verarbeitungSourceRow: number; anpassungSourceRow: number }>();

/** Welche Ruestungs-Gruppen (Kopf/Torso/Arme/Beine) der Spieler aufgeklappt hat - wie
 *  categoryView.ts's openGroupReferenzen: <details> hat keinen persistenten Zustand ueber ein
 *  komplettes Neu-Rendern hinweg, ohne das klappt die Gruppe bei jeder Aenderung (Dropdown-
 *  Wechsel, Ausruesten, ...) faelschlich wieder zu. */
export const openGruppen = new Set<RsGruppe>();

function renderRuestungSlotRow(gruppe: RsGruppe, lage: number, character: CharacterState): string {
  const key = ruestungSlotKey(gruppe, lage);
  const equipped = character.ruestungSlots[key];

  if (equipped) {
    const basis = RUESTUNG_BASIS.find((r) => r.sourceRow === equipped.basisSourceRow);
    const stats = equipped.computedStatsSnapshot;
    return `
      <div class="ruestung-slot-row ausruestung-row" data-slot="${key}">
        <span class="stat-label">Lage ${lage}: ${escapeHtml(basis?.name ?? '?')}</span>
        <span class="stat-cost">RS ${stats.rs} | RH ${stats.rh} | ${equipped.computedPriceSnapshot} D</span>
        <button type="button" class="ausruestung-buy-button ruestung-unequip" data-gruppe="${gruppe}" data-lage="${lage}">Ausziehen</button>
      </div>`;
  }

  const optionen = RUESTUNG_BASIS.filter((r) => Number(r['Lage']) === lage);
  if (optionen.length === 0) {
    // Lage 5 (Drachenschuppen/Spinnweben) hat noch keine Daten in Ruestung-Basis - Slot ist
    // strukturell vorbereitet, aber ohne Kaufoption bis die Daten+Sonderregeln stehen.
    return `
      <div class="ruestung-slot-row ausruestung-row">
        <span class="stat-label">Lage ${lage}: (noch keine Optionen hinterlegt)</span>
      </div>`;
  }

  const sel = slotPicker.get(key) ?? {
    basisSourceRow: RUESTUNG_KEINE,
    verarbeitungSourceRow: RUESTUNG_VERARBEITUNG[0]?.sourceRow ?? 0,
    anpassungSourceRow: RUESTUNG_ANPASSUNG[0]?.sourceRow ?? 0,
  };
  const basisSelectHtml = `
    <select class="ruestung-basis-select" data-slot="${key}">
      <option value="${RUESTUNG_KEINE}" ${sel.basisSourceRow === RUESTUNG_KEINE ? 'selected' : ''}>Keine Rüstung</option>
      ${optionen.map((r) => `<option value="${r.sourceRow}" ${r.sourceRow === sel.basisSourceRow ? 'selected' : ''}>${escapeHtml(r.name)}</option>`).join('')}
    </select>`;

  if (sel.basisSourceRow === RUESTUNG_KEINE) {
    return `
      <div class="ruestung-slot-row ausruestung-row" data-slot="${key}" data-gruppe="${gruppe}" data-lage="${lage}">
        <span class="stat-label">Lage ${lage}</span>
        ${basisSelectHtml}
        <span class="stat-cost">RS 0 | RH 0 | 0 D</span>
      </div>`;
  }

  const basis = optionen.find((r) => r.sourceRow === sel.basisSourceRow) ?? optionen[0];
  const verarbeitung = RUESTUNG_VERARBEITUNG.find((r) => r.sourceRow === sel.verarbeitungSourceRow) ?? RUESTUNG_VERARBEITUNG[0];
  const anpassung = RUESTUNG_ANPASSUNG.find((r) => r.sourceRow === sel.anpassungSourceRow) ?? RUESTUNG_ANPASSUNG[0];
  const composed = composeArmor(basis, verarbeitung, anpassung);

  return `
    <div class="ruestung-slot-row ausruestung-row" data-slot="${key}" data-gruppe="${gruppe}" data-lage="${lage}">
      <span class="stat-label">Lage ${lage}</span>
      ${basisSelectHtml}
      <select class="ruestung-verarbeitung-select" data-slot="${key}">
        ${RUESTUNG_VERARBEITUNG.map((r) => `<option value="${r.sourceRow}" ${r.sourceRow === verarbeitung.sourceRow ? 'selected' : ''}>${escapeHtml(r.name)}</option>`).join('')}
      </select>
      <select class="ruestung-anpassung-select" data-slot="${key}">
        ${RUESTUNG_ANPASSUNG.map((r) => `<option value="${r.sourceRow}" ${r.sourceRow === anpassung.sourceRow ? 'selected' : ''}>${escapeHtml(r.name)}</option>`).join('')}
      </select>
      <span class="stat-cost">RS ${composed.rs} | RH ${composed.rh} | ${composed.preis} D</span>
      <button type="button" class="ausruestung-buy-button ruestung-equip" data-gruppe="${gruppe}" data-lage="${lage}">${kaufenLabel(composed.preis)}</button>
    </div>`;
}

/** Liest fuer jede Lage der gegebenen Gruppe die "gewuenschte" Basis/Verarbeitung/Anpassung
 *  aus - entweder das bereits Ausgeruestete, oder (falls noch leer) die aktuelle Picker-Auswahl
 *  (bzw. deren Default). Lagen ohne Optionen (z.B. Lage 5) werden ausgelassen. Grundlage fuer
 *  den "Für alle TZ kaufen"-Button (Nutzer 2026-07-22: "ich stelle alle lagen wie gewünscht ein
 *  und der klick auf den button kauft alles wie auf dieser TZ auf allen anderen tz"). */
export function getGruppenSelections(gruppe: RsGruppe, character: CharacterState): RuestungGruppenSelection[] {
  const selections: RuestungGruppenSelection[] = [];
  for (const lage of RUESTUNG_LAGEN) {
    const key = ruestungSlotKey(gruppe, lage);
    const equipped = character.ruestungSlots[key];
    if (equipped) {
      selections.push({
        lage, basisSourceRow: equipped.basisSourceRow,
        verarbeitungSourceRow: equipped.verarbeitungSourceRow, anpassungSourceRow: equipped.anpassungSourceRow,
      });
      continue;
    }
    const optionen = RUESTUNG_BASIS.filter((r) => Number(r['Lage']) === lage);
    if (optionen.length === 0) continue;
    const sel = slotPicker.get(key) ?? {
      basisSourceRow: RUESTUNG_KEINE,
      verarbeitungSourceRow: RUESTUNG_VERARBEITUNG[0]?.sourceRow ?? 0,
      anpassungSourceRow: RUESTUNG_ANPASSUNG[0]?.sourceRow ?? 0,
    };
    if (sel.basisSourceRow === RUESTUNG_KEINE) continue;
    selections.push({ lage, ...sel });
  }
  return selections;
}

/** Summiert den Kaufpreis, den "Für alle TZ kaufen" tatsaechlich ausloesen wuerde: nur die
 *  anderen 3 Gruppen, und je Lage nur wenn dort noch nichts ausgeruestet ist (Nutzer 2026-07-22:
 *  "Überspringen und nur leere Gruppen kaufen"). */
function berechneAlleTzPreis(
  gruppe: RsGruppe, selections: RuestungGruppenSelection[], character: CharacterState,
): { preis: number; anzahl: number } {
  let preis = 0;
  let anzahl = 0;
  for (const { gruppe: ziel } of RS_GRUPPEN) {
    if (ziel === gruppe) continue;
    for (const sel of selections) {
      if (character.ruestungSlots[ruestungSlotKey(ziel, sel.lage)]) continue;
      const basis = RUESTUNG_BASIS.find((r) => r.sourceRow === sel.basisSourceRow);
      const verarbeitung = RUESTUNG_VERARBEITUNG.find((r) => r.sourceRow === sel.verarbeitungSourceRow);
      const anpassung = RUESTUNG_ANPASSUNG.find((r) => r.sourceRow === sel.anpassungSourceRow);
      if (!basis || !verarbeitung || !anpassung) continue;
      preis += composeArmor(basis, verarbeitung, anpassung).preis;
      anzahl += 1;
    }
  }
  return { preis, anzahl };
}

export function renderRuestungGruppe(gruppe: RsGruppe, label: string, character: CharacterState): string {
  const gesamtRs = RUESTUNG_LAGEN.reduce(
    (sum, lage) => sum + (character.ruestungSlots[ruestungSlotKey(gruppe, lage)]?.computedStatsSnapshot.rs ?? 0), 0,
  );
  const gesamtRh = RUESTUNG_LAGEN.reduce(
    (sum, lage) => sum + (character.ruestungSlots[ruestungSlotKey(gruppe, lage)]?.computedStatsSnapshot.rh ?? 0), 0,
  );
  const openAttr = openGruppen.has(gruppe) ? ' open' : '';
  const selections = getGruppenSelections(gruppe, character);
  const { preis: alleTzPreis, anzahl: alleTzAnzahl } = berechneAlleTzPreis(gruppe, selections, character);
  const alleTzRow = selections.length === 0 ? '' : `
    <div class="ausruestung-row ruestung-alle-tz-row">
      <span class="stat-label">Für alle TZ übernehmen (${label})</span>
      ${alleTzAnzahl > 0
    ? `<button type="button" class="ausruestung-buy-button ruestung-buy-alle-tz" data-gruppe="${gruppe}">Für alle TZ kaufen (${formatDublonen(alleTzPreis)})</button>`
    : `<span class="stat-cost">bereits überall ausgerüstet</span>`}
    </div>`;
  return `
    <div class="stat-card">
      <details class="stat-group" data-gruppe="${gruppe}"${openAttr}>
        <summary>${label} <span class="stat-group-count">(RS ${gesamtRs} | RH ${gesamtRh})</span></summary>
        <div class="stat-subgroup">
          ${alleTzRow}
          ${RUESTUNG_LAGEN.map((lage) => renderRuestungSlotRow(gruppe, lage, character)).join('')}
        </div>
      </details>
    </div>`;
}

/** Wire-up fuer alle Ruestungs-Slot-Interaktionen (Basis/Verarbeitung/Anpassung-Dropdowns,
 *  Ausruesten/Ausziehen, "Für alle TZ kaufen") - `rerender` ist renderAusruestungView mit den
 *  aktuellen Argumenten der aufrufenden Kategorie-Ansicht bereits gebunden (vom Orchestrator
 *  uebergeben), damit dieses Modul renderAusruestungView selbst nicht importieren muss. */
export function wireRuestungEvents(
  container: HTMLElement, character: CharacterState, callbacks: AusruestungCallbacks, rerender: () => void,
): void {
  // Liest die aktuell angezeigten Werte aller 3 Dropdowns einer Slot-Zeile aus dem DOM, damit
  // ein einzelnes "change" (z.B. nur Verarbeitung) die anderen beiden nicht auf Zeile-0 zuruecksetzt.
  function updateSlotPicker(slotKey: string, patch: Partial<{ basisSourceRow: number; verarbeitungSourceRow: number; anpassungSourceRow: number }>): void {
    const row = container.querySelector<HTMLElement>(`.ruestung-slot-row[data-slot="${slotKey}"]`);
    // Verarbeitung/Anpassung-Select existieren im DOM nicht, solange die Basis auf "Keine
    // Ruestung" steht - Fallback auf die erste echte Option (statt 0), sonst verliert ein
    // direkter Wechsel "Keine Ruestung" -> echte Basis die Verarbeitung/Anpassung stillschweigend
    // (0 matcht keine reale Zeile, was z.B. "Für alle TZ kaufen" die Lage unbemerkt ausblenden liess).
    const readSelect = (cls: string, fallback: number) => {
      const el = row?.querySelector<HTMLSelectElement>(`.${cls}`);
      return el ? Number(el.value) : fallback;
    };
    slotPicker.set(slotKey, {
      basisSourceRow: readSelect('ruestung-basis-select', RUESTUNG_KEINE),
      verarbeitungSourceRow: readSelect('ruestung-verarbeitung-select', RUESTUNG_VERARBEITUNG[0]?.sourceRow ?? 0),
      anpassungSourceRow: readSelect('ruestung-anpassung-select', RUESTUNG_ANPASSUNG[0]?.sourceRow ?? 0),
      ...patch,
    });
    rerender();
  }
  container.querySelectorAll<HTMLSelectElement>('.ruestung-basis-select').forEach((sel) => {
    sel.addEventListener('change', () => updateSlotPicker(sel.dataset.slot!, { basisSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLSelectElement>('.ruestung-verarbeitung-select').forEach((sel) => {
    sel.addEventListener('change', () => updateSlotPicker(sel.dataset.slot!, { verarbeitungSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLSelectElement>('.ruestung-anpassung-select').forEach((sel) => {
    sel.addEventListener('change', () => updateSlotPicker(sel.dataset.slot!, { anpassungSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLButtonElement>('.ruestung-equip').forEach((btn) => {
    btn.addEventListener('click', () => {
      const gruppe = btn.dataset.gruppe as RsGruppe;
      const lage = Number(btn.dataset.lage);
      const sel = slotPicker.get(ruestungSlotKey(gruppe, lage));
      const optionen = RUESTUNG_BASIS.filter((r) => Number(r['Lage']) === lage);
      const basisSourceRow = sel?.basisSourceRow ?? optionen[0]?.sourceRow;
      const verarbeitungSourceRow = sel?.verarbeitungSourceRow ?? RUESTUNG_VERARBEITUNG[0]?.sourceRow;
      const anpassungSourceRow = sel?.anpassungSourceRow ?? RUESTUNG_ANPASSUNG[0]?.sourceRow;
      if (basisSourceRow === undefined || verarbeitungSourceRow === undefined || anpassungSourceRow === undefined) return;
      callbacks.onEquipRuestung(gruppe, lage, basisSourceRow, verarbeitungSourceRow, anpassungSourceRow);
    });
  });
  container.querySelectorAll<HTMLButtonElement>('.ruestung-buy-alle-tz').forEach((btn) => {
    btn.addEventListener('click', () => {
      const gruppe = btn.dataset.gruppe as RsGruppe;
      callbacks.onEquipRuestungAlleTz(gruppe, getGruppenSelections(gruppe, character));
    });
  });
  container.querySelectorAll<HTMLButtonElement>('.ruestung-unequip').forEach((btn) => {
    btn.addEventListener('click', () => {
      callbacks.onUnequipRuestung(btn.dataset.gruppe as RsGruppe, Number(btn.dataset.lage));
    });
  });
}
