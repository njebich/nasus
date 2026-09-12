# NPC-Erstellung: Soziale Lage und Rechtsstand

Stand: 8. September 2026. Konzept für den künftigen NPC-Generator; noch nicht implementiert.

Soziale Lage und Rechtsstand sind eigenständige Auswahlen neben der [Lebenswelt](Lebenswelt-Katalog.md). Oberschicht ist keine Lebenswelt mehr.

## Sieben soziale Stufen

1. Elend
2. Arm
3. Einfach
4. Gesichert
5. Wohlhabend
6. Reich
7. Elite

Soziale Lage kann mit jeder Lebenswelt kombiniert werden. Geldbeutel und Ausrüstungsqualität bleiben die separaten Angaben des bestehenden Templates; eine automatische Zuordnung ist noch nicht festgelegt.

## Rechtsstand

Eigene Auswahl: Privilegiert · Frei · Leibeigen · Schuldversklavt · Sklave.

Nutzerentscheidung vom 12. September 2026: Rechtsstand ist eine reine beschreibende Auswahl. Daraus werden keine Werte, Fertigkeitsbeiträge, Budgetänderungen oder sonstigen Regelberechnungen abgeleitet. Eine weitere mechanische Ausarbeitung ist nicht erforderlich.

Lebenswelt, soziale Lage und Rechtsstand bilden gemeinsam den Hintergrund. Rechtsstand und soziale Lage sind unabhängig kombinierbar, beispielsweise als wohlhabender Leibeigener oder freier Bettler.

### Tooltips – festgelegt

| Rechtsstand | Tooltip |
|---|---|
| Privilegiert | Dieser Charakter hat die vollen Rechte eines freien Bürgers seines Landes. Er hat aber Verbindungen, Reichtum oder Macht, die es ermöglichen, vor dem Gesetz gleicher als gleich zu sein. |
| Frei | Dieser Charakter ist ein freier Bürger seines Landes. Alle Rechte und Pflichten gelten. |
| Leibeigen | Dieser Charakter ist ein Leibeigener. Er gehört nach dem Gesetz zur Scholle seiner Heimat. Die Scholle gehört [Adligen erfassen]. |
| Schuldversklavt | Dieser Charakter ist in Schuldknechtschaft geraten. Er ist nicht frei, er verfügt allerdings weiterhin über den Großteil seiner Bürgerrechte. Um die Schuldknechtschaft abzulegen und wieder frei zu werden, müssen noch [Betrag] Dublonen an [Gläubiger] beglichen werden. |
| Sklave | Dieser Charakter ist ein Sklave und gehört [Besitzer]. |

### Bedingte Freitextfelder – festgelegt

Jeder Platzhalter in eckigen Klammern erhält ein eigenes Freitextfeld. Das Feld erscheint ausschließlich, wenn der zugehörige Rechtsstand ausgewählt ist; bei anderer Auswahl wird es ausgeblendet.

| Gewählter Rechtsstand | Sichtbare Freitextfelder |
|---|---|
| Privilegiert | Keine |
| Frei | Keine |
| Leibeigen | Adligen erfassen |
| Schuldversklavt | Betrag, Gläubiger |
| Sklave | Besitzer |

Die Eingaben füllen die entsprechenden Platzhalter im Tooltip. Auch „Betrag“ ist ausdrücklich ein Freitextfeld und eine reine Hintergrundangabe ohne automatische Verrechnung mit dem Geldbudget. Diese Festlegung beschreibt den künftigen Generator; die Felder sind noch nicht implementiert.

## GF und WHK der sozialen Lage – bestätigt

Die folgenden Fertigkeitspools und Wertebeiträge wurden vom Nutzer bestätigt. Führung gehört ab Wohlhabend zur WHK-Auswahl, also auch bei Reich und Elite.

| Soziale Lage | GF-Auswahl | WHK-Auswahl |
|---|---|---|
| Elend | Menschenkenntnis, Orientierung, Verstecken, Überzeugen | Überleben, Hauswirtschaft, Ermittlung (Observation), Etikette (Gemeinvolk) |
| Arm | Schätzen, Menschenkenntnis, Überzeugen, Körperbeherrschung | Hauswirtschaft, Koch, Kaufmann (Krämer), Etikette (Gemeinvolk) |
| Einfach | Schätzen, Menschenkenntnis, Überzeugen, Orientierung | Hauswirtschaft, Kaufmann (Krämer), Buchhaltung, Etikette (Gemeinvolk) |
| Gesichert | Überzeugen, Schätzen, Menschenkenntnis, Reiten | Buchhaltung, Rechtskunde (Bürgerrecht), Administration, Etikette (Bürgertum) |
| Wohlhabend | Überzeugen, Menschenkenntnis, Schätzen, Reiten | Kaufmann, Wirtschaftslehre, Rechtskunde (Vertragsrecht), Etikette (Bürgertum), Führung |
| Reich | Überzeugen, Menschenkenntnis, Reiten, Einschüchtern | Bankwesen, Administration, Kunsthandwerker, Etikette (Hochfinanz), Führung |
| Elite | Überzeugen, Menschenkenntnis, Einschüchtern, Reiten | Führung, Rechtskunde, Geschichte, Etikette (Hochfinanz) |

Vergabe: je zwei unterschiedliche GF und zwei unterschiedliche WHK mit jeweils +2; gegebenenfalls passende WHK-Spezialisierung +1. Gleicher Umfang für alle sozialen Lagen. Beiträge aus allen Bausteinen zusammenführen und regulär bezahlen. Eine Spezialisierung darf insgesamt ihre Hauptfertigkeit nicht übersteigen. Diebeskunst wird über den Kriminalitätsschwerpunkt angeboten. Eine Etikette-Spezialisierung Hofadel wäre eine mögliche Ergänzung, ist aber noch kein bestehender Katalogeintrag.

## Noch offen

Auswahlgewichte und weitere Auswirkungen der sozialen Lage sind noch zu vereinbaren. Die Fertigkeitspools und Wertebeiträge sind festgelegt; die automatische Vergabe im Generator ist noch nicht implementiert.
