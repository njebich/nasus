# Handover an Claude: 14-Punkte-Fehler-/Feature-Batch + Git-Divergenz

Stand: 2026-08-02, Ende der Session wegen Kontextfenster-Limit. Diese Datei ist bewusst vollständig und ohne Kürzungen geschrieben — nichts vorsorglich weglassen, wenn du sie liest.

## Kurzstatus

Der Nutzer gab eine Sammelliste mit 14 Bugs/Feature-Wünschen. Alle 14 wurden gegen den Code verifiziert, ein Plan erstellt (liegt unter `C:\Users\Bruder Grabag\.claude\plans\dreamy-exploring-cray.md`, Inhalt unten vollständig zitiert), 11 davon vollständig implementiert, getestet und lokal committed. Beim Versuch zu pushen stellte sich heraus, dass der lokale `main`-Branch **40 Commits hinter `origin/main`** zurücklag (letzter lokaler Sync-Stand: 24.07., `origin/main` war bis 01.08. weiterentwickelt worden — offenbar über GitHub-PRs/einen "codex"-Agenten, unabhängig von dieser lokalen Session). Drei der 14 Punkte (5, 9, 14) haben auf `origin/main` bereits eigene, in zwei Fällen robustere Lösungen bekommen und wurden deshalb aus dem lokalen Commit **herausisoliert** (Nutzer-Anweisung). Der Merge-Versuch von `origin/main` in den lokalen `main` zeigte danach immer noch Konflikte in 13 Dateien + einen Binärkonflikt in der xlsx — der Merge wurde **abgebrochen**, nichts gepusht.

**Nächster Schritt für die neue Session:** siehe Abschnitt "Nächste Schritte" ganz unten — dort steht exakt, was mit Punkt 5/9/14 zu tun ist, und wie mit dem Merge-Konflikt umzugehen ist.

---

## Zuerst lesen

1. Diese Datei vollständig.
2. `C:\Users\Bruder Grabag\.claude\plans\dreamy-exploring-cray.md` — der vom Nutzer freigegebene Umsetzungsplan für alle 14 Punkte (Inhalt ist unten in Abschnitt "Vollständiger Plan-Inhalt" bereits eingebettet, muss nicht separat geöffnet werden, ist aber die Referenz für Design-Entscheidungen).
3. Memory-Datei `feedback_debugging_keyword.md` (No-Browser-Review-Default) und `reference_xlsx_recalc_windows.md` (Excel-COM-Rezept, kein LibreOffice hier) — beide über das Memory-System bereits geladen, hier nochmal als Reminder.

Die xlsx (`werte 0.8-claude.xlsx`) und die generierten `src/data/rules*.json(l)`-Dateien NICHT vorsorglich neu einlesen — sie sind unten exakt dokumentiert.

---

## Ausgangslage: die Original-Liste des Nutzers (wörtlich)

```
Fernkampf: Feuerwaffen aus Schusswaffen auslagern
Armbrust spez Armbrust
Feuerwaffen Spez Pistolen, Musketen

WHK – liste: Client Freitextfeld erlauben, auch für Spezialisierungen
Nicht alle WHK erfasst.
alphabetisch sortieren - suchfeld

SSK Fehler bei Stufe 4 – warum?

Artefakte: WHK erhöhen dropdown bzw. Suche, nur feste Wirkung.

FK Waffen RW-Mod in der Kauf-Liste und im Besitz anzeigen.

Loadout Rundungsfehler bei linkhand: 28/2 = 13, muss 14 sein.

FK Waffen: Beide Schadenswürfel anzeigen

Spruchzauber Probe: g kleinschreiben
Spruchzauber RW ausrechnen

Generell alle TaW: Editierbares nummernfeld, nicht nur -/+ klicken

Charakterbogen: Spruchmagie Zauber nur TaW>0 anzeigen

Beidhändig Schießen wird als extragruppe angezeigt. Kategorie Schütze parent linkshändig schießen war angesagt, ist aber falsch. Beidhändig Schießen TaP kosten auf 40 und separat kaufbar.
```

Durchnummeriert (so wie im gesamten Verlauf referenziert):
1. Feuerwaffen aus Schusswaffen auslagern
2. Armbrust spez Armbrust
3. Feuerwaffen Spez Pistolen, Musketen
4. WHK-Liste: Freitextfeld (4a), nicht alle WHK erfasst (4b), alphabetisch sortieren + Suchfeld (4c)
5. SSK Fehler bei Stufe 4
6. Artefakte WHK erhöhen: Dropdown/Suche
7. FK-Waffen RW-Mod in Kauf-Liste UND Besitz anzeigen
8. Loadout-Rundungsfehler Linkhand
9. FK-Waffen: beide Schadenswürfel anzeigen
10. Spruchzauber-Probe "g" kleinschreiben
11. Spruchzauber-RW ausrechnen
12. Alle TaW: editierbares Zahlenfeld statt nur +/-
13. Charakterbogen: Spruchmagie nur TaW>0
14. Beidhändig Schießen: Gruppierung/Kosten/Dopplung

---

## Klärungsrunden mit dem Nutzer (Ergebnisse, damit nichts neu erfragt werden muss)

