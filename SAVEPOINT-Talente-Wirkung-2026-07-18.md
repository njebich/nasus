# Savepoint: Talente-Wirkung

Stand: 2026-07-18  
Fortsetzung: nächster Arbeitstag

## Arbeitsauftrag und Grenzen

- Grundlage: `werte 0.8-claude.xlsx`, Sheet `Werte`.
- Talentquelle: `NN NPC-Rechner 0.76.xlsx`, Sheet `Talente`.
- Arbeitsdatei: `Talente-Wirkung-chatgpt.xlsx`.
- Zweck: Regelunklarheiten schrittweise klären und eine saubere Übergabe für Claude vorbereiten.
- ChatGPT führt **keinen Commit, keinen Push und keine sonstige Git-Änderung** aus.
- Alle noch nicht behandelten Fragen sind bis zur Fortsetzung zurückgestellt.
- Bei jeder künftigen Regelfrage zuerst den vollständigen vorhandenen Wirkungstext ausgeben und erst danach die konkrete Umsetzungsfrage stellen.

## Bestätigte Grundregeln

1. Werte-Einträge und Wirkungsanweisungen werden imperativ formuliert.
2. Bei nummerierten Talentstufen gilt grundsätzlich nur die höchste erworbene Stufe. Zahlen einer höheren Stufe sind Gesamtwerte und keine kumulativen Zusatzwerte.
3. Ausnahme: Wenn eine höhere Stufe eine neue, andersartige Wirkung ergänzt, bleiben die Grundwirkungen der vorherigen Stufe erhalten. Bestätigte Fälle: `Fernkampfgeschick`, `Kampf mit zwei Waffen` und `Mehrfachschuss`.
4. Talentwirkungen stapeln sich grundsätzlich. Ausnahmen sind Stufenersetzung und ausdrücklich gegenseitig ausschließende Wirkungen. Eine weitere Ausnahme wird nur bei einem tatsächlich vorhandenen Wirkungskonflikt festgelegt.
5. Jede einzelne Division und Multiplikation wird unmittelbar auf die nächste ganze Zahl aufgerundet.
6. Ausnahme Waffenklasse: WK-Ergebnisse werden auf die nächste `0,5` aufgerundet, nicht auf ganze Zahlen.
7. Jeder Charakter darf jedes Talent kaufen. Charakterklassen sind ein veraltetes Konzept und dürfen keine Talentvoraussetzung bilden.
8. Bei mehrstufigen Talenten ersetzt die höhere Stufe grundsätzlich die vorherige Stufe oder ergänzt sie, wenn sie eine neue, andersartige Wirkung hinzufügt.
9. Es wird keine allgemeine Prioritätsregel für hypothetisch kollidierende Setzen-Wirkungen eingeführt. Behandelt werden ausschließlich Konflikte, die sich aus tatsächlich vorhandenen Wirkungstexten ergeben.
10. In sämtlichen Talent-Wirkungstexten ist „Sekunde“ eine veraltete Bezeichnung und wird durch `KR (Kampfrunde)` ersetzt.
11. Behinderung (BE) und Sicht werden im Regelfall auf Proben außer Glück angewendet. Diese Regel ist nicht ausnahmslos; konkrete Wirkungen können davon abweichen, beispielsweise selbst gewirkte Zauber.
12. Ein Klassenmalus verändert nicht den Probenwert, sondern verschiebt die erreichte Erfolgsstufe: Die normale Probe bleibt rechnerisch bestehen, führt aber zu keinem Erfolg; Gute wird zu Normal, Meisterlich zu Gut und Fröhlich zu Meisterlich.

## Mana und Magie

### Mana-Regeneration

- Neue Werte-Referenz: `char_natuerliche_mana_regeneration`.
- Stufe 1 setzt den Faktor der natürlichen Mana-Regeneration auf `1,5`.
- Stufe 2 ersetzt Stufe 1 und setzt den Faktor auf `2,0`.
- Keine Kumulation oder Multiplikation beider Stufen.

