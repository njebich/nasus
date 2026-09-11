> **Aktualisierung 11.09.2026:** Die unten aufgeführten Dateien vom 07.09. verletzen Spezialisierungsgrenzen und sind veraltete Referenzen. Korrigierte aktive Vorlagen: `src/addins/npc/data/npc/`; neue Exporte: `outputs/goblin-regelkorrektur-2026-09-11/`. Budgetgerechte Änderungen siehe `src/addins/npc/docs/Referenzkorrektur-2026-09-11.md`. Spezialisierung ≤ Hauptfertigkeit wird nun zentral geprüft. Frühere Testmeldungen waren kein vollständiger Nachweis der Regelkonformität.

# NSC-Vorlagen: Erkenntnisse und Vorgehen

Stand: 8. September 2026. Arbeitsgrundlage aus der gemeinsamen Erstellung von sechs Goblin-NSCs. Diese Notiz dokumentiert Nutzerentscheidungen, beobachtetes App-Verhalten und Vorschläge für die nächsten Schritte; sie ersetzt keine Regelquelle.

## 1. Ziel und Stand

Ziel ist, schnell verwendbare, regelkonforme NSCs zu erstellen. Perspektivisch sollen Vorlagen und ein kurzer Fragebogen die Auswahl von Rolle, Kampfstil und Ausrüstung vereinfachen.

Bislang wurden Charakterdateien erstellt und geprüft. Ein Vorlagensystem oder Fragebogen wurde noch nicht in der App implementiert.

Technischer Rahmen laut AGENTS.md: reine Single-Page-App, kein Server, Regeldaten als Konstanten im Client, Laufzeitdaten in localStorage, Hosting auf GitHub Pages. Auch die Vorlagenerstellung soll in diesen Rahmen passen.

## 2. Festgehaltene Nutzerentscheidungen

- **Stufe 0:** ein leicht überdurchschnittlicher Erwachsener mit abgeschlossener Berufsausbildung. Ein Bauer auf Stufe 0 ist beruflich kompetent, kein Anfänger.
- **Budgets:** Die vorliegenden Stufe-0-Beispiele verwenden 6.400 SP. Stufe 15 entspricht in der aktuellen App 1.600 Gesamt-EP, 8.000 SP und 95 TaP. Auf Stufe 0 stehen 20 TaP zur Verfügung.
- **Allgemeine NSC-Budgets bleiben offen.** Die Beispielbudgets sind noch keine universelle Vorgabe für alle NSCs. Geld und SP getrennt behandeln.
- **Eigenschaften tendenziell auf ungerade Werte steigern**, um Eigenschaftsboni mitzunehmen. Gerade Zwischenwerte nur gezielt für Voraussetzungen oder andere wirksame Schwellen. Diese spätere Erkenntnis soll bestehende NSCs nicht automatisch verändern.
- **Waffenpools bewusst auf n/g/m verteilen.** Hohe normale Werte durch ausschließliche nAT/nPA-Verteilung waren nicht das gewünschte Ergebnis.
- Beim Wachmann wurde für den Stab ausdrücklich **AT und PA jeweils 16/5/21** abgestimmt. Das ist eine konkrete Referenz, keine allgemeine Pflichtverteilung.
- Rest-SP auf tatsächliche Wirkung prüfen. Beim Wachmann sollten Ausweichen, gutes Ausweichen und Rüstungsmanöver zuerst geprüft werden; ohne Verbesserung der angezeigten Werte ging der Punkt in Körperbeherrschung.
- Der KI-Spezialist muss mindestens **7,5 % seiner SP direkt in KI** investieren. Umgesetzt sind 809 von 8.000 SP, also 10,1125 %. Das ist eine Vorgabe für diese Variante, nicht automatisch für jeden magischen NSC.

## 3. Aktuelle Referenzcharaktere

Die folgenden Dateien sind die zuletzt erstellten Fassungen. Ältere Varianten in denselben Ordnern sind Vergleichsstände und sollten nicht versehentlich als aktuelle Vorlage verwendet werden.

