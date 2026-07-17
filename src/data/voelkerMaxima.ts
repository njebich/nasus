// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.

import voelkerMaximaJson from './voelkerMaxima.json';

export interface VoelkerMaximaRow {
  volk: string;
  eigenschaft: string;
  erstellungsMin: number;
  erstellungsMax: number;
  maxAbKreis3: number;
  sourceRow: number;
}

export const VOELKER_MAXIMA = voelkerMaximaJson as unknown as VoelkerMaximaRow[];