### Magus je Zauberschule

- Magus `+6`, Großmagus `+12`, Erzmagus `+18` gelten je konkreter Zauberschule.
- Die höhere Stufe ersetzt die niedrigere; maximal gilt `+18` je Schule.

### Schnell Zaubern

- Die Angaben `:N` sind Divisoren der ursprünglichen Zauberzeit.
- Stufe 1, Zauberstufen 1/2/3: Divisoren `2/3/4`.
- Stufe 2: Divisoren `3/4/5`.
- Stufe 3: Divisoren `4/5/6`.
- Nur die höchste Talentstufe gilt; jede Division wird aufgerundet.

### Spruchmagie Stufe 2/3 zaubern

- `Spruchmagie Stufe 2 zaubern` schaltet in allen Zauberschulen Sprüche der Stufe 2 frei.
- `Spruchmagie Stufe 3 zaubern` ergänzt diese Wirkung und schaltet zusätzlich Sprüche der Stufe 3 frei; die Freigaben für die niedrigeren Spruchstufen bleiben erhalten.

### Spruchgute, PSI-Gute und KI-Gute

- Spruchgute Stufe 2 verwendet den Eigenschaftsbonus des konkreten Zauberspruchs.
- PSI-Gute Stufe 2 verwendet den Eigenschaftsbonus der konkreten PSI-Fähigkeit/Anwendung.
- Spruchgute und PSI-Gute werden je konkretem Zauberspruch beziehungsweise je konkreter PSI-Fähigkeit berechnet und gespeichert.
- KI-Gute wird je konkreter KI-Fähigkeit berechnet und gespeichert.
- KI-Gute Stufe 1: `MIN(Magie, AUFRUNDEN(Normale KI-Probe / 2))`.
- KI-Gute Stufe 2: `MIN(Magie + Aura, AUFRUNDEN(Normale KI-Probe / 2))`.

### Blutmagie

- Nur der Magus selbst kann das Gesundheitsopfer leisten.
- Opferpunkte werden sofort reserviert und können nicht doppelt verwendet werden.
- Die tatsächliche Gesundheitsabbuchung erfolgt am Ende der Effektdauer, beim Scheitern oder bei freiwilligem Abbruch.
- Heilung zwischen Reservierung und Abbuchung verändert die reservierte Menge nicht.
- Ein freiwilliger Abbruch löst die vollständige Abbuchung sofort aus.
- Erst nach erfolgreicher Mut-Probe wird die Opferhöhe festgelegt und reserviert. Fehlgeschlagene Mut-Proben kosten nur Zeit.
- Nach der Abbuchung gelten die normalen Verwundungs-, Bewusstlosigkeits- und Todesregeln.
- Keine Rüstung oder Schadensreduktion gegen das Blutopfer.
- Nicht glatt teilbarer Rest: Der nächste vollständige Gesundheitspunkt darf geopfert werden; die Verbesserung wird an der normalen Probe gedeckelt, überschüssige Wirkung verfällt.

## Fernkampf

### Fernkampfgeschick

- Stufe 1 Gute-Punkte: `1 + AUFRUNDEN(Wert / 4)`.
- Stufe 2 ersetzt Stufe 1: `1 + AUFRUNDEN(Wert / 3)`.
- Stufe 3 behält die Stufe-2-Gute-Regel und ergänzt Meisterliche-Punkte: `21 + AUFRUNDEN(Wert / 20)`.
- Die geschenkten Gute-/Meisterlich-Punkte werden bei Charaktererschaffung oder Steigerung berechnet und als fester Charakterbogenwert gespeichert.
- Kampferschwernisse lösen keine rückwirkende Neuberechnung dieser gespeicherten Punkte aus.
- Beispiel Spezialisierung Armbrüste: Ausgangspunkt ist `fk_basis_spez_schusswaffen_armbrust` plus dynamischer Reichweiten-Waffenmodifikator.
- Reichweiten-Waffenmodifikator wird aus konkreter Waffe und Entfernung bestimmt und ist noch nicht im Werte-Modell erfasst.
- Die vollständige Ermittlung des FK-Probenwerts einschließlich Kampferschwernissen wird im Kampfmodul bearbeitet.

