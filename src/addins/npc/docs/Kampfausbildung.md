# Kampfausbildung — konkrete Fertigkeitsziele

Stand: 13. September 2026. Nutzerkorrektur: **Spezialisierung = Hauptfertigkeit**, bisherige H/S-Ziele mitteln. Daraus H5/S5 (4,5 aufgerundet), H9/S9 und H15/S15. Aufrundung ist die konkrete Umsetzung für ganzzahlige Werte. SF-/Lade-/Ausbilder-Zusätze bleiben Entwurf. Noch nicht im Generator umgesetzt. Konkretisiert die [Kampfachse](Weitere-Achsen.md). Beruf, WHK-Güte, militärischer Rang und Kreis bleiben unabhängig. Vollständige Rollenbudgetprüfung bleibt zurückgestellt.

## Mindestziele je gewähltem Waffenbereich

H = gekaufter Wert der passenden Hauptfertigkeit, S = gekaufter Wert genau einer passenden Waffenspezialisierung. Zahlen sind Mindestziele, keine additiven Boni und keine Erfolgswahrscheinlichkeiten.

| Ausbildung | H | S | Ausweichen | Selbstbeherrschung | Passender Ladeschütze, nur Fernkampf | Pädagoge |
|---|---:|---:|---:|---:|---:|---:|
| Keine zusätzliche Ausbildung | kein Zusatz | kein Zusatz | kein Zusatz | kein Zusatz | kein Zusatz | kein Zusatz |
| Selbstschutz | 5 | 5 | 3 | 2 | 2 | – |
| Dienstausbildung | 9 | 9 | 6 | 4 | 4 | – |
| Spezialist | 15 | 15 | 9 | 6 | 8 | – |
| Ausbilder | 15 | 15 | 9 | 6 | 8 | 8 |

Die bisherigen Paare werden gemittelt: (6+3)/2 = 4,5 → 5; (12+6)/2 = 9; (18+12)/2 = 15. H und S sind jeweils gleich. Ausbilder erhalten Vermittlungskompetenz, keine automatische zusätzliche Kampfstärke. Die SF ergänzen Abwehr, Belastung und Bedienung. Die Gleichsetzung und Mittelung folgen der Nutzerkorrektur; die übrigen SF- und Pädagoge-Ziele bleiben unbestätigte Planungswerte. Zusätzliche Kampftalente und Manöver werden nicht pauschal vergeben; dies ist ein Fertigkeitsprofil, kein vollständiges Talentpaket.

## Waffenbereiche und Regelzuordnung

Eine Hauptwaffe je gewähltem Bereich; weitere Waffen nur ausdrücklich ergänzen. Bögen und Armbrüste getrennt ausbilden. Die bisher umgangssprachlich „Schusswaffen“ genannte Pulverwaffenachse heißt präzise **Feuerwaffen**: Die Regelreferenz fk_schusswaffen bezeichnet Armbrüste.

| Wahl | Hauptfertigkeit | Spezialisierung | Lade-SF |
|---|---|---|---|
| Unbewaffneter Kampf | `nk_unbewaffnet` | `nk_spez_unbewaffnet_unbewaffnet`, alternativ ausdrücklich gewählter vorhandener Kampfstil | keine |
| Axt | `nk_hiebwaffen` | `nk_spez_hiebwaffen_aexte` | keine |
| Schwert | `nk_klingenwaffen` | `nk_spez_klingenwaffen_schwerter` | keine |
| Speer | `nk_stangenwaffen` | `nk_spez_stangenwaffen_speere` | keine |
| Stichwaffe | `nk_stichwaffen` | nach tatsächlicher Waffenzuordnung | keine |
| Messer | `nk_unbewaffnet` | `nk_spez_unbewaffnet_messer` | keine |
| Bogen | `fk_boegen` | `fk_spez_boegen_boegen` | `sf_ladeschuetze_bogen` |
| Armbrust | `fk_schusswaffen` | `fk_spez_schusswaffen_armbrueste` | `sf_ladeschuetze_armbrust` |
| Muskete | `fk_feuerwaffen` | `fk_spez_feuerwaffen_musketen` | nach Lademechanik |
| Pistole / Revolver | `fk_feuerwaffen` | `fk_spez_feuerwaffen_pistolen` | nach Lademechanik |

Andere Hieb-, Klingen- und Stangenwaffen verwenden ihre tatsächliche Katalogspezialisierung. Messer hängen im vorhandenen Katalog unter Unbewaffnet. Kein Erwerb aller Spezialisierungen einer Hauptfertigkeit.

