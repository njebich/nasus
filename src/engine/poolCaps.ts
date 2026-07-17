// Deckelungs-Formeln fuer die gAT/gPA/mAT/mPA-Zuteilung aus einem Nahkampf-Pool.
// Bestaetigt mit Nutzer: gAT-max = AUFRUNDEN(nAT/2), mAT-max = 21+AUFRUNDEN((gAT-max-1)/2),
// analog fuer PA-Seite mit nPA. Spezialisierungs-Pools (z.B. nk_pool_hiebwaffen_aexte) nutzen
// DIESELBE Basis-Waffenart wie ihr Eltern-Pool fuer die Deckelung (Spezialisierungspunkte
// erhoehen nur das Pool-BUDGET, nicht den Deckel - bestaetigt mit Nutzer).

const NK_BASE_WEAPON_TYPES = ['hiebwaffen', 'klingenwaffen', 'stangenwaffen', 'stichwaffen', 'unbewaffnet'];

export interface PoolCapBasis {
  atReferenz: string;
  paReferenz: string;
}

/** Leitet aus einem Pool-Referenznamen (z.B. "nk_pool_hiebwaffen_aexte") die zugrundeliegende
 *  Basis-Waffenart-Referenz fuer at_X/pa_X ab. `null` wenn kein bekanntes Muster passt
 *  (z.B. "le_leberschutz" - kein Waffen-Pool). */
export function getPoolCapBasis(poolReferenz: string): PoolCapBasis | null {
  const key = poolReferenz.toLowerCase();
  const prefix = 'nk_pool_';
  if (!key.startsWith(prefix)) return null;
  const rest = key.slice(prefix.length);
  const baseType = NK_BASE_WEAPON_TYPES.find((t) => rest === t || rest.startsWith(`${t}_`));
  if (!baseType) return null;
  return { atReferenz: `at_${baseType}`, paReferenz: `pa_${baseType}` };
}

export function computeGutMax(basisWert: number): number {
  return Math.ceil(basisWert / 2);
}

export function computeMeisterlichMax(gutMax: number): number {
  return 21 + Math.ceil((gutMax - 1) / 2);
}
