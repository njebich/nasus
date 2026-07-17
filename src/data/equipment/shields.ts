// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.

import shieldsJson from './shields.json';

export type GenericRow = Record<string, string> & { sourceRow: number; name: string };

export const SHIELDS_RAW = shieldsJson as unknown as { material: GenericRow[]; fertigung: GenericRow[]; bespannung: GenericRow[] };
export const SCHILD_MATERIAL = SHIELDS_RAW.material;
export const SCHILD_FERTIGUNG = SHIELDS_RAW.fertigung;
export const SCHILD_BESPANNUNG = SHIELDS_RAW.bespannung;
