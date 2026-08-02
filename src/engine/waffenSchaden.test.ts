import { describe, expect, it } from 'vitest';
import { ceilAwayFromZero, combineDiceNotations, computeSchaden, computeStaerkeBonus } from './waffenSchaden';

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

describe('Schadenswuerfel-Anzeige', () => {
  it('entfernt die fuehrende 1 bei einem einzelnen Wuerfel', () => {
    expect(combineDiceNotations('1W10')).toBe('W10');
  });

  it('zieht gleiche Wuerfel zusammen', () => {
    expect(combineDiceNotations('1W10', '1W10')).toBe('2W10');
    expect(combineDiceNotations('W6+W6')).toBe('2W6');
  });

  it('zeigt unterschiedliche Wuerfel als Summe', () => {
    expect(combineDiceNotations('1W10', '1W8')).toBe('W10+W8');
  });
});

describe('Stä-Mod', () => {
  it('wertet :2-5 als Stärke durch 2, Division aufrunden, danach minus 5', () => {
    expect(computeStaerkeBonus(11, 2, -5)).toBe(1);
    expect(computeStaerkeBonus(10, 2, -5)).toBe(0);
  });

  it('wendet dieselbe Reihenfolge auf den angezeigten Schaden an', () => {
    const axt = { 'Schadenswuerfel-1': 'W20', 'Staerke-Teiler': '2' };
    expect(computeSchaden(axt, -5, 11)).toBe('W20 +1');
  });
});
