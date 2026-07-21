// GENERIERT von scripts/extract_psi_zaubertabelle.py - nicht von Hand bearbeiten.

import psiZaubertabelleJson from './psiZaubertabelle.json';

export interface PsiZaubertabelleEintrag {
  st1: string; st2: string; st3: string; st4: string; st5: string; st6: string; st7: string;
  rw: string; wd: string; ed: string; mpz: string; wirkung: string;
}

export const PSI_ZAUBERTABELLE = psiZaubertabelleJson as unknown as Record<string, PsiZaubertabelleEintrag>;
