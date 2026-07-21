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

  it('nur die hoechste gewaehlte Stufe zaehlt, keine Stapelung (Alchemieresistenz Stufe 1+2 -> nur Stufe 2s +12, Nutzer 2026-07-18 zweite Runde)', () => {
    const character = withSelection('talente_alchemieresistenz_stufe_1');
    character.selections['talente_alchemieresistenz_stufe_2'] = 1;
    expect(getTalentMaximumBonus(character, 'sf_alchemieresistenz', 'Sonderfertigkeit')).toBe(12);
  });

  it('zielKategorie: Talent erhoeht ALLE Referenzen einer Kategorie (Grundfertigkeiten Stufe 1 -> +2 auf jede Grundfertigkeit)', () => {
    const character = withSelection('talente_grundfertigkeiten_stufe_1');
    expect(getTalentMaximumBonus(character, 'gr_klettern', 'Grundfertigkeit')).toBe(2);
    expect(getTalentMaximumBonus(character, 'gr_laufen', 'Grundfertigkeit')).toBe(2);
    expect(getTalentMaximumBonus(character, 'sf_ausweichen', 'Sonderfertigkeit')).toBe(0);
  });

  it('zielPraefix: Zauberschul-Talent erhoeht ALLE Referenzen mit dem Schul-Praefix (Magus Feuerbeschwoerung Stufe 1 -> +6 auf jeden Feuerbeschwoerung-Zauber)', () => {
    const character = withSelection('talente_magus_stufe_1_feuerbeschwoerungs_magus');
    expect(getTalentMaximumBonus(character, 'spruchmagie_feuerbeschwoerung_1_flammenwand', 'Spruchmagie')).toBe(6);
    // andere Schule bleibt unberuehrt
    expect(getTalentMaximumBonus(character, 'spruchmagie_wasserbeschwoerung_1_frostwand', 'Spruchmagie')).toBe(0);
  });

  it('Magus/Grossmagus/Erzmagus (Stufe 1/2/3 derselben Schule) gleichzeitig gewaehlt geben nur den hoechsten Wert (+18), kein Aufaddieren auf +36 (Nutzer 2026-07-18 zweite Runde)', () => {
    const character = withSelection('talente_magus_stufe_1_feuerbeschwoerungs_magus');
    character.selections['talente_magus_stufe_2_feuerbeschwoerungs_grossmagus'] = 1;
    character.selections['talente_magus_stufe_3_feuerbeschwoerungs_erzmagus'] = 1;
    expect(getTalentMaximumBonus(character, 'spruchmagie_feuerbeschwoerung_1_flammenwand', 'Spruchmagie')).toBe(18);
  });

  it('Attributsmaximum-Talent erhoeht das Attribut-Maximum (Attributs-Maximum erhoehen +1 AURA)', () => {
    const character = withSelection('talente_attributs_maximum_erhoehen__aura');
    expect(getTalentMaximumBonus(character, 'att_aura', 'Attribute')).toBe(1);
  });

  it('Kampffertigkeitsmaximum-Talent erhoeht die Kampffertigkeit (Kampffertigkeit erhoehen: Boegen +6)', () => {
    const character = withSelection('talente_kampffertigkeit_erhoehen_boegen');
    expect(getTalentMaximumBonus(character, 'fk_boegen', 'Fernkampf')).toBe(6);
  });

  it('manueller Override: Charismatischer Fuehrer erhoeht nur gr_ueberzeugen (kein eigenes "Ueberreden" in rules.json, Nutzer-Entscheidung 2026-07-18)', () => {
    const character = withSelection('talente_charismatischer_fuehrer');
    expect(getTalentMaximumBonus(character, 'gr_ueberzeugen', 'Grundfertigkeit')).toBe(6);
  });

  it('manueller Override: KI-Meister erhoeht ALLE KI-Faehigkeiten (zielKategorie, PSI/KI-Basiswert 2026-07-18 nachtraeglich bestaetigt)', () => {
    const character = withSelection('talente_ki_meister');
    expect(getTalentMaximumBonus(character, 'ki_regeneration', 'KI')).toBe(18);
    expect(getTalentMaximumBonus(character, 'ki_kraftakt', 'KI')).toBe(18);
    expect(getTalentMaximumBonus(character, 'psi_pyrokinese', 'PSI')).toBe(0);
  });

  it('manueller Override: PSI Psinetik erhoeht ALLE PSI-Faehigkeiten, nur die hoechste Stufe zaehlt', () => {
    const character = withSelection('talente_psi_psinetik_stufe_1');
    character.selections['talente_psi_psinetik_stufe_2'] = 1;
    expect(getTalentMaximumBonus(character, 'psi_pyrokinese', 'PSI')).toBe(12);
    expect(getTalentMaximumBonus(character, 'ki_regeneration', 'KI')).toBe(0);
  });

  it('manueller Override: Vorderlader Ladeschuetze erhoeht sf_ladeschuetze_vorderlader', () => {
    const character = withSelection('talente_vorderlader_ladeschuetze_stufe1');
    expect(getTalentMaximumBonus(character, 'sf_ladeschuetze_vorderlader', 'Sonderfertigkeit')).toBe(7);
  });
});
