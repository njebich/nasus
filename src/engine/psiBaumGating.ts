// PSI-Zauberbaum (Nutzer 2026-07-21): eine PSI-Faehigkeit ist erst waehlbar, wenn ihr
// rule.parent (aus psi.jsonl/Sheet "Werte") den in rule.mindestTaw geforderten TaW erreicht hat.
// Anders als der KI-Baum (kiBaumGating.ts) ist der PSI-Baum ein reiner Baum (genau ein
// Elternknoten je Faehigkeit, keine ODER-Alternativpfade) - Nutzer-Vorgabe 2026-07-21, per Kanten
// bestaetigt: Telekinese 12->Telekinetisches Geschoss, Telekinese 15->Hoehere Telekinese
// 15->Telekinese Griff, Telekinese 10->Kryokinese 15->Pyrokinese 15->Destruktion, Hoehere
// Telekinese 10->Deformation 10->Geschosse ablenken, Empathie 15->Suggestion 10->{Im Schatten/
// Wald/Menge/Ferne verstecken}. Wurzeln (kein parent in psi.jsonl): Telekinese, Empathie. Diese
// Kanten stecken bereits 1:1 in parent/mindestTaw jeder Zeile - keine separate Kanten-Datei noetig
// (anders als KI_BAUM_KANTEN, das ODER-Alternativpfade abbilden muss).
//
// Zusatzgate auf beiden Wurzeln (Nutzer 2026-07-21, analog KONZENTRATION_REFERENZ in
// kiBaumGating.ts): Telekinese/Empathie sind erst waehlbar, wenn Aura>0 UND Magie>0 - ohne diese
// Attribute bleibt der gesamte Baum gesperrt.
//
// Bewusst nur UI-Ebene (analog kiBaumGating.ts) - keine Durchsetzung in characterMutations.ts.

import type { ComputedSheet } from './characterSheet';

function psiRow(sheet: ComputedSheet, referenz: string) {
  return (sheet.byKategorie['PSI'] ?? []).find((r) => r.rule.referenz === referenz);
}

function psiCurrentValue(sheet: ComputedSheet, referenz: string): number {
  return psiRow(sheet, referenz)?.currentValue ?? 0;
}

function attributCurrentValue(sheet: ComputedSheet, referenz: string): number {
  return (sheet.byKategorie['Attribute'] ?? []).find((r) => r.rule.referenz === referenz)?.currentValue ?? 0;
}

export function isPsiWertUnlocked(sheet: ComputedSheet, referenz: string): boolean {
  const rule = psiRow(sheet, referenz)?.rule;
  if (!rule?.parent) {
    return attributCurrentValue(sheet, 'att_aura') > 0 && attributCurrentValue(sheet, 'att_magie') > 0;
  }
  return psiCurrentValue(sheet, rule.parent) >= Number(rule.mindestTaw ?? 0);
}

/** Fuer die Sperr-Anzeige: die unerfuellte Vorbedingung einer gesperrten Faehigkeit - undefined
 *  fuer die beiden Wurzeln (Telekinese/Empathie), deren Sperre stattdessen das Aura/Magie-Gate
 *  oben ist (siehe isPsiWertUnlocked). */
export function getPsiVorbedingung(sheet: ComputedSheet, referenz: string): { vorbedingung: string; mindestTaw: number } | undefined {
  const rule = psiRow(sheet, referenz)?.rule;
  if (!rule?.parent) return undefined;
  return { vorbedingung: rule.parent, mindestTaw: Number(rule.mindestTaw ?? 0) };
}

/** Kehrseite von getPsiVorbedingung - fuer die "+"-Tooltip-Anzeige bei bereits waehlbaren
 *  Faehigkeiten: welche Nachfolger-Faehigkeit ab welchem TaW auf dieser Faehigkeit freigeschaltet
 *  wird. */
export function getPsiFreischaltungen(sheet: ComputedSheet, referenz: string): { faehigkeit: string; mindestTaw: number }[] {
  return (sheet.byKategorie['PSI'] ?? [])
    .filter((r) => r.rule.parent === referenz)
    .map((r) => ({ faehigkeit: r.rule.referenz, mindestTaw: Number(r.rule.mindestTaw ?? 0) }));
}

/** Baum-Tiefe je Faehigkeit (0 = Wurzel) - fuer eine Tabellen-Reihenfolge naeher an der Wurzel
 *  zuerst statt reiner Alphabetik, analog getKiTreeDepths. */
export function getPsiTreeDepths(sheet: ComputedSheet): Map<string, number> {
  const psi = sheet.byKategorie['PSI'] ?? [];
  const parentOf = new Map(psi.map((r) => [r.rule.referenz, r.rule.parent]));
  const depths = new Map<string, number>();
  function depthOf(referenz: string): number {
    const cached = depths.get(referenz);
    if (cached !== undefined) return cached;
    const parent = parentOf.get(referenz);
    const depth = parent ? depthOf(parent) + 1 : 0;
    depths.set(referenz, depth);
    return depth;
  }
  for (const r of psi) depthOf(r.rule.referenz);
  return depths;
}
