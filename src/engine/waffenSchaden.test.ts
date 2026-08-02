import { describe, expect, it } from 'vitest';
import { ceilAwayFromZero } from './waffenSchaden';

describe('ceilAwayFromZero', () => {
  it('rundet einen ungeraden Nebenhand-Halbierungswert auf, nicht ab (gemeldeter Fall: 27/2 -> 14, nicht 13)', () => {
    expect(ceilAwayFromZero(27 / 2)).toBe(14);
  });

  it('rundet negative Werte weg von Null auf (z.B. -27/2 -> -14)', () => {
    expect(ceilAwayFromZero(-27 / 2)).toBe(-14);
  });

  it('laesst gerade Werte unveraendert', () => {
    expect(ceilAwayFromZero(28 / 2)).toBe(14);
  });
});
