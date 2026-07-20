// KI-Faehigkeitsbaum (Nutzer 2026-07-20, Sheet "KI-Baum-Kanten" in werte 0.8-claude.xlsx,
// siehe scripts/generate_data_ts.py's write_ki_baum_kanten_ts): eine KI-Faehigkeit ist erst
// waehlbar, wenn mindestens eine ihrer Vorbedingungen erfuellt ist. Mehrere Kanten-Zeilen mit
// derselben Faehigkeit sind alternative Pfade (ODER-Verknuepfung, Nutzer 2026-07-20 bestaetigt
// per AskUserQuestion) - z.B. "Geschossen ausweichen" braucht Abwehr>=15 ODER Adlerauge>=30
// ODER Gleichgewicht & Feingefuehl>=30, nicht alle drei gleichzeitig.
//
// Faehigkeiten, die in KI-Baum-Kanten nie in der Faehigkeit-Spalte auftauchen (nur Konzentration),
// sind Wurzelknoten - keine Baum-Vorbedingung. Konzentration ist der einzige
// Startpunkt des Baums (Nutzer 2026-07-20, per Diagramm bestaetigt) - Meister der
// Grundfertigkeiten und Selbstheilung sind KEINE Wurzelknoten mehr, sondern haengen selbst
// von Vorbedingungen ab (Charisma bzw. Erleuchtung/Schlaf der Heilung). Konzentration traegt
// zusaetzlich eine eigene, ausserhalb der Baum-Kanten liegende Sperre (Nutzer 2026-07-20):
// Aura>0 UND Magie>0, sonst bleibt sie (und damit der ganze Baum) gesperrt.
//
// Bewusst nur UI-Ebene (Nutzer 2026-07-20 bestaetigt): keine Durchsetzung in
// characterMutations.ts's setValue, analog zur SF-"Ladeschuetze"-Sichtbarkeitsregel
// (ladeschuetzeGating.ts) - die Sperre ist eine reine Anzeige-/Interaktions-Regel.

import type { ComputedSheet } from './characterSheet';
import { KI_BAUM_KANTEN } from '../data/kiBaumKanten';

function kiCurrentValue(sheet: ComputedSheet, referenz: string): number {
  const ki = sheet.byKategorie['KI'] ?? [];
  return ki.find((r) => r.rule.referenz === referenz)?.currentValue ?? 0;
}

function attributCurrentValue(sheet: ComputedSheet, referenz: string): number {
  const attribute = sheet.byKategorie['Attribute'] ?? [];
  return attribute.find((r) => r.rule.referenz === referenz)?.currentValue ?? 0;
}

const FAEHIGKEITEN_MIT_VORBEDINGUNG = new Set(KI_BAUM_KANTEN.map((k) => k.faehigkeit));

// Konzentration ist der einzige Wurzelknoten (siehe oben), traegt aber eine zusaetzliche
// Sperre ausserhalb der Baum-Kanten (Nutzer 2026-07-20): erst waehlbar, wenn Aura>0 UND
// Magie>0 - ohne diese Attribute bleibt sie (und damit der ganze Baum) gesperrt.
export const KONZENTRATION_REFERENZ = 'ki_konzentration';

export function isKiFaehigkeitUnlocked(sheet: ComputedSheet, referenz: string): boolean {
  if (referenz === KONZENTRATION_REFERENZ) {
    return attributCurrentValue(sheet, 'att_aura') > 0 && attributCurrentValue(sheet, 'att_magie') > 0;
  }
  if (!FAEHIGKEITEN_MIT_VORBEDINGUNG.has(referenz)) return true;
  return KI_BAUM_KANTEN
    .filter((k) => k.faehigkeit === referenz)
    .some((k) => kiCurrentValue(sheet, k.vorbedingung) >= k.mindestTaw);
}

/** Fuer die Sperr-Anzeige: die (unerfuellten) Vorbedingungen einer gesperrten Faehigkeit,
 *  z.B. fuer einen Hinweistext "benoetigt Abwehr 15 (aktuell 0) oder Adlerauge 30". */
export function getKiVorbedingungen(referenz: string): { vorbedingung: string; mindestTaw: number }[] {
  return KI_BAUM_KANTEN
    .filter((k) => k.faehigkeit === referenz)
    .map((k) => ({ vorbedingung: k.vorbedingung, mindestTaw: k.mindestTaw }));
}

/** Baum-Tiefe je Faehigkeit (BFS ab allen Wurzelknoten, 0-basiert) - fuer eine sinnvolle
 *  Tabellen-Reihenfolge (naeher an der Wurzel zuerst) statt reiner Alphabetik. KI-Baum-Kanten
 *  wurde am 2026-07-20 gegen das vom Nutzer bereitgestellte Baumdiagramm verifiziert und
 *  korrigiert (Konzentration einziger Startpunkt). Unerreichbare Knoten (sollte bei 28
 *  vollstaendig abgedeckten Faehigkeiten nicht vorkommen) fallen auf Number.POSITIVE_INFINITY
 *  (ans Ende sortiert). */
export function getKiTreeDepths(referenzen: string[]): Map<string, number> {
  const depths = new Map<string, number>();
  const roots = referenzen.filter((r) => !FAEHIGKEITEN_MIT_VORBEDINGUNG.has(r));
  const queue: string[] = [];
  for (const root of roots) {
    depths.set(root, 0);
    queue.push(root);
  }
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentDepth = depths.get(current)!;
    for (const kante of KI_BAUM_KANTEN) {
      if (kante.vorbedingung !== current) continue;
      const nextDepth = currentDepth + 1;
      if (depths.get(kante.faehigkeit) === undefined || nextDepth < depths.get(kante.faehigkeit)!) {
        depths.set(kante.faehigkeit, nextDepth);
        queue.push(kante.faehigkeit);
      }
    }
  }
  return depths;
}
