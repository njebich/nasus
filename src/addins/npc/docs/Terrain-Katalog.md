# NPC-Terrain: vereinbarter Katalog und Vergabe

Stand: 8. September 2026. Vom Nutzer akzeptierter Entwurf für den künftigen NPC-Generator. Die Zufallsauswahl ist noch nicht implementiert.

## Terrains

Berge, Dschungel, Steppe, Küste, Feuchtgebiete, Tundra, Eis, Stadt, Unterirdisch, Wald, Wüste.

Steppe ersetzt Ebene. Küste, Feuchtgebiete und Tundra wurden ergänzt. Offenes Meer wurde vorgeschlagen, aber nicht aufgenommen. Excel-Quelle und App-Regeldaten enthalten dieselben elf Spezialisierungen. Steppe verwendet die Referenz `whk_spez_ueberleben_steppe`. Bestehende Charaktere müssen vor Version 1.0 nicht migriert werden.

## WHK-Vergabe bei der Charaktererstellung

- Fest: Überleben +4 und passende Terrain-Spezialisierung +4.
- Zusätzlich drei unterschiedliche Hauptfertigkeiten zufällig aus dem jeweiligen Katalog unten ziehen, ohne Zurücklegen. Die frühere Idee mit höchstens zwei zusätzlichen WHK ist damit ersetzt.
- Jede gezogene Hauptfertigkeit erhält +2. Falls passende Spezialisierungen aufgeführt sind, gegebenenfalls eine davon auswählen und +1 oder +2 vergeben. Klammerinhalte sind Alternativen, kein Gesamtpaket.
- Erst Hauptfertigkeiten ziehen, danach Spezialisierungen bestimmen: Hauptfertigkeiten mit vielen Spezialisierungen erhalten dadurch keine höhere Ziehungswahrscheinlichkeit.
- Terrain gibt höchstens +4 pro Eintrag. Bei WHK +2 ist auch der Spezialisierungsbeitrag höchstens +2. Die frühere Idee Überleben +2 / Spezialisierung +4 ist verworfen.
- Beiträge aus Beruf und anderen Bausteinen addieren sich. Auch insgesamt darf eine Spezialisierung ihre Hauptfertigkeit nicht übersteigen.
- Falls mehrere Terrains erlaubt werden, den allgemeinen Überleben-Beitrag nur einmal vergeben. Die Verteilung der drei zusätzlichen WHK auf mehrere Terrains ist noch festzulegen.
- Alltagstätigkeiten stärker gewichten als spezielle Handwerkskenntnisse, beispielsweise Fischer häufiger als Bootsbauer an der Küste. Genaue Gewichte und die Verteilung von +1/+2 bei Spezialisierungen sind noch festzulegen.
- Zufallsauswahl einmal bei der Erstellung durchführen und das Ergebnis am Charakter im bestehenden lokalen Speicher sichern. Beim erneuten Öffnen nicht neu auslosen.
- Kosten aus den zusammengeführten Endwerten nach den normalen Spielregeln berechnen; Terrain-Beiträge sind keine kostenlosen Werte und keine mehrfach zu verbuchenden Kosten.

## Vollständiger WHK-Auswahlkatalog

Jede durch Semikolon getrennte Hauptfertigkeit ist ein eigener Kandidat. Alle Namen stammen aus dem bestehenden WHK-Katalog. Pro Terrain gibt es sechs oder sieben unterschiedliche Kandidaten.

