// Kompensiert jede Art von Layout-Verschiebung, die main.ts's kompletter Rerender bei jedem
// +/- Klick ausloest (Zeilen-Umsortierung nach gelernt/freigeschaltet/gesperrt-Gruppen wie in
// psi.ts/ki.ts's buildRows, neu erscheinende/verschwindende Abschnitte wie Ladeschuetze- oder
// "Berechnete Werte"-Bloecke, oder schlicht das Zuruecksetzen von .kampf-table-scroll auf
// scrollTop=0 beim Neuaufbau): ohne dies "wandert" die geklickte Zeile unter dem Mauszeiger weg
// und Folgeklicks treffen die falsche Zeile/den falschen Button (Nutzer 2026-07-24, ausdruecklich
// app-weit gemeldet, nicht nur PSI/KI).
//
// Ein echtes Bewegen des System-Mauszeigers ist von einer Webseite aus nicht moeglich - Browser
// geben JS bewusst keinen Zugriff auf die OS-Cursorposition. Diese Funktion loest das Problem
// stattdessen von der anderen Seite: sie haelt die geklickte Stelle unter dem (unbewegten) Cursor,
// indem sie den Scroll-Container um genau die Distanz nachfuehrt, die die Zeile durch den Rerender
// verschoben hat.
//
// document.querySelector statt eines Container-Parameters, weil main.ts's render() den kompletten
// app-Baum neu aufbaut - ein zuvor uebergebenes Element ist danach ein losgeloester Knoten;
// document selbst bleibt stabil. `selector` muss daher eindeutig genug sein, um dieselbe
// (semantische) Zeile vor und nach dem Rerender zu treffen - i.d.R. ein Attribut-Selektor auf
// data-referenz (siehe callsites).
export function withScrollAnchor(selector: string, action: () => void): void {
  const before = document.querySelector<HTMLElement>(selector);
  const beforeTop = before?.getBoundingClientRect().top;

  action();

  if (beforeTop === undefined) return;
  const after = document.querySelector<HTMLElement>(selector);
  if (!after) return;
  const delta = after.getBoundingClientRect().top - beforeTop;
  if (Math.abs(delta) < 1) return;

  const scrollParent = after.closest<HTMLElement>('.kampf-table-scroll');
  if (scrollParent) {
    scrollParent.scrollTop += delta;
  } else {
    window.scrollBy(0, delta);
  }
}
