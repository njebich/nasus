# Handover — Design-Änderungen UI-Sammlung (2026-08-27)

## Auftrag / Arbeitsweise

Der Nutzer geht Tab für Tab durch die App und sammelt Design-/Layout-Wünsche.
**Regeln für diese Aufgabe:**
- **Nichts am Code ändern**, solange die Sammlung nicht komplett ist.
- Erst wenn **alle Views** durch sind: Wünsche kategorisieren (Layout/CSS, Datenmodell/xlsx,
  Regel-Engine/Wiring, Content/Text, neue Features) und **in einem Rutsch geordnet abarbeiten**.
- Fokus: **PC-/Desktop-Darstellung**. Handy/Tablet ist ein eigenes Thema (siehe R1).

## Fortschritt

**Durchgesprochen:** Charakter (Grunddaten, Gesinnung, Talente, Vor-/Nachteile, Verteilung),
Charakterwerte (Eigenschaft, Attribute, Berechnete Werte, Sonderfertigkeiten, Grundfertigkeiten,
Nahkampf/Fernkampf).

**Noch offen (nächste Session hier weitermachen):**
- Charakterwerte: **WHK**, **SSK**
- **Kampf**-Tab
- **Inventar**: Besitz, Rüstung, Schilde, Waffen, Bögen, Armbrüste, Feuerwaffen, Alchemika,
  Preisliste, Artefakte
- **Magie**: Spruchmagie, KI, PSI, Geweihte
- **Charakterbogen**: Übersicht, Spruchmagie, Grimoire, KI, PSI, Geweihte, Inventar

---

## Gesammelte Punkte

### 1. Charakter › Grunddaten
- clean, keine Änderung.

### 2. Charakter › Gesinnung
- Legende der 8er-Abstufung ist **gedoppelt**: `0. 0= Neutral…` → soll nur `0= Neutral…` sein.
  Gilt für **alle 8 Abstufungen**. (Datei: `src/views/gesinnung.ts`)

### 3. Charakter › Talente
- Oberflächlich clean.
- TODO Abarbeitung: prüfen, ob **alle** Talente einen **Wirkungstext** haben.
- TODO Abarbeitung: prüfen, ob alle **charaktererschaffungsrelevanten** Talente **wired** sind.

### 4. Charakter › Vor- und Nachteile
- Wirkt clean, aber:
- TODO: prüfen, ob alles (**nur charaktererschaffungsrelevant**) wired ist.
- TODO: prüfen, ob alles einen **Wirkungstext** hat.
- **Bug „Kind der Fröhlichkeit"**: Checkbox darf disabled/ausgegraut bleiben (automatischer
  Vorteil für jeden SC), aber **Name + Wirkungstext dürfen NICHT ausgegraut** sein — normale
  Textfarbe, damit lesbar. (Screenshot lag vor: aktuell wird der ganze Eintrag inkl.
  Wirkungstext gedimmt.)
- **Generelle Regel dahinter:** bei automatisch gesetzten, nicht abwählbaren Einträgen nur das
  **Control** disablen, nicht den **Inhalt** dimmen.
- Datei: `src/views/talenteVornachteile.ts`

### 5. Charakter › Verteilung
- Tabellen **schmaler** machen.
- **Kreisdiagramm** ergänzen.
- Datei: `src/views/verteilung.ts`

### 6. Charakterwerte › Eigenschaft
- Zeilen-Layout je Eigenschaft bekommt **feste Spalten**:
  `Name (ⓘ)` · `−` · `Wert` · `(Artefaktwert)` · `+` · `SP-Info`
  - Der Artefakt-/Magisch-Wert (z.B. Mut `(38)`) wandert **hinter den `+`-Button** (aktuell
    steht er zwischen Wert und `+`).
  - Diese Artefakt-Spalte ist **in jeder Zeile fest reserviert**, nur leer wenn kein
    Artefakt/Magie-Effekt wirkt → saubere vertikale Flucht über alle Zeilen.
- Spalte **Eig.Bon**: gleiches Box-/Zell-Styling wie die Eigenschaftszeile.
- **Eig.Bon zeigt zwei Werte** (unmagisch / magisch) getrennt, analog zur Eigenschaft selbst
  (31 / 38). Platz für den zweiten (magischen) Wert ist **immer reserviert**, auch ohne
  Magie-Effekt.
- Dateien: `src/views/categoryView.ts` (Eigenschaften-Tab-Renderer, `renderEditableRow` /
  Eigenschaften-Paar-Layout), `src/style.css`

### 7. Charakterwerte › Attribute
- clean, keine Änderung.

### 8. Charakterwerte › Berechnete Werte
- Aktuell nur ein Dump. **Ignorieren, bis ein eigener Plan** dafür existiert.

### 9. Charakterwerte › Sonderfertigkeiten
- Tabelle in **2 Spalten** splitten.
- **Subgruppen intern ebenfalls in 2 Spalten** aufteilen (Ziel: weniger Scrollen).
- Tooltips auf `−`/`+`: **Formel mit Wert** anzeigen statt der SP-Kosten (siehe 11b für die
  genaue Definition).
- Subgruppe **Ladeschütze**: **alle** Einträge anzeigen, auch wenn das zugehörige FK-Talent
  nicht geskillt ist (kein Ausfiltern). Achtung: aktuell filtert `renderLadeschuetzeGroup` über
  `isLadeschuetzeSfVisible` / `ladeschuetzeGating.ts` — dieses Gating für die
  Charaktererschaffungs-Ansicht entfernen bzw. deaktivieren.