Feuerwaffen: Vorderlader → `sf_ladeschuetze_vorderlader`; andere regulär unterstützte Lademechaniken → `sf_ladeschuetze_patrone`, entsprechend der vorhandenen Ladezeitberechnung. Eine Muskete bestimmt nicht allein die Mechanik. Bei zwei genutzten Mechanismen beide SF separat planen. Ladeschützen-Talente sind Maximumserhöhungen, keine pauschale Kaufsperre für diese niedrigen SF-Ziele. Kanone und Rune haben im vorhandenen Filter keine passende Waffenhauptfertigkeit und erhalten kein Paket. Wurfwaffen und Blasrohre bleiben optionale spätere Erweiterungen.

Schild nur bei ausdrücklich gewählter Ausrüstung: `nk_spez_unbewaffnet_schild` mindestens auf S des gewählten Nahkampfprofils, `nk_unbewaffnet` mindestens auf denselben Wert S bringen. Elternbedingung und vorhandene höhere Ziele beachten. Das verspricht keine bestimmte Schildparade; tatsächliche Schild-/Waffenkombination und weitere Voraussetzungen separat prüfen. Schildkosten kommen hinzu.

## Kreis und Zusammenführung

- Unbewaffnet folgt weiter der zuletzt dokumentierten Auslegung **3 × Kreis**. Endziel = Maximum aus Kreissockel, vorhandenen Werten und Ausbildungszielen. Kreis+ unverändert. Kein zusätzlicher Startbonus.
- Kreis 2 mit gewähltem Unbewaffnet-Selbstschutz: H6/S6. Kreis 5 mit demselben Profil: H15/S15. Für eine ausgewählte Kampfspezialisierung gilt S = endgültiger H-Wert auch bei höherem Kreissockel. Ohne ausgewähltes Kampfprofil erzeugt der Sockel allein keine neue Spezialisierung.
- Andere Waffenfertigkeiten steigen nicht automatisch mit dem Kreis. Höhere individuelle Ziele bleiben möglich; Ausbildung wird nicht allein durch Kreis oder Rang zum Spezialisten.
- Gleiche Hauptfertigkeiten, Spezialisierungen und gemeinsame SF/WHK per Maximum zusammenführen. Nach Zusammenführung ausgewählte Kampfspezialisierungen auf den endgültigen Elternwert nachziehen (S = H), ohne ungewählte Spezialisierungen hinzuzufügen. Pistolen-Spezialist plus Musketen-Selbstschutz ergibt dadurch Feuerwaffen 15, Pistolen 15, Musketen 15. Getrennte niedrigere S-Ziele unter derselben Hauptfertigkeit bleiben bei strikter Gleichsetzung nicht erhalten; die zusätzlichen Kosten sichtbar ausweisen.
- Additive Beiträge aus anderen Achsen zuerst bilden; danach nur fehlende Punkte zu den Mindestzielen ergänzen. Eine Quelle bei Neuberechnung nicht erneut addieren. Ausweichen und Selbstbeherrschung nicht je Waffenbereich vervielfachen.
- Ausbilder-Pädagoge 8 zählt einmal zu WHK und zum 5-%-Minimum. Führung, Militärtheorie und Schrift folgen der tatsächlichen Aufgabe, nicht automatisch Ausbilder oder Rang.
- Reguläre Maxima NK/FK/WHK 24, GF/SF 12; S ≤ H. Profile benötigen allein wegen dieser Zahlen keine Maximumstalente. Weitere Voraussetzungen prüfen. Unbewaffnet-Sockel ab Kreis 9 übersteigt 24: Freischaltung oder sichtbarer Konflikt, keine stille Kappung.
- NK/FK liegen außerhalb der GF/SF-Grenze. Ausweichen, Selbstbeherrschung und Ladeschütze zählen zusammen mit Beruf, Hintergrund, Magie und Rüstungsmanöver gegen die gemeinsame Grenze. Rüstungsmanöver weiterhin bedarfsabhängig aus konkreter Rüstung.

## Kosten ab Wert 0

Hauptfertigkeit NK: 25 SP/Punkt; FK: 18. Bei genau einer Spezialisierung unter dem jeweiligen Elternwert S im NK: 15 SP/Punkt; FK: 10. Weitere Geschwister: aktuelle Werte absteigend sortieren, Gleichstand nach Katalog; NK-Sätze 15/8/4, FK 10/5/3. Deshalb nach Zusammenführung gesamte Geschwisterkosten neu berechnen. Kostenrang ist nicht Ausbildungsrang.

