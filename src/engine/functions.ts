// Eingebaute Funktionen der Formel-Sprache: MIN, MAX, AUFRUNDEN, SVERWEIS.
// WENN wird direkt im Evaluator behandelt (braucht lazy Auswertung der Zweige).

import type { LookupRow } from '../data/lookups';

export function toNumber(value: unknown, context: string): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'string') {
    const n = Number(value.replace(',', '.'));
    if (!Number.isNaN(n)) return n;
  }
  throw new Error(`Erwarte Zahl in ${context}, erhalten: ${JSON.stringify(value)}`);
}

export function min(args: number[]): number {
  if (args.length === 0) throw new Error('MIN() braucht mindestens ein Argument');
  return Math.min(...args);
}

export function max(args: number[]): number {
  if (args.length === 0) throw new Error('MAX() braucht mindestens ein Argument');
  return Math.max(...args);
}

/** Excel-ROUNDUP-Semantik: rundet vom Nullpunkt weg auf `digits` Nachkommastellen. */
export function aufrunden(x: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.sign(x) * Math.ceil(Math.abs(x) * factor) / factor;
}

/** Excel-ROUNDDOWN-Semantik: rundet zum Nullpunkt hin auf `digits` Nachkommastellen. */
export function abrunden(x: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.sign(x) * Math.floor(Math.abs(x) * factor) / factor;
}

/**
 * SVERWEIS(key; sheetName; colIndex; exakt) gegen eine Lookup-Tabelle.
 * `colIndex` ist 1-basiert wie in Excel und bezieht sich auf die Spaltenreihenfolge
 * des Quell-Sheets (siehe generierte lookups.json - Spaltennamen dort in Sheet-Reihenfolge).
 * `exakt` truthy -> exakter String-Match; falsy -> naeherungsweise (groesster Key <= Suchwert,
 * wie Excels sortiert-aufsteigende Naeherungssuche).
 */
export function sverweis(
  key: number,
  rows: LookupRow[],
  colIndex: number,
  exact: boolean,
): number {
  if (rows.length === 0) throw new Error('SVERWEIS: Lookup-Tabelle ist leer');
  const headers = Object.keys(rows[0]);
  const keyHeader = headers[0];
  const valueHeader = headers[colIndex - 1];
  if (!valueHeader) throw new Error(`SVERWEIS: Spaltenindex ${colIndex} existiert nicht`);

  if (exact) {
    const row = rows.find((r) => Number(r[keyHeader]) === key);
    if (!row) throw new Error(`SVERWEIS: Schluessel ${key} nicht exakt gefunden`);
    return toNumber(row[valueHeader], 'SVERWEIS-Ergebnis');
  }

  let best: LookupRow | undefined;
  let bestKey = -Infinity;
  for (const row of rows) {
    const rowKey = Number(row[keyHeader]);
    if (rowKey <= key && rowKey > bestKey) {
      bestKey = rowKey;
      best = row;
    }
  }
  if (!best) throw new Error(`SVERWEIS: kein Eintrag <= ${key} gefunden`);
  return toNumber(best[valueHeader], 'SVERWEIS-Ergebnis');
}
