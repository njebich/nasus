// Ausruestungs-Ansicht: Preisliste, Artefakte, Ruestung (Basis+Verarbeitung+Anpassung-
// Komposition), Schilde und Waffen (je Basis+Material+Fertigung(+Anpassung/Schaftmaterial)-
// Komposition) mit Kaufen-Buttons, plus "Mein Inventar". Keine Markt-Kontext-Faktoren
// angewendet (siehe equipmentPricing.ts).

import type { ComputedSheet } from '../engine/characterSheet';
import { formatDublonen } from '../utils/format';
import { ruestungSlotKey, type CharacterState } from '../state/characterStore';
import type { RsGruppe } from '../data/trefferzonen';
import { PREISLISTE } from '../data/equipment/preisliste';
import { ARTEFAKT_BASIS, ARTEFAKT_KOSTEN } from '../data/equipment/artefakte';
import { RUESTUNG_BASIS, RUESTUNG_VERARBEITUNG, RUESTUNG_ANPASSUNG, type GenericRow } from '../data/equipment/armor';
import { SCHILD_MATERIAL, SCHILD_FERTIGUNG, SCHILD_BESPANNUNG } from '../data/equipment/shields';
import { NK_WAFFEN_BASIS, NK_MATERIAL, NK_FERTIGUNG, NK_ANPASSUNG, NK_SCHAFTMATERIAL } from '../data/equipment/weapons';
import { BOEGEN, ARMBRUST, PFEILE, BOLZEN, FEUERWAFFEN, type FernkampfRow } from '../data/equipment/fernkampf';
import { ALCHEMIKA, type AlchemikaRow } from '../data/equipment/alchemika';
import {
  feuerwaffenMunitionOptionen,
  FEUERWAFFEN_MUNITION_PREISE,
  type FeuerwaffenMunitionArt,
} from '../data/equipment/feuerwaffenMunition';
import { previewPreislistePrice, previewArtefaktPrice, type ArtefaktVariant } from '../engine/equipmentPricing';
import { tooltipAttr } from './tooltip';
import { composeArmor } from '../engine/armorComposition';
import { composeShield, istSchildKomponenteVerfuegbar } from '../engine/shieldComposition';
import { composeWeapon, istWaffenKomponenteVerfuegbar } from '../engine/weaponComposition';
import { composeMunition } from '../engine/pfeilBolzenComposition';
import {
  composeFeuerwaffe, feuerwaffenKomponentenOptionen, feuerwaffenStandardauswahl,
  type FeuerwaffenSelections,
} from '../engine/feuerwaffenComposition';
import {
  isXKlingeReferenz, resolveXKlingeWirkung, xKlingeTooltip, xKlingeWeaponName, xKlingeWirkungForEntry,
} from '../engine/xKlinge';

export interface RuestungGruppenSelection {
  lage: number;
  basisSourceRow: number;
  verarbeitungSourceRow: number;
  anpassungSourceRow: number;
}

