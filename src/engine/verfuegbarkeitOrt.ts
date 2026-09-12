// Ortsmodifikatoren fuer die 1-7-Verfuegbarkeitsskala (Spec 04-Verfuegbarkeiten-und-
// Herkunftsorte.md, Abschnitt "Einheitliche Berechnungsstruktur"). Item-class-agnostisch: nimmt
// die bereits vorhandene, katalogeigene Basisstufe (1-7) entgegen und verrechnet Siedlungsgroesse,
// Handelsstufe, Herstellungsort (inkl. lokaler Produktion als Override), den guenstigsten
// anwendbaren Haendler, Garnisonsgrad (militaerischer Vorrat, nur Waffen/Ruestung) und - falls
// fuer den Katalog bekannt - die Voelkerzuweisung des Gegenstands gegen die Ortsbevoelkerung.
// Ergebnis wird auf 1..7 begrenzt.
//
// Stand 2026-09-12: NK-Waffen/Ruestung/Schild tragen inzwischen echte Voelkerzuweisungen (teils
// Einzelwert, teils AUSWAHL-Komma-Listen) - siehe parseGegenstandVoelker() und
// effektiveVerfuegbarkeitKomponenten() weiter unten, die Spec-Punkt 23 (jede Komponente separat
// ortsberechnet, schlechtestes Ergebnis gewinnt) fuer zusammengesetzte Ausruestung umsetzen.
// Boegen/Armbrust/Munition/Alchemika/Artefakte haben weiterhin KEIN Voelker-Feld. Feuerwaffen
// tragen weiterhin nur ein einzelnes "Volk" je Zeile (z.B. "Orkisch"), siehe volkAusAdjektiv().
// Die Voelkerzuweisung ist Herstellerherkunft (Ortsbevoelkerungs-Abgleich, Spec-Punkt 20), KEINE
// Kaeufer-Beschraenkung - siehe effektiveVerfuegbarkeitKomponenten()-Dokumentation.

import type { Ort, Volk, Garnisonsgrad } from '../data/orte';
import type { GenericRow } from '../data/equipment/armor';
import { VOELKER_NAMEN } from './voelker';
import { combineVerfuegbarkeit, parseVerfuegbarkeit, type Verfuegbarkeitswert } from './weaponComposition';

export type WarenTarif = 'ruestungenWaffen' | 'artefakte';

/** Nutzer 2026-09-12: "Wachstation -> Festung in 7 Stufen" - militaerischer Waffen-/Ruestungs-
 *  vorrat, unabhaengig von Siedlungsgroesse/Handelsstufe/Herstellungsort (eine Festung muss nichts
 *  herstellen oder verkaufen, um Waffen auf Lager zu haben). Wirkt NUR auf Waffen-/Ruestungs-
 *  Warengruppen (nicht Artefakte, nicht generische Preisliste) und nur im ruestungenWaffen-Tarif -
 *  siehe garnisonsModifikator(). Werte spiegeln die Siedlungsgroesse-Groessenordnung (Festung=-6
 *  ist staerker als Metropole=-4, da eine Festung sich per Definition auf genau diesen Warenkreis
 *  spezialisiert). Bewusste Annahme, vom Nutzer noch nicht kalibriert-bestaetigt. */
const GARNISONSGRAD_MOD: Record<Garnisonsgrad, number> = {
  'Wachstation': 0, 'Wachturm': -1, 'Außenposten': -2, 'Garnison': -3,
  'Kaserne': -4, 'Fort': -5, 'Festung': -6,
};
const GARNISON_WARENGRUPPEN = new Set(['NK-Waffen', 'Fernkampfwaffen', 'Feuerwaffen', 'Rüstungen', 'Schilde']);

function spalte(tarif: WarenTarif, [ruestungenWaffen, artefakte]: readonly [number, number]): number {
  return tarif === 'artefakte' ? artefakte : ruestungenWaffen;
}

const SIEDLUNGSGROESSE_MOD: Record<string, readonly [number, number]> = {
  'Wildnis': [3, 5],
  'Ansiedlung': [2, 4],
  'Dorf': [1, 3],
  'Großes Dorf': [0, 2],
  'Kleinstadt': [-1, 1],
  'Stadt': [-2, 0],
  'Großstadt': [-3, -1],
  'Metropole': [-4, -2],
};

