import { describe, expect, it, vi } from 'vitest';
import { computeSheet, makeValueSource } from '../engine/characterSheet';
import { createCharacter } from '../state/characterStore';
import { renderCategoryRouteView, renderCategoryView } from './categoryView';

describe('Charakterwerte-Routenansicht', () => {
  it.each(['Nahkampf', 'Fernkampf'])('behält in %s mit und ohne Spezialisierungen sechs Tabellenspalten', (kategorie) => {
    const character = createCharacter('Tabellenprüfung');
    const container = document.createElement('div');
    const rules = computeSheet(character).byKategorie[kategorie];
    for (const wert of [0, 2]) {
      for (const row of rules) {
        if (row.rule.art === 'Wert') character.values[row.rule.referenz] = wert;
      }
      renderCategoryView(container, computeSheet(character), kategorie, vi.fn(), vi.fn());
      const table = container.querySelector<HTMLTableElement>('.waffen-basis-table')!;
      expect(table.querySelectorAll('thead th')).toHaveLength(6);
      let remaining = Array<number>(6).fill(0);
      for (const row of table.querySelectorAll('tbody tr')) {
        let column = 0;
        for (const cell of row.querySelectorAll('td')) {
          while (remaining[column] > 0) column++;
          for (let offset = 0; offset < Number(cell.getAttribute('colspan') ?? 1); offset++) {
            expect(column).toBeLessThan(6);
            expect(remaining[column]).toBe(0);
            remaining[column++] = Number(cell.getAttribute('rowspan') ?? 1);
          }
        }
        expect(remaining.every((span) => span > 0)).toBe(true);
        remaining = remaining.map((span) => span - 1);
      }
      expect(remaining).toEqual([0, 0, 0, 0, 0, 0]);
    }
  });

  it('zeigt Krankheitsresistenz erst nach Wahl des freischaltenden Vorteils', () => {
    const character = createCharacter('Test');
    const container = document.createElement('div');
    renderCategoryView(container, computeSheet(character), 'Grundfertigkeit', vi.fn(), vi.fn());
    expect(container.querySelector('[data-referenz="gr_krankheitsresistenz"]')).toBeNull();

    character.selections.vn_gf_krankheitsresistenz = 1;
    renderCategoryView(container, computeSheet(character), 'Grundfertigkeit', vi.fn(), vi.fn());
    expect(container.querySelector('[data-referenz="gr_krankheitsresistenz"]')).not.toBeNull();
  });

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
    expect([...container.querySelectorAll('.ssk-people-group > h3')].map((heading) => heading.textContent))
      .toEqual(['Dalkini', 'Draw', 'Elfen', 'Gnome', 'Goblins', 'Indianer', 'Katzen', 'Orks', 'Trolle', 'Zentauren', 'Zwerge']);
    expect(container.querySelectorAll('.ssk-people-group .stat-row')).toHaveLength(
      computeSheet(character).byKategorie['Sprache & Kultur'].length,
    );
    const zwerge = container.querySelector('[data-ssk-volk="Zwerge"]');
    expect([...zwerge!.querySelectorAll('.stat-label')].map((label) => label.textContent))
      .toEqual(expect.arrayContaining(['Zwergische Kultur', 'Zwergisch', 'Zwergische Schrift']));
  });
});
