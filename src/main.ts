import './style.css';
import {
  listCharacters, loadCharacter, createCharacter, saveCharacter, deleteCharacter,
  getLastActiveCharacterId, setLastActiveCharacterId, ruestungSlotKey,
  type CharacterState, type CharacterHeader, type StartbudgetPreset, type WaffenLoadoutComboType,
} from './state/characterStore';
import {
  setValue, addSelection, removeSelection, setPoolAllocation, setWaffenPoolAllocation, updateHeader,
  buyPreislisteItem, buyArtefakt, equipRuestung, unequipRuestung, buyShield, buyWeapon,
  buyFernkampfwaffe, buyFeuerwaffe, buyMunition, buyFeuerwaffenMunition, buyAlchemika, removeEquipment,
  setGrundfertigkeitPick, addWaffenLoadout, removeWaffenLoadout, toggleWaffenLoadoutFavorite,
  BudgetError, MutationError,
} from './state/characterMutations';
import { computeSheet, makeValueSource, type ComputedSheet } from './engine/characterSheet';
import { renderCategoryView } from './views/categoryView';
import { renderAuswahlView } from './views/talenteVornachteile';
import { renderAusruestungView, type RuestungGruppenSelection } from './views/ausruestung';
import { renderCharakterheader } from './views/charakterheader';
import { renderCharakterbogen } from './views/charakterbogen';
import { renderKampfView } from './views/kampf';
import { renderKiView } from './views/ki';
import { renderSpruchmagieView } from './views/spruchmagie';
import { renderPsiView } from './views/psi';
import { renderGeweihteView } from './views/geweihte';
import { isGeweihterTalentSelectedInSheet } from './engine/geweihte';
import { initTooltips, tooltipAttr } from './views/tooltip';
import { VOELKER_NAMEN } from './engine/voelker';
import type { PoolAllocation } from './state/characterStore';
import type { ArtefaktVariant } from './engine/equipmentPricing';
import type { RsGruppe } from './data/trefferzonen';
import type { FeuerwaffenSelections } from './engine/feuerwaffenComposition';
import type { FeuerwaffenMunitionArt } from './data/equipment/feuerwaffenMunition';
import {
  VORDEFINIERTE_ORTE, WELTEN, SIEDLUNGSGROESSEN, HANDELSSTUFEN, HERSTELLUNGSORTE,
  createOrt, formatOrtKurz, type Welt, type Siedlungsgroesse, type Handelsstufe, type Herstellungsort,
} from './data/orte';
import { getReligionen, addReligion, addSekte, formatReligionLabel, combineReligionSekte } from './state/religionStore';

const app = document.querySelector<HTMLDivElement>('#app')!;

const TABS = [
  'Charakterbogen',
  'Eigenschaft', 'Attribute', 'Charakterwerte', 'Grundfertigkeit', 'Sonderfertigkeit',
  'Nahkampf', 'Fernkampf', 'Kampf', 'Bewegung', 'Gewichtsbelastung', 'WHK',
  'Sprache & Kultur', 'Talente', 'Vor- und Nachteile', 'Ausrüstung', 'KI', 'Spruchmagie', 'Psi', 'Geweihte',
] as const;
type Tab = (typeof TABS)[number];
const AUSWAHL_TABS: Partial<Record<Tab, boolean>> = { 'Talente': true, 'Vor- und Nachteile': false };

// Geweihte-Tab bleibt ausgeblendet, bis ein Geweihte-Gate-Talent gewaehlt ist (Nutzer 2026-07-22,
// "rang 0" = "hiding of the tab Geweihte") - anders als alle anderen Tabs, die immer sichtbar sind.
function isTabVisible(tab: Tab, sheet: ComputedSheet | null): boolean {
  if (tab !== 'Geweihte') return true;
  return sheet !== null && isGeweihterTalentSelectedInSheet(sheet);
}

