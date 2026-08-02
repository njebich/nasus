import type { CharacterState } from '../state/characterStore';
import { formatDublonen } from '../utils/format';
import { PREISLISTE } from '../data/equipment/preisliste';
import { ARTEFAKT_BASIS, ARTEFAKT_KOSTEN } from '../data/equipment/artefakte';
import { ALCHEMIKA } from '../data/equipment/alchemika';
import { RUESTUNG_ANPASSUNG, RUESTUNG_BASIS, RUESTUNG_VERARBEITUNG } from '../data/equipment/armor';
import { SCHILD_BESPANNUNG, SCHILD_FERTIGUNG, SCHILD_MATERIAL } from '../data/equipment/shields';
import {
  ARROW_BY_SOURCE_ROW, BOLT_BY_SOURCE_ROW, BOW_BY_SOURCE_ROW, CROSSBOW_BY_SOURCE_ROW,
  FIREARM_AMMO_BY_ART_AND_CALIBER, FIREARM_BY_SOURCE_ROW, MELEE_WEAPON_BY_SOURCE_ROW,
} from '../engine/weaponCatalog';
import { artefaktTooltip } from '../engine/artefaktWirkung';
import { describeStoredWeapon, wertemodifikatorSpan } from './weaponDisplay';

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

/** Rueckgabe-Titel ist immer bereits sicheres HTML (escapt bzw. ueber wertemodifikatorSpan
 *  aufgebaut) - Aufrufer duerfen NICHT nochmal escapeHtml() darueber laufen lassen. */
function equipmentLabel(entry: CharacterState['equipment'][number]): { titleHtml: string; stats?: string } {
  if (entry.family === 'weapon') {
    const display = describeStoredWeapon(entry);
    if (display) return { titleHtml: display.titleHtml ?? escapeHtml(display.title), stats: display.stats };
  }
  if (entry.family === 'shield') {
    const row = MELEE_WEAPON_BY_SOURCE_ROW.get(entry.baseId);
    if (row) {
      const material = SCHILD_MATERIAL.find((r) => String(r.sourceRow) === entry.selections.material);
      const fertigung = SCHILD_FERTIGUNG.find((r) => String(r.sourceRow) === entry.selections.fertigung);
      const bespannung = SCHILD_BESPANNUNG.find((r) => String(r.sourceRow) === entry.selections.bespannung);
      const titleHtml = [escapeHtml(row.name), wertemodifikatorSpan(material), wertemodifikatorSpan(fertigung), wertemodifikatorSpan(bespannung)]
        .filter(Boolean).join(', ');
      const snap = entry.computedStatsSnapshot ?? {};
      // Nutzer-Ask: volle Schild-Werte statt nur RS/n-Mod - Klingenbrecher/Klingenschutz/WK/
      // Stä-Malus/Mindest-Stärke sind bereits im computedStatsSnapshot vorhanden (siehe buyShield).
      const stats = [
        `RS ${snap.rs ?? '–'}`, `n-Mod ${snap.at ?? '–'}/${snap.pa ?? '–'}`, `WK ${snap.wk ?? '–'}`,
        `Klingenbrecher ${snap.klingenbrecher ?? 0}`, `Klingenschutz ${snap.klingenschutz ?? 0}`,
        `Stä-Malus ${snap.staerkeMalus ?? 0}`, `Mindest-Stärke ${snap.minStaerke ?? '–'}`,
      ].join(', ');
      return { titleHtml, stats };
    }
  }
  if (entry.family === 'preisliste') {
    const row = PREISLISTE.find((item) => String(item.sourceRow) === entry.baseId);
    if (row) return { titleHtml: escapeHtml(row.name ?? entry.displayNameSnapshot ?? `Preisliste #${entry.baseId}`) };
  }
  if (entry.family === 'artefakt') {
    const kosten = ARTEFAKT_KOSTEN.find((item) => String(item.sourceRow) === entry.baseId);
    if (kosten) {
      const titleHtml = escapeHtml(`${kosten.name} Grad ${kosten.grad} (${entry.selections.variant ?? 'Variante unbekannt'})`);
      // Nutzer-Ask: volle Wirkung/Wirkungswert/ED/WD anzeigen, wenn vorhanden - dieselbe Funktion,
      // die die Kaufvorschau (ausruestung.ts) bereits als Tooltip nutzt, hier als sichtbare Zeile.
      const basis = ARTEFAKT_BASIS.find((item) => item.referenz === kosten.referenz);
      const stats = basis && kosten.grad ? artefaktTooltip(basis, kosten.grad).split('\n').join(' · ') : undefined;
      return { titleHtml, stats };
    }
  }
  if (entry.family === 'feuerwaffe') {
    const row = FIREARM_BY_SOURCE_ROW.get(entry.baseId);
    if (row) return { titleHtml: escapeHtml(row.name), stats: `Kaliber ${entry.computedStatsSnapshot?.kaliber ?? '–'}, RB ${entry.computedStatsSnapshot?.rb ?? '–'}` };
  }
  if (entry.family === 'fernkampfwaffe') {
    const row = (entry.baseTable === 'boegen' ? BOW_BY_SOURCE_ROW : CROSSBOW_BY_SOURCE_ROW).get(entry.baseId);
    if (row) return { titleHtml: escapeHtml(row.name) };
  }
  if (entry.family === 'ammo') {
    if (entry.baseTable === 'feuerwaffen-munition') {
      const row = FIREARM_AMMO_BY_ART_AND_CALIBER.get(`${entry.baseId}:${entry.selections.kaliber}`);
      if (row) return { titleHtml: escapeHtml(`${row.label}, Kaliber ${row.kaliber}`) };
    } else {
      const table = entry.baseTable === 'pfeile' ? ARROW_BY_SOURCE_ROW : BOLT_BY_SOURCE_ROW;
      const basis = table.get(entry.baseId);
      const mod = entry.selections.modifikator ? table.get(entry.selections.modifikator) : undefined;
      if (basis) return { titleHtml: escapeHtml(mod ? `${mod.name} (${basis.name})` : basis.name) };
    }
  }
  if (entry.family === 'alchemika') {
    const row = ALCHEMIKA.find((item) => String(item.sourceRow) === entry.baseId);
    if (row) return { titleHtml: escapeHtml(row.name), stats: row.wirkung };
  }
  return { titleHtml: escapeHtml(entry.displayNameSnapshot ?? `${entry.family} · ${entry.baseTable} #${entry.baseId}`) };
}

