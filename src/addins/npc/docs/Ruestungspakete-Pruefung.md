# Rüstungspakete: konkrete Ausarbeitung und Modellprüfung

Reproduzierbar mit `node src/addins/npc/scripts/ruestungspakete.mjs`. Quelle: aktive Rüstungskataloge und bestehende Clientberechnung. Die Pakete sind Vorschläge zur Umsetzung der bestätigten Abdeckung; Material, Güte und Anpassung wurden für diese Gegenprobe gewählt.

Alle Pakete enthalten Stoff und Leder auf Kopf, Torso, Armen und Beinen. Arme und Beine werden entsprechend dem Modell jeweils als gemeinsame TZ-Gruppe berechnet, nicht pro Gliedmaße doppelt. RS in der Tabelle sind Gruppenwerte; die bestehende Trefferzonenregel für halben Schutz bzw. ungeschützte Augen bleibt bestehen.

Gesellenarbeit ist reguläre Verarbeitung. Leichte Stoffrüstung von der Stange erreicht bereits Mindest-RH 1; zusätzliche Anpassung hätte hier keinen RH-Nutzen. Leichte Lederrüstung und Eisenkette werden im Hauptvorschlag angepasst, um Mindest-RH 2 bzw. 3 zu erreichen. Meisterarbeit erhöht RS, senkt laut Katalog aber nicht die RH. Lederpanzer erreicht bereits von der Stange Mindest-RH 4.

## Ausstattung und Preise

| Paket | Rüstungskosten D | RH gesamt | RS Kopf / Torso / Arme / Beine |
|---|---:|---:|---|
| Handwerker – Stoff und Leder vollständig | 240 | 12 | 4 / 4 / 4 / 4 |
| Handwerker – günstigere Anschaffung, mehr Ausbildung | 192 | 16 | 4 / 4 / 4 / 4 |
| Nahkämpfer – Kette und Lederpanzer | 1.132 | 22 | 4 / 12 / 8 / 4 |
| Nahkämpfer – Kette und Eisenpanzer | 1.645 | 23 | 4 / 14 / 8 / 4 |

### Handwerker – Stoff und Leder vollständig

| Lage | Katalogteil | TZ-Gruppen | Verarbeitung / Anpassung | RS / RH je Gruppe | Preis je Gruppe D | Summe D |
|---:|---|---|---|---|---:|---:|
| 1 | Leichte Stoffrüstung | kopf, torso, arme, beine | Gesellenarbeit / von der Stange | 1 / 1 | 22 | 88 |
| 2 | Leichte Lederrüstung | kopf, torso, arme, beine | Gesellenarbeit / angepasst | 3 / 2 | 38 | 152 |

### Handwerker – günstigere Anschaffung, mehr Ausbildung

| Lage | Katalogteil | TZ-Gruppen | Verarbeitung / Anpassung | RS / RH je Gruppe | Preis je Gruppe D | Summe D |
|---:|---|---|---|---|---:|---:|
| 1 | Leichte Stoffrüstung | kopf, torso, arme, beine | Gesellenarbeit / von der Stange | 1 / 1 | 22 | 88 |
| 2 | Leichte Lederrüstung | kopf, torso, arme, beine | Gesellenarbeit / von der Stange | 3 / 3 | 26 | 104 |

### Nahkämpfer – Kette und Lederpanzer

| Lage | Katalogteil | TZ-Gruppen | Verarbeitung / Anpassung | RS / RH je Gruppe | Preis je Gruppe D | Summe D |
|---:|---|---|---|---|---:|---:|
| 1 | Leichte Stoffrüstung | kopf, torso, arme, beine | Gesellenarbeit / von der Stange | 1 / 1 | 22 | 88 |
| 2 | Leichte Lederrüstung | kopf, torso, arme, beine | Gesellenarbeit / angepasst | 3 / 2 | 38 | 152 |
| 3 | Eisen-Kettenpanzer | torso, arme | Gesellenarbeit / angepasst | 4 / 3 | 372 | 744 |
| 4 | Lederpanzer | torso | Gesellenarbeit / von der Stange | 4 / 4 | 148 | 148 |

### Nahkämpfer – Kette und Eisenpanzer

| Lage | Katalogteil | TZ-Gruppen | Verarbeitung / Anpassung | RS / RH je Gruppe | Preis je Gruppe D | Summe D |
|---:|---|---|---|---|---:|---:|
| 1 | Leichte Stoffrüstung | kopf, torso, arme, beine | Gesellenarbeit / von der Stange | 1 / 1 | 22 | 88 |
| 2 | Leichte Lederrüstung | kopf, torso, arme, beine | Gesellenarbeit / angepasst | 3 / 2 | 38 | 152 |
| 3 | Eisen-Kettenpanzer | torso, arme | Gesellenarbeit / angepasst | 4 / 3 | 372 | 744 |
| 4 | Eisenpanzer | torso | Gesellenarbeit / angepasst | 6 / 5 | 661 | 661 |

