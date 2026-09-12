import { PREISLISTE } from './equipment/preisliste';
import { VOELKER_NAMEN } from '../engine/voelker';

export const WELTEN = ['AW', 'NW'] as const;
export const SIEDLUNGSGROESSEN = [
  'Wildnis', 'Ansiedlung', 'Dorf', 'Großes Dorf', 'Kleinstadt', 'Stadt', 'Großstadt', 'Metropole',
] as const;
export const HANDELSSTUFEN = [
  'Völlig abgelegen von jeglichem Handel',
  'Abgelegen von jeglichem Handel',
  'Handelsroute / Kleiner Handels-Hafen',
  'Handelsstadt / Großer Handels-Hafen',
  'Handelszentrum',
] as const;
export const HERSTELLUNGSORTE = [
  'Import, wird nicht hergestellt',
  'Teilweiser Import, Herstellung im Reich',
  'Herstellung im Reich',
  'Herstellung in der Region',
  'Herstellung direkt vor Ort',
] as const;
export const HAENDLERTYPEN = [
  'Kein Laden / kein Händler',
  'Fahrender Trödelhändler',
  'Fahrender spezialisierter Händler',
  'Kleiner General Store',
  'Großer General Store',
  'Kleiner spezialisierter Händler',
  'Spezialisierter Händler',
  'Großer spezialisierter Händler',
] as const;
/** Nutzer 2026-09-12: "Wachstation -> Festung in 7 Stufen" - militaerischer Vorrat unabhaengig
 *  von Zivilhandel/-produktion (eine Festung muss nichts herstellen oder verkaufen, um Waffen auf
 *  Lager zu haben). Wirkt nur auf Waffen/Ruestungs-Warengruppen, siehe garnisonsModifikator() in
 *  engine/verfuegbarkeitOrt.ts. Optional - unbesetzt = kein besonderer militaerischer Vorrat (0). */
export const GARNISONSGRADE = [
  'Wachstation', 'Wachturm', 'Außenposten', 'Garnison', 'Kaserne', 'Fort', 'Festung',
] as const;

export type Welt = (typeof WELTEN)[number];
export type Siedlungsgroesse = (typeof SIEDLUNGSGROESSEN)[number];
export type Handelsstufe = (typeof HANDELSSTUFEN)[number];
export type Herstellungsort = (typeof HERSTELLUNGSORTE)[number];
export type Haendlertyp = (typeof HAENDLERTYPEN)[number];
export type Garnisonsgrad = (typeof GARNISONSGRADE)[number];
export type Volk = (typeof VOELKER_NAMEN)[number];

const NICHT_SPEZIALISIERBAR = new Set(['Miete', 'Post', 'Reisekosten', 'Tavernen-Preise', 'Zoll']);
const AUSRUESTUNGSGRUPPEN = ['NK-Waffen', 'Fernkampfwaffen', 'Feuerwaffen', 'Rüstungen', 'Schilde', 'Artefakte'];
const preislistenGruppen = PREISLISTE.flatMap((row) => row.art ? [row.art] : []);

export interface Warengruppe {
  id: string;
  haendlerSpezialisierbar: boolean;
}

export const WARENGRUPPEN: readonly Warengruppe[] = [...new Set([...preislistenGruppen, ...AUSRUESTUNGSGRUPPEN])]
  .sort((a, b) => a.localeCompare(b, 'de'))
  .map((id) => ({ id, haendlerSpezialisierbar: !NICHT_SPEZIALISIERBAR.has(id) }));

export const SPEZIALISIERBARE_WARENGRUPPEN = WARENGRUPPEN
  .filter((gruppe) => gruppe.haendlerSpezialisierbar)
  .map((gruppe) => gruppe.id);

export interface HaendlerAmOrt {
  typ: Haendlertyp;
  warengruppe: string | null;
}

export interface LokaleProduktion {
  warengruppe: string;
  volk: Volk | null;
}

