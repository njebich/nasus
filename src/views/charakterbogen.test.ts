import { describe, expect, it } from 'vitest';
import { createCharacter } from '../state/characterStore';
import { setValue, buyWeapon, addWaffenLoadout, toggleWaffenLoadoutFavorite } from '../state/characterMutations';
import { computeSheet } from '../engine/characterSheet';
import { renderCharakterbogen } from './charakterbogen';
import { NK_WAFFEN_BASIS, NK_MATERIAL, NK_FERTIGUNG, NK_ANPASSUNG, NK_SCHAFTMATERIAL } from '../data/equipment/weapons';
import { GESINNUNG_TRAITS } from '../data/gesinnung';

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

describe('gemeinsam genutzte LE/RS-Zustandsanzeige', () => {
  it('enthaelt im Charakterbogen alle Trefferzonen sowie Gesundheit, TS, SB, RHg und RBE', () => {
    const character = createCharacter('Test', { spezies: 'Mensch' });
    const container = document.createElement('div');
    renderCharakterbogen(container, computeSheet(character), character);

    const headings = [...container.querySelectorAll('h3')]
      .filter((heading) => heading.textContent === 'Lebensenergie & Rüstungsschutz');
    expect(headings).toHaveLength(1);
    const block = headings[0].nextElementSibling!;
    expect([...block.querySelectorAll('.kampf-tz-name')].map((node) => node.textContent)).toEqual([
      'Trefferzone', 'Kopf', 'Torso', 'Unterleib', 'Arme', 'Beine',
    ]);
    expect([...block.querySelectorAll('.kampf-tz-rechts-label')].map((node) => node.textContent)).toEqual([
      'Gesundheit', 'Trefferschwelle', 'Selbstbeherrschung', 'Rüstungshinderlichkeit', 'RBE',
    ]);
  });
});

describe('Waffenanzeige auf dem Charakterbogen', () => {
  it('zeigt keine vollständigen Waffentabellen, behält aber Ausweichen und Bewegung', () => {
    const character = createCharacter('Test', { spezies: 'Mensch' });
    const container = document.createElement('div');
    renderCharakterbogen(container, computeSheet(character), character);

    const headings = [...container.querySelectorAll('h3')].map((heading) => heading.textContent);
    expect(headings).not.toContain('Nahkampf (Kampf-Tab)');
    expect(headings).not.toContain('Feuerwaffen');
    expect(headings).not.toContain('Armbrüste');
    expect(headings).not.toContain('Bögen');
    expect(headings).toContain('Ausweichen / Bewegung');
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
    expect(container.querySelector('.kampf-waffen-table')).toBeNull();
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
    expect([...heading!.nextElementSibling!.querySelectorAll('th')].map((th) => th.textContent)).not.toContain('Typ');
  });

  it('zeigt ein favorisiertes 1H-Einzelwaffen-Loadout ohne Namensdopplung', () => {
    let character = characterMitZweiWaffen();
    const [axt] = character.equipment;
    character = addWaffenLoadout(character, 'nk1h', axt.id, axt.id);
    character = toggleWaffenLoadoutFavorite(character, character.waffenLoadouts[0].id);

    const container = document.createElement('div');
    renderCharakterbogen(container, computeSheet(character), character);
    const loadoutRow = container.querySelector('[data-loadout-table="nk"] tbody tr')!;
    expect(loadoutRow.firstElementChild?.textContent).toBe('Axt');
    expect(loadoutRow.textContent).not.toContain('Axt+Axt');
  });
});

describe('Gesinnung-Spiegel auf dem Charakterbogen (analog zur AT/PA-Balance-Regel: Abschnitt bleibt ausgeblendet, bis vollstaendig)', () => {
  it('zeigt keinen Gesinnung-Abschnitt, solange nicht alle 22 Slider gesetzt sind', () => {
    const character = createCharacter('Test');
    const container = document.createElement('div');
    renderCharakterbogen(container, computeSheet(character), character);

    const heading = [...container.querySelectorAll('h3')].find((h) => h.textContent === 'Gesinnung');
    expect(heading).toBeUndefined();
  });

  it('zeigt den Gesinnung-Abschnitt inkl. Anmerkungen, sobald alle 22 Slider gesetzt sind', () => {
    const character = createCharacter('Test');
    for (const trait of GESINNUNG_TRAITS) character.gesinnung[trait.key] = 0;
    character.gesinnungNotiz = 'Hasst Piraten.';
    const container = document.createElement('div');
    renderCharakterbogen(container, computeSheet(character), character);

    const heading = [...container.querySelectorAll('h3')].find((h) => h.textContent === 'Gesinnung');
    expect(heading).toBeDefined();
    const rows = [...heading!.nextElementSibling!.querySelectorAll('tr')];
    expect(rows).toHaveLength(GESINNUNG_TRAITS.length + 1);
    expect(rows.every((row) => row.querySelector('td')?.textContent === 'Neutral' || row.textContent?.includes('Hasst Piraten.'))).toBe(true);
  });
});
