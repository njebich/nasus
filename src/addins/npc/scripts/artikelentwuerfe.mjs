import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''));
const p = read('src/data/equipment/preisliste.json');
const byRow = new Map(p.map(row => [row.sourceRow, row]));
const rules = fs.readFileSync(path.join(root, 'src/data/rules-jsonl/whk.jsonl'), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const ruleById = new Map(rules.map(rule => [rule.referenz, rule]));
const profiles = read('src/addins/npc/data/berufsausruestung.draft.json').profiles;
const names = new Set(profiles.map(profile => profile.beruf));
const items = [];

// D-IDs sind Entwurfsreferenzen, keine sourceRows des aktiven Katalogs.
// Preis und Gewicht gelten für die ganze ausdrücklich beschriebene Verkaufseinheit.
function add(id, name, art, preisDublonen, gewichtKg, einheit, spez, berufe, anker, begruendung, notiz) {
  const specializationRef = `whk_spez_${spez}`;
  const rule = ruleById.get(specializationRef);
  const parent = rules.find(r => !r.referenz.startsWith('whk_spez_') && r.beschreibung === rule?.parent);
  if (!rule || !parent) throw new Error(`${id}: unbekannte WHK-Zuordnung ${specializationRef}`);
  const professions = berufe.split('|');
  if (professions.some(n => !names.has(n))) throw new Error(`${id}: unbekannter Beruf`);
  if (!(preisDublonen > 0 && gewichtKg > 0) || !anker.length || anker.some(row => !byRow.get(row)?.preisAvailable)) throw new Error(`${id}: ungültiger Preisanker`);
  items.push({ id, status: 'Bestätigt', spotSourceRow: 974 + items.length, name, art, anzahl: 1, einheit, gewichtKg, preisAvailable: true, preisDublonen,
    whkCraftSkill: parent.beschreibung, whkCraftSkillRef: parent.referenz,
    spezialisierung: rule.beschreibung.replace(/^->\s*/, ''), specializationRef,
    berufe: professions, preisanker: anker.map(sourceRow => ({ sourceRow, preisDublonen: byRow.get(sourceRow).preisDublonen })), begruendung, notiz });
}

add('D001','Handschellen mit zwei Schlüsseln','Dienstmittel',60,0.7,'Satz','schmied_feinschmied','Wache|Kopfgeldjäger',[701,682],'Kurzes Kettenstück mit zwei präzisen Schlössern; Größenordnung des Dietrichsatzes.','Passende Handgelenkgröße wählen; keine neue Fesselregel.');
add('D002','Dienstabzeichen, geprägt','Dienstmittel',4,0.03,'Stück','schmied_feinschmied','Wache|Soldat|Verwalter',[676,677],'Kleines Metallteil mit einfacher Prägung unter dem Preis eines Gravurwerkzeugs.','Blanko oder autorisierte Prägung; Besitz verleiht keine Amtsbefugnisse.');
add('D003','Fahndungsblatt, gedruckt','Schreibwaren',0.3,0.01,'Blatt','drucker_lithograf','Wache|Kopfgeldjäger|Journalist',[146],'Papierbogen plus einfacher Druck; Auflage vorausgesetzt.','Druck eines vorhandenen Texts; Recherche und Belohnung nicht enthalten.');
add('D004','Revolverholster, Gürtelmontage','Waffenzubehör',3,0.25,'Stück','lederbearbeitung_sattler','Revolverheld|Soldat|Wache|Kopfgeldjäger',[567,525],'Kleines angepasstes Lederbehältnis unter dem Patronengürtel.','Für eine konkret gewählte Waffe; Gürtel und Waffe separat.');
add('D005','Landkarte, Region','Schreibwaren',12,0.04,'Blatt','geografie_kartografie','Kundschafter|Prospektor|Fuhrmann|Schmuggler|Gelehrter',[145,146],'Mehrere Druck- und Zeichenarbeiten; unter einem gebundenen Tagebuch.','Veröffentlichte Karte, keine aktuelle Geheimaufklärung.');
add('D006','Seekarte, Küstenabschnitt','Schreibwaren',20,0.05,'Blatt','geografie_kartografie','Matrose|Schmuggler|Gelehrter',[145,197],'Fachliche Kartierung über dem Tagebuch, unter dem Quadranten.','Bekannter Küstenabschnitt; Aktualität und Region festlegen.');
add('D007','Jagdfalle, kleine Kastenfalle','Werkzeug',12,2,'Stück','holzbearbeitung_tischler','Jäger',[275,278],'Stabile kleine Holzkonstruktion mit einfacher Auslösung.','Für Kleinwild; keine automatisch festgelegten Fang- oder Schadenswerte.');
add('D008','Jagdfalle, Federbügel','Werkzeug',35,2.5,'Stück','schmied_feinschmied','Jäger',[725,739],'Stahlbügel und Federmechanismus oberhalb einfacher Handwerkzeuge.','Zielgröße wählen; konkrete Spielwirkung bleibt beim Jagdbaustein.');
add('D009','Saatgetreide, gereinigt','Saatgut',0.15,1,'Sack, 1 kg','landwirtschaft_getreidebauer','Bauer',[441],'Doppelter Haferpreis für ausgewähltes Saatgut.','Getreidesorte festlegen; kein pauschaler Flächenertrag.');
add('D010','Gemüsesaat, sortenrein','Saatgut',0.25,0.05,'Beutel, 50 g','landwirtschaft_gemuesebauer','Bauer',[441,454],'Kleine aufbereitete Saatgutmenge, mehr Arbeitsaufwand als Speiseware.','Eine Sorte je Beutel; Aussaatbedarf sortenabhängig.');
add('D011','Goldwaschpfanne','Werkzeug',5,0.7,'Stück','schmied_grobschmied','Prospektor',[675,732],'Geformte Metallpfanne zwischen Sieb und Schaufel.','Kein Ersatz für Prüfwaage oder Erzprobe.');
add('D012','Feinwaage mit Gewichten','Werkzeug',90,0.8,'Satz','mechanikus_feinmechaniker','Prospektor|Alchemist|Gelehrter',[678,583],'Feines Messgerät oberhalb Zirkel, unter schwerem Flaschenzug.','Tragbare Prüfwaage; keine moderne Präzisionsklasse zugesichert.');
add('D013','Handelswaage mit Gewichten','Werkzeug',40,3,'Satz','schmied_feinschmied','Händler|Verwalter',[725,678],'Balkenwaage mit Gewichten, weniger fein als Laborwaage.','Für Waren; keine automatische amtliche Eichung.');
add('D014','Grubenhelm, Leder mit Verstärkung','Arbeitskleidung',6,0.6,'Stück','lederbearbeitung_oberbekleidung','Bergmann',[477,767,841],'Verstärkte Lederkopfbedeckung oberhalb einfacher Kleidung.','Arbeitshelm ohne automatisch gewährten RS/RH; ersetzt Hut.');
add('D015','Grubenlampe, abgeschirmt','Beleuchtung',18,1,'Stück','schmied_feinschmied','Bergmann',[673,675],'Robusteres Gehäuse und Abschirmung gegenüber gewöhnlicher Laterne.','Keine Garantie gegen Grubengas; Licht- und Sicherheitsregeln separat. Öl nicht enthalten.');
add('D016','Sicherungsgurt mit Anschlagringen','Werkzeug',18,1.5,'Stück','lederbearbeitung_sattler','Bergmann|Zimmermann|Matrose',[535,567],'Belastbarer Ledergurt mit Metallbeschlägen in Sattelpreisnähe.','Seil und Verankerung separat; keine neue Traglastregel.');
add('D017','Rettungsring, Kork und Segeltuch','Schiffszubehör',8,2,'Stück','schneider_segelmacher','Matrose',[748,754],'Vernähte Schwimmhilfe mit Füllung über einer Hängematte.','Bordmittel; keine automatische Schwimmfertigkeit.');
add('D018','Geheimfach für Transportkiste','Fahrzeugzubehör',10,0.5,'Einbau','holzbearbeitung_tischler','Schmuggler',[275,278],'Anpassungsarbeit kostet mehr als die einfache Kiste.','Preis und Zusatzgewicht nur für den Einbau; Kiste separat. Keine garantierte Tarnwirkung.');
add('D019','Gefälschter Passierschein','Schreibwaren',25,0.02,'Dokument','drucker_lithograf','Schmuggler',[147,676],'Einzelanfertigung mit nachgeahmter Gestaltung statt Auflagendruck.','Nur Spielgegenstand; Gültigkeit und Entdeckungsprobe nicht im Kaufpreis enthalten.');
add('D020','Kamera, Plattenapparat mit Objektiv','Optik',600,5,'Stück','mechanikus_feinmechaniker','Journalist|Gelehrter',[192,195],'Optik plus lichtdichtes Gehäuse und Mechanik oberhalb eines Fernrohrs.','Ohne Stativ, Platten und Entwicklungschemie; kein Fotografiebonus.');
add('D021','Kamerastativ, Holz','Optik',20,3,'Stück','holzbearbeitung_tischler','Journalist|Gelehrter',[278,289],'Präzise klappbare Holzkonstruktion oberhalb einfacher Möbel.','Auch für passende Vermessungsgeräte nutzbar.');
add('D022','Fotoplatten, vorbereitet, sechs Stück','Fotomaterial',12,1,'Schachtel','glaser_apparateglaser','Journalist|Gelehrter',[182],'Sechs kleine Glasplatten mit Beschichtung; Preis nahe sechs Glasgefäßen.','Fotochemische Beschichtung als Zulieferarbeit enthalten; Belichtung und Entwicklung separat.');
add('D023','Fotochemie, Entwicklungssatz','Fotomaterial',8,0.5,'Satz für sechs Platten','alchemie_pigmentmacher','Journalist|Gelehrter',[54,136],'Kleine aufbereitete Chemikalienmenge unter einer Flasche reinen Alkohols.','Entwurfszuordnung für Bildchemie; genaue Rezeptur und Wirkungen nicht festgelegt.');
add('D024','Druckerpresse, Handbetrieb','Werkstattausstattung',1200,180,'Stück','mechanikus_maschinenbauer','Journalist',[583,586],'Große mechanische Presse, deutlich unter der komplexen Addiermaschine.','Stationär; Satzmaterial, Papier und Druckfarbe separat.');
add('D025','Drucklettern, Grundsatz mit Setzkasten','Werkstattausstattung',180,12,'Satz','drucker_stereotypeur','Journalist',[676,583],'Viele wiederverwendbare präzise Druckteile.','Eine Schrift und festgelegter Zeichenvorrat; ergänzt D024.');
add('D026','Druckfarbe, schwarz','Fotomaterial',4,0.5,'Dose','alchemie_pigmentmacher','Journalist',[54],'Dickflüssige Druckfarbe in größerer Menge als Schreib-Tinte.','Für Druckerpresse; nicht mit Fotochemie gleichsetzen.');
add('D027','Spielkarten, vollständiges Blatt','Spielwaren',2,0.08,'Satz','drucker_lithograf','Glücksspieler|Wirt|Künstler',[146,251],'Mehrfach bedruckter Karton, teurer als einfacher Würfelsatz.','Ein regional übliches Kartenspiel; keine Falschspielwirkung.');
add('D028','Spielkarten, markiertes Blatt','Spielwaren',8,0.08,'Satz','drucker_lithograf','Glücksspieler',[146,251],'Aufwendigere Sonderanfertigung gegenüber normalen Spielkarten.','Markierung als erzählerische Eigenschaft; Entdeckung und Nutzen regelabhängig.');
add('D029','Würfel, präpariert, drei Stück','Spielwaren',5,0.02,'Satz','holzbearbeitung_schnitzer','Glücksspieler',[251],'Mehrfache Kosten normaler Würfel für verdeckte Bearbeitung.','Keine garantierten Ergebnisse.');
add('D030','Amboss, Werkstatt','Werkstattausstattung',180,60,'Stück','schmied_grobschmied','Schmied|Waffenschmied|Rüstschmied',[725,741],'Großer bearbeiteter Stahlkörper; deutlich oberhalb Handwerkzeugen.','Stationärer Amboss ohne Unterbau.');
add('D031','Esse, fest, mit Feuerbett','Werkstattausstattung',120,80,'Stück','schmied_grobschmied','Schmied|Waffenschmied|Rüstschmied',[686,583],'Großer feuerfester Werkstattaufbau; Montage im Richtpreis enthalten.','Blasebalg, Brennstoff und Gebäude separat; Mauerarbeiten als Zulieferarbeit.');
add('D032','Blasebalg, Schmiede','Werkstattausstattung',45,8,'Stück','lederbearbeitung_sattler','Schmied|Waffenschmied|Rüstschmied',[535,741],'Große dichte Leder-Holz-Konstruktion oberhalb Sattelpreis.','Holzteile enthalten; Anschluss an Esse separat anpassen.');
add('D033','Werkbank mit Schraubstock','Werkstattausstattung',100,35,'Stück','holzbearbeitung_tischler','Schmied|Waffenschmied|Rüstschmied|Mechaniker|Zimmermann',[290,739],'Stabile Bank mit zugeliefertem Schraubstock etwas über Schreibtisch.','Stationär; Schraubstock bereits enthalten.');
add('D034','Präzisionswerkzeug, Waffenbau','Werkzeug',65,1.2,'Satz','schmied_feinschmied','Waffenschmied',[719,676,682],'Mehrere kleine Feilen, Prüflehren und Halter; oberhalb Dietrichsatz.','Ergänzt grobe Werkzeuge; keine universelle Eignung für jede Waffenmechanik.');
add('D035','Formwerkzeuge, Rüstungsbau','Werkzeug',55,5,'Satz','schmied_grobschmied','Rüstschmied',[725,729,741],'Treibhammer und drei kleine Formeinsätze.','Ergänzt Amboss; keine fertige Rüstung enthalten.');
add('D036','Rüstungsnieten, fünfzig Stück','Werkstattmaterial',5,0.3,'Schachtel','schmied_feinschmied','Rüstschmied',[706],'Kleine passend geformte Nieten leicht oberhalb Nagelschachtel.','Material und Durchmesser beim Auftrag festlegen.');
add('D037','Schraubendreher, drei Größen','Werkzeug',9,0.4,'Satz','schmied_feinschmied','Mechaniker|Waffenschmied',[707,739],'Drei einfache Werkzeuge mit Griffen.','Passende Schraubenköpfe vorausgesetzt.');
add('D038','Schraubenschlüssel, vier Größen','Werkzeug',16,1.2,'Satz','schmied_grobschmied','Mechaniker',[739,719],'Mehrere geformte Werkzeuge unter einem Hammer.','Größen nach Maschine wählen.');
add('D039','Schrauben und Muttern, zwanzig Paare','Werkstattmaterial',6,0.3,'Schachtel','schmied_feinschmied','Mechaniker|Waffenschmied',[706],'Gewindearbeit macht die kleinere Menge teurer als Nägel.','Ein abgestimmter Größensatz, kein Ersatz für jede Maschine.');
add('D040','Maschinenersatzteile, einfache Auswahl','Werkstattmaterial',30,2,'Satz','mechanikus_maschinenbauer','Mechaniker',[739,719,583],'Kleine Federn, Bolzen und Buchsen unter großem Hebezeug.','Für eine benannte Maschine; keine pauschale Reparaturgarantie.');
add('D041','Bauholz, Bretter, trocken','Baumaterial',4,10,'Bündel','holzbearbeitung_holzfaeller','Zimmermann|Bergmann|Bauer',[289,278],'Rohmaterial unter einem einfachen fertigen Tisch.','Abmessungen projektbezogen; trockenes Nutzholz, kein fertiger Bausatz.');
add('D042','Bauholz, Stützbalken','Baumaterial',6,15,'Stück','holzbearbeitung_holzfaeller','Zimmermann|Bergmann',[289,278],'Großer zugeschnittener Holzbalken ohne Möbelarbeit.','Passenden Querschnitt und Länge vor Einbau wählen.');
add('D043','Arzttasche, leer mit Innenfächern','Behälter',5,1,'Stück','lederbearbeitung_taeschner','Arzt|Heiler',[525,567],'Fächer und Verschlüsse oberhalb einfachem Ranzen.','Ersetzt für diesen Zweck P525; medizinischer Inhalt separat.');
add('D044','Verbände, sauber verpackt','Medizinischer Bedarf',1.5,0.15,'Satz mit fünf Binden','weber_leinweber','Arzt|Heiler|Soldat',[963,385],'Kleine Leinenmenge mit Zuschnitt und Verpackung.','Sauber ist nicht steril; keine Heilwirkung allein durch Besitz.');
add('D045','Verbände, sterilisiert und versiegelt','Medizinischer Bedarf',3,0.15,'Satz mit fünf Binden','weber_leinweber','Arzt|Heiler',[963,136],'Zuschnitt plus Aufbereitung und versiegelte Verpackung.','Sterilisationsleistung im Entwurf eingepreist, keine Anleitung; nach Öffnung Verbrauchsgut.');
add('D046','Chirurgische Instrumente, Grundsatz','Medizinischer Bedarf',75,0.8,'Satz','schmied_feinschmied','Arzt',[733,719,676],'Skalpell, medizinische Schere, Pinzette und zwei Klemmen mit feiner Bearbeitung.','Ersetzt P733 im chirurgischen Einsatz; keine allgemeine Werkzeugschere als Operationsinstrument.');
add('D047','Nahtmaterial, medizinisch','Medizinischer Bedarf',4,0.05,'Packung für fünf Versorgungen','schmied_feinschmied','Arzt',[707,385],'Feine Nadeln mit geeignetem Faden und Verpackung.','Faden als Zuliefermaterial enthalten; Spielbedarf ohne Behandlungsanleitung.');
add('D048','Reinigungsmittel, medizinisch','Medizinischer Bedarf',4,0.25,'Flasche, 0,2 l','alchemie_seifensieder','Arzt|Heiler',[60,136],'Kleine aufbereitete Lösung samt Behälter.','Entwurf eines Spielartikels; keine festgelegte Rezeptur oder Heilwirkung.');
add('D049','Instrumentenkessel mit Einsatz','Medizinischer Bedarf',18,2,'Satz','schmied_feinschmied','Arzt',[686,675],'Kleiner passender Kessel mit herausnehmbarem Einsatz.','Wärmequelle separat; kein automatischer Sterilitätsbonus.');
add('D050','Mörser mit Stößel, Keramik','Werkzeug',4,1,'Satz','toepfer_geschirr','Heiler|Alchemist|Gelehrter',[920,675],'Dickwandiges zweiteiliges Arbeitsgefäß.','Kein Rezept oder Wirkstoff enthalten.');
add('D051','Heilkräuter, getrocknet und beschriftet','Kräuter',2,0.1,'Beutel','pflanzenkunde_kraeuterkundler','Heiler|Arzt',[57,454],'Sortierung, Trocknung und Herkunftsangabe gegenüber gewöhnlicher Pflanzenware.','Eine lokale Pflanze je Beutel; konkrete Art und regelkonforme Verwendung beim Auftrag benennen. Keine erfundene DSA-Heilwirkung.');
add('D052','Kräuterkasten mit sechs Dosen','Behälter',6,1,'Satz','holzbearbeitung_tischler','Heiler|Alchemist',[275,920],'Unterteilter Kasten mit sechs kleinen Behältern.','Leer; ersetzt separate Behälter gleicher Funktion, Inhalt nicht doppelt zählen.');
add('D053','Retorte mit Stopfen, Glas','Laborbedarf',12,0.5,'Stück','glaser_apparateglaser','Alchemist',[180,182],'Geformtes Arbeitsglas aufwendiger als einfache Flasche.','Ohne Zutaten und Wärmequelle.');
add('D054','Destillierapparat, kleiner Tischaufbau','Laborbedarf',80,5,'Satz','glaser_apparateglaser','Alchemist',[180,182,686],'Mehrere passende Glasgefäße, Kühlteil, Verbindungen und Ständer.','Grundgefäße enthalten; nicht zusätzlich dieselbe Retorte kaufen. Wärmequelle und Zutaten separat.');
add('D055','Laborbrenner, Spiritus','Laborbedarf',8,0.4,'Stück','schmied_feinschmied','Alchemist|Arzt',[671,182],'Kleine geregelte Wärmequelle mit Docht und Deckel.','Brennstoff separat; keine moderne Sicherheitszertifizierung behauptet.');
add('D056','Fokusrohling, geschnitztes Holz','Magiebedarf',4,0.2,'Stück','holzbearbeitung_schnitzer','Magier',[243,676],'Verziertes kleines Werkstück, unter Werkzeugpreis.','Profaner Rohling; erst nach Magieregeln auswählen. Keine Zauberfähigkeit oder Verzauberung enthalten.');
add('D057','Ritualkreide, Farbsatz','Magiebedarf',0.5,0.1,'Schachtel','alchemie_pigmentmacher','Magier',[119,54],'Mehrere Pigmente und Kreidestücke über einfacher Schreibkreide.','Profanes Zeichenmaterial; keine automatische Ritualwirkung.');
add('D058','Räucherwerk, schlicht','Magiebedarf',1,0.05,'Beutel','pflanzenkunde_alchemistische_zutaten','Magier',[946,57],'Getrocknete aromatische Pflanzenteile, aufbereitete Kleinmenge.','Nur atmosphärisches Verbrauchsmittel, keine magische Wirkung festgelegt.');
add('D059','Fachbuch, gedruckt','Bücher',30,0.8,'Band','drucker_buchbinder','Gelehrter|Arzt|Verwalter|Mechaniker',[145],'Etwa doppeltes leeres Tagebuch für Satz, Inhalt und Bindung.','Ein benanntes Fachgebiet; keine automatische Fertigkeitssteigerung.');
add('D060','Magisches Lehrbuch, gedruckt','Bücher',60,1,'Band','drucker_buchbinder','Magier|Gelehrter',[145],'Kleinere Fachauflage und komplexe Darstellungen oberhalb gewöhnlicher Fachliteratur.','Magieform, Schule und Lehrinhalt benennen; weder Zauberkauf noch Artefakt im Buchpreis.');
add('D061','Probenausrüstung, Feldsatz','Forschungsbedarf',12,1.2,'Satz','holzbearbeitung_tischler','Gelehrter|Prospektor',[275,181,146],'Kleiner Kasten, vier Glasfläschchen, sechs Beutel und Etiketten.','Leer; Glas und Textil als Zulieferteile enthalten. Ersetzt entsprechende Einzelbehälter.');
add('D062','Siegelstempel, persönliche Gravur','Schreibwaren',12,0.1,'Stück','schmied_feinschmied','Verwalter|Händler',[676,677],'Kleiner gravierter Stempel samt Entwurfsarbeit.','Kein amtlicher Status durch Erwerb; rechtmäßige Berechtigung separat.');
add('D063','Stempel, Schriftzug','Schreibwaren',4,0.08,'Stück','holzbearbeitung_schnitzer','Verwalter|Händler',[676,245],'Einfacher geschnittener Druckstock.','Farbe separat; keine behördliche Berechtigung enthalten.');
add('D064','Siegellack','Schreibwaren',0.5,0.05,'Stange','alchemie_leimsieder','Verwalter|Händler',[64,54],'Kleine gefärbte Harz-Leim-Menge.','Verbrauchsmaterial zum Siegeln.');
add('D065','Formulare, unbeschrieben, zehn Stück','Schreibwaren',2,0.08,'Schachtel','drucker_lithograf','Verwalter|Händler|Wache',[146],'Papierkosten plus wiederholter einfacher Druck.','Kein ausgestelltes amtliches Dokument; Inhalt und Unterzeichnung separat.');
add('D066','Arbeitsschürze, Leder','Arbeitskleidung',2.5,0.7,'Stück','lederbearbeitung_oberbekleidung','Schmied|Waffenschmied|Rüstschmied|Mechaniker',[477,841],'Einfaches robustes Lederstück mit Riemen nahe Lederweste.','Über Alltagskleidung tragen; kein RS/RH.');
add('D067','Arbeitsschürze, Leinen','Arbeitskleidung',0.4,0.2,'Stück','schneider_konfektionsschneider','Wirt|Heiler|Arzt|Alchemist',[796,784],'Einfacher Zuschnitt zwischen Hemd und Hose.','Waschbare Arbeitsschürze, keine Schutzwirkung gegen Chemikalien zugesichert.');

if (new Set(items.map(item => item.id)).size !== items.length) throw new Error('Doppelte Entwurfs-ID');
const clothing = read('src/addins/npc/data/grundkleidung.json');
const money = value => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 3 }).format(value);
const doc = [
  '# Fehlende Artikel und Kleidung – Katalogentwurf', '',
  'Stand: 9. September 2026. Alle 67 D-Artikel einschließlich Preisen, Gewichten, Zuordnungen und Begründungen wurden vom Nutzer bestätigt und in den SPOT übernommen: `werte 0.8-claude.xlsx`, Preisliste Zeilen 974–1040; Kleidungsregeln und Begründungen in Entwickeln Zeilen 45–123. Die Arbeitsmappe ist für weitere Änderungen maßgeblich. Die Übernahme in den aktiven App-Kaufkatalog steht noch aus. D-IDs bleiben stabile Entwurfsreferenzen, P-Referenzen bezeichnen Preislistenzeilen. Keine Recherche realer Marktpreise.', '',
  '## Preis- und Zuordnungsgrundlage', '',
  'Preise in Dublonen gelten je angegebener Verkaufseinheit, Gewichte einschließlich üblicher Behälter beziehungsweise bei Einbauten als Zusatzgewicht. Gewöhnliche Ausführung; Qualität und individuelle Anpassung werden später abgestimmt. Preisanker dienen dem Vergleich, nicht einer verbindlichen Herstellungsformel. Bestehende Preise schwanken stark: P725 Hammer 20 D, P195 Lupe 176 D, P586 Addiermaschine 8.800 D. Diese Unterschiede werden nicht pauschal geglättet.', '',
  'Jeder neue Artikel besitzt eine tatsächlich vorhandene WHK-Spezialisierung mit Regelreferenz. Bei zusammengesetzten Artikeln ist die federführende Herstellung zugeordnet; Zulieferteile sind im beschriebenen Umfang enthalten. Herstellung, Benutzung und berufliche Kernfertigkeit bleiben getrennt. Neue Artikel gewähren keine erfundenen Heil-, Magie-, Kampf- oder Fertigkeitsboni.', '',
  '## Neue Artikel', '',
  '| ID | Artikel / Verkaufseinheit | Dublonen | kg | WHK → Spezialisierung | Für Berufe |',
  '|---|---|---:|---:|---|---|',
  ...items.map(item => `| ${item.id} | ${item.name} · ${item.einheit} | ${money(item.preisDublonen)} | ${money(item.gewichtKg)} | ${item.whkCraftSkill} → ${item.spezialisierung} | ${item.berufe.join(', ')} |`), '',
  '## Umfang und Preisanker je Artikel', '',
];
for (const item of items) {
  doc.push(`**${item.id} – ${item.name}:** ${item.notiz} Preisansatz: ${item.begruendung} Vergleich: ${item.preisanker.map(a => `P${a.sourceRow} ${byRow.get(a.sourceRow).name} (${money(a.preisDublonen)} D)`).join('; ')}. Regelreferenz: \`${item.specializationRef}\`.`, '');
}

