# Memory: Verfügbarkeiten und Herkunftsorte

## Stand 2026-09-12 (aktuell) — Übergabe für neue Session

Der Rest dieser Datei (ab "Stand: 2026-07-19") ist der alte, längst überholte manuelle
Preislisten-Audit-Workflow. Seit 2026-09 ist die Verfügbarkeit tatsächlich implementiert (Code,
nicht mehr nur Excel-Audit). Aktueller Stand hier zusammengefasst, Details in Claude-Memory
`project_verfuegbarkeit_ortsmodifikator_status.md` (nur für Claude-Code-Sessions sichtbar, dieser
Abschnitt hier ist die Repo-Version für jede Session/jeden Menschen).

**Bereits verdrahtet:**
- NK-Waffen, Rüstung und Schild komplett: alle Basis-/Material-/Fertigung-/Anpassung-/
  Schaftmaterial-/Bespannung-Sheets haben Verfügbarkeit-AW/NW, `composeWeapon`/`composeArmor`/
  `composeShield` liefern `verfuegbarkeitAw/Nw`, `buyWeapon`/`equipRuestung`/`buyShield` gaten über
  den Ortsmodifikator.
- Ortsmodifikator (`engine/verfuegbarkeitOrt.ts`): Siedlungsgröße + Handelsstufe + Herstellungsort
  (inkl. lokaler Produktion als Override) + Händler + Völker + Garnisonsgrad (7-stufige Achse
  Wachstation→Festung, militärischer Waffen-/Rüstungsvorrat unabhängig von Zivilhandel).
