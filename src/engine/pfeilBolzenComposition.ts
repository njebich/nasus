// Pfeil/Bolzen-Komposition: Basis-Munition (Kategorie "Normal"/"Rassen-Spezial"/"Spezial-
// Munition") + optionaler Spitzen-Modifikator (Kategorie "Spitzen-Modifikator"). Nutzer
// 2026-07-19: "mod ändert pfeil zu neuem mod-pfeil, mod nicht einzeln kaufbar" - der Modifikator
// ist also nie ein eigenstaendiger Kauf, sondern wird immer zusammen mit einer Basis-Munition zu
// einem einzigen Inventar-Eintrag komponiert (analog zu composeArmor/composeShield/composeWeapon).
//
// Fixschaden/RB/RW-Mod sind additive Deltas des Modifikators auf die Basis (Quelle: Pfeile/
// Bolzen-Sheets, siehe project-fk-waffen-erfassung memory - Spitzen-Modifikator-Zeilen haben
// eigene RB-/RW-Mod-Werte, keine Dopplung der Basis-Werte). 1.W kommt immer unveraendert von der
// Basis (kein Modifikator hat eine eigene Wuerfelnotation).
//
// BE (Beeintraechtigung-beim-Stecken) wird dagegen vom Modifikator ERSETZT statt addiert, sobald
// einer gewaehlt ist: die Spitze bestimmt, wie das Geschoss im Ziel steckt, nicht die alte Spitze
// UND die neue gleichzeitig. Diese eine Regel ist eine Annahme (nicht explizit vom Nutzer
// bestaetigt) - flagged, falls sich das als falsch herausstellt.
//
// Preis: Basis-Preis (aus generate_data_ts.py's parse_preis_dublonen_fz, inkl. FZ->D-Umrechnung
// 1D=1000FZ) + Modifikator-Preis (dort bereits als Delta erkannt ueber preisIstDelta, z.B. "+2D").
// Verfuegbarkeit: schlechterer (hoeherer) der beiden Werte gewinnt, falls beide gesetzt sind.

import type { FernkampfRow } from '../data/equipment/fernkampf';

function parseNum(raw: string | undefined): number {
  if (!raw) return 0;
  const n = Number(raw.replace(',', '.').replace(/m$/i, '').trim());
  return Number.isFinite(n) ? n : 0;
}

export interface ComposedMunition {
  wuerfel: string;
  fixschaden: number;
  rb: number;
  rwModMeter: number;
  be: number;
  /** null = Basis hat keinen parsebaren Preis (z.B. "nicht V."/"nichts") - nicht kaeuflich. */
  preisDublonen: number | null;
  verfuegbarkeitStufe?: number;
}

export function composeMunition(basis: FernkampfRow, modifikator: FernkampfRow | null): ComposedMunition {
  const wuerfel = basis['1.W'] ?? '';
  const fixschaden = parseNum(basis['Fixschaden']) + (modifikator ? parseNum(modifikator['Fixschaden']) : 0);
  const rb = parseNum(basis['RB']) + (modifikator ? parseNum(modifikator['RB']) : 0);
  const rwModMeter = parseNum(basis['RW-Mod']) + (modifikator ? parseNum(modifikator['RW-Mod']) : 0);
  const be = modifikator ? parseNum(modifikator['BE']) : parseNum(basis['BE']);

  const preisDublonen = basis.preisDublonen === undefined ? null : basis.preisDublonen + (modifikator?.preisDublonen ?? 0);

  const stufen = [basis.verfuegbarkeitStufe, modifikator?.verfuegbarkeitStufe].filter((s): s is number => s !== undefined);
  const verfuegbarkeitStufe = stufen.length > 0 ? Math.max(...stufen) : undefined;

  return { wuerfel, fixschaden, rb, rwModMeter, be, preisDublonen, verfuegbarkeitStufe };
}
