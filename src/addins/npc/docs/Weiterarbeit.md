# Stand für die nächste Sitzung

Abschluss der Sitzung vom 10. September 2026: NPC-Rüstungspakete, individuelle Fertigung/Anpassung und automatische Kombinationensuche sind implementiert. Nutzer möchte morgen weiterarbeiten.

- Verbindlich: Stoff und Leder gewöhnlich auf allen vier TZ-Gruppen; Kette bei Nahkämpfern meist Arme/Torso; Panzer meist Torso, Kopfschutz optional. Jeder fertige NPC soll ungerundet RBE 0 erreichen; positive Bruchteile werden aufgerundet.
- Die Automatik wählt Fertigung und Anpassung je Teil; Material, Basisteil, belegte Lagen/Zonen und bereits gelernte Ausbildung bleiben vorgegeben. Keine automatischen Talentkäufe. Ziele: mehr Schutz oder möglichst günstig. Details in `Ruestung.md`.
- Bestehende Modellberechnung verwenden. Geld-, SP- und Talentgrenzen beachten. Keine Finanzierungsprobleme durch stilles Erhöhen der Budgets lösen.
- Letzte Prüfung: 23 NPC-/Optimierungstests und Produktionsbuild bestanden. Der kleine Optimierungsfall wurde gegen vollständige Aufzählung geprüft. Speicherung entspricht der Vorschau.
- Noch offen für die nächste Ausbaustufe: automatische Wahl der Basisteile/Materialien und Zuordnung zur Berufs-/Kampfrolle; gegebenenfalls abgestimmte Talent- und Ausbildungsplanung. Dies sind nächste Kandidaten, noch keine fertigen Funktionen.
- Daneben bleiben der Import der 67 bestätigten Artikel und die automatische Berufsausrüstung offen; der freie Berufs-/Terrain-/Lebensweltgenerator ist noch nicht implementiert.

Arbeitspräferenz: „weiter“ als Auftrag ausführen, keine wiederholte Bestätigung für bereits beauftragte nächste Schritte verlangen. Ursprüngliche Referenzen nicht mit Testvarianten überschreiben. Andere lokale Änderungen und Ausgabedateien gehören nicht zu diesem Rüstungs-Commit.
