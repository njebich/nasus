import {
  loadCharacter, createCharacter, deleteCharacter, setLastActiveCharacterId,
  type CharakterTyp, type CharacterHeader, type StartbudgetPreset,
} from '../state/characterStore';
import {
  VORDEFINIERTE_ORTE, WELTEN, SIEDLUNGSGROESSEN, HANDELSSTUFEN, HERSTELLUNGSORTE,
  createOrt, formatOrtKurz, type Welt, type Siedlungsgroesse, type Handelsstufe, type Herstellungsort,
} from '../data/orte';
import { getReligionen, addReligion, addSekte, formatReligionLabel, combineReligionSekte } from '../state/religionStore';
import { VOELKER_NAMEN } from '../engine/voelker';
import { DEFAULT_NAVIGATION } from '../navigation';
import type { AppState } from '../state/appState';

export function renderNewCharacterForm(newCharacterBestehend: boolean): string {
  return `
    <form id="new-character-form" class="new-character-form">
      ${newCharacterBestehend ? '<p class="new-character-hinweis">Bestehenden Charakter erstellen: alle Verfügbarkeit-Kaufsperren sind deaktiviert (z.B. für vom Meister vergebene Gegenstände).</p>' : ''}
      <label>Name * <input type="text" id="nc-name" required autofocus /></label>
      <fieldset>
        <legend>Charaktertyp</legend>
        <label><input type="radio" name="nc-charaktertyp" value="SC" checked /> Spielercharakter (SC)</label>
        <label><input type="radio" name="nc-charaktertyp" value="NSC" /> Nichtspielercharakter (NSC)</label>
      </fieldset>
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
        <label><input type="radio" name="nc-startbudget" value="normal" checked /> Normal (Stufe 0, 6400 SP, 5000D)</label>
        <label><input type="radio" name="nc-startbudget" value="gehoben" /> Gehoben (Stufe 15, 8000 SP, 6000D)</label>
      </fieldset>
      <div class="new-character-form-actions">
        <button type="submit">Anlegen</button>
        <button type="button" id="new-character-cancel">Abbrechen</button>
      </div>
    </form>`;
}

/** Wire-up für Charakter-CRUD (Auswahl/Neu/Löschen) + das "Neuer Charakter"-Formular: läuft nach
 *  jedem render() auf dem frisch gesetzten innerHTML, wie alle anderen View-Wire-ups auch. */
export function wireCharacterLifecycleEvents(appState: AppState, render: () => void): void {
  document.querySelector<HTMLSelectElement>('#character-select')?.addEventListener('change', (e) => {
    const id = (e.target as HTMLSelectElement).value;
    appState.currentCharacter = id ? loadCharacter(id) : null;
    setLastActiveCharacterId(id || null);
    appState.navigationState = { ...DEFAULT_NAVIGATION };
    appState.errorMessage = '';
    appState.confirmingDelete = false;
    render();
  });

  document.querySelector('#new-character')?.addEventListener('click', () => {
    appState.showNewCharacterForm = true;
    appState.newCharacterBestehend = false;
    render();
  });

  document.querySelector('#new-character-bestehend')?.addEventListener('click', () => {
    appState.showNewCharacterForm = true;
    appState.newCharacterBestehend = true;
    render();
  });

  document.querySelector('#new-character-cancel')?.addEventListener('click', () => {
    appState.showNewCharacterForm = false;
    appState.newCharacterBestehend = false;
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
    const charakterTyp = document.querySelector<HTMLInputElement>('input[name="nc-charaktertyp"]:checked')!.value as CharakterTyp;
    appState.currentCharacter = createCharacter(name, header, startbudget, appState.newCharacterBestehend, charakterTyp);
    setLastActiveCharacterId(appState.currentCharacter.id);
    appState.navigationState = { ...DEFAULT_NAVIGATION };
    appState.showNewCharacterForm = false;
    appState.newCharacterBestehend = false;
    render();
  });

  document.querySelector('#delete-character')?.addEventListener('click', () => {
    appState.confirmingDelete = true;
    render();
  });

  document.querySelector('#delete-cancel')?.addEventListener('click', () => {
    appState.confirmingDelete = false;
    render();
  });

  document.querySelector('#delete-confirm')?.addEventListener('click', () => {
    if (!appState.currentCharacter) return;
    deleteCharacter(appState.currentCharacter.id);
    appState.currentCharacter = null;
    setLastActiveCharacterId(null);
    appState.confirmingDelete = false;
    render();
  });
}
