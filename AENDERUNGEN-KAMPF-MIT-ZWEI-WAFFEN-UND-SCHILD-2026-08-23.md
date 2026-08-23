# Änderungen an „Kampf mit zwei Waffen“ und „Schildkampf“

Stand: 23. August 2026

## 1. Zweck und Geltungsbereich

Dieses Dokument beschreibt den finalen Regel- und Implementierungsstand der Änderungen an:

- „Kampf mit zwei Waffen“ Stufe 1 bis 4,
- der WK-Berechnung beim Kampf mit zwei Nahkampfwaffen,
- bewaffneten und unbewaffneten Extra-Aktionen der Nebenhand,
- der Kombination aus einhändiger Nahkampfwaffe und Schild,
- dem Talent „Schildkampf“.

Zwischenzeitlich diskutierte, später verworfene Varianten sind in Abschnitt 9 ausdrücklich als **nicht gültig** aufgeführt.

## 2. Begriffe und verwendete Werte

### 2.1 Waffenklasse (WK)

Für alle nachfolgenden Berechnungen wird die **aktuelle WK** des jeweiligen Gegenstands verwendet. Das ist der bereits fertig zusammengesetzte Gegenstandswert nach den für diesen Gegenstand geltenden Modifikatoren.

Bei einem Schild gilt weiterhin:

```text
aktuelle Schild-WK = WK-Basis des Schildtyps + WK-Mod des Schildmaterials
```

Fertigung und Bespannung verändern die Schild-WK nicht.

### 2.2 Haupt- und Zweithand

- Die Haupt- beziehungsweise Primärhand ist die im Loadout als erste Hand gewählte Seite.
- Die Zweit- beziehungsweise Sekundärhand ist die zweite Seite des Loadouts.
- Die Wahl der Hand verändert die aktuelle WK eines Gegenstands nicht.

### 2.3 RH

RH bedeutet **Rüstungshinderlichkeit**. RH ist kein Schild-WK-Ersatz und wird durch diese Änderungen weder aus der Schild-WK abgeleitet noch für die hier beschriebenen WK-Berechnungen verwendet.

## 3. Talent „Kampf mit zwei Waffen“

### 3.1 Betroffene Talentstufen

| Talent | Referenz | Kosten | maximale WK je Waffe |
|---|---|---:|---:|
| Kampf mit zwei Waffen Stufe 1 | `talente_kampf_mit_zwei_waffen_stufe_1` | 28 | 3,5 |
| Kampf mit zwei Waffen Stufe 2 | `talente_kampf_mit_zwei_waffen_stufe_2` | 8 | 4,5 |
| Kampf mit zwei Waffen Stufe 3 | `talente_kampf_mit_zwei_waffen_stufe_3` | 12 | 5,5 |
| Kampf mit zwei Waffen Stufe 4 | `talente_kampf_mit_zwei_waffen_stufe_4` | 16 | 6,5 |

Kosten und WK-Obergrenzen wurden nicht verändert.

### 3.2 Voraussetzungen und Ausschlüsse

Das Talent wird auf ein konkretes Waffenpaar angewendet, wenn:

1. eine passende Talentstufe besessen wird,
2. die aktuelle WK beider Waffen die WK-Obergrenze dieser Stufe nicht überschreitet,
3. beide Gegenstände für das einhändige Nahkampf-Loadout zulässig sind,
4. keine der Waffen die Spezialisierung `Schild` besitzt,
5. keine Stangenwaffe beteiligt ist.

Negative WK sind ausdrücklich erlaubt. Es gibt keine Mindest-WK von 0 für die Zweithand.

Waffen mit der Spezialisierung `Schild` können unabhängig von ihrer WK mit keiner Stufe von „Kampf mit zwei Waffen“ verwendet werden.