- **Schusswaffen-Split:** "Schusswaffen" bleibt als Hauptfertigkeit bestehen (Name/Referenz unverändert), wird durch den Split effektiv zur reinen Armbrust-Fertigkeit. Es gibt KEINE neue Hauptfertigkeit "Armbrust". Neue Hauptfertigkeit "Feuerwaffen" wird ausgelagert (Musketen/Pistolen-Spez wandern dorthin).
- **Bestandscharaktere beim Split:** kein Migrations-/Reset-Code nötig — `fk_feuerwaffen` ist schlicht neu (TaW startet bei 0).
- **Armbrust-Formelzeilen:** Plural ("armbrueste") ist korrekt, nicht Singular — die Formel-Zeilen (nicht die Wert-Zeile) wurden auf Plural umbenannt.
- **WHK-Freitext:** zusätzliche freie Option, aber unbegrenzt — wenn eine freie Zeile gefüllt wird, erscheint eine neue. Gilt auf ZWEI Ebenen: auch komplett neue, frei benannte Hauptfertigkeiten (Nutzer-Beispiel: "Fußball" mit Spezialisierung "Freistöße"), nicht nur Spezialisierungen unter festen Hauptfertigkeiten.
- **Artefakt-Ziel-UX:** Dropdown (wie bei Waffen-Artefakten/X-Klinge), nicht Suchfeld.
- **Artefakt-Bonus:** WHK-/Grundfertigkeit-erhöhen-Artefakte sind befristete Zaubereffekte (WD 7h/40min), KEINE dauerhaften "immer aktiv"-Artefakte wie Eigenschaft/Attribut — deshalb bewusst KEINE automatische Bonusverdrahtung, nur Zielauswahl + Speicherung.
- **Datenfehler gefunden:** `wirkungEinheit` bei beiden genannten Artefakten stand auf "TaP", korrekt ist "TaW" — in der xlsx korrigiert.
- **(M) in Spruchzauber-Formeln:** = "Macht", eine bereits vorhandene Formel-Zeile in Kategorie "Charakterwerte" (`referenz: "macht"`), NICHT neu erfunden.
- **RW-Halbierung (Pistole-Pistole):** soll ebenfalls auf "aufrunden weg von Null" umgestellt werden, konsistent mit der AT/PA-Nebenhand-Halbierung.
- **Talent "Kampffertigkeit erhöhen: Schusswaffen":** bleibt unverändert auf `fk_schusswaffen` (= jetzt Armbrust). Zusätzlich zweites, identisches Talent für `fk_feuerwaffen` neu angelegt.
- **Punkt 12 (TaW editierbar):** NICHT die AT/PA-Pool-Zellen im Kampf-Tab gemeint (die haben schon länger kein Problem) — sondern konkret Spruchmagie/KI/Psi, die bislang nur +/- ohne Zahlenfeld hatten.
- **Punkt 13 (Charakterbogen Spruchmagie):** Nutzer will KEINEN einfachen gefilterten Tabellen-Abschnitt — stattdessen ein eigenständiges "Grimoire"-Feature mit eigenem Layout, separates zukünftiges Vorhaben. Explizit **nicht** Teil dieses Batches.
- **Punkt 14 (Beidhändig Schießen):** live im Browser verifiziert — Gruppierung/Kosten/Kaufbarkeit waren bereits korrekt (kein echter Bug). Der echte Fund war eine Datendopplung: `talente_mit_zwei_pistolen_schiessen` vs. `talente_beidhaendig_pistolenschiessen`, fast identische Wirkung. Nutzer wollte das ins Kampfsystem verdrahtete Talent (`talente_beidhaendig_pistolenschiessen`) behalten.

---

## Vollständiger Plan-Inhalt (aus `dreamy-exploring-cray.md`, zur Referenz eingebettet)

Der Plan wurde vom Nutzer nach mehreren Korrekturrunden freigegeben (u.a. Schusswaffen-Split-Zielstruktur, WHK-Freitext-Umfang, Artefakt-Bonus-Nichtverdrahtung, Armbrust Plural-vs-Singular, Charakterbogen-Ausklammerung). Volltext:

### Kontext
Sammel-Bugliste/Feature-Request-Liste des Nutzers für die Nasus-Charaktergenerator-App. Alle 14 Punkte wurden gegen den aktuellen Code-Stand verifiziert (inkl. Live-Check im Browser für Punkt 14). Wichtiger Fund: `src/data/rules-jsonl/*.jsonl` ist NUR eine git-diff-lesbare Kopie — die echte Laufzeitdatei ist `src/data/rules.json`, generiert aus der xlsx via `scripts/generate_data_ts.py`. Kritische Falle: Formel-Zeilen (`art: "Formel"`) liefern ihren Wert über `.computedValue`, NICHT `.currentValue`.

### 1) Schnelle Bugfixes (Details siehe Original-Zitat oben in den Klärungsrunden — alle unten im Abschnitt "Was committed wurde" nochmal konkret mit Dateien aufgeführt)

### 2) Schusswaffen-Split — Details siehe unten "xlsx-Änderungen im Detail" und "Was committed wurde"

### 3) WHK-Liste: Sortierung/Suche/Freitext — Details siehe unten

### 4) Artefakt-Dropdown — Details siehe unten

### 5) Spruchzauber-RW — Details siehe unten

### 6) Charakterbogen Spruchmagie — AUSGEKLAMMERT, separates zukünftiges Feature ("Grimoire")

### 7) TaW-Eingabefeld — Details siehe unten

### 8) Beidhändig Schießen — Details siehe unten "Isolierte Punkte"

(Die vollständigen Datei:Zeile-Referenzen aus dem Original-Plan sind teilweise durch Implementierung überholt — die "Was committed wurde"-Sektion unten ist die aktuelle, korrekte Quelle.)

---

## Was committed wurde (11 von 14 Punkten)

**Commit:** `5241aaa` auf lokalem `main`, Nachricht "Fehler-/Feature-Batch: Schusswaffen-Split, WHK-Freitext, Artefakt-Ziel, Spruchzauber-RW". **NICHT gepusht.**

### Bugfixes

- **Punkt 8 (Rundungsfehler):** `src/engine/waffenSchaden.ts` neuer Helfer `ceilAwayFromZero(x)` (nutzt `aufrunden` aus `functions.ts`). Eingesetzt in `src/engine/waffenLoadout.ts`: `halveRangeCellValues` (Pistole-Pistole-Reichweite) sowie den beiden AT/PA-Nebenhand-Halbierungsstellen in `resolveNk1hNk1h`/`resolveNk1hSchild`. `floorSigned` bleibt unverändert für die Schaden-Formel (Stärke-Bonus). Tests angepasst in `waffenLoadout.test.ts`, neue Regressionstests in `src/engine/waffenSchaden.test.ts` (u.a. 27/2→14 statt 13).
- **Punkt 10 (Probe "G"→"g"):** `src/views/spruchmagie.ts:235`, Ein-Zeilen-Fix.
- **Punkt 7 (RW-Mod im Besitz):** `src/views/ausruestung.ts`, `renderInventar`, `family === 'ammo'`-Zweig — RW-Mod-Segment im sichtbaren Label ergänzt (Wert lag schon im Snapshot vor, war nur nicht sichtbar, nur im Tooltip).

### Schusswaffen-Split (Punkte 1, 2, 3) — xlsx bearbeitet + neu generiert

Siehe eigenen Abschnitt "xlsx-Änderungen im Detail" unten für die exakten Zeilen/Referenzen. Code-Anpassungen:
- `src/views/categoryView.ts`: `FERNKAMPF_SPEZ_ARMBRUST_REFERENZ`-Sonderfall entfernt (nicht mehr nötig, da Formel-Zeilen jetzt konsistent Plural heißen).
- `src/engine/waffenLoadout.ts`: `FEUERWAFFEN_TYP_BASIS_REF` auf `fk_basis_spez_feuerwaffen_musketen`/`_pistolen` umbenannt.
- `src/views/kampf.ts`: gleiche Konstante (Duplikat) umbenannt; `ARMBRUST_BOEGEN_BASIS_REF.armbrust` auf `fk_basis_spez_schusswaffen_armbrueste` (Plural) angepasst.
- `src/engine/ladeschuetzeGating.ts`: `LADESCHUETZE_SF_FK_GATE` — `sf_ladeschuetze_armbrust` bleibt auf `fk_schusswaffen`, `sf_ladeschuetze_patrone`/`_vorderlader` (Schwarzpulver-Mechanismen) auf `fk_feuerwaffen` umgestellt.
- `src/data/talenteMaximum.ts`: neuer manueller Eintrag (Kommentar erklärt, dass er nicht aus dem generierenden Skript stammt) für `talente_kampffertigkeit_erhoehen_feuerwaffen` → `fk_feuerwaffen`, bonus 6.
- Tests: `characterSheet.test.ts`, `waffenLoadout.test.ts` — Referenzen auf `fk_feuerwaffen`/`fk_spez_feuerwaffen_pistolen` nachgezogen.

