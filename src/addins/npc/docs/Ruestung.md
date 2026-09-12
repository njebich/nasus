> Aktuelle Nutzerentscheidung: **0–3 KBE aus Rüstung sind allgemein akzeptabel; Rüstung verursacht keine MBE.** Diese Vorgabe ist das allgemeine Planungsziel; Null-BE-Beispiele gelten nur für ausdrücklich strengere Varianten. Strengere Ziele bleiben ausdrücklich wählbar über die Planungsdaten. Die einfache Wache erhält Zeughausrüstung von der Stange (Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte). Keine automatische Anpassung in deren Standardauswahl. Für das Ziel 3 gilt: Eigenschaftsbeitrag ≥ max(0, RH − RM − 18). Über 3 ungerundete RBE werden mindestens 4 BE und bleiben außerhalb des Rahmens.

# NPC-Erstellung: Rüstung

Nutzervorgaben vom 10. September 2026. Grundlage für die Rüstungsauswahl. Die Pakete sind manuell auswählbar und werden für die sechs Referenzvorlagen auch automatisch nach Beruf und Kampfstil zugeordnet.

## Rüstungsmanöver aus geplanter Rüstung — bestätigt am 12. September 2026

Rüstungsmanöver wird für jeden Beruf aus der tatsächlich geplanten Rüstung und dem gewählten KBE-Ziel abgeleitet. Es ersetzt Tragen nicht: Tragen bleibt für Gepäck, Waffen und Arbeitsmaterial zuständig. Ein Kampfberuf erhält keinen pauschalen Rüstungsmanöver-Beitrag; auch ein gerüsteter Zivilberuf erhält die benötigte Ausbildung.

Für RHgesamt der geplanten Teile, effektive Konstitution KON, effektive Stärke ST und Ziel B (Standard 3, ausdrücklich auch 0–2) gilt nach der bestehenden Clientformel:

`RMbedarf = max(0, ceil(RHgesamt − (KON / 5 + ST) / 2 − 6 × B))`

Das ist der kleinste ganzzahlige Rüstungsmanöver-Wert, der ungerundet RBE ≤ B erreicht. Ohne Rüstung beziehungsweise bei bereits ohne Rüstungsmanöver erreichtem Ziel ist der Bedarf 0. Effektive Werte und RH mit dem bestehenden Charaktermodell bestimmen; keine angenommenen Artefaktboni oder zusätzlichen Eigenschaftskäufe einsetzen. Rüstung verursacht keine MBE.

Den Bedarf als Mindestziel für `sf_ruestungsmanoever` führen. Endwert = Maximum aus vorhandenen beziehungsweise aus anderen Quellen zusammengeführten Käufen, anderen verbindlichen Mindestzielen und RMbedarf. Nur fehlende Punkte ergänzen; Rüstungsteile erzeugen keine einzeln zu addierenden Ausbildungsziele. Mehrere ausdrücklich zu beherrschende Ausrüstungssätze werden jeweils vollständig berechnet, anschließend gilt ihr höchster Bedarf.

Jeder gekaufte Punkt zählt einmal gegen GF/SF-Gesamtsumme und SP-Budget (9 SP/Punkt). Reguläres Maximum 12; höhere Werte nur mit ausdrücklich gewählten und geprüften Freischaltungen. Übersteigt der Bedarf das zulässige Maximum, die GF/SF-Planungsgrenze oder das verfügbare SP-Budget, den Konflikt mit Bedarf und Fehlbetrag ausweisen. Keine automatische Talentwahl, Budgeterhöhung, Lockerung des KBE-Ziels oder Kürzung beruflicher Tragen-Werte. Nur im Auftrag erlaubte Ausrüstungsalternativen vergleichen.

Nach Änderungen an Rüstung, Fertigung, Anpassung, Eigenschaften oder KBE-Ziel den Bedarf und alle Kosten neu berechnen und abschließend mit der bestehenden RBE-Berechnung gegenprüfen. Bereits gelernte Werte bestehender Charaktere bleiben erhalten. Bei neuen Entwürfen dürfen ausschließlich bisher zusätzlich geplante, nicht mehr benötigte Punkte entfallen, sofern kein anderes Mindestziel sie verlangt.

