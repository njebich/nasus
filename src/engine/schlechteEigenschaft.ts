// Nachteil "Schlechte Eigenschaft: X" (Nutzer 2026-07-24, werte 0.8 Zeilen 97-106,
// vn_schlechte_eigenschaft_<x>): X ist auf ein festes, von der Spezies unabhaengiges Maximum
// gedeckelt (Erstellungs-Max 7, ab Kreis 3 dann 9) - das ERSETZT die normale Voelker-Maxima-
// Tabelle fuer diese Eigenschaft komplett (siehe eigenschaftenGrenzen.ts), statt mit ihr
// kombiniert (MIN()) zu werden. "Grundsaetzlich nicht uebersteigerbar" heisst: kein Maximum-
// Talent (talenteMaximum.ts) und kein Eigenschafts-/Attributs-Artefakt (artefaktBonus.ts) darf
// diesen Deckel anheben - beide Aufrufstellen fragen hasSchlechteEigenschaft() ab, bevor sie
// ihren jeweiligen Bonus anwenden.

import { RULES } from '../data/rules';
import { normalizeForMatch } from './normalize';
import type { CharacterState } from '../state/characterStore';

const PREFIX = 'vn_schlechte_eigenschaft_';
const ERSTELLUNGS_MAX = 7;
const MAX_AB_KREIS_3 = 9;

/** vn_schlechte_eigenschaft_<x> -> eig_*<x>, aufgeloest ueber den Anzeigenamen nach dem ":" in
 *  der Beschreibung ("Schlechte Eigenschaft: Ausstrahlung" -> "Ausstrahlung") - die Eigenschaft-
 *  Referenzen selbst tragen keinen einheitlichen Namens-Suffix (z.B. "eig_g_sinneschaerfe" ohne
 *  das zweite "s" aus "Sinnesschaerfe"), daher kein direktes String-Anhaengen moeglich. Gleiches
 *  Aufloesungs-Muster wie ARTEFAKT_ZIEL_REFERENZ in artefaktBonus.ts. */
function buildZielReferenzMap(): Map<string, string> {
  const eigenschaftReferenzByName = new Map<string, string>();
  for (const rule of RULES) {
    if (rule.kategorie === 'Eigenschaft' && rule.beschreibung) {
      eigenschaftReferenzByName.set(normalizeForMatch(rule.beschreibung), rule.referenz);
    }
  }
  const map = new Map<string, string>();
  for (const rule of RULES) {
    if (!rule.referenz.toLowerCase().startsWith(PREFIX) || !rule.beschreibung) continue;
    const name = rule.beschreibung.split(':')[1]?.trim();
    const ziel = name && eigenschaftReferenzByName.get(normalizeForMatch(name));
    if (ziel) map.set(rule.referenz.toLowerCase(), ziel);
  }
  return map;
}

const NACHTEIL_ZU_ZIEL = buildZielReferenzMap();
const ZIEL_ZU_NACHTEIL = new Map([...NACHTEIL_ZU_ZIEL.entries()].map(([nachteil, ziel]) => [ziel, nachteil]));

/** Eigenschafts-Referenz (z.B. "eig_k_ausstrahlung"), auf die sich ein "Schlechte Eigenschaft"-
 *  Nachteil (z.B. "vn_schlechte_eigenschaft_ausstrahlung") bezieht, oder undefined. */
export function getSchlechteEigenschaftZielReferenz(nachteilReferenz: string): string | undefined {
  return NACHTEIL_ZU_ZIEL.get(nachteilReferenz.toLowerCase());
}

/** true, wenn der Charakter genau fuer diese Eigenschaft "Schlechte Eigenschaft: X" gewaehlt hat. */
export function hasSchlechteEigenschaft(character: CharacterState, eigenschaftReferenz: string): boolean {
  const nachteilReferenz = ZIEL_ZU_NACHTEIL.get(eigenschaftReferenz.toLowerCase());
  return !!nachteilReferenz && (character.selections[nachteilReferenz] ?? 0) > 0;
}

/** Festes Maximum (ersetzt die Voelker-Maxima-Tabelle komplett), das der Nachteil vorschreibt. */
export function getSchlechteEigenschaftMax(kreis: number): number {
  return kreis >= 3 ? MAX_AB_KREIS_3 : ERSTELLUNGS_MAX;
}
