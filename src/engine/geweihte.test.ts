import { describe, it, expect } from 'vitest';
import {
  getMaxKpp, getGeweihtenGradEintrag, hasGeweihterTalent, findSelectedGeweihterReferenz,
  getAktiveGeweihteReligion, isGeweihterReferenzErlaubt, getGeweihtenGrad,
} from './geweihte';

describe('geweihte', () => {
  it('getGeweihtenGradEintrag liefert Titel/KPP-Basis fuer Grad 1 ("Niederer", Nutzer-Antwort 2026-07-22)', () => {
    expect(getGeweihtenGradEintrag(1)).toEqual({ grad: 1, titel: 'Niederer', kppBasis: 100 });
  });

  it('getGeweihtenGradEintrag faellt auf Grad 0 zurueck, wenn der Grad unbekannt ist', () => {
    expect(getGeweihtenGradEintrag(99)).toEqual({ grad: 0, titel: '', kppBasis: 0 });
  });

  it('getMaxKpp = KPP-Basis des Grades + Karma*10 (Nutzer-Antwort 2026-07-22, praezisiert die "Geweihtengrad+Karma*10"-Formel)', () => {
    expect(getMaxKpp(1, 0)).toBe(100);
    expect(getMaxKpp(1, 3)).toBe(130);
    expect(getMaxKpp(0, 5)).toBe(50);
  });

  it('hasGeweihterTalent/findSelectedGeweihterReferenz erkennen ein gewaehltes Stufe-1-Talent', () => {
    const character = { selections: { talente_geweihter_nomna_stufe_1_orthodox: 1 } };
    expect(hasGeweihterTalent(character)).toBe(true);
    expect(findSelectedGeweihterReferenz(character)).toBe('talente_geweihter_nomna_stufe_1_orthodox');
  });

  it('hasGeweihterTalent ist false ohne gewaehltes Gate-Talent', () => {
    expect(hasGeweihterTalent({ selections: {} })).toBe(false);
  });

  it('getAktiveGeweihteReligion loest die Referenz auf Religion+Sekte auf', () => {
    const character = { selections: { talente_geweihter_tepod_stufe_1_orthodox: 1 } };
    expect(getAktiveGeweihteReligion(character)).toEqual({ religion: 'Tepod', sekte: 'Orthodox' });
  });

  describe('isGeweihterReferenzErlaubt (Nutzer 2026-07-22: "gate talents behind chosen religion")', () => {
    it('erlaubt Nicht-Gate-Talente immer, unabhaengig von der Religion', () => {
      expect(isGeweihterReferenzErlaubt('talente_irgendwas_anderes', undefined)).toBe(true);
    });

    it('lehnt ein Gate-Talent ohne gewaehlte Charakter-Religion ab', () => {
      expect(isGeweihterReferenzErlaubt('talente_geweihter_lloth_stufe_1_orthodox', undefined)).toBe(false);
    });

    it('lehnt ein Gate-Talent ab, dessen Religion nicht zur gewaehlten passt', () => {
      expect(isGeweihterReferenzErlaubt('talente_geweihter_lloth_stufe_1_orthodox', 'Tepod, Orthodox')).toBe(false);
    });

    it('lehnt ein Gate-Talent ab, dessen Sekte nicht zur gewaehlten passt (nur Religion allein reicht nicht)', () => {
      expect(isGeweihterReferenzErlaubt('talente_geweihter_lloth_stufe_1_orthodox', 'Lloth, Käsequark')).toBe(false);
      expect(isGeweihterReferenzErlaubt('talente_geweihter_lloth_stufe_1_orthodox', 'Lloth')).toBe(false);
    });

    it('erlaubt ein Gate-Talent, dessen Religion+Sekte exakt passt (case-insensitiv)', () => {
      expect(isGeweihterReferenzErlaubt('talente_geweihter_lloth_stufe_1_orthodox', 'Lloth, Orthodox')).toBe(true);
      expect(isGeweihterReferenzErlaubt('talente_geweihter_lloth_stufe_1_orthodox', 'lloth, orthodox')).toBe(true);
    });
  });

  describe('getGeweihtenGrad (Nutzer-Ask 2026-08-06: Stufenkette statt fixem Grad 1)', () => {
    const sheet = (referenzen: string[]) => ({
      byKategorie: {
        Talente: referenzen.map((referenz) => ({ rule: { referenz }, selected: true })),
      },
    });

    it('ist 0 ohne gewaehltes Geweihter-Talent', () => {
      expect(getGeweihtenGrad(sheet([]))).toBe(0);
    });

    it('ist 1 bei nur Stufe 1', () => {
      expect(getGeweihtenGrad(sheet(['talente_geweihter_lloth_stufe_1_orthodox']))).toBe(1);
    });

    it('liest die hoechste gewaehlte Stufe, nicht nur ob irgendeine gewaehlt ist', () => {
      const gewaehlt = [
        'talente_geweihter_lloth_stufe_1_orthodox',
        'talente_geweihter_lloth_stufe_2_orthodox',
        'talente_geweihter_lloth_stufe_3_orthodox',
      ];
      expect(getGeweihtenGrad(sheet(gewaehlt))).toBe(3);
    });

    it('ignoriert nicht gewaehlte (selected=false) Stufen und andere Talente', () => {
      expect(getGeweihtenGrad({
        byKategorie: {
          Talente: [
            { rule: { referenz: 'talente_geweihter_lloth_stufe_1_orthodox' }, selected: true },
            { rule: { referenz: 'talente_geweihter_lloth_stufe_2_orthodox' }, selected: false },
            { rule: { referenz: 'talente_geweihte_gute_wunder' }, selected: true },
          ],
        },
      })).toBe(1);
    });
  });
});
