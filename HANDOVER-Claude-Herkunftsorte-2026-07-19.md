# Handover an Claude: Herkunftsorte und Header

Stand: 2026-07-19

## Kurzstatus

Claude-Auftrag 1–3 aus `Verfuegbarkeiten-Herkunftsorte-Entwicklung.xlsx` ist umgesetzt und geprüft:

1. Ortsmodell, kontrollierte Auswahllisten und drei Beispielorte.
2. `Heimat`/altes Weltfeld durch Herkunfts-ID und stabilen Snapshot ersetzt, einschließlich Bestandsmigration.
3. Herkunftsdropdown und Formular für einen neuen benannten Ort in der Charaktererschaffung.

Auftrag 4 und 5 sind nur geplant. Verfügbarkeiten sind ausdrücklich ein getrenntes Folgemodul.

## Zuerst lesen

1. Diese Datei vollständig.
2. `PLAN-Herkunftsorte-Folgemodule.md` nur, wenn Auftrag 4 oder 5 ausdrücklich gestartet wird.
3. `nasus-spec/nasus-spec/04-Verfuegbarkeiten-und-Herkunftsorte.md` nur abschnittsweise für die konkret beauftragte Fachregel.

Die großen XLSX-, Savepoint- und Memory-Dateien nicht vorsorglich vollständig einlesen. Das erhält Kontext und Tokens.

## Implementierter Dateischnitt

- `src/data/orte.ts`
  - Orts- und Untertypen
  - kontrollierte Auswahllisten
  - 43 Warengruppen, davon 38 händlerspezialisierbar
  - Validierung
  - Straitmor, Zwogón und Phoenix-Feste
- `src/state/characterStore.ts`
  - `herkunftOrtId`
  - stabiler `herkunftSnapshot` mit Name, geografischer Region und AW/NW
  - Migration von `heimat` und dem früheren Weltfeld `region`
- `src/state/characterMutations.ts`
  - bestehende Rüstungsverfügbarkeit liest AW/NW aus dem Herkunftssnapshot
- `src/main.ts`
  - Auswahl eines vordefinierten Herkunftsorts
  - Anlage eines neuen benannten Orts mit kontrollierten Grundfeldern
- `src/views/charakterheader.ts`
  - kein eigenständiges Heimat-/Weltfeld mehr
- `src/views/charakterbogen.ts`
  - Herkunftsdruck als `Ort, Region, AW/NW`
- `src/style.css`
  - Layout des neuen Ortsformulars und der Herkunftsanzeige
- Tests:
  - `src/data/orte.test.ts`
  - `src/views/charakterbogen.test.ts`
  - angepasste Store-, Migrations- und Rüstungsverfügbarkeitstests

## Bewusste Grenzen

- Ein bei der Charaktererschaffung neu benannter Ort wird derzeit über den Charakter-Snapshot erhalten, aber noch nicht als wiederverwendbarer Ortsdatensatz gespeichert. Das gehört zu Auftrag 4.
- Das Erstellungsformular erfasst Grundfelder. Händler, lokale Produktion, Hauptspezies und Minderheiten werden später im vollständigen Ortseditor aus Auftrag 5 bearbeitet.
- Bei alten Charakteren kann AW/NW fehlen, wenn im früheren Datensatz kein Weltfeld gesetzt war. Der alte Heimatname bleibt trotzdem erhalten; es wird keine Welt erfunden.
- `src/engine/regionen.ts` ist nach der Umstellung unbenutzt, wurde aber nicht vorsorglich gelöscht.
- Keine Verfügbarkeitsstammdaten und keine Werte-XLSX wurden durch diesen Arbeitsblock geändert.

## Prüfstand

Zuletzt erfolgreich ausgeführt:

```powershell
npm.cmd test
npm.cmd run build
```

Ergebnis: 25 Testdateien, 215 Tests, Produktions-Build erfolgreich. Vite meldet nur die bereits bekannte Warnung zur Chunkgröße.

## Arbeitsbaum schützen

Der Arbeitsbaum enthält bereits fremde beziehungsweise nutzereigene Änderungen und unversionierte Arbeitsdateien. Nicht resetten, nicht pauschal bereinigen und nichts außerhalb des konkreten Auftrags überschreiben. Insbesondere gehören `.claude/settings.local.json`, `thoughts.docx`, `werte 0.8-claude.xlsx`, `.python-deps/`, Scratch-Dateien, Memory und Savepoint nicht automatisch zu diesem Implementierungsblock.

Es wurde kein Commit erstellt.

## Nächster möglicher Auftrag

- Auftrag 4+5 nur auf ausdrückliche Anweisung anhand von `PLAN-Herkunftsorte-Folgemodule.md` beginnen.
- Verfügbarkeiten in einer eigenen neuen Sitzung und in kleinen, familienbezogenen Blöcken bearbeiten.
- Vor jeder Änderung zuerst Scope und Zielartefakte bestätigen; keine fehlenden Verfügbarkeiten erfinden und niemals `0` als Platzhalter verwenden.
