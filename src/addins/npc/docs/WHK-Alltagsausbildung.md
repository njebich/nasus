# WHK-Alltagsausbildung nach Beruf und Professionsgüte

Stand: 12. September 2026. Im Nutzerauftrag konkretisierter **Planungsentwurf**, noch keine bestätigten Zahlen und keine Generatorumsetzung. Die 30 Berufe und die sechs Gütebereiche werden beibehalten. „Rang“ wird hier als Professionsgüte ausgearbeitet; militärische Ränge werden zusätzlich unten behandelt und bleiben gemäß bestätigtem Stand rein beschreibend.

## Verbindliche Grundlage

- Mindestens `ceil(Gesamt-SP × 0,05)` tatsächlich für WHK-Hauptfertigkeiten und Spezialisierungen ausgeben: auf Stufe 0 mindestens 320 SP. Dies ist eine Untergrenze, kein zusätzlich abzuziehendes Paket.
- Beruf, Terrain, Lebenswelt und soziale Lage zählen gemeinsam. Bestätigte Hintergrundbeiträge weiterhin addieren; gleiche Quelle nur einmal verwenden. Kosten aus den Endwerten einmal berechnen.
- Spezialisierung höchstens so hoch wie ihre Hauptfertigkeit. Keine erfundenen Regelreferenzen. Kampf, Magie, GF/SF, SSK und Attribute gehören nicht in diese Rechnung.
- Militärischer Rang, Amt und Rechtsstand erzeugen keine automatischen Werte. Kreis und Professionsgüte sind unabhängig; jede Kombination muss finanzierbar sein.

Quellen: [Berufe](Berufsstruktur.md), [Terrain](Terrain-Katalog.md), [Lebenswelt](Lebenswelt-Katalog.md), [soziale Lage](Soziale-Lage.md), [Budgetgrundlage](Budgetgrundlage.md), [militärische Ränge](Militaerischer-Rang.md). Kosten: `src/data/rules-jsonl/whk.jsonl`, `src/data/lookups.json` und `src/engine/whkCustomSpezialisierung.ts`.

## Ziele pro Ausbildungsrang — Vorschlag

Jeder Beruf erhält einen Schwerpunkt K1, eine ergänzende Kernfertigkeit K2 und zwei Nebenfertigkeiten N1/N2. Dazu gehört genau eine passende Spezialisierung S unter K1, sofern eine sachlich passende Katalogauswahl existiert. Die Zahlen sind Mindestziele für die Hauptfertigkeiten selbst; S wird nicht auf K1 aufgeschlagen, um einen Gütebereich vorzutäuschen. Die Mitte des Gütebereichs dient als Standard; ein ausdrücklich gewählter anderer Wert innerhalb des Bereichs ist möglich.

| Professionsgüte | Bestehender Bereich | K1 | K2 | N1 und N2 jeweils | S unter K1 | Berufskosten ab 0, mit S |
|---|---:|---:|---:|---:|---:|---:|
| Laie | 0–4 | 3 | 2 | 2 | 2 | 51 SP |
| Geselle | 5–8 | 6 | 4 | 3 | 4 | 74 SP |
| Meister | 9–12 | 10 | 8 | 4 | 6 | 136 SP |
| Experte | 13–16 | 14 | 12 | 6 | 8 | 243 SP |
| Großmeister | 17–20 | 18 | 16 | 8 | 10 | 391 SP |
| Koryphäe | 21–24 | 22 | 20 | 10 | 12 | 581 SP |

Die Kosten gelten für vier unterschiedliche Hauptfertigkeiten und eine Spezialisierung ohne vorhandene Werte, Hintergrund oder Alltagsausbildung. Fehlt eine passende S, entfällt sie samt Kosten; keinen Ersatznamen erfinden. K1 wird dadurch nicht abgesenkt. Größere fachliche Breite oder stärkere Spezialisierung sind zusätzliche begründete Käufe. Die Tabelle verspricht keine vollständige Berufsqualifikation für Kampf- oder Magieberufe.

## Konkrete Berufsmatrix

Alle vier Spalten beziehen ihre Werte aus derselben Gütezeile. `oder` verlangt genau eine Schwerpunktwahl, nicht den Kauf aller Alternativen. Die ersten genannten Alternativen sind Standardvorschläge. Alltag beschreibt die praktische Aufgabe, keine weitere Fertigkeit.