## Vollständige Gegenproben

Die sechs vollständigen Goblin-Referenzen dienen als unveränderte Vergleichsgrundlage. Für den Handwerker wird insbesondere der Bauer als körperliche und finanzielle Zivilistenreferenz geprüft; er wird dadurch nicht zu einem fertig ausgebildeten Handwerker. Es gibt bislang keine vollständige Handwerkerreferenz. Die Ergebnisse sind nicht ungeprüft auf andere Völker übertragbar.

Nur die Rüstung wird in einer Kopie ersetzt; Rüstungsmanöver wird bei Bedarf bis zum kleinsten ganzzahligen Null-RBE-Wert erhöht. Höhere vorhandene Ausbildung bleibt erhalten. Eigenschaften, Talente, Berufs- und Waffenfertigkeiten, übrige Ausrüstung und Budgets bleiben unverändert. Sämtliche Kosten werden vollständig neu berechnet. Die Geldprüfung bezieht sich auf die gespeicherten Referenzen einschließlich ihrer bisherigen Kleidung; eine erneute Ergänzung der Grundkleidung ist hier nicht enthalten.

| Paket | Referenz | RM mindestens / eingesetzt / Maximum | Mehr-SP | Geldrest D | SP-Rest | BE aus Rüstung | Gesamtprüfung |
|---|---|---|---:|---:|---:|---:|---|
| handwerker | bauer | 4 / 4 / 12 | 9 | -114,2018 | -9 | 0 | Budget reicht nicht |
| handwerker | wachmann | 4 / 14 / 16 | 0 | 1.866,0055 | 0 | 0 | Bestanden |
| handwerker | schuetze | 4 / 5 / 12 | 0 | -125,9915 | 0 | 0 | Budget reicht nicht |
| handwerker | nahkaempfer | 3 / 14 / 16 | 0 | 1.257,003 | 0 | 0 | Bestanden |
| handwerker | hauptmann | 4 / 7 / 12 | 0 | -31,99845 | 0 | 0 | Budget reicht nicht |
| handwerker | ki | 1 / 16 / 16 | 0 | 2.159,00175 | 0 | 0 | Bestanden |
| handwerker-stange | bauer | 8 / 8 / 12 | 45 | -66,2018 | -45 | 0 | Budget reicht nicht |
| handwerker-stange | wachmann | 8 / 14 / 16 | 0 | 1.914,0055 | 0 | 0 | Bestanden |
| handwerker-stange | schuetze | 8 / 8 / 12 | 27 | -77,9915 | -27 | 0 | Budget reicht nicht |
| handwerker-stange | nahkaempfer | 7 / 14 / 16 | 0 | 1.305,003 | 0 | 0 | Bestanden |
| handwerker-stange | hauptmann | 8 / 8 / 12 | 9 | 16,00155 | -9 | 0 | Budget reicht nicht |
| handwerker-stange | ki | 5 / 16 / 16 | 0 | 2.207,00175 | 0 | 0 | Bestanden |
| nahkaempfer-lederpanzer | bauer | 14 / 14 / 12 | 99 | -1.006,2018 | -99 | 0 | Budget reicht nicht; Regel-/Maximumprüfung nicht bestanden |
| nahkaempfer-lederpanzer | wachmann | 14 / 14 / 16 | 0 | 974,0055 | 0 | 0 | Bestanden |
| nahkaempfer-lederpanzer | schuetze | 14 / 14 / 12 | 81 | -1.017,9915 | -81 | 0 | Budget reicht nicht; Regel-/Maximumprüfung nicht bestanden |
| nahkaempfer-lederpanzer | nahkaempfer | 13 / 14 / 16 | 0 | 365,003 | 0 | 0 | Bestanden |
| nahkaempfer-lederpanzer | hauptmann | 14 / 14 / 12 | 63 | -923,99845 | -63 | 0 | Budget reicht nicht; Regel-/Maximumprüfung nicht bestanden |
| nahkaempfer-lederpanzer | ki | 11 / 16 / 16 | 0 | 1.267,00175 | 0 | 0 | Bestanden |
| nahkaempfer-eisenpanzer | bauer | 15 / 15 / 12 | 108 | -1.519,2018 | -108 | 0 | Budget reicht nicht; Regel-/Maximumprüfung nicht bestanden |
| nahkaempfer-eisenpanzer | wachmann | 15 / 15 / 16 | 9 | 461,0055 | -9 | 0 | Budget reicht nicht |
| nahkaempfer-eisenpanzer | schuetze | 15 / 15 / 12 | 90 | -1.530,9915 | -90 | 0 | Budget reicht nicht; Regel-/Maximumprüfung nicht bestanden |
| nahkaempfer-eisenpanzer | nahkaempfer | 14 / 14 / 16 | 0 | -147,997 | 0 | 0 | Budget reicht nicht |
| nahkaempfer-eisenpanzer | hauptmann | 15 / 15 / 12 | 72 | -1.436,99845 | -72 | 0 | Budget reicht nicht; Regel-/Maximumprüfung nicht bestanden |
| nahkaempfer-eisenpanzer | ki | 12 / 16 / 16 | 0 | 754,00175 | 0 | 0 | Bestanden |