function renderEquipment(character: CharacterState): string {
  if (character.equipment.length === 0) return '<p class="inventar-empty">Keine Ausrüstung gespeichert.</p>';

  const groups: ReadonlyArray<{
    label: string;
    includes: (entry: CharacterState['equipment'][number]) => boolean;
  }> = [
    { label: 'Nahkampfwaffen', includes: (entry) => entry.family === 'weapon' || entry.family === 'shield' },
    {
      label: 'Fernkampfwaffen',
      includes: (entry) => entry.family === 'fernkampfwaffe' || entry.family === 'feuerwaffe' || entry.family === 'ammo',
    },
    { label: 'Preisliste', includes: (entry) => entry.family === 'preisliste' },
    { label: 'Artefakte', includes: (entry) => entry.family === 'artefakt' },
    { label: 'Alchemika', includes: (entry) => entry.family === 'alchemika' },
  ];

  const renderedIds = new Set<string>();
  const renderEntries = (entries: CharacterState['equipment']): string => entries.map((entry) => {
    renderedIds.add(entry.id);
    const display = equipmentLabel(entry);
    const quantity = entry.quantity > 1 ? ` ×${entry.quantity}` : '';
    const price = entry.computedPriceSnapshot === undefined
      ? ''
      : `<span class="stat-cost">${formatDublonen(entry.computedPriceSnapshot * entry.quantity)}</span>`;
    return `
      <details class="besitz-entry" data-besitz-equipment-id="${escapeHtml(entry.id)}">
        <summary>
          <span class="stat-label">${display.titleHtml}${quantity}${display.stats ? `<small class="besitz-summary-stats">${escapeHtml(display.stats)}</small>` : ''}</span>
          ${price}
        </summary>
        ${renderDetailFields(entry)}
      </details>`;
  }).join('');

  const renderedGroups = groups.flatMap((group) => {
    const entries = character.equipment.filter(group.includes);
    if (entries.length === 0) return [];
    return [`
      <section class="besitz-equipment-group" aria-label="${escapeHtml(group.label)}">
        <h4>${escapeHtml(group.label)}</h4>
        ${renderEntries(entries)}
      </section>`];
  });
  const sonstige = character.equipment.filter((entry) => !renderedIds.has(entry.id));
  if (sonstige.length > 0) {
    renderedGroups.push(`
      <section class="besitz-equipment-group" aria-label="Sonstiges">
        <h4>Sonstiges</h4>
        ${renderEntries(sonstige)}
      </section>`);
  }
  return renderedGroups.join('');
}

