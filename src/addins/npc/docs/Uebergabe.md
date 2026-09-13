# NPC-Planung: Übergabeprotokoll

## Lese- und Fortschreibregel

- Neue Einträge immer direkt unter diesem Regelabschnitt einfügen, neueste zuerst. Datum und eine fortlaufende Nummer verwenden, damit die Reihenfolge auch am selben Tag eindeutig bleibt.
- Für einen neuen Chat von oben bis einschließlich des ersten vollständigen Eintrags mit Status **GELÖST** lesen. Am zugehörigen Marker **LESESTOPP** aufhören. Ältere Einträge darunter sind optionale Historie und müssen nicht gelesen werden.
- Ein GELÖST-Eintrag ist ein vollständiger Übergabestand: Er enthält alle weiterhin geltenden Entscheidungen, den Umsetzungs- und Prüfstand, offene Aufgaben, notwendige Quellen und den logisch nächsten Schritt. „Gelöst“ bezeichnet den abgeschlossenen Arbeitsschritt, nicht das gesamte NPC-Projekt.
- Laufende Arbeit als **OFFEN** oder **IN ARBEIT** oben ergänzen. Bei Abschluss einen neuen vollständigen GELÖST-Eintrag voranstellen; relevante Informationen aus dem bisherigen Stand übernehmen und überholte Aussagen im neuen Stand ersetzen. Ältere Einträge unverändert behalten, nicht löschen oder nachträglich umschreiben.
- Neuere Einträge haben Vorrang. Die Historie nur bei konkretem Rückfragebedarf lesen; verlinkte Fachunterlagen nach Bedarf öffnen. Keine offenen Aufgaben ausschließlich unterhalb des neuesten Lesestopps ablegen.
- Nach jedem abgeschlossenen Schritt den logisch nächsten konkret vorschlagen. Ein Vorschlag allein ist kein Ausführungsauftrag. Diese Regel steht auch in der [AGENTS.md](../../../../AGENTS.md).

## 2026-09-13 · 023 · GELÖST — NPC-Magieplanung für Commit gesichert

Ergebnis dieses Schritts: Nutzer beauftragt lokalen Commit des aktuellen NPC-Planungsstands. Umfang: Spruchmagieausbildung, Eigenschaften und Attribute, Weitere Achsen und dieses Übergabeprotokoll. Dokumentationsprüfung ohne Whitespacefehler; keine Laufzeitänderungen oder App-Tests. Dieser Übergabestand wird im selben Commit gesichert; tatsächlichen Commit-Hash im Git-Protokoll prüfen. Kein Push beauftragt. Andere lokale Regel-, Excel-, Ausrüstungs- und Exportänderungen bleiben außerhalb. Weitere fachliche Ausarbeitung zurückgestellt. Weiter geltend: Auswahlrichtung korrigiert: Bereits hohe speziesbedingte Eigenschaften begünstigen passende zufällige Schulen; anschließend CK-Eigenschaftsziele ergänzen. INT und WIL als allgemeine Magierschwerpunkte bestätigt. Goblins geprüft: Schnelligkeitssockel 16/Bonus +3 passt zu Luftbeschwörung; keine Zufallswahrscheinlichkeiten erfunden. Dokumentation aktualisiert, keine Generatoränderung. Weiter geltend: Alle 330 Sprüche in zwölf Schulen geprüft; keine fehlenden Boni und keine Abweichung bei Referenz/Schule/Bonus zwischen JSONL und Laufzeitkatalog. Neben fünf Beschwörungsschulen nur Hellsicht eindeutig (Sinnesschärfe 11/11). Heilung KON 28/32, Antimagie WIL 35/53, Beherrschung AUS 18/28, Illusion SIN 15/23 jeweils mit Ausnahmen; Veränderung sieben und Verzauberung zehn unterschiedliche Eigenschaften. Vollständige Verteilung und Ausnahmen in Eigenschaften und Attribute. Keine automatische Zuordnung aus Häufigkeiten beschlossen. Nur Dokumentation. Weiter geltend: Planungsreihenfolge korrigiert: CK (nur NPC-Kategorie) mit passenden Schwerpunkt-Eigenschaften und Zielhöhen vor der Restverteilung finanzieren, dann übrige Basiskosten und Rest-SP bestimmen, erst daraus Spruchanzahl ableiten. Zielhöhen noch offen, keine belastbare Restbudgetzahl behauptet. Bei Kampfmagiern leitet sich ein Schwerpunkt aus dem Eigenschaftsbonus der ersten gewählten Schule ab. Geprüfte Zuordnung: Magiebeschwörung/Ausstrahlung, Feuerbeschwörung/Mut, Wasserbeschwörung/Athletik, Erdbeschwörung/Stärke, Luftbeschwörung/Schnelligkeit. Alle betroffenen Katalogeinträge geprüft. Nur Dokumentation aktualisiert. Weiter geltend: Fünfte Schule für Kampfmagier ab Kreis 4 zufällig aus allen übrigen Schulen bestätigt. Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, etwa drei insgesamt; keine eigene Kampfmagie-Obergrenze für Kampfmagier. Unterschiedliche Schulen und Gesamtzahl gelten weiter. Dokumentation abgeglichen, Generator unverändert. Weiter geltend: Höhere Schulvorauswahl dokumentiert. Kampfmagier erhalten eine weitere unterschiedliche Kampfmagieschule, gemäß bestehender Kreisfolge als vierte Schule auf Kreis 3. Andere Spruchmagier erhalten zwei weitere unterschiedliche Zufallsschulen, eine auf Kreis 3 und eine ab Kreis 4, mit höchstens einer Kampfmagieschule insgesamt. Fünfte Schule für Kampfmagier wird zufällig ohne Einschränkung der Schulart gezogen. Nur Dokumentation; Staffelung gegen Gesamtzahl 3/4/5 geprüft. Weiter geltend: Kampfmagieschulen abschließend als Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung festgelegt; alle fünf Namen im aktuellen Spruchmagiekatalog gefunden. Antimagie zählt separat. Fachplanung und Achsenübersicht aktualisiert; nur Dokumentation. Weiterhin bestätigt: Höchstens eine Kampfmagieschule unter den drei zufälligen Schulen nicht als Kampfmagier eingeordneter Spruchmagier bestätigt und in Fachplanung sowie Achsenübersicht ergänzt. Null Kampfmagieschulen ist ebenfalls zulässig. Auch einschließlich zusätzlicher Schulplätze gilt für andere Spruchmagier höchstens eine Kampfmagieschule insgesamt. Dokumentationsabgleich erfolgt; keine Generatoränderung oder Laufzeittests. Weiter geltender Stand: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Lokaler Commit ist jetzt beauftragt; kein Push.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 022 · GELÖST — Speziesstärken gewichten Schulwahl; INT und WIL für Magier

