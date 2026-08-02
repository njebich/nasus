import { describe, expect, it } from 'vitest';
import { resolveRw } from './spruchmagieRw';

describe('resolveRw', () => {
  const macht = 10;
  const magie = 8;
  const aura = 6;
  const mana = 60;

  it('wertet (M)-Formeln aus', () => {
    expect(resolveRw('(M)*10m', macht, magie, aura, mana)).toBe('100m');
    expect(resolveRw('(M)/2m', macht, magie, aura, mana)).toBe('5m');
    expect(resolveRw('(M)*6cm', macht, magie, aura, mana)).toBe('60cm');
    expect(resolveRw('(M)*10km', macht, magie, aura, mana)).toBe('100km');
  });

  it('wertet Magie-/Aura-Formeln aus', () => {
    expect(resolveRw('Magie*4m', macht, magie, aura, mana)).toBe('32m');
    expect(resolveRw('Aura/3m', macht, magie, aura, mana)).toBe('2m');
  });

  it('wertet Radius-Formeln aus, mit und ohne Leerzeichen vor "Radius"', () => {
    expect(resolveRw('(M)/2m Radius', macht, magie, aura, mana)).toBe('5m Radius');
    expect(resolveRw('Magie*kmRadius', macht, magie, aura, mana)).toBe('8km Radius');
    expect(resolveRw('(M)*mRadius', macht, magie, aura, mana)).toBe('10m Radius');
  });

  it('loest den verschachtelten Mana-Sonderfall auf', () => {
    expect(resolveRw('(M)*(Mana/30)m', macht, magie, aura, mana)).toBe('20m');
  });

  it('reicht Literale wie Selbst/Beruehrung unveraendert durch', () => {
    expect(resolveRw('Selbst', macht, magie, aura, mana)).toBe('Selbst');
    expect(resolveRw('Berührung', macht, magie, aura, mana)).toBe('Berührung');
  });

  it('faellt bei fehlendem Wert auf "–" zurueck', () => {
    expect(resolveRw(undefined, macht, magie, aura, mana)).toBe('–');
  });
});
