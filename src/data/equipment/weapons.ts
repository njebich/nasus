// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.

import weaponsJson from './weapons.json';

export type GenericRow = Record<string, string> & { sourceRow: number; name: string };

export const WEAPONS_RAW = weaponsJson as unknown as { basis: GenericRow[]; material: GenericRow[]; fertigung: GenericRow[]; anpassung: GenericRow[]; schaftmaterial: GenericRow[] };
export const NK_WAFFEN_BASIS = WEAPONS_RAW.basis;
export const NK_MATERIAL = WEAPONS_RAW.material;
export const NK_FERTIGUNG = WEAPONS_RAW.fertigung;
export const NK_ANPASSUNG = WEAPONS_RAW.anpassung;
export const NK_SCHAFTMATERIAL = WEAPONS_RAW.schaftmaterial;
