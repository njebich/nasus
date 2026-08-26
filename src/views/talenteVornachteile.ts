// Auswahl-Ansicht fuer Talente und Vor-/Nachteile: Checkbox-Liste statt Zahlen-Stepper.
// Talente werden zur Uebersicht nach Charakterklasse (Parent) gruppiert - das ist reine
// Kategorisierung, KEINE Kaufsperre: jeder Charakter kann jedes Talent kaufen (siehe Plan).

import type { ComputedSheet, ComputedRule } from '../engine/characterSheet';
import { tooltipAttr } from './tooltip';
import { GEWEIHTER_RELIGION_BY_REFERENZ, isGeweihterReferenzErlaubt } from '../engine/geweihte';
import { filterHoechsteStufeJeReihe, getTalentStufeInfo, getVorstufeReferenz } from '../engine/talenteStufenKette';
import { normalizeForMatch } from '../engine/normalize';
import type { CharakterTyp } from '../state/characterStore';

export type OnToggle = (referenz: string, selected: boolean) => void;

/** Aufgeklappte Talente-Gruppen (Parent/Charakterklasse) - Persistenz-Muster wie openSchulen in
 *  spruchmagie.ts/openGroupReferenzen in categoryView.ts. Alle standardmaessig zu. */
const openParents = new Set<string>();

/** Aufgeklappte Magus-Schule-Untergruppen innerhalb des "Magier"-Parents (Nutzer-Ask: "Magus
 *  Stufe X nach Schule gruppieren") - eigenes Set, gleiches Persistenz-Muster wie openParents. */
const openMagusSchulen = new Set<string>();

/** Aufgeklappte Vor-/Nachteile-Gruppen ("Nachteile"/"Vorteile"/"Ängste") - eigenes Set statt
 *  openParents, damit ein gleichnamiger Talente-Parent nicht kollidiert. Gleiches Persistenz-
 *  Muster, alle standardmaessig zu. */
const openVnGroups = new Set<string>();

/** Suchtext pro Kategorie (Talente/Vor- und Nachteile teilen sich dieses Modul, brauchen aber
 *  unabhaengige Suchfelder) - gleiches Persistenz-Muster wie searchText in ausruestung.ts. */
const searchTextByKategorie = new Map<string, string>();

/** "Nur kaufbare zeigen"-Filter (Nutzer 2026-07-22, auf Vor-/Nachteile erweitert) - blendet
 *  Eintraege aus, deren kostenSelect den aktuell verfuegbaren Pool (TaP bei Talente, SP bei
 *  Vor-/Nachteile) uebersteigt. Bereits gewaehlte Eintraege bleiben immer sichtbar (sonst liesse
 *  sich ein zu teurer, aber schon gekaufter Eintrag nicht abwaehlen). */
