# NPC-Erstellung: Rüstung

Nutzervorgaben vom 10. September 2026. Grundlage für die Rüstungsauswahl. Die ausgearbeiteten Pakete sind im Referenzassistenten manuell auswählbar; eine automatische Berufszuordnung ist noch nicht implementiert.

## Vier reguläre Lagen

Die Lagen sind kombinierbar und keine sich gegenseitig ausschließenden Ausrüstungsklassen. Häufigkeitsangaben beschreiben typische Ausstattung, keine ausnahmslose Pflicht oder bereits festgelegte Zufallswahrscheinlichkeit.

| Lage | Rüstung | Typische Träger | Typische Trefferzonen | Mindest-RH je belegter TZ |
|---|---|---|---|---:|
| 1 | Stoff | Eigentlich jeder NPC | Gewöhnlich alle TZ, einschließlich Kopf | 1 |
| 2 | Leder | Die meisten Handwerker, Fuhrleute und ähnliche Berufe | Gewöhnlich alle TZ, einschließlich Kopf | 2 |
| 3 | Kette | Fast alle Nahkämpfer | Meist Arme und Torso | 3 |
| 4 | Lederpanzer oder Metallpanzer | Eigentlich nur Nahkämpfer; Kopfschutz eventuell bei allen Kampfprofessionen | Meist Torso; Kopf optional für alle Kampfprofessionen | 4 laut bestehender Berechnung |

## Begriffe und bestehende Berechnung

Der Nutzer bezeichnete die Mindestwerte je Trefferzone als „RBE“. Die bestehende Regelberechnung nennt diesen Beitrag **Rüstungshinderlichkeit (RH)**: Ein Rüstungsteil der Lagen 1–4 hat mindestens seine Lagennummer als RH. **Rüstungsbehinderung (RBE)** wird erst aus der Summe der RH aller getragenen Teile und den Charakterwerten berechnet:

`RBE = max(0, (RHgesamt - ((Konstitution / 5 + Stärke) / 2 + Rüstungsmanöver)) / 6)`

Quelle im Client: `src/engine/armorComposition.ts`. Die Werte 1, 2 und 3 wurden aktuell ausdrücklich genannt; der Mindestwert 4 ist hier aus der bestehenden Berechnung ausgewiesen, nicht als neue ausdrückliche Nutzerentscheidung. Die Begriffsdifferenz ist bei der weiteren Abstimmung offenzulegen; die Berechnung wird dadurch nicht geändert.

Die bestehende Sonderbehandlung von Lage 5 (Umhänge/Aufpanzerungen) bleibt außerhalb dieser vier regulären NPC-Lagen und wird durch dieses Konzept nicht geändert.

## Noch auszuarbeiten

- Ausnahmen von der üblichen Abdeckung der vier Lagen.
- Konkrete Katalogteile, Materialien, Verarbeitung und Anpassung.
- Auswahlhäufigkeiten, sofern eine zufällige Vergabe gewünscht ist.
- Budgetverträgliche Ausstattung und Ausbildung in Rüstungsmanöver zum Erreichen von RBE 0.

Gewöhnliche Grundkleidung erhält durch diese Vorgaben nicht automatisch Rüstungswerte. Bei der späteren Auswahl sind vorhandene Kleidung und tatsächliche Stoffrüstung anhand ihrer Katalogeinträge zu unterscheiden.

## Bestätigtes Ziel und Gegenprüfung

Ziel jedes fertigen NPCs ist, mit **0 BE aus Rüstung** loszulaufen. Die RBE-Berechnung ist bereits vollständig im Modell vorhanden. Positive Bruchteile werden aufgerundet: 0,2 ergibt 1 BE, auch 0,033333… ergibt 1 BE. Für die Prüfung zählt deshalb die ungerundete RBE 0. Andere Behinderungsquellen sind von diesem Rüstungsziel getrennt. Ausstattung, Anpassung und Ausbildung müssen gemeinsam innerhalb der Budgets geplant werden; ein verfehltes Ziel ist sichtbar auszuweisen.

Die sechs unveränderten Referenzen wurden mit `makeValueSource`, `evalReferenz` und `computeRbe` des bestehenden Clients gegengerechnet. Effektive Eigenschaften berücksichtigen dabei vorhandene Artefakte. Keine neue Berechnungsformel und keine Änderungen an gespeicherten Charakteren.

| Referenz | RH gesamt | Konstitution | Stärke effektiv | Rüstungsmanöver | RBE ungerundet (hier gekürzt) | Ziel erreicht |
|---|---:|---:|---:|---:|---:|---|
| Bauer | 9 | 13 | 15 | 3 | 0 | Ja |
| Wachmann | 24 | 13 | 15 | 14 | 0,2 | Nein |
| Schütze | 7 | 13 | 15 | 5 | 0 | Ja |
| Nahkämpfer | 22 | 13 | 17 | 14 | 0 | Ja |
| Hauptmann | 16 | 13 | 15 | 7 | 0,033333… | Nein |
| KI-Spezialist | 27 | 13 | 20 | 16 | 0 | Ja, mit vorhandener Artefaktausrüstung |

Bei unveränderter Rüstung und Eigenschaften würde der Wachmann Rüstungsmanöver 16 statt 14 benötigen, der Hauptmann 8 statt 7. Dies sind rechnerische Zielwerte, noch keine auf SP-Budget und Steigerungsvoraussetzungen geprüften Änderungen.

