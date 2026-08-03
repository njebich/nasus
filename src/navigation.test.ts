import { describe, expect, it } from 'vitest';
import {
  DEFAULT_NAVIGATION, MAIN_TABS, getActiveNavigationTabId, getMainTabId, getSubTabId,
  getViewRoute, getVisibleSubTabs, normalizeNavigation,
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

  it('ordnet die Charakterwerte-Untertabs exakt und vollständig den bestehenden Kategorien zu', () => {
    expect(getVisibleSubTabs('Charakterwerte', false)).toEqual([
      'Eigenschaft', 'Attribute', 'Berechnete Werte', 'Sonderfertigkeiten',
      'Grundfertigkeiten', 'Nahkampf', 'Fernkampf', 'WHK', 'SSK',
    ]);
    expect(getViewRoute('Charakterwerte', 'Sonderfertigkeiten')).toEqual({
      kind: 'category', title: 'Sonderfertigkeiten', categories: ['Sonderfertigkeit'],
    });
    expect(getViewRoute('Charakterwerte', 'Grundfertigkeiten')).toEqual({
      kind: 'category', title: 'Grundfertigkeiten', categories: ['Grundfertigkeit'],
    });
    expect(getViewRoute('Charakterwerte', 'SSK')).toEqual({
      kind: 'category', title: 'SSK', categories: ['Sprache & Kultur'],
    });
  });

  it('blendet Geweihte in beiden Bereichen aus und fällt auf den ersten erlaubten Untertab zurück', () => {
    expect(getVisibleSubTabs('Magie', false)).not.toContain('Geweihte');
    expect(getVisibleSubTabs('Charakterbogen', false)).not.toContain('Geweihte');
    expect(normalizeNavigation({ activeMainTab: 'Magie', activeSubTab: 'Geweihte' }, false))
      .toEqual({ activeMainTab: 'Magie', activeSubTab: 'Spruchmagie' });
    expect(normalizeNavigation({ activeMainTab: 'Charakterbogen', activeSubTab: 'Geweihte' }, false))
      .toEqual({ activeMainTab: 'Charakterbogen', activeSubTab: 'Übersicht' });
  });

  it('bündelt alle vier bisherigen Magie-Arbeitsansichten ausschließlich unter Magie', () => {
    expect(MAIN_TABS).not.toEqual(expect.arrayContaining(['Spruchmagie', 'KI', 'PSI', 'Geweihte']));
    expect(getVisibleSubTabs('Magie', true)).toEqual(['Spruchmagie', 'KI', 'PSI', 'Geweihte']);
    expect(getViewRoute('Magie', 'Spruchmagie')).toEqual({ kind: 'spruchmagie' });
    expect(getViewRoute('Magie', 'KI')).toEqual({ kind: 'ki' });
    expect(getViewRoute('Magie', 'PSI')).toEqual({ kind: 'psi' });
    expect(getViewRoute('Magie', 'Geweihte')).toEqual({ kind: 'geweihte' });
  });

  it('routet alle sieben Charakterbogen-Untertabs auf reine Ausgaben', () => {
    expect(getViewRoute('Charakterbogen', 'Übersicht')).toEqual({ kind: 'charakterbogen' });
    expect(getViewRoute('Charakterbogen', 'Spruchmagie')).toEqual({ kind: 'charakterbogen-spruchmagie' });
    expect(getViewRoute('Charakterbogen', 'Grimoire')).toEqual({ kind: 'charakterbogen-grimoire' });
    expect(getViewRoute('Charakterbogen', 'KI')).toEqual({ kind: 'charakterbogen-ki' });
    expect(getViewRoute('Charakterbogen', 'PSI')).toEqual({ kind: 'charakterbogen-psi' });
    expect(getViewRoute('Charakterbogen', 'Geweihte')).toEqual({ kind: 'charakterbogen-geweihte' });
    expect(getViewRoute('Charakterbogen', 'Inventar')).toEqual({ kind: 'charakterbogen-inventar' });
  });

  it('gibt Kampf ohne künstlichen Untertab eine vollständige Route', () => {
    expect(normalizeNavigation({ activeMainTab: 'Kampf', activeSubTab: 'Talente' }, true))
      .toEqual({ activeMainTab: 'Kampf', activeSubTab: null });
    expect(getViewRoute('Kampf', null)).toEqual({ kind: 'kampf' });
  });

  it('liefert stabile ARIA-Bezüge für Haupttabs, Untertabs und den Inhaltsbereich', () => {
    expect(getMainTabId('Charakter')).toBe('main-tab-1');
    expect(getSubTabId('Charakter', 'Grunddaten')).toBe('sub-tab-1-0');
    expect(getActiveNavigationTabId(DEFAULT_NAVIGATION)).toBe('sub-tab-1-0');
    expect(getActiveNavigationTabId({ activeMainTab: 'Kampf', activeSubTab: null }))
      .toBe('main-tab-3');
  });

  it('fasst Charakterwerte, Bewegung und Gewichtsbelastung unter Berechnete Werte zusammen', () => {
    expect(getViewRoute('Charakterwerte', 'Berechnete Werte')).toEqual({
      kind: 'category', title: 'Berechnete Werte',
      categories: ['Charakterwerte', 'Bewegung', 'Gewichtsbelastung'],
    });
  });

  it('routet Besitz und genau neun getrennte Kaufbereiche', () => {
    const inventarTabs = getVisibleSubTabs('Inventar', false);
    expect(inventarTabs).toEqual([
      'Besitz', 'Rüstung', 'Schilde', 'Waffen', 'Bögen', 'Armbrüste',
      'Feuerwaffen', 'Alchemika', 'Preisliste', 'Artefakte',
    ]);
    expect(inventarTabs.slice(1)).toHaveLength(9);
    expect(getViewRoute('Inventar', 'Besitz')).toEqual({ kind: 'ausruestung', category: 'Besitz' });
    expect(getViewRoute('Inventar', 'Bögen')).toEqual({ kind: 'ausruestung', category: 'Bögen' });
  });
});
