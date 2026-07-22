import { describe, expect, it } from 'vitest';
import { createCharacter } from '../state/characterStore';
import { setValue, buyWeapon, addWaffenLoadout, toggleWaffenLoadoutFavorite } from '../state/characterMutations';
import { computeSheet } from '../engine/characterSheet';
import { renderCharakterbogen } from './charakterbogen';
import { NK_WAFFEN_BASIS, NK_MATERIAL, NK_FERTIGUNG, NK_ANPASSUNG, NK_SCHAFTMATERIAL } from '../data/equipment/weapons';

describe('gedruckter Herkunftsheader', () => {
  it('druckt fuer die Herkunft ausschliesslich Ort, Region und AW/NW', () => {
    const character = createCharacter('Test', {
      spezies: 'Orks', herkunftOrtId: 'straitmor',
      herkunftSnapshot: { name: 'Straitmor', region: 'Orkisches Protektorat Straitmor', welt: 'NW' },
    });
    const container = document.createElement('div');
    renderCharakterbogen(container, computeSheet(character), character);

    const herkunft = [...container.querySelectorAll('tr')].find((row) => row.querySelector('th')?.textContent === 'Herkunft');
    expect(herkunft?.querySelector('td')?.textContent).toBe('Straitmor, Orkisches Protektorat Straitmor, NW');
    expect(herkunft?.textContent).not.toContain('Metropole');
  });
});

// Kampf-Tab-Spiegelung (2026-07-20): dieselben Row-Builder wie views/kampf.ts, aber read-only.
describe('Kampf-Tab-Spiegelung auf dem Charakterbogen', () => {
  function find<T extends { name: string }>(rows: readonly T[], name: string): T {
    const row = rows.find((r) => r.name === name);
    if (!row) throw new Error(`Testfixtur '${name}' nicht gefunden`);
    return row;
  }

  it('zeigt immer die Unbewaffnet-Zeile, auch ohne besessene Waffen', () => {
    const character = createCharacter('Test', { spezies: 'Mensch' });
    const container = document.createElement('div');
    renderCharakterbogen(container, computeSheet(character), character);

    const heading = [...container.querySelectorAll('h3')].find((h) => h.textContent === 'Nahkampf (Kampf-Tab)');
    expect(heading).toBeDefined();
    const rows = heading!.nextElementSibling!.querySelectorAll('tbody tr');
    expect(rows.length).toBeGreaterThanOrEqual(1);
    expect(rows[0].textContent).toContain('Unbewaffnet');
  });

  it('zeigt eine besessene Zweihaender-faehige Waffe als zwei Zeilen (1H/2H)', () => {
    let character = createCharacter('Test');
    character.values['ep_gesamt'] = 100000;
    character.values['dublonen_bank'] = 100000;
    character = setValue(character, 'eig_k_staerke', 30);
    const axt = find(NK_WAFFEN_BASIS, 'Axt');
    const material = find(NK_MATERIAL, 'Eisen');
    const fertigung = find(NK_FERTIGUNG, 'Gesellenarbeit');
    const anpassung = find(NK_ANPASSUNG, 'Von der Stange');
    const schaftmaterial = find(NK_SCHAFTMATERIAL, 'Standard');
    character = buyWeapon(character, axt.sourceRow, material.sourceRow, fertigung.sourceRow, anpassung.sourceRow, schaftmaterial.sourceRow);

    const container = document.createElement('div');
    renderCharakterbogen(container, computeSheet(character), character);

    const heading = [...container.querySelectorAll('h3')].find((h) => h.textContent === 'Nahkampf (Kampf-Tab)');
    const rows = [...heading!.nextElementSibling!.querySelectorAll('tbody tr')];
    const axtRows = rows.filter((r) => r.textContent?.includes('Axt'));
    expect(axtRows).toHaveLength(2);
    expect(axtRows[0].textContent).toContain('1H');
    expect(axtRows[1].textContent).toContain('2H');
  });
});

describe('Waffen-Loadout-Spiegelung auf dem Charakterbogen (nur favorisierte Loadouts)', () => {
  function find<T extends { name: string; sourceRow: number }>(rows: readonly T[], name: string): T {
    const row = rows.find((r) => r.name === name);
    if (!row) throw new Error(`Testfixtur '${name}' nicht gefunden`);
    return row;
  }

  function characterMitZweiWaffen() {
    let character = createCharacter('Test');
    character.values['ep_gesamt'] = 100000;
    character.values['dublonen_bank'] = 100000;
    character = setValue(character, 'eig_k_staerke', 30);
    character = setValue(character, 'nk_hiebwaffen', 10);
    character = setValue(character, 'nk_stichwaffen', 10);
    const material = find(NK_MATERIAL, 'Eisen');
    const fertigung = find(NK_FERTIGUNG, 'Gesellenarbeit');
    const anpassung = find(NK_ANPASSUNG, 'Von der Stange');
    const schaftmaterial = find(NK_SCHAFTMATERIAL, 'Standard');
    for (const name of ['Axt', 'Dolch']) {
      const row = find(NK_WAFFEN_BASIS, name);
      character = buyWeapon(character, row.sourceRow, material.sourceRow, fertigung.sourceRow, anpassung.sourceRow, schaftmaterial.sourceRow);
    }
    return character;
  }

  it('zeigt KEINE Waffen-Loadout-Ueberschrift, solange kein Loadout favorisiert ist', () => {
    let character = characterMitZweiWaffen();
    const [axt, dolch] = character.equipment;
    character = addWaffenLoadout(character, 'nk1h_nk1h', axt.id, dolch.id);

    const container = document.createElement('div');
    renderCharakterbogen(container, computeSheet(character), character);
    const heading = [...container.querySelectorAll('h3')].find((h) => h.textContent === 'Waffen-Loadout');
    expect(heading).toBeUndefined();
  });

  it('zeigt die Waffen-Loadout-Tabelle, sobald ein Loadout favorisiert ist', () => {
    let character = characterMitZweiWaffen();
    const [axt, dolch] = character.equipment;
    character = addWaffenLoadout(character, 'nk1h_nk1h', axt.id, dolch.id);
    character = toggleWaffenLoadoutFavorite(character, character.waffenLoadouts[0].id);

    const container = document.createElement('div');
    renderCharakterbogen(container, computeSheet(character), character);
    const heading = [...container.querySelectorAll('h3')].find((h) => h.textContent === 'Waffen-Loadout');
    expect(heading).toBeDefined();
    const rows = heading!.nextElementSibling!.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(1);
    expect(rows[0].textContent).toContain('Axt+Dolch');
  });
});