export interface AusruestungCallbacks {
  onBuyPreisliste: (sourceRow: number, quantity: number) => void;
  onBuyArtefakt: (referenz: string, grad: string, variant: ArtefaktVariant, targetWeaponId?: string) => void;
  onEquipRuestung: (
    gruppe: RsGruppe, lage: number, basisSourceRow: number, verarbeitungSourceRow: number, anpassungSourceRow: number,
  ) => void;
  onEquipRuestungAlleTz: (gruppe: RsGruppe, selections: RuestungGruppenSelection[]) => void;
  onUnequipRuestung: (gruppe: RsGruppe, lage: number) => void;
  onBuyShield: (sourceRow: number, materialSourceRow: number, fertigungSourceRow: number, bespannungSourceRow: number) => void;
  onBuyWeapon: (
    sourceRow: number, materialSourceRow: number, fertigungSourceRow: number, anpassungSourceRow: number, schaftmaterialSourceRow: number,
  ) => void;
  onBuyFernkampfwaffe: (typ: 'boegen' | 'armbrust', sourceRow: number) => void;
  onBuyFeuerwaffe: (sourceRow: number, selections: FeuerwaffenSelections) => void;
  onBuyFeuerwaffenMunition: (art: FeuerwaffenMunitionArt, kaliber: number, quantity: number) => void;
  onBuyMunition: (typ: 'pfeile' | 'bolzen', basisSourceRow: number, modifikatorSourceRow: number | null, quantity: number) => void;
  onBuyAlchemika: (sourceRow: number, quantity: number) => void;
  onRemoveEquipment: (equipmentId: string) => void;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function kaufenLabel(preis: number): string {
  return `Kaufen (${formatDublonen(preis)})`;
}

/** Nutzer 2026-07-24: "Show full item stat block if Schilde, NK-Waffe or FK-Waffe or ammo or
 *  Alchemika" - Beschriftung fuer computedStatsSnapshot-Schluessel (generisch als
 *  Record<string, number> in characterMutations.ts gespeichert, siehe dort). verfuegbarkeit*-
 *  Schluessel sind bewusst ausgeschlossen (Kaufsperre, kein Statwert des Gegenstands selbst). */
const STAT_SNAPSHOT_LABELS: Record<string, string> = {
  rs: 'RS', at: 'AT', pa: 'PA', wk: 'WK', klingenbrecher: 'Klingenbrecher', klingenschutz: 'Klingenschutz',
  staerkeMalus: 'Stärke-Malus', minStaerke: 'Mindest-Stärke', minStaerke1H: 'Mindest-Stärke (1H)',
  minStaerke2H: 'Mindest-Stärke (2H)', rb: 'RB', gewicht: 'Gewicht', fixschaden: 'Fixschaden',
  kaliber: 'Kaliber', rw: 'RW', nachladezeit: 'Nachladezeit', nachladenTawTeiler: 'Nachladen (TaW-Teiler)',
  patzermodifikator: 'Patzer-Modifikator', rwModMeter: 'Reichweiten-Mod (m)', be: 'BE', ini: 'Initiative',
};

/** Baut den Stat-Block-Tooltip aus einem generischen Zahlen-Snapshot (Schilde/NK-Waffen/
 *  Feuerwaffen/Munition, siehe EquipmentEntry.computedStatsSnapshot bzw. die je-Kategorie
 *  composeX()-Rueckgabe hier im Shop-Picker) - eine Zeile pro Schluessel. */
function statSnapshotTooltipText(snapshot: Record<string, number | undefined> | undefined): string {
  if (!snapshot) return '';
  const lines = Object.entries(snapshot)
    .filter((entry): entry is [string, number] => entry[1] !== undefined && !entry[0].startsWith('verfuegbarkeit'))
    .map(([key, value]) => `${STAT_SNAPSHOT_LABELS[key] ?? key}: ${value}`);
  return lines.join('\n');
}

function statSnapshotTooltip(snapshot: Record<string, number | undefined> | undefined): string {
  return tooltipAttr(statSnapshotTooltipText(snapshot));
}

/** Boegen/Armbrust speichern KEINEN computedStatsSnapshot (fertige Objekte mit festem Preis,
 *  siehe buyFernkampfwaffe) - der Stat-Block kommt hier direkt aus den rohen Basiszeilen-Spalten,
 *  denselben, die renderFernkampfwaffeRow bereits einzeilig anzeigt. */
function fernkampfwaffeStatTooltip(row: FernkampfRow): string {
  const schaden = `${row['1.W'] ?? '–'}${row['Fixschaden'] ? ` ${row['Fixschaden']}` : ''}`;
  return tooltipAttr([
    `Min. Stärke: ${row['Min. Stä'] ?? '–'}`,
    `Schaden: ${schaden}`,
    `RB: ${row['RB'] ?? '–'}`,
    `RW: ${row['RW'] ?? '–'}`,
    `Nachladezeit: ${row['Nachladezeit'] ?? '–'}`,
  ].join('\n'));
}

/** Alchemika speichert ebenfalls keinen computedStatsSnapshot (reine Preisliste, kein Kompositions-
 *  Ergebnis) - der Stat-Block hier ist Kategorie+Wirkung+Beschreibung aus dem Katalog. */
function alchemikaStatTooltip(row: AlchemikaRow): string {
  const lines = [`Kategorie: ${row.kategorie}`, `Wirkung: ${row.wirkung}`];
  if (row.beschreibung) lines.push(`Beschreibung: ${row.beschreibung}`);
  return tooltipAttr(lines.join('\n'));
}

function gesperrtLabel(verfuegbarkeit: number): string {
  return `(gesperrt) Verfügbarkeit ${verfuegbarkeit}`;
}

const PREISLISTE_ARTEN = [...new Set(PREISLISTE.map((r) => r.art).filter((a): a is string => !!a))].sort();
const SHIELDS = NK_WAFFEN_BASIS.filter((r) => r['Spezialisierung'] === 'Schild');
const WEAPONS = NK_WAFFEN_BASIS.filter((r) => r['Spezialisierung'] !== 'Schild');
const WEAPON_HAUPTFERTIGKEITEN = [...new Set(WEAPONS.map((r) => r['Hauptfertigkeit']).filter((v): v is string => !!v))].sort();

let selectedArt = PREISLISTE_ARTEN[0] ?? '';
let searchText = '';
let selectedHauptfertigkeit = WEAPON_HAUPTFERTIGKEITEN[0] ?? '';
let searchWaffen = '';
let searchSchilde = '';
let searchBoegen = '';
let searchArmbrueste = '';
let searchFeuerwaffen = '';
let searchAlchemika = '';
let searchArtefakte = '';

// TZ-Gruppen x Lagen (Regel Nutzer 2026-07-17: "im character state muss die ruestung erfasst
// werden" + "feste Slots: TZ-Gruppe x Lage"). Lage 0 (Kleidung) bewusst kein Slot, siehe
// characterStore.ts. Beschriftung wie auf dem Charakterblatt ("nur Kopf/Torso/Arme/Beine
// genannt, Zuordnung ist den Spielern bekannt").
const RS_GRUPPEN: ReadonlyArray<{ gruppe: RsGruppe; label: string }> = [
  { gruppe: 'kopf', label: 'Kopf' },
  { gruppe: 'torso', label: 'Torso' },
  { gruppe: 'arme', label: 'Arme' },
  { gruppe: 'beine', label: 'Beine' },
];
const RUESTUNG_LAGEN = [1, 2, 3, 4, 5] as const;
// Sentinel-Wert im Basis-Select: "Keine Ruestung" muss auf jeder Lage waehlbar sein (Nutzer
// 2026-07-22), damit eine Lage explizit leer bleibt statt implizit die erste Basis-Option
// vorauszuwaehlen - relevant v.a. fuer "Für alle TZ kaufen" (leere Lage wird dort uebersprungen).
const RUESTUNG_KEINE = -1;

/** Transiente Picker-Auswahl je unbelegtem Slot (ueberlebt Re-Renders, bis "Ausruesten" geklickt
 *  wird) - analog zum frueheren globalen armorBasisRow/.../-Muster, jetzt aber pro Slot. */
const slotPicker = new Map<string, { basisSourceRow: number; verarbeitungSourceRow: number; anpassungSourceRow: number }>();

/** Welche Ruestungs-Gruppen (Kopf/Torso/Arme/Beine) der Spieler aufgeklappt hat - wie
 *  categoryView.ts's openGroupReferenzen: <details> hat keinen persistenten Zustand ueber ein
 *  komplettes Neu-Rendern hinweg, ohne das klappt die Gruppe bei jeder Aenderung (Dropdown-
 *  Wechsel, Ausruesten, ...) faelschlich wieder zu. */
const openGruppen = new Set<RsGruppe>();

/** Welche Oberpunkte (Mein Inventar/Ruestung/Schilde/Waffen/Bögen/Armbrüste/Feuerwaffen/...) aufgeklappt
 *  sind (Nutzer 2026-07-18: "jeden oberpunkt ... collapsible haben, damit die tabelle nicht so
 *  lang ist") - alle standardmaessig zu, gleiches Persistenz-Muster wie openGruppen oben. */
const TOP_SECTIONS = [
  'inventar', 'ruestung', 'schilde', 'waffen', 'boegen', 'armbrueste', 'feuerwaffen',
  'alchemika', 'preisliste', 'artefakte',
] as const;
type TopSection = (typeof TOP_SECTIONS)[number];
const openTopSections = new Set<TopSection>();

/** "Bestehenden Charakter erstellen"-Modus (Nutzer 2026-07-24): deaktiviert alle Verfuegbarkeit-
 *  Kaufsperren-Anzeigen (gesperrt-Buttons) analog zur Mutation-Gate-Abschaltung in
 *  characterMutations.ts - modul-globaler Renderer-Zustand wie openGruppen/alchemikaQty etc.,
 *  von renderAusruestungView() bei jedem Render aus character.bestehenderCharakter gesetzt. */
let bestehenderCharakterMode = false;

/** Alchemika-Katalog gruppiert nach Kategorie (Gifte/Heiltraenke/Kampftraenke/Parfum/
 *  Zustandstraenke), collapsible je Kategorie (Nutzer 2026-07-19: "Ausgabe collapsible nach
 *  Kategorie") - gleiches Aufklapp-Persistenz-Muster wie openGruppen/openTopSections. */
const ALCHEMIKA_KATEGORIEN = [...new Set(ALCHEMIKA.map((r) => r.kategorie))];
const openAlchemikaKategorien = new Set<string>();

/** Aufgeklappte Volksgruppen innerhalb der Fernkampf-Kategorien. Kategorie und Volk bilden
 *  gemeinsam den Schluessel. Neue Gruppen fehlen bewusst im Set und starten eingeklappt. */
const openFernkampfVolksgruppen = new Set<string>();

/** Pfeile/Bolzen sind eigene Untergruppen in den Fernkampf-Kategorien. Ihr Aufklappzustand
 *  bleibt bei Modifikator- und Mengenwechseln erhalten. */
const openMunitionGruppen = new Set<'pfeile' | 'bolzen'>();

/** Transiente Mengen-Auswahl je Alchemika-Zeile (analog zum Preisliste-Mengenfeld, aber ueber
 *  Re-Renders hinweg gemerkt statt aus dem DOM neu gelesen, da renderAlchemikaRow keine eigene
 *  updatePicker-Funktion braucht). */
const alchemikaQty = new Map<number, number>();

function renderAlchemikaRow(row: AlchemikaRow): string {
  const qty = alchemikaQty.get(row.sourceRow) ?? 1;
  const gesperrt = !bestehenderCharakterMode && row.verfuegbarkeitStufe !== undefined && row.verfuegbarkeitStufe >= 5;
  return `
    <div class="ausruestung-row" data-alchemika="${row.sourceRow}"${alchemikaStatTooltip(row)}>
      <span class="stat-label">${escapeHtml(row.name)}</span>
      <span class="stat-cost">${escapeHtml(row.wirkung)}${row.beschreibung ? ` — ${escapeHtml(row.beschreibung)}` : ''}</span>
      ${row.preisDublonen !== undefined ? `
        <input type="number" class="ausruestung-qty" min="1" value="${qty}" data-alchemika-qty="${row.sourceRow}" ${gesperrt ? 'disabled' : ''}/>
        <button type="button" class="ausruestung-buy-button ausruestung-buy-alchemika${gesperrt ? ' ausruestung-buy-locked' : ''}" data-source-row="${row.sourceRow}" data-unit-price="${row.preisDublonen}" ${gesperrt ? 'disabled' : ''}>${gesperrt ? gesperrtLabel(row.verfuegbarkeitStufe!) : kaufenLabel(row.preisDublonen * qty)}</button>
      ` : `<span class="stat-cost">nicht käuflich (${escapeHtml(row.preisRoh ?? '?')})</span><span></span>`}
    </div>`;
}

function renderAlchemikaKategorie(kategorie: string, needle: string): string {
  const rows = ALCHEMIKA.filter((r) => r.kategorie === kategorie && (!needle || r.name.toLowerCase().includes(needle)));
  if (rows.length === 0) return '';
  const openAttr = needle || openAlchemikaKategorien.has(kategorie) ? ' open' : '';
  return `
    <div class="stat-card">
      <details class="stat-group" data-alchemika-kategorie="${escapeHtml(kategorie)}"${openAttr}>
        <summary>${escapeHtml(kategorie)} <span class="stat-group-count">(${rows.length} Einträge)</span></summary>
        <div class="stat-subgroup">
          ${rows.map(renderAlchemikaRow).join('')}
        </div>
      </details>
    </div>`;
}

function renderPreislisteRow(row: (typeof PREISLISTE)[number]): string {
  const price = previewPreislistePrice(row, 1);
  return `
    <div class="ausruestung-row">
      <span class="stat-label">${escapeHtml(row.name ?? '')}</span>
      ${price !== null ? `
        <input type="number" class="ausruestung-qty" min="1" value="1" data-source-row="${row.sourceRow}" />
        <button type="button" class="ausruestung-buy-button ausruestung-buy" data-source-row="${row.sourceRow}" data-unit-price="${price}">${kaufenLabel(price)}</button>
      ` : `<span class="stat-cost">nicht käuflich (${escapeHtml(row.preisRoh ?? '?')})</span><span></span>`}
    </div>`;
}

function renderArtefaktRow(basis: (typeof ARTEFAKT_BASIS)[number], character: CharacterState): string {
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
          const row = NK_WAFFEN_BASIS.find((weapon) => String(weapon.sourceRow) === entry.baseId);
          return `<option value="${escapeHtml(entry.id)}">${index + 1}. ${escapeHtml(row?.name ?? 'Unbekannte Waffe')} (${formatDublonen(entry.computedPriceSnapshot ?? 0)})</option>`;
        }).join('')}
      </select>
    </label>
    ${keineProfaneWaffe ? '<p class="artefakt-waffen-hinweis">Benötigt mindestens eine profane NK-Waffe.</p>' : ''}
  ` : '';
  const options = kostenRows.map((k) => {
    const einmalig = previewArtefaktPrice(k, 'einmalig');
    const permanent = previewArtefaktPrice(k, 'permanent');
    const verfuegbarkeitEinmalig = Number(k.verfuegbarkeitEinmalig);
    const verfuegbarkeitPermanent = Number(k.verfuegbarkeitPermanent);
    const einmaligGesperrt = !bestehenderCharakterMode && Number.isFinite(verfuegbarkeitEinmalig) && verfuegbarkeitEinmalig >= 5;
    const permanentGesperrt = !bestehenderCharakterMode && Number.isFinite(verfuegbarkeitPermanent) && verfuegbarkeitPermanent >= 5;
    const einmaligDisabled = einmaligGesperrt || keineProfaneWaffe;
    const permanentDisabled = permanentGesperrt || keineProfaneWaffe;
    const wirkung = xKlinge ? resolveXKlingeWirkung(basis.referenz, k.grad ?? '') : undefined;
    const wirkungText = wirkung
      ? xKlingeTooltip(wirkung)
      : [
        basis.beschreibung ? `Wirkung: ${basis.beschreibung}` : '',
        basis.wirkungBasis ? `Wirkungswert: ${basis.wirkungBasis}${basis.wirkungEinheit ? ` ${basis.wirkungEinheit}` : ''}` : '',
      ].filter(Boolean).join('\n');
    return `
      <div class="artefakt-grad-row"${tooltipAttr(wirkungText)}>
        <span class="artefakt-grad-label">Grad ${escapeHtml(k.grad ?? '?')}</span>
        ${einmalig !== null ? `<button type="button" class="ausruestung-buy-button ausruestung-buy-artefakt${einmaligDisabled ? ' ausruestung-buy-locked' : ''}" data-referenz="${basis.referenz}" data-grad="${k.grad}" data-variant="einmalig" data-artefakt-preis="${einmalig}" ${einmaligDisabled ? 'disabled' : ''}>${einmaligGesperrt ? gesperrtLabel(verfuegbarkeitEinmalig) : keineProfaneWaffe ? 'Profane NK-Waffe benötigt' : `Einmalig kaufen (${formatDublonen(einmalig)})`}</button>` : ''}
        ${permanent !== null ? `<button type="button" class="ausruestung-buy-button ausruestung-buy-artefakt${permanentDisabled ? ' ausruestung-buy-locked' : ''}" data-referenz="${basis.referenz}" data-grad="${k.grad}" data-variant="permanent" data-artefakt-preis="${permanent}" ${permanentDisabled ? 'disabled' : ''}>${permanentGesperrt ? gesperrtLabel(verfuegbarkeitPermanent) : keineProfaneWaffe ? 'Profane NK-Waffe benötigt' : `Permanent kaufen (${formatDublonen(permanent)})`}</button>` : ''}
      </div>`;
  }).join('');
  // <details> als direktes Flex-Item hat einen Chromium-Renderbug (open=false im DOM, Inhalt
  // trotzdem sichtbar ausserhalb des Layouts) - Huelle als nicht-flex Block-Element dazwischen.
  return `
    <div class="artefakt-card">
      <details class="artefakt-details">
        <summary>${escapeHtml(basis.name ?? basis.referenz)}</summary>
        <p class="artefakt-beschreibung">${escapeHtml(basis.beschreibung ?? '')}</p>
        ${waffenPicker}
        ${options}
      </details>
    </div>`;
}

function renderRuestungSlotRow(gruppe: RsGruppe, lage: number, character: CharacterState): string {
  const key = ruestungSlotKey(gruppe, lage);
  const equipped = character.ruestungSlots[key];

  if (equipped) {
    const basis = RUESTUNG_BASIS.find((r) => r.sourceRow === equipped.basisSourceRow);
    const stats = equipped.computedStatsSnapshot;
    return `
      <div class="ruestung-slot-row ausruestung-row" data-slot="${key}">
        <span class="stat-label">Lage ${lage}: ${escapeHtml(basis?.name ?? '?')}</span>
        <span class="stat-cost">RS ${stats.rs} | RH ${stats.rh} | ${equipped.computedPriceSnapshot} D</span>
        <button type="button" class="ausruestung-buy-button ruestung-unequip" data-gruppe="${gruppe}" data-lage="${lage}">Ausziehen</button>
      </div>`;
  }

  const optionen = RUESTUNG_BASIS.filter((r) => Number(r['Lage']) === lage);
  if (optionen.length === 0) {
    // Lage 5 (Drachenschuppen/Spinnweben) hat noch keine Daten in Ruestung-Basis - Slot ist
    // strukturell vorbereitet, aber ohne Kaufoption bis die Daten+Sonderregeln stehen.
    return `
      <div class="ruestung-slot-row ausruestung-row">
        <span class="stat-label">Lage ${lage}: (noch keine Optionen hinterlegt)</span>
      </div>`;
  }

  const sel = slotPicker.get(key) ?? {
    basisSourceRow: RUESTUNG_KEINE,
    verarbeitungSourceRow: RUESTUNG_VERARBEITUNG[0]?.sourceRow ?? 0,
    anpassungSourceRow: RUESTUNG_ANPASSUNG[0]?.sourceRow ?? 0,
  };
  const basisSelectHtml = `
    <select class="ruestung-basis-select" data-slot="${key}">
      <option value="${RUESTUNG_KEINE}" ${sel.basisSourceRow === RUESTUNG_KEINE ? 'selected' : ''}>Keine Rüstung</option>
      ${optionen.map((r) => `<option value="${r.sourceRow}" ${r.sourceRow === sel.basisSourceRow ? 'selected' : ''}>${escapeHtml(r.name)}</option>`).join('')}
    </select>`;

  if (sel.basisSourceRow === RUESTUNG_KEINE) {
    return `
      <div class="ruestung-slot-row ausruestung-row" data-slot="${key}" data-gruppe="${gruppe}" data-lage="${lage}">
        <span class="stat-label">Lage ${lage}</span>
        ${basisSelectHtml}
        <span class="stat-cost">RS 0 | RH 0 | 0 D</span>
      </div>`;
  }

  const basis = optionen.find((r) => r.sourceRow === sel.basisSourceRow) ?? optionen[0];
  const verarbeitung = RUESTUNG_VERARBEITUNG.find((r) => r.sourceRow === sel.verarbeitungSourceRow) ?? RUESTUNG_VERARBEITUNG[0];
  const anpassung = RUESTUNG_ANPASSUNG.find((r) => r.sourceRow === sel.anpassungSourceRow) ?? RUESTUNG_ANPASSUNG[0];
  const composed = composeArmor(basis, verarbeitung, anpassung);

  return `
    <div class="ruestung-slot-row ausruestung-row" data-slot="${key}" data-gruppe="${gruppe}" data-lage="${lage}">
      <span class="stat-label">Lage ${lage}</span>
      ${basisSelectHtml}
      <select class="ruestung-verarbeitung-select" data-slot="${key}">
        ${RUESTUNG_VERARBEITUNG.map((r) => `<option value="${r.sourceRow}" ${r.sourceRow === verarbeitung.sourceRow ? 'selected' : ''}>${escapeHtml(r.name)}</option>`).join('')}
      </select>
      <select class="ruestung-anpassung-select" data-slot="${key}">
        ${RUESTUNG_ANPASSUNG.map((r) => `<option value="${r.sourceRow}" ${r.sourceRow === anpassung.sourceRow ? 'selected' : ''}>${escapeHtml(r.name)}</option>`).join('')}
      </select>
      <span class="stat-cost">RS ${composed.rs} | RH ${composed.rh} | ${composed.preis} D</span>
      <button type="button" class="ausruestung-buy-button ruestung-equip" data-gruppe="${gruppe}" data-lage="${lage}">${kaufenLabel(composed.preis)}</button>
    </div>`;
}

/** Liest fuer jede Lage der gegebenen Gruppe die "gewuenschte" Basis/Verarbeitung/Anpassung
 *  aus - entweder das bereits Ausgeruestete, oder (falls noch leer) die aktuelle Picker-Auswahl
 *  (bzw. deren Default). Lagen ohne Optionen (z.B. Lage 5) werden ausgelassen. Grundlage fuer
 *  den "Für alle TZ kaufen"-Button (Nutzer 2026-07-22: "ich stelle alle lagen wie gewünscht ein
 *  und der klick auf den button kauft alles wie auf dieser TZ auf allen anderen tz"). */
function getGruppenSelections(gruppe: RsGruppe, character: CharacterState): RuestungGruppenSelection[] {
  const selections: RuestungGruppenSelection[] = [];
  for (const lage of RUESTUNG_LAGEN) {
    const key = ruestungSlotKey(gruppe, lage);
    const equipped = character.ruestungSlots[key];
    if (equipped) {
      selections.push({
        lage, basisSourceRow: equipped.basisSourceRow,
        verarbeitungSourceRow: equipped.verarbeitungSourceRow, anpassungSourceRow: equipped.anpassungSourceRow,
      });
      continue;
    }
    const optionen = RUESTUNG_BASIS.filter((r) => Number(r['Lage']) === lage);
    if (optionen.length === 0) continue;
    const sel = slotPicker.get(key) ?? {
      basisSourceRow: RUESTUNG_KEINE,
      verarbeitungSourceRow: RUESTUNG_VERARBEITUNG[0]?.sourceRow ?? 0,
      anpassungSourceRow: RUESTUNG_ANPASSUNG[0]?.sourceRow ?? 0,
    };
    if (sel.basisSourceRow === RUESTUNG_KEINE) continue;
    selections.push({ lage, ...sel });
  }
  return selections;
}

/** Summiert den Kaufpreis, den "Für alle TZ kaufen" tatsaechlich ausloesen wuerde: nur die
 *  anderen 3 Gruppen, und je Lage nur wenn dort noch nichts ausgeruestet ist (Nutzer 2026-07-22:
 *  "Überspringen und nur leere Gruppen kaufen"). */
function berechneAlleTzPreis(
  gruppe: RsGruppe, selections: RuestungGruppenSelection[], character: CharacterState,
): { preis: number; anzahl: number } {
  let preis = 0;
  let anzahl = 0;
  for (const { gruppe: ziel } of RS_GRUPPEN) {
    if (ziel === gruppe) continue;
    for (const sel of selections) {
      if (character.ruestungSlots[ruestungSlotKey(ziel, sel.lage)]) continue;
      const basis = RUESTUNG_BASIS.find((r) => r.sourceRow === sel.basisSourceRow);
      const verarbeitung = RUESTUNG_VERARBEITUNG.find((r) => r.sourceRow === sel.verarbeitungSourceRow);
      const anpassung = RUESTUNG_ANPASSUNG.find((r) => r.sourceRow === sel.anpassungSourceRow);
      if (!basis || !verarbeitung || !anpassung) continue;
      preis += composeArmor(basis, verarbeitung, anpassung).preis;
      anzahl += 1;
    }
  }
  return { preis, anzahl };
}

function renderRuestungGruppe(gruppe: RsGruppe, label: string, character: CharacterState): string {
  const gesamtRs = RUESTUNG_LAGEN.reduce(
    (sum, lage) => sum + (character.ruestungSlots[ruestungSlotKey(gruppe, lage)]?.computedStatsSnapshot.rs ?? 0), 0,
  );
  const gesamtRh = RUESTUNG_LAGEN.reduce(
    (sum, lage) => sum + (character.ruestungSlots[ruestungSlotKey(gruppe, lage)]?.computedStatsSnapshot.rh ?? 0), 0,
  );
  const openAttr = openGruppen.has(gruppe) ? ' open' : '';
  const selections = getGruppenSelections(gruppe, character);
  const { preis: alleTzPreis, anzahl: alleTzAnzahl } = berechneAlleTzPreis(gruppe, selections, character);
  const alleTzRow = selections.length === 0 ? '' : `
    <div class="ausruestung-row ruestung-alle-tz-row">
      <span class="stat-label">Für alle TZ übernehmen (${label})</span>
      ${alleTzAnzahl > 0
    ? `<button type="button" class="ausruestung-buy-button ruestung-buy-alle-tz" data-gruppe="${gruppe}">Für alle TZ kaufen (${formatDublonen(alleTzPreis)})</button>`
    : `<span class="stat-cost">bereits überall ausgerüstet</span>`}
    </div>`;
  return `
    <div class="stat-card">
      <details class="stat-group" data-gruppe="${gruppe}"${openAttr}>
        <summary>${label} <span class="stat-group-count">(RS ${gesamtRs} | RH ${gesamtRh})</span></summary>
        <div class="stat-subgroup">
          ${alleTzRow}
          ${RUESTUNG_LAGEN.map((lage) => renderRuestungSlotRow(gruppe, lage, character)).join('')}
        </div>
      </details>
    </div>`;
}

/** Transiente Picker-Auswahl je Schild (Regel Nutzer 2026-07-17: "die haben auch Anpassung" -
 *  Material/Fertigung/Bespannung, analog zum Ruestungs-Slot-Picker). Kolhartz(Material)/
 *  Kohlharz(Bespannung) sind nur fuer Zentauren waehlbar, siehe istSchildKomponenteVerfuegbar. */
const shieldPicker = new Map<number, { materialSourceRow: number; fertigungSourceRow: number; bespannungSourceRow: number }>();

function renderShieldRow(row: (typeof SHIELDS)[number], character: CharacterState): string {
  const materialOptionen = SCHILD_MATERIAL.filter((m) => istSchildKomponenteVerfuegbar(m.name, character.spezies));
  const bespannungOptionen = SCHILD_BESPANNUNG.filter((b) => istSchildKomponenteVerfuegbar(b.name, character.spezies));
  const sel = shieldPicker.get(row.sourceRow) ?? {
    materialSourceRow: materialOptionen[0]?.sourceRow ?? 0,
    fertigungSourceRow: SCHILD_FERTIGUNG[0]?.sourceRow ?? 0,
    bespannungSourceRow: bespannungOptionen[0]?.sourceRow ?? 0,
  };
  const material = materialOptionen.find((m) => m.sourceRow === sel.materialSourceRow) ?? materialOptionen[0];
  const fertigung = SCHILD_FERTIGUNG.find((f) => f.sourceRow === sel.fertigungSourceRow) ?? SCHILD_FERTIGUNG[0];
  const bespannung = bespannungOptionen.find((b) => b.sourceRow === sel.bespannungSourceRow) ?? bespannungOptionen[0];
  const composed = composeShield(row, material, fertigung, bespannung);
  const statTooltip = statSnapshotTooltip({
    rs: composed.rs, klingenbrecher: composed.klingenbrecher, klingenschutz: composed.klingenschutz,
    at: composed.at, pa: composed.pa, wk: composed.wk, staerkeMalus: composed.staerkeMalus, minStaerke: composed.minStaerke,
  });

  return `
    <div class="ausruestung-row" data-shield="${row.sourceRow}"${statTooltip}>
      <span class="stat-label">${escapeHtml(row.name)}</span>
      <select class="schild-material-select" data-shield="${row.sourceRow}">
        ${materialOptionen.map((m) => `<option value="${m.sourceRow}" ${m.sourceRow === material.sourceRow ? 'selected' : ''}>${escapeHtml(m.name)}</option>`).join('')}
      </select>
      <select class="schild-fertigung-select" data-shield="${row.sourceRow}">
        ${SCHILD_FERTIGUNG.map((f) => `<option value="${f.sourceRow}" ${f.sourceRow === fertigung.sourceRow ? 'selected' : ''}>${escapeHtml(f.name)}</option>`).join('')}
      </select>
      <select class="schild-bespannung-select" data-shield="${row.sourceRow}">
        ${bespannungOptionen.map((b) => `<option value="${b.sourceRow}" ${b.sourceRow === bespannung.sourceRow ? 'selected' : ''}>${escapeHtml(b.name)}</option>`).join('')}
      </select>
      <span class="stat-cost">RS ${composed.rs}${composed.preis === null ? ' | kein Preis (Meister-Ermessen)' : ''}</span>
      ${composed.preis !== null
    ? `<button type="button" class="ausruestung-buy-button ausruestung-buy-shield" data-shield="${row.sourceRow}">${kaufenLabel(composed.preis)}</button>`
    : '<span></span>'}
    </div>`;
}

/** Transiente Picker-Auswahl je Waffe (Regel Nutzer 2026-07-18: "fang an damit, die nk-waffen
 *  inkl. herstellungs-modifikatoren zu implementieren" - analog zum Schild-Picker, aber mit 4
 *  statt 3 Ebenen: Material/Fertigung/Anpassung/Schaftmaterial). */
const weaponPicker = new Map<number, {
  materialSourceRow: number; fertigungSourceRow: number; anpassungSourceRow: number; schaftmaterialSourceRow: number;
}>();

/** "Standard" hat ausser Name/sourceRow keine Spalten - traegt 0 zu jeder Kompositionsgroesse
 *  bei, daher als impliziter Schaftmaterial-Wert fuer Waffen ohne eigene Auswahl (siehe
 *  waffeBrauchtSchaftmaterial) sicher verwendbar. */
const SCHAFTMATERIAL_STANDARD = NK_SCHAFTMATERIAL.find((s) => s.name === 'Standard')!;

/** Regel Nutzer 2026-07-18: "Bei allen waffen, die einen holzschaft haben, muss die schaft-mod
 *  auswahl bestehen. bei allen anderen keine auswahl." - je Hauptfertigkeit uniform (nicht aus
 *  der uneinheitlichen Art-Specials-Freitextspalte abgeleitet): Stangenwaffen=alle,
 *  Hiebwaffen/Klingenwaffen/Stichwaffen/Unbewaffnet=keine. */
function waffeBrauchtSchaftmaterial(row: GenericRow): boolean {
  return row['Hauptfertigkeit'] === 'Stangenwaffen';
}

/** Schadenswuerfel-1/-2 kommen unveraendert von der Basis-Zeile (keine der 4 Modifikator-Tabellen
 *  hat eine Schadenswuerfel-Spalte) - "W10+W6" bei zwei Wuerfeln, sonst nur der eine. */
function formatSchadenswuerfel(row: GenericRow): string {
  const sw1 = row['Schadenswuerfel-1']?.trim();
  const sw2 = row['Schadenswuerfel-2']?.trim();
  if (sw1 && sw2) return `${sw1}+${sw2}`;
  return sw1 || sw2 || '–';
}

function renderWeaponRow(row: (typeof WEAPONS)[number], character: CharacterState): string {
  const brauchtSchaft = waffeBrauchtSchaftmaterial(row);
  const materialOptionen = NK_MATERIAL.filter((m) => istWaffenKomponenteVerfuegbar(m, character.spezies));
  const fertigungOptionen = NK_FERTIGUNG.filter((f) => istWaffenKomponenteVerfuegbar(f, character.spezies));
  const anpassungOptionen = NK_ANPASSUNG.filter((a) => istWaffenKomponenteVerfuegbar(a, character.spezies));
  const schaftmaterialOptionen = brauchtSchaft
    ? NK_SCHAFTMATERIAL.filter((s) => istWaffenKomponenteVerfuegbar(s, character.spezies))
    : [SCHAFTMATERIAL_STANDARD];
  const sel = weaponPicker.get(row.sourceRow) ?? {
    materialSourceRow: materialOptionen[0]?.sourceRow ?? 0,
    fertigungSourceRow: fertigungOptionen[0]?.sourceRow ?? 0,
    anpassungSourceRow: anpassungOptionen[0]?.sourceRow ?? 0,
    schaftmaterialSourceRow: schaftmaterialOptionen[0]?.sourceRow ?? 0,
  };
  const material = materialOptionen.find((m) => m.sourceRow === sel.materialSourceRow) ?? materialOptionen[0];
  const fertigung = fertigungOptionen.find((f) => f.sourceRow === sel.fertigungSourceRow) ?? fertigungOptionen[0];
  const anpassung = anpassungOptionen.find((a) => a.sourceRow === sel.anpassungSourceRow) ?? anpassungOptionen[0];
  const schaftmaterial = brauchtSchaft
    ? (schaftmaterialOptionen.find((s) => s.sourceRow === sel.schaftmaterialSourceRow) ?? schaftmaterialOptionen[0])
    : SCHAFTMATERIAL_STANDARD;
  const composed = composeWeapon(row, material, fertigung, anpassung, schaftmaterial);
  const statTooltip = statSnapshotTooltip({
    at: composed.at, pa: composed.pa, wk: composed.wk, staerkeMalus: composed.staerkeMalus,
    minStaerke1H: composed.minStaerke1H, minStaerke2H: composed.minStaerke2H,
    klingenbrecher: composed.klingenbrecher, klingenschutz: composed.klingenschutz, rb: composed.rb,
  });

  return `
    <div class="ausruestung-row" data-weapon="${row.sourceRow}"${statTooltip}>
      <span class="stat-label">${escapeHtml(row.name)}</span>
      <select class="waffe-material-select" data-weapon="${row.sourceRow}">
        ${materialOptionen.map((m) => `<option value="${m.sourceRow}" ${m.sourceRow === material.sourceRow ? 'selected' : ''}>${escapeHtml(m.name)}</option>`).join('')}
      </select>
      <select class="waffe-fertigung-select" data-weapon="${row.sourceRow}">
        ${fertigungOptionen.map((f) => `<option value="${f.sourceRow}" ${f.sourceRow === fertigung.sourceRow ? 'selected' : ''}>${escapeHtml(f.name)}</option>`).join('')}
      </select>
      <select class="waffe-anpassung-select" data-weapon="${row.sourceRow}">
        ${anpassungOptionen.map((a) => `<option value="${a.sourceRow}" ${a.sourceRow === anpassung.sourceRow ? 'selected' : ''}>${escapeHtml(a.name)}</option>`).join('')}
      </select>
      ${brauchtSchaft ? `
      <select class="waffe-schaftmaterial-select" data-weapon="${row.sourceRow}">
        ${schaftmaterialOptionen.map((s) => `<option value="${s.sourceRow}" ${s.sourceRow === schaftmaterial.sourceRow ? 'selected' : ''}>${escapeHtml(s.name)}</option>`).join('')}
      </select>` : ''}
      <span class="stat-cost">AT ${composed.at} | PA ${composed.pa}${composed.preis === null ? ' | kein Preis (kein Materialpreis-Faktor)' : ''}</span>
      ${composed.preis !== null
    ? `<button type="button" class="ausruestung-buy-button ausruestung-buy-weapon" data-weapon="${row.sourceRow}">${kaufenLabel(composed.preis)}</button>`
    : '<span></span>'}
    </div>
    <div class="waffe-details">
      Schaden ${formatSchadenswuerfel(row)} | Stä-Mod ${composed.staerkeMalus} | RB ${composed.rb}${row['Art-Specials'] ? ` | ${escapeHtml(row['Art-Specials'])}` : ''}
    </div>`;
}

/** Boegen/Armbrust sind fertige Objekte mit festem Preis (keine Material/Fertigung/Anpassung-
 *  Komposition wie NK-Waffen/Schilde/Ruestung - siehe project-fk-waffen-erfassung memory). */
function renderFernkampfwaffeRow(typ: 'boegen' | 'armbrust', row: FernkampfRow): string {
  const gesperrt = !bestehenderCharakterMode && row.verfuegbarkeitStufe !== undefined && row.verfuegbarkeitStufe >= 5;
  return `
    <div class="ausruestung-row" data-fernkampfwaffe="${typ}:${row.sourceRow}"${fernkampfwaffeStatTooltip(row)}>
      <span class="stat-label">${escapeHtml(row.name)}</span>
      <span class="stat-cost">Min.Stä ${escapeHtml(row['Min. Stä'] ?? '-')} | ${escapeHtml(row['1.W'] ?? '-')}${row['Fixschaden'] ? escapeHtml(row['Fixschaden']) : ''} | RW ${escapeHtml(row['RW'] ?? '-')} | Nachladezeit ${escapeHtml(row['Nachladezeit'] ?? '-')}</span>
      ${row.preisDublonen !== undefined
    ? `<button type="button" class="ausruestung-buy-button ausruestung-buy-fernkampfwaffe${gesperrt ? ' ausruestung-buy-locked' : ''}" data-typ="${typ}" data-source-row="${row.sourceRow}" ${gesperrt ? 'disabled' : ''}>${gesperrt ? gesperrtLabel(row.verfuegbarkeitStufe!) : kaufenLabel(row.preisDublonen)}</button>`
    : `<span class="stat-cost">nicht käuflich (${escapeHtml(row['Preis'] ?? '?')})</span>`}
    </div>`;
}

const feuerwaffenPicker = new Map<number, FeuerwaffenSelections>();
const feuerwaffenMunitionQty = new Map<number, number>();

function renderFeuerwaffeRow(row: FernkampfRow): string {
  const optionen = feuerwaffenKomponentenOptionen();
  const standard = feuerwaffenStandardauswahl(row);
  const auswahl = feuerwaffenPicker.get(row.sourceRow) ?? standard;
  const composed = composeFeuerwaffe(row, auswahl);
  const gesperrt = !bestehenderCharakterMode && composed.verfuegbarkeitStufe >= 5;
  const quantity = feuerwaffenMunitionQty.get(row.sourceRow) ?? 1;
  const munitionOptionen = feuerwaffenMunitionOptionen(
    row['Lademechanik'] ?? '', composed.munition, composed.kaliber,
  );
  const option = (items: typeof optionen.verarbeitungen, selected: number) => items
    .map((item) => `<option value="${item.sourceRow}" ${item.sourceRow === selected ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('');
  const statTooltip = statSnapshotTooltip({
    gewicht: composed.gewicht, minStaerke: composed.minStaerke, fixschaden: composed.fixschaden,
    rb: composed.rb, kaliber: composed.kaliber, rw: composed.rw, nachladezeit: composed.nachladezeit,
    nachladenTawTeiler: composed.nachladenTawTeiler, patzermodifikator: composed.patzermodifikator, ini: composed.ini,
  });
  return `
    <div class="ausruestung-row feuerwaffe-row" data-feuerwaffe="${row.sourceRow}"${statTooltip}>
      <span class="stat-label">${escapeHtml(row.name)}</span>
      <span class="stat-cost">${composed.ersterWuerfel}+${composed.zweiterWuerfel}${composed.fixschaden ? ` +${composed.fixschaden}` : ''} | RB ${composed.rb} | Min.St&auml; ${composed.minStaerke} | RW ${composed.rw}</span>
      <select class="feuerwaffe-verarbeitung-select" data-feuerwaffe="${row.sourceRow}">${option(optionen.verarbeitungen, auswahl.verarbeitungSourceRow)}</select>
      <select class="feuerwaffe-anpassung-select" data-feuerwaffe="${row.sourceRow}">${option(optionen.anpassungen, auswahl.anpassungSourceRow)}</select>
      ${gesperrt
    ? `<button type="button" class="ausruestung-buy-button ausruestung-buy-feuerwaffe ausruestung-buy-locked" data-feuerwaffe="${row.sourceRow}" disabled>${gesperrtLabel(composed.verfuegbarkeitStufe)}</button>`
    : `<button type="button" class="ausruestung-buy-button ausruestung-buy-feuerwaffe" data-feuerwaffe="${row.sourceRow}">${kaufenLabel(composed.preisDublonen)}</button>`}
    </div>
    <div class="waffe-details feuerwaffe-details" data-feuerwaffe-details="${row.sourceRow}">
      <span>${escapeHtml(row['Bauart'] ?? '-')} | ${escapeHtml(row['Lademechanik'] ?? '-')} | ${escapeHtml(row['Schloss'] ?? '-')} | ${escapeHtml(row['Lauf'] ?? '-')}</span>
      ${munitionOptionen.length ? `
        <span class="feuerwaffe-munition-kauf">
          <select class="feuerwaffe-munition-qty" data-feuerwaffe="${row.sourceRow}" aria-label="Munitionsmenge">
            ${[1, 10, 100].map((qty) => `<option value="${qty}" ${qty === quantity ? 'selected' : ''}>${qty}</option>`).join('')}
          </select>
          ${munitionOptionen.map((ammo) => `<button type="button" class="ausruestung-buy-feuerwaffen-munition" data-feuerwaffe="${row.sourceRow}" data-art="${ammo.art}" data-kaliber="${ammo.kaliber}">${escapeHtml(ammo.label)} kaufen (${formatDublonen(ammo.preisDublonen * quantity)})</button>`).join('')}
        </span>` : ''}
    </div>`;
}