Beispiele bei KON 13 und ST 15 (Eigenschaftsbeitrag 8,8): RH 24 benötigt für Ziel 3 RM 0, für Ziel 2 RM 4 (RBE 1,8666…), für Ziel 0 RM 16. Letzteres ist ohne passende Maximum-Freischaltung unzulässig. Sind für Ziel 2 bereits RM 2 vorhanden, fehlen 2 Punkte / 18 SP; bei vorhandenen RM 6 ist kein Zukauf nötig.

Diese Entscheidung gilt auch für Vollgerüstet. Die bisherige Planung pauschal bis zum freigeschalteten RM-Maximum wird für den künftigen freien Generator durch den kleinsten benötigten Wert ersetzt. Bestehende Assistentenfunktionen sind damit noch nicht umgestellt.

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
- Budgetverträgliche Ausstattung mit der oben bestätigten bedarfsabhängigen Rüstungsmanöver-Ausbildung vollständig im freien Generator umsetzen und prüfen.

Gewöhnliche Grundkleidung erhält durch diese Vorgaben nicht automatisch Rüstungswerte. Bei der späteren Auswahl sind vorhandene Kleidung und tatsächliche Stoffrüstung anhand ihrer Katalogeinträge zu unterscheiden.

## Bestätigtes Ziel und Gegenprüfung

Ziel jedes fertigen NPCs sind höchstens 3 KBE und keine MBE aus Rüstung. Strengere Ziele 0–2 KBE sind ausdrücklich wählbar. Für die Prüfung zählt die ungerundete RBE ≤ gewähltes Ziel: 3,01 ist unzulässig, weil daraus 4 KBE werden. Ausstattung, Anpassung und Ausbildung müssen gemeinsam innerhalb der Budgets liegen.

**Historische Gegenprüfung vom 10. September 2026 mit Ziel 0 KBE:** Die damaligen sechs Referenzen wurden mit `makeValueSource`, `evalReferenz` und `computeRbe` des bestehenden Clients gegengerechnet. Effektive Eigenschaften berücksichtigen dabei vorhandene Artefakte. Keine neue Berechnungsformel und keine Änderungen an gespeicherten Charakteren.

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

Modellgegenprobe für das ausdrücklich strengere Ziel 0 KBE bei Konstitution 13/Stärke 15: leichte Stoff- und Lederrüstung überall, jeweils Gesellenarbeit und von der Stange, kostet 192 D bei RH 16 und benötigt Rüstungsmanöver 8. Nur die Lederrüstung am Torso anzupassen erhöht die Kosten auf 204 D, senkt RH auf 15 und den Bedarf auf Rüstungsmanöver 7. Der Schutz bleibt gleich: **12 D mehr ersetzen 9 SP Ausbildung**. Alle vier Lederteile angepasst kosten 240 D und benötigen nur Rüstungsmanöver 4. Das ist keine Pflicht, alle Teile einheitlich anzupassen.

Fertigung und Anpassung sind in der Vorschau pro belegtem Teil auswählbar, mit RS/RH und Teilpreis für jede Option. Nach einer Änderung werden der vollständige Charakter, die notwendige Ausbildung und alle Budgets erneut berechnet. Anlegen ist erst bei eingehaltenem KBE-Ziel und bestandenen Prüfungen möglich.

## Automatische Kombinationensuche

Im Assistenten ist die automatische Auswahl von Fertigung und Anpassung standardmäßig aktiviert und kann ausgeschaltet werden. Vor der Vorschau durchsucht sie die Kombinationen für sämtliche gewählten Rüstungsteile. In der Vorschau kann sie nach manuellen Änderungen erneut ausgeführt werden. Die Ausgangsfigur bleibt erhalten; gefunden wird eine separat berechnete Ausstattung.

Zwei ausdrücklich bezeichnete Ziele:

- **Mehr Schutz:** Höchste Summe der RS der vier Zonengruppen innerhalb aller Grenzen; bei Gleichstand zuerst weniger zusätzliche Rüstungsmanöver, dann geringere Rüstungskosten. Keine Gewichtung nach Trefferwahrscheinlichkeit.
- **Sparsam:** Niedrigste Rüstungskosten bei mindestens gleichem RS an jedem Teil; bei Gleichstand weniger zusätzliche Ausbildung, dann mehr Schutz.

