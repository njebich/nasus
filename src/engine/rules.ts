// Regelwerk-Zugriff: Lookup nach Referenz/Kategorie/Art, sowie Formel/Pool/Kosten-Auswertung
// mit Memoisierung und Zyklenerkennung ueber die transitiven Referenz-Abhaengigkeiten.

import { RULES, type RuleEntry } from '../data/rules';
import { LOOKUP_TABLES, type LookupRow } from '../data/lookups';
import { parseFormula, ParseError } from './parser';
import type { AstNode } from './ast';
import { evalAst, type Value, type EvalContext, EvalError } from './evaluator';
import { aufrunden } from './functions';

const byReferenz = new Map<string, RuleEntry>();
for (const rule of RULES) {
  byReferenz.set(rule.referenz.toLowerCase(), rule);
}

export function getRule(referenz: string): RuleEntry | undefined {
  return byReferenz.get(referenz.toLowerCase());
}

export function getRulesByKategorie(kategorie: string): RuleEntry[] {
  return RULES.filter((r) => r.kategorie === kategorie);
}

export function getRulesByArt(art: RuleEntry['art']): RuleEntry[] {
  return RULES.filter((r) => r.art === art);
}

const astCache = new Map<string, AstNode | null>();

/** "FEHLT" ist ein bewusster Platzhalter fuer "Formel noch nicht definiert", keine Formel. */
function isFehltPlaceholder(source: string): boolean {
  return source.trim().toUpperCase() === 'FEHLT';
}

/** Parst formelRaw/poolRaw/kostenRaw einer Regel (mit Cache). `null` = Parse-Fehler (siehe Konsole). */
function parseCached(key: string, source: string): AstNode | null {
  if (isFehltPlaceholder(source)) {
    throw new EvalError(`Formel/Kosten fuer '${key}' ist noch nicht definiert (FEHLT-Platzhalter)`);
  }
  const cached = astCache.get(key);
  if (cached !== undefined) return cached;
  try {
    const ast = parseFormula(source);
    astCache.set(key, ast);
    return ast;
  } catch (err) {
    if (err instanceof ParseError) {
      console.error(`Formel-Parse-Fehler in '${key}': ${err.message} -> Quelle: "${source}"`);
      astCache.set(key, null);
      return null;
    }
    throw err;
  }
}

/** Gibt den Wert einer Art='Wert'-Regel fuer den aktuellen Charakter (Default 0). */
export interface CharacterValueSource {
  getWert(referenz: string): number;
}

export class CycleError extends EvalError {
  constructor(chain: string[]) {
    super(`Zirkulaere Formel-Abhaengigkeit: ${chain.join(' -> ')}`);
  }
}

/**
 * Spielregel (bestaetigt mit Nutzer): alle berechneten Werte werden IMMER auf ganze Zahlen
 * aufgerundet. Ausnahmen: Waffenklasse (WK) und Geld (Dublonen) - beide bleiben mit
 * Nachkommastellen. Aktuell gibt es im Werte-Sheet keine Formel/Pool-Zeile, die Geld oder WK
 * direkt berechnet (Dublonen sind Art=Wert, Waffenwerte leben in den Ausruestungs-Tabellen,
 * nicht hier) - dieser Check ist bewusst defensiv fuer den Fall, dass sich das aendert.
 */
function isExemptFromRounding(rule: RuleEntry): boolean {
  const haystack = `${rule.referenz} ${rule.beschreibung ?? ''} ${rule.abkuerzung ?? ''}`.toLowerCase();
  return haystack.includes('dublone') || haystack.includes('geld')
    || haystack.includes('waffenklasse') || /(^|[^a-z])wk([^a-z]|$)/.test(haystack);
}

function applyRoundingRule(rule: RuleEntry, value: Value): Value {
  if (typeof value !== 'number') return value;
  if (isExemptFromRounding(rule)) return value;
  // "aufgerundet" = vom Nullpunkt weg (wie die AUFRUNDEN()-Funktion/Excel ROUNDUP), nicht
  // Math.ceil (Richtung +Unendlich) - konsistent mit der expliziten AUFRUNDEN-Funktion in
  // der Formel-Sprache, die dieselbe Semantik nutzt.
  return aufrunden(value, 0);
}

/** Spielregel (Nutzer 2026-07-17): Mana darf nicht negativ angezeigt werden - 0 ist der Boden. */
const ZERO_FLOOR_REFERENZEN = new Set(['mana']);

function applyZeroFloor(referenz: string, value: Value): Value {
  if (typeof value !== 'number') return value;
  if (!ZERO_FLOOR_REFERENZEN.has(referenz)) return value;
  return Math.max(0, value);
}

/**
 * Gewichtsbelastung (GBE) braucht laut Formel Ruestungs-/Inventar-Laufzeitdaten (welche
 * Ruestungsteile sind an welcher Koerperzone ausgeruestet, welche Gegenstaende werden
 * getragen) - das ist Kampfmodul-Scope (Tool 2), nicht Teil der Charaktererstellung, daher
 * ist formelRaw hier bewusst nur ein Prosa-Platzhalter (nicht parsebar). Nutzer-Entscheidung
 * 2026-07-17: waehrend der Charaktererstellung wertet GBE fest zu 0 aus (unbelastet/kein
 * Ruestung ausgeruestet), damit davon abhaengige Formeln (aw_def_normal/aw_off_normal)
 * nutzbare Werte zeigen. Die eigentliche GBE-Berechnung bleibt offener Punkt fuers Kampfmodul.
 */
const CHARGEN_ZERO_OVERRIDES = new Set(['gewichtsbelastung']);

