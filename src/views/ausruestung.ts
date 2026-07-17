// Ausruestungs-Ansicht: Preisliste, Artefakte, Ruestung (Basis+Verarbeitung+Anpassung-
// Komposition), Schilde (Basis-Preis) mit Kaufen-Buttons, Waffen als reine Browse-Liste
// (keine Preise ohne die - mit Nutzer auf Phase 9 vertagte - Material/Fertigung-Formel),
// plus "Mein Inventar". Keine Markt-Kontext-Faktoren angewendet (siehe equipmentPricing.ts).

import type { ComputedSheet } from '../engine/characterSheet';
import type { CharacterState } from '../state/characterStore';
import { PREISLISTE } from '../data/equipment/preisliste';
import { ARTEFAKT_BASIS, ARTEFAKT_KOSTEN } from '../data/equipment/artefakte';
import { RUESTUNG_BASIS, RUESTUNG_VERARBEITUNG, RUESTUNG_ANPASSUNG } from '../data/equipment/armor';
import { NK_WAFFEN_BASIS } from '../data/equipment/weapons';
import { previewPreislistePrice, previewArtefaktPrice, type ArtefaktVariant } from '../engine/equipmentPricing';
import { composeArmor } from '../engine/armorComposition';

export interface AusruestungCallbacks {
  onBuyPreisliste: (sourceRow: number, quantity: number) => void;
  onBuyArtefakt: (referenz: string, grad: string, variant: ArtefaktVariant) => void;
  onBuyArmor: (basisSourceRow: number, verarbeitungSourceRow: number, anpassungSourceRow: number) => void;
  onBuyShield: (sourceRow: number) => void;
  onRemoveEquipment: (equipmentId: string) => void;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const PREISLISTE_ARTEN = [...new Set(PREISLISTE.map((r) => r.art).filter((a): a is string => !!a))].sort();
const SHIELDS = NK_WAFFEN_BASIS.filter((r) => r['Spezialisierung'] === 'Schild');
const WEAPONS = NK_WAFFEN_BASIS.filter((r) => r['Spezialisierung'] !== 'Schild');
const WEAPON_HAUPTFERTIGKEITEN = [...new Set(WEAPONS.map((r) => r['Hauptfertigkeit']).filter((v): v is string => !!v))].sort();

let selectedArt = PREISLISTE_ARTEN[0] ?? '';
let searchText = '';
let selectedHauptfertigkeit = WEAPON_HAUPTFERTIGKEITEN[0] ?? '';
let armorBasisRow = RUESTUNG_BASIS[0]?.sourceRow ?? 0;
let armorVerarbeitungRow = RUESTUNG_VERARBEITUNG[0]?.sourceRow ?? 0;
let armorAnpassungRow = RUESTUNG_ANPASSUNG[0]?.sourceRow ?? 0;

function renderPreislisteRow(row: (typeof PREISLISTE)[number]): string {
  const price = previewPreislistePrice(row, 1);
  const priceText = price !== null ? `${price} D` : `nicht kaeuflich (${escapeHtml(row.preisRoh ?? '?')})`;
  return `
    <div class="ausruestung-row">
      <span class="stat-label">${escapeHtml(row.name ?? '')}</span>
      <span class="stat-cost">${priceText}</span>
      ${price !== null ? `
        <input type="number" class="ausruestung-qty" min="1" value="1" data-source-row="${row.sourceRow}" />
        <button type="button" class="ausruestung-buy" data-source-row="${row.sourceRow}">Kaufen</button>
      ` : '<span></span><span></span>'}
    </div>`;
}

function renderArtefaktRow(basis: (typeof ARTEFAKT_BASIS)[number]): string {
  const kostenRows = ARTEFAKT_KOSTEN.filter((k) => k.referenz === basis.referenz);
  const options = kostenRows.map((k) => {
    const einmalig = previewArtefaktPrice(k, 'einmalig');
    const permanent = previewArtefaktPrice(k, 'permanent');
    return `
      <div class="artefakt-grad-row">
        <span>Grad ${escapeHtml(k.grad ?? '?')}</span>
        ${einmalig !== null ? `<button type="button" class="ausruestung-buy-artefakt" data-referenz="${basis.referenz}" data-grad="${k.grad}" data-variant="einmalig">Einmalig kaufen (${einmalig} D)</button>` : ''}
        ${permanent !== null ? `<button type="button" class="ausruestung-buy-artefakt" data-referenz="${basis.referenz}" data-grad="${k.grad}" data-variant="permanent">Permanent kaufen (${permanent} D)</button>` : ''}
      </div>`;
  }).join('');
  // <details> als direktes Flex-Item hat einen Chromium-Renderbug (open=false im DOM, Inhalt
  // trotzdem sichtbar ausserhalb des Layouts) - Huelle als nicht-flex Block-Element dazwischen.
  return `
    <div class="artefakt-card">
      <details class="artefakt-details">
        <summary>${escapeHtml(basis.name ?? basis.referenz)}</summary>
        <p class="artefakt-beschreibung">${escapeHtml(basis.beschreibung ?? '')}</p>
        ${options}
      </details>
    </div>`;
}

function renderArmorPicker(): string {
  const basis = RUESTUNG_BASIS.find((r) => r.sourceRow === armorBasisRow) ?? RUESTUNG_BASIS[0];
  const verarbeitung = RUESTUNG_VERARBEITUNG.find((r) => r.sourceRow === armorVerarbeitungRow) ?? RUESTUNG_VERARBEITUNG[0];
  const anpassung = RUESTUNG_ANPASSUNG.find((r) => r.sourceRow === armorAnpassungRow) ?? RUESTUNG_ANPASSUNG[0];
  const composed = composeArmor(basis, verarbeitung, anpassung);

  return `
    <div class="ausruestung-filters">
      <select id="armor-basis-select">
        ${RUESTUNG_BASIS.map((r) => `<option value="${r.sourceRow}" ${r.sourceRow === basis.sourceRow ? 'selected' : ''}>${escapeHtml(r.name)}</option>`).join('')}
      </select>
      <select id="armor-verarbeitung-select">
        ${RUESTUNG_VERARBEITUNG.map((r) => `<option value="${r.sourceRow}" ${r.sourceRow === verarbeitung.sourceRow ? 'selected' : ''}>${escapeHtml(r.name)}</option>`).join('')}
      </select>
      <select id="armor-anpassung-select">
        ${RUESTUNG_ANPASSUNG.map((r) => `<option value="${r.sourceRow}" ${r.sourceRow === anpassung.sourceRow ? 'selected' : ''}>${escapeHtml(r.name)}</option>`).join('')}
      </select>
    </div>
    <div class="pool-budget">
      RS ${composed.rs} | BE ${composed.be} | Preis ${composed.preis} D | Verfügbarkeit NW ${composed.verfuegbarkeitNw} / AW ${composed.verfuegbarkeitAw}
    </div>
    <button type="button" id="armor-buy">Kaufen</button>`;
}

function renderShieldRow(row: (typeof SHIELDS)[number]): string {
  const price = row['Preis-Basis'];
  return `
    <div class="ausruestung-row">
      <span class="stat-label">${escapeHtml(row.name)}</span>
      <span class="stat-cost">${price ?? '?'} D</span>
      <span></span>
      <button type="button" class="ausruestung-buy-shield" data-source-row="${row.sourceRow}">Kaufen</button>
    </div>`;
}

function renderWeaponRow(row: (typeof WEAPONS)[number]): string {
  const stats = ['AT-Basis', 'PA-Basis', 'RS-Basis', 'Laenge-m'].map((h) => `${h}: ${row[h] ?? '–'}`).join(' | ');
  return `
    <div class="ausruestung-row">
      <span class="stat-label">${escapeHtml(row.name)}</span>
      <span class="stat-cost">${stats}</span>
    </div>`;
}

function renderInventar(character: CharacterState): string {
  if (character.equipment.length === 0) {
    return '<p class="inventar-empty">Noch nichts gekauft.</p>';
  }
  return character.equipment.map((e) => {
    let label = `${e.family} (${e.baseTable} #${e.baseId})`;
    if (e.family === 'preisliste') {
      const row = PREISLISTE.find((r) => String(r.sourceRow) === e.baseId);
      label = row?.name ?? label;
    } else if (e.family === 'artefakt') {
      const kostenRow = ARTEFAKT_KOSTEN.find((r) => String(r.sourceRow) === e.baseId);
      label = kostenRow ? `${kostenRow.name} Grad ${kostenRow.grad} (${e.selections.variant})` : label;
    } else if (e.family === 'armor') {
      const row = RUESTUNG_BASIS.find((r) => String(r.sourceRow) === e.baseId);
      const stats = e.computedStatsSnapshot;
      label = row ? `${row.name} (RS ${stats?.rs}, BE ${stats?.be})` : label;
    } else if (e.family === 'shield') {
      const row = NK_WAFFEN_BASIS.find((r) => String(r.sourceRow) === e.baseId);
      label = row?.name ?? label;
    }
    const total = (e.computedPriceSnapshot ?? 0) * e.quantity;
    return `
      <div class="inventar-row" data-equipment-id="${e.id}">
        <span class="stat-label">${escapeHtml(label)}${e.quantity > 1 ? ` ×${e.quantity}` : ''}</span>
        <span class="stat-cost">${total} D</span>
        <button type="button" class="inventar-remove" data-equipment-id="${e.id}">Entfernen</button>
      </div>`;
  }).join('');
}

export function renderAusruestungView(
  container: HTMLElement,
  sheet: ComputedSheet,
  character: CharacterState,
  callbacks: AusruestungCallbacks,
): void {
  const filteredPreisliste = PREISLISTE.filter((r) => r.art === selectedArt)
    .filter((r) => !searchText || (r.name ?? '').toLowerCase().includes(searchText.toLowerCase()));
  const filteredWeapons = WEAPONS.filter((r) => r['Hauptfertigkeit'] === selectedHauptfertigkeit);

  container.innerHTML = `
    <h3 class="stat-section-heading">Mein Inventar</h3>
    <div class="inventar-category">${renderInventar(character)}</div>

    <h3 class="stat-section-heading">Rüstung</h3>
    ${renderArmorPicker()}

    <h3 class="stat-section-heading">Schilde</h3>
    <div class="ausruestung-category">${SHIELDS.map(renderShieldRow).join('')}</div>

    <h3 class="stat-section-heading">Waffen (nur Übersicht - Kauf folgt in Phase 9, Preisformel noch offen)</h3>
    <div class="ausruestung-filters">
      <select id="weapon-hauptfertigkeit-select">
        ${WEAPON_HAUPTFERTIGKEITEN.map((h) => `<option value="${escapeHtml(h)}" ${h === selectedHauptfertigkeit ? 'selected' : ''}>${escapeHtml(h)}</option>`).join('')}
      </select>
      <span class="stat-cost">${filteredWeapons.length} Einträge</span>
    </div>
    <div class="ausruestung-category">${filteredWeapons.map(renderWeaponRow).join('')}</div>

    <h3 class="stat-section-heading">Preisliste</h3>
    <div class="ausruestung-filters">
      <select id="ausruestung-art-select">
        ${PREISLISTE_ARTEN.map((a) => `<option value="${escapeHtml(a)}" ${a === selectedArt ? 'selected' : ''}>${escapeHtml(a)}</option>`).join('')}
      </select>
      <input type="text" id="ausruestung-search" placeholder="Suche..." value="${escapeHtml(searchText)}" />
      <span class="stat-cost">${filteredPreisliste.length} Einträge</span>
    </div>
    <div class="ausruestung-category">${filteredPreisliste.map(renderPreislisteRow).join('')}</div>

    <h3 class="stat-section-heading">Artefakte</h3>
    <div class="artefakt-category">${ARTEFAKT_BASIS.map(renderArtefaktRow).join('')}</div>
  `;

  document.getElementById('ausruestung-art-select')?.addEventListener('change', (e) => {
    selectedArt = (e.target as HTMLSelectElement).value;
    renderAusruestungView(container, sheet, character, callbacks);
  });
  document.getElementById('ausruestung-search')?.addEventListener('input', (e) => {
    searchText = (e.target as HTMLInputElement).value;
    renderAusruestungView(container, sheet, character, callbacks);
  });
  document.getElementById('weapon-hauptfertigkeit-select')?.addEventListener('change', (e) => {
    selectedHauptfertigkeit = (e.target as HTMLSelectElement).value;
    renderAusruestungView(container, sheet, character, callbacks);
  });
  document.getElementById('armor-basis-select')?.addEventListener('change', (e) => {
    armorBasisRow = Number((e.target as HTMLSelectElement).value);
    renderAusruestungView(container, sheet, character, callbacks);
  });
  document.getElementById('armor-verarbeitung-select')?.addEventListener('change', (e) => {
    armorVerarbeitungRow = Number((e.target as HTMLSelectElement).value);
    renderAusruestungView(container, sheet, character, callbacks);
  });
  document.getElementById('armor-anpassung-select')?.addEventListener('change', (e) => {
    armorAnpassungRow = Number((e.target as HTMLSelectElement).value);
    renderAusruestungView(container, sheet, character, callbacks);
  });
  document.getElementById('armor-buy')?.addEventListener('click', () => {
    callbacks.onBuyArmor(armorBasisRow, armorVerarbeitungRow, armorAnpassungRow);
  });

  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sourceRow = Number(btn.dataset.sourceRow);
      const qtyInput = container.querySelector<HTMLInputElement>(`.ausruestung-qty[data-source-row="${sourceRow}"]`);
      const quantity = Math.max(1, Math.floor(Number(qtyInput?.value ?? '1')));
      callbacks.onBuyPreisliste(sourceRow, quantity);
    });
  });
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy-artefakt').forEach((btn) => {
    btn.addEventListener('click', () => {
      callbacks.onBuyArtefakt(btn.dataset.referenz!, btn.dataset.grad!, btn.dataset.variant as ArtefaktVariant);
    });
  });
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy-shield').forEach((btn) => {
    btn.addEventListener('click', () => {
      callbacks.onBuyShield(Number(btn.dataset.sourceRow));
    });
  });
  container.querySelectorAll<HTMLButtonElement>('.inventar-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      callbacks.onRemoveEquipment(btn.dataset.equipmentId!);
    });
  });
}
