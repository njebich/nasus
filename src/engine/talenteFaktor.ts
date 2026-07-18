// Ermittelt den multiplikativen Talent-Faktor (data/talenteFaktor.ts) fuer eine Formel-Referenz.
// Default 1 (kein Effekt). Nur die hoechste gewaehlte Stufe zaehlt (Nutzer 2026-07-18, gleiche
// Regel wie talenteMaximum.ts/talenteModifikator.ts) - Mana Regeneration Stufe 1+2 gleichzeitig
// gewaehlt gibt x2,0, nicht x1,5*x2,0=x3,0.
import { TALENT_FAKTOR_BONUSES } from '../data/talenteFaktor';
import type { CharacterState } from '../state/characterStore';

export function getTalentFaktorBonus(character: CharacterState, referenz: string): number {
  const matching = TALENT_FAKTOR_BONUSES
    .filter((b) => b.zielReferenz === referenz && (character.selections[b.talentReferenz.toLowerCase()] ?? 0) > 0);
  return matching.reduce((max, b) => Math.max(max, b.faktor), 1);
}