### Berittener Fernkampf

- Auch `Berittenes Pistolenschießen` verringert den Modifikator um `3` beziehungsweise `7`; das Wort „auf“ war ein Formulierungsfehler.
- Die Verringerung des Modifikators „vom laufenden Pferd“ endet bei `0` und kann keinen Bonus erzeugen.

### Fliegend Schießen

- `0/+1` bedeutet: Freihand `0`, Aufgelegt `+1`.
- Der frühere Vermerk „Dennis fragen“ entfällt.

### Point-Blank Shot und Schnell Schießen

- Beide Talente sind **nicht** gegenseitig ausschließend.
- Normale Nahkampfsituation: Hüftschuss `-12` plus hakenschlagend `-10` ergibt `-22`.
- Point-Blank verwendet Sofortschuss `-6` plus hakenschlagend `-10`, insgesamt `-16`.
- Mit Schnell Schießen wird Sofortschuss auf `-4` gesetzt; gemeinsam mit hakenschlagend ergibt das `-14`.
- `Schnell Ziehen` verändert keinen Schussmodifikator.

### Mit zwei Pistolen schießen

- Beim Schießen mit beiden Pistolen werden zwei getrennte FK-Proben abgelegt, eine Probe je Pistole.
- Jede der beiden Proben verwendet den vollen Probenwert statt des halbierten Probenwerts.
- Waffen- und situationsabhängige Modifikatoren werden für jede Pistole auf deren eigene Probe angewendet.

### Linkshändig Pistolenschießen

- Regeltechnisch ist die rechte Hand immer die Haupthand und die linke Hand immer die benachteiligte Nebenhand; tatsächliche Händigkeit wird nicht gesondert erfasst.
- Das Talent senkt den Nebenhandmalus beim Schießen einer Pistole mit der linken Hand: Statt des halbierten wird der volle Probenwert verwendet.
- Die andere Hand ist für die Anwendung des Talents unerheblich; sie darf frei sein oder eine Waffe beziehungsweise einen Gegenstand halten.

### Mehrfachschuss

- Stufe 2 schaltet Tripelschuss zusätzlich frei; Doppelschuss bleibt verfügbar.
- Doppelschuss und Tripelschuss sind pro Anwendung gegenseitig ausschließende Manöver.
- Doppelschuss beziehungsweise Tripelschuss verwenden jeweils nur **eine** Probe, nicht zwei oder drei getrennte Proben.
- Alle zwei beziehungsweise drei Geschosse einer Anwendung müssen auf dasselbe Ziel gerichtet sein.
- Die gemeinsame FK-Probe entscheidet für alle Geschosse: Bei Erfolg sind alle Geschosse zunächst Treffer, bei Misserfolg verfehlen alle.
- Gegen jedes zunächst treffende Geschoss erhält das Ziel separat die nach Fernkampfwaffen-Ausweichtabelle passende Vermeidungschance.
- Für jedes nach der Vermeidung verbleibende treffende Geschoss werden Trefferzone und Schaden separat bestimmt.
- Eine aufgrund der gemeinsamen FK-Probe verfügbare Qualitätswirkung wird einmal für die gesamte Salve gewählt und gilt anschließend für alle Geschosse.
- Berechnungsreihenfolge: Berechne zunächst den FK-Probenwert nach der im Wirkungstext angegebenen Formel, wende danach sämtliche anwendbaren Modifikatoren an, halbiere das Ergebnis beim Doppelschuss beziehungsweise drittle es beim Tripelschuss und runde diese letzte Division unmittelbar auf.
- Eigene nicht spezialisierbare Talentwerte für `[Bogenart]-Doppelschuss` und `[Bogenart]-Tripelschuss` werden benötigt.
- Umsetzung vollständig zurückgestellt und später gesondert modellieren.

