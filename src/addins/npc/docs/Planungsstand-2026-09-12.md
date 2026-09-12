# NPC-Erstellung – gesicherter Planungsstand vom 12. September 2026

Referenz für die spätere Fortsetzung. Die folgenden Entscheidungen sind festgehalten; daraus folgt keine bereits erfolgte Umsetzung im Generator oder Überarbeitung bestehender Charaktere.

## Beschreibende Auswahlen

- Rechtsstand: Privilegiert, Frei, Leibeigen, Schuldversklavt, Sklave. Keine Berechnung oder Budgetwirkung. Bestätigte Tooltips in [Soziale Lage und Rechtsstand](Soziale-Lage.md). Bedingte Freitextfelder: Leibeigen → Adligen erfassen; Schuldversklavt → Betrag und Gläubiger; Sklave → Besitzer. Bei Privilegiert/Frei keine Zusatzfelder. Betrag bleibt Freitext.
- Militärischer Rang: rein beschreibend, nach Heer/Infanterie, Kavallerie und Marine. Ausbildungsränge aufgenommen, Brigadier und Kommodore ausgeschlossen. Einheit, Dienststellung und Status sind Dropdowns. Kataloge bestätigt in [Militärischer Rang](Militaerischer-Rang.md). Rang und Dienststellung frei kombinierbar.

## Einheitliche Berechnungsgrundlage

- Gesamt-SP = 6.400 + Gesamt-EP; Stufe/Kreis aus der bestehenden EP-Stufe-Kreis-Tabelle. Volle reguläre Volksminima in allen Kreisen, regelkonforme ausdrücklich gewählte Nachteile gesondert.
- Rüstung: allgemein höchstens 3 KBE, keine MBE; strengere Ziele 0–2 ausdrücklich wählbar. Ungerundet RBE ≤ Ziel. Dies gilt auch für Vollgerüstet. Die einfache Wache erhält Zeughausrüstung von der Stange ohne automatische Anpassung in ihrer Standardauswahl.
- Ausrüstungsbudget: Kreis 0 / Stufe 0 erhält 5.000 D wie ein normal gestarteter Spielercharakter. Für höhere Kreise bleibt das zusätzliche Budget nach der bestehenden NPC-Kreis-Kurve erhalten; deren Tabellenwerte sind Gesamtbudgets. Geldbeutel separat behandeln.
- Einzelheiten und reproduzierbare Volkstabellen: [Budgetgrundlage](Budgetgrundlage.md).



Bestätigte Ergänzung vom 12. September 2026: Rüstungsmanöver wird als kleinstes notwendiges Mindestziel aus geplanter Rüstung, tatsächlichen Charakterwerten und KBE-Ziel abgeleitet. Vorhandene Werte anrechnen, nur fehlende Punkte kaufen; gegen GF/SF- und SP-Budget prüfen. Tragen bleibt für Materiallast erhalten. Gilt auch für zivile Berufe und Vollgerüstet. Formel und Konfliktregeln siehe [Rüstung](Ruestung.md). Umsetzung im freien Generator steht aus.

## Geldbeutel und Pflichtmerkmale

- Geldbeutel ist ausschließlich mitgeführtes Bargeld, getrennt von Vermögen, Ausrüstungsqualität und sozialer Lage.
- Basisbeträge arm/billig/gewöhnlich/gehoben/elitär/reich: 500 fz / 5 D / 50 D / 200 D / 1.000 D / 10.000 D. Jeweils Zufallsfaktor 0,5–1,5. Siehe [Geldbeutel](Geldbeutel.md).
- Aussehen: Widerwärtiges Aussehen 5 %, Hässlichkeit 10 %, Normal 70 %, Gutes Aussehen 10 %, Herausragendes Aussehen 5 %. Allerweltsgesicht ausschließlich manuelle Meisterauswahl.
- Schlaf: Insomnia 5 %; übrige 95 % gleichmäßig auf Leichter Schlaf, Normal, Tiefer Schlaf. Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten.
- Spruchmagie: Kreis 0–2 drei Schulen, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ übernimmt die Anzahl seines Kreises. Eine gewählte Schule ist die Schwerpunktschule.

## Bestätigte SP-Vorgaben

- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens 5 % des gesamten SP-Budgets tatsächlich investieren. Hauptfertigkeiten und Spezialisierungen zählen zusammen. Eigenständige Alltagskompetenz sicherstellen. Berufs-, Terrain-, Lebenswelt- und Soziallagenbeiträge zählen mit. Mehr WHK ist möglich; andere Rollen können mehr Spielraum für Kampf nutzen.
- Attribute: mindestens 3 % des gesamten SP-Budgets tatsächlich investieren; Eigenschaften zählen nicht mit. Rollenbezogene Attributkäufe anrechnen.
- Prozentuale Mindestbeträge aufrunden. Reservierung und tatsächliche Ausgabe nicht doppelt abziehen.
- SSK: festes Standardpaket Hauptsprache 3 (50 SP) + Herkunftskultur 3 (40 SP) = 90 SP.
- Professionen mit belegtem Schriftbedarf: zusätzlich passende Schrift mindestens Stufe 2 (30 SP). Händler zusätzlich eine andere Sprache auf Stufe 2 (30 SP). Mit Schrift 120 SP, Händler mit Schrift 150 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.

## Budgetspielraum auf Stufe 0 – teuerstes reguläres Volksminimum

Am 12. September 2026 direkt aus `src/data/voelkerMaxima.json` und der Tabelle `Eigenschaften-Kosten` in `src/data/lookups.json` geprüft: Trolle haben mit 3.351 SP die höchsten Gesamtkosten der regulären Eigenschaftsminima.

| Posten | SP-Abzug | Verbleibende SP |
|---|---:|---:|
| Gesamtbudget Stufe 0 | — | 6.400 |
| Reguläre Eigenschaftsminima: Trolle | 3.351 | 3.049 |
| GF/SF: Beispiel bei Ausschöpfung von 90 Punkten | 810 | 2.239 |
| WHK-Mindestbudget: 5 % | 320 | 1.919 |
| Attribut-Mindestbudget: 3 % | 192 | 1.727 |
| SSK-Standard | 90 | **1.637** |
| Zusätzlich bei Schriftbedarf: Schrift 2 | 30 | **1.607** |
| Zusätzlich beim Händler: andere Sprache 2 | 30 | **1.577** |

Die Tabelle zeigt die beispielhafte Ausschöpfung der Planungsobergrenze von 90 GF/SF-Punkten, keinen Pflichtabzug. Bei Basis 0 bleiben vor Achsenbeiträgen 2.447 SP nach WHK-, Attribut- und SSK-Minimum; jeder tatsächlich gekaufte GF/SF-Punkt kostet davon 9 SP. Ohne die bedingten SSK-Zusätze bleiben bei 90 Punkten 1.637 SP. Daraus sind zusätzliche Eigenschaften, Waffenfertigkeiten einschließlich Unbewaffnet, Magie und weitere berufliche Vertiefung zu bezahlen. Aussehen kann durch Kosten, Gutschriften und Voraussetzungen den Rest verändern. Die Rechnung reserviert die Mindestbudgets; ein konkreter legaler Kauf kann darüber liegen. Talente und Ausrüstung haben separate Budgets.

Diese Rechnung verwendet volle reguläre Volksminima und 6.400 SP auf Stufe 0. Die älteren reduzierten Kreis-0/0+-Planungswerte wurden bei der Vereinheitlichung am 12. September 2026 entfernt. Stufe 0 entspricht Kreis 0; Kreis+ bezeichnet die mittlere Stufe, ein eigener Kreis 0+ entfällt. Die aktualisierten Volkstabellen und Budgetdaten verwenden reguläre Minima.

## Messung der sechs aktuellen Referenzen

Aktive Dateien: `src/addins/npc/data/npc/`. SP-Ausgaben am 12. September 2026 aus diesen Dateien neu berechnet; nicht aus älteren Exporten. GF/SF anhand der bestätigten Kostenformel 9 SP je Punkt; WHK anhand der aktuellen Hauptfertigkeitsformel und Spezialisierungstabelle. Charaktere unverändert.

