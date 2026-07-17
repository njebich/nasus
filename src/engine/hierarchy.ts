// Gemeinsame Spezialisierungs-Gruppierung (Hauptfertigkeit -> ihre Spezialisierungen), genutzt
// von views/categoryView.ts (Editier-Tabs) und views/charakterbogen.ts (End-Ansicht).

import type { ComputedRule } from './characterSheet';

/** Normalisiert Referenz/Beschreibung/Parent zum Abgleich - faltet Umlaute, ignoriert
 *  Gross-/Kleinschreibung- und Trennzeichen-Unterschiede (die Parent-Spalte ist je Kategorie
 *  uneinheitlich befuellt: mal Referenz, mal Beschreibung, mal beides mit Tippfehlern -
 *  siehe Fernkampf "fk_Blasrohre"). */
export function normalizeForMatch(s: string): string {
  return s.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '');
}

export interface HierarchyNode {
  row: ComputedRule;
  children: ComputedRule[];
}

/** Gruppiert Spezialisierungen (Parent loest auf eine andere Zeile derselben Liste auf) unter
 *  ihrer Hauptfertigkeit. Zeilen ohne aufloesbaren Parent und ohne Kinder bleiben flach. */
export function buildHierarchy(rows: ComputedRule[]): HierarchyNode[] {
  const byKey = new Map<string, ComputedRule>();
  for (const r of rows) {
    byKey.set(normalizeForMatch(r.rule.referenz), r);
    if (r.rule.beschreibung) byKey.set(normalizeForMatch(r.rule.beschreibung), r);
  }
  const childrenOf = new Map<ComputedRule, ComputedRule[]>();
  const isChild = new Set<ComputedRule>();
  for (const r of rows) {
    if (!r.rule.parent) continue;
    const parentRow = byKey.get(normalizeForMatch(r.rule.parent));
    if (!parentRow || parentRow === r) continue;
    isChild.add(r);
    (childrenOf.get(parentRow) ?? childrenOf.set(parentRow, []).get(parentRow)!).push(r);
  }
  return rows.filter((r) => !isChild.has(r)).map((r) => ({ row: r, children: childrenOf.get(r) ?? [] }));
}

/** Sortiert Gruppen UND ihre Spezialisierungen je nach eigenem Wert absteigend (Nutzer
 *  2026-07-17: "hoechster Wert = hoechste Position", auf beiden Ebenen). */
export function sortHierarchyByValue(nodes: HierarchyNode[]): HierarchyNode[] {
  const valueOf = (r: ComputedRule) => Number(r.currentValue ?? r.computedValue ?? 0);
  return [...nodes]
    .sort((a, b) => valueOf(b.row) - valueOf(a.row))
    .map((n) => ({ row: n.row, children: [...n.children].sort((a, b) => valueOf(b) - valueOf(a)) }));
}
