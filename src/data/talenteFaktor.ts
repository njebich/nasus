// Talente, die bei Auswahl einen multiplikativen Faktor auf eine bereits existierende
// Formel-Referenz anwenden (Nutzer 2026-07-18, zweite Runde der Talente-Wirkung-Analyse).
// Anders als talenteModifikator.ts (addiert einen Flachbetrag) und talenteMaximum.ts (erhoeht
// eine Obergrenze) wird hier der berechnete Wert MULTIPLIZIERT. Aus "Talente-Wirkung-
// chatgpt.xlsx" extrahiert: Mana Regeneration Stufe 1/2 (x1,5/x2,0 auf die neu ergaenzte
// Referenz mana_regeneration_pro_stunde = att_aura*2, Regel vom Nutzer bestaetigt: "Ein
// Charakter regeneriert pro Stunde Aura*2 Punkte Mana"). Wie bei allen anderen Mehrstufen-
// Talenten zaehlt nur die hoechste gewaehlte Stufe (siehe engine/talenteFaktor.ts) - kein
// Aufmultiplizieren von 1,5*2,0.
export interface TalentFaktorBonus {
  talentReferenz: string;
  zielReferenz: string;
  faktor: number;
}

export const TALENT_FAKTOR_BONUSES: TalentFaktorBonus[] = [
  { talentReferenz: 'talente_mana_regeneration_stufe_1', zielReferenz: 'mana_regeneration_pro_stunde', faktor: 1.5 },
  { talentReferenz: 'talente_mana_regeneration_stufe_2', zielReferenz: 'mana_regeneration_pro_stunde', faktor: 2 },
];
