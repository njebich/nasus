// Ausruestungs-Ansicht: Preisliste, Artefakte, Ruestung (Basis+Verarbeitung+Anpassung-
// Komposition), Schilde und Waffen (je Basis+Material+Fertigung(+Anpassung/Schaftmaterial)-
// Komposition) mit Kaufen-Buttons, plus "Mein Inventar". Keine Markt-Kontext-Faktoren
// angewendet (siehe equipmentPricing.ts). Auf mehrere Dateien nach Kategorie aufgeteilt (siehe
// ausruestungShared/Ruestung/Schild/Waffen/Fernkampf/Alchemika/Artefakte/Preisliste/Inventar.ts) -
// diese Datei orchestriert nur noch renderAusruestungView: Filter-Zustand, categoryHtml-
// Zusammenbau und das Verdrahten aller Kategorie-Event-Handler nach jedem (Neu-)Render.

import type { ComputedSheet } from '../engine/characterSheet';
import type { CharacterState } from '../state/characterStore';
import type { RsGruppe } from '../data/trefferzonen';
import { ARTEFAKT_BASIS } from '../data/equipment/artefakte';
import { BOEGEN, ARMBRUST, FEUERWAFFEN } from '../data/equipment/fernkampf';
import { ALCHEMIKA } from '../data/equipment/alchemika';
import { PREISLISTE } from '../data/equipment/preisliste';
import type { FeuerwaffenMunitionArt } from '../data/equipment/feuerwaffenMunition';
import type { ArtefaktVariant } from '../engine/equipmentPricing';
import type { FeuerwaffenSelections } from '../engine/feuerwaffenComposition';
import { escapeHtml, setBestehenderCharakterMode } from './ausruestungShared';
import {
  RS_GRUPPEN, openGruppen as openRuestungGruppen, renderRuestungGruppe, wireRuestungEvents,
} from './ausruestungRuestung';
import { SHIELDS, renderShieldRow, wireSchildEvents } from './ausruestungSchild';
import { WEAPONS, WEAPON_HAUPTFERTIGKEITEN, renderWeaponRow, wireWaffenEvents } from './ausruestungWaffen';
import {
  renderFernkampfwaffeRow, renderFernkampfVolksgruppen, openFernkampfVolksgruppen, wireFernkampfwaffeEvents,
  renderMunitionGruppe, openMunitionGruppen, wireMunitionEvents,
  renderFeuerwaffeRow, wireFeuerwaffenEvents,
} from './ausruestungFernkampf';
import {
  ALCHEMIKA_KATEGORIEN, openAlchemikaKategorien, renderAlchemikaKategorie, wireAlchemikaEvents,
} from './ausruestungAlchemika';
import { openArtefakte, renderArtefaktRow, wireArtefakteEvents } from './ausruestungArtefakte';
import { PREISLISTE_ARTEN, renderPreislisteRow, wirePreislisteEvents } from './ausruestungPreisliste';
import { renderInventar, wireInventarEvents } from './ausruestungInventar';

export { equipmentInKategorie } from './ausruestungInventar';

export interface RuestungGruppenSelection {
  lage: number;
  basisSourceRow: number;
  verarbeitungSourceRow: number;
  anpassungSourceRow: number;
}

export interface AusruestungCallbacks {
  onBuyPreisliste: (sourceRow: number, quantity: number) => void;
  onBuyArtefakt: (referenz: string, grad: string, variant: ArtefaktVariant, targetWeaponId?: string, targetReferenz?: string) => void;
  onEquipRuestung: (
    gruppe: RsGruppe, lage: number, basisSourceRow: number, verarbeitungSourceRow: number, anpassungSourceRow: number,
  ) => void;
  onEquipRuestungAlleTz: (gruppe: RsGruppe, selections: RuestungGruppenSelection[]) => void;
  onUnequipRuestung: (gruppe: RsGruppe, lage: number) => void;
  onBuyShield: (sourceRow: number, materialSourceRow: number, fertigungSourceRow: number, bespannungSourceRow: number) => void;
  onBuyWeapon: (
    sourceRow: number, materialSourceRow: number, fertigungSourceRow: number, anpassungSourceRow: number, schaftmaterialSourceRow: number,
  ) => void;
  onBuyFernkampfwaffe: (typ: 'boegen' | 'armbrust', sourceRow: number) => void;
  onBuyFeuerwaffe: (sourceRow: number, selections: FeuerwaffenSelections) => void;
  onBuyFeuerwaffenMunition: (art: FeuerwaffenMunitionArt, kaliber: number, quantity: number) => void;
  onBuyMunition: (typ: 'pfeile' | 'bolzen', basisSourceRow: number, modifikatorSourceRow: number | null, quantity: number) => void;
  onBuyAlchemika: (sourceRow: number, quantity: number) => void;
  onRemoveEquipment: (equipmentId: string) => void;
}

