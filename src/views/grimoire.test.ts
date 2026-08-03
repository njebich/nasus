import { describe, expect, it } from 'vitest';
import { buildSpreads, buildToc, type Spread, type TocEntry } from './grimoire';
import type { Row } from './spruchmagie';

function makeRow(referenz: string, parent: string, beschreibung: string): Row {
  return {
    rule: { referenz, kategorie: 'Spruchmagie', art: 'Wert', parent, beschreibung, sourceRow: 0 },
    currentValue: 1,
    detail: undefined,
    learnGate: { allowed: true },
    increaseGate: { allowed: true },
    unlocked: true,
  };
}

describe('Grimoire: Doppelseiten-Paginierung', () => {
  it('stellt die TOC-Doppelseite (blank links, Inhaltsverzeichnis rechts) immer voran', () => {
    const spreads = buildSpreads([]);
    expect(spreads).toHaveLength(1);
    expect(spreads[0]).toEqual<Spread>({ isToc: true, left: null, right: null });
  });

  it('packt je 2 Zauber auf eine Doppelseite', () => {
    const spells = [
      makeRow('a', 'Verändern', 'A'),
      makeRow('b', 'Verändern', 'B'),
      makeRow('c', 'Erschaffen', 'C'),
      makeRow('d', 'Erschaffen', 'D'),
    ];
    const spreads = buildSpreads(spells);
    expect(spreads).toHaveLength(3);
    expect(spreads[1]).toEqual({ isToc: false, left: spells[0], right: spells[1] });
    expect(spreads[2]).toEqual({ isToc: false, left: spells[2], right: spells[3] });
  });

  it('lässt beim letzten ungeraden Zauber die rechte Seite blank', () => {
    const spells = [makeRow('a', 'Verändern', 'A'), makeRow('b', 'Verändern', 'B'), makeRow('c', 'Erschaffen', 'C')];
    const spreads = buildSpreads(spells);
    expect(spreads).toHaveLength(3);
    expect(spreads[2]).toEqual({ isToc: false, left: spells[2], right: null });
  });
});

describe('Grimoire: Inhaltsverzeichnis', () => {
  it('listet jede Schule mit mindestens einem gelernten Zauber genau einmal', () => {
    const spells = [
      makeRow('a', 'Verändern', 'A'),
      makeRow('b', 'Verändern', 'B'),
      makeRow('c', 'Erschaffen', 'C'),
    ];
    expect(buildToc(spells)).toEqual<TocEntry[]>([
      { schule: 'Verändern', pageIndex: 2 },
      { schule: 'Erschaffen', pageIndex: 3 },
    ]);
  });

  it('zeigt keine Schule ohne gelernten Zauber', () => {
    expect(buildToc([])).toEqual([]);
  });

  it('verweist auf die Doppelseite des jeweils ersten Zaubers dieser Schule', () => {
    const spells = [
      makeRow('a', 'Verändern', 'A'),
      makeRow('b', 'Erschaffen', 'B'),
      makeRow('c', 'Erschaffen', 'C'),
      makeRow('d', 'Erschaffen', 'D'),
    ];
    const toc = buildToc(spells);
    expect(toc.find((e) => e.schule === 'Verändern')?.pageIndex).toBe(2);
    // 'B' (Index 1) liegt noch auf derselben Zauber-Doppelseite wie 'A' (Seite 2), 'C' (Index 2)
    // beginnt die naechste (Seite 3) - die TOC-Zeile fuer 'Erschaffen' zeigt auf die Seite des
    // jeweils ERSTEN Vorkommens (B, Seite 2).
    expect(toc.find((e) => e.schule === 'Erschaffen')?.pageIndex).toBe(2);
    expect(toc).toHaveLength(2);
  });
});