Ergebnis dieses Schritts: Auswahlrichtung korrigiert: Bereits hohe speziesbedingte Eigenschaften begünstigen passende zufällige Schulen; anschließend CK-Eigenschaftsziele ergänzen. INT und WIL als allgemeine Magierschwerpunkte bestätigt. Goblins geprüft: Schnelligkeitssockel 16/Bonus +3 passt zu Luftbeschwörung; keine Zufallswahrscheinlichkeiten erfunden. Dokumentation aktualisiert, keine Generatoränderung. Weiter geltend: Alle 330 Sprüche in zwölf Schulen geprüft; keine fehlenden Boni und keine Abweichung bei Referenz/Schule/Bonus zwischen JSONL und Laufzeitkatalog. Neben fünf Beschwörungsschulen nur Hellsicht eindeutig (Sinnesschärfe 11/11). Heilung KON 28/32, Antimagie WIL 35/53, Beherrschung AUS 18/28, Illusion SIN 15/23 jeweils mit Ausnahmen; Veränderung sieben und Verzauberung zehn unterschiedliche Eigenschaften. Vollständige Verteilung und Ausnahmen in Eigenschaften und Attribute. Keine automatische Zuordnung aus Häufigkeiten beschlossen. Nur Dokumentation. Weiter geltend: Planungsreihenfolge korrigiert: CK (nur NPC-Kategorie) mit passenden Schwerpunkt-Eigenschaften und Zielhöhen vor der Restverteilung finanzieren, dann übrige Basiskosten und Rest-SP bestimmen, erst daraus Spruchanzahl ableiten. Zielhöhen noch offen, keine belastbare Restbudgetzahl behauptet. Bei Kampfmagiern leitet sich ein Schwerpunkt aus dem Eigenschaftsbonus der ersten gewählten Schule ab. Geprüfte Zuordnung: Magiebeschwörung/Ausstrahlung, Feuerbeschwörung/Mut, Wasserbeschwörung/Athletik, Erdbeschwörung/Stärke, Luftbeschwörung/Schnelligkeit. Alle betroffenen Katalogeinträge geprüft. Nur Dokumentation aktualisiert. Weiter geltend: Fünfte Schule für Kampfmagier ab Kreis 4 zufällig aus allen übrigen Schulen bestätigt. Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, etwa drei insgesamt; keine eigene Kampfmagie-Obergrenze für Kampfmagier. Unterschiedliche Schulen und Gesamtzahl gelten weiter. Dokumentation abgeglichen, Generator unverändert. Weiter geltend: Höhere Schulvorauswahl dokumentiert. Kampfmagier erhalten eine weitere unterschiedliche Kampfmagieschule, gemäß bestehender Kreisfolge als vierte Schule auf Kreis 3. Andere Spruchmagier erhalten zwei weitere unterschiedliche Zufallsschulen, eine auf Kreis 3 und eine ab Kreis 4, mit höchstens einer Kampfmagieschule insgesamt. Fünfte Schule für Kampfmagier wird zufällig ohne Einschränkung der Schulart gezogen. Nur Dokumentation; Staffelung gegen Gesamtzahl 3/4/5 geprüft. Weiter geltend: Kampfmagieschulen abschließend als Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung festgelegt; alle fünf Namen im aktuellen Spruchmagiekatalog gefunden. Antimagie zählt separat. Fachplanung und Achsenübersicht aktualisiert; nur Dokumentation. Weiterhin bestätigt: Höchstens eine Kampfmagieschule unter den drei zufälligen Schulen nicht als Kampfmagier eingeordneter Spruchmagier bestätigt und in Fachplanung sowie Achsenübersicht ergänzt. Null Kampfmagieschulen ist ebenfalls zulässig. Auch einschließlich zusätzlicher Schulplätze gilt für andere Spruchmagier höchstens eine Kampfmagieschule insgesamt. Dokumentationsabgleich erfolgt; keine Generatoränderung oder Laufzeittests. Weiter geltender Stand: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 021 · GELÖST — Eigenschaftsboni aller Spruchmagieschulen geprüft

