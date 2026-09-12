# NPC-Budgetgrundlage

Vereinheitlicht am 12. September 2026. Berechnet aus den aktuellen Client-Regeldaten. Dies ist die Planungsgrundlage für wertelose Templates und Arbeitsaufträge; die laufende Charakterberechnung wurde nicht geändert.

## Verbindliche Berechnung

- Volle reguläre Volksminima aus `src/data/voelkerMaxima.json` in allen Kreisen, einschließlich Stufe 0. Keine prozentuale Senkung und kein pauschaler Abzug von 1 oder 2 Punkten. Ausdrücklich gewählte regelkonforme Nachteile bleiben gesonderte Ausnahmen.
- Gesamt-SP = 6.400 + Gesamt-EP. Stufe und Kreis folgen der vorhandenen Tabelle `EP-Stufe-Kreis`. Stufe 0 entspricht Kreis 0 mit 6.400 SP; ein eigener Kreis 0+ entfällt, weil Kreis 0 nur Stufe 0 umfasst.
- Nach jeder budgetrelevanten Multiplikation aufrunden; insbesondere die Mindestbeträge für WHK (5 %) und Attribute (3 %). Die regulären ganzzahligen Volksminima werden direkt bepreist.
- Es werden zehn Eigenschaften erfasst. Attribute, weitere Eigenschaftssteigerungen und Fähigkeiten gehören nicht zu diesem Sockel.
- Die Kostenspalte heißt in der Quelldatei „Gesamt-EP“, wird in der App aber als SP-Ausgabe verwendet.

## SP-Budget je Kreis (NSC)

Korrigiert (Nutzer 2026-09-11, vorherige Fassung war ein Missverständnis): SP braucht keine eigene
NSC-Kurve. `kreis` und `SP = 6.400 + ep_gesamt` werden beide direkt aus `ep_gesamt` über dieselbe,
bereits im Client vorhandene Tabelle abgeleitet (`EP-Stufe-Kreis` in `src/data/lookups.json`,
ausgewertet in `src/engine/characterSheet.ts`/`eigenschaftenGrenzen.ts`). Für einen NSC eines
bestimmten Kreis genügt es, `ep_gesamt` auf die erste Stufe dieses Kreises zu setzen – Kreis-Label
und SP-Budget bleiben dadurch automatisch konsistent, ohne Sonderformel.

"Kreis N+" (Nutzer-Korrektur 2026-09-11) bedeutet die MITTLERE Stufe des jeweiligen Kreis-
Stufenbereichs (nicht die letzte) – jeder Kreis n umfasst genau 2n+1 Stufen (siehe
`engine/roleGenerator.ts`-Kommentar), die Mitte ist damit immer eindeutig ein ganzzahliger
Stufenwert.

| Kreis | Erste Stufe | EP | SP (6.400 + EP) | Kreis N+ (mittlere Stufe) | EP | SP |
|---|---:|---:|---:|---:|---:|---:|
| 0 | 0 | 0 | 6.400 | – | – | – |
| 1 | 1 | 20 | 6.420 | 2 | 60 | 6.460 |
| 2 | 4 | 200 | 6.600 | 6 | 400 | 6.800 |
| 3 | 9 | 700 | 7.100 | 12 | 1.150 | 7.550 |
| 4 | 16 | 1.750 | 8.150 | 20 | 2.550 | 8.950 |
| 5 | 25 | 3.550 | 9.950 | 30 | 4.800 | 11.200 |
| 6 | 36 | 6.300 | 12.700 | 42 | 8.100 | 14.500 |
| 7 | 49 | 10.250 | 16.650 | 56 | 12.700 | 19.100 |

Die früheren 80-/90-%-Ansätze mit 5.120/5.760 SP sind verworfen und werden auch in den Berechnungsdaten nicht mehr verwendet. Negative EP dienen nicht als Ersatzmodell.

## Geldbudget je Kreis (NSC)

Präzisierung vom 12. September 2026: Nur das Einstiegsbudget auf Stufe 0 entspricht dem normalen Spielercharakter. Das zusätzliche Ausrüstungsbudget für höhere Kreise wird weiterhin benötigt; die folgende Kreis-Kurve und Kreis+-Interpolation bleiben erhalten. Die Tabellenwerte sind Gesamtbudgets, nicht zusätzlich auf das Startbudget aufzuschlagende Beträge.

