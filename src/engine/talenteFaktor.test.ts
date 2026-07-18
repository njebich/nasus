import { describe, it, expect } from 'vitest';
import { getTalentFaktorBonus } from './talenteFaktor';
import { createCharacter } from '../state/characterStore';

describe('getTalentFaktorBonus (Nutzer 2026-07-18 zweite Runde: Mana Regeneration Stufe 1/2)', () => {
  it('gibt 1 zurueck (kein Effekt), wenn kein passendes Talent gewaehlt ist', () => {
    const character = createCharacter('Test');
    expect(getTalentFaktorBonus(character, 'mana_regeneration_pro_stunde')).toBe(1);
  });

  it('Stufe 1 gibt Faktor 1,5', () => {
    const character = createCharacter('Test');
    character.selections['talente_mana_regeneration_stufe_1'] = 1;
    expect(getTalentFaktorBonus(character, 'mana_regeneration_pro_stunde')).toBe(1.5);
  });

  it('Stufe 2 gibt Faktor 2,0', () => {
    const character = createCharacter('Test');
    character.selections['talente_mana_regeneration_stufe_2'] = 1;
    expect(getTalentFaktorBonus(character, 'mana_regeneration_pro_stunde')).toBe(2);
  });

  it('beide Stufen gleichzeitig gewaehlt: nur die hoechste zaehlt (x2,0, nicht x1,5*x2,0=x3,0)', () => {
    const character = createCharacter('Test');
    character.selections['talente_mana_regeneration_stufe_1'] = 1;
    character.selections['talente_mana_regeneration_stufe_2'] = 1;
    expect(getTalentFaktorBonus(character, 'mana_regeneration_pro_stunde')).toBe(2);
  });
});