### WHK: Sortierung + Suche (Punkt 4c)

- `src/engine/hierarchy.ts`: neue Funktion `sortHierarchyByBeschreibung` (alphabetisch, parallel zu vorhandenem `sortHierarchyByValue`).
- `src/views/categoryView.ts`, `renderCategoryView`: für `kategorie === 'WHK'` alphabetisch sortiert + gefiltert (Suchfeld-Text in `categorySearchText`-Map persistiert wie `openGroupReferenzen`). Suchfeld-HTML `#whk-search`, Fokus-Erhalt über re-render (Selection-Start gespeichert/wiederhergestellt). Neue Hilfsfunktion `filterHierarchyForSearch` (behält Hauptfertigkeits-Zeile auch bei reinem Spezialisierungs-Treffer, damit das `maxValue`-Cap nicht verloren geht). Sprache & Kultur (teilt sich den Rendering-Pfad) bewusst unverändert gelassen.

### WHK: Freitext-Hauptfertigkeiten + -Spezialisierungen (Punkt 4a/4b)

- `src/state/characterStore.ts`: neuer Typ `CustomWhkEintrag { id, name, wert }`, neue Felder `customWhkHauptfertigkeiten: CustomWhkEintrag[]` und `customWhkSpezialisierungen: Record<string, CustomWhkEintrag[]>` in `CharacterState`, mit Migrations-Fallback in `loadCharacter` und Default in `createCharacter`.
- `src/engine/whkCustomSpezialisierung.ts` (NEU): `getWhkHauptfertigkeitKosten(wert)` (Formel `wert<=0?0:10+((wert-1)*wert)/2`, identisch zu z.B. `whk_kaufmann`) und `getWhkSpezialisierungKosten(wert)` (nutzt `sverweis`/`LOOKUP_TABLES['WHK-Spez-Kosten']`, identisch zu festen Spezialisierungen).
- `src/engine/characterSheet.ts`: `spSpent`-Berechnung um die Kosten aller custom WHK-Einträge erweitert (diese haben keine `RuleEntry`, wurden vorher nicht mitgezählt). `ComputedSheet` bekommt zwei neue Felder `customWhkHauptfertigkeiten`/`customWhkSpezialisierungen` (1:1 aus `character` durchgereicht), damit `categoryView.ts` sie rendern kann, ohne zusätzlich das rohe `CharacterState` zu bekommen.
- `src/state/characterMutations.ts`: neue Funktionen `addCustomWhkHauptfertigkeit`, `renameCustomWhkHauptfertigkeit`, `setCustomWhkHauptfertigkeitWert`, `addCustomWhkSpezialisierung`, `renameCustomWhkSpezialisierung`, `setCustomWhkSpezialisierungWert` (inkl. Budget-Checks, Deckel-Prüfung Spez ≤ Hauptfertigkeit-TaW analog zu `setValue`). `clone()` erweitert um Deep-Copy der beiden neuen Felder.
- `src/views/categoryView.ts`: neue Render-Funktionen `renderCustomWhkSpezRow`, `renderCustomWhkSpezAddRow`, `renderCustomWhkHauptfertigkeitGroup`, `renderCustomWhkHauptfertigkeitAddRow`. `renderEditableGroup` erweitert: WHK-Hauptfertigkeiten durchlaufen nie mehr den flachen Früh-Ausstieg (auch ohne feste Katalog-Spezialisierungen), damit sie custom Spezialisierungen bekommen können. Neuer Typ/Export `WhkCustomAction` (discriminated union: `add-hauptfertigkeit`/`rename-hauptfertigkeit`/`set-hauptfertigkeit-wert`/`add-spezialisierung`/`rename-spezialisierung`/`set-spezialisierung-wert`) und `OnWhkCustomChange`. Eigene Event-Verdrahtung für `.custom-whk-row`-Elemente, mit expliziter Ausschluss-Guard in der generischen `.stat-inc`/`.stat-dec`/`.stat-value`-Verdrahtung (sonst würde `onChange(undefined, ...)` mit-feuern, da custom Rows kein `data-referenz` haben).
- `src/main.ts`: neuer Handler `handleWhkCustomChange`, dispatcht auf die sechs Mutation-Funktionen, gleiches Fehler-/Speicher-/Render-Muster wie `handleValueChange`. `renderCategoryView`-Aufruf um den neuen Parameter erweitert.
- **Im Browser verifiziert:** Hauptfertigkeit "Fußball" angelegt (TaW 5), Spezialisierung "Freistöße" angelegt und auf TaW 3 gesetzt (gedeckelt bei 5), Trailing-Add-Row erscheint nach jedem Ausfüllen korrekt neu, Kosten korrekt berechnet (SP-Total sichtbar), keine neuen Konsolenfehler.

### Artefakt-Dropdown (Punkt 6)

- `src/views/ausruestung.ts`: `RULES` importiert. Neue Konstanten `WHK_TALENTWERT_ARTEFAKT_REFERENZ`/`GRUNDFERTIGKEIT_ARTEFAKT_REFERENZ`, Helfer `whkZielOptionen(character)`/`grundfertigkeitZielOptionen(character)` (filtern auf TaW>3, inkl. custom WHK-Hauptfertigkeiten). `renderArtefaktRow` bekommt `zielPicker`-Dropdown (`<select class="artefakt-ziel-auswahl">`) analog zum bestehenden `artefakt-waffen-ziel`-Select für X-Klinge. Kauf-Button-Handler liest `targetReferenz` aus dem Select, `onBuyArtefakt`-Signatur um `targetReferenz?: string` erweitert.
- `src/state/characterMutations.ts`: `buyArtefakt` validiert bei den beiden dynamischen Ziel-Artefakten (`DYNAMISCHES_ZIEL_ARTEFAKT_REFERENZEN`-Set), dass `targetReferenz` gesetzt ist und das Ziel TaW>3 hat (Re-Validierung serverseitig, nicht nur Client-Filter), speichert dann `entry.selections.ziel`. **Explizit KEINE Bonus-Verdrahtung** in `artefaktBonus.ts` (siehe Klärungsrunde oben — befristeter Effekt, keine "immer aktiv"-Artefakte).
- `src/main.ts`: `handleBuyArtefakt` um `targetReferenz`-Parameter erweitert.
- **xlsx-Datenfehler mitkorrigiert:** `wirkungEinheit` bei `artefakt_whk_talentwert_erhoehen` und `artefakt_grundfertigkeit_erhoehen` von "TaP" auf "TaW" geändert (im selben xlsx-Bearbeitungsschritt wie der Schusswaffen-Split, siehe unten).
- **Im Browser verifiziert:** Dropdown zeigte korrekt nur "Fußball (TaW 5)" (einziges qualifizierendes Ziel), Kauf durchgeführt, `localStorage`-Check bestätigte `entry.selections = {variant: "einmalig", ziel: "<fußball-uuid>"}`. Grundfertigkeit-Karte zeigte korrekt "Ziel-Grundfertigkeit benötigt" (deaktiviert, da keine Grundfertigkeit TaW>3 hatte).

