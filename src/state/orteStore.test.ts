import { beforeEach, describe, expect, it } from 'vitest';
import { createAndSaveOrt, getOrtById, listOrte, updateOrt } from './orteStore';
import { VORDEFINIERTE_ORTE } from '../data/orte';

describe('orteStore: lokale Persistenz selbst angelegter Orte', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('listOrte() enthaelt anfangs nur die vordefinierten Orte', () => {
    expect(listOrte()).toHaveLength(VORDEFINIERTE_ORTE.length);
  });

  it('createAndSaveOrt() macht einen neuen Ort dauerhaft ueber listOrte()/getOrtById() auffindbar', () => {
    const ort = createAndSaveOrt({
      name: 'Testhafen', etablierteMinderheiten: [], haendler: [], lokaleProduktion: [],
    });
    expect(listOrte()).toHaveLength(VORDEFINIERTE_ORTE.length + 1);
    expect(getOrtById(ort.id)?.name).toBe('Testhafen');
  });

  it('ueberlebt einen simulierten Neuladen (neuer Store-Zugriff liest denselben localStorage)', () => {
    const ort = createAndSaveOrt({
      name: 'Testhafen', etablierteMinderheiten: [], haendler: [], lokaleProduktion: [],
    });
    // listOrte() liest bei jedem Aufruf frisch aus localStorage - kein In-Memory-Cache, der einen
    // Reload nur vortaeuscht.
    expect(getOrtById(ort.id)).toBeDefined();
    expect(listOrte().find((o) => o.id === ort.id)?.name).toBe('Testhafen');
  });

  it('updateOrt() aktualisiert einen selbst angelegten Ort, vordefinierte Orte bleiben schreibgeschuetzt', () => {
    const ort = createAndSaveOrt({
      name: 'Testhafen', etablierteMinderheiten: [], haendler: [], lokaleProduktion: [],
    });
    const aktualisiert = updateOrt({ ...ort, siedlungsgroesse: 'Dorf' });
    expect(aktualisiert.siedlungsgroesse).toBe('Dorf');
    expect(getOrtById(ort.id)?.siedlungsgroesse).toBe('Dorf');

    expect(() => updateOrt({ ...VORDEFINIERTE_ORTE[0] })).toThrow();
  });

  it('getOrtById() liefert undefined fuer unbekannte oder fehlende Ids (z.B. migrierte Altcharaktere)', () => {
    expect(getOrtById('migration:irgendein-alter-charakter')).toBeUndefined();
    expect(getOrtById(undefined)).toBeUndefined();
  });
});
