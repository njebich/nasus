# NPC-Add-in

Eigener Funktionsbereich innerhalb der clientseitigen Nasus-App. Das Add-in wird mit der App ausgeliefert und benötigt keinen Server. Es ist derzeit kein separat installierbares Plugin.

## SPOT-Übernahme vom 9. September 2026

Die 67 Artikel einschließlich Preisen, Gewichten, Spezialisierungen und Begründungen sowie die Kleidungsregeln sind vom Nutzer bestätigt. Maßgebliche Quelle: `werte 0.8-claude.xlsx`, Blatt `Preisliste`, Zeilen 974–1040; Blatt `Entwickeln`, Zeilen 45–123. Bestehende Zeilenreferenzen bleiben erhalten. Die Dateien mit `.draft` im Namen bewahren die bisherigen D-IDs und tragen nun zusätzlich Bestätigungsstatus und SPOT-Zeilenreferenzen. Die neuen Artikel sind noch nicht in den aktiven App-Kaufkatalog importiert. Weitere fachliche Änderungen zuerst im SPOT pflegen; die Entwurfsskripte dokumentieren den bestätigten Übernahmestand.

## Ablage

- `docs/Template-und-Arbeitsauftraege.md`: werteloses Template, sieben Rollenprofile und Arbeitsaufträge; verbindliche Entscheidungen und Vorschläge gekennzeichnet.
- `docs/Berufsstruktur.md`: Draft mit 30 festen Berufen, Kern- und Nebenfertigkeiten, Schwerpunkten, Professionsgüte und optionalem Zweitberuf.
- `docs/Amt.md`: unabhängiger Vektor für Amt, Zuständigkeit, Befugnisse und Pflichten; vorgeschlagene Beispiele.
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

Neue NPC-Vorschauen ergänzen fehlende Grundkleidung und erweitern das vorläufige Anschaffungsbudget der Referenzen um ihre tatsächlichen Katalogkosten (auf Cent aufgerundet). Vorhandene Kleidung wird anhand ihrer Bekleidungsbereiche berücksichtigt. Historische Vorlagen und gespeicherte Charaktere bleiben erhalten. Die 67 neuen Entwurfsartikel sind noch keine aktiven Kaufartikel.

Entwurfsdokumente aktualisieren: zuerst `node src/addins/npc/scripts/artikelentwuerfe.mjs`, anschließend `node src/addins/npc/scripts/berufsausruestung.mjs`. Beide prüfen die vorhandenen Quellen; die Berufszuordnung wird gegen die 30 Berufsprofile abgeglichen.

Die Dokumente und Referenzdaten liegen lokal im Projekt. Änderungen sind erst nach einem Commit in der Git-Historie gesichert; eine Veröffentlichung erfolgt separat.
