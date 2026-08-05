import { Window } from 'happy-dom';
import { describe, expect, it } from 'vitest';
import { getActiveNavigationTabId, getVisibleSubTabs } from './navigation';
import { renderNavigationMarkup } from './navigationMarkup';

describe('Navigations-Markup', () => {
  it('verknüpft genau die aktiven Tabs per ARIA mit dem gemeinsamen Inhaltsbereich', () => {
    const state = { activeMainTab: 'Charakter' as const, activeSubTab: 'Talente' as const };
    const window = new Window();
    window.document.body.innerHTML = `${renderNavigationMarkup(
      state,
      getVisibleSubTabs(state.activeMainTab, false),
    )}<main id="view-container" role="tabpanel" aria-labelledby="${getActiveNavigationTabId(state)}"></main>`;

    const mainTabs = [...window.document.querySelectorAll('.main-tab-btn')];
    const subTabs = [...window.document.querySelectorAll('.sub-tab-btn')];
    expect(mainTabs).toHaveLength(6);
    expect(subTabs).toHaveLength(5);
    expect(window.document.querySelectorAll('[role="tab"][aria-selected="true"]')).toHaveLength(2);
    expect(window.document.querySelectorAll('[role="tab"][tabindex="0"]')).toHaveLength(2);
    expect(window.document.querySelectorAll('[role="tab"][aria-controls="view-container"]'))
      .toHaveLength(11);
    expect(window.document.querySelector('[role="tabpanel"]')?.getAttribute('aria-labelledby'))
      .toBe('sub-tab-1-2');
  });

  it('beschriftet Kampf ohne künstliche Unternavigation über den aktiven Haupttab', () => {
    const state = { activeMainTab: 'Kampf' as const, activeSubTab: null };
    const window = new Window();
    window.document.body.innerHTML = renderNavigationMarkup(state, []);

    expect(window.document.querySelector('.sub-tab-nav')).toBeNull();
    expect(getActiveNavigationTabId(state)).toBe('main-tab-3');
  });
});