### Gezielter Schuss

- Der Spieler sagt vorab eine Trefferzone an.
- Verglichen werden drei Ergebnisse: ursprünglicher Trefferzonenwurf plus zwei Rerolls.
- Beide Rerolls werden vollständig geworfen; kein freiwilliges vorzeitiges Stoppen.
- Es zählt nach Trefferzonenregelwerk die Trefferzone, die der angesagten Trefferzone am nächsten liegt.

### Schnellziehen

- Eine geeignete Halterung wird vorausgesetzt.
- Keine eigene Halterungs-Eigenschaft oder dynamische Ausrüstungsprüfung im Talentmodell anlegen.
- Nach den Grundregeln dauert das Ziehen einer Waffe eine vollständige KR.
- Das passende Schnellziehen-Talent lässt diese fürs Ziehen benötigte KR entfallen.
- Dadurch darf die Waffe gezogen und noch in derselben KR regulär damit gehandelt werden; das Talent gewährt keine zusätzliche Aktion.

## Nahkampf und Schaden

### Offensiver Kampfstil und Verteidiger

- Beide Haltungen sind gegenseitig ausschließend.
- Die Haltung wird zu Beginn jeder Kampfrunde (KR) neu gewählt und gilt für die gesamte KR.
- Ohne ausdrückliche Auswahl ist keine Haltung aktiv.
- Die Auswahl der vorherigen KR wird nicht automatisch übernommen.

### Wuchtschlag

- Keine Charakterklassenbeschränkung.
- Wuchtschlag und Meuchler sind innerhalb derselben KR gegenseitig ausschließend; in einer KR kann nur eines der beiden Talente angewendet werden.
- Stehende Variante: Verbringe unmittelbar vor der Attacke eine vollständige KR (Kampfrunde) regungslos mit der Vorbereitung und führe während dieser KR keine andere Aktion aus. Führe die Wuchtschlag-Attacke in der folgenden KR aus.
- Laufende Variante: Wende zuerst BE und Sicht auf den nAT-Probenwert an, halbiere anschließend das Ergebnis und runde die Division unmittelbar auf die nächste ganze Zahl auf.
- Dreifacher Schaden bezieht sich auf den vollständigen Schaden vor Schadensreduktion.
- Rüstung und andere Schadensreduktionen werden erst danach angewendet.
- Schadensmultiplikatoren dürfen stapeln: `x3` und `x2` ergeben `x6`.

### Meuchler

- Ersetze im Wirkungstext die veraltete Bezeichnung `Gefahrensinn` durch `Gefahreninstinkt`.
- Meuchler und Wuchtschlag sind innerhalb derselben KR gegenseitig ausschließend; in einer KR kann nur eines der beiden Talente angewendet werden.
- Das Talent ergänzt die AT-Auswirkungs-Tabelle um eine zusätzliche Zeile für die Auswahl `Rüstungsignorierend`.
- Diese Auswahl kostet gemäß Wirkungstext einen Bonuspunkt.
- Der Ansagezeitpunkt der zusätzlichen Zeile ist `bei Treffer`.
- Bei einer unbemerkten Attacke ignoriert jede gute oder bessere AT die Rüstung; dies schließt ausdrücklich auch eine fröhliche AT ein.
- Bei einer unbemerkten Attacke sind der doppelte Schaden und ab guter AT die Rüstungsignorierung automatische Zusatzwirkungen. Die normalen Punkte und Auswahlmöglichkeiten der AT-Auswirkungs-Tabelle bleiben vollständig verfügbar.
- Die automatischen Meuchler-Wirkungen dürfen mit den gewählten Wirkungen der AT-Auswirkungs-Tabelle stapeln; beispielsweise ergeben automatischer doppelter Schaden und zusätzlich gewähltes `TP x2` insgesamt `TP x4` bei Rüstungsignorierung.