Festgeschrieben (Nutzer 2026-09-11), auf 25 D gerundet. Basis ist das etablierte Startbudget
`startbudget_ausruestung` = 5.000 Dublonen (`src/state/characterStore.ts`,
`src/data/rules-jsonl/charakterwerte.jsonl`, sourceRow 136) bei Stufe 0 = Kreis 0.

- **Kreis 0 / Stufe 0:** 5.000 D Ausrüstungsbudget, exakt wie beim normalen Start eines Spielercharakters (Nutzerpräzisierung vom 12. September 2026). Die alten reduzierten Beträge entfallen; kein eigener Kreis 0+.
- **Ab Kreis 1:** `Dublonen(Kreis) = 5.000 + 62,5 × (Kreis − 1)⁴`. Gegengerechnet gegen eine konkrete
  Kreis-7-Ausrüstung (Faltstahl-Zweihänder Großmeisterarbeit perfekt angepasst 826 D + komplette
  Rüstung beste Materialien/Großmeisterarbeit/perfekt angepasst auf allen 4 Lagen und 4 Zonen
  40.508 D + zwei Eigenschafts-Artefakte Grad 5 12.564 D = 53.898 D): 86.000 D lässt bei dieser
  Ausstattung noch reichlich Luft.
- **Kreis N+:** arithmetisches Mittel aus Kreis N und Kreis N+1 (Kreis 7+ interpoliert gegen das
  extrapolierte Kreis 8 = 155.075 D).

| Kreis | Dublonen |
|---|---:|
| 0 | 5.000 |
| 1 | 5.000 |
| 1+ | 5.025 |
| 2 | 5.075 |
| 2+ | 5.525 |
| 3 | 6.000 |
| 3+ | 8.025 |
| 4 | 10.075 |
| 4+ | 15.525 |
| 5 | 21.000 |
| 5+ | 32.525 |
| 6 | 44.075 |
| 6+ | 65.025 |
| 7 | 86.000 |
| 7+ | 120.525 |

Die höheren Kreisbudgets enthalten einen NSC-spezifischen Mehrbetrag gegenüber dem normalen Startbudget. Sie werden nicht zusätzlich zu 5.000 D oder zum gehobenen SC-Startbudget von 6.000 D addiert. Die Startprofile für Spielercharaktere bleiben unverändert. Der Geldbeutel ist weiterhin eine separate Angabe für mitgeführtes Bargeld.

## Kosten der Volksminima

Volle reguläre Minima in allen Kreisen. Stufe 0 hat 6.400 SP, Kreis 1 beginnt mit 6.420 SP; Kreis 1+ liegt auf Stufe 2 mit 6.460 SP.

| Volk | Regulärer Sockel | Stufe 0: Rest nach 90 SSK | Kreis 1: Rest nach 90 SSK | Kreis 1+: Rest nach 90 SSK |
|---|---:|---:|---:|---:|
| Dalkini | 3150 | 3160 | 3180 | 3220 |
| Draw | 3144 | 3166 | 3186 | 3226 |
| Elfen | 3165 | 3145 | 3165 | 3205 |
| Gnome | 3222 | 3088 | 3108 | 3148 |
| Goblins | 3207 | 3103 | 3123 | 3163 |
| Indianer | 3126 | 3184 | 3204 | 3244 |
| Katzen | 3171 | 3139 | 3159 | 3199 |
| Orks | 3216 | 3094 | 3114 | 3154 |
| Trolle | 3351 | 2959 | 2979 | 3019 |
| Zentauren | 3156 | 3154 | 3174 | 3214 |
| Zwerge | 3162 | 3148 | 3168 | 3208 |

Der Rest ist noch kein frei verteilbares Budget: GF/SF, WHK, Attribute, Aussehen, zusätzliche Voraussetzungen, Beruf, Kampf und Magie sind noch zu bezahlen. Bei Schriftbedarf kommen mindestens 30 SP, beim Händler für eine andere Sprache weitere 30 SP hinzu. Prozentminima werden durch tatsächliche Käufe erfüllt und nicht zusätzlich abgezogen.

## SSK-Pflichtbündel

