import { describe, it, expect } from 'vitest';
import { describeSkillStufe } from './skillStufen';

describe('describeSkillStufe (Nutzer 2026-07-17: benannte Stufe statt roher Zahl)', () => {
  it('benennt Sprachstufen 0-4', () => {
    expect(describeSkillStufe('ssk_sprache_zwergisch', 0)).toBe('Keine Kenntnis');
    expect(describeSkillStufe('ssk_sprache_zwergisch', 1)).toBe('Grundkenntnis');
    expect(describeSkillStufe('ssk_sprache_zwergisch', 2)).toBe('Gute Kenntnis');
    expect(describeSkillStufe('ssk_sprache_zwergisch', 3)).toBe('Muttersprache');
    expect(describeSkillStufe('ssk_sprache_zwergisch', 4)).toBe('Akademisches Niveau');
  });

  it('benennt Kulturstufen 0-4 (Stufe 3 heisst hier "Vaterland", nicht "Muttersprache")', () => {
    expect(describeSkillStufe('ssk_kultur_zwerge', 0)).toBe('Keine Kenntnis');
    expect(describeSkillStufe('ssk_kultur_zwerge', 3)).toBe('Vaterland');
  });

  it('benennt Sprachstufen auch fuer ssk_schrift_* (seit werte 0.8 dieselbe Kosten-Tabelle wie Sprache)', () => {
    expect(describeSkillStufe('ssk_schrift_zwerge', 2)).toBe('Gute Kenntnis');
  });

  it('gibt undefined fuer unbeteiligte Referenzen zurueck', () => {
    expect(describeSkillStufe('eig_g_mut', 3)).toBeUndefined();
  });
});
