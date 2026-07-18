// Summiert die Talent-Maximum-Boni (data/talenteMaximum.ts), die auf eine bestimmte Referenz
// wirken - fuer EINE Zielreferenz direkt, fuer eine ganze Zielkategorie (z.B. "alle
// Grundfertigkeiten") oder fuer alle Referenzen mit einem gemeinsamen Praefix (z.B. eine
// Zauberschule). Ein Charakter kann mehrere passende Talente gleichzeitig gewaehlt haben -
// deren Boni werden addiert (Nutzer 2026-07-18: keine Sonderregel fuer Stapelung genannt).
import { TALENT_MAXIMUM_BONUSES } from '../data/talenteMaximum';
import type { CharacterState } from '../state/characterStore';

export function getTalentMaximumBonus(character: CharacterState, referenz: string, kategorie: string): number {
  return TALENT_MAXIMUM_BONUSES
    .filter((b) => (character.selections[b.talentReferenz.toLowerCase()] ?? 0) > 0)
    .filter((b) => {
      if (b.zielReferenz) return b.zielReferenz === referenz;
      if (b.zielKategorie) return b.zielKategorie === kategorie;
      if (b.zielPraefix) return referenz.startsWith(b.zielPraefix);
      return false;
    })
    .reduce((sum, b) => sum + b.bonus, 0);
}