const HANDELSSTUFE_MOD: Record<string, readonly [number, number]> = {
  'Völlig abgelegen von jeglichem Handel': [2, 3],
  'Abgelegen von jeglichem Handel': [1, 2],
  'Handelsroute / Kleiner Handels-Hafen': [0, 1],
  'Handelsstadt / Großer Handels-Hafen': [-1, 0],
  'Handelszentrum': [-2, -1],
};

const HERSTELLUNGSORT_MOD: Record<string, readonly [number, number]> = {
  'Import, wird nicht hergestellt': [2, 3],
  'Teilweiser Import, Herstellung im Reich': [1, 2],
  'Herstellung im Reich': [0, 1],
  'Herstellung in der Region': [-1, 0],
  'Herstellung direkt vor Ort': [-2, -1],
};

const HAENDLER_MOD: Record<string, readonly [number, number]> = {
  'Kein Laden / kein Händler': [3, 5],
  'Fahrender Trödelhändler': [2, 4],
  'Fahrender spezialisierter Händler': [1, 2],
  'Kleiner General Store': [1, 3],
  'Großer General Store': [0, 2],
  'Kleiner spezialisierter Händler': [0, 1],
  'Spezialisierter Händler': [-1, 0],
  'Großer spezialisierter Händler': [-2, -1],
};

/** Feuerwaffen fuehren ein einzelnes Volk-Adjektiv/-Singular je Zeile statt der im Spec
 *  vorgesehenen AUSWAHL-Liste. Bekannte Formen auf VOELKER_NAMEN (engine/voelker.ts) abbilden;
 *  "Alle", unbekannte/generische Werte (z.B. "Spezial/Legendaer") bleiben ALLE (undefined). */
const VOLK_ADJEKTIV_MAP: Record<string, Volk> = {
  'Dalkinisch': 'Dalkini', 'Daikini': 'Dalkini',
  'Drow': 'Draw',
  'Elfisch': 'Elfen', 'Elf': 'Elfen',
  'Gnom': 'Gnome',
  'Goblinisch': 'Goblins', 'Goblin': 'Goblins',
  'Indianer': 'Indianer',
  'Katzenmensch': 'Katzen',
  'Orkisch': 'Orks', 'Ork': 'Orks',
  'Troll': 'Trolle',
  'Zentaur': 'Zentauren',
  'Zwergisch': 'Zwerge', 'Zwerg': 'Zwerge',
};

export function volkAusAdjektiv(rohwert: string | undefined): Volk | undefined {
  if (!rohwert) return undefined;
  return VOLK_ADJEKTIV_MAP[rohwert];
}

function herstellungsortModifikator(
  ort: Ort, warengruppe: string, tarif: WarenTarif, gegenstandVoelker: readonly Volk[] | undefined,
): number {
  // Nutzer 2026-09-12: "kein Volk angegeben = alle Völker" - ein kulturell nicht gekennzeichneter
  // Gegenstand (z.B. eine gewoehnliche Eisen-Axt ohne Volk-Tag) hat keinen Stil, der einer
  // volksspezifischen lokalen Produktion (z.B. "NK-Waffen, von Zwergen") widerspraeche - er zaehlt
  // also zu "alle Voelker" und matcht jede lokale Produktion dieser Warengruppe, nicht nur die mit
  // volk:null. Ein Gegenstand mit spezifischen Volk-Tags (z.B. "Orks", oder eine AUSWAHL-Liste)
  // matcht weiterhin nur volk:null oder eines der eigenen Voelker - siehe verfuegbarkeitOrt.test.ts.
  const lokalerTreffer = ort.lokaleProduktion.some((produktion) => produktion.warengruppe === warengruppe
    && (produktion.volk === null || gegenstandVoelker === undefined || gegenstandVoelker.includes(produktion.volk)));
  if (lokalerTreffer) return spalte(tarif, HERSTELLUNGSORT_MOD['Herstellung direkt vor Ort']);
  if (!ort.herstellungsort) return 0;
  return spalte(tarif, HERSTELLUNGSORT_MOD[ort.herstellungsort] ?? [0, 0]);
}

