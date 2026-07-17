import { describe, it, expect } from 'vitest';
import { getPoolCapBasis, computeGutMax, computeMeisterlichMax } from './poolCaps';

describe('getPoolCapBasis', () => {
  it('leitet die Basis-Waffenart fuer einen Basis-Pool ab', () => {
    expect(getPoolCapBasis('nk_pool_hiebwaffen')).toEqual({ atReferenz: 'at_hiebwaffen', paReferenz: 'pa_hiebwaffen' });
  });

  it('leitet dieselbe Basis-Waffenart fuer einen Spezialisierungs-Pool ab', () => {
    expect(getPoolCapBasis('nk_pool_hiebwaffen_aexte')).toEqual({ atReferenz: 'at_hiebwaffen', paReferenz: 'pa_hiebwaffen' });
    expect(getPoolCapBasis('nk_pool_klingenwaffen_zweihaender')).toEqual({ atReferenz: 'at_klingenwaffen', paReferenz: 'pa_klingenwaffen' });
  });

  it('gibt null zurueck fuer Pools ohne bekanntes Waffenart-Muster', () => {
    expect(getPoolCapBasis('le_leberschutz')).toBeNull();
  });
});

describe('gAT/mAT-max Formeln (bestaetigtes Beispiel: nAT=20 -> gAT=10, mAT=26)', () => {
  it('computeGutMax rundet nAT/2 auf', () => {
    expect(computeGutMax(20)).toBe(10);
    expect(computeGutMax(9)).toBe(5);
  });

  it('computeMeisterlichMax: 21 + AUFRUNDEN((gutMax-1)/2)', () => {
    expect(computeMeisterlichMax(10)).toBe(26); // 21 + AUFRUNDEN(9/2) = 21+5 = 26
  });

  it('computeMeisterlichMax bleibt bei gutMax=0 bei der Basis 21', () => {
    expect(computeMeisterlichMax(0)).toBe(21);
  });
});
