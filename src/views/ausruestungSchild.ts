// Schilde (Basis+Material+Fertigung+Bespannung-Komposition) - siehe ausruestung.ts-Dateikopf
// fuer den Gesamtkontext der Ausruestungs-Ansicht.

import type { CharacterState } from '../state/characterStore';
import { NK_WAFFEN_BASIS } from '../data/equipment/weapons';
import { SCHILD_MATERIAL, SCHILD_FERTIGUNG, SCHILD_BESPANNUNG } from '../data/equipment/shields';
import { composeShield, istSchildKomponenteVerfuegbar } from '../engine/shieldComposition';
import { escapeHtml, kaufenLabel, statSnapshotTooltip } from './ausruestungShared';
import type { AusruestungCallbacks } from './ausruestung';

export const SHIELDS = NK_WAFFEN_BASIS.filter((r) => r['Spezialisierung'] === 'Schild');

/** Transiente Picker-Auswahl je Schild (Regel Nutzer 2026-07-17: "die haben auch Anpassung" -
 *  Material/Fertigung/Bespannung, analog zum Ruestungs-Slot-Picker). Kolhartz(Material)/
 *  Kohlharz(Bespannung) sind nur fuer Zentauren waehlbar, siehe istSchildKomponenteVerfuegbar. */
const shieldPicker = new Map<number, { materialSourceRow: number; fertigungSourceRow: number; bespannungSourceRow: number }>();

export function renderShieldRow(row: (typeof SHIELDS)[number], character: CharacterState): string {
  const materialOptionen = SCHILD_MATERIAL.filter((m) => istSchildKomponenteVerfuegbar(m.name, character.spezies));
  const bespannungOptionen = SCHILD_BESPANNUNG.filter((b) => istSchildKomponenteVerfuegbar(b.name, character.spezies));
  const sel = shieldPicker.get(row.sourceRow) ?? {
    materialSourceRow: materialOptionen[0]?.sourceRow ?? 0,
    fertigungSourceRow: SCHILD_FERTIGUNG[0]?.sourceRow ?? 0,
    bespannungSourceRow: bespannungOptionen[0]?.sourceRow ?? 0,
  };
  const material = materialOptionen.find((m) => m.sourceRow === sel.materialSourceRow) ?? materialOptionen[0];
  const fertigung = SCHILD_FERTIGUNG.find((f) => f.sourceRow === sel.fertigungSourceRow) ?? SCHILD_FERTIGUNG[0];
  const bespannung = bespannungOptionen.find((b) => b.sourceRow === sel.bespannungSourceRow) ?? bespannungOptionen[0];
  const composed = composeShield(row, material, fertigung, bespannung);
  const statTooltip = statSnapshotTooltip({
    rs: composed.rs, klingenbrecher: composed.klingenbrecher, klingenschutz: composed.klingenschutz,
    at: composed.at, pa: composed.pa, wk: composed.wk, staerkeMalus: composed.staerkeMalus, minStaerke: composed.minStaerke,
  });

  return `
    <div class="ausruestung-row" data-shield="${row.sourceRow}"${statTooltip}>
      <span class="stat-label">${escapeHtml(row.name)}</span>
      <select class="schild-material-select" data-shield="${row.sourceRow}">
        ${materialOptionen.map((m) => `<option value="${m.sourceRow}" ${m.sourceRow === material.sourceRow ? 'selected' : ''}>${escapeHtml(m.name)}</option>`).join('')}
      </select>
      <select class="schild-fertigung-select" data-shield="${row.sourceRow}">
        ${SCHILD_FERTIGUNG.map((f) => `<option value="${f.sourceRow}" ${f.sourceRow === fertigung.sourceRow ? 'selected' : ''}>${escapeHtml(f.name)}</option>`).join('')}
      </select>
      <select class="schild-bespannung-select" data-shield="${row.sourceRow}">
        ${bespannungOptionen.map((b) => `<option value="${b.sourceRow}" ${b.sourceRow === bespannung.sourceRow ? 'selected' : ''}>${escapeHtml(b.name)}</option>`).join('')}
      </select>
      <span class="stat-cost">RS ${composed.rs}${composed.preis === null ? ' | kein Preis (Meister-Ermessen)' : ''}</span>
      ${composed.preis !== null
    ? `<button type="button" class="ausruestung-buy-button ausruestung-buy-shield" data-shield="${row.sourceRow}">${kaufenLabel(composed.preis)}</button>`
    : '<span></span>'}
    </div>`;
}

export function wireSchildEvents(
  container: HTMLElement, character: CharacterState, callbacks: AusruestungCallbacks, rerender: () => void,
): void {
  function updateShieldPicker(shieldSourceRow: number, patch: Partial<{ materialSourceRow: number; fertigungSourceRow: number; bespannungSourceRow: number }>): void {
    const row = container.querySelector<HTMLElement>(`.ausruestung-row[data-shield="${shieldSourceRow}"]`);
    const readSelect = (cls: string) => Number(row?.querySelector<HTMLSelectElement>(`.${cls}`)?.value ?? 0);
    shieldPicker.set(shieldSourceRow, {
      materialSourceRow: readSelect('schild-material-select'),
      fertigungSourceRow: readSelect('schild-fertigung-select'),
      bespannungSourceRow: readSelect('schild-bespannung-select'),
      ...patch,
    });
    rerender();
  }
  container.querySelectorAll<HTMLSelectElement>('.schild-material-select').forEach((sel) => {
    sel.addEventListener('change', () => updateShieldPicker(Number(sel.dataset.shield), { materialSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLSelectElement>('.schild-fertigung-select').forEach((sel) => {
    sel.addEventListener('change', () => updateShieldPicker(Number(sel.dataset.shield), { fertigungSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLSelectElement>('.schild-bespannung-select').forEach((sel) => {
    sel.addEventListener('change', () => updateShieldPicker(Number(sel.dataset.shield), { bespannungSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy-shield').forEach((btn) => {
    btn.addEventListener('click', () => {
      const shieldSourceRow = Number(btn.dataset.shield);
      const sel = shieldPicker.get(shieldSourceRow);
      const materialOptionen = SCHILD_MATERIAL.filter((m) => istSchildKomponenteVerfuegbar(m.name, character.spezies));
      const bespannungOptionen = SCHILD_BESPANNUNG.filter((b) => istSchildKomponenteVerfuegbar(b.name, character.spezies));
      const materialSourceRow = sel?.materialSourceRow ?? materialOptionen[0]?.sourceRow;
      const fertigungSourceRow = sel?.fertigungSourceRow ?? SCHILD_FERTIGUNG[0]?.sourceRow;
      const bespannungSourceRow = sel?.bespannungSourceRow ?? bespannungOptionen[0]?.sourceRow;
      if (materialSourceRow === undefined || fertigungSourceRow === undefined || bespannungSourceRow === undefined) return;
      callbacks.onBuyShield(shieldSourceRow, materialSourceRow, fertigungSourceRow, bespannungSourceRow);
    });
  });
}