export interface Ort {
  id: string;
  name: string;
  welt?: Welt;
  region?: string;
  siedlungsgroesse?: Siedlungsgroesse;
  hauptspezies?: Volk;
  etablierteMinderheiten: Volk[];
  handelsstufe?: Handelsstufe;
  herstellungsort?: Herstellungsort;
  garnisonsgrad?: Garnisonsgrad;
  haendler: HaendlerAmOrt[];
  lokaleProduktion: LokaleProduktion[];
  /** Nutzer 2026-09-12 ("Mango ohne Schiff/Flugzeug"-Regel): explizite Bestaetigung, welche
   *  SELTENEN Materialien (Basis-Verfuegbarkeit >=3, siehe materialBrauchtOrtsBestaetigung in
   *  engine/verfuegbarkeitOrt.ts) an diesem Ort vorraetig sind bzw. von einem hiesigen Handwerker
   *  verarbeitet werden koennen. Fehlt ein Material in BEIDEN Listen, ist es hier hart nicht
   *  kaufbar - unabhaengig von jedem Ortsmodifikator (Preisliste vs. Auftrag). Materialnamen wie
   *  in NK_MATERIAL/SCHILD_MATERIAL/NK_SCHAFTMATERIAL (.name). Alltagsmaterial (Basis <=2, z.B.
   *  Eisen/Holz/Leder) braucht keinen Eintrag - ist ueberall vorausgesetzt verfuegbar. */
  materialVorrat?: readonly string[];
  materialHerstellbar?: readonly string[];
  erstelltAm: string;
  aktualisiertAm: string;
}

const SPEZIALISIERTE_HAENDLER = new Set<Haendlertyp>([
  'Fahrender spezialisierter Händler', 'Kleiner spezialisierter Händler',
  'Spezialisierter Händler', 'Großer spezialisierter Händler',
]);

export function validateOrt(ort: Ort): string[] {
  const fehler: string[] = [];
  if (!ort.name.trim()) fehler.push('Name ist ein Pflichtfeld');
  if (ort.welt && !WELTEN.includes(ort.welt)) fehler.push(`Unbekannte Welt: ${ort.welt}`);
  if (ort.siedlungsgroesse && !SIEDLUNGSGROESSEN.includes(ort.siedlungsgroesse)) fehler.push(`Unbekannte Siedlungsgröße: ${ort.siedlungsgroesse}`);
  if (ort.handelsstufe && !HANDELSSTUFEN.includes(ort.handelsstufe)) fehler.push(`Unbekannte Handelsstufe: ${ort.handelsstufe}`);
  if (ort.herstellungsort && !HERSTELLUNGSORTE.includes(ort.herstellungsort)) fehler.push(`Unbekannter Herstellungsort: ${ort.herstellungsort}`);
  if (ort.garnisonsgrad && !GARNISONSGRADE.includes(ort.garnisonsgrad)) fehler.push(`Unbekannter Garnisonsgrad: ${ort.garnisonsgrad}`);
  if (ort.hauptspezies && !VOELKER_NAMEN.includes(ort.hauptspezies)) fehler.push(`Unbekannte Hauptspezies: ${ort.hauptspezies}`);
  if (new Set(ort.etablierteMinderheiten).size !== ort.etablierteMinderheiten.length) fehler.push('Etablierte Minderheiten dürfen nicht doppelt vorkommen');
  if (ort.hauptspezies && ort.etablierteMinderheiten.includes(ort.hauptspezies)) fehler.push('Hauptspezies darf nicht zugleich Minderheit sein');
  for (const haendler of ort.haendler) {
    if (!HAENDLERTYPEN.includes(haendler.typ)) fehler.push(`Unbekannter Händlertyp: ${haendler.typ}`);
    if (SPEZIALISIERTE_HAENDLER.has(haendler.typ)) {
      if (!haendler.warengruppe || !SPEZIALISIERBARE_WARENGRUPPEN.includes(haendler.warengruppe)) {
        fehler.push(`${haendler.typ} benötigt eine spezialisierbare Warengruppe`);
      }
    } else if (haendler.warengruppe !== null) {
      fehler.push(`${haendler.typ} darf keine Warengruppe besitzen`);
    }
  }
  for (const produktion of ort.lokaleProduktion) {
    if (!WARENGRUPPEN.some((gruppe) => gruppe.id === produktion.warengruppe)) fehler.push(`Unbekannte Warengruppe: ${produktion.warengruppe}`);
    if (produktion.volk && !VOELKER_NAMEN.includes(produktion.volk)) fehler.push(`Unbekanntes Produktionsvolk: ${produktion.volk}`);
  }
  return fehler;
}

