import './style.css';
import { listCharacters, loadCharacter, getLastActiveCharacterId, setLastActiveCharacterId } from './state/characterStore';
import { computeSheet, makeValueSource, SSK_MINDEST_SP } from './engine/characterSheet';
import { formatDublonenNumber } from './utils/format';
import { buildNahkampfRows } from './views/kampf';
import { isGeweihterTalentSelectedInSheet } from './engine/geweihte';
import { initTooltips, tooltipAttr } from './views/tooltip';
import { renderNewCharacterForm, wireCharacterLifecycleEvents } from './views/characterLifecycle';
import { renderActiveView } from './views/viewRouter';
import { createInitialAppState } from './state/appState';
import { createMutationHandlers } from './state/mutationHandlers';
import {
  getActiveNavigationTabId, getVisibleSubTabs, normalizeNavigation,
  type MainTab, type SubTab,
} from './navigation';
import { renderNavigationMarkup } from './navigationMarkup';

declare const __LAST_UPDATED_AT__: string;

const app = document.querySelector<HTMLDivElement>('#app')!;

function formatLastUpdated(isoTimestamp: string): string {
  const timestamp = new Date(isoTimestamp);
  if (Number.isNaN(timestamp.getTime())) return '';

  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(timestamp).replace(',', '');
}

const lastUpdated = formatLastUpdated(__LAST_UPDATED_AT__);

// Tab-Intro-Texte aus `tooltips text.txt` (Zeilen "tab_..."): erklaeren die Kategorie als
// Ganzes (z.B. wie Grundfertigkeiten grundsaetzlich funktionieren), gehoeren daher an den
// Tab-Button selbst statt an eine einzelne Zeile - siehe PLAN-Tooltip-System.md Phase 2.
const TAB_INTRO: Partial<Record<SubTab, string>> = {
  'Grundfertigkeiten': 'Grundfertigkeiten werden, sofern der Meister sie für die Probe zulässt, zum Probenwert addiert. Zugelassene Grundfertigkeiten werden entweder vom Meister mit der Probe angesagt, oder wenn er eine Eigenschaftsprobe verlangt, so wird vom Spieler nachgefragt ob er eine bestimmte verwenden darf, die er als passend ansieht. Für eine Probe darf höchstens eine Grundfertigkeit verwendet werden. Der Meister kann aber auch mehr als eine Grundfertigkeit zulassen, dann darf der Charakter eine davon auswählen. Der einzige Unterschied zwischen körperlichen und geistigen Grundfertigkeiten ist, dass der Meister dadurch einen Anhaltspunkt hat, ob eine Grundfertigkeitsprobe durch GBE behindert werden sollte: In der Regel bei körperlichen 1-fach und bei geistigen nicht. Durch Kampf oder andere Ereignisse erhaltene BE gilt für alle Grundfertigkeiten gleich.',
  'Sonderfertigkeiten': 'Sonderfertigkeiten werden in der Regel nicht mit eigenen Proben abgefragt; sie sind entweder in Formeln vertreten oder geben Boni auf Tabellenproben.',
  'Geweihte': 'Zeigt Geweihtengrad, Karma-Pool-Punkte (KPP) und die verfügbaren Wunder der gewählten Religion. Die Fähigkeiten Stoßgebet/Wunder/Ritual (Probe-Basis) werden im WHK-Tab gesteigert.',
};

// Beim Start den zuletzt aktiven Charakter wiederherstellen (siehe characterStore.ts) - sonst
// faellt jeder Seiten-Reload auf die leere Auswahl zurueck, obwohl der Charakter noch da ist.
const lastActiveId = getLastActiveCharacterId();
const initialCharacter = lastActiveId ? loadCharacter(lastActiveId) : null;
if (lastActiveId && !initialCharacter) setLastActiveCharacterId(null); // Charakter wurde geloescht

const appState = createInitialAppState(initialCharacter);
const handlers = createMutationHandlers(appState, render);