| Beruf | K1 | K2 | N1 | N2 | Praktischer Alltag |
|---|---|---|---|---|---|
| Wache | Ermittlung | Rechtskunde | Etikette | Führung | Kontrollen, Vorfälle aufnehmen, Bürger ansprechen |
| Soldat | Militärtheorie | Überleben | Logistik | Hauswirtschaft | Dienstabläufe, Lager, Material und Versorgung |
| Kopfgeldjäger | Ermittlung | Überleben | Rechtskunde | Jäger | Spuren verfolgen und Überstellung vorbereiten |
| Revolverheld | Ermittlung | Rechtskunde | Feuerwaffenbauer | Etikette | Schutzaufträge einschätzen, Waffenpflege, Duellregeln |
| Kundschafter | Überleben | Geografie | Ermittlung | Militärtheorie | Routen, Geländeberichte und Beobachtung |
| Jäger | Jäger | Überleben | Pflanzenkunde | Viehwirtschaft | Wild finden, verwerten und Lager versorgen |
| Viehhirte | Viehwirtschaft | Abrichten | Überleben | Landwirtschaft | Tiere versorgen, Herden und Weiden betreuen |
| Bauer | Landwirtschaft | Viehwirtschaft | Pflanzenkunde | Hauswirtschaft | Anbau, Tiere, Vorräte und Hofarbeit |
| Prospektor | Geologie | Bergbau | Geografie | Überleben | Lagerstätten suchen und Gelände beurteilen |
| Bergmann | Bergbau | Geologie | Mechanikus | Logistik | Abbau, Stollensicherheit und Förderung |
| Fuhrmann | Fuhrmann | Logistik | Abrichten | Mechanikus | Fracht, Zugtiere und Wagen betreuen |
| Matrose | Seefahrt | Seiler | Bootsbauer | Geografie | Decksdienst, Tauwerk und einfache Reparaturen |
| Schmuggler | Logistik | Diebeskunst | Kaufmann | Fuhrmann oder Seefahrt | Verdeckte Transporte und Warenübergaben |
| Händler | Kaufmann | Buchhaltung | Rechtskunde | Wirtschaftslehre | Waren, Abrechnung und Verträge |
| Wirt | Gastgewerbe | Koch | Hauswirtschaft | Buchhaltung | Gäste, Küche, Vorräte und Abrechnung |
| Journalist | Ermittlung | Schriftstellerei | Rechtskunde | Fotografie oder Drucker | Recherchieren, prüfen und berichten |
| Künstler | Musizieren oder Schauspielkunst oder Tänzer | Etikette | Schriftstellerei | Gastgewerbe | Auftritte vorbereiten und Engagements organisieren |
| Dieb | Diebeskunst | Ermittlung | Kaufmann | Rechtskunde | Zugänge erkunden, Beute einschätzen und absetzen |
| Glücksspieler | Schauspielkunst | Etikette | Kaufmann | Ermittlung | Auftreten, Einsätze und Mitspieler einschätzen |
| Schmied | Schmied | Metallurgie | Gießer | Kaufmann | Metallarbeiten, Werkstatt und Materialeinkauf |
| Waffenschmied | Waffenschmied oder Feuerwaffenbauer | Schmied | Metallurgie | Mechanikus | Waffen fertigen, warten und reparieren |
| Rüstschmied | Rüstungsschmied | Schmied | Metallurgie | Lederbearbeitung | Rüstungsteile, Beschläge und Riemen bearbeiten |
| Mechaniker | Mechanikus | Physik | Schmied | Eisenbahner oder Logistik | Geräte warten, Fehler finden und Material planen |
| Zimmermann | Zimmerei | Holzbearbeitung | Architektur | Bootsbauer oder Kaufmann | Holzbauten, Reparaturen und Materialbedarf |
| Arzt | Medizin | Biologie | Chemie | Hauswirtschaft | Patienten versorgen, Hygiene und Praxisbetrieb |
| Heiler | Medizin | Pflanzenkunde | Biologie | Hauswirtschaft | Wundversorgung, Kräuter und Pflege |
| Alchemist | Alchemie | Chemie | Pflanzenkunde | Metallurgie | Stoffe prüfen und Laborvorräte bearbeiten |
| Magier | Magietheorie | Geschichte oder Theologie | Schriftstellerei | Hauswirtschaft | Fachstudium, Aufzeichnungen und Arbeitsraum |
| Gelehrter | Geschichte oder Biologie oder Sprachwissenschaft | Schriftstellerei | Administration | Etikette | Forschung, Quellen, Aufzeichnungen und Austausch |
| Verwalter | Administration | Buchhaltung | Rechtskunde | Logistik | Akten, Bestände und Abläufe betreuen |

