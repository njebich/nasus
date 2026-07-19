# Savepoint: Verfügbarkeiten und Herkunftsorte

Stand: 2026-07-19

## Arbeitsauftrag und Grenzen

- Ziel ist eine eindeutige Spezifikation für Claude zur Berechnung der Verfügbarkeit sämtlicher Ausrüstungsgegenstände und zur Modellierung von Herkunftsorten.
- Bis zur ausdrücklichen Endabnahme wird **nicht** in `werte 0.8-claude.xlsx` und **nicht** in die App geschrieben.
- Vor einer späteren Umsetzung muss gemeinsam festgelegt werden, wohin die endgültigen Daten geschrieben werden.
- Die App bleibt eine reine SPA ohne Server. Regelkonstanten liegen im Client; Laufzeitdaten werden zunächst lokal persistent gespeichert. Ein Server ist frühestens nach App 1.0 vorgesehen.
- Ruhm und Völkerbeziehungen bleiben außerhalb dieses Projekts. Sie werden später reine Preismodifikatoren.

## Aktive Entwicklungsartefakte

- Spezifikation: `nasus-spec/nasus-spec/04-Verfuegbarkeiten-und-Herkunftsorte.md`
- Entwicklungs-XLSX: `Verfuegbarkeiten-Herkunftsorte-Entwicklung.xlsx`
- Generator: `scripts/build_verfuegbarkeiten_entwicklung.py`
- Vorschau-Generator: `scripts/render_verfuegbarkeiten_entwicklung_preview.ps1`
- Vorschauen: `temp/verfuegbarkeiten_entwicklung_preview/`
- Gelesene Grundlagen:
  - `Grundregeln/NN_Verfügbarkeiten_1.0.docx`
  - `Grundregeln/Nasus Nasus Verfügbarkeiten Entwurf v0.3.docx`

Die XLSX besitzt 13 Blätter:

1. Übersicht
2. Ortsmodell
3. Ortsausprägungen
4. Warengruppen
5. Beispielorte
6. Ort-Händler
7. Völker-Modell
8. Material-Referenz
9. Rüstungen Bestand
10. Artefakte Bestand
11. Audit Ausrüstung
12. Offene Entscheidungen
13. Claude-Auftrag

## Bestätigte Verfügbarkeitsregeln

1. Es gilt ausschließlich die additive Skala `1–7` sowie `M`; niedriger ist besser.
2. `M` ist ausschließlich im Meister-Modul verfügbar und wird nicht numerisch modifiziert.
3. Fehlende Verfügbarkeit bleibt leer und erhält `OFFEN`; niemals `0` als Platzhalter verwenden.
4. Nach sämtlichen Modifikatoren wird ein numerisches Ergebnis auf `1..7` begrenzt.
5. Spieler dürfen effektive Verfügbarkeit `1–4` kaufen. `5–7`, `M` und `OFFEN` sind gesperrt.
6. Das Meister-Modul darf `5–7` oder `M` für eine konkrete Transaktion freigeben. Charakter, Gegenstand, Ort, Wert und Zeitpunkt werden protokolliert; Begründung optional. `OFFEN` ist nicht übersteuerbar.
7. Zusammengesetzte Ausrüstung wird komponentenweise vollständig berechnet. Das schlechteste Ergebnis zählt: numerisch Maximum, `M` vor numerisch, `OFFEN` vor allem. Nicht addieren und nicht mitteln.

## Herkunft und Orte

- `Heimat` wird durch `Herkunft` ersetzt.
- Druckausgabe im Charakterkopf: nur `Ort, Region, AW/NW`.
- Herkunft wird bei der Charaktererschaffung per Dropdown/Formular gewählt. Der Charakter darf am Herkunftsort einkaufen.
- Ein Ort enthält mindestens:
  - Name, verpflichtend
  - AW/NW
  - Region
  - Siedlungsgröße
  - Hauptspezies und etablierte Minderheiten
  - Handelsstufe
  - Herstellungsort
  - beliebig viele Händler
  - optionale lokale Produktion je Warengruppe und optionalem Volk
