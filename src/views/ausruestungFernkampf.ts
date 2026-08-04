// Bögen/Armbrüste (fertige Objekte mit festem Preis) + Feuerwaffen (Komposition) + ihre Munition
// (Pfeile/Bolzen/Feuerwaffen-Munition) - siehe ausruestung.ts-Dateikopf fuer den Gesamtkontext
// der Ausruestungs-Ansicht. Gemeinsames Modul, da alle drei Waffenarten dieselbe
// Volksgruppen-Gliederung (renderFernkampfVolksgruppen) teilen.

import type { FernkampfRow } from '../data/equipment/fernkampf';
import { PFEILE, BOLZEN } from '../data/equipment/fernkampf';
import { composeMunition } from '../engine/pfeilBolzenComposition';
import {
  composeFeuerwaffe, feuerwaffenKomponentenOptionen, feuerwaffenStandardauswahl,
  type FeuerwaffenSelections,
} from '../engine/feuerwaffenComposition';
import { feuerwaffenMunitionOptionen, type FeuerwaffenMunitionArt } from '../data/equipment/feuerwaffenMunition';
import { FIREARM_BY_SOURCE_ROW } from '../engine/weaponCatalog';
import { formatDublonen } from '../utils/format';
import { tooltipAttr } from './tooltip';
import {
  escapeHtml, kaufenLabel, gesperrtLabel, bestehenderCharakterMode, fernkampfwaffeStatTooltip, statSnapshotTooltip,
} from './ausruestungShared';
import type { AusruestungCallbacks } from './ausruestung';

/** Boegen/Armbrust sind fertige Objekte mit festem Preis (keine Material/Fertigung/Anpassung-
 *  Komposition wie NK-Waffen/Schilde/Ruestung - siehe project-fk-waffen-erfassung memory). */
export function renderFernkampfwaffeRow(typ: 'boegen' | 'armbrust', row: FernkampfRow): string {
  const gesperrt = !bestehenderCharakterMode && row.verfuegbarkeitStufe !== undefined && row.verfuegbarkeitStufe >= 5;
  return `
    <div class="ausruestung-row" data-fernkampfwaffe="${typ}:${row.sourceRow}"${fernkampfwaffeStatTooltip(row)}>
      <span class="stat-label">${escapeHtml(row.name)}</span>
      <span class="stat-cost">Min.Stä ${escapeHtml(row['Min. Stä'] ?? '-')} | ${escapeHtml(row['1.W'] ?? '-')}${row['Fixschaden'] ? escapeHtml(row['Fixschaden']) : ''} | RW ${escapeHtml(row['RW'] ?? '-')} | Nachladezeit ${escapeHtml(row['Nachladezeit'] ?? '-')}</span>
      ${row.preisDublonen !== undefined
    ? `<button type="button" class="ausruestung-buy-button ausruestung-buy-fernkampfwaffe${gesperrt ? ' ausruestung-buy-locked' : ''}" data-typ="${typ}" data-source-row="${row.sourceRow}" ${gesperrt ? 'disabled' : ''}>${gesperrt ? gesperrtLabel(row.verfuegbarkeitStufe!) : kaufenLabel(row.preisDublonen)}</button>`
    : `<span class="stat-cost">nicht käuflich (${escapeHtml(row['Preis'] ?? '?')})</span>`}
    </div>`;
}

/** Aufgeklappte Volksgruppen innerhalb der Fernkampf-Kategorien. Kategorie und Volk bilden
 *  gemeinsam den Schluessel. Neue Gruppen fehlen bewusst im Set und starten eingeklappt. */
export const openFernkampfVolksgruppen = new Set<string>();

