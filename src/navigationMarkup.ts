import {
  MAIN_TABS, getMainTabId, getSubTabId, type NavigationState, type SubTab,
} from './navigation';

export function renderNavigationMarkup(
  state: NavigationState,
  visibleSubTabs: readonly SubTab[],
  subTabExtraAttributes: (tab: SubTab) => string = () => '',
): string {
  return `
    <nav class="app-navigation" aria-label="Charakterbereiche">
      <div class="tab-nav main-tab-nav" role="tablist" aria-label="Hauptnavigation">
        ${MAIN_TABS.map((tab) => `<button type="button" id="${getMainTabId(tab)}" class="tab-btn main-tab-btn" data-main-tab="${tab}" role="tab" aria-selected="${state.activeMainTab === tab}" aria-controls="view-container" tabindex="${state.activeMainTab === tab ? '0' : '-1'}">${tab}</button>`).join('')}
      </div>
      ${visibleSubTabs.length > 0 ? `
        <div class="tab-nav sub-tab-nav" role="tablist" aria-label="Unternavigation ${state.activeMainTab}">
          ${visibleSubTabs.map((tab) => `<button type="button" id="${getSubTabId(state.activeMainTab, tab)}" class="tab-btn sub-tab-btn" data-sub-tab="${tab}" role="tab" aria-selected="${state.activeSubTab === tab}" aria-controls="view-container" tabindex="${state.activeSubTab === tab ? '0' : '-1'}"${subTabExtraAttributes(tab)}>${tab}</button>`).join('')}
        </div>` : ''}
    </nav>`;
}