// Tab-Intro-Texte aus `tooltips text.txt` (Zeilen "tab_..."): erklaeren die Kategorie als
// Ganzes (z.B. wie Grundfertigkeiten grundsaetzlich funktionieren), gehoeren daher an den
// Tab-Button selbst statt an eine einzelne Zeile - siehe PLAN-Tooltip-System.md Phase 2.
const TAB_INTRO: Partial<Record<Tab, string>> = {
  'Grundfertigkeit': 'Grundfertigkeiten werden, sofern der Meister sie für die Probe zulässt, zum Probenwert addiert. Zugelassene Grundfertigkeiten werden entweder vom Meister mit der Probe angesagt, oder wenn er eine Eigenschaftsprobe verlangt, so wird vom Spieler nachgefragt ob er eine bestimmte verwenden darf, die er als passend ansieht. Für eine Probe darf höchstens eine Grundfertigkeit verwendet werden. Der Meister kann aber auch mehr als eine Grundfertigkeit zulassen, dann darf der Charakter eine davon auswählen. Der einzige Unterschied zwischen körperlichen und geistigen Grundfertigkeiten ist, dass der Meister dadurch einen Anhaltspunkt hat, ob eine Grundfertigkeitsprobe durch GBE behindert werden sollte: In der Regel bei körperlichen 1-fach und bei geistigen nicht. Durch Kampf oder andere Ereignisse erhaltene BE gilt für alle Grundfertigkeiten gleich.',
  'Sonderfertigkeit': 'Sonderfertigkeiten werden in der Regel nicht mit eigenen Proben abgefragt; sie sind entweder in Formeln vertreten oder geben Boni auf Tabellenproben.',
  'Geweihte': 'Zeigt Geweihtengrad, Karma-Pool-Punkte (KPP) und die verfügbaren Wunder der gewählten Religion. Die Fähigkeiten Stoßgebet/Wunder/Ritual (Probe-Basis) werden im WHK-Tab gesteigert.',
};

// Beim Start den zuletzt aktiven Charakter wiederherstellen (siehe characterStore.ts) - sonst
// faellt jeder Seiten-Reload auf die leere Auswahl zurueck, obwohl der Charakter noch da ist.
const lastActiveId = getLastActiveCharacterId();
let currentCharacter: CharacterState | null = lastActiveId ? loadCharacter(lastActiveId) : null;
if (lastActiveId && !currentCharacter) setLastActiveCharacterId(null); // Charakter wurde geloescht
let errorMessage = '';
let activeTab: Tab = 'Eigenschaft';
let showNewCharacterForm = false;
let confirmingDelete = false;
let headerSectionOpen = true;

function handleValueChange(referenz: string, newValue: number): void {
  if (!currentCharacter) return;
  try {
    currentCharacter = setValue(currentCharacter, referenz, newValue);
    saveCharacter(currentCharacter);
    errorMessage = '';
  } catch (err) {
    errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
  }
  render();
}

function handleHeaderChange(updates: Partial<CharacterHeader>): void {
  if (!currentCharacter) return;
  currentCharacter = updateHeader(currentCharacter, updates);
  saveCharacter(currentCharacter);
  render();
}

function handlePoolChange(referenz: string, allocation: PoolAllocation): void {
  if (!currentCharacter) return;
  try {
    currentCharacter = setPoolAllocation(currentCharacter, referenz, allocation);
    saveCharacter(currentCharacter);
    errorMessage = '';
  } catch (err) {
    errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
  }
  render();
}

function handleWaffenPoolChange(poolReferenz: string, equipmentId: string, allocation: PoolAllocation): void {
  if (!currentCharacter) return;
  try {
    currentCharacter = setWaffenPoolAllocation(currentCharacter, poolReferenz, equipmentId, allocation);
    saveCharacter(currentCharacter);
    errorMessage = '';
  } catch (err) {
    errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
  }
  render();
}

function handleGrundfertigkeitPick(talentReferenz: string, slotIndex: number, grundfertigkeitReferenz: string): void {
  if (!currentCharacter) return;
  try {
    currentCharacter = setGrundfertigkeitPick(currentCharacter, talentReferenz, slotIndex, grundfertigkeitReferenz);
    saveCharacter(currentCharacter);
    errorMessage = '';
  } catch (err) {
    errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
  }
  render();
}

