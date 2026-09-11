# NPC-Add-in

Eigener Funktionsbereich innerhalb der clientseitigen Nasus-App. Das Add-in wird mit der App ausgeliefert und benötigt keinen Server. Es ist derzeit kein separat installierbares Plugin.

## SPOT-Übernahme vom 9. September 2026

Die 67 Artikel einschließlich Preisen, Gewichten, Spezialisierungen und Begründungen sowie die Kleidungsregeln sind vom Nutzer bestätigt. Maßgebliche Quelle: `werte 0.8-claude.xlsx`, Blatt `Preisliste`, Zeilen 974–1040; Blatt `Entwickeln`, Zeilen 45–123. Bestehende Zeilenreferenzen bleiben erhalten. Die Dateien mit `.draft` im Namen bewahren die bisherigen D-IDs und tragen nun zusätzlich Bestätigungsstatus und SPOT-Zeilenreferenzen. Die neuen Artikel sind noch nicht in den aktiven App-Kaufkatalog importiert. Weitere fachliche Änderungen zuerst im SPOT pflegen; die Entwurfsskripte dokumentieren den bestätigten Übernahmestand.

## Ablage

- `docs/Referenzkorrektur-2026-09-11.md`: vollständige Änderungen der sechs Referenzen nach Korrektur der Spezialisierungsgrenzen; read-only Prüfung mit `node src/addins/npc/scripts/validate-references.mjs`.

- `docs/Eigenschaften-und-Attribute.md`: Rollenprioritäten für Eigenschaften/Attribute und körperliches Zusatzprofil Vollgerüstet; Planungsgrundlage für neue Wertebausteine.

- `docs/Template-und-Arbeitsauftraege.md`: werteloses Template, sieben Rollenprofile und Arbeitsaufträge; verbindliche Entscheidungen und Vorschläge gekennzeichnet.
- `docs/Berufsstruktur.md`: Draft mit 30 festen Berufen, Kern- und Nebenfertigkeiten, Schwerpunkten, Professionsgüte und optionalem Zweitberuf.
- `docs/Amt.md`: unabhängiger Vektor für Amt, Zuständigkeit, Befugnisse und Pflichten; vorgeschlagene Beispiele.
- `docs/Ruestung.md`: vier reguläre Rüstungslagen mit bestätigten typischen Trägern und Trefferzonen; Begriffsklärung RH/RBE und offene Ausstattungsdetails.
- `docs/Ruestungspakete-Pruefung.md`: konkrete Handwerker-/Nahkämpferpakete und Varianten mit Preisen, Schutzwerten, Null-BE-Ausbildung und Budgetgegenproben auf sechs Referenzen; optionale Kopfpanzerung separat geprüft.
- `data/ruestungspakete.draft.json`: Rüstungspaketvorschläge aus bestehenden Katalogteilen; im Assistenten manuell auswählbar und automatisch nach Beruf/Kampfstil der sechs Referenzen zugeordnet. `node src/addins/npc/scripts/ruestungspakete.mjs` erzeugt und prüft Bericht und `docs/Ruestungspakete-Pruefdaten.json`.
- `docs/Berufsausruestung.md`: Ausrüstungsdraft für alle 30 Berufe mit bestehenden Katalog- und Spezialisierungszuordnungen, Transport, Besitz und offenen Artikeln.
- `docs/Artikelentwuerfe.md`: 67 neue Artikel mit Preis- und Gewichtsvorschlägen, überprüften WHK-Regelreferenzen und Preisankern; gemeinsame Grundkleidung und berufliche Varianten.
- `data/artikelentwuerfe.draft.json`: neue Artikel außerhalb der aktiven Preisliste; erzeugt und geprüft durch `scripts/artikelentwuerfe.mjs`.
- `data/grundkleidung.json`: gemeinsame Kleidung aus vorhandenen Katalogartikeln; fehlende Bekleidungsbereiche werden beim Erstellen einer Referenz-NPC-Vorschau ergänzt.
- `data/berufsausruestung.draft.json`: dieselben Ausrüstungsvorschläge als Daten; noch nicht im Assistenten verwendet. `scripts/berufsausruestung.mjs` erzeugt und prüft beide Dateien.
- `docs/Terrain-Katalog.md`: vereinbarte elf Terrains, vollständige WHK-Auswahlkataloge und Regeln für drei zufällige Zusatzfertigkeiten; Generator noch nicht implementiert.
- `docs/Budgetgrundlage.md`: berechnete Volksminima, Pflichtbündel und Referenzmessungen.
- `docs/Budgetdaten.json`: dieselben Berechnungsdaten einschließlich Einzelwerten.
- `scripts/budget-baseline.mjs`: reproduzierbare Erstellung der Budgetgrundlage. Vom Projektverzeichnis aus: `node src/addins/npc/scripts/budget-baseline.mjs`.
- `data/`: sechs bisherige vollständige Referenzcharaktere und ihr Katalog sowie der Ausrüstungsdraft. Noch keine fertig berechneten, frei kombinierbaren Berufsbausteine.
- `engine/`: Erstellung unabhängiger Vorlagenkopien, Vorschauprüfung und Tests.
- `views/` und `style.css`: Auswahlassistent und Gestaltung.
- `index.ts`: öffentlicher Einstieg für die App.