function render(): void {
  const characters = listCharacters();
  const sheet = appState.currentCharacter ? computeSheet(appState.currentCharacter) : null;
  // Fuer die Formel-Impact-Liste (Plan-Phase 3, nur Eigenschaft/Attribute-Tab) - billig zu bauen
  // (reine Closures ueber currentCharacter, keine Berechnung), siehe categoryView.ts.
  const characterValues = appState.currentCharacter ? makeValueSource(appState.currentCharacter) : undefined;
  // Geweihte kann durch Ab-/Umwaehlen des Gate-Talents nachtraeglich unsichtbar werden.
  // normalizeNavigation faellt dann innerhalb des aktiven Hauptbereichs kontrolliert zurueck.
  const showGeweihte = sheet !== null && isGeweihterTalentSelectedInSheet(sheet);
  appState.navigationState = normalizeNavigation(appState.navigationState, showGeweihte);
  const visibleSubTabs = getVisibleSubTabs(appState.navigationState.activeMainTab, showGeweihte);
  const conformityIssues = sheet && appState.currentCharacter
    ? [
      ...sheet.validationIssues,
      ...buildNahkampfRows(appState.currentCharacter, sheet)
        .filter((row, index, rows) => !row.poolValid
          && rows.findIndex((candidate) => candidate.key === row.key && candidate.grip === row.grip) === index)
        .map((row) => ({
          source: `Kampf › ${row.label} (${row.grip})`,
          message: `AT/PA-Pool unausgeglichen: ${row.atSpent} auf AT, ${row.paSpent} auf PA`,
        })),
    ]
    : [];
  const characterWarning = conformityIssues.length > 0
    ? `<span class="character-conformity-warning" role="img" aria-label="Charakter nicht konform"${tooltipAttr(
      conformityIssues.map((issue) => `${issue.source}: ${issue.message}`).join('\n'),
    )}>⚠</span>`
    : '';

  app.innerHTML = `
    <header class="app-header">
      ${lastUpdated ? `<small class="last-updated">last updated ${lastUpdated}</small>` : ''}
      <h1>Nasus – Charaktererstellung</h1>
      <div class="character-bar">
        <select id="character-select">
          <option value="">-- Charakter wählen --</option>
          ${characters.map((c) => `<option value="${c.id}" ${c.id === appState.currentCharacter?.id ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>
        ${characterWarning}
        <button type="button" id="new-character">Neuer Charakter</button>
        <button type="button" id="new-character-bestehend">Bestehenden Charakter erstellen</button>
        ${appState.currentCharacter ? '<button type="button" id="delete-character">Löschen</button>' : ''}
      </div>
      ${appState.showNewCharacterForm ? renderNewCharacterForm(appState.newCharacterBestehend) : ''}
      ${appState.confirmingDelete && appState.currentCharacter ? `
        <div class="inline-form">
          <span>Charakter "${appState.currentCharacter.name}" wirklich löschen?</span>
          <button type="button" id="delete-confirm">Ja, löschen</button>
          <button type="button" id="delete-cancel">Abbrechen</button>
        </div>` : ''}
      ${sheet ? `
        <div class="budget-bar">
          <span title="Lebenszeit-Gesamterfahrung, speist Stufe/Kreis – ${sheet.epNaechsteStufeAb !== undefined ? `nächste Stufe ab ${sheet.epNaechsteStufeAb} EP` : 'höchste Stufe erreicht'}">EP: <span class="numeric-field-output numeric-field-signed-five">${sheet.epGesamt}</span></span>
          <span title="Steigerungspunkte (übrig): bezahlt Eigenschaften/Attribute/Fertigkeiten/Vor-Nachteile/WHK – verbraucht ${sheet.spSpent} von ${sheet.spTotal}">SP: <span class="numeric-field-output numeric-field-signed-five">${sheet.spRemaining}</span></span>
          ${sheet.sskMinimumMet && sheet.sskLanguageMinimumMet ? '' : `<span class="budget-invalid" title="Für einen gültigen Charakter müssen mindestens ${SSK_MINDEST_SP} SP in Sprache, Kultur und Schrift investiert und mindestens eine Sprache auf Stufe 1 oder höher beherrscht sein.">SSK: <span class="numeric-field-output numeric-field-two">${sheet.sskSpent}</span> / ${SSK_MINDEST_SP} SP${sheet.sskLanguageMinimumMet ? '' : ' · Sprache fehlt'} ⚠</span>`}
          <span title="Talentpunkte (übrig): bezahlt ausschließlich Talente, eigener Pool = 20+Stufe×5 – verbraucht ${sheet.tapSpent} von ${sheet.tapTotal}">TaP: <span class="numeric-field-output numeric-field-signed-five">${sheet.tapRemaining}</span></span>
          <span title="Dublonen: Käufe ziehen erst vom Bargeld, danach vom Bankguthaben ab – insgesamt verbraucht ${formatDublonenNumber(sheet.dublonenSpent)} von ${formatDublonenNumber(sheet.dublonenTotal)}">Dublonen: <span class="numeric-field-output numeric-field-formatted-five">${formatDublonenNumber(sheet.dublonenBarRemaining)}</span> bar / <span class="numeric-field-output numeric-field-formatted-five">${formatDublonenNumber(sheet.dublonenBankRemaining)}</span> Bank</span>
        </div>` : ''}
      ${appState.errorMessage ? `<div class="error-message">${appState.errorMessage}</div>` : ''}
      ${appState.currentCharacter ? renderNavigationMarkup(
        appState.navigationState, visibleSubTabs, (tab) => tooltipAttr(TAB_INTRO[tab]),
      ) : ''}
    </header>
    <main id="view-container" role="tabpanel" aria-labelledby="${appState.currentCharacter ? getActiveNavigationTabId(appState.navigationState) : ''}" tabindex="0"></main>
  `;

  wireCharacterLifecycleEvents(appState, render);

  document.querySelectorAll<HTMLButtonElement>('.main-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      appState.navigationState = normalizeNavigation({
        activeMainTab: btn.dataset.mainTab as MainTab,
        activeSubTab: null,
      }, showGeweihte);
      render();
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.sub-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      appState.navigationState = {
        activeMainTab: appState.navigationState.activeMainTab,
        activeSubTab: btn.dataset.subTab as SubTab,
      };
      render();
    });
  });

  document.querySelectorAll<HTMLElement>('[role="tablist"]').forEach((tabList) => {
    tabList.addEventListener('keydown', (event) => {
      if (!(event instanceof KeyboardEvent) || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const tabs = Array.from(tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
      const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement);
      if (currentIndex < 0 || tabs.length === 0) return;
      event.preventDefault();
      const nextIndex = event.key === 'Home' ? 0
        : event.key === 'End' ? tabs.length - 1
          : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      const nextTab = tabs[nextIndex];
      if (!nextTab) return;
      const selectedTabSelector = tabList.classList.contains('main-tab-nav')
        ? '.main-tab-nav [role="tab"][aria-selected="true"]'
        : '.sub-tab-nav [role="tab"][aria-selected="true"]';
      nextTab.click();
      document.querySelector<HTMLButtonElement>(selectedTabSelector)?.focus();
    });
  });

  if (sheet && appState.currentCharacter) {
    const viewContainer = document.querySelector<HTMLDivElement>('#view-container')!;
    renderActiveView(viewContainer, sheet, appState.currentCharacter, appState.navigationState, handlers, characterValues);
  }
}

initTooltips();
render();
