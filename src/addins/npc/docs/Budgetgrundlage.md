# NPC-Budgetgrundlage

Stand: 8. September 2026. Berechnet aus den aktuellen Client-Regeldaten. Dies ist die Planungsgrundlage für wertelose Templates und Arbeitsaufträge; die laufende Charakterberechnung wurde nicht geändert.

## Verbindliche Berechnung

- Nach jeder Multiplikation aufrunden. Bei den Minima jede Eigenschaft einzeln skalieren und aufrunden. Bleibt der gerundete Wert unverändert, stattdessen vom ursprünglichen Minimum 2 (Kreis 0) oder 1 (Kreis 0+) abziehen. Danach die vollständigen Kosten nachschlagen und summieren. Kein Zusatzabzug, wenn die Prozentrechnung bereits senkt.
- Kreis 0: 80 % der Volksminima, 5.120 SP. Kreis 0+: 90 %, 5.760 SP. Ab Kreis 1: volle Volksminima; hier wird für den Vergleich das Einstiegsbudget von 6.400 SP verwendet.
- Höhere Kreise behalten den regulären Eigenschaftssockel; ihr SP-Budget kommt direkt aus der
  bereits vorhandenen EP-Stufe-Kreis-Tabelle (`src/data/lookups.json`, Tabelle `EP-Stufe-Kreis`),
  siehe Abschnitt "SP-Budget je Kreis (NSC)" unten – keine eigene NPC-Kurve nötig.
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

Kreis 0/0+ bleiben die bereits vorher notierten 80 %/90 %-Planungswerte (5.120 SP / 5.760 SP) –
die sind unverändert offen, weil es dafür keine natürliche `ep_gesamt`-Entsprechung gibt (Stufe 0
liefert immer volle 6.400 SP; negative EP sind laut bestehender Notiz kein Ersatz dafür).

## Geldbudget je Kreis (NSC)

Festgeschrieben (Nutzer 2026-09-11), auf 25 D gerundet. Basis ist das etablierte Startbudget
`startbudget_ausruestung` = 5.000 Dublonen (`src/state/characterStore.ts`,
`src/data/rules-jsonl/charakterwerte.jsonl`, sourceRow 136) bei Stufe 0 = Kreis 0.

- **Kreis 0/0+:** 0,8× bzw. 0,9× der Kreis-1-Basis (analog zum SP-Rabatt), also 4.000 D / 4.500 D.
- **Ab Kreis 1:** `Dublonen(Kreis) = 5.000 + 62,5 × (Kreis − 1)⁴`. Gegengerechnet gegen eine konkrete
  Kreis-7-Ausrüstung (Faltstahl-Zweihänder Großmeisterarbeit perfekt angepasst 826 D + komplette
  Rüstung beste Materialien/Großmeisterarbeit/perfekt angepasst auf allen 4 Lagen und 4 Zonen
  40.508 D + zwei Eigenschafts-Artefakte Grad 5 12.564 D = 53.898 D): 86.000 D lässt bei dieser
  Ausstattung noch reichlich Luft.
- **Kreis N+:** arithmetisches Mittel aus Kreis N und Kreis N+1 (Kreis 7+ interpoliert gegen das
  extrapolierte Kreis 8 = 155.075 D).

| Kreis | Dublonen |
|---|---:|
| 0 | 4.000 |
| 0+ | 4.500 |
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

Das ist ein NSC-spezifischer Aufschlag zusätzlich zur bestehenden Spielercharakter-Regel
(5.000 D fix bzw. 6.000 D bei "gehobenem Start" auf Stufe 15) und ersetzt diese nicht.

## Kosten der Volksminima