export function renderFernkampfVolksgruppen(
  kategorie: 'boegen' | 'armbrust' | 'feuerwaffen',
  rows: FernkampfRow[],
  renderRow: (row: FernkampfRow) => string,
  searchActive: boolean,
): string {
  const gruppen = new Map<string, FernkampfRow[]>();
  rows.forEach((row) => {
    const volk = row['Volk']?.trim() || 'Ohne Volk';
    const gruppe = gruppen.get(volk);
    if (gruppe) gruppe.push(row);
    else gruppen.set(volk, [row]);
  });

  return [...gruppen.entries()].map(([volk, gruppenRows]) => {
    const gruppenKey = `${kategorie}:${volk}`;
    // Bei aktiver Suche werden alle (uebrig gebliebenen, d.h. treffenden) Gruppen zwangsweise
    // aufgeklappt, ohne den manuellen Aufklapp-Zustand zu ueberschreiben - selbes Muster wie in
    // talenteVornachteile.ts.
    const openAttr = searchActive || openFernkampfVolksgruppen.has(gruppenKey) ? ' open' : '';
    return `
      <div class="stat-card">
        <details class="stat-group" data-fernkampf-volksgruppe="${escapeHtml(gruppenKey)}"${openAttr}>
          <summary>${escapeHtml(volk)} <span class="stat-group-count">(${gruppenRows.length} Eintr&auml;ge)</span></summary>
          <div class="stat-subgroup">
            ${gruppenRows.map(renderRow).join('')}
          </div>
        </details>
      </div>`;
  }).join('');
}

export function wireFernkampfwaffeEvents(
  container: HTMLElement, callbacks: AusruestungCallbacks,
): void {
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy-fernkampfwaffe').forEach((btn) => {
    btn.addEventListener('click', () => {
      callbacks.onBuyFernkampfwaffe(btn.dataset.typ as 'boegen' | 'armbrust', Number(btn.dataset.sourceRow));
    });
  });
}

// -------------------------------------------------------------------------------------------
// Pfeile / Bolzen (Munition fuer Bögen/Armbrüste)
// -------------------------------------------------------------------------------------------

/** Transiente Auswahl je Pfeil-/Bolzenart. Die Basis steht als vollstaendige Liste fest; nur der
 *  optionale Spitzen-Modifikator und die Kaufmenge werden pro Zeile ausgewaehlt. */
const munitionPicker = new Map<string, { modifikatorSourceRow: number | null; quantity: number }>();

function munitionPickerKey(typ: 'pfeile' | 'bolzen', basisSourceRow: number): string {
  return `${typ}:${basisSourceRow}`;
}

function munitionBasisOptionen(typ: 'pfeile' | 'bolzen'): FernkampfRow[] {
  return (typ === 'pfeile' ? PFEILE : BOLZEN).filter((r) => r['Kategorie'] !== 'Spitzen-Modifikator');
}
function munitionModOptionen(typ: 'pfeile' | 'bolzen'): FernkampfRow[] {
  return (typ === 'pfeile' ? PFEILE : BOLZEN).filter((r) => r['Kategorie'] === 'Spitzen-Modifikator');
}

