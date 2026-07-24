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
  element?: string;
  wirkungsstufeOffset?: string;
  zusatzwertArt?: string;
  schadenselement?: string;
  namenspraefix?: string;
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
export interface ArtefaktWirkungsstufe {
  wirkungsstufe: string;
  schadenswuerfel?: string;
  rb?: string;
  sb?: string;
}

export const ARTEFAKTE_RAW = artefakteJson as unknown as { basis: ArtefaktBasis[]; kosten: ArtefaktKosten[]; wirkungsstufen: ArtefaktWirkungsstufe[] };
export const ARTEFAKT_BASIS = ARTEFAKTE_RAW.basis;
export const ARTEFAKT_KOSTEN = ARTEFAKTE_RAW.kosten;
export const ARTEFAKT_WIRKUNGSSTUFEN = ARTEFAKTE_RAW.wirkungsstufen;
