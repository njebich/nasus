// Kostenformeln fuer frei benannte WHK-Hauptfertigkeiten/-Spezialisierungen (Punkt 4a/4b) -
// identische Formeln wie ihre festen Geschwister in whk.jsonl, hier direkt nachgebaut, weil
// Freitext-Eintraege (CustomWhkEintrag in characterStore.ts) keine eigene RuleEntry haben, die
// evalKostenFor auswerten koennte.

import { sverweis } from './functions';
import { LOOKUP_TABLES } from '../data/lookups';

/** Kumulierte SP-Gesamtkosten einer WHK-Hauptfertigkeit bei "wert" - gleiche Formel wie z.B.
 *  whk_kaufmann/whk_abrichten: "WENN(wert=0;0;10+(wert-1)*wert/2)". */
export function getWhkHauptfertigkeitKosten(wert: number): number {
  return wert <= 0 ? 0 : 10 + ((wert - 1) * wert) / 2;
}

/** Kumulierte SP-Gesamtkosten einer WHK-Spezialisierung bei "wert" - gleiche Lookup-Tabelle wie
 *  die festen WHK-Spezialisierungen: "SVERWEIS(wert;'WHK-Spez-Kosten';3;1)" (Excel-Flag 1 = im
 *  Evaluator invertiert, siehe evaluator.ts -> exact=false/naechst-kleinerer Schluessel). */
export function getWhkSpezialisierungKosten(wert: number): number {
  if (wert <= 0) return 0;
  return sverweis(wert, LOOKUP_TABLES['WHK-Spez-Kosten'], 3, false);
}