function handleToggle(referenz: string, selected: boolean): void {
  if (!currentCharacter) return;
  try {
    currentCharacter = selected ? addSelection(currentCharacter, referenz) : removeSelection(currentCharacter, referenz);
    saveCharacter(currentCharacter);
    errorMessage = '';
  } catch (err) {
    errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
  }
  render();
}

function handleBuyPreisliste(sourceRow: number, quantity: number): void {
  if (!currentCharacter) return;
  try {
    currentCharacter = buyPreislisteItem(currentCharacter, sourceRow, quantity);
    saveCharacter(currentCharacter);
    errorMessage = '';
  } catch (err) {
    errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
  }
  render();
}

function handleBuyArtefakt(referenz: string, grad: string, variant: ArtefaktVariant): void {
  if (!currentCharacter) return;
  try {
    currentCharacter = buyArtefakt(currentCharacter, referenz, grad, variant);
    saveCharacter(currentCharacter);
    errorMessage = '';
  } catch (err) {
    errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
  }
  render();
}

function handleEquipRuestung(
  gruppe: RsGruppe, lage: number, basisSourceRow: number, verarbeitungSourceRow: number, anpassungSourceRow: number,
): void {
  if (!currentCharacter) return;
  try {
    currentCharacter = equipRuestung(currentCharacter, gruppe, lage, basisSourceRow, verarbeitungSourceRow, anpassungSourceRow);
    saveCharacter(currentCharacter);
    errorMessage = '';
  } catch (err) {
    errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
  }
  render();
}

const RUESTUNG_GRUPPEN_REIHENFOLGE: readonly RsGruppe[] = ['kopf', 'torso', 'arme', 'beine'];

function handleEquipRuestungAlleTz(gruppe: RsGruppe, selections: RuestungGruppenSelection[]): void {
  if (!currentCharacter) return;
  try {
    for (const ziel of RUESTUNG_GRUPPEN_REIHENFOLGE) {
      if (ziel === gruppe) continue;
      for (const sel of selections) {
        if (currentCharacter.ruestungSlots[ruestungSlotKey(ziel, sel.lage)]) continue;
        currentCharacter = equipRuestung(
          currentCharacter, ziel, sel.lage, sel.basisSourceRow, sel.verarbeitungSourceRow, sel.anpassungSourceRow,
        );
      }
    }
    errorMessage = '';
  } catch (err) {
    errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
  }
  saveCharacter(currentCharacter);
  render();
}

function handleUnequipRuestung(gruppe: RsGruppe, lage: number): void {
  if (!currentCharacter) return;
  currentCharacter = unequipRuestung(currentCharacter, gruppe, lage);
  saveCharacter(currentCharacter);
  errorMessage = '';
  render();
}

function handleBuyShield(sourceRow: number, materialSourceRow: number, fertigungSourceRow: number, bespannungSourceRow: number): void {
  if (!currentCharacter) return;
  try {
    currentCharacter = buyShield(currentCharacter, sourceRow, materialSourceRow, fertigungSourceRow, bespannungSourceRow);
    saveCharacter(currentCharacter);
    errorMessage = '';
  } catch (err) {
    errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
  }
  render();
}

function handleBuyWeapon(
  sourceRow: number, materialSourceRow: number, fertigungSourceRow: number, anpassungSourceRow: number, schaftmaterialSourceRow: number,
): void {
  if (!currentCharacter) return;
  try {
    currentCharacter = buyWeapon(currentCharacter, sourceRow, materialSourceRow, fertigungSourceRow, anpassungSourceRow, schaftmaterialSourceRow);
    saveCharacter(currentCharacter);
    errorMessage = '';
  } catch (err) {
    errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
  }
  render();
}

function handleBuyFernkampfwaffe(typ: 'boegen' | 'armbrust', sourceRow: number): void {
  if (!currentCharacter) return;
  try {
    currentCharacter = buyFernkampfwaffe(currentCharacter, typ, sourceRow);
    saveCharacter(currentCharacter);
    errorMessage = '';
  } catch (err) {
    errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
  }
  render();
}

function handleBuyFeuerwaffe(sourceRow: number, selections: FeuerwaffenSelections): void {
  if (!currentCharacter) return;
  try {
    currentCharacter = buyFeuerwaffe(currentCharacter, sourceRow, selections);
    saveCharacter(currentCharacter);
    errorMessage = '';
  } catch (err) {
    errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
  }
  render();
}

