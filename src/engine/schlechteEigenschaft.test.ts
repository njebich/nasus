import { describe, it, expect } from 'vitest';
import {
  getSchlechteEigenschaftZielReferenz, hasSchlechteEigenschaft, getSchlechteEigenschaftMax,
} from './schlechteEigenschaft';
import { createCharacter } from '../state/characterStore';

describe('getSchlechteEigenschaftZielReferenz', () => {
  it('loest alle 10 vn_schlechte_eigenschaft_*-Referenzen auf die passende Eigenschaft auf', () => {
    expect(getSchlechteEigenschaftZielReferenz('vn_schlechte_eigenschaft_ausstrahlung')).toBe('eig_k_ausstrahlung');
    expect(getSchlechteEigenschaftZielReferenz('vn_schlechte_eigenschaft_mut')).toBe('eig_g_mut');
    // "Sinnesschaerfe" (Nachteil-Name) vs. "eig_g_sinneschaerfe" (Referenz, fehlendes zweites "s")
    // - die Aufloesung laeuft ueber den Beschreibungstext, nicht ueber String-Anhaengen.
    expect(getSchlechteEigenschaftZielReferenz('vn_schlechte_eigenschaft_sinnesschaerfe')).toBe('eig_g_sinneschaerfe');
  });

  it('gibt undefined fuer eine unbekannte Referenz zurueck', () => {
    expect(getSchlechteEigenschaftZielReferenz('vn_angst_magie_5')).toBeUndefined();
  });
});

describe('hasSchlechteEigenschaft', () => {
  it('ist false ohne den Nachteil', () => {
    const character = createCharacter('Test');
    expect(hasSchlechteEigenschaft(character, 'eig_k_ausstrahlung')).toBe(false);
  });

  it('ist true, wenn der Nachteil fuer genau diese Eigenschaft gewaehlt ist', () => {
    const character = createCharacter('Test');
    character.selections['vn_schlechte_eigenschaft_ausstrahlung'] = 1;
    expect(hasSchlechteEigenschaft(character, 'eig_k_ausstrahlung')).toBe(true);
    expect(hasSchlechteEigenschaft(character, 'eig_k_staerke')).toBe(false);
  });
});

describe('getSchlechteEigenschaftMax', () => {
  it('Erstellungs-Max 7 unterhalb Kreis 3, danach 9', () => {
    expect(getSchlechteEigenschaftMax(0)).toBe(7);
    expect(getSchlechteEigenschaftMax(2)).toBe(7);
    expect(getSchlechteEigenschaftMax(3)).toBe(9);
    expect(getSchlechteEigenschaftMax(5)).toBe(9);
  });
});
