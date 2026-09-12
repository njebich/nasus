import { describe, it, expect } from 'vitest';
import { composeWeapon } from './weaponComposition';
import { NK_WAFFEN_BASIS, NK_MATERIAL, NK_FERTIGUNG, NK_ANPASSUNG, NK_SCHAFTMATERIAL } from '../data/equipment/weapons';
import type { GenericRow } from '../data/equipment/armor';

function find(rows: readonly GenericRow[], name: string): GenericRow {
  const row = rows.find((r) => r.name === name);
  if (!row) throw new Error(`Testfixtur '${name}' nicht gefunden`);
  return row;
}

describe('composeWeapon (Nutzer 2026-07-18: NK-Waffen inkl. Herstellungs-Modifikatoren)', () => {
  const axt = find(NK_WAFFEN_BASIS, 'Axt');

  it('neutrale Kombination (Eisen/Gesellenarbeit/Von der Stange/Standard-Schaft) - Axt Basiswerte', () => {
    const composed = composeWeapon(
      axt, find(NK_MATERIAL, 'Eisen'), find(NK_FERTIGUNG, 'Gesellenarbeit'),
      find(NK_ANPASSUNG, 'Von der Stange'), find(NK_SCHAFTMATERIAL, 'Standard'),
    );
    expect(composed.at).toBe(-4);
    expect(composed.pa).toBe(-5);
    expect(composed.wk).toBe(6);
    expect(composed.staerkeMalus).toBe(-6);
    expect(composed.minStaerke1H).toBe(17);
    expect(composed.minStaerke2H).toBe(10);
    expect(composed.klingenbrecher).toBe(17);
    expect(composed.klingenschutz).toBe(7);
    expect(composed.rb).toBe(0);
    expect(composed.rezeptMod).toBe(18); // 8 (Basis) + 10 (Eisen)
    expect(composed.preis).toBe(97); // 1.8*50 + 6 + 1 + 0*0.72
  });

  it('rb (Ruestungsbrechend-Mod) kommt unveraendert von der Basis, keine Modifikator-Tabelle hat eine RB-Spalte', () => {
    const kriegshammer = find(NK_WAFFEN_BASIS, 'Kriegshammer (Schnabel)');
    const composed = composeWeapon(
      kriegshammer, find(NK_MATERIAL, 'Eisen'), find(NK_FERTIGUNG, 'Gesellenarbeit'),
      find(NK_ANPASSUNG, 'Von der Stange'), find(NK_SCHAFTMATERIAL, 'Standard'),
    );
    expect(composed.rb).toBe(4);
  });

  it('volle Kombination (Stahl/Meisterarbeit/angepasst/Eisen Verstaerkt) summiert alle 4 Modifikator-Ebenen', () => {
    const composed = composeWeapon(
      axt, find(NK_MATERIAL, 'Stahl'), find(NK_FERTIGUNG, 'Meisterarbeit'),
      find(NK_ANPASSUNG, 'angepasst'), find(NK_SCHAFTMATERIAL, 'Eisen Verstärkt'),
    );
    expect(composed.at).toBe(-4); // -4 + 0(Stahl) + 1(angepasst) - 1(Schaft)
    expect(composed.pa).toBe(-4); // -5 + 1(Stahl) + 1(angepasst) - 1(Schaft)
    expect(composed.wk).toBeCloseTo(5.5); // 6 - 0.5
    expect(composed.staerkeMalus).toBe(-5); // -6 + 1
    expect(composed.minStaerke1H).toBeCloseTo(15.3); // 17*0.9
    expect(composed.minStaerke2H).toBe(9); // 10*0.9 - 2 + 2
    expect(composed.klingenbrecher).toBe(19); // 17 + 1 + 1
    expect(composed.klingenschutz).toBe(11); // 7 + 1 + 1 + 2
    expect(composed.rezeptMod).toBe(20); // 8 + 12
    expect(composed.preis).toBe(319); // 1.8*125 + 65 + 2 + 37.5*0.72
  });

  it('Preis ist null, wenn die Basis keinen Materialpreis-Faktor hat (unbewaffnete Kampfstile)', () => {
    const totschlaeger = find(NK_WAFFEN_BASIS, 'Totschläger');
    const composed = composeWeapon(
      totschlaeger, find(NK_MATERIAL, 'Eisen'), find(NK_FERTIGUNG, 'Gesellenarbeit'),
      find(NK_ANPASSUNG, 'Von der Stange'), find(NK_SCHAFTMATERIAL, 'Standard'),
    );
    expect(composed.preis).toBeNull();
  });
});

describe('composeWeapon Verfuegbarkeit (Spec-Punkte 32-40, add_nk_waffen_verfuegbarkeit.py)', () => {
  const axt = find(NK_WAFFEN_BASIS, 'Axt');

  it('neutrale Kombination: Basis/Material/Fertigung/Anpassung/Schaftmaterial sind alle 1/1 -> Maximum 1', () => {
    const composed = composeWeapon(
      axt, find(NK_MATERIAL, 'Eisen'), find(NK_FERTIGUNG, 'Gesellenarbeit'),
      find(NK_ANPASSUNG, 'Von der Stange'), find(NK_SCHAFTMATERIAL, 'Standard'),
    );
    expect(composed.verfuegbarkeitAw).toBe(1);
    expect(composed.verfuegbarkeitNw).toBe(1);
  });

  it('numerisches Maximum: Meisterarbeit (2/3) schlaegt die uebrigen 1/1-Komponenten', () => {
    const composed = composeWeapon(
      axt, find(NK_MATERIAL, 'Eisen'), find(NK_FERTIGUNG, 'Meisterarbeit'),
      find(NK_ANPASSUNG, 'Von der Stange'), find(NK_SCHAFTMATERIAL, 'Standard'),
    );
    expect(composed.verfuegbarkeitAw).toBe(2);
    expect(composed.verfuegbarkeitNw).toBe(3);
  });

  it('`M` (Adamandit) schlaegt jeden numerischen Wert (Spec-Punkt 23)', () => {
    const composed = composeWeapon(
      axt, find(NK_MATERIAL, 'Adamandit'), find(NK_FERTIGUNG, 'Meisterarbeit'),
      find(NK_ANPASSUNG, 'Von der Stange'), find(NK_SCHAFTMATERIAL, 'Standard'),
    );
    expect(composed.verfuegbarkeitAw).toBe('M');
    expect(composed.verfuegbarkeitNw).toBe('M');
  });

  it('`NICHT KAUFBAR` (natuerlicher Angriff) schlaegt selbst `M`', () => {
    const unbewaffnet = NK_WAFFEN_BASIS.find((r) => r.name === 'Unbewaffnet' && r['Volk'] === 'Ork')!;
    const composed = composeWeapon(
      unbewaffnet, find(NK_MATERIAL, 'Adamandit'), find(NK_FERTIGUNG, 'Gesellenarbeit'),
      find(NK_ANPASSUNG, 'Von der Stange'), find(NK_SCHAFTMATERIAL, 'Standard'),
    );
    expect(composed.verfuegbarkeitAw).toBe('NICHT KAUFBAR');
    expect(composed.verfuegbarkeitNw).toBe('NICHT KAUFBAR');
  });
});
