import { describe, expect, it } from 'vitest';
import { FEUERWAFFEN } from '../data/equipment/fernkampf';
import { composeFeuerwaffe, feuerwaffenStandardauswahl } from './feuerwaffenComposition';

function n(raw: string | undefined): number {
  return Number(String(raw ?? 0).replace(',', '.'));
}

describe('composeFeuerwaffe (NN_Feuerwaffen_1.1.xlsx)', () => {
  it('bildet alle 86 Excel-Vorlagen mit ihrer Standardauswahl formelgleich ab', () => {
    for (const basis of FEUERWAFFEN) {
      const result = composeFeuerwaffe(basis, feuerwaffenStandardauswahl(basis));
      expect(result.gewicht, basis.name).toBeCloseTo(n(basis['Gewicht']), 8);
      expect(result.minStaerke, basis.name).toBeCloseTo(n(basis['Min. Stä']), 8);
      expect(result.ersterWuerfel, basis.name).toBe(basis['1.W']);
      expect(result.zweiterWuerfel, basis.name).toBe(basis['2.W']);
      expect(result.fixschaden, basis.name).toBeCloseTo(n(basis['Fixschaden']), 8);
      expect(result.rb, basis.name).toBeCloseTo(n(basis['RB']), 8);
      expect(result.kaliber, basis.name).toBeCloseTo(n(basis['Kaliber']), 8);
      expect(result.rwMod, basis.name).toEqual(['10m', '30m', '60m', '100m', '150m', '210m'].map((h) => n(basis[h])));
      expect(result.rw, basis.name).toBeCloseTo(n(basis['RW']), 8);
      expect(result.nachladezeit, basis.name).toBeCloseTo(n(basis['Nachladezeit']), 8);
      expect(result.nachladenTawTeiler, basis.name).toBeCloseTo(n(basis['Nachladen TaW-Teiler']), 8);
      expect(result.patzermodifikator, basis.name).toBeCloseTo(n(basis['Patzermodifikator']), 8);
      expect(result.verfuegbarkeitRaw, basis.name).toBeCloseTo(n(basis['Verfügbarkeit']), 8);
      expect(result.verfuegbarkeitStufe, basis.name).toBe(n(basis['Verfuegbarkeit (1-7)']));
      expect(result.preisDublonen, basis.name).toBeCloseTo(n(basis['Preis']), 8);
      expect(result.herstellungszeit, basis.name).toBeCloseTo(n(basis['Herstellungszeit']), 8);
      expect(result.materialpreis, basis.name).toBeCloseTo(n(basis['Materialpreis']), 8);
      expect(result.ini, basis.name).toBe(n(basis['Ini']));
      expect(result.munition, basis.name).toBe(basis['Munition']);
    }
  });
});
