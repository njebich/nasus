import { describe, expect, it } from 'vitest';
import { resolveWaffenPoolReferenz, computeWeaponAtPaOverflow } from './waffenPool';
import type { CharacterValueSource } from './rules';

function values(vals: Record<string, number>): CharacterValueSource {
  return {
    getWert: (referenz) => vals[referenz.toLowerCase()] ?? 0,
  };
}

describe('resolveWaffenPoolReferenz', () => {
  it('findet den Spezialisierungs-Pool, wenn er existiert (Text-Match "Pool <Spezialisierung>")', () => {
    expect(resolveWaffenPoolReferenz('Hiebwaffen', 'Äxte')).toBe('nk_pool_hiebwaffen_aexte');
  });

  it('findet den Unbewaffnet-Spezialisierungs-Pool "Pool Boxen"', () => {
    expect(resolveWaffenPoolReferenz('Unbewaffnet', 'Boxen')).toBe('nk_pool_unbewaffnet_boxen');
  });

  it('faellt auf den Hauptfertigkeit-Pool zurueck, wenn keine Spezialisierung existiert', () => {
    // "Biss/Huftritt" hat keinen eigenen "Pool Biss/Huftritt"-Eintrag in den Regeldaten.
    expect(resolveWaffenPoolReferenz('Unbewaffnet', 'Biss/Huftritt')).toBe('nk_pool_unbewaffnet');
  });

  it('wirft, wenn weder Spezialisierungs- noch Hauptfertigkeit-Pool existiert', () => {
    expect(() => resolveWaffenPoolReferenz('Nichtvorhanden', 'Auch nicht')).toThrow();
  });
});

describe('computeWeaponAtPaOverflow', () => {
  it('unc_at_weapon > 20: der Ueberschuss fliesst als atOverflow/paOverflow ins Pool-Budget, natMax/npaMax werden 0', () => {
    // at_hiebwaffen/pa_hiebwaffen (ungedeckelt) = (30+30+30)/3 = 30 fuer beide Seiten.
    const v = values({ eig_g_mut: 30, eig_k_athletik: 30, eig_k_schnelligkeit: 30, nk_hiebwaffen: 30 });
    const overflow = computeWeaponAtPaOverflow('Hiebwaffen', 0, 0, v);
    expect(overflow.uncAtWeapon).toBe(30);
    expect(overflow.uncPaWeapon).toBe(30);
    expect(overflow.natMax).toBe(0);
    expect(overflow.npaMax).toBe(0);
    expect(overflow.atOverflow).toBe(10);
    expect(overflow.paOverflow).toBe(10);
  });

  it('unc_at_weapon <= 20: kein Ueberschuss, natMax/npaMax decken exakt bis 20', () => {
    // at_hiebwaffen (ungedeckelt) = (10+10+10)/3 = 10 (aufgerundet), Waffenbonus -4 -> 6.
    const v = values({ eig_g_mut: 10, eig_k_athletik: 10, eig_k_schnelligkeit: 10, nk_hiebwaffen: 10 });
    const overflow = computeWeaponAtPaOverflow('Hiebwaffen', -4, -4, v);
    expect(overflow.uncAtWeapon).toBe(6);
    expect(overflow.natMax).toBe(14); // 20 - 6
    expect(overflow.atOverflow).toBe(0);
    expect(overflow.paOverflow).toBe(0);
  });
});
