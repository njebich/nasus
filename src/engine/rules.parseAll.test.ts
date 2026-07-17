// Diagnostischer Test: versucht, JEDE Formel/Pool/Kosten-Zelle im kompletten Regelwerk zu
// parsen (nicht nur die handverifizierten Einzelbeispiele in rules.test.ts). Deckt reale
// Datenprobleme auf (kaputte Formeln, unbekannte Funktionen, Tippfehler in Referenzen), statt
// sie erst beim Rendern eines Charakterblatts zu bemerken.
import { describe, it, expect } from 'vitest';
import { RULES } from '../data/rules';
import { parseFormula, ParseError } from './parser';
import type { AstNode } from './ast';

const referenzSet = new Set(RULES.map((r) => r.referenz.toLowerCase()));
const artByReferenz = new Map(RULES.map((r) => [r.referenz.toLowerCase(), r.art]));

// Bekannte, bereits als offen dokumentierte Luecken (siehe Plan "Offene Fragen" /
// Entwickeln-Sheet) - hier bewusst NICHT stillschweigend zum Bestehen gebracht, sondern
// explizit gelistet, damit ein neuer, UNERWARTETER Parse-Fehler den Test rot macht.
const KNOWN_UNPARSEABLE = new Set<string>([
  'gewichtsbelastung', // Formel ist Platzhalter-Prosa (SUMME(...) mit [RBE/6]-Notation), siehe Entwickeln-Sheet
  // Aggregat-Formeln ueber den GANZEN Charakterbogen/Ausruestung, keine Zeilen-Referenz-
  // Formel im normalen Sinn - SUMME(...) hier ist Prosa-Beschreibung, kein implementierter
  // Aggregations-Ausdruck. validate_werte.py behandelt "SUMME(" bewusst genauso als Sonderfall.
  'ep_verbraucht',
  'rs_arme', 'rs_beine', 'rs_kopf', 'rs_torso',
  // Bewegungsraten als reiner Text ("0,3 m/s"), keine Formel - siehe Bewegung-Kategorie.
  'bewegung_fix_langsam_schwimmen', 'bewegung_fix_marschieren', 'bewegung_fix_reiten_reisetempo',
  'bewegung_fix_schnell_gehen', 'bewegung_fix_ueber_wasser_bleiben',
]);

// Parst erfolgreich, referenziert aber eine Variable, die (noch) nicht im Regelwerk existiert -
// anders als KNOWN_UNPARSEABLE (kompletter Parse-Fehler), hier nur eine gezielte Variable.
const KNOWN_UNKNOWN_VARS = new Set<string>([
  // gewichtsbelastung.formelRaw = 'MAX(0;RBE)' (werte 0.8): RBE ist wie wert/grad eine
  // Pseudo-Variable, aber nur fuer diese eine Referenz gueltig - rules.ts bindet sie zur
  // Laufzeit ueber evalFormulaWith(..., extraVars) an computeRbe(RHg=0; Kon; Staerke;
  // sf_ruestungsmanoever) (RHg selbst ist Kampfmodul-Scope, siehe armorComposition.ts).
  'gewichtsbelastung.rbe',
]);

/** "FEHLT" ist ein bewusster Platzhalter fuer "Formel noch nicht definiert", keine Formel. */
function isFehltPlaceholder(source: string): boolean {
  return source.trim().toUpperCase() === 'FEHLT';
}

const BUILTIN_FUNCTIONS = new Set(['MIN', 'MAX', 'WENN', 'AUFRUNDEN', 'ABRUNDEN', 'SVERWEIS']);

function collectVarsAndCalls(node: AstNode, vars: Set<string>, calls: Set<string>) {
  switch (node.kind) {
    case 'Var': vars.add(node.name.toLowerCase()); break;
    case 'Call':
      calls.add(node.name.toUpperCase());
      node.args.forEach((a) => collectVarsAndCalls(a, vars, calls));
      break;
    case 'BinOp': case 'Cmp':
      collectVarsAndCalls(node.left, vars, calls);
      collectVarsAndCalls(node.right, vars, calls);
      break;
    case 'Neg': collectVarsAndCalls(node.expr, vars, calls); break;
  }
}

describe('gesamtes Regelwerk: Formel/Pool/Kosten parsen', () => {
  const columns: Array<'formelRaw' | 'poolRaw' | 'kostenRaw'> = ['formelRaw', 'poolRaw', 'kostenRaw'];
  const unexpectedFailures: string[] = [];
  const unknownVarRefs: string[] = [];
  const unknownFunctionCalls: string[] = [];
  const fixwertVarRefs: string[] = [];

  for (const rule of RULES) {
    for (const col of columns) {
      const source = rule[col];
      if (!source || isFehltPlaceholder(source)) continue;

      let ast: AstNode;
      try {
        ast = parseFormula(source);
      } catch (err) {
        if (err instanceof ParseError && !KNOWN_UNPARSEABLE.has(rule.referenz)) {
          unexpectedFailures.push(`${rule.referenz}.${col}: "${source}" -> ${err.message}`);
        }
        continue;
      }

      const vars = new Set<string>();
      const calls = new Set<string>();
      collectVarsAndCalls(ast, vars, calls);

      for (const v of vars) {
        if (v === 'wert' || v === 'grad') continue; // Pseudo-Variablen, nur in Kosten-Kontext gueltig
        if (KNOWN_UNKNOWN_VARS.has(`${rule.referenz}.${v}`)) continue;
        if (!referenzSet.has(v)) {
          unknownVarRefs.push(`${rule.referenz}.${col}: unbekannte Variable '${v}' in "${source}"`);
        } else if (artByReferenz.get(v) === 'Fixwert') {
          // Fixwert ist roher Referenztext (Zahl ODER "0,3 m/s"), nicht formelauswertbar -
          // siehe characterSheet.ts/rules.ts. Falls das doch mal vorkommt, muss die
          // Fixwert-Behandlung im Evaluator ueberarbeitet werden statt es zu ignorieren.
          fixwertVarRefs.push(`${rule.referenz}.${col}: referenziert Fixwert '${v}' in "${source}"`);
        }
      }
      for (const c of calls) {
        if (!BUILTIN_FUNCTIONS.has(c)) {
          unknownFunctionCalls.push(`${rule.referenz}.${col}: unbekannte Funktion '${c}' in "${source}"`);
        }
      }
    }
  }

  it('keine UNERWARTETEN Parse-Fehler (bekannte Luecken sind in KNOWN_UNPARSEABLE gelistet)', () => {
    expect(unexpectedFailures).toEqual([]);
  });

  it('jede referenzierte Variable existiert im Regelwerk (ausser wert/grad)', () => {
    expect(unknownVarRefs).toEqual([]);
  });

  it('jede aufgerufene Funktion ist im Evaluator implementiert', () => {
    expect(unknownFunctionCalls).toEqual([]);
  });

  it('keine Formel referenziert einen Art=Fixwert-Eintrag als Variable', () => {
    expect(fixwertVarRefs).toEqual([]);
  });
});