Bei ausdrücklich anderem Fachgebiet von Magier/Gelehrtem eine vorhandene WHK wählen und den Grund dokumentieren. K1/K2/N1/N2 müssen unterschiedliche Referenzen bleiben.

S richtet sich nach dem konkreten Schwerpunkt, etwa Bauer → Getreidebauer (`whk_spez_landwirtschaft_getreidebauer`), Wache → Observation (`whk_spez_ermittlung_observation`), Soldat → Taktik (`whk_spez_militaertheorie_taktik`), Händler → Krämer (`whk_spez_kaufmann_kraemer`). Keine Spezialisierung allein wegen verfügbarer Rest-SP wählen.

**Grenzen:** Beim Revolverhelden beschreibt K1 nur die WHK-Seite des Auftragsgeschäfts. Schießkunst braucht ein eigenes Ziel. Beim Glücksspieler ist dies nur begleitende Alltagsausbildung; Spielpraxis bleibt regeltechnisch offen, Schauspielkunst ersetzt keine Spielfertigkeit. Diebeskunst kommt nur bei ausdrücklich gewähltem Falschspiel hinzu. Magier benötigen separate Magieausbildung; Heiler erhalten keine automatische Magie. Ein Arzt-Laie ist keine Zusage selbständiger ärztlicher Behandlung.

## Eigenständige Alltagsausbildung für jeden Beruf

Unabhängig von der Güte drei **unterschiedliche** Hauptfertigkeiten mindestens 4, je eine aus den folgenden Aufgabenfeldern. Bereits vorhandene Berufs- oder Hintergrundwerte erfüllen das Ziel. Es entstehen keine drei zusätzlichen Käufe, wenn die Aufgaben bereits abgedeckt sind.

| Aufgabenfeld | Geordnete Auswahl; erste zur Lebensweise passende Fertigkeit verwenden |
|---|---|
| Eigene Versorgung | Hauswirtschaft, Koch; bei unmittelbarer Selbstversorgung Überleben |
| Umgang und Besorgungen | Etikette, Kaufmann, Gastgewerbe |
| Praktischer Lebensunterhalt | Aus der gewählten Lebenswelt: Landwirtschaft, Viehwirtschaft, Holzbearbeitung, Seiler, Lederbearbeitung, Fischer, Geografie oder Überleben |

Ein bereits für ein Aufgabenfeld verwendeter Eintrag besetzt kein zweites Feld. Falls der Lebensweltpool keinen passenden dritten Eintrag liefert, Hauswirtschaft oder Koch wählen, soweit noch unbesetzt; die konkrete Tätigkeit benennen. Die drei Mindestwerte kosten ohne Überschneidung 48 SP. Sie werden mit höherer Professionsgüte nicht automatisch erhöht: ein hervorragender Gelehrter muss kein hervorragender Koch sein.

## Zusammenführung und Erreichen der 5 %

