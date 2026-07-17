// Benannte Stufen fuer die ssk_sprache_*/ssk_kultur_*/ssk_schrift_*-Familie (Sprache-Schrift-
// Kultur), damit die App nicht nur die rohe Zahl 0-4 zeigt (Nutzer 2026-07-17: "es fehlt das
// Skilllevel"). Reihenfolge/Namen aus "NN Sprachen 0.11.docx" (Sprachstufe- bzw. Kulturstufe-
// Tabelle) - siehe scripts/add_sprache_kultur_regeln.py fuer die zugehoerigen EP-Kosten.
// Seit werte 0.8 nutzt auch ssk_schrift_* die Sprachstufe-Kosten-Tabelle (vorher generische
// WHK-Kurve, offener Punkt - jetzt vom Nutzer entschieden), daher gilt SPRACHSTUFE_NAMEN
// dafuer ebenfalls.

const SPRACHSTUFE_NAMEN = ['Keine Kenntnis', 'Grundkenntnis', 'Gute Kenntnis', 'Muttersprache', 'Akademisches Niveau'];
const KULTURSTUFE_NAMEN = ['Keine Kenntnis', 'Grundkenntnis', 'Gute Kenntnis', 'Vaterland', 'Akademisches Niveau'];

/** Gibt die benannte Stufe fuer einen ssk_sprache_.../ssk_schrift_.../ssk_kultur_...-Wert
 *  zurueck, oder undefined fuer alles andere. */
export function describeSkillStufe(referenz: string, wert: number): string | undefined {
  if (referenz.startsWith('ssk_sprache_') || referenz.startsWith('ssk_schrift_')) return SPRACHSTUFE_NAMEN[wert];
  if (referenz.startsWith('ssk_kultur_')) return KULTURSTUFE_NAMEN[wert];
  return undefined;
}
