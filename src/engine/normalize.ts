// Reine String-Normalisierung, bewusst abhaengigkeitsfrei (wird sowohl von hierarchy.ts als
// auch von rules.ts gebraucht - ein gemeinsames Modul ohne Imports vermeidet einen Zyklus).

/** Normalisiert Referenz/Beschreibung/Parent zum Abgleich - faltet Umlaute, ignoriert
 *  Gross-/Kleinschreibung- und Trennzeichen-Unterschiede (die Parent-Spalte ist je Kategorie
 *  uneinheitlich befuellt: mal Referenz, mal Beschreibung, mal beides mit Tippfehlern -
 *  siehe Fernkampf "fk_Blasrohre"). */
export function normalizeForMatch(s: string): string {
  return s.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '');
}
