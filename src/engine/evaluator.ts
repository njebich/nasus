// Reine AST-Auswertung. Kennt nichts von Charakteren/Referenz-Aufloesung -
// das macht der aufrufende Kontext (siehe rules.ts: evalReferenz/evalKostenFor).

import type { AstNode, CmpOp } from './ast';
import { min, max, aufrunden, abrunden, sverweis, toNumber } from './functions';
import type { LookupRow } from '../data/lookups';

export type Value = number | string | boolean;

export interface EvalContext {
  /** Loest eine Referenz-Variable oder die Pseudo-Variable `wert`/`grad` auf. */
  resolveVar(name: string): Value;
  /** Liefert die Zeilen einer per SVERWEIS referenzierten Lookup-Tabelle. */
  getLookupTable(sheetName: string): LookupRow[];
}

export class EvalError extends Error {}

function toBoolean(value: Value): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  return value.length > 0;
}

function compare(op: CmpOp, l: Value, r: Value): boolean {
  if (typeof l === 'string' || typeof r === 'string') {
    const ls = String(l);
    const rs = String(r);
    switch (op) {
      case '=': return ls === rs;
      case '<>': return ls !== rs;
      default:
        throw new EvalError(`Vergleichsoperator '${op}' ist fuer Text nicht definiert`);
    }
  }
  const ln = toNumber(l, 'Vergleich');
  const rn = toNumber(r, 'Vergleich');
  switch (op) {
    case '=': return ln === rn;
    case '<>': return ln !== rn;
    case '<': return ln < rn;
    case '<=': return ln <= rn;
    case '>': return ln > rn;
    case '>=': return ln >= rn;
  }
}

export function evalAst(node: AstNode, ctx: EvalContext): Value {
  switch (node.kind) {
    case 'Num':
      return node.value;
    case 'Str':
      return node.value;
    case 'Var':
      return ctx.resolveVar(node.name);
    case 'Neg':
      return -toNumber(evalAst(node.expr, ctx), 'Negation');
    case 'BinOp': {
      const l = toNumber(evalAst(node.left, ctx), `Operand von '${node.op}'`);
      const r = toNumber(evalAst(node.right, ctx), `Operand von '${node.op}'`);
      switch (node.op) {
        case '+': return l + r;
        case '-': return l - r;
        case '*': return l * r;
        case '/':
          if (r === 0) throw new EvalError('Division durch Null');
          return l / r;
      }
      break;
    }
    case 'Cmp':
      return compare(node.op, evalAst(node.left, ctx), evalAst(node.right, ctx));
    case 'Call':
      return evalCall(node.name, node.args, ctx);
  }
}

function evalCall(name: string, args: AstNode[], ctx: EvalContext): Value {
  const upper = name.toUpperCase();

  // WENN braucht lazy Auswertung der Zweige - nicht vorab evaluieren.
  if (upper === 'WENN') {
    if (args.length < 2 || args.length > 3) {
      throw new EvalError('WENN(bedingung; dann; sonst?) erwartet 2 oder 3 Argumente');
    }
    const cond = toBoolean(evalAst(args[0], ctx));
    if (cond) return evalAst(args[1], ctx);
    if (args.length === 3) return evalAst(args[2], ctx);
    return 0;
  }

  const values = args.map((a) => evalAst(a, ctx));

  switch (upper) {
    case 'MIN':
      return min(values.map((v) => toNumber(v, 'MIN-Argument')));
    case 'MAX':
      return max(values.map((v) => toNumber(v, 'MAX-Argument')));
    case 'AUFRUNDEN': {
      if (values.length !== 2) throw new EvalError('AUFRUNDEN(zahl; stellen) erwartet 2 Argumente');
      return aufrunden(toNumber(values[0], 'AUFRUNDEN'), toNumber(values[1], 'AUFRUNDEN-Stellen'));
    }
    case 'ABRUNDEN': {
      if (values.length !== 2) throw new EvalError('ABRUNDEN(zahl; stellen) erwartet 2 Argumente');
      return abrunden(toNumber(values[0], 'ABRUNDEN'), toNumber(values[1], 'ABRUNDEN-Stellen'));
    }
    case 'SVERWEIS': {
      if (values.length !== 4) {
        throw new EvalError("SVERWEIS(schluessel; 'sheet'; spalte; bereich_verweis) erwartet 4 Argumente");
      }
      const key = toNumber(values[0], 'SVERWEIS-Schluessel');
      const sheetName = String(values[1]);
      const colIndex = toNumber(values[2], 'SVERWEIS-Spalte');
      // Excel-Semantik (nicht "exakt" wie der Name vermuten laesst!): 4. Argument WAHR/1
      // (oder weggelassen) = Bereichsverweis / Naeherung (groesster Schluessel <= Suchwert,
      // Tabelle muss aufsteigend sortiert sein). FALSCH/0 = exakte Suche. Umgekehrt zur
      // intuitiven Lesart "1=exakt" - siehe stufe/kreis in der Werte-xlsx, die bewusst
      // Bereichsverweis=1 nutzen, um die EP-Schwelle der aktuellen Stufe zu finden.
      const bereichVerweis = toBoolean(values[3]);
      const exact = !bereichVerweis;
      return sverweis(key, ctx.getLookupTable(sheetName), colIndex, exact);
    }
    default:
      throw new EvalError(`Unbekannte Funktion '${name}'`);
  }
}
