import { describe, it, expect } from 'vitest';
import { createCharacter } from './characterStore';
import { buyArmor, buyShield, removeEquipment, BudgetError, MutationError } from './characterMutations';
import { computeSheet } from '../engine/characterSheet';
import { RUESTUNG_BASIS, RUESTUNG_VERARBEITUNG, RUESTUNG_ANPASSUNG } from '../data/equipment/armor';
import { NK_WAFFEN_BASIS } from '../data/equipment/weapons';

function withDublonen(bank: number) {
  const character = createCharacter('Test');
  character.values['dublonen_bank'] = bank;
  return character;
}

describe('buyArmor', () => {
  const basis = RUESTUNG_BASIS.find((r) => r.name === 'Stoffrüstung')!;
  const verarbeitung = RUESTUNG_VERARBEITUNG.find((r) => r.name === 'Meisterarbeit')!;
  const anpassung = RUESTUNG_ANPASSUNG.find((r) => r.name === 'angepasst')!;

  it('kauft eine komponierte Ruestung und zieht den berechneten Preis (227D) ab', () => {
    const character = withDublonen(227);
    const updated = buyArmor(character, basis.sourceRow, verarbeitung.sourceRow, anpassung.sourceRow);
    expect(updated.equipment).toHaveLength(1);
    expect(updated.equipment[0].computedStatsSnapshot).toEqual({ rs: 3, rh: 1, verfuegbarkeitNw: 3, verfuegbarkeitAw: 2 });
    expect(computeSheet(updated).dublonenSpent).toBe(227);
  });

  it('lehnt ab, wenn nicht genug Dublonen vorhanden sind', () => {
    const character = withDublonen(226);
    expect(() => buyArmor(character, basis.sourceRow, verarbeitung.sourceRow, anpassung.sourceRow)).toThrow(BudgetError);
  });

  it('lehnt eine unbekannte Basis-Zeile ab', () => {
    const character = withDublonen(100000);
    expect(() => buyArmor(character, 999999, verarbeitung.sourceRow, anpassung.sourceRow)).toThrow(MutationError);
  });
});

describe('buyShield', () => {
  const shieldRow = NK_WAFFEN_BASIS.find((r) => r['Spezialisierung'] === 'Schild')!;

  it('kauft ein Schild zum Preis-Basis', () => {
    const price = Number(shieldRow['Preis-Basis']);
    const character = withDublonen(price);
    const updated = buyShield(character, shieldRow.sourceRow);
    expect(computeSheet(updated).dublonenSpent).toBe(price);
  });

  it('lehnt eine Nicht-Schild-Zeile ab', () => {
    const nonShield = NK_WAFFEN_BASIS.find((r) => r['Spezialisierung'] !== 'Schild')!;
    const character = withDublonen(100000);
    expect(() => buyShield(character, nonShield.sourceRow)).toThrow(MutationError);
  });

  it('removeEquipment entfernt den Schild-Kauf wieder', () => {
    const price = Number(shieldRow['Preis-Basis']);
    const character = withDublonen(price);
    const updated = buyShield(character, shieldRow.sourceRow);
    const removed = removeEquipment(updated, updated.equipment[0].id);
    expect(computeSheet(removed).dublonenSpent).toBe(0);
  });
});
