import { describe, expect, it, vi } from 'vitest';
import { createCharacter } from '../state/characterStore';
import { renderGrunddatenView } from './charakterheader';

describe('Charakter -> Grunddaten', () => {
  it('rendert den bisherigen Charakterheader als regulaere editierbare Ansicht', () => {
    const character = createCharacter('Test', { spezies: 'Mensch', beruf: 'Scout' });
    const onChange = vi.fn();
    const container = document.createElement('main');

    renderGrunddatenView(container, character, onChange);

    expect(container.querySelector('.grunddaten-view h2')?.textContent).toBe('Grunddaten');
    expect(container.querySelector('[data-grunddaten-editor]')).not.toBeNull();
    const beruf = container.querySelector<HTMLInputElement>('input[data-field="beruf"]');
    expect(beruf?.value).toBe('Scout');

    if (!beruf) throw new Error('Beruf-Feld fehlt');
    beruf.value = 'Kundschafter';
    beruf.dispatchEvent(new Event('change'));
    expect(onChange).toHaveBeenCalledWith({ beruf: 'Kundschafter' });
  });
});
