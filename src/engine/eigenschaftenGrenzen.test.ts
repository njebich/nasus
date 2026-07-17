import { describe, it, expect } from 'vitest';
import { getEigenschaftGrenzen } from './eigenschaftenGrenzen';

describe('getEigenschaftGrenzen (Regel Nutzer 2026-07-17, werte 0.8 / Sheet "Voelker-Maxima")', () => {
  it('loest Volk+Eigenschaft ueber die Beschreibung auf (inkl. Umlaut-Faltung Staerke/Stärke)', () => {
    // Dalkini/Staerke: Erstellungs-Min=11, Erstellungs-Max=23, Max-ab-Kreis3=31
    expect(getEigenschaftGrenzen('Dalkini', 'eig_k_staerke', 0)).toEqual({ min: 11, max: 23 });
  });

  it('nutzt Erstellungs-Max unterhalb Kreis 3, den einheitlichen Wert 31 ab Kreis 3', () => {
    expect(getEigenschaftGrenzen('Dalkini', 'eig_k_staerke', 2)).toEqual({ min: 11, max: 23 });
    expect(getEigenschaftGrenzen('Dalkini', 'eig_k_staerke', 3)).toEqual({ min: 11, max: 31 });
    expect(getEigenschaftGrenzen('Dalkini', 'eig_k_staerke', 5)).toEqual({ min: 11, max: 31 });
  });

  it('ist gross-/kleinschreibungs- und leerzeichenunempfindlich bei der Spezies', () => {
    expect(getEigenschaftGrenzen('dalkini', 'eig_k_staerke', 0)).toEqual({ min: 11, max: 23 });
  });

  it('gibt undefined fuer eine unbekannte Spezies zurueck (z.B. Test-Fixtures wie "Mensch")', () => {
    expect(getEigenschaftGrenzen('Mensch', 'eig_k_staerke', 0)).toBeUndefined();
  });

  it('gibt undefined fuer eine Referenz ausserhalb der 10 Eigenschaften zurueck', () => {
    expect(getEigenschaftGrenzen('Dalkini', 'att_glueck', 0)).toBeUndefined();
  });
});
