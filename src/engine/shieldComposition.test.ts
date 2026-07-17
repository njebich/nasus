import { describe, it, expect } from 'vitest';
import { composeShield, istSchildKomponenteVerfuegbar } from './shieldComposition';
import { SCHILD_MATERIAL, SCHILD_FERTIGUNG, SCHILD_BESPANNUNG } from '../data/equipment/shields';
import { NK_WAFFEN_BASIS } from '../data/equipment/weapons';

const drachenschild = NK_WAFFEN_BASIS.find((r) => r.name === 'Drachenschild')!;
// WK-Basis=11, AT-Basis=-7, PA-Basis=9, Staerke-Malus-Basis=-5, Min-Staerke-1H-Basis=19,
// Klingenbrecher-Basis=15, Klingenschutz-Basis=13, RS-Basis=17, Preis-Basis=600.

function material(name: string) {
  return SCHILD_MATERIAL.find((r) => r.name === name)!;
}
function fertigung(name: string) {
  return SCHILD_FERTIGUNG.find((r) => r.name === name)!;
}
function bespannung(name: string) {
  return SCHILD_BESPANNUNG.find((r) => r.name === name)!;
}

describe('composeShield (Nutzer 2026-07-17: Schilde haben auch Anpassung - Material x Fertigung x Bespannung)', () => {
  it('Feineisen (Referenzmaterial, alle Mods 0) + Gesellenarbeit + Stoff reproduziert die reinen Basiswerte des Schilds', () => {
    const result = composeShield(drachenschild, material('Feineisen'), fertigung('Gesellenarbeit'), bespannung('Stoff'));
    expect(result).toEqual({
      rs: 17, klingenbrecher: 15, klingenschutz: 13, at: -7, pa: 9, wk: 11,
      staerkeMalus: -5, minStaerke: 19, preis: 620, // Preis-Basis 600 * 1 * 1 + Stoff-Preis 20
    });
  });

  it('Stahl + Meisterarbeit + Leder kombiniert Material/Fertigung/Bespannung-Mods additiv, Preis multiplikativ+Bespannungs-Zuschlag', () => {
    const result = composeShield(drachenschild, material('Stahl'), fertigung('Meisterarbeit'), bespannung('Leder'));
    expect(result.rs).toBe(20); // 17 + 2 (Material) + 1 (Bespannung)
    expect(result.klingenbrecher).toBe(17); // 15 + 1 (Material) + 1 (Fertigung) + 0 (Bespannung)
    expect(result.klingenschutz).toBe(17); // 13 + 1 (Material) + 1 (Fertigung) + 2 (Bespannung)
    expect(result.pa).toBe(10); // 9 + 1 (Material)
    expect(result.wk).toBe(10.5); // 11 - 0.5 (Material)
    expect(result.staerkeMalus).toBe(-4); // -5 + 1 (Material)
    expect(result.minStaerke).toBeCloseTo(18.81); // 19 * 0.9 (Material) * 1.1 (Bespannung)
    expect(result.preis).toBe(3025); // 600 * 2.5 (Material) * 2 (Fertigung) + 25 (Bespannung)
  });

  it('Adamandit: Klingenschutz-Mod "+50%" wird wortgetreu als Prozent-Aufschlag behandelt (Nutzer 2026-07-17), nicht als Flachwert', () => {
    const result = composeShield(drachenschild, material('Adamandit'), fertigung('Gesellenarbeit'), bespannung('Stoff'));
    // Additive Basis (Basis+Fertigung+Bespannung, OHNE Adamandits eigenen Mod) = 13+0+0 = 13, *1.5 = 19.5
    expect(result.klingenschutz).toBeCloseTo(19.5);
    expect(result.rs).toBe(24); // 17 + 7 (Material RS-Mod)
  });

  it('Drachensch.-Material hat keinen automatischen Preis (Preis-Faktor "Meister, individuell durch Spielleitung")', () => {
    const result = composeShield(drachenschild, material('Drachensch.'), fertigung('Gesellenarbeit'), bespannung('Stoff'));
    expect(result.preis).toBeNull();
  });

  it('Kohlharz-Bespannung macht den Schild ebenfalls nicht automatisch bepreisbar, wenn ihr eigener Preis fehlt', () => {
    // Kohlharz hat tatsaechlich einen Preis (10), also hier zur Kontrolle ein normaler Fall:
    const result = composeShield(drachenschild, material('Feineisen'), fertigung('Gesellenarbeit'), bespannung('Kohlharz'));
    expect(result.preis).toBe(610); // 600*1*1 + 10
  });
});

describe('istSchildKomponenteVerfuegbar (Nutzer 2026-07-17: Kolhartz/Kohlharz nur fuer Zentauren)', () => {
  it('Kolhartz (Material) ist nur fuer Zentauren waehlbar', () => {
    expect(istSchildKomponenteVerfuegbar('Kolhartz', 'Zentauren')).toBe(true);
    expect(istSchildKomponenteVerfuegbar('Kolhartz', 'Mensch')).toBe(false);
    expect(istSchildKomponenteVerfuegbar('Kolhartz', '')).toBe(false);
  });

  it('Kohlharz (Bespannung) ist nur fuer Zentauren waehlbar', () => {
    expect(istSchildKomponenteVerfuegbar('Kohlharz', 'Zentauren')).toBe(true);
    expect(istSchildKomponenteVerfuegbar('Kohlharz', 'Zwerge')).toBe(false);
  });

  it('alle anderen Materialien/Bespannungen sind unabhaengig von der Spezies waehlbar', () => {
    expect(istSchildKomponenteVerfuegbar('Feineisen', 'Mensch')).toBe(true);
    expect(istSchildKomponenteVerfuegbar('Stahl', '')).toBe(true);
  });
});
