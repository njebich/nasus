// GENERIERT von scripts/extract_psi_zaubertabelle.py - nicht von Hand bearbeiten.

import psiZaubertabelleJson from './psiZaubertabelle.json';

export interface PsiZauberstufe {
  erschwerung: string;
  mbs: string;
  wirkung: string;
}

export interface PsiZaubertabelleEintrag {
  regeltext: string;
  aurabann: string;
  ziel: string;
  eig: string;
  rw: string;
  vd: string;
  ed: string;
  wirkungsdauer: string;
  erholungszeit: string;
  mpz: string;
  stufen: PsiZauberstufe[];
}

export const PSI_ZAUBERTABELLE = psiZaubertabelleJson as unknown as Record<string, PsiZaubertabelleEintrag>;
