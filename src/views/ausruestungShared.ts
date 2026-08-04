// Low-Level-Helfer + Stat-Tooltip-Bausteine, geteilt von allen ausruestung*.ts-Kategoriemodulen -
// siehe ausruestung.ts-Dateikopf fuer den Gesamtkontext der Ausruestungs-Ansicht.

import type { FernkampfRow } from '../data/equipment/fernkampf';
import type { AlchemikaRow } from '../data/equipment/alchemika';
import { formatDublonen } from '../utils/format';
import { tooltipAttr } from './tooltip';

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function kaufenLabel(preis: number): string {
  return `Kaufen (${formatDublonen(preis)})`;
}

export function gesperrtLabel(verfuegbarkeit: number): string {
  return `(gesperrt) Verfügbarkeit ${verfuegbarkeit}`;
}

/** "Bestehenden Charakter erstellen"-Modus (Nutzer 2026-07-24): deaktiviert alle Verfuegbarkeit-
 *  Kaufsperren-Anzeigen (gesperrt-Buttons) analog zur Mutation-Gate-Abschaltung in
 *  characterMutations.ts - von renderAusruestungView() bei jedem Render aus
 *  character.bestehenderCharakter gesetzt, von allen Kategoriemodulen gelesen (ES-Module-Live-
 *  Binding macht den Export bei Aenderung ueberall sichtbar). */
export let bestehenderCharakterMode = false;

export function setBestehenderCharakterMode(value: boolean): void {
  bestehenderCharakterMode = value;
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
export function statSnapshotTooltipText(snapshot: Record<string, number | undefined> | undefined): string {
  if (!snapshot) return '';
  const lines = Object.entries(snapshot)
    .filter((entry): entry is [string, number] => entry[1] !== undefined && !entry[0].startsWith('verfuegbarkeit'))
    .map(([key, value]) => `${STAT_SNAPSHOT_LABELS[key] ?? key}: ${value}`);
  return lines.join('\n');
}

export function statSnapshotTooltip(snapshot: Record<string, number | undefined> | undefined): string {
  return tooltipAttr(statSnapshotTooltipText(snapshot));
}

/** Boegen/Armbrust speichern KEINEN computedStatsSnapshot (fertige Objekte mit festem Preis,
 *  siehe buyFernkampfwaffe) - der Stat-Block kommt hier direkt aus den rohen Basiszeilen-Spalten,
 *  denselben, die renderFernkampfwaffeRow bereits einzeilig anzeigt. */
export function fernkampfwaffeStatTooltip(row: FernkampfRow): string {
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
export function alchemikaStatTooltip(row: AlchemikaRow): string {
  const lines = [`Kategorie: ${row.kategorie}`, `Wirkung: ${row.wirkung}`];
  if (row.beschreibung) lines.push(`Beschreibung: ${row.beschreibung}`);
  return tooltipAttr(lines.join('\n'));
}
