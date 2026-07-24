import { describe, expect, it, vi } from 'vitest';
import { createCharacter } from './characterStore';
import {
  buyAlchemika, buyArtefakt, buyWeapon, listProfaneNahkampfWeapons, MutationError,
} from './characterMutations';
import { computeSheet } from '../engine/characterSheet';
import { buildNahkampfRows } from '../views/kampf';
import { ALCHEMIKA } from '../data/equipment/alchemika';
import {
  NK_WAFFEN_BASIS, NK_MATERIAL, NK_FERTIGUNG, NK_ANPASSUNG, NK_SCHAFTMATERIAL,
} from '../data/equipment/weapons';
import { ARTEFAKT_KOSTEN } from '../data/equipment/artefakte';

vi.setConfig({ testTimeout: 30000 });

function row<T extends { name: string }>(rows: readonly T[], name: string): T {
  const found = rows.find((entry) => entry.name === name);
  if (!found) throw new Error(`Testfixtur '${name}' fehlt`);
  return found;
}

function characterWithAxt() {
  let character = createCharacter('X-Klinge Test');
  character.values['dublonen_bank'] = 100000;
  character.values['eig_k_staerke'] = 30;
  character.bestehenderCharakter = true;
  character = buyWeapon(
    character,
    row(NK_WAFFEN_BASIS, 'Axt').sourceRow,
    row(NK_MATERIAL, 'Eisen').sourceRow,
    row(NK_FERTIGUNG, 'Gesellenarbeit').sourceRow,
    row(NK_ANPASSUNG, 'Von der Stange').sourceRow,
    row(NK_SCHAFTMATERIAL, 'Standard').sourceRow,
  );
  return character;
}

describe('X-Klinge Kauf und Amalgamierung', () => {
  it('lehnt den Kauf ohne profane NK-Waffe ab', () => {
    const character = createCharacter('Test');
    character.values['dublonen_bank'] = 100000;
    expect(() => buyArtefakt(character, 'artefakt_flammen_klinge', '1', 'einmalig'))
      .toThrow(MutationError);
  });

  it('ersetzt die Waffe unter gleicher ID; Wert ist Waffe+Artefakt, Budgetdelta nur Artefakt', () => {
    const before = characterWithAxt();
    const weapon = before.equipment[0];
    const weaponValue = weapon.computedPriceSnapshot!;
    const artefakt = ARTEFAKT_KOSTEN.find(
      (entry) => entry.referenz === 'artefakt_flammen_klinge' && entry.grad === '1',
    )!;
    const artefaktValue = Number(artefakt.kostenEinmalig);
    const spentBefore = computeSheet(before).dublonenSpent;

    const after = buyArtefakt(before, artefakt.referenz, artefakt.grad!, 'einmalig', weapon.id);
    expect(after.equipment).toHaveLength(1);
    expect(after.equipment[0]).toMatchObject({
      id: weapon.id,
      family: 'weapon',
      magisch: true,
      computedPriceSnapshot: weaponValue + artefaktValue,
      xKlinge: {
        artefaktReferenz: 'artefakt_flammen_klinge',
        grad: '1',
        variant: 'einmalig',
      },
    });
    expect(computeSheet(after).dublonenSpent - spentBefore).toBe(artefaktValue);
    expect(listProfaneNahkampfWeapons(after)).toHaveLength(0);
    expect(() => buyArtefakt(after, artefakt.referenz, artefakt.grad!, 'einmalig', weapon.id))
      .toThrow(MutationError);
  });

  it('zeigt Standard- und aktive Zeile mit gemeinsamem Pool-Key und Flammenschaden', () => {
    const before = characterWithAxt();
    const weapon = before.equipment[0];
    const after = buyArtefakt(before, 'artefakt_flammen_klinge', '4', 'einmalig', weapon.id);
    const rows = buildNahkampfRows(after, computeSheet(after))
      .filter((entry) => entry.key === weapon.id && entry.grip === '1H');
    expect(rows).toHaveLength(2);
    expect(rows[0].label).toBe('Flammen-Axt');
    expect(rows[1].label).toBe('Flammen-Axt (aktiv)');
    expect(rows[0].schaden).not.toContain('Flamme');
    expect(rows[1].schaden).toContain('(W12 Flamme)');
    expect(rows[0].poolReferenz).toBe(rows[1].poolReferenz);
    expect(rows[0].rb).toBe(rows[1].rb);
  });

  it('addiert nur in der aktiven Splitter-Zeile den Grad-RB zur Waffe', () => {
    const before = characterWithAxt();
    const weapon = before.equipment[0];
    const after = buyArtefakt(before, 'artefakt_splitter_klinge', '7', 'einmalig', weapon.id);
    const rows = buildNahkampfRows(after, computeSheet(after))
      .filter((entry) => entry.key === weapon.id && entry.grip === '1H');
    expect(rows[1].schaden).toContain('(W20 Erde)');
    expect(rows[1].rb).toBe(rows[0].rb + 8);
  });
});

describe('unsichtbares magisch-Flag', () => {
  it('setzt es bei magischen Alchemika und lässt es bei profanen Alchemika weg', () => {
    const magisch = ALCHEMIKA.find((entry) => entry.magisch && entry.preisAvailable)!;
    const profan = ALCHEMIKA.find((entry) => !entry.magisch && entry.preisAvailable)!;
    let character = createCharacter('Alchemika');
    character.values['dublonen_bank'] = 100000;
    character.bestehenderCharakter = true;
    character = buyAlchemika(character, magisch.sourceRow, 1);
    character = buyAlchemika(character, profan.sourceRow, 1);
    expect(character.equipment[0].magisch).toBe(true);
    expect(character.equipment[1].magisch).toBeUndefined();
  });
});
