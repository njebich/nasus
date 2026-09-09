# Berufsausrüstung: Draft für 30 Berufe

Stand: 9. September 2026. Ausrüstungsvorschläge auf Grundlage des vorhandenen Katalogs; noch keine automatische Inventarvergabe. Generiert mit `node src/addins/npc/scripts/berufsausruestung.mjs`.

## Verwendung

- Jeder aufgeführte Artikel besitzt seine vorhandene Zuordnung **WHK → Spezialisierung**. Sie wird unverändert aus der Preisliste übernommen und bezeichnet überwiegend Herstellung oder Beschaffung, nicht die zum Benutzen erforderliche Fertigkeit. Ein Zimmermann darf einen Hammer aus Schmied → Grobschmied benutzen, ohne dafür Schmied lernen zu müssen.
- Die Quellenreferenz P plus Zahl bezeichnet `sourceRow` in `src/data/equipment/preisliste.json`. Doppelte Namen sind dadurch unterscheidbar. Preise, Gewichte, Mengen und Einheiten weiterhin aus dieser Quelle beziehen.
- Pro Nennung zunächst eine Katalogeinheit als Planungsvorschlag, nicht zwingend ein einzelnes Stück: beispielsweise enthält P146 zehn Bögen Papier. Verbrauchsmengen erst anhand Auftrag und Dauer festlegen. Eine leere Verbrauchsspalte bedeutet keine geprüfte Verbrauchsfreiheit.
- Arbeitsmittel bilden einen ersten Kern. Optionen einzeln nach Schwerpunkt wählen; sie sind kein Pflichtpaket. Offene Punkte müssen vor einer vollständigen Berufsausstattung geklärt werden.
- Qualität billig/gewöhnlich/gehoben/elitär separat wählen; Professionsgüte bestimmt keine Besitzqualität. Keine neuen Preisfaktoren aus diesem Draft ableiten.
- Besitz pro Artikel später als persönlich, dienstlich, geliehen oder Betriebsmittel festlegen. Transportoptionen sind keine automatische Zuteilung. Tiere, Geschirr, Wagen, Futter, Traglast und Reisebedarf gemeinsam prüfen; unbekannte Gewichte sind nicht null.
- Gemeinsame Artikel aus Beruf, Zweitberuf und Lebenswelt zusammenführen. Werkzeuge nicht blind verdoppeln; Verbrauchsmengen nach Bedarf summieren. Keine Paketpreise oder Vollständigkeit behaupten, solange offene Teile bestehen.

## Waffen, Rüstung und Grundbedarf

Die folgende Liste behandelt Arbeitsausrüstung einschließlich vorhandenen Waffenzubehörs. Die drei Waffenoptionen des gemeinsamen Templates bleiben eine eigene Auswahl: mindestens eine Nahkampf- und eine Fernkampfwaffe, abgestimmt auf Volk, Voraussetzungen, Kampfstil und Budget. Zubehör nur zur tatsächlich gewählten Mechanik übernehmen. Ein Patronenbeutel legt weder Munitionstyp noch enthaltenen Vorrat fest.

Waffenkataloge verwenden andere Zuordnungen: Die Felder Hauptfertigkeit/Spezialisierung in Nahkampfwaffen bezeichnen die Kampfanwendung; bei Fernkampfartikeln können dieselben Felder ausdrücklich den improvisierten Nahkampfeinsatz abbilden. Sie dürfen nicht als Schusswaffenspezialisierung oder Herstellung gelesen werden. Rüstung besitzt wiederum keine gleichartige Spezialisierungsspalte. Konkrete Waffen- und Rüstungsbausteine sind deshalb separat regelgerecht zuzuordnen.

