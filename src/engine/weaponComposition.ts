// Waffen-Komposition: Basis (NK-Waffen-Basis, Spezialisierung != Schild) x Material x Fertigung x
// Anpassung x Schaftmaterial (Regel Nutzer 2026-07-18: "fang an damit, die nk-waffen inkl.
// herstellungs-modifikatoren zu implementieren"). Analog zu composeArmor/composeShield.
//
// Preis-Formel (kein Entwickeln-Beispiel wie bei Ruestung vorhanden, daher per Namenskonvention
// hergeleitet: "-Faktor"-Spalten sind multiplikativ, blosse "Preis"-Spalten additiv - dieselbe
// Konvention, die bei Ruestung/Schild bereits verifiziert ist): Materialpreis-Faktor(Basis) ×
// Preis(Material) + Preis(Fertigung) + Preis(Anpassung) + Preis/m(Schaftmaterial) × Laenge-m(Basis).
// Materialpreis-Faktor fehlt oder ist "x" bei allen unbewaffneten Kampfstilen (Ringen/Boxen/Biss-
// Huftritt/...) und bei Ruestungsmodifikatoren (Totschlaeger etc.) - dort ist kein Material/keine
// Fertigung kaeuflich, Preis bleibt null (analog zum Drachensch.-Preis bei Schilden).
//
// Min-Staerke: Basis hat sowohl Min-Staerke-1H-Basis als auch Min-Staerke-2H-Basis (anders als
// urspruenglich angenommen - 2H ist also vollstaendig komponierbar, kein Deferral noetig).
// 1H wird nur vom Material-Faktor skaliert; Anpassung/Schaftmaterial wirken laut Datenspalten
// ausschliesslich additiv auf die 2H-Variante ("Min.Stä. 2H", kein 1H-Gegenstueck vorhanden).
//
// Rezept-Mod bleibt reine Anzeige ohne Spielmechanik (siehe Entwickeln-Notiz zu Schild-Rezept-Mod:
// korreliert kaum mit Preis, "bleibt offen bis Spielleitung entscheidet").

import type { GenericRow } from '../data/equipment/armor';

function num(row: GenericRow | undefined, header: string): number {
  if (!row) return 0;
  const raw = row[header];
  if (raw === undefined) return 0;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function numOrNull(row: GenericRow | undefined, header: string): number | null {
  if (!row) return null;
  const raw = row[header];
  if (raw === undefined) return null;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export interface ComposedWeapon {
  at: number;
  pa: number;
  wk: number;
  staerkeMalus: number;
  minStaerke1H: number;
  minStaerke2H: number;
  klingenbrecher: number;
  klingenschutz: number;
  /** Reine Anzeige, keine Spielmechanik (siehe Datei-Kommentar). */
  rezeptMod: number;
  /** null = nicht automatisch bepreisbar (unbewaffnete Kampfstile / Ruestungsmodifikatoren ohne
   *  eigenes Material-Preisfaktor, siehe Datei-Kommentar). */
  preis: number | null;
}

export function composeWeapon(
  basis: GenericRow, material: GenericRow, fertigung: GenericRow, anpassung: GenericRow, schaftmaterial: GenericRow,
): ComposedWeapon {
  const at = num(basis, 'AT-Basis') + num(material, 'AT-') + num(anpassung, 'AT-') + num(schaftmaterial, 'AT-');
  const pa = num(basis, 'PA-Basis') + num(material, 'PA-') + num(anpassung, 'PA-') + num(schaftmaterial, 'PA-');
  const wk = num(basis, 'WK-Basis') + num(material, 'WK');
  const staerkeMalus = num(basis, 'Staerke-Malus-Basis') + num(material, 'Stä-Malus');

  const minStaerke1H = num(basis, 'Min-Staerke-1H-Basis') * (numOrNull(material, '1H min.Stä') ?? 1);
  const minStaerke2H = num(basis, 'Min-Staerke-2H-Basis') * (numOrNull(material, '2H min.Stä') ?? 1)
    + num(anpassung, 'Min.Stä. 2H') + num(schaftmaterial, 'Min.Stä. 2H');

  const klingenbrecher = num(basis, 'Klingenbrecher-Basis') + num(material, 'Klingen-Brecher') + num(fertigung, 'Klingen Brecher');
  const klingenschutz = num(basis, 'Klingenschutz-Basis') + num(material, 'Klingen-Schutz')
    + num(fertigung, 'Klingen Schutz') + num(schaftmaterial, 'Klingen Schutz');

  const rezeptMod = num(basis, 'Rezept-Mod-Basis') + num(material, 'Rezept-Mod');

  const materialpreisFaktor = numOrNull(basis, 'Materialpreis-Faktor');
  const preis = materialpreisFaktor === null
    ? null
    : materialpreisFaktor * num(material, 'Preis') + num(fertigung, 'Preis') + num(anpassung, 'Preis')
      + num(schaftmaterial, 'Preis/m') * num(basis, 'Laenge-m');

  return { at, pa, wk, staerkeMalus, minStaerke1H, minStaerke2H, klingenbrecher, klingenschutz, rezeptMod, preis };
}

const VOLK_ALIASE: Record<string, string> = { Drow: 'Draw', Goblin: 'Goblins' };

/** Material/Fertigung/Anpassung/Schaftmaterial tragen ihre Volk-Einschraenkung direkt als
 *  Spaltenwert (anders als beim Schild, wo sie ueber eine feste Namensliste kuratiert ist:
 *  siehe shieldComposition.ts). "Drow"/"Goblin" in dieser Spalte sind Falschschreibungen
 *  gegenueber der kanonischen VOELKER_NAMEN-Liste ("Draw"/"Goblins") - ohne Alias waeren diese
 *  Komponenten fuer JEDE Spezies dauerhaft gesperrt. */
export function istWaffenKomponenteVerfuegbar(row: GenericRow, spezies: string): boolean {
  const volk = row['Volk'];
  if (!volk || volk === 'ALLE' || volk === 'Standard') return true;
  return (VOLK_ALIASE[volk] ?? volk) === spezies;
}