function haendlerModifikator(ort: Ort, warengruppe: string, tarif: WarenTarif): number {
  const anwendbar = ort.haendler.filter((haendler) => haendler.warengruppe === null || haendler.warengruppe === warengruppe);
  if (anwendbar.length === 0) return spalte(tarif, HAENDLER_MOD['Kein Laden / kein Händler']);
  return Math.min(...anwendbar.map((haendler) => spalte(tarif, HAENDLER_MOD[haendler.typ] ?? [0, 0])));
}

/** ALLE (gegenstandVoelker undefined/leer) wirkt immer neutral. Fehlt die Ortsbevoelkerung (kein
 *  hauptspezies gepflegt, z.B. selbst angelegter Ort ohne vollstaendige Konfiguration), bleibt der
 *  Modifikator ebenfalls neutral statt zu raten. Spec-Punkt 20: "Bei mehreren Voelkerzuweisungen
 *  eines Gegenstands gilt die beste Uebereinstimmung" - bei AUSWAHL mit mehreren Eintraegen (z.B.
 *  Mithril: Elfen/Zwerge) zaehlt der guenstigste (niedrigste) Modifikator ueber alle gelisteten
 *  Voelker. */
function voelkerModifikator(ort: Ort, gegenstandVoelker: readonly Volk[] | undefined): number {
  if (!gegenstandVoelker || gegenstandVoelker.length === 0 || !ort.hauptspezies) return 0;
  return Math.min(...gegenstandVoelker.map((volk) => {
    if (ort.hauptspezies === volk) return 0;
    if (ort.etablierteMinderheiten.includes(volk)) return 1;
    return 3;
  }));
}

/** Garnisonsgrad wirkt unabhaengig von Kultur/Zivilhandel - selbst ein voelkerfremder Gegenstand
 *  profitiert vom militaerischen Vorrat einer Festung (Nutzer 2026-09-12: "Feuerwaffen galore").
 *  Nur fuer den ruestungenWaffen-Tarif und nur fuer Waffen-/Ruestungs-Warengruppen - eine Festung
 *  lagert keine Artefakte oder generische Preislistenware zusaetzlich. */
function garnisonsModifikator(ort: Ort, warengruppe: string, tarif: WarenTarif): number {
  if (tarif !== 'ruestungenWaffen' || !ort.garnisonsgrad || !GARNISON_WARENGRUPPEN.has(warengruppe)) return 0;
  return GARNISONSGRAD_MOD[ort.garnisonsgrad];
}

const MATERIAL_GATE_SCHWELLE = 3;

/** Nutzer 2026-09-12 ("Mango ohne Schiff/Flugzeug"-Regel): ob ein Material ueberhaupt eine
 *  Ort-Bestaetigung (materialVorrat/materialHerstellbar) braucht, um dort kaufbar zu sein. Nur
 *  Materialien ab eigener Basis-Verfuegbarkeit 3 ("Haeufig" und seltener, z.B. Faltstahl 3/5,
 *  Mithril 7/7) - Alltagsmaterial (Eisen/Holz/Leder/... <=2 in beiden Welten) ist ueberall
 *  vorausgesetzt verfuegbar, keine Ort-Pflege noetig. `M`/`NICHT KAUFBAR` zaehlen als hoechste
 *  Raritaet (immer gate-pflichtig). */
export function materialBrauchtOrtsBestaetigung(
  aw: number | 'M' | 'NICHT KAUFBAR' | undefined, nw: number | 'M' | 'NICHT KAUFBAR' | undefined,
): boolean {
  const stufe = (v: typeof aw): number => (v === undefined ? 0 : typeof v === 'number' ? v : 99);
  return stufe(aw) >= MATERIAL_GATE_SCHWELLE || stufe(nw) >= MATERIAL_GATE_SCHWELLE;
}

/** Das eigentliche NEIN-Gate: ein gate-pflichtiges Material ist an einem Ort nur kaufbar, wenn es
 *  dort vorraetig ODER herstellbar ist - sonst hart nicht kaufbar, UNABHAENGIG von jedem
 *  Ortsmodifikator/Garnisonsgrad/Meisterwerk-Floor (Preisliste vs. Auftrag, siehe Datei-Kopf-
 *  Beispiel). Fehlender Ort bleibt neutral (bestehende Konvention), analog zu ortsModifikator. */
