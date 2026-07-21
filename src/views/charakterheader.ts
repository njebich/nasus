// Charakterheader: Werte, die den Charakter AUSMACHEN (Identitaet/Flavor), getrennt von den
// Werten, die der Charakter HAT (Punktekauf-Stats in den Tabs). Immer sichtbar, editierbar.

import type { CharacterState, CharacterHeader } from '../state/characterStore';
import { VOELKER_NAMEN } from '../engine/voelker';
import {
  getReligionen, addReligion, addSekte, findReligionByName, formatReligionLabel,
  combineReligionSekte, parseReligionSekte,
} from '../state/religionStore';

export type OnHeaderChange = (updates: Partial<CharacterHeader>) => void;

type EditableTextHeaderKey = Exclude<keyof CharacterHeader, 'name' | 'spezies' | 'herkunftOrtId' | 'herkunftSnapshot' | 'religion'>;

const FIELDS: Array<{ key: EditableTextHeaderKey; label: string; required?: boolean }> = [
  { key: 'beruf', label: 'Beruf' },
  { key: 'alter', label: 'Alter' },
  { key: 'geburtstag', label: 'Geburtstag' },
  { key: 'familie', label: 'Familie' },
  { key: 'groesse', label: 'Größe' },
  { key: 'gewicht', label: 'Gewicht' },
  { key: 'haarfarbe', label: 'Haarfarbe' },
  { key: 'haarschnitt', label: 'Haarschnitt' },
  { key: 'bartwuchs', label: 'Bartwuchs' },
  { key: 'hautfarbe', label: 'Hautfarbe' },
  { key: 'augenfarbe', label: 'Augenfarbe' },
];

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderSpeziesFeld(character: CharacterState): string {
  return `
    <label class="charakterheader-field">
      <span>Spezies *</span>
      <select data-field="spezies">
        <option value="">-- wählen --</option>
        ${VOELKER_NAMEN.map((name) => `<option value="${escapeHtml(name)}" ${name === character.spezies ? 'selected' : ''}>${escapeHtml(name)}</option>`).join('')}
      </select>
    </label>`;
}

function renderHerkunft(character: CharacterState): string {
  const snapshot = character.herkunftSnapshot;
  const text = snapshot ? [snapshot.name, snapshot.region, snapshot.welt].filter(Boolean).join(', ') : '– nicht gewählt –';
  return `
    <label class="charakterheader-field">
      <span>Herkunft</span>
      <output>${escapeHtml(text)}</output>
    </label>`;
}

function renderReligionSekteFeld(character: CharacterState): string {
  const religionen = getReligionen();
  const { religionName, sekteName } = character.religion ? parseReligionSekte(character.religion) : { religionName: '', sekteName: undefined };
  const aktuelleReligion = religionName ? findReligionByName(religionName) : undefined;
  const religionUnbekannt = !!religionName && !aktuelleReligion;
  const sekten = aktuelleReligion?.sekten ?? [];
  const sekteUnbekannt = !!sekteName && !sekten.some((s) => s.toLowerCase() === sekteName.toLowerCase());

  return `
    <label class="charakterheader-field">
      <span>Religion</span>
      <select id="ch-religion-select" title="${escapeHtml(aktuelleReligion?.volk ?? '')}">
        <option value="">-- keine --</option>
        ${religionen.map((r) => `<option value="${r.id}" title="${escapeHtml(r.volk ?? '')}" ${aktuelleReligion?.id === r.id ? 'selected' : ''}>${escapeHtml(formatReligionLabel(r))}</option>`).join('')}
        ${religionUnbekannt ? `<option value="__legacy__" selected>${escapeHtml(religionName)}</option>` : ''}
        <option value="__neu__">+ Neue Religion</option>
      </select>
    </label>
    <div class="charakterheader-neu" id="ch-religion-neu" hidden>
      <input type="text" id="ch-religion-name" placeholder="Name der Religion" />
      <input type="text" id="ch-religion-volk" placeholder="Volk (optional)" />
      <button type="button" id="ch-religion-neu-ok">Übernehmen</button>
    </div>
    <label class="charakterheader-field">
      <span>Sekte</span>
      <select id="ch-sekte-select" ${aktuelleReligion ? '' : 'disabled'}>
        <option value="">-- keine --</option>
        ${sekten.map((s) => `<option value="${escapeHtml(s)}" ${sekteName === s ? 'selected' : ''}>${escapeHtml(s)}</option>`).join('')}
        ${sekteUnbekannt ? `<option value="__legacy__" selected>${escapeHtml(sekteName!)}</option>` : ''}
        ${aktuelleReligion ? '<option value="__neu__">+ Neue Sekte</option>' : ''}
      </select>
    </label>
    <div class="charakterheader-neu" id="ch-sekte-neu" hidden>
      <input type="text" id="ch-sekte-name" placeholder="Name der Sekte" />
      <button type="button" id="ch-sekte-neu-ok">Übernehmen</button>
    </div>`;
}

