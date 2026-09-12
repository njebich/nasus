# NPC-Planung: Übergabeprotokoll

## Lese- und Fortschreibregel

- Neue Einträge immer direkt unter diesem Regelabschnitt einfügen, neueste zuerst. Datum und eine fortlaufende Nummer verwenden, damit die Reihenfolge auch am selben Tag eindeutig bleibt.
- Für einen neuen Chat von oben bis einschließlich des ersten vollständigen Eintrags mit Status **GELÖST** lesen. Am zugehörigen Marker **LESESTOPP** aufhören. Ältere Einträge darunter sind optionale Historie und müssen nicht gelesen werden.
- Ein GELÖST-Eintrag ist ein vollständiger Übergabestand: Er enthält alle weiterhin geltenden Entscheidungen, den Umsetzungs- und Prüfstand, offene Aufgaben, notwendige Quellen und den logisch nächsten Schritt. „Gelöst“ bezeichnet den abgeschlossenen Arbeitsschritt, nicht das gesamte NPC-Projekt.
- Laufende Arbeit als **OFFEN** oder **IN ARBEIT** oben ergänzen. Bei Abschluss einen neuen vollständigen GELÖST-Eintrag voranstellen; relevante Informationen aus dem bisherigen Stand übernehmen und überholte Aussagen im neuen Stand ersetzen. Ältere Einträge unverändert behalten, nicht löschen oder nachträglich umschreiben.
- Neuere Einträge haben Vorrang. Die Historie nur bei konkretem Rückfragebedarf lesen; verlinkte Fachunterlagen nach Bedarf öffnen. Keine offenen Aufgaben ausschließlich unterhalb des neuesten Lesestopps ablegen.
- Nach jedem abgeschlossenen Schritt den logisch nächsten konkret vorschlagen. Ein Vorschlag allein ist kein Ausführungsauftrag. Diese Regel steht auch in der [AGENTS.md](../../../../AGENTS.md).

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
