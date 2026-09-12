// Koerperbau-/Groessengruppen je Volk (Nutzer 2026-09-12, Freitext-Gruppierung): "eine
// Zwergenplatte passt einem Troll nicht, koennte aber einem Goblin passen" - eine von der
// Herstellerherkunft (Spec-Punkt 20/28/30, siehe verfuegbarkeitOrt.ts) unabhaengige Frage, ob eine
// Ruestung koerperlich passt. Zentauren sind gespalten: der Oberkoerper (Kopf/Torso/Arme) zaehlt
// zur Dalkini-Gruppe, die Beine (Pferdekoerper) sind eine eigene sechste Gruppe.
//
// Reine Datenvorbereitung: es gibt in dieser App aktuell KEINE Weitergabe von Ausruestung zwischen
// Charakteren (jeder Charakter kauft nur fuer sich selbst) - deshalb bewusst OHNE jede
// Kompatibilitaets-/Passform-Pruefung oder Kaufsperre, nur der Tag am ausgeruesteten Teil. Sobald
// eine Weitergabe-Funktion entsteht, klaeren wir dann Kompatibilitaetsmatrix und Konsequenzen bei
// Fehlpassung (Nutzer 2026-09-12: "wir spezifizieren das, wenn eine Weitergabe-Funktion ansteht").
import type { RsGruppe } from '../data/trefferzonen';
import type { Volk } from '../data/orte';

export type Koerperbaugruppe =
  | 'Gnome' | 'Goblins/Zwerge' | 'Dalkini/Indianer/Elfen/Draw/Katzen' | 'Orks' | 'Trolle' | 'Zentauren-Beine';

const VOLK_KOERPERBAUGRUPPE: Partial<Record<Volk, Koerperbaugruppe>> = {
  Gnome: 'Gnome',
  Goblins: 'Goblins/Zwerge', Zwerge: 'Goblins/Zwerge',
  Dalkini: 'Dalkini/Indianer/Elfen/Draw/Katzen', Indianer: 'Dalkini/Indianer/Elfen/Draw/Katzen',
  Elfen: 'Dalkini/Indianer/Elfen/Draw/Katzen', Draw: 'Dalkini/Indianer/Elfen/Draw/Katzen',
  Katzen: 'Dalkini/Indianer/Elfen/Draw/Katzen',
  Orks: 'Orks',
  Trolle: 'Trolle',
  // Oberkoerper-Default - fuer Lage-Slots der Beine-Gruppe siehe die `gruppe`-Sonderbehandlung
  // unten. "Mensch" (Sammelbegriff fuer vernunftbegabte Rassen, kein eigenes Volk in VOELKER_NAMEN,
  // Nutzer 2026-09-12) bleibt hier bewusst ohne Eintrag (= keine Gruppe zugewiesen).
  Zentauren: 'Dalkini/Indianer/Elfen/Draw/Katzen',
};

/** `gruppe` (TZ-Gruppe des Ruestungsslots) wird nur fuer Zentauren gebraucht, um Ober- von
 *  Unterkoerper zu unterscheiden - fuer alle anderen Voelker ist die Koerperbaugruppe zonenweise
 *  identisch. Unbekannte/nicht zugewiesene Spezies (z.B. leeres `spezies`) ergeben `undefined`. */
export function koerperbaugruppeFuer(spezies: string, gruppe?: RsGruppe): Koerperbaugruppe | undefined {
  if (spezies === 'Zentauren' && gruppe === 'beine') return 'Zentauren-Beine';
  return VOLK_KOERPERBAUGRUPPE[spezies as Volk];
}
