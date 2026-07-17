// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.

import weaponsJson from './weapons.json';

export type GenericRow = Record<string, string> & { sourceRow: number; name: string };

export const WEAPONS_RAW = weaponsJson as unknown as { basis: GenericRow[] };
export const NK_WAFFEN_BASIS = WEAPONS_RAW.basis;
