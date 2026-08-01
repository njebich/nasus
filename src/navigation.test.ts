import { describe, expect, it } from 'vitest';
import {
  DEFAULT_NAVIGATION, MAIN_TABS, getViewRoute, getVisibleSubTabs, normalizeNavigation,
} from './navigation';

describe('zweistufige Navigation', () => {
  it('startet unter Charakter → Grunddaten und besitzt genau sechs Haupttabs', () => {
    expect(MAIN_TABS).toHaveLength(6);
    expect(DEFAULT_NAVIGATION).toEqual({ activeMainTab: 'Charakter', activeSubTab: 'Grunddaten' });
  });

  it('zeigt ausschließlich die Untertabs des gewählten Haupttabs', () => {
    expect(getVisibleSubTabs('Charakter', false)).toEqual([
      'Grunddaten', 'Talente', 'Vor- und Nachteile',
    ]);
    expect(getVisibleSubTabs('Inventar', false)).toHaveLength(10);
  });

  it('blendet Geweihte in beiden Bereichen aus und fällt auf den ersten erlaubten Untertab zurück', () => {
    expect(getVisibleSubTabs('Magie', false)).not.toContain('Geweihte');
    expect(getVisibleSubTabs('Charakterbogen', false)).not.toContain('Geweihte');
    expect(normalizeNavigation({ activeMainTab: 'Magie', activeSubTab: 'Geweihte' }, false))
      .toEqual({ activeMainTab: 'Magie', activeSubTab: 'Spruchmagie' });
    expect(normalizeNavigation({ activeMainTab: 'Charakterbogen', activeSubTab: 'Geweihte' }, false))
      .toEqual({ activeMainTab: 'Charakterbogen', activeSubTab: 'Übersicht' });
  });

  it('gibt Kampf ohne künstlichen Untertab eine vollständige Route', () => {
    expect(normalizeNavigation({ activeMainTab: 'Kampf', activeSubTab: 'Talente' }, true))
      .toEqual({ activeMainTab: 'Kampf', activeSubTab: null });
    expect(getViewRoute('Kampf', null)).toEqual({ kind: 'kampf' });
  });

  it('hält die drei bisherigen berechneten Kategorien vorläufig gemeinsam erreichbar', () => {
    expect(getViewRoute('Charakterwerte', 'Berechnete Werte')).toEqual({
      kind: 'category', categories: ['Charakterwerte', 'Bewegung', 'Gewichtsbelastung'],
    });
  });
});
