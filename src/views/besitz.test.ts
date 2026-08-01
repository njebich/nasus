// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { createCharacter, ruestungSlotKey, type CharacterState } from '../state/characterStore';
import { renderReadOnlyBesitzView } from './besitz';

function characterWithBesitz(): CharacterState {
  const character = createCharacter('Besitztest');
  character.equipment = [{
    id: 'alt-1', family: 'ammo', baseTable: 'pfeile', baseId: '17', quantity: 12,
    selections: { modifikator: '19', qualitaet: 'alt' },
    computedPriceSnapshot: 1.25,
    computedStatsSnapshot: { fixschaden: 2, rwModMeter: -5 },
    displayNameSnapshot: 'Gespeicherter Pfeil',
    rangedSnapshot: { kind: 'ranged-ammo', table: 'pfeile', ammunitionTypeId: 'pfeil', name: 'Alter Snapshot', preisDublonen: 1.25, wuerfel: '1W6', fixschaden: 2, rb: 0, rwModMeter: -5, be: 0 },
  }];
  character.ruestungSlots[ruestungSlotKey('torso', 2)] = {
    basisSourceRow: 41, verarbeitungSourceRow: 51, anpassungSourceRow: 61,
    computedPriceSnapshot: 77,
    computedStatsSnapshot: { rs: 3, rh: 2, verfuegbarkeitNw: 1, verfuegbarkeitAw: 2 },
  };
  return character;
}

describe('renderReadOnlyBesitzView', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    document.body.innerHTML = '<div id="view"></div>';
    container = document.querySelector<HTMLDivElement>('#view')!;
  });

  it('zeigt Ausrüstung und belegte Rüstungsslots anhand gespeicherter Werte', () => {
    renderReadOnlyBesitzView(container, characterWithBesitz());
    expect(container.textContent).toContain('Gespeicherter Pfeil');
    expect(container.textContent).toContain('torso:2');
    expect(container.textContent).toContain('RS 3');
    expect(container.textContent).toContain('RH 2');
  });

  it('legt Auswahl-, Mengen-, Preis- und sämtliche Snapshot-Felder im Detailblock offen', () => {
    renderReadOnlyBesitzView(container, characterWithBesitz());
    const details = container.querySelector('[data-besitz-equipment-id="alt-1"]')!;
    expect(details.textContent).toContain('quantity');
    expect(details.textContent).toContain('computedPriceSnapshot');
    expect(details.textContent).toContain('selections.modifikator');
    expect(details.textContent).toContain('computedStatsSnapshot.rwModMeter');
    expect(details.textContent).toContain('rangedSnapshot.wuerfel');
    expect(details.textContent).toContain('1W6');
  });

  it('enthält keinerlei mutierende Steuerelemente', () => {
    renderReadOnlyBesitzView(container, characterWithBesitz());
    expect(container.querySelectorAll('button, input, select, textarea')).toHaveLength(0);
    expect(container.textContent).not.toContain('Entfernen');
    expect(container.textContent).not.toContain('Kaufen');
    expect(container.textContent).not.toContain('Ausziehen');
  });
});