Ergebnis dieses Schritts: Alle 330 Sprüche in zwölf Schulen geprüft; keine fehlenden Boni und keine Abweichung bei Referenz/Schule/Bonus zwischen JSONL und Laufzeitkatalog. Neben fünf Beschwörungsschulen nur Hellsicht eindeutig (Sinnesschärfe 11/11). Heilung KON 28/32, Antimagie WIL 35/53, Beherrschung AUS 18/28, Illusion SIN 15/23 jeweils mit Ausnahmen; Veränderung sieben und Verzauberung zehn unterschiedliche Eigenschaften. Vollständige Verteilung und Ausnahmen in Eigenschaften und Attribute. Keine automatische Zuordnung aus Häufigkeiten beschlossen. Nur Dokumentation. Weiter geltend: Planungsreihenfolge korrigiert: CK (nur NPC-Kategorie) mit passenden Schwerpunkt-Eigenschaften und Zielhöhen vor der Restverteilung finanzieren, dann übrige Basiskosten und Rest-SP bestimmen, erst daraus Spruchanzahl ableiten. Zielhöhen noch offen, keine belastbare Restbudgetzahl behauptet. Bei Kampfmagiern leitet sich ein Schwerpunkt aus dem Eigenschaftsbonus der ersten gewählten Schule ab. Geprüfte Zuordnung: Magiebeschwörung/Ausstrahlung, Feuerbeschwörung/Mut, Wasserbeschwörung/Athletik, Erdbeschwörung/Stärke, Luftbeschwörung/Schnelligkeit. Alle betroffenen Katalogeinträge geprüft. Nur Dokumentation aktualisiert. Weiter geltend: Fünfte Schule für Kampfmagier ab Kreis 4 zufällig aus allen übrigen Schulen bestätigt. Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, etwa drei insgesamt; keine eigene Kampfmagie-Obergrenze für Kampfmagier. Unterschiedliche Schulen und Gesamtzahl gelten weiter. Dokumentation abgeglichen, Generator unverändert. Weiter geltend: Höhere Schulvorauswahl dokumentiert. Kampfmagier erhalten eine weitere unterschiedliche Kampfmagieschule, gemäß bestehender Kreisfolge als vierte Schule auf Kreis 3. Andere Spruchmagier erhalten zwei weitere unterschiedliche Zufallsschulen, eine auf Kreis 3 und eine ab Kreis 4, mit höchstens einer Kampfmagieschule insgesamt. Fünfte Schule für Kampfmagier wird zufällig ohne Einschränkung der Schulart gezogen. Nur Dokumentation; Staffelung gegen Gesamtzahl 3/4/5 geprüft. Weiter geltend: Kampfmagieschulen abschließend als Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung festgelegt; alle fünf Namen im aktuellen Spruchmagiekatalog gefunden. Antimagie zählt separat. Fachplanung und Achsenübersicht aktualisiert; nur Dokumentation. Weiterhin bestätigt: Höchstens eine Kampfmagieschule unter den drei zufälligen Schulen nicht als Kampfmagier eingeordneter Spruchmagier bestätigt und in Fachplanung sowie Achsenübersicht ergänzt. Null Kampfmagieschulen ist ebenfalls zulässig. Auch einschließlich zusätzlicher Schulplätze gilt für andere Spruchmagier höchstens eine Kampfmagieschule insgesamt. Dokumentationsabgleich erfolgt; keine Generatoränderung oder Laufzeittests. Weiter geltender Stand: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Schwerpunktableitung für gemischte Schulen festlegen (typischer Hauptbonus oder vorgesehene Kernzauber), danach CK-Matrix und Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 020 · GELÖST — CK-Eigenschaften vor Restbudget und Spruchrepertoire

