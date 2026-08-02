// Spruchzauber-Reichweite (Punkt 11): spruchmagieDetails.json liefert die RW-Spalte als rohen,
// unausgewerteten Formeltext aus der xlsx (z.B. "(M)*10m", "Magie*4m", "Aura/3m", "(M)*(Mana/30)m",
// sowie reine Literale wie "Selbst"/"Berührung"). (M) = "Macht" (Charakterwerte-Formelzeile
// referenz="macht"), Magie = att_magie, Aura = att_aura - alle drei bereits normal Teil von RULES
// und werden ganz regulaer mitberechnet, muessen hier nur ausgelesen werden.
//
// Bewusst ein kleiner, auf die tatsaechlich vorkommenden Muster zugeschnittener Regex-Resolver statt
// des grossen xlsx-Formel-Evaluators (engine/evaluator.ts) - der ist fuer Excel-AST-Formeln gebaut,
// hier reicht "Basisvariable [*|/] Faktor Einheit [Radius]" bzw. unveraendertes Durchreichen von
// Literalen wie "Selbst"/"Berührung", die kein Muster treffen.
import { aufrunden } from './functions';

const RW_PATTERN = /^(\(M\)|Magie|Aura)(?:([*/])((?:\(Mana\/30\))|\d+(?:[.,]\d+)?)?)?(cm|km|m)?\s*(Radius)?$/;

/** Wertet einen RW-Formeltext aus spruchmagieDetails.json aus. Liefert den Rohtext unveraendert
 *  zurueck, wenn er keinem der bekannten Muster entspricht (z.B. "Selbst", "Berührung", oder ein
 *  kuenftig neu hinzugekommenes, noch unbekanntes Muster) - sicherer Fallback statt Fehlanzeige. */
export function resolveRw(raw: string | undefined, macht: number, magie: number, aura: number, mana: number): string {
  if (!raw) return '–';
  const trimmed = raw.trim();
  const match = RW_PATTERN.exec(trimmed);
  if (!match) return trimmed;
  const [, baseToken, op, factorToken, unitToken, radiusToken] = match;
  const base = baseToken === 'Magie' ? magie : baseToken === 'Aura' ? aura : macht;
  const factor = factorToken === '(Mana/30)' ? mana / 30 : factorToken ? Number(factorToken.replace(',', '.')) : 1;
  const result = op === '/' ? base / factor : base * factor;
  const unit = unitToken ?? 'm';
  return `${aufrunden(result, 0)}${unit}${radiusToken ? ' Radius' : ''}`;
}
