// Artefakte (Grad-Kosten-Karten, teils mit Ziel-Auswahl fuer WHK/Grundfertigkeit oder eine
// profane NK-Waffe fuer X-Klingen) - siehe ausruestung.ts-Dateikopf fuer den Gesamtkontext der
// Ausruestungs-Ansicht.

import type { CharacterState } from '../state/characterStore';
import { RULES } from '../data/rules';
import { ARTEFAKT_BASIS, ARTEFAKT_KOSTEN } from '../data/equipment/artefakte';
import { previewArtefaktPrice, type ArtefaktVariant } from '../engine/equipmentPricing';
import { MELEE_WEAPON_BY_SOURCE_ROW } from '../engine/weaponCatalog';
import { isXKlingeReferenz, resolveXKlingeWirkung, xKlingeTooltip } from '../engine/xKlinge';
import { artefaktTooltip, resolveArtefaktGradWerte } from '../engine/artefaktWirkung';
import { formatDublonen } from '../utils/format';
import { tooltipAttr } from './tooltip';
import { escapeHtml, gesperrtLabel, bestehenderCharakterMode } from './ausruestungShared';
import type { AusruestungCallbacks } from './ausruestung';

/** Punkt 6: Artefakte "WHK-Talentwert erhöhen"/"Grundfertigkeit erhöhen" - der Beschreibungstext
 *  beider Artefakte verlangt "Wert muss vorher mindestens 4 betragen haben" (TaW>3). Befristete
 *  Zaubereffekte (WD 7h/40min, kein "immer aktiv"-Artefakt wie Eigenschaft/Attribut, siehe
 *  artefaktBonus.ts) - hier daher NUR Zielauswahl + Speicherung, keine automatische Bonuswirkung. */
export const WHK_TALENTWERT_ARTEFAKT_REFERENZ = 'artefakt_whk_talentwert_erhoehen';
export const GRUNDFERTIGKEIT_ARTEFAKT_REFERENZ = 'artefakt_grundfertigkeit_erhoehen';

interface ArtefaktZielOption { value: string; label: string; wert: number; }

function whkZielOptionen(character: CharacterState): ArtefaktZielOption[] {
  const feste = RULES.filter((r) => r.kategorie === 'WHK' && r.art === 'Wert' && !r.parent)
    .map((r) => ({ value: r.referenz, label: r.beschreibung ?? r.referenz, wert: character.values[r.referenz] ?? 0 }));
  const freie = character.customWhkHauptfertigkeiten.map((h) => ({ value: h.id, label: h.name, wert: h.wert }));
  return [...feste, ...freie].filter((o) => o.wert > 3).sort((a, b) => a.label.localeCompare(b.label, 'de'));
}

function grundfertigkeitZielOptionen(character: CharacterState): ArtefaktZielOption[] {
  return RULES.filter((r) => r.kategorie === 'Grundfertigkeit' && r.art === 'Wert')
    .map((r) => ({ value: r.referenz, label: r.beschreibung ?? r.referenz, wert: character.values[r.referenz] ?? 0 }))
    .filter((o) => o.wert > 3)
    .sort((a, b) => a.label.localeCompare(b.label, 'de'));
}

/** Fuer den Besitz-Eintrag eines bereits gekauften "WHK-Talentwert erhöhen"/"Grundfertigkeit
 *  erhöhen"-Artefakts: loest die beim Kauf gespeicherte Ziel-Referenz (`selections.ziel`, siehe
 *  characterMutations.ts buyArtefakt) auf einen Anzeigenamen auf. Bewusst OHNE den TaW>3-Filter
 *  der obigen *ZielOptionen-Funktionen (die sind nur fuer die Kauf-Dropdown-Auswahl) - ein einmal
 *  gekauftes Artefakt soll sein Ziel weiter anzeigen, auch wenn der TaW seither gesunken ist. */
export function resolveArtefaktZielLabel(character: CharacterState, artefaktReferenz: string, ziel: string): string | undefined {
  if (artefaktReferenz === WHK_TALENTWERT_ARTEFAKT_REFERENZ) {
    const custom = character.customWhkHauptfertigkeiten.find((h) => h.id === ziel);
    if (custom) return custom.name;
    return RULES.find((r) => r.kategorie === 'WHK' && r.referenz === ziel)?.beschreibung ?? ziel;
  }
  if (artefaktReferenz === GRUNDFERTIGKEIT_ARTEFAKT_REFERENZ) {
    return RULES.find((r) => r.kategorie === 'Grundfertigkeit' && r.referenz === ziel)?.beschreibung ?? ziel;
  }
  return undefined;
}