| Terrain | Zusätzliche WHK und mögliche Spezialisierungen |
|---|---|
| Berge | Geografie; Geologie; Viehwirtschaft (Weidehirte); Jäger (Fallensteller); Bergbau (Prospektor); Pflanzenkunde (Kräuterkundler) |
| Dschungel | Pflanzenkunde (Kräuterkundler); Jäger (Fallensteller); Ermittlung (Spurenlesen); Fischer (Angler); Seefahrt (Flussschifffahrt); Holzbearbeitung (Korbflechter) |
| Steppe | Viehwirtschaft (Weidehirte, Viehtreiber); Abrichten (Pferde); Ermittlung (Spurenlesen); Jäger (Großwildjäger); Geografie; Koch (Konservieren) |
| Küste | Fischer (Angler, Netzfischer, Austernfischer); Seefahrt (Küstenschifffahrt); Seiler (Netzmacher); Koch (Konservieren); Bootsbauer (Kleinbootbauer); Geografie |
| Feuchtgebiete | Pflanzenkunde (Kräuterkundler); Fischer (Angler, Netzfischer); Seefahrt (Flussschifffahrt, Ruderschifffahrt); Jäger (Fallensteller); Holzbearbeitung (Korbflechter); Bootsbauer (Kleinbootbauer) |
| Tundra | Jäger (Fallensteller); Viehwirtschaft (Weidehirte); Lederbearbeitung (Kürschner); Pflanzenkunde (Moose); Ermittlung (Spurenlesen); Koch (Konservieren) |
| Eis | Fischer (Angler); Jäger (Großwildjäger); Lederbearbeitung (Kürschner); Koch (Konservieren); Geografie; Ermittlung (Spurenlesen); Abrichten (Hundeartige) |
| Stadt | Etikette (Gemeinvolk); Kaufmann (Krämer); Hauswirtschaft; Ermittlung (Observation); Gastgewerbe (Kellner); Rechtskunde (Bürgerrecht); Fuhrmann (Lastfuhrmann) |
| Unterirdisch | Geologie (Mineralogie); Pflanzenkunde (Pilzsammler); Bergbau; Ermittlung (Spurenlesen); Koch (Konservieren); Seiler |
| Wald | Pflanzenkunde (Pilzsammler, Sträucher); Jäger (Fallensteller, Rotwildjäger); Holzbearbeitung (Holzfäller); Ermittlung (Spurenlesen); Fischer (Angler); Koch (Räuchern) |
| Wüste | Geografie; Abrichten (Kamele); Astronomie (Navigationsastronomie); Viehwirtschaft (Weidehirte); Koch (Konservieren); Pflanzenkunde (Sträucher) |

## GF-Vergabe bei der Charaktererstellung

Zusätzlich zu den vereinbarten WHK-Beiträgen erhält jeder Charakter Terrain-Beiträge auf Grundfertigkeiten (GF). Der folgende Vorschlag wurde vom Nutzer akzeptiert; die Vergabe ist noch nicht implementiert.

- GF haben einen Gesamtwertebereich von 0 bis 12.
- Aus den fünf Kandidaten des jeweiligen Terrains zwei unterschiedliche GF zufällig ohne Zurücklegen ziehen und jeweils +2 vergeben.
- Lebenswelt, Beruf und weitere Bausteine addieren ihre GF-Beiträge ebenfalls in Schritten von höchstens +2. Der Gesamtwert bleibt auf 12 begrenzt.
- Eine GF, die bereits bei 12 liegt, durch eine andere passende GF aus dem Katalog ersetzen. Bei einem Ausgangswert von 11 nur +1 bis zum Maximum 12 vergeben.
- Orientierung bei allen Terrains außer Stadt stärker gewichten. In der Stadt stattdessen Menschenkenntnis und Schätzen stärker gewichten. Die genauen Zufallsgewichte sind noch festzulegen.
- Reiten ist bei Steppe und Wüste eine passende Alltagserfahrung; weitergehende Ausbildung kommt über Lebenswelt oder Beruf.
- Die Auswahl einmal bei der Charaktererstellung durchführen und wie die WHK-Auswahl am Charakter speichern. Beim erneuten Öffnen nicht neu auslosen.
- Kosten nach Zusammenführung aller Beiträge anhand der tatsächlichen Endwerte berechnen.

### Vollständiger GF-Auswahlkatalog

Alle Kandidaten stammen aus dem vorhandenen GF-Katalog.

| Terrain | GF-Auswahl: zwei aus fünf |
|---|---|
| Berge | Klettern; Körperbeherrschung; Springen; Orientierung; Laufen |
| Dschungel | Klettern; Orientierung; Schleichen; Fährtensuche; Schwimmen |
| Steppe | Orientierung; Laufen; Reiten; Fährtensuche; Verstecken |
| Küste | Schwimmen; Rudern; Luft anhalten; Körperbeherrschung; Orientierung |
| Feuchtgebiete | Schwimmen; Rudern; Körperbeherrschung; Orientierung; Fährtensuche |
| Tundra | Orientierung; Laufen; Fährtensuche; Schleichen; Verstecken |
| Eis | Orientierung; Körperbeherrschung; Klettern; Fährtensuche; Laufen |
| Stadt | Menschenkenntnis; Schätzen; Überzeugen; Orientierung; Laufen |
| Unterirdisch | Orientierung; Klettern; Körperbeherrschung; Schleichen; Verstecken |
| Wald | Fährtensuche; Orientierung; Schleichen; Klettern; Verstecken |
| Wüste | Orientierung; Laufen; Reiten; Fährtensuche; Körperbeherrschung |

## Anschluss

Als nächste Kategorie bietet sich Lebenswelt an: Städter, Dörfler, Bauer, Nomade, Jäger & Sammler, Seefahrer, Wandernder, Oberschicht. Sie beschreibt den Alltag im Gelände und ergänzt Terrain vor der beruflichen Vertiefung. Ihre konkreten Beiträge sind noch nicht vereinbart.
