// Lexer fuer die Formel-Sprache aus der Werte-xlsx (Formel/Pool/Kosten-Spalten).
// Deutsche Konvention: Semikolon trennt Funktions-Argumente, Komma ist Dezimaltrennzeichen.

export type TokenType =
  | 'NUMBER'
  | 'STRING'
  | 'IDENT'
  | '+' | '-' | '*' | '/'
  | '(' | ')' | ';'
  | '=' | '<>' | '<' | '<=' | '>' | '>='
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  pos: number;
}

const IDENT_START = /[A-Za-zÄÖÜäöüß_]/;
const IDENT_CONT = /[A-Za-zÄÖÜäöüß0-9_]/;
const DIGIT = /[0-9]/;

export class LexError extends Error {
  constructor(message: string, public pos: number) {
    super(`${message} (Position ${pos})`);
  }
}

// Referenz-Namen sind reine snake_case-Bezeichner ([A-Za-z0-9_], keine Bindestriche) -
// per Konvention in der Werte-xlsx durchgesetzt (siehe scripts/fix_hyphenated_referenzen.py).
// Dadurch ist '-' im Formeltext immer eindeutig der Minus-Operator, nie Teil eines Namens.
export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = input.length;

  while (i < n) {
    const ch = input[i];

    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      i++;
      continue;
    }

    if (DIGIT.test(ch)) {
      const start = i;
      while (i < n && DIGIT.test(input[i])) i++;
      if (input[i] === ',' && DIGIT.test(input[i + 1] ?? '')) {
        i++;
        while (i < n && DIGIT.test(input[i])) i++;
      }
      tokens.push({ type: 'NUMBER', value: input.slice(start, i).replace(',', '.'), pos: start });
      continue;
    }

    if (ch === "'") {
      const start = i;
      i++;
      let value = '';
      while (i < n && input[i] !== "'") {
        value += input[i];
        i++;
      }
      if (i >= n) throw new LexError("Nicht geschlossenes String-Literal ('...')", start);
      i++; // schliessendes '
      tokens.push({ type: 'STRING', value, pos: start });
      continue;
    }

    if (IDENT_START.test(ch)) {
      const start = i;
      while (i < n && IDENT_CONT.test(input[i])) i++;
      tokens.push({ type: 'IDENT', value: input.slice(start, i), pos: start });
      continue;
    }

    if (ch === '<') {
      if (input[i + 1] === '>') { tokens.push({ type: '<>', value: '<>', pos: i }); i += 2; continue; }
      if (input[i + 1] === '=') { tokens.push({ type: '<=', value: '<=', pos: i }); i += 2; continue; }
      tokens.push({ type: '<', value: '<', pos: i }); i++; continue;
    }
    if (ch === '>') {
      if (input[i + 1] === '=') { tokens.push({ type: '>=', value: '>=', pos: i }); i += 2; continue; }
      tokens.push({ type: '>', value: '>', pos: i }); i++; continue;
    }

    const singleCharTypes: Record<string, TokenType> = {
      '+': '+', '-': '-', '*': '*', '/': '/', '(': '(', ')': ')', ';': ';', '=': '=',
    };
    if (ch in singleCharTypes) {
      tokens.push({ type: singleCharTypes[ch], value: ch, pos: i });
      i++;
      continue;
    }

    throw new LexError(`Unerwartetes Zeichen '${ch}'`, i);
  }

  tokens.push({ type: 'EOF', value: '', pos: n });
  return tokens;
}
