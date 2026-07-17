import { describe, it, expect } from 'vitest';
import { buildHierarchy, sortHierarchyByValue } from './hierarchy';
import type { ComputedRule } from './characterSheet';
import type { RuleEntry } from '../data/rules';

function rule(referenz: string, parent?: string, beschreibung?: string): RuleEntry {
  return { referenz, kategorie: 'Test', art: 'Wert', parent, beschreibung, sourceRow: 0 };
}

function row(referenz: string, currentValue: number, parent?: string, beschreibung?: string): ComputedRule {
  return { rule: rule(referenz, parent, beschreibung ?? referenz), currentValue };
}

describe('sortHierarchyByValue (Nutzer 2026-07-17: "hoechster Wert = hoechste Position", beide Ebenen)', () => {
  it('sortiert Gruppen nach dem Wert der Hauptzeile absteigend', () => {
    const rows = [
      row('nk_hiebwaffen', 2),
      row('nk_klingenwaffen', 5),
      row('nk_spez_hiebwaffen_aexte', 1, 'nk_hiebwaffen'),
      row('nk_spez_klingenwaffen_schwerter', 8, 'nk_klingenwaffen'),
    ];
    const sorted = sortHierarchyByValue(buildHierarchy(rows));
    expect(sorted.map((n) => n.row.rule.referenz)).toEqual(['nk_klingenwaffen', 'nk_hiebwaffen']);
  });

  it('sortiert Spezialisierungen INNERHALB einer Gruppe ebenfalls nach eigenem Wert absteigend', () => {
    const rows = [
      row('nk_klingenwaffen', 5),
      row('nk_spez_klingenwaffen_kurzschwerter', 2, 'nk_klingenwaffen'),
      row('nk_spez_klingenwaffen_schwerter', 8, 'nk_klingenwaffen'),
      row('nk_spez_klingenwaffen_zweihaender', 0, 'nk_klingenwaffen'),
    ];
    const sorted = sortHierarchyByValue(buildHierarchy(rows));
    expect(sorted[0].children.map((c) => c.rule.referenz)).toEqual([
      'nk_spez_klingenwaffen_schwerter', 'nk_spez_klingenwaffen_kurzschwerter', 'nk_spez_klingenwaffen_zweihaender',
    ]);
  });

  it('bleibt bei gleichem Wert stabil (originale Reihenfolge)', () => {
    const rows = [row('a', 0), row('b', 0), row('c', 0)];
    const sorted = sortHierarchyByValue(buildHierarchy(rows));
    expect(sorted.map((n) => n.row.rule.referenz)).toEqual(['a', 'b', 'c']);
  });
});
