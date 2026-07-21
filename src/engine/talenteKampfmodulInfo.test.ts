import { describe, it, expect } from 'vitest';
import { getOwnedKampfmodulTalentInfo } from './talenteKampfmodulInfo';
import { createCharacter } from '../state/characterStore';
import { TALENTE_KAMPFMODUL } from '../data/talenteKampfmodul';

describe('getOwnedKampfmodulTalentInfo (Nutzer 2026-07-21: Talente-Wirkung, Kampfmodul-Info-Zeilen)', () => {
  it('gibt eine leere Liste zurueck, wenn kein Kampfmodul-Talent gewaehlt ist', () => {
    const character = createCharacter('Test');
    expect(getOwnedKampfmodulTalentInfo(character)).toEqual([]);
  });

  it('listet ein gewaehltes Talent mit Name und Wirkungstext', () => {
    const character = createCharacter('Test');
    character.selections['talente_wuchtschlag'] = 1;
    const rows = getOwnedKampfmodulTalentInfo(character);
    expect(rows).toHaveLength(1);
    expect(rows[0].referenz).toBe('talente_wuchtschlag');
    expect(rows[0].name).toMatch(/Wuchtschlag/);
    expect(rows[0].wirkung.length).toBeGreaterThan(0);
  });

  it('ignoriert Talente, die nicht gewaehlt sind, auch wenn sie in der Kampfmodul-Liste stehen', () => {
    const character = createCharacter('Test');
    character.selections['talente_wuchtschlag'] = 0;
    expect(getOwnedKampfmodulTalentInfo(character)).toEqual([]);
  });

  it('jede Referenz in TALENTE_KAMPFMODUL ist in rules.json auffindbar (kein stiller Datenverlust)', async () => {
    const { RULES } = await import('../data/rules');
    const referenzSet = new Set(RULES.map((r) => r.referenz));
    for (const referenz of TALENTE_KAMPFMODUL) {
      expect(referenzSet.has(referenz)).toBe(true);
    }
  });
});
