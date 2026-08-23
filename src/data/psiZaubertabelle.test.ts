import { describe, expect, it } from 'vitest';
import { PSI_ZAUBERTABELLE } from './psiZaubertabelle';

describe('PSI-Zaubertabelle 1.421', () => {
  it('enthält alle 15 PSI-Werte mit sieben vollständigen Stufen', () => {
    expect(Object.keys(PSI_ZAUBERTABELLE)).toHaveLength(15);
    for (const eintrag of Object.values(PSI_ZAUBERTABELLE)) {
      expect(eintrag.stufen).toHaveLength(7);
      expect(eintrag.stufen.every((stufe) => stufe.erschwerung !== '' && stufe.mbs !== '')).toBe(true);
    }
  });

  it('übernimmt die getrennten Wirkungen und die neuen Stammdaten', () => {
    const geschoss = PSI_ZAUBERTABELLE.psi_telekinetisches_geschoss;
    expect(geschoss.stufen[0]).toEqual({ erschwerung: '3', mbs: '10', wirkung: 'W4' });
    expect(geschoss.aurabann).toBe('Kein Aurabann');
    expect(geschoss.ziel).toBe('Aura');
    expect(geschoss.regeltext).toContain('SP verteilt auf 3 TZ');
  });
});
