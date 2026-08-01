// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computeSheet } from '../engine/characterSheet';
import { createCharacter } from '../state/characterStore';
import { renderAusruestungView, type AusruestungCallbacks, type KaufKategorie } from './ausruestung';

function callbacks(): AusruestungCallbacks {
  return {
    onBuyPreisliste: vi.fn(), onBuyArtefakt: vi.fn(), onEquipRuestung: vi.fn(),
    onEquipRuestungAlleTz: vi.fn(), onUnequipRuestung: vi.fn(), onBuyShield: vi.fn(),
    onBuyWeapon: vi.fn(), onBuyFernkampfwaffe: vi.fn(), onBuyFeuerwaffe: vi.fn(),
    onBuyFeuerwaffenMunition: vi.fn(), onBuyMunition: vi.fn(), onBuyAlchemika: vi.fn(),
    onRemoveEquipment: vi.fn(),
  };
}

describe('getrennte Ausrüstungs-Arbeitsansichten', () => {
  let container: HTMLDivElement;
  const character = createCharacter('Kauftest', undefined, undefined, true);
  const sheet = computeSheet(character);

  beforeEach(() => {
    document.body.innerHTML = '<div id="view"></div>';
    container = document.querySelector<HTMLDivElement>('#view')!;
  });

  it('rendert jede der genau neun Kaufkategorien einzeln', () => {
    const categories: KaufKategorie[] = [
      'Rüstung', 'Schilde', 'Waffen', 'Bögen', 'Armbrüste',
      'Feuerwaffen', 'Alchemika', 'Preisliste', 'Artefakte',
    ];
    for (const category of categories) {
      renderAusruestungView(container, sheet, character, callbacks(), category);
      expect(container.querySelector('h2')?.textContent).toBe(category);
      expect(container.querySelectorAll('.ausruestung-tab-view')).toHaveLength(1);
    }
  });

  it('belässt Pfeile, Bolzen und Feuerwaffenmunition in ihren festgelegten Kategorien', () => {
    renderAusruestungView(container, sheet, character, callbacks(), 'Bögen');
    expect(container.querySelector('[data-munition-gruppe="pfeile"]')).not.toBeNull();
    expect(container.querySelector('[data-munition-gruppe="bolzen"]')).toBeNull();

    renderAusruestungView(container, sheet, character, callbacks(), 'Armbrüste');
    expect(container.querySelector('[data-munition-gruppe="bolzen"]')).not.toBeNull();
    expect(container.querySelector('[data-munition-gruppe="pfeile"]')).toBeNull();

    renderAusruestungView(container, sheet, character, callbacks(), 'Feuerwaffen');
    expect(container.querySelector('.ausruestung-buy-feuerwaffen-munition')).not.toBeNull();
  });

  it('bindet den bisherigen Kaufvorgang im zuständigen Untertab', () => {
    const cb = callbacks();
    renderAusruestungView(container, sheet, character, cb, 'Preisliste');
    container.querySelector<HTMLButtonElement>('.ausruestung-buy')!.click();
    expect(cb.onBuyPreisliste).toHaveBeenCalledOnce();
  });

  it('rendert je Artefaktgrad die berechnete Wirkung sowie ED und WD im Tooltip', () => {
    renderAusruestungView(container, sheet, character, callbacks(), 'Artefakte');
    const licht = [...container.querySelectorAll<HTMLElement>('.artefakt-card')]
      .find((card) => card.querySelector('summary')?.textContent === 'Licht');
    const grade = licht?.querySelectorAll<HTMLElement>('.artefakt-grad-row');

    expect(grade).toHaveLength(7);
    expect(grade?.[0].dataset.tooltip).toContain('Wirkungswert: 5 Fackeln');
    expect(grade?.[0].dataset.tooltip).toContain('ED: sofort');
    expect(grade?.[0].dataset.tooltip).toContain('WD: 5 min');
    expect(grade?.[6].dataset.tooltip).toContain('Wirkungswert: 40 Fackeln');
    expect(grade?.[0].dataset.tooltip).not.toBe(grade?.[6].dataset.tooltip);
  });

  it('bietet Entfernen nur in der zuständigen Arbeitskategorie an', () => {
    const ownedCharacter = {
      ...character,
      equipment: [{
        id: 'pfeil-1', family: 'ammo' as const, baseTable: 'pfeile', baseId: 'alt',
        selections: {}, quantity: 3, computedPriceSnapshot: 1,
      }],
    };
    const cb = callbacks();
    renderAusruestungView(container, sheet, ownedCharacter, cb, 'Bögen');
    const remove = container.querySelector<HTMLButtonElement>('.inventar-remove');
    expect(remove).not.toBeNull();
    remove!.click();
    expect(cb.onRemoveEquipment).toHaveBeenCalledWith('pfeil-1');

    renderAusruestungView(container, sheet, ownedCharacter, callbacks(), 'Armbrüste');
    expect(container.querySelector('.inventar-remove')).toBeNull();
  });

  it('laesst eine geoeffnete Kategorie auch nach einem Kauf-Neurender offen', () => {
    const cb = callbacks();
    cb.onBuyAlchemika = vi.fn(() => {
      renderAusruestungView(container, sheet, character, cb, 'Alchemika');
    });
    renderAusruestungView(container, sheet, character, cb, 'Alchemika');

    const details = container.querySelector<HTMLDetailsElement>('[data-alchemika-kategorie]')!;
    const kategorie = details.dataset.alchemikaKategorie!;
    details.open = true;
    details.querySelector<HTMLButtonElement>('.ausruestung-buy-alchemika')!.click();

    expect(container.querySelector<HTMLDetailsElement>(`[data-alchemika-kategorie="${kategorie}"]`)?.open).toBe(true);
  });

  it('bewahrt auch geoeffnete Artefaktkarten ueber einen Kauf-Neurender', () => {
    const cb = callbacks();
    cb.onBuyArtefakt = vi.fn(() => {
      renderAusruestungView(container, sheet, character, cb, 'Artefakte');
    });
    renderAusruestungView(container, sheet, character, cb, 'Artefakte');

    const details = container.querySelector<HTMLDetailsElement>('[data-artefakt-referenz]')!;
    const referenz = details.dataset.artefaktReferenz!;
    details.open = true;
    details.querySelector<HTMLButtonElement>('.ausruestung-buy-artefakt')!.click();

    expect(container.querySelector<HTMLDetailsElement>(`[data-artefakt-referenz="${referenz}"]`)?.open).toBe(true);
  });

  it('stellt die Scrollposition nach einer Inventar-Aktion wieder her', async () => {
    Object.defineProperty(window, 'scrollX', { configurable: true, value: 13 });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 777 });
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    renderAusruestungView(container, sheet, character, callbacks(), 'Preisliste');

    container.querySelector<HTMLButtonElement>('.ausruestung-buy')!.click();
    await Promise.resolve();

    expect(scrollTo).toHaveBeenCalledWith(13, 777);
  });
});
