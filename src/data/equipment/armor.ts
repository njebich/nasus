// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.

import armorJson from './armor.json';

export type GenericRow = Record<string, string> & { sourceRow: number; name: string };

export const ARMOR_RAW = armorJson as unknown as { basis: GenericRow[]; verarbeitung: GenericRow[]; anpassung: GenericRow[] };
export const RUESTUNG_BASIS = ARMOR_RAW.basis;
export const RUESTUNG_VERARBEITUNG = ARMOR_RAW.verarbeitung;
export const RUESTUNG_ANPASSUNG = ARMOR_RAW.anpassung;
