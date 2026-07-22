// Kombinierte n/g/m-Reichweitenzelle (verschoben aus views/kampf.ts, 2026-07-22, damit
// engine/waffenLoadout.ts sie mitnutzen kann - reine Verschiebung + Aufteilung in Roh-Zahlen
// (computeRangeCellValues, fuer die Nebenhand-Halbierung im Waffen-Loadout-Feature) und
// Anzeige-String (formatRangeCellValues), keine Verhaltensaenderung der Formel selbst).

import type { CharacterValueSource } from './rules';
import { aufrunden } from './functions';

/** gFK-Divisor aus den globalen Fernkampfgeschick-Talenten (siehe fernkampf.jsonl:
 *  fk_gute_* = WENN(stufe_2>0;1+AUFRUNDEN(x/3);WENN(stufe_1>0;1+AUFRUNDEN(x/4);1))) - Stufe 2
 *  ersetzt Stufe 1 (kein Stacking), keine Investition -> null (gFK bleibt konstant 1, nie > 1). */
export function fkGuteDivisor(values: CharacterValueSource): number | null {
  if (values.getWert('talente_fernkampfgeschick_stufe_2') > 0) return 3;
  if (values.getWert('talente_fernkampfgeschick_stufe_1') > 0) return 4;
  return null;
}

/** mFK-Divisor aus Fernkampfgeschick Stufe 3 (fk_meisterlich_* = WENN(stufe_3>0;21+AUFRUNDEN(x/20);21)). */
export function fkMeisterlichDivisor(values: CharacterValueSource): number | null {
  return values.getWert('talente_fernkampfgeschick_stufe_3') > 0 ? 20 : null;
}

export interface RangeCellValues {
  normal: number;
  gut?: number;
  meisterlich?: number;
}

/** Reine Zahlen-Variante der Reichweiten-Formel - identische Rechnung wie zuvor formatRangeCell
 *  in kampf.ts, gibt aber die Bestandteile statt eines fertigen Strings zurueck, damit
 *  waffenLoadout.ts die Nebenhand-Halbierung auf die ROHEN Zahlen anwenden kann statt auf den
 *  String. rangeModRaw kann bei Boegen/Armbrust der Literalstring "x" sein (ausser Reichweite,
 *  Stammdaten-Konvention) - dann ist die ganze Zelle "x". Fuer Feuerwaffen (immer numerisch) ist
 *  die "x"-Zeile nur ein defensiver Fallback fuer ein nicht-endliches Rechenergebnis. */
export function computeRangeCellValues(
  rangeModRaw: string | number, basisValue: number, gutDivisor: number | null, meisterlichDivisor: number | null,
): RangeCellValues | 'x' {
  if (typeof rangeModRaw === 'string' && rangeModRaw.trim().toLowerCase() === 'x') return 'x';
  const rangeMod = typeof rangeModRaw === 'number' ? rangeModRaw : Number(rangeModRaw.replace(',', '.'));
  const normal = basisValue + rangeMod;
  if (!Number.isFinite(normal)) return 'x';
  const values: RangeCellValues = { normal };
  if (gutDivisor !== null) {
    const gut = 1 + aufrunden(normal / gutDivisor, 0);
    if (gut > 1) values.gut = gut;
  }
  if (meisterlichDivisor !== null) {
    const meisterlich = 21 + aufrunden(normal / meisterlichDivisor, 0);
    if (meisterlich > 21) values.meisterlich = meisterlich;
  }
  return values;
}

/** "{normal} g{gut} m{meisterlich}" - g/m nur, wenn ueber den ungetalenteten Sockelwert hinaus
 *  (gut>1 / meisterlich>21), siehe computeRangeCellValues. */
export function formatRangeCellValues(v: RangeCellValues | 'x'): string {
  if (v === 'x') return 'x';
  let out = `${v.normal}`;
  if (v.gut !== undefined) out += ` g${v.gut}`;
  if (v.meisterlich !== undefined) out += ` m${v.meisterlich}`;
  return out;
}