export type KaufKategorie = 'Rüstung' | 'Schilde' | 'Waffen' | 'Bögen' | 'Armbrüste'
  | 'Feuerwaffen' | 'Alchemika' | 'Preisliste' | 'Artefakte';

let selectedArt = PREISLISTE_ARTEN[0] ?? '';
let searchText = '';
let selectedHauptfertigkeit = WEAPON_HAUPTFERTIGKEITEN[0] ?? '';
let searchWaffen = '';
let searchSchilde = '';
let searchBoegen = '';
let searchArmbrueste = '';
let searchFeuerwaffen = '';
let searchAlchemika = '';
let searchArtefakte = '';

/** Auch der Besitz-Block ist ein natives <details> - dessen Zustand muss separat gespeichert
 *  werden, weil ein Kauf in main.ts die komplette App (einschliesslich #view-container) ersetzt
 *  und der naechste Renderer deshalb kein altes DOM mehr vorfindet (gleiches Muster wie
 *  openGruppen/openArtefakte/... in den Kategoriemodulen). */
const openBesitzKategorien = new Set<KaufKategorie>();

/** Sichert alle Aufklappzustaende aus dem noch lebenden Inventar-DOM. Diese Funktion wird nicht
 *  nur am Renderer-Einstieg, sondern bereits in der Capture-Phase jeder Interaktion aufgerufen:
 *  Kauf-Callbacks ersetzen synchron die komplette App, bevor renderAusruestungView den Zustand
 *  aus dem alten Container lesen koennte. */
function rememberOpenInventoryDetails(container: HTMLElement): void {
  container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-gruppe]').forEach((details) => {
    const gruppe = details.dataset.gruppe as RsGruppe;
    if (details.open) openRuestungGruppen.add(gruppe);
    else openRuestungGruppen.delete(gruppe);
  });
  container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-alchemika-kategorie]').forEach((details) => {
    const kategorie = details.dataset.alchemikaKategorie!;
    if (details.open) openAlchemikaKategorien.add(kategorie);
    else openAlchemikaKategorien.delete(kategorie);
  });
  container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-fernkampf-volksgruppe]').forEach((details) => {
    const gruppenKey = details.dataset.fernkampfVolksgruppe!;
    if (details.open) openFernkampfVolksgruppen.add(gruppenKey);
    else openFernkampfVolksgruppen.delete(gruppenKey);
  });
  container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-munition-gruppe]').forEach((details) => {
    const typ = details.dataset.munitionGruppe as 'pfeile' | 'bolzen';
    if (details.open) openMunitionGruppen.add(typ);
    else openMunitionGruppen.delete(typ);
  });
  container.querySelectorAll<HTMLDetailsElement>('.artefakt-details[data-artefakt-referenz]').forEach((details) => {
    const referenz = details.dataset.artefaktReferenz!;
    if (details.open) openArtefakte.add(referenz);
    else openArtefakte.delete(referenz);
  });
  container.querySelectorAll<HTMLDetailsElement>('.ausruestung-owned-in-category[data-owned-category]').forEach((details) => {
    const category = details.dataset.ownedCategory as KaufKategorie;
    if (details.open) openBesitzKategorien.add(category);
    else openBesitzKategorien.delete(category);
  });
}

/** Haelt den Viewport bei Inventar-Aktionen stabil. Zweimaliges Wiederherstellen ist absichtlich:
 *  einmal nach dem synchronen DOM-Neuaufbau und einmal im naechsten Layout-Frame, nachdem der
 *  Browser die neuen <details>-Hoehen und seine eigene Scroll-Verankerung verarbeitet hat. */
