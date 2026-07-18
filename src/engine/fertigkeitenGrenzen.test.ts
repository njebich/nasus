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

  it('Attribute haben Basis-Max 7', () => {
    expect(getFertigkeitBaseMax('Attribute')).toBe(7);
  });

  it('Eigenschaft und andere Kategorien haben KEIN generisches Basis-Max (eigene bzw. keine Regel)', () => {
    expect(getFertigkeitBaseMax('Eigenschaft')).toBeUndefined();
    expect(getFertigkeitBaseMax('KI')).toBeUndefined();
    expect(getFertigkeitBaseMax('Charakterwerte')).toBeUndefined();
  });
});
