// Dokumentierter Draft; keine automatische Inventarvergabe im NPC-Assistenten.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''));
const catalog = read('src/data/equipment/preisliste.json');
const artikelentwuerfe = read('src/addins/npc/data/artikelentwuerfe.draft.json').items;
const grundkleidung = read('src/addins/npc/data/grundkleidung.json');
const byRow = new Map(catalog.map(item => [item.sourceRow, item]));
if (byRow.size !== catalog.length) throw new Error('Doppelte Katalogreferenz');

// Katalogzeilen je Kategorie. Jede Nennung ist ein Vorschlag für eine Katalogeinheit.
// Optionen sind einzeln wählbar; Transport ist keine automatische Eigentumszuteilung.
const drafts = [
  ['Wache', [673,907], [948], [145,927,192], [], 'Am Posten oder am Gürtel; Dienstmittel gesondert kennzeichnen.', 'Handschellen und Dienstabzeichen fehlen als konkrete Artikel.'],
  ['Soldat', [384,523,526], [52], [749,750,150,570,574], [], 'Persönliches Marschgepäck; Lagerausstattung kann dem Verband gehören.', 'Munition und Ladezubehör erst nach Waffenmechanik bestimmen.'],
  ['Kopfgeldjäger', [907,201,526], [52], [192,145,927,909], [12,535,494,543], 'Zu Fuß oder beritten; Sattelzeug nur gemeinsam mit passendem Tier.', 'Handschellen und Fahndungsunterlagen fehlen als eigene Artikel.'],
  ['Revolverheld', [384,567], [], [574,589,523], [12,535,494], 'Gürtel und kleine Reisetasche; Reitausstattung optional.', 'Revolverholster fehlt; Patronengürtel ersetzt kein Holster. Munition waffenabhängig.'],
  ['Kundschafter', [201,526,523], [52], [192,909,749,750,145,927], [12,535,494], 'Leichtes Reisegepäck; Tier nur bei berittenem Schwerpunkt.', 'Regionale Karten fehlen als konkrete Artikel.'],
  ['Jäger', [730,906,526], [52], [320,708,903,749,750], [12,527,494], 'Werkzeug und Beute getragen; Packtier optional.', 'Jagdfallen fehlen; Angelschnur und Netz nur beim passenden Schwerpunkt.'],
  ['Viehhirte', [500,255,523], [], [753,477,909], [12,535,494,543], 'Beritten bei Viehtrieb; Herde ist Betriebsbestand, kein persönliches Inventar.', 'Futter und Wasservorräte nach Tier und Reisedauer ergänzen.'],
  ['Bauer', [738,721,236], [], [716,736,737,266,879], [313], 'Werkzeug am Hof; Wagen und Zugtier als Betriebsmittel.', 'Saatgut nach Anbauschwerpunkt zuordnen; Wagen ohne Zugtier ist kein vollständiges Gespann.'],
  ['Prospektor', [722,732,876], [52], [195,201,675,145,927], [12,527,494], 'Probenbeutel und Werkzeug getragen; Packtier bei längeren Reisen.', 'Goldwaschpfanne und Prüfwaage fehlen; Haushaltssieb ist kein geprüftes Goldwaschset.'],
  ['Bergmann', [722,725,673], [948], [728,729,583,477], [299], 'Stollenwerkzeug; Fördermittel gehören zum Betrieb.', 'Grubenhelm und vollständige Sicherheitsausstattung fehlen. Sprengmittel nicht pauschal zuweisen.'],
  ['Fuhrmann', [490,255,725,739], [949], [294,293,909,275], [312], 'Wagen als Arbeitsmittel; Zugtier, Geschirr und Traglast separat abstimmen.', 'Zugtier und Geschirr müssen zur konkreten Wagenbespannung passen.'],
  ['Matrose', [730,906], [385], [748,913,199,197,583], [], 'Persönlicher Seesack; Navigation und Tauwerk können Schiffseigentum sein.', 'Kein persönliches Schiff als Standard; Schiff, Rettungsmittel und Bordvorräte separat.'],
  ['Schmuggler', [275,878,909], [], [201,673,192], [312], 'Frachtbehälter; Wagen nur bei Landtransport, andere Transportwege separat.', 'Versteckte Fächer und gefälschte Papiere fehlen als Artikel. Fracht ist kein persönlicher Besitz.'],
  ['Händler', [145,927,244,877], [54,146], [275,586], [312], 'Handelsunterlagen getragen; Warenbestand und Frachttransport separat.', 'Handelswaage fehlt. Waren nach Warengruppe wählen, kein pauschaler Handelsbestand.'],
  ['Wirt', [921,919,239,690], [], [232,237,257,145,927], [], 'Überwiegend stationärer Betrieb; Geschirr ist Betriebsausstattung.', 'Lebensmittel, Getränke und Brennstoff nach Betrieb und Gästezahl ergänzen.'],
  ['Journalist', [145,927], [54,146], [524,195,589], [], 'Tragbares Schreibzeug; Druckerei als externer Betrieb.', 'Kamera, Fotomaterial und Druckerpresse fehlen als konkrete Artikel.'],
  ['Künstler', [525], [], [318,325,247,248,271], [], 'Ein Instrument oder passende Requisiten wählen; keine Pflicht zu allen Kunstformen.', 'Bühnenkostüm aus Kleidung nach Auftritt wählen; Verbrauchsmittel abhängig von Kunstform.'],
  ['Dieb', [682,529], [], [715,724,200,673], [], 'Kleine Werkzeuge getragen; sperriges Einbruchswerkzeug nur nach Auftrag.', 'Keine automatische Kampffertigkeit durch Besitz eines Werkzeugs.'],
  ['Glücksspieler', [251,877], [], [145,927,589], [], 'Kleine tragbare Spielausstattung; Würfel nur für Würfelspiel.', 'Spielkarten und gezinkte Spielmittel fehlen als Artikel; Falschspiel bleibt optional.'],
  ['Schmied', [725,741,719], [263], [726,729,477,275], [299], 'Tragbare Werkzeuge plus stationäre Schmiede; Karren für schwere Lasten.', 'Amboss, Esse und Blasebalg fehlen; Werkzeugliste ist noch keine vollständige Schmiede.'],
  ['Waffenschmied', [725,719,739,384], [263], [741,740,714,150,151,195], [299], 'Werkbank und Schmiede stationär; Wartungssatz tragbar.', 'Amboss, Esse, Werkbank und Präzisionswerkzeuge fehlen. Lade- und Kugelwerkzeuge nur für passende Feuerwaffen.'],
  ['Rüstschmied', [725,741,719,739], [263], [729,707,477], [299], 'Werkstattbetrieb; kleine Reparaturausstattung tragbar.', 'Amboss, Esse, Formwerkzeuge und Rüstungsnieten fehlen als konkrete Artikel.'],
  ['Mechaniker', [739,719,725], [], [195,583,729,677,275], [299], 'Werkzeugkasten tragbar; schwere Hebemittel stationär oder auf Karren.', 'Schraubendreher, Schraubenschlüssel, Schrauben und Maschinenersatzteile fehlen als konkrete Artikel.'],
  ['Zimmermann', [725,720,727,245], [706], [718,728,729,735,709], [299], 'Tragbares Werkzeug; Bauholz und Großgerät zur Baustelle liefern.', 'Holzbedarf nach Bauauftrag bestimmen; keine pauschale mobile Vollwerkstatt.'],
  ['Arzt', [525,181,733], [], [195,145,927,54,146], [], 'Tasche und Dokumentation tragbar; stationäre Behandlungsmittel separat.', 'Arzttasche mit Innenausstattung, sterile Verbände, chirurgische Instrumente und medizinische Verbrauchsmittel fehlen. Allgemeine Schere ist kein geprüftes Operationsinstrument.'],
  ['Heiler', [266,181,876], [57], [733,525,145,927], [], 'Sammelbehälter und Vorräte tragbar; Menge nach Versorgungsauftrag.', 'Mörser, Verbände und geprüfte Heilkräuterzuordnung fehlen. Salbenfett allein hat keine Heilwirkung; DSA-Pflanzen nicht ohne Regelprüfung übernehmen.'],
  ['Alchemist', [181,182,180,275], [136], [195,675,57,125,126], [299], 'Geschützte Behälter; Labor überwiegend stationär, Karren optional.', 'Retorten, Destillierapparat, Mörser und Feinwaage fehlen. Zutaten nur rezeptbezogen auswählen; kein automatisches Explosiv- oder Giftpaket.'],
  ['Magier', [145,927,525], [54,146], [524,195,196], [], 'Tragbares Studienmaterial; tatsächliche Magieausstattung nach Ausbildungszweig.', 'Regelgebundene Foki, Ritualmittel und Schulbücher müssen aus der gewählten Magie abgeleitet werden; kein pauschaler Zauberbonus.'],
  ['Gelehrter', [145,927,524], [54,146], [195,201,193,876], [], 'Schreibzeug und wenige Fachmittel tragbar; große Instrumente stationär.', 'Fachbücher, Karten und fachspezifische Probenausrüstung fehlen als konkrete Artikel.'],
  ['Verwalter', [145,927,244], [54,146], [586,587,589,275], [], 'Schreibzeug tragbar; Rechenmaschinen und Aktenlager stationär.', 'Siegel, Stempel und amtliche Formulare fehlen als konkrete Artikel.'],
];