/** Auch die Artefaktkarten sind native <details>. Deren Zustand muss separat gespeichert werden,
 *  weil ein Kauf in main.ts die komplette App (einschliesslich #view-container) ersetzt und der
 *  naechste Renderer deshalb kein altes DOM mehr vorfindet. */
export const openArtefakte = new Set<string>();

export function renderArtefaktRow(basis: (typeof ARTEFAKT_BASIS)[number], character: CharacterState): string {
  const kostenRows = ARTEFAKT_KOSTEN.filter((k) => k.referenz === basis.referenz);
  const xKlinge = isXKlingeReferenz(basis.referenz);
  const profaneWaffen = xKlinge
    ? character.equipment.filter((entry) => entry.family === 'weapon' && entry.magisch !== true)
    : [];
  const keineProfaneWaffe = xKlinge && profaneWaffen.length === 0;
  const waffenPicker = xKlinge ? `
    <label class="artefakt-waffen-ziel-label">
      Profane NK-Waffe
      <select class="artefakt-waffen-ziel" ${keineProfaneWaffe ? 'disabled' : ''}>
        ${profaneWaffen.map((entry, index) => {
          const row = MELEE_WEAPON_BY_SOURCE_ROW.get(entry.baseId);
          return `<option value="${escapeHtml(entry.id)}">${index + 1}. ${escapeHtml(row?.name ?? 'Unbekannte Waffe')} (${formatDublonen(entry.computedPriceSnapshot ?? 0)})</option>`;
        }).join('')}
      </select>
    </label>
    ${keineProfaneWaffe ? '<p class="artefakt-waffen-hinweis">Benötigt mindestens eine profane NK-Waffe.</p>' : ''}
  ` : '';
  const istWhkZiel = basis.referenz === WHK_TALENTWERT_ARTEFAKT_REFERENZ;
  const istGrundfertigkeitZiel = basis.referenz === GRUNDFERTIGKEIT_ARTEFAKT_REFERENZ;
  const zielOptionen = istWhkZiel ? whkZielOptionen(character) : istGrundfertigkeitZiel ? grundfertigkeitZielOptionen(character) : undefined;
  const keinZiel = zielOptionen !== undefined && zielOptionen.length === 0;
  const zielPicker = zielOptionen ? `
    <label class="artefakt-waffen-ziel-label">
      Ziel-${istWhkZiel ? 'WHK' : 'Grundfertigkeit'}
      <select class="artefakt-ziel-auswahl" ${keinZiel ? 'disabled' : ''}>
        ${zielOptionen.map((o) => `<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)} (TaW ${o.wert})</option>`).join('')}
      </select>
    </label>
    ${keinZiel ? `<p class="artefakt-waffen-hinweis">Benötigt eine ${istWhkZiel ? 'WHK-Fertigkeit' : 'Grundfertigkeit'} mit TaW über 3.</p>` : ''}
  ` : '';
  const keinKaufZiel = keineProfaneWaffe || keinZiel;
  const options = kostenRows.map((k) => {
    const einmalig = previewArtefaktPrice(k, 'einmalig');
    const permanent = previewArtefaktPrice(k, 'permanent');
    const verfuegbarkeitEinmalig = Number(k.verfuegbarkeitEinmalig);
    const verfuegbarkeitPermanent = Number(k.verfuegbarkeitPermanent);
    const einmaligGesperrt = !bestehenderCharakterMode && Number.isFinite(verfuegbarkeitEinmalig) && verfuegbarkeitEinmalig >= 5;
    const permanentGesperrt = !bestehenderCharakterMode && Number.isFinite(verfuegbarkeitPermanent) && verfuegbarkeitPermanent >= 5;
    const einmaligDisabled = einmaligGesperrt || keinKaufZiel;
    const permanentDisabled = permanentGesperrt || keinKaufZiel;
    const wirkung = xKlinge ? resolveXKlingeWirkung(basis.referenz, k.grad ?? '') : undefined;
    const gradWerte = resolveArtefaktGradWerte(basis, k.grad ?? '');
    const wirkungText = wirkung
      ? [xKlingeTooltip(wirkung), `ED: ${gradWerte.effektdauer}`, `WD: ${gradWerte.wirkungsdauer}`].join('\n')
      : artefaktTooltip(basis, k.grad ?? '');
    const zielFehltLabel = istWhkZiel ? 'Ziel-WHK benötigt' : 'Ziel-Grundfertigkeit benötigt';
    return `
      <div class="artefakt-grad-row"${tooltipAttr(wirkungText)}>
        <span class="artefakt-grad-label">Grad ${escapeHtml(k.grad ?? '?')}</span>
        ${einmalig !== null ? `<button type="button" class="ausruestung-buy-button ausruestung-buy-artefakt${einmaligDisabled ? ' ausruestung-buy-locked' : ''}" data-referenz="${basis.referenz}" data-grad="${k.grad}" data-variant="einmalig" data-artefakt-preis="${einmalig}" ${einmaligDisabled ? 'disabled' : ''}>${einmaligGesperrt ? gesperrtLabel(verfuegbarkeitEinmalig) : keineProfaneWaffe ? 'Profane NK-Waffe benötigt' : keinZiel ? zielFehltLabel : `Einmalig kaufen (${formatDublonen(einmalig)})`}</button>` : ''}
        ${permanent !== null ? `<button type="button" class="ausruestung-buy-button ausruestung-buy-artefakt${permanentDisabled ? ' ausruestung-buy-locked' : ''}" data-referenz="${basis.referenz}" data-grad="${k.grad}" data-variant="permanent" data-artefakt-preis="${permanent}" ${permanentDisabled ? 'disabled' : ''}>${permanentGesperrt ? gesperrtLabel(verfuegbarkeitPermanent) : keineProfaneWaffe ? 'Profane NK-Waffe benötigt' : keinZiel ? zielFehltLabel : `Permanent kaufen (${formatDublonen(permanent)})`}</button>` : ''}
      </div>`;
  }).join('');
  // <details> als direktes Flex-Item hat einen Chromium-Renderbug (open=false im DOM, Inhalt
  // trotzdem sichtbar ausserhalb des Layouts) - Huelle als nicht-flex Block-Element dazwischen.
  return `
    <div class="artefakt-card">
      <details class="artefakt-details" data-artefakt-referenz="${escapeHtml(basis.referenz)}"${openArtefakte.has(basis.referenz) ? ' open' : ''}>
        <summary>${escapeHtml(basis.name ?? basis.referenz)}</summary>
        <p class="artefakt-beschreibung">${escapeHtml(basis.beschreibung ?? '')}</p>
        ${waffenPicker}
        ${zielPicker}
        ${options}
      </details>
    </div>`;
}