- Datei: `src/views/categoryView.ts`

### 10. Charakterwerte › Grundfertigkeiten
- Tabelle in **2 Spalten**.
- Tooltips `−`/`+`: **keine Formelrelevanz → kein Tooltip**; **formelrelevant → Formelwert**
  einblenden (siehe 11b).
- Datei: `src/views/categoryView.ts`

### 11. Charakterwerte › Nahkampf (und Fernkampf analog)
- **Tabellen-Layout ist kaputt** (`renderNahkampfHauptfertigkeitRows` + `renderWaffenBasisCell`):
  eine Riesen-`<table>` mit `rowspan`-Zellen für Hauptfertigkeit/TaW/AT-Basis/PA-Basis über alle
  Spezialisierungs-Zeilen. Spezialisierungs-Spalten kollidieren visuell mit den Basis-Spalten
  (im Screenshot: „31 29" nebeneinander, PA-Basis-Header über der Spezialisierungs-Spalte,
  Stangenwaffen-Zeile ohne Waffe-Label). Fragil bei jeder Zeilenzahl-Differenz.
- **Rework-Richtung** (Nutzer: „hauptsache nicht behindert", Spalten-vs-Chip egal):
  weg von der einen Riesentabelle → **eine Karte pro Hauptfertigkeit**:
  - Hauptfertigkeit-Zeile: TaW-Stepper + **AT-Basis / PA-Basis als Wert-Chips** rechts (sie
    gehören zur Hauptfertigkeit, nicht zur Spezialisierung).
  - Spezialisierungen: schlichte **2-Spalten-Liste** (Name | Stepper+Kosten), gemeinsames
    TaW-Spaltenraster, **kein `rowspan`**.
  - „Spezialisierungen verfügbar, sobald TaW > 0" bleibt als Hinweiszeile im Block.
  - **Fernkampf** identisch, zusätzlich **FKS-Basis-Spalte pro Spezialisierungszeile** (die ist
    wirklich pro-Spez) + **g/m-Werte** an den Basis-Chips.
  - Optional 2 Karten nebeneinander, wenn Platz.
- Datei: `src/views/categoryView.ts`

### 11b. `−`/`+` Tooltips — Definition „Formelwert anzeigen"
Gilt für Sonderfertigkeiten, Grundfertigkeiten, Eigenschaft, Attribut, Nahkampf, Fernkampf,
WHK, SSK (Ausnahmen beim Abarbeiten klären, falls welche auffallen).

- **Stufe 1:** Für den Klick alle **abgeleiteten Formeln, die sich tatsächlich ändern**, als
  Zeile `<Formelname>: <alter Wert> → <neuer Wert>`.
  - Wert fließt in **keine** Formel ein → **kein Tooltip**.
  - **SP-Kosten NICHT** im Tooltip (stehen ohnehin sichtbar als `(x SP)` / `xSP/total` in der
    Zeile).
  - Rechnerisch **unveränderte** Formeln (Rundung frisst den Punkt) bei Stufe 1 **rausfiltern**.
- **Stufe 2:** Pro betroffener Formel zusätzlich „**noch n Punkte** bis `<Formelname>` +1" —
  Abstand des aktuellen Inputs zur nächsten Rundungsschwelle der abgeleiteten Formel. Formeln,
  die sich jetzt nicht ändern, hier als „noch n Punkte" statt rausfiltern.
- **Stufe 3 (SP-Effizienz-Empfehlung „billiger Ath statt Mut zu skillen"): verworfen — too much.**
- Format: immer `alt → neu`, nicht nur der neue Wert.
- **Infra vorhanden:** `computeFormulaImpact(referenz, newWert, impactValues)` in
  `src/engine/formulaImpact.ts`, genutzt von `stepTooltip` / `impactLines` in
  `src/views/categoryView.ts`. Aktuell wird `impactValues` **nur für Eigenschaft/Attribut**
  durchgereicht → für die anderen Kategorien muss es ebenfalls übergeben werden.

---

## Separat / später

### R1. Responsive (Handy / Tablet)
- Eigenständiges Thema, **nicht Teil** dieser PC-Sammelrunde. Später separat betrachten.

---

## Vorläufige Kategorisierung (wird nach kompletter Sammlung finalisiert)

| Kategorie | Punkte |
|---|---|
| Layout / CSS | 5 (Tabellen schmaler), 6 (Eigenschaften-Spaltenraster), 9 (2 Spalten), 10 (2 Spalten), 11 (Nahkampf/Fernkampf-Rework) |
| Neue Features | 5 (Kreisdiagramm), 11b Stufe 1+2 (Formel-Tooltips) |
| Regel-Engine / Wiring | 3 (Talente wiring-Check), 4 (Vor-/Nachteile wiring-Check), 9 (Ladeschütze-Gating aus) |
| Content / Text | 2 (Gesinnung-Legende), 3 (Talente-Wirkungstexte), 4 (Vor-/Nachteile-Wirkungstexte) |
| Bug | 4 (Kind der Fröhlichkeit ausgrauen), 6 (Artefaktwert-Position) |
| Zurückgestellt | 8 (Berechnete Werte), R1 (Responsive) |
