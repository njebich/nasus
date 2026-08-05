import { describe, expect, it, vi } from 'vitest';
import { createCharacter } from '../state/characterStore';
import { renderGesinnungView } from './gesinnung';
import { GESINNUNG_TRAITS } from '../data/gesinnung';

describe('Charakter -> Gesinnung', () => {
  it('rendert Legende, alle 22 Slider und eine Warnung, solange nicht alle gesetzt sind', () => {
    const character = createCharacter('Test');
    const onChange = vi.fn();
    const onNotizChange = vi.fn();
    const container = document.createElement('main');

    renderGesinnungView(container, character, onChange, onNotizChange);

    expect(container.querySelector('#gesinnung-heading')?.textContent).toBe('Gesinnung');
    expect(container.querySelectorAll('.gesinnung-legende-liste li')).toHaveLength(8);
    expect(container.querySelectorAll('.gesinnung-slider')).toHaveLength(GESINNUNG_TRAITS.length);
    expect(container.querySelector('.error-message')?.textContent).toContain('0 von 22');
  });

  it('committet einen Slider-Wert erst beim change-Event, nicht bei input', () => {
    const character = createCharacter('Test');
    const onChange = vi.fn();
    const container = document.createElement('main');
    renderGesinnungView(container, character, onChange, vi.fn());

    const traitKey = GESINNUNG_TRAITS[0].key;
    const slider = container.querySelector<HTMLInputElement>(`.gesinnung-slider[data-trait="${traitKey}"]`);
    if (!slider) throw new Error('Slider fehlt');

    slider.value = '4';
    slider.dispatchEvent(new Event('input'));
    expect(onChange).not.toHaveBeenCalled();
    expect(container.querySelector(`[data-trait-readout="${traitKey}"]`)?.textContent).toContain('Ausgeprägt');

    slider.dispatchEvent(new Event('change'));
    expect(onChange).toHaveBeenCalledWith(traitKey, 4);
  });

  it('zeigt keine Warnung mehr und traegt Freitext-Anmerkungen, wenn alle 22 Slider gesetzt sind', () => {
    const character = createCharacter('Test');
    for (const trait of GESINNUNG_TRAITS) character.gesinnung[trait.key] = 0;
    character.gesinnungNotiz = 'Hasst Piraten.';
    const onNotizChange = vi.fn();
    const container = document.createElement('main');

    renderGesinnungView(container, character, vi.fn(), onNotizChange);

    expect(container.querySelector('.error-message')).toBeNull();
    const notiz = container.querySelector<HTMLTextAreaElement>('[data-gesinnung-notiz]');
    expect(notiz?.value).toBe('Hasst Piraten.');

    if (!notiz) throw new Error('Notiz-Feld fehlt');
    notiz.value = 'Liebt Piraten.';
    notiz.dispatchEvent(new Event('change'));
    expect(onNotizChange).toHaveBeenCalledWith('Liebt Piraten.');
  });
});
