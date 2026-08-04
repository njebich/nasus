// Nahkampfwaffen (Basis+Material+Fertigung+Anpassung(+Schaftmaterial)-Komposition) - siehe
// ausruestung.ts-Dateikopf fuer den Gesamtkontext der Ausruestungs-Ansicht.

import type { CharacterState } from '../state/characterStore';
import { NK_WAFFEN_BASIS, NK_MATERIAL, NK_FERTIGUNG, NK_ANPASSUNG, NK_SCHAFTMATERIAL, type GenericRow } from '../data/equipment/weapons';
import { MELEE_WEAPON_BY_SOURCE_ROW } from '../engine/weaponCatalog';
import { composeWeapon, istWaffenKomponenteVerfuegbar } from '../engine/weaponComposition';
import { describeWeaponSelection } from './weaponDisplay';
import { escapeHtml, kaufenLabel, statSnapshotTooltip } from './ausruestungShared';
import type { AusruestungCallbacks } from './ausruestung';

export const WEAPONS = NK_WAFFEN_BASIS.filter((r) => r['Spezialisierung'] !== 'Schild');
export const WEAPON_HAUPTFERTIGKEITEN = [...new Set(WEAPONS.map((r) => r['Hauptfertigkeit']).filter((v): v is string => !!v))].sort();

/** Transiente Picker-Auswahl je Waffe (Regel Nutzer 2026-07-18: "fang an damit, die nk-waffen
 *  inkl. herstellungs-modifikatoren zu implementieren" - analog zum Schild-Picker, aber mit 4
 *  statt 3 Ebenen: Material/Fertigung/Anpassung/Schaftmaterial). */
const weaponPicker = new Map<number, {
  materialSourceRow: number; fertigungSourceRow: number; anpassungSourceRow: number; schaftmaterialSourceRow: number;
}>();

/** "Standard" hat ausser Name/sourceRow keine Spalten - traegt 0 zu jeder Kompositionsgroesse
 *  bei, daher als impliziter Schaftmaterial-Wert fuer Waffen ohne eigene Auswahl (siehe
 *  waffeBrauchtSchaftmaterial) sicher verwendbar. */
const SCHAFTMATERIAL_STANDARD = NK_SCHAFTMATERIAL.find((s) => s.name === 'Standard')!;

/** Regel Nutzer 2026-07-18: "Bei allen waffen, die einen holzschaft haben, muss die schaft-mod
 *  auswahl bestehen. bei allen anderen keine auswahl." - je Hauptfertigkeit uniform (nicht aus
 *  der uneinheitlichen Art-Specials-Freitextspalte abgeleitet): Stangenwaffen=alle,
 *  Hiebwaffen/Klingenwaffen/Stichwaffen/Unbewaffnet=keine. */
export function waffeBrauchtSchaftmaterial(row: GenericRow): boolean {
  return row['Hauptfertigkeit'] === 'Stangenwaffen';
}

export function renderWeaponRow(row: (typeof WEAPONS)[number], character: CharacterState): string {
  const brauchtSchaft = waffeBrauchtSchaftmaterial(row);
  const materialOptionen = NK_MATERIAL.filter((m) => istWaffenKomponenteVerfuegbar(m, character.spezies));
  const fertigungOptionen = NK_FERTIGUNG.filter((f) => istWaffenKomponenteVerfuegbar(f, character.spezies));
  const anpassungOptionen = NK_ANPASSUNG.filter((a) => istWaffenKomponenteVerfuegbar(a, character.spezies));
  const schaftmaterialOptionen = brauchtSchaft
    ? NK_SCHAFTMATERIAL.filter((s) => istWaffenKomponenteVerfuegbar(s, character.spezies))
    : [SCHAFTMATERIAL_STANDARD];
  const sel = weaponPicker.get(row.sourceRow) ?? {
    materialSourceRow: materialOptionen[0]?.sourceRow ?? 0,
    fertigungSourceRow: fertigungOptionen[0]?.sourceRow ?? 0,
    anpassungSourceRow: anpassungOptionen[0]?.sourceRow ?? 0,
    schaftmaterialSourceRow: schaftmaterialOptionen[0]?.sourceRow ?? 0,
  };
  const material = materialOptionen.find((m) => m.sourceRow === sel.materialSourceRow) ?? materialOptionen[0];
  const fertigung = fertigungOptionen.find((f) => f.sourceRow === sel.fertigungSourceRow) ?? fertigungOptionen[0];
  const anpassung = anpassungOptionen.find((a) => a.sourceRow === sel.anpassungSourceRow) ?? anpassungOptionen[0];
  const schaftmaterial = brauchtSchaft
    ? (schaftmaterialOptionen.find((s) => s.sourceRow === sel.schaftmaterialSourceRow) ?? schaftmaterialOptionen[0])
    : SCHAFTMATERIAL_STANDARD;
  const composed = composeWeapon(row, material, fertigung, anpassung, schaftmaterial);
  const display = describeWeaponSelection(row, material, fertigung, anpassung, schaftmaterial, composed);
  const statTooltip = statSnapshotTooltip({
    at: composed.at, pa: composed.pa, wk: composed.wk, staerkeMalus: composed.staerkeMalus,
    minStaerke1H: composed.minStaerke1H, minStaerke2H: composed.minStaerke2H,
    klingenbrecher: composed.klingenbrecher, klingenschutz: composed.klingenschutz, rb: composed.rb,
  });

  return `
    <div class="ausruestung-row" data-weapon="${row.sourceRow}"${statTooltip}>
      <span class="stat-label">${escapeHtml(row.name)}</span>
      <select class="waffe-material-select" data-weapon="${row.sourceRow}">
        ${materialOptionen.map((m) => `<option value="${m.sourceRow}" ${m.sourceRow === material.sourceRow ? 'selected' : ''}>${escapeHtml(m.name)}</option>`).join('')}
      </select>
      <select class="waffe-fertigung-select" data-weapon="${row.sourceRow}">
        ${fertigungOptionen.map((f) => `<option value="${f.sourceRow}" ${f.sourceRow === fertigung.sourceRow ? 'selected' : ''}>${escapeHtml(f.name)}</option>`).join('')}
      </select>
      <select class="waffe-anpassung-select" data-weapon="${row.sourceRow}">
        ${anpassungOptionen.map((a) => `<option value="${a.sourceRow}" ${a.sourceRow === anpassung.sourceRow ? 'selected' : ''}>${escapeHtml(a.name)}</option>`).join('')}
      </select>
      ${brauchtSchaft ? `
      <select class="waffe-schaftmaterial-select" data-weapon="${row.sourceRow}">
        ${schaftmaterialOptionen.map((s) => `<option value="${s.sourceRow}" ${s.sourceRow === schaftmaterial.sourceRow ? 'selected' : ''}>${escapeHtml(s.name)}</option>`).join('')}
      </select>` : ''}
      <span class="stat-cost">n-Mod ${composed.at}/${composed.pa}${composed.preis === null ? ' | kein Preis (kein Materialpreis-Faktor)' : ''}</span>
      ${composed.preis !== null
    ? `<button type="button" class="ausruestung-buy-button ausruestung-buy-weapon" data-weapon="${row.sourceRow}">${kaufenLabel(composed.preis)}</button>`
    : '<span></span>'}
    </div>
    <div class="waffe-details">
      <strong>${escapeHtml(display.title)}</strong><br>${escapeHtml(display.stats)}
    </div>`;
}