Technischer Hinweis: Die bestehende Engine prüft die WK-Obergrenze gegen die aktuelle, im Ausrüstungs-Snapshot gespeicherte WK. Der importierte Talenttext bezeichnet die Obergrenze weiterhin als „unmodifizierten Listenwert“. Diese bereits zuvor bestehende Abweichung wurde durch die hier dokumentierte Änderung nicht neu eingeführt und nicht aufgelöst.

## 4. WK beim Kampf mit zwei Waffen

Für zwei geeignete Nahkampfwaffen mit den aktuellen Waffenklassen `WK₁` und `WK₂` wird zunächst die höhere Einzel-WK bestimmt:

```text
höhere WK = MAX(WK₁; WK₂)
```

### 4.1 Angriffs-WK

```text
AT-WK = MAX(höhere WK; höhere WK × 1,5)
```

Bei einer positiven höheren WK greift weiterhin der Faktor 1,5. Bei einer negativen WK verhindert die Maximumsbildung, dass die Multiplikation den Wert weiter verschlechtert.

### 4.2 Parade-WK

```text
PA-WK = MAX(höhere WK; WK₁ + WK₂)
```

Positive WK können sich weiterhin addieren. Eine negative WK kann die gemeinsame PA-WK jedoch nicht unter die bessere Einzel-WK senken.

### 4.3 Grundsatz

„Kampf mit zwei Waffen“ kann die WK gegenüber der besseren Einzelwaffe erhöhen oder unverändert lassen, aber niemals verschlechtern.

### 4.4 Beispiele

| WK rechts | WK links | höhere WK | AT-WK | PA-WK |
|---:|---:|---:|---:|---:|
| −1 | −1 | −1 | −1 | −1 |
| −1 | 0 | 0 | 0 | 0 |
| 2 | −1 | 2 | 3 | 2 |
| 2 | 3 | 3 | 4,5 | 5 |
| 3,5 | 4,5 | 4,5 | 6,75 | 8 |

## 5. Weitere Werte beim Kampf mit zwei Waffen

Die folgenden bestehenden Regeln bleiben erhalten:

- Die n-Modifikatoren beider Waffen werden addiert.
- Die Mindeststärken beider Waffen werden addiert.
- Für den gemeinsamen Schaden wird die Waffe mit dem höheren Durchschnittsschaden verwendet.
- Angriffe verwenden die Kampfwerte der jeweils eingesetzten Waffe.
- Paraden verwenden den besseren Paradewert der beiden Waffen.

Diese Werte wurden durch die neue WK-Untergrenze nicht verändert.

## 6. Extra-Aktionen und Halbierung des Probenwerts

### 6.1 Mit aktivem „Kampf mit zwei Waffen“

Bewaffnete Nebenhand-Extra-Aktionen verwenden bei aktivem Talent den **vollen Probenwert**. Rein unbewaffnete Nebenhand-Extra-Aktionen verwenden ebenfalls den vollen Probenwert; für sie gilt diese Ausnahme jedoch unabhängig davon, ob das Talent aktiv ist.

Die bewaffnete Nebenhand wurde bei aktivem Talent bereits vor dieser Änderung ohne Halbierung berechnet. Neu ist die ausdrückliche Gleichstellung im Regeltext. Eine eigenständige ausführbare Engine-Mechanik für unbewaffnete Extra-Aktionen existiert derzeit nicht; diese Wirkung ist bislang textlich festgelegt.

### 6.2 Ohne aktives „Kampf mit zwei Waffen“

Wird eine bewaffnete Zweithand ohne aktives Zwei-Waffen-Talent geführt, bleibt die bisherige Halbierung bestehen. Die Halbierung wird nach der Projektion getrennt auf normale, gute und meisterliche Werte angewendet und weg von null aufgerundet.

Eine rein unbewaffnete Nebenhand-Extra-Aktion – etwa mit bloßer Faust, Fuß oder Biss und der Spezialisierung `Unbewaffnet` – verwendet auch ohne das Talent immer den vollen Probenwert. Der Probe-halbieren-Malus gilt damit ausschließlich für bewaffnete Nebenhand-Extra-Aktionen ohne passende Talentwirkung.