| Rolle | Stufe | SP | TaP | Ausrüstungskosten, gerundet | Aktuelle Datei |
|---|---:|---:|---:|---:|---|
| Bauer | 0 | 6.400 | 20 | 492,20 D | `outputs/bauer-goblin-optimierung/Bauer-Goblin-final.nasus.json` |
| Wachmann | 0 | 6.400 | 20 | 2.488,26 D | `outputs/goblin-wachmann/Goblin-Wachmann-Stufe-0-final.nasus.json` |
| Räuberhauptmann mit Schild | 15 | 8.000 | 95 | 404,90 D | `outputs/goblin-raeuber/Goblin-Raeuber-Hauptmann-Stufe-15-final.nasus.json` |
| Räuber-Schütze | 0 | 6.400 | 20 | 297,02 D | `outputs/goblin-raeuber/Goblin-Raeuber-Schuetze.nasus.json` |
| Räuber-Nahkämpfer | 0 | 6.400 | 20 | 1.560,21 D | `outputs/goblin-raeuber/Goblin-Raeuber-Nahkaempfer.nasus.json` |
| KI-Schadensspezialist, gerüstet | 15 | 8.000 | 95 | 11.619,02 D | `outputs/goblin-ki-spezialist/Goblin-KI-Spezialist-Stufe-15-geruestet.nasus.json` |

Der Bauer hat ausdrücklich ein Geldbudget von 500 D und zuletzt +1 Ausweichen erhalten. Bei den anderen aktuellen Dateien wurde das Geld überwiegend auf die Anschaffungskosten aufgerundet; das ist ein technischer Zwischenstand, keine Aussage über Vermögen oder allgemeines Startgeld.

Archiv zuletzt erstellt: `outputs/Goblin-Charaktere-aktuell-2026-09-07.zip`. Vor erneuter Auslieferung Existenz und Aktualität prüfen.

## 4. Erkenntnisse aus den Beispielen

### Beruf zuerst definieren

Der Bauer mit Landwirtschaft/Getreideanbau 16 ist der erste inhaltliche Maßstab für abgeschlossene Ausbildung. Nebenfertigkeiten bilden seinen Alltag ab, etwa Verarbeitung von Lebensmitteln, Holzarbeit und einfache Verwaltung. Ein Wachmann braucht stattdessen Rechtskunde, Observation, Menschenkenntnis und Orientierung. Ein Hauptmann braucht zusätzlich Überzeugen, Einschüchtern und Taktik.

Die Beispiele decken bislang nur Goblins ab. Ihre Eigenschaftswerte und Kosten lassen sich nicht ungeprüft auf andere Spezies übertragen.

### Tatsächliche Ausrüstung bestimmt die Ausbildung

Die Booskueek wurde zunächst irrtümlich als passende Waffe für Musketenfertigkeit behandelt. Sie ist eine Pistole. Erst die Rückfrage zum Konzept machte klar, dass die Waffe statt der Fertigkeit geändert werden sollte.

Für jede Waffe Typ, Spezialisierung, Griff, Mindeststärke, Munition und Kaliber im Katalog prüfen. Ein Gegenstand kann außerdem verschiedene Zuordnungen für Schuss und Verwendung als Nahkampfwaffe haben. Beim 60-cm-Stab existieren getrennte Katalogeinträge für Stangenwaffen und Hiebwaffen; die richtige Zeile ist entscheidend.

### Gemeinsame Hauptfertigkeiten nutzen, Kosten neu berechnen

Speer und kurzer Stab ergänzen sich unter Stangenwaffen. Die Umschichtung aus Hiebwaffen und stumpfen Hiebwaffen in Stäbe sparte zusätzliche Kosten, weil sich der Kostenrang der Spezialisierungen änderte.

Beobachtetes App-Verhalten: NK-Spezialisierungen verwenden je nach Rang 15/8/4 SP pro TaW, FK-Spezialisierungen 10/5/3. Der Rang wird anhand der aktuellen investierten Werte ermittelt. Deshalb nach jeder Umschichtung den gesamten Charakter neu berechnen; isolierte Differenzen können falsch sein.