- Jeder Ort besitzt einen persistenten Grundzustand und optional einen Abenteuer-Snapshot. Nach dem Abenteuer kann der Snapshot verworfen, weitergeführt oder bewusst übernommen werden. Frühere Käufe ändern sich nicht rückwirkend.
- Das Meister-Modul muss alle Ortsstellschrauben vor und nach einem Abenteuer verändern können.

## Ortsmodifikatoren

### Siedlungsgröße

| Siedlungsgröße | Rüstungen/Waffen | Artefakte |
|---|---:|---:|
| Wildnis | +3 | +5 |
| Ansiedlung | +2 | +4 |
| Dorf | +1 | +3 |
| Großes Dorf | 0 | +2 |
| Kleinstadt | -1 | +1 |
| Stadt | -2 | 0 |
| Großstadt | -3 | -1 |
| Metropole | -4 | -2 |

### Handelsstufe

| Handelsstufe | Rüstungen/Waffen | Artefakte |
|---|---:|---:|
| völlig abgelegen | +2 | +3 |
| abgelegen | +1 | +2 |
| Handelsroute / kleiner Hafen | 0 | +1 |
| Handelsstadt / großer Hafen | -1 | 0 |
| Handelszentrum | -2 | -1 |

### Herstellungsort

| Herstellungsort | Rüstungen/Waffen | Artefakte |
|---|---:|---:|
| Import | +2 | +3 |
| teilweiser Import | +1 | +2 |
| Herstellung im Reich | 0 | +1 |
| Herstellung in der Region | -1 | 0 |
| Herstellung direkt vor Ort | -2 | -1 |

Lokale Produktion ersetzt bei passender Warengruppe und optional passendem Volk den allgemeinen Herstellungsort durch `Herstellung direkt vor Ort`; sie addiert keinen weiteren Bonus.

### Händler

| Händler | Rüstungen/Waffen | Artefakte |
|---|---:|---:|
| Kein Laden / kein Händler | +3 | +5 |
| Fahrender Trödelhändler | +2 | +4 |
| Fahrender spezialisierter Händler | +1 | +2 |
| Kleiner General Store | +1 | +3 |
| Großer General Store | 0 | +2 |
| Kleiner spezialisierter Händler | 0 | +1 |
| Spezialisierter Händler | -1 | 0 |
| Großer spezialisierter Händler | -2 | -1 |

- Ein Ort kann mehrere Händler besitzen.
- Jeder spezialisierte Händler hat genau eine Warengruppe aus einem durchsuchbaren Dropdown.
- Für einen Kauf gilt der niedrigste anwendbare Händlermodifikator; ohne Treffer gilt `Kein Laden / kein Händler`.
- 43 vorhandene Warengruppen bleiben unverändert. 38 sind händlerspezialisierbar.
- Nicht händlerspezialisierbar: `Miete`, `Post`, `Reisekosten`, `Tavernen-Preise`, `Zoll`.

## Völkermodell

- Datenmodus: `ALLE` oder `AUSWAHL` mit einer Liste von einer oder mehreren Spezies.
- Ortsabgleich: `ALLE` oder Hauptspezies `0`, etablierte Minderheit `+1`, keine passende Spezies `+3`; beste Übereinstimmung zählt.
- Die Zuordnung beschreibt Hersteller-/Kulturherkunft, nicht automatisch eine Benutzungsbeschränkung.

## Beispielorte und Händler

- Straitmor: sechs getrennte spezialisierte Händler für `Sklaven`, `Feuerwaffen`, `Rüstungen`, `NK-Waffen`, `Edelsteine`, `Metall`. `Bergbau` wurde ausdrücklich nicht angelegt.
- Zwogón: für jede der 38 händlerspezialisierbaren Warengruppen ein eigener `Großer spezialisierter Händler`.
- Phoenix-Feste: `Kleiner General Store`.

## Globale Materialreferenz

