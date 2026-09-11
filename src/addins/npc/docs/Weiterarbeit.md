> **Korrektur abgeschlossen:** Die sechs aktiven Referenzen wurden am 11.09.2026 budgetgerecht überarbeitet. Spezialisierungsgrenzen werden jetzt zentral in `computeSheet()` geprüft (NK/FK/WHK und freie WHK), damit auch importierte Verstöße sichtbar werden und keine regulären Speicherpunkte erhalten. Änderungen und freie SP stehen in `Referenzkorrektur-2026-09-11.md`. Aktuelle Exporte: `outputs/goblin-regelkorrektur-2026-09-11/`. Read-only Prüfung: `node src/addins/npc/scripts/validate-references.mjs`. Ältere Archive vom 07.09. enthalten die fehlerhaften Ausgangsstände und sind keine aktuellen Vorlagen.

> **Referenzprüfung 11.09.: Alle sechs bisherigen Goblin-Referenzen verletzen Spezialisierung ≤ Hauptfertigkeit.** 22 Überschreitungen insgesamt. `setValue()` schützt die Eingabe; `computeSheet().validationIssues` meldet diese Verstöße bisher nicht. Frühere erfolgreiche Tests belegen daher keine vollständige Regelkonformität. Reines Anheben aller betroffenen Hauptfertigkeiten kostet zusätzlich: Bauer 226 SP, Wachmann 434 SP, Schütze 182 SP, Nahkämpfer 277 SP, Hauptmann 790 SP, KI 308 SP. Alle Referenzen waren bereits voll budgetiert. Beim Wachmann fehlt in der gemeldeten Korrekturliste außerdem Feuerwaffen 8→10 (Musketen/Pistole jeweils 10). Referenzen in dieser Prüfung nicht verändert. Reproduzierbar: `node temp/audit-npc-specializations.mjs`. Nötig: zentrale Validierung ergänzen und Referenzen innerhalb ihrer Budgets neu abstimmen.

> Aktuelle Nutzerentscheidung: **0–3 KBE aus Rüstung sind allgemein akzeptabel; Rüstung verursacht keine MBE.** Diese Vorgabe ersetzt alle älteren 0-/1-BE-Ziele unten. Strengere Ziele bleiben ausdrücklich wählbar über die Planungsdaten. Die einfache Wache erhält Zeughausrüstung von der Stange (Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte). Keine automatische Anpassung in deren Standardauswahl. Für das Ziel 3 gilt: Eigenschaftsbeitrag ≥ max(0, RH − RM − 18). Über 3 ungerundete RBE werden mindestens 4 BE und bleiben außerhalb des Rahmens.

# Stand für die nächste Sitzung

Fortsetzung am 11. September 2026: NPC-Rüstungspakete, individuelle Fertigung/Anpassung und automatische Kombinationensuche sind implementiert. Die automatische Basisteil- und Materialwahl ist als zusätzliche Auswahl implementiert.

- Verbindlich: Stoff und Leder gewöhnlich auf allen vier TZ-Gruppen; Kette bei Nahkämpfern meist Arme/Torso; Panzer meist Torso, Kopfschutz optional. Jeder fertige NPC soll ungerundet RBE 0 erreichen; positive Bruchteile werden aufgerundet.
- Die Automatik wählt Fertigung und Anpassung je Teil; Optional werden auch Basisteile und Materialien derselben Lage verglichen. Belegte Lagen/Zonen und bereits gelernte Ausbildung bleiben vorgegeben. Keine automatischen Talentkäufe. Ziele: mehr Schutz oder möglichst günstig. Details in `Ruestung.md`.
- Bestehende Modellberechnung verwenden. Geld-, SP- und Talentgrenzen beachten. Keine Finanzierungsprobleme durch stilles Erhöhen der Budgets lösen.
- Letzte Prüfung: 34 NPC-/Optimierungstests und Produktionsbuild bestanden. Kleine Optimierungsfälle mit festen und frei gewählten Basisteilen wurden gegen vollständige Aufzählung geprüft. Speicherung entspricht der Vorschau.
- Noch offen für die nächste Ausbaustufe: freie Berufsprofile über die sechs Referenzen hinaus; gegebenenfalls abgestimmte Talent- und Ausbildungsplanung. Dies sind nächste Kandidaten, noch keine fertigen Funktionen.
- Daneben bleiben der Import der 67 bestätigten Artikel und die automatische Berufsausrüstung offen; der freie Berufs-/Terrain-/Lebensweltgenerator ist noch nicht implementiert.

Arbeitspräferenz: „weiter“ als Auftrag ausführen, keine wiederholte Bestätigung für bereits beauftragte nächste Schritte verlangen. Ursprüngliche Referenzen nicht mit Testvarianten überschreiben. Andere lokale Änderungen und Ausgabedateien gehören nicht zu diesem Rüstungs-Commit.

- Automatische Rollenzuordnung umgesetzt: Bauer → Handwerkerpaket, Schütze → vollständiger Stoff- und Lederschutz (Kampfprofession; ausdrückliche Nutzerkorrektur), Wachmann/Nahkämpfer/Hauptmann/KI → Nahkämpferpaket. Neue Assistenten starten mit der automatischen Zuordnung; manuelle Pakete bleiben möglich. Finanzierungsprobleme werden nicht durch weniger Lagen oder mehr Geld umgangen.

- Prefab Vollgerüstet: 16 Plätze, mindestens angepasst; freie Rüstungsstärken-/Materialwahl bei aktivierter Automatik. RM bis freigeschaltetem Maximum, fehlender Eigenschaftsbeitrag und erforderliche ST bei aktueller KON in Vorschau. Nutzer meint Rüstungsstärke; Eigenschaften nicht automatisch ändern.

- Eigenschaften-/Attributprioritäten je Kategorie und Zusatzprofil Vollgerüstet in `Eigenschaften-und-Attribute.md` ausgearbeitet. Vollrüstung von Anfang an mit ST/KON/Vitalität und RM-Talenten budgetieren; automatische Wertevergabe noch offen. Auch ST/KON 31 reichen bei RH 40 und RM 16 nicht (mindestens RM 22 erforderlich). Nächster konkreter Wertebaustein: neu budgetierter schwerer Nahkämpfer.


### Aktualisierung: Vollrüstung darf 1 BE verursachen

Nutzerentscheidung vom 11. September 2026: Beim Prefab Vollgerüstet sind bis zu 1 BE erlaubt; die übrigen Pakete behalten das Ziel 0 BE. Frühere Null-BE-Anforderungen für Vollrüstung sind damit ersetzt. Wegen Aufrundung gilt ungerundet RBE ≤ 1, nicht etwa < 2. Die erlaubte Gesamt-RH steigt dadurch um 6: Eigenschaftsbeitrag ≥ max(0, RH − RM − 6). Vorschau, Anlegeprüfung und Optimierung verwenden dieses Ziel. Das Ziel wird am erzeugten Charakter gespeichert.

Beispiel ST/KON effektiv je 38, RM 16, RH 40: RBE 0,2 → 1 BE, für Vollgerüstet akzeptiert. Artefaktmaximum laut Nutzer: +7 pro Eigenschaft; +14 auf eine Eigenschaft ist keine zulässige Planungsannahme.
