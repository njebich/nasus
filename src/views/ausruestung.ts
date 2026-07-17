// Ausruestungs-Ansicht: Preisliste, Artefakte, Ruestung (Basis+Verarbeitung+Anpassung-
// Komposition), Schilde (Basis-Preis) mit Kaufen-Buttons, Waffen als reine Browse-Liste
// (keine Preise ohne die - mit Nutzer auf Phase 9 vertagte - Material/Fertigung-Formel),
// plus "Mein Inventar". Keine Markt-Kontext-Faktoren angewendet (siehe equipmentPricing.ts).

import type { ComputedSheet } from '../engine/characterSheet';
import { ruestungSlotKey, type CharacterState } from '../state/characterStore';
import type { RsGruppe } from '../data/trefferzonen';
import { PREISLISTE } from '../data/equipment/preisliste';
import { ARTEFAKT_BASIS, ARTEFAKT_KOSTEN } from '../data/equipment/artefakte';
import { RUESTUNG_BASIS, RUESTUNG_VERARBEITUNG, RUESTUNG_ANPASSUNG } from '../data/equipment/armor';
import { SCHILD_MATERIAL, SCHILD_FERTIGUNG, SCHILD_BESPANNUNG } from '../data/equipment/shields';
import { NK_WAFFEN_BASIS } from '../data/equipment/weapons';
import { previewPreislistePrice, previewArtefaktPrice, type ArtefaktVariant } from '../engine/equipmentPricing';
import { composeArmor } from '../engine/armorComposition';
import { composeShield, istSchildKomponenteVerfuegbar } from '../engine/shieldComposition';

