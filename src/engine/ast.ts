// AST-Knotentypen fuer die Formel-Sprache.

export type CmpOp = '=' | '<>' | '<' | '<=' | '>' | '>=';
export type BinOp = '+' | '-' | '*' | '/';

export type AstNode =
  | { kind: 'Num'; value: number }
  | { kind: 'Str'; value: string }
  | { kind: 'Var'; name: string }
  | { kind: 'BinOp'; op: BinOp; left: AstNode; right: AstNode }
  | { kind: 'Cmp'; op: CmpOp; left: AstNode; right: AstNode }
  | { kind: 'Call'; name: string; args: AstNode[] }
  | { kind: 'Neg'; expr: AstNode };
