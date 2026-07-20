// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.

import kiBaumKantenJson from './kiBaumKanten.json';

export interface KiBaumKante {
  faehigkeit: string;
  vorbedingung: string;
  mindestTaw: number;
  sourceRow: number;
}

export const KI_BAUM_KANTEN = kiBaumKantenJson as unknown as KiBaumKante[];