1. Einmal gezogene Hintergrundbeiträge aus Terrain, Lebenswelt und sozialer Lage additiv bilden; Auswahl speichern. Berufliche **Mindestziele** aus diesem Entwurf werden anschließend ergänzt: Endwert = Maximum aus vorhandenen Werten, additiver Hintergrundsumme und allen Mindestzielen. Bereits gelernte Werte und Hintergrund sind dabei nicht dieselbe Quelle: in einem neuen Kandidaten Hintergrund in dessen Werte einrechnen, beim erneuten Planen nicht nochmals addieren.
2. Für einen Zweitberuf eigene Güte anwenden. Gleiche Hauptfertigkeitsziele per Maximum zusammenführen; unterschiedliche Spezialisierungen bleiben getrennt. Diese Tabelle definiert keine zusätzlichen additiven Berufsboni. Die bestätigte Addition echter Beiträge bleibt bestehen.
3. Drei Alltagsfelder ergänzen, dann S-Ziele und Elternbeziehung prüfen. Nur fehlende Werte kaufen. Hintergründe können K1 über den Gütebereich heben; die Güte beschreibt dann das gewählte berufliche Mindestprofil, nicht eine Obergrenze. Überschreitung im Ergebnis sichtbar ausweisen, Hintergrund nicht still kürzen.
4. Gesamtkosten mit der regulären Formel und Spezialisierungstabelle berechnen. Untergrenze `ceil(Gesamt-SP × 0,05)` prüfen.
5. Bei Fehlbetrag zuerst den ausdrücklich gewählten Berufsschwerpunkt innerhalb des Gütebereichs vertiefen, dann dessen Spezialisierung bis höchstens K1. Danach passende bereits gelernte Alltags-/Lebensweltfertigkeiten in gespeicherter Prioritätsreihenfolge einzeln steigern. Für diese automatische Alltagsvertiefung ist 8 die vorgeschlagene Grenze; fachliche Nebenfertigkeiten nicht automatisch auf Meisterrang heben. Nach jedem Punkt tatsächliche Mehrkosten prüfen; bei erreichtem Minimum stoppen. Der letzte legale Kauf darf das Minimum überschreiten.
6. Reicht das nicht, weitere sachlich begründete Alltagsfertigkeiten aus den bestätigten Hintergrundpools in gespeicherter Auswahlreihenfolge erschließen, zunächst 4, bei weiterem Bedarf bis 8. Keine beliebigen Wissenschaften zum SP-Verbrauch hinzufügen. Bleibt der Auftrag unerfüllbar oder sind alle passenden Optionen ausgeschöpft, fehlende SP und begrenzende Ziele sichtbar melden. Eine hohe Gesamt-SP-Zahl rechtfertigt keine automatische Erhöhung der gewählten Professionsgüte.
7. Anschließend Gesamtbudget samt allen übrigen Pflichten prüfen. 320 SP allein beweisen weder Berufskompetenz noch vollständige Finanzierbarkeit. Keine Budgeterhöhung, keine heimliche Kürzung und kein Neuauslosen bis es passt.

Die Auswahlreihenfolge und die neue Grenze 8 sind Entwurfsentscheidungen. Die Gewichte zufälliger Hintergrundauswahl bleiben offen. Bei späterer Umsetzung müssen Herkunft der Beiträge und zusätzliche Planungskäufe getrennt gespeichert werden, damit Neuberechnungen keine Werte verdoppeln.

## Militärische Ränge: passende Ausbildungsprofile zur ausdrücklichen Auswahl

Die folgenden Zuordnungen sind Vorschläge für die Auswahl einer **zusätzlichen Ausbildung**, keine Rangboni. Alle in der Rangliste enthaltenen Stufen sind abgedeckt. Dienststellung und tatsächliche Aufgabe gehen bei der Profilwahl vor; keine Kombination wird gesperrt.

| Ranggruppe laut Rangliste | Mögliche zusätzliche WHK-Mindestziele bei entsprechender Aufgabe |
|---|---|
| Rekrut | Soldat-Laie; keine zusätzliche Führungspflicht |
| Soldat / Reiter / Matrose | Soldat- bzw. Matrose-Geselle; keine zusätzliche Führungspflicht |
| Gefreiter / Vollmatrose | Fachprofil Geselle; bei Einweisung anderer Pädagoge 3 |
| Korporal / Maat | Führung 4, Pädagoge 3, Militärtheorie 4 |
| Sergeant / Obermaat | Führung 6, Pädagoge 4, Militärtheorie 6 |
| Feldwebel / Wachtmeister / Bootsmann | Führung 8, Administration 4, Logistik 6, Pädagoge 6 |
| Oberfeldwebel / Oberwachtmeister / Oberbootsmann | Führung 10, Administration 6, Logistik 8, Pädagoge 8 |
| Kadett / Seekadett | Militärtheorie 4, Führung 3, Etikette 4 |
| Fähnrich / Kornett | Militärtheorie 6, Führung 4, Administration 3 |
| Leutnant, einschließlich zur See | Führung 6, Militärtheorie 6, Administration 4, Logistik 4 |
| Oberleutnant, einschließlich zur See | Führung 8, Militärtheorie 8, Administration 4, Logistik 6 |
| Hauptmann / Rittmeister / Kapitänleutnant | Führung 10, Militärtheorie 10, Administration 6, Logistik 8 |
| Major / Korvettenkapitän | Führung 12, Militärtheorie 12, Administration 8, Logistik 10 |
| Oberstleutnant / Fregattenkapitän | Führung 14, Militärtheorie 14, Administration 10, Logistik 12 |
| Oberst / Kapitän zur See | Führung 16, Militärtheorie 16, Administration 12, Logistik 14 |
| Generalmajor / Konteradmiral | Führung 18, Militärtheorie 18, Administration 12, Logistik 16 |
| Generalleutnant / Vizeadmiral | Führung 20, Militärtheorie 20, Administration 14, Logistik 18 |
| General / Admiral | Führung 22, Militärtheorie 22, Administration 16, Logistik 20 |
| Feldmarschall / Großadmiral | Führung 24, Militärtheorie 24, Administration 18, Logistik 22 |

