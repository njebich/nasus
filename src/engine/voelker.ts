// Liste der 11 spielbaren Voelker (Quelle: Sheet "Voelker-Maxima"), genutzt fuer die
// Spezies-Auswahl (siehe main.ts/views/charakterheader.ts). NICHT generiert (anders als
// src/data/*) - die xlsx hat keine eigene "Volk"-Stammtabelle, das ist reine UI-Kuratierung.
export const VOELKER_NAMEN = [
  'Dalkini', 'Draw', 'Elfen', 'Gnome', 'Goblins', 'Indianer',
  'Katzen', 'Orks', 'Trolle', 'Zentauren', 'Zwerge',
] as const;
