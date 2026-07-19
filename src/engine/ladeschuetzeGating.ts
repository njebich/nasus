// SF "Ladeschuetze"-Gruppe: nur relevant, wenn der Charakter die zugehoerige Fernkampf-Waffenart
// ueberhaupt gelernt hat - Sichtbarkeitsfilter in der Sonderfertigkeit-Ansicht, keine Regelbuch-
// Aenderung. Korrigiert 2026-07-19: die "talente_ladeschuetze_*"-Talente wurden zuerst
// faelschlich als Freischalt-Bedingung behandelt - sie sind tatsaechlich reine Maximum-Boni auf
// die jeweilige sf_ladeschuetze_*-SF (siehe talenteMaximum.ts), keine Kaufsperre. Die eigentliche
// Bedingung ist die passende Fernkampf-Hauptfertigkeit (fk_boegen/fk_blasrohre/fk_schusswaffen/
// fk_wurfwaffen) > 0 - Nutzer-Bestaetigung 2026-07-19 (AskUserQuestion, 4 Fragen).
//
// Kanone und Rune haben keine passende Fernkampf-Kategorie im Datensatz - bleiben dauerhaft
// ausgeblendet (Nutzerentscheidung). Schleuder wurde komplett deaktiviert (siehe Entwickeln-Sheet
// in werte 0.8-claude.xlsx, sf_ladeschuetze_schleuder/talente_ladeschuetze_schleuder mit "#"
// auskommentiert) - "Ladeschuetze Schleuder existiert, Waffe Schleuder existiert nicht".

import type { ComputedSheet } from './characterSheet';

/** referenz -> fk_*-Referenz, die > 0 sein muss, damit die Zeile ueberhaupt angezeigt wird.
 *  `undefined` heisst: dauerhaft ausgeblendet (keine passende Fernkampf-Kategorie vorhanden). */
export const LADESCHUETZE_SF_FK_GATE: Record<string, string | undefined> = {
  sf_ladeschuetze_armbrust: 'fk_schusswaffen',
  sf_ladeschuetze_blasrohr: 'fk_blasrohre',
  sf_ladeschuetze_bogen: 'fk_boegen',
  sf_ladeschuetze_kanone: undefined,
  sf_ladeschuetze_patrone: 'fk_schusswaffen',
  sf_ladeschuetze_rune: undefined,
  sf_ladeschuetze_vorderlader: 'fk_schusswaffen',
  sf_ladeschuetze_wurfmesser: 'fk_wurfwaffen',
};

export function isLadeschuetzeSfVisible(sheet: ComputedSheet, referenz: string): boolean {
  const fkReferenz = LADESCHUETZE_SF_FK_GATE[referenz];
  if (!fkReferenz) return false;
  const fernkampf = sheet.byKategorie['Fernkampf'] ?? [];
  return (fernkampf.find((r) => r.rule.referenz === fkReferenz)?.currentValue ?? 0) > 0;
}