function renderMunitionCard(typ: 'pfeile' | 'bolzen'): string {
  const basisOptionen = munitionBasisOptionen(typ);
  const modOptionen = munitionModOptionen(typ);
  return basisOptionen.map((basis) => {
    const sel = munitionPicker.get(munitionPickerKey(typ, basis.sourceRow)) ?? { modifikatorSourceRow: null, quantity: 1 };
    const modifikator = sel.modifikatorSourceRow !== null
      ? modOptionen.find((r) => r.sourceRow === sel.modifikatorSourceRow) ?? null
      : null;
    const composed = composeMunition(basis, modifikator);
    const gesperrt = !bestehenderCharakterMode && composed.verfuegbarkeitStufe !== undefined && composed.verfuegbarkeitStufe >= 5;
    const statTooltip = tooltipAttr([
      `Schaden: ${composed.wuerfel}`,
      `Fixschaden: ${composed.fixschaden}`,
      `RB: ${composed.rb}`,
      `Reichweiten-Mod: ${composed.rwModMeter}m`,
      `BE: ${composed.be}`,
    ].join('\n'));
    return `
      <div class="ausruestung-row munition-row" data-munition="${typ}" data-basis-source-row="${basis.sourceRow}"${statTooltip}>
        <span class="munition-name">${escapeHtml(basis.name)} <span class="munition-kategorie">(${escapeHtml(basis['Kategorie'] ?? '')})</span></span>
        <select class="munition-mod-select" data-munition="${typ}" aria-label="Modifikator f&uuml;r ${escapeHtml(basis.name)}">
          <option value="" ${modifikator === null ? 'selected' : ''}>Kein Modifikator</option>
          ${modOptionen.map((r) => `<option value="${r.sourceRow}" ${modifikator?.sourceRow === r.sourceRow ? 'selected' : ''}>${escapeHtml(r.name)}</option>`).join('')}
        </select>
        <select class="munition-qty" data-munition="${typ}" aria-label="Menge f&uuml;r ${escapeHtml(basis.name)}">
          ${[1, 10, 100].map((qty) => `<option value="${qty}" ${qty === sel.quantity ? 'selected' : ''}>${qty}</option>`).join('')}
        </select>
        <span class="stat-cost">${escapeHtml(composed.wuerfel)} | Fixschaden ${composed.fixschaden >= 0 ? '+' : ''}${composed.fixschaden} | RB ${composed.rb >= 0 ? '+' : ''}${composed.rb} | RW-Mod ${composed.rwModMeter >= 0 ? '+' : ''}${composed.rwModMeter}m | BE ${composed.be}${composed.preisDublonen === null ? ' | nicht käuflich' : ''}</span>
        ${composed.preisDublonen !== null
      ? `<button type="button" class="ausruestung-buy-button ausruestung-buy-munition${gesperrt ? ' ausruestung-buy-locked' : ''}" data-munition="${typ}" data-basis-source-row="${basis.sourceRow}" ${gesperrt ? 'disabled' : ''}>${gesperrt ? gesperrtLabel(composed.verfuegbarkeitStufe!) : kaufenLabel(composed.preisDublonen * sel.quantity)}</button>`
      : '<span></span>'}
      </div>`;
  }).join('');
}

/** Ob eine Pfeil-/Bolzengruppe der Spieler aufgeklappt hat - bleibt bei Modifikator- und
 *  Mengenwechseln erhalten. */
export const openMunitionGruppen = new Set<'pfeile' | 'bolzen'>();

export function renderMunitionGruppe(typ: 'pfeile' | 'bolzen', label: string): string {
  const count = munitionBasisOptionen(typ).length;
  const openAttr = openMunitionGruppen.has(typ) ? ' open' : '';
  return `
    <div class="stat-card munition-group-card">
      <details class="stat-group" data-munition-gruppe="${typ}"${openAttr}>
        <summary>${label} <span class="stat-group-count">(${count} Eintr&auml;ge)</span></summary>
        <div class="ausruestung-category munition-category">${renderMunitionCard(typ)}</div>
      </details>
    </div>`;
}

