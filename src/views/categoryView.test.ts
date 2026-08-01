import { describe, expect, it, vi } from 'vitest';
import { computeSheet, makeValueSource } from '../engine/characterSheet';
import { createCharacter } from '../state/characterStore';
import { renderCategoryRouteView } from './categoryView';

describe('Charakterwerte-Routenansicht', () => {
  it('integriert Bewegung und Gewichtsbelastung vollständig in Berechnete Werte', () => {
    const character = createCharacter('Test');
    const container = document.createElement('div');

    renderCategoryRouteView(
      container,
      computeSheet(character),
      'Berechnete Werte',
      ['Charakterwerte', 'Bewegung', 'Gewichtsbelastung'],
      vi.fn(),
      vi.fn(),
      makeValueSource(character),
    );

    expect(container.querySelector('h2')?.textContent).toBe('Berechnete Werte');
    expect([...container.querySelectorAll<HTMLElement>('.category-route-section')]
      .map((section) => section.dataset.category))
      .toEqual(['Charakterwerte', 'Bewegung', 'Gewichtsbelastung']);
    expect([...container.querySelectorAll('.category-route-section-heading')]
      .map((heading) => heading.textContent))
      .toEqual(['Allgemeine berechnete Werte', 'Bewegung', 'Gewichtsbelastung']);
    expect(container.textContent).toContain('Gesamte Erfahrungspunke');
    expect(container.textContent).toContain('Sprinten');
    expect(container.textContent).toContain('Unbelastet');
    expect(container.querySelector('[data-category="Bewegung"] .stat-section-heading')).toBeNull();
    expect(container.querySelector('[data-category="Gewichtsbelastung"] .stat-section-heading')).toBeNull();
  });

  it('zeigt sichtbare Untertabnamen, ohne interne Kategorien umzubenennen', () => {
    const character = createCharacter('Test');
    const container = document.createElement('div');

    renderCategoryRouteView(
      container, computeSheet(character), 'SSK', ['Sprache & Kultur'],
      vi.fn(), vi.fn(), makeValueSource(character),
    );

    expect(container.querySelector('h2')?.textContent).toBe('SSK');
    expect(container.querySelector('.category-route-section')?.getAttribute('data-category'))
      .toBe('Sprache & Kultur');
    expect(container.querySelectorAll('.category-route-section-heading')).toHaveLength(0);
  });
});