Für beide gilt: ungerundete RBE höchstens das gewählte KBE-Ziel (Standard 3), ausreichende Dublonen und SP, bestehende Talentgrenzen sowie Katalogverfügbarkeit. RS darf an keinem vorhandenen Teil sinken. Belegte Lagen/Zonen bleiben fest; Material/Basisteil bleiben ohne die optionale Basisteilwahl fest. Der Ausgangspunkt ist das gewählte Paket bzw. die aktuelle manuelle Ausstattung. Bereits gelernte Rüstungsmanöver bleiben erhalten, nur zusätzliche geplante Punkte können entfallen. Neue Talente werden nicht automatisch gekauft. Bei unbekannter Herkunft sind nur Kombinationen zugelassen, die in beiden Welten regulär kaufbar sind; für explizit bestehende Charaktere gilt die bisherige Ausnahme.

Die Suche kombiniert alle Fertigungen und Anpassungen, verwirft unzulässige Optionen und behält für jede Gesamt-RH/RS-Kombination den günstigsten Teilplan. Dadurch werden auch gemischte Ausstattungen gefunden, ohne alle Kombinationen einzeln vollständig aufbauen zu müssen. Die bezahlbaren Ausbildungsstufen und der fertige Kandidat werden mit dem bestehenden Charaktermodell nachgerechnet. Eine erfolglose Suche lässt die bisherige Vorschau unverändert und nennt die Grenze.

Gegenprobe für das ausdrücklich strengere Ziel 0 KBE: Bei Konstitution 13/Stärke 15, höchstens bezahlbarem Rüstungsmanöver 7 und 204 D Rüstungsbudget findet die Automatik genau ein angepasstes Lederteil neben drei von der Stange. Ergebnis: RH 15, Rüstungsmanöver 7, RBE 0, unveränderter RS. Eine unabhängige vollständige Aufzählung aller Fertigungs-/Anpassungskombinationen an zwei Teilen prüft beide Optimierungsziele gegen das tatsächliche Optimum.


## Erweiterung vom 11. September 2026: Basisteile und Materialien

Im Schritt „Angaben und Rüstung“ kann „Auch Basisteile und Materialien automatisch auswählen“ aktiviert werden. Dann vergleicht die Automatik alle Katalog-Basisteile derselben Lage sowie deren Fertigung und Anpassung. Ohne diese Auswahl bleiben die Basisteile fest. Belegte Zonen und Lagen stammen weiterhin aus der Vorlage bzw. dem gewählten Paket; der Schutz darf an keinem Teil sinken.

Beide Ziele (mehr Schutz / möglichst günstig) berücksichtigen weiterhin Verfügbarkeit, vorhandenes Geld, bezahlbare Rüstungsmanöver und Talentgrenzen. Die ungerundete RBE muss das gewählte KBE-Ziel einhalten. Die Vorschau zeigt die gewählten Basisteile in der Einzelteilansicht; deren IDs werden zusammen mit Fertigung und Anpassung beim Anlegen übernommen. Manuelle Änderungen der Fertigung/Anpassung erhalten das ausgewählte Basisteil. Lagenfremde Basisteile werden abgewiesen.

Geprüft: vollständige unabhängige Aufzählung eines Panzerplatzes für beide Ziele, vollständiges Nahkämpferpaket, unveränderte Ausgangsfigur und Talente sowie Übernahme der Auswahl in die Rüstungsplätze. Alle 25 NPC-Tests und Produktionsbuild bestanden. Automatische Talentkäufe bleiben offen.


## Automatische Rollenzuordnung vom 11. September 2026

Neue Assistenten starten mit „Automatisch nach Beruf und Kampfstil“. Die Zuordnung folgt expliziten Ausbildungsprofilen der Vorlagen, nicht allein dem Berufslabel: Räuber können Fern- oder Nahkämpfer sein. Beim Wechsel der Vorlage wird das passende Paket erneut aufgelöst. Manuell gewählte Pakete und Vorlagenrüstung bleiben als Alternativen verfügbar.

| Vorlagen | Typische Ausstattung |
|---|---|
| Bauer | Berufspaket: Stoff und Leder an allen vier Zonengruppen |
| Schütze | Kampfprofession: Stoff und Leder an allen vier Zonengruppen |
| Wachmann | Zeughausrüstung von der Stange: Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in der Standardauswahl |
| Nahkämpfer, Hauptmann, KI-Spezialist | Stoff und Leder überall, Kette an Armen/Torso, Lederpanzer am Torso |