function renderFernkampfVolksgruppen(
  kategorie: 'boegen' | 'armbrust' | 'feuerwaffen',
  rows: FernkampfRow[],
  renderRow: (row: FernkampfRow) => string,
  searchActive: boolean,
): string {
  const gruppen = new Map<string, FernkampfRow[]>();
  rows.forEach((row) => {
    const volk = row['Volk']?.trim() || 'Ohne Volk';
    const gruppe = gruppen.get(volk);
    if (gruppe) gruppe.push(row);
    else gruppen.set(volk, [row]);
  });

  return [...gruppen.entries()].map(([volk, gruppenRows]) => {
    const gruppenKey = `${kategorie}:${volk}`;
    // Bei aktiver Suche werden alle (uebrig gebliebenen, d.h. treffenden) Gruppen zwangsweise
    // aufgeklappt, ohne den manuellen Aufklapp-Zustand zu ueberschreiben - selbes Muster wie in
    // talenteVornachteile.ts.
    const openAttr = searchActive || openFernkampfVolksgruppen.has(gruppenKey) ? ' open' : '';
    return `
      <div class="stat-card">
        <details class="stat-group" data-fernkampf-volksgruppe="${escapeHtml(gruppenKey)}"${openAttr}>
          <summary>${escapeHtml(volk)} <span class="stat-group-count">(${gruppenRows.length} Eintr&auml;ge)</span></summary>
          <div class="stat-subgroup">
            ${gruppenRows.map(renderRow).join('')}
          </div>
        </details>
      </div>`;
  }).join('');
}