| Profil | NK H+S | FK H+S | Ausweichen + Selbstbeherrschung | Eine Lade-SF zusätzlich | Pädagoge zusätzlich |
|---|---:|---:|---:|---:|---:|
| Selbstschutz | 200 | 140 | 45 | 18 | – |
| Dienstausbildung | 360 | 252 | 90 | 36 | – |
| Spezialist | 600 | 420 | 135 | 72 | – |
| Ausbilder | 600 | 420 | 135 | 72 | 38 |

Isoliertes Nahkampfprofil insgesamt: **245/450/735/773 SP**. Isoliertes Fernkampfprofil mit einer Lade-SF: **203/378/627/665 SP**. Ohne Überschneidungen, Kreissockel-Zukauf, Schild, zusätzliche Talente, Eigenschaften oder Ausrüstung. Keine vollständigen NPC-Budgets.

Speer-Dienstausbildung plus Vorderlader-Musketen-Selbstschutz: 360 + 140 + 90 gemeinsame SF + 18 Lade-SF = **608 SP**. Die 45 SP des kleineren gemeinsamen SF-Pakets kommen nicht nochmals hinzu. Unbewaffnet-Sockel und übrige Pflichten fehlen noch.

Feuerwaffen 15, Pistolen 15, Musketen 15: 15×18 + 15×10 + 15×5 = **495 SP** für H+S. Gegenüber dem isolierten Pistolen-Spezialisten für 420 SP sind das 75 SP mehr. Nicht beide isolierten Profilpreise addieren.

Gegenüber dem bisherigen H/S-Paar spart Dienst 30 SP im NK bzw. 24 SP im FK, Spezialist ebenso 30/24 SP. Selbstschutz kostet wegen Aufrundung beider Werte auf 5 dagegen 5 SP im NK bzw. 2 SP im FK mehr. Keine pauschale Ersparnis für diese gerundete Zeile behaupten.

## Tatsächliche Proben

Mit jeweils 15 in allen beteiligten Eigenschaften und ohne Waffen-/Situationsmodifikatoren:

| Profil | Speer AT-Basis / PA-Basis | FK-Basis mit S |
|---|---:|---:|
| Selbstschutz H5/S5 | 11⅔ / 11⅔ | 10 |
| Dienst H9/S9 | 13 / 13 | 12 |
| Spezialist / Ausbilder H15/S15 | 15 / 15 | 15 |

Speer AT = min(20,(Mut+Athletik+H)/3), PA = min(20,(Athletik+Schnelligkeit+H)/3). S wirkt im Waffenpool, nicht einfach als Zuschlag auf beide Basiswerte. FK = (Sinnesschärfe+Geschicklichkeit+H+S)/4. Gute/meisterliche FK-Werte hängen außerdem von Fernkampfgeschick und der vollständigen Probe einschließlich Waffen-/Entfernungsmodifikatoren ab. Spezialist vergibt dieses Talent nicht automatisch.

Defensiv/Ausgewogen/Offensiv verändert die gekauften Mindestwerte nicht; konkrete legale Poolverwendung und Ausrüstung folgen der Haltung. Verlangte AT-/PA-/FK-Ergebnisse müssen mit tatsächlichen Eigenschaften, Waffen, Entfernung und Talenten geprüft werden. Diese Zahlen versprechen keine gleichen Erfolgsquoten aller Völker.

## Prüfstand und Fortsetzung

Referenzen, Elternzuordnungen, Kosten, reguläre Maxima, Ladeschützenzuordnung und Basisformeln anhand lokaler Quellen geprüft: `src/data/rules-jsonl/nahkampf.jsonl`, `fernkampf.jsonl`, `sonderfertigkeit.jsonl`, `whk.jsonl`; `src/engine/waffenSpezKosten.ts`, `fertigkeitenGrenzen.ts`, `ladeschuetzeGating.ts`, `fernkampfLadezeit.ts`, `characterSheet.ts`. Rechenbeispiele separat geprüft. Keine vollständige Talentketten-, Waffenbedienungs-, Gesamtbudget- oder Generatorprüfung.

H/S-Mittelung und Gleichsetzung sind vom Nutzer angewiesen; Aufrundung 4,5 → 5 sowie das Nachziehen bei Überschneidungen sind hier ausdrücklich dokumentierte Umsetzungsdetails. SF-/Lade-/Pädagoge-Ziele bleiben Entwurf. Zusätzliche Gefechtsziele wie bestimmte Ladezeit oder gute Treffer brauchen konkrete Waffen und Talentpakete. Nächster vorgeschlagener Schritt: magische Ausbildungsachse je KI, Spruchmagie und PSI mit Kernfähigkeiten, Fertigkeitszielen und Voraussetzungen konkretisieren. Vollständige Bauern-/Wachen-Budgetprüfung bleibt zurückgestellt.