### Spruchzauber-RW (Punkt 11)

- `src/engine/spruchmagieRw.ts` (NEU): `resolveRw(raw, macht, magie, aura, mana)` mit Regex `RW_PATTERN` für Muster `(M)|Magie|Aura` + `[*/]Faktor` + optionaler Einheit (`cm`/`km`/`m`, Default `m`) + optionalem `Radius`-Suffix, Sonderfall `(M)*(Mana/30)m`. Nicht erkannte Strings (z.B. "Selbst", "Berührung") werden unverändert durchgereicht. Rundung über `aufrunden` (App-Konvention).
- `src/engine/spruchmagieRw.test.ts` (NEU): Tests für alle beobachteten Muster inkl. Radius, Mana-Sonderfall, Literal-Passthrough.
- `src/views/spruchmagie.ts`: neue Helfer `getAttAura`, `getCharakterwertFormel` (liest `.computedValue`, NICHT `.currentValue` — kritische Falle aus dem Plan beachtet). RW-Zelle in `renderRow` zeigt jetzt `resolveRw(...)`-Ergebnis mit Tooltip "Formel: &lt;Rohformel&gt;".
- **Im Browser verifiziert (mit echten Charakterwerten):** "Magische Wand" (Formel "Magie/2m") → "0m" (da Magie=0 beim Testcharakter), "Bipolare Schere" (Formel "(M)*m") → "8m", "Magische Kuppel" (Formel "(M)/2m Radius") → "4m Radius" — intern konsistent (Macht=8 bei diesem Charakter, 8/2=4 stimmt).

### TaW-Eingabefeld (Punkt 12)

- `src/views/categoryView.ts`: neue exportierte Funktion `parseStatInputValue(rawValue, fallback, max?)`, extrahiert aus dem bestehenden `.stat-value`-`change`-Listener (verhaltensgleich, Listener selbst nutzt sie jetzt auch).
- `src/views/spruchmagie.ts`, `src/views/ki.ts`, `src/views/psi.ts`: jeweils `<span class="kampf-pool-value">` durch `<input type="number" class="stat-value kampf-taw-input">` ersetzt (Disabled-Zustand: `!unlocked && currentValue <= 0`), neue `change`-Listener nutzen `parseStatInputValue`.
- **Im Browser verifiziert:** KI-Tab zeigt 28 editierbare `<input type="number">`-Felder (vorher `<span>`), Wertänderung per direkter Eingabe (nicht nur +/-) funktioniert und wird übernommen.

---

## xlsx-Änderungen im Detail

Datei: `werte 0.8-claude.xlsx`, Sheet "Werte" (Hauptregeltabelle) + Sheet "Artefakt-Basis". Bearbeitet via `openpyxl` (Skript lag in `C:\Users\BRUDER~1\AppData\Local\Temp\claude\...\scratchpad\edit_fernkampf_split.py`, temporär, existiert evtl. nicht mehr) + Neuberechnung via Excel-COM-Automation (`CalculateFullRebuild()`, siehe Memory `reference_xlsx_recalc_windows.md`), danach `python3 scripts/generate_data_ts.py "werte 0.8-claude.xlsx"` zur Regenerierung von `rules.json`/`rules-jsonl/*`.

**Wichtiger Fund während der Bearbeitung:** die im Repo committete `rules.json` war zu diesem Zeitpunkt bereits leicht veraltet gegenüber der live-xlsx (z.B. existierte `talente_mit_zwei_pistolen_schiessen` in der xlsx gar nicht mehr — vermutlich bereits vom Nutzer oder einem parallelen Prozess entfernt, bevor diese Session begann). Das Bearbeitungsskript sucht deshalb Zeilen per Referenz-Text-Scan, nicht per fester `sourceRow`-Nummer (robuster).

**Sheet "Werte" — Umbenennungen (bestehende Zeilen):**
- `fk_basis_spez_schusswaffen_armbrust` → `fk_basis_spez_schusswaffen_armbrueste` (Referenz umbenannt, Formel unverändert)
- `fk_gute_spez_schusswaffen_armbrust` → `fk_gute_spez_schusswaffen_armbrueste` (Referenz + interne Formel-Referenz auf die Basis-Zeile umbenannt)
- `fk_meisterlich_spez_schusswaffen_armbrust` → `fk_meisterlich_spez_schusswaffen_armbrueste` (dito)
- `fk_spez_schusswaffen_musketen` → `fk_spez_feuerwaffen_musketen`, Parent `fk_schusswaffen` → `fk_feuerwaffen`
- `fk_spez_schusswaffen_pistolen` → `fk_spez_feuerwaffen_pistolen`, Parent `fk_schusswaffen` → `fk_feuerwaffen`
- `fk_basis_spez_schusswaffen_musketen` → `fk_basis_spez_feuerwaffen_musketen` (Referenz + Formel-Text: `fk_schusswaffen`→`fk_feuerwaffen`, `fk_spez_schusswaffen_musketen`→`fk_spez_feuerwaffen_musketen`)
- `fk_basis_spez_schusswaffen_pistolen` → `fk_basis_spez_feuerwaffen_pistolen` (analog)
- `fk_gute_spez_schusswaffen_musketen` → `fk_gute_spez_feuerwaffen_musketen` (Referenz + interne Formel-Referenz)
- `fk_gute_spez_schusswaffen_pistolen` → `fk_gute_spez_feuerwaffen_pistolen` (analog)
- `fk_meisterlich_spez_schusswaffen_musketen` → `fk_meisterlich_spez_feuerwaffen_musketen` (analog)
- `fk_meisterlich_spez_schusswaffen_pistolen` → `fk_meisterlich_spez_feuerwaffen_pistolen` (analog)

**Unverändert gelassen:** `fk_schusswaffen` (Wert, `wert*18`, Beschreibung bleibt "Schusswaffen"), `fk_basis_schusswaffen`, `fk_gute_schusswaffen`, `fk_meisterlich_schusswaffen`, `fk_spez_schusswaffen_armbrueste` (Wert-Zeile, war schon Plural).

