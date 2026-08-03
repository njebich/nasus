// Grimoire-Tab (Nutzer 2026-08-03): "Charakterbogen > Grimoire" - liest sich wie ein
// blätterbares Spruchbuch statt einer Tabelle. Titelseite ("Grimoire von {Name}", geschlossen),
// dann eine aufgeschlagene Doppelseite mit Inhaltsverzeichnis (alle Schulen mit >=1 gelerntem
// Zauber, TaW>0, linke Seite bleibt blank), danach je Doppelseite zwei Zauber (links/rechts) -
// beim letzten ungeraden Zauber bleibt die rechte Seite leer. Zauber-Reihenfolge identisch zu
// spruchmagie.ts's Gesamtliste (Schule, dann Grad, dann Name), damit TOC-Sprungziele und
// Blätter-Reihenfolge zusammenpassen.
//
// Feld-Layout je Zauberseite orientiert sich an NN_Spruchmagie_0.57.xlsx's "Zauberbuch"-Vorlage
// (fixe Reihenfolge: Wirkung, Gegenprobe, Reichweite/Ziel/Effektdauer/Wirkungsdauer, Stufen
// (VZ/Erschwerung/Probe), Manakosten/Aufrechterhaltung, Talentwert/Mindest-Int/Eigenschaft/
// Zauberart/-form/-schule) - nutzt aber die App-eigene Live-Berechnung (resolveWirkungText/
// resolveRw, Stufen-Werte je nach Talenten) statt die xlsx-Formeln 1:1 nachzubauen.
//
// "Wenn Wirkungstext zu groß, Font verkleinern" (Nutzer-Vorgabe): fitWirkungText() misst nach
// dem Rendern jede .grimoire-wirkung-box und schrumpft die Schrift in 0.5px-Schritten bis der
// Text passt oder ein Minimum erreicht ist - CSS overflow-y:auto bleibt als Sicherheitsnetz fuer
// den (seltenen) Fall, dass selbst die Mindestgroesse nicht reicht.

import type { ComputedSheet } from '../engine/characterSheet';
import type { CharacterState } from '../state/characterStore';
import {
  buildAllGewaehlteRows, getAttAura, getAttMagie, getCharakterwertFormel, getEigBonusValue,
  renderStufenCell, renderVzCell, renderZauberprobeCell, unlockedStufen, type Row,
} from './spruchmagie';
import { resolveRw, resolveWirkungText } from '../engine/spruchmagieRw';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export interface Spread {
  isToc: boolean;
  left: Row | null;
  right: Row | null;
}

/** spreads[0] ist immer die TOC-Doppelseite (blank links, Inhaltsverzeichnis rechts), danach
 *  je 2 Zauber eine Doppelseite - der letzte ungerade Zauber bekommt eine blanke rechte Seite. */
export function buildSpreads(spells: Row[]): Spread[] {
  const spreads: Spread[] = [{ isToc: true, left: null, right: null }];
  for (let i = 0; i < spells.length; i += 2) {
    spreads.push({ isToc: false, left: spells[i], right: spells[i + 1] ?? null });
  }
  return spreads;
}

export interface TocEntry {
  schule: string;
  pageIndex: number;
}

/** Seitenindex (grimoirePageIndex-Zaehlung: 0=Titelseite, 1=TOC-Doppelseite, 2+=Zauber-
 *  Doppelseiten), auf dem der Zauber mit spells-Index i liegt. spells[0]/[1] liegen auf der
 *  ERSTEN Zauber-Doppelseite - die kommt NACH der TOC-Doppelseite (Seite 1), also Seite 2. */
function spellPageIndex(i: number): number {
  return 2 + Math.floor(i / 2);
}

/** Eine Zeile je Schule mit >=1 gelerntem Zauber, in erster-Vorkommen-Reihenfolge (== Schule
 *  alphabetisch, da spells bereits so sortiert sind) - pageIndex ist das Sprung-Ziel fuer
 *  grimoirePageIndex (siehe spellPageIndex). */