- Aktuelle App-Regel: mindestens 90 SP in Sprache, Schrift und Kultur sowie mindestens eine Sprache auf Stufe 1 oder höher. Lesen/Schreiben ist dadurch nicht automatisch Pflicht.
- Sprach- und Schriftkosten: Stufe 1 = 15 SP, Stufe 2 = 30 SP, Stufe 3 = 50 SP, Stufe 4 = 75 SP.
- Kulturkosten: Stufe 1 = 10 SP, Stufe 2 = 25 SP, Stufe 3 = 40 SP, Stufe 4 = 55 SP.
- Bestätigter NPC-Standard vom 12. September 2026: Hauptsprache 3 (50 SP) + Herkunftskultur 3 (40 SP) = 90 SP, fest verteilt. Dies ersetzt den bisherigen Vorschlagsstatus. Die allgemeine App-Mindestprüfung bleibt davon getrennt; Generatorregel noch nicht implementiert.
- Für jede Profession mit belegtem Schriftbedarf zusätzlich mindestens die passende Schrift auf Stufe 2 (30 SP) einplanen. Den Bedarf im Berufsprofil begründen; keine pauschale Schriftpflicht für alle Professionen. Das feste 90-SP-Paket bleibt erhalten. Mit einer Schrift auf Stufe 2 ergibt sich ein SSK-Budget von 120 SP; höhere Stufen und zusätzliche Schriften kosten entsprechend mehr. Bereits gekaufte passende Schriftkenntnisse einmal anrechnen.
- Händler: eine andere, zusätzliche Sprache auf Stufe 2 = 30 SP zusätzlich zum allgemeinen Bündel; mit dem 90-SP-Stub insgesamt 120 SP. Dieselbe Sprache darf nicht doppelt zählen.
- Sprache anhand Herkunft und Handelsgebiet wählen. Besitzt ein gewählter SSK-Stub diese Zweitsprache bereits, einen anderen Stub wählen oder den Überschneidungsfall sichtbar auflösen, statt 30 SP ohne Leistung abzuziehen.

## Aussehen und Schlaf sind Pflichtauswahlen

Für jeden NPC genau eine Aussehensstufe und eine Schlafstufe festlegen; zufällige Auswahl anschließend im Auftrag festhalten. Wahrscheinlichkeiten sind unten festgelegt. Ein Zufallswurf wird beim Neuberechnen nicht wiederholt.

| Aussehen im Regeldatensatz | SP | Voraussetzung |
|---|---:|---|
| Aussehen: Gutes Aussehen | 100 | VORAUSSETZUNG=AUS>=10 |
| Aussehen: Hässlichkeit | -100 | — |
| Aussehen: Herausragendes Aussehen | 250 | VORAUSSETZUNG=AUS>=15 |
| Aussehen: Widerwärtiges Aussehen | -200 | — |
| Aussehen: Normal | 0 | — |

Die fünf geordneten Aussehensstufen sind Widerwärtiges Aussehen, Hässlichkeit, Normal, Gutes Aussehen und Herausragendes Aussehen. Nutzerentscheidung vom 12. September 2026: Allerweltsgesicht bleibt als manuelle Meisterauswahl verfügbar, ist aber vom Randomizer ausgeschlossen. Dies ersetzt den bisherigen vollständigen Ausschluss aus dem NPC-Template.

Bestätigte Zufallsverteilung für Aussehen:

| Aussehensstufe | Wahrscheinlichkeit |
|---|---|
| Widerwärtiges Aussehen | 5 % |
| Hässlichkeit | 10 % |
| Normal | 70 % |
| Gutes Aussehen | 10 % |
| Herausragendes Aussehen | 5 % |
| Allerweltsgesicht | Nur manuelle Meisterauswahl |

Die fünf Zufallsgewichte ergeben zusammen 100 %. Die Verteilung gilt ausschließlich für Aussehen. Festlegung für den künftigen Generator, noch nicht implementiert.
Gutes/herausragendes Aussehen kann zusätzliche Ausstrahlungssteigerungen erfordern. Diese Mehrkosten oberhalb des Volkssockels separat reservieren. Negative Aussehenskosten geben SP zurück.

| Schlaf im Regeldatensatz | SP | Wirkung |
|---|---:|---|
| Schlaf: Insomnia | 0 | Regenerationsklasse −2. Sinnesschärfe +5, ausschließlich während des Schlafs. |
| Schlaf: Leichter Schlaf | 0 | Regenerationsklasse −1. Sinnesschärfe −5, ausschließlich während des Schlafs. |
| Schlaf: Normal | 0 | Die Regenerationsklasse bleibt unverändert. Sinnesschärfe −10, ausschließlich während des Schlafs. |
| Schlaf: Tiefer Schlaf | 0 | Regenerationsklasse +1. Sinnesschärfe −15, ausschließlich während des Schlafs. |

