// Schaden-Formel fuer Nahkampfwaffen (verschoben aus views/kampf.ts, 2026-07-22, damit
// engine/waffenLoadout.ts sie mitnutzen kann, ohne dass ein engine-Modul aus einem view-Modul
// importieren muesste - reine Verschiebung, keine Verhaltensaenderung). Zusaetzlich
// averageSchadenValue/parseDiceAverage fuer den "besseres Schaden"-Vergleich des Waffen-Loadout-
// Features (Talent "Kampf mit zwei Waffen"): dort reicht der reine Flachbonus-Vergleich nicht,
// der Nutzer wollte explizit den vollen Erwartungswert (Wuerfeldurchschnitt + Flachbonus).

export function num(row: Record<string, string> | undefined, header: string): number {
  const raw = row?.[header];
  if (raw === undefined) return 0;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

/** Gleiche AUFRUNDEN-weg-von-Null-Konvention wie engine/rules.ts's applyRoundingRule (dort nicht
 *  exportiert fuer views) - hier bewusst ABRUNDEN (Math.floor), da der Plan fuer die Schaden-
 *  Formel explizit "floor" vorgibt (Rundung war zum Planzeitpunkt nicht abschliessend
 *  spezifiziert, siehe Plan-Kommentar "Rounding is still unspecified"). */
export function floorSigned(x: number): number {
  return Math.floor(x);
}

export function formatSigned(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

/** "W10+W6" bei zwei Wuerfeln, sonst nur der eine - identische Anzeige-Konvention wie
 *  ausruestung.ts's (dort modul-privates) formatSchadenswuerfel. */
export function formatSchadenswuerfel(row: Record<string, string> | undefined): string {
  const sw1 = row?.['Schadenswuerfel-1']?.trim();
  const sw2 = row?.['Schadenswuerfel-2']?.trim();
  if (sw1 && sw2) return `${sw1}+${sw2}`;
  return sw1 || sw2 || '–';
}

/** Schaden = Wuerfelnotation + Flachbonus (eig_k_staerke/Staerke-Teiler + Stä-Malus, ABGERUNDET -
 *  siehe Plan-Kommentar zur Rundung). Nutzt den KOMPONIERTEN Stä-Malus aus dem Snapshot (Basis +
 *  Material), nicht nur die rohe Basis-Spalte - konsistent mit jeder anderen Zahl in dieser
 *  Tabelle (die kommen alle aus dem Snapshot, nicht aus der rohen Basiszeile). */
export function computeSchaden(
  basis: Record<string, string> | undefined, staerkeMalus: number, eigKStaerke: number,
  element?: { schadenswuerfel: string; schadenselement: string },
): string {
  const staerkeTeiler = num(basis, 'Staerke-Teiler');
  const flatBonus = staerkeTeiler !== 0 ? floorSigned(eigKStaerke / staerkeTeiler + staerkeMalus) : floorSigned(staerkeMalus);
  const basisDice = formatSchadenswuerfel(basis);
  const dice = element ? `${basisDice}+(${element.schadenswuerfel} ${element.schadenselement})` : basisDice;
  return flatBonus !== 0 ? `${dice} ${formatSigned(flatBonus)}` : dice;
}

/** Durchschnittswert EINER Wuerfelnotation - Grammatik bestaetigt gegen die reale Datenlage in
 *  weapons.json: "Wxx" (ein Wuerfel), "NWxx" (N Wuerfel summiert), "[NWxx]" (eckige Klammern =
 *  N Wuerfel werfen, den BESTEN nehmen - "Vorteil", Nutzer 2026-07-22: "if the dice is [Wxx] it
 *  means the better of 2 dice rolls"). Unbekannte/leere Notation -> 0 (defensiv, kein Wurf). */
export function parseDiceAverage(notation: string | undefined): number {
  const trimmed = notation?.trim();
  if (!trimmed) return 0;
  const bracket = /^\[(\d*)W(\d+)\]$/i.exec(trimmed);
  if (bracket) {
    const n = bracket[1] ? Number(bracket[1]) : 1;
    const sides = Number(bracket[2]);
    return averageMaxOfNDice(n, sides);
  }
  const plain = /^(\d*)W(\d+)$/i.exec(trimmed);
  if (plain) {
    const n = plain[1] ? Number(plain[1]) : 1;
    const sides = Number(plain[2]);
    return n * (sides + 1) / 2;
  }
  return 0;
}

/** Erwartungswert von MAX(N unabhaengiger, gleichverteilter Wuerfel mit `sides` Seiten) ueber die
 *  Standard-Tail-Summenformel E[X] = Summe_{k=1}^{max} P(X>=k) fuer eine Zufallsvariable mit
 *  Werten in {1,...,max} - allgemeingueltig fuer beliebiges N, nicht nur die in den Daten bisher
 *  beobachteten "[2Wxx]"-Faelle. */
function averageMaxOfNDice(n: number, sides: number): number {
  let sum = 0;
  for (let k = 1; k <= sides; k++) {
    sum += 1 - ((k - 1) / sides) ** n;
  }
  return sum;
}

/** Durchschnittlicher Gesamtschaden (Wuerfeldurchschnitt beider Schadenswuerfel-Spalten plus
 *  dem selben geflooreten Flachbonus wie computeSchaden) - NUR fuer den "besseres Waffe"-
 *  Vergleich des Kampf-mit-zwei-Waffen-Talents (Waffen-Loadout-Feature), die Anzeige selbst nutzt
 *  weiterhin computeSchaden's formatierten String. */
export function averageSchadenValue(basis: Record<string, string> | undefined, staerkeMalus: number, eigKStaerke: number): number {
  const staerkeTeiler = num(basis, 'Staerke-Teiler');
  const flatBonus = staerkeTeiler !== 0 ? floorSigned(eigKStaerke / staerkeTeiler + staerkeMalus) : floorSigned(staerkeMalus);
  const diceAverage = parseDiceAverage(basis?.['Schadenswuerfel-1']) + parseDiceAverage(basis?.['Schadenswuerfel-2']);
  return diceAverage + flatBonus;
}
