import { describe, expect, it } from 'vitest';
import {
  SPEZIALISIERBARE_WARENGRUPPEN, VORDEFINIERTE_ORTE, WARENGRUPPEN,
  createOrt, validateOrt, type Ort,
} from './orte';

describe('Ortsmodell und kontrollierte Auswahllisten', () => {
  it('enthaelt 43 Warengruppen, davon genau 38 haendlerspezialisierbar', () => {
    expect(WARENGRUPPEN).toHaveLength(43);
    expect(SPEZIALISIERBARE_WARENGRUPPEN).toHaveLength(38);
    for (const id of ['Miete', 'Post', 'Reisekosten', 'Tavernen-Preise', 'Zoll']) {
      expect(WARENGRUPPEN.find((gruppe) => gruppe.id === id)?.haendlerSpezialisierbar).toBe(false);
    }
  });

  it('liefert die validen Beispielorte mit den vereinbarten Haendlern', () => {
    expect(VORDEFINIERTE_ORTE.map((ort) => ort.name)).toEqual([
      'Straitmor', 'Isch-Isch', 'Katharsis', 'Phoenix-Feste', 'Neu Zwoggon', 'Doxxmoxx', 'Grasungen', 'Nemzen',
    ]);
    expect(VORDEFINIERTE_ORTE.find((ort) => ort.id === 'straitmor')?.haendler).toHaveLength(6);
    for (const id of ['isch-isch', 'katharsis', 'neu-zwoggon', 'doxxmoxx', 'grasungen']) {
      expect(VORDEFINIERTE_ORTE.find((ort) => ort.id === id)?.haendler).toHaveLength(SPEZIALISIERBARE_WARENGRUPPEN.length);
    }
    for (const ort of VORDEFINIERTE_ORTE) expect(validateOrt(ort)).toEqual([]);
  });

  it('erzwingt Namen und eine Warengruppe fuer spezialisierte Haendler', () => {
    const ort: Ort = {
      id: 'ungueltig', name: ' ', etablierteMinderheiten: [],
      haendler: [{ typ: 'Spezialisierter Händler', warengruppe: null }], lokaleProduktion: [],
      erstelltAm: '', aktualisiertAm: '',
    };
    expect(validateOrt(ort)).toContain('Name ist ein Pflichtfeld');
    expect(validateOrt(ort)).toContain('Spezialisierter Händler benötigt eine spezialisierbare Warengruppe');
  });

  it('kann einen nur benannten neuen Herkunftsort anlegen', () => {
    const ort = createOrt({
      name: 'Freier Ort', etablierteMinderheiten: [], haendler: [], lokaleProduktion: [],
    });
    expect(ort.name).toBe('Freier Ort');
    expect(ort.id).toBeTruthy();
    expect(validateOrt(ort)).toEqual([]);
  });
});
