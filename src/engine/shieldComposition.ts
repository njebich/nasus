// Schild-Komposition: Basis (NK-Waffen-Basis, Spezialisierung=Schild) x Material x Fertigung x
// Bespannung (Regel Nutzer 2026-07-17: "die haben auch Anpassung" - Schild-Verplatung bleibt
// aussen vor, ist reines Stub-Sheet ohne Werte, siehe scripts/generate_data_ts.py write_shields_ts).
//
// Materialien/Bespannungen mit Preis-Faktor bzw. Preis "Meister (individuell durch
// Spielleitung)" (Drachensch./Drachenschuppe) sind bewusst nicht automatisch bepreisbar
// (preis=null), analog zu previewPreislistePrice.
//
// Regel Nutzer 2026-07-17 zu Kolhartz (Material) / Kohlharz (Bespannung) - beide "nur bei
// Zentauren auf dem Trollkontinent erhaeltlich": fuer Zentauren normal nutzbar (ihr
// vorhandener Preis-Faktor/-Preis in der Quelle ist bereits guenstig, keine Sonderrechnung
// noetig), fuer alle anderen Spezies nicht waehlbar - siehe istSchildKomponenteVerfuegbar().
//
// Regel Nutzer 2026-07-17 zu Adamandit: sein Klingenschutz-Mod steht in der Quelle als "+50%"
// statt eines Flachwerts wie ueberall sonst in dieser Spalte - wird wortgetreu als
// Prozent-Aufschlag auf die Summe aus Basis+Fertigung+Bespannung-Mod umgesetzt (User-
// bestaetigt, keine Annahme).

import type { GenericRow } from '../data/equipment/armor';

function num(row: GenericRow | undefined, header: string): number {
  if (!row) return 0;
  const raw = row[header];
  if (raw === undefined) return 0;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function numOrNull(row: GenericRow | undefined, header: string): number | null {
  if (!row) return null;
  const raw = row[header];
  if (raw === undefined) return null;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

/** Erkennt den Adamandit-Sonderfall ("+50% (Erklaerungstext...)" statt eines Flachwerts).
 *  Gibt den Anteil zurueck (0.5 fuer "+50%"), oder null wenn der Wert ein normaler Flachwert ist. */
function parsePercentMod(raw: string | undefined): number | null {
  if (!raw) return null;
  const match = raw.trim().match(/^([+-]?\d+(?:[.,]\d+)?)\s*%/);
  if (!match) return null;
  return Number(match[1].replace(',', '.')) / 100;
}

export interface ComposedShield {
  rs: number;
  klingenbrecher: number;
  klingenschutz: number;
  at: number;
  pa: number;
  wk: number;
  staerkeMalus: number;
  minStaerke: number;
  /** null = nicht automatisch bepreisbar (z.B. Drachensch.-Material/-Bespannung: Preis liegt
   *  im Ermessen der Spielleitung, siehe Schild-Material/-Bespannung "Meister"-Eintraege). */
  preis: number | null;
}

export function composeShield(
  basis: GenericRow, material: GenericRow, fertigung: GenericRow, bespannung: GenericRow,
): ComposedShield {
  const rs = num(basis, 'RS-Basis') + num(material, 'RS-Mod') + num(bespannung, 'RS-Mod');
  const klingenbrecher = num(basis, 'Klingenbrecher-Basis') + num(material, 'Klingenbrecher-Mod')
    + num(fertigung, 'Klingenbrecher-Mod') + num(bespannung, 'Klingenbrecher-Mod');

  const klingenschutzAdditiv = num(basis, 'Klingenschutz-Basis')
    + num(fertigung, 'Klingenschutz-Mod') + num(bespannung, 'Klingenschutz-Mod');
  const materialKlingenschutzPercent = parsePercentMod(material['Klingenschutz-Mod']);
  const klingenschutz = materialKlingenschutzPercent !== null
    ? klingenschutzAdditiv * (1 + materialKlingenschutzPercent)
    : klingenschutzAdditiv + num(material, 'Klingenschutz-Mod');

  const at = num(basis, 'AT-Basis') + num(material, 'AT-Mod');
  const pa = num(basis, 'PA-Basis') + num(material, 'PA-Mod');
  const wk = num(basis, 'WK-Basis') + num(material, 'WK-Mod');
  const staerkeMalus = num(basis, 'Staerke-Malus-Basis') + num(material, 'Staerke-Malus-Mod');
  const minStaerke = num(basis, 'Min-Staerke-1H-Basis')
    * (numOrNull(material, 'Min-Staerke-Faktor') ?? 1) * (numOrNull(bespannung, 'Min-Staerke-Faktor') ?? 1);

  const materialPreisFaktor = numOrNull(material, 'Preis-Faktor');
  const fertigungPreisFaktor = numOrNull(fertigung, 'Preis-Faktor');
  const bespannungPreis = numOrNull(bespannung, 'Preis');
  const preis = materialPreisFaktor === null || fertigungPreisFaktor === null || bespannungPreis === null
    ? null
    : num(basis, 'Preis-Basis') * materialPreisFaktor * fertigungPreisFaktor + bespannungPreis;

  return { rs, klingenbrecher, klingenschutz, at, pa, wk, staerkeMalus, minStaerke, preis };
}

const ZENTAUREN_EXKLUSIV = new Set(['Kolhartz', 'Kohlharz']);

/** Kolhartz (Material) / Kohlharz (Bespannung) sind nur fuer Zentauren waehlbar. */
export function istSchildKomponenteVerfuegbar(name: string, spezies: string): boolean {
  return !ZENTAUREN_EXKLUSIV.has(name) || spezies === 'Zentauren';
}