function handleBuyFeuerwaffenMunition(art: FeuerwaffenMunitionArt, kaliber: number, quantity: number): void {
  if (!currentCharacter) return;
  try {
    currentCharacter = buyFeuerwaffenMunition(currentCharacter, art, kaliber, quantity);
    saveCharacter(currentCharacter);
    errorMessage = '';
  } catch (err) {
    errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
  }
  render();
}

function handleBuyMunition(typ: 'pfeile' | 'bolzen', basisSourceRow: number, modifikatorSourceRow: number | null, quantity: number): void {
  if (!currentCharacter) return;
  try {
    currentCharacter = buyMunition(currentCharacter, typ, basisSourceRow, modifikatorSourceRow, quantity);
    saveCharacter(currentCharacter);
    errorMessage = '';
  } catch (err) {
    errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
  }
  render();
}

function handleBuyAlchemika(sourceRow: number, quantity: number): void {
  if (!currentCharacter) return;
  try {
    currentCharacter = buyAlchemika(currentCharacter, sourceRow, quantity);
    saveCharacter(currentCharacter);
    errorMessage = '';
  } catch (err) {
    errorMessage = err instanceof BudgetError || err instanceof MutationError ? err.message : String(err);
  }
  render();
}

function handleRemoveEquipment(equipmentId: string): void {
  if (!currentCharacter) return;
  currentCharacter = removeEquipment(currentCharacter, equipmentId);
  saveCharacter(currentCharacter);
  errorMessage = '';
  render();
}

function handleAddWaffenLoadout(comboType: WaffenLoadoutComboType, primaryEquipmentId: string, secondaryEquipmentId: string): void {
  if (!currentCharacter) return;
  try {
    currentCharacter = addWaffenLoadout(currentCharacter, comboType, primaryEquipmentId, secondaryEquipmentId);
    saveCharacter(currentCharacter);
    errorMessage = '';
  } catch (err) {
    errorMessage = err instanceof MutationError ? err.message : String(err);
  }
  render();
}

function handleRemoveWaffenLoadout(loadoutId: string): void {
  if (!currentCharacter) return;
  currentCharacter = removeWaffenLoadout(currentCharacter, loadoutId);
  saveCharacter(currentCharacter);
  errorMessage = '';
  render();
}

function handleToggleWaffenLoadoutFavorite(loadoutId: string): void {
  if (!currentCharacter) return;
  currentCharacter = toggleWaffenLoadoutFavorite(currentCharacter, loadoutId);
  saveCharacter(currentCharacter);
  errorMessage = '';
  render();
}