Ergebnis dieses Schritts: Planungsreihenfolge korrigiert: CK (nur NPC-Kategorie) mit passenden Schwerpunkt-Eigenschaften und Zielhöhen vor der Restverteilung finanzieren, dann übrige Basiskosten und Rest-SP bestimmen, erst daraus Spruchanzahl ableiten. Zielhöhen noch offen, keine belastbare Restbudgetzahl behauptet. Bei Kampfmagiern leitet sich ein Schwerpunkt aus dem Eigenschaftsbonus der ersten gewählten Schule ab. Geprüfte Zuordnung: Magiebeschwörung/Ausstrahlung, Feuerbeschwörung/Mut, Wasserbeschwörung/Athletik, Erdbeschwörung/Stärke, Luftbeschwörung/Schnelligkeit. Alle betroffenen Katalogeinträge geprüft. Nur Dokumentation aktualisiert. Weiter geltend: Fünfte Schule für Kampfmagier ab Kreis 4 zufällig aus allen übrigen Schulen bestätigt. Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, etwa drei insgesamt; keine eigene Kampfmagie-Obergrenze für Kampfmagier. Unterschiedliche Schulen und Gesamtzahl gelten weiter. Dokumentation abgeglichen, Generator unverändert. Weiter geltend: Höhere Schulvorauswahl dokumentiert. Kampfmagier erhalten eine weitere unterschiedliche Kampfmagieschule, gemäß bestehender Kreisfolge als vierte Schule auf Kreis 3. Andere Spruchmagier erhalten zwei weitere unterschiedliche Zufallsschulen, eine auf Kreis 3 und eine ab Kreis 4, mit höchstens einer Kampfmagieschule insgesamt. Fünfte Schule für Kampfmagier wird zufällig ohne Einschränkung der Schulart gezogen. Nur Dokumentation; Staffelung gegen Gesamtzahl 3/4/5 geprüft. Weiter geltend: Kampfmagieschulen abschließend als Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung festgelegt; alle fünf Namen im aktuellen Spruchmagiekatalog gefunden. Antimagie zählt separat. Fachplanung und Achsenübersicht aktualisiert; nur Dokumentation. Weiterhin bestätigt: Höchstens eine Kampfmagieschule unter den drei zufälligen Schulen nicht als Kampfmagier eingeordneter Spruchmagier bestätigt und in Fachplanung sowie Achsenübersicht ergänzt. Null Kampfmagieschulen ist ebenfalls zulässig. Auch einschließlich zusätzlicher Schulplätze gilt für andere Spruchmagier höchstens eine Kampfmagieschule insgesamt. Dokumentationsabgleich erfolgt; keine Generatoränderung oder Laufzeittests. Weiter geltender Stand: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** CK-Matrix und Eigenschaftszielhöhen je Kreis ausarbeiten, beginnend beim Kampfmagier mit schulabhängigem Schwerpunkt. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 019 · GELÖST — Freie Zufallsschulen für Kampfmagier bestätigt

Ergebnis dieses Schritts: Fünfte Schule für Kampfmagier ab Kreis 4 zufällig aus allen übrigen Schulen bestätigt. Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, etwa drei insgesamt; keine eigene Kampfmagie-Obergrenze für Kampfmagier. Unterschiedliche Schulen und Gesamtzahl gelten weiter. Dokumentation abgeglichen, Generator unverändert. Weiter geltend: Höhere Schulvorauswahl dokumentiert. Kampfmagier erhalten eine weitere unterschiedliche Kampfmagieschule, gemäß bestehender Kreisfolge als vierte Schule auf Kreis 3. Andere Spruchmagier erhalten zwei weitere unterschiedliche Zufallsschulen, eine auf Kreis 3 und eine ab Kreis 4, mit höchstens einer Kampfmagieschule insgesamt. Fünfte Schule für Kampfmagier wird zufällig ohne Einschränkung der Schulart gezogen. Nur Dokumentation; Staffelung gegen Gesamtzahl 3/4/5 geprüft. Weiter geltend: Kampfmagieschulen abschließend als Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung festgelegt; alle fünf Namen im aktuellen Spruchmagiekatalog gefunden. Antimagie zählt separat. Fachplanung und Achsenübersicht aktualisiert; nur Dokumentation. Weiterhin bestätigt: Höchstens eine Kampfmagieschule unter den drei zufälligen Schulen nicht als Kampfmagier eingeordneter Spruchmagier bestätigt und in Fachplanung sowie Achsenübersicht ergänzt. Null Kampfmagieschulen ist ebenfalls zulässig. Auch einschließlich zusätzlicher Schulplätze gilt für andere Spruchmagier höchstens eine Kampfmagieschule insgesamt. Dokumentationsabgleich erfolgt; keine Generatoränderung oder Laufzeittests. Weiter geltender Stand: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Für Spruchmagie je Kreis Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ausarbeiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 018 · GELÖST — Zusätzliche Schulen und globale Kampfmagiegrenze

Ergebnis dieses Schritts: Höhere Schulvorauswahl dokumentiert. Kampfmagier erhalten eine weitere unterschiedliche Kampfmagieschule, gemäß bestehender Kreisfolge als vierte Schule auf Kreis 3. Andere Spruchmagier erhalten zwei weitere unterschiedliche Zufallsschulen, eine auf Kreis 3 und eine ab Kreis 4, mit höchstens einer Kampfmagieschule insgesamt. Fünfte Schule für Kampfmagier bleibt offen. Nur Dokumentation; Staffelung gegen Gesamtzahl 3/4/5 geprüft. Weiter geltend: Kampfmagieschulen abschließend als Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung festgelegt; alle fünf Namen im aktuellen Spruchmagiekatalog gefunden. Antimagie zählt separat. Fachplanung und Achsenübersicht aktualisiert; nur Dokumentation. Weiterhin bestätigt: Höchstens eine Kampfmagieschule unter den drei zufälligen Schulen nicht als Kampfmagier eingeordneter Spruchmagier bestätigt und in Fachplanung sowie Achsenübersicht ergänzt. Null Kampfmagieschulen ist ebenfalls zulässig. Auch einschließlich zusätzlicher Schulplätze gilt für andere Spruchmagier höchstens eine Kampfmagieschule insgesamt. Dokumentationsabgleich erfolgt; keine Generatoränderung oder Laufzeittests. Weiter geltender Stand: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 bleibt offen. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Fünfte Schule für Kampfmagier und Auswahl des Schwerpunkts bleiben offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Die fünfte Schule für Kampfmagier ab Kreis 4 festlegen; Vorschlag: zufällig aus den noch nicht gewählten Schulen. Danach für Spruchmagie je Kreis Spruchanzahl und Schwerpunkt-/Nebenschulverteilung ausarbeiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 017 · GELÖST — Fünf Beschwörungsschulen als Kampfmagieschulen definiert

