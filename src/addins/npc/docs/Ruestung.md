> Aktuelle Nutzerentscheidung: **0–3 KBE aus Rüstung sind allgemein akzeptabel; Rüstung verursacht keine MBE.** Diese Vorgabe ersetzt alle älteren 0-/1-BE-Ziele unten. Strengere Ziele bleiben ausdrücklich wählbar über die Planungsdaten. Die einfache Wache erhält Zeughausrüstung von der Stange (Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte). Keine automatische Anpassung in deren Standardauswahl. Für das Ziel 3 gilt: Eigenschaftsbeitrag ≥ max(0, RH − RM − 18). Über 3 ungerundete RBE werden mindestens 4 BE und bleiben außerhalb des Rahmens.

# NPC-Erstellung: Rüstung

Nutzervorgaben vom 10. September 2026. Grundlage für die Rüstungsauswahl. Die Pakete sind manuell auswählbar und werden für die sechs Referenzvorlagen auch automatisch nach Beruf und Kampfstil zugeordnet.

## Vier reguläre Lagen

Die Lagen sind kombinierbar und keine sich gegenseitig ausschließenden Ausrüstungsklassen. Häufigkeitsangaben beschreiben typische Ausstattung, keine ausnahmslose Pflicht oder bereits festgelegte Zufallswahrscheinlichkeit.

| Lage | Rüstung | Typische Träger | Typische Trefferzonen | Mindest-RH je belegter TZ |
|---|---|---|---|---:|
| 1 | Stoff | Eigentlich jeder NPC | Gewöhnlich alle TZ, einschließlich Kopf | 1 |
| 2 | Leder | Die meisten Handwerker, Fuhrleute und ähnliche Berufe | Gewöhnlich alle TZ, einschließlich Kopf | 2 |
| 3 | Kette | Fast alle Nahkämpfer | Meist Arme und Torso | 3 |
| 4 | Lederpanzer oder Metallpanzer | Eigentlich nur Nahkämpfer; Kopfschutz eventuell bei allen Kampfprofessionen | Meist Torso; Kopf optional für alle Kampfprofessionen | 4 laut bestehender Berechnung |

## Begriffe und bestehende Berechnung

Der Nutzer bezeichnete die Mindestwerte je Trefferzone als „RBE“. Die bestehende Regelberechnung nennt diesen Beitrag **Rüstungshinderlichkeit (RH)**: Ein Rüstungsteil der Lagen 1–4 hat mindestens seine Lagennummer als RH. **Rüstungsbehinderung (RBE)** wird erst aus der Summe der RH aller getragenen Teile und den Charakterwerten berechnet:

`RBE = max(0, (RHgesamt - ((Konstitution / 5 + Stärke) / 2 + Rüstungsmanöver)) / 6)`

Quelle im Client: `src/engine/armorComposition.ts`. Die Werte 1, 2 und 3 wurden aktuell ausdrücklich genannt; der Mindestwert 4 ist hier aus der bestehenden Berechnung ausgewiesen, nicht als neue ausdrückliche Nutzerentscheidung. Die Begriffsdifferenz ist bei der weiteren Abstimmung offenzulegen; die Berechnung wird dadurch nicht geändert.

Die bestehende Sonderbehandlung von Lage 5 (Umhänge/Aufpanzerungen) bleibt außerhalb dieser vier regulären NPC-Lagen und wird durch dieses Konzept nicht geändert.

## Noch auszuarbeiten

- Ausnahmen von der üblichen Abdeckung der vier Lagen.
- Konkrete Katalogteile, Materialien, Verarbeitung und Anpassung.
- Auswahlhäufigkeiten, sofern eine zufällige Vergabe gewünscht ist.
- Budgetverträgliche Ausstattung und Ausbildung in Rüstungsmanöver zum Erreichen von RBE 0.

Gewöhnliche Grundkleidung erhält durch diese Vorgaben nicht automatisch Rüstungswerte. Bei der späteren Auswahl sind vorhandene Kleidung und tatsächliche Stoffrüstung anhand ihrer Katalogeinträge zu unterscheiden.

## Bestätigtes Ziel und Gegenprüfung

Ziel jedes fertigen NPCs ist, mit **0 BE aus Rüstung** loszulaufen. Die RBE-Berechnung ist bereits vollständig im Modell vorhanden. Positive Bruchteile werden aufgerundet: 0,2 ergibt 1 BE, auch 0,033333… ergibt 1 BE. Für die Prüfung zählt deshalb die ungerundete RBE 0. Andere Behinderungsquellen sind von diesem Rüstungsziel getrennt. Ausstattung, Anpassung und Ausbildung müssen gemeinsam innerhalb der Budgets geplant werden; ein verfehltes Ziel ist sichtbar auszuweisen.

