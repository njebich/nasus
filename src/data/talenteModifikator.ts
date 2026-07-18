// Talente, die bei Auswahl einen festen additiven Bonus auf eine bereits existierende
// Formel-Referenz addieren (Nutzer 2026-07-18, Talente-Wirkung-Analyse, Wirkungsklasse
// "Charakterwertmodifikator"). Anders als talenteMaximum.ts (erhoeht eine Obergrenze) wird
// hier der TATSAECHLICHE berechnete Wert direkt erhoeht. Aus "Talente-Wirkung-chatgpt.xlsx"
// extrahiert (Zaeher Bursche Stufe 1-3 - die einzigen 3 der 11 "Modifikator"-Talente mit
// sauberer Zielreferenz; Kampfstilmodifikator (Offensiver Kampfstil/Verteidiger, wirkt auf ALLE
// at_X/pa_X-Formeln gleichzeitig) und Regeneration (Ziel "Mana-Regeneration" existiert nicht als
// Referenz) sind bewusst NICHT aufgenommen - brauchen eigene Architektur-Entscheidungen.
export interface TalentModifikatorBonus {
  talentReferenz: string;
  zielReferenz: string;
  bonus: number;
}

export const TALENT_MODIFIKATOR_BONUSES: TalentModifikatorBonus[] = [
  { talentReferenz: 'talente_zaeher_bursche_stufe_1', zielReferenz: 'selbstbeherrschung', bonus: 1 },
  { talentReferenz: 'talente_zaeher_bursche_stufe_1', zielReferenz: 'gesundheit', bonus: 2 },
  { talentReferenz: 'talente_zaeher_bursche_stufe_2', zielReferenz: 'trefferschwelle', bonus: 1 },
  { talentReferenz: 'talente_zaeher_bursche_stufe_2', zielReferenz: 'selbstbeherrschung', bonus: 3 },
  { talentReferenz: 'talente_zaeher_bursche_stufe_2', zielReferenz: 'gesundheit', bonus: 4 },
  { talentReferenz: 'talente_zaeher_bursche_stufe_3', zielReferenz: 'trefferschwelle', bonus: 2 },
  { talentReferenz: 'talente_zaeher_bursche_stufe_3', zielReferenz: 'selbstbeherrschung', bonus: 6 },
  { talentReferenz: 'talente_zaeher_bursche_stufe_3', zielReferenz: 'gesundheit', bonus: 7 },
];