### Probenqualität gehört zur fertigen Vorlage

Ein gekaufter TaW allein liefert keine fertige Kampfkonfiguration. Normale, gute und meisterliche Werte, Poolgrenzen und AT/PA-Balance müssen gemeinsam betrachtet werden. Die ausschließliche n-Verteilung beim Wachmann ergab zunächst 20/20 und wurde vom Nutzer korrigiert.

Poolwerte sind an konkrete Waffen-IDs gebunden. Nach Austausch einer Waffe alte Verknüpfungen entfernen und neue anlegen. Bei Kombinationen wie Entermesser/Schild zusätzlich die tatsächlichen Kombinationswerte prüfen.

### Talente auf konkrete Wirkung prüfen

Ein Schild im Inventar macht noch keinen guten Schildkämpfer. Beim Hauptmann wurde die Schildhand zunächst halbiert; Schildkampf beseitigte diese Halbierung. Erst weitere SP in Schild und Unbewaffnet machten daraus die ausgebaute Stufe-15-Konfiguration.

Maximum-Talente möglichst mit tatsächlich genutzten höheren Fertigkeitswerten kombinieren. Beim KI-Spezialisten erlaubt KI-Meister Wuchtschlag über 24. Talente nicht nur auswählen, weil ihr Name zur Rolle passt.

### Schwellen statt bloßer Punktesummen optimieren

Eigenschaftsboni, gerundete Proben, Mindeststärke, Talentgrenzen und Rüstungsbehinderung sind unterschiedliche Schwellen. Vorher/nachher berechnen. Ein unveränderter gerundeter Anzeigewert bedeutet nicht zwingend, dass der Rohwert identisch ist; bei Behinderung auch den ungerundeten Wert prüfen.

### Rüstung als Gesamtsystem behandeln

Lagen, Trefferzonen, Verarbeitung, Anpassung, Konstitution, Stärke und Rüstungsmanöver wirken zusammen. Im gerüsteten KI-Beispiel ergeben alle angepassten Lagen 27 RH. Mit Konstitution 13, artefaktverstärkter Stärke 20 und Rüstungsmanöver 16 ist auch die ungerundete RBE auf 0 begrenzt:

`RBE = max(0, (RHgesamt - ((Konstitution / 5 + Stärke) / 2 + Rüstungsmanöver)) / 6)`

Begriffe des Nutzers nicht stillschweigend erfinden: Im Katalog wurde „leichter Plattenpanzer“ als normaler Eisenpanzer umgesetzt und offengelegt. Für Rüstungen gibt es dort keine Massenfabrikation; verwendet wurde Gesellenarbeit. Angepasst ist eine separate Auswahl.

### Magische Voraussetzungen und aktive Effekte trennen

Beim KI-Spezialisten wurde der vollständige Pfad Konzentration → Froschlunge → Kraftakt → Wuchtschlag → Kampfrausch geprüft. Konzentration erfordert Aura und Magie über 0. Die KI-Baumprüfung ist zusätzlich zur allgemeinen Charaktervalidierung nötig.

Direkte KI-SP separat ausweisen; Aura, Magie, mentale Sonderfertigkeiten und Talentpunkte nicht in den verlangten KI-Anteil hineinrechnen.

Artefaktboni und situativ aktivierte KI-Wirkungen unterscheiden: Das Stärke-Artefakt wird in der App berücksichtigt. Wuchtschlag/Kraftakt werden nicht dauerhaft in die Waffenwerte geschrieben. Vorbereitung, Dauer, Zuschläge und mentale Ressourcen gehören zur tatsächlichen Anwendung.

## 5. Empfohlenes Vorgehen bei weiteren NSCs

