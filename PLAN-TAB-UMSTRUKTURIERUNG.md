# Plan: Umstrukturierung der Tab-Navigation

Stand: 1. August 2026  
Status: fachlich geklärt, noch nicht umgesetzt

## Ziel

Die bisherige flache Navigation wird durch sechs Haupttabs mit kontextabhängigen Untertabs ersetzt. Bestehende Berechnungen, Kaufregeln und Local-Storage-Daten bleiben erhalten. Ansichten unter **Charakterbogen** sind ausschließlich Ausgabe; die entsprechenden Arbeitsansichten bleiben unter **Charakter**, **Charakterwerte**, **Kampf**, **Inventar** und **Magie** editierbar.

## Verbindliche Zielnavigation

1. **Charakterbogen**
   - Übersicht
   - Spruchmagie
   - KI
   - PSI
   - Geweihte
   - Inventar
2. **Charakter**
   - Grunddaten
   - Talente
   - Vor- und Nachteile
3. **Charakterwerte**
   - Eigenschaft
   - Attribute
   - Berechnete Werte
   - Sonderfertigkeiten
   - Grundfertigkeiten
   - Nahkampf
   - Fernkampf
   - WHK
   - SSK
4. **Kampf**
   - keine weitere fachliche Unterteilung erforderlich; der bestehende Kampfbereich bleibt eine zusammenhängende Ansicht
5. **Inventar**
   - Besitz
   - Rüstung
   - Schilde
   - Waffen
   - Bögen
   - Armbrüste
   - Feuerwaffen
   - Alchemika
   - Preisliste
   - Artefakte
6. **Magie**
   - Spruchmagie
   - KI
   - PSI
   - Geweihte

Nach dem Laden eines gewählten Charakters ist **Charakter → Grunddaten** die Standardansicht. Charakterauswahl, Neu-/Löschen-Funktionen und Budgetanzeige bleiben global oberhalb der Navigation.

## Festgelegte fachliche Zuordnungen

- Der bisherige Tab **Charakterwerte** heißt innerhalb des neuen Haupttabs **Berechnete Werte**.
- Die bisherigen Bereiche **Bewegung** und **Gewichtsbelastung** werden in **Berechnete Werte** integriert und nicht mehr separat navigiert.
- **SSK** verwendet weiterhin die bestehende Kategorie **Sprache & Kultur**; nur die sichtbare Tab-Beschriftung ändert sich.
- Der gesamte bestehende Block **Lebensenergie & Rüstungsschutz** wird aus dem Charakterbogen in den Kampfbereich übernommen. Damit erscheinen dort auch Trefferschwelle (TS) und Selbstbeherrschung (SB).
- Der bestehende Abschnitt **Talent-Effekte (Kampfmodul)** bleibt unverändert erhalten.
- Munition bleibt in der jeweiligen Kaufkategorie eingebettet: Pfeile bei Bögen, Bolzen bei Armbrüsten und Feuerwaffenmunition bei Feuerwaffen.
- **Geweihte** wird analog zu den anderen Magiearten sowohl als Arbeitsansicht unter Magie als auch als reine Ausgabe unter Charakterbogen geführt. Die bestehende talentabhängige Sichtbarkeitsregel bleibt erhalten.

## Technische Leitplanken

- Keine Änderung des Regel-Datenbestands oder der Berechnungsformeln, soweit nicht für die neue Zusammenstellung einer Ansicht erforderlich.
- Keine Änderung des Local-Storage-Schemas allein wegen der Navigation.
- Gespeicherte Charaktere müssen ohne Migration weiter funktionieren.
- Gemeinsam verwendete Ausgaben werden aus einer Quelle gerendert; insbesondere darf der LE/RS-Block nicht in zwei voneinander abweichenden Kopien weiterentwickelt werden.
- Haupt- und Untertab-Zustand werden typisiert verwaltet. Eine nicht mehr sichtbare Auswahl fällt kontrolliert auf den ersten zulässigen Untertab zurück.
- Unter **Charakterbogen** gibt es keine Eingaben, Kauf-, Entfernen- oder Steigerungsaktionen.
- Die bestehende SPA-/GitHub-Pages-Architektur bleibt unverändert.

## Umsetzung in getrennten Sessions

### Session 1 – Navigationsgerüst und Routing

