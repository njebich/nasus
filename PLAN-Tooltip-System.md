# Plan: Tooltip-System (lange Beschreibungstexte)

Stand: 2026-07-20

Ausgangspunkt: `tooltips text.txt` (Entwurf mit unique_id + Tooltip-Text fuer
Grundfertigkeiten) und die Frage, wie lange Tooltip-Texte generell dargestellt
werden sollen. Dieses Dokument ist eine Roadmap, keine fertige Loesung -
noch nichts davon ist implementiert.

## Bestandsaufnahme (Stand 2026-07-20)

- Tooltips heute: natives `title`-Attribut, erzeugt von `formulaTitle()` in
  `src/views/categoryView.ts` aus `prettyFormula(formelRaw/poolRaw/kostenRaw)`
  (`src/engine/formulaDisplay.ts`). Reiner Text, kein Styling, kein Scroll,
  auf Touch-Geraeten quasi nutzlos.
- `RuleEntry` (`src/data/rules.ts`) hat bereits `info?` und `wirkung?` -
  passend zu den in der xlsx bereits vorhandenen Spalten **Info** und
  **Wirkung** im Werte-Sheet (siehe Memory `project-werte-xlsx-schema`).
  Die Pipeline xlsx -> `generate_data_ts.py` -> `rules.json`/jsonl ->
  `RuleEntry` existiert bereits durchgaengig - nur die UI nutzt `info`/
  `wirkung` bisher nirgends (Ausnahme: `wirkung` wird in
  `src/views/ausruestung.ts:128` fuer Ausruestungsgegenstaende angezeigt).
- Inhalte-Check (jsonl) zum Zeitpunkt dieser Planung:

| Kategorie | Beschreibung (kurz) | Info/Langtext | Wirkung |
|---|---|---|---|
| Grundfertigkeiten | 22/22 | 0 - Entwurf in `tooltips text.txt` deckt das ab | - |
| Eigenschaften | 10/10 | 0 - evtl. woanders vorhanden, muss noch gesucht werden | - |
| Attribute | 7/7 | 0 - evtl. woanders vorhanden, muss noch gesucht werden | - |
| Sonderfertigkeiten | 22/22 | 0 - Text existiert laut Nutzer bereits irgendwo, nur nicht importiert | - |
| Vor-/Nachteile | 199 Zeilen | - | 199/199 bereits vorhanden, aber ungenutzt |
| Talente | 176/176 | - | 0/176 - Text existiert laut Nutzer bereits irgendwo, nur nicht importiert |
| Sprache & Kultur | - | noch zu erstellen | - |

## Phase 0+1 (zusammengefasst) - Anzeige-Mechanismus - SHIPPED 2026-07-21

Umgesetzt in `src/views/tooltip.ts` (`tooltipAttr()` + `initTooltips()`,
einmalig aus `main.ts` aufgerufen, Event-Delegation auf `document.body`
ueberlebt jedes Neu-Rendern). `formulaTitle()` in `categoryView.ts` und
`talenteVornachteile.ts` wurde zu `formulaTooltip()` umbenannt und nutzt
jetzt `tooltipAttr()` statt `title=` - 1:1 gleiche Call-Sites wie vorher.
CSS-Klasse `.app-tooltip` in `style.css` nutzt `Canvas`/`CanvasText` statt
fester Hex-Farben, damit Light/Dark automatisch mitzieht.

Entscheidung (2026-07-20, nach Rueckfrage): kein natives `title`, aber auch
kein volles Popover/Modal-System. Stattdessen ein schlankes, selbst
gestyltes Tooltip-Div, das an der gleichen Stelle wie heute per Hover
erscheint (gleicher Trigger-Punkt wie `formulaTitle` heute):

- Fixe `max-width`, `white-space: normal` -> Text bricht um, Hoehe waechst
  dynamisch mit dem Inhalt ("fixed width, dynamic length").
- Kein Bold/Rich-Markup noetig (siehe Phase 3 - Bolding wurde verworfen).
- Mobile ist aktuell zweitrangig, aber die Komponente soll so gebaut werden,
  dass ein spaeterer i-Button (Tap statt Hover, gleiche Tooltip-Komponente)
  keine Neuentwicklung braucht, nur einen zweiten Trigger.