const categories = ['Arbeitsmittel', 'Verbrauchsmaterial', 'Optional / Schwerpunkt', 'Transportoption'];
const referenced = new Set();
const profiles = drafts.map(([beruf, ...fields]) => {
  const items = fields.slice(0, 4).flatMap((rows, index) => rows.map(sourceRow => {
    const item = byRow.get(sourceRow);
    if (!item || !item.whkCraftSkill || !item.spezialisierung || /XXX|Platzhalter/.test(item.whkCraftSkill + item.spezialisierung)) {
      throw new Error(`${beruf}: unbrauchbare Katalogzuordnung ${sourceRow}`);
    }
    referenced.add(sourceRow);
    return { source: 'preisliste', sourceRow, name: item.name, kategorie: categories[index], katalogeinheiten: 1, whkCraftSkill: item.whkCraftSkill, spezialisierung: item.spezialisierung };
  }));
  if (new Set(items.map(x => x.sourceRow)).size !== items.length) throw new Error(`${beruf}: doppelte Artikel`);
  return { beruf, items, grundkleidung: grundkleidung.map(slot => ({ source: 'preisliste', sourceRow: slot.sourceRow, bereich: slot.bereich })),
    entwurfsartikel: artikelentwuerfe.filter(item => item.berufe.includes(beruf)).map(item => ({ source: 'artikelentwuerfe.draft', id: item.id })),
    transportUndBesitz: fields[4], pruefvermerkVorErgaenzung: fields[5] };
});
const professions = fs.readFileSync(path.join(root, 'src/addins/npc/docs/Berufsstruktur.md'), 'utf8');
const names = [...professions.matchAll(/^\| \d+ \| ([^|]+) \|/gm)].map(match => match[1].trim());
if (names.length !== 30 || JSON.stringify(names) !== JSON.stringify(profiles.map(x => x.beruf))) throw new Error('Berufskatalog weicht ab');

