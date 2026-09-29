import { describe, expect, it } from 'vitest';
import {
  feuerwaffenMunitionOptionen, FEUERWAFFEN_MUNITION_LOOKUP, munitionNachladezeitMod, parseMunitionEffekt,
  schnellsterMunitionNachladezeitMod,
} from './feuerwaffenMunition';
import { ladezeitKr } from '../../engine/fernkampfLadezeit';
import { FEUERWAFFEN } from './fernkampf';
import { composeFeuerwaffe, feuerwaffenStandardauswahl } from '../../engine/feuerwaffenComposition';

describe('feuerwaffenMunitionOptionen', () => {
  it('ordnet Vorderladern beide Munitionsarten im passenden Kaliber zu', () => {
    expect(feuerwaffenMunitionOptionen('Vorderlader', 'Blei', 19).map((row) => row.art))
      .toEqual(['blei_pulver', 'papierpatrone_vl']);
  });

  it('ordnet Hinterladern, Patronenwaffen und Harpunengewehren genau ihre Munition zu', () => {
    expect(feuerwaffenMunitionOptionen('Hinterlader', 'Papier Patrone', 17).map((row) => row.art))
      .toEqual(['papierpatrone']);
    expect(feuerwaffenMunitionOptionen('Klapplauf', 'Messing Patrone', 5).map((row) => row.art))
      .toEqual(['messingpatrone']);
    expect(feuerwaffenMunitionOptionen('Vorderlader', 'Harpune', 16).map((row) => row.art))
      .toEqual(['harpune']);
  });

  it('findet fuer jede Feuerwaffe mindestens eine Option im berechneten Kaliber', () => {
    const ohneMunition = FEUERWAFFEN.filter((weapon) => {
      const composed = composeFeuerwaffe(weapon, feuerwaffenStandardauswahl(weapon));
      return feuerwaffenMunitionOptionen(
        weapon['Lademechanik'] ?? '', composed.munition, composed.kaliber,
      ).length === 0;
    }).map((weapon) => weapon.name);
    expect(ohneMunition).toEqual([]);
  });
});

describe('Alternativmunition-Effekte (LLM-021, DEC-1269)', () => {
  it('parst den Effekttext in einen Nachladezeit-Modifikator und bricht bei unbekanntem Text ab', () => {
    expect(parseMunitionEffekt('Reduziert die Nachladezeit um 5 Sekunden')).toEqual({ nachladezeitMod: -5 });
    expect(() => parseMunitionEffekt('Erhoeht den Schaden')).toThrow();
  });

  it('kennt fuer alle 51 Vorderlader-Zeilen die Papierpatrone mit -5', () => {
    expect(FEUERWAFFEN_MUNITION_LOOKUP.size).toBe(51);
    for (const effekt of FEUERWAFFEN_MUNITION_LOOKUP.values()) {
      expect(effekt).toEqual({ art: 'papierpatrone_vl', nachladezeitMod: -5 });
    }
  });

  it('wirkt nur bei der Alternativmunition, Blei&Pulver und Fremdwaffen bleiben bei 0', () => {
    const [schluessel] = [...FEUERWAFFEN_MUNITION_LOOKUP.keys()];
    const [name, volk] = schluessel.split('|');
    expect(munitionNachladezeitMod(name, volk, 'papierpatrone_vl')).toBe(-5);
    expect(munitionNachladezeitMod(name, volk, 'blei_pulver')).toBe(0);
    expect(munitionNachladezeitMod('Gibt es nicht', volk, 'papierpatrone_vl')).toBe(0);
    expect(schnellsterMunitionNachladezeitMod(name, volk, ['blei_pulver', 'papierpatrone_vl'])).toBe(-5);
    expect(schnellsterMunitionNachladezeitMod(name, volk, [])).toBe(0);
  });

  it('Ladezeit: Beispiel Nachladezeit 39, Ges.-Bon.+Ladeschuetze 10, Teiler 3 (Reduktion 4)', () => {
    expect(ladezeitKr(39, 3, 4, 6)).toBe(35);
    expect(ladezeitKr(39, 3, 4, 6, -5)).toBe(30);
  });

  it('Ladezeit faellt durch den Munitions-Malus nie unter 1 KR', () => {
    expect(ladezeitKr(8, 1, 5, 4, -5)).toBe(1);
  });
});
