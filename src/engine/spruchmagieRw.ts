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

// Nach dem Token-Ersetzen bleiben reine Zahlenketten wie "6 + 1*2" stehen (Nutzer-Feedback:
// "sowas muss fertig gerechnet werden") - diese werden hier ausgewertet (*, / vor +, -). Ein
// Kettenstart darf nicht direkt hinter einem Buchstaben oder einer Ziffer liegen, sonst wuerde
// z.B. aus "2W6 + 8" faelschlich die "6" von "W6" als Kettenanfang gegriffen ("6 + 8" -> "14"
// statt "2W6 + 8"). Ketten mit 2+ "/" werden NICHT ausgewertet, weil "/" in diesen Texten auch als
// Listen-Trenner vorkommt (z.B. "AW= Magie/1/21" - keine verschachtelte Division, sondern drei
// getrennte Werte) - ein einzelnes "/" (z.B. "Magie/2", "(M)/2") ist dagegen durchgaengig Division
// und wird ausgewertet. ":" wird bewusst NICHT als Division behandelt (kommt in diesen Texten weit
// haeufiger als reine Interpunktion vor, z.B. "Schaden: 2W6" - waere nicht sicher unterscheidbar).
const ARITH_CHAIN = /(?<![\p{L}\d])\d+(?:[.,]\d+)?(?:\s*[+\-*/]\s*\d+(?:[.,]\d+)?)+/gu;

function evaluateChain(chain: string): number {
  const parts = chain.split(/\s*([+\-*/])\s*/);
  const nums = parts.filter((_, i) => i % 2 === 0).map((s) => Number(s.replace(',', '.')));
  const ops = parts.filter((_, i) => i % 2 === 1);
  // Erster Durchgang: * und / (hoehere Prioritaet), zweiter Durchgang: + und -.
  const reduced: number[] = [nums[0]];
  const addOps: string[] = [];
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === '*' || ops[i] === '/') {
      const prev = reduced.pop()!;
      reduced.push(ops[i] === '*' ? prev * nums[i + 1] : prev / nums[i + 1]);
    } else {
      reduced.push(nums[i + 1]);
      addOps.push(ops[i]);
    }
  }
  return addOps.reduce((acc, op, i) => (op === '+' ? acc + reduced[i + 1] : acc - reduced[i + 1]), reduced[0]);
}

function evaluateArithmeticChains(text: string): string {
  return text.replace(ARITH_CHAIN, (chain) => {
    const slashCount = (chain.match(/\//g) ?? []).length;
    if (slashCount >= 2) return chain; // vermutlich Listen-Notation, keine verschachtelte Division
    return String(aufrunden(evaluateChain(chain), 0));
  });
}

/** Loest "(M)", "Magie" und "Aura" im Wirkungstext eines Spruchzaubers zu den aktuellen
 *  Charakterwerten auf (Macht/att_magie/att_aura) - unveraendert, wo die Ausnahmelisten oben eine
 *  beschreibende statt formelhafte Verwendung erkennen - und rechnet anschliessend verbleibende
 *  reine Zahlenformeln (z.B. "6 + 1*2") zu einem fertigen Wert zusammen. */
export function resolveWirkungText(raw: string | undefined, macht: number, magie: number, aura: number): string {
  if (!raw) return '–';
  let result = raw.replace(/\(M\)/g, String(macht));
  result = replaceToken(result, 'Magie', MAGIE_EXCLUSIONS, magie);
  result = replaceToken(result, 'Aura', AURA_EXCLUSIONS, aura);
  return evaluateArithmeticChains(result);
}