export interface AusruestungCallbacks {
  onBuyPreisliste: (sourceRow: number, quantity: number) => void;
  onBuyArtefakt: (referenz: string, grad: string, variant: ArtefaktVariant) => void;
  onEquipRuestung: (
    gruppe: RsGruppe, lage: number, basisSourceRow: number, verarbeitungSourceRow: number, anpassungSourceRow: number,
  ) => void;
  onUnequipRuestung: (gruppe: RsGruppe, lage: number) => void;
  onBuyShield: (sourceRow: number, materialSourceRow: number, fertigungSourceRow: number, bespannungSourceRow: number) => void;
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

// TZ-Gruppen x Lagen (Regel Nutzer 2026-07-17: "im character state muss die ruestung erfasst
// werden" + "feste Slots: TZ-Gruppe x Lage"). Lage 0 (Kleidung) bewusst kein Slot, siehe
// characterStore.ts. Beschriftung wie auf dem Charakterblatt ("nur Kopf/Torso/Arme/Beine
// genannt, Zuordnung ist den Spielern bekannt").
const RS_GRUPPEN: ReadonlyArray<{ gruppe: RsGruppe; label: string }> = [
  { gruppe: 'kopf', label: 'Kopf' },
  { gruppe: 'torso', label: 'Torso' },
  { gruppe: 'arme', label: 'Arme' },
  { gruppe: 'beine', label: 'Beine' },
];
const RUESTUNG_LAGEN = [1, 2, 3, 4, 5] as const;

/** Transiente Picker-Auswahl je unbelegtem Slot (ueberlebt Re-Renders, bis "Ausruesten" geklickt
 *  wird) - analog zum frueheren globalen armorBasisRow/.../-Muster, jetzt aber pro Slot. */
const slotPicker = new Map<string, { basisSourceRow: number; verarbeitungSourceRow: number; anpassungSourceRow: number }>();

/** Welche Ruestungs-Gruppen (Kopf/Torso/Arme/Beine) der Spieler aufgeklappt hat - wie
 *  categoryView.ts's openGroupReferenzen: <details> hat keinen persistenten Zustand ueber ein
 *  komplettes Neu-Rendern hinweg, ohne das klappt die Gruppe bei jeder Aenderung (Dropdown-
 *  Wechsel, Ausruesten, ...) faelschlich wieder zu. */
const openGruppen = new Set<RsGruppe>();

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

function renderRuestungSlotRow(gruppe: RsGruppe, lage: number, character: CharacterState): string {
  const key = ruestungSlotKey(gruppe, lage);
  const equipped = character.ruestungSlots[key];

  if (equipped) {
    const basis = RUESTUNG_BASIS.find((r) => r.sourceRow === equipped.basisSourceRow);
    const stats = equipped.computedStatsSnapshot;
    return `
      <div class="ruestung-slot-row" data-slot="${key}">
        <span class="stat-label">Lage ${lage}: ${escapeHtml(basis?.name ?? '?')}</span>
        <span class="stat-cost">RS ${stats.rs} | RH ${stats.rh} | ${equipped.computedPriceSnapshot} D</span>
        <button type="button" class="ruestung-unequip" data-gruppe="${gruppe}" data-lage="${lage}">Ausziehen</button>
      </div>`;
  }

  const optionen = RUESTUNG_BASIS.filter((r) => Number(r['Lage']) === lage);
  if (optionen.length === 0) {
    // Lage 5 (Drachenschuppen/Spinnweben) hat noch keine Daten in Ruestung-Basis - Slot ist
    // strukturell vorbereitet, aber ohne Kaufoption bis die Daten+Sonderregeln stehen.
    return `
      <div class="ruestung-slot-row">
        <span class="stat-label">Lage ${lage}: (noch keine Optionen hinterlegt)</span>
      </div>`;
  }

  const sel = slotPicker.get(key) ?? {
    basisSourceRow: optionen[0].sourceRow,
    verarbeitungSourceRow: RUESTUNG_VERARBEITUNG[0]?.sourceRow ?? 0,
    anpassungSourceRow: RUESTUNG_ANPASSUNG[0]?.sourceRow ?? 0,
  };
  const basis = optionen.find((r) => r.sourceRow === sel.basisSourceRow) ?? optionen[0];
  const verarbeitung = RUESTUNG_VERARBEITUNG.find((r) => r.sourceRow === sel.verarbeitungSourceRow) ?? RUESTUNG_VERARBEITUNG[0];
  const anpassung = RUESTUNG_ANPASSUNG.find((r) => r.sourceRow === sel.anpassungSourceRow) ?? RUESTUNG_ANPASSUNG[0];
  const composed = composeArmor(basis, verarbeitung, anpassung);

  return `
    <div class="ruestung-slot-row" data-slot="${key}" data-gruppe="${gruppe}" data-lage="${lage}">
      <span class="stat-label">Lage ${lage}</span>
      <select class="ruestung-basis-select" data-slot="${key}">
        ${optionen.map((r) => `<option value="${r.sourceRow}" ${r.sourceRow === basis.sourceRow ? 'selected' : ''}>${escapeHtml(r.name)}</option>`).join('')}
      </select>
      <select class="ruestung-verarbeitung-select" data-slot="${key}">
        ${RUESTUNG_VERARBEITUNG.map((r) => `<option value="${r.sourceRow}" ${r.sourceRow === verarbeitung.sourceRow ? 'selected' : ''}>${escapeHtml(r.name)}</option>`).join('')}
      </select>
      <select class="ruestung-anpassung-select" data-slot="${key}">
        ${RUESTUNG_ANPASSUNG.map((r) => `<option value="${r.sourceRow}" ${r.sourceRow === anpassung.sourceRow ? 'selected' : ''}>${escapeHtml(r.name)}</option>`).join('')}
      </select>
      <span class="stat-cost">RS ${composed.rs} | RH ${composed.rh} | ${composed.preis} D</span>
      <button type="button" class="ruestung-equip" data-gruppe="${gruppe}" data-lage="${lage}">Ausrüsten</button>
    </div>`;
}

function renderRuestungGruppe(gruppe: RsGruppe, label: string, character: CharacterState): string {
  const gesamtRs = RUESTUNG_LAGEN.reduce(
    (sum, lage) => sum + (character.ruestungSlots[ruestungSlotKey(gruppe, lage)]?.computedStatsSnapshot.rs ?? 0), 0,
  );
  const gesamtRh = RUESTUNG_LAGEN.reduce(
    (sum, lage) => sum + (character.ruestungSlots[ruestungSlotKey(gruppe, lage)]?.computedStatsSnapshot.rh ?? 0), 0,
  );
  const openAttr = openGruppen.has(gruppe) ? ' open' : '';
  return `
    <div class="stat-card">
      <details class="stat-group" data-gruppe="${gruppe}"${openAttr}>
        <summary>${label} <span class="stat-group-count">(RS ${gesamtRs} | RH ${gesamtRh})</span></summary>
        <div class="stat-subgroup">
          ${RUESTUNG_LAGEN.map((lage) => renderRuestungSlotRow(gruppe, lage, character)).join('')}
        </div>
      </details>
    </div>`;
}

/** Transiente Picker-Auswahl je Schild (Regel Nutzer 2026-07-17: "die haben auch Anpassung" -
 *  Material/Fertigung/Bespannung, analog zum Ruestungs-Slot-Picker). Kolhartz(Material)/
 *  Kohlharz(Bespannung) sind nur fuer Zentauren waehlbar, siehe istSchildKomponenteVerfuegbar. */
const shieldPicker = new Map<number, { materialSourceRow: number; fertigungSourceRow: number; bespannungSourceRow: number }>();

function renderShieldRow(row: (typeof SHIELDS)[number], character: CharacterState): string {
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

  return `
    <div class="ausruestung-row" data-shield="${row.sourceRow}">
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
      <span class="stat-cost">RS ${composed.rs} | ${composed.preis !== null ? `${composed.preis} D` : 'kein Preis (Meister-Ermessen)'}</span>
      ${composed.preis !== null
    ? `<button type="button" class="ausruestung-buy-shield" data-shield="${row.sourceRow}">Kaufen</button>`
    : '<span></span>'}
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
    } else if (e.family === 'shield') {
      const row = NK_WAFFEN_BASIS.find((r) => String(r.sourceRow) === e.baseId);
      const rs = e.computedStatsSnapshot?.rs;
      // RS des Schilds wird angezeigt, aber bewusst NICHT in rs_arme eingerechnet (Regel Nutzer
      // 2026-07-17: Anrechnung auf den linken Arm ist Kampfmodul-Scope, siehe characterMutations.ts).
      label = row ? `${row.name} (RS ${rs})` : label;
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

  // Aufklapp-Zustand der Ruestungs-Gruppen aus dem NOCH ALTEN DOM sichern, bevor er gleich durch
  // innerHTML ueberschrieben wird - sonst klappt jede Aenderung (Dropdown, Ausruesten, Kaufen,
  // ...) die gerade geoeffnete Gruppe faelschlich wieder zu (gleicher Bug wie zuvor in
  // categoryView.ts, hier aber am Renderer-Einstieg statt vor jedem einzelnen Handler behoben).
  container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-gruppe]').forEach((details) => {
    const gruppe = details.dataset.gruppe as RsGruppe;
    if (details.open) openGruppen.add(gruppe);
    else openGruppen.delete(gruppe);
  });

  container.innerHTML = `
    <h3 class="stat-section-heading">Mein Inventar</h3>
    <div class="inventar-category">${renderInventar(character)}</div>

    <h3 class="stat-section-heading">Rüstung</h3>
    <div class="stat-category">${RS_GRUPPEN.map(({ gruppe, label }) => renderRuestungGruppe(gruppe, label, character)).join('')}</div>

    <h3 class="stat-section-heading">Schilde</h3>
    <div class="ausruestung-category">${SHIELDS.map((row) => renderShieldRow(row, character)).join('')}</div>

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
  // Liest die aktuell angezeigten Werte aller 3 Dropdowns einer Slot-Zeile aus dem DOM, damit
  // ein einzelnes "change" (z.B. nur Verarbeitung) die anderen beiden nicht auf Zeile-0 zuruecksetzt.
  function updateSlotPicker(slotKey: string, patch: Partial<{ basisSourceRow: number; verarbeitungSourceRow: number; anpassungSourceRow: number }>): void {
    const row = container.querySelector<HTMLElement>(`.ruestung-slot-row[data-slot="${slotKey}"]`);
    const readSelect = (cls: string) => Number(row?.querySelector<HTMLSelectElement>(`.${cls}`)?.value ?? 0);
    slotPicker.set(slotKey, {
      basisSourceRow: readSelect('ruestung-basis-select'),
      verarbeitungSourceRow: readSelect('ruestung-verarbeitung-select'),
      anpassungSourceRow: readSelect('ruestung-anpassung-select'),
      ...patch,
    });
    renderAusruestungView(container, sheet, character, callbacks);
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
  container.querySelectorAll<HTMLButtonElement>('.ruestung-unequip').forEach((btn) => {
    btn.addEventListener('click', () => {
      callbacks.onUnequipRuestung(btn.dataset.gruppe as RsGruppe, Number(btn.dataset.lage));
    });
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
  function updateShieldPicker(shieldSourceRow: number, patch: Partial<{ materialSourceRow: number; fertigungSourceRow: number; bespannungSourceRow: number }>): void {
    const row = container.querySelector<HTMLElement>(`.ausruestung-row[data-shield="${shieldSourceRow}"]`);
    const readSelect = (cls: string) => Number(row?.querySelector<HTMLSelectElement>(`.${cls}`)?.value ?? 0);
    shieldPicker.set(shieldSourceRow, {
      materialSourceRow: readSelect('schild-material-select'),
      fertigungSourceRow: readSelect('schild-fertigung-select'),
      bespannungSourceRow: readSelect('schild-bespannung-select'),
      ...patch,
    });
    renderAusruestungView(container, sheet, character, callbacks);
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
  container.querySelectorAll<HTMLButtonElement>('.inventar-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      callbacks.onRemoveEquipment(btn.dataset.equipmentId!);
    });
  });
}
