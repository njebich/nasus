// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computeSheet } from '../engine/characterSheet';
import { createCharacter } from '../state/characterStore';
import { renderAuswahlView } from './talenteVornachteile';

describe('Talente-Auswahl', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '<div id="view"></div>';
    container = document.querySelector<HTMLDivElement>('#view')!;
  });

  it('zeigt auch nicht wählbare Talente, aber ausgegraut und deaktiviert', () => {
    const sheet = computeSheet(createCharacter('Talenttest', undefined, 'normal'));
    renderAuswahlView(container, sheet, 'Talente', true, vi.fn());

    const stufe1 = container.querySelector<HTMLElement>('[data-referenz="talente_zaeher_bursche_stufe_1"]')!;
    const stufe2 = container.querySelector<HTMLElement>('[data-referenz="talente_zaeher_bursche_stufe_2"]')!;
    expect(stufe1.querySelector('input')?.disabled).toBe(false);
    expect(stufe2).not.toBeNull();
    expect(stufe2.classList.contains('auswahl-row-locked')).toBe(true);
    expect(stufe2.querySelector('input')?.disabled).toBe(true);
    expect(container.querySelector('#auswahl-nur-kaufbare')).toBeNull();
  });

  it('zeigt unter Gekauft nur die höchste Stufe einer Talentreihe', () => {
    const character = createCharacter('Talenttest', undefined, 'gehoben');
    character.selections.talente_zaeher_bursche_stufe_1 = 1;
    character.selections.talente_zaeher_bursche_stufe_2 = 1;
    const sheet = computeSheet(character);
    renderAuswahlView(container, sheet, 'Talente', true, vi.fn());

    const gekauft = container.querySelector<HTMLElement>('.gekauft-group')!;
    expect(gekauft.querySelector('[data-referenz="talente_zaeher_bursche_stufe_1"]')).toBeNull();
    expect(gekauft.querySelector('[data-referenz="talente_zaeher_bursche_stufe_2"]')).not.toBeNull();
    expect(gekauft.querySelector('.stat-group-count')?.textContent).toBe('(1)');
  });
});