1. **Auftrag festhalten:** Spezies, Rolle, Stufe, SP, Geldvorgabe, gewünschte Waffen/Magie, feste Vorgaben und freie Entscheidungen.
2. **Rollenprofil schreiben:** Was kann der NSC beruflich? Was ist seine bevorzugte Kampfweise? Wo darf er Schwächen haben?
3. **Ausrüstung aus echten Katalogeinträgen wählen:** Waffen, Munition, Rüstung und gegebenenfalls Artefakte. Mehrdeutige Zuordnungen und Ersatzlösungen offen benennen.
4. **Eigenschaften planen:** Speziesgrenzen beachten, ungerade Bonusstufen bevorzugen, Griff- und Ausrüstungsvoraussetzungen erreichen.
5. **Kernfertigkeiten und Talente zusammenstellen:** Berufskenntnisse erhalten; Hauptfertigkeiten bündeln; Talentketten und benötigte Maxima beachten.
6. **Magie/KI ergänzen:** Vollständige Voraussetzungsketten, tragfähige Attribute und Ressourcen, geforderte SP-Anteile separat prüfen.
7. **Budget iterativ ausgleichen:** Gesamtberechnung nach jeder Umschichtung. Vor allem relevante Schwellen kaufen. Bei ausdrücklich vollständig zu verteilendem Budget Restpunkte sinnvoll unterbringen.
8. **Kampfkonfigurationen und Pools fertigstellen:** n/g/m verteilen, Balance und Grenzen prüfen, alle gekauften Poolpunkte sinnvoll verwenden, Waffen-IDs korrekt verknüpfen.
9. **Gesamtprüfung:** Budget, Voraussetzungen, tatsächliche Waffenverwendbarkeit, Munition, Rüstung, aktive/automatische Effekte und Rollenbild prüfen.
10. **Export und Rücklesen:** Gültige `.nasus.json` erzeugen, erneut einlesen, Änderungen und freie Punkte erklären. Varianten mit eigener Identität anlegen; bei Revisionen desselben NSCs Identität und Speicherhistorie bewusst erhalten.
11. **Aktuelle Fassung dokumentieren:** Dateiname und Archivinhalt eindeutig halten. Alte Varianten nicht versehentlich als aktuellen Charakter ausliefern.

## 6. Technische Prüfpunkte

Die folgenden bestehenden Module wurden für Berechnung und Erstellung verwendet. Ihre aktuelle Implementierung ist maßgeblich, nicht eine nachgebildete Kostenrechnung:

| Aufgabe | Modul |
|---|---|
| Charakterzustand, Stufen-/Startbudgetvorgaben | `src/state/characterStore.ts` |
| Berechnung und zentrale Validierung | `src/engine/characterSheet.ts` |
| Katalogkäufe, Rüstung und Änderungen | `src/state/characterMutations.ts` |
| Dateiimport, Speicherpunkte, Export | `src/state/characterFile.ts` |
| NK-Zeilen und Pooldarstellung | `src/views/kampfNahkampf.ts` |
| FK-Werte und Munitionsverwendbarkeit | `src/views/kampfFeuerwaffen.ts` |
| Kombinationen mit Schild/Zweitwaffe | `src/engine/waffenLoadout.ts` |
| Poolgrenzen und Balance | `src/engine/poolCaps.ts` |
| Spezialisierungskosten | `src/engine/waffenSpezKosten.ts` |
| KI-Voraussetzungen | `src/engine/kiBaumGating.ts` |
| RBE und Rüstungszusammensetzung | `src/engine/armorComposition.ts` |
| Artefaktbonus und Wirkungsbeschreibung | `src/engine/artefaktBonus.ts`, `src/engine/artefaktWirkung.ts` |

Mindestens prüfen:

- Exakte SP-/TaP-Ausgaben und verfügbare Budgets.
- Zentrale `validationIssues` sowie zusätzliche Bereichsprüfungen.
- Jeder gespeicherte Wert verweist auf eine existierende Regel.
- KI-Fähigkeiten sind über den gesamten Pfad freigeschaltet.
- Bevorzugte Waffen sind im vorgesehenen Griff benutzbar; Kombinationen lösen gültig auf.
- Jede aktive Poolverteilung hält Feldmaxima und AT/PA-Balance ein; Restpool ist bewusst behandelt.
- Munition passt zu Mechanik und Kaliber. Gemeinsame 100 Schuss sind ein Vorrat, nicht 100 pro angezeigter Waffe.
- RBE-Ziel auch ungerundet erreicht; dafür benötigte Artefaktwirkung kenntlich machen.
- Neue Datei lässt sich wieder einlesen; ZIP enthält genau die beabsichtigten aktuellen Dateien.