**Sheet "Werte" — neue Zeilen angehängt (5 Stück, am Ende des Sheets):**
1. `fk_feuerwaffen` — Kategorie "Fernkampf", Beschreibung "Feuerwaffen", Art "Wert", Kosten `wert*18`
2. `fk_basis_feuerwaffen` — Art "Formel", Formel `(eig_g_sinneschaerfe+eig_k_geschicklichkeit+fk_feuerwaffen)/4`
3. `fk_gute_feuerwaffen` — Art "Formel", Formel `WENN(talente_fernkampfgeschick_stufe_2>0;1+AUFRUNDEN(fk_basis_feuerwaffen/3;0);WENN(talente_fernkampfgeschick_stufe_1>0;1+AUFRUNDEN(fk_basis_feuerwaffen/4;0);1))`
4. `fk_meisterlich_feuerwaffen` — Art "Formel", Formel `WENN(talente_fernkampfgeschick_stufe_3>0;21+AUFRUNDEN(fk_basis_feuerwaffen/20;0);21)`
5. `talente_kampffertigkeit_erhoehen_feuerwaffen` — Kategorie "Talente", Beschreibung "Kampffertigkeit erhöhen: Feuerwaffen", Parent "Krieger", Art "Auswahl", Kosten "2", Wirkung "Erhöht das Maximum der Kampffertigkeit um 6 Punkte."

(sourceRow dieser 5 neuen Zeilen war zum Zeitpunkt der Bearbeitung 1976–1980, kann sich bei künftigen xlsx-Änderungen verschieben — sourceRow wird bei jeder Regenerierung frisch aus der Zeilenposition abgeleitet, ist kein stabiler Fremdschlüssel.)

**Sheet "Artefakt-Basis" — Datenkorrektur:**
- `artefakt_whk_talentwert_erhoehen`: Spalte "Wirkung-Einheit" von "TaP" auf "TaW" geändert
- `artefakt_grundfertigkeit_erhoehen`: Spalte "Wirkung-Einheit" von "TaP" auf "TaW" geändert

**Duplikat-Talent `talente_mit_zwei_pistolen_schiessen`:** existierte bereits VOR Beginn dieser Session nicht mehr in der xlsx (nicht meine Änderung, war schon weg — vermutlich Teil der vorbestehenden ungesicherten Änderungen, die `git status` schon zu Sessionbeginn als "M werte 0.8-claude.xlsx" zeigte). Wichtig für die neue Session: `origin/main`s Commit `2458a10` hat diese Dopplung ebenfalls entfernt, ABER zusätzlich mit einer echten Migration in `characterStore.ts` (siehe unten) — die lokale xlsx hat nur die Zeile entfernt, ohne Migration.

**Nach der xlsx-Bearbeitung ausgeführt:**
```powershell
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false; $excel.DisplayAlerts = $false
$wb = $excel.Workbooks.Open($path)
$excel.CalculateFullRebuild()
$wb.Save(); $wb.Close($true)
$excel.Quit()
```
Danach `python3 scripts/generate_data_ts.py "werte 0.8-claude.xlsx"` — Ergebnis: 1360 Regeln, keine Formelfehler (`#VALUE!` etc.) in einem Vollscan aller Sheets.

---

## Isolierte Punkte 5, 9, 14 — NICHT im Commit, für neue Session

Diese drei wurden aus dem fertig implementierten Stand wieder **herausgenommen** (Code-Änderungen rückgängig gemacht), weil `origin/main` dafür während der letzten Woche eigene Lösungen bekommen hat. Die Rücknahme wurde chirurgisch per Edit gemacht (nicht per `git checkout`), betraf:
- `src/engine/waffenSchaden.ts`: `formatFeuerwaffenWuerfel`-Funktion entfernt (war Punkt-9-Fix)
- `src/views/kampf.ts`: `buildFeuerwaffenRows`s `schaden`-Zeile zurück auf `basis['1.W'] ?? '–'`, Import bereinigt
- `src/views/categoryView.ts`: `whkSskMaxValue`-Funktion entfernt, Call-Site zurück auf `undefined` (war Punkt-5-Fix)
- `src/data/talenteKampfmodul.ts`: zurück auf Original-Zustand (Liste enthält wieder `talente_mit_zwei_pistolen_schiessen`, nicht `talente_beidhaendig_pistolenschiessen`) — war Punkt-14-Fix

**Explizite Nutzer-Anweisung für die neue Session (wörtlich, unbedingt so umsetzen):**

> 14 origin beibehalten
> 9 origin beibehalten, aber prüfen, ob da beide W gezeigt werden
> 5 nur den Stufe 4 cap bug beheben

Konkret heißt das:

### Punkt 14 — origin beibehalten, nichts tun
`origin/main`-Commit `2458a10` "Beidhändiges Pistolenschießen zusammenführen" (Sat Aug 1 19:28:35 2026) macht:
- `talenteKampfmodul.ts`: `talente_mit_zwei_pistolen_schiessen` raus, `talente_beidhaendig_pistolenschiessen` rein (identisch zu meinem ursprünglichen Fix)
- `waffenLoadout.ts`: `pistolenschiessenTalente()` prüft BEIDE Referenzen (`talente_mit_zwei_pistolen_schiessen` ODER `talente_beidhaendig_pistolenschiessen`) für das `beidhaendig`-Flag — Abwärtskompatibilität für Charaktere, die noch die alte Referenz gewählt hatten
- `characterStore.ts`, `loadCharacter()`: neue Migration — beim Laden wird eine alte Auswahl `talente_mit_zwei_pistolen_schiessen` automatisch auf `talente_beidhaendig_pistolenschiessen` übertragen (`migratedSelections[canonical] = Math.max(...)`)
- `werte 0.8-claude.xlsx`: Duplikat-Zeile entfernt (Bin-Diff 479528→479589 bytes)
- Tests in `waffenLoadout.test.ts`, neuer Test in `characterStore.test.ts`

**Das ist strikt besser als mein ursprünglicher Fix** (der hatte keine Migration für Bestandscharaktere). Einfach übernehmen, nichts eigenes bauen.