export function renderCharakterheader(container: HTMLElement, character: CharacterState, onChange: OnHeaderChange): void {
  container.innerHTML = `
    <div class="charakterheader">
      ${renderSpeziesFeld(character)}
      ${renderHerkunft(character)}
      ${FIELDS.map((f) => `
        <label class="charakterheader-field">
          <span>${f.label}${f.required ? ' *' : ''}</span>
          <input type="text" data-field="${f.key}" value="${escapeHtml(character[f.key] ?? '')}" />
        </label>
      `).join('')}
      ${renderReligionSekteFeld(character)}
    </div>`;

  container.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input[data-field], select[data-field]').forEach((input) => {
    input.addEventListener('change', () => {
      const field = input.dataset.field as keyof CharacterHeader;
      onChange({ [field]: input.value } as Partial<CharacterHeader>);
    });
  });

  const religionSelect = container.querySelector<HTMLSelectElement>('#ch-religion-select');
  const religionNeu = container.querySelector<HTMLDivElement>('#ch-religion-neu');
  const aktuelleReligionId = religionSelect?.value ?? '';

  religionSelect?.addEventListener('change', () => {
    const value = religionSelect.value;
    if (value === '__neu__') {
      if (religionNeu) religionNeu.hidden = false;
      return;
    }
    const religion = getReligionen().find((r) => r.id === value);
    onChange({ religion: religion ? combineReligionSekte(religion.name) : undefined });
  });

  container.querySelector('#ch-religion-neu-ok')?.addEventListener('click', () => {
    const name = container.querySelector<HTMLInputElement>('#ch-religion-name')?.value.trim();
    if (!name) return;
    const volk = container.querySelector<HTMLInputElement>('#ch-religion-volk')?.value.trim();
    const religion = addReligion(name, volk || undefined);
    onChange({ religion: combineReligionSekte(religion.name) });
  });

  const sekteSelect = container.querySelector<HTMLSelectElement>('#ch-sekte-select');
  const sekteNeu = container.querySelector<HTMLDivElement>('#ch-sekte-neu');

  sekteSelect?.addEventListener('change', () => {
    const value = sekteSelect.value;
    if (value === '__neu__') {
      if (sekteNeu) sekteNeu.hidden = false;
      return;
    }
    const religion = getReligionen().find((r) => r.id === aktuelleReligionId);
    if (!religion) return;
    onChange({ religion: combineReligionSekte(religion.name, value || undefined) });
  });

  container.querySelector('#ch-sekte-neu-ok')?.addEventListener('click', () => {
    const name = container.querySelector<HTMLInputElement>('#ch-sekte-name')?.value.trim();
    if (!name || !aktuelleReligionId || aktuelleReligionId === '__neu__' || aktuelleReligionId === '__legacy__') return;
    const religion = getReligionen().find((r) => r.id === aktuelleReligionId);
    if (!religion) return;
    addSekte(aktuelleReligionId, name);
    onChange({ religion: combineReligionSekte(religion.name, name) });
  });
}
