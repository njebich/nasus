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

// Jede Probe mit Wert > 1 hat automatisch g1/m21 (Proben v2.0.md §2) - dieses Basisband ist
// kostenlos und kostet keine Pool-Punkte. gatMax/matMax (s.o.) sind Gesamt-Zielwerte, die dieses
// Basisband schon einschliessen, also darf nur (Max - Basis) tatsaechlich aus dem Pool bezahlt
// werden. Nutzer-Klarstellung 2026-07-20: das Basisband reduziert das Pool-Budget NICHT zusaetzlich
// - es kommt einfach obendrauf, ohne selbst etwas zu kosten.
export const GUT_BASIS = 1;
export const MEISTERLICH_BASIS = 21;

/** Wie viele rohe Pool-Punkte tatsaechlich in gAT/gPA gesteckt werden duerfen (Gesamt-Max minus
 *  kostenloser Basis 1). */
export function gutBudget(gutMax: number): number {
  return Math.max(0, gutMax - GUT_BASIS);
}

/** Wie viele rohe Pool-Punkte tatsaechlich in mAT/mPA gesteckt werden duerfen (Gesamt-Max minus
 *  kostenloser Basis 21). */
export function meisterlichBudget(meisterlichMax: number): number {
  return Math.max(0, meisterlichMax - MEISTERLICH_BASIS);
}

/** AT/PA-Balance-Regel pro Waffenzeile (Nutzer-Diktat 2026-07-23): auf die drei AT-Werte (nAT/gAT/
 *  mAT) darf max. 1 Pool-Punkt mehr verteilt werden als auf die drei PA-Werte (nPA/gPA/mPA) und
 *  umgekehrt. Die Regel ist aufgehoben, sobald EINE Seite ihr absolutes Maximum (n=20, g/m=ihr
 *  jeweiliger Gesamt-Ziel-Wert, typischerweise 20/10/26) erreicht hat - sonst koennte diese Seite
 *  gar keine weiteren Punkte mehr aufnehmen und die andere Seite waere fuer den Rest des Pools
 *  blockiert. Nutzer-bestaetigt: "eine Seite reicht", nicht enforced (kein Throw) - nur eine
 *  Anzeige-Warnung (siehe views/kampf.ts) und Ausschluss der Zeile aus dem Charakterbogen-Export. */
export function isPoolBalanceValid(
  atSpent: number, paSpent: number, atMaxed: boolean, paMaxed: boolean,
): boolean {
  if (atMaxed || paMaxed) return true;
  return Math.abs(atSpent - paSpent) <= 1;
}