/** Transiente Auswahl je Pfeil-/Bolzenart. Die Basis steht als vollstaendige Liste fest; nur der
 *  optionale Spitzen-Modifikator und die Kaufmenge werden pro Zeile ausgewaehlt. */
const munitionPicker = new Map<string, { modifikatorSourceRow: number | null; quantity: number }>();

function munitionPickerKey(typ: 'pfeile' | 'bolzen', basisSourceRow: number): string {
  return `${typ}:${basisSourceRow}`;
}

function munitionBasisOptionen(typ: 'pfeile' | 'bolzen'): FernkampfRow[] {
  return (typ === 'pfeile' ? PFEILE : BOLZEN).filter((r) => r['Kategorie'] !== 'Spitzen-Modifikator');
}
function munitionModOptionen(typ: 'pfeile' | 'bolzen'): FernkampfRow[] {
  return (typ === 'pfeile' ? PFEILE : BOLZEN).filter((r) => r['Kategorie'] === 'Spitzen-Modifikator');
}

function renderMunitionCard(typ: 'pfeile' | 'bolzen'): string {
  const basisOptionen = munitionBasisOptionen(typ);
  const modOptionen = munitionModOptionen(typ);
  return basisOptionen.map((basis) => {
    const sel = munitionPicker.get(munitionPickerKey(typ, basis.sourceRow)) ?? { modifikatorSourceRow: null, quantity: 1 };
    const modifikator = sel.modifikatorSourceRow !== null
      ? modOptionen.find((r) => r.sourceRow === sel.modifikatorSourceRow) ?? null
      : null;
    const composed = composeMunition(basis, modifikator);
    const gesperrt = !bestehenderCharakterMode && composed.verfuegbarkeitStufe !== undefined && composed.verfuegbarkeitStufe >= 5;
    const statTooltip = tooltipAttr([
      `Schaden: ${composed.wuerfel}`,
      `Fixschaden: ${composed.fixschaden}`,
      `RB: ${composed.rb}`,
      `Reichweiten-Mod: ${composed.rwModMeter}m`,
      `BE: ${composed.be}`,
    ].join('\n'));
    return `
      <div class="ausruestung-row munition-row" data-munition="${typ}" data-basis-source-row="${basis.sourceRow}"${statTooltip}>
        <span class="munition-name">${escapeHtml(basis.name)} <span class="munition-kategorie">(${escapeHtml(basis['Kategorie'] ?? '')})</span></span>
        <select class="munition-mod-select" data-munition="${typ}" aria-label="Modifikator f&uuml;r ${escapeHtml(basis.name)}">
          <option value="" ${modifikator === null ? 'selected' : ''}>Kein Modifikator</option>
          ${modOptionen.map((r) => `<option value="${r.sourceRow}" ${modifikator?.sourceRow === r.sourceRow ? 'selected' : ''}>${escapeHtml(r.name)}</option>`).join('')}
        </select>
        <select class="munition-qty" data-munition="${typ}" aria-label="Menge f&uuml;r ${escapeHtml(basis.name)}">
          ${[1, 10, 100].map((qty) => `<option value="${qty}" ${qty === sel.quantity ? 'selected' : ''}>${qty}</option>`).join('')}
        </select>
        <span class="stat-cost">${escapeHtml(composed.wuerfel)} | Fixschaden ${composed.fixschaden >= 0 ? '+' : ''}${composed.fixschaden} | RB ${composed.rb >= 0 ? '+' : ''}${composed.rb} | RW-Mod ${composed.rwModMeter >= 0 ? '+' : ''}${composed.rwModMeter}m | BE ${composed.be}${composed.preisDublonen === null ? ' | nicht käuflich' : ''}</span>
        ${composed.preisDublonen !== null
      ? `<button type="button" class="ausruestung-buy-button ausruestung-buy-munition${gesperrt ? ' ausruestung-buy-locked' : ''}" data-munition="${typ}" data-basis-source-row="${basis.sourceRow}" ${gesperrt ? 'disabled' : ''}>${gesperrt ? gesperrtLabel(composed.verfuegbarkeitStufe!) : kaufenLabel(composed.preisDublonen * sel.quantity)}</button>`
      : '<span></span>'}
      </div>`;
  }).join('');
}