### Punkt 9 — origin beibehalten, aber verifizieren
`origin/main`-Commit `266c832` "Kombiniere Fernkampf-Schadenswürfel" (Sat Aug 1 18:12:38 2026) macht:
- `waffenSchaden.ts`: neue Funktion `combineDiceNotations(...notations)` — kombiniert additive Würfel-Notationen, normalisiert Schreibweise (`W6+W6`→`2W6`, `1W10`→`W10`). Allgemeiner als mein `formatFeuerwaffenWuerfel` (der nur simple String-Konkatenation machte).
- `formatSchadenswuerfel` nutzt jetzt `combineDiceNotations` intern.
- `kampf.ts`, `buildFeuerwaffenRows`: `schaden`-Feld nutzt jetzt `combineDiceNotations(basis['1.W'])` statt `basis['1.W'] ?? '–'` — **ACHTUNG: das kombiniert hier nur EIN Argument (`1.W`), nicht auch `2.W`!** Das war der ursprüngliche Bugreport ("FK Waffen: Beide Schadenswürfel anzeigen") — unklar aus dem reinen Diff, ob das ein Versehen ist oder ob `2.W` in diesem (auf `origin/main` bereits stark umgebauten) `buildFeuerwaffenRows` anderweitig einfließt.
- `kampf.ts`, `buildArmbrustBoegenRows`: nutzt `combineDiceNotations(basis.fernkampfWuerfel, ammoSnapshot.wuerfel)` — hier werden tatsächlich zwei Quellen kombiniert (Waffe + Munition), aber das ist eine andere Zeile als die Feuerwaffen-Zeile.
- **Wichtig:** `kampf.ts`s `buildFeuerwaffenRows` hat auf `origin/main` bereits ein GRUNDLEGEND ANDERES Datenmodell als der lokale Stand (neue Felder `rangedUsable`, `invalidReason`, `requiredTypeId` — eine Munitions-Kompatibilitätsprüfung, die es hier lokal noch gar nicht gibt). Nach dem Pull/Merge muss dieser Bereich ohnehin neu gelesen werden.

**Zu tun in der neuen Session:** nach dem Merge/Pull im Browser (oder per Code-Lektüre) konkret nachschauen, ob bei einer Feuerwaffe mit befülltem `2.W` (z.B. Hakenbüchse, `1.W=W12`, `2.W=W10`) tatsächlich beide Würfel angezeigt werden. Falls nicht: `combineDiceNotations(basis['1.W'], basis['2.W'])` (zwei Argumente statt einem) an der entsprechenden Stelle nachziehen — vermutlich ein einfacher Nachtrag, kein Neubau, da `combineDiceNotations` bereits variadic ist.

### Punkt 5 — NEU umsetzen (origin hat hierfür keinen Fix)
`origin/main`-Commit `3691683` "Charakterkonformität und SSK-Gruppierung ergänzen" behebt NICHT den Stufe-4-Bug — er fügt eine charakterweite Validierungsliste (`CharacterValidationIssue[]`, Budget-/Pool-Überzüge, SSK-Mindest-SP, SSK-Sprachminimum) und eine SSK-Gruppierung nach Volk (`renderSskGroups`/`SSK_VOLKS_GRUPPEN`) in `categoryView.ts` hinzu — beides eigenständige, andere Features. Der eigentliche Bug bleibt: SSK-Zeilen (`referenz` startet mit `ssk_`) haben kein `maxValue`-Cap, obwohl die Kosten-Lookup-Tabellen (`Sprachstufe-Kosten`/`Kulturstufe-Kosten` in `lookups.json`) nur Werte 0–4 kennen — ein Klick über Stufe 4 hinaus lässt die SVERWEIS-Exact-Match-Lookup werfen.

**Zu tun:** NUR diesen einen Bug fixen, nicht mehr (Nutzer-Anweisung: "nur den Stufe 4 cap bug beheben" — die Charakterkonformitäts-/SSK-Gruppierungs-Features von `origin/main` NICHT anfassen/erweitern). Nachdem `categoryView.ts` durch den Merge ohnehin neu aussieht (SSK-Gruppierung ist jetzt Teil davon), muss die exakte Stelle neu gesucht werden — ungefähres Muster (Stand vor der Rücknahme, als Orientierung):
```ts
function whkSskMaxValue(referenz: string): number | undefined {
  return referenz.startsWith('ssk_') ? 4 : undefined;
}
```
und Einsatz an der Stelle, wo SSK-Zeilen (flach, kein `parent`) durch `renderEditableRow(..., maxValue, ...)` gerendert werden. Nach dem Merge prüfen, ob `renderSskGroups` (neu von origin) diese Zeilen jetzt anders rendert als vorher — falls ja, das Cap dort entsprechend integrieren, nicht die alte Codestelle blind wiederherstellen.

---

## Aktueller Git-Zustand (exakt, Stand Sessionende)

```
* main (lokal)    5241aaa [origin/main: ahead 1, behind 40]  "Fehler-/Feature-Batch: ..."
  origin/main      4e26e90  "Pool-Zuteilung nach Grenzänderung entsperren" (Sat Aug 1 23:26:59 2026)
  merge-base       29e635c  "Implement X-Klinge weapon enchantments" (2026-07-24 22:15:30) — letzter lokal bekannter Commit vor dieser Session
```

`main` wurde NICHT gepusht. Es gibt keinen Remote-Branch für den lokalen Fortschritt.

Zwei weitere lokale Branches (unverändert, nicht Teil dieser Session): `codex/firearm-ammo-purchases` (folgt `origin/codex/firearm-ammo-purchases`), `codex/kampf-pp-draft-confirm` (6 Commits vor seinem eigenen Remote-Tracking-Branch — ebenfalls unabhängig).

**Alle 40 Commits auf `origin/main` seit dem merge-base** (neueste zuerst, zur Übersicht — Details nur für die drei oben besprochenen bereits recherchiert, der Rest ist ungeprüft):
```
4e26e90 Pool-Zuteilung nach Grenzänderung entsperren
f3f412e Loadout-Poolwerte handweise projizieren
86aa730 Loadouts um Einzelwaffen und Handspalten erweitern
02f643c Merge remote-tracking branch 'origin/main' into codex/kampf-pp-draft-confirm
2458a10 Beidhändiges Pistolenschießen zusammenführen                    ← Punkt 14
d8caeb0 Merge pull request #4 from njebich/codex/kampf-pp-draft-confirm
92ae9e8 Besitz nach Herkunft und Rüstungslagen gliedern
3691683 Charakterkonformität und SSK-Gruppierung ergänzen               ← Punkt 5 (kein Fix, andere Features)
f3c6e0f Talentauswahl vollständig anzeigen
b4ec56b Trenne Nah- und Fernkampf-Loadouts
e66d0cd Preserve inventory category and scroll state
266c832 Kombiniere Fernkampf-Schadenswürfel                             ← Punkt 9
c519838 Artefakt-Tooltips gradabhängig berechnen
f96b12d Merge remote-tracking branch 'origin/main' into codex/kampf-pp-draft-confirm
03593ba Inventar- und Waffenanzeige verbessern
0bf0ff9 Merge pull request #3 from njebich/codex/kampf-pp-draft-confirm
9fc1ee1 feat: Zahlenfeld-Layout und Arbeitsartefakte finalisieren
71150b2 test: finalize tab navigation integration
7a56421 feat: add read-only character sheet tabs
714b68a Magie-Arbeitsbereich absichern
75b2f8c Inventar in Besitz und Kaufbereiche trennen
5c9087d feat: Kampfbereich um LE-RS-Zustandsanzeige erweitern
6398ed4 docs: Tab-Umstrukturierungsplan festhalten
17a9434 feat: Charakterwerte-Bereiche zusammenfuehren
ee1633e feat: Grunddaten in Charakternavigation verschieben
68b7fbd feat: zweistufiges Navigationsgerüst einführen
e140660 Merge remote-tracking branch 'origin/main' into codex/kampf-pp-draft-confirm
7a840bd Basis-SP und SSK-Mindestinvestition anpassen
8504fd6 Regelrelationen als Mermaid-Diagramme dokumentieren
0cde9a8 Eigenschaftswerte trotz Grenzwarnung editierbar
b7b22a5 SP/TP-Bezeichnungen korrigieren
f815035 Merge Spruchmagie-Kostenkorrektur
24baed9 Spruchmagie-Kosten nach Zaubergrad berechnen
e789cd9 Merge pull request #2 from njebich/codex/kampf-pp-draft-confirm
fae9096 Fix weapon specialization sheet performance
4065b46 Show latest push time
0239211 Refactor weapon catalog lookups
8de3329 Optimize Kampf inventory and specialization lookups
719b2c7 Merge pull request #1 from njebich/codex/kampf-pp-draft-confirm
d25d54a Add draft confirmation for Kampf PP allocation
```