## Grenze zur Hauptanwendung

Die Hauptanwendung bindet den Einstieg ein und hält den vorübergehenden Zustand des Assistenten. Das Add-in verwendet die gemeinsamen Regeldaten, das Charaktermodell, die Berechnung, Navigation und Speicherung. Fertige NPCs werden als normale NSCs im vorhandenen localStorage gespeichert und können wie andere Charaktere exportiert werden. Es gibt keinen separaten NPC-Speicher mit doppelten Charakteren.

Der derzeitige Assistent erstellt Kopien vollständiger Referenzen. Das wertelose Template und die daraus abgeleiteten Arbeitsaufträge sind dokumentiert, aber noch nicht als Generator implementiert. Ausgefüllte Arbeitsaufträge besitzen daher noch keine eigene Speicherfunktion.

Im Schritt „Angaben und Rüstung“ kann die Vorlagenrüstung beibehalten oder durch eines der vier ausgearbeiteten Pakete ersetzt werden; optional kommt ein Lederpanzer am Kopf hinzu. In der Vorschau lassen sich Fertigung und Anpassung für jeden belegten Rüstungsplatz einzeln ändern. Die Auswahltexte vergleichen RS, RH und den vollständigen Teilpreis mit der jeweils anderen aktuellen Auswahl. Nach jeder Änderung wird der ganze Charakter neu berechnet. Benötigte Rüstungsmanöver werden ausgehend von der ursprünglichen Referenzausbildung eingeplant; eine teurere Anpassung kann dadurch zusätzliche geplante SP wieder freigeben. Bereits vorhandene Ausbildung wird nicht abgebaut. Geld und Talente werden für Rüstung nicht automatisch erweitert.

Anlegen ist bei positiver ungerundeter RBE, Budgetüberschreitung, fehlendem Rüstungsmanöver-Maximum, gesperrter Rüstungsverfügbarkeit oder sonstigen gemeldeten Charakter-/Poolproblemen gesperrt. Das gilt auch für bisherige Referenzrüstung: Wachmann und Hauptmann starten unverändert mit 1 BE und benötigen eine passende Änderung. Die Speicheraktion prüft erneut, auch wenn der deaktivierte Knopf umgangen wird. Ursprüngliche Referenzen und bereits gespeicherte Charaktere bleiben unverändert.

Die automatische Fertigungs-/Anpassungswahl ist standardmäßig eingeschaltet. `engine/armorOptimization.ts` sucht über alle Kombinationen bei festen Basisteilen und Zonen, erhält mindestens den Schutz jedes Teils und respektiert die bezahlbaren Rüstungsmanöver einschließlich Talentmaximum. „Mehr Schutz“ maximiert die Summe der Gruppen-RS, „Sparsam“ minimiert den Preis; Gleichstände werden über Ausbildungsbedarf und Kosten bzw. Schutz aufgelöst. Die vollständigen Kriterien stehen in `docs/Ruestung.md`. Bei Erfolg werden die gefundenen Einzelwahlen in die Vorschau übernommen, bei Misserfolg bleibt sie unverändert. Neue Talente, Materialien und automatische Berufszuordnung sind nicht Bestandteil dieser Suche.

Neue NPC-Vorschauen ergänzen fehlende Grundkleidung und erweitern das vorläufige Anschaffungsbudget der Referenzen um ihre tatsächlichen Katalogkosten (auf Cent aufgerundet). Vorhandene Kleidung wird anhand ihrer Bekleidungsbereiche berücksichtigt. Historische Vorlagen und gespeicherte Charaktere bleiben erhalten. Die 67 neuen Entwurfsartikel sind noch keine aktiven Kaufartikel.

Entwurfsdokumente aktualisieren: zuerst `node src/addins/npc/scripts/artikelentwuerfe.mjs`, anschließend `node src/addins/npc/scripts/berufsausruestung.mjs`. Beide prüfen die vorhandenen Quellen; die Berufszuordnung wird gegen die 30 Berufsprofile abgeglichen.

Die Dokumente und Referenzdaten liegen lokal im Projekt. Änderungen sind erst nach einem Commit in der Git-Historie gesichert; eine Veröffentlichung erfolgt separat.