function preserveInventoryScrollAfterInteraction(event: Event): void {
  const target = event.target;
  if (!(target instanceof Element) || !target.closest('button, select, input')) return;
  const left = window.scrollX;
  const top = window.scrollY;
  const anchorDefinitions: ReadonlyArray<{ selector: string; attributes: readonly string[] }> = [
    { selector: '[data-equipment-id]', attributes: ['data-equipment-id'] },
    { selector: '[data-slot]', attributes: ['data-slot'] },
    { selector: '[data-shield]', attributes: ['data-shield'] },
    { selector: '[data-weapon]', attributes: ['data-weapon'] },
    { selector: '[data-fernkampfwaffe]', attributes: ['data-fernkampfwaffe'] },
    { selector: '[data-feuerwaffe]', attributes: ['data-feuerwaffe'] },
    { selector: '[data-munition][data-basis-source-row]', attributes: ['data-munition', 'data-basis-source-row'] },
    { selector: '[data-alchemika]', attributes: ['data-alchemika'] },
    { selector: '[data-referenz][data-grad][data-variant]', attributes: ['data-referenz', 'data-grad', 'data-variant'] },
    { selector: '[data-source-row]', attributes: ['data-source-row'] },
  ];
  let anchorSelector = '';
  let anchorTop: number | undefined;
  for (const definition of anchorDefinitions) {
    const anchor = target.closest<HTMLElement>(definition.selector);
    if (!anchor) continue;
    const escapeAttributeValue = (value: string) => value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    anchorSelector = definition.attributes
      .map((attribute) => `[${attribute}="${escapeAttributeValue(anchor.getAttribute(attribute) ?? '')}"]`)
      .join('');
    anchorTop = anchor.getBoundingClientRect().top;
    break;
  }
  const restore = () => {
    const anchor = anchorSelector ? document.querySelector<HTMLElement>(anchorSelector) : null;
    const delta = anchor && anchorTop !== undefined ? anchor.getBoundingClientRect().top - anchorTop : 0;
    window.scrollTo(left, top + delta);
  };
  queueMicrotask(restore);
  window.requestAnimationFrame(restore);
}