**Ziel:** Die neue zweistufige Navigation existiert, ohne die fachlichen Ansichten bereits umzubauen.

Arbeiten:

- In `src/main.ts` das flache `TABS`-Modell durch typisierte Haupt- und Untertabs ersetzen.
- Zwei Navigationsebenen rendern und den aktiven Haupt-/Untertab getrennt speichern.
- Eine zentrale Zuordnung von sichtbarer Beschriftung zu bestehender Regelkategorie beziehungsweise View einführen.
- Standardroute auf **Charakter → Grunddaten** setzen.
- Kontrollierte Fallbacks implementieren, insbesondere beim Ausblenden von **Geweihte**.
- In `src/style.css` Haupt- und Unternavigation visuell eindeutig, responsiv und tastaturbedienbar gestalten.
- Vorübergehend bestehende Views über das neue Routing erreichbar halten.

Abnahme:

- Es werden genau sechs Haupttabs angezeigt.
- Nur die Untertabs des aktiven Haupttabs sind sichtbar.
- Nach Charakterwechsel und bei Sichtbarkeitsänderungen entsteht keine leere Ansicht.
- Ein Reload mit bestehendem Local Storage verursacht keinen Fehler.
- Tests für Routing, Standardauswahl und Geweihten-Fallback sind vorhanden.

Übergabe an Session 2:

- Dokumentieren, welche neuen Tab-Typen und Routing-Helfer eingeführt wurden.
- Noch provisorisch geroutete Untertabs ausdrücklich markieren.

### Session 2 – Charakter und Grunddaten

**Ziel:** Der globale Grunddatenblock wird zur regulären Standardansicht unter Charakter.

Arbeiten:

- Den bisherigen globalen `<details>`-Block **Grunddaten** aus dem Header entfernen.
- `renderCharakterheader` in **Charakter → Grunddaten** einbinden.
- **Talente** und **Vor- und Nachteile** über die bestehenden Auswahl-Renderer unter Charakter einordnen.
- Sicherstellen, dass Bearbeitungen weiterhin gespeichert werden und Religion/Sekte weiterhin die Geweihtenlogik aktualisieren.
- Charakterauswahl, Erstellen/Löschen sowie Budgetleiste global belassen.

Abnahme:

- Grunddaten sind ausschließlich unter **Charakter → Grunddaten** editierbar.
- **Charakter → Grunddaten** ist die Startansicht.
- Talente und Vor-/Nachteile verhalten sich funktional wie zuvor.
- Änderung von Religion, Sekte oder Geweihtentalent aktualisiert die sichtbaren Untertabs korrekt.

Übergabe an Session 3:

- Eventuelle Abhängigkeiten zwischen neuem Routing und vollständigem Neurendern festhalten.

### Session 3 – Charakterwerte zusammenführen

**Ziel:** Alle gewünschten Wertebereiche sind unter Charakterwerte gebündelt.

Arbeiten:

- Bestehende Kategorie-Views über sichtbare Untertabnamen abbilden.
- Den bisherigen Tab **Charakterwerte** als **Berechnete Werte** anzeigen.
- Die Ausgaben aus **Bewegung** und **Gewichtsbelastung** in dieselbe Ansicht integrieren.
- **Sonderfertigkeit**, **Grundfertigkeit** und **Sprache & Kultur** sichtbar als **Sonderfertigkeiten**, **Grundfertigkeiten** und **SSK** beschriften, ohne die internen Kategorienamen zu ändern.
- Reihenfolge exakt gemäß Zielnavigation herstellen.
- Tooltip- und Scroll-Anker-Verhalten nach der Zusammenführung prüfen.

Abnahme:

- Es existieren keine separaten Untertabs für Bewegung oder Gewichtsbelastung.
- Alle bisherigen Werte aus diesen Bereichen sind unter **Berechnete Werte** weiterhin vorhanden.
- Steigerungen, Kosten, Grenzen und Kampf-Pools funktionieren unverändert.
- Kategorie- und Mutationstests laufen weiterhin erfolgreich.

Übergabe an Session 4:

- Festhalten, ob für zusammengesetzte Views ein allgemeiner Wrapper eingeführt wurde, damit der Kampfbereich dasselbe Muster verwenden kann.

### Session 4 – Kampfbereich erweitern

**Ziel:** Der Kampfbereich enthält den vollständigen bestehenden Kampf-Tab plus die gewünschte Zustandsanzeige.