### Kampf mit zwei Waffen

- Höhere Stufen behalten sämtliche Grundregeln aus Stufe 1; nur das maximale WK-Limit wird ersetzt.
- Stufe 1/2/3/4: maximales WK-Limit je Waffe `3,5/4,5/5,5/6,5`.
- Das Limit gilt für jede der beiden Waffen einzeln und verwendet den unmodifizierten Listenwert.
- Attacken: `effektive WK = AUFRUNDEN_AUF_0,5(höhere Waffen-WK x 1,5)`.
- Paraden verwenden gemäß Talenttext die Summe beider WK.

### ME sparen

- Jede tatsächliche ME-Abbuchung wird separat halbiert und aufgerundet.
- Gilt für Aktivierungskosten, laufende Kosten und Kosten gescheiterter Anwendungen.
- Positive Kosten bleiben mindestens `1`.

### Finte

- Nach einer Finte darf der Angreifer eine vollständige KR lang keine weitere Finte einsetzen.
- Finte in KR `N`: Sperre in KR `N+1`, wieder erlaubt ab KR `N+2`.

### Entwaffnen

- Direkter Treffer: Waffe fällt automatisch.
- Parade mit gleicher oder schlechterer PA-Klasse: erschwerte Geschicklichkeitsprobe entscheidet.
- Bessere Parade oder erfolgreiches Ausweichen: Entwaffnen scheitert.
- Ein W4 bestimmt gemäß bestehendem Text Aufwand beziehungsweise benötigte KR zum Wiederaufheben.
- Während des Aufhebens gelten sicher `AT-Klasse -1` und `PA-Klasse -1`.
- `AW-Klasse -1` wird vorläufig ebenfalls angewendet.
- Prüfvermerk stehen lassen: Die endgültige Einordnung des AW-Klasse-Malus beim Aufheben muss im Kampfmodul geklärt werden.
- Die Klassenmali verändern nicht den jeweiligen Probenwert, sondern stufen das Ergebnis gemäß der allgemeinen Klassenmalus-Regel um eine Erfolgsstufe herab.

### Konter

- Die um `15` erschwerte Parade beinhaltet den Konter und verbraucht keine zusätzliche reguläre Aktion.
- Die tatsächlich erreichte Erfolgsstufe der Parade muss mindestens eine Stufe höher sein als die tatsächlich erreichte Erfolgsstufe der Attacke; gleiche Erfolgsstufen lösen keinen Konter aus.
- Nach erfolgreicher Parade wird eine separate kostenlose AT-Probe mit `AT-Klasse -1` gewürfelt.
- Erst diese AT-Probe entscheidet, ob der Konter trifft.

### Mit Schild umwerfen

- Unmittelbar nach dem Sturz gilt `NK-Klasse -2`.
- Ab Ende der ersten folgenden KR darf das Ziel einmal pro KR eine Athletikprobe ablegen.
- Jeder Erfolg verbessert die NK-Klasse um `1`; Misserfolg lässt den aktuellen Malus unverändert.
- Wiederholen, bis `0` erreicht ist.

## Zurückgestellte Punkte

1. Technische Modellierung der eigenen Mehrfachschuss-Talentwerte.
2. Vollständige FK-Probenberechnung und Kampferschwernisse im Kampfmodul.
3. Entwaffnen/AW-Klasse beim Aufheben: vorläufig anwenden; endgültig im Kampfmodul klären, Prüfvermerk stehen lassen.

## Nächster Einstieg

Nur noch materiell implementierungsrelevante Unklarheiten aus tatsächlich vorhandenen Wirkungstexten einzeln behandeln. Keine hypothetischen Konfliktfälle oder allgemeinen Prioritätsregeln erfinden. Am Ende eine konsolidierte Übergabe für Claude erstellen; weiterhin keinerlei Git-Aktion durch ChatGPT.