doc.push('## Gemeinsame Grundkleidung für alle 30 Berufe', '',
  'Jeder NPC erhält gewöhnliche, passend zugeschnittene Alltagskleidung. Vorhandene gleichwertige Teile erfüllen den Bedarf; kein doppelter Kauf durch Zweitberuf oder Lebenswelt. Hose oder Rock mit Oberteil beziehungsweise ein Kleid sind mögliche Alternativen, unabhängig vom Geschlecht. Kleidung ersetzt keine Rüstung und erhält keine Rüstungswerte.', '',
  '| Bereich | Standard aus bestehender Preisliste | Dublonen | kg | WHK → Spezialisierung |', '|---|---|---:|---:|---|');
let clothingPrice = 0;
let clothingWeight = 0;
for (const slot of clothing) {
  const item = byRow.get(slot.sourceRow);
  if (!item?.preisAvailable || !item.spezialisierung || !Number.isFinite(item.gewichtKg)) throw new Error('Grundkleidung nicht auflösbar');
  clothingPrice += item.preisDublonen;
  clothingWeight += item.gewichtKg;
  doc.push(`| ${slot.bereich} | P${item.sourceRow} ${item.name} | ${money(item.preisDublonen)} | ${money(item.gewichtKg)} | ${item.whkCraftSkill} → ${item.spezialisierung} |`);
}
doc.push('', `**Standard gesamt: ${money(clothingPrice)} D, ${money(clothingWeight)} kg** je vollständigem Katalogsatz. Das vorläufige Anschaffungsbudget wird auf Cent aufgerundet. Ein Satz Strümpfe wird wie im bestehenden Katalog als eine Verkaufseinheit behandelt; dessen Stück-/Paar-Bezeichnung bleibt ein Datenpflegepunkt.`, '',
  'Neue Vorschauen der sechs Referenz-NPCs ergänzen ausschließlich fehlende Bekleidungsbereiche. Die Bauernvorlage bleibt bereits vollständig bekleidet. Fünf andere Vorlagen erhalten die Grundkleidung; ihr bisher provisorisch an die Anschaffungskosten gebundenes Budget wird um die Kleidungskosten erweitert. Diese Ergänzung ist keine allgemeine Geldzuteilung für den künftigen Generator. Historische Referenzdateien und bereits gespeicherte Charaktere werden nicht verändert.', '',
  '## Berufliche und klimatische Varianten', '',
  '| Einsatz | Ergänzung oder Ersatz |', '|---|---|',
  '| Reiten, Viehtrieb, berittener Dienst | Reiterstiefel P559 statt Schuhe; Reitmantel P819 statt Wollmantel; Handschuhe P477 optional. Stück/Paar bei Stiefeln vor endgültiger Mengenkalkulation prüfen. |',
  '| Seefahrt | Teerjacke P804 statt Wollmantel bei nassem Decksdienst; Wechselwäsche für längere Fahrt. |',
  '| Schmiede, Waffen- und Rüstungsbau, Mechanik | Lederschürze D066 und gegebenenfalls Handschuhe P477 zusätzlich. |',
  '| Wirt, Arzt, Heiler, Alchemist | Leinenschürze D067; Wechselhemd P796 für längere Arbeit. |',
  '| Bergbau | Grubenhelm D014 statt Hut, Handschuhe P477 und auf Auftrag abgestimmte Sicherung. |',
  '| Wache und Soldat | Schnitt/Farbe und Abzeichen D002 kennzeichnen Dienstkleidung; Uniform ersetzt passende Alltagsstücke, keine zweite Pflichtgarnitur. |',
  '| Künstler und Glücksspieler | Auftrittskleidung aus vorhandenen Kleidungsartikeln passend zur Rolle; etwa Weste P841 oder Kleid P809 als Alternative. Ballkleid P873 bleibt teure Sonderoption. |',
  '| Magier, Gelehrter, Verwalter, Händler, Journalist | Reguläre Alltagskleidung; repräsentative Kleidung nach sozialer Lage, keine automatische Robe. |',
  '| Kaltes Terrain | Woll-/Fellvarianten ersetzen leichte Teile; Kälteschutzbedarf separat prüfen. |',
  '| Alle übrigen Berufe | Gemeinsame Grundkleidung; Tätigkeit, Klima und Lebenswelt bestimmen Abweichungen. |', '',
  'Die auffällige Preisangabe P800 Lederjacke (0,0018 D) wird für diese Vorschläge nicht verwendet und nicht still korrigiert. Fachliche Anpassungen an Volk, Körperbau und Ausrüstung sind weiterhin nötig.', '',
  '## Bereits vorhandene Artikel statt Neuerfindungen', '',
  '- Tierbedarf: Hafer P441, Pferdefutter P446 und Heu P447 existieren. Futterbedarf ist abhängig von Tier und Dauer; bei P446 umfasst die Katalogeinheit sieben Tage. Unbekannte Gewichte nicht als null behandeln.',
  '- Transport: Reit- und Packtiere, Sättel, Geschirre, Wagen und Schiffe existieren. Gespanne, Zuladung und dienstlichen Besitz als Auswahlbedingungen bearbeiten, keine zusätzlichen Fantasieartikel anlegen.',
  '- Versorgung: Lebensmittel, Getränke, Kohle P263, Seife P60, Wasserbehälter und Reisebedarf existieren. Bedarf nach Personen, Tieren, Betrieb und Reisedauer berechnen.',
  '- Munition und Waffen: vorhandene Fachkataloge anhand konkreter Waffe und Mechanik verwenden. Keine universelle Patrone oder pauschale Waffenwirkung ergänzen.',
  '- Sicherheitsausstattung: D014–D016, vorhandene Seile, Handschuhe und Stützbalken D042 liefern einzelne Bausteine; daraus keine garantierte vollständige Absicherung jeder Grube ableiten.',
  '- Magische Wirkungen und Heilverfahren bleiben Regeln, keine neuen Kaufartikel. D051 und D056–D060 konkretisieren Material und Bücher; konkrete Pflanzen, Rezepturen, Schulen und Zauber müssen zum jeweiligen Auftrag passen.', '',
  '## Abdeckung der bisherigen offenen Punkte', '',
  '| Beruf | Neue Artikel / vorhandene Auswahl |', '|---|---|');
