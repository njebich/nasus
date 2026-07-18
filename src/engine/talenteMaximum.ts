// Ermittelt die Talent-Maximum-Boni (data/talenteMaximum.ts), die auf eine bestimmte Referenz
// wirken - fuer EINE Zielreferenz direkt, fuer eine ganze Zielkategorie (z.B. "alle
// Grundfertigkeiten") oder fuer alle Referenzen mit einem gemeinsamen Praefix (z.B. eine
// Zauberschule). Nutzer 2026-07-18 (zweite Runde, nach Rueckfrage zu Mana-Regeneration-Stufen):
// "nur die höchste Stufe zählt, auch bei Alchemieresistenz" - gilt durchgaengig, auch fuer
// Zauberschulmaximum (Magus/Grossmagus/Erzmagus: die gespeicherten Werte 6/12/18 sind bereits
// KUMULATIVE Totalwerte je Stufe, kein Stufen-Einzelbetrag, "jede Stufe erhoeht das Max um +6"
// UND "nur hoechste zaehlt" ergeben denselben Wert) und fuer Zaeher Bursche (separater additiver
// Modifikator-Mechanismus, siehe talenteModifikator.ts - hier ebenfalls bestaetigt). Gruppierung
// zum Max-Bilden erfolgt ueber das exakte Ziel (zielReferenz/zielKategorie/zielPraefix), NICHT
// ueber den Talent-Referenz-Namen (dessen "_stufe_N"-Suffix uneinheitlich ist - z.B.
// "..._stufe1" ohne Unterstrich bei Vorderlader Ladeschuetze, oder mitten im Namen bei den
// Magus-Zeilen). Verifiziert (Skript-Check 2026-07-18): kein Ziel in den aktuellen 109 Eintraegen
// wird von zwei genuin unterschiedlichen Talent-Familien getroffen - jede Ueberschneidung ist
// eine echte Stufe desselben Talents. Saehe das je anders aus, wuerden unterschiedliche
// Familien mit gleichem Ziel faelschlich gemaxt statt addiert.
import { TALENT_MAXIMUM_BONUSES } from '../data/talenteMaximum';
import type { CharacterState } from '../state/characterStore';

export function getTalentMaximumBonus(character: CharacterState, referenz: string, kategorie: string): number {
  const matching = TALENT_MAXIMUM_BONUSES
    .filter((b) => (character.selections[b.talentReferenz.toLowerCase()] ?? 0) > 0)
    .filter((b) => {
      if (b.zielReferenz) return b.zielReferenz === referenz;
      if (b.zielKategorie) return b.zielKategorie === kategorie;
      if (b.zielPraefix) return referenz.startsWith(b.zielPraefix);
      return false;
    });

  const maxByZiel = new Map<string, number>();
  for (const b of matching) {
    const zielKey = b.zielReferenz ?? b.zielKategorie ?? b.zielPraefix ?? '';
    maxByZiel.set(zielKey, Math.max(maxByZiel.get(zielKey) ?? 0, b.bonus));
  }
  return [...maxByZiel.values()].reduce((sum, v) => sum + v, 0);
}