export function renderAusruestungView(
  container: HTMLElement,
  sheet: ComputedSheet,
  character: CharacterState,
  callbacks: AusruestungCallbacks,
  category: KaufKategorie,
): void {
  setBestehenderCharakterMode(character.bestehenderCharakter ?? false);
  const filteredPreisliste = PREISLISTE.filter((r) => r.art === selectedArt)
    .filter((r) => !searchText || (r.name ?? '').toLowerCase().includes(searchText.toLowerCase()));
  const needleWaffen = searchWaffen.trim().toLowerCase();
  const filteredWeapons = WEAPONS.filter((r) => r['Hauptfertigkeit'] === selectedHauptfertigkeit)
    .filter((r) => !needleWaffen || r.name.toLowerCase().includes(needleWaffen));
  const needleSchilde = searchSchilde.trim().toLowerCase();
  const filteredShields = needleSchilde ? SHIELDS.filter((r) => r.name.toLowerCase().includes(needleSchilde)) : SHIELDS;
  const needleBoegen = searchBoegen.trim().toLowerCase();
  const filteredBoegen = needleBoegen ? BOEGEN.filter((r) => r.name.toLowerCase().includes(needleBoegen)) : BOEGEN;
  const needleArmbrueste = searchArmbrueste.trim().toLowerCase();
  const filteredArmbrust = needleArmbrueste ? ARMBRUST.filter((r) => r.name.toLowerCase().includes(needleArmbrueste)) : ARMBRUST;
  const needleFeuerwaffen = searchFeuerwaffen.trim().toLowerCase();
  const filteredFeuerwaffen = needleFeuerwaffen ? FEUERWAFFEN.filter((r) => r.name.toLowerCase().includes(needleFeuerwaffen)) : FEUERWAFFEN;
  const needleAlchemika = searchAlchemika.trim().toLowerCase();
  const alchemikaMatchCount = needleAlchemika
    ? ALCHEMIKA.filter((r) => r.name.toLowerCase().includes(needleAlchemika)).length
    : ALCHEMIKA.length;
  const needleArtefakte = searchArtefakte.trim().toLowerCase();
  const filteredArtefakte = needleArtefakte
    ? ARTEFAKT_BASIS.filter((r) => (r.name ?? r.referenz).toLowerCase().includes(needleArtefakte))
    : ARTEFAKT_BASIS;

  // Fokus+Cursor-Position des gerade getippten Suchfelds VOR dem innerHTML-Ersatz sichern (gilt
  // generisch fuer JEDES Text-Suchfeld dieser View) - sonst wuerde jeder Tastendruck den Fokus
  // verlieren, da innerHTML ein komplett neues Input-Element erzeugt. Nur restaurieren wenn das
  // Feld selbst fokussiert war, nicht bei einem Re-Render durch z.B. einen Kaufen-Klick.
  const focusedEl = document.activeElement;
  const focusedSearchId = focusedEl instanceof HTMLInputElement && focusedEl.type === 'text' ? focusedEl.id : '';
  const focusedSelectionStart = focusedSearchId ? (focusedEl as HTMLInputElement).selectionStart : null;

  // Aufklapp-Zustand der Ruestungs-Gruppen aus dem NOCH ALTEN DOM sichern, bevor er gleich durch
  // innerHTML ueberschrieben wird - sonst klappt jede Aenderung (Dropdown, Ausruesten, Kaufen,
  // ...) die gerade geoeffnete Gruppe faelschlich wieder zu (gleicher Bug wie zuvor in
  // categoryView.ts, hier aber am Renderer-Einstieg statt vor jedem einzelnen Handler behoben).
  rememberOpenInventoryDetails(container);

  const ownedEquipment = category === 'Rüstung' ? '' : `
    <details class="ausruestung-section ausruestung-owned-in-category" data-owned-category="${category}"${openBesitzKategorien.has(category) ? ' open' : ''}>
      <summary>Besitz in dieser Kategorie</summary>
      <div class="inventar-category">${renderInventar(character, category)}</div>
    </details>`;
  const categoryHtml: Record<KaufKategorie, string> = {
    'Rüstung': `<div class="stat-category">${RS_GRUPPEN.map(({ gruppe, label }) => renderRuestungGruppe(gruppe, label, character)).join('')}</div>`,
    'Schilde': `<div class="ausruestung-filters"><input type="text" id="schilde-search" placeholder="Suche..." value="${escapeHtml(searchSchilde)}" /></div>
      ${filteredShields.length === 0 && needleSchilde ? `<p class="auswahl-empty">Keine Treffer für "${escapeHtml(searchSchilde)}".</p>` : `<div class="ausruestung-category">${filteredShields.map((row) => renderShieldRow(row, character)).join('')}</div>`}`,
    'Waffen': `<div class="ausruestung-filters"><select id="weapon-hauptfertigkeit-select">${WEAPON_HAUPTFERTIGKEITEN.map((h) => `<option value="${escapeHtml(h)}" ${h === selectedHauptfertigkeit ? 'selected' : ''}>${escapeHtml(h)}</option>`).join('')}</select><input type="text" id="waffen-search" placeholder="Suche..." value="${escapeHtml(searchWaffen)}" /></div>
      ${filteredWeapons.length === 0 && needleWaffen ? `<p class="auswahl-empty">Keine Treffer für "${escapeHtml(searchWaffen)}".</p>` : `<div class="ausruestung-category">${filteredWeapons.map((row) => renderWeaponRow(row, character)).join('')}</div>`}`,
    'Bögen': `<div class="ausruestung-filters"><input type="text" id="boegen-search" placeholder="Suche..." value="${escapeHtml(searchBoegen)}" /></div>${renderMunitionGruppe('pfeile', 'Pfeile')}
      ${filteredBoegen.length === 0 && needleBoegen ? `<p class="auswahl-empty">Keine Treffer für "${escapeHtml(searchBoegen)}".</p>` : `<div class="stat-category">${renderFernkampfVolksgruppen('boegen', filteredBoegen, (row) => renderFernkampfwaffeRow('boegen', row), !!needleBoegen)}</div>`}`,
    'Armbrüste': `<div class="ausruestung-filters"><input type="text" id="armbrueste-search" placeholder="Suche..." value="${escapeHtml(searchArmbrueste)}" /></div>${renderMunitionGruppe('bolzen', 'Bolzen')}
      ${filteredArmbrust.length === 0 && needleArmbrueste ? `<p class="auswahl-empty">Keine Treffer für "${escapeHtml(searchArmbrueste)}".</p>` : `<div class="stat-category">${renderFernkampfVolksgruppen('armbrust', filteredArmbrust, (row) => renderFernkampfwaffeRow('armbrust', row), !!needleArmbrueste)}</div>`}`,
    'Feuerwaffen': `<div class="ausruestung-filters"><input type="text" id="feuerwaffen-search" placeholder="Suche..." value="${escapeHtml(searchFeuerwaffen)}" /></div>
      ${filteredFeuerwaffen.length === 0 && needleFeuerwaffen ? `<p class="auswahl-empty">Keine Treffer für "${escapeHtml(searchFeuerwaffen)}".</p>` : `<div class="stat-category">${renderFernkampfVolksgruppen('feuerwaffen', filteredFeuerwaffen, renderFeuerwaffeRow, !!needleFeuerwaffen)}</div>`}`,
    'Alchemika': `<div class="ausruestung-filters"><input type="text" id="alchemika-search" placeholder="Suche..." value="${escapeHtml(searchAlchemika)}" /></div>
      ${alchemikaMatchCount === 0 && needleAlchemika ? `<p class="auswahl-empty">Keine Treffer für "${escapeHtml(searchAlchemika)}".</p>` : `<div class="stat-category">${ALCHEMIKA_KATEGORIEN.map((k) => renderAlchemikaKategorie(k, needleAlchemika)).join('')}</div>`}`,
    'Preisliste': `<div class="ausruestung-filters"><select id="ausruestung-art-select">${PREISLISTE_ARTEN.map((a) => `<option value="${escapeHtml(a)}" ${a === selectedArt ? 'selected' : ''}>${escapeHtml(a)}</option>`).join('')}</select><input type="text" id="ausruestung-search" placeholder="Suche..." value="${escapeHtml(searchText)}" /></div><div class="ausruestung-category">${filteredPreisliste.map(renderPreislisteRow).join('')}</div>`,
    'Artefakte': `<div class="ausruestung-filters"><input type="text" id="artefakte-search" placeholder="Suche..." value="${escapeHtml(searchArtefakte)}" /></div>
      ${filteredArtefakte.length === 0 && needleArtefakte ? `<p class="auswahl-empty">Keine Treffer für "${escapeHtml(searchArtefakte)}".</p>` : `<div class="artefakt-category">${filteredArtefakte.map((row) => renderArtefaktRow(row, character)).join('')}</div>`}`,
  };
  container.innerHTML = `<section class="ausruestung-tab-view"><h2>${category}</h2>${ownedEquipment}${categoryHtml[category]}</section>`;

  // Capture ist hier entscheidend: Die spaeter registrierten Button-Handler koennen ueber main.ts
  // sofort die gesamte App ersetzen. Dann sind Zustand und Scrollposition bereits gesichert.
  container.addEventListener('click', () => rememberOpenInventoryDetails(container), { capture: true });
  container.addEventListener('change', () => rememberOpenInventoryDetails(container), { capture: true });
  container.addEventListener('input', () => rememberOpenInventoryDetails(container), { capture: true });
  container.addEventListener('click', preserveInventoryScrollAfterInteraction, { capture: true });
  container.addEventListener('change', preserveInventoryScrollAfterInteraction, { capture: true });
  container.addEventListener('input', preserveInventoryScrollAfterInteraction, { capture: true });

  if (focusedSearchId) {
    const el = document.getElementById(focusedSearchId);
    if (el instanceof HTMLInputElement) {
      el.focus();
      const pos = focusedSelectionStart ?? el.value.length;
      el.setSelectionRange(pos, pos);
    }
  }

  const rerender = () => renderAusruestungView(container, sheet, character, callbacks, category);

  document.getElementById('ausruestung-art-select')?.addEventListener('change', (e) => {
    selectedArt = (e.target as HTMLSelectElement).value;
    rerender();
  });
  document.getElementById('ausruestung-search')?.addEventListener('input', (e) => {
    searchText = (e.target as HTMLInputElement).value;
    rerender();
  });
  document.getElementById('weapon-hauptfertigkeit-select')?.addEventListener('change', (e) => {
    selectedHauptfertigkeit = (e.target as HTMLSelectElement).value;
    rerender();
  });
  document.getElementById('waffen-search')?.addEventListener('input', (e) => {
    searchWaffen = (e.target as HTMLInputElement).value;
    rerender();
  });
  document.getElementById('schilde-search')?.addEventListener('input', (e) => {
    searchSchilde = (e.target as HTMLInputElement).value;
    rerender();
  });
  document.getElementById('boegen-search')?.addEventListener('input', (e) => {
    searchBoegen = (e.target as HTMLInputElement).value;
    rerender();
  });
  document.getElementById('armbrueste-search')?.addEventListener('input', (e) => {
    searchArmbrueste = (e.target as HTMLInputElement).value;
    rerender();
  });
  document.getElementById('feuerwaffen-search')?.addEventListener('input', (e) => {
    searchFeuerwaffen = (e.target as HTMLInputElement).value;
    rerender();
  });
  document.getElementById('alchemika-search')?.addEventListener('input', (e) => {
    searchAlchemika = (e.target as HTMLInputElement).value;
    rerender();
  });
  document.getElementById('artefakte-search')?.addEventListener('input', (e) => {
    searchArtefakte = (e.target as HTMLInputElement).value;
    rerender();
  });

  wireRuestungEvents(container, character, callbacks, rerender);
  wireSchildEvents(container, character, callbacks, rerender);
  wireWaffenEvents(container, character, callbacks, rerender);
  wireFernkampfwaffeEvents(container, callbacks);
  wireFeuerwaffenEvents(container, callbacks, rerender);
  wireMunitionEvents(container, callbacks, rerender);
  wireAlchemikaEvents(container, callbacks);
  wireArtefakteEvents(container, character, callbacks);
  wirePreislisteEvents(container, callbacks);
  wireInventarEvents(container, callbacks);
}