export function wireArtefakteEvents(
  container: HTMLElement, character: CharacterState, callbacks: AusruestungCallbacks,
): void {
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy-artefakt').forEach((btn) => {
    btn.addEventListener('click', () => {
      const referenz = btn.dataset.referenz!;
      const grad = btn.dataset.grad!;
      const variant = btn.dataset.variant as ArtefaktVariant;
      let targetWeaponId: string | undefined;
      let targetReferenz: string | undefined;
      if (referenz === WHK_TALENTWERT_ARTEFAKT_REFERENZ || referenz === GRUNDFERTIGKEIT_ARTEFAKT_REFERENZ) {
        targetReferenz = btn.closest('.artefakt-card')?.querySelector<HTMLSelectElement>('.artefakt-ziel-auswahl')?.value;
      }
      if (isXKlingeReferenz(referenz)) {
        targetWeaponId = btn.closest('.artefakt-card')?.querySelector<HTMLSelectElement>('.artefakt-waffen-ziel')?.value;
        const weapon = character.equipment.find((entry) => entry.id === targetWeaponId);
        const weaponRow = weapon ? MELEE_WEAPON_BY_SOURCE_ROW.get(weapon.baseId) : undefined;
        const wirkung = resolveXKlingeWirkung(referenz, grad);
        const artefaktPreis = Number(btn.dataset.artefaktPreis ?? 0);
        const waffenWert = weapon?.computedPriceSnapshot ?? 0;
        const neuerName = `${wirkung.namenspraefix}-${weaponRow?.name ?? 'Waffe'}`;
        const confirmed = window.confirm([
          `${weaponRow?.name ?? 'Waffe'} mit ${wirkung.namenspraefix}-Klinge Grad ${grad} verzaubern?`,
          `Ergebnis: ${neuerName}`,
          `Neuer Gegenstandswert: ${formatDublonen(waffenWert + artefaktPreis)}`,
          `Jetzt zu bezahlen: ${formatDublonen(artefaktPreis)}`,
          '',
          xKlingeTooltip(wirkung),
        ].join('\n'));
        if (!confirmed) return;
      }
      callbacks.onBuyArtefakt(referenz, grad, variant, targetWeaponId, targetReferenz);
    });
  });
}
