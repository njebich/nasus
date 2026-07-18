// Summiert die additiven Talent-Boni (data/talenteModifikator.ts) fuer eine Formel-Referenz -
// mehrere passende, gleichzeitig gewaehlte Talente werden addiert.
import { TALENT_MODIFIKATOR_BONUSES } from '../data/talenteModifikator';
import type { CharacterState } from '../state/characterStore';

export function getTalentModifikatorBonus(character: CharacterState, referenz: string): number {
  return TALENT_MODIFIKATOR_BONUSES
    .filter((b) => b.zielReferenz === referenz && (character.selections[b.talentReferenz.toLowerCase()] ?? 0) > 0)
    .reduce((sum, b) => sum + b.bonus, 0);
}