**Bereits geprüft:** `24baed9 Spruchmagie-Kosten nach Zaubergrad berechnen` UND `b7b22a5 SP/TP-Bezeichnungen korrigieren` klingen möglicherweise ebenfalls tangential zu Spruchmagie-Arbeiten dieser Session — NICHT inhaltlich geprüft, nur der Name auffällig. In der neuen Session beim Merge-Konflikt in `spruchmagie.ts` besonders aufmerksam prüfen, ob dort weitere Überschneidungen mit dem hier gemachten RW-Feature (Punkt 11) bestehen.

**Mehrere `feat:`/`test:`-Commits (Zahlenfeld-Layout, Tab-Navigation, zweistufiges Navigationsgerüst, Charakterwerte-Bereiche) deuten auf einen größeren UI-Umbau von `main.ts`/Tab-Struktur hin** — das erklärt vermutlich auch, warum der Merge-Versuch `main.ts` als Konfliktdatei zeigte. Vor dem Mergen unbedingt anschauen, was sich an der Tab-/Navigationsstruktur geändert hat, bevor man versucht, `handleWhkCustomChange`/`handleBuyArtefakt`-Änderungen dort wieder einzufügen.

---

## Merge-Versuch: Ergebnis (abgebrochen, dokumentiert für die neue Session)

Befehl: `git fetch origin main && git merge --no-commit --no-ff origin/main`, danach `git merge --abort` (sauber zurückgesetzt, nichts im Arbeitsbaum verändert).

**Konfliktdateien (Content-Konflikt, außer wo anders markiert):**
- `src/data/equipment/artefakte.json`
- `src/data/rules.json`
- `src/engine/characterSheet.ts`
- `src/engine/characterSheet.test.ts` (auto-merged, kein Konflikt — nur zur Vollständigkeit, da in der Liste)
- `src/engine/waffenLoadout.ts`
- `src/engine/waffenLoadout.test.ts`
- `src/engine/waffenSchaden.ts`
- `src/engine/waffenSchaden.test.ts` — **Add/Add-Konflikt**: beide Seiten haben unabhängig eine neue Datei mit exakt diesem Namen angelegt (meine: `ceilAwayFromZero`-Tests; origin/main vermutlich `combineDiceNotations`-Tests aus Commit `266c832`) — muss von Hand zusammengeführt werden, nicht nur "eine Seite gewinnt".
- `src/main.ts`
- `src/views/ausruestung.ts`
- `src/views/categoryView.ts`
- `src/views/ki.ts`
- `src/views/psi.ts`
- `src/views/spruchmagie.ts`
- `werte 0.8-claude.xlsx` — **Binärkonflikt**, nicht automatisch auflösbar. Muss manuell entschieden werden: entweder `origin/main`s xlsx-Stand nehmen und den Schusswaffen-Split (Punkte 1-3) NEU auf diesen Stand aufsetzen, oder umgekehrt — **das ist die wichtigste Einzelentscheidung für die neue Session**, siehe unten.

**Sauber automatisch gemerged (keine Konflikte):** `src/data/rules-jsonl/_index.json`, `src/data/rules-jsonl/talente.jsonl`, `src/state/characterMutations.ts`, `src/state/characterStore.ts`, `src/views/kampf.ts`.

---

## xlsx-Binärkonflikt — wichtigste Einzelentscheidung für die neue Session

Da `werte 0.8-claude.xlsx` ein Binärformat ist, kann Git es nicht automatisch mergen. Zwei Stände existieren parallel:
- **Lokal** (dieser Session): Schusswaffen-Split (Punkte 1-3, `fk_feuerwaffen` neu, Armbrust-Formelzeilen umbenannt) + Artefakt-`wirkungEinheit`-Korrektur (Punkt 6-Datenfehler).
- **`origin/main`**: mindestens die Entfernung von `talente_mit_zwei_pistolen_schiessen` (Commit `2458a10`) + vermutlich weitere, ungeprüfte Änderungen aus den übrigen ~39 Commits (z.B. könnte "Spruchmagie-Kosten nach Zaubergrad berechnen" ebenfalls die xlsx berühren).

**Empfehlung für die neue Session:** NICHT versuchen, die xlsx-Bytes zu mergen. Stattdessen:
1. `origin/main`s xlsx-Stand übernehmen (`git checkout --ours` bzw. `--theirs` je nach Merge-Richtung, oder schlicht die Datei von `origin/main` nehmen).
2. Den Schusswaffen-Split (Punkte 1-3) und die `wirkungEinheit`-Korrektur (Punkt-6-Datenfehler) auf diesem NEUEN xlsx-Stand NEU durchführen (das Bearbeitungsverfahren ist oben unter "xlsx-Änderungen im Detail" vollständig dokumentiert und reproduzierbar — die Zeilen-Suche läuft über Referenz-Text-Scan, ist also robust gegen zwischenzeitliche Zeilenverschiebungen).
3. Danach `scripts/generate_data_ts.py` erneut laufen lassen.

Grund für diese Empfehlung: `origin/main` repräsentiert eine Woche aktiver, vermutlich vom Nutzer selbst gegengeprüfter Weiterentwicklung — im Zweifel hat dieser Stand Vorrang, und die eigene xlsx-Arbeit ist klein/lokal genug, um sauber reproduziert zu werden.

---

## Nächste Schritte für die neue Session (Reihenfolge)