Diese Abgrenzung erhält die eigenständige Wirkung von:

- „Schildkampf“,
- „Linkshändig Pistolenschießen“,
- „Beidhändig Pistolenschießen“.

## 7. Einhändige Nahkampfwaffe und Schild

### 7.1 Ausschluss aus „Kampf mit zwei Waffen“

Ein Schild besitzt die Spezialisierung `Schild` und kann deshalb nicht mehr durch „Kampf mit zwei Waffen“ amalgamiert werden. Das gilt für alle Schildtypen, Materialien, Fertigungen und Bespannungen.

Die frühere Schild-Sonderbehandlung innerhalb des Zwei-Waffen-Talents entfällt vollständig.

### 7.2 Verwendete WK

Bei der Kombination aus einer einhändigen Nahkampfwaffe und einem Schild gelten zwei klar getrennte WK-Werte:

```text
AT-WK = aktuelle WK der Nahkampfwaffe
PA-WK = aktuelle WK des Schildes
```

Diese Zuordnung gilt unabhängig davon, welcher Gegenstand als Primärhand ausgewählt wurde.

Es wird weder die höhere WK für beide Aktionen verwendet noch werden Waffen- und Schild-WK addiert.

### 7.3 Talent „Schildkampf“

„Schildkampf“ bleibt unverändert:

- Befindet sich der Schild in der Zweithand, hebt das Talent die Halbierung des Schild-Probenwerts auf.
- Befindet sich stattdessen die Nahkampfwaffe in der Zweithand, hebt „Schildkampf“ deren Halbierung nicht auf.
- Das Talent verändert weder die Waffen-WK noch die Schild-WK.
- Das Talent erzeugt keine gemeinsame AT-/PA-WK und verwendet keine Zwei-Waffen-Formeln.

### 7.4 Entfernte Schild-WK-Sonderregeln

Folgende frühere Regeln sind entfernt:

- Halbierung der Schild-WK vor der Zwei-Waffen-Berechnung,
- Aufrundung der halbierten Schild-WK auf 0,5,
- `AT-WK = 1,5 × MAX(Waffen-WK; halbierte Schild-WK)`,
- `PA-WK = Waffen-WK + halbierte Schild-WK`,
- Aktivierung von „Kampf mit zwei Waffen“ für Waffe-Schild-Loadouts,
- Zusammenfassung von Waffe und Schild zu einer Zwei-Waffen-Kampfentität.

## 8. Konkrete Gegenstandswerte und Beispiele

### 8.1 Berührte beziehungsweise zur Prüfung verwendete Einzelwerte

| Gegenstand | Material | WK-Basis | WK-Mod | aktuelle WK |
|---|---|---:|---:|---:|
| Messer klein | Eisen | −1 | 0 | −1 |
| Messer groß | Eisen | 0 | 0 | 0 |
| Dolch | Eisen | 2 | 0 | 2 |
| Kurzschwert | Eisen | 4,5 | 0 | 4,5 |
| Rundschild | Holz | 8 | −1,5 | 6,5 |
| Rundschild | Hartholz | 8 | −1 | 7 |

Die Gegenstandsbasiswerte und Materialmodifikatoren selbst wurden nicht geändert. Sie sind hier aufgeführt, weil sie zur Herleitung und Prüfung der neuen Regeln verwendet wurden.

### 8.2 Zwei kleine Messer aus Eisen

Beide Messer haben WK −1. Mit „Kampf mit zwei Waffen“ Stufe 1 ist die Kombination zulässig:

```text
höhere WK = −1
AT-WK = MAX(−1; −1 × 1,5) = −1
PA-WK = MAX(−1; −1 + −1) = −1
```

Ergebnis: **AT-WK −1 / PA-WK −1**.

### 8.3 Kleines und großes Messer aus Eisen

```text
WK = −1 und 0
höhere WK = 0
AT-WK = 0
PA-WK = 0
```

Ergebnis: **AT-WK 0 / PA-WK 0**. Die Handreihenfolge verändert dieses WK-Ergebnis nicht.

