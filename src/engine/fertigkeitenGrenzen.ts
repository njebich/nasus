// Basis-Maximalwerte je Kategorie fuer Fertigkeiten/Attribute (Nutzer 2026-07-18, im Zuge der
// Talente-Wirkung-Analyse bestaetigt - vorher gab es hierfuer KEINE Regel, jede Kosten-Formel
// (z.B. "wert*9") war unbegrenzt). "Maximum"-Talente (siehe talenteMaximum.ts) erhoehen diesen
// Basiswert fuer einzelne Referenzen/Kategorien/Zauberschulen. Eigenschaften haben eine eigene,
// speziesabhaengige Regel (siehe eigenschaftenGrenzen.ts) und stehen bewusst NICHT hier.
const BASE_MAX_BY_KATEGORIE: Record<string, number> = {
  Grundfertigkeit: 12,
  Sonderfertigkeit: 12,
  Nahkampf: 24,
  Fernkampf: 24,
  WHK: 24,
  Spruchmagie: 24,
  Attribute: 7,
};

export function getFertigkeitBaseMax(kategorie: string): number | undefined {
  return BASE_MAX_BY_KATEGORIE[kategorie];
}
