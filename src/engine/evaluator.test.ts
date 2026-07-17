import { describe, it, expect } from 'vitest';
import { parseFormula } from './parser';
import { evalAst, type EvalContext } from './evaluator';

function ctxWith(vars: Record<string, number | string>): EvalContext {
  return {
    resolveVar: (name) => {
      const v = vars[name.toLowerCase()];
      if (v === undefined) throw new Error(`unbekannte Variable in Test: ${name}`);
      return v;
    },
    getLookupTable: (sheetName) => {
      if (sheetName === 'TestTable') {
        return [
          { Wert: '0', EP: '0' },
          { Wert: '1', EP: '30' },
          { Wert: '11', EP: '300' },
        ];
      }
      throw new Error(`unbekannte Lookup-Tabelle in Test: ${sheetName}`);
    },
  };
}

describe('evalAst - Grundrechenarten & Funktionen', () => {
  it('rechnet Grundrechenarten mit korrekter Prioritaet', () => {
    expect(evalAst(parseFormula('2+3*4'), ctxWith({}))).toBe(14);
    expect(evalAst(parseFormula('(2+3)*4'), ctxWith({}))).toBe(20);
  });

  it('loest MIN/MAX auf', () => {
    expect(evalAst(parseFormula('MIN(20;25)'), ctxWith({}))).toBe(20);
    expect(evalAst(parseFormula('MAX(20;25)'), ctxWith({}))).toBe(25);
  });

  it('AUFRUNDEN rundet vom Nullpunkt weg (ROUNDUP-Semantik)', () => {
    expect(evalAst(parseFormula('AUFRUNDEN(9,0/2;0)'), ctxWith({}))).toBeCloseTo(5);
    expect(evalAst(parseFormula('AUFRUNDEN(-9,0/2;0)'), ctxWith({}))).toBeCloseTo(-5);
  });

  it('WENN wertet nur den zutreffenden Zweig aus (lazy)', () => {
    let calledElse = false;
    const ctx: EvalContext = {
      resolveVar: (name) => {
        if (name === 'flag') return 1;
        if (name === 'boom') { calledElse = true; return 0; }
        throw new Error('unbekannt');
      },
      getLookupTable: () => { throw new Error('nicht verwendet'); },
    };
    const result = evalAst(parseFormula('WENN(flag=1;99;boom)'), ctx);
    expect(result).toBe(99);
    expect(calledElse).toBe(false);
  });

  it('SVERWEIS macht Naeherungssuche (groesster Key <= Suchwert) wenn Bereich_Verweis=1 (Excel-Semantik, nicht "exakt"!)', () => {
    expect(evalAst(parseFormula("SVERWEIS(5;'TestTable';2;1)"), ctxWith({}))).toBe(30);
  });

  it('SVERWEIS macht exakte Suche wenn Bereich_Verweis=0 und wirft bei fehlendem Treffer', () => {
    expect(evalAst(parseFormula("SVERWEIS(1;'TestTable';2;0)"), ctxWith({}))).toBe(30);
    expect(() => evalAst(parseFormula("SVERWEIS(5;'TestTable';2;0)"), ctxWith({}))).toThrow();
  });

  it('Vergleichsoperatoren funktionieren fuer Zahlen und Text', () => {
    expect(evalAst(parseFormula('3<5'), ctxWith({}))).toBe(true);
    expect(evalAst(parseFormula("'Ja'='Ja'"), ctxWith({}))).toBe(true);
    expect(evalAst(parseFormula("'Ja'<>'Nein'"), ctxWith({}))).toBe(true);
  });

  it('loest Variablen ueber den Kontext auf', () => {
    expect(evalAst(parseFormula('eig_g_mut+eig_k_athletik'), ctxWith({ eig_g_mut: 10, eig_k_athletik: 8 }))).toBe(18);
  });
});
