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

// Punkt "Spruchmagie Wirkungstexte" (Nutzer 2026-08-03): dieselbe Idee wie resolveRw, aber fuer
// den freien Wirkungstext statt eines eigenen Formel-Feldes. "(M)" ist dort IMMER ein reiner
// Formel-Token (= Macht, siehe Kommentar oben), "Magie" und "Aura" sind dagegen zweideutig - sie
// stehen mal fuer den Attributwert (Formel, z.B. "Magie*2", "RS=Aura"), mal als beschreibendes Wort
// ("Wand aus Magie", "Wer sich in die Aura begibt" - die vom Zauber erschaffene Wirkzone, nicht
// der Attributwert; "Ziel Aura" - fremde/Ziel-Aura, nicht die eigene). Die Ausnahmelisten unten
// wurden per Vollscan aller Wirkungstexte in spruchmagie.jsonl gegen jeden Einzeltreffer geprueft
// (nicht nur pro Satz, siehe z.B. "Magie/2 Baelle aus Magie" - zwei Treffer, nur der zweite
// ausgeschlossen). Nicht als generischer Text-Ersetzer fuer andere Kategorien (Talente/Psi/KI)
// gedacht - deren Wirkungstexte wurden nicht gescannt.
interface TokenExclusion {
  before?: RegExp;
  after?: RegExp;
}

const CONTEXT_WINDOW = 30;

const MAGIE_EXCLUSIONS: TokenExclusion[] = [
  { before: /\baus\s*$/ }, // "... aus Magie" (Material/Element, kein Attributwert)
  { before: /\bder\s*$/, after: /^\s*des Magus\b/ }, // "der Magie des Magus:" (Tabellenkopf, keine Live-Zahl)
  { before: /\bentsprechenden\s*$/ }, // "der entsprechenden Magie" (Schulen-Konzept)
  { before: /\bAlle\s*$/, after: /^\s*und Materie\b/ }, // "Alle Magie und Materie"
  { before: /\bFeindliche\s*$/ }, // "Feindliche Magie"
  { before: /\baußer\s*$/, after: /^\s*mit\b/ }, // "außer Magie mit [Ziel]"
];

const AURA_EXCLUSIONS: TokenExclusion[] = [
  { after: /^\s*des\b/ }, // "Aura des ..."
  { before: /\bDie\s*$/ }, // "Die Aura"
  { before: /\bder\s*$/ }, // "der Aura" (Wirkzone/Ort, nicht Attribut)
  { before: /\bmaximal\s*$/ }, // "maximal Aura"
  { before: /\bseiner\s*$/ }, // "seiner Aura"
  { before: /\bseine\s*$/ }, // "seine Aura"
  { before: /\bkugelförmige\s*$/ }, // "kugelförmige Aura" (Wirkzonen-Name)
  { before: /\bauf\s*$/ }, // "auf Aura"
  { before: /\(\s*$/, after: /^\s*\)/ }, // "(Aura)"
  { before: /\bZiel\s*$/ }, // "Ziel Aura" (Ziel-Attribut, nicht eigenes)
  { before: /\banderen\s*$/ }, // "anderen Aura"
  { before: /\bEine\s*$/ }, // "Eine Aura"
  { before: /\bdie\s*$/, after: /^\s*begibt\b/ }, // "in die Aura begibt" (Wirkzone des Zaubers)
  { before: /\bund\s*$/, after: /^\s*erkennen\b/ }, // "und Aura erkennen" (Zaubername in Aufzaehlung)
  { before: /\beine\s*$/, after: /^\s*außer\b/ }, // "eine Aura außer dem Magus" (fremde Aura)
];

function isExcluded(text: string, matchStart: number, matchEnd: number, exclusions: TokenExclusion[]): boolean {
  const before = text.slice(Math.max(0, matchStart - CONTEXT_WINDOW), matchStart);
  const after = text.slice(matchEnd, matchEnd + CONTEXT_WINDOW);
  return exclusions.some(({ before: b, after: a }) => (!b || b.test(before)) && (!a || a.test(after)));
}

function replaceToken(text: string, token: string, exclusions: TokenExclusion[], value: number): string {
  const pattern = new RegExp(`\\b${token}\\b`, 'g');
  return text.replace(pattern, (match, offset: number) =>
    isExcluded(text, offset, offset + match.length, exclusions) ? match : String(value)
  );
}

/** Loest "(M)", "Magie" und "Aura" im Wirkungstext eines Spruchzaubers zu den aktuellen
 *  Charakterwerten auf (Macht/att_magie/att_aura) - unveraendert, wo die Ausnahmelisten oben eine
 *  beschreibende statt formelhafte Verwendung erkennen. */
export function resolveWirkungText(raw: string | undefined, macht: number, magie: number, aura: number): string {
  if (!raw) return '–';
  let result = raw.replace(/\(M\)/g, String(macht));
  result = replaceToken(result, 'Magie', MAGIE_EXCLUSIONS, magie);
  result = replaceToken(result, 'Aura', AURA_EXCLUSIONS, aura);
  return result;
}