function renderRuestung(character: CharacterState): string {
  // Alte bzw. zwischenzeitlich gespeicherte Picker-Zustände können den Sentinel -1 für
  // "Keine Rüstung" enthalten. Solche unbelegten Lagen gehören nicht auf den Besitzbogen.
  const slots = Object.entries(character.ruestungSlots)
    .filter(([, entry]) => entry.basisSourceRow !== -1);
  if (slots.length === 0) return '<p class="inventar-empty">Keine Rüstung angelegt.</p>';

  const gruppen = [
    { key: 'kopf', label: 'Kopf' },
    { key: 'torso', label: 'Torso' },
    { key: 'arme', label: 'Arme' },
    { key: 'beine', label: 'Beine' },
  ] as const;
  const parseSlot = (slotKey: string): { gruppe: string; lage: number } => {
    const separator = slotKey.lastIndexOf(':');
    return {
      gruppe: (separator < 0 ? slotKey : slotKey.slice(0, separator)).toLocaleLowerCase('de-DE'),
      lage: Number(separator < 0 ? Number.NaN : slotKey.slice(separator + 1)),
    };
  };
  const renderSlot = ([slotKey, entry]: typeof slots[number]): string => {
    const { lage } = parseSlot(slotKey);
    const basis = RUESTUNG_BASIS.find((row) => row.sourceRow === entry.basisSourceRow);
    const verarbeitung = RUESTUNG_VERARBEITUNG.find((row) => row.sourceRow === entry.verarbeitungSourceRow);
    const anpassung = RUESTUNG_ANPASSUNG.find((row) => row.sourceRow === entry.anpassungSourceRow);
    const lageLabel = Number.isFinite(lage) ? `Lage ${lage}` : 'Lage unbekannt';
    // Nutzer-Ask: Verarbeitung/Anpassung zeigen beim Hover ihren Wertemodifikator (Basis hat keine
    // eigene Modifikator-Spalte in dem Sinn, bleibt daher ohne Tooltip).
    const descriptionHtml = [
      basis ? escapeHtml(basis.name) : escapeHtml(`Unbekannte Rüstung (Basis #${entry.basisSourceRow})`),
      verarbeitung ? wertemodifikatorSpan(verarbeitung) : escapeHtml(`Verarbeitung #${entry.verarbeitungSourceRow}`),
      anpassung ? wertemodifikatorSpan(anpassung) : escapeHtml(`Anpassung #${entry.anpassungSourceRow}`),
    ].join(', ');
    return `
      <details class="besitz-entry" data-besitz-ruestung-slot="${escapeHtml(slotKey)}">
        <summary>
          <span class="stat-label"><strong>${escapeHtml(lageLabel)}:</strong> ${descriptionHtml}</span>
          <span class="stat-cost">RS ${entry.computedStatsSnapshot.rs} · RH ${entry.computedStatsSnapshot.rh} · ${formatDublonen(entry.computedPriceSnapshot)}</span>
        </summary>
        ${renderDetailFields({ slot: slotKey, ...entry })}
      </details>`;
  };

  const renderedSlots = new Set<string>();
  const sections = gruppen.flatMap(({ key, label }) => {
    const entries = slots
      .filter(([slotKey]) => parseSlot(slotKey).gruppe === key)
      .sort(([left]) => parseSlot(left).lage - parseSlot(left).lage);
    if (entries.length === 0) return [];
    entries.forEach(([slotKey]) => renderedSlots.add(slotKey));
    const rsGesamt = entries.reduce((sum, [, entry]) => sum + entry.computedStatsSnapshot.rs, 0);
    const rhGesamt = entries.reduce((sum, [, entry]) => sum + entry.computedStatsSnapshot.rh, 0);
    return [`
      <section class="besitz-ruestung-group" aria-label="${label}">
        <h4>${label} <span class="besitz-ruestung-total">RS ${rsGesamt} · RH ${rhGesamt}</span></h4>
        ${entries.map(renderSlot).join('')}
      </section>`];
  });
  const unbekannteSlots = slots.filter(([slotKey]) => !renderedSlots.has(slotKey));
  if (unbekannteSlots.length > 0) {
    sections.push(`
      <section class="besitz-ruestung-group" aria-label="Weitere Rüstung">
        <h4>Weitere Rüstung</h4>
        ${unbekannteSlots.map(renderSlot).join('')}
      </section>`);
  }
  return sections.join('');
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