const lines = [
  '# Berufsausrüstung: Draft für 30 Berufe', '',
  'Stand: 9. September 2026. Ausrüstungsvorschläge auf Grundlage des vorhandenen Katalogs; noch keine automatische Inventarvergabe. Generiert mit `node src/addins/npc/scripts/berufsausruestung.mjs`.', '',
  '## Verwendung', '',
  '- Jeder aufgeführte Artikel besitzt seine vorhandene Zuordnung **WHK → Spezialisierung**. Sie wird unverändert aus der Preisliste übernommen und bezeichnet überwiegend Herstellung oder Beschaffung, nicht die zum Benutzen erforderliche Fertigkeit. Ein Zimmermann darf einen Hammer aus Schmied → Grobschmied benutzen, ohne dafür Schmied lernen zu müssen.',
  '- Die Quellenreferenz P plus Zahl bezeichnet `sourceRow` in `src/data/equipment/preisliste.json`. Doppelte Namen sind dadurch unterscheidbar. Preise, Gewichte, Mengen und Einheiten weiterhin aus dieser Quelle beziehen.',
  '- Pro Nennung zunächst eine Katalogeinheit als Planungsvorschlag, nicht zwingend ein einzelnes Stück: beispielsweise enthält P146 zehn Bögen Papier. Verbrauchsmengen erst anhand Auftrag und Dauer festlegen. Eine leere Verbrauchsspalte bedeutet keine geprüfte Verbrauchsfreiheit.',
  '- Arbeitsmittel bilden einen ersten Kern. Optionen einzeln nach Schwerpunkt wählen; sie sind kein Pflichtpaket. Offene Punkte müssen vor einer vollständigen Berufsausstattung geklärt werden.',
  '- Qualität billig/gewöhnlich/gehoben/elitär separat wählen; Professionsgüte bestimmt keine Besitzqualität. Keine neuen Preisfaktoren aus diesem Draft ableiten.',
  '- Besitz pro Artikel später als persönlich, dienstlich, geliehen oder Betriebsmittel festlegen. Transportoptionen sind keine automatische Zuteilung. Tiere, Geschirr, Wagen, Futter, Traglast und Reisebedarf gemeinsam prüfen; unbekannte Gewichte sind nicht null.',
  '- Gemeinsame Artikel aus Beruf, Zweitberuf und Lebenswelt zusammenführen. Werkzeuge nicht blind verdoppeln; Verbrauchsmengen nach Bedarf summieren. Keine Paketpreise oder Vollständigkeit behaupten, solange offene Teile bestehen.', '',
  '## Waffen, Rüstung und Grundbedarf', '',
  'Die folgende Liste behandelt Arbeitsausrüstung einschließlich vorhandenen Waffenzubehörs. Die drei Waffenoptionen des gemeinsamen Templates bleiben eine eigene Auswahl: mindestens eine Nahkampf- und eine Fernkampfwaffe, abgestimmt auf Volk, Voraussetzungen, Kampfstil und Budget. Zubehör nur zur tatsächlich gewählten Mechanik übernehmen. Ein Patronenbeutel legt weder Munitionstyp noch enthaltenen Vorrat fest.', '',
  'Waffenkataloge verwenden andere Zuordnungen: Die Felder Hauptfertigkeit/Spezialisierung in Nahkampfwaffen bezeichnen die Kampfanwendung; bei Fernkampfartikeln können dieselben Felder ausdrücklich den improvisierten Nahkampfeinsatz abbilden. Sie dürfen nicht als Schusswaffenspezialisierung oder Herstellung gelesen werden. Rüstung besitzt wiederum keine gleichartige Spezialisierungsspalte. Konkrete Waffen- und Rüstungsbausteine sind deshalb separat regelgerecht zuzuordnen.', '',
  'Alle 30 Berufsprofile erhalten die gemeinsame [Grundkleidung](Artikelentwuerfe.md#gemeinsame-grundkleidung-für-alle-30-berufe), vorhandene Teile werden angerechnet. Neue Referenz-NPCs erhalten fehlende Kleidung bereits in der Vorschau. Allgemeine Nahrung, Wasserfüllung und Unterkunft ergänzen Lebenswelt und Reiseauftrag.', '',
  'Die bisherigen Lücken wurden im [Artikelentwurf](Artikelentwuerfe.md) mit Preisen und Gewichten ausgearbeitet und am 9. September 2026 bestätigt. Die 67 Artikel stehen im SPOT `werte 0.8-claude.xlsx`, Preisliste Zeilen 974–1040. Nachfolgende Prüfvermerke dokumentieren die Ausgangslage; D-Referenzen nennen die Ergänzungen. Ihre Übernahme in den aktiven App-Kaufkatalog steht noch aus.', '',
];
for (const profile of profiles) {
  lines.push(`## ${profile.beruf}`, '', '| Bereich | Artikel | WHK → Spezialisierung | Quelle |', '|---|---|---|---|');
  for (const item of profile.items) lines.push(`| ${item.kategorie} | ${item.name} | ${item.whkCraftSkill} → ${item.spezialisierung} | P${item.sourceRow} |`);
  lines.push('', '**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).', '',
    `**Transport und Besitz:** ${profile.transportUndBesitz}`, '', `**Bisheriger Prüfvermerk:** ${profile.pruefvermerkVorErgaenzung}`, '',
    `**Neue Ergänzungsentwürfe:** ${profile.entwurfsartikel.length ? profile.entwurfsartikel.map(ref => `${ref.id} ${artikelentwuerfe.find(item => item.id === ref.id).name}`).join('; ') : 'Vorhandener Katalog ausreichend; Auswahl und Mengen nach Auftrag.'} – [Preise und Einzelheiten](Artikelentwuerfe.md).`, '');
}
lines.push('## Katalogprüfung und Grenzen', '',
  `Geprüft: ${catalog.length} Preislistenzeilen; ${profiles.length} Berufe, ${referenced.size} unterschiedliche ausgewählte Artikel. Jeder ausgewählte Artikel hat eine nichtleere WHK- und Spezialisierungszuordnung ohne XXX oder Platzhalter.`, '',
  'Vier allgemeine Katalogzeilen sind nicht als konkrete Ausrüstungsartikel geeignet: P69 Elixiere und P668 Stoffarten tragen Platzhalter; P972 und P973 sind Reisekosten mit XXX-Zuordnungen. Keine davon wird verwendet.', '',
  'Vorhandene Zuordnungstexte sind noch kein Beleg einer auflösbaren WHK-Regelreferenz. Beispielsweise verwendet der Katalog Goldschmied, während die aktuelle WHK-Hauptliste Buntmetallschmied führt. Solche Altdaten bleiben sichtbar erhalten. Vor automatischer Fertigkeitsverknüpfung sind Namen und Spezialisierungen gesondert abzugleichen.', '',
  'Die neuen D-Artikel sind separat als Entwurf mit Preisen und gültigen WHK-Regelreferenzen erfasst. Vor einer automatischen Vergabe Mengen, Besitz, Qualität und die separaten Kampfbausteine abstimmen. Historische Prüfvermerke werden durch die verlinkten Ergänzungen konkretisiert.', '');
fs.writeFileSync(path.join(root, 'src/addins/npc/docs/Berufsausruestung.md'), lines.join('\n'));
fs.writeFileSync(path.join(root, 'src/addins/npc/data/berufsausruestung.draft.json'), JSON.stringify({ status: 'draft', datum: '2026-09-09', automatischeVergabe: false, profiles }, null, 2) + '\n');
console.log(`Geprüft und geschrieben: ${profiles.length} Berufe, ${referenced.size} Artikel, jeweils mit vorhandener Spezialisierung.`);