Die Prüfung betrifft die bisherige Ausstattung: Beim Bauern fehlt Stoff am Kopf, seine Lederlage deckt nur Torso und Beine ab. Beim Schützen liegt Leder nur am Torso; beim Nahkämpfer nur an den Beinen; bei Hauptmann und KI-Spezialist fehlt Leder am Kopf. Der Wachmann trägt keine Lederlage. Ein Ergänzen auf die nun festgelegte übliche Abdeckung verlangt eine erneute Kosten- und RBE-Prüfung. Die bisherigen Referenzen sind deshalb noch keine fertig angepassten Rüstungspakete.

## Ausgearbeitete Pakete

Die [konkrete Paketprüfung](Ruestungspakete-Pruefung.md) enthält Handwerker- und Nahkämpferpakete mit Katalogteilen, Verarbeitung, Anpassung, Preisen, RS/RH, benötigten Rüstungsmanövern und vollständigem Budgetvergleich auf allen sechs Referenzen. Eine günstigere Handwerkervariante, ein Eisenpanzer statt Lederpanzer und optionaler Kopfschutz sind separat geprüft. Die Vorschläge stehen in `data/ruestungspakete.draft.json`; `scripts/ruestungspakete.mjs` berechnet den Bericht und die zugehörigen Prüfdaten aus dem bestehenden Clientmodell neu.

## Fertigung und Anpassung je Teil

Die festen Pakete sind Ausgangspunkte, keine optimierten Endzustände. Fertigung und Anpassung sind pro Teil gemeinsam zu vergleichen: zusätzliche Dublonen können den Schutz verbessern oder eine RH-Schwelle unterschreiten und dadurch Ausbildungs-SP bzw. Talentanforderungen einsparen. Die Mindest-RH der Lage bleibt dabei bestehen. Bei der Auswahl auch die Katalogverfügbarkeit berücksichtigen.

Konkrete Modellgegenprobe bei Konstitution 13/Stärke 15: leichte Stoff- und Lederrüstung überall, jeweils Gesellenarbeit und von der Stange, kostet 192 D bei RH 16 und benötigt Rüstungsmanöver 8. Nur die Lederrüstung am Torso anzupassen erhöht die Kosten auf 204 D, senkt RH auf 15 und den Bedarf auf Rüstungsmanöver 7. Der Schutz bleibt gleich: **12 D mehr ersetzen 9 SP Ausbildung**. Alle vier Lederteile angepasst kosten 240 D und benötigen nur Rüstungsmanöver 4. Das ist keine Pflicht, alle Teile einheitlich anzupassen.

Fertigung und Anpassung sind in der Vorschau pro belegtem Teil auswählbar, mit RS/RH und Teilpreis für jede Option. Nach einer Änderung werden der vollständige Charakter, die notwendige Ausbildung und alle Budgets erneut berechnet. Anlegen ist erst bei 0 RBE und bestandenen Prüfungen möglich.

## Automatische Kombinationensuche

Im Assistenten ist die automatische Auswahl von Fertigung und Anpassung standardmäßig aktiviert und kann ausgeschaltet werden. Vor der Vorschau durchsucht sie die Kombinationen für sämtliche gewählten Rüstungsteile. In der Vorschau kann sie nach manuellen Änderungen erneut ausgeführt werden. Die Ausgangsfigur bleibt erhalten; gefunden wird eine separat berechnete Ausstattung.

Zwei ausdrücklich bezeichnete Ziele:

- **Mehr Schutz:** Höchste Summe der RS der vier Zonengruppen innerhalb aller Grenzen; bei Gleichstand zuerst weniger zusätzliche Rüstungsmanöver, dann geringere Rüstungskosten. Keine Gewichtung nach Trefferwahrscheinlichkeit.
- **Sparsam:** Niedrigste Rüstungskosten bei mindestens gleichem RS an jedem Teil; bei Gleichstand weniger zusätzliche Ausbildung, dann mehr Schutz.

Für beide gilt: tatsächliche RBE 0, ausreichende Dublonen und SP, bestehende Talentgrenzen sowie Katalogverfügbarkeit. RS darf an keinem vorhandenen Teil sinken. Material/Basisteil und belegte Lagen/Zonen bleiben fest. Der Ausgangspunkt ist das gewählte Paket bzw. die aktuelle manuelle Ausstattung. Bereits gelernte Rüstungsmanöver bleiben erhalten, nur zusätzliche geplante Punkte können entfallen. Neue Talente werden nicht automatisch gekauft. Bei unbekannter Herkunft sind nur Kombinationen zugelassen, die in beiden Welten regulär kaufbar sind; für explizit bestehende Charaktere gilt die bisherige Ausnahme.

Die Suche kombiniert alle Fertigungen und Anpassungen, verwirft unzulässige Optionen und behält für jede Gesamt-RH/RS-Kombination den günstigsten Teilplan. Dadurch werden auch gemischte Ausstattungen gefunden, ohne alle Kombinationen einzeln vollständig aufbauen zu müssen. Die bezahlbaren Ausbildungsstufen und der fertige Kandidat werden mit dem bestehenden Charaktermodell nachgerechnet. Eine erfolglose Suche lässt die bisherige Vorschau unverändert und nennt die Grenze.

Gegenprobe: Bei Konstitution 13/Stärke 15, höchstens bezahlbarem Rüstungsmanöver 7 und 204 D Rüstungsbudget findet die Automatik genau ein angepasstes Lederteil neben drei von der Stange. Ergebnis: RH 15, Rüstungsmanöver 7, RBE 0, unveränderter RS. Eine unabhängige vollständige Aufzählung aller Fertigungs-/Anpassungskombinationen an zwei Teilen prüft beide Optimierungsziele gegen das tatsächliche Optimum.