| Volk | Kreis 0: Sockel | Kreis 0: Rest nach 90 SSK | Kreis 0+: Sockel | Kreis 0+: Rest nach 90 SSK | Kreis 1: Sockel | Kreis 1: Rest nach 90 SSK |
|---|---:|---:|---:|---:|---:|---:|
| Dalkini | 2583 | 2447 | 2838 | 2832 | 3150 | 3160 |
| Draw | 2640 | 2390 | 2826 | 2844 | 3144 | 3166 |
| Elfen | 2646 | 2384 | 2838 | 2832 | 3165 | 3145 |
| Gnome | 2508 | 2522 | 2883 | 2787 | 3222 | 3088 |
| Goblins | 2592 | 2438 | 2871 | 2799 | 3207 | 3103 |
| Indianer | 2580 | 2450 | 2820 | 2850 | 3126 | 3184 |
| Katzen | 2613 | 2417 | 2844 | 2826 | 3171 | 3139 |
| Orks | 2625 | 2405 | 2877 | 2793 | 3216 | 3094 |
| Trolle | 2610 | 2420 | 2991 | 2679 | 3351 | 2959 |
| Zentauren | 2613 | 2417 | 2835 | 2835 | 3156 | 3154 |
| Zwerge | 2643 | 2387 | 2835 | 2835 | 3162 | 3148 |

Der Rest ist noch kein frei verteilbares Budget: Aussehen, zusätzliche Voraussetzungen, GF/SF, Beruf, Kampf und Magie sind noch abzuziehen. Beim Händler kommen für die zusätzliche Sprache weitere 30 SP hinzu.

## SSK-Pflichtbündel

- Aktuelle App-Regel: mindestens 90 SP in Sprache, Schrift und Kultur sowie mindestens eine Sprache auf Stufe 1 oder höher. Lesen/Schreiben ist dadurch nicht automatisch Pflicht.
- Sprach- und Schriftkosten: Stufe 1 = 15 SP, Stufe 2 = 30 SP, Stufe 3 = 50 SP, Stufe 4 = 75 SP.
- Kulturkosten: Stufe 1 = 10 SP, Stufe 2 = 25 SP, Stufe 3 = 40 SP, Stufe 4 = 55 SP.
- Beispielstub ohne Schrift: Hauptsprache 3 (50) + Herkunftskultur 3 (40) = 90 SP. Dies ist ein Vorschlag, keine allgemeine Sprachstufenvorgabe.
- Händler: eine andere, zusätzliche Sprache auf Stufe 2 = 30 SP zusätzlich zum allgemeinen Bündel; mit dem 90-SP-Stub insgesamt 120 SP. Dieselbe Sprache darf nicht doppelt zählen.
- Sprache anhand Herkunft und Handelsgebiet wählen. Besitzt ein gewählter SSK-Stub diese Zweitsprache bereits, einen anderen Stub wählen oder den Überschneidungsfall sichtbar auflösen, statt 30 SP ohne Leistung abzuziehen.

## Aussehen und Schlaf sind Pflichtauswahlen

Für jeden NPC genau eine Aussehensstufe und eine Schlafstufe festlegen; zufällige Auswahl anschließend im Auftrag festhalten. Wahrscheinlichkeiten sind noch nicht festgelegt. Ein Zufallswurf wird beim Neuberechnen nicht wiederholt.

| Aussehen im Regeldatensatz | SP | Voraussetzung |
|---|---:|---|
| Aussehen: Gutes Aussehen | 100 | VORAUSSETZUNG=AUS>=10 |
| Aussehen: Hässlichkeit | -100 | — |
| Aussehen: Herausragendes Aussehen | 250 | VORAUSSETZUNG=AUS>=15 |
| Aussehen: Widerwärtiges Aussehen | -200 | — |
| Aussehen: Normal | 0 | — |

Die fünf geordneten Aussehensstufen sind Widerwärtiges Aussehen, Hässlichkeit, Normal, Gutes Aussehen und Herausragendes Aussehen. Allerweltsgesicht ist aus dem NPC-Template und Randomizer ausgeschlossen.
Gutes/herausragendes Aussehen kann zusätzliche Ausstrahlungssteigerungen erfordern. Diese Mehrkosten oberhalb des Volkssockels separat reservieren. Negative Aussehenskosten geben SP zurück.

