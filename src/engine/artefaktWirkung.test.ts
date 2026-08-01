import { describe, expect, it } from 'vitest';
import { ARTEFAKT_BASIS } from '../data/equipment/artefakte';
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
      wirkungswert: '1 TaP', effektdauer: 'sofort', wirkungsdauer: '5 min',
    });
    expect(resolveArtefaktGradWerte(basis('artefakt_grundfertigkeit_erhoehen'), 4)).toMatchObject({
      wirkungswert: '7 TaP', wirkungsdauer: '25 min',
    });
  });

  it('loest Schadenswuerfel und Zusatzwert der Elementpfeile gradabhaengig auf', () => {
    expect(resolveArtefaktGradWerte(basis('artefakt_splitter_pfeil'), 2).wirkungswert)
      .toBe('W6 Elementarschaden / RB 2');
    expect(resolveArtefaktGradWerte(basis('artefakt_schock_pfeil'), 7).wirkungswert)
      .toBe('W20 Elementarschaden / SB 13');
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