Ergebnis dieses Schritts: Kampfmagieschulen abschließend als Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung festgelegt; alle fünf Namen im aktuellen Spruchmagiekatalog gefunden. Antimagie zählt separat. Fachplanung und Achsenübersicht aktualisiert; nur Dokumentation. Weiterhin bestätigt: Höchstens eine Kampfmagieschule unter den drei zufälligen Schulen nicht als Kampfmagier eingeordneter Spruchmagier bestätigt und in Fachplanung sowie Achsenübersicht ergänzt. Null Kampfmagieschulen ist ebenfalls zulässig. Grenze für zusätzliche Schulplätze ab Kreis 3 bleibt offen. Dokumentationsabgleich erfolgt; keine Generatoränderung oder Laufzeittests. Weiter geltender Stand: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze bezieht sich auf die drei Zufallsschulen; zusätzliche Plätze ab Kreis 3 bleiben zu definieren. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Zusätzliche Vorauswahl ab Kreis 3, dort geltende Kampfmagie-Obergrenze für andere Spruchmagier und Auswahl des Schwerpunkts bleiben offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Vorauswahl zusätzlicher Schulplätze ab Kreis 3 einschließlich der Kampfmagie-Obergrenze für andere Spruchmagier festlegen. Danach für Spruchmagie je Kreis Spruchanzahl und Schwerpunkt-/Nebenschulverteilung ausarbeiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 016 · GELÖST — Höchstens eine Kampfmagieschule unter drei Zufallsschulen

Ergebnis dieses Schritts: Höchstens eine Kampfmagieschule unter den drei zufälligen Schulen nicht als Kampfmagier eingeordneter Spruchmagier bestätigt und in Fachplanung sowie Achsenübersicht ergänzt. Null Kampfmagieschulen ist ebenfalls zulässig. Grenze für zusätzliche Schulplätze ab Kreis 3 bleibt offen. Dokumentationsabgleich erfolgt; keine Generatoränderung oder Laufzeittests. Weiter geltender Stand: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze bezieht sich auf die drei Zufallsschulen; zusätzliche Plätze ab Kreis 3 bleiben zu definieren. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Auswahlpool Kampfmagieschulen, zusätzliche Vorauswahl ab Kreis 3 und Auswahl des Schwerpunkts bleiben offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Kampfmagieschulen-Pool und Vorauswahl zusätzlicher Schulplätze ab Kreis 3 festlegen. Danach für Spruchmagie je Kreis Spruchanzahl und Schwerpunkt-/Nebenschulverteilung ausarbeiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 015 · GELÖST — Schulvorauswahl für Kampfmagier und andere Spruchmagier

Ergebnis: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Auswahlpool Kampfmagieschulen, zusätzliche Vorauswahl ab Kreis 3 und Auswahl des Schwerpunkts bleiben offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Kampfmagieschulen-Pool und Vorauswahl zusätzlicher Schulplätze ab Kreis 3 festlegen. Danach für Spruchmagie je Kreis Spruchanzahl und Schwerpunkt-/Nebenschulverteilung ausarbeiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 014 · GELÖST — Spruchmagie-Probenziele 20/15/10 und Maximumregel

Ergebnis: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Für Spruchmagie je Kreis Spruchanzahl und Schwerpunkt-/Nebenschulverteilung ausarbeiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 013 · GELÖST — Spruchmagie nach Kreis und Probenziel festgehalten

Ergebnis: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Ziel Probe ungefähr 20 bei Eigenschaftsbonus 0, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Ziel-Zauberstufe, Spruchanzahl und konkrete Finanzierung bleiben offen. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Für Spruchmagie die Ziel-Zauberstufe für Probe ungefähr 20 festlegen; danach je Kreis Spruchanzahl und Schwerpunkt-/Nebenschulverteilung ausarbeiten. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 012 · GELÖST — Tagesabschluss und Übergabe für die Fortsetzung

