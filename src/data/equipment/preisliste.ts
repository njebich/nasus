// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.

import preislisteJson from './preisliste.json';

export interface PreislisteRow {
  sourceRow: number;
  art?: string;
  name?: string;
  anzahl?: number;
  einheit?: string;
  gewichtKg?: number;
  gewichtRoh?: string;
  preisAvailable: boolean;
  preisDublonen?: number;
  preisRoh?: string;
  notiz?: string;
  whkCraftSkill?: string;
  spezialisierung?: string;
}

export const PREISLISTE = preislisteJson as unknown as PreislisteRow[];
