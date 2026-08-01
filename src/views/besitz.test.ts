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
    expect(container.textContent).toContain('Fernkampfwaffen');
    expect(container.textContent).toContain('Torso');
    expect(container.textContent).toContain('Lage 2:');
    expect(container.textContent).toContain('RS 3');
    expect(container.textContent).toContain('RH 2');
  });

  it('gruppiert Ausrüstung nach ihrem Herkunftskatalog', () => {
    const character = createCharacter('Gruppentest');
    character.equipment = [
      { id: 'nk', family: 'weapon', baseTable: 'nk_waffen_basis', baseId: '1', selections: {}, quantity: 1 },
      { id: 'fk', family: 'fernkampfwaffe', baseTable: 'boegen', baseId: '1', selections: {}, quantity: 1 },
      { id: 'preis', family: 'preisliste', baseTable: 'preisliste', baseId: '1', selections: {}, quantity: 1 },
      { id: 'artefakt', family: 'artefakt', baseTable: 'artefakt_kosten', baseId: '1', selections: {}, quantity: 1 },
    ];

    renderReadOnlyBesitzView(container, character);
    expect([...container.querySelectorAll('.besitz-equipment-group > h4')].map((heading) => heading.textContent))
      .toEqual(['Nahkampfwaffen', 'Fernkampfwaffen', 'Preisliste', 'Artefakte']);
  });

  it('zeigt Rüstung je Körperzone und Lage mit Katalognamen', () => {
    const character = createCharacter('Rüstungstest');
    character.ruestungSlots['kopf:1'] = {
      basisSourceRow: 2, verarbeitungSourceRow: 2, anpassungSourceRow: 4,
      computedPriceSnapshot: 28,
      computedStatsSnapshot: { rs: 1, rh: 1, verfuegbarkeitNw: 3, verfuegbarkeitAw: 2 },
    };

    renderReadOnlyBesitzView(container, character);
    const group = container.querySelector('[aria-label="Kopf"]')!;
    expect(group.querySelector('h4')?.textContent).toContain('Kopf RS 1 · RH 1');
    expect(group.textContent).toContain('Lage 1:');
    expect(group.textContent).toContain('Leichte Stoffrüstung, Gesellenarbeit, angepasst');
    expect(group.textContent).toContain('RS 1');
    expect(group.textContent).toContain('RH 1');
    expect(group.textContent).toContain('28 D');
    expect(group.textContent).not.toContain('Basis #2');
  });

  it('blendet nicht genutzte Rüstungslagen aus', () => {
    const character = createCharacter('Leere Lagen');
    character.ruestungSlots['kopf:1'] = {
      basisSourceRow: 2, verarbeitungSourceRow: 2, anpassungSourceRow: 4,
      computedPriceSnapshot: 28,
      computedStatsSnapshot: { rs: 1, rh: 1, verfuegbarkeitNw: 3, verfuegbarkeitAw: 2 },
    };
    character.ruestungSlots['kopf:2'] = {
      basisSourceRow: -1, verarbeitungSourceRow: 2, anpassungSourceRow: 2,
      computedPriceSnapshot: 0,
      computedStatsSnapshot: { rs: 0, rh: 0, verfuegbarkeitNw: 0, verfuegbarkeitAw: 0 },
    };

    renderReadOnlyBesitzView(container, character);
    expect(container.textContent).toContain('Lage 1:');
    expect(container.textContent).not.toContain('Lage 2:');
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

  it('zeigt bei alten Käufen Katalognamen statt interner Tabellen-IDs', () => {
    const character = createCharacter('Altinventar');
    character.equipment = [
      {
        id: 'fw', family: 'feuerwaffe', baseTable: 'feuerwaffen', baseId: '68',
        selections: {}, quantity: 1, computedPriceSnapshot: 319.55,
      },
      {
        id: 'ammo', family: 'ammo', baseTable: 'feuerwaffen-munition', baseId: 'papierpatrone_vl',
        selections: { kaliber: '14' }, quantity: 100, computedPriceSnapshot: 0.44,
      },
    ];

    renderReadOnlyBesitzView(container, character);
    expect(container.textContent).not.toContain('feuerwaffen #68');
    expect(container.textContent).not.toContain('feuerwaffen-munition #papierpatrone_vl');
    expect(container.textContent).toContain('Kaliber 14');
  });
});