function renderMunitionGruppe(typ: 'pfeile' | 'bolzen', label: string): string {
  const count = munitionBasisOptionen(typ).length;
  const openAttr = openMunitionGruppen.has(typ) ? ' open' : '';
  return `
    <div class="stat-card munition-group-card">
      <details class="stat-group" data-munition-gruppe="${typ}"${openAttr}>
        <summary>${label} <span class="stat-group-count">(${count} Eintr&auml;ge)</span></summary>
        <div class="ausruestung-category munition-category">${renderMunitionCard(typ)}</div>
      </details>
    </div>`;
}

function renderInventar(character: CharacterState): string {
  if (character.equipment.length === 0) {
    return '<p class="inventar-empty">Noch nichts gekauft.</p>';
  }
  return character.equipment.map((e) => {
    let label = `${e.family} (${e.baseTable} #${e.baseId})`;
    // Nutzer 2026-07-24: "Show full item stat block if Schilde, NK-Waffe or FK-Waffe or ammo or
    // Alchemika" - Ruestung/Preisliste/Artefakt bewusst aussen vor (nicht in der Nutzer-Aufzaehlung).
    let statTooltip = '';
    if (e.family === 'preisliste') {
      const row = PREISLISTE.find((r) => String(r.sourceRow) === e.baseId);
      label = row?.name ?? label;
    } else if (e.family === 'artefakt') {
      const kostenRow = ARTEFAKT_KOSTEN.find((r) => String(r.sourceRow) === e.baseId);
      label = kostenRow ? `${kostenRow.name} Grad ${kostenRow.grad} (${e.selections.variant})` : label;
      const basis = kostenRow ? ARTEFAKT_BASIS.find((row) => row.referenz === kostenRow.referenz) : undefined;
      if (basis && kostenRow) {
        const text = isXKlingeReferenz(basis.referenz)
          ? xKlingeTooltip(resolveXKlingeWirkung(basis.referenz, kostenRow.grad ?? ''))
          : basis.beschreibung ?? '';
        statTooltip = tooltipAttr(text);
      }
    } else if (e.family === 'shield') {
      const row = NK_WAFFEN_BASIS.find((r) => String(r.sourceRow) === e.baseId);
      const rs = e.computedStatsSnapshot?.rs;
      // RS des Schilds wird angezeigt, aber bewusst NICHT in rs_arme eingerechnet (Regel Nutzer
      // 2026-07-17: Anrechnung auf den linken Arm ist Kampfmodul-Scope, siehe characterMutations.ts).
      label = row ? `${row.name} (RS ${rs})` : label;
      statTooltip = statSnapshotTooltip(e.computedStatsSnapshot);
    } else if (e.family === 'weapon') {
      const row = NK_WAFFEN_BASIS.find((r) => String(r.sourceRow) === e.baseId);
      const at = e.computedStatsSnapshot?.at;
      const pa = e.computedStatsSnapshot?.pa;
      label = row ? `${xKlingeWeaponName(e) ?? row.name} (AT ${at} | PA ${pa})` : label;
      const wirkung = xKlingeWirkungForEntry(e);
      statTooltip = tooltipAttr([
        statSnapshotTooltipText(e.computedStatsSnapshot),
        wirkung ? xKlingeTooltip(wirkung) : '',
      ].filter(Boolean).join('\n'));
    } else if (e.family === 'fernkampfwaffe') {
      const table = e.baseTable === 'boegen' ? BOEGEN : ARMBRUST;
      const row = table.find((r) => String(r.sourceRow) === e.baseId);
      label = row?.name ?? label;
      if (row) statTooltip = fernkampfwaffeStatTooltip(row);
    } else if (e.family === 'feuerwaffe') {
      const row = FEUERWAFFEN.find((r) => String(r.sourceRow) === e.baseId);
      label = row?.name ?? label;
      statTooltip = statSnapshotTooltip(e.computedStatsSnapshot);
    } else if (e.family === 'ammo') {
      if (e.baseTable === 'feuerwaffen-munition') {
        const ammo = FEUERWAFFEN_MUNITION_PREISE.find(
          (row) => row.art === e.baseId && String(row.kaliber) === e.selections.kaliber,
        );
        label = ammo ? `${ammo.label} (Kaliber ${ammo.kaliber})` : label;
      } else {
        const table = e.baseTable === 'pfeile' ? PFEILE : BOLZEN;
        const basis = table.find((r) => String(r.sourceRow) === e.baseId);
        const modRow = e.selections.modifikator ? table.find((r) => String(r.sourceRow) === e.selections.modifikator) : undefined;
        const fixschaden = e.computedStatsSnapshot?.fixschaden;
        label = basis ? `${modRow ? `${modRow.name} (${basis.name})` : basis.name}${fixschaden ? ` (Fixschaden ${fixschaden >= 0 ? '+' : ''}${fixschaden})` : ''}` : label;
      }
      statTooltip = statSnapshotTooltip(e.computedStatsSnapshot);
    } else if (e.family === 'alchemika') {
      const row = ALCHEMIKA.find((r) => String(r.sourceRow) === e.baseId);
      label = row?.name ?? label;
      if (row) statTooltip = alchemikaStatTooltip(row);
    }
    const total = (e.computedPriceSnapshot ?? 0) * e.quantity;
    return `
      <div class="inventar-row" data-equipment-id="${e.id}"${statTooltip}>
        <span class="stat-label">${escapeHtml(label)}${e.quantity > 1 ? ` ×${e.quantity}` : ''}</span>
        <span class="stat-cost">${formatDublonen(total)}</span>
        <button type="button" class="inventar-remove" data-equipment-id="${e.id}">Entfernen</button>
      </div>`;
  }).join('');
}

