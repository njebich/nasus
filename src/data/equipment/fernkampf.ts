// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.

import fernkampfJson from './fernkampf.json';

export type GenericRow = Record<string, string> & { sourceRow: number; name: string };
export type FernkampfRow = Record<string, string> & { sourceRow: number; name: string; preisDublonen?: number; preisIstDelta?: boolean; verfuegbarkeitStufe?: number };

export const FERNKAMPF_RAW = fernkampfJson as unknown as { boegen: FernkampfRow[]; armbrust: FernkampfRow[]; pfeile: FernkampfRow[]; bolzen: FernkampfRow[]; feuerwaffenMunition: GenericRow[] };
export const BOEGEN = FERNKAMPF_RAW.boegen;
export const ARMBRUST = FERNKAMPF_RAW.armbrust;
export const PFEILE = FERNKAMPF_RAW.pfeile;
export const BOLZEN = FERNKAMPF_RAW.bolzen;
export const FEUERWAFFEN_MUNITION = FERNKAMPF_RAW.feuerwaffenMunition;
