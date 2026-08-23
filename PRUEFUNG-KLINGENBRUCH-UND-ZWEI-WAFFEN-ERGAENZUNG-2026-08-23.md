# Prüfung der Ergänzung zu Klingenbruch und Kampf mit zwei Waffen

Stand: 23. August 2026

Geprüfte Referenz: `klingenbruchundkampfmitzweiwaffenergaenzung.md`

## 1. Verbindlicher Anwendungsscope

Die Anwendung dient ausschließlich:

- der Erfassung steigerbarer Werte,
- der Berechnung und Ausgabe abgeleiteter Werte,
- der Inventarverwaltung,
- der Ausgabe des Charakterbogens.

Eine Kampfsimulation oder automatische Regelabwicklung gehört nicht zum Scope. Regeln werden nur umgesetzt, wenn sie einen Wert bestimmen, die Gültigkeit einer Auswahl betreffen, zum Inventar gehören oder auf dem Charakterbogen beziehungsweise in einem Beschreibungstext ausgegeben werden müssen.

## 2. Relevante Inhalte der Ergänzung

### 2.1 Inventarwerte

Für Waffen und Schilde sind weiterhin diese Werte relevant:

- `WK`: Waffenklasse,
- `KB`: Klingenbruchwert,
- `KS`: Klingenstabilität.

Diese Werte werden bereits bei der Ausrüstungserfassung zusammengesetzt und in den Inventar-Snapshots geführt. Die App berücksichtigt dabei ihre vorhandenen Bestandteile. Bei Waffen sind das neben Basis und Material auch Fertigung und gegebenenfalls Anpassung; bei Schilden außerdem Fertigung und Bespannung.

Die verkürzte Angabe „Basis + Material“ aus der Ergänzung ersetzt diese vorhandene Zusammensetzung nicht.

### 2.2 Kampf mit zwei Waffen

Die für Auswahl, abgeleitete Werte und Ausgabe relevanten Regeln bleiben:

- Waffen der Spezialisierung `Schild` können nicht mit „Kampf mit zwei Waffen“ verwendet werden;
- bei zwei zulässigen Waffen kann die gemeinsame AT- oder PA-WK nicht unter die höhere aktuelle Einzel-WK sinken;
- bei Waffe und Schild gilt für die Attacke die Waffen-WK und für die Parade die Schild-WK;
- „Schildkampf“ verwendet weiterhin seine eigenen Talentregeln.

### 2.3 Nebenhand-Extra-Aktionen

Der Beschreibungstext des Talents wurde eindeutig gefasst:

- bewaffnete Nebenhand-Extra-Aktionen verwenden bei aktivem „Kampf mit zwei Waffen“ den vollen Probenwert;
- rein unbewaffnete Nebenhand-Extra-Aktionen verwenden unabhängig vom Talent immer den vollen Probenwert;
- die bestehende Halbierung ohne passende Talentwirkung betrifft nur bewaffnete Nebenhand-Extra-Aktionen.

Diese Festlegung wird als Talentwirkung ausgegeben. Eine automatische Extra-Aktions- oder Probenabwicklung ist nicht Teil der Anwendung.

## 3. Nicht eingearbeitet, weil außerhalb des Scopes

Folgende Inhalte der Ergänzung werden weder berechnet noch automatisch abgewickelt:

- Ermittlung der Bruchtest-Auslöser aus Attacke, Parade, Schildparade und WK-Differenz;
- WK-Differenztabelle mit PA-Erschwernissen oder Herabsetzung von Probenklassen;
- Würfeln oder Normalisieren von `W30 − W12`;
- Berechnung und Auswertung von Bruchwert und Bruchtest-Probenwert;
- automatischer KS-Verlust als Folge eines Kampfereignisses;
- Reihenfolge von Bruchtest, Wirkung und Schaden;
- automatische Abwicklung einer Waffenreparatur;
- Kampfrunden, Attacken, Paraden oder Extra-Aktionen.

Damit müssen auch die in der Ergänzung offenen Fragen zur Würfelnormalisierung, zum Zeitpunkt einzelner Kampfmodifikatoren und zur Bruchtest-Reihenfolge nicht durch die Anwendung beantwortet werden.

## 4. Offene produktrelevante Punkte

Diese Fragen wären nur dann relevant, wenn die Inventarverwaltung künftig ausdrücklich um Zustands- und Reparaturverwaltung erweitert werden soll:

1. Soll neben der maximalen KS eine veränderliche aktuelle KS gespeichert werden?
2. Soll der Inventargegenstand einen Zustand wie `beschädigt` oder `zerbrochen` erhalten?
3. Soll eine Reparatur lediglich manuell erfasst oder regeltechnisch berechnet werden?
4. Wie wird eine halbierte ungerade maximale KS gerundet?
5. Welche Reparatur- und Materialmodifikatoren gelten für Schilde?

Ohne eine solche Scope-Erweiterung werden diese Felder und Abläufe nicht eingeführt.

## 5. Tatsächlich berührte Dateien

| Datei | Änderung |
|---|---|
| `src/data/rules.ts` | Präziser Laufzeit-Regeltext für bewaffnete und rein unbewaffnete Nebenhand-Extra-Aktionen |
| `src/data/rules-jsonl/talente.jsonl` | Entsprechende menschenlesbare Regelquelle für Stufe 1 des Zwei-Waffen-Talents |
| `src/engine/talenteKampfmodulInfo.test.ts` | Regressionstest für den ausgegebenen Talenttext |
| `AENDERUNGEN-KAMPF-MIT-ZWEI-WAFFEN-UND-SCHILD-2026-08-23.md` | Korrigierte Beschreibung der Extra-Aktions-Regel |

Es wurde bewusst kein Klingenbruch-, Würfel-, Kampf- oder Reparaturmodul ergänzt.