Arbeiten:

- Den LE/RS-Renderer aus `src/views/charakterbogen.ts` in ein gemeinsam nutzbares Modul extrahieren.
- Den identischen Gesamtblock am Anfang des Kampfbereichs einfügen: Trefferzonen, RH, RS, LE, Gesundheit, Trefferschwelle, Selbstbeherrschung, Rüstungshinderlichkeit und RBE.
- Den Charakterbogen weiterhin über denselben gemeinsamen Renderer versorgen.
- Bestehende Kampfsektionen einschließlich Waffen-Loadout, Waffenansichten, Ausweichen/Bewegung und **Talent-Effekte (Kampfmodul)** unverändert anschließen.
- Aufklappzustände und Neurendern nach Pooländerungen prüfen.

Abnahme:

- LE/RS, TS und SB stimmen im Kampfbereich und in der Charakterbogen-Übersicht exakt überein.
- Es gibt nur eine Implementierung der zugrunde liegenden Darstellung.
- Bestehende Kampf- und Charakterbogentests werden um die neue Platzierung ergänzt und bestehen.

Übergabe an Session 5:

- Das Muster für gemeinsam genutzte reine Ausgabe dokumentieren; es wird für Besitz und Charakterbogen-Inventar wiederverwendet.

### Session 5 – Inventar in Besitz und neun Kaufbereiche trennen

**Ziel:** Der bisherige monolithische Ausrüstungsbereich wird über Untertabs erschlossen.

Arbeiten:

- `src/views/ausruestung.ts` so zerlegen, dass jede der neun Kaufkategorien einzeln gerendert und bedient werden kann.
- Bestehende Filter, Suchfelder, Käufe, Verfügbarkeitsprüfungen und Aufklappzustände je Kategorie erhalten.
- Pfeile, Bolzen und Feuerwaffenmunition in ihren festgelegten Kategorien belassen.
- Eine eigenständige, schreibgeschützte Besitzansicht erstellen.
- In Besitz sowohl `character.equipment` als auch die belegten Rüstungsslots anzeigen.
- Aufwandsarme vollständige Snapshot-Anzeige umsetzen: kompakte Hauptzeile und aufklappbarer Detailblock mit sämtlichen tatsächlich gespeicherten Snapshot-, Auswahl-, Mengen- und Preisfeldern. Keine neue Snapshot-Struktur und kein Rückgriff auf aktuelle Katalogwerte zur vermeintlichen Vervollständigung alter Käufe.
- Entfernen, Ausrüsten oder Kaufen ausschließlich in den zuständigen Arbeitsansichten anbieten, nicht in Besitz.

Abnahme:

- **Inventar → Besitz** ist vollständig schreibgeschützt und enthält Ausrüstung sowie Rüstung.
- Jeder gespeicherte Snapshot lässt sich vollständig einsehen.
- Genau neun Kauf-Untertabs sind vorhanden.
- Alle bisherigen Kaufvorgänge funktionieren weiterhin; Munition befindet sich in der richtigen Kategorie.
- Tests decken Besitzdarstellung, Rüstung, Snapshot-Details und das Fehlen mutierender Steuerelemente ab.

Übergabe an Session 6:

- Den exportierten Read-only-Besitzrenderer benennen; Session 7 verwendet ihn im Charakterbogen.

### Session 6 – Magie als gemeinsamer Arbeitsbereich

**Ziel:** Alle vier Magiearten liegen unter einem Haupttab, ihre bestehende Funktion bleibt erhalten.

Arbeiten:

- Spruchmagie, KI und PSI über ihre bestehenden interaktiven Renderer unter **Magie** routen.
- **Geweihte** als vierten Untertab integrieren und die bestehende talentabhängige Sichtbarkeit beibehalten.
- Fällt die Berechtigung für Geweihte während der Anzeige weg, auf den ersten sichtbaren Magie-Untertab wechseln.
- Such-, Aufklapp-, Steigerungs- und Auswahlzustände der Magieansichten beim Wechsel prüfen.

Abnahme:

- Die bisherigen vier Top-Level-Tabs existieren nicht mehr.
- Alle Funktionen der drei steigerbaren Magieansichten sind unter Magie erreichbar.
- Geweihte erscheint nur bei erfülltem Gate und zeigt dieselben Daten wie zuvor.
- Relevante Magie- und Geweihtentests bestehen.

