import { describe, expect, it } from 'vitest';
import { feuerwaffenMunitionOptionen } from './feuerwaffenMunition';
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
