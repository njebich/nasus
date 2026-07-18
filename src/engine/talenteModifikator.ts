// Ermittelt die additiven Talent-Boni (data/talenteModifikator.ts) fuer eine Formel-Referenz.
// Nutzer 2026-07-18 (zweite Runde): "nur die hoechste Stufe zaehlt" gilt auch hier - Zaeher
// Bursche Stufe 1+2 gleichzeitig gewaehlt gibt NICHT 1+3=4 auf Selbstbeherrschung, sondern nur
// Stufe 2s Wert (3), da Stufe 2 die hoehere ist (gleiche Regel wie talenteMaximum.ts).
import { TALENT_MODIFIKATOR_BONUSES } from '../data/talenteModifikator';
import type { CharacterState } from '../state/characterStore';

export function getTalentModifikatorBonus(character: CharacterState, referenz: string): number {
  const matching = TALENT_MODIFIKATOR_BONUSES
    .filter((b) => b.zielReferenz === referenz && (character.selections[b.talentReferenz.toLowerCase()] ?? 0) > 0);
  return matching.reduce((max, b) => Math.max(max, b.bonus), 0);
}
