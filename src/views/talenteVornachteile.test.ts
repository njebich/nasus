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

  it('zeigt den SC-Pflichtvorteil gewählt und gesperrt, bei NSC dagegen gar nicht', () => {
    const sc = createCharacter('Spielercharakter');
    renderAuswahlView(container, computeSheet(sc), 'Vor- und Nachteile', false, vi.fn(), sc.religion, sc.charakterTyp);
    const scRow = container.querySelector<HTMLElement>('[data-referenz="vn_kind_der_froehlichkeit"]');
    expect(scRow).not.toBeNull();
    expect(scRow?.querySelector('input')?.checked).toBe(true);
    expect(scRow?.querySelector('input')?.disabled).toBe(true);

    const nsc = createCharacter('Nichtspielercharakter', undefined, undefined, false, 'NSC');
    renderAuswahlView(container, computeSheet(nsc), 'Vor- und Nachteile', false, vi.fn(), nsc.religion, nsc.charakterTyp);
    expect(container.querySelector('[data-referenz="vn_kind_der_froehlichkeit"]')).toBeNull();
  });

  it('zeigt bei jedem Vor-/Nachteil einen Tooltip und ein Info-Icon, auch ohne Wirkungstext', () => {
    const character = createCharacter('Tooltiptest');
    renderAuswahlView(
      container,
      computeSheet(character),
      'Vor- und Nachteile',
      false,
      vi.fn(),
      character.religion,
      character.charakterTyp,
    );

    const ohneWirkung = container.querySelector<HTMLElement>(
      '[data-referenz="vn_aussehen_normal"]',
    )!;
    expect(ohneWirkung.dataset.tooltip).toBe('Neutrale Aussehensstufe.');
    expect(ohneWirkung.querySelector<HTMLElement>('.stat-info-icon')?.dataset.tooltip).toBe(
      ohneWirkung.dataset.tooltip,
    );

    const mitWirkung = container.querySelector<HTMLElement>(
      '[data-referenz="vn_anfaelligkeit_gegen_beherrschung_1"]',
    )!;
    expect(mitWirkung.dataset.tooltip).toContain('SP × 1,5');
    expect(mitWirkung.querySelector('.stat-info-icon')).not.toBeNull();
  });

  it('blendet Meister-Auswahlen für SC aus und zeigt sie NSC', () => {
    const sc = createCharacter('SC');
    renderAuswahlView(container, computeSheet(sc), 'Vor- und Nachteile', false, vi.fn(), sc.religion, sc.charakterTyp);
    expect(container.querySelector('[data-referenz="vn_resistenz_gegen_magie"]')).toBeNull();

    const nsc = createCharacter('NSC', undefined, undefined, false, 'NSC');
    renderAuswahlView(container, computeSheet(nsc), 'Vor- und Nachteile', false, vi.fn(), nsc.religion, nsc.charakterTyp);
    expect(container.querySelector('[data-referenz="vn_resistenz_gegen_magie"]')).not.toBeNull();
  });

  it('zeigt nicht erfüllte Vorteils-Voraussetzungen gesperrt an', () => {
    const character = createCharacter('Voraussetzung');
    renderAuswahlView(container, computeSheet(character), 'Vor- und Nachteile', false, vi.fn(), character.religion, character.charakterTyp);
    const row = container.querySelector<HTMLElement>('[data-referenz="vn_aura_verhuellen_ii"]')!;
    expect(row.classList.contains('auswahl-row-locked')).toBe(true);
    expect(row.querySelector('input')?.disabled).toBe(true);
    expect(row.title).toContain('Aura verhüllen I');
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

  it('zeigt bei gekauften Talenten die Wirkung direkt und koppelt nur die untere Zeile an den Namen', () => {
    const character = createCharacter('Talenttest', undefined, 'gehoben');
    character.selections.talente_zaeher_bursche_stufe_1 = 1;
    const onToggle = vi.fn();
    renderAuswahlView(container, computeSheet(character), 'Talente', true, onToggle);

    const gekauft = container.querySelector<HTMLElement>(
      '.gekauft-group [data-referenz="talente_zaeher_bursche_stufe_1"]',
    )!;
    expect(gekauft.tagName).toBe('DIV');
    expect(gekauft.querySelector('.gekauft-wirkung')?.textContent).toContain('Wirkung:');

    gekauft.querySelector<HTMLElement>('.stat-label')!.click();
    expect(onToggle).not.toHaveBeenCalled();

    const untereZeile = [...container.querySelectorAll<HTMLElement>(
      '[data-referenz="talente_zaeher_bursche_stufe_1"]',
    )].find((row) => !row.closest('.gekauft-group'))!;
    untereZeile.querySelector<HTMLElement>('.stat-label')!.click();
    expect(onToggle).toHaveBeenCalledWith('talente_zaeher_bursche_stufe_1', false);
  });

  it('zeigt bei gekauften Vor-/Nachteilen den Text direkt und lässt nur über den Haken abwählen', () => {
    const character = createCharacter('Vorteilstest', undefined, 'gehoben');
    character.selections.vn_anfaelligkeit_gegen_beherrschung_1 = 1;
    const onToggle = vi.fn();
    renderAuswahlView(
      container,
      computeSheet(character),
      'Vor- und Nachteile',
      false,
      onToggle,
      character.religion,
      character.charakterTyp,
    );

    const gekauft = container.querySelector<HTMLElement>(
      '.gekauft-group [data-referenz="vn_anfaelligkeit_gegen_beherrschung_1"]',
    )!;
    expect(gekauft.tagName).toBe('DIV');
    expect(gekauft.querySelector('.gekauft-wirkung')?.textContent).toContain('Wirkung:');

    gekauft.querySelector<HTMLElement>('.stat-label')!.click();
    expect(onToggle).not.toHaveBeenCalled();

    gekauft.querySelector<HTMLInputElement>('.auswahl-checkbox')!.click();
    expect(onToggle).toHaveBeenCalledWith('vn_anfaelligkeit_gegen_beherrschung_1', false);
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