| Schlaf im Regeldatensatz | SP | Wirkung |
|---|---:|---|
| Schlaf: Insomnia | 0 | Regenerationsklasse −2. Sinnesschärfe +5, ausschließlich während des Schlafs. |
| Schlaf: Leichter Schlaf | 0 | Regenerationsklasse −1. Sinnesschärfe −5, ausschließlich während des Schlafs. |
| Schlaf: Normal | 0 | Die Regenerationsklasse bleibt unverändert. Sinnesschärfe −10, ausschließlich während des Schlafs. |
| Schlaf: Tiefer Schlaf | 0 | Regenerationsklasse +1. Sinnesschärfe −15, ausschließlich während des Schlafs. |

Verbindlich gibt es genau vier Schlafstufen. Es fehlt keine fünfte Stufe. Pflichtauswahl bedeutet hier keine positiven Fixkosten: alle vier vorhandenen Optionen kosten 0 SP.

## GF/SF-Bündel: Referenzmessung

Grund- und Sonderfertigkeiten kosten im aktuellen Regelstand jeweils 9 SP pro gekauftem Punkt. Die folgende Auswertung umfasst sämtliche GF/SF der sechs vorhandenen Vorlagen, einschließlich beruflicher, kämpferischer und magischer Sonderfertigkeiten. Sie ist deshalb noch kein universelles Grundausbildungsbündel.

| Referenz | GF | SF | Zusammen | Gesamt-SP | Anteil, auf 0,01 Prozentpunkte aufgerundet |
|---|---:|---:|---:|---:|---:|
| bauer | 315 | 342 | 657 | 6400 | 10.27 % |
| wachmann | 432 | 540 | 972 | 6400 | 15.19 % |
| hauptmann | 783 | 567 | 1350 | 8000 | 16.88 % |
| schuetze | 549 | 576 | 1125 | 6400 | 17.58 % |
| nahkaempfer | 387 | 468 | 855 | 6400 | 13.36 % |
| ki | 315 | 630 | 945 | 8000 | 11.82 % |

Noch keinen pauschalen Prozentsatz als Regel festschreiben. Zuerst gemeinsame Alltagsausbildung und berufliche/kämpferische/magische Zusätze trennen. Jede Fähigkeit wird einmal bezahlt und kann mehrere Anforderungen erfüllen.
Vorschlag für spätere Prozentbündel: Reservierung = aufrunden(Gesamt-SP × Anteil). Ein gewöhnlicher GF/SF-Punkt kostet 9 SP; die Reservierung ist daher nicht immer vollständig in solche Punkte umsetzbar. Nicht ausgegebene SP bleiben sichtbar und werden zurückgegeben. Keine Überschreitung durch zusätzliches Aufrunden auf neun.

## Technischer Abgleich

Der aktuelle App-Sockel beträgt weiterhin 6.400 + Gesamt-EP, und die Eigenschaftsprüfung verwendet noch die ungekürzten Volksminima. Kreis 0/0+ aus dieser Planung müssen vor einer echten Charaktererzeugung eigens integriert werden. Negative EP sind kein Ersatz dafür. Stufe 0 der bisherigen Referenzdateien ist nicht mit dem neuen Kreis 0 gleichzusetzen.

