// Rekursiver-Abstieg-Parser fuer die Formel-Sprache.
//
// Grammatik:
//   condExpr := expr (('='|'<>'|'<'|'<='|'>'|'>=') expr)?
//   expr     := term (('+'|'-') term)*
//   term     := factor (('*'|'/') factor)*
//   factor   := NUMBER | STRING | IDENT | '(' condExpr ')' | call | '-' factor
//   call     := IDENT '(' (condExpr (';' condExpr)*)? ')'

import { tokenize, type Token } from './lexer';
import type { AstNode, CmpOp, BinOp } from './ast';

export class ParseError extends Error {
  constructor(message: string, public pos: number) {
    super(`${message} (Position ${pos})`);
  }
}

const CMP_OPS: CmpOp[] = ['=', '<>', '<', '<=', '>', '>='];

class Parser {
  private tokens: Token[];
  private i = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.i];
  }

  private next(): Token {
    return this.tokens[this.i++];
  }

  private expect(type: Token['type']): Token {
    const tok = this.peek();
    if (tok.type !== type) {
      throw new ParseError(`Erwartet '${type}', gefunden '${tok.type}' ('${tok.value}')`, tok.pos);
    }
    return this.next();
  }

  parseProgram(): AstNode {
    const node = this.parseCondExpr();
    this.expect('EOF');
    return node;
  }

  private parseCondExpr(): AstNode {
    let node = this.parseExpr();
    const tok = this.peek();
    if ((CMP_OPS as string[]).includes(tok.type)) {
      this.next();
      const right = this.parseExpr();
      node = { kind: 'Cmp', op: tok.type as CmpOp, left: node, right };
    }
    return node;
  }

  private parseExpr(): AstNode {
    let node = this.parseTerm();
    while (this.peek().type === '+' || this.peek().type === '-') {
      const op = this.next().type as BinOp;
      const right = this.parseTerm();
      node = { kind: 'BinOp', op, left: node, right };
    }
    return node;
  }

  private parseTerm(): AstNode {
    let node = this.parseFactor();
    while (this.peek().type === '*' || this.peek().type === '/') {
      const op = this.next().type as BinOp;
      const right = this.parseFactor();
      node = { kind: 'BinOp', op, left: node, right };
    }
    return node;
  }

  private parseFactor(): AstNode {
    const tok = this.peek();

    if (tok.type === '-') {
      this.next();
      return { kind: 'Neg', expr: this.parseFactor() };
    }
    if (tok.type === 'NUMBER') {
      this.next();
      return { kind: 'Num', value: Number(tok.value) };
    }
    if (tok.type === 'STRING') {
      this.next();
      return { kind: 'Str', value: tok.value };
    }
    if (tok.type === '(') {
      this.next();
      const inner = this.parseCondExpr();
      this.expect(')');
      return inner;
    }
    if (tok.type === 'IDENT') {
      this.next();
      if (this.peek().type === '(') {
        this.next();
        const args: AstNode[] = [];
        if (this.peek().type !== ')') {
          args.push(this.parseCondExpr());
          while (this.peek().type === ';') {
            this.next();
            args.push(this.parseCondExpr());
          }
        }
        this.expect(')');
        return { kind: 'Call', name: tok.value, args };
      }
      return { kind: 'Var', name: tok.value };
    }

    throw new ParseError(`Unerwartetes Token '${tok.type}' ('${tok.value}')`, tok.pos);
  }
}

export function parseFormula(source: string): AstNode {
  const tokens = tokenize(source);
  return new Parser(tokens).parseProgram();
}
