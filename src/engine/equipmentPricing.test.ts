import { describe, it, expect } from 'vitest';
import { previewPreislistePrice, previewArtefaktPrice } from './equipmentPricing';
import type { PreislisteRow } from '../data/equipment/preisliste';
import type { ArtefaktKosten } from '../data/equipment/artefakte';

describe('previewPreislistePrice', () => {
  it('multipliziert den Einzelpreis mit der Menge', () => {
    const row: PreislisteRow = { sourceRow: 1, preisAvailable: true, preisDublonen: 10 };
    expect(previewPreislistePrice(row, 3)).toBe(30);
  });

  it('gibt null zurueck wenn kein Preis verfuegbar ist (Sentinel wie "nicht V.")', () => {
    const row: PreislisteRow = { sourceRow: 1, preisAvailable: false, preisRoh: 'nicht V.' };
    expect(previewPreislistePrice(row, 1)).toBeNull();
  });
});

describe('previewArtefaktPrice', () => {
  const kostenRow: ArtefaktKosten = {
    sourceRow: 1, referenz: 'artefakt_licht', grad: '1', kostenEinmalig: '76', kostenPermanent: '525',
  };

  it('liefert den einmaligen Preis', () => {
    expect(previewArtefaktPrice(kostenRow, 'einmalig')).toBe(76);
  });

  it('liefert den permanenten Preis', () => {
    expect(previewArtefaktPrice(kostenRow, 'permanent')).toBe(525);
  });

  it('gibt null zurueck (statt zu crashen) wenn kostenEinmalig fehlt (permanente-Artefakte, ~49 echte Zeilen)', () => {
    const permanentOnly: ArtefaktKosten = {
      sourceRow: 352, referenz: 'artefakt_attributs_artefakt_aura', grad: '1', kostenPermanent: '705',
    };
    expect(previewArtefaktPrice(permanentOnly, 'einmalig')).toBeNull();
    expect(previewArtefaktPrice(permanentOnly, 'permanent')).toBe(705);
  });
});