Die sechs unveränderten Referenzen wurden mit `makeValueSource`, `evalReferenz` und `computeRbe` des bestehenden Clients gegengerechnet. Effektive Eigenschaften berücksichtigen dabei vorhandene Artefakte. Keine neue Berechnungsformel und keine Änderungen an gespeicherten Charakteren.

| Referenz | RH gesamt | Konstitution | Stärke effektiv | Rüstungsmanöver | RBE ungerundet (hier gekürzt) | Ziel erreicht |
|---|---:|---:|---:|---:|---:|---|
| Bauer | 9 | 13 | 15 | 3 | 0 | Ja |
| Wachmann | 24 | 13 | 15 | 14 | 0,2 | Nein |
| Schütze | 7 | 13 | 15 | 5 | 0 | Ja |
| Nahkämpfer | 22 | 13 | 17 | 14 | 0 | Ja |
| Hauptmann | 16 | 13 | 15 | 7 | 0,033333… | Nein |
| KI-Spezialist | 27 | 13 | 20 | 16 | 0 | Ja, mit vorhandener Artefaktausrüstung |

Bei unveränderter Rüstung und Eigenschaften würde der Wachmann Rüstungsmanöver 16 statt 14 benötigen, der Hauptmann 8 statt 7. Dies sind rechnerische Zielwerte, noch keine auf SP-Budget und Steigerungsvoraussetzungen geprüften Änderungen.

Die Prüfung betrifft die bisherige Ausstattung: Beim Bauern fehlt Stoff am Kopf, seine Lederlage deckt nur Torso und Beine ab. Beim Schützen liegt Leder nur am Torso; beim Nahkämpfer nur an den Beinen; bei Hauptmann und KI-Spezialist fehlt Leder am Kopf. Der Wachmann trägt keine Lederlage. Ein Ergänzen auf die nun festgelegte übliche Abdeckung verlangt eine erneute Kosten- und RBE-Prüfung. Die bisherigen Referenzen sind deshalb noch keine fertig angepassten Rüstungspakete.

## Ausgearbeitete Pakete

Die [konkrete Paketprüfung](Ruestungspakete-Pruefung.md) enthält Handwerker- und Nahkämpferpakete mit Katalogteilen, Verarbeitung, Anpassung, Preisen, RS/RH, benötigten Rüstungsmanövern und vollständigem Budgetvergleich auf allen sechs Referenzen. Eine günstigere Handwerkervariante, ein Eisenpanzer statt Lederpanzer und optionaler Kopfschutz sind separat geprüft. Die Vorschläge stehen in `data/ruestungspakete.draft.json`; `scripts/ruestungspakete.mjs` berechnet den Bericht und die zugehörigen Prüfdaten aus dem bestehenden Clientmodell neu.

## Fertigung und Anpassung je Teil

Die festen Pakete sind Ausgangspunkte, keine optimierten Endzustände. Fertigung und Anpassung sind pro Teil gemeinsam zu vergleichen: zusätzliche Dublonen können den Schutz verbessern oder eine RH-Schwelle unterschreiten und dadurch Ausbildungs-SP bzw. Talentanforderungen einsparen. Die Mindest-RH der Lage bleibt dabei bestehen. Bei der Auswahl auch die Katalogverfügbarkeit berücksichtigen.

Konkrete Modellgegenprobe bei Konstitution 13/Stärke 15: leichte Stoff- und Lederrüstung überall, jeweils Gesellenarbeit und von der Stange, kostet 192 D bei RH 16 und benötigt Rüstungsmanöver 8. Nur die Lederrüstung am Torso anzupassen erhöht die Kosten auf 204 D, senkt RH auf 15 und den Bedarf auf Rüstungsmanöver 7. Der Schutz bleibt gleich: **12 D mehr ersetzen 9 SP Ausbildung**. Alle vier Lederteile angepasst kosten 240 D und benötigen nur Rüstungsmanöver 4. Das ist keine Pflicht, alle Teile einheitlich anzupassen.

Fertigung und Anpassung sind in der Vorschau pro belegtem Teil auswählbar, mit RS/RH und Teilpreis für jede Option. Nach einer Änderung werden der vollständige Charakter, die notwendige Ausbildung und alle Budgets erneut berechnet. Anlegen ist erst bei 0 RBE und bestandenen Prüfungen möglich.

## Automatische Kombinationensuche

Im Assistenten ist die automatische Auswahl von Fertigung und Anpassung standardmäßig aktiviert und kann ausgeschaltet werden. Vor der Vorschau durchsucht sie die Kombinationen für sämtliche gewählten Rüstungsteile. In der Vorschau kann sie nach manuellen Änderungen erneut ausgeführt werden. Die Ausgangsfigur bleibt erhalten; gefunden wird eine separat berechnete Ausstattung.