- Ersetzt `formulaTitle()`s `title=`-Ausgabe 1:1 an denselben Call-Sites.

Damit gibt es keinen architektonischen Fork mehr zwischen Kategorien - eine
Komponente fuer Formel-Tooltip, `info`-Text und `wirkung`-Text.

## Phase 2 - Inhalte pro Kategorie

1. **Vor-/Nachteile**: fertig, `wirkung` ist schon da -> nur Phase-0/1-Wiring,
   SP-Kosten bewusst NICHT im Tooltip (Wirkung statt Kosten, Nutzer-Vorgabe).
2. **Grundfertigkeiten**: `tooltips text.txt` ist importfertig (referenz|text).
3. **Sonderfertigkeiten**: Text existiert laut Nutzer bereits irgendwo,
   nur nicht importiert -> erst Quelle finden, dann Importskript, keine
   Neuautorenschaft.
4. **Talente**: gleiche Lage wie SF, aber 176 Zeilen -> groesster Import-Job,
   aber kein Autoren-Job.
5. **Eigenschaften (10) + Attribute (7)**: unklar, ob Text bereits woanders
   existiert - Nutzer muss das noch pruefen, bevor hier Neuautorenschaft
   angenommen wird.
6. **Sprache & Kultur**: muss tatsaechlich neu geschrieben werden, ist aber
   strukturell ein Tabellen-Autofill-Job (ein Template pro Sprache/Kultur-
   Zeile), kein offenes Schreiben.

Praktische Konsequenz: vor Phase 2 fuer SF/Talente/Eigenschaften/Attribute
steht ein **Quellen-Suchlauf** (wo liegt der vorhandene Text - anderes
Sheet, docx, Notizen?), bevor Aufwand fuer Import oder Autorenschaft
geschaetzt wird.

## Phase 3 - Formel-Impact-Liste (nur Eigenschaften/Attribute, +/- Buttons)

Bolding wurde verworfen. Stattdessen: nur die Formeln anzeigen, die sich
durch den Klick tatsaechlich aendern wuerden (Filter statt Hervorhebung) -
entruempelt den Tooltip, da nur "das aendert sich" sichtbar wird.

1. Reverse-Dependency-Index: fuer eine `referenz` alle `RuleEntry` finden,
   deren Formel (`formelRaw`/`poolRaw`/`kostenRaw`) sie per Tokenizer
   referenziert (Tokenizer existiert schon in `formulaDisplay.ts`, muss nur
   einmal rueckwaerts ueber alle Regeln laufen).
2. Delta-Auswertung: pro abhaengiger Formel aktuellen Wert vs. Wert-bei-+1
   (bzw. -1 fuer den Minus-Button) ueber `evalReferenz`/`evalExpression`
   vergleichen.
3. Rendering: NUR Zeilen mit tatsaechlicher Differenz, als schlichter Text
   `"<Formelname>: <neuer Wert>"` - nichts fuer unveraenderte Formeln.
4. Anbindung an die bestehenden `.stat-inc`/`.stat-dec`-Handler in
   `categoryView.ts`.

## Rollout-Reihenfolge

1. Tooltip-Div-Komponente bauen (Phase 0/1), ersetzt `formulaTitle()`.
2. Vor-/Nachteile verdrahten (Daten schon da).
3. Grundfertigkeiten importieren (`tooltips text.txt`).
4. Quellen-Suchlauf fuer SF/Talente/Eigenschaften/Attribute.
5. Import, was sich findet; Neuautorenschaft nur fuer den Rest.
6. Formel-Impact-Liste (Phase 3) auf Eigenschaften/Attribute, sobald deren
   Inhalte stehen.
7. Sprache & Kultur als Tabellen-Autofill, danach Docx-Hovertext-Check.

## Offene Punkte

- Wo liegt der bereits existierende SF-/Talente-Text (welches Sheet/Dokument)?
- Existiert bereits Text fuer Eigenschaften/Attribute - Nutzer muss das noch
  pruefen.
- Genaues Template fuer den Sprache-&-Kultur-Autofill noch zu definieren.