for (const profile of profiles) {
  const selected = items.filter(item => item.berufe.includes(profile.beruf));
  doc.push(`| ${profile.beruf} | ${selected.length ? selected.map(item => `${item.id} ${item.name}`).join('; ') : 'Vorhandener Katalog und gemeinsame Grundkleidung; keine weiteren konkreten Neuanlagen erforderlich.'} |`);
}
doc.push('', 'Mengen, Qualität, Privat-/Dienstbesitz, regionale Verfügbarkeit und regelabhängige Anwendung bleiben Entscheidungen des NPC-Auftrags. Jeder bisher benannte konkrete fehlende Artikel hat hier eine bestätigte Ergänzung oder eine vorhandene Bezugsquelle. Die Artikel sind im SPOT gespeichert, werden aber noch nicht automatisch ins Inventar übernommen.', '');

fs.writeFileSync(path.join(root,'src/addins/npc/data/artikelentwuerfe.draft.json'), JSON.stringify({ status:'bestaetigt', datum:'2026-09-09', spot:'werte 0.8-claude.xlsx', spotSheet:'Preisliste', appKatalogSynchronisiert:false, waehrung:'Dublonen', items }, null, 2) + '\n');
fs.writeFileSync(path.join(root,'src/addins/npc/docs/Artikelentwuerfe.md'), doc.join('\n'));
console.log(`${items.length} Artikelentwürfe mit gültigen WHK-Regelreferenzen; ${names.size} Berufe abgedeckt. Grundkleidung: ${money(clothingPrice)} D / ${money(clothingWeight)} kg.`);