1. **Diese Datei vollständig lesen** (erledigt, wenn du das hier liest).
2. `git fetch origin main` (aktuellen Stand holen, evtl. gibt es seit dieser Session weitere neue Commits).
3. Entscheiden und mit dem Nutzer kurz bestätigen: Merge-Strategie für den xlsx-Binärkonflikt (Empfehlung siehe oben: `origin/main`-Stand übernehmen, lokale xlsx-Arbeit neu draufsetzen).
4. Merge durchführen (`git merge origin/main`), Konflikte einzeln durchgehen:
   - `waffenSchaden.test.ts` (Add/Add): beide Testsuiten zusammenführen (meine `ceilAwayFromZero`-Tests + origin's `combineDiceNotations`-Tests bleiben beide erhalten).
   - `waffenSchaden.ts`, `waffenLoadout.ts`: eigene `ceilAwayFromZero`-Änderungen (Punkt 8, bereits fertig und verifiziert) mit origin's `combineDiceNotations` (Punkt 9) zusammenführen — beide sind unabhängige, additive Funktionen in derselben Datei, sollten beide behalten werden.
   - `characterSheet.ts`, `characterSheet.test.ts`: eigene `customWhkHauptfertigkeiten`/`customWhkSpezialisierungen`-Erweiterung (Punkt 4) mit origin's `CharacterValidationIssue`/`validationIssues` (aus Commit `3691683`) zusammenführen — beide sind unabhängige Erweiterungen von `ComputedSheet`.
   - `categoryView.ts`: eigene WHK-Sortierung/Suche/Freitext (Punkte 4a-4c) mit origin's `renderSskGroups`/SSK-Volksgruppierung zusammenführen. **Danach Punkt 5 (SSK Stufe-4-Cap) hier neu einbauen**, siehe Abschnitt oben.
   - `main.ts`: eigene `handleWhkCustomChange` mit origin's Tab-/Navigations-Umbau zusammenführen (mehrere `feat:`-Commits deuten auf strukturelle Änderungen hin, siehe oben).
   - `ausruestung.ts`: eigenes Artefakt-Dropdown (Punkt 6) mit origin's "Inventar- und Waffenanzeige verbessern"/"Besitz nach Herkunft und Rüstungslagen gliedern" zusammenführen.
   - `ki.ts`, `psi.ts`: vermutlich einfach — eigene TaW-Input-Änderung (Punkt 12), unklar was origin hier geändert hat, prüfen.
   - `spruchmagie.ts`: eigenes RW-Feature (Punkt 11) mit origin's "Spruchmagie-Kosten nach Zaubergrad berechnen"/"SP/TP-Bezeichnungen korrigieren" zusammenführen — VORSICHTIG prüfen, ob origin bereits eigene RW- oder Kosten-Änderungen an denselben Zeilen gemacht hat.
   - `artefakte.json`, `rules.json`: nach dem xlsx-Rebuild (Schritt 3-Entscheidung) sollten diese sich aus der Neugenerierung ergeben, nicht von Hand mergen.
5. Nach dem Merge: `npx tsc --noEmit`, `npm run build`, volle Testsuite laufen lassen (siehe Umgebungs-Hinweis unten zu Timeouts).
6. Punkt 9 im Browser verifizieren (beide Würfel bei Feuerwaffen mit `2.W`), bei Bedarf `combineDiceNotations(basis['1.W'], basis['2.W'])` nachziehen.
7. Punkt 5 (SSK-Cap) frisch implementieren und verifizieren (Klick über Stufe 4 hinaus darf keinen Fehler mehr werfen).
8. Erst dann committen und pushen — vorher mit dem Nutzer kurz den Merge-Commit-Inhalt gegenchecken, bevor gepusht wird (großer, komplexer Merge).

---

## Umgebungs-Hinweise (aus dieser Session gelernt)

- **Vitest ist in dieser Windows-Sandbox extrem langsam unter Last:** einzelne, an sich triviale Tests brauchen 12-45 Sekunden, wenn mehrere Testläufe/Prozesse gleichzeitig laufen (z.B. paralleler `tsc`-Lauf oder ein zweiter `vitest`-Prozess). Der volle Suite-Lauf (425 Tests) brauchte ~15 Minuten und zeigte dabei 26 "Timeout"-Fehlschläge — bei Einzel-Isolation mit höherem Timeout (`--testTimeout=60000` bis `120000`) liefen ALLE am Ende grün durch. Nicht in eine Sleep-Poll-Schleife verfallen — Hintergrundprozesse starten, auf Task-Notification warten, bei Timeout-Fehlschlägen die betroffenen Tests isoliert mit größerem Timeout erneut laufen lassen, bevor man einen echten Bug vermutet.
- **`npm run dev`/Browser-Pane:** Charakter-Testdaten werden in `localStorage` gehalten, überleben einen Seiten-Reload. Zum Aufräumen nach manuellen Tests: "Löschen"-Button auf der Charakterauswahl nutzen.
- **xlsx-Bearbeitung:** kein LibreOffice hier installiert, Excel-COM-Automation via PowerShell nutzen (Rezept siehe Memory `reference_xlsx_recalc_windows.md` bzw. oben im Abschnitt "xlsx-Änderungen im Detail" wörtlich enthalten). `python3` ist natives Windows-Python — Windows-Pfade verwenden, keine POSIX-Pfade.
- **`sourceRow`** in den generierten Daten ist die tatsächliche Excel-Zeilennummer (nicht eine synthetische ID) — bei künftigen xlsx-Bearbeitungen ist es robuster, Zeilen per Referenz-Text zu suchen statt eine `sourceRow`-Nummer aus einer älteren `rules.json` zu übernehmen (siehe der Fund oben, dass die lokale `rules.json` bereits leicht veraltet war).

---

## Warnungen — was NICHT zu tun ist

- **Nicht** versuchen, die xlsx-Bytes automatisch zu mergen oder zu raten, was in den ungeprüften ~37 übrigen `origin/main`-Commits an der xlsx geändert wurde — im Zweifel nachfragen oder `origin/main`s Stand als Basis nehmen (siehe Empfehlung oben).
- **Nicht** Punkt 13 (Charakterbogen-Spruchmagie/"Grimoire") implementieren, ohne den Nutzer erneut zu fragen — bewusst als eigenständiges künftiges Feature vom Nutzer ausgeklammert.
- **Nicht** bei Punkt 5 die volle `CharacterValidationIssue`/SSK-Gruppierungs-Logik von origin anfassen oder erweitern — Nutzer-Anweisung war explizit "nur den Stufe 4 cap bug beheben".
- **Nicht** `git push --force` auf `main` — dieser Branch hat echten, verteilten Verlauf (`origin/main` wird vermutlich auch von anderen Prozessen/dem Nutzer direkt über GitHub bespielt).
- **Nicht** den lokalen Commit `5241aaa` verwerfen/droppen, ohne vorher zu prüfen, dass sein Inhalt nach dem Merge vollständig erhalten ist (die 11 Punkte sind vollständig durchimplementiert und im Browser verifiziert — nicht nochmal von Null neu bauen, sondern beim Mergen bewusst erhalten).