Zwei ausdrücklich bezeichnete Ziele:

- **Mehr Schutz:** Höchste Summe der RS der vier Zonengruppen innerhalb aller Grenzen; bei Gleichstand zuerst weniger zusätzliche Rüstungsmanöver, dann geringere Rüstungskosten. Keine Gewichtung nach Trefferwahrscheinlichkeit.
- **Sparsam:** Niedrigste Rüstungskosten bei mindestens gleichem RS an jedem Teil; bei Gleichstand weniger zusätzliche Ausbildung, dann mehr Schutz.

Für beide gilt: tatsächliche RBE 0, ausreichende Dublonen und SP, bestehende Talentgrenzen sowie Katalogverfügbarkeit. RS darf an keinem vorhandenen Teil sinken. Belegte Lagen/Zonen bleiben fest; Material/Basisteil bleiben ohne die optionale Basisteilwahl fest. Der Ausgangspunkt ist das gewählte Paket bzw. die aktuelle manuelle Ausstattung. Bereits gelernte Rüstungsmanöver bleiben erhalten, nur zusätzliche geplante Punkte können entfallen. Neue Talente werden nicht automatisch gekauft. Bei unbekannter Herkunft sind nur Kombinationen zugelassen, die in beiden Welten regulär kaufbar sind; für explizit bestehende Charaktere gilt die bisherige Ausnahme.

Die Suche kombiniert alle Fertigungen und Anpassungen, verwirft unzulässige Optionen und behält für jede Gesamt-RH/RS-Kombination den günstigsten Teilplan. Dadurch werden auch gemischte Ausstattungen gefunden, ohne alle Kombinationen einzeln vollständig aufbauen zu müssen. Die bezahlbaren Ausbildungsstufen und der fertige Kandidat werden mit dem bestehenden Charaktermodell nachgerechnet. Eine erfolglose Suche lässt die bisherige Vorschau unverändert und nennt die Grenze.

Gegenprobe: Bei Konstitution 13/Stärke 15, höchstens bezahlbarem Rüstungsmanöver 7 und 204 D Rüstungsbudget findet die Automatik genau ein angepasstes Lederteil neben drei von der Stange. Ergebnis: RH 15, Rüstungsmanöver 7, RBE 0, unveränderter RS. Eine unabhängige vollständige Aufzählung aller Fertigungs-/Anpassungskombinationen an zwei Teilen prüft beide Optimierungsziele gegen das tatsächliche Optimum.


## Erweiterung vom 11. September 2026: Basisteile und Materialien

Im Schritt „Angaben und Rüstung“ kann „Auch Basisteile und Materialien automatisch auswählen“ aktiviert werden. Dann vergleicht die Automatik alle Katalog-Basisteile derselben Lage sowie deren Fertigung und Anpassung. Ohne diese Auswahl bleiben die Basisteile fest. Belegte Zonen und Lagen stammen weiterhin aus der Vorlage bzw. dem gewählten Paket; der Schutz darf an keinem Teil sinken.

Beide Ziele (mehr Schutz / möglichst günstig) berücksichtigen weiterhin Verfügbarkeit, vorhandenes Geld, bezahlbare Rüstungsmanöver und Talentgrenzen. RBE muss ungerundet 0 sein. Die Vorschau zeigt die gewählten Basisteile in der Einzelteilansicht; deren IDs werden zusammen mit Fertigung und Anpassung beim Anlegen übernommen. Manuelle Änderungen der Fertigung/Anpassung erhalten das ausgewählte Basisteil. Lagenfremde Basisteile werden abgewiesen.

Geprüft: vollständige unabhängige Aufzählung eines Panzerplatzes für beide Ziele, vollständiges Nahkämpferpaket, unveränderte Ausgangsfigur und Talente sowie Übernahme der Auswahl in die Rüstungsplätze. Alle 25 NPC-Tests und Produktionsbuild bestanden. Automatische Talentkäufe bleiben offen.


## Automatische Rollenzuordnung vom 11. September 2026

Neue Assistenten starten mit „Automatisch nach Beruf und Kampfstil“. Die Zuordnung folgt expliziten Ausbildungsprofilen der Vorlagen, nicht allein dem Berufslabel: Räuber können Fern- oder Nahkämpfer sein. Beim Wechsel der Vorlage wird das passende Paket erneut aufgelöst. Manuell gewählte Pakete und Vorlagenrüstung bleiben als Alternativen verfügbar.

| Vorlagen | Typische Ausstattung |
|---|---|
| Bauer | Berufspaket: Stoff und Leder an allen vier Zonengruppen |
| Schütze | Kampfprofession: Stoff und Leder an allen vier Zonengruppen |
| Wachmann, Nahkämpfer, Hauptmann, KI-Spezialist | Stoff und Leder überall, Kette an Armen/Torso, Lederpanzer am Torso |