Verbindlich gibt es genau vier Schlafstufen. Es fehlt keine fünfte Stufe. Pflichtauswahl bedeutet hier keine positiven Fixkosten: alle vier vorhandenen Optionen kosten 0 SP.

Nutzerentscheidung vom 12. September 2026: Insomnia erhält 5 % Zufallswahrscheinlichkeit; „Rest random“ wird als gleichmäßige Verteilung der übrigen 95 % auf Leichter Schlaf, Normal und Tiefer Schlaf umgesetzt (je exakt 95/3 %, ungefähr 31,67 %). Für eine exakte Ziehung eignen sich relative Gewichte 3/19/19/19. Diese Wahrscheinlichkeiten werden nicht auf ganze Prozent aufgerundet. Die Auswahl erfolgt einmalig und bleibt bei Neuberechnungen erhalten. Festlegung für den künftigen Generator, noch nicht implementiert.

## GF/SF-Bündel: Referenzmessung

Grund- und Sonderfertigkeiten kosten im aktuellen Regelstand jeweils 9 SP pro gekauftem Punkt. Die folgende Auswertung umfasst sämtliche GF/SF der sechs vorhandenen Vorlagen, einschließlich beruflicher, kämpferischer und magischer Sonderfertigkeiten. Sie ist deshalb noch kein universelles Grundausbildungsbündel.

| Referenz | GF | SF | Zusammen | Gesamt-SP | Anteil, auf 0,01 Prozentpunkte aufgerundet |
|---|---:|---:|---:|---:|---:|
| bauer | 315 | 315 | 630 | 6400 | 9.85 % |
| wachmann | 432 | 423 | 855 | 6400 | 13.36 % |
| hauptmann | 684 | 405 | 1089 | 8000 | 13.62 % |
| schuetze | 522 | 576 | 1098 | 6400 | 17.16 % |
| nahkaempfer | 324 | 468 | 792 | 6400 | 12.38 % |
| ki | 270 | 630 | 900 | 8000 | 11.25 % |

Am 12. September 2026 aus den sechs aktuellen Dateien in `src/addins/npc/data/npc/` neu berechnet; ersetzt die Messung vor der Referenzkorrektur. Gezählt werden gekaufte Werte der Kategorien Grundfertigkeit und Sonderfertigkeit mit jeweils 9 SP pro Punkt. Nenner ist das gesamte verfügbare SP-Budget, einschließlich noch freier SP. Zusammen 5.364 von 41.600 SP, also rund 12,90 %. Keine Charakterwerte verändert.

Aktualisierte Nutzerentscheidung vom 12. September 2026: GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Konkrete Achsenbeiträge, Zusammenführung und Konfliktbehandlung sind noch auszuarbeiten. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.

Die bisherige feste Reservierung von 94 Punkten / 846 SP und die vorgeschlagene gemeinsame Verteilung sind verworfen. Bestehende Referenzen bleiben Messwerte, keine Sollvorgaben.

Stufe 0 entspricht Kreis 0; es gibt kein separates reduziertes Einstiegsmodell. Siehe [aktuelle GF/SF-Planung](Grundausbildung-Stufe-0.md).

## Technischer Abgleich

### WHK-Mindestbudget – Nutzerentscheidung vom 12. September 2026

Jeder NPC soll mindestens 5 % seines gesamten SP-Budgets in WHK investieren. Mindestbetrag = aufrunden(Gesamt-SP × 0,05). Hauptfertigkeiten und Spezialisierungen zählen gemeinsam; bereits enthaltene Berufs-, Terrain-, Lebenswelt- und Soziallagenbeiträge werden einmal angerechnet. Die tatsächlichen Ausgaben müssen das Minimum erreichen; eine bloße Reservierung genügt nicht.

Das Minimum soll eine brauchbare eigenständige Alltagsausbildung sichern. Ein ausschließlich auf Kampfunterstützung beschränktes WHK-Profil erfüllt dieses inhaltliche Ziel nicht automatisch. Konkrete Mindestbelegung noch ausarbeiten. 5 % sind eine Untergrenze, kein einheitlicher Zielwert und keine Obergrenze: Kämpfer können darüber hinaus mehr in Kampf, Handwerker mehr in WHK investieren.

