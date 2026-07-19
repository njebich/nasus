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

export type Welt = (typeof WELTEN)[number];
export type Siedlungsgroesse = (typeof SIEDLUNGSGROESSEN)[number];
export type Handelsstufe = (typeof HANDELSSTUFEN)[number];
export type Herstellungsort = (typeof HERSTELLUNGSORTE)[number];
export type Haendlertyp = (typeof HAENDLERTYPEN)[number];
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
  haendler: HaendlerAmOrt[];
  lokaleProduktion: LokaleProduktion[];
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
    erstelltAm: VORDEFINIERT_AM, aktualisiertAm: VORDEFINIERT_AM,
  },
  {
    id: 'zwogon', name: 'Zwogón', welt: 'AW', region: 'Großkönigliche Kernprovinz Zwogón',
    siedlungsgroesse: 'Metropole', hauptspezies: 'Zwerge', etablierteMinderheiten: ['Orks', 'Elfen', 'Gnome'],
    handelsstufe: 'Handelszentrum', herstellungsort: 'Herstellung direkt vor Ort',
    haendler: SPEZIALISIERBARE_WARENGRUPPEN.map((gruppe) => spezialisiert(gruppe, 'Großer spezialisierter Händler')),
    lokaleProduktion: [], erstelltAm: VORDEFINIERT_AM, aktualisiertAm: VORDEFINIERT_AM,
  },
  {
    id: 'phoenix-feste', name: 'Phoenix-Feste', welt: 'NW', region: 'Neuweltliches Protektorat Neu-Zwogón',
    siedlungsgroesse: 'Dorf', hauptspezies: 'Zwerge', etablierteMinderheiten: ['Indianer'],
    handelsstufe: 'Handelsroute / Kleiner Handels-Hafen', herstellungsort: 'Import, wird nicht hergestellt',
    haendler: [{ typ: 'Kleiner General Store', warengruppe: null }],
    lokaleProduktion: [{ warengruppe: 'NK-Waffen', volk: 'Zwerge' }, { warengruppe: 'Rüstungen', volk: null }],
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