**Grenzen:** Die zentrale Validierung allein ist kein vollständiger Beweis der Regelkonformität. Bei früheren Prüfungen gab es allgemeine unvollständige Formeln, die nicht als Charakterfehler gemeldet wurden. Außerdem werden nicht alle Interaktionsvoraussetzungen zentral durchgesetzt. Keine pauschale Fehlerfreiheit aller abgeleiteten Werte behaupten.

Für zugeteilte, im normalen Einkauf gesperrte Artefakte wurde beim KI-Spezialisten ausdrücklich der Modus „bestehender Charakter“ genutzt. Dies ist für diese Ausrüstung dokumentiert und kein genereller Weg, Einkaufsregeln für beliebige neue NSCs zu umgehen.

## 7. Vorschlag für Vorlagen und Fragebogen

Zunächst redaktionell geprüfte Referenzen mit überschaubaren Varianten aufbauen. Ein freier Optimierer ist erst sinnvoll, wenn Zielwerte und Grenzen hinreichend geklärt sind.

Mögliche Fragen:

1. Welche Rolle und welchen Ausbildungs-/Erfahrungsstand hat der NSC?
2. Welche Spezies und Herkunft?
3. Wie kämpft er hauptsächlich: Nahkampf, Fernkampf, KI oder gemischt?
4. Welche Waffen und welcher Schwerpunkt: Schaden, Schutz, Beweglichkeit oder Führung?
5. Wie gut ist er ausgerüstet, und gibt es feste Ausrüstungs- oder Magievorgaben?

Auswahlfragen sollen nur erscheinen, wenn sie relevant sind. Die Ausgabe sollte eine Vorschau mit Rollenprofil, Kosten, verbleibenden Punkten und vollständigen Kampfwerten liefern. Danach wird ein normal bearbeitbarer Charakter erzeugt.

Sinnvolle getrennte Vorlagenbereiche: Beruf, Spezies/Herkunft, Kampfausbildung, Ausrüstung und magische Ausbildung. Kombinationen müssen jedoch immer neu berechnet werden; die Bereiche sind wegen Kostenrängen und Voraussetzungen nicht unabhängig addierbar.

## 8. Offene Entscheidungen und nächste Schritte

- Allgemeine SP- und Geldbudgets für NSCs festlegen oder bewusst variabel lassen.
- Berufliches Ausbildungsniveau anhand weiterer, insbesondere nichtgoblinischer Referenzen kalibrieren.
- Gewünschte n/g/m-Zielprofile je Rolle und Stufe definieren; „maximaler Schaden“ allein ist noch kein eindeutiges Optimierungsziel.
- Festlegen, wie persönliche Ausrüstung, Dienst-/Beuteausrüstung und Vermögen getrennt behandelt werden sollen.
- Neutrale Gesinnung wurde in den erstellten Dateien als Platzhalter verwendet; sie ist keine abgestimmte Persönlichkeit der Räuber.
- Referenzdateien erneut gegen den jeweils aktuellen Regelstand prüfen und eine eindeutige Liste der aktuellen Fassungen pflegen.
- Als nächste Implementierung einen kleinen Vorlagenkatalog mit Vorschau und „als neuen NSC erstellen“ erwägen. Klonen muss neue Charakter- und gegebenenfalls Inventar-IDs samt konsistenten Verknüpfungen erzeugen; fremde Speicherhistorie gehört nicht in einen neuen NSC.
- Erst danach einen kurzen Fragebogen zur Wahl geprüfter Varianten ergänzen. Automatische, freie Punkteoptimierung ist eine spätere Ausbaustufe.

Diese nächsten Schritte sind Vorschläge; ihre Implementierung wurde noch nicht beauftragt.