Abgleich der aktuellen sechs Referenzen anhand der gespeicherten Werte und aktuellen WHK-Kostenformeln/-tabelle:

| Referenz | WHK-SP | Gesamt-SP | 5-%-Minimum | Fehlbetrag |
|---|---:|---:|---:|---:|
| Bauer | 698 | 6400 | 320 | 0 |
| Wachmann | 201 | 6400 | 320 | 119 |
| Hauptmann | 258 | 8000 | 400 | 142 |
| Schütze | 150 | 6400 | 320 | 170 |
| Nahkämpfer | 129 | 6400 | 320 | 191 |
| KI-Spezialist | 65 | 8000 | 400 | 335 |

Planungsentscheidung für den künftigen NPC-Generator, noch nicht implementiert. Bestehende Referenzen wurden durch diese Festlegung nicht verändert; ihre Überarbeitung erfordert eine budgetgerechte Neuverteilung, keine automatische Erhöhung des Gesamtbudgets.

### Bestehende App-Berechnung

Die App verwendet 6.400 + Gesamt-EP und ungekürzte Volksminima. Diese Grundlage gilt auch für die NPC-Planung. Die neuen NPC-Pflichtbudgets und die konkrete Ausbildungsplanung sind davon getrennte, noch umzusetzende Generatoranforderungen. `scripts/budget-baseline.mjs` aktualisiert ausschließlich die berechneten Volkstabellen und `Budgetdaten.json`; redaktionelle Entscheidungen bleiben erhalten.

