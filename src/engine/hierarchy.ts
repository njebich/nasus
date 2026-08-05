// Gemeinsame Spezialisierungs-Gruppierung (Hauptfertigkeit -> ihre Spezialisierungen), genutzt
// von views/categoryView.ts (Editier-Tabs) und views/charakterbogen.ts (End-Ansicht).

import type { ComputedRule } from './characterSheet';
import { normalizeForMatch } from './normalize';

export { normalizeForMatch };

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
    // Zeilen, deren Beschreibung mit "-> " beginnt, sind selbst schon als Spezialisierung markiert
    // (WHK/Nahkampf/Fernkampf-Konvention) - sie duerfen nicht als Parent-Ziel einer ANDEREN Zeile
    // gefunden werden, sonst kollidiert ihr normalisierter Name mit einer gleichnamigen
    // Hauptfertigkeit (normalizeForMatch entfernt Satzzeichen inkl. "->", z.B. WHK "-> Maler" unter
    // Kunsthandwerker vs. die eigenstaendige Hauptfertigkeit "Maler" unter Bau - beide normalisieren
    // zu "maler". Bugfix WHK-Zensus-Import 2026-08-05: Maler(Bau) zeigte faelschlich 0 statt 3
    // Spezialisierungen, weil dessen echte Kinder auf die Kunsthandwerker-Zeile aufgeloest wurden).
    if (r.rule.beschreibung && !r.rule.beschreibung.trimStart().startsWith('->')) {
      byKey.set(normalizeForMatch(r.rule.beschreibung), r);
    }
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

/** Sortiert Gruppen UND ihre Spezialisierungen alphabetisch nach Anzeigename (Punkt 4c: WHK-Liste
 *  soll alphabetisch sortiert sein, im Unterschied zur wert-basierten Sortierung oben). */
export function sortHierarchyByBeschreibung(nodes: HierarchyNode[]): HierarchyNode[] {
  const labelOf = (r: ComputedRule) => r.rule.beschreibung ?? r.rule.referenz;
  return [...nodes]
    .sort((a, b) => labelOf(a.row).localeCompare(labelOf(b.row), 'de'))
    .map((n) => ({ row: n.row, children: [...n.children].sort((a, b) => labelOf(a).localeCompare(labelOf(b), 'de')) }));
}

/** Gruppiert bereits gebaute Top-Level-Knoten (Hauptfertigkeiten) nach ihrem eigenen Parent-Feld -
 *  bei WHK ist das die neue Kategorie-Gruppe (z.B. "Bau"/"Metall", WHK-ZENSUS-ENTWURF.md Runde 8),
 *  eine zweite Parent-Ebene UEBER der Hauptfertigkeit->Spezialisierung-Kette, die buildHierarchy
 *  bereits aufgeloest hat (Hauptfertigkeit-Zeilen loesen als Parent NICHT auf eine andere WHK-Zeile
 *  auf, bleiben also bei buildHierarchy bewusst Top-Level-Knoten). Knoten ohne Parent landen in
 *  "Sonstige". Reihenfolge der zurueckgegebenen Map folgt der Eingabe-Reihenfolge der Knoten. */
export function groupHierarchyByParent(nodes: HierarchyNode[]): Map<string, HierarchyNode[]> {
  const groups = new Map<string, HierarchyNode[]>();
  for (const node of nodes) {
    const key = node.row.rule.parent ?? 'Sonstige';
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(node);
  }
  return groups;
}