export function buildToc(spells: Row[]): TocEntry[] {
  const seen = new Map<string, number>();
  spells.forEach((row, i) => {
    const schule = row.rule.parent ?? '';
    if (!seen.has(schule)) seen.set(schule, spellPageIndex(i));
  });
  return [...seen.entries()].map(([schule, pageIndex]) => ({ schule, pageIndex }));
}

/** 0 = Titelseite (Buch geschlossen), N>=1 = spreads[N-1] - modul-globaler UI-Zustand analog
 *  spruchmagieSearchText/openSchulen in spruchmagie.ts (bewusst nicht in characterStore, rein
 *  fluechtiger Anzeigezustand). */
let grimoirePageIndex = 0;
let grimoireSearchText = '';

function renderCover(character: CharacterState): string {
  return `
    <div class="grimoire-cover" id="grimoire-cover" role="button" tabindex="0" aria-label="Buch aufschlagen">
      <div class="grimoire-cover-title">Grimoire</div>
      <div class="grimoire-cover-subtitle">von ${escapeHtml(character.name || '–')}</div>
      <div class="grimoire-cover-hint">Klicken zum Aufschlagen</div>
    </div>`;
}

function renderBlankPage(): string {
  return '<div class="grimoire-page grimoire-page-blank"></div>';
}

function renderTocPage(toc: TocEntry[]): string {
  const body = toc.length === 0
    ? '<p class="grimoire-empty">Noch keine Zauber erlernt.</p>'
    : `<ul class="grimoire-toc-list">
        ${toc.map((entry) => `<li><button type="button" class="grimoire-toc-link" data-goto="${entry.pageIndex}">${escapeHtml(entry.schule)}</button></li>`).join('')}
      </ul>`;
  return `
    <div class="grimoire-page grimoire-page-toc">
      <h3 class="grimoire-toc-heading">Inhaltsverzeichnis</h3>
      ${body}
    </div>`;
}

function renderSpellPage(row: Row | null, sheet: ComputedSheet): string {
  if (!row) return renderBlankPage();
  const { rule, currentValue, detail } = row;
  const name = rule.beschreibung ?? rule.referenz;
  const stufen = unlockedStufen(sheet, detail);
  const macht = getCharakterwertFormel(sheet, 'macht');
  const magie = getAttMagie(sheet);
  const aura = getAttAura(sheet);
  const mana = getCharakterwertFormel(sheet, 'mana');
  const wirkung = resolveWirkungText(rule.wirkung, macht, magie, aura);
  const rw = resolveRw(detail?.rw, macht, magie, aura, mana);
  const probe = renderZauberprobeCell(sheet, row, stufen);
  const eigBon = getEigBonusValue(sheet, rule.eigBonus);

  return `
    <div class="grimoire-page grimoire-page-spell" data-referenz="${escapeHtml(rule.referenz)}">
      <div class="grimoire-spell-head">
        <span class="grimoire-spell-grad">Grad ${escapeHtml(rule.grad ?? '–')}</span>
        <h3 class="grimoire-spell-name">${escapeHtml(name)}</h3>
        <span class="grimoire-spell-taw">TaW ${currentValue}</span>
      </div>
      <div class="grimoire-wirkung-box"><p class="grimoire-wirkung-text">${escapeHtml(wirkung)}</p></div>
      ${detail?.gegenprobe ? `<p class="grimoire-gegenprobe">Gegenprobe: ${escapeHtml(detail.gegenprobe)}</p>` : ''}
      <table class="grimoire-facts">
        <tr><th>Reichweite</th><td>${escapeHtml(rw)}</td></tr>
        <tr><th>Ziel</th><td>${escapeHtml(detail?.ziel ?? '–')}</td></tr>
        <tr><th>Effektdauer</th><td>${escapeHtml(detail?.einwirkdauer ?? '–')}</td></tr>
        <tr><th>Wirkungsdauer</th><td>${escapeHtml(detail?.wirkungsdauer ?? '–')}</td></tr>
      </table>
      ${stufen.length > 0 ? `
      <table class="grimoire-stufen">
        <tr><th>Stufen</th><td>${stufen.map((s) => escapeHtml(s.label)).join(' / ')}</td></tr>
        <tr><th>Vorbereitungszeit</th><td>${renderVzCell(sheet, detail, stufen.length)}</td></tr>
        <tr><th>Erschwerung</th><td>${renderStufenCell(stufen)}</td></tr>
        ${probe ? `<tr><th>Probe</th><td>${probe}</td></tr>` : ''}
      </table>` : ''}
      <table class="grimoire-facts">
        <tr><th>Manakosten</th><td>${escapeHtml(detail?.mana ?? '–')}</td></tr>
        <tr><th>Aufrechterhaltung</th><td>${escapeHtml(detail?.aufrechterhaltung ?? '–')}</td></tr>
        <tr><th>Mindest-Intelligenz</th><td>${escapeHtml(detail?.minInt ?? '–')}</td></tr>
        <tr><th>Eigenschaft</th><td>${escapeHtml(eigBon?.label ?? '–')}</td></tr>
        <tr><th>Zauberart</th><td>${escapeHtml(detail?.zauberArt ?? '–')}</td></tr>
        <tr><th>Zauberform</th><td>${escapeHtml(detail?.form ?? '–')}</td></tr>
        <tr><th>Zauberschule</th><td>${escapeHtml(rule.parent ?? '–')}</td></tr>
      </table>
    </div>`;
}

