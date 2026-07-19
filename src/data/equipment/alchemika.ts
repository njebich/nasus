// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.

import alchemikaJson from './alchemika.json';

export interface AlchemikaRow {
  sourceRow: number;
  kategorie: string;
  name: string;
  magisch: boolean;
  wirkung: string;
  beschreibung: string;
  legalitaet?: number;
  verfuegbarkeitStufe?: number;
  preisAvailable: boolean;
  preisDublonen?: number;
  preisRoh?: string;
}

export const ALCHEMIKA = alchemikaJson as unknown as AlchemikaRow[];