Ergebnis dieses Schritts: Tagesabschluss im Nutzerauftrag. NPC-Planung einschließlich WHK, weiterer Achsen, gemittelter Kampfziele und Budgetgrundlage zusammengeführt. Dieser Stand wird mit AGENTS.md, NPC-Fachunterlagen, Budgetdaten und zugehörigem Berechnungsskript committed und nach origin/main gepusht; der tatsächliche Git-Stand ist im Repository zu prüfen. Andere lokale Regel-/Excel-/Exportänderungen gehören nicht zu diesem Planungscommit und bleiben erhalten. Heute keine weitere fachliche Ausarbeitung.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Tagesabschluss: Nutzer hat Commit und Push der aktuellen Arbeit beauftragt. Nächste Sitzung am hier dokumentierten Stand beginnen; keine vollständige Rollenbudgetprüfung vorziehen. Ausstehende lokale Änderungen außerhalb der NPC-Planung nicht pauschal übernehmen oder zurücksetzen.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Magische Ausbildungsachse je KI, Spruchmagie und PSI mit Kernfähigkeiten, Fertigkeitszielen und Voraussetzungen konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 011 · GELÖST — Kampfausbildung auf gleiche gemittelte H/S-Werte korrigiert

Ergebnis dieses Schritts: Nutzerkorrektur Spezialisierung = Hauptfertigkeit, bisherige Werte mitteln. [Kampfausbildung](Kampfausbildung.md) auf 5/5 (4,5 aufgerundet), 9/9 und 15/15 korrigiert, Kosten und Proben neu berechnet. Ausgewählte Kampfspezialisierungen werden nach Zusammenführung auf den endgültigen H-Wert nachgezogen; keine ungewählten Spezialisierungen hinzufügen. Diese Rundungs-/Zusammenführungsdetails sind ausdrücklich dokumentierte Auslegung. SF-/Lade-/Pädagoge-Werte bleiben unbestätigter Entwurf. Nur Dokumentation geändert.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Magische Ausbildungsachse je KI, Spruchmagie und PSI mit Kernfähigkeiten, Fertigkeitszielen und Voraussetzungen konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 010 · GELÖST — Kampfausbildung mit konkreten Fertigkeitszielen ausgearbeitet

Ergebnis dieses Schritts: [Kampfausbildung](Kampfausbildung.md) mit Hauptfertigkeits-/Spezialisierungszielen 6/3, 12/6 und 18/12 sowie Ausbilder-Pädagoge 8 konkretisiert. SF-/Lade-/Schildziele, Waffenzuordnung, Kreis-/Überschneidungsregeln, Kosten und Basisproben dokumentiert. Neue Zahlen sind unbestätigter Entwurf. Nur Dokumentation geändert, keine Generator-/Charakteränderung. Vollständige Rollenbudgetprüfung bleibt zurückgestellt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H6/S3, Dienst H12/S6, Spezialist H18/S12; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. Neue Ziele und Zusatzregeln bleiben unbestätigt.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 240/480/765/803 SP, FK mit einer Lade-SF 201/402/651/689 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 636 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Magische Ausbildungsachse je KI, Spruchmagie und PSI mit Kernfähigkeiten, Fertigkeitszielen und Voraussetzungen konkretisieren. Neue Kampf-, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 009 · GELÖST — Weitere Ausbildungs- und Ausrüstungsachsen definiert

Ergebnis dieses Schritts: Nutzer möchte zunächst weitere Achsen definieren. [Auswahlentwurf](Weitere-Achsen.md) für Kampfausbildung, Kampfweise/Einsatz, magische und geweihte Aufgaben, Schriftgebrauch und Ausrüstungszugang erstellt. Neue Optionen sind Vorschläge; nur Dokumentation geändert. Vollständige Bauern-/Wachen-Budgetprüfung auf Nutzerwunsch zurückgestellt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; numerische Ausbildungsziele, Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Kampfausbildung je Waffenbereich mit Mindestwerten für Selbstschutz, Dienstausbildung, Spezialist und Ausbilder konkretisieren. Danach KI-/Spruchmagie-/PSI-Aufgaben auf Fähigkeiten und Voraussetzungen abbilden. Neue WHK-/GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen; vollständige Bauern-/Wachen-Budgetprüfung später wieder aufnehmen.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 008 · GELÖST — Unbewaffnet mit 3 Punkten pro Kreis festgehalten

Ergebnis dieses Schritts: Nutzerentscheidung Unbewaffnet mit 3 Punkten pro Kreis in Planungsstand, Template, Budgetgrundlage und Folgeaufgaben übernommen. Wörtlich als Mindestziel 3 × Kreis ausgelegt, ohne zusätzlichen Startwert (Kreis 0: 0). Nur Dokumentation geändert, keine Generator- oder Charakteränderungen.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Bauern- und Wachenprofil auf Stufe 0 mit teurem Troll-Volksminimum vollständig auf Finanzierbarkeit prüfen. WHK-Entwurf und GF/SF-Paketwerte dabei kalibrieren und den bestätigten Rüstungsmanöver-Bedarf aus konkreter Rüstung einrechnen. Bestätigung der neuen WHK-Werte und optionalen militärischen Ausbildungsprofile steht aus.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-12 · 007 · GELÖST — WHK-Alltagsausbildung nach Beruf und Güte konkretisiert

