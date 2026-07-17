// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.

import verfuegbarkeitJson from './verfuegbarkeit.json';

export interface MarktModifikatorRow { kategorie?: string; auspraegung?: string; faktor?: string; }
export interface VerfuegbarkeitLegendeRow { wert?: string; bedeutung?: string; wuerfelwurf?: string; }

export const VERFUEGBARKEIT_RAW = verfuegbarkeitJson as unknown as { markt: MarktModifikatorRow[]; legende: VerfuegbarkeitLegendeRow[] };
export const MARKT_MODIFIKATOR = VERFUEGBARKEIT_RAW.markt;
export const VERFUEGBARKEIT_LEGENDE = VERFUEGBARKEIT_RAW.legende;
