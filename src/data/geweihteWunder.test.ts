import { describe, expect, it } from 'vitest';
import { GEWEIHTE_WUNDER } from './geweihteWunder';

describe('GEWEIHTE_WUNDER', () => {
  it('enthaelt die 60 vollstaendigen Eintraege der ueberarbeiteten Wundertabelle', () => {
    expect(GEWEIHTE_WUNDER).toHaveLength(60);
    expect(GEWEIHTE_WUNDER.every((entry) => entry.name.length > 0)).toBe(true);
    expect(GEWEIHTE_WUNDER.every((entry) => entry.ziel.length > 0)).toBe(true);
    expect(GEWEIHTE_WUNDER.every((entry) => entry.ed.length > 0)).toBe(true);
  });

  it('uebernimmt die zuvor unvollstaendigen Tepod-Wunder mit Namen und Werten', () => {
    const uribengebet = GEWEIHTE_WUNDER.find((entry) => entry.typ === 'Tepod' && entry.name === 'Uribengebet');
    expect(uribengebet).toMatchObject({ gebet: 'Ritual', minKarma: 4, malus: 7, kpp: '50' });

    const lahjasKuss = GEWEIHTE_WUNDER.find((entry) => entry.typ === 'Tepod' && entry.name === "Lahja's Kuss");
    expect(lahjasKuss).toMatchObject({ gebet: 'Stoß', ed: 'Karma sec', minKarma: 4, malus: 15, kpp: '70' });
  });
});