Dies sind transparente Standardzuordnungen für die vorhandenen sechs Referenzen. Zusätzlicher Kopfpanzer bleibt optional. Die optionale freie Basisteilwahl kann den Lederpanzer durch andere Panzer derselben Lage ersetzen. Die automatische Fertigungs-/Anpassungssuche läuft anschließend wie bei manuell gewählten Paketen; ausgenommen ist die unveränderte Standardauswahl der einfachen Wache.

Ein Rollenpaket ersetzt die bisherige Rüstung; sein Schutz bildet die Untergrenze für die anschließende Optimierung. Die Zuordnung verspricht keine Finanzierbarkeit: Insbesondere die voll ausgegebene Bauernreferenz kann das vollständige Berufspaket nicht bezahlen. Finanzierungslücken bleiben sichtbar und sperren das Anlegen. Kein automatischer Rückfall auf weniger Rüstung, keine Budgeterhöhung durch die Rüstungszuordnung.

Prüfung: alle sechs Zuordnungen gegen die manuelle Paketberechnung, gleiche Budgets und Prüfresultate, Stoff-/Lederabdeckung und optionaler Kopfschutz, Vorschau bei Variantenwechsel sowie Anlegesperre bei Finanzierungslücken. 34 NPC-Tests und Produktionsbuild bestanden. Freie Berufsprofile außerhalb der sechs Vorlagen und automatische Talent-/Ausbildungsumschichtungen sind weiterhin offen.

Nutzerkorrektur: Schützen sind Kampfprofessionen und erhalten ebenfalls Leder überall. Das vollständige Stoff-/Lederpaket wird für sie als Standard verwendet.


## Prefab Vollgerüstet

Alle vier regulären Lagen an allen vier Zonengruppen (16 Plätze); Kopfpanzer bereits enthalten. „Stärke“ meint hier die Rüstungsstärke, nicht die Charaktereigenschaft. Ausgangspunkt bei minimaler RH 40 und RS 19 pro Zonengruppe: schwere Stoffrüstung, Lederrüstung, schwerer Eisen-Kettenpanzer und Eisenpanzer, jeweils perfekt angepasst. Diese Basisteile nutzen den Anpassungsabzug für zusätzlichen Schutz bis zur jeweiligen Mindest-RH aus.

Die aktivierte Automatik vergleicht beim Vollgerüstet-Prefab sämtliche Basisteile derselben Lage, einschließlich Lederpanzer bis Faltstahlpanzer in Lage 4. Sie darf dabei auch unter den RS des Ausgangspakets gehen, um alle Rüstungsstärken tatsächlich vergleichen zu können. Jedes Teil bleibt angepasst oder perfekt angepasst. Manuelle Einzelanpassung und Automatik dürfen nicht auf „von der Stange“ zurückfallen.

Bisheriger Umsetzungsstand des Prefabs (durch die neue Planungsentscheidung oben abgelöst, noch nicht umgestellt): Rüstungsmanöver wird auf das bereits freigeschaltete Maximum geplant und vollständig bepreist. Es werden keine Talente gekauft und keine Eigenschaften verändert. Bei Gesamt-RH H, RM-Maximum M und KBE-Ziel B (Standard 3) ist der benötigte Eigenschaftsbeitrag max(0, H−M−6×B). Vorhandener Beitrag: (KON/5+ST)/2. Bei festgehaltener KON ergibt sich die erforderliche effektive ST als max(0, ceil(2*(H−M−6×B)−KON/5)). Beispiel H=40, M=16, KON=13, B=3: Beitrag 6, effektive ST mindestens 10. Das ersetzt keine Prüfung der Volksgrenzen oder Budgets.

Verfügbarkeit (insbesondere perfekte Anpassung in NW), Geld, SP und tatsächliche RBE bleiben Anlegebedingungen. Ein voll belegtes Paket ist deshalb noch kein innerhalb jeder Referenz finanzierbarer Charakter.


### Einheitliches Rüstungsziel (12. September 2026)

Für alle Pakete einschließlich Vollgerüstet gelten allgemein höchstens 3 KBE und keine MBE durch Rüstung. Strengere Ziele B = 0, 1 oder 2 sind ausdrücklich wählbar. Geprüft wird ungerundet RBE ≤ B; positive Bruchteile werden zur KBE aufgerundet. Benötigter Eigenschaftsbeitrag: max(0, RH − RM − 6 × B). Das gewählte Ziel wird am Charakter gespeichert.

Artefaktmaximum laut Nutzer: +7 pro Eigenschaft; +14 auf eine Eigenschaft ist keine zulässige Planungsannahme.
