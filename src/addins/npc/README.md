# NPC-Add-in

Eigener Funktionsbereich innerhalb der clientseitigen Nasus-App. Das Add-in wird mit der App ausgeliefert und benötigt keinen Server. Es ist derzeit kein separat installierbares Plugin.

## Ablage

- `docs/Template-und-Arbeitsauftraege.md`: werteloses Template, sieben Rollenprofile und Arbeitsaufträge; verbindliche Entscheidungen und Vorschläge gekennzeichnet.
- `docs/Berufsstruktur.md`: vereinfachte Berufsauswahl, Professionsgüte und optionaler Zweitberuf; vorläufiger Berufskatalog mit Magiern unter Akademikern.
- `docs/Terrain-Katalog.md`: vereinbarte elf Terrains, vollständige WHK-Auswahlkataloge und Regeln für drei zufällige Zusatzfertigkeiten; Generator noch nicht implementiert.
- `docs/Budgetgrundlage.md`: berechnete Volksminima, Pflichtbündel und Referenzmessungen.
- `docs/Budgetdaten.json`: dieselben Berechnungsdaten einschließlich Einzelwerten.
- `scripts/budget-baseline.mjs`: reproduzierbare Erstellung der Budgetgrundlage. Vom Projektverzeichnis aus: `node src/addins/npc/scripts/budget-baseline.mjs`.
- `data/`: sechs bisherige vollständige Referenzcharaktere und ihr Katalog. Noch keine frei kombinierbaren Berufsbausteine.
- `engine/`: Erstellung unabhängiger Vorlagenkopien, Vorschauprüfung und Tests.
- `views/` und `style.css`: Auswahlassistent und Gestaltung.
- `index.ts`: öffentlicher Einstieg für die App.

## Grenze zur Hauptanwendung

Die Hauptanwendung bindet den Einstieg ein und hält den vorübergehenden Zustand des Assistenten. Das Add-in verwendet die gemeinsamen Regeldaten, das Charaktermodell, die Berechnung, Navigation und Speicherung. Fertige NPCs werden als normale NSCs im vorhandenen localStorage gespeichert und können wie andere Charaktere exportiert werden. Es gibt keinen separaten NPC-Speicher mit doppelten Charakteren.

Der derzeitige Assistent erstellt Kopien vollständiger Referenzen. Das wertelose Template und die daraus abgeleiteten Arbeitsaufträge sind dokumentiert, aber noch nicht als Generator implementiert. Ausgefüllte Arbeitsaufträge besitzen daher noch keine eigene Speicherfunktion.

Die Dokumente und Referenzdaten liegen lokal im Projekt. Änderungen sind erst nach einem Commit in der Git-Historie gesichert; eine Veröffentlichung erfolgt separat.
