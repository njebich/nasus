import { describe, expect, it } from 'vitest';
import { computeSchaden, computeStaerkeBonus } from './waffenSchaden';

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
