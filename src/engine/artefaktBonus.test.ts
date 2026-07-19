import { describe, it, expect } from 'vitest';
import { getArtefaktBonus } from './artefaktBonus';
import { computeSheet } from './characterSheet';
import { createCharacter, type EquipmentEntry } from '../state/characterStore';
import { ARTEFAKT_KOSTEN } from '../data/equipment/artefakte';

function artefaktEntry(referenz: string, grad: string): EquipmentEntry {
  const kostenRow = ARTEFAKT_KOSTEN.find((r) => r.referenz === referenz && r.grad === grad);
  if (!kostenRow) throw new Error(`Fixture-Fehler: '${referenz}' Grad ${grad} nicht in ARTEFAKT_KOSTEN gefunden`);
  return {
    id: `test-${referenz}-${grad}`, family: 'artefakt', baseTable: 'artefakt_kosten',
    baseId: String(kostenRow.sourceRow), selections: { variant: 'permanent' }, quantity: 1,
    computedPriceSnapshot: 0,
  };
}

describe('getArtefaktBonus', () => {
  it('ist 0 ohne passendes Artefakt im Inventar', () => {
    const character = createCharacter('Test');
    expect(getArtefaktBonus(character, 'eig_k_athletik')).toBe(0);
  });

  it('Bonus = gekaufter Grad (Eigenschafts-Artefakt, Nutzer-Regel 2026-07-19)', () => {
    const character = createCharacter('Test');
    character.equipment.push(artefaktEntry('artefakt_eigenschafts_artefakt_athletik', '3'));
    expect(getArtefaktBonus(character, 'eig_k_athletik')).toBe(3);
  });

  it('Bonus = gekaufter Grad (Attributs-Artefakt)', () => {
    const character = createCharacter('Test');
    character.equipment.push(artefaktEntry('artefakt_attributs_artefakt_aura', '4'));
    expect(getArtefaktBonus(character, 'att_aura')).toBe(4);
  });

  it('nur der hoechste gekaufte Grad zaehlt - kein Stacking mehrerer Grade desselben Artefakts', () => {
    const character = createCharacter('Test');
    character.equipment.push(artefaktEntry('artefakt_eigenschafts_artefakt_athletik', '2'));
    character.equipment.push(artefaktEntry('artefakt_eigenschafts_artefakt_athletik', '5'));
    expect(getArtefaktBonus(character, 'eig_k_athletik')).toBe(5);
  });

  it('betrifft nur die eigene Ziel-Referenz, nicht andere Eigenschaften/Attribute', () => {
    const character = createCharacter('Test');
    character.equipment.push(artefaktEntry('artefakt_eigenschafts_artefakt_athletik', '6'));
    expect(getArtefaktBonus(character, 'eig_k_staerke')).toBe(0);
    expect(getArtefaktBonus(character, 'att_aura')).toBe(0);
  });
});

describe('computeSheet mit Eigenschafts-Artefakt im Inventar', () => {
  it('alteredValue = Basiswert + Artefakt-Bonus, currentValue bleibt der reine Basiswert', () => {
    const character = createCharacter('Test');
    character.values['eig_k_athletik'] = 10;
    character.equipment.push(artefaktEntry('artefakt_eigenschafts_artefakt_athletik', '3'));
    const sheet = computeSheet(character);
    const row = sheet.byKategorie['Eigenschaft']?.find((r) => r.rule.referenz === 'eig_k_athletik');
    expect(row?.currentValue).toBe(10);
    expect(row?.alteredValue).toBe(13);
  });

  it('SP-Kosten (kostenCurrent/kostenNext) rechnen immer mit dem unveraenderten Basiswert', () => {
    const withoutArtefakt = createCharacter('Test');
    withoutArtefakt.values['eig_k_athletik'] = 10;
    const baseline = computeSheet(withoutArtefakt);
    const baselineRow = baseline.byKategorie['Eigenschaft']?.find((r) => r.rule.referenz === 'eig_k_athletik');

    const withArtefakt = createCharacter('Test2');
    withArtefakt.values['eig_k_athletik'] = 10;
    withArtefakt.equipment.push(artefaktEntry('artefakt_eigenschafts_artefakt_athletik', '3'));
    const boosted = computeSheet(withArtefakt);
    const boostedRow = boosted.byKategorie['Eigenschaft']?.find((r) => r.rule.referenz === 'eig_k_athletik');

    expect(boostedRow?.kostenCurrent).toBe(baselineRow?.kostenCurrent);
    expect(boostedRow?.kostenNext).toBe(baselineRow?.kostenNext);
    expect(boosted.spSpent).toBe(baseline.spSpent);
  });

  it('wirkt in Formeln, die die Eigenschaft als Variable nutzen (hier: Eigenschaftsbonus)', () => {
    const character = createCharacter('Test');
    character.values['eig_k_athletik'] = 10; // eig_bonus_k_athletik = eig_k_athletik/2-5
    character.equipment.push(artefaktEntry('artefakt_eigenschafts_artefakt_athletik', '4')); // -> 14
    const sheet = computeSheet(character);
    const bonusRow = sheet.byKategorie['Eigenschaftsbonus']?.find((r) => r.rule.referenz === 'eig_bonus_k_athletik');
    // (10+4)/2-5 aufgerundet = 2
    expect(bonusRow?.computedValue).toBe(2);
  });
});