Quellen: src/data/voelkerMaxima.json; src/data/lookups.json (Eigenschaften-Kosten, Sprachstufe-Kosten, Kulturstufe-Kosten); src/data/rules.json; src/engine/characterSheet.ts (SSK_MINDEST_SP = 90); src/addins/npc/data/npc/*.json.

## Einzelwerte zur Nachprüfung

### Dalkini

| Eigenschaft | Reguläres Minimum | Kreis 0: Wert / SP | Kreis 0+: Wert / SP | Kreis 1: Wert / SP |
|---|---:|---:|---:|---:|
| Ausstrahlung | 9 | 8 / 240 | 8 / 240 | 9 / 270 |
| Intelligenz | 9 | 8 / 240 | 8 / 240 | 9 / 270 |
| Mut | 10 | 8 / 240 | 9 / 270 | 10 / 300 |
| Sinnesschaerfe | 9 | 8 / 240 | 8 / 240 | 9 / 270 |
| Willenskraft | 15 | 12 / 363 | 14 / 438 | 15 / 480 |
| Athletik | 10 | 8 / 240 | 9 / 270 | 10 / 300 |
| Geschicklichkeit | 10 | 8 / 240 | 9 / 270 | 10 / 300 |
| Konstitution | 11 | 9 / 270 | 10 / 300 | 11 / 330 |
| Schnelligkeit | 10 | 8 / 240 | 9 / 270 | 10 / 300 |
| Staerke | 11 | 9 / 270 | 10 / 300 | 11 / 330 |

### Draw

| Eigenschaft | Reguläres Minimum | Kreis 0: Wert / SP | Kreis 0+: Wert / SP | Kreis 1: Wert / SP |
|---|---:|---:|---:|---:|
| Ausstrahlung | 11 | 9 / 270 | 10 / 300 | 11 / 330 |
| Intelligenz | 12 | 10 / 300 | 11 / 330 | 12 / 363 |
| Mut | 8 | 7 / 210 | 7 / 210 | 8 / 240 |
| Sinnesschaerfe | 13 | 11 / 330 | 12 / 363 | 13 / 399 |
| Willenskraft | 8 | 7 / 210 | 7 / 210 | 8 / 240 |
| Athletik | 10 | 8 / 240 | 9 / 270 | 10 / 300 |
| Geschicklichkeit | 12 | 10 / 300 | 11 / 330 | 12 / 363 |
| Konstitution | 9 | 8 / 240 | 8 / 240 | 9 / 270 |
| Schnelligkeit | 13 | 11 / 330 | 12 / 363 | 13 / 399 |
| Staerke | 8 | 7 / 210 | 7 / 210 | 8 / 240 |

### Elfen

| Eigenschaft | Reguläres Minimum | Kreis 0: Wert / SP | Kreis 0+: Wert / SP | Kreis 1: Wert / SP |
|---|---:|---:|---:|---:|
| Ausstrahlung | 14 | 12 / 363 | 13 / 399 | 14 / 438 |
| Intelligenz | 12 | 10 / 300 | 11 / 330 | 12 / 363 |
| Mut | 7 | 6 / 180 | 6 / 180 | 7 / 210 |
| Sinnesschaerfe | 14 | 12 / 363 | 13 / 399 | 14 / 438 |
| Willenskraft | 7 | 6 / 180 | 6 / 180 | 7 / 210 |
| Athletik | 12 | 10 / 300 | 11 / 330 | 12 / 363 |
| Geschicklichkeit | 11 | 9 / 270 | 10 / 300 | 11 / 330 |
| Konstitution | 8 | 7 / 210 | 7 / 210 | 8 / 240 |
| Schnelligkeit | 12 | 10 / 300 | 11 / 330 | 12 / 363 |
| Staerke | 7 | 6 / 180 | 6 / 180 | 7 / 210 |

### Gnome

| Eigenschaft | Reguläres Minimum | Kreis 0: Wert / SP | Kreis 0+: Wert / SP | Kreis 1: Wert / SP |
|---|---:|---:|---:|---:|
| Ausstrahlung | 12 | 10 / 300 | 11 / 330 | 12 / 363 |
| Intelligenz | 16 | 13 / 399 | 15 / 480 | 16 / 525 |
| Mut | 11 | 9 / 270 | 10 / 300 | 11 / 330 |
| Sinnesschaerfe | 11 | 9 / 270 | 10 / 300 | 11 / 330 |
| Willenskraft | 11 | 9 / 270 | 10 / 300 | 11 / 330 |
| Athletik | 8 | 7 / 210 | 7 / 210 | 8 / 240 |
| Geschicklichkeit | 16 | 13 / 399 | 15 / 480 | 16 / 525 |
| Konstitution | 3 | 1 / 30 | 2 / 60 | 3 / 90 |
| Schnelligkeit | 13 | 11 / 330 | 12 / 363 | 13 / 399 |
| Staerke | 3 | 1 / 30 | 2 / 60 | 3 / 90 |

### Goblins

| Eigenschaft | Reguläres Minimum | Kreis 0: Wert / SP | Kreis 0+: Wert / SP | Kreis 1: Wert / SP |
|---|---:|---:|---:|---:|
| Ausstrahlung | 11 | 9 / 270 | 10 / 300 | 11 / 330 |
| Intelligenz | 13 | 11 / 330 | 12 / 363 | 13 / 399 |
| Mut | 5 | 4 / 120 | 4 / 120 | 5 / 150 |
| Sinnesschaerfe | 11 | 9 / 270 | 10 / 300 | 11 / 330 |
| Willenskraft | 7 | 6 / 180 | 6 / 180 | 7 / 210 |
| Athletik | 12 | 10 / 300 | 11 / 330 | 12 / 363 |
| Geschicklichkeit | 15 | 12 / 363 | 14 / 438 | 15 / 480 |
| Konstitution | 7 | 6 / 180 | 6 / 180 | 7 / 210 |
| Schnelligkeit | 16 | 13 / 399 | 15 / 480 | 16 / 525 |
| Staerke | 7 | 6 / 180 | 6 / 180 | 7 / 210 |

### Indianer

| Eigenschaft | Reguläres Minimum | Kreis 0: Wert / SP | Kreis 0+: Wert / SP | Kreis 1: Wert / SP |
|---|---:|---:|---:|---:|
| Ausstrahlung | 9 | 8 / 240 | 8 / 240 | 9 / 270 |
| Intelligenz | 9 | 8 / 240 | 8 / 240 | 9 / 270 |
| Mut | 10 | 8 / 240 | 9 / 270 | 10 / 300 |
| Sinnesschaerfe | 12 | 10 / 300 | 11 / 330 | 12 / 363 |
| Willenskraft | 11 | 9 / 270 | 10 / 300 | 11 / 330 |
| Athletik | 12 | 10 / 300 | 11 / 330 | 12 / 363 |
| Geschicklichkeit | 10 | 8 / 240 | 9 / 270 | 10 / 300 |
| Konstitution | 10 | 8 / 240 | 9 / 270 | 10 / 300 |
| Schnelligkeit | 11 | 9 / 270 | 10 / 300 | 11 / 330 |
| Staerke | 10 | 8 / 240 | 9 / 270 | 10 / 300 |

### Katzen

| Eigenschaft | Reguläres Minimum | Kreis 0: Wert / SP | Kreis 0+: Wert / SP | Kreis 1: Wert / SP |
|---|---:|---:|---:|---:|
| Ausstrahlung | 12 | 10 / 300 | 11 / 330 | 12 / 363 |
| Intelligenz | 7 | 6 / 180 | 6 / 180 | 7 / 210 |
| Mut | 11 | 9 / 270 | 10 / 300 | 11 / 330 |
| Sinnesschaerfe | 13 | 11 / 330 | 12 / 363 | 13 / 399 |
| Willenskraft | 8 | 7 / 210 | 7 / 210 | 8 / 240 |
| Athletik | 15 | 12 / 363 | 14 / 438 | 15 / 480 |
| Geschicklichkeit | 6 | 5 / 150 | 5 / 150 | 6 / 180 |
| Konstitution | 8 | 7 / 210 | 7 / 210 | 8 / 240 |
| Schnelligkeit | 13 | 11 / 330 | 12 / 363 | 13 / 399 |
| Staerke | 11 | 9 / 270 | 10 / 300 | 11 / 330 |

### Orks

| Eigenschaft | Reguläres Minimum | Kreis 0: Wert / SP | Kreis 0+: Wert / SP | Kreis 1: Wert / SP |
|---|---:|---:|---:|---:|
| Ausstrahlung | 6 | 5 / 150 | 5 / 150 | 6 / 180 |
| Intelligenz | 8 | 7 / 210 | 7 / 210 | 8 / 240 |
| Mut | 16 | 13 / 399 | 15 / 480 | 16 / 525 |
| Sinnesschaerfe | 9 | 8 / 240 | 8 / 240 | 9 / 270 |
| Willenskraft | 12 | 10 / 300 | 11 / 330 | 12 / 363 |
| Athletik | 10 | 8 / 240 | 9 / 270 | 10 / 300 |
| Geschicklichkeit | 7 | 6 / 180 | 6 / 180 | 7 / 210 |
| Konstitution | 14 | 12 / 363 | 13 / 399 | 14 / 438 |
| Schnelligkeit | 7 | 6 / 180 | 6 / 180 | 7 / 210 |
| Staerke | 15 | 12 / 363 | 14 / 438 | 15 / 480 |

### Trolle

| Eigenschaft | Reguläres Minimum | Kreis 0: Wert / SP | Kreis 0+: Wert / SP | Kreis 1: Wert / SP |
|---|---:|---:|---:|---:|
| Ausstrahlung | 12 | 10 / 300 | 11 / 330 | 12 / 363 |
| Intelligenz | 4 | 2 / 60 | 3 / 90 | 4 / 120 |
| Mut | 13 | 11 / 330 | 12 / 363 | 13 / 399 |
| Sinnesschaerfe | 6 | 5 / 150 | 5 / 150 | 6 / 180 |
| Willenskraft | 10 | 8 / 240 | 9 / 270 | 10 / 300 |
| Athletik | 12 | 10 / 300 | 11 / 330 | 12 / 363 |
| Geschicklichkeit | 4 | 2 / 60 | 3 / 90 | 4 / 120 |
| Konstitution | 19 | 16 / 525 | 18 / 624 | 19 / 678 |
| Schnelligkeit | 5 | 4 / 120 | 4 / 120 | 5 / 150 |
| Staerke | 19 | 16 / 525 | 18 / 624 | 19 / 678 |

### Zentauren

| Eigenschaft | Reguläres Minimum | Kreis 0: Wert / SP | Kreis 0+: Wert / SP | Kreis 1: Wert / SP |
|---|---:|---:|---:|---:|
| Ausstrahlung | 11 | 9 / 270 | 10 / 300 | 11 / 330 |
| Intelligenz | 11 | 9 / 270 | 10 / 300 | 11 / 330 |
| Mut | 14 | 12 / 363 | 13 / 399 | 14 / 438 |
| Sinnesschaerfe | 9 | 8 / 240 | 8 / 240 | 9 / 270 |
| Willenskraft | 13 | 11 / 330 | 12 / 363 | 13 / 399 |
| Athletik | 6 | 5 / 150 | 5 / 150 | 6 / 180 |
| Geschicklichkeit | 10 | 8 / 240 | 9 / 270 | 10 / 300 |
| Konstitution | 13 | 11 / 330 | 12 / 363 | 13 / 399 |
| Schnelligkeit | 6 | 5 / 150 | 5 / 150 | 6 / 180 |
| Staerke | 11 | 9 / 270 | 10 / 300 | 11 / 330 |

### Zwerge

| Eigenschaft | Reguläres Minimum | Kreis 0: Wert / SP | Kreis 0+: Wert / SP | Kreis 1: Wert / SP |
|---|---:|---:|---:|---:|
| Ausstrahlung | 8 | 7 / 210 | 7 / 210 | 8 / 240 |
| Intelligenz | 14 | 12 / 363 | 13 / 399 | 14 / 438 |
| Mut | 10 | 8 / 240 | 9 / 270 | 10 / 300 |
| Sinnesschaerfe | 8 | 7 / 210 | 7 / 210 | 8 / 240 |
| Willenskraft | 12 | 10 / 300 | 11 / 330 | 12 / 363 |
| Athletik | 7 | 6 / 180 | 6 / 180 | 7 / 210 |
| Geschicklichkeit | 13 | 11 / 330 | 12 / 363 | 13 / 399 |
| Konstitution | 13 | 11 / 330 | 12 / 363 | 13 / 399 |
| Schnelligkeit | 7 | 6 / 180 | 6 / 180 | 7 / 210 |
| Staerke | 12 | 10 / 300 | 11 / 330 | 12 / 363 |
