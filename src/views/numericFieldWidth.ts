export type NumericFieldWidth = 'one' | 'two' | 'signed-two' | 'signed-five';

/**
 * Feste Breitenklasse anhand des moeglichen Wertebereichs, nie anhand des gerade sichtbaren
 * Werts. Dadurch verschiebt ein Wechsel von 9 auf 10 (oder von -9 auf -10) keine Nachbarspalten.
 * Unbekannte bzw. mehr als zweistellige Bereiche reservieren konservativ Platz fuer -99999.
 */
export function numericFieldWidthClass(
  maximumMagnitude: number | undefined,
  canBeNegative = false,
): `numeric-field-${NumericFieldWidth}` {
  if (maximumMagnitude !== undefined && maximumMagnitude <= 9) {
    return canBeNegative ? 'numeric-field-signed-two' : 'numeric-field-one';
  }
  if (maximumMagnitude !== undefined && maximumMagnitude <= 99) {
    return canBeNegative ? 'numeric-field-signed-two' : 'numeric-field-two';
  }
  return 'numeric-field-signed-five';
}
