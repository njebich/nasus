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

  // Nutzer-Ask 2026-08-06: religionsabhaengige Geweihte-Talente ausblenden statt nur zu sperren.
  describe('Geweihte-Talente: religionsabhaengige Zeilen ausblenden', () => {
    it('blendet alle 35 Geweihter-Stufen aus, wenn keine Religion gewaehlt ist', () => {
      const sheet = computeSheet(createCharacter('KeineReligion', undefined, undefined, true));
      renderAuswahlView(container, sheet, 'Talente', true, vi.fn(), undefined);

      expect(container.querySelector('[data-referenz="talente_geweihter_lloth_stufe_1_orthodox"]')).toBeNull();
      expect(container.querySelector('[data-referenz="talente_geweihter_isch_stufe_7_orthodox"]')).toBeNull();
      // "Gute Wunder" ist NICHT religionsabhaengig und bleibt sichtbar.
      expect(container.querySelector('[data-referenz="talente_geweihte_gute_wunder_stufe_1"]')).not.toBeNull();
    });

    it('zeigt nur die Stufenkette der gewaehlten Religion, blendet alle anderen Religionen aus', () => {
      const character = createCharacter('LlothReligion', { religion: 'Lloth, Orthodox' }, undefined, true);
      const sheet = computeSheet(character);
      renderAuswahlView(container, sheet, 'Talente', true, vi.fn(), character.religion);

      expect(container.querySelector('[data-referenz="talente_geweihter_lloth_stufe_1_orthodox"]')).not.toBeNull();
      expect(container.querySelector('[data-referenz="talente_geweihter_lloth_stufe_7_orthodox"]')).not.toBeNull();
      expect(container.querySelector('[data-referenz="talente_geweihter_khartazh_stufe_1_orthodox"]')).toBeNull();
      expect(container.querySelector('[data-referenz="talente_geweihter_isch_stufe_1_orthodox"]')).toBeNull();
    });

    it('bereits gewaehlte Stufen bleiben sichtbar, auch wenn die Header-Religion inzwischen nicht mehr passt', () => {
      const character = createCharacter('ReligionsWechsel', { religion: 'Khartazh, Orthodox' }, undefined, true);
      character.selections.talente_geweihter_lloth_stufe_1_orthodox = 1;
      const sheet = computeSheet(character);
      renderAuswahlView(container, sheet, 'Talente', true, vi.fn(), character.religion);

      const lloth1 = container.querySelector<HTMLElement>('[data-referenz="talente_geweihter_lloth_stufe_1_orthodox"]');
      expect(lloth1).not.toBeNull();
      expect(lloth1?.querySelector('input')?.checked).toBe(true);
    });
  });
});