Negative Reste sind Finanzierungslücken, kein erlaubtes Startbudget. Eine reine Null-RBE-Probe mit Budget- oder Talentüberschreitung ist kein fertiger Charakter. Bestandene Varianten wurden zusätzlich über die echten Kauf-/Steigerungsfunktionen aufgebaut und nach JSON-Rücklesen erneut berechnet. Referenzen und gespeicherte Charaktere wurden nicht verändert.

## Ergebnis für die beiden Grundpakete

- **Handwerker – Stoff und Leder vollständig**, geprüft auf bauer: 240 D Rüstung, Rüstungsmanöver mindestens 4. Bei sonst unveränderter Referenz fehlen 9 SP und 114,21 D (auf Cent aufgerundet).
- **Nahkämpfer – Kette und Lederpanzer**, geprüft auf nahkaempfer: 1.132 D Rüstung, Rüstungsmanöver mindestens 13. Passt ohne zusätzliche SP/TaP ins vorhandene Budget; 365 D bleiben übrig.
- **Nahkämpfer – Kette und Eisenpanzer**, geprüft auf nahkaempfer: 1.645 D Rüstung, Rüstungsmanöver mindestens 14. Bei sonst unveränderter Referenz fehlen 0 SP und 148 D (auf Cent aufgerundet).

Das Handwerkerpaket benötigt bei Konstitution 13/Stärke 15 insgesamt Rüstungsmanöver 4 = 36 SP. Beim neu aufgebauten Berufsbaustein sind diese 36 SP und 240 D vor der übrigen Ausstattung zu reservieren. Der bestehende Bauer hat bereits 27 SP in Rüstungsmanöver bezahlt; daher beträgt seine zusätzliche Lücke 9 SP. Das ist noch kein Nachweis eines vollständig finanzierten neuen Handwerkers.

Die günstigere Handwerkervariante spart 48 D Anschaffung, benötigt aber vier zusätzliche Punkte Rüstungsmanöver (= 36 SP mehr als das angepasste Paket). Das ist ein konkreter Geld-/Ausbildungs-Kompromiss, keine pauschal bessere Variante.

## Optionaler Kopfschutz für den Nahkämpfer

Zusätzlich ein Lederpanzer am Kopf, Gesellenarbeit, von der Stange: 148 D, RS +4 am Kopf und RH +4. Gegenprobe auf dem bestehenden Nahkämpfer mit Konstitution 13/Stärke 17 und Rüstungsmanöver 14:

| Grundpaket | RH mit Kopfschutz | BE mit bisheriger Ausbildung | RM für BE 0 | Vorhandenes RM-Maximum | Zusätzliche SP für RM |
|---|---:|---:|---:|---:|---:|
| nahkaempfer-lederpanzer | 26 | 1 | 17 | 16 | 27 |
| nahkaempfer-eisenpanzer | 27 | 1 | 18 | 16 | 36 |

Beide Kopfvarianten überschreiten das vorhandene Rüstungsmanöver-Maximum 16. Neben den SP wären weitere passende Talentfreischaltungen und deren TaP einzuplanen. Die theoretisch errechneten Null-BE-Zustände sind deshalb nicht als bestanden ausgewiesen. Der optionale Kopfschutz wird nicht in das budgetgeprüfte Grundpaket aufgenommen.

## Bekannte Grenzen

- Geprüft sind Rüstung, RBE-Rundung, vollständige SP-/TaP-/Geldberechnung, Rüstungsmanöver-Maximum, Katalogverfügbarkeit, zentrale Validierung und die bestehende Nahkampfpoolprüfung. Dies ist keine vollständige erneute Prüfung aller Waffen-/Magieinteraktionen der historischen Charaktere.
- Die zentrale Berechnung meldet weiterhin die bereits vorhandene, nicht ausführbare Textformel `ep_verbraucht`. Die hier verwendeten SP-Ausgaben werden separat durch `computeSheet` berechnet. Die Gegenprobe behauptet keine Fehlerfreiheit aller Modellformeln.
- Noch keine automatische Rüstungsvergabe im Assistenten. Die Daten sind wiederverwendbare Paketvorschläge und enthalten keine neue Regelberechnung.