Ergebnis dieses Schritts: [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md) als Planungsentwurf für alle 30 Berufe und sechs Professionsgüten erstellt: K1/K2, zwei Nebenfertigkeiten, Spezialisierungsziel, drei Alltagsfelder und Ergänzung bis zum tatsächlichen 5-%-Minimum. Zusätzlich alle militärischen Ranggruppen mit separat wählbaren Ausbildungsvorschlägen abgedeckt; Rang bleibt beschreibend. Neue Werte nicht ausdrücklich bestätigt. Nur Dokumentation geändert; Generator, Charaktere und Regelkataloge unverändert.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet ist Pflicht, Mindestumfang offen und außerhalb des GF/SF-Budgets.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Unbewaffnet-Mindestumfang konkretisieren; danach Bauern- und Wachenprofil auf Stufe 0 mit teurem Troll-Volksminimum vollständig auf Finanzierbarkeit prüfen. WHK-Entwurf und GF/SF-Paketwerte dabei kalibrieren und den bestätigten Rüstungsmanöver-Bedarf aus konkreter Rüstung einrechnen. Bestätigung der neuen WHK-Werte und optionalen militärischen Ausbildungsprofile steht aus.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-12 · 006 · GELÖST — Rüstungsmanöver an geplante Rüstung gebunden

Ergebnis dieses Schritts: Nutzerbestätigung umgesetzt: Rüstungsmanöver als kleinstes notwendiges Mindestziel aus geplanter Rüstung, tatsächlichen Charakterwerten und KBE-Ziel festgehalten. Vorhandene Käufe anrechnen, höchste Mindestanforderung verwenden, nur fehlende Punkte bezahlen. Tragen bleibt für Materiallast in den Berufspaketen. [Rüstung](Ruestung.md), [GF/SF-Entwurf](GF-SF-Achsenbeitraege.md), Planungsstand und Template abgeglichen. Nur Dokumentation geändert; neue Regel im freien Generator noch nicht implementiert.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet ist Pflicht, Mindestumfang offen und außerhalb des GF/SF-Budgets.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** WHK-Alltagsausbildung (mindestens 320 SP auf Stufe 0) und Unbewaffnet-Mindestumfang konkretisieren; anschließend Bauern- und Wachenprofil mit teurem Troll-Volksminimum vollständig auf Finanzierbarkeit prüfen. Neue GF/SF-Paketwerte dabei kalibrieren und den bestätigten Rüstungsmanöver-Bedarf aus der konkreten Rüstung einrechnen.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Berufliche und kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-12 · 005 · GELÖST — Berufs-/Lebensweltbeiträge und Überschneidungen ausgearbeitet

Ergebnis dieses Schritts: [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) für alle 30 Berufe und sieben Lebenswelten erstellt. Beruf je zwei GF und zwei SF mit +2; Lebenswelt weiterhin zwei GF mit +2, keine SF. Unterschiedliche Beiträge addieren, Mindestziele per Maximum ergänzen, gleiche Beitrags-ID nur einmal zählen. Einzelmaximum, Ersatz aus GF-Pools und Überschreitungen der 90-Punkte-Planungsgrenze konkret beschrieben. Neue Paketwerte und Konfliktdetails sind ausgearbeiteter Entwurf, noch keine ausdrücklich bestätigten Nutzerwerte. Nur Dokumentation geändert.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet ist Pflicht, Mindestumfang offen und außerhalb des GF/SF-Budgets.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** WHK-Alltagsausbildung (mindestens 320 SP auf Stufe 0) und Unbewaffnet-Mindestumfang konkretisieren; anschließend Bauern- und Wachenprofil mit teurem Troll-Volksminimum vollständig auf Finanzierbarkeit prüfen. Neue GF/SF-Paketwerte dabei kalibrieren.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Berufliche und kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-12 · 004 · GELÖST — GF/SF-Basis 0, Obergrenze ca. 90 Punkte

Ergebnis dieses Schritts: Nutzerentscheidung übernommen: GF/SF-Basis 0, Belegung aus den anderen Achsen, ca. 90 Punkte als Obergrenze auf Stufe 0. Pauschale Verteilung und 94-Punkte-Pflichtbudget verworfen. [Aktueller Fachstand](Grundausbildung-Stufe-0.md). Planungsstand, Budgetgrundlage und Template angepasst; Generator und Charaktere unverändert.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Konkrete Achsenbeiträge, Zusammenführung und Konfliktbehandlung sind noch auszuarbeiten. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet ist Pflicht, Mindestumfang offen und außerhalb des GF/SF-Budgets.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** GF/SF-Beiträge aus den anderen Achsen ausarbeiten, beginnend mit Beruf und Lebenswelt. Zusammenführung gleicher Fertigkeiten und Umgang mit der ungefähren Obergrenze klären. Danach WHK-Alltagsausbildung (mindestens 320 SP auf Stufe 0) und Unbewaffnet-Mindestumfang konkretisieren; Bauern- und Wachenprofil samt teurem Troll-Volksminimum auf Finanzierbarkeit prüfen.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

1. Berufliche und kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-12 · 003 · GELÖST — 94 GF/SF-Punkte konkret als Vorschlag verteilt