export function wireWaffenEvents(
  container: HTMLElement, character: CharacterState, callbacks: AusruestungCallbacks, rerender: () => void,
): void {
  function updateWeaponPicker(weaponSourceRow: number, patch: Partial<{
    materialSourceRow: number; fertigungSourceRow: number; anpassungSourceRow: number; schaftmaterialSourceRow: number;
  }>): void {
    const row = container.querySelector<HTMLElement>(`.ausruestung-row[data-weapon="${weaponSourceRow}"]`);
    const readSelect = (cls: string) => Number(row?.querySelector<HTMLSelectElement>(`.${cls}`)?.value ?? 0);
    weaponPicker.set(weaponSourceRow, {
      materialSourceRow: readSelect('waffe-material-select'),
      fertigungSourceRow: readSelect('waffe-fertigung-select'),
      anpassungSourceRow: readSelect('waffe-anpassung-select'),
      schaftmaterialSourceRow: readSelect('waffe-schaftmaterial-select'),
      ...patch,
    });
    rerender();
  }
  container.querySelectorAll<HTMLSelectElement>('.waffe-material-select').forEach((sel) => {
    sel.addEventListener('change', () => updateWeaponPicker(Number(sel.dataset.weapon), { materialSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLSelectElement>('.waffe-fertigung-select').forEach((sel) => {
    sel.addEventListener('change', () => updateWeaponPicker(Number(sel.dataset.weapon), { fertigungSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLSelectElement>('.waffe-anpassung-select').forEach((sel) => {
    sel.addEventListener('change', () => updateWeaponPicker(Number(sel.dataset.weapon), { anpassungSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLSelectElement>('.waffe-schaftmaterial-select').forEach((sel) => {
    sel.addEventListener('change', () => updateWeaponPicker(Number(sel.dataset.weapon), { schaftmaterialSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy-weapon').forEach((btn) => {
    btn.addEventListener('click', () => {
      const weaponSourceRow = Number(btn.dataset.weapon);
      const weaponRow = MELEE_WEAPON_BY_SOURCE_ROW.get(String(weaponSourceRow));
      const brauchtSchaft = !!weaponRow && waffeBrauchtSchaftmaterial(weaponRow);
      const sel = weaponPicker.get(weaponSourceRow);
      const materialOptionen = NK_MATERIAL.filter((m) => istWaffenKomponenteVerfuegbar(m, character.spezies));
      const fertigungOptionen = NK_FERTIGUNG.filter((f) => istWaffenKomponenteVerfuegbar(f, character.spezies));
      const anpassungOptionen = NK_ANPASSUNG.filter((a) => istWaffenKomponenteVerfuegbar(a, character.spezies));
      const schaftmaterialOptionen = brauchtSchaft
        ? NK_SCHAFTMATERIAL.filter((s) => istWaffenKomponenteVerfuegbar(s, character.spezies))
        : [SCHAFTMATERIAL_STANDARD];
      const materialSourceRow = sel?.materialSourceRow ?? materialOptionen[0]?.sourceRow;
      const fertigungSourceRow = sel?.fertigungSourceRow ?? fertigungOptionen[0]?.sourceRow;
      const anpassungSourceRow = sel?.anpassungSourceRow ?? anpassungOptionen[0]?.sourceRow;
      const schaftmaterialSourceRow = brauchtSchaft
        ? (sel?.schaftmaterialSourceRow ?? schaftmaterialOptionen[0]?.sourceRow)
        : SCHAFTMATERIAL_STANDARD.sourceRow;
      if (materialSourceRow === undefined || fertigungSourceRow === undefined
        || anpassungSourceRow === undefined || schaftmaterialSourceRow === undefined) return;
      callbacks.onBuyWeapon(weaponSourceRow, materialSourceRow, fertigungSourceRow, anpassungSourceRow, schaftmaterialSourceRow);
    });
  });
}