Alle 30 Berufsprofile erhalten die gemeinsame [Grundkleidung](Artikelentwuerfe.md#gemeinsame-grundkleidung-für-alle-30-berufe), vorhandene Teile werden angerechnet. Neue Referenz-NPCs erhalten fehlende Kleidung bereits in der Vorschau. Allgemeine Nahrung, Wasserfüllung und Unterkunft ergänzen Lebenswelt und Reiseauftrag.

Die bisherigen Lücken wurden im [Artikelentwurf](Artikelentwuerfe.md) mit Preisen und Gewichten ausgearbeitet und am 9. September 2026 bestätigt. Die 67 Artikel stehen im SPOT `werte 0.8-claude.xlsx`, Preisliste Zeilen 974–1040. Nachfolgende Prüfvermerke dokumentieren die Ausgangslage; D-Referenzen nennen die Ergänzungen. Ihre Übernahme in den aktiven App-Kaufkatalog steht noch aus.

## Wache

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Laterne, Sturm-, Öl | Schmied → Feinschmied | P673 |
| Arbeitsmittel | Seil, Fessel- 1m | Seiler → Stricke | P907 |
| Verbrauchsmaterial | Öl, Lampen- | Viehwirtschaft → Tierische Fette | P948 |
| Optional / Schwerpunkt | Buch, Tage-, Papier | Drucker → Buchbinder | P145 |
| Optional / Schwerpunkt | Gänsekiele, Griffel 10 St, | Viehwirtschaft → Geflügelwirtschaft | P927 |
| Optional / Schwerpunkt | Fernrohr | Glaser → Optiker | P192 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Am Posten oder am Gürtel; Dienstmittel gesondert kennzeichnen.

**Bisheriger Prüfvermerk:** Handschellen und Dienstabzeichen fehlen als konkrete Artikel.

**Neue Ergänzungsentwürfe:** D001 Handschellen mit zwei Schlüsseln; D002 Dienstabzeichen, geprägt; D003 Fahndungsblatt, gedruckt; D004 Revolverholster, Gürtelmontage; D065 Formulare, unbeschrieben, zehn Stück – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Soldat

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Pflegeutensilien, Waffen- | Kaufmann → Krämer | P384 |
| Arbeitsmittel | Flasche, Feld-, 1L | Lederbearbeitung → Sattler | P523 |
| Arbeitsmittel | Rucksack, Leder-, 15Kg | Lederbearbeitung → Sattler | P526 |
| Verbrauchsmaterial | Streichhölzer 25St, | Alchemie → Brandbeschleuniger | P52 |
| Optional / Schwerpunkt | Schlafsack | Schneider → Decken | P749 |
| Optional / Schwerpunkt | Zelt, 2 Personen | Schneider → Decken | P750 |
| Optional / Schwerpunkt | Ladestock, Gewehr- | Feuerwaffenbauer → Vorlagen | P150 |
| Optional / Schwerpunkt | Horn, Pulver- | Lederbearbeitung → Waffenzubehör | P570 |
| Optional / Schwerpunkt | Patronenbeutel, 30 Patronen | Lederbearbeitung → Waffenzubehör | P574 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Persönliches Marschgepäck; Lagerausstattung kann dem Verband gehören.

**Bisheriger Prüfvermerk:** Munition und Ladezubehör erst nach Waffenmechanik bestimmen.

**Neue Ergänzungsentwürfe:** D002 Dienstabzeichen, geprägt; D004 Revolverholster, Gürtelmontage; D044 Verbände, sauber verpackt – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Kopfgeldjäger

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Seil, Fessel- 1m | Seiler → Stricke | P907 |
| Arbeitsmittel | Kompass, Hand- | Glaser → Scheiben | P201 |
| Arbeitsmittel | Rucksack, Leder-, 15Kg | Lederbearbeitung → Sattler | P526 |
| Verbrauchsmaterial | Streichhölzer 25St, | Alchemie → Brandbeschleuniger | P52 |
| Optional / Schwerpunkt | Fernrohr | Glaser → Optiker | P192 |
| Optional / Schwerpunkt | Buch, Tage-, Papier | Drucker → Buchbinder | P145 |
| Optional / Schwerpunkt | Gänsekiele, Griffel 10 St, | Viehwirtschaft → Geflügelwirtschaft | P927 |
| Optional / Schwerpunkt | Seil, Hanf, 10m | Seiler → Stricke | P909 |
| Transportoption | Pferd, Reit | Abrichten → Pferd | P12 |
| Transportoption | Sattel | Lederbearbeitung → Sattler | P535 |
| Transportoption | Zaum, einfach | Lederbearbeitung → Riemer | P494 |
| Transportoption | Taschen, Sattel- | Lederbearbeitung → Sattler | P543 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Zu Fuß oder beritten; Sattelzeug nur gemeinsam mit passendem Tier.

**Bisheriger Prüfvermerk:** Handschellen und Fahndungsunterlagen fehlen als eigene Artikel.

**Neue Ergänzungsentwürfe:** D001 Handschellen mit zwei Schlüsseln; D003 Fahndungsblatt, gedruckt; D004 Revolverholster, Gürtelmontage – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Revolverheld

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Pflegeutensilien, Waffen- | Kaufmann → Krämer | P384 |
| Arbeitsmittel | Gürtel, Patronen- | Lederbearbeitung → Waffenzubehör | P567 |
| Optional / Schwerpunkt | Patronenbeutel, 30 Patronen | Lederbearbeitung → Waffenzubehör | P574 |
| Optional / Schwerpunkt | Taschenuhr, zw, | Mechanikus → Uhrmacher | P589 |
| Optional / Schwerpunkt | Flasche, Feld-, 1L | Lederbearbeitung → Sattler | P523 |
| Transportoption | Pferd, Reit | Abrichten → Pferd | P12 |
| Transportoption | Sattel | Lederbearbeitung → Sattler | P535 |
| Transportoption | Zaum, einfach | Lederbearbeitung → Riemer | P494 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Gürtel und kleine Reisetasche; Reitausstattung optional.

**Bisheriger Prüfvermerk:** Revolverholster fehlt; Patronengürtel ersetzt kein Holster. Munition waffenabhängig.

**Neue Ergänzungsentwürfe:** D004 Revolverholster, Gürtelmontage – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Kundschafter

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Kompass, Hand- | Glaser → Scheiben | P201 |
| Arbeitsmittel | Rucksack, Leder-, 15Kg | Lederbearbeitung → Sattler | P526 |
| Arbeitsmittel | Flasche, Feld-, 1L | Lederbearbeitung → Sattler | P523 |
| Verbrauchsmaterial | Streichhölzer 25St, | Alchemie → Brandbeschleuniger | P52 |
| Optional / Schwerpunkt | Fernrohr | Glaser → Optiker | P192 |
| Optional / Schwerpunkt | Seil, Hanf, 10m | Seiler → Stricke | P909 |
| Optional / Schwerpunkt | Schlafsack | Schneider → Decken | P749 |
| Optional / Schwerpunkt | Zelt, 2 Personen | Schneider → Decken | P750 |
| Optional / Schwerpunkt | Buch, Tage-, Papier | Drucker → Buchbinder | P145 |
| Optional / Schwerpunkt | Gänsekiele, Griffel 10 St, | Viehwirtschaft → Geflügelwirtschaft | P927 |
| Transportoption | Pferd, Reit | Abrichten → Pferd | P12 |
| Transportoption | Sattel | Lederbearbeitung → Sattler | P535 |
| Transportoption | Zaum, einfach | Lederbearbeitung → Riemer | P494 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Leichtes Reisegepäck; Tier nur bei berittenem Schwerpunkt.

**Bisheriger Prüfvermerk:** Regionale Karten fehlen als konkrete Artikel.

**Neue Ergänzungsentwürfe:** D005 Landkarte, Region – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Jäger

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Messer | Schmied → Grobschmied | P730 |
| Arbeitsmittel | Schnur, 20m | Seiler → Stricke | P906 |
| Arbeitsmittel | Rucksack, Leder-, 15Kg | Lederbearbeitung → Sattler | P526 |
| Verbrauchsmaterial | Streichhölzer 25St, | Alchemie → Brandbeschleuniger | P52 |
| Optional / Schwerpunkt | Horn, Jagd- | Instrumentenbauer → Blasinstrumente | P320 |
| Optional / Schwerpunkt | Angelhaken und Schnur | Schmied → Grobschmied | P708 |
| Optional / Schwerpunkt | Netz, Fischer- klein | Seiler → Netze | P903 |
| Optional / Schwerpunkt | Schlafsack | Schneider → Decken | P749 |
| Optional / Schwerpunkt | Zelt, 2 Personen | Schneider → Decken | P750 |
| Transportoption | Pferd, Reit | Abrichten → Pferd | P12 |
| Transportoption | Sattel, Pack- | Lederbearbeitung → Sattler | P527 |
| Transportoption | Zaum, einfach | Lederbearbeitung → Riemer | P494 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Werkzeug und Beute getragen; Packtier optional.

**Bisheriger Prüfvermerk:** Jagdfallen fehlen; Angelschnur und Netz nur beim passenden Schwerpunkt.

**Neue Ergänzungsentwürfe:** D007 Jagdfalle, kleine Kastenfalle; D008 Jagdfalle, Federbügel – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Viehhirte

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Lasso, Leder | Lederbearbeitung → Riemer | P500 |
| Arbeitsmittel | Zeug, Striegel- | Holzbearbeitung → Bürstenbinder | P255 |
| Arbeitsmittel | Flasche, Feld-, 1L | Lederbearbeitung → Sattler | P523 |
| Optional / Schwerpunkt | Decke, Pferde- | Schneider → Decken | P753 |
| Optional / Schwerpunkt | Handschuhe, Leder, gewöhnlich | Lederbearbeitung → Oberbekleidung | P477 |
| Optional / Schwerpunkt | Seil, Hanf, 10m | Seiler → Stricke | P909 |
| Transportoption | Pferd, Reit | Abrichten → Pferd | P12 |
| Transportoption | Sattel | Lederbearbeitung → Sattler | P535 |
| Transportoption | Zaum, einfach | Lederbearbeitung → Riemer | P494 |
| Transportoption | Taschen, Sattel- | Lederbearbeitung → Sattler | P543 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Beritten bei Viehtrieb; Herde ist Betriebsbestand, kein persönliches Inventar.

**Bisheriger Prüfvermerk:** Futter und Wasservorräte nach Tier und Reisedauer ergänzen.

**Neue Ergänzungsentwürfe:** Vorhandener Katalog ausreichend; Auswahl und Mengen nach Auftrag. – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Bauer

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Spaten | Schmied → Grobschmied | P738 |
| Arbeitsmittel | Gabel, Mist- | Schmied → Grobschmied | P721 |
| Arbeitsmittel | Eimer, Holz | Holzbearbeitung → Alltagsgegenstände | P236 |
| Optional / Schwerpunkt | Dreschflegel | Schmied → Grobschmied | P716 |
| Optional / Schwerpunkt | Sense | Schmied → Grobschmied | P736 |
| Optional / Schwerpunkt | Sichel | Schmied → Grobschmied | P737 |
| Optional / Schwerpunkt | Korb, 20Kg | Holzbearbeitung → Korbflechter | P266 |
| Optional / Schwerpunkt | Sack, 50Kg | Schneider → Taschen | P879 |
| Transportoption | Wagen, Leiter-, 1spännig | Holzbearbeitung → Wagner | P313 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Werkzeug am Hof; Wagen und Zugtier als Betriebsmittel.

**Bisheriger Prüfvermerk:** Saatgut nach Anbauschwerpunkt zuordnen; Wagen ohne Zugtier ist kein vollständiges Gespann.

**Neue Ergänzungsentwürfe:** D009 Saatgetreide, gereinigt; D010 Gemüsesaat, sortenrein; D041 Bauholz, Bretter, trocken – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Prospektor

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Hacke, Spitz- | Schmied → Grobschmied | P722 |
| Arbeitsmittel | Schaufel | Schmied → Grobschmied | P732 |
| Arbeitsmittel | Beutel, Tuch-, 5 Kg | Schneider → Taschen | P876 |
| Verbrauchsmaterial | Streichhölzer 25St, | Alchemie → Brandbeschleuniger | P52 |
| Optional / Schwerpunkt | Lupe | Glaser → Optiker | P195 |
| Optional / Schwerpunkt | Kompass, Hand- | Glaser → Scheiben | P201 |
| Optional / Schwerpunkt | Sieb | Schmied → Feinschmied | P675 |
| Optional / Schwerpunkt | Buch, Tage-, Papier | Drucker → Buchbinder | P145 |
| Optional / Schwerpunkt | Gänsekiele, Griffel 10 St, | Viehwirtschaft → Geflügelwirtschaft | P927 |
| Transportoption | Pferd, Reit | Abrichten → Pferd | P12 |
| Transportoption | Sattel, Pack- | Lederbearbeitung → Sattler | P527 |
| Transportoption | Zaum, einfach | Lederbearbeitung → Riemer | P494 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Probenbeutel und Werkzeug getragen; Packtier bei längeren Reisen.

**Bisheriger Prüfvermerk:** Goldwaschpfanne und Prüfwaage fehlen; Haushaltssieb ist kein geprüftes Goldwaschset.

**Neue Ergänzungsentwürfe:** D005 Landkarte, Region; D011 Goldwaschpfanne; D012 Feinwaage mit Gewichten; D061 Probenausrüstung, Feldsatz – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Bergmann

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Hacke, Spitz- | Schmied → Grobschmied | P722 |
| Arbeitsmittel | Hammer | Schmied → Grobschmied | P725 |
| Arbeitsmittel | Laterne, Sturm-, Öl | Schmied → Feinschmied | P673 |
| Verbrauchsmaterial | Öl, Lampen- | Viehwirtschaft → Tierische Fette | P948 |
| Optional / Schwerpunkt | Keile | Schmied → Grobschmied | P728 |
| Optional / Schwerpunkt | Meißel, 5 sort, | Schmied → Grobschmied | P729 |
| Optional / Schwerpunkt | Flaschenzug, 1t | Mechanikus → Einfache Mechanismen | P583 |
| Optional / Schwerpunkt | Handschuhe, Leder, gewöhnlich | Lederbearbeitung → Oberbekleidung | P477 |
| Transportoption | Karren, 2rädrig | Holzbearbeitung → Wagner | P299 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Stollenwerkzeug; Fördermittel gehören zum Betrieb.

**Bisheriger Prüfvermerk:** Grubenhelm und vollständige Sicherheitsausstattung fehlen. Sprengmittel nicht pauschal zuweisen.

**Neue Ergänzungsentwürfe:** D014 Grubenhelm, Leder mit Verstärkung; D015 Grubenlampe, abgeschirmt; D016 Sicherungsgurt mit Anschlagringen; D041 Bauholz, Bretter, trocken; D042 Bauholz, Stützbalken – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Fuhrmann

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Zaum und Leinen je Tier | Lederbearbeitung → Riemer | P490 |
| Arbeitsmittel | Zeug, Striegel- | Holzbearbeitung → Bürstenbinder | P255 |
| Arbeitsmittel | Hammer | Schmied → Grobschmied | P725 |
| Arbeitsmittel | Zange | Schmied → Grobschmied | P739 |
| Verbrauchsmaterial | Deichselfett | Viehwirtschaft → Tierische Fette | P949 |
| Optional / Schwerpunkt | Rad, Ersatz- | Holzbearbeitung → Wagner | P294 |
| Optional / Schwerpunkt | Deichsel | Holzbearbeitung → Wagner | P293 |
| Optional / Schwerpunkt | Seil, Hanf, 10m | Seiler → Stricke | P909 |
| Optional / Schwerpunkt | Kiste, Transport- | Holzbearbeitung → Tischler | P275 |
| Transportoption | Wagen, Kasten-, 1- oder 2spännig | Holzbearbeitung → Wagner | P312 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Wagen als Arbeitsmittel; Zugtier, Geschirr und Traglast separat abstimmen.

**Bisheriger Prüfvermerk:** Zugtier und Geschirr müssen zur konkreten Wagenbespannung passen.

**Neue Ergänzungsentwürfe:** D005 Landkarte, Region – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Matrose

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Messer | Schmied → Grobschmied | P730 |
| Arbeitsmittel | Schnur, 20m | Seiler → Stricke | P906 |
| Verbrauchsmaterial | Nadel und Faden, sort, | Kaufmann → Krämer | P385 |
| Optional / Schwerpunkt | Hängematte | Schneider → Decken | P748 |
| Optional / Schwerpunkt | Tau, 20m | Seiler → Stricke | P913 |
| Optional / Schwerpunkt | Kompaß, Schiffs- | Glaser → Scheiben | P199 |
| Optional / Schwerpunkt | Quadrant | Glaser → Optiker | P197 |
| Optional / Schwerpunkt | Flaschenzug, 1t | Mechanikus → Einfache Mechanismen | P583 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Persönlicher Seesack; Navigation und Tauwerk können Schiffseigentum sein.

**Bisheriger Prüfvermerk:** Kein persönliches Schiff als Standard; Schiff, Rettungsmittel und Bordvorräte separat.

**Neue Ergänzungsentwürfe:** D006 Seekarte, Küstenabschnitt; D016 Sicherungsgurt mit Anschlagringen; D017 Rettungsring, Kork und Segeltuch – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Schmuggler

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Kiste, Transport- | Holzbearbeitung → Tischler | P275 |
| Arbeitsmittel | Sack, 10Kg | Schneider → Taschen | P878 |
| Arbeitsmittel | Seil, Hanf, 10m | Seiler → Stricke | P909 |
| Optional / Schwerpunkt | Kompass, Hand- | Glaser → Scheiben | P201 |
| Optional / Schwerpunkt | Laterne, Sturm-, Öl | Schmied → Feinschmied | P673 |
| Optional / Schwerpunkt | Fernrohr | Glaser → Optiker | P192 |
| Transportoption | Wagen, Kasten-, 1- oder 2spännig | Holzbearbeitung → Wagner | P312 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Frachtbehälter; Wagen nur bei Landtransport, andere Transportwege separat.

**Bisheriger Prüfvermerk:** Versteckte Fächer und gefälschte Papiere fehlen als Artikel. Fracht ist kein persönlicher Besitz.

**Neue Ergänzungsentwürfe:** D005 Landkarte, Region; D006 Seekarte, Küstenabschnitt; D018 Geheimfach für Transportkiste; D019 Gefälschter Passierschein – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Händler

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Buch, Tage-, Papier | Drucker → Buchbinder | P145 |
| Arbeitsmittel | Gänsekiele, Griffel 10 St, | Viehwirtschaft → Geflügelwirtschaft | P927 |
| Arbeitsmittel | Abakus | Holzbearbeitung → Alltagsgegenstände | P244 |
| Arbeitsmittel | Beutelchen, Geld- | Schneider → Taschen | P877 |
| Verbrauchsmaterial | Tinte | Alchemie → Farbstoffe | P54 |
| Verbrauchsmaterial | Papier, 10 Bögen | Drucker → Papierherstellung | P146 |
| Optional / Schwerpunkt | Kiste, Transport- | Holzbearbeitung → Tischler | P275 |
| Optional / Schwerpunkt | Addiermaschine | Mechanikus → Rechenmaschinen | P586 |
| Transportoption | Wagen, Kasten-, 1- oder 2spännig | Holzbearbeitung → Wagner | P312 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Handelsunterlagen getragen; Warenbestand und Frachttransport separat.

**Bisheriger Prüfvermerk:** Handelswaage fehlt. Waren nach Warengruppe wählen, kein pauschaler Handelsbestand.

**Neue Ergänzungsentwürfe:** D013 Handelswaage mit Gewichten; D062 Siegelstempel, persönliche Gravur; D063 Stempel, Schriftzug; D064 Siegellack; D065 Formulare, unbeschrieben, zehn Stück – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Wirt

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Krug, Ton- | Töpfer → Geschirr | P921 |
| Arbeitsmittel | Becher, Trink- Ton | Töpfer → Geschirr | P919 |
| Arbeitsmittel | Löffel, Holz- | Holzbearbeitung → Alltagsgegenstände | P239 |
| Arbeitsmittel | Topf, Eisen-, 12L | Schmied → Grobschmied | P690 |
| Optional / Schwerpunkt | Kelle, Schöpf-, Zinn | Goldschmied → Zinngerät | P232 |
| Optional / Schwerpunkt | Becher, Trink- Holz | Holzbearbeitung → Alltagsgegenstände | P237 |
| Optional / Schwerpunkt | Besen | Holzbearbeitung → Bürstenbinder | P257 |
| Optional / Schwerpunkt | Buch, Tage-, Papier | Drucker → Buchbinder | P145 |
| Optional / Schwerpunkt | Gänsekiele, Griffel 10 St, | Viehwirtschaft → Geflügelwirtschaft | P927 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Überwiegend stationärer Betrieb; Geschirr ist Betriebsausstattung.

**Bisheriger Prüfvermerk:** Lebensmittel, Getränke und Brennstoff nach Betrieb und Gästezahl ergänzen.

**Neue Ergänzungsentwürfe:** D027 Spielkarten, vollständiges Blatt; D067 Arbeitsschürze, Leinen – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Journalist

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Buch, Tage-, Papier | Drucker → Buchbinder | P145 |
| Arbeitsmittel | Gänsekiele, Griffel 10 St, | Viehwirtschaft → Geflügelwirtschaft | P927 |
| Verbrauchsmaterial | Tinte | Alchemie → Farbstoffe | P54 |
| Verbrauchsmaterial | Papier, 10 Bögen | Drucker → Papierherstellung | P146 |
| Optional / Schwerpunkt | Hülle, Pergament- | Lederbearbeitung → Sattler | P524 |
| Optional / Schwerpunkt | Lupe | Glaser → Optiker | P195 |
| Optional / Schwerpunkt | Taschenuhr, zw, | Mechanikus → Uhrmacher | P589 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Tragbares Schreibzeug; Druckerei als externer Betrieb.

**Bisheriger Prüfvermerk:** Kamera, Fotomaterial und Druckerpresse fehlen als konkrete Artikel.

**Neue Ergänzungsentwürfe:** D003 Fahndungsblatt, gedruckt; D020 Kamera, Plattenapparat mit Objektiv; D021 Kamerastativ, Holz; D022 Fotoplatten, vorbereitet, sechs Stück; D023 Fotochemie, Entwicklungssatz; D024 Druckerpresse, Handbetrieb; D025 Drucklettern, Grundsatz mit Setzkasten; D026 Druckfarbe, schwarz – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Künstler

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Ranzen, Leder-, 8Kg | Lederbearbeitung → Sattler | P525 |
| Optional / Schwerpunkt | Flöte, Holz | Instrumentenbauer → Blasinstrumente | P318 |
| Optional / Schwerpunkt | Laute, Bandurria | Instrumentenbauer → Saiteninstrumente | P325 |
| Optional / Schwerpunkt | Jonglierbälle 3 | Holzbearbeitung → Alltagsgegenstände | P247 |
| Optional / Schwerpunkt | Jonglierkeulen 3 | Holzbearbeitung → Alltagsgegenstände | P248 |
| Optional / Schwerpunkt | Larve, gewöhnlich | Holzbearbeitung → Schnitzen | P271 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Ein Instrument oder passende Requisiten wählen; keine Pflicht zu allen Kunstformen.

**Bisheriger Prüfvermerk:** Bühnenkostüm aus Kleidung nach Auftritt wählen; Verbrauchsmittel abhängig von Kunstform.

**Neue Ergänzungsentwürfe:** D027 Spielkarten, vollständiges Blatt – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Dieb

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Dietriche, sort, | Schmied → Feinschmied | P682 |
| Arbeitsmittel | Taschen, Gürtel- | Lederbearbeitung → Sattler | P529 |
| Optional / Schwerpunkt | Brecheisen | Schmied → Grobschmied | P715 |
| Optional / Schwerpunkt | Haken, Wurf- 10m Seil | Schmied → Grobschmied | P724 |
| Optional / Schwerpunkt | Spiegel, Hand- Glas | Glaser → Scheiben | P200 |
| Optional / Schwerpunkt | Laterne, Sturm-, Öl | Schmied → Feinschmied | P673 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Kleine Werkzeuge getragen; sperriges Einbruchswerkzeug nur nach Auftrag.

**Bisheriger Prüfvermerk:** Keine automatische Kampffertigkeit durch Besitz eines Werkzeugs.

**Neue Ergänzungsentwürfe:** Vorhandener Katalog ausreichend; Auswahl und Mengen nach Auftrag. – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Glücksspieler

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Würfel, Bein, 3 Stück | Holzbearbeitung → Alltagsgegenstände | P251 |
| Arbeitsmittel | Beutelchen, Geld- | Schneider → Taschen | P877 |
| Optional / Schwerpunkt | Buch, Tage-, Papier | Drucker → Buchbinder | P145 |
| Optional / Schwerpunkt | Gänsekiele, Griffel 10 St, | Viehwirtschaft → Geflügelwirtschaft | P927 |
| Optional / Schwerpunkt | Taschenuhr, zw, | Mechanikus → Uhrmacher | P589 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Kleine tragbare Spielausstattung; Würfel nur für Würfelspiel.

**Bisheriger Prüfvermerk:** Spielkarten und gezinkte Spielmittel fehlen als Artikel; Falschspiel bleibt optional.

**Neue Ergänzungsentwürfe:** D027 Spielkarten, vollständiges Blatt; D028 Spielkarten, markiertes Blatt; D029 Würfel, präpariert, drei Stück – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Schmied

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Hammer | Schmied → Grobschmied | P725 |
| Arbeitsmittel | Zange, Schmiede- | Schmied → Grobschmied | P741 |
| Arbeitsmittel | Feile für Metall | Schmied → Grobschmied | P719 |
| Verbrauchsmaterial | Kohle, Holz | Holzbearbeitung → Köhler | P263 |
| Optional / Schwerpunkt | Hammer, Vorschlag- | Schmied → Grobschmied | P726 |
| Optional / Schwerpunkt | Meißel, 5 sort, | Schmied → Grobschmied | P729 |
| Optional / Schwerpunkt | Handschuhe, Leder, gewöhnlich | Lederbearbeitung → Oberbekleidung | P477 |
| Optional / Schwerpunkt | Kiste, Transport- | Holzbearbeitung → Tischler | P275 |
| Transportoption | Karren, 2rädrig | Holzbearbeitung → Wagner | P299 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Tragbare Werkzeuge plus stationäre Schmiede; Karren für schwere Lasten.

**Bisheriger Prüfvermerk:** Amboss, Esse und Blasebalg fehlen; Werkzeugliste ist noch keine vollständige Schmiede.

**Neue Ergänzungsentwürfe:** D030 Amboss, Werkstatt; D031 Esse, fest, mit Feuerbett; D032 Blasebalg, Schmiede; D033 Werkbank mit Schraubstock; D066 Arbeitsschürze, Leder – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Waffenschmied

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Hammer | Schmied → Grobschmied | P725 |
| Arbeitsmittel | Feile für Metall | Schmied → Grobschmied | P719 |
| Arbeitsmittel | Zange | Schmied → Grobschmied | P739 |
| Arbeitsmittel | Pflegeutensilien, Waffen- | Kaufmann → Krämer | P384 |
| Verbrauchsmaterial | Kohle, Holz | Holzbearbeitung → Köhler | P263 |
| Optional / Schwerpunkt | Zange, Schmiede- | Schmied → Grobschmied | P741 |
| Optional / Schwerpunkt | Zange, Kugel- | Schmied → Grobschmied | P740 |
| Optional / Schwerpunkt | Bleischmelzlöffel | Schmied → Grobschmied | P714 |
| Optional / Schwerpunkt | Ladestock, Gewehr- | Feuerwaffenbauer → Vorlagen | P150 |
| Optional / Schwerpunkt | Ladestock, Pistolen- | Feuerwaffenbauer → Vorlagen | P151 |
| Optional / Schwerpunkt | Lupe | Glaser → Optiker | P195 |
| Transportoption | Karren, 2rädrig | Holzbearbeitung → Wagner | P299 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Werkbank und Schmiede stationär; Wartungssatz tragbar.

**Bisheriger Prüfvermerk:** Amboss, Esse, Werkbank und Präzisionswerkzeuge fehlen. Lade- und Kugelwerkzeuge nur für passende Feuerwaffen.

**Neue Ergänzungsentwürfe:** D030 Amboss, Werkstatt; D031 Esse, fest, mit Feuerbett; D032 Blasebalg, Schmiede; D033 Werkbank mit Schraubstock; D034 Präzisionswerkzeug, Waffenbau; D037 Schraubendreher, drei Größen; D039 Schrauben und Muttern, zwanzig Paare; D066 Arbeitsschürze, Leder – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Rüstschmied

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Hammer | Schmied → Grobschmied | P725 |
| Arbeitsmittel | Zange, Schmiede- | Schmied → Grobschmied | P741 |
| Arbeitsmittel | Feile für Metall | Schmied → Grobschmied | P719 |
| Arbeitsmittel | Zange | Schmied → Grobschmied | P739 |
| Verbrauchsmaterial | Kohle, Holz | Holzbearbeitung → Köhler | P263 |
| Optional / Schwerpunkt | Meißel, 5 sort, | Schmied → Grobschmied | P729 |
| Optional / Schwerpunkt | Ahle | Schmied → Grobschmied | P707 |
| Optional / Schwerpunkt | Handschuhe, Leder, gewöhnlich | Lederbearbeitung → Oberbekleidung | P477 |
| Transportoption | Karren, 2rädrig | Holzbearbeitung → Wagner | P299 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Werkstattbetrieb; kleine Reparaturausstattung tragbar.

**Bisheriger Prüfvermerk:** Amboss, Esse, Formwerkzeuge und Rüstungsnieten fehlen als konkrete Artikel.

**Neue Ergänzungsentwürfe:** D030 Amboss, Werkstatt; D031 Esse, fest, mit Feuerbett; D032 Blasebalg, Schmiede; D033 Werkbank mit Schraubstock; D035 Formwerkzeuge, Rüstungsbau; D036 Rüstungsnieten, fünfzig Stück; D066 Arbeitsschürze, Leder – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Mechaniker

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Zange | Schmied → Grobschmied | P739 |
| Arbeitsmittel | Feile für Metall | Schmied → Grobschmied | P719 |
| Arbeitsmittel | Hammer | Schmied → Grobschmied | P725 |
| Optional / Schwerpunkt | Lupe | Glaser → Optiker | P195 |
| Optional / Schwerpunkt | Flaschenzug, 1t | Mechanikus → Einfache Mechanismen | P583 |
| Optional / Schwerpunkt | Meißel, 5 sort, | Schmied → Grobschmied | P729 |
| Optional / Schwerpunkt | Lineal, Messing | Schmied → Feinschmied | P677 |
| Optional / Schwerpunkt | Kiste, Transport- | Holzbearbeitung → Tischler | P275 |
| Transportoption | Karren, 2rädrig | Holzbearbeitung → Wagner | P299 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Werkzeugkasten tragbar; schwere Hebemittel stationär oder auf Karren.

**Bisheriger Prüfvermerk:** Schraubendreher, Schraubenschlüssel, Schrauben und Maschinenersatzteile fehlen als konkrete Artikel.

**Neue Ergänzungsentwürfe:** D033 Werkbank mit Schraubstock; D037 Schraubendreher, drei Größen; D038 Schraubenschlüssel, vier Größen; D039 Schrauben und Muttern, zwanzig Paare; D040 Maschinenersatzteile, einfache Auswahl; D059 Fachbuch, gedruckt; D066 Arbeitsschürze, Leder – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Zimmermann

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Hammer | Schmied → Grobschmied | P725 |
| Arbeitsmittel | Fuchsschwanz | Schmied → Grobschmied | P720 |
| Arbeitsmittel | Hobel | Schmied → Grobschmied | P727 |
| Arbeitsmittel | Lineal, Holz | Holzbearbeitung → Alltagsgegenstände | P245 |
| Verbrauchsmaterial | 50 Nägel, sort, | Schmied → Grobschmied | P706 |
| Optional / Schwerpunkt | Feile für Holz | Schmied → Grobschmied | P718 |
| Optional / Schwerpunkt | Keile | Schmied → Grobschmied | P728 |
| Optional / Schwerpunkt | Meißel, 5 sort, | Schmied → Grobschmied | P729 |
| Optional / Schwerpunkt | Senkblei | Schmied → Grobschmied | P735 |
| Optional / Schwerpunkt | Axt, Holzfäller- | Schmied → Grobschmied | P709 |
| Transportoption | Karren, 2rädrig | Holzbearbeitung → Wagner | P299 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Tragbares Werkzeug; Bauholz und Großgerät zur Baustelle liefern.

**Bisheriger Prüfvermerk:** Holzbedarf nach Bauauftrag bestimmen; keine pauschale mobile Vollwerkstatt.

**Neue Ergänzungsentwürfe:** D016 Sicherungsgurt mit Anschlagringen; D033 Werkbank mit Schraubstock; D041 Bauholz, Bretter, trocken; D042 Bauholz, Stützbalken – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Arzt

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Ranzen, Leder-, 8Kg | Lederbearbeitung → Sattler | P525 |
| Arbeitsmittel | Flasche, Glas-, 0,1L | Glaser → Alltagsgegenstände | P181 |
| Arbeitsmittel | Schere | Schmied → Grobschmied | P733 |
| Optional / Schwerpunkt | Lupe | Glaser → Optiker | P195 |
| Optional / Schwerpunkt | Buch, Tage-, Papier | Drucker → Buchbinder | P145 |
| Optional / Schwerpunkt | Gänsekiele, Griffel 10 St, | Viehwirtschaft → Geflügelwirtschaft | P927 |
| Optional / Schwerpunkt | Tinte | Alchemie → Farbstoffe | P54 |
| Optional / Schwerpunkt | Papier, 10 Bögen | Drucker → Papierherstellung | P146 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Tasche und Dokumentation tragbar; stationäre Behandlungsmittel separat.

**Bisheriger Prüfvermerk:** Arzttasche mit Innenausstattung, sterile Verbände, chirurgische Instrumente und medizinische Verbrauchsmittel fehlen. Allgemeine Schere ist kein geprüftes Operationsinstrument.

**Neue Ergänzungsentwürfe:** D043 Arzttasche, leer mit Innenfächern; D044 Verbände, sauber verpackt; D045 Verbände, sterilisiert und versiegelt; D046 Chirurgische Instrumente, Grundsatz; D047 Nahtmaterial, medizinisch; D048 Reinigungsmittel, medizinisch; D049 Instrumentenkessel mit Einsatz; D051 Heilkräuter, getrocknet und beschriftet; D055 Laborbrenner, Spiritus; D059 Fachbuch, gedruckt; D067 Arbeitsschürze, Leinen – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Heiler

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Korb, 20Kg | Holzbearbeitung → Korbflechter | P266 |
| Arbeitsmittel | Flasche, Glas-, 0,1L | Glaser → Alltagsgegenstände | P181 |
| Arbeitsmittel | Beutel, Tuch-, 5 Kg | Schneider → Taschen | P876 |
| Verbrauchsmaterial | Fett, Salben-, pflanzlich | Alchemie → Fettprodukte | P57 |
| Optional / Schwerpunkt | Schere | Schmied → Grobschmied | P733 |
| Optional / Schwerpunkt | Ranzen, Leder-, 8Kg | Lederbearbeitung → Sattler | P525 |
| Optional / Schwerpunkt | Buch, Tage-, Papier | Drucker → Buchbinder | P145 |
| Optional / Schwerpunkt | Gänsekiele, Griffel 10 St, | Viehwirtschaft → Geflügelwirtschaft | P927 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Sammelbehälter und Vorräte tragbar; Menge nach Versorgungsauftrag.

**Bisheriger Prüfvermerk:** Mörser, Verbände und geprüfte Heilkräuterzuordnung fehlen. Salbenfett allein hat keine Heilwirkung; DSA-Pflanzen nicht ohne Regelprüfung übernehmen.

**Neue Ergänzungsentwürfe:** D043 Arzttasche, leer mit Innenfächern; D044 Verbände, sauber verpackt; D045 Verbände, sterilisiert und versiegelt; D048 Reinigungsmittel, medizinisch; D050 Mörser mit Stößel, Keramik; D051 Heilkräuter, getrocknet und beschriftet; D052 Kräuterkasten mit sechs Dosen; D067 Arbeitsschürze, Leinen – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Alchemist

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Flasche, Glas-, 0,1L | Glaser → Alltagsgegenstände | P181 |
| Arbeitsmittel | Flasche, Glas-, 0,2L | Glaser → Alltagsgegenstände | P182 |
| Arbeitsmittel | Stundenglas | Glaser → Alchemistische Apparaturen | P180 |
| Arbeitsmittel | Kiste, Transport- | Holzbearbeitung → Tischler | P275 |
| Verbrauchsmaterial | Alkohol, rein | Brenner → Alchemistische Zutaten | P136 |
| Optional / Schwerpunkt | Lupe | Glaser → Optiker | P195 |
| Optional / Schwerpunkt | Sieb | Schmied → Feinschmied | P675 |
| Optional / Schwerpunkt | Fett, Salben-, pflanzlich | Alchemie → Fettprodukte | P57 |
| Optional / Schwerpunkt | Salpeter, Salz | Bergbau → Salze | P125 |
| Optional / Schwerpunkt | Schwefel | Bergbau → Salze | P126 |
| Transportoption | Karren, 2rädrig | Holzbearbeitung → Wagner | P299 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Geschützte Behälter; Labor überwiegend stationär, Karren optional.

**Bisheriger Prüfvermerk:** Retorten, Destillierapparat, Mörser und Feinwaage fehlen. Zutaten nur rezeptbezogen auswählen; kein automatisches Explosiv- oder Giftpaket.

**Neue Ergänzungsentwürfe:** D012 Feinwaage mit Gewichten; D050 Mörser mit Stößel, Keramik; D052 Kräuterkasten mit sechs Dosen; D053 Retorte mit Stopfen, Glas; D054 Destillierapparat, kleiner Tischaufbau; D055 Laborbrenner, Spiritus; D067 Arbeitsschürze, Leinen – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Magier

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Buch, Tage-, Papier | Drucker → Buchbinder | P145 |
| Arbeitsmittel | Gänsekiele, Griffel 10 St, | Viehwirtschaft → Geflügelwirtschaft | P927 |
| Arbeitsmittel | Ranzen, Leder-, 8Kg | Lederbearbeitung → Sattler | P525 |
| Verbrauchsmaterial | Tinte | Alchemie → Farbstoffe | P54 |
| Verbrauchsmaterial | Papier, 10 Bögen | Drucker → Papierherstellung | P146 |
| Optional / Schwerpunkt | Hülle, Pergament- | Lederbearbeitung → Sattler | P524 |
| Optional / Schwerpunkt | Lupe | Glaser → Optiker | P195 |
| Optional / Schwerpunkt | Prisma | Glaser → Optiker | P196 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Tragbares Studienmaterial; tatsächliche Magieausstattung nach Ausbildungszweig.

**Bisheriger Prüfvermerk:** Regelgebundene Foki, Ritualmittel und Schulbücher müssen aus der gewählten Magie abgeleitet werden; kein pauschaler Zauberbonus.

**Neue Ergänzungsentwürfe:** D056 Fokusrohling, geschnitztes Holz; D057 Ritualkreide, Farbsatz; D058 Räucherwerk, schlicht; D060 Magisches Lehrbuch, gedruckt – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Gelehrter

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Buch, Tage-, Papier | Drucker → Buchbinder | P145 |
| Arbeitsmittel | Gänsekiele, Griffel 10 St, | Viehwirtschaft → Geflügelwirtschaft | P927 |
| Arbeitsmittel | Hülle, Pergament- | Lederbearbeitung → Sattler | P524 |
| Verbrauchsmaterial | Tinte | Alchemie → Farbstoffe | P54 |
| Verbrauchsmaterial | Papier, 10 Bögen | Drucker → Papierherstellung | P146 |
| Optional / Schwerpunkt | Lupe | Glaser → Optiker | P195 |
| Optional / Schwerpunkt | Kompass, Hand- | Glaser → Scheiben | P201 |
| Optional / Schwerpunkt | Fernrohr, Himmels- | Glaser → Optiker | P193 |
| Optional / Schwerpunkt | Beutel, Tuch-, 5 Kg | Schneider → Taschen | P876 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Schreibzeug und wenige Fachmittel tragbar; große Instrumente stationär.

**Bisheriger Prüfvermerk:** Fachbücher, Karten und fachspezifische Probenausrüstung fehlen als konkrete Artikel.

**Neue Ergänzungsentwürfe:** D005 Landkarte, Region; D006 Seekarte, Küstenabschnitt; D012 Feinwaage mit Gewichten; D020 Kamera, Plattenapparat mit Objektiv; D021 Kamerastativ, Holz; D022 Fotoplatten, vorbereitet, sechs Stück; D023 Fotochemie, Entwicklungssatz; D050 Mörser mit Stößel, Keramik; D059 Fachbuch, gedruckt; D060 Magisches Lehrbuch, gedruckt; D061 Probenausrüstung, Feldsatz – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Verwalter

| Bereich | Artikel | WHK → Spezialisierung | Quelle |
|---|---|---|---|
| Arbeitsmittel | Buch, Tage-, Papier | Drucker → Buchbinder | P145 |
| Arbeitsmittel | Gänsekiele, Griffel 10 St, | Viehwirtschaft → Geflügelwirtschaft | P927 |
| Arbeitsmittel | Abakus | Holzbearbeitung → Alltagsgegenstände | P244 |
| Verbrauchsmaterial | Tinte | Alchemie → Farbstoffe | P54 |
| Verbrauchsmaterial | Papier, 10 Bögen | Drucker → Papierherstellung | P146 |
| Optional / Schwerpunkt | Addiermaschine | Mechanikus → Rechenmaschinen | P586 |
| Optional / Schwerpunkt | Zinsspindel | Mechanikus → Rechenmaschinen | P587 |
| Optional / Schwerpunkt | Taschenuhr, zw, | Mechanikus → Uhrmacher | P589 |
| Optional / Schwerpunkt | Kiste, Transport- | Holzbearbeitung → Tischler | P275 |

**Kleidung:** Gemeinsame Grundkleidung; berufliche und klimatische Varianten siehe [Artikelentwürfe](Artikelentwuerfe.md).

**Transport und Besitz:** Schreibzeug tragbar; Rechenmaschinen und Aktenlager stationär.

**Bisheriger Prüfvermerk:** Siegel, Stempel und amtliche Formulare fehlen als konkrete Artikel.

**Neue Ergänzungsentwürfe:** D002 Dienstabzeichen, geprägt; D013 Handelswaage mit Gewichten; D059 Fachbuch, gedruckt; D062 Siegelstempel, persönliche Gravur; D063 Stempel, Schriftzug; D064 Siegellack; D065 Formulare, unbeschrieben, zehn Stück – [Preise und Einzelheiten](Artikelentwuerfe.md).

## Katalogprüfung und Grenzen

Geprüft: 972 Preislistenzeilen; 30 Berufe, 117 unterschiedliche ausgewählte Artikel. Jeder ausgewählte Artikel hat eine nichtleere WHK- und Spezialisierungszuordnung ohne XXX oder Platzhalter.

Vier allgemeine Katalogzeilen sind nicht als konkrete Ausrüstungsartikel geeignet: P69 Elixiere und P668 Stoffarten tragen Platzhalter; P972 und P973 sind Reisekosten mit XXX-Zuordnungen. Keine davon wird verwendet.

Vorhandene Zuordnungstexte sind noch kein Beleg einer auflösbaren WHK-Regelreferenz. Beispielsweise verwendet der Katalog Goldschmied, während die aktuelle WHK-Hauptliste Buntmetallschmied führt. Solche Altdaten bleiben sichtbar erhalten. Vor automatischer Fertigkeitsverknüpfung sind Namen und Spezialisierungen gesondert abzugleichen.

Die neuen D-Artikel sind separat als Entwurf mit Preisen und gültigen WHK-Regelreferenzen erfasst. Vor einer automatischen Vergabe Mengen, Besitz, Qualität und die separaten Kampfbausteine abstimmen. Historische Prüfvermerke werden durch die verlinkten Ergänzungen konkretisiert.