Ergebnis dieses Schritts: [Konkrete Grundausbildung](Grundausbildung-Stufe-0.md) als noch unbestätigten Vorschlag dokumentiert: GF Körperbeherrschung 10, Laufen 8, Klettern 6, Schwimmen 6, Menschenkenntnis 8, Orientierung 6, Schätzen 4; SF Ausdauer 10, Tragen 8, Gefahreninstinkt 8, Selbstbeherrschung 10, Ausweichen 10. Genau 94 Punkte / 846 SP. Keine Änderung an Generator oder Charakteren.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: 846 SP, entsprechend 94 Punkten. Konkrete Verteilung liegt als Vorschlag vor (siehe oben), Bestätigung offen. Reguläres Maximum 12; sieben Fertigkeiten reichen ohne Talente nur für 84 Punkte. Rollenbezogene GF/SF müssen innerhalb der 94 Punkte umgeschichtet werden. Begrenzte Steigerung und Obergrenze höherer Stufen noch offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet ist Pflicht, Mindestumfang offen und außerhalb des GF/SF-Budgets.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Neuer Vorschlag: zwölf Regelreferenzen, Kostenformeln, Vorteilspflichten und reguläres Maximum geprüft; 48 GF-Punkte / 432 SP plus 46 SF-Punkte / 414 SP ergeben 94 / 846. Troll-Rest bei reservierten Pflichtbudgets weiterhin 1.601 SP vor bedingten Zusätzen. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Punkteverteilung ist noch nicht umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Vorschlag zur GF/SF-Verteilung bestätigen oder korrigieren. Danach WHK-Alltagsausbildung (mindestens 320 SP auf Stufe 0) und Unbewaffnet-Mindestumfang konkretisieren und zusammen mit Attribut- und SSK-Pflichten auf Finanzierbarkeit prüfen. Bauern- und Wachenprofil sowie das teure Troll-Volksminimum dienen als Gegenproben; benötigte Rollen-GF/SF innerhalb der 94 Punkte umschichten.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

1. Berufliche und kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-12 · 002 · GELÖST — Übergabe als fortlaufendes Protokoll eingerichtet

Ergebnis dieses Schritts: Neue Einträge stehen oben. Dieser Eintrag enthält den vollständigen gültigen Übergabestand. Die vorherige Dokumentfassung bleibt darunter als Historie erhalten. Projektanweisungen auf diese Lese- und Schreibweise angepasst.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: 846 SP, entsprechend 94 Punkten. Konkrete Verteilung sowie begrenzte Steigerung und Obergrenze höherer Stufen noch offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet ist Pflicht, Mindestumfang offen und außerhalb des GF/SF-Budgets.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Punkteverteilung ist noch nicht umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Schritt 2: Gemeinsame Grundausbildung für Stufe 0 konkret ausarbeiten.** Zunächst einen begründeten Vorschlag zur Verteilung der 94 GF/SF-Punkte für genau 846 SP erstellen. Die bisher vorgeschlagene Auswahl von sieben Fertigkeiten ist noch nicht bestätigt. Anschließend WHK-Alltagsausbildung und Unbewaffnet-Mindestumfang konkretisieren und zusammen mit Attribut- und SSK-Pflichten auf Finanzierbarkeit prüfen. Ein Bauern- und ein Wachenprofil sowie das teure Troll-Volksminimum dienen als Gegenproben.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen als Vorschläge ausweisen, bis sie bestätigt sind.

### Danach

1. Berufliche und kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-12 · 001 · HISTORIE — Ursprüngliches Übergabedokument

Die folgende frühere Fassung ist zur Nachvollziehbarkeit erhalten. Ihre Fortschreibanweisung wird durch die Regel am Dokumentanfang ersetzt.

# NPC-Planung: Übergabe für einen neuen Chat

Zuletzt aktualisiert: 12. September 2026.

## Verbindliche Arbeitsweise

Nach jedem abgeschlossenen Arbeitsschritt den logisch nächsten Schritt konkret vorschlagen. Zugleich dieses Dokument mit Ergebnissen, Entscheidungen, offenen Punkten und dem nächsten Schritt fortschreiben. Vorschlag und bereits beauftragte Umsetzung unterscheiden; offene Regelentscheidungen nicht als bestätigt darstellen.

Diese Nutzerpräferenz ist auch in der projektweiten [AGENTS.md](../../../../AGENTS.md) festgehalten.

## Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

## Gesicherter Stand

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: 846 SP, entsprechend 94 Punkten. Konkrete Verteilung sowie begrenzte Steigerung und Obergrenze höherer Stufen noch offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet ist Pflicht, Mindestumfang offen und außerhalb des GF/SF-Budgets.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

## Prüfung und Grenzen

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Punkteverteilung ist noch nicht umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

## Logisch nächster Schritt

**Schritt 2: Gemeinsame Grundausbildung für Stufe 0 konkret ausarbeiten.** Zunächst einen begründeten Vorschlag zur Verteilung der 94 GF/SF-Punkte für genau 846 SP erstellen. Die bisher vorgeschlagene Auswahl von sieben Fertigkeiten ist noch nicht bestätigt. Anschließend WHK-Alltagsausbildung und Unbewaffnet-Mindestumfang konkretisieren und zusammen mit Attribut- und SSK-Pflichten auf Finanzierbarkeit prüfen. Ein Bauern- und ein Wachenprofil sowie das teure Troll-Volksminimum dienen als Gegenproben.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen als Vorschläge ausweisen, bis sie bestätigt sind.

## Danach

1. Berufliche und kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

## Weiterführende Dokumente

- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
