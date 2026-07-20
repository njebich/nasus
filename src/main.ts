import './style.css';
import {
  listCharacters, loadCharacter, createCharacter, saveCharacter, deleteCharacter,
  getLastActiveCharacterId, setLastActiveCharacterId,
  type CharacterState, type CharacterHeader, type StartbudgetPreset,
} from './state/characterStore';
import {
  setValue, addSelection, removeSelection, setPoolAllocation, updateHeader,
  buyPreislisteItem, buyArtefakt, equipRuestung, unequipRuestung, buyShield, buyWeapon,
  buyFernkampfwaffe, buyFeuerwaffe, buyMunition, buyFeuerwaffenMunition, buyAlchemika, removeEquipment, BudgetError, MutationError,
} from './state/characterMutations';
import { computeSheet } from './engine/characterSheet';
import { renderCategoryView } from './views/categoryView';
import { renderAuswahlView } from './views/talenteVornachteile';
import { renderAusruestungView } from './views/ausruestung';
import { renderCharakterheader } from './views/charakterheader';
import { renderCharakterbogen } from './views/charakterbogen';
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

const app = document.querySelector<HTMLDivElement>('#app')!;

const TABS = [
  'Charakterbogen',
  'Eigenschaft', 'Attribute', 'Charakterwerte', 'Grundfertigkeit', 'Sonderfertigkeit',
  'Nahkampf', 'Fernkampf', 'Kampf', 'Bewegung', 'Gewichtsbelastung', 'WHK',
  'Sprache & Kultur', 'Talente', 'Vor- und Nachteile', 'Ausrüstung',
] as const;
type Tab = (typeof TABS)[number];
const AUSWAHL_TABS: Partial<Record<Tab, boolean>> = { 'Talente': true, 'Vor- und Nachteile': false };

// Beim Start den zuletzt aktiven Charakter wiederherstellen (siehe characterStore.ts) - sonst
// faellt jeder Seiten-Reload auf die leere Auswahl zurueck, obwohl der Charakter noch da ist.
const lastActiveId = getLastActiveCharacterId();
let currentCharacter: CharacterState | null = lastActiveId ? loadCharacter(lastActiveId) : null;
if (lastActiveId && !currentCharacter) setLastActiveCharacterId(null); // Charakter wurde geloescht
let errorMessage = '';
let activeTab: Tab = 'Eigenschaft';
let showNewCharacterForm = false;
let confirmingDelete = false;

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
      <label>Religion <input type="text" id="nc-religion" /></label>
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
      ${currentCharacter ? '<div id="charakterheader"></div>' : ''}
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
          ${TABS.map((tab) => `<button type="button" class="tab-btn" data-tab="${tab}" ${activeTab === tab ? 'aria-current="page"' : ''}>${tab}</button>`).join('')}
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
      religion: document.querySelector<HTMLInputElement>('#nc-religion')!.value.trim() || undefined,
    };
    const startbudget = (document.querySelector<HTMLInputElement>('input[name="nc-startbudget"]:checked')!.value) as StartbudgetPreset;
    currentCharacter = createCharacter(name, header, startbudget);
    setLastActiveCharacterId(currentCharacter.id);
    showNewCharacterForm = false;
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
      renderAuswahlView(viewContainer, sheet, activeTab, AUSWAHL_TABS[activeTab]!, handleToggle);
    } else if (activeTab === 'Kampf') {
      // Wird gerade neu gebaut (Nutzer-Mockup "S04 Kampfseite mockup") - bis dahin bleibt der
      // Tab bewusst leer statt der alten generischen Werteliste, siehe Nutzer-Anfrage 2026-07-19.
      viewContainer.innerHTML = '';
    } else {
      renderCategoryView(viewContainer, sheet, activeTab, handleValueChange, handlePoolChange);
    }
  }
}

render();