| Referenz | Gesamt-SP | GF-SP | SF-SP | GF/SF gesamt | WHK Hauptfertigkeiten | WHK Spezialisierungen | WHK gesamt | Fehlbetrag zum WHK-Minimum |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Bauer | 6.400 | 315 | 315 | 630 | 429 | 269 | 698 | 0 |
| Wachmann | 6.400 | 432 | 423 | 855 | 137 | 64 | 201 | 119 |
| Räuberhauptmann | 8.000 | 684 | 405 | 1.089 | 185 | 73 | 258 | 142 |
| Räuber-Schütze | 6.400 | 522 | 576 | 1.098 | 93 | 57 | 150 | 170 |
| Räuber-Nahkämpfer | 6.400 | 324 | 468 | 792 | 90 | 39 | 129 | 191 |
| KI-Spezialist | 8.000 | 270 | 630 | 900 | 47 | 18 | 65 | 335 |

## Offene Arbeit für die Fortsetzung

1. GF/SF-Beiträge von Beruf und Lebenswelt samt Zusammenführung sind als [Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet; neue Paketwerte noch nicht ausdrücklich bestätigt. Basis 0 und ca. 90 Punkte bleiben bestehen. Als Nächstes WHK-Alltagsausbildung festlegen.
2. Weitere berufliche und kämpferische Kompetenzziele festlegen; Unbewaffnet mit 3 × Kreis ist entschieden.
3. Konkrete Magieausbildung, Voraussetzungen und Budgetbedarf ausarbeiten.
4. GF/SF-Budgetsteigerung und sinnvolle Obergrenze für höhere Stufen bestimmen.
5. Schriftbedarf und passende Schrift je Profession belegen.
6. Erledigt: SP- und Volksminima-Planung mit dem aktuellen Stufenmodell vereinheitlicht; allgemeines Rüstungsziel auf höchstens 3 KBE ohne MBE vereinheitlicht. Ausrüstungsbudget für Kreis 0 geklärt: 5.000 D wie beim normalen Spielercharakter. Das Zusatzbudget für höhere Kreise einschließlich Kreis+-Interpolation bleibt gemäß Budgetgrundlage bestehen.
7. Anschließend Generator und Referenzen budgetgerecht umsetzen; keine automatische Erhöhung der Gesamtbudgets zur Finanzierung.

Weitere Details: [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md), [Budgetgrundlage](Budgetgrundlage.md), [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).


## WHK-Ausarbeitung vom 12. September 2026

[WHK-Alltagsausbildung nach Beruf und Professionsgüte](WHK-Alltagsausbildung.md): konkreter Entwurf für alle 30 Berufe und sechs Güten, drei Alltagsfelder, Zusammenführung und Ergänzung bis zum tatsächlichen 5-%-Minimum. Militärische Ränge bleiben beschreibend; zusätzliche Ausbildungsprofile sind separat wählbare Vorschläge. Neue Zahlen noch nicht bestätigt, keine Generatorumsetzung. Die früher als offen bezeichneten WHK-Ziele sind damit ausgearbeitet; Bestätigung und vollständige Budgetkalibrierung bleiben offen.


## Weitere Achsen — Entwurf vom 13. September 2026

[Weitere Achsen](Weitere-Achsen.md) konkretisiert Kampfausbildung, Kampfweise/Einsatz, magische und geweihte Aufgaben, Schriftgebrauch sowie Ausrüstungszugang. Neue Optionen sind unbestätigte Entwürfe. Nutzerpriorität: zunächst weitere Achsen definieren; vollständige Bauern-/Wachen-Finanzierbarkeitsprüfung zurückgestellt. Nächster Vorschlag: konkrete Kampf-Ausbildungsziele je Waffenbereich.


## Kampfausbildung konkretisiert — 13. September 2026

[Konkrete Fertigkeitsziele](Kampfausbildung.md): Selbstschutz H5/S5, Dienstausbildung H9/S9, Spezialist H15/S15, Ausbilder zusätzlich Pädagoge 8; passende SF-, Lade- und Schildziele sowie Kosten/Zusammenführung ausgearbeitet. H/S gemäß Nutzerkorrektur gemittelt und gleichgesetzt (Selbstschutz 4,5 auf 5 aufgerundet); SF-/Ausbilder-Zusätze bleiben Entwurf. Feuerwaffen verwenden `fk_feuerwaffen`, Armbrüste `fk_schusswaffen`; Bögen separat. Frühere offene Kampf-Zahlenziele sind damit ausgearbeitet, Bestätigung und Gesamtprüfung stehen aus. Nächster Vorschlag: magische Ausbildungsachse je KI/Spruchmagie/PSI.
