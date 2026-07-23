// Menschenlesbare Formel-Anzeige fuer Tooltips: ersetzt Referenz-Bezeichner durch ihre
// Abkuerzung (Spalte D "Abkuerzung" der Werte-xlsx), mit Fallback auf Beschreibung/Referenz
// fuer die ~96% der Zeilen ohne eigene Abkuerzung. Funktionsnamen und die Kosten-Pseudo-
// Variablen wert/grad bleiben unveraendert.

import { tokenize, type Token } from './lexer';
import { getRule } from './rules';

const FUNCTION_NAMES = new Set(['MIN', 'MAX', 'WENN', 'AUFRUNDEN', 'ABRUNDEN', 'SVERWEIS', 'SUMME']);
const PSEUDO_VARS: Record<string, string> = { wert: 'Wert', grad: 'Grad' };

/** Menschenlesbarer Name einer Referenz (Abkuerzung, sonst Beschreibung, sonst die Referenz
 *  selbst) - auch fuer die Formel-Impact-Liste (Phase 3) genutzt, siehe engine/formulaImpact.ts. */
export function displayNameFor(referenz: string): string {
  const rule = getRule(referenz);
  if (!rule) return referenz;
  return rule.abkuerzung || rule.beschreibung || rule.referenz;
}

function textFor(token: Token): string {
  if (token.type === 'IDENT') {
    const upper = token.value.toUpperCase();
    if (FUNCTION_NAMES.has(upper)) return upper;
    const pseudo = PSEUDO_VARS[token.value.toLowerCase()];
    if (pseudo) return pseudo;
    return displayNameFor(token.value);
  }
  if (token.type === 'STRING') return `'${token.value}'`;
  return token.value;
}

/**
 * Wandelt eine rohe Formel (formelRaw/poolRaw/kostenRaw) in eine per Abkuerzung lesbare
 * Darstellung um, z.B. "aw_def_normal"-Formel -> "(Athletik+Schnelligkeit+Glue+AW)/5+6-GBE".
 * Nicht parsebare Rohtexte (z.B. der GBE-Prosa-Platzhalter) werden unveraendert zurueckgegeben.
 */
export function prettyFormula(raw: string): string {
  let tokens: Token[];
  try {
    tokens = tokenize(raw);
  } catch {
    return raw;
  }

  let out = '';
  let prevType: Token['type'] | null = null;
  for (const token of tokens) {
    if (token.type === 'EOF') break;
    // Kein Leerzeichen vor ')'/';', direkt nach '(', am Anfang, oder zwischen Funktionsname
    // und ihrer eigenen '(' (z.B. "WENN(" statt "WENN ("). Sonst ueberall ein Leerzeichen -
    // liest sich als Tooltip-Text deutlich angenehmer als dicht gepackter Formeltext.
    const noSpaceBefore = token.type === ')' || token.type === ';' || prevType === '(' || prevType === null
      || (token.type === '(' && prevType === 'IDENT');
    out += (noSpaceBefore ? '' : ' ') + textFor(token);
    prevType = token.type;
  }
  return out;
}
