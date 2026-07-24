import { describe, expect, it } from 'vitest';
import { resolveXKlingeWirkung, xKlingeTooltip } from './xKlinge';

describe('X-Klinge Wirkungsstufen aus dem SPOT', () => {
  it.each([
    [1, 2, 'W6'],
    [4, 5, 'W12'],
    [7, 8, 'W30'],
  ])('Flammen-Klinge Grad %i nutzt wegen Offset Wirkungsstufe %i (%s)', (grad, stufe, dice) => {
    const result = resolveXKlingeWirkung('artefakt_flammen_klinge', grad);
    expect(result.wirkungsstufe).toBe(stufe);
    expect(result.schadenswuerfel).toBe(dice);
    expect(result.rb).toBeUndefined();
  });

  it.each([
    [1, 'W4', 2],
    [4, 'W10', 2],
    [7, 'W20', 8],
  ])('Splitter-Klinge Grad %i nutzt %s und RB +%i', (grad, dice, rb) => {
    const result = resolveXKlingeWirkung('artefakt_splitter_klinge', grad);
    expect(result.schadenswuerfel).toBe(dice);
    expect(result.rb).toBe(rb);
    expect(result.schadenselement).toBe('Erde');
  });

  it('Tooltip enthält Grad, Wirkungsstufe, Schaden, Zusatzwert und vollständigen Wirkungstext', () => {
    const tooltip = xKlingeTooltip(resolveXKlingeWirkung('artefakt_schock_klinge', 5));
    expect(tooltip).toContain('Artefakt-Grad: 5');
    expect(tooltip).toContain('Wirkungsstufe: 5');
    expect(tooltip).toContain('Elementarschaden: W12 Schock');
    expect(tooltip).toContain('SB: 4');
    expect(tooltip).toContain('Sobald das Ziel 1 SP erleidet');
  });
});
