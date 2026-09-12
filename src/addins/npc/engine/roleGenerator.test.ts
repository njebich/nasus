import { describe, expect, it } from 'vitest';
import { generateFromRoleStub } from './roleGenerator';
import { WACHE_STUB, HAUPTMANN_STUB } from '../data/roleStubs';

describe('generateFromRoleStub (Wache)', () => {
  const cases: Array<[string, { firearmSet?: string } | undefined]> = [
    ['Goblins', undefined],
    ['Zwerge', undefined],
    // Orks haben keine im Katalog kaufbare eigene Feuerwaffe (alle Verfügbarkeit ≥5) - Garnison
    // ist hier bewusst zwergisch bestückt (Nutzer 2026-09-11: Waffenkammer statt Spezies).
    ['Orks', { firearmSet: 'Zwergisch' }],
    ['Trolle', undefined],
  ];

  it.each(cases)('erzeugt einen gültigen Kreis-1-Wache-NSC für %s', (spezies, options) => {
    const result = generateFromRoleStub(spezies, '1', WACHE_STUB, options);
    expect(result.issues, `Regelverstöße für ${spezies}: ${result.issues.join(' | ')}`).toEqual([]);
    expect(result.spSpent).toBeLessThanOrEqual(result.spTotal);
    expect(result.tapSpent).toBeLessThanOrEqual(result.tapTotal);
    expect(result.dublonenSpent).toBeLessThanOrEqual(result.dublonenTotal);
  }, 20000);
});

describe('generateFromRoleStub (Hauptmann)', () => {
  const cases: Array<[string, { firearmSet?: string } | undefined]> = [
    ['Orks', { firearmSet: 'Zwergisch' }],
    ['Goblins', undefined],
  ];

  it.each(cases)('erzeugt einen gültigen Kreis-3+-Hauptmann-NSC für %s', (spezies, options) => {
    const result = generateFromRoleStub(spezies, '3+', HAUPTMANN_STUB, options);
    expect(result.issues, `Regelverstöße für ${spezies}: ${result.issues.join(' | ')}`).toEqual([]);
    expect(result.spSpent).toBeLessThanOrEqual(result.spTotal);
    expect(result.tapSpent).toBeLessThanOrEqual(result.tapTotal);
    expect(result.dublonenSpent).toBeLessThanOrEqual(result.dublonenTotal);
  }, 20000);
});
