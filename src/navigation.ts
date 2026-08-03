export const MAIN_TABS = [
  'Charakterbogen',
  'Charakter',
  'Charakterwerte',
  'Kampf',
  'Inventar',
  'Magie',
] as const;

export type MainTab = (typeof MAIN_TABS)[number];

export const SUB_TABS = {
  Charakterbogen: ['Übersicht', 'Spruchmagie', 'Grimoire', 'KI', 'PSI', 'Geweihte', 'Inventar'],
  Charakter: ['Grunddaten', 'Talente', 'Vor- und Nachteile'],
  Charakterwerte: [
    'Eigenschaft', 'Attribute', 'Berechnete Werte', 'Sonderfertigkeiten',
    'Grundfertigkeiten', 'Nahkampf', 'Fernkampf', 'WHK', 'SSK',
  ],
  Kampf: [],
  Inventar: [
    'Besitz', 'Rüstung', 'Schilde', 'Waffen', 'Bögen', 'Armbrüste',
    'Feuerwaffen', 'Alchemika', 'Preisliste', 'Artefakte',
  ],
  Magie: ['Spruchmagie', 'KI', 'PSI', 'Geweihte'],
} as const satisfies Record<MainTab, readonly string[]>;

export type SubTab = (typeof SUB_TABS)[MainTab][number];
export type InventarSubTab = (typeof SUB_TABS)['Inventar'][number];

export interface NavigationState {
  activeMainTab: MainTab;
  activeSubTab: SubTab | null;
}

export const DEFAULT_NAVIGATION: NavigationState = {
  activeMainTab: 'Charakter',
  activeSubTab: 'Grunddaten',
};

export function getVisibleSubTabs(mainTab: MainTab, showGeweihte: boolean): readonly SubTab[] {
  return SUB_TABS[mainTab].filter((tab) => tab !== 'Geweihte' || showGeweihte) as readonly SubTab[];
}

export function getMainTabId(tab: MainTab): string {
  return `main-tab-${MAIN_TABS.indexOf(tab)}`;
}

export function getSubTabId(mainTab: MainTab, tab: SubTab): string {
  return `sub-tab-${MAIN_TABS.indexOf(mainTab)}-${SUB_TABS[mainTab].indexOf(tab as never)}`;
}

/** Identifies the selected tab that labels the shared view panel. */
export function getActiveNavigationTabId(state: NavigationState): string {
  return state.activeSubTab === null
    ? getMainTabId(state.activeMainTab)
    : getSubTabId(state.activeMainTab, state.activeSubTab);
}

/** Keeps every navigation state on a visible route and supplies the default subtab for a main tab. */
export function normalizeNavigation(
  state: NavigationState,
  showGeweihte: boolean,
): NavigationState {
  const visibleSubTabs = getVisibleSubTabs(state.activeMainTab, showGeweihte);
  if (visibleSubTabs.length === 0) {
    return { activeMainTab: state.activeMainTab, activeSubTab: null };
  }
  if (state.activeSubTab !== null && visibleSubTabs.includes(state.activeSubTab)) return state;
  return { activeMainTab: state.activeMainTab, activeSubTab: visibleSubTabs[0] };
}

export type ViewRoute =
  | { kind: 'grunddaten' }
  | { kind: 'charakterbogen' }
  | { kind: 'charakterbogen-spruchmagie' | 'charakterbogen-grimoire' | 'charakterbogen-ki' | 'charakterbogen-psi' | 'charakterbogen-geweihte' | 'charakterbogen-inventar' }
  | { kind: 'category'; title: CharacterValuesSubTab; categories: readonly string[] }
  | { kind: 'auswahl'; category: 'Talente' | 'Vor- und Nachteile'; isTalent: boolean }
  | { kind: 'kampf' }
  | { kind: 'ausruestung'; category: InventarSubTab }
  | { kind: 'ki' | 'spruchmagie' | 'psi' | 'geweihte' };

export type CharacterValuesSubTab = (typeof SUB_TABS)['Charakterwerte'][number];

const CATEGORIES_BY_CHARACTER_VALUES_SUB_TAB = {
  Eigenschaft: ['Eigenschaft'],
  Attribute: ['Attribute'],
  'Berechnete Werte': ['Charakterwerte', 'Bewegung', 'Gewichtsbelastung'],
  Sonderfertigkeiten: ['Sonderfertigkeit'],
  Grundfertigkeiten: ['Grundfertigkeit'],
  Nahkampf: ['Nahkampf'],
  Fernkampf: ['Fernkampf'],
  WHK: ['WHK'],
  SSK: ['Sprache & Kultur'],
} as const satisfies Record<CharacterValuesSubTab, readonly string[]>;

/** Central bridge from the new visible navigation to the existing view/category names. */
export function getViewRoute(mainTab: MainTab, subTab: SubTab | null): ViewRoute {
  if (mainTab === 'Kampf') return { kind: 'kampf' };
  if (mainTab === 'Charakterbogen') {
    if (subTab === 'Spruchmagie') return { kind: 'charakterbogen-spruchmagie' };
    if (subTab === 'Grimoire') return { kind: 'charakterbogen-grimoire' };
    if (subTab === 'KI') return { kind: 'charakterbogen-ki' };
    if (subTab === 'PSI') return { kind: 'charakterbogen-psi' };
    if (subTab === 'Geweihte') return { kind: 'charakterbogen-geweihte' };
    if (subTab === 'Inventar') return { kind: 'charakterbogen-inventar' };
    return { kind: 'charakterbogen' };
  }
  if (mainTab === 'Inventar') {
    const category = SUB_TABS.Inventar.includes(subTab as InventarSubTab) ? subTab as InventarSubTab : 'Besitz';
    return { kind: 'ausruestung', category };
  }

  if (mainTab === 'Charakter') {
    if (subTab === 'Talente') return { kind: 'auswahl', category: 'Talente', isTalent: true };
    if (subTab === 'Vor- und Nachteile') {
      return { kind: 'auswahl', category: 'Vor- und Nachteile', isTalent: false };
    }
    return { kind: 'grunddaten' };
  }

  if (mainTab === 'Magie') {
    if (subTab === 'KI') return { kind: 'ki' };
    if (subTab === 'PSI') return { kind: 'psi' };
    if (subTab === 'Geweihte') return { kind: 'geweihte' };
    return { kind: 'spruchmagie' };
  }

  const title = subTab !== null && subTab in CATEGORIES_BY_CHARACTER_VALUES_SUB_TAB
    ? subTab as CharacterValuesSubTab
    : 'Eigenschaft';
  return { kind: 'category', title, categories: CATEGORIES_BY_CHARACTER_VALUES_SUB_TAB[title] };
}