- **Völkerzuweisung ist Herstellerherkunft, keine Käufer-Sperre** (Nutzer 2026-09-12: "Trolle
  stellen keine Kette her, aber andere können Kette für Trolle herstellen"): jede Komponente
  (Basis/Material/Fertigung/Anpassung/...) wird laut Spec-Punkt 23 SEPARAT inkl. ihrer eigenen
  Völkerzuweisung voll ortsberechnet (`effektiveVerfuegbarkeitKomponenten`), erst danach bestimmt
  das schlechteste Komponentenergebnis den fertigen Gegenstand — eine Spezies-Sperre auf
  Käuferebene (frühere `istWaffenKomponenteVerfuegbar`/`istRuestungKomponenteVerfuegbar`/
  `istSchildKomponenteVerfuegbar`) gibt es nicht mehr. Bei AUSWAHL mit mehreren Einträgen zählt die
  beste Übereinstimmung (Spec-Punkt 20).
- **Floor**: Basisstufe 7 ("Einzigartig") fällt durch keinen Ortsbonus unter effektiv 5.
- **Material-Sourcing-Gate** ("Mango ohne Schiff/Flugzeug"-Regel, andere Dimension als die
  Völkerzuweisung oben — ist das Material an DIESEM Ort überhaupt zu bekommen, unabhängig vom
  Käufer): Materialien ab eigener Basis-Verfügbarkeit ≥3 (Faltstahl, Mithril, ...) brauchen eine
  explizite Bestätigung am Ort (`Ort.materialVorrat`/`materialHerstellbar`) — sonst hart nicht
  kaufbar, unabhängig von jedem Ortsmodifikator/Garnison/Floor. Alltagsmaterial (≤2,
  Eisen/Holz/Leder/...) ist überall vorausgesetzt verfügbar, keine Ort-Pflege nötig. Bisher nur für
  NK-Waffen verdrahtet.
- **Voller Material-Kanon** (19 NK-Material-Zeilen, identisch Schild-Material) einmal komplett mit
  dem Nutzer durchgegangen und korrigiert — siehe Claude-Memory für die volle Liste. Größte Fixes:
  Bronze (nur Katzen/Indianer, nicht die 7-Völker-Metallliste), Stein (nur Indianer, nicht ALLE),
  Chitin (Katzen/Draw/Zwerge/Indianer, nicht ALLE), "Alchemistensilb." → "Alchemistensilber"
  umbenannt.
- Orte: Zwogón existiert nicht mehr (Zwerge vertrieben) → **Isch-Isch** (goblinisch). Neue
  zwergische Hauptstadt **Katharsis** übernimmt den Titel "Großkönigliche Kernprovinz".
- **Körperbaugruppen-Tag** (`engine/koerperbau.ts`, Nutzer 2026-09-12: "eine Zwergenplatte passt
  einem Troll nicht, könnte aber einem Goblin passen"): reine Datenvorbereitung, jedes ausgerüstete
  Rüstungsteil trägt jetzt `koerperbaugruppe` (Gnome / Goblins+Zwerge /
  Dalkini+Indianer+Elfen+Draw+Katzen / Orks / Trolle / Zentauren-Beine als eigene Gruppe, da
  Zentauren-Oberkörper zur Dalkini-Gruppe zählt) sowie bei "angepasst"/"perfekt angepasst" ein
  `angepasstFuerCharakterId`. **Noch OHNE jede Kompatibilitäts-/Sperrlogik** — es gibt aktuell keine
  Ausrüstungs-Weitergabe zwischen Charakteren, dafür wird das erst gebraucht.

**Noch offen:**
- Fertigung/Anpassung/Schaftmaterial noch nicht durch den Material-Kanon-Pass gegangen.
- Ort-Kanon (welches seltene Material ist WO vorrätig/herstellbar) nur für Katharsis gesetzt
  (Mithril/Nasium) — Straitmor/Isch-Isch/Phoenix-Feste komplett leer.
- Material-Gate nur NK-Waffen, nicht Rüstung/Schild.
- Körperbaugruppen-Kompatibilitätsmatrix + Konsequenz bei Fehlpassung: bewusst noch nicht
  spezifiziert, erst wenn eine Ausrüstungs-Weitergabe zwischen Charakteren ansteht.
- Preisliste (973 Zeilen) weiterhin ganz ohne Verfügbarkeit/Völkerzuweisung — größter
  verbleibender Batzen im Gesamtprojekt (siehe unten, "965 offen").

---

Stand: 2026-07-19

## Zwingende Arbeitsregeln

- Nicht in `werte 0.8-claude.xlsx` oder die App schreiben, bevor alles fertig abgenommen und das Ziel ausdrücklich bestimmt wurde.
- Fehlende Verfügbarkeit ist leer/`OFFEN`, niemals `0`.
- Skala ausschließlich `1–7` und `M`; `M` nur Meister-Modul.
- Kaufbar für Spieler: effektive Werte `1–4`; `5–7`, `M`, `OFFEN` gesperrt.
- Zusammengesetzte Ausrüstung: jede Komponente vollständig berechnen; schlechtestes Ergebnis zählt. Numerisch Maximum, `M` vor numerisch, `OFFEN` vor allem.
- Globale Materialreferenz nicht erneut je Ausrüstungsfamilie abfragen. Sie ist für Waffen, Schilde und abgeleitete Komponenten verbindlich.

## Globale Materialwerte AW/NW

`Holz 1/1`; `Hartholz 2/2`; `Leder 1/1`; `Spinnenwebe 4/4`; `Chitin 5/2`; `Drachenschuppe M/M`; `Stein 1/1`; `Schwarzfels 5/1`; `Diamantspat 7/7`; `Bronze 1/1`; `Eisen 1/1`; `Feineisen 1/1`; `Stahl 1/2`; `Qualitätsstahl 2/4`; `Faltstahl 3/5`; `Mithril 7/7`; `Adamandit M/M`; `Alchemistensilber 5/6`; `Vulkanglas 7/3`; `Nasium 7/7`; `Knochen 1/1`; `Kolharz 5/7`.

Hersteller-Sonderfälle:

- Spinnenwebe und Diamantspat: Draw
- Schwarzfels und Vulkanglas: Indianer, Katzen
- Kolharz: Zentauren
- Mithril und Nasium: Elfen, Zwerge
- Alchemistensilber: Dalkini, Elfen, Goblins, Orks, Zwerge
- übrige Metalle: Dalkini, Draw, Elfen, Goblins, Orks, Trolle, Zwerge
- sonst ALLE

## Aktueller Stand

- Rüstungen abgeschlossen: 28/28.
- Artefakte abgeschlossen: 749/749.
- Schilde abgeschlossen: 34/34.
- Waffen abgeschlossen: 270 bestätigt, 17 `NICHT KAUFBAR`; Spezies 287/287 bestätigt.
- Preisliste offen: 965 Verfügbarkeiten und 965 Völkerzuweisungen fehlen vollständig in der Quelle.
- Nutzer trägt Preislisten-Verfügbarkeiten manuell ein.

## Arbeitsdateien

- `Verfuegbarkeiten-Herkunftsorte-Entwicklung.xlsx`
- `nasus-spec/nasus-spec/04-Verfuegbarkeiten-und-Herkunftsorte.md`
- `scripts/build_verfuegbarkeiten_entwicklung.py`
- ausführlicher Savepoint: `SAVEPOINT-Verfuegbarkeiten-Herkunftsorte-2026-07-19.md`

## Nächster Schritt

In `Audit Ausrüstung` nach `Familie = Preisliste` und `Status Verfügbarkeit = OFFEN` filtern. AW in G, NW in H eintragen, Status in I nach Prüfung auf `BESTÄTIGT`. Danach Völker in J–L bearbeiten und Audit erneut auswerten.

## Sitzungsnotiz vom 2026-07-19 – Wiedereinstieg morgen

Der Nutzer wechselte mit „jetzt verfügbarkeiten“ ausdrücklich zurück zu den Verfügbarkeiten.

### Was heute geprüft wurde

- `Verfuegbarkeiten-Herkunftsorte-Entwicklung.xlsx` wurde mit dem gebündelten Spreadsheet-Runtime-Werkzeug nur lesend geladen und geprüft.
- Alle 13 Blätter wurden visuell kontrolliert; bei den sehr langen Blättern wurden lesbare Ausschnitte gerendert.
- Der gespeicherte Auditstand ist unverändert und konsistent:
  - Rüstung: 28 `BESTÄTIGT`
  - Artefakt: 749 `BESTÄTIGT`
  - Preisliste: 965 `OFFEN` bei Verfügbarkeit und Völkerzuweisung
  - Waffe: 270 `BESTÄTIGT`, 17 `NICHT KAUFBAR`; Völker 287 `BESTÄTIGT`
  - Schild: 34 `BESTÄTIGT`
- Die Fehlersuche ergab keine sichtbaren Formelwerte wie `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?` oder `#N/A`.
- Layout und Statusfarben waren in den geprüften Ausschnitten lesbar und konsistent.
- Die Entwicklungsmappe war während der Prüfung in Excel geöffnet. Deshalb wurde ausschließlich der zuletzt gespeicherte Stand gelesen.

### Was ausdrücklich nicht geändert wurde

- Keine Verfügbarkeit wurde eingetragen.
- Keine Völkerzuweisung wurde eingetragen.
- `Verfuegbarkeiten-Herkunftsorte-Entwicklung.xlsx` wurde nicht gespeichert oder überschrieben.
- `werte 0.8-claude.xlsx`, App-Quellcode und Regelspezifikation blieben unverändert.
- Beim abschließenden `git status` wurde `werte 0.8-claude.xlsx` dennoch als geändert angezeigt. Diese Änderung stammt nicht aus der hier beschriebenen Arbeit und muss morgen als vorhandener Nutzer-/Fremdstand bewahrt werden; nicht zurücksetzen oder überschreiben.

### Nur technische Prüfdateien dieser Sitzung

- Unter `temp/artifact_verfuegbarkeiten_current/` wurden ausschließlich temporäre, unversionierte Prüfhilfen erzeugt:
  - `inspect_workbook.mjs`
  - `inspect_preisliste.mjs`
  - gerenderte PNG-Vorschauen der 13 Blätter und zweier zusätzlicher Auditbereiche
  - eine lokale `node_modules`-Junction auf die gebündelte Spreadsheet-Runtime
- Diese Dateien enthalten keine fachlich bestätigten neuen Verfügbarkeitswerte und sind nicht das Lieferartefakt.

### Datenquellen und wichtige Abgrenzung

- Die 965 Auditzeilen stammen aus `src/data/equipment/preisliste.json`, nicht aus der aktuell im Projektroot liegenden `NN Preisliste v1.2.xlsx`.
- Diese beiden Preislistenstände beginnen mit unterschiedlichen Datensätzen:
  - `src/data/equipment/preisliste.json` enthält zuerst Reittiere; erste kaufbare Auditzeile ist `Chocobo, Abgeh,` mit `sourceRow 4`.
  - `NN Preisliste v1.2.xlsx` beginnt auf dem Blatt `Preistabelle` mit alchemistischen Stoffen.
- Für die weitere Auditpflege muss daher `src/data/equipment/preisliste.json` als Quelle des aktuellen Auditbestands verwendet werden, solange nicht ausdrücklich eine Migration auf die andere Preisliste beschlossen wird.

### Erster vorbereiteter Entscheidungsblock

Fundstelle im Audit: Blatt `Audit Ausrüstung`, erste Preislistenzeile ab Excel-Zeile 782.

Für die fünf Chocobo-Varianten wurde folgender Vorschlag gemacht, aber noch nicht vom Nutzer bestätigt und noch nicht eingetragen:

| Gegenstand | Vorschlag AW | Vorschlag NW |
|---|---:|---:|
| Chocobo, Abgeh, | 3 | 4 |
| Chocobo, Alt | 2 | 3 |
| Chocobo, Reit | 3 | 4 |
| Chocobo, Schlacht | 5 | 6 |
| Chocobo, Vollblut | 6 | 7 |

Quellkontext aus `src/data/equipment/preisliste.json`: alle fünf gehören zur Warengruppe `Reittiere`, zur Spezialisierung `Laufvogel` und tragen die Notiz `Elf`. Preise: 470, 282, 750, 2250 und 3380 Dublonen.

### Morgen als Erstes

1. Nutzer fragen, ob der Chocobo-Vorschlag `3/4, 2/3, 3/4, 5/6, 6/7` bestätigt oder korrigiert wird.
2. Erst nach Bestätigung die fünf Werte eintragen und Status Verfügbarkeit auf `BESTÄTIGT` setzen.
3. Danach mit dem nächsten zusammengehörigen Reittierblock `Pferde` fortfahren.
4. Keine Werte allein aus dem Preis ableiten; Preis, Kulturhinweis, Warengruppe, Variante und AW/NW-Verbreitung gemeinsam fachlich beurteilen.
5. Völkerzuweisungen weiterhin getrennt behandeln, sofern der Nutzer nicht ausdrücklich beide Themen zusammen bearbeiten möchte.