export function wireMunitionEvents(
  container: HTMLElement, callbacks: AusruestungCallbacks, rerender: () => void,
): void {
  function updateMunitionPicker(typ: 'pfeile' | 'bolzen', basisSourceRow: number): void {
    const row = container.querySelector<HTMLElement>(`.ausruestung-row[data-munition="${typ}"][data-basis-source-row="${basisSourceRow}"]`);
    const modValue = row?.querySelector<HTMLSelectElement>('.munition-mod-select')?.value ?? '';
    munitionPicker.set(munitionPickerKey(typ, basisSourceRow), {
      modifikatorSourceRow: modValue === '' ? null : Number(modValue),
      quantity: Math.max(1, Math.floor(Number(row?.querySelector<HTMLSelectElement>('.munition-qty')?.value ?? '1'))),
    });
    rerender();
  }
  container.querySelectorAll<HTMLSelectElement>('.munition-mod-select').forEach((sel) => {
    sel.addEventListener('change', () => {
      const row = sel.closest<HTMLElement>('[data-basis-source-row]');
      if (row) updateMunitionPicker(sel.dataset.munition as 'pfeile' | 'bolzen', Number(row.dataset.basisSourceRow));
    });
  });
  container.querySelectorAll<HTMLSelectElement>('.munition-qty').forEach((select) => {
    select.addEventListener('change', () => {
      const row = select.closest<HTMLElement>('[data-basis-source-row]');
      if (row) updateMunitionPicker(select.dataset.munition as 'pfeile' | 'bolzen', Number(row.dataset.basisSourceRow));
    });
  });
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy-munition').forEach((btn) => {
    btn.addEventListener('click', () => {
      const typ = btn.dataset.munition as 'pfeile' | 'bolzen';
      const basisSourceRow = Number(btn.dataset.basisSourceRow);
      const sel = munitionPicker.get(munitionPickerKey(typ, basisSourceRow));
      callbacks.onBuyMunition(typ, basisSourceRow, sel?.modifikatorSourceRow ?? null, sel?.quantity ?? 1);
    });
  });
}

// -------------------------------------------------------------------------------------------
// Feuerwaffen (Komposition) + ihre Munition
// -------------------------------------------------------------------------------------------

const feuerwaffenPicker = new Map<number, FeuerwaffenSelections>();
const feuerwaffenMunitionQty = new Map<number, number>();

