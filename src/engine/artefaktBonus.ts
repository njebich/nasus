// Eigenschafts-/Attributs-Artefakte (Nutzer-Regel 2026-07-19): sobald ein
// artefakt_eigenschafts_artefakt_*/artefakt_attributs_artefakt_* im Inventar liegt, ist es
// "immer aktiv" und erhoeht die Ziel-Eigenschaft/das Ziel-Attribut dauerhaft. Bonus = der
// gekaufte Grad (1-7, z.B. Grad 3 -> +3) - es gibt keine eigene Wirkung-Einheit-Spalte fuer
// diese beiden Artefakt-Familien in der xlsx (im Unterschied zu den befristeten "X erhoehen"-
// Zaubern, die eine echte Wirkung-Einheit haben). Nur der hoechste gekaufte Grad je
// Ziel-Referenz zaehlt (gleiche "kein Stacking"-Regel wie Talente, siehe talenteMaximum.ts/
// talenteModifikator.ts) - mehrfacher Kauf desselben oder mehrerer Grade desselben Artefakts
// addiert sich nicht.
//
// Bewusst KEIN separat gespeicherter "aktiv"-Zustand: der Bonus wird rein aus dem Inventar
// (character.equipment) hergeleitet, nicht persistiert. Ein kuenftiger Deaktivierungs-Effekt
// (z.B. Anti-Magie-Zone) kann spaeter einfach hier zusaetzlich gefiltert werden, ohne dass ein
// bestehendes CharacterState-Feld migriert werden muesste.
import { ARTEFAKT_BASIS, ARTEFAKT_KOSTEN } from '../data/equipment/artefakte';
import { RULES } from '../data/rules';
import { normalizeForMatch } from './normalize';
import type { CharacterState } from '../state/characterStore';

const EIGENSCHAFTS_ARTEFAKT_PREFIX = 'artefakt_eigenschafts_artefakt_';
const ATTRIBUTS_ARTEFAKT_PREFIX = 'artefakt_attributs_artefakt_';

/** Artefakt-Basis-Referenz (z.B. "artefakt_eigenschafts_artefakt_athletik") -> Ziel-Referenz
 *  im Werte-Sheet ("eig_k_athletik"). Attributs-Artefakte tragen ihre Ziel-Referenz bereits
 *  direkt im "eigenschaft"-Feld (z.B. "att_aura"); Eigenschafts-Artefakte tragen dort nur den
 *  deutschen Anzeigenamen ("Athletik") und muessen ueber die Beschreibung der echten
 *  Eigenschaft-Regel (gleiche fuzzy Normalisierung wie hierarchy.ts/findParentRule) aufgeloest
 *  werden. */
function buildZielReferenzMap(): Map<string, string> {
  const eigenschaftReferenzByName = new Map<string, string>();
  for (const rule of RULES) {
    if (rule.kategorie === 'Eigenschaft' && rule.beschreibung) {
      eigenschaftReferenzByName.set(normalizeForMatch(rule.beschreibung), rule.referenz);
    }
  }
  const map = new Map<string, string>();
  for (const basis of ARTEFAKT_BASIS) {
    if (basis.referenz.startsWith(EIGENSCHAFTS_ARTEFAKT_PREFIX)) {
      const ziel = basis.eigenschaft && eigenschaftReferenzByName.get(normalizeForMatch(basis.eigenschaft));
      if (ziel) map.set(basis.referenz, ziel);
    } else if (basis.referenz.startsWith(ATTRIBUTS_ARTEFAKT_PREFIX)) {
      if (basis.eigenschaft) map.set(basis.referenz, basis.eigenschaft);
    }
  }
  return map;
}

const ARTEFAKT_ZIEL_REFERENZ = buildZielReferenzMap();

/** Grad (1-7) eines Eigenschafts-/Attributs-Artefakt-Kosten-Eintrags, oder undefined wenn er
 *  gar keinem der beiden gehoert oder seine Ziel-Referenz nicht aufgeloest werden konnte. */
function ownedGradFor(entry: CharacterState['equipment'][number], zielReferenz: string): number | undefined {
  if (entry.family !== 'artefakt') return undefined;
  const kostenRow = ARTEFAKT_KOSTEN.find((r) => String(r.sourceRow) === entry.baseId);
  if (!kostenRow) return undefined;
  if (ARTEFAKT_ZIEL_REFERENZ.get(kostenRow.referenz) !== zielReferenz) return undefined;
  const grad = Number(kostenRow.grad);
  return Number.isFinite(grad) ? grad : undefined;
}

/** Dauerhafter Artefakt-Bonus auf eine Eigenschaft/ein Attribut (0 = kein passendes Artefakt
 *  im Inventar). Wird sowohl fuer die Formel-Auswertung (jede Formel, die die Ziel-Referenz
 *  als Variable nutzt, siehe rules.ts) als auch fuer die "Basiswert (veraendert)"-Anzeige
 *  (characterSheet.ts) verwendet - EXPLIZIT NICHT fuer die SP-Kosten-Berechnung, die immer mit
 *  dem unveraenderten Basiswert rechnet (evalKostenFor bindet "wert"/"grad" direkt an den
 *  gekauften Punktestand, ohne getWert()/diesen Bonus zu durchlaufen). */
export function getArtefaktBonus(character: CharacterState, zielReferenz: string): number {
  let maxGrad = 0;
  for (const entry of character.equipment) {
    const grad = ownedGradFor(entry, zielReferenz);
    if (grad !== undefined && grad > maxGrad) maxGrad = grad;
  }
  return maxGrad;
}