export function istMaterialAmOrtSourcierbar(ort: Ort | undefined, materialName: string): boolean {
  if (!ort) return true;
  return (ort.materialVorrat?.includes(materialName) ?? false) || (ort.materialHerstellbar?.includes(materialName) ?? false);
}

export interface OrtsModifikatorParams {
  ort: Ort | undefined;
  warengruppe: string;
  tarif: WarenTarif;
  gegenstandVoelker?: readonly Volk[];
}

/** Summe aller Ortsmodifikatoren (noch NICHT auf 1..7 begrenzt - das passiert erst zusammen mit
 *  dem Grundwert in effektiveVerfuegbarkeit). Fehlt der Ort (nicht aufloesbare herkunftOrtId,
 *  z.B. migrierter Altcharakter), ist das Ergebnis 0 - siehe Nutzerentscheidung 2026-09-11: kein
 *  Ort bedeutet neutral statt zusaetzlich gesperrt. */
export function ortsModifikator({ ort, warengruppe, tarif, gegenstandVoelker }: OrtsModifikatorParams): number {
  if (!ort) return 0;
  const siedlungsgroesse = ort.siedlungsgroesse ? spalte(tarif, SIEDLUNGSGROESSE_MOD[ort.siedlungsgroesse] ?? [0, 0]) : 0;
  const handelsstufe = ort.handelsstufe ? spalte(tarif, HANDELSSTUFE_MOD[ort.handelsstufe] ?? [0, 0]) : 0;
  const herstellung = herstellungsortModifikator(ort, warengruppe, tarif, gegenstandVoelker);
  const haendler = haendlerModifikator(ort, warengruppe, tarif);
  const voelker = voelkerModifikator(ort, gegenstandVoelker);
  const garnison = garnisonsModifikator(ort, warengruppe, tarif);
  return siedlungsgroesse + handelsstufe + herstellung + haendler + voelker + garnison;
}

/** Grundwert (1-7) + Ortsmodifikator, auf 1..7 begrenzt. Ein fehlender Grundwert (Katalogeintrag
 *  ohne gepflegte Basis-Verfuegbarkeit, z.B. aktuell alle Boegen/Armbrust) bleibt unveraendert
 *  undefined - "OFFEN" darf durch einen Ortsbonus nicht stillschweigend kaufbar werden.
 *
 *  Floor bei Basisstufe 7 ("Einzigartig", Nutzer 2026-09-12): 5 Ortskategorien mit bis zu +-5
 *  pro Kategorie koennen sich zu weit mehr als der gesamten 1..7-Spanne aufsummieren - trifft ein
 *  Ort gleichzeitig alle fuenf Bestwerte (z.B. Katharsis, die zwergische Hauptstadt: Metropole +
 *  Handelszentrum + Herstellung vor Ort + eigener Grosshaendler + Hauptspezies-Match), wuerde
 *  jede Basisstufe auf 1 fallen - fuer ein echtes Meisterwerk-Material wie Mithril/Nasium (7/7)
 *  waere das falsch, das bliebe laut Nutzer selbst dort noch bei 5 ("gesperrt", nur ueber's
 *  Meister-Modul freigebbar, Spec-Punkt 22). Niedrigere Basisstufen (z.B. die bereits bestehende,
 *  getestete orkische Feuerwaffe mit Basis 6, die in ihrer Heimat-Metropole auf 1 faellt - siehe
 *  verfuegbarkeitOrt.test.ts) duerfen weiterhin die volle Spanne durchlaufen; nur die Basisstufe
 *  7 selbst bekommt diesen Floor. */
export function effektiveVerfuegbarkeit(basisStufe: number | undefined, params: OrtsModifikatorParams): number | undefined {
  if (basisStufe === undefined) return undefined;
  const floor = basisStufe >= 7 ? 5 : 1;
  return Math.min(7, Math.max(floor, basisStufe + ortsModifikator(params)));
}