Heer und Kavallerie verwenden die gemeinsamen Bezeichnungen der bestätigten Liste. Marineprofile ergänzen Seefahrt aus Beruf/Aufgabe; Kavallerie Abrichten und die separate GF Reiten. Ein Marinearzt benötigt nicht allein wegen seines Ranges das Schiffsführungsprofil. Ein Leutnant als Kompaniechef darf das Aufgabenprofil eines Kompaniechefs wählen. Sämtliche Ziele werden per Maximum zusammengeführt und regulär bezahlt. Die Finanzierung hoher Führungsprofile ist noch zu prüfen.

## Kostenprüfung und Grenzen

Hauptfertigkeit bei Wert w > 0: `10 + (w−1)×w/2`, bei 0: 0. S-Kosten für 2/4/6/8/10/12: 5/7/11/16/22/30 SP. Damit stimmen die sechs Berufskosten oben; sie erfüllen die 320-SP-Untergrenze erst ab Großmeister von sich aus.

Reines Rechenbeispiel Bauer-Meister mit zusätzlich gewählter praktischer Breite (Endwerte, keine vollständige Hintergrundziehung): Landwirtschaft 12 (76 SP), Viehwirtschaft 8 (38), Pflanzenkunde 8 (38), Hauswirtschaft 8 (38), Kaufmann 8 (38), Überleben 8 (38), Koch 6 (25), Getreidebauer 8 (16), Überleben/Wald 8 (16) ergeben **323 SP**. Versorgung = Hauswirtschaft, Besorgungen = Kaufmann, praktischer Lebensunterhalt = Überleben. Beide Spezialisierungen halten ihre Elternwerte ein.

Entsprechende Wache-Meister: Ermittlung 12, Rechtskunde 8, Etikette 8, Führung 8, Hauswirtschaft 8, Überleben 8, Koch 6 sowie Observation 8 und Überleben/Wald 8 ergeben ebenfalls **323 SP**. Versorgung = Hauswirtschaft, Umgang = Etikette, praktischer Lebensunterhalt = Überleben. Dies ist eine Wache mit ausdrücklich vertiefter Führung, kein Mindestprofil jeder einfachen Wache.

Beim Troll verbleiben in beiden Rechenbeispielen nach Volksminimum 3.351 SP, Attributminimum 192 SP, Standard-SSK 90 SP und WHK 323 SP noch **2.444 SP**. Bei beispielhaften 20 GF/SF-Punkten (180 SP) verbleiben **2.264 SP** vor allen weiteren Pflichten. Schriftbedarf würde weitere 30 SP kosten. Dies ist ausdrücklich eine Teilrechnung; vollständige Hintergrundbeiträge, Unbewaffnet, weitere Kampfwerte, Pflichtmerkmale und Rüstungsbedarf sind noch nicht eingerechnet.

## Offene Arbeit und nächster Schritt

Die neuen Mindestwerte, Alltagsfelder, Ergänzungsreihenfolge und optionalen militärischen Ausbildungsprofile sind zu bestätigen und anschließend anhand vollständiger Kandidaten zu kalibrieren. Glücksspiel-Spielpraxis, schriftabhängige Aufgaben je Profession, Kampf-/Magieziele, GF/SF-Paketbestätigung und höhere GF/SF-Grenzen bleiben offen. Generator, Charaktere und Regelkataloge wurden nicht geändert.

Unbewaffnet ist am 13. September mit 3 × Kreis entschieden (Kreis 0: kein Pflichtkauf). Nächster vorgeschlagener Schritt: Bauer und Wache auf Stufe 0 mit Troll-Volksminimum einschließlich WHK, Hintergrund, Attributen, SSK, GF/SF, Aussehen, Kampf und konkretem Rüstungsmanöver-Bedarf vollständig auf Finanzierbarkeit prüfen.
