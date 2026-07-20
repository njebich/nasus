import { describe, it, expect } from 'vitest';
import { createCharacter } from './characterStore';
import { setValue, setPoolAllocation, BudgetError, MutationError } from './characterMutations';
import { computeSheet } from '../engine/characterSheet';

// nk_hiebwaffen darf seit dem Fertigkeitsmaximum-Feature (Nutzer 2026-07-18) hoechstens 24
// betragen (Basis-Max fuer Nahkampf/Fernkampf/WHK/Spruchmagie) - daher 24 statt der frueheren 30.
function characterWithHiebwaffenSkill(epGesamt: number, nkHiebwaffen: number) {
  let character = createCharacter('Test');
  character.values['ep_gesamt'] = epGesamt;
  character = setValue(character, 'eig_g_mut', 30);
  character = setValue(character, 'eig_k_athletik', 30);
  character = setValue(character, 'eig_k_schnelligkeit', 30);
  character = setValue(character, 'nk_hiebwaffen', nkHiebwaffen);
  return character;
}

describe('setPoolAllocation', () => {
  it('lehnt eine Nicht-Pool-Referenz ab', () => {
    const character = createCharacter('Test');
    expect(() => setPoolAllocation(character, 'eig_g_mut', { gat: 1, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 })).toThrow(MutationError);
  });

  it('erlaubt eine Zuteilung innerhalb des Pool-Budgets und der gAT/mAT-Obergrenzen', () => {
    // eig_g_mut/eig_k_athletik/eig_k_schnelligkeit=30, nk_hiebwaffen=24 -> AT-Seite (84)/3-20=8,
    // PA-Seite (84)/3-20=8 -> Pool-Budget = 16. at_hiebwaffen = MIN(20;28)=20 -> gAT-max=10, mAT-max=26.
    const character = characterWithHiebwaffenSkill(100000, 24);
    const sheet = computeSheet(character);
    const pool = sheet.byKategorie['Nahkampf']?.find((r) => r.rule.referenz === 'nk_pool_hiebwaffen');
    expect(pool?.computedValue).toBe(16);
    expect(pool?.poolCaps).toEqual({ gatMax: 10, gpaMax: 10, matMax: 26, mpaMax: 26 });

    const updated = setPoolAllocation(character, 'nk_pool_hiebwaffen', { gat: 5, gpa: 5, mat: 0, mpa: 0, nat: 0, npa: 0 });
    expect(updated.poolAllocations['nk_pool_hiebwaffen']).toEqual({ gat: 5, gpa: 5, mat: 0, mpa: 0, nat: 0, npa: 0 });
  });

  it('lehnt eine Zuteilung ab, die das Pool-Budget ueberschreitet', () => {
    const character = characterWithHiebwaffenSkill(100000, 24);
    expect(() => setPoolAllocation(character, 'nk_pool_hiebwaffen', { gat: 15, gpa: 15, mat: 0, mpa: 0, nat: 0, npa: 0 }))
      .toThrow(BudgetError);
  });

  it('lehnt eine Zuteilung ab, die die gAT-Obergrenze ueberschreitet, auch wenn genug Pool-Budget da waere', () => {
    const character = characterWithHiebwaffenSkill(100000, 24);
    // gAT-max ist 10 (siehe oben) - 11 darf nicht gehen, selbst wenn das Budget (16) es zuliesse.
    expect(() => setPoolAllocation(character, 'nk_pool_hiebwaffen', { gat: 11, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 }))
      .toThrow(BudgetError);
  });

  it('lehnt negative Zuteilungswerte ab', () => {
    const character = characterWithHiebwaffenSkill(100000, 24);
    expect(() => setPoolAllocation(character, 'nk_pool_hiebwaffen', { gat: -1, gpa: 0, mat: 0, mpa: 0, nat: 0, npa: 0 }))
      .toThrow(MutationError);
  });
});