const nurKaufbareByKategorie = new Map<string, boolean>();

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Extrahiert den Schulnamen aus einer Magus-Talent-Beschreibung ("Magus Stufe 2:
 *  Beherrschungs-Großmagus" -> "Beherrschung"). Die xlsx schreibt den Schulnamen uneinheitlich
 *  mit/ohne Genitiv-"s" vor dem Suffix (siehe gleiche Beobachtung in talenteStufenKette.ts) -
 *  das trailing "s" wird hier ebenso entfernt, damit "Antimagie"/"Antimagies" zur selben Gruppe
 *  zusammenfallen. */
const MAGUS_SCHULE_LABEL_RE = /^Magus Stufe \d+: (.+?)-(?:Gro(?:ß|ss)|Erz)?[Mm]agus$/;
function magusSchuleLabel(beschreibung: string | undefined): string | undefined {
  if (!beschreibung) return undefined;
  const match = MAGUS_SCHULE_LABEL_RE.exec(beschreibung);
  if (!match) return undefined;
  const raw = match[1];
  return raw.endsWith('s') ? raw.slice(0, -1) : raw;
}

/** Ist referenz eine der 36 "Magus Stufe X: <Schule>-(Groß|Erz)?magus"-Zeilen (siehe
 *  talenteStufenKette.ts's MAGUS_STUFE_RE) - alle liegen im "Magier"-Parent, aber sollen dort
 *  zusaetzlich je Schule gruppiert werden statt flach zu erscheinen. */
function isMagusStufenTalent(r: ComputedRule): boolean {
  return (getTalentStufeInfo(r.rule.referenz)?.family ?? '').startsWith('talente_magus_');
}

/** Rendert die 12 Magus-Schulen als verschachtelte, einzeln aufklappbare Untergruppen innerhalb
 *  des "Magier"-Parents. */
function renderMagusSchuleGruppen(
  rows: ComputedRule[],
  sheet: ComputedSheet,
  characterReligion: string | undefined,
  needle: string,
  charakterTyp: CharakterTyp,
): string {
  const groups = new Map<string, ComputedRule[]>();
  for (const r of rows) {
    const schule = magusSchuleLabel(r.rule.beschreibung) ?? 'Sonstige';
    (groups.get(schule) ?? groups.set(schule, []).get(schule)!).push(r);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([schule, schuleRows]) => {
      const openAttr = needle || openMagusSchulen.has(schule) ? ' open' : '';
      return `
        <details class="stat-group stat-group-nested" data-magus-schule="${escapeHtml(schule)}"${openAttr}>
          <summary>${escapeHtml(schule)} <span class="stat-group-count">(${schuleRows.length})</span></summary>
          <div class="auswahl-category">${schuleRows.map((r) => renderRow(r, sheet, characterReligion, charakterTyp)).join('')}</div>
        </details>`;
    }).join('');
}

// Nutzer-Direktive 2026-07-24: Talente/Vor-Nachteile sollen beim Hover ueber die ganze Zeile die
// Wirkung zeigen, NICHT mehr die TaP-/SP-Kosten-Formel (frueher formulaTooltip(kostenRaw), z.B.
// eine SVERWEIS-Kostentabelle) - dieselbe Wirkung wie das (i)-Icon, nur zusaetzlich auf der ganzen
// Zeile statt nur auf dem kleinen Icon.
function wirkungTooltip(wirkung: string | undefined): string {
  if (!wirkung) return '';
  return tooltipAttr(wirkung);
}

// Eigener Trigger (statt am ganzen Row-Label) - das (i)-Icon bleibt zusaetzlich zum jetzt
// identischen Zeilen-Tooltip bestehen (Nutzer 2026-07-24, explizit fuer Vor-/Nachteile: "Add (i)
// button showing same text"), siehe PLAN-Tooltip-System.md Phase 2 Punkt 1.
function wirkungIcon(wirkung: string | undefined): string {
  if (!wirkung) return '';
  return `<span class="stat-info-icon"${tooltipAttr(wirkung)}>ⓘ</span>`;
}

/** Vor-/Nachteile sollen immer einen sichtbaren Tooltip-Trigger haben. Bei noch nicht gepflegtem
 * Wirkungstext verwenden wir vorhandene Nutzerinformationen bzw. Regelnotizen; wenn auch diese
 * fehlen, wird die Datenluecke ausdrücklich angezeigt, statt Tooltip und Info-Icon zu verstecken. */
function auswahlTooltipText(r: ComputedRule): string | undefined {
  if (r.rule.wirkung?.trim()) return r.rule.wirkung;
  if (r.rule.kategorie !== 'Vor- und Nachteile') return undefined;
  if (r.rule.info?.trim()) return r.rule.info;
  if (r.rule.flag?.trim()) return r.rule.flag;
  return 'Für diesen Vor-/Nachteil ist noch keine Wirkungsbeschreibung hinterlegt.';
}

/** Ehemals (Nutzer 2026-07-22) ein dynamischer Grad-Titel-Praefix vor dem Basisnamen des EINEN
 *  Gate-Talents. Seit der Geweihte-Stufenkette (Nutzer-Ask 2026-08-06, siehe engine/geweihte.ts)
 *  traegt jede der 7 Stufen-Zeilen ihren Grad-Titel bereits fest im xlsx-Namen ("Geweihter von X,
 *  Orthodox – Minderer" usw.) - ein zusaetzlicher dynamischer Praefix wuerde ihn nur verdoppeln.
 *  Bleibt als Funktion stehen (statt an den 2 Aufrufstellen zu inlinen), falls spaeter doch wieder
 *  ein Talent-spezifischer Label-Sonderfall noetig wird. */
function geweihterLabel(r: ComputedRule): string {
  return r.rule.beschreibung ?? r.rule.referenz;
}

/** Geweihte-Gate-Talente sind hinter der im Charakterheader gewaehlten Religion+Sekte gesperrt
 *  (Nutzer 2026-07-22: "gate talents behind chosen religion") - siehe
 *  engine/geweihte.ts#isGeweihterReferenzErlaubt. Nicht-Gate-Talente sind immer erlaubt. */
function geweihterSperrTitle(referenz: string): string {
  const info = GEWEIHTER_RELIGION_BY_REFERENZ[referenz.toLowerCase()];
  if (!info) return '';
  return `Erfordert Religion "${info.religion}, ${info.sekte}" (Feld "Religion"/"Sekte" im Charakterheader)`;
}

/** Nutzer-Ask 2026-08-06: religionsabhaengige Geweihte-Talente (die 35 Stufe-1-7-Zeilen je
 *  Religion), die nicht zur im Charakterheader gewaehlten Religion+Sekte passen, komplett aus der
 *  Liste ausblenden statt nur gesperrt anzuzeigen - bei 5 Religionen x 7 Stufen waeren sonst 28-35
 *  faktisch nie waehlbare Zeilen staendig sichtbar. Bereits gewaehlte Zeilen bleiben trotzdem
 *  sichtbar (z.B. nach einem spaeteren Religionswechsel im Header), damit sie weiterhin abwaehlbar
 *  sind - gleiches Prinzip wie "waehlbar" in renderRow. Nicht-Gate-Talente (u.a. "Gute Wunder")
 *  sind nicht religionsabhaengig und daher nie betroffen (isGeweihterReferenzErlaubt liefert fuer
 *  sie immer true). */
function isAusgeblendetesGeweihterTalent(r: ComputedRule, characterReligion: string | undefined): boolean {
  return !r.selected && !isGeweihterReferenzErlaubt(r.rule.referenz, characterReligion);
}

function renderRow(
  r: ComputedRule,
  sheet: ComputedSheet,
  characterReligion: string | undefined,
  charakterTyp: CharakterTyp,
  gekauftDarstellung = false,
): string {
  const label = escapeHtml(geweihterLabel(r));
  const tooltipText = auswahlTooltipText(r);
  // Talente kosten TaP (eigener, von SP komplett getrennter Pool), alles andere (z.B.
  // Vor-/Nachteile) kostet SP - siehe characterSheet.ts.
  const waehrung = r.rule.kategorie === 'Talente' ? 'TaP' : 'SP';
  const cost = r.kostenSelect !== undefined ? `${r.kostenSelect > 0 ? '-' : '+'}${Math.abs(r.kostenSelect)} ${waehrung}` : '';
  const errorNote = r.error ? `<span class="stat-error" title="${escapeHtml(r.error)}">⚠</span>` : '';
  const religionErlaubt = isGeweihterReferenzErlaubt(r.rule.referenz, characterReligion);
  const vorstufe = r.rule.kategorie === 'Talente' ? getVorstufeReferenz(r.rule.referenz) : undefined;
  const vorstufeGekauft = !vorstufe || (sheet.byKategorie['Talente'] ?? [])
    .some((talent) => talent.rule.referenz.toLowerCase() === vorstufe && talent.selected);
  const bezahlbar = r.rule.kategorie !== 'Talente'
    || r.kostenSelect === undefined
    || r.kostenSelect <= sheet.tapRemaining;
  // Gekaufte Einträge bleiben stets aktiv, damit sie auch bei inzwischen fehlendem Budget oder
  // einer weggefallenen Voraussetzung wieder abgewählt werden können.
  const automatischSc = r.rule.verfuegbarkeit === 'SC' && charakterTyp === 'SC';
  const waehlbar = !automatischSc && (r.selected || (religionErlaubt && vorstufeGekauft && bezahlbar));
  // Nicht wählbare Einträge bleiben vollständig sichtbar, werden aber gedimmt und deaktiviert.
  // Bereits gekaufte Einträge bleiben abwählbar, auch wenn eine Voraussetzung später wegfällt.
  const rowClass = waehlbar ? '' : 'auswahl-row-locked';
  let sperrgrund = '';
  if (automatischSc) sperrgrund = 'Für jeden Spielercharakter automatisch gewählt und nicht abwählbar';
  else if (!religionErlaubt) sperrgrund = geweihterSperrTitle(r.rule.referenz);
  else if (!vorstufeGekauft && vorstufe) {
    const vorstufeRule = (sheet.byKategorie['Talente'] ?? [])
      .find((talent) => talent.rule.referenz.toLowerCase() === vorstufe)?.rule;
    sperrgrund = `Erfordert zuerst "${vorstufeRule?.beschreibung ?? vorstufe}"`;
  } else if (!bezahlbar) sperrgrund = `Nicht genügend TaP (benötigt ${r.kostenSelect}, verfügbar ${sheet.tapRemaining})`;
  const sperrTitle = sperrgrund ? ` title="${escapeHtml(sperrgrund)}"` : '';
  if (gekauftDarstellung) {
    const wirkung = tooltipText?.trim()
      ? `<span class="gekauft-wirkung"><span class="gekauft-wirkung-label">Wirkung:</span> ${escapeHtml(tooltipText)}</span>`
      : '';
    return `
      <div class="auswahl-row gekauft-row${rowClass ? ` ${rowClass}` : ''}" data-referenz="${r.rule.referenz}"${wirkungTooltip(tooltipText)}${sperrTitle}>
        <input type="checkbox" class="auswahl-checkbox" aria-label="${label} abwählen" ${r.selected ? 'checked' : ''} ${!waehlbar ? 'disabled' : ''} />
        <span class="stat-label">${label}${wirkungIcon(tooltipText)}${errorNote}</span>
        <span class="stat-cost">${cost}</span>
        ${wirkung}
      </div>`;
  }
  return `
    <label class="auswahl-row${rowClass ? ` ${rowClass}` : ''}" data-referenz="${r.rule.referenz}"${wirkungTooltip(tooltipText)}${sperrTitle}>
      <input type="checkbox" class="auswahl-checkbox" ${r.selected ? 'checked' : ''} ${!waehlbar ? 'disabled' : ''} />
      <span class="stat-label">${label}${wirkungIcon(tooltipText)}${errorNote}</span>
      <span class="stat-cost">${cost}</span>
    </label>`;
}

/** Vor-/Nachteile werden statt nach Parent (siehe groupByParent) nach Kostenvorzeichen sortiert:
 *  ein Eintrag mit kostenSelect < 0 zahlt SP aus (Nachteil), >= 0 kostet SP (Vorteil) - siehe
 *  waehrung/cost in renderRow. Alle Angst:*-Parents (siehe vor-und-nachteile.jsonl) werden
 *  zusaetzlich in einer eigenen "Ängste"-Unterguppe innerhalb Nachteile gebuendelt, statt wie bei
 *  Talente-groupByParent je Angstart eine eigene Top-Level-Gruppe zu bilden. */
/** Immer sichtbare "Gekauft"-Sektion oben in der Liste (Nutzer 2026-07-23: "uncouple all bought
 *  talente, always display on top even if all categories are collapsed") - zusaetzlich zur
 *  gewohnten Parent-/Vor-Nachteile-Gruppierung, nicht ersetzend (Eintraege bleiben dort auch
 *  weiterhin sichtbar). Bewusst KEIN <details>, damit die Sektion sich nicht zuklappen laesst. */
function renderGekauftSection(
  rows: ComputedRule[],
  sheet: ComputedSheet,
  characterReligion: string | undefined,
  charakterTyp: CharakterTyp,
): string {
  const gekauft = rows.filter((r) => r.selected);
  const sichtbar = filterHoechsteStufeJeReihe(gekauft);
  if (gekauft.length === 0) return '';
  return `
    <div class="stat-card">
      <div class="stat-group gekauft-group">
        <div class="gekauft-header">Gekauft <span class="stat-group-count">(${sichtbar.length})</span></div>
        <div class="auswahl-category">${sichtbar.map((r) => renderRow(
          r,
          sheet,
          characterReligion,
          charakterTyp,
          true,
        )).join('')}</div>
      </div>
    </div>`;
}

function renderVnGroups(
  rows: ComputedRule[],
  sheet: ComputedSheet,
  characterReligion: string | undefined,
  needle: string,
  charakterTyp: CharakterTyp,
): string {
  const nachteile = rows.filter((r) => (r.kostenSelect ?? 0) < 0);
  const vorteile = rows.filter((r) => (r.kostenSelect ?? 0) >= 0);
  const isAngst = (r: ComputedRule) => (r.rule.parent ?? '').startsWith('Angst:');
  const angste = nachteile.filter(isAngst);
  const nachteileRest = nachteile.filter((r) => !isAngst(r));

  const openNachteile = needle || openVnGroups.has('Nachteile');
  const openVorteile = needle || openVnGroups.has('Vorteile');
  const openAngste = needle || openVnGroups.has('Ängste');

  const angsteHtml = angste.length ? `
    <details class="stat-group" data-vn-group="Ängste"${openAngste ? ' open' : ''}>
      <summary>Ängste <span class="stat-group-count">(${angste.length})</span></summary>
      <div class="auswahl-category">${angste.map((r) => renderRow(r, sheet, characterReligion, charakterTyp)).join('')}</div>
    </details>` : '';

  const nachteileHtml = `
    <div class="stat-card">
      <details class="stat-group" data-vn-group="Nachteile"${openNachteile ? ' open' : ''}>
        <summary>Nachteile <span class="stat-group-count">(${nachteile.length})</span></summary>
        <div class="auswahl-category">${nachteileRest.map((r) => renderRow(r, sheet, characterReligion, charakterTyp)).join('')}</div>
        ${angsteHtml}
      </details>
    </div>`;

  const vorteileHtml = `
    <div class="stat-card">
      <details class="stat-group" data-vn-group="Vorteile"${openVorteile ? ' open' : ''}>
        <summary>Vorteile <span class="stat-group-count">(${vorteile.length})</span></summary>
        <div class="auswahl-category">${vorteile.map((r) => renderRow(r, sheet, characterReligion, charakterTyp)).join('')}</div>
      </details>
    </div>`;

  return nachteileHtml + vorteileHtml;
}

export function renderAuswahlView(
  container: HTMLElement,
  sheet: ComputedSheet,
  kategorie: string,
  groupByParent: boolean,
  onToggle: OnToggle,
  characterReligion?: string,
  charakterTyp: CharakterTyp = 'SC',
): void {
  // VOR dem innerHTML-Ersatz sichern, ob das Suchfeld gerade fokussiert war (und an welcher
  // Cursor-Position) - sonst wuerde JEDER Re-Render dieser View (auch durch Checkbox-Klicks
  // ausgeloest) den Fokus stehlen bzw. verlieren.
  const prevSearchInput = container.querySelector<HTMLInputElement>('#auswahl-search');
  const searchWasFocused = prevSearchInput !== null && document.activeElement === prevSearchInput;
  const prevSelectionStart = prevSearchInput?.selectionStart ?? null;

  // Talente kosten TaP, Vor-/Nachteile kosten SP (siehe waehrung in renderRow) - der Filter
  // vergleicht kostenSelect jeweils gegen den passenden verbleibenden Pool.
  const budgetRemaining = kategorie === 'Talente' ? sheet.tapRemaining : sheet.spRemaining;
  const nurKaufbare = kategorie !== 'Talente' && (nurKaufbareByKategorie.get(kategorie) ?? false);

  const allRows = (sheet.byKategorie[kategorie] ?? [])
    .filter((r) => r.rule.art === 'Auswahl'
      && !(r.rule.verfuegbarkeit === 'SC' && charakterTyp === 'NSC')
      && !isAusgeblendetesGeweihterTalent(r, characterReligion));
  const searchText = searchTextByKategorie.get(kategorie) ?? '';
  const needle = searchText.trim().toLowerCase();
  let rows = needle ? allRows.filter((r) => geweihterLabel(r).toLowerCase().includes(needle)) : allRows;
  if (nurKaufbare) {
    rows = rows.filter((r) => r.selected || r.kostenSelect === undefined || r.kostenSelect <= budgetRemaining);
  }

  const filtersHtml = `
    <div class="ausruestung-filters">
      <input type="text" id="auswahl-search" placeholder="Suche..." value="${escapeHtml(searchText)}" />
      ${kategorie !== 'Talente' ? `<label class="auswahl-filter-checkbox">
        <input type="checkbox" id="auswahl-nur-kaufbare" ${nurKaufbare ? 'checked' : ''} />
        Nur kaufbare zeigen
      </label>` : ''}
    </div>`;

  let listHtml: string;
  if (rows.length === 0 && needle) {
    listHtml = `<p class="auswahl-empty">Keine Treffer für "${escapeHtml(searchText)}".</p>`;
  } else if (kategorie === 'Vor- und Nachteile') {
    listHtml = renderGekauftSection(rows, sheet, characterReligion, charakterTyp)
      + renderVnGroups(rows, sheet, characterReligion, needle, charakterTyp);
  } else if (groupByParent) {
    // Manche Talente haben statt einer Charakterklasse ein anderes Talent als Parent (z.B.
    // "Beidhändig Pistolenschießen" -> "Linkshändig Pistolenschießen", als Voraussetzungs-Kette
    // gedacht). Fuer die Gruppierung wird diese Kette bis zur eigentlichen Charakterklasse
    // aufgeloest, sonst entstuende eine eigene Top-Level-Gruppe je Voraussetzungs-Talent.
    const byName = new Map<string, ComputedRule>();
    for (const r of rows) {
      byName.set(normalizeForMatch(r.rule.beschreibung ?? r.rule.referenz), r);
      byName.set(normalizeForMatch(r.rule.referenz), r);
    }
    const resolveKlasse = (r: ComputedRule): string => {
      let current = r;
      const seen = new Set<ComputedRule>();
      while (current.rule.parent) {
        const parentRow = byName.get(normalizeForMatch(current.rule.parent));
        if (!parentRow || seen.has(parentRow)) break;
        seen.add(parentRow);
        current = parentRow;
      }
      return current.rule.parent ?? 'Sonstige';
    };

    const groups = new Map<string, ComputedRule[]>();
    for (const r of rows) {
      const key = resolveKlasse(r);
      (groups.get(key) ?? groups.set(key, []).get(key)!).push(r);
    }
    listHtml = renderGekauftSection(rows, sheet, characterReligion, charakterTyp) + [...groups.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([parent, groupRows]) => {
        // Bei aktiver Suche werden alle Gruppen mit Treffern zwangsweise aufgeklappt, OHNE den
        // manuellen Aufklapp-Zustand (openParents) zu ueberschreiben - nach Leeren des Suchfelds
        // erscheinen die Gruppen wieder so, wie der Nutzer sie zuletzt gelassen hat.
        const openAttr = needle || openParents.has(parent) ? ' open' : '';
        // "Magier"-Parent enthaelt zusaetzlich die 36 Magus-Stufe-Zeilen (12 Schulen x 3 Stufen) -
        // die werden aus der flachen Liste herausgezogen und als eigene Schule-Untergruppen
        // gerendert, alle anderen Magier-Talente (Blutmagie, Konzentration, ...) bleiben flach.
        const magusRows = parent === 'Magier' ? groupRows.filter(isMagusStufenTalent) : [];
        const restRows = magusRows.length > 0 ? groupRows.filter((r) => !isMagusStufenTalent(r)) : groupRows;
        return `
          <div class="stat-card">
            <details class="stat-group" data-parent="${escapeHtml(parent)}"${openAttr}>
              <summary>${escapeHtml(parent)} <span class="stat-group-count">(${groupRows.length})</span></summary>
              <div class="auswahl-category">${restRows.map((r) => renderRow(r, sheet, characterReligion, charakterTyp)).join('')}</div>
              ${magusRows.length > 0 ? renderMagusSchuleGruppen(magusRows, sheet, characterReligion, needle, charakterTyp) : ''}
            </details>
          </div>`;
      }).join('');
  } else {
    listHtml = `<div class="auswahl-category">${rows.map((r) => renderRow(r, sheet, characterReligion, charakterTyp)).join('')}</div>`;
  }

  container.innerHTML = filtersHtml + listHtml;

  const searchInput = container.querySelector<HTMLInputElement>('#auswahl-search');
  if (searchInput) {
    if (searchWasFocused) {
      searchInput.focus();
      const pos = prevSelectionStart ?? searchInput.value.length;
      searchInput.setSelectionRange(pos, pos);
    }
    searchInput.addEventListener('input', (e) => {
      searchTextByKategorie.set(kategorie, (e.target as HTMLInputElement).value);
      renderAuswahlView(container, sheet, kategorie, groupByParent, onToggle, characterReligion, charakterTyp);
    });
  }

  const nurKaufbareCheckbox = container.querySelector<HTMLInputElement>('#auswahl-nur-kaufbare');
  nurKaufbareCheckbox?.addEventListener('change', (e) => {
    nurKaufbareByKategorie.set(kategorie, (e.target as HTMLInputElement).checked);
    renderAuswahlView(container, sheet, kategorie, groupByParent, onToggle, characterReligion, charakterTyp);
  });

  container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-parent]').forEach((details) => {
    const parent = details.dataset.parent!;
    details.addEventListener('toggle', () => {
      if (details.open) openParents.add(parent);
      else openParents.delete(parent);
    });
  });

  container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-magus-schule]').forEach((details) => {
    const schule = details.dataset.magusSchule!;
    details.addEventListener('toggle', () => {
      if (details.open) openMagusSchulen.add(schule);
      else openMagusSchulen.delete(schule);
    });
  });

  container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-vn-group]').forEach((details) => {
    const group = details.dataset.vnGroup!;
    details.addEventListener('toggle', () => {
      if (details.open) openVnGroups.add(group);
      else openVnGroups.delete(group);
    });
  });

  // Aufklapp-Zustand SYNCHRON vor jeder Aenderung sichern - selbes Muster wie syncOpenGroups in
  // categoryView.ts (das native 'toggle'-Event feuert laut Spec asynchron/queued, ein Checkbox-
  // Klick direkt nach dem Aufklappen koennte sonst vor dem Toggle-Handler re-rendern und die
  // Gruppe faelschlich zuklappen lassen).
  function syncOpenParents(): void {
    container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-parent]').forEach((details) => {
      const parent = details.dataset.parent!;
      if (details.open) openParents.add(parent);
      else openParents.delete(parent);
    });
    container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-magus-schule]').forEach((details) => {
      const schule = details.dataset.magusSchule!;
      if (details.open) openMagusSchulen.add(schule);
      else openMagusSchulen.delete(schule);
    });
    container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-vn-group]').forEach((details) => {
      const group = details.dataset.vnGroup!;
      if (details.open) openVnGroups.add(group);
      else openVnGroups.delete(group);
    });
  }

  container.querySelectorAll<HTMLInputElement>('.auswahl-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const row = checkbox.closest<HTMLElement>('.auswahl-row')!;
      const referenz = row.dataset.referenz!;
      syncOpenParents();
      onToggle(referenz, checkbox.checked);
    });
  });
}
