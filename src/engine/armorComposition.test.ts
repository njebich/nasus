import { describe, it, expect } from 'vitest';
import { composeArmor } from './armorComposition';
import { RUESTUNG_BASIS, RUESTUNG_VERARBEITUNG, RUESTUNG_ANPASSUNG } from '../data/equipment/armor';

describe('composeArmor', () => {
  it('reproduziert das im Entwickeln-Sheet dokumentierte Beispiel exakt (alle 5 Werte)', () => {
    // Stoffruestung + Meisterarbeit + angepasst -> RS=3, BE=1, Preis=227, NW=3, AW=2
    const basis = RUESTUNG_BASIS.find((r) => r.name === 'Stoffrüstung')!;
    const verarbeitung = RUESTUNG_VERARBEITUNG.find((r) => r.name === 'Meisterarbeit')!;
    const anpassung = RUESTUNG_ANPASSUNG.find((r) => r.name === 'angepasst')!;

    const result = composeArmor(basis, verarbeitung, anpassung);
    expect(result).toEqual({ rs: 3, be: 1, preis: 227, verfuegbarkeitNw: 3, verfuegbarkeitAw: 2 });
  });

  it('BE greift auf die Lage-Untergrenze zurueck, wenn Basis+Mods darunter faellt', () => {
    const basis = RUESTUNG_BASIS.find((r) => r.name === 'Leichte Stoffrüstung')!; // Lage=1, BE-Basis=1
    const gesellenarbeit = RUESTUNG_VERARBEITUNG.find((r) => r.name === 'Gesellenarbeit')!; // kein BE-Mod
    const perfekt = RUESTUNG_ANPASSUNG.find((r) => r.name === 'perfekt angepasst')!; // BE-Mod=-2
    const result = composeArmor(basis, gesellenarbeit, perfekt);
    // BE-Basis+Mods = 1+0-2 = -1, aber Lage=1 ist die Untergrenze -> MAX(1;-1) = 1
    expect(result.be).toBe(1);
  });
});
