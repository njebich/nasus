// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.

import fernkampfJson from './fernkampf.json';

export type GenericRow = Record<string, string> & { sourceRow: number; name: string };
export type FernkampfRow = Record<string, string> & { sourceRow: number; name: string; preisDublonen?: number; preisIstDelta?: boolean; verfuegbarkeitStufe?: number };

export const FERNKAMPF_RAW = fernkampfJson as unknown as { boegen: FernkampfRow[]; armbrust: FernkampfRow[]; pfeile: FernkampfRow[]; bolzen: FernkampfRow[]; feuerwaffenMunition: GenericRow[]; feuerwaffen: FernkampfRow[]; feuerwaffenRessourcen: GenericRow[]; feuerwaffenWuerfel: { index: number; wuerfel: string }[]; feuerwaffenVerfuegbarkeit: { rawAb: number; stufe: number }[] };
export const BOEGEN = FERNKAMPF_RAW.boegen;
export const ARMBRUST = FERNKAMPF_RAW.armbrust;
export const PFEILE = FERNKAMPF_RAW.pfeile;
export const BOLZEN = FERNKAMPF_RAW.bolzen;
export const FEUERWAFFEN_MUNITION = FERNKAMPF_RAW.feuerwaffenMunition;
export const FEUERWAFFEN = FERNKAMPF_RAW.feuerwaffen;
export const FEUERWAFFEN_RESSOURCEN = FERNKAMPF_RAW.feuerwaffenRessourcen;
export const FEUERWAFFEN_WUERFEL = FERNKAMPF_RAW.feuerwaffenWuerfel;
export const FEUERWAFFEN_VERFUEGBARKEIT = FERNKAMPF_RAW.feuerwaffenVerfuegbarkeit;
