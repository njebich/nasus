// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.

import spruchmagieDetailsJson from './spruchmagieDetails.json';

export interface SpruchmagieDetail {
  minInt?: string;
  gegenprobe?: string;
  rw?: string;
  ziel?: string;
  form?: string;
  zauberArt?: string;
  aufrechterhaltung?: string;
  vorbereitungszeit?: string;
  einwirkdauer?: string;
  wirkungsdauer?: string;
  stufe1?: string;
  stufe2?: string;
  stufe3?: string;
  mana?: string;
}

export const SPRUCHMAGIE_DETAILS = spruchmagieDetailsJson as unknown as Record<string, SpruchmagieDetail>;
