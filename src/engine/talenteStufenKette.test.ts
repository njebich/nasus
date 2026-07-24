import { describe, it, expect } from 'vitest';
import { getVorstufeReferenz, getHoehereStufenReferenzen } from './talenteStufenKette';

describe('talenteStufenKette', () => {
  it('findet die direkte Vorstufe im Regelfall (Praefix vor "_stufe_")', () => {
    expect(getVorstufeReferenz('talente_zaeher_bursche_stufe_2')).toBe('talente_zaeher_bursche_stufe_1');
    expect(getVorstufeReferenz('talente_zaeher_bursche_stufe_3')).toBe('talente_zaeher_bursche_stufe_2');
  });

  it('Stufe 1 hat keine Vorstufe', () => {
    expect(getVorstufeReferenz('talente_zaeher_bursche_stufe_1')).toBeUndefined();
  });

  it('ignoriert einen abweichenden Rest nach der Stufennummer (Mehrfachschuss: Doppelschuss/Tripelschuss)', () => {
    expect(getVorstufeReferenz('talente_mehrfachschuss_stufe_2_tripelschuss'))
      .toBe('talente_mehrfachschuss_stufe_1_doppelschuss');
  });

  it('gruppiert Magus-Talente pro Schule, nicht ueber alle Schulen hinweg', () => {
    expect(getVorstufeReferenz('talente_magus_stufe_2_feuerbeschwoerungs_grossmagus'))
      .toBe('talente_magus_stufe_1_feuerbeschwoerungs_magus');
    expect(getVorstufeReferenz('talente_magus_stufe_3_antimagies_erzmagus'))
      .toBe('talente_magus_stufe_2_antimagies_grossmagus');
    // Andere Schule bei gleicher Stufe darf NICHT als Vorstufe gelten.
    expect(getVorstufeReferenz('talente_magus_stufe_2_feuerbeschwoerungs_grossmagus'))
      .not.toBe('talente_magus_stufe_1_antimagie_magus');
  });

  it('Spruchmagie hat keine Stufe-1-Zeile - Stufe 2 ist die niedrigste vorhandene Stufe', () => {
    expect(getVorstufeReferenz('talente_spruchmagie_stufe_2_zaubern')).toBeUndefined();
    expect(getVorstufeReferenz('talente_spruchmagie_stufe_3_zaubern')).toBe('talente_spruchmagie_stufe_2_zaubern');
  });

  it('findet alle hoeheren Stufen derselben Familie', () => {
    expect(getHoehereStufenReferenzen('talente_grundfertigkeiten_stufe_1')).toEqual(
      expect.arrayContaining([
        'talente_grundfertigkeiten_stufe_2', 'talente_grundfertigkeiten_stufe_3', 'talente_grundfertigkeiten_stufe_4',
      ]),
    );
    expect(getHoehereStufenReferenzen('talente_grundfertigkeiten_stufe_4')).toEqual([]);
  });

  it('eine unbekannte Referenz liefert keine Vor-/Hoeherstufen', () => {
    expect(getVorstufeReferenz('does_not_exist')).toBeUndefined();
    expect(getHoehereStufenReferenzen('does_not_exist')).toEqual([]);
  });
});
