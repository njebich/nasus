// Charakterheader: Werte, die den Charakter AUSMACHEN (Identitaet/Flavor), getrennt von den
// Werten, die der Charakter HAT (Punktekauf-Stats in den Tabs). Immer sichtbar, editierbar.

import type { CharacterState, CharacterHeader } from '../state/characterStore';
import { VOELKER_NAMEN } from '../engine/voelker';

export type OnHeaderChange = (updates: Partial<CharacterHeader>) => void;

type EditableTextHeaderKey = Exclude<keyof CharacterHeader, 'name' | 'spezies' | 'herkunftOrtId' | 'herkunftSnapshot'>;

const FIELDS: Array<{ key: EditableTextHeaderKey; label: string; required?: boolean }> = [
  { key: 'beruf', label: 'Beruf' },
  { key: 'alter', label: 'Alter' },
  { key: 'geburtstag', label: 'Geburtstag' },
  { key: 'familie', label: 'Familie' },
  { key: 'religion', label: 'Religion' },
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
    </div>`;

  container.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input[data-field], select[data-field]').forEach((input) => {
    input.addEventListener('change', () => {
      const field = input.dataset.field as keyof CharacterHeader;
      onChange({ [field]: input.value } as Partial<CharacterHeader>);
    });
  });
}
