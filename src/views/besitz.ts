import type { CharacterState } from '../state/characterStore';
import { formatDublonen } from '../utils/format';

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

function renderEquipment(character: CharacterState): string {
  if (character.equipment.length === 0) return '<p class="inventar-empty">Keine Ausrüstung gespeichert.</p>';
  return character.equipment.map((entry) => {
    const label = entry.displayNameSnapshot ?? `${entry.family} · ${entry.baseTable} #${entry.baseId}`;
    const quantity = `×${entry.quantity}`;
    const price = entry.computedPriceSnapshot === undefined
      ? ''
      : `<span class="stat-cost">${formatDublonen(entry.computedPriceSnapshot * entry.quantity)}</span>`;
    return `
      <details class="besitz-entry" data-besitz-equipment-id="${escapeHtml(entry.id)}">
        <summary><span class="stat-label">${escapeHtml(label)} ${quantity}</span>${price}</summary>
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
