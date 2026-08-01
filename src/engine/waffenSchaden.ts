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

/** Vereinheitlicht additive Schadenswuerfel fuer die Anzeige:
 *  - ein einzelner Wuerfel wird ohne fuehrende 1 geschrieben (1W10 -> W10)
 *  - gleiche Wuerfel werden zusammengezogen (W6+W6 -> 2W6)
 *  Nicht als reine additive Wuerfel lesbare Ausdruecke bleiben bis auf die fuehrende 1 erhalten. */
export function combineDiceNotations(...notations: Array<string | undefined>): string {
  const rawTerms = notations
    .flatMap((notation) => notation?.trim() ? notation.trim().split(/\s*\+\s*/) : [])
    .filter(Boolean);
  if (rawTerms.length === 0) return '–';

  const parsed = rawTerms.map((term) => /^(\d*)W(\d+)$/i.exec(term));
  if (parsed.some((match) => !match)) {
    return rawTerms.map((term) => term.replace(/\b1W(?=\d)/gi, 'W')).join('+');
  }

  const counts = new Map<string, number>();
  for (const match of parsed) {
    const sides = match![2];
    const count = match![1] ? Number(match![1]) : 1;
    counts.set(sides, (counts.get(sides) ?? 0) + count);
  }
  return [...counts].map(([sides, count]) => `${count === 1 ? '' : count}W${sides}`).join('+');
}

/** "W10+W6" bei zwei Wuerfeln, sonst nur der eine - identische Anzeige-Konvention wie
 *  ausruestung.ts's (dort modul-privates) formatSchadenswuerfel. */
export function formatSchadenswuerfel(row: Record<string, string> | undefined): string {
  const sw1 = row?.['Schadenswuerfel-1']?.trim();
  const sw2 = row?.['Schadenswuerfel-2']?.trim();
  return combineDiceNotations(sw1, sw2);
}

/** Stä-Mod-Schreibweise ":2-5": Stärke durch 2 teilen, DIE DIVISION aufrunden, danach 5
 *  abziehen (Nutzerpräzisierung 2026-08-01). */
export function computeStaerkeBonus(staerke: number, staerkeTeiler: number, staerkeMalus: number): number {
  return staerkeTeiler !== 0 ? Math.ceil(staerke / staerkeTeiler) + staerkeMalus : staerkeMalus;
}

/** Schaden = Wuerfelnotation + Flachbonus aus dem Stä-Mod. Nutzt den KOMPONIERTEN Stä-Malus aus dem Snapshot (Basis +
 *  Material), nicht nur die rohe Basis-Spalte - konsistent mit jeder anderen Zahl in dieser
 *  Tabelle (die kommen alle aus dem Snapshot, nicht aus der rohen Basiszeile). */
export function computeSchaden(
  basis: Record<string, string> | undefined, staerkeMalus: number, eigKStaerke: number,
  element?: { schadenswuerfel: string; schadenselement: string },
): string {
  const staerkeTeiler = num(basis, 'Staerke-Teiler');
  const flatBonus = computeStaerkeBonus(eigKStaerke, staerkeTeiler, staerkeMalus);
  const basisDice = formatSchadenswuerfel(basis);
  const elementDice = element ? combineDiceNotations(element.schadenswuerfel) : '';
  const dice = element ? `${basisDice}+(${elementDice} ${element.schadenselement})` : basisDice;
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
 *  demselben Stä-Mod-Flachbonus wie computeSchaden) - NUR fuer den "besseres Waffe"-
 *  Vergleich des Kampf-mit-zwei-Waffen-Talents (Waffen-Loadout-Feature), die Anzeige selbst nutzt
 *  weiterhin computeSchaden's formatierten String. */
export function averageSchadenValue(basis: Record<string, string> | undefined, staerkeMalus: number, eigKStaerke: number): number {
  const staerkeTeiler = num(basis, 'Staerke-Teiler');
  const flatBonus = computeStaerkeBonus(eigKStaerke, staerkeTeiler, staerkeMalus);
  const diceAverage = parseDiceAverage(basis?.['Schadenswuerfel-1']) + parseDiceAverage(basis?.['Schadenswuerfel-2']);
  return diceAverage + flatBonus;
}