Diese Tabelle ist für den Rest des Projekts verbindlich und wird nicht erneut je Ausrüstungsfamilie bestätigt. Waffen, Schilde und abgeleitete Schaftmaterialien müssen dieselbe Referenz verwenden.

| Material | AW | NW | Hersteller |
|---|---:|---:|---|
| Holz | 1 | 1 | ALLE |
| Hartholz | 2 | 2 | ALLE |
| Leder | 1 | 1 | ALLE |
| Spinnenwebe | 4 | 4 | Draw |
| Chitin | 5 | 2 | ALLE |
| Drachenschuppe | M | M | ALLE |
| Stein | 1 | 1 | ALLE |
| Schwarzfels | 5 | 1 | Indianer, Katzen |
| Diamantspat | 7 | 7 | Draw |
| Bronze | 1 | 1 | Dalkini, Draw, Elfen, Goblins, Orks, Trolle, Zwerge |
| Eisen | 1 | 1 | Dalkini, Draw, Elfen, Goblins, Orks, Trolle, Zwerge |
| Feineisen | 1 | 1 | Dalkini, Draw, Elfen, Goblins, Orks, Trolle, Zwerge |
| Stahl | 1 | 2 | Dalkini, Draw, Elfen, Goblins, Orks, Trolle, Zwerge |
| Qualitätsstahl | 2 | 4 | Dalkini, Draw, Elfen, Goblins, Orks, Trolle, Zwerge |
| Faltstahl | 3 | 5 | Dalkini, Draw, Elfen, Goblins, Orks, Trolle, Zwerge |
| Mithril | 7 | 7 | Elfen, Zwerge |
| Adamandit | M | M | Dalkini, Draw, Elfen, Goblins, Orks, Trolle, Zwerge |
| Alchemistensilber | 5 | 6 | Dalkini, Elfen, Goblins, Orks, Zwerge |
| Vulkanglas | 7 | 3 | Indianer, Katzen |
| Nasium | 7 | 7 | Elfen, Zwerge |
| Knochen | 1 | 1 | ALLE |
| Kolharz | 5 | 7 | Zentauren |

Die zuletzt ausdrücklich korrigierten Werte sind: `Schwarzfels 5/1`, `Chitin 5/2`, `Qualitätsstahl 2/4`, `Vulkanglas 7/3`, `Kolharz 5/7`, `Alchemistensilber 5/6`. Alle übrigen Werte blieben unverändert.

## Ausrüstungsstand

### Rüstungen

- 28 von 28 Verfügbarkeiten und Völkerzuweisungen bestätigt.
- Sechs Kettenrüstungsbasen: `Dalkini, Draw, Elfen, Goblins, Orks, Zwerge`; Trolle ausdrücklich ausgeschlossen.
- Sechs Metallplattenrüstungsbasen: zusätzlich Trolle; Katzen, Indianer, Zentauren und Gnome ausgeschlossen.
- Übrige acht Basen sowie vier Verarbeitungs- und vier Anpassungsstufen: `ALLE`.

### Artefakte

- 749 von 749 kaufbaren Varianten bestätigt.
- Vorhandener Wert gilt als AW-/Grundwert.
- NW: Grad 1–2 `+0`, Grad 3–5 `+1`, Grad 6–7 `+2`, maximal 7.
- `Meister` wird als `M` normalisiert.
- Hersteller aller 57 Grunddatensätze und ihrer 749 Varianten: `Draw, Elfen, Gnome, Goblins, Orks, Zwerge`.
- Indianer, Dalkini, Katzen, Zentauren und Trolle stellen keine Artefakte her.

### Schilde