interface EvalRunState {
  memo: Map<string, Value>;
  inProgress: Set<string>;
  values: CharacterValueSource;
}

function evalReferenzInternal(referenz: string, state: EvalRunState): Value {
  const key = referenz.toLowerCase();
  const memoKey = `ref::${key}`;
  const cached = state.memo.get(memoKey);
  if (cached !== undefined) return cached;

  if (state.inProgress.has(key)) {
    throw new CycleError([...state.inProgress, key]);
  }

  const rule = getRule(key);
  if (!rule) {
    throw new EvalError(`Referenz '${referenz}' existiert nicht im Regelwerk`);
  }

  state.inProgress.add(key);
  let result: Value;
  try {
    switch (rule.art) {
      case 'Wert':
        result = state.values.getWert(rule.referenz);
        break;
      case 'Fixwert':
        // Fixwert ist ein roher Referenzwert aus der xlsx (Zahl ODER Text wie "0,3 m/s"),
        // kein Spielerwert - nicht ueber character.values aufloesbar. Aktuell referenziert
        // keine Formel im Datensatz einen Fixwert (siehe rules.parseAll.test.ts), daher hier
        // bewusst ein klarer Fehler statt einer stillschweigend falschen Zahl.
        throw new EvalError(
          `Regel '${referenz}' ist Art=Fixwert (fester Referenzwert "${rule.formelRaw}") - `
          + 'nicht als Formel-Variable auswertbar',
        );
      case 'Formel': {
        if (CHARGEN_ZERO_OVERRIDES.has(key)) { result = 0; break; }
        if (!rule.formelRaw) throw new EvalError(`Regel '${referenz}' ist Art=Formel, hat aber keine Formel`);
        result = evalFormulaWith(rule.formelRaw, `formel::${key}`, state);
        break;
      }
      case 'Pool': {
        if (!rule.poolRaw) throw new EvalError(`Regel '${referenz}' ist Art=Pool, hat aber keine Pool-Formel`);
        result = evalFormulaWith(rule.poolRaw, `pool::${key}`, state);
        break;
      }
      case 'Auswahl':
        // Offene Frage (siehe Plan): ob/wie Auswahl-Referenzen in Formeln als Variable
        // genutzt werden. Fuer jetzt: 1 wenn ausgewaehlt, sonst 0 - sichtbar markiert.
        result = state.values.getWert(rule.referenz) > 0 ? 1 : 0;
        break;
      case 'Lookup':
        // Manche Art=Lookup-Zeilen (z.B. stufe/kreis) haben trotzdem eine echte Formel in
        // formelRaw (i.d.R. ein SVERWEIS gegen eine benannte Lookup-Tabelle) - die werten wir
        // genauso aus wie Art=Formel. Nur wenn wirklich keine Formel hinterlegt ist, ist die
        // Zeile inert (reine Referenzdaten, z.B. eine Tabelle die nur per SVERWEIS aus ANDEREN
        // Formeln heraus benutzt wird).
        if (!rule.formelRaw) {
          throw new EvalError(`Regel '${referenz}' ist Art=Lookup ohne eigene Formel und nicht direkt auswertbar`);
        }
        result = evalFormulaWith(rule.formelRaw, `formel::${key}`, state);
        break;
      default:
        throw new EvalError(`Regel '${referenz}' hat unbekannte Art '${rule.art}'`);
    }
  } finally {
    state.inProgress.delete(key);
  }

  if (rule.art === 'Formel' || rule.art === 'Pool' || rule.art === 'Lookup') {
    result = applyRoundingRule(rule, result);
    result = applyZeroFloor(key, result);
  }

  state.memo.set(memoKey, result);
  return result;
}

function evalFormulaWith(source: string, astCacheKey: string, state: EvalRunState, extraVars?: Record<string, Value>): Value {
  const ast = parseCached(astCacheKey, source);
  if (!ast) throw new EvalError(`Formel '${astCacheKey}' konnte nicht geparst werden: "${source}"`);

  const ctx: EvalContext = {
    resolveVar(name: string): Value {
      const lower = name.toLowerCase();
      if (extraVars && lower in extraVars) return extraVars[lower];
      return evalReferenzInternal(name, state);
    },
    getLookupTable(sheetName: string): LookupRow[] {
      const table = LOOKUP_TABLES[sheetName];
      if (!table) throw new EvalError(`Lookup-Tabelle '${sheetName}' existiert nicht`);
      return table;
    },
  };
  return evalAst(ast, ctx);
}

/** Wertet Formel/Pool einer Regel fuer den gegebenen Charakter-Zustand aus. */
export function evalReferenz(referenz: string, values: CharacterValueSource): Value {
  const state: EvalRunState = { memo: new Map(), inProgress: new Set(), values };
  return evalReferenzInternal(referenz, state);
}

/**
 * Wertet die Kosten-Formel einer Regel fuer einen Kandidatwert aus (Pseudo-Variablen
 * `wert`/`grad` sind waehrend dieser Auswertung an candidateWert gebunden).
 */
export function evalKostenFor(referenz: string, candidateWert: number, values: CharacterValueSource): Value {
  const rule = getRule(referenz);
  if (!rule) throw new EvalError(`Referenz '${referenz}' existiert nicht im Regelwerk`);
  if (!rule.kostenRaw) throw new EvalError(`Regel '${referenz}' hat keine Kosten-Formel`);

  const state: EvalRunState = { memo: new Map(), inProgress: new Set(), values };
  return evalFormulaWith(rule.kostenRaw, `kosten::${referenz.toLowerCase()}`, state, {
    wert: candidateWert,
    grad: candidateWert,
  });
}