export function assertValidOrt(ort: Ort): Ort {
  const fehler = validateOrt(ort);
  if (fehler.length) throw new Error(`Ungültiger Ort: ${fehler.join('; ')}`);
  return ort;
}

const VORDEFINIERT_AM = '2026-07-19T00:00:00.000Z';
const spezialisiert = (warengruppe: string, typ: Haendlertyp = 'Spezialisierter Händler'): HaendlerAmOrt => ({ typ, warengruppe });

const VORDEFINIERTE_ORTE_ROH: Ort[] = [
  {
    id: 'straitmor', name: 'Straitmor', welt: 'NW', region: 'Orkisches Protektorat Straitmor',
    siedlungsgroesse: 'Metropole', hauptspezies: 'Orks', etablierteMinderheiten: ['Zwerge', 'Goblins'],
    handelsstufe: 'Handelszentrum', herstellungsort: 'Teilweiser Import, Herstellung im Reich',
    haendler: ['Sklaven', 'Feuerwaffen', 'Rüstungen', 'NK-Waffen', 'Edelsteine', 'Metall'].map((gruppe) => spezialisiert(gruppe)),
    lokaleProduktion: [
      { warengruppe: 'Feuerwaffen', volk: 'Orks' }, { warengruppe: 'Rüstungen', volk: null },
      { warengruppe: 'NK-Waffen', volk: null },
    ],
    // Nutzer 2026-09-12: etwa Haelfte der Bevoelkerung versklavte Goblins, dazu versklavte
    // Indigene und ~10% Zwerge - Sklavenstatus wird im Datenmodell nicht abgebildet (nur
    // kulturelle Praesenz), Nutzer entschied sich bewusst GEGEN eine Indianer-Minderheiten-
    // Ergaenzung. Material-Kanon (Orks/Goblins/Zwerge vor Ort): NIEMALS Mithril/Nasium/
    // Adamandit vorschlagen (siehe feedback-material-kanon-nie-vorschlagen memory).
    materialHerstellbar: ['Qualitätsstahl', 'Qualitaetsstahl', 'Faltstahl', 'Alchemistensilber', 'Chitin'],
    erstelltAm: VORDEFINIERT_AM, aktualisiertAm: VORDEFINIERT_AM,
  },
  {
    // Nutzer 2026-09-12: Zwogón (ehem. zwergische Hauptstadt) existiert nicht mehr - die Zwerge
    // wurden vertrieben, das Kernland ist jetzt goblinisch und heisst Isch-Isch. Rest (Metropole/
    // Handelszentrum/Herstellung vor Ort/Grosshaendler je Warengruppe/Welt) bleibt unveraendert.
    id: 'isch-isch', name: 'Isch-Isch', welt: 'AW', region: 'Goblinisches Kernland Isch-Isch',
    siedlungsgroesse: 'Metropole', hauptspezies: 'Goblins', etablierteMinderheiten: ['Orks', 'Elfen', 'Gnome'],
    handelsstufe: 'Handelszentrum', herstellungsort: 'Herstellung direkt vor Ort',
    haendler: SPEZIALISIERBARE_WARENGRUPPEN.map((gruppe) => spezialisiert(gruppe, 'Großer spezialisierter Händler')),
    lokaleProduktion: [],
    // Nutzer 2026-09-12: "kann alles, was verfuegbar ist" - ausdruecklich inkl. Mithril/Nasium
    // (Elfen-Minderheit) und Adamandit (Elfen/Goblins/Orks), bewusste Ausnahme von der
    // "nie vorschlagen"-Regel, weil der Nutzer sie hier selbst explizit genannt hat.
    materialHerstellbar: ['Qualitätsstahl', 'Qualitaetsstahl', 'Faltstahl', 'Alchemistensilber', 'Mithril', 'Nasium', 'Adamandit'],
    erstelltAm: VORDEFINIERT_AM, aktualisiertAm: VORDEFINIERT_AM,
  },
  {
    // Nutzer 2026-09-12: Katharsis, die (neue) Hauptstadt der Zwerge - "absolutes Optimum an
    // Verfuegbarkeit fuer Artefakte, zwergische Waffen und ungewoehnliche Materialien" (uebernimmt
    // den Titel "Großkönigliche Kernprovinz" von der gefallenen Zwogón/Isch-Isch). Welt=AW vom
    // Nutzer bestaetigt.
    id: 'katharsis', name: 'Katharsis', welt: 'AW', region: 'Großkönigliche Kernprovinz Katharsis',
    siedlungsgroesse: 'Metropole', hauptspezies: 'Zwerge', etablierteMinderheiten: ['Elfen', 'Trolle', 'Zentauren', 'Orks'],
    handelsstufe: 'Handelszentrum', herstellungsort: 'Herstellung direkt vor Ort',
    haendler: SPEZIALISIERBARE_WARENGRUPPEN.map((gruppe) => spezialisiert(gruppe, 'Großer spezialisierter Händler')),
    lokaleProduktion: [],
    // Annahme, nicht vom Nutzer einzeln bestaetigt: "ungewoehnliche Materialien" (Nutzer-Zitat)
    // wird als Mithril/Nasium gelesen - die einzigen beiden Materialien, die ohnehin exklusiv
    // Elfen/Zwerge zugewiesen sind. Faltstahl/Adamandit/etc. NICHT automatisch mitgesetzt - bei
    // Bedarf ergaenzen.
    materialHerstellbar: ['Mithril', 'Nasium'],
    erstelltAm: VORDEFINIERT_AM, aktualisiertAm: VORDEFINIERT_AM,
  },
  {
    id: 'phoenix-feste', name: 'Phoenix-Feste', welt: 'NW', region: 'Neuweltliches Protektorat Neu-Zwogón',
    siedlungsgroesse: 'Dorf', hauptspezies: 'Zwerge', etablierteMinderheiten: ['Indianer'],
    handelsstufe: 'Handelsroute / Kleiner Handels-Hafen', herstellungsort: 'Import, wird nicht hergestellt',
    // Nutzer 2026-09-12: "eine Festung, FK Waffen galore" - der Name sagt es schon. Der neue
    // Garnisonsgrad (siehe GARNISONSGRADE oben) modelliert den militaerischen Waffen-/Ruestungs-
    // Vorrat unabhaengig vom zivilen Dorf-Status (Siedlungsgroesse bleibt Dorf, die Festung ist ja
    // kein grosses Dorf im Bevoelkerungssinn).
    garnisonsgrad: 'Festung',
    haendler: [{ typ: 'Kleiner General Store', warengruppe: null }],
    // Feuerwaffen lagert die Festung generell, nicht nur zwergisch gestylte Modelle (volk:null,
    // wie bei Ruestungen). Fremde Stile bleiben ueber den Voelker-Modifikator teurer/seltener.
    lokaleProduktion: [
      { warengruppe: 'NK-Waffen', volk: 'Zwerge' }, { warengruppe: 'Feuerwaffen', volk: null },
      { warengruppe: 'Rüstungen', volk: null },
    ],
    // Nutzer 2026-09-12: "die klassischen Materialien, nicht die besonderen" - klassische
    // zwergische Metallurgie plus Chitin, aber NICHT Schwarzfels/Vulkanglas (Indianer-
    // Spezialmaterialien, vom Nutzer nicht mit ausgewaehlt) und wie ueberall kein Mithril/
    // Nasium/Adamandit.
    materialHerstellbar: ['Qualitätsstahl', 'Qualitaetsstahl', 'Faltstahl', 'Alchemistensilber', 'Chitin'],
    erstelltAm: VORDEFINIERT_AM, aktualisiertAm: VORDEFINIERT_AM,
  },
  {
    // Nutzer 2026-09-12: zwergische Kolonialstadt in Nordzoran, Hauptschauplatz der aktuellen
    // Kampagne. Kernstadt ~15.000 Einwohner.
    id: 'neu-zwoggon', name: 'Neu Zwoggon', welt: 'NW', region: 'Zwergische Kolonie Nordzoran',
    siedlungsgroesse: 'Stadt', hauptspezies: 'Zwerge', etablierteMinderheiten: ['Indianer'],
    handelsstufe: 'Handelsstadt / Großer Handels-Hafen', herstellungsort: 'Herstellung direkt vor Ort',
    garnisonsgrad: 'Fort',
    haendler: SPEZIALISIERBARE_WARENGRUPPEN.map((gruppe) => spezialisiert(gruppe, 'Großer spezialisierter Händler')),
    lokaleProduktion: [],
    // Material-Kanon: NIEMALS Mithril/Nasium/Adamandit vorschlagen, siehe
    // feedback-material-kanon-nie-vorschlagen memory (Nutzer-Korrektur an genau diesem Ort).
    materialHerstellbar: ['Qualitätsstahl', 'Qualitaetsstahl', 'Faltstahl', 'Alchemistensilber', 'Chitin'],
    erstelltAm: VORDEFINIERT_AM, aktualisiertAm: VORDEFINIERT_AM,
  },
  {
    // Nutzer 2026-09-12: oestliche Goblin-Metropole, freie und versklavte Indigene.
    id: 'doxxmoxx', name: 'Doxxmoxx', welt: 'NW', region: 'Freie Handelsstadt Doxxmoxx',
    siedlungsgroesse: 'Metropole', hauptspezies: 'Goblins',
    etablierteMinderheiten: ['Elfen', 'Dalkini', 'Indianer', 'Orks'],
    handelsstufe: 'Handelsstadt / Großer Handels-Hafen', herstellungsort: 'Teilweiser Import, Herstellung im Reich',
    garnisonsgrad: 'Garnison',
    haendler: SPEZIALISIERBARE_WARENGRUPPEN.map((gruppe) => spezialisiert(gruppe, 'Großer spezialisierter Händler')),
    lokaleProduktion: [],
    materialHerstellbar: ['Qualitätsstahl', 'Qualitaetsstahl', 'Faltstahl', 'Alchemistensilber'],
    erstelltAm: VORDEFINIERT_AM, aktualisiertAm: VORDEFINIERT_AM,
  },
  {
    // Nutzer 2026-09-12: Marmorkueste ist die Region der alten Welt, Grasungen die Stadt darin.
    // Versklavte Goblins als Minderheit vor Ort (Sklavenstatus nicht im Datenmodell abgebildet).
    id: 'grasungen', name: 'Grasungen', welt: 'AW', region: 'Marmorküste',
    siedlungsgroesse: 'Großstadt', hauptspezies: 'Zwerge',
    etablierteMinderheiten: ['Orks', 'Goblins', 'Elfen'],
    handelsstufe: 'Handelsstadt / Großer Handels-Hafen', herstellungsort: 'Herstellung direkt vor Ort',
    garnisonsgrad: 'Garnison',
    haendler: SPEZIALISIERBARE_WARENGRUPPEN.map((gruppe) => spezialisiert(gruppe, 'Großer spezialisierter Händler')),
    lokaleProduktion: [],
    materialHerstellbar: ['Qualitätsstahl', 'Qualitaetsstahl', 'Faltstahl', 'Alchemistensilber', 'Chitin'],
    erstelltAm: VORDEFINIERT_AM, aktualisiertAm: VORDEFINIERT_AM,
  },
  {
    // Nutzer 2026-09-12: kleines zwergisches Dorf in Nordzoran, nahe Neu Zwoggon.
    id: 'nemzen', name: 'Nemzen', welt: 'NW', region: 'Nordzoran',
    siedlungsgroesse: 'Dorf', hauptspezies: 'Zwerge', etablierteMinderheiten: ['Indianer'],
    handelsstufe: 'Abgelegen von jeglichem Handel', herstellungsort: 'Import, wird nicht hergestellt',
    garnisonsgrad: 'Wachstation',
    haendler: [{ typ: 'Fahrender Trödelhändler', warengruppe: null }],
    lokaleProduktion: [],
    // Nutzer: bewusst KEINE Material-Kanon-Freigabe - abgelegenes Import-Dorf ohne eigene
    // Produktion, alle Gate-Materialien bleiben hier gesperrt.
    erstelltAm: VORDEFINIERT_AM, aktualisiertAm: VORDEFINIERT_AM,
  },
];

export const VORDEFINIERTE_ORTE: readonly Ort[] = VORDEFINIERTE_ORTE_ROH.map(assertValidOrt);

export function createOrt(input: Omit<Ort, 'id' | 'erstelltAm' | 'aktualisiertAm'>): Ort {
  const now = new Date().toISOString();
  return assertValidOrt({ ...input, id: crypto.randomUUID(), erstelltAm: now, aktualisiertAm: now });
}

export function formatOrtKurz(ort: Pick<Ort, 'name' | 'region' | 'welt'>): string {
  return [ort.name, ort.region, ort.welt].filter(Boolean).join(', ');
}