Dies sind transparente Standardzuordnungen für die vorhandenen sechs Referenzen. Zusätzlicher Kopfpanzer bleibt optional. Die optionale freie Basisteilwahl kann den Lederpanzer durch andere Panzer derselben Lage ersetzen. Die automatische Fertigungs-/Anpassungssuche läuft anschließend wie bei manuell gewählten Paketen.

Ein Rollenpaket ersetzt die bisherige Rüstung; sein Schutz bildet die Untergrenze für die anschließende Optimierung. Die Zuordnung verspricht keine Finanzierbarkeit: Insbesondere die voll ausgegebene Bauernreferenz kann das vollständige Berufspaket nicht bezahlen. Finanzierungslücken bleiben sichtbar und sperren das Anlegen. Kein automatischer Rückfall auf weniger Rüstung, keine Budgeterhöhung durch die Rüstungszuordnung.

Prüfung: alle sechs Zuordnungen gegen die manuelle Paketberechnung, gleiche Budgets und Prüfresultate, Stoff-/Lederabdeckung und optionaler Kopfschutz, Vorschau bei Variantenwechsel sowie Anlegesperre bei Finanzierungslücken. 34 NPC-Tests und Produktionsbuild bestanden. Freie Berufsprofile außerhalb der sechs Vorlagen und automatische Talent-/Ausbildungsumschichtungen sind weiterhin offen.

Nutzerkorrektur: Schützen sind Kampfprofessionen und erhalten ebenfalls Leder überall. Das vollständige Stoff-/Lederpaket wird für sie als Standard verwendet.


## Prefab Vollgerüstet

Alle vier regulären Lagen an allen vier Zonengruppen (16 Plätze); Kopfpanzer bereits enthalten. „Stärke“ meint hier die Rüstungsstärke, nicht die Charaktereigenschaft. Ausgangspunkt bei minimaler RH 40 und RS 19 pro Zonengruppe: schwere Stoffrüstung, Lederrüstung, schwerer Eisen-Kettenpanzer und Eisenpanzer, jeweils perfekt angepasst. Diese Basisteile nutzen den Anpassungsabzug für zusätzlichen Schutz bis zur jeweiligen Mindest-RH aus.

Die aktivierte Automatik vergleicht beim Vollgerüstet-Prefab sämtliche Basisteile derselben Lage, einschließlich Lederpanzer bis Faltstahlpanzer in Lage 4. Sie darf dabei auch unter den RS des Ausgangspakets gehen, um alle Rüstungsstärken tatsächlich vergleichen zu können. Jedes Teil bleibt angepasst oder perfekt angepasst. Manuelle Einzelanpassung und Automatik dürfen nicht auf „von der Stange“ zurückfallen.

Rüstungsmanöver wird auf das bereits freigeschaltete Maximum geplant und vollständig bepreist. Es werden keine Talente gekauft und keine Eigenschaften verändert. Bei Gesamt-RH H und RM-Maximum M benötigt der Charakter den Eigenschaftsbeitrag max(0, H−M). Vorhandener Beitrag: (KON/5+ST)/2. Bei festgehaltener KON zeigt die Vorschau zusätzlich die notwendige effektive ST: max(0, ceil(2*(H−M)−KON/5)). Beispiel H=40, M=16, KON=13: Beitrag 24, effektive ST mindestens 46. Das kann außerhalb der Charaktergrenzen liegen und wird nicht automatisch gekauft.

Verfügbarkeit (insbesondere perfekte Anpassung in NW), Geld, SP und tatsächliche RBE bleiben Anlegebedingungen. Ein voll belegtes Paket ist deshalb noch kein innerhalb jeder Referenz finanzierbarer Charakter.


### Aktualisierung: Vollrüstung darf 1 BE verursachen

Nutzerentscheidung vom 11. September 2026: Beim Prefab Vollgerüstet sind bis zu 1 BE erlaubt; die übrigen Pakete behalten das Ziel 0 BE. Frühere Null-BE-Anforderungen für Vollrüstung sind damit ersetzt. Wegen Aufrundung gilt ungerundet RBE ≤ 1, nicht etwa < 2. Die erlaubte Gesamt-RH steigt dadurch um 6: Eigenschaftsbeitrag ≥ max(0, RH − RM − 6). Vorschau, Anlegeprüfung und Optimierung verwenden dieses Ziel. Das Ziel wird am erzeugten Charakter gespeichert.

Beispiel ST/KON effektiv je 38, RM 16, RH 40: RBE 0,2 → 1 BE, für Vollgerüstet akzeptiert. Artefaktmaximum laut Nutzer: +7 pro Eigenschaft; +14 auf eine Eigenschaft ist keine zulässige Planungsannahme.
