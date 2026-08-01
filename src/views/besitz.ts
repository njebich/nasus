import type { CharacterState } from '../state/characterStore';
import { formatDublonen } from '../utils/format';
import { PREISLISTE } from '../data/equipment/preisliste';
import { ARTEFAKT_KOSTEN } from '../data/equipment/artefakte';
import { ALCHEMIKA } from '../data/equipment/alchemika';
import {
  ARROW_BY_SOURCE_ROW, BOLT_BY_SOURCE_ROW, BOW_BY_SOURCE_ROW, CROSSBOW_BY_SOURCE_ROW,
  FIREARM_AMMO_BY_ART_AND_CALIBER, FIREARM_BY_SOURCE_ROW, MELEE_WEAPON_BY_SOURCE_ROW,
} from '../engine/weaponCatalog';
import { describeStoredWeapon } from './weaponDisplay';

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderStoredValue(value: unknown): string {
  if (value === null) return '<span class="besitz-null">null</span>';
  if (value === undefined) return '<span class="besitz-null">undefined</span>';
  if (typeof value === 'string') return escapeHtml(value);
  if (typeof value === 'number' || typeof value === 'boolean') return escapeHtml(String(value));
  return escapeHtml(JSON.stringify(value) ?? String(value));
}

function flattenStoredFields(value: unknown, path = ''): Array<[string, unknown]> {
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return [[path || 'Wert', Array.isArray(value) ? '[]' : '{}']];
    return entries.flatMap(([key, child]) => flattenStoredFields(child, path ? `${path}.${key}` : key));
  }
  return [[path || 'Wert', value]];
}

function renderDetailFields(value: unknown): string {
  return `<dl class="besitz-detail-fields">${flattenStoredFields(value).map(([key, fieldValue]) => `
    <dt>${escapeHtml(key)}</dt><dd>${renderStoredValue(fieldValue)}</dd>`).join('')}
  </dl>`;
}

function equipmentLabel(entry: CharacterState['equipment'][number]): { title: string; stats?: string } {
  if (entry.family === 'weapon') {
    const display = describeStoredWeapon(entry);
    if (display) return display;
  }
  if (entry.family === 'shield') {
    const row = MELEE_WEAPON_BY_SOURCE_ROW.get(entry.baseId);
    if (row) return { title: row.name, stats: `RS ${entry.computedStatsSnapshot?.rs ?? '–'}, n-Mod ${entry.computedStatsSnapshot?.at ?? '–'}/${entry.computedStatsSnapshot?.pa ?? '–'}` };
  }
  if (entry.family === 'preisliste') {
    const row = PREISLISTE.find((item) => String(item.sourceRow) === entry.baseId);
    if (row) return { title: row.name ?? entry.displayNameSnapshot ?? `Preisliste #${entry.baseId}` };
  }
  if (entry.family === 'artefakt') {
    const row = ARTEFAKT_KOSTEN.find((item) => String(item.sourceRow) === entry.baseId);
    if (row) return { title: `${row.name} Grad ${row.grad} (${entry.selections.variant ?? 'Variante unbekannt'})` };
  }
  if (entry.family === 'feuerwaffe') {
    const row = FIREARM_BY_SOURCE_ROW.get(entry.baseId);
    if (row) return { title: row.name, stats: `Kaliber ${entry.computedStatsSnapshot?.kaliber ?? '–'}, RB ${entry.computedStatsSnapshot?.rb ?? '–'}` };
  }
  if (entry.family === 'fernkampfwaffe') {
    const row = (entry.baseTable === 'boegen' ? BOW_BY_SOURCE_ROW : CROSSBOW_BY_SOURCE_ROW).get(entry.baseId);
    if (row) return { title: row.name };
  }
  if (entry.family === 'ammo') {
    if (entry.baseTable === 'feuerwaffen-munition') {
      const row = FIREARM_AMMO_BY_ART_AND_CALIBER.get(`${entry.baseId}:${entry.selections.kaliber}`);
      if (row) return { title: `${row.label}, Kaliber ${row.kaliber}` };
    } else {
      const table = entry.baseTable === 'pfeile' ? ARROW_BY_SOURCE_ROW : BOLT_BY_SOURCE_ROW;
      const basis = table.get(entry.baseId);
      const mod = entry.selections.modifikator ? table.get(entry.selections.modifikator) : undefined;
      if (basis) return { title: mod ? `${mod.name} (${basis.name})` : basis.name };
    }
  }
  if (entry.family === 'alchemika') {
    const row = ALCHEMIKA.find((item) => String(item.sourceRow) === entry.baseId);
    if (row) return { title: row.name, stats: row.wirkung };
  }
  return { title: entry.displayNameSnapshot ?? `${entry.family} · ${entry.baseTable} #${entry.baseId}` };
}

function renderEquipment(character: CharacterState): string {
  if (character.equipment.length === 0) return '<p class="inventar-empty">Keine Ausrüstung gespeichert.</p>';
  return character.equipment.map((entry) => {
    const display = equipmentLabel(entry);
    const quantity = entry.quantity > 1 ? ` ×${entry.quantity}` : '';
    const price = entry.computedPriceSnapshot === undefined
      ? ''
      : `<span class="stat-cost">${formatDublonen(entry.computedPriceSnapshot * entry.quantity)}</span>`;
    return `
      <details class="besitz-entry" data-besitz-equipment-id="${escapeHtml(entry.id)}">
        <summary>
          <span class="stat-label">${escapeHtml(display.title)}${quantity}${display.stats ? `<small class="besitz-summary-stats">${escapeHtml(display.stats)}</small>` : ''}</span>
          ${price}
        </summary>
        ${renderDetailFields(entry)}
      </details>`;
  }).join('');
}

function renderRuestung(character: CharacterState): string {
  const slots = Object.entries(character.ruestungSlots);
  if (slots.length === 0) return '<p class="inventar-empty">Keine Rüstung angelegt.</p>';
  return slots.map(([slotKey, entry]) => `
    <details class="besitz-entry" data-besitz-ruestung-slot="${escapeHtml(slotKey)}">
      <summary>
        <span class="stat-label">${escapeHtml(slotKey)} · Basis #${entry.basisSourceRow}</span>
        <span class="stat-cost">RS ${entry.computedStatsSnapshot.rs} · RH ${entry.computedStatsSnapshot.rh} · ${formatDublonen(entry.computedPriceSnapshot)}</span>
      </summary>
      ${renderDetailFields({ slot: slotKey, ...entry })}
    </details>`).join('');
}

/**
 * Gemeinsamer, vollständig schreibgeschützter Besitzrenderer. Er zeigt ausschließlich die im
 * CharacterState gespeicherten Daten und ergänzt alte Käufe bewusst nicht aus heutigen Katalogen.
 */
export function renderReadOnlyBesitzView(container: HTMLElement, character: CharacterState): void {
  container.innerHTML = `
    <section class="besitz-view" aria-labelledby="besitz-heading">
      <h2 id="besitz-heading">Besitz</h2>
      <h3>Ausrüstung</h3>
      <div class="inventar-category">${renderEquipment(character)}</div>
      <h3>Rüstung</h3>
      <div class="inventar-category">${renderRuestung(character)}</div>
    </section>`;
}
