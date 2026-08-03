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
// den freien Wirkungstext statt eines eigenen Formel-Feldes.
//
// **Marker-Format (2026-08-03, Ablösung der Kontext-Heuristik):** Statt zur Laufzeit anhand von
// Vor-/Nachwort-Mustern zu raten, ob ein blankes "Magie"/"Aura"/"(M)" ein Formel-Token oder ein
// beschreibendes Wort ist, wird das im Rohtext jetzt explizit markiert: "{M}", "{Magie}", "{Aura}".
// Nur diese Marker werden aufgeloest - ein blankes, unmarkiertes "Magie"/"Aura" im Wirkungstext ist
// immer beschreibend (Material/Konzept/Wirkzone) und bleibt Klartext. Grund fuer den Wechsel: Ein
// Autor konnte nach einem Formel-Token wahlweise "/" oder ":" schreiben, ohne dass ein Unterschied
// sichtbar war - bis zur Auswertung, wo nur "/" als Division galt und ":" absichtlich nicht (zu
// haeufig reine Interpunktion, z.B. "Schaden: 2W6"). Das Ergebnis: ~80 Elementarbeschwoerungs-Zauber
// mit ":" nach Magie/Aura/(M) blieben als unausgewertete Rohformel stehen statt einer berechneten
// Zahl. Mit einem expliziten Marker ist direkt danach jedes Trennzeichen unzweideutig Division,
// weil ueberhaupt nur echte Formel-Marker in Frage kommen - kein Rate-Kontext mehr noetig.
//
// Die Ausnahmelisten unten (MAGIE_EXCLUSIONS/AURA_EXCLUSIONS) sind kein Teil der Laufzeit-Aufloesung
// mehr, sondern nur noch Migrations-Werkzeug: `markFormulaTokens()` nutzt sie einmalig, um
// bestehenden (unmarkierten) Wirkungstext automatisch in die Marker-Form zu ueberfuehren (und als
// Hilfestellung beim Anlegen neuer Zauber). Sie wurden per Vollscan aller Wirkungstexte in
// spruchmagie.jsonl gegen jeden Einzeltreffer geprueft (nicht nur pro Satz, siehe z.B.
// "Magie/2 Baelle aus Magie" - zwei Treffer, nur der zweite ausgeschlossen). Nicht als generisches
// Migrations-Werkzeug fuer andere Kategorien (Talente/Psi/KI) gedacht - deren Wirkungstexte wurden
// nicht gescannt.
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
  { before: /\bdieser\s*$/, after: /^\s*befindet\b/ }, // "in dieser Aura befindet" (Wirkzone des Zaubers)
];

function isExcluded(text: string, matchStart: number, matchEnd: number, exclusions: TokenExclusion[]): boolean {
  const before = text.slice(Math.max(0, matchStart - CONTEXT_WINDOW), matchStart);
  const after = text.slice(matchEnd, matchEnd + CONTEXT_WINDOW);
  return exclusions.some(({ before: b, after: a }) => (!b || b.test(before)) && (!a || a.test(after)));
}

function markToken(text: string, token: string, exclusions: TokenExclusion[], marker: string): string {
  const pattern = new RegExp(`\\b${token}\\b`, 'g');
  return text.replace(pattern, (match, offset: number) =>
    isExcluded(text, offset, offset + match.length, exclusions) ? match : marker
  );
}

/** Migrations-/Autoren-Hilfsfunktion: ueberfuehrt rohen, unmarkierten Wirkungstext (wie er frueher
 *  in der xlsx stand) in die neue Marker-Form - "(M)" -> "{M}" (immer), "Magie"/"Aura" -> "{Magie}"/
 *  "{Aura}" ueberall dort, wo die obigen Ausnahmelisten keinen beschreibenden Gebrauch erkennen.
 *  Wird zur Laufzeit NICHT mehr aufgerufen (siehe resolveWirkungText) - nur fuer die einmalige
 *  Content-Migration bzw. als Hilfestellung beim Anlegen neuer Zauber gedacht. */
