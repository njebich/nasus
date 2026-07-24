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

/** nameOverrides: Aufrufer-seitige Anzeigenamen-Ueberschreibung je Referenz (lowercase Key) - z.B.
 *  Nahkampf AT-/PA-Basis (categoryView.ts's renderWaffenBasisCell), wo die Formel die EIGENE
 *  Hauptfertigkeit referenziert und diese als "TaW" statt ihres Namens ("Hiebwaffen" etc.) lesen
 *  soll. Nur fuer prettyFormula-Aufrufer, aendert nichts an der eigentlichen Formel-Auswertung. */
function textFor(token: Token, nameOverrides?: Record<string, string>): string {
  if (token.type === 'IDENT') {
    const upper = token.value.toUpperCase();
    if (FUNCTION_NAMES.has(upper)) return upper;
    const pseudo = PSEUDO_VARS[token.value.toLowerCase()];
    if (pseudo) return pseudo;
    const override = nameOverrides?.[token.value.toLowerCase()];
    if (override) return override;
    return displayNameFor(token.value);
  }
  if (token.type === 'STRING') return `'${token.value}'`;
  return token.value;
}

/** Index des zu tokens[openIdx] ('(') passenden ')' - Tiefe-Tracking fuer verschachtelte Klammern. */
function matchingParenIndex(tokens: Token[], openIdx: number): number {
  let depth = 0;
  for (let i = openIdx; i < tokens.length; i++) {
    if (tokens[i].type === '(') depth++;
    else if (tokens[i].type === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** Teilt Tokens im Bereich [start, end] an Top-Level-';' (Klammertiefe 0 relativ zum Bereich) in
 *  Funktionsargumente auf - fuer die AUFRUNDEN/ABRUNDEN/MIN-Erkennung unten. */
function splitTopLevelArgs(tokens: Token[], start: number, end: number): Token[][] {
  const args: Token[][] = [];
  let depth = 0;
  let current: Token[] = [];
  for (let i = start; i <= end; i++) {
    const t = tokens[i];
    if (t.type === '(') depth++;
    if (t.type === ')') depth--;
    if (t.type === ';' && depth === 0) {
      args.push(current);
      current = [];
    } else {
      current.push(t);
    }
  }
  args.push(current);
  return args;
}

function isSingleNumber(tokens: Token[], value: string): boolean {
  return tokens.length === 1 && tokens[0].type === 'NUMBER' && tokens[0].value === value;
}

/** Entfernt rein kosmetische Rundungs-/Kappungs-Huellen vor der Tooltip-Anzeige (Nutzer-Direktive
 *  2026-07-24: "hide all technical excel formula stuff", z.B. "AUFRUNDEN(...;0)"): AUFRUNDEN(x;0)/
 *  ABRUNDEN(x;0) tragen fuer den Spieler keine Zusatzinformation gegenueber x selbst, ebenso die
 *  verbreitete "auf 20 gedeckelt"-Huelle MIN(20;x) (siehe waffenPool.ts's stripMin20 fuer denselben
 *  Cap-Fall in der Auswertung). Rein textuell fuer prettyFormula - engine/rules.ts wertet weiterhin
 *  die ungekuerzte formelRaw aus. Rekursiv, damit verschachtelte Kombinationen (z.B. AUFRUNDEN(MIN(
 *  20;x)/3;0)) in einem Durchlauf vollstaendig vereinfacht werden. */
function simplifyTokens(tokens: Token[]): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t.type === 'IDENT' && tokens[i + 1]?.type === '(') {
      const upper = t.value.toUpperCase();
      const openIdx = i + 1;
      const closeIdx = matchingParenIndex(tokens, openIdx);
      if (closeIdx !== -1 && (upper === 'AUFRUNDEN' || upper === 'ABRUNDEN' || upper === 'MIN')) {
        const args = splitTopLevelArgs(tokens, openIdx + 1, closeIdx - 1);
        if ((upper === 'AUFRUNDEN' || upper === 'ABRUNDEN') && args.length === 2 && isSingleNumber(args[1], '0')) {
          out.push(...simplifyTokens(args[0]));
          i = closeIdx + 1;
          continue;
        }
        if (upper === 'MIN' && args.length === 2 && isSingleNumber(args[0], '20')) {
          out.push(...simplifyTokens(args[1]));
          i = closeIdx + 1;
          continue;
        }
      }
    }
    out.push(t);
    i++;
  }
  return out;
}

/**
 * Wandelt eine rohe Formel (formelRaw/poolRaw/kostenRaw) in eine per Abkuerzung lesbare
 * Darstellung um, z.B. "aw_def_normal"-Formel -> "(Athletik+Schnelligkeit+Glue+AW)/5+6-GBE".
 * Nicht parsebare Rohtexte (z.B. der GBE-Prosa-Platzhalter) werden unveraendert zurueckgegeben.
 */
export function prettyFormula(raw: string, nameOverrides?: Record<string, string>): string {
  let tokens: Token[];
  try {
    tokens = simplifyTokens(tokenize(raw));
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
    out += (noSpaceBefore ? '' : ' ') + textFor(token, nameOverrides);
    prevType = token.type;
  }
  return out;
}
