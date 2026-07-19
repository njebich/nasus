// Feuerwaffen-Komposition aus NN_Feuerwaffen_1.1.xlsx. Eine benannte Waffenzeile liefert
// Name, Volk, Typ sowie die feste Verarbeitung/Anpassung; Bauart, Lademechanik, Schloss und
// Lauf sind die vier austauschbaren Bauteile. Die Berechnungen entsprechen den VLOOKUP-Summen
// in Waffen!K:AF. Ini ist eine eigene, nutzerbestätigte Spalte (2026-07-19), derzeit überall 0.

import {
  FEUERWAFFEN_RESSOURCEN,
  FEUERWAFFEN_VERFUEGBARKEIT,
  FEUERWAFFEN_WUERFEL,
  type FernkampfRow,
  type GenericRow,
} from '../data/equipment/fernkampf';

export interface FeuerwaffenSelections {
  bauartSourceRow: number;
  lademechanikSourceRow: number;
  schlossSourceRow: number;
  laufSourceRow: number;
}

export interface ComposedFeuerwaffe {
  gewicht: number;
  minStaerke: number;
  ersterWuerfel: string;
  zweiterWuerfel: string;
  fixschaden: number;
  rb: number;
  kaliber: number;
  rwMod: readonly [number, number, number, number, number, number];
  rw: number;
  nachladezeit: number;
  nachladenTawTeiler: number;
  patzermodifikator: number;
  verfuegbarkeitRaw: number;
  verfuegbarkeitStufe: number;
  preisDublonen: number;
  herstellungszeit: number;
  materialpreis: number;
  ini: number;
  munition: string;
}

function num(row: GenericRow | FernkampfRow | undefined, header: string): number {
  const raw = row?.[header];
  if (raw === undefined) return 0;
  const value = Number(String(raw).replace(',', '.'));
  return Number.isFinite(value) ? value : 0;
}

function resource(name: string | undefined, discriminator: string, value: string): GenericRow {
  const row = FEUERWAFFEN_RESSOURCEN.find((candidate) => candidate.name === name && candidate[discriminator] === value);
  if (!row) throw new Error(`Feuerwaffen-Ressource '${name ?? '?'}' (${discriminator}=${value}) fehlt`);
  return row;
}

function bySourceRow(sourceRow: number, discriminator: string, value: string): GenericRow {
  const row = FEUERWAFFEN_RESSOURCEN.find((candidate) => candidate.sourceRow === sourceRow);
  if (!row || row[discriminator] !== value) {
    throw new Error(`Feuerwaffen-Komponente #${sourceRow} ist keine gueltige ${value}-Ressource`);
  }
  return row;
}

function sum(rows: readonly GenericRow[], header: string): number {
  return rows.reduce((total, row) => total + num(row, header), 0);
}

function wuerfel(index: number): string {
  return FEUERWAFFEN_WUERFEL.find((entry) => entry.index === index)?.wuerfel ?? `W? (${index})`;
}

function verfuegbarkeitStufe(raw: number): number {
  const passend = [...FEUERWAFFEN_VERFUEGBARKEIT]
    .sort((a, b) => a.rawAb - b.rawAb)
    .filter((entry) => raw >= entry.rawAb);
  const stufe = passend[passend.length - 1];
  if (!stufe) throw new Error(`Keine Verfuegbarkeitsstufe fuer Rohwert ${raw}`);
  return stufe.stufe;
}

export function feuerwaffenKomponentenOptionen(basis: FernkampfRow): {
  bauarten: GenericRow[]; lademechaniken: GenericRow[]; schloesser: GenericRow[]; laeufe: GenericRow[];
} {
  return {
    bauarten: FEUERWAFFEN_RESSOURCEN.filter((row) => row['Bauart'] === 'Bauart' && row['Typ'] === basis['Typ']),
    lademechaniken: FEUERWAFFEN_RESSOURCEN.filter((row) => row['Lademechanik'] === 'Lademechanismus'),
    schloesser: FEUERWAFFEN_RESSOURCEN.filter((row) => row['Schloss'] === 'Schloss'),
    laeufe: FEUERWAFFEN_RESSOURCEN.filter((row) => row['Lauf'] === 'Lauf' && row['Typ'] === basis['Typ']),
  };
}

export function feuerwaffenStandardauswahl(basis: FernkampfRow): FeuerwaffenSelections {
  const passend = (name: string | undefined, discriminator: string, value: string, typ?: string): GenericRow => {
    const row = FEUERWAFFEN_RESSOURCEN.find((candidate) => candidate.name === name
      && candidate[discriminator] === value && (typ === undefined || candidate['Typ'] === typ));
    if (!row) throw new Error(`Feuerwaffen-Ressource '${name ?? '?'}' (${discriminator}=${value}) fehlt`);
    return row;
  };
  return {
    bauartSourceRow: passend(basis['Bauart'], 'Bauart', 'Bauart', basis['Typ']).sourceRow,
    lademechanikSourceRow: resource(basis['Lademechanik'], 'Lademechanik', 'Lademechanismus').sourceRow,
    schlossSourceRow: resource(basis['Schloss'], 'Schloss', 'Schloss').sourceRow,
    laufSourceRow: passend(basis['Lauf'], 'Lauf', 'Lauf', basis['Typ']).sourceRow,
  };
}

