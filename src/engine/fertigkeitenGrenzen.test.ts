import { describe, it, expect } from 'vitest';
import { getFertigkeitBaseMax } from './fertigkeitenGrenzen';

describe('getFertigkeitBaseMax (Nutzer 2026-07-18, im Zuge der Talente-Wirkung-Analyse bestaetigt)', () => {
  it('Grundfertigkeit und Sonderfertigkeit haben Basis-Max 12', () => {
    expect(getFertigkeitBaseMax('Grundfertigkeit')).toBe(12);
    expect(getFertigkeitBaseMax('Sonderfertigkeit')).toBe(12);
  });

  it('Nahkampf/Fernkampf/WHK/Spruchmagie haben Basis-Max 24', () => {
    expect(getFertigkeitBaseMax('Nahkampf')).toBe(24);
    expect(getFertigkeitBaseMax('Fernkampf')).toBe(24);
    expect(getFertigkeitBaseMax('WHK')).toBe(24);
    expect(getFertigkeitBaseMax('Spruchmagie')).toBe(24);
  });

  it('Attribute haben ein kreisabhaengiges Basis-Maximum', () => {
    expect(getFertigkeitBaseMax('Attribute')).toBe(4);
    expect([0, 1, 2, 3, 4].map(kreis => getFertigkeitBaseMax('Attribute', kreis))).toEqual([4, 5, 6, 7, 7]);
  });

  it('KI/PSI haben Basis-Max 24 (Nutzer 2026-07-18, zweite Runde der Talente-Wirkung-Analyse)', () => {
    expect(getFertigkeitBaseMax('KI')).toBe(24);
    expect(getFertigkeitBaseMax('PSI')).toBe(24);
  });

  it('Eigenschaft und andere Kategorien haben KEIN generisches Basis-Max (eigene bzw. keine Regel)', () => {
    expect(getFertigkeitBaseMax('Eigenschaft')).toBeUndefined();
    expect(getFertigkeitBaseMax('Charakterwerte')).toBeUndefined();
  });
});
