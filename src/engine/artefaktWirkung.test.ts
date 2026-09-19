import { describe, expect, it } from 'vitest';
import { ARTEFAKT_BASIS, ARTEFAKT_KOSTEN } from '../data/equipment/artefakte';
import { artefaktTooltip, resolveArtefaktGradWerte } from './artefaktWirkung';

function basis(referenz: string) {
  const row = ARTEFAKT_BASIS.find((entry) => entry.referenz === referenz);
  if (!row) throw new Error(`Test-Artefakt fehlt: ${referenz}`);
  return row;
}

describe('Artefakt-Gradwerte', () => {
  it('wertet Wirkung, ED und WD mit dem gewaehlten Grad statt dem Grad-7-Basiswert aus', () => {
    const grad1 = resolveArtefaktGradWerte(basis('artefakt_artefakt_analysieren'), 1);
    const grad7 = resolveArtefaktGradWerte(basis('artefakt_artefakt_analysieren'), 7);

    expect(grad1).toMatchObject({
      wirkungswert: 'bis Grad 1 / Magietheorie 5', effektdauer: '3 sec', wirkungsdauer: 'permanent',
    });
    expect(grad7).toMatchObject({
      wirkungswert: 'bis Grad 7 / Magietheorie 35', effektdauer: '21 sec', wirkungsdauer: 'permanent',
    });
  });

  it('uebernimmt die belegte Magie-Parameterreihe fuer Wirkung und WD', () => {
    expect(resolveArtefaktGradWerte(basis('artefakt_grundfertigkeit_erhoehen'), 1)).toMatchObject({
      wirkungswert: '1 TaW', effektdauer: 'sofort', wirkungsdauer: '5 min',
    });
    expect(resolveArtefaktGradWerte(basis('artefakt_grundfertigkeit_erhoehen'), 4)).toMatchObject({
      wirkungswert: '7 TaW', wirkungsdauer: '25 min',
    });
  });

  it('loest Schadenswuerfel und Zusatzwert der Elementpfeile gradabhaengig auf', () => {
    expect(resolveArtefaktGradWerte(basis('artefakt_splitter_pfeil'), 2).wirkungswert)
      .toBe('W6 Elementarschaden / RB 2');
    expect(resolveArtefaktGradWerte(basis('artefakt_schock_pfeil'), 7).wirkungswert)
      .toBe('W20 Elementarschaden / SB 13');
  });

  it('wertet die vier neu integrierten Artefakte gradabhaengig aus', () => {
    expect(resolveArtefaktGradWerte(basis('artefakt_grosser_funkentanz'), 1)).toMatchObject({
      wirkungswert: '1 Erschwerung (NK/FK)', effektdauer: 'sofort', wirkungsdauer: '2,5 sec',
    });
    expect(resolveArtefaktGradWerte(basis('artefakt_grosser_funkentanz'), 7)).toMatchObject({
      wirkungswert: '4 Erschwerung (NK/FK)', wirkungsdauer: '20 sec',
    });
    expect(resolveArtefaktGradWerte(basis('artefakt_magische_verkleidung'), 1)).toMatchObject({
      wirkungswert: undefined, effektdauer: '30 sec', wirkungsdauer: '5 min',
    });
    expect(resolveArtefaktGradWerte(basis('artefakt_manaspende'), 7)).toMatchObject({
      wirkungswert: '40 Mana', effektdauer: '5 sec', wirkungsdauer: 'permanent',
    });
    expect(resolveArtefaktGradWerte(basis('artefakt_durchsichtiger_gegenstand'), 1)).toMatchObject({
      wirkungswert: '2,5 l', effektdauer: 'sofort', wirkungsdauer: '2,5 h',
    });
  });

  it('enthaelt fuer jedes neue Artefakt genau sieben vollstaendig bepreiste Grade', () => {
    for (const referenz of [
      'artefakt_grosser_funkentanz', 'artefakt_magische_verkleidung',
      'artefakt_manaspende', 'artefakt_durchsichtiger_gegenstand',
    ]) {
      const grade = ARTEFAKT_KOSTEN.filter((row) => row.referenz === referenz);
      expect(grade.map((row) => Number(row.grad))).toEqual([1, 2, 3, 4, 5, 6, 7]);
      expect(grade.every((row) => Number(row.kostenEinmalig) > 0 && Number(row.kostenPermanent) > 0)).toBe(true);
    }
  });

  it('liefert fuer jedes Artefakt und jeden kaufbaren Grad Wirkung, ED und WD im Tooltip', () => {
    for (const row of ARTEFAKT_BASIS) {
      for (let grad = 1; grad <= 7; grad += 1) {
        const text = artefaktTooltip(row, grad);
        expect(text).toContain('Wirkung:');
        expect(text).toContain('ED:');
        expect(text).toContain('WD:');
      }
    }
  });
});