function munitionFuer(bauart: string, lademechanik: string, fallback: string): string {
  if (bauart === 'Harpunengewehr') return 'Harpune';
  if (lademechanik === 'Vorderlader') return 'Blei';
  if (lademechanik === 'Hinterlader') return 'Papier Patrone';
  if (lademechanik === 'Klapplauf' || lademechanik === 'Block- oder Scharnierverschluss') return 'Messing Patrone';
  return fallback;
}

export function composeFeuerwaffe(basis: FernkampfRow, selections: FeuerwaffenSelections): ComposedFeuerwaffe {
  const volk = resource(basis['Volk'], 'Volk', 'Volk');
  const typ = resource(basis['Typ'], 'Typ', 'TYP');
  const verarbeitung = resource(basis['Verarbeitung'], 'Verarbeitung', 'Verarbeitung');
  const anpassung = resource(basis['Anpassung'], 'Anpassung', 'Anpassung');
  const bauartAuswahl = bySourceRow(selections.bauartSourceRow, 'Bauart', 'Bauart');
  const lademechanikAuswahl = bySourceRow(selections.lademechanikSourceRow, 'Lademechanik', 'Lademechanismus');
  const schlossAuswahl = bySourceRow(selections.schlossSourceRow, 'Schloss', 'Schloss');
  const laufAuswahl = bySourceRow(selections.laufSourceRow, 'Lauf', 'Lauf');

  if (bauartAuswahl['Typ'] !== basis['Typ'] || laufAuswahl['Typ'] !== basis['Typ']) {
    throw new Error(`Bauart und Lauf muessen zum Feuerwaffen-Typ '${basis['Typ']}' passen`);
  }
  // Excel sucht per VLOOKUP ausschliesslich nach dem Namen und nimmt bei Duplikaten den ersten
  // Treffer. Das betrifft insbesondere "Gezogen" (Pistole/Gewehr). Die Auswahl bleibt typgerecht,
  // fuer die Berechnung wird aber bewusst dieselbe First-Match-Semantik wie in der Quelle benutzt.
  const bauart = resource(bauartAuswahl.name, 'Bauart', 'Bauart');
  const lademechanik = resource(lademechanikAuswahl.name, 'Lademechanik', 'Lademechanismus');
  const schloss = resource(schlossAuswahl.name, 'Schloss', 'Schloss');
  const lauf = resource(laufAuswahl.name, 'Lauf', 'Lauf');

  const gewicht = sum([volk, typ, bauart, lademechanik, lauf], 'Gewicht');
  const minStaerke = sum([volk, typ, bauart, anpassung], 'Mindeststärke');
  const ersterWuerfel = wuerfel(sum([volk, typ, bauart], '1.Würfel'));
  const zweiterWuerfel = wuerfel(sum([volk, typ, bauart], '2.Würfel'));
  const fixschaden = sum([volk, typ, bauart], 'Fixschaden');
  const rb = sum([volk, typ, bauart, lademechanik], 'RB');
  const kaliber = sum([volk, typ, bauart, lademechanik], 'Kaliber');
  const rwRows = [volk, typ, bauart, schloss, lauf, verarbeitung, anpassung];
  const rwMod = ['10m', '30m', '60m', '100m', '150m', '210m'].map((header) => sum(rwRows, header)) as unknown as ComposedFeuerwaffe['rwMod'];
  const rw = sum([volk, typ, bauart, lauf], 'RW');
  const nachladezeit = sum([bauart, lademechanik, schloss], 'Nachladezeit');
  const nachladenTawTeiler = num(lademechanik, 'Nachladen TaW-Teiler');
  const patzermodifikator = sum([volk, bauart, schloss, verarbeitung], 'Patzermodifikator');
  const verfuegbarkeitRaw = sum([volk, typ, bauart, lademechanik, schloss, lauf, verarbeitung, anpassung], 'Verfügbarkeit');
  const herstellungszeit = sum([volk, typ, bauart, schloss, lauf, verarbeitung, anpassung], 'Herstellungszeit');
  const materialpreis = (num(typ, 'Stahl/kg in D') + num(verarbeitung, 'Stahl/kg in D'))
    * sum([volk, typ, bauart, lademechanik, lauf], 'Gewicht Stahl in kg')
    + sum([volk, typ, bauart], 'Gewicht Holz in kg');
  const preisDublonen = Math.round((num(verarbeitung, 'Lohn/d') * herstellungszeit + materialpreis) * 10000) / 10000;

  return {
    gewicht, minStaerke, ersterWuerfel, zweiterWuerfel, fixschaden, rb, kaliber, rwMod, rw,
    nachladezeit, nachladenTawTeiler, patzermodifikator, verfuegbarkeitRaw,
    verfuegbarkeitStufe: verfuegbarkeitStufe(verfuegbarkeitRaw), preisDublonen,
    herstellungszeit, materialpreis, ini: num(basis, 'Ini'),
    munition: munitionFuer(bauart.name, lademechanik.name, basis['Munition'] ?? ''),
  };
}
