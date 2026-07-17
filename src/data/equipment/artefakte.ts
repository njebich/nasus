// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.

import artefakteJson from './artefakte.json';

export interface ArtefaktBasis {
  sourceRow: number;
  referenz: string;
  name?: string;
  beschreibung?: string;
  zaubergrad?: string;
  manaBasis?: string;
  vorbereitungszeitSec?: string;
  effektdauerSec?: string;
  wirkungsdauerBasis?: string;
  wirkungsdauerEinheit?: string;
  wirkungBasis?: string;
  wirkungEinheit?: string;
  eigenschaft?: string;
}
export interface ArtefaktKosten {
  sourceRow: number;
  referenz: string;
  name?: string;
  grad?: string;
  kostenEinmalig?: string;
  verfuegbarkeitEinmalig?: string;
  kostenPermanent?: string;
  verfuegbarkeitPermanent?: string;
}

export const ARTEFAKTE_RAW = artefakteJson as unknown as { basis: ArtefaktBasis[]; kosten: ArtefaktKosten[] };
export const ARTEFAKT_BASIS = ARTEFAKTE_RAW.basis;
export const ARTEFAKT_KOSTEN = ARTEFAKTE_RAW.kosten;