export function renderFeuerwaffeRow(row: FernkampfRow): string {
  const optionen = feuerwaffenKomponentenOptionen();
  const standard = feuerwaffenStandardauswahl(row);
  const auswahl = feuerwaffenPicker.get(row.sourceRow) ?? standard;
  const composed = composeFeuerwaffe(row, auswahl);
  const gesperrt = !bestehenderCharakterMode && composed.verfuegbarkeitStufe >= 5;
  const quantity = feuerwaffenMunitionQty.get(row.sourceRow) ?? 1;
  const munitionOptionen = feuerwaffenMunitionOptionen(
    row['Lademechanik'] ?? '', composed.munition, composed.kaliber,
  );
  const option = (items: typeof optionen.verarbeitungen, selected: number) => items
    .map((item) => `<option value="${item.sourceRow}" ${item.sourceRow === selected ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('');
  const statTooltip = statSnapshotTooltip({
    gewicht: composed.gewicht, minStaerke: composed.minStaerke, fixschaden: composed.fixschaden,
    rb: composed.rb, kaliber: composed.kaliber, rw: composed.rw, nachladezeit: composed.nachladezeit,
    nachladenTawTeiler: composed.nachladenTawTeiler, patzermodifikator: composed.patzermodifikator, ini: composed.ini,
  });
  return `
    <div class="ausruestung-row feuerwaffe-row" data-feuerwaffe="${row.sourceRow}"${statTooltip}>
      <span class="stat-label">${escapeHtml(row.name)}</span>
      <span class="stat-cost">${composed.ersterWuerfel}+${composed.zweiterWuerfel}${composed.fixschaden ? ` +${composed.fixschaden}` : ''} | RB ${composed.rb} | Min.St&auml; ${composed.minStaerke} | RW ${composed.rw}</span>
      <select class="feuerwaffe-verarbeitung-select" data-feuerwaffe="${row.sourceRow}">${option(optionen.verarbeitungen, auswahl.verarbeitungSourceRow)}</select>
      <select class="feuerwaffe-anpassung-select" data-feuerwaffe="${row.sourceRow}">${option(optionen.anpassungen, auswahl.anpassungSourceRow)}</select>
      ${gesperrt
    ? `<button type="button" class="ausruestung-buy-button ausruestung-buy-feuerwaffe ausruestung-buy-locked" data-feuerwaffe="${row.sourceRow}" disabled>${gesperrtLabel(composed.verfuegbarkeitStufe)}</button>`
    : `<button type="button" class="ausruestung-buy-button ausruestung-buy-feuerwaffe" data-feuerwaffe="${row.sourceRow}">${kaufenLabel(composed.preisDublonen)}</button>`}
    </div>
    <div class="waffe-details feuerwaffe-details" data-feuerwaffe-details="${row.sourceRow}">
      <span>${escapeHtml(row['Bauart'] ?? '-')} | ${escapeHtml(row['Lademechanik'] ?? '-')} | ${escapeHtml(row['Schloss'] ?? '-')} | ${escapeHtml(row['Lauf'] ?? '-')}</span>
      ${munitionOptionen.length ? `
        <span class="feuerwaffe-munition-kauf">
          <select class="feuerwaffe-munition-qty" data-feuerwaffe="${row.sourceRow}" aria-label="Munitionsmenge">
            ${[1, 10, 100].map((qty) => `<option value="${qty}" ${qty === quantity ? 'selected' : ''}>${qty}</option>`).join('')}
          </select>
          ${munitionOptionen.map((ammo) => `<button type="button" class="ausruestung-buy-feuerwaffen-munition" data-feuerwaffe="${row.sourceRow}" data-art="${ammo.art}" data-kaliber="${ammo.kaliber}">${escapeHtml(ammo.label)} kaufen (${formatDublonen(ammo.preisDublonen * quantity)})</button>`).join('')}
        </span>` : ''}
    </div>`;
}

export function wireFeuerwaffenEvents(
  container: HTMLElement, callbacks: AusruestungCallbacks, rerender: () => void,
): void {
  function updateFeuerwaffenPicker(sourceRow: number, patch: Partial<FeuerwaffenSelections>): void {
    const row = container.querySelector<HTMLElement>(`.ausruestung-row[data-feuerwaffe="${sourceRow}"]`);
    const read = (cls: string) => Number(row?.querySelector<HTMLSelectElement>(`.${cls}`)?.value ?? 0);
    feuerwaffenPicker.set(sourceRow, {
      verarbeitungSourceRow: read('feuerwaffe-verarbeitung-select'),
      anpassungSourceRow: read('feuerwaffe-anpassung-select'),
      ...patch,
    });
    rerender();
  }
  container.querySelectorAll<HTMLSelectElement>('.feuerwaffe-verarbeitung-select').forEach((sel) => {
    sel.addEventListener('change', () => updateFeuerwaffenPicker(Number(sel.dataset.feuerwaffe), { verarbeitungSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLSelectElement>('.feuerwaffe-anpassung-select').forEach((sel) => {
    sel.addEventListener('change', () => updateFeuerwaffenPicker(Number(sel.dataset.feuerwaffe), { anpassungSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy-feuerwaffe').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sourceRow = Number(btn.dataset.feuerwaffe);
      const basis = FIREARM_BY_SOURCE_ROW.get(String(sourceRow));
      if (!basis) return;
      callbacks.onBuyFeuerwaffe(sourceRow, feuerwaffenPicker.get(sourceRow) ?? feuerwaffenStandardauswahl(basis));
    });
  });
  container.querySelectorAll<HTMLSelectElement>('.feuerwaffe-munition-qty').forEach((select) => {
    select.addEventListener('change', () => {
      feuerwaffenMunitionQty.set(Number(select.dataset.feuerwaffe), Number(select.value));
      rerender();
    });
  });
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy-feuerwaffen-munition').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sourceRow = Number(btn.dataset.feuerwaffe);
      callbacks.onBuyFeuerwaffenMunition(
        btn.dataset.art as FeuerwaffenMunitionArt,
        Number(btn.dataset.kaliber),
        feuerwaffenMunitionQty.get(sourceRow) ?? 1,
      );
    });
  });
}