/** Wrappt einen Oberpunkt in ein eigenes <details>, damit die insgesamt sehr lange Tabelle nur
 *  die gerade gewuenschten Abschnitte zeigt (Nutzer 2026-07-18). Kein Grid/Flex-Elternelement
 *  hier (view-container ist ein einfaches <main>), daher ist der sonstige Chromium-<details>-
 *  in-Grid-Fix (siehe artefakt-card) nicht noetig. */
function renderTopSection(section: TopSection, heading: string, countLabel: string | undefined, bodyHtml: string): string {
  const openAttr = openTopSections.has(section) ? ' open' : '';
  return `
    <details class="ausruestung-section" data-section="${section}"${openAttr}>
      <summary>${heading}${countLabel ? ` <span class="stat-group-count">(${countLabel})</span>` : ''}</summary>
      ${bodyHtml}
    </details>`;
}

export function renderAusruestungView(
  container: HTMLElement,
  sheet: ComputedSheet,
  character: CharacterState,
  callbacks: AusruestungCallbacks,
): void {
  bestehenderCharakterMode = character.bestehenderCharakter ?? false;
  const filteredPreisliste = PREISLISTE.filter((r) => r.art === selectedArt)
    .filter((r) => !searchText || (r.name ?? '').toLowerCase().includes(searchText.toLowerCase()));
  const needleWaffen = searchWaffen.trim().toLowerCase();
  const filteredWeapons = WEAPONS.filter((r) => r['Hauptfertigkeit'] === selectedHauptfertigkeit)
    .filter((r) => !needleWaffen || r.name.toLowerCase().includes(needleWaffen));
  const needleSchilde = searchSchilde.trim().toLowerCase();
  const filteredShields = needleSchilde ? SHIELDS.filter((r) => r.name.toLowerCase().includes(needleSchilde)) : SHIELDS;
  const needleBoegen = searchBoegen.trim().toLowerCase();
  const filteredBoegen = needleBoegen ? BOEGEN.filter((r) => r.name.toLowerCase().includes(needleBoegen)) : BOEGEN;
  const needleArmbrueste = searchArmbrueste.trim().toLowerCase();
  const filteredArmbrust = needleArmbrueste ? ARMBRUST.filter((r) => r.name.toLowerCase().includes(needleArmbrueste)) : ARMBRUST;
  const needleFeuerwaffen = searchFeuerwaffen.trim().toLowerCase();
  const filteredFeuerwaffen = needleFeuerwaffen ? FEUERWAFFEN.filter((r) => r.name.toLowerCase().includes(needleFeuerwaffen)) : FEUERWAFFEN;
  const needleAlchemika = searchAlchemika.trim().toLowerCase();
  const alchemikaMatchCount = needleAlchemika
    ? ALCHEMIKA.filter((r) => r.name.toLowerCase().includes(needleAlchemika)).length
    : ALCHEMIKA.length;
  const needleArtefakte = searchArtefakte.trim().toLowerCase();
  const filteredArtefakte = needleArtefakte
    ? ARTEFAKT_BASIS.filter((r) => (r.name ?? r.referenz).toLowerCase().includes(needleArtefakte))
    : ARTEFAKT_BASIS;

  // Fokus+Cursor-Position des gerade getippten Suchfelds VOR dem innerHTML-Ersatz sichern (gilt
  // generisch fuer JEDES Text-Suchfeld dieser View) - sonst wuerde jeder Tastendruck den Fokus
  // verlieren, da innerHTML ein komplett neues Input-Element erzeugt. Nur restaurieren wenn das
  // Feld selbst fokussiert war, nicht bei einem Re-Render durch z.B. einen Kaufen-Klick.
  const focusedEl = document.activeElement;
  const focusedSearchId = focusedEl instanceof HTMLInputElement && focusedEl.type === 'text' ? focusedEl.id : '';
  const focusedSelectionStart = focusedSearchId ? (focusedEl as HTMLInputElement).selectionStart : null;

  // Aufklapp-Zustand der Ruestungs-Gruppen aus dem NOCH ALTEN DOM sichern, bevor er gleich durch
  // innerHTML ueberschrieben wird - sonst klappt jede Aenderung (Dropdown, Ausruesten, Kaufen,
  // ...) die gerade geoeffnete Gruppe faelschlich wieder zu (gleicher Bug wie zuvor in
  // categoryView.ts, hier aber am Renderer-Einstieg statt vor jedem einzelnen Handler behoben).
  container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-gruppe]').forEach((details) => {
    const gruppe = details.dataset.gruppe as RsGruppe;
    if (details.open) openGruppen.add(gruppe);
    else openGruppen.delete(gruppe);
  });
  container.querySelectorAll<HTMLDetailsElement>('.ausruestung-section[data-section]').forEach((details) => {
    const section = details.dataset.section as TopSection;
    if (details.open) openTopSections.add(section);
    else openTopSections.delete(section);
  });
  container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-alchemika-kategorie]').forEach((details) => {
    const kategorie = details.dataset.alchemikaKategorie!;
    if (details.open) openAlchemikaKategorien.add(kategorie);
    else openAlchemikaKategorien.delete(kategorie);
  });
  container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-fernkampf-volksgruppe]').forEach((details) => {
    const gruppenKey = details.dataset.fernkampfVolksgruppe!;
    if (details.open) openFernkampfVolksgruppen.add(gruppenKey);
    else openFernkampfVolksgruppen.delete(gruppenKey);
  });
  container.querySelectorAll<HTMLDetailsElement>('.stat-group[data-munition-gruppe]').forEach((details) => {
    const typ = details.dataset.munitionGruppe as 'pfeile' | 'bolzen';
    if (details.open) openMunitionGruppen.add(typ);
    else openMunitionGruppen.delete(typ);
  });

  container.innerHTML = `
    ${renderTopSection('inventar', 'Mein Inventar', undefined, `
      <div class="inventar-category">${renderInventar(character)}</div>
    `)}

    ${renderTopSection('ruestung', 'Rüstung', undefined, `
      <div class="stat-category">${RS_GRUPPEN.map(({ gruppe, label }) => renderRuestungGruppe(gruppe, label, character)).join('')}</div>
    `)}

    ${renderTopSection('schilde', 'Schilde', `${filteredShields.length} Einträge`, `
      <div class="ausruestung-filters">
        <input type="text" id="schilde-search" placeholder="Suche..." value="${escapeHtml(searchSchilde)}" />
      </div>
      ${filteredShields.length === 0 && needleSchilde
    ? `<p class="auswahl-empty">Keine Treffer für "${escapeHtml(searchSchilde)}".</p>`
    : `<div class="ausruestung-category">${filteredShields.map((row) => renderShieldRow(row, character)).join('')}</div>`}
    `)}

    ${renderTopSection('waffen', 'Waffen', `${filteredWeapons.length} Einträge`, `
      <div class="ausruestung-filters">
        <select id="weapon-hauptfertigkeit-select">
          ${WEAPON_HAUPTFERTIGKEITEN.map((h) => `<option value="${escapeHtml(h)}" ${h === selectedHauptfertigkeit ? 'selected' : ''}>${escapeHtml(h)}</option>`).join('')}
        </select>
        <input type="text" id="waffen-search" placeholder="Suche..." value="${escapeHtml(searchWaffen)}" />
      </div>
      ${filteredWeapons.length === 0 && needleWaffen
    ? `<p class="auswahl-empty">Keine Treffer für "${escapeHtml(searchWaffen)}".</p>`
    : `<div class="ausruestung-category">${filteredWeapons.map((row) => renderWeaponRow(row, character)).join('')}</div>`}
    `)}

    ${renderTopSection('boegen', 'Bögen', `${filteredBoegen.length} Einträge`, `
      <div class="ausruestung-filters">
        <input type="text" id="boegen-search" placeholder="Suche..." value="${escapeHtml(searchBoegen)}" />
      </div>
      ${renderMunitionGruppe('pfeile', 'Pfeile')}
      ${filteredBoegen.length === 0 && needleBoegen
    ? `<p class="auswahl-empty">Keine Treffer für "${escapeHtml(searchBoegen)}".</p>`
    : `<div class="stat-category">${renderFernkampfVolksgruppen('boegen', filteredBoegen, (row) => renderFernkampfwaffeRow('boegen', row), !!needleBoegen)}</div>`}
    `)}

    ${renderTopSection('armbrueste', 'Armbrüste', `${filteredArmbrust.length} Einträge`, `
      <div class="ausruestung-filters">
        <input type="text" id="armbrueste-search" placeholder="Suche..." value="${escapeHtml(searchArmbrueste)}" />
      </div>
      ${renderMunitionGruppe('bolzen', 'Bolzen')}
      ${filteredArmbrust.length === 0 && needleArmbrueste
    ? `<p class="auswahl-empty">Keine Treffer für "${escapeHtml(searchArmbrueste)}".</p>`
    : `<div class="stat-category">${renderFernkampfVolksgruppen('armbrust', filteredArmbrust, (row) => renderFernkampfwaffeRow('armbrust', row), !!needleArmbrueste)}</div>`}
    `)}

    ${renderTopSection('feuerwaffen', 'Feuerwaffen', `${filteredFeuerwaffen.length} Einträge`, `
      <div class="ausruestung-filters">
        <input type="text" id="feuerwaffen-search" placeholder="Suche..." value="${escapeHtml(searchFeuerwaffen)}" />
      </div>
      ${filteredFeuerwaffen.length === 0 && needleFeuerwaffen
    ? `<p class="auswahl-empty">Keine Treffer für "${escapeHtml(searchFeuerwaffen)}".</p>`
    : `<div class="stat-category">${renderFernkampfVolksgruppen('feuerwaffen', filteredFeuerwaffen, renderFeuerwaffeRow, !!needleFeuerwaffen)}</div>`}
    `)}

    ${renderTopSection('alchemika', 'Alchemika', `${alchemikaMatchCount} Einträge`, `
      <div class="ausruestung-filters">
        <input type="text" id="alchemika-search" placeholder="Suche..." value="${escapeHtml(searchAlchemika)}" />
      </div>
      ${alchemikaMatchCount === 0 && needleAlchemika
    ? `<p class="auswahl-empty">Keine Treffer für "${escapeHtml(searchAlchemika)}".</p>`
    : `<div class="stat-category">${ALCHEMIKA_KATEGORIEN.map((k) => renderAlchemikaKategorie(k, needleAlchemika)).join('')}</div>`}
    `)}

    ${renderTopSection('preisliste', 'Preisliste', `${filteredPreisliste.length} Einträge`, `
      <div class="ausruestung-filters">
        <select id="ausruestung-art-select">
          ${PREISLISTE_ARTEN.map((a) => `<option value="${escapeHtml(a)}" ${a === selectedArt ? 'selected' : ''}>${escapeHtml(a)}</option>`).join('')}
        </select>
        <input type="text" id="ausruestung-search" placeholder="Suche..." value="${escapeHtml(searchText)}" />
      </div>
      <div class="ausruestung-category">${filteredPreisliste.map(renderPreislisteRow).join('')}</div>
    `)}

    ${renderTopSection('artefakte', 'Artefakte', `${filteredArtefakte.length} Einträge`, `
      <div class="ausruestung-filters">
        <input type="text" id="artefakte-search" placeholder="Suche..." value="${escapeHtml(searchArtefakte)}" />
      </div>
      ${filteredArtefakte.length === 0 && needleArtefakte
    ? `<p class="auswahl-empty">Keine Treffer für "${escapeHtml(searchArtefakte)}".</p>`
    : `<div class="artefakt-category">${filteredArtefakte.map((row) => renderArtefaktRow(row, character)).join('')}</div>`}
    `)}
  `;

  if (focusedSearchId) {
    const el = document.getElementById(focusedSearchId);
    if (el instanceof HTMLInputElement) {
      el.focus();
      const pos = focusedSelectionStart ?? el.value.length;
      el.setSelectionRange(pos, pos);
    }
  }

  document.getElementById('ausruestung-art-select')?.addEventListener('change', (e) => {
    selectedArt = (e.target as HTMLSelectElement).value;
    renderAusruestungView(container, sheet, character, callbacks);
  });
  document.getElementById('ausruestung-search')?.addEventListener('input', (e) => {
    searchText = (e.target as HTMLInputElement).value;
    renderAusruestungView(container, sheet, character, callbacks);
  });
  document.getElementById('weapon-hauptfertigkeit-select')?.addEventListener('change', (e) => {
    selectedHauptfertigkeit = (e.target as HTMLSelectElement).value;
    renderAusruestungView(container, sheet, character, callbacks);
  });
  document.getElementById('waffen-search')?.addEventListener('input', (e) => {
    searchWaffen = (e.target as HTMLInputElement).value;
    renderAusruestungView(container, sheet, character, callbacks);
  });
  document.getElementById('schilde-search')?.addEventListener('input', (e) => {
    searchSchilde = (e.target as HTMLInputElement).value;
    renderAusruestungView(container, sheet, character, callbacks);
  });
  document.getElementById('boegen-search')?.addEventListener('input', (e) => {
    searchBoegen = (e.target as HTMLInputElement).value;
    renderAusruestungView(container, sheet, character, callbacks);
  });
  document.getElementById('armbrueste-search')?.addEventListener('input', (e) => {
    searchArmbrueste = (e.target as HTMLInputElement).value;
    renderAusruestungView(container, sheet, character, callbacks);
  });
  document.getElementById('feuerwaffen-search')?.addEventListener('input', (e) => {
    searchFeuerwaffen = (e.target as HTMLInputElement).value;
    renderAusruestungView(container, sheet, character, callbacks);
  });
  document.getElementById('alchemika-search')?.addEventListener('input', (e) => {
    searchAlchemika = (e.target as HTMLInputElement).value;
    renderAusruestungView(container, sheet, character, callbacks);
  });
  document.getElementById('artefakte-search')?.addEventListener('input', (e) => {
    searchArtefakte = (e.target as HTMLInputElement).value;
    renderAusruestungView(container, sheet, character, callbacks);
  });
  // Liest die aktuell angezeigten Werte aller 3 Dropdowns einer Slot-Zeile aus dem DOM, damit
  // ein einzelnes "change" (z.B. nur Verarbeitung) die anderen beiden nicht auf Zeile-0 zuruecksetzt.
  function updateSlotPicker(slotKey: string, patch: Partial<{ basisSourceRow: number; verarbeitungSourceRow: number; anpassungSourceRow: number }>): void {
    const row = container.querySelector<HTMLElement>(`.ruestung-slot-row[data-slot="${slotKey}"]`);
    // Verarbeitung/Anpassung-Select existieren im DOM nicht, solange die Basis auf "Keine
    // Ruestung" steht - Fallback auf die erste echte Option (statt 0), sonst verliert ein
    // direkter Wechsel "Keine Ruestung" -> echte Basis die Verarbeitung/Anpassung stillschweigend
    // (0 matcht keine reale Zeile, was z.B. "Für alle TZ kaufen" die Lage unbemerkt ausblenden liess).
    const readSelect = (cls: string, fallback: number) => {
      const el = row?.querySelector<HTMLSelectElement>(`.${cls}`);
      return el ? Number(el.value) : fallback;
    };
    slotPicker.set(slotKey, {
      basisSourceRow: readSelect('ruestung-basis-select', RUESTUNG_KEINE),
      verarbeitungSourceRow: readSelect('ruestung-verarbeitung-select', RUESTUNG_VERARBEITUNG[0]?.sourceRow ?? 0),
      anpassungSourceRow: readSelect('ruestung-anpassung-select', RUESTUNG_ANPASSUNG[0]?.sourceRow ?? 0),
      ...patch,
    });
    renderAusruestungView(container, sheet, character, callbacks);
  }
  container.querySelectorAll<HTMLSelectElement>('.ruestung-basis-select').forEach((sel) => {
    sel.addEventListener('change', () => updateSlotPicker(sel.dataset.slot!, { basisSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLSelectElement>('.ruestung-verarbeitung-select').forEach((sel) => {
    sel.addEventListener('change', () => updateSlotPicker(sel.dataset.slot!, { verarbeitungSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLSelectElement>('.ruestung-anpassung-select').forEach((sel) => {
    sel.addEventListener('change', () => updateSlotPicker(sel.dataset.slot!, { anpassungSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLButtonElement>('.ruestung-equip').forEach((btn) => {
    btn.addEventListener('click', () => {
      const gruppe = btn.dataset.gruppe as RsGruppe;
      const lage = Number(btn.dataset.lage);
      const sel = slotPicker.get(ruestungSlotKey(gruppe, lage));
      const optionen = RUESTUNG_BASIS.filter((r) => Number(r['Lage']) === lage);
      const basisSourceRow = sel?.basisSourceRow ?? optionen[0]?.sourceRow;
      const verarbeitungSourceRow = sel?.verarbeitungSourceRow ?? RUESTUNG_VERARBEITUNG[0]?.sourceRow;
      const anpassungSourceRow = sel?.anpassungSourceRow ?? RUESTUNG_ANPASSUNG[0]?.sourceRow;
      if (basisSourceRow === undefined || verarbeitungSourceRow === undefined || anpassungSourceRow === undefined) return;
      callbacks.onEquipRuestung(gruppe, lage, basisSourceRow, verarbeitungSourceRow, anpassungSourceRow);
    });
  });
  container.querySelectorAll<HTMLButtonElement>('.ruestung-buy-alle-tz').forEach((btn) => {
    btn.addEventListener('click', () => {
      const gruppe = btn.dataset.gruppe as RsGruppe;
      callbacks.onEquipRuestungAlleTz(gruppe, getGruppenSelections(gruppe, character));
    });
  });
  container.querySelectorAll<HTMLButtonElement>('.ruestung-unequip').forEach((btn) => {
    btn.addEventListener('click', () => {
      callbacks.onUnequipRuestung(btn.dataset.gruppe as RsGruppe, Number(btn.dataset.lage));
    });
  });

  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sourceRow = Number(btn.dataset.sourceRow);
      const qtyInput = container.querySelector<HTMLInputElement>(`.ausruestung-qty[data-source-row="${sourceRow}"]`);
      const quantity = Math.max(1, Math.floor(Number(qtyInput?.value ?? '1')));
      callbacks.onBuyPreisliste(sourceRow, quantity);
    });
  });
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy-artefakt').forEach((btn) => {
    btn.addEventListener('click', () => {
      const referenz = btn.dataset.referenz!;
      const grad = btn.dataset.grad!;
      const variant = btn.dataset.variant as ArtefaktVariant;
      let targetWeaponId: string | undefined;
      if (isXKlingeReferenz(referenz)) {
        targetWeaponId = btn.closest('.artefakt-card')?.querySelector<HTMLSelectElement>('.artefakt-waffen-ziel')?.value;
        const weapon = character.equipment.find((entry) => entry.id === targetWeaponId);
        const weaponRow = weapon ? NK_WAFFEN_BASIS.find((row) => String(row.sourceRow) === weapon.baseId) : undefined;
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
      callbacks.onBuyArtefakt(referenz, grad, variant, targetWeaponId);
    });
  });
  function updateShieldPicker(shieldSourceRow: number, patch: Partial<{ materialSourceRow: number; fertigungSourceRow: number; bespannungSourceRow: number }>): void {
    const row = container.querySelector<HTMLElement>(`.ausruestung-row[data-shield="${shieldSourceRow}"]`);
    const readSelect = (cls: string) => Number(row?.querySelector<HTMLSelectElement>(`.${cls}`)?.value ?? 0);
    shieldPicker.set(shieldSourceRow, {
      materialSourceRow: readSelect('schild-material-select'),
      fertigungSourceRow: readSelect('schild-fertigung-select'),
      bespannungSourceRow: readSelect('schild-bespannung-select'),
      ...patch,
    });
    renderAusruestungView(container, sheet, character, callbacks);
  }
  container.querySelectorAll<HTMLSelectElement>('.schild-material-select').forEach((sel) => {
    sel.addEventListener('change', () => updateShieldPicker(Number(sel.dataset.shield), { materialSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLSelectElement>('.schild-fertigung-select').forEach((sel) => {
    sel.addEventListener('change', () => updateShieldPicker(Number(sel.dataset.shield), { fertigungSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLSelectElement>('.schild-bespannung-select').forEach((sel) => {
    sel.addEventListener('change', () => updateShieldPicker(Number(sel.dataset.shield), { bespannungSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy-shield').forEach((btn) => {
    btn.addEventListener('click', () => {
      const shieldSourceRow = Number(btn.dataset.shield);
      const sel = shieldPicker.get(shieldSourceRow);
      const materialOptionen = SCHILD_MATERIAL.filter((m) => istSchildKomponenteVerfuegbar(m.name, character.spezies));
      const bespannungOptionen = SCHILD_BESPANNUNG.filter((b) => istSchildKomponenteVerfuegbar(b.name, character.spezies));
      const materialSourceRow = sel?.materialSourceRow ?? materialOptionen[0]?.sourceRow;
      const fertigungSourceRow = sel?.fertigungSourceRow ?? SCHILD_FERTIGUNG[0]?.sourceRow;
      const bespannungSourceRow = sel?.bespannungSourceRow ?? bespannungOptionen[0]?.sourceRow;
      if (materialSourceRow === undefined || fertigungSourceRow === undefined || bespannungSourceRow === undefined) return;
      callbacks.onBuyShield(shieldSourceRow, materialSourceRow, fertigungSourceRow, bespannungSourceRow);
    });
  });
  function updateWeaponPicker(weaponSourceRow: number, patch: Partial<{
    materialSourceRow: number; fertigungSourceRow: number; anpassungSourceRow: number; schaftmaterialSourceRow: number;
  }>): void {
    const row = container.querySelector<HTMLElement>(`.ausruestung-row[data-weapon="${weaponSourceRow}"]`);
    const readSelect = (cls: string) => Number(row?.querySelector<HTMLSelectElement>(`.${cls}`)?.value ?? 0);
    weaponPicker.set(weaponSourceRow, {
      materialSourceRow: readSelect('waffe-material-select'),
      fertigungSourceRow: readSelect('waffe-fertigung-select'),
      anpassungSourceRow: readSelect('waffe-anpassung-select'),
      schaftmaterialSourceRow: readSelect('waffe-schaftmaterial-select'),
      ...patch,
    });
    renderAusruestungView(container, sheet, character, callbacks);
  }
  container.querySelectorAll<HTMLSelectElement>('.waffe-material-select').forEach((sel) => {
    sel.addEventListener('change', () => updateWeaponPicker(Number(sel.dataset.weapon), { materialSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLSelectElement>('.waffe-fertigung-select').forEach((sel) => {
    sel.addEventListener('change', () => updateWeaponPicker(Number(sel.dataset.weapon), { fertigungSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLSelectElement>('.waffe-anpassung-select').forEach((sel) => {
    sel.addEventListener('change', () => updateWeaponPicker(Number(sel.dataset.weapon), { anpassungSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLSelectElement>('.waffe-schaftmaterial-select').forEach((sel) => {
    sel.addEventListener('change', () => updateWeaponPicker(Number(sel.dataset.weapon), { schaftmaterialSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy-weapon').forEach((btn) => {
    btn.addEventListener('click', () => {
      const weaponSourceRow = Number(btn.dataset.weapon);
      const weaponRow = WEAPONS.find((w) => w.sourceRow === weaponSourceRow);
      const brauchtSchaft = !!weaponRow && waffeBrauchtSchaftmaterial(weaponRow);
      const sel = weaponPicker.get(weaponSourceRow);
      const materialOptionen = NK_MATERIAL.filter((m) => istWaffenKomponenteVerfuegbar(m, character.spezies));
      const fertigungOptionen = NK_FERTIGUNG.filter((f) => istWaffenKomponenteVerfuegbar(f, character.spezies));
      const anpassungOptionen = NK_ANPASSUNG.filter((a) => istWaffenKomponenteVerfuegbar(a, character.spezies));
      const schaftmaterialOptionen = brauchtSchaft
        ? NK_SCHAFTMATERIAL.filter((s) => istWaffenKomponenteVerfuegbar(s, character.spezies))
        : [SCHAFTMATERIAL_STANDARD];
      const materialSourceRow = sel?.materialSourceRow ?? materialOptionen[0]?.sourceRow;
      const fertigungSourceRow = sel?.fertigungSourceRow ?? fertigungOptionen[0]?.sourceRow;
      const anpassungSourceRow = sel?.anpassungSourceRow ?? anpassungOptionen[0]?.sourceRow;
      const schaftmaterialSourceRow = brauchtSchaft
        ? (sel?.schaftmaterialSourceRow ?? schaftmaterialOptionen[0]?.sourceRow)
        : SCHAFTMATERIAL_STANDARD.sourceRow;
      if (materialSourceRow === undefined || fertigungSourceRow === undefined
        || anpassungSourceRow === undefined || schaftmaterialSourceRow === undefined) return;
      callbacks.onBuyWeapon(weaponSourceRow, materialSourceRow, fertigungSourceRow, anpassungSourceRow, schaftmaterialSourceRow);
    });
  });
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy-fernkampfwaffe').forEach((btn) => {
    btn.addEventListener('click', () => {
      callbacks.onBuyFernkampfwaffe(btn.dataset.typ as 'boegen' | 'armbrust', Number(btn.dataset.sourceRow));
    });
  });
  function updateFeuerwaffenPicker(sourceRow: number, patch: Partial<FeuerwaffenSelections>): void {
    const row = container.querySelector<HTMLElement>(`.ausruestung-row[data-feuerwaffe="${sourceRow}"]`);
    const read = (cls: string) => Number(row?.querySelector<HTMLSelectElement>(`.${cls}`)?.value ?? 0);
    feuerwaffenPicker.set(sourceRow, {
      verarbeitungSourceRow: read('feuerwaffe-verarbeitung-select'),
      anpassungSourceRow: read('feuerwaffe-anpassung-select'),
      ...patch,
    });
    renderAusruestungView(container, sheet, character, callbacks);
  }
  container.querySelectorAll<HTMLSelectElement>('.feuerwaffe-verarbeitung-select').forEach((sel) => {
    sel.addEventListener('change', () => updateFeuerwaffenPicker(Number(sel.dataset.feuerwaffe), { verarbeitungSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLSelectElement>('.feuerwaffe-anpassung-select').forEach((sel) => {
    sel.addEventListener('change', () => updateFeuerwaffenPicker(Number(sel.dataset.feuerwaffe), { anpassungSourceRow: Number(sel.value) }));
  });
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy-feuerwaffe').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sourceRow = Number(btn.dataset.feuerwaffe);
      const basis = FEUERWAFFEN.find((row) => row.sourceRow === sourceRow);
      if (!basis) return;
      callbacks.onBuyFeuerwaffe(sourceRow, feuerwaffenPicker.get(sourceRow) ?? feuerwaffenStandardauswahl(basis));
    });
  });
  container.querySelectorAll<HTMLSelectElement>('.feuerwaffe-munition-qty').forEach((select) => {
    select.addEventListener('change', () => {
      feuerwaffenMunitionQty.set(Number(select.dataset.feuerwaffe), Number(select.value));
      renderAusruestungView(container, sheet, character, callbacks);
    });
  });
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy-feuerwaffen-munition').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sourceRow = Number(btn.dataset.feuerwaffe);
      callbacks.onBuyFeuerwaffenMunition(
        btn.dataset.art as FeuerwaffenMunitionArt,
        Number(btn.dataset.kaliber),
        feuerwaffenMunitionQty.get(sourceRow) ?? 1,
      );
    });
  });
  function updateMunitionPicker(typ: 'pfeile' | 'bolzen', basisSourceRow: number): void {
    const row = container.querySelector<HTMLElement>(`.ausruestung-row[data-munition="${typ}"][data-basis-source-row="${basisSourceRow}"]`);
    const modValue = row?.querySelector<HTMLSelectElement>('.munition-mod-select')?.value ?? '';
    munitionPicker.set(munitionPickerKey(typ, basisSourceRow), {
      modifikatorSourceRow: modValue === '' ? null : Number(modValue),
      quantity: Math.max(1, Math.floor(Number(row?.querySelector<HTMLSelectElement>('.munition-qty')?.value ?? '1'))),
    });
    renderAusruestungView(container, sheet, character, callbacks);
  }
  container.querySelectorAll<HTMLSelectElement>('.munition-mod-select').forEach((sel) => {
    sel.addEventListener('change', () => {
      const row = sel.closest<HTMLElement>('[data-basis-source-row]');
      if (row) updateMunitionPicker(sel.dataset.munition as 'pfeile' | 'bolzen', Number(row.dataset.basisSourceRow));
    });
  });
  container.querySelectorAll<HTMLInputElement>('.ausruestung-qty[data-source-row]').forEach((input) => {
    input.addEventListener('input', () => {
      const button = container.querySelector<HTMLButtonElement>(`.ausruestung-buy[data-source-row="${input.dataset.sourceRow}"]`);
      const quantity = Math.max(1, Math.floor(Number(input.value || '1')));
      const unitPrice = Number(button?.dataset.unitPrice);
      if (button && Number.isFinite(unitPrice)) button.textContent = kaufenLabel(unitPrice * quantity);
    });
  });
  container.querySelectorAll<HTMLSelectElement>('.munition-qty').forEach((select) => {
    select.addEventListener('change', () => {
      const row = select.closest<HTMLElement>('[data-basis-source-row]');
      if (row) updateMunitionPicker(select.dataset.munition as 'pfeile' | 'bolzen', Number(row.dataset.basisSourceRow));
    });
  });
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy-munition').forEach((btn) => {
    btn.addEventListener('click', () => {
      const typ = btn.dataset.munition as 'pfeile' | 'bolzen';
      const basisSourceRow = Number(btn.dataset.basisSourceRow);
      const sel = munitionPicker.get(munitionPickerKey(typ, basisSourceRow));
      callbacks.onBuyMunition(typ, basisSourceRow, sel?.modifikatorSourceRow ?? null, sel?.quantity ?? 1);
    });
  });

  container.querySelectorAll<HTMLInputElement>('[data-alchemika-qty]').forEach((input) => {
    input.addEventListener('input', () => {
      const sourceRow = Number(input.dataset.alchemikaQty);
      const quantity = Math.max(1, Math.floor(Number(input.value || '1')));
      alchemikaQty.set(sourceRow, quantity);
      const button = container.querySelector<HTMLButtonElement>(`.ausruestung-buy-alchemika[data-source-row="${sourceRow}"]`);
      const unitPrice = Number(button?.dataset.unitPrice);
      if (button && Number.isFinite(unitPrice)) button.textContent = kaufenLabel(unitPrice * quantity);
    });
  });
  container.querySelectorAll<HTMLButtonElement>('.ausruestung-buy-alchemika').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sourceRow = Number(btn.dataset.sourceRow);
      const quantity = alchemikaQty.get(sourceRow) ?? 1;
      callbacks.onBuyAlchemika(sourceRow, quantity);
    });
  });

  container.querySelectorAll<HTMLButtonElement>('.inventar-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      callbacks.onRemoveEquipment(btn.dataset.equipmentId!);
    });
  });
}