Quellen: src/data/voelkerMaxima.json; src/data/lookups.json (Eigenschaften-Kosten, Sprachstufe-Kosten, Kulturstufe-Kosten); src/data/rules.json; src/engine/characterSheet.ts (SSK_MINDEST_SP = 90); src/addins/npc/data/npc/*.json.

## Unbewaffnet — Nutzerentscheidung vom 13. September 2026

Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.

Mindestkosten ab Wert 0: Kreis 0–7 = 0/75/150/225/300/375/450/525 SP. Keine kumulative Addition der Kreisziele; Endkosten einmal verbuchen. Bei Regelgrenzen oder Budgetmangel einen Konflikt melden, keine automatischen Freischaltungen oder Budgeterhöhungen. Nur Planung geändert; Generatorumsetzung steht aus.

## Einzelwerte zur Nachprüfung

### Dalkini

| Eigenschaft | Reguläres Minimum (alle Kreise) | SP |
|---|---:|---:|
| Ausstrahlung | 9 | 270 |
| Intelligenz | 9 | 270 |
| Mut | 10 | 300 |
| Sinnesschaerfe | 9 | 270 |
| Willenskraft | 15 | 480 |
| Athletik | 10 | 300 |
| Geschicklichkeit | 10 | 300 |
| Konstitution | 11 | 330 |
| Schnelligkeit | 10 | 300 |
| Staerke | 11 | 330 |

### Draw

| Eigenschaft | Reguläres Minimum (alle Kreise) | SP |
|---|---:|---:|
| Ausstrahlung | 11 | 330 |
| Intelligenz | 12 | 363 |
| Mut | 8 | 240 |
| Sinnesschaerfe | 13 | 399 |
| Willenskraft | 8 | 240 |
| Athletik | 10 | 300 |
| Geschicklichkeit | 12 | 363 |
| Konstitution | 9 | 270 |
| Schnelligkeit | 13 | 399 |
| Staerke | 8 | 240 |

### Elfen

| Eigenschaft | Reguläres Minimum (alle Kreise) | SP |
|---|---:|---:|
| Ausstrahlung | 14 | 438 |
| Intelligenz | 12 | 363 |
| Mut | 7 | 210 |
| Sinnesschaerfe | 14 | 438 |
| Willenskraft | 7 | 210 |
| Athletik | 12 | 363 |
| Geschicklichkeit | 11 | 330 |
| Konstitution | 8 | 240 |
| Schnelligkeit | 12 | 363 |
| Staerke | 7 | 210 |

### Gnome

| Eigenschaft | Reguläres Minimum (alle Kreise) | SP |
|---|---:|---:|
| Ausstrahlung | 12 | 363 |
| Intelligenz | 16 | 525 |
| Mut | 11 | 330 |
| Sinnesschaerfe | 11 | 330 |
| Willenskraft | 11 | 330 |
| Athletik | 8 | 240 |
| Geschicklichkeit | 16 | 525 |
| Konstitution | 3 | 90 |
| Schnelligkeit | 13 | 399 |
| Staerke | 3 | 90 |

### Goblins

| Eigenschaft | Reguläres Minimum (alle Kreise) | SP |
|---|---:|---:|
| Ausstrahlung | 11 | 330 |
| Intelligenz | 13 | 399 |
| Mut | 5 | 150 |
| Sinnesschaerfe | 11 | 330 |
| Willenskraft | 7 | 210 |
| Athletik | 12 | 363 |
| Geschicklichkeit | 15 | 480 |
| Konstitution | 7 | 210 |
| Schnelligkeit | 16 | 525 |
| Staerke | 7 | 210 |

### Indianer

| Eigenschaft | Reguläres Minimum (alle Kreise) | SP |
|---|---:|---:|
| Ausstrahlung | 9 | 270 |
| Intelligenz | 9 | 270 |
| Mut | 10 | 300 |
| Sinnesschaerfe | 12 | 363 |
| Willenskraft | 11 | 330 |
| Athletik | 12 | 363 |
| Geschicklichkeit | 10 | 300 |
| Konstitution | 10 | 300 |
| Schnelligkeit | 11 | 330 |
| Staerke | 10 | 300 |

### Katzen

| Eigenschaft | Reguläres Minimum (alle Kreise) | SP |
|---|---:|---:|
| Ausstrahlung | 12 | 363 |
| Intelligenz | 7 | 210 |
| Mut | 11 | 330 |
| Sinnesschaerfe | 13 | 399 |
| Willenskraft | 8 | 240 |
| Athletik | 15 | 480 |
| Geschicklichkeit | 6 | 180 |
| Konstitution | 8 | 240 |
| Schnelligkeit | 13 | 399 |
| Staerke | 11 | 330 |

### Orks

| Eigenschaft | Reguläres Minimum (alle Kreise) | SP |
|---|---:|---:|
| Ausstrahlung | 6 | 180 |
| Intelligenz | 8 | 240 |
| Mut | 16 | 525 |
| Sinnesschaerfe | 9 | 270 |
| Willenskraft | 12 | 363 |
| Athletik | 10 | 300 |
| Geschicklichkeit | 7 | 210 |
| Konstitution | 14 | 438 |
| Schnelligkeit | 7 | 210 |
| Staerke | 15 | 480 |

### Trolle

| Eigenschaft | Reguläres Minimum (alle Kreise) | SP |
|---|---:|---:|
| Ausstrahlung | 12 | 363 |
| Intelligenz | 4 | 120 |
| Mut | 13 | 399 |
| Sinnesschaerfe | 6 | 180 |
| Willenskraft | 10 | 300 |
| Athletik | 12 | 363 |
| Geschicklichkeit | 4 | 120 |
| Konstitution | 19 | 678 |
| Schnelligkeit | 5 | 150 |
| Staerke | 19 | 678 |

### Zentauren

| Eigenschaft | Reguläres Minimum (alle Kreise) | SP |
|---|---:|---:|
| Ausstrahlung | 11 | 330 |
| Intelligenz | 11 | 330 |
| Mut | 14 | 438 |
| Sinnesschaerfe | 9 | 270 |
| Willenskraft | 13 | 399 |
| Athletik | 6 | 180 |
| Geschicklichkeit | 10 | 300 |
| Konstitution | 13 | 399 |
| Schnelligkeit | 6 | 180 |
| Staerke | 11 | 330 |

### Zwerge

| Eigenschaft | Reguläres Minimum (alle Kreise) | SP |
|---|---:|---:|
| Ausstrahlung | 8 | 240 |
| Intelligenz | 14 | 438 |
| Mut | 10 | 300 |
| Sinnesschaerfe | 8 | 240 |
| Willenskraft | 12 | 363 |
| Athletik | 7 | 210 |
| Geschicklichkeit | 13 | 399 |
| Konstitution | 13 | 399 |
| Schnelligkeit | 7 | 210 |
| Staerke | 12 | 363 |
