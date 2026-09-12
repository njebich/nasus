// Schilde (Basis+Material+Fertigung+Bespannung-Komposition) - siehe ausruestung.ts-Dateikopf
// fuer den Gesamtkontext der Ausruestungs-Ansicht.

import type { CharacterState } from '../state/characterStore';
import { NK_WAFFEN_BASIS } from '../data/equipment/weapons';
import { SCHILD_MATERIAL, SCHILD_FERTIGUNG, SCHILD_BESPANNUNG } from '../data/equipment/shields';
import { composeShield } from '../engine/shieldComposition';
import { parseVerfuegbarkeit } from '../engine/weaponComposition';
import { materialBrauchtOrtsBestaetigung, istMaterialAmOrtSourcierbar } from '../engine/verfuegbarkeitOrt';
import { getOrtById } from '../state/orteStore';
import { escapeHtml, kaufenLabel, gesperrtLabel, bestehenderCharakterMode, statSnapshotTooltip } from './ausruestungShared';
import type { AusruestungCallbacks } from './ausruestung';

export const SHIELDS = NK_WAFFEN_BASIS.filter((r) => r['Spezialisierung'] === 'Schild');

/** "Mango"-Gate (siehe ausruestungWaffen.ts materialOptionenFuer): ein am Herkunftsort weder
 *  vorraetiges noch herstellbares seltenes Schild-Material taucht im Dropdown gar nicht erst auf. */
function schildMaterialOptionenFuer(character: CharacterState): typeof SCHILD_MATERIAL[number][] {
  const ort = getOrtById(character.herkunftOrtId);
  return SCHILD_MATERIAL.filter((m) => character.bestehenderCharakter
    || !materialBrauchtOrtsBestaetigung(parseVerfuegbarkeit(m, 'Verfuegbarkeit-AW'), parseVerfuegbarkeit(m, 'Verfuegbarkeit-NW'))
    || istMaterialAmOrtSourcierbar(ort, m.name));
}

/** Transiente Picker-Auswahl je Schild (Regel Nutzer 2026-07-17: "die haben auch Anpassung" -
 *  Material/Fertigung/Bespannung, analog zum Ruestungs-Slot-Picker). Manche Material-/Fertigungs-
 *  Zeilen tragen eine Voelkerzuweisung (Spec-Punkt 30/31, Herstellerherkunft) - die wirkt als
 *  Ortsmodifikator im eigentlichen Kauf (siehe characterMutations.ts buyShield), filtert keine
 *  Optionen aus dem Picker heraus. Das Material-Sourcing-Gate (schildMaterialOptionenFuer oben)
 *  ist eine andere Dimension und filtert das Material-Dropdown sehr wohl. */
const shieldPicker = new Map<number, { materialSourceRow: number; fertigungSourceRow: number; bespannungSourceRow: number }>();

export function renderShieldRow(row: (typeof SHIELDS)[number], character: CharacterState): string {
  const materialOptionen = schildMaterialOptionenFuer(character);
  const fertigungOptionen = SCHILD_FERTIGUNG;
  const bespannungOptionen = SCHILD_BESPANNUNG;
  const sel = shieldPicker.get(row.sourceRow) ?? {
    materialSourceRow: materialOptionen[0]?.sourceRow ?? 0,
    fertigungSourceRow: fertigungOptionen[0]?.sourceRow ?? 0,
    bespannungSourceRow: bespannungOptionen[0]?.sourceRow ?? 0,
  };
  const material = materialOptionen.find((m) => m.sourceRow === sel.materialSourceRow) ?? materialOptionen[0];
  const fertigung = fertigungOptionen.find((f) => f.sourceRow === sel.fertigungSourceRow) ?? fertigungOptionen[0];
  const bespannung = bespannungOptionen.find((b) => b.sourceRow === sel.bespannungSourceRow) ?? bespannungOptionen[0];
  const composed = composeShield(row, material, fertigung, bespannung);
  const statTooltip = statSnapshotTooltip({
    rs: composed.rs, klingenbrecher: composed.klingenbrecher, klingenschutz: composed.klingenschutz,
    at: composed.at, pa: composed.pa, wk: composed.wk, staerkeMalus: composed.staerkeMalus, minStaerke: composed.minStaerke,
  });
  // Nur ein grober Vor-Check (analog zu Waffen/Alchemika/Fernkampf) - ohne Ortsmodifikator, der
  // bleibt dem eigentlichen Kauf in characterMutations.ts vorbehalten (siehe assertWeaponVerfuegbar).
  const weltVerfuegbarkeit = character.herkunftSnapshot?.welt === 'NW' ? composed.verfuegbarkeitNw
    : character.herkunftSnapshot?.welt === 'AW' ? composed.verfuegbarkeitAw : undefined;
  const gesperrt = !bestehenderCharakterMode && weltVerfuegbarkeit !== undefined
    && (weltVerfuegbarkeit === 'M' || weltVerfuegbarkeit === 'NICHT KAUFBAR' || weltVerfuegbarkeit >= 5);

  return `
    <div class="ausruestung-row" data-shield="${row.sourceRow}"${statTooltip}>
      <span class="stat-label">${escapeHtml(row.name)}</span>
      <select class="schild-material-select" data-shield="${row.sourceRow}">
        ${materialOptionen.map((m) => `<option value="${m.sourceRow}" ${m.sourceRow === material.sourceRow ? 'selected' : ''}>${escapeHtml(m.name)}</option>`).join('')}
      </select>
      <select class="schild-fertigung-select" data-shield="${row.sourceRow}">
        ${fertigungOptionen.map((f) => `<option value="${f.sourceRow}" ${f.sourceRow === fertigung.sourceRow ? 'selected' : ''}>${escapeHtml(f.name)}</option>`).join('')}
      </select>
      <select class="schild-bespannung-select" data-shield="${row.sourceRow}">
        ${bespannungOptionen.map((b) => `<option value="${b.sourceRow}" ${b.sourceRow === bespannung.sourceRow ? 'selected' : ''}>${escapeHtml(b.name)}</option>`).join('')}
      </select>
      <span class="stat-cost">RS ${composed.rs}${composed.preis === null ? ' | kein Preis (Meister-Ermessen)' : ''}</span>
      ${composed.preis !== null
    ? `<button type="button" class="ausruestung-buy-button ausruestung-buy-shield${gesperrt ? ' ausruestung-buy-locked' : ''}" data-shield="${row.sourceRow}" ${gesperrt ? 'disabled' : ''}>${gesperrt ? gesperrtLabel(weltVerfuegbarkeit!) : kaufenLabel(composed.preis)}</button>`
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
      const materialOptionen = schildMaterialOptionenFuer(character);
      const fertigungOptionen = SCHILD_FERTIGUNG;
      const bespannungOptionen = SCHILD_BESPANNUNG;
      const materialSourceRow = sel?.materialSourceRow ?? materialOptionen[0]?.sourceRow;
      const fertigungSourceRow = sel?.fertigungSourceRow ?? fertigungOptionen[0]?.sourceRow;
      const bespannungSourceRow = sel?.bespannungSourceRow ?? bespannungOptionen[0]?.sourceRow;
      if (materialSourceRow === undefined || fertigungSourceRow === undefined || bespannungSourceRow === undefined) return;
      callbacks.onBuyShield(shieldSourceRow, materialSourceRow, fertigungSourceRow, bespannungSourceRow);
    });
  });
}