- 34 von 34 Verfügbarkeiten und Völkerzuweisungen bestätigt.
- Schreibweisen: `Kolhartz → Kolharz`, `Diamantspart → Diamantspat`, `Schwarzfells → Schwarzfels`.
- Fertigung: Ausschuss, Goblin Massenfab., Massenfabrikation, Gesellenarbeit `1/1`; Meisterarbeit `2/3`; Großmeisterarbeit `3/5`; Einzelstück `7/7`.
- Nur Goblin Massenfab. ist auf Goblins beschränkt; übrige Fertigungen `ALLE`.
- Bespannungen: Stoff `1/1 ALLE`, Leder `1/1 ALLE`, Spinnenwebe `4/4 Draw`, Kohlharz `4/4 Zentauren`, Drachenschuppe `M/M ALLE`.
- Materialwerte kommen aus der globalen Materialreferenz.

### Waffen

- 287 Zeilen insgesamt: 270 kaufbare/regeltechnische Komponenten bestätigt, 17 natürliche Angriffe oder Kampfstile `NICHT KAUFBAR`.
- 226 kaufbare Waffenbasis-Zeilen stehen auf `1/1`.
- 18 kulturell benannte Waffenmodelle belegen 20 Zeilen; 206 Basis-Zeilen gelten für `ALLE`.
- `Armklingen elfisch` und `Bat'leth orkisch` sind jeweils unter zwei Fertigkeiten geführt, aber keine doppelten Gegenstände.
- `Trolltöter Widerhaken` bleibt `ALLE`, weil Troll das Ziel bezeichnet.
- 17 Nicht-Gegenstände: Unbewaffnet-Varianten, Biss, Huftritt, Boxen, Elfische Kunst der Selbstverteidigung, Goblinische Kampfkunst, Katzenmenschen-Kampfkunst, Orkisch' Raufen, Ringen, Schattenkampf.
- Waffenfertigung entspricht Schildfertigung.
- Waffenanpassung: Von der Stange `1/1`, angepasst `2/3`, Perfekt angepasst `3/5`; alle `ALLE`.
- 15 Schaftvarianten erben die globale Materialreferenz; Verstärkt/Voll verändert die Verfügbarkeit nicht.
- `Adamandit Verst.` und `Adamantit Voll` werden zu `Adamandit Verstärkt` und `Adamandit Voll` normalisiert.

### Preisliste

- 965 kaufbare Preislistenzeilen besitzen in der Quelle keine eingetragene Verfügbarkeit.
- Alle 965 stehen im Blatt `Audit Ausrüstung` auf `OFFEN`; es wurden keine Nullen oder Ersatzwerte erzeugt.
- Auch die Völkerzuweisungen dieser 965 Zeilen sind noch offen.
- Nutzer trägt die Verfügbarkeiten von Hand ein.
- Fundstelle in der Entwicklungs-XLSX:
  - Blatt `Audit Ausrüstung`
  - Filter Spalte A `Familie = Preisliste`
  - Filter Spalte I `Status Verfügbarkeit = OFFEN`
  - AW in Spalte G, NW in Spalte H
  - nach Prüfung Spalte I auf `BESTÄTIGT`
  - Völkerdaten in Spalten J–L

## Auditstand

| Familie | Zeilen | Verfügbarkeit | Völker |
|---|---:|---|---|
| Artefakt | 749 | 749 BESTÄTIGT | 749 BESTÄTIGT |
| Rüstung | 28 | 28 BESTÄTIGT | 28 BESTÄTIGT |
| Schild | 34 | 34 BESTÄTIGT | 34 BESTÄTIGT |
| Waffe | 287 | 270 BESTÄTIGT, 17 NICHT KAUFBAR | 287 BESTÄTIGT |
| Preisliste | 965 | 965 OFFEN | 965 OFFEN |

## Nächster Einstieg

1. Nutzer trägt die 965 Preislisten-Verfügbarkeiten manuell im Audit ein.
2. Preislisten-Völkerzuweisungen bleiben anschließend zu bearbeiten.
3. Danach Audit erneut auswerten und nur tatsächlich verbleibende `OFFEN`-Zeilen behandeln.
4. Erst nach vollständiger Abnahme gemeinsam das endgültige Ziel für Werte-/App-Umsetzung bestimmen.
5. Bis dahin `werte 0.8-claude.xlsx` und App unverändert lassen.

