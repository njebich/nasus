import { describe, it, expect } from 'vitest';
import { composeArmor, computeRbe } from './armorComposition';
import { RUESTUNG_BASIS, RUESTUNG_VERARBEITUNG, RUESTUNG_ANPASSUNG } from '../data/equipment/armor';

describe('composeArmor', () => {
  it('reproduziert das im Entwickeln-Sheet dokumentierte Beispiel exakt (alle 5 Werte)', () => {
    // Stoffruestung + Meisterarbeit + angepasst -> RS=3, RH=1, Preis=227, NW=3, AW=2
    const basis = RUESTUNG_BASIS.find((r) => r.name === 'Stoffrüstung')!;
    const verarbeitung = RUESTUNG_VERARBEITUNG.find((r) => r.name === 'Meisterarbeit')!;
    const anpassung = RUESTUNG_ANPASSUNG.find((r) => r.name === 'angepasst')!;

    const result = composeArmor(basis, verarbeitung, anpassung);
    expect(result).toEqual({ rs: 3, rh: 1, preis: 227, verfuegbarkeitNw: 3, verfuegbarkeitAw: 2 });
  });

  it('RH greift auf die Lage-Untergrenze zurueck, wenn Basis+Mods darunter faellt', () => {
    const basis = RUESTUNG_BASIS.find((r) => r.name === 'Leichte Stoffrüstung')!; // Lage=1, BE-Basis=1
    const gesellenarbeit = RUESTUNG_VERARBEITUNG.find((r) => r.name === 'Gesellenarbeit')!; // kein BE-Mod
    const perfekt = RUESTUNG_ANPASSUNG.find((r) => r.name === 'perfekt angepasst')!; // BE-Mod=-2
    const result = composeArmor(basis, gesellenarbeit, perfekt);
    // BE-Basis+Mods = 1+0-2 = -1, aber Lage=1 ist die Untergrenze -> MAX(1;-1) = 1
    expect(result.rh).toBe(1);
  });
});

describe('computeRbe (Regelkorrektur Nutzer 2026-07-17)', () => {
  it('berechnet RBE = (RHg - ((Kon/5 + Staerke)/2 + sf_ruestungsmanoever)) / 6', () => {
    // RHg=30, Kon=10, Staerke=10, RSM=0 -> (30 - ((2+10)/2 + 0)) / 6 = (30-6)/6 = 4
    expect(computeRbe(30, 10, 10, 0)).toBe(4);
  });

  it('sf_ruestungsmanoever mindert RBE zusaetzlich zum Kon/Staerke-Anteil', () => {
    // RHg=30, Kon=10, Staerke=10, RSM=3 -> (30 - (6 + 3)) / 6 = 21/6 = 3.5
    expect(computeRbe(30, 10, 10, 3)).toBe(3.5);
  });
});
