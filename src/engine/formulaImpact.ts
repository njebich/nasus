// Formel-Impact-Liste (Plan-Phase 3, siehe PLAN-Tooltip-System.md): fuer die +/- Buttons von
// Eigenschaften/Attribute zeigt der Tooltip NUR die Formeln, die sich durch den Klick
// tatsaechlich aendern wuerden ("<Formelname>: <neuer Wert>") - Bolding wurde 2026-07-20
// verworfen, stattdessen ein reiner Filter auf tatsaechliche Differenzen.

import { RULES, type RuleEntry } from '../data/rules';
import { tokenize } from './lexer';
import { getRule, evalReferenz, type CharacterValueSource } from './rules';
import { displayNameFor } from './formulaDisplay';

const FUNCTION_NAMES = new Set(['MIN', 'MAX', 'WENN', 'AUFRUNDEN', 'ABRUNDEN', 'SVERWEIS', 'SUMME']);
const PSEUDO_VARS = new Set(['wert', 'grad']);

/** Direkte (nicht transitive) Rueckwaerts-Abhaengigkeiten: Referenz -> alle Formel-/Pool-/
 *  Lookup-Regeln, deren formelRaw/poolRaw sie per Tokenizer nennt. kostenRaw wurde geprueft
 *  (2026-07-23) und referenziert nie eine andere Regel, nur die Pseudo-Variablen wert/grad -
 *  deshalb hier aussen vor gelassen. Einmalig gebaut, danach memoisiert (Regeln aendern sich
 *  nicht zur Laufzeit). */
let reverseDependencyIndex: Map<string, RuleEntry[]> | null = null;

function buildReverseDependencyIndex(): Map<string, RuleEntry[]> {
  const index = new Map<string, RuleEntry[]>();
  for (const rule of RULES) {
    if (rule.art !== 'Formel' && rule.art !== 'Pool' && rule.art !== 'Lookup') continue;
    const source = rule.formelRaw ?? rule.poolRaw;
    if (!source) continue;
    let tokens;
    try {
      tokens = tokenize(source);
    } catch {
      continue;
    }
    const seen = new Set<string>();
    for (const token of tokens) {
      if (token.type !== 'IDENT') continue;
      const key = token.value.toLowerCase();
      if (PSEUDO_VARS.has(key) || FUNCTION_NAMES.has(token.value.toUpperCase()) || seen.has(key)) continue;
      if (!getRule(key)) continue;
      seen.add(key);
      (index.get(key) ?? index.set(key, []).get(key)!).push(rule);
    }
  }
  return index;
}

function formatValue(value: unknown): string {
  if (typeof value === 'number') return String(Math.round(value * 100) / 100);
  return String(value);
}

export interface FormulaImpactRow {
  label: string;
  newValue: string;
}

/** Fuer `referenz` (Art=Wert, hier Eigenschaft/Attribut) und den hypothetischen neuen Wert
 *  `newWert`: alle direkt abhaengigen Formeln, deren Anzeigewert sich dadurch tatsaechlich
 *  aendern wuerde - unveraenderte Formeln werden NICHT zurueckgegeben (siehe Datei-Kommentar).
 *  `values` ist die reale, unveraenderte CharacterValueSource des Charakters. */
export function computeFormulaImpact(
  referenz: string,
  newWert: number,
  values: CharacterValueSource,
): FormulaImpactRow[] {
  reverseDependencyIndex ??= buildReverseDependencyIndex();
  const key = referenz.toLowerCase();
  const dependents = reverseDependencyIndex.get(key) ?? [];
  if (dependents.length === 0) return [];

  const overrideValues: CharacterValueSource = {
    ...values,
    getWert(ref: string): number {
      return ref.toLowerCase() === key ? newWert : values.getWert(ref);
    },
  };

  const rows: FormulaImpactRow[] = [];
  for (const dep of dependents) {
    let before: unknown;
    let after: unknown;
    try {
      before = evalReferenz(dep.referenz, values);
      after = evalReferenz(dep.referenz, overrideValues);
    } catch {
      continue; // nicht auswertbare Formel (z.B. Zyklus/Parse-Fehler) - nicht Teil dieser Liste
    }
    const beforeText = formatValue(before);
    const afterText = formatValue(after);
    if (beforeText !== afterText) rows.push({ label: displayNameFor(dep.referenz), newValue: afterText });
  }
  return rows;
}