function renderNewCharacterForm(): string {
  return `
    <form id="new-character-form" class="new-character-form">
      <label>Name * <input type="text" id="nc-name" required autofocus /></label>
      <label>Spezies *
        <select id="nc-spezies" required>
          <option value="">-- wählen --</option>
          ${VOELKER_NAMEN.map((name) => `<option value="${name}">${name}</option>`).join('')}
        </select>
      </label>
      <label>Beruf <input type="text" id="nc-beruf" /></label>
      <label>Alter <input type="text" id="nc-alter" /></label>
      <label>Geburtstag <input type="text" id="nc-geburtstag" /></label>
      <label>Herkunft *
        <select id="nc-herkunft" required>
          <option value="">-- wählen --</option>
          ${VORDEFINIERTE_ORTE.map((ort) => `<option value="${ort.id}">${formatOrtKurz(ort)}</option>`).join('')}
          <option value="__neu__">+ Neuen Ort anlegen</option>
        </select>
      </label>
      <fieldset id="nc-neuer-ort" class="new-location-fields" hidden>
        <legend>Neuer Herkunftsort</legend>
        <label>Ortsname * <input type="text" id="nc-ort-name" /></label>
        <label>AW/NW
          <select id="nc-ort-welt"><option value="">-- offen --</option>${WELTEN.map((value) => `<option value="${value}">${value}</option>`).join('')}</select>
        </label>
        <label>Region <input type="text" id="nc-ort-region" /></label>
        <label>Siedlungsgröße
          <select id="nc-ort-siedlung"><option value="">-- offen --</option>${SIEDLUNGSGROESSEN.map((value) => `<option value="${value}">${value}</option>`).join('')}</select>
        </label>
        <label>Handelsstufe
          <select id="nc-ort-handel"><option value="">-- offen --</option>${HANDELSSTUFEN.map((value) => `<option value="${value}">${value}</option>`).join('')}</select>
        </label>
        <label>Herstellungsort
          <select id="nc-ort-herstellung"><option value="">-- offen --</option>${HERSTELLUNGSORTE.map((value) => `<option value="${value}">${value}</option>`).join('')}</select>
        </label>
      </fieldset>
      <label>Familie <input type="text" id="nc-familie" /></label>
      <label>Religion
        <select id="nc-religion">
          <option value="">-- keine --</option>
          ${getReligionen().map((r) => `<option value="${r.id}" title="${r.volk ?? ''}">${formatReligionLabel(r)}</option>`).join('')}
          <option value="__neu__">+ Neue Religion anlegen</option>
        </select>
      </label>
      <fieldset id="nc-neue-religion" class="new-location-fields" hidden>
        <legend>Neue Religion</legend>
        <label>Name * <input type="text" id="nc-religion-name" /></label>
        <label>Volk <input type="text" id="nc-religion-volk" /></label>
      </fieldset>
      <label>Sekte
        <select id="nc-sekte" disabled>
          <option value="">-- keine --</option>
          <option value="__neu__">+ Neue Sekte anlegen</option>
        </select>
      </label>
      <fieldset id="nc-neue-sekte" class="new-location-fields" hidden>
        <legend>Neue Sekte</legend>
        <label>Name * <input type="text" id="nc-sekte-name" /></label>
      </fieldset>
      <fieldset>
        <legend>Startbudget</legend>
        <label><input type="radio" name="nc-startbudget" value="normal" checked /> Normal (Stufe 0, 6490 SP, 5000D)</label>
        <label><input type="radio" name="nc-startbudget" value="gehoben" /> Gehoben (Stufe 15, 8090 SP, 6000D)</label>
      </fieldset>
      <div class="new-character-form-actions">
        <button type="submit">Anlegen</button>
        <button type="button" id="new-character-cancel">Abbrechen</button>
      </div>
    </form>`;
}