function renderSpreadHtml(spread: Spread, toc: TocEntry[], sheet: ComputedSheet): string {
  if (spread.isToc) return renderBlankPage() + renderTocPage(toc);
  return renderSpellPage(spread.left, sheet) + renderSpellPage(spread.right, sheet);
}

/** Schrumpft die Schrift jeder .grimoire-wirkung-text solange, bis sie in ihre (per CSS
 *  fixierte Hoehe besitzende) .grimoire-wirkung-box passt oder das Minimum erreicht ist. */
function fitWirkungText(container: HTMLElement): void {
  const MIN_FONT_PX = 8;
  container.querySelectorAll<HTMLElement>('.grimoire-wirkung-box').forEach((box) => {
    const text = box.querySelector<HTMLElement>('.grimoire-wirkung-text');
    if (!text) return;
    let fontSize = parseFloat(getComputedStyle(text).fontSize);
    while (text.scrollHeight > box.clientHeight && fontSize > MIN_FONT_PX) {
      fontSize -= 0.5;
      text.style.fontSize = `${fontSize}px`;
    }
  });
}

export function renderGrimoireView(container: HTMLElement, sheet: ComputedSheet, character: CharacterState): void {
  const schulen = [...new Set((sheet.byKategorie['Spruchmagie'] ?? []).map((r) => r.rule.parent).filter((p): p is string => !!p))];
  const spells = buildAllGewaehlteRows(sheet, schulen);
  const spreads = buildSpreads(spells);
  const toc = buildToc(spells);
  const totalPages = spreads.length;

  if (grimoirePageIndex > totalPages) grimoirePageIndex = totalPages;
  if (grimoirePageIndex < 0) grimoirePageIndex = 0;

  // VOR dem innerHTML-Ersatz Fokus/Cursor des Suchfelds sichern (analog renderSpruchmagieContent
  // in spruchmagie.ts) - sonst wuerde jeder Re-Render (z.B. durch Blaettern) den Fokus stehlen.
  const prevSearchInput = container.querySelector<HTMLInputElement>('#grimoire-search');
  const searchWasFocused = prevSearchInput !== null && document.activeElement === prevSearchInput;
  const prevSelectionStart = prevSearchInput?.selectionStart ?? null;

  const needle = grimoireSearchText.trim().toLowerCase();
  const searchMatches = needle
    ? spells
        .map((row, i) => ({ row, pageIndex: spellPageIndex(i) }))
        .filter(({ row }) => (row.rule.beschreibung ?? '').toLowerCase().includes(needle))
    : [];

  container.innerHTML = `
    <div class="grimoire">
      <div class="grimoire-toolbar">
        <div class="grimoire-search">
          <input type="text" id="grimoire-search" placeholder="Zauber suchen..." value="${escapeHtml(grimoireSearchText)}" />
          ${needle && searchMatches.length > 0 ? `
          <ul class="grimoire-search-results">
            ${searchMatches.map(({ row, pageIndex }) => `
              <li><button type="button" class="grimoire-search-hit" data-goto="${pageIndex}">${escapeHtml(row.rule.beschreibung ?? row.rule.referenz)} <span class="grimoire-search-hit-schule">(${escapeHtml(row.rule.parent ?? '')})</span></button></li>`).join('')}
          </ul>` : ''}
          ${needle && searchMatches.length === 0 ? '<p class="grimoire-search-empty">Kein Zauber gefunden.</p>' : ''}
        </div>
        <div class="grimoire-nav">
          <button type="button" id="grimoire-prev" ${grimoirePageIndex <= 0 ? 'disabled' : ''} aria-label="Vorherige Seite">◀</button>
          <span class="grimoire-page-indicator">${grimoirePageIndex === 0 ? 'Titelseite' : `Seite ${grimoirePageIndex} / ${totalPages}`}</span>
          <button type="button" id="grimoire-next" ${grimoirePageIndex >= totalPages ? 'disabled' : ''} aria-label="Nächste Seite">▶</button>
        </div>
      </div>
      <div class="grimoire-book">
        ${grimoirePageIndex === 0 ? renderCover(character) : renderSpreadHtml(spreads[grimoirePageIndex - 1], toc, sheet)}
      </div>
    </div>`;

  const searchInput = container.querySelector<HTMLInputElement>('#grimoire-search');
  if (searchInput) {
    if (searchWasFocused) {
      searchInput.focus();
      const pos = prevSelectionStart ?? searchInput.value.length;
      searchInput.setSelectionRange(pos, pos);
    }
    searchInput.addEventListener('input', (e) => {
      grimoireSearchText = (e.target as HTMLInputElement).value;
      renderGrimoireView(container, sheet, character);
    });
  }

  const gotoPage = (pageIndex: number, clearSearch: boolean): void => {
    grimoirePageIndex = pageIndex;
    if (clearSearch) grimoireSearchText = '';
    renderGrimoireView(container, sheet, character);
  };

  container.querySelector<HTMLButtonElement>('#grimoire-prev')?.addEventListener('click', () => {
    if (grimoirePageIndex > 0) gotoPage(grimoirePageIndex - 1, false);
  });
  container.querySelector<HTMLButtonElement>('#grimoire-next')?.addEventListener('click', () => {
    if (grimoirePageIndex < totalPages) gotoPage(grimoirePageIndex + 1, false);
  });

  const cover = container.querySelector<HTMLElement>('#grimoire-cover');
  cover?.addEventListener('click', () => gotoPage(Math.min(1, totalPages), false));
  cover?.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
      e.preventDefault();
      gotoPage(Math.min(1, totalPages), false);
    }
  });

  container.querySelectorAll<HTMLButtonElement>('.grimoire-toc-link').forEach((btn) => {
    btn.addEventListener('click', () => gotoPage(Number(btn.dataset.goto), false));
  });
  container.querySelectorAll<HTMLButtonElement>('.grimoire-search-hit').forEach((btn) => {
    btn.addEventListener('click', () => gotoPage(Number(btn.dataset.goto), true));
  });

  fitWirkungText(container);
}