### 8.4 Dolch aus Eisen und Rundschild aus Holz

```text
Dolch-WK = 2
Schild-WK = 8 − 1,5 = 6,5
```

Der Schild ist von „Kampf mit zwei Waffen“ ausgeschlossen. Deshalb gilt:

```text
AT-WK = 2
PA-WK = 6,5
```

„Schildkampf“ kann gegebenenfalls die Halbierung des Schild-Probenwerts aufheben, ändert diese WK-Werte aber nicht.

### 8.5 Kurzschwert aus Eisen und Rundschild aus Holz

```text
AT-WK = 4,5
PA-WK = 6,5
```

Auch hier ist „Kampf mit zwei Waffen“ nicht anwendbar.

## 9. Ausdrücklich nicht gültige Zwischenstände

Die folgenden während der Klärung erwogenen Regeln gehören **nicht** zum finalen Regelstand:

- „Die WK der Zweithand muss mindestens 0 sein.“
- „Bei Waffe und Schild gilt für alles nur die höhere der beiden WK.“
- „Ein Schild kann über seine halbierte WK mit Kampf mit zwei Waffen verwendet werden.“
- „Beim Schild werden Waffen-WK und Schild-WK für die Parade addiert.“
- „WK und RH sind gleich oder werden voneinander abgeleitet.“

## 10. Anzeige im Kampf-Loadout

Für Waffe-Schild-Loadouts wird die WK nun ausdrücklich nach Verwendungszweck angezeigt:

```text
AT <Waffen-WK> / PA <Schild-WK>
```

Beispiel Dolch aus Eisen und Rundschild aus Holz:

```text
AT 2 / PA 6,5
```

Für ein aktives Zwei-Waffen-Loadout werden weiterhin die gemeinsam berechnete AT-WK und PA-WK angezeigt.

## 11. Angepasste Regeltexte

Die Wirkungstexte aller vier Stufen von „Kampf mit zwei Waffen“ wurden ergänzt. Sie benennen nun:

- den Ausschluss der Spezialisierung `Schild`,
- die Untergrenze der gemeinsamen AT- und PA-WK durch die höhere Einzel-WK,
- den vollen Probenwert bewaffneter Nebenhand-Extra-Aktionen bei aktivem Talent,
- den stets vollen Probenwert rein unbewaffneter Nebenhand-Extra-Aktionen.

Die Korrektur wird zusätzlich zur menschenlesbaren JSONL-Regelquelle zur Laufzeit auf die vier Talent-Referenzen angewendet, damit die Benutzeroberfläche nicht weiterhin den veralteten Wirkungstext anzeigt.

## 12. Berührte Implementierungsdateien

| Datei | Änderung |
|---|---|
| `src/engine/waffenLoadout.ts` | Zwei-Waffen-Gate, neue AT-/PA-WK-Untergrenzen, Ausschluss der Schild-Amalgamation, getrennte Waffen-/Schild-WK |
| `src/views/kampfLoadout.ts` | Anzeige von `AT <Waffen-WK> / PA <Schild-WK>` bei Waffe und Schild |
| `src/engine/waffenLoadout.test.ts` | Regressionstests für negative WK, zwei kleine Messer, Schildausschluss und getrennte AT-/PA-WK |
| `src/data/rules-jsonl/talente.jsonl` | Aktualisierte Wirkungstexte für „Kampf mit zwei Waffen“ Stufe 1 bis 4 |
| `src/data/rules.ts` | Laufzeitkorrektur der sichtbaren Talenttexte |

## 13. Verifikation

Nach dem finalen Stand wurden folgende Prüfungen erfolgreich ausgeführt:

- vollständige Testsuite: **582 von 582 Tests bestanden**,
- Produktions-Build einschließlich TypeScript-Prüfung: **erfolgreich**,
- Waffen-Katalogprüfung: **406 Waffenzeilen und 27 Spezialisierungen gültig**.