export function markFormulaTokens(raw: string): string {
  let result = raw.replace(/\(M\)/g, '{M}');
  result = markToken(result, 'Magie', MAGIE_EXCLUSIONS, '{Magie}');
  result = markToken(result, 'Aura', AURA_EXCLUSIONS, '{Aura}');
  return result;
}

// Nach dem Marker-Ersetzen bleiben reine Zahlenketten wie "6 + 1*2" stehen (Nutzer-Feedback:
// "sowas muss fertig gerechnet werden") - diese werden hier ausgewertet (*, / vor +, -). Ein
// Kettenstart darf nicht direkt hinter einem Buchstaben oder einer Ziffer liegen, sonst wuerde
// z.B. aus "2W6 + 8" faelschlich die "6" von "W6" als Kettenanfang gegriffen ("6 + 8" -> "14"
// statt "2W6 + 8").
//
// Konvention (2026-08-03): "/" ist im Wirkungstext ausschliesslich Division, "|" ist der Trenner
// fuer wiederkehrende Werte-Listen/Label-Paare (n/g/m-Werteliste, "AT|PA", "LE|RS", "NK|FK" -
// alles Faelle, wo mehrere getrennte Werte/Abkuerzungen aneinandergereiht werden, keine Division).
// "|" ist in ARITH_CHAIN nicht als Operator gelistet und bleibt daher immer unangetastet stehen.
// Der Slash-Zaehler unten (2+ "/" = Liste, nicht auswerten) bleibt trotzdem als Sicherheitsnetz
// bestehen, falls kuenftiger Text versehentlich wieder "/" statt "|" fuer eine Liste verwendet.
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

const FORMULA_MARKER = /\{(M|Magie|Aura)\}/g;

function markerValue(token: string, macht: number, magie: number, aura: number): number {
  return token === 'Magie' ? magie : token === 'Aura' ? aura : macht;
}

// Sentinel-Zeichen (kommt in echten Wirkungstexten nie vor): markiert eine gerade eingesetzte
// Marker-Zahl, damit ein direkt folgendes ":" als Division erkannt werden kann (Marker macht die
// Absicht unzweideutig - anders als bei blossem Text, wo ":" ueberwiegend Interpunktion ist, siehe
// "Schaden: 2W6"). Wird vor der Zahlenketten-Auswertung wieder entfernt, sodass am Ende nur "/"
// als Operator uebrigbleibt und der bestehende Listen-Schutz (2+ "/") unveraendert greift.
const MARKER_SENTINEL = ' ';
const MARKER_COLON_DIVISION = new RegExp(`${MARKER_SENTINEL}(\\d+(?:[.,]\\d+)?)\\s*:\\s*(?=\\d)`, 'g');
const MARKER_SENTINEL_PATTERN = new RegExp(MARKER_SENTINEL, 'g');

/** Loest "{M}", "{Magie}" und "{Aura}" im Wirkungstext eines Spruchzaubers zu den aktuellen
 *  Charakterwerten auf (Macht/att_magie/att_aura) - ein unmarkiertes "Magie"/"Aura" bleibt Klartext
 *  (siehe Kommentar oben zum Marker-Format) - und rechnet anschliessend verbleibende reine
 *  Zahlenformeln (z.B. "6 + 1*2") zu einem fertigen Wert zusammen. */
export function resolveWirkungText(raw: string | undefined, macht: number, magie: number, aura: number): string {
  if (!raw) return '–';
  let result = raw.replace(FORMULA_MARKER, (_match, token: string) => MARKER_SENTINEL + String(markerValue(token, macht, magie, aura)));
  result = result.replace(MARKER_COLON_DIVISION, '$1/');
  result = result.replace(MARKER_SENTINEL_PATTERN, '');
  return evaluateArithmeticChains(result);
}