Übergabe an Session 7:

- Dokumentieren, welche Teile der Magie-Renderer Eingabesteuerung erzeugen und für reine Ausgabe ausgeblendet oder separat gerendert werden müssen.

### Session 7 – Charakterbogen-Untertabs als reine Ausgabe

**Ziel:** Der Charakterbogen wird zu einer Sammlung ausschließlich schreibgeschützter Blätter.

Arbeiten:

- Die bisherige Charakterbogenansicht unter **Übersicht** einordnen.
- Für Spruchmagie, KI und PSI Read-only-Varianten der bestehenden Darstellung bereitstellen. Berechnete Werte, bekannte Fähigkeiten/Zauber, Regeltexte und Gruppierung bleiben sichtbar; Eingaben sowie `+`/`−`-Steuerungen entfallen.
- Geweihte analog als Read-only-Untertab einordnen und auch hier das bestehende Gate anwenden.
- Den in Session 5 erstellten Besitzrenderer unter **Charakterbogen → Inventar** wiederverwenden.
- Sicherstellen, dass keine Read-only-Ansicht versehentlich Mutationscallbacks bindet.

Abnahme:

- Alle sechs Charakterbogen-Untertabs sind reine Ausgabe.
- Spruchmagie, KI, PSI und Geweihte zeigen dieselben aktuellen Charakterwerte wie ihre Arbeitsansichten.
- Inventar ist in beiden Einordnungen identisch und enthält Rüstung.
- Es gibt unter Charakterbogen keine Inputs, Kauf-, Entfernen-, Steigerungs- oder Auswahlbuttons.
- Geweihte wird bei fehlendem Gate in beiden Hauptbereichen konsistent ausgeblendet.

Übergabe an Session 8:

- Bekannte kleinere Darstellungsabweichungen oder noch fehlende Tests sammeln; keine neuen Funktionen beginnen.

### Session 8 – Integration, visuelle Prüfung und Bereinigung

**Ziel:** Die Gesamtumstellung wird regressionssicher abgeschlossen.

Arbeiten:

- Alte flache Tab-Konstanten, tote Routingzweige, nicht mehr verwendete Zustände und überholte CSS-Regeln entfernen.
- Navigation bei schmalem und breitem Fenster visuell prüfen; die Untertabs dürfen die Hauptnavigation nicht unkenntlich machen.
- Tastaturbedienung, sichtbarer aktiver Zustand und sinnvolle ARIA-Kennzeichnung prüfen.
- Charakterwechsel, Neuanlage, Löschen, Reload und Gate-Änderungen über mehrere Haupttabs testen.
- Bestehende Charaktere mit umfangreicher Ausrüstung, Magie und Geweihtenstatus manuell prüfen.
- Gesamte Test-, Typprüfungs- und Build-Pipeline ausführen.

Abnahme:

- `npm test` besteht.
- `npm run build` besteht.
- Keine alte Top-Level-Navigation oder leere Route ist mehr erreichbar.
- Kein bestehender Charakterdatensatz musste migriert oder zurückgesetzt werden.
- Die Zielnavigation und sämtliche fachlichen Entscheidungen dieses Plans sind vollständig umgesetzt.

## Sessionübergreifende Arbeitsregel

Jede Session beginnt mit dem Lesen dieses Plans und der Übergabe der vorherigen Session. Sie endet erst nach den für die Session genannten Tests. Die Abschlussnotiz enthält:

1. umgesetzte Punkte,
2. geänderte zentrale Dateien,
3. ausgeführte Tests und Ergebnis,
4. bekannte Restpunkte,
5. konkrete Hinweise für die Folgesession.

Eine Session soll keine späteren fachlichen Schritte vorziehen, außer eine kleine vorbereitende Extraktion ist notwendig, um Duplizierung zu vermeiden.

## Nicht Bestandteil dieser Umstrukturierung

- neue Kampfregeln oder automatische Auswertung der Talent-Effekte,
- neue Ausrüstungs- oder Magiedaten,
- ein neues Persistenz- oder Snapshot-Schema,
- Serverfunktionen, Synchronisierung oder Benutzerkonten,
- inhaltliche Neugestaltung des eigentlichen Charakterbogens außerhalb der neuen Untertab-Struktur.