function render(): void {
  const characters = listCharacters();
  const sheet = currentCharacter ? computeSheet(currentCharacter) : null;
  // Fuer die Formel-Impact-Liste (Plan-Phase 3, nur Eigenschaft/Attribute-Tab) - billig zu bauen
  // (reine Closures ueber currentCharacter, keine Berechnung), siehe categoryView.ts.
  const characterValues = currentCharacter ? makeValueSource(currentCharacter) : undefined;
  // Geweihte-Tab kann durch Ab-/Umwaehlen des Gate-Talents nachtraeglich unsichtbar werden -
  // dann auf einen immer sichtbaren Tab zurueckfallen statt eine leere Ansicht zu zeigen.
  if (sheet && !isTabVisible(activeTab, sheet)) activeTab = 'Eigenschaft';

  app.innerHTML = `
    <header class="app-header">
      <h1>Nasus – Charaktererstellung</h1>
      <div class="character-bar">
        <select id="character-select">
          <option value="">-- Charakter wählen --</option>
          ${characters.map((c) => `<option value="${c.id}" ${c.id === currentCharacter?.id ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>
        <button type="button" id="new-character">Neuer Charakter</button>
        ${currentCharacter ? '<button type="button" id="delete-character">Löschen</button>' : ''}
      </div>
      ${showNewCharacterForm ? renderNewCharacterForm() : ''}
      ${confirmingDelete && currentCharacter ? `
        <div class="inline-form">
          <span>Charakter "${currentCharacter.name}" wirklich löschen?</span>
          <button type="button" id="delete-confirm">Ja, löschen</button>
          <button type="button" id="delete-cancel">Abbrechen</button>
        </div>` : ''}
      ${currentCharacter ? `
        <details class="stat-group" id="charakterheader-details" ${headerSectionOpen ? 'open' : ''}>
          <summary>Grunddaten (Name, Spezies, Beruf, ...)</summary>
          <div id="charakterheader"></div>
        </details>` : ''}
      ${sheet ? `
        <div class="budget-bar">
          <span title="Lebenszeit-Gesamterfahrung, speist Stufe/Kreis – ${sheet.epNaechsteStufeAb !== undefined ? `nächste Stufe ab ${sheet.epNaechsteStufeAb} EP` : 'höchste Stufe erreicht'}">EP: ${sheet.epGesamt}</span>
          <span title="Steigerungspunkte (übrig): bezahlt Eigenschaften/Attribute/Fertigkeiten/Vor-Nachteile/WHK – verbraucht ${sheet.spSpent} von ${sheet.spTotal}">SP: ${sheet.spRemaining}</span>
          <span title="Talentpunkte (übrig): bezahlt ausschließlich Talente, eigener Pool = 20+Stufe×5 – verbraucht ${sheet.tapSpent} von ${sheet.tapTotal}">TaP: ${sheet.tapRemaining}</span>
          <span title="Dublonen: Käufe ziehen erst vom Bargeld, danach vom Bankguthaben ab – insgesamt verbraucht ${sheet.dublonenSpent} von ${sheet.dublonenTotal}">Dublonen: ${sheet.dublonenBarRemaining} bar / ${sheet.dublonenBankRemaining} Bank</span>
        </div>` : ''}
      ${errorMessage ? `<div class="error-message">${errorMessage}</div>` : ''}
      ${currentCharacter ? `
        <nav class="tab-nav">
          ${TABS.filter((tab) => isTabVisible(tab, sheet)).map((tab) => `<button type="button" class="tab-btn" data-tab="${tab}"${tooltipAttr(TAB_INTRO[tab])} ${activeTab === tab ? 'aria-current="page"' : ''}>${tab}</button>`).join('')}
        </nav>` : ''}
    </header>
    <main id="view-container"></main>
  `;

  document.querySelector<HTMLSelectElement>('#character-select')?.addEventListener('change', (e) => {
    const id = (e.target as HTMLSelectElement).value;
    currentCharacter = id ? loadCharacter(id) : null;
    setLastActiveCharacterId(id || null);
    errorMessage = '';
    confirmingDelete = false;
    render();
  });

  document.querySelector('#new-character')?.addEventListener('click', () => {
    showNewCharacterForm = true;
    render();
  });

  document.querySelector('#new-character-cancel')?.addEventListener('click', () => {
    showNewCharacterForm = false;
    render();
  });

  document.querySelector<HTMLSelectElement>('#nc-herkunft')?.addEventListener('change', (e) => {
    const isNew = (e.target as HTMLSelectElement).value === '__neu__';
    const fields = document.querySelector<HTMLFieldSetElement>('#nc-neuer-ort');
    const nameInput = document.querySelector<HTMLInputElement>('#nc-ort-name');
    if (fields) fields.hidden = !isNew;
    if (nameInput) nameInput.required = isNew;
  });

  const populateSekteSelect = (religionId: string): void => {
    const sekteSelect = document.querySelector<HTMLSelectElement>('#nc-sekte');
    if (!sekteSelect) return;
    const sekten = getReligionen().find((r) => r.id === religionId)?.sekten ?? [];
    sekteSelect.disabled = false;
    sekteSelect.innerHTML = `
      <option value="">-- keine --</option>
      ${sekten.map((s) => `<option value="${s}">${s}</option>`).join('')}
      <option value="__neu__">+ Neue Sekte anlegen</option>
    `;
    const sekteFields = document.querySelector<HTMLFieldSetElement>('#nc-neue-sekte');
    if (sekteFields) sekteFields.hidden = true;
  };

  document.querySelector<HTMLSelectElement>('#nc-religion')?.addEventListener('change', (e) => {
    const value = (e.target as HTMLSelectElement).value;
    const isNew = value === '__neu__';
    const fields = document.querySelector<HTMLFieldSetElement>('#nc-neue-religion');
    const nameInput = document.querySelector<HTMLInputElement>('#nc-religion-name');
    if (fields) fields.hidden = !isNew;
    if (nameInput) nameInput.required = isNew;
    if (!value) {
      const sekteSelect = document.querySelector<HTMLSelectElement>('#nc-sekte');
      if (sekteSelect) sekteSelect.disabled = true;
      const sekteFields = document.querySelector<HTMLFieldSetElement>('#nc-neue-sekte');
      if (sekteFields) sekteFields.hidden = true;
      return;
    }
    populateSekteSelect(isNew ? '' : value);
  });

  document.querySelector<HTMLSelectElement>('#nc-sekte')?.addEventListener('change', (e) => {
    const isNew = (e.target as HTMLSelectElement).value === '__neu__';
    const fields = document.querySelector<HTMLFieldSetElement>('#nc-neue-sekte');
    const nameInput = document.querySelector<HTMLInputElement>('#nc-sekte-name');
    if (fields) fields.hidden = !isNew;
    if (nameInput) nameInput.required = isNew;
  });

  document.querySelector<HTMLFormElement>('#new-character-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector<HTMLInputElement>('#nc-name')!.value.trim();
    const spezies = document.querySelector<HTMLSelectElement>('#nc-spezies')!.value.trim();
    const herkunftAuswahl = document.querySelector<HTMLSelectElement>('#nc-herkunft')!.value;
    if (!name || !spezies || !herkunftAuswahl) return;
    const herkunftOrt = herkunftAuswahl === '__neu__'
      ? createOrt({
          name: document.querySelector<HTMLInputElement>('#nc-ort-name')!.value.trim(),
          welt: document.querySelector<HTMLSelectElement>('#nc-ort-welt')!.value as Welt || undefined,
          region: document.querySelector<HTMLInputElement>('#nc-ort-region')!.value.trim() || undefined,
          siedlungsgroesse: document.querySelector<HTMLSelectElement>('#nc-ort-siedlung')!.value as Siedlungsgroesse || undefined,
          hauptspezies: undefined,
          etablierteMinderheiten: [],
          handelsstufe: document.querySelector<HTMLSelectElement>('#nc-ort-handel')!.value as Handelsstufe || undefined,
          herstellungsort: document.querySelector<HTMLSelectElement>('#nc-ort-herstellung')!.value as Herstellungsort || undefined,
          haendler: [],
          lokaleProduktion: [],
        })
      : VORDEFINIERTE_ORTE.find((ort) => ort.id === herkunftAuswahl);
    if (!herkunftOrt) return;
    const religionAuswahl = document.querySelector<HTMLSelectElement>('#nc-religion')!.value;
    let religionName: string | undefined;
    let religionId: string | undefined;
    if (religionAuswahl === '__neu__') {
      const relName = document.querySelector<HTMLInputElement>('#nc-religion-name')!.value.trim();
      if (relName) {
        const religion = addReligion(relName, document.querySelector<HTMLInputElement>('#nc-religion-volk')!.value.trim() || undefined);
        religionName = religion.name;
        religionId = religion.id;
      }
    } else if (religionAuswahl) {
      const religion = getReligionen().find((r) => r.id === religionAuswahl);
      religionName = religion?.name;
      religionId = religion?.id;
    }
    const sekteAuswahl = document.querySelector<HTMLSelectElement>('#nc-sekte')!.value;
    let sekteName: string | undefined;
    if (sekteAuswahl === '__neu__') {
      const sName = document.querySelector<HTMLInputElement>('#nc-sekte-name')!.value.trim();
      if (sName && religionId) sekteName = addSekte(religionId, sName);
    } else if (sekteAuswahl) {
      sekteName = sekteAuswahl;
    }
    const header: Partial<Omit<CharacterHeader, 'name'>> = {
      spezies,
      herkunftOrtId: herkunftOrt.id,
      herkunftSnapshot: {
        name: herkunftOrt.name, region: herkunftOrt.region ?? '', welt: herkunftOrt.welt,
      },
      beruf: document.querySelector<HTMLInputElement>('#nc-beruf')!.value.trim() || undefined,
      alter: document.querySelector<HTMLInputElement>('#nc-alter')!.value.trim() || undefined,
      geburtstag: document.querySelector<HTMLInputElement>('#nc-geburtstag')!.value.trim() || undefined,
      familie: document.querySelector<HTMLInputElement>('#nc-familie')!.value.trim() || undefined,
      religion: religionName ? combineReligionSekte(religionName, sekteName) : undefined,
    };
    const startbudget = (document.querySelector<HTMLInputElement>('input[name="nc-startbudget"]:checked')!.value) as StartbudgetPreset;
    currentCharacter = createCharacter(name, header, startbudget);
    setLastActiveCharacterId(currentCharacter.id);
    showNewCharacterForm = false;
    headerSectionOpen = false;
    render();
  });

  document.querySelector('#delete-character')?.addEventListener('click', () => {
    confirmingDelete = true;
    render();
  });

  document.querySelector('#delete-cancel')?.addEventListener('click', () => {
    confirmingDelete = false;
    render();
  });

  document.querySelector('#delete-confirm')?.addEventListener('click', () => {
    if (!currentCharacter) return;
    deleteCharacter(currentCharacter.id);
    currentCharacter = null;
    setLastActiveCharacterId(null);
    confirmingDelete = false;
    render();
  });

  document.querySelectorAll<HTMLButtonElement>('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab as Tab;
      render();
    });
  });

  if (currentCharacter) {
    const headerContainer = document.querySelector<HTMLDivElement>('#charakterheader')!;
    renderCharakterheader(headerContainer, currentCharacter, handleHeaderChange);
    document.querySelector<HTMLDetailsElement>('#charakterheader-details')?.addEventListener('toggle', (e) => {
      headerSectionOpen = (e.target as HTMLDetailsElement).open;
    });
  }

  if (sheet && currentCharacter) {
    const viewContainer = document.querySelector<HTMLDivElement>('#view-container')!;
    if (activeTab === 'Charakterbogen') {
      renderCharakterbogen(viewContainer, sheet, currentCharacter);
    } else if (activeTab === 'Ausrüstung') {
      renderAusruestungView(viewContainer, sheet, currentCharacter, {
        onBuyPreisliste: handleBuyPreisliste,
        onBuyArtefakt: handleBuyArtefakt,
        onEquipRuestung: handleEquipRuestung,
        onEquipRuestungAlleTz: handleEquipRuestungAlleTz,
        onUnequipRuestung: handleUnequipRuestung,
        onBuyShield: handleBuyShield,
        onBuyWeapon: handleBuyWeapon,
        onBuyFernkampfwaffe: handleBuyFernkampfwaffe,
        onBuyFeuerwaffe: handleBuyFeuerwaffe,
        onBuyFeuerwaffenMunition: handleBuyFeuerwaffenMunition,
        onBuyMunition: handleBuyMunition,
        onBuyAlchemika: handleBuyAlchemika,
        onRemoveEquipment: handleRemoveEquipment,
      });
    } else if (activeTab in AUSWAHL_TABS) {
      renderAuswahlView(viewContainer, sheet, activeTab, AUSWAHL_TABS[activeTab]!, handleToggle, currentCharacter.religion);
    } else if (activeTab === 'Kampf') {
      renderKampfView(
        viewContainer, sheet, currentCharacter, handleWaffenPoolChange,
        handleAddWaffenLoadout, handleRemoveWaffenLoadout, handleToggleWaffenLoadoutFavorite,
      );
    } else if (activeTab === 'KI') {
      renderKiView(viewContainer, sheet, handleValueChange, currentCharacter.grundfertigkeitAuswahl, handleGrundfertigkeitPick);
    } else if (activeTab === 'Spruchmagie') {
      renderSpruchmagieView(viewContainer, sheet, handleValueChange);
    } else if (activeTab === 'Psi') {
      renderPsiView(viewContainer, sheet, handleValueChange);
    } else if (activeTab === 'Geweihte') {
      renderGeweihteView(viewContainer, sheet, currentCharacter);
    } else {
      renderCategoryView(viewContainer, sheet, activeTab, handleValueChange, handlePoolChange, characterValues);
    }
  }
}

initTooltips();
render();