const VOLK_ALIASE: Record<string, string> = { Drow: 'Draw', Goblin: 'Goblins' };

/** Liest die Voelkerzuweisung einer Katalogzeile (Spalte "Volk") in eine Liste kanonischer
 *  Voelker-IDs - `undefined`/`'ALLE'`/`'Standard'` (Nutzer 2026-09-12: "kein Volk angegeben = alle
 *  Voelker") sowie unbekannte Freitext-Werte (z.B. "andere Voelker") ergeben `undefined` (= ALLE).
 *  Eine Komma-Liste (AUSWAHL mit mehreren Eintraegen, z.B. "Dalkini, Draw, Elfen, ...") wird
 *  vollstaendig geparst - Spec-Punkt 20 verlangt bei mehreren Zuweisungen die beste Uebereinstimmung
 *  (siehe voelkerModifikator), nicht nur den ersten Eintrag. "Drow"/"Goblin" sind Falschschreibungen
 *  einzelner Quellzeilen gegenueber der kanonischen VOELKER_NAMEN-Liste ("Draw"/"Goblins"). */
export function parseGegenstandVoelker(volkRoh: string | undefined): Volk[] | undefined {
  if (!volkRoh || volkRoh === 'ALLE' || volkRoh === 'Standard') return undefined;
  const voelker = volkRoh.split(',').map((v) => v.trim()).map((v) => VOLK_ALIASE[v] ?? v)
    .filter((v): v is Volk => (VOELKER_NAMEN as readonly string[]).includes(v));
  return voelker.length > 0 ? voelker : undefined;
}

/** Spec-Punkt 23 (zusammengesetzte Ausruestung), woertlich statt vereinfacht umgesetzt: jede
 *  Pflichtkomponente (Basis/Material/Fertigung/Anpassung/...) wird SEPARAT inklusive ihrer EIGENEN
 *  Voelkerzuweisung voll ortsberechnet (effektiveVerfuegbarkeit), erst danach bestimmt das
 *  schlechteste Komponentenergebnis den fertigen Gegenstand (combineVerfuegbarkeit: NICHT KAUFBAR >
 *  M > numerisches Maximum). `M`/`NICHT KAUFBAR` nehmen nicht an der Ortsberechnung teil (siehe
 *  effektiveVerfuegbarkeit-Dateikopf), sondern werden je Komponente direkt durchgereicht.
 *
 *  Ersetzt seit 2026-09-12 die vorherigen `istWaffenKomponenteVerfuegbar`/
 *  `istRuestungKomponenteVerfuegbar`/`istSchildKomponenteVerfuegbar`-Hartsperren (Nutzer: "Trolle
 *  stellen keine Kette her, aber andere koennen Kette fuer Trolle herstellen" - die Voelkerzuweisung
 *  einer Komponente ist Herstellerherkunft, keine Kaeufer-Beschraenkung, siehe Spec-Punkt 20
 *  "Ortsbevoelkerung-Abgleich" statt einer Spezies-Sperre). Das separate Material-Sourcing-Gate
 *  (`istMaterialAmOrtSourcierbar`) bleibt davon unberuehrt - andere Dimension (ist das Material an
 *  DIESEM Ort ueberhaupt zu bekommen, unabhaengig vom Kaeufer). */
export function effektiveVerfuegbarkeitKomponenten(
  komponenten: readonly GenericRow[], welt: 'AW' | 'NW' | undefined,
  params: { ort: Ort | undefined; warengruppe: string; tarif: WarenTarif },
): Verfuegbarkeitswert | undefined {
  const ergebnisse = komponenten.map((row): Verfuegbarkeitswert | undefined => {
    const roh = welt === 'NW' ? parseVerfuegbarkeit(row, 'Verfuegbarkeit-NW')
      : welt === 'AW' ? parseVerfuegbarkeit(row, 'Verfuegbarkeit-AW') : undefined;
    if (roh === undefined || roh === 'NICHT KAUFBAR' || roh === 'M') return roh;
    return effektiveVerfuegbarkeit(roh, { ...params, gegenstandVoelker: parseGegenstandVoelker(row['Volk']) });
  });
  return combineVerfuegbarkeit(...ergebnisse);
}
