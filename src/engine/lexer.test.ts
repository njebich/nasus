import { describe, it, expect } from 'vitest';
import { tokenize } from './lexer';

describe('tokenize', () => {
  it('lexes numbers with German decimal comma', () => {
    const tokens = tokenize('1,5');
    expect(tokens[0]).toMatchObject({ type: 'NUMBER', value: '1.5' });
  });

  it('lexes semicolon as argument separator (not comma)', () => {
    const tokens = tokenize('WENN(a;1;2)');
    expect(tokens.map((t) => t.type)).toEqual(['IDENT', '(', 'IDENT', ';', 'NUMBER', ';', 'NUMBER', ')', 'EOF']);
  });

  it('lexes comparison operators', () => {
    const tokens = tokenize('a<>b');
    expect(tokens.map((t) => t.type)).toEqual(['IDENT', '<>', 'IDENT', 'EOF']);
  });

  it('treats "-" between two identifiers as subtraction (Referenz-Namen sind bindestrichfrei, siehe fix_hyphenated_referenzen.py)', () => {
    const tokens = tokenize('ep_gesamt-ep_start');
    expect(tokens.map((t) => t.type)).toEqual(['IDENT', '-', 'IDENT', 'EOF']);
  });
});
