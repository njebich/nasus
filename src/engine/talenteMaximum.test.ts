import { describe, it, expect } from 'vitest';
import { getTalentMaximumBonus } from './talenteMaximum';
import { createCharacter } from '../state/characterStore';

function withSelection(referenz: string) {
  const character = createCharacter('Test');
  character.selections[referenz] = 1;
  return character;
}

describe('getTalentMaximumBonus (Nutzer 2026-07-18: Talente-Wirkung-Analyse, "Maximum"-Talente)', () => {
  it('gibt 0 zurueck, wenn kein passendes Talent gewaehlt ist', () => {
    const character = createCharacter('Test');
    expect(getTalentMaximumBonus(character, 'sf_alchemieresistenz', 'Sonderfertigkeit')).toBe(0);
  });

  it('zielReferenz: einzelnes Talent erhoeht genau eine Referenz (Alchemieresistenz Stufe 1 -> sf_alchemieresistenz +6)', () => {
    const character = withSelection('talente_alchemieresistenz_stufe_1');
    expect(getTalentMaximumBonus(character, 'sf_alchemieresistenz', 'Sonderfertigkeit')).toBe(6);
    expect(getTalentMaximumBonus(character, 'sf_ausweichen', 'Sonderfertigkeit')).toBe(0);
  });

  it('mehrere gewaehlte Talente auf dieselbe Referenz werden addiert (Alchemieresistenz Stufe 1+2)', () => {
    const character = withSelection('talente_alchemieresistenz_stufe_1');
    character.selections['talente_alchemieresistenz_stufe_2'] = 1;
    expect(getTalentMaximumBonus(character, 'sf_alchemieresistenz', 'Sonderfertigkeit')).toBe(6 + 12);
  });

  it('zielKategorie: Talent erhoeht ALLE Referenzen einer Kategorie (Grundfertigkeiten Stufe 1 -> +2 auf jede Grundfertigkeit)', () => {
    const character = withSelection('talente_grundfertigkeiten_stufe_1');
    expect(getTalentMaximumBonus(character, 'gr_klettern', 'Grundfertigkeit')).toBe(2);
    expect(getTalentMaximumBonus(character, 'gr_dauerlauf', 'Grundfertigkeit')).toBe(2);
    expect(getTalentMaximumBonus(character, 'sf_ausweichen', 'Sonderfertigkeit')).toBe(0);
  });

  it('zielPraefix: Zauberschul-Talent erhoeht ALLE Referenzen mit dem Schul-Praefix (Magus Feuerbeschwoerung Stufe 1 -> +6 auf jeden Feuerbeschwoerung-Zauber)', () => {
    const character = withSelection('talente_magus_stufe_1_feuerbeschwoerungs_magus');
    expect(getTalentMaximumBonus(character, 'spruchmagie_feuerbeschwoerung_1_flammenwand', 'Spruchmagie')).toBe(6);
    // andere Schule bleibt unberuehrt
    expect(getTalentMaximumBonus(character, 'spruchmagie_wasserbeschwoerung_1_frostwand', 'Spruchmagie')).toBe(0);
  });

  it('Attributsmaximum-Talent erhoeht das Attribut-Maximum (Attributs-Maximum erhoehen +1 AURA)', () => {
    const character = withSelection('talente_attributs_maximum_erhoehen__aura');
    expect(getTalentMaximumBonus(character, 'att_aura', 'Attribute')).toBe(1);
  });

  it('Kampffertigkeitsmaximum-Talent erhoeht die Kampffertigkeit (Kampffertigkeit erhoehen: Boegen +6)', () => {
    const character = withSelection('talente_kampffertigkeit_erhoehen_boegen');
    expect(getTalentMaximumBonus(character, 'fk_boegen', 'Fernkampf')).toBe(6);
  });
});
