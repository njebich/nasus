// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.
// Quelle: Sheet "Werte" (-> rules.json). Enthaelt ALLE Kategorien; welche
// UI-Views welche Kategorien anzeigen, wird in src/views/*.ts entschieden.
import rulesJson from './rules.json';

export type Art = 'Wert' | 'Auswahl' | 'Formel' | 'Pool' | 'Fixwert' | 'Lookup';

export interface RuleEntry {
  referenz: string;
  kategorie: string;
  beschreibung?: string;
  abkuerzung?: string;
  info?: string;
  parent?: string;
  art: Art;
  formelRaw?: string;
  poolRaw?: string;
  flag?: string;
  grad?: string;
  kostenRaw?: string;
  verfuegbarkeit?: string;
  mindestTaw?: string;
  eigBonus?: string;
  wirkung?: string;
  sourceRow: number;
}

export const RULES = rulesJson as unknown as RuleEntry[];

// Codegen-Warnungen (siehe Konsolen-Ausgabe beim Generieren):
// - Zeile 192: Referenz '#sf_ladeschuetze_schleuder' mit '#' auskommentiert - uebersprungen
// - Zeile 251: Referenz '#ki_ki_faehigkeiten' mit '#' auskommentiert - uebersprungen
// - Zeile 1152: Referenz '#talente_ladeschuetze_schleuder' mit '#' auskommentiert - uebersprungen
// - Zeile 1371: Referenz '#vn_unempfindlichkeit_gegen_alchemie' mit '#' auskommentiert - uebersprungen
