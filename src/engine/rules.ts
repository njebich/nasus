// Regelwerk-Zugriff: Lookup nach Referenz/Kategorie/Art, sowie Formel/Pool/Kosten-Auswertung
// mit Memoisierung und Zyklenerkennung ueber die transitiven Referenz-Abhaengigkeiten.

import { RULES, type RuleEntry } from '../data/rules';
import { LOOKUP_TABLES, type LookupRow } from '../data/lookups';
import { parseFormula, ParseError } from './parser';
import type { AstNode } from './ast';
import { evalAst, type Value, type EvalContext, EvalError } from './evaluator';
import { aufrunden } from './functions';
import { normalizeForMatch } from './normalize';
import { computeRbe } from './armorComposition';
import type { RsGruppe } from '../data/trefferzonen';

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

/** Loest die Hauptfertigkeit einer Spezialisierung auf (gleiche fuzzy Parent-Aufloesung wie
 *  engine/hierarchy.ts's buildHierarchy, hier aber auf RuleEntry statt ComputedRule, damit
 *  characterMutations.ts den TaW-Deckel pruefen kann ohne ein komplettes ComputedSheet zu bauchen). */
export function findParentRule(rule: RuleEntry): RuleEntry | undefined {
  if (!rule.parent) return undefined;
  const key = normalizeForMatch(rule.parent);
  return RULES.find((r) => (
    r !== rule && r.kategorie === rule.kategorie
    && (normalizeForMatch(r.referenz) === key || (!!r.beschreibung && normalizeForMatch(r.beschreibung) === key))
  ));
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
  /** Summe der RS ueber die 5 Lage-Slots einer TZ-Gruppe (rs_kopf/rs_torso/rs_arme/rs_beine
   *  unten) - optional, da nur `characterSheet.ts`'s makeValueSource sie implementiert
   *  (Formel-Engine-Tests mit einer minimalen values()-Stub-Source brauchen sie nicht). */
  getRsGruppe?(gruppe: RsGruppe): number;
  /** RHg: Summe der RH ueber ALLE Ruestungs-Slots (alle TZ-Gruppen x Lagen) - siehe
   *  computeGewichtsbelastungRbe unten. Optional aus demselben Grund wie getRsGruppe. */
  getRhGesamt?(): number;
  /** Additive Talent-Boni auf eine Formel-Referenz (z.B. Zaeher Bursche -> Selbstbeherrschung/
   *  Gesundheit/Trefferschwelle), siehe engine/talenteModifikator.ts. Optional aus demselben
   *  Grund wie getRsGruppe. */
  getTalentModifikatorBonus?(referenz: string): number;
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
 * Gewichtsbelastung (GBE, Formel "MAX(0;RBE)") referenziert RBE (Ruestungsbehinderung), die
 * selbst von RHg abhaengt (Summe der Ruestungshinderlichkeit ueber ALLE getragenen Lagen und
 * Trefferzonen - siehe engine/armorComposition.ts). Seit Nutzer 2026-07-17 ("im character state
 * muss die ruestung erfasst werden") wird RHg live aus den echten Ruestungs-Slots berechnet
 * (characterSheet.ts's makeValueSource().getRhGesamt()) statt eines Platzhalters.
 */
function computeGewichtsbelastungRbe(state: EvalRunState): number {
  const rhg = state.values.getRhGesamt?.() ?? 0;
  const kon = Number(evalReferenzInternal('eig_k_konstitution', state));
  const staerke = Number(evalReferenzInternal('eig_k_staerke', state));
  const sfRuestungsmanoever = Number(evalReferenzInternal('sf_ruestungsmanoever', state));
  return computeRbe(rhg, kon, staerke, sfRuestungsmanoever);
}

/**
 * rs_kopf/rs_torso/rs_arme/rs_beine (Nutzer 2026-07-17): deren xlsx-Formel ist reine Prosa
 * ("SUMME(RS der 5 Ruestungslagen in Zone kopf)", siehe rules.parseAll.test.ts
 * KNOWN_UNPARSEABLE) - die Engine parst sie nie, sondern liest hier direkt die echte Summe aus
 * den Ruestungs-Slots (characterSheet.ts's makeValueSource().getRsGruppe()).
 */
const RS_GRUPPEN_REFERENZEN: Record<string, RsGruppe> = {
  rs_kopf: 'kopf', rs_torso: 'torso', rs_arme: 'arme', rs_beine: 'beine',
};

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
        if (key in RS_GRUPPEN_REFERENZEN) {
          result = state.values.getRsGruppe?.(RS_GRUPPEN_REFERENZEN[key]) ?? 0;
          break;
        }
        if (!rule.formelRaw) throw new EvalError(`Regel '${referenz}' ist Art=Formel, hat aber keine Formel`);
        const extraVars = key === 'gewichtsbelastung' ? { rbe: computeGewichtsbelastungRbe(state) } : undefined;
        result = evalFormulaWith(rule.formelRaw, `formel::${key}`, state, extraVars);
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

  // Additive Talent-Boni (Nutzer 2026-07-18, z.B. Zaeher Bursche -> Selbstbeherrschung/
  // Gesundheit/Trefferschwelle) wirken NACH Rundung/Nullgrenze, als eigene Bonus-Schicht.
  if (rule.art === 'Formel' && typeof result === 'number') {
    const bonus = state.values.getTalentModifikatorBonus?.(key) ?? 0;
    if (bonus !== 0) result = result + bonus;
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
