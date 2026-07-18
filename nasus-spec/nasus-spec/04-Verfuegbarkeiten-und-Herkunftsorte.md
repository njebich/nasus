# Verfügbarkeiten und Herkunftsorte

Stand: 2026-07-18  
Status: Entwicklungsspezifikation; noch nicht in `werte 0.8-claude.xlsx` übernehmen

## Zweck und Grenzen

Diese Spezifikation beschreibt:

- die einheitliche Verfügbarkeit aller kaufbaren Ausrüstungsgegenstände,
- die Herkunft eines Charakters,
- benannte Herkunfts- und Einkaufsorte,
- die Bearbeitung von Orten im Meister-Modul,
- die spätere Implementierung durch Claude.

Bis zur fachlichen Abnahme werden keine Verfügbarkeiten in `werte 0.8-claude.xlsx` ergänzt oder geändert.

Ruhm und Beziehungen zwischen Völkern bleiben vollständig außerhalb dieser Verfügbarkeitslogik. Sie sind noch nicht entwickelt und sollen später ausschließlich Preise modifizieren.

## Bestätigte Grundentscheidungen

1. Es gilt ausschließlich die additive Verfügbarkeitsskala von `1` bis `7` sowie `M`.
2. Ein niedriger Wert bedeutet gute, ein hoher Wert schlechte Verfügbarkeit.
3. Das ältere W100-System und seine multiplikative Berechnung werden nicht implementiert.
4. Fehlende Verfügbarkeiten erhalten nicht den Wert `0`.
5. Fehlende Werte bleiben leer (`null`) und werden mit einem sichtbaren Bearbeitungsstatus gekennzeichnet.
6. Jeder kaufbare Gegenstand und jede kaufbare Variante benötigt eine Verfügbarkeit.
7. Jeder Ausrüstungsdatensatz benötigt eine Völkerzuweisung.
8. Artefakte müssen beim Kauf anhand ihrer Verfügbarkeit geprüft und gegebenenfalls gesperrt werden.
9. `Heimat` wird im Charakterheader durch `Herkunft` ersetzt.
10. Im gedruckten Charakterheader erscheint Herkunft ausschließlich als `Ort, Region, AW/NW`.
11. Orte und Charaktere werden lokal und permanent gespeichert. Eine Servermigration ist erst nach App 1.0 vorgesehen.
12. Der vorhandene numerische Artefaktwert gilt als AW-/Grundverfügbarkeit. Für NW wird abhängig vom Artefaktgrad addiert: Grad 1–2 `+0`, Grad 3–5 `+1`, Grad 6–7 `+2`; das Ergebnis wird bei 7 begrenzt.
13. `M` bedeutet Meisterverfügbarkeit und ist ausschließlich im Meister-Modul verfügbar. Der vorhandene Artefaktwert `Meister` wird kanonisch als `M` geführt.
14. Die Siedlungsgrößenmodifikatoren werden getrennt für Rüstungen/Waffen und Artefakte geführt. Gegenüber dem Entwurf v0.3 ist die Artefaktspalte überall um 1 erhöht.
15. Die Handelsstufenmodifikatoren werden getrennt für Rüstungen/Waffen und Artefakte geführt; Artefakte liegen jeweils 1 Stufe schlechter.
16. Die Herstellungsortmodifikatoren werden getrennt für Rüstungen/Waffen und Artefakte geführt; Artefakte liegen jeweils 1 Stufe schlechter.
17. Die Händlermodifikatoren werden getrennt für Rüstungen/Waffen und Artefakte geführt.
18. Jeder spezialisierte Händler muss genau einer Warengruppe zugeordnet werden. Die Auswahl erfolgt über ein Dropdown aus der zentralen Warengruppenliste.
19. Lokale Produktion ist ein Override des Herstellungsorts: Bei einem passenden Eintrag wird statt des allgemeinen Herstellungsortmodifikators der Wert für `Herstellung direkt vor Ort` verwendet. Es entsteht kein zusätzlicher Bonus.
20. Die Völkerzuweisung eines Gegenstands wird mit der Ortsbevölkerung abgeglichen: `ALLE` und Hauptspezies `0`, etablierte Minderheit `+1`, keine übereinstimmende Spezies `+3`.
21. Die zentrale Kaufsperre gilt für alle Kaufpfade: effektive Verfügbarkeit `1–4` ist für Spieler kaufbar, `5–7` ist gesperrt, `M` ist ausschließlich im Meister-Modul verfügbar und fehlende beziehungsweise `OFFEN`-Werte sind mit sichtbarem Pflegehinweis gesperrt.
22. Das Meister-Modul darf einen konkreten Kauf beziehungsweise eine konkrete Vergabe mit effektiver Verfügbarkeit `5–7` oder `M` freigeben. Die Freigabe verändert weder Gegenstand noch Ort und wird mit Charakter, Gegenstand, Ort, effektivem Wert und Zeitpunkt protokolliert; eine Begründung ist optional. `OFFEN` kann nicht übersteuert werden.
23. Bei zusammengesetzter Ausrüstung wird jede gewählte Pflichtkomponente separat einschließlich aller Orts-, Völker- und Produktionsregeln berechnet. Das schlechteste Komponentenergebnis bestimmt den fertigen Gegenstand: numerisch gilt das Maximum, `M` hat Vorrang vor numerischen Werten und `OFFEN` hat Vorrang vor allen anderen Ergebnissen.
24. Die 43 vorhandenen Warengruppen bleiben ohne Zusammenfassung oder Umbenennung erhalten. Jede erhält `haendlerSpezialisierbar`; für `Miete`, `Post`, `Reisekosten`, `Tavernen-Preise` und `Zoll` ist der Wert `false`, für die übrigen 38 Gruppen `true`. Das Händler-Dropdown zeigt ausschließlich spezialisierbare Gruppen und ist durchsuchbar.
25. Jeder Ort besitzt einen persistenten Grundzustand. Optional kann zu Abenteuerbeginn ein vollständiger Abenteuer-Ortszustand erzeugt werden; Käufe verwenden den aktiven Abenteuerzustand, sonst den Grundzustand. Nach dem Abenteuer kann der Zustand verworfen, weitergeführt oder ausdrücklich als neuer Grundzustand übernommen werden. Frühere Käufe bleiben unverändert.
26. Ein Ort kann mehrere Händler besitzen. Jeder spezialisierte Händler bleibt genau einer Warengruppe zugeordnet. Für einen Kauf gilt unter allen anwendbaren Händlern der niedrigste Modifikator; ist keiner anwendbar, gilt `Kein Laden / kein Händler`. Straitmor besitzt sechs spezialisierte Händler für Sklaven, Feuerwaffen, Rüstungen, NK-Waffen, Edelsteine und Metall.
27. Zwogón besitzt für jede der 38 händlerspezialisierbaren Warengruppen einen eigenen `Großen spezialisierten Händler`. Die fünf nicht händlerspezialisierbaren Dienstleistungsgruppen erhalten keinen solchen Händler.
28. Kettenrüstungen und Metallplattenrüstungen werden nicht von Katzen, Indianern, Zentauren oder Gnomen hergestellt; Trolle stellen zusätzlich keine Kettenrüstungen her. Die sechs Kettenrüstungsbasen erhalten `AUSWAHL: Dalkini, Draw, Elfen, Goblins, Orks, Zwerge`. Die sechs Metallplattenrüstungsbasen erhalten `AUSWAHL: Dalkini, Draw, Elfen, Goblins, Orks, Trolle, Zwerge`. Die übrigen acht Rüstungsbasen sowie alle vier Verarbeitungs- und vier Anpassungsstufen bleiben `ALLE`. Alle 28 Zuweisungen sind `BESTÄTIGT`.
29. Artefakte werden nicht von Indianern, Dalkini, Katzen, Zentauren oder Trollen hergestellt. Alle 57 Artefakt-Grunddatensätze erhalten deshalb `AUSWAHL: Draw, Elfen, Gnome, Goblins, Orks, Zwerge`; ihre 749 kaufbaren Varianten erben diese bestätigte Zuweisung.
30. Bei den Schildmaterialien werden `Kolhartz` zu `Kolharz`, `Diamantspart` zu `Diamantspat` und `Schwarzfells` zu `Schwarzfels` korrigiert. Metallschilde werden nicht von Katzen, Indianern, Zentauren oder Gnomen hergestellt. Die zehn Metallmaterialien `Bronze`, `Eisen`, `Feineisen`, `Stahl`, `Qualitaetsstahl`, `Faltstahl`, `Mithril`, `Adamandit`, `Alchemistensilb.` und `Nasium` erhalten `AUSWAHL: Dalkini, Draw, Elfen, Goblins, Orks, Trolle, Zwerge`. `Diamantspat` wird Draw zugewiesen, `Schwarzfels` und `Vulkanglas` Indianern und Katzen, `Kolharz` sowie die Bespannung `Kohlharz` Zentauren und `Goblin Massenfab.` Goblins. Die übrigen 18 Schildkomponenten erhalten `ALLE`.
31. Die Schildfertigung verwendet folgende bestätigte Grundverfügbarkeiten: `Ausschuss`, `Goblin Massenfab.`, `Massenfabrikation` und `Gesellenarbeit` jeweils AW/NW `1/1`; `Meisterarbeit` `2/3`; `Großmeisterarbeit` `3/5`; `Einzelstück` `7/7`.
32. Die globale Materialreferenz gilt verbindlich für Waffen, Schilde und alle daraus abgeleiteten Komponenten. Sie verwendet folgende bestätigte Grundverfügbarkeiten (AW/NW): `Holz 1/1`, `Hartholz 2/2`, `Leder 1/1`, `Spinnenwebe 4/4`, `Chitin 5/2`, `Drachenschuppe M/M`, `Stein 1/1`, `Schwarzfels 5/1`, `Diamantspat 7/7`, `Bronze 1/1`, `Eisen 1/1`, `Feineisen 1/1`, `Stahl 1/2`, `Qualitätsstahl 2/4`, `Faltstahl 3/5`, `Mithril 7/7`, `Adamandit M/M`, `Alchemistensilber 5/6`, `Vulkanglas 7/3`, `Nasium 7/7`, `Knochen 1/1`, `Kolharz 5/7`. Mithril und Nasium werden ausschließlich Elfen und Zwergen zugewiesen, Spinnenwebe ausschließlich Draw, Kolharz ausschließlich Zentauren und Alchemistensilber ausschließlich Dalkini, Elfen, Goblins, Orks und Zwergen. Für alle übrigen Metalle gilt die allgemeine Herstellerliste ohne Katzen, Indianer, Zentauren und Gnome.
33. Die fünf Schildbespannungen sind vollständig bestätigt: `Stoff 1/1 ALLE`, `Leder 1/1 ALLE`, `Spinnenwebe 4/4 Draw`, `Kohlharz 4/4 Zentauren` und `Drachenschuppe M/M ALLE`.
34. Die bestätigten Herstellerregeln der gleichnamigen Schildmaterialien gelten auch für alle 19 Waffenmaterialien. Mithril und Nasium werden Elfen und Zwergen zugewiesen, Alchemistensilber Dalkini, Elfen, Goblins, Orks und Zwergen, Diamantspat Draw, Schwarzfels und Vulkanglas Indianern und Katzen sowie Kolharz Zentauren. Für die übrigen Metalle gilt die allgemeine Metallliste ohne Katzen, Indianer, Zentauren und Gnome; Holz, Knochen, Stein, Leder, Hartholz und Chitin gelten für `ALLE`. Auch hier werden `Kolhartz` zu `Kolharz` und `Schwarzfells` zu `Schwarzfels` korrigiert.
35. Die sieben Waffenfertigungen übernehmen Verfügbarkeit und Herstellerzuweisung vollständig von der bestätigten Schildfertigung: `Ausschuss`, `Goblin Massenfab.`, `Massenfabrikation` und `Gesellenarbeit` jeweils AW/NW `1/1`; `Meisterarbeit 2/3`; `Großmeisterarbeit 3/5`; `Einzelstück 7/7`. Nur `Goblin Massenfab.` ist auf Goblins beschränkt; alle anderen Fertigungen gelten für `ALLE`.
36. Die drei Waffenanpassungen übernehmen die bestätigten Rüstungswerte: `Von der Stange 1/1`, `angepasst 2/3`, `Perfekt angepasst 3/5`; alle drei gelten für `ALLE`.
37. Die 15 Waffenschaftvarianten übernehmen Verfügbarkeit und Herstellerzuweisung aus der globalen Materialreferenz; `Verstärkt` und `Voll` verändern die Verfügbarkeit nicht. Es gelten: `Standard 1/1 ALLE`, `Eisen Verstärkt/Voll 1/1`, `Stahl Verstärkt/Voll 1/2`, `Qualitätsstahl/Voll 2/4`, `Faltstahl Verstärkt/Voll 3/5`, `Mithril Verstärkt/Voll 7/7` nur für Elfen und Zwerge, `Adamandit Verstärkt/Voll M/M` sowie `Bronze Verstärkt/Voll 1/1`. Für die nicht eigens eingeschränkten Metalle gilt die allgemeine Metallliste ohne Katzen, Indianer, Zentauren und Gnome. `Adamandit Verst.` und `Adamantit Voll` werden zu `Adamandit Verstärkt` und `Adamandit Voll` normalisiert.
38. Die 17 Waffenbasis-Zeilen mit Unbewaffnet-Varianten, Biss, Huftritt, Boxen, Elfischer Kunst der Selbstverteidigung, Goblinischer Kampfkunst, Katzenmenschen-Kampfkunst, Orkisch' Raufen, Ringen und Schattenkampf sind natürliche Angriffe oder Kampfstile und keine kaufbare Ausrüstung. Sie erhalten den Verfügbarkeitsstatus `NICHT KAUFBAR` und werden aus Ausrüstungskäufen sowie Ortsverfügbarkeit ausgeschlossen. Ihre vorhandenen Speziesangaben bleiben als Anwendungsbeschränkung erhalten und werden auf die kanonischen Pluralnamen sowie `Draw` normalisiert; `andere Voelker` wird als `Dalkini, Draw, Elfen, Goblins, Indianer, Zwerge` ausgeschrieben.
39. Von den 226 kaufbaren Waffenbasis-Zeilen werden 18 ausdrücklich kulturell benannte Waffenmodelle der genannten Spezies zugewiesen. Wegen der doppelten Fertigkeitsführung von `Armklingen elfisch` und `Bat'leth orkisch` belegen diese Modelle 20 Datenzeilen: drei Elfen-, zehn Ork-, zwei Zwergen-, eine Goblin- und vier Trollzeilen. Die übrigen 206 Waffenbasis-Zeilen gelten für `ALLE`. `Trolltöter Widerhaken` bleibt ausdrücklich `ALLE`, weil Troll hier das Ziel und nicht den Hersteller bezeichnet.
40. Alle 226 kaufbaren Waffenbasis-Zeilen erhalten die bestätigte Grundverfügbarkeit AW/NW `1/1`. Die Basis bildet nur die Waffenform ab; Seltenheit entsteht durch Material, Fertigung, Anpassung, Schaftmaterial, Spezieszuweisung, Ort und Händler. Die 17 natürlichen Angriffe und Kampfstile bleiben `NICHT KAUFBAR`.

## Verfügbarkeitsskala

| Wert | Bedeutung |
|---:|---|
| 1 | Immer |
| 2 | Fast immer |
| 3 | Häufig |
| 4 | Selten |
| 5 | Fast nie |
| 6 | Nie |
| 7 | Einzigartig |
| M | Nur im Meister-Modul verfügbar |

Alle numerisch berechneten Verfügbarkeiten werden auf den Bereich `1..7` begrenzt. `M` nimmt nicht an numerischen Berechnungen teil und bleibt `M`.

Zentrale Kaufsperre:

| Effektive Verfügbarkeit | Spielerkauf |
|---|---|
| `1–4` | erlaubt |
| `5–7` | gesperrt |
| `M` | gesperrt; ausschließlich im Meister-Modul verfügbar |
| leer / `OFFEN` | gesperrt; sichtbarer Hinweis auf fehlende Datenpflege |

Die Kaufsperre wird erst nach allen anwendbaren Modifikatoren und der Begrenzung des numerischen Ergebnisses auf `1..7` geprüft. Sie gilt einheitlich für Charaktererschaffung und spätere Käufe sowie für Waffen, Rüstungen, Schilde, Preislistenartikel und Artefakte.

## Transparente Behandlung fehlender Werte

`0` ist kein zulässiger Ersatzwert: Es läge außerhalb der Skala und würde gleichzeitig besser als `1 = Immer` wirken.

Stattdessen erhält jeder Verfügbarkeitswert zusätzlich einen Bearbeitungsstatus:

- `BESTÄTIGT`: vorhandener oder ausdrücklich abgenommener Regelwert,
- `ABGELEITET`: nach einer bestätigten Regel berechneter Vorschlag,
- `OFFEN`: noch kein Regelwert vorhanden,
- `SONDERFALL`: vorhandener nichtnumerischer Wert, der gesondert geklärt werden muss.

Ergänzende Prüffelder:

- `Quelle`
- `Quellzeile`
- `Prüfnotiz`
- `Bearbeitungsstatus`

Ein offener Wert darf in der Datenpflege nie stillschweigend zu `1`, `4` oder einem anderen Regelwert werden.

## Völkerzuweisung für Ausrüstung

Für die Datenpflege werden keine getrennten Datentypen für Einfach- und Mehrfachauswahl benötigt. Empfohlen wird:

```text
voelkerModus: ALLE | AUSWAHL
voelker: Liste von Völker-IDs
voelkerStatus: BESTÄTIGT | ABGELEITET | OFFEN
voelkerNotiz: optional
```

Regeln:

- `ALLE`: Der Gegenstand ist keinem einzelnen Herstellervolk zugeordnet; `voelker` bleibt leer.
- `AUSWAHL` mit genau einem Eintrag: einfache Zuweisung.
- `AUSWAHL` mit mehreren Einträgen: Mehrfachzuweisung.
- Leere `AUSWAHL` ist ungültig.
- Freitext-Völker sind nicht zulässig; die Auswahl erfolgt aus der zentralen Völkerliste.
- `OFFEN` ist ein Datenpflegestatus und kein Volk.

Bei zusammengesetzter Ausrüstung werden Basis und kaufrelevante Komponenten getrennt zugewiesen und berechnet.

Die Völkerzuweisung bezeichnet kulturelle beziehungsweise herstellerseitige Herkunft. Sie ist keine Benutzungsbeschränkung.

## Kompositionsregel

1. Für jede gewählte Pflichtkomponente wird die effektive Verfügbarkeit separat berechnet. Dabei gelten jeweils Grundwert, Ort, Völkerabgleich, lokale Produktion und alle weiteren anwendbaren Regeln.
2. Optionale, nicht gewählte Komponenten werden ignoriert.
3. Das schlechteste Ergebnis der gewählten Komponenten bestimmt die Verfügbarkeit des fertigen Gegenstands.

| Komponentenergebnisse | Endergebnis |
|---|---|
| ausschließlich numerische Werte | höchster numerischer Wert |
| mindestens eine Komponente `M`, keine Komponente `OFFEN` | `M` |
| mindestens eine Komponente `OFFEN` | `OFFEN` |

- Verfügbarkeiten werden weder addiert noch gemittelt.
- Alle Komponenten, die zur Kaufsperre beitragen, werden in der Oberfläche als Ursachen angezeigt.
- Eine Meisterfreigabe gilt für die konkrete vollständige Konfiguration und protokolliert zusätzlich die blockierenden Komponenten.
- Diese Regel vereinheitlicht die bereits bei Rüstungen verwendete Maximumsbildung für Waffen, Rüstungen und Schilde und erweitert sie um die vollständige Einzelberechnung jeder Komponente.

## Ortsmodell

```text
Ort
- id
- name *
- welt: AW | NW
- region
- siedlungsgroesse
- spezies:
  - hauptspezies
  - etablierteMinderheiten[]
- handelsstufe
- herstellungsort
- haendler[]
- lokaleProduktion[]
- erstelltAm
- aktualisiertAm
```

Nur `name` ist derzeit ausdrücklich als Pflichtfeld bestätigt. Für Dropdownfelder sollen feste Werte verwendet werden. `Region` bleibt vorläufig Freitext, bis eine vollständige Regionsliste existiert.

### Spezies eines Ortes

- Die erste Nennung ist die Hauptspezies.
- Weitere Nennungen sind etablierte Minderheiten und behalten ihre Reihenfolge.
- Die Einwohnerliste ist nicht dasselbe wie die Völkerzuweisung eines Gegenstands.
- Alle etablierten Minderheiten wirken regeltechnisch gleich; ihre Reihenfolge ist nur für die Anzeige relevant.
- Bei mehreren Völkerzuweisungen eines Gegenstands gilt die beste Übereinstimmung.

Bestätigte additive Modifikatoren:

| Völkerzuweisung des Gegenstands | Übereinstimmung am Ort | Modifikator |
|---|---|---:|
| `ALLE` | unabhängig von der Ortsbevölkerung | 0 |
| `AUSWAHL` | mindestens eine Zuweisung entspricht der Hauptspezies | 0 |
| `AUSWAHL` | keine Hauptspezies, aber mindestens eine etablierte Minderheit | +1 |
| `AUSWAHL` | keine zugewiesene Spezies ist am Ort vertreten | +3 |

### Lokale Produktion

```text
LokaleProduktion
- warengruppe: Warengruppen-ID
- volk: Völker-ID | null
```

- Keine Nennung bedeutet: kein Override.
- Mehrere Einträge sind zulässig.
- Die Warengruppe wird über dieselbe zentrale Dropdownliste gewählt, die auch für spezialisierte Händler und Gegenstände gilt.
- Ein optionales Volk beschreibt die konkrete kulturelle Produktion, beispielsweise `NK-Waffen: Zwerge`.
- Ohne Volksangabe greift das Override für alle Gegenstände der gewählten Warengruppe.
- Mit Volksangabe greift es nur, wenn die Warengruppe übereinstimmt und das angegebene Volk in der Völkerzuweisung des Gegenstands enthalten ist.
- Bei einem Treffer ersetzt der Modifikator `Herstellung direkt vor Ort` den allgemeinen Herstellungsortmodifikator des Ortes.
- Der Override wird nicht zusätzlich zum allgemeinen Herstellungsortmodifikator addiert.
- Ein Gegenstand mit `voelkerModus: ALLE` erfüllt keinen auf ein konkretes Volk eingeschränkten Produktionseintrag; dafür ist ein Produktionseintrag ohne Volksangabe erforderlich.

## Kontrollierte Ortsausprägungen

### Welt

- AW
- NW

### Siedlungsgröße

- Wildnis
- Ansiedlung
- Dorf
- Großes Dorf
- Kleinstadt
- Stadt
- Großstadt
- Metropole

`Metropole` ersetzt vorläufig die Bezeichnung `Hauptstadt` des Entwurfs v0.3.

Bestätigte additive Modifikatoren:

| Siedlungsgröße | Rüstungen/Waffen | Artefakte |
|---|---:|---:|
| Wildnis | +3 | +5 |
| Ansiedlung | +2 | +4 |
| Dorf | +1 | +3 |
| Großes Dorf | 0 | +2 |
| Kleinstadt | -1 | +1 |
| Stadt | -2 | 0 |
| Großstadt | -3 | -1 |
| Metropole | -4 | -2 |

### Handelsstufe

- Völlig abgelegen von jeglichem Handel
- Abgelegen von jeglichem Handel
- Handelsroute / Kleiner Handels-Hafen
- Handelsstadt / Großer Handels-Hafen
- Handelszentrum

Bestätigte additive Modifikatoren:

| Handelsstufe | Rüstungen/Waffen | Artefakte |
|---|---:|---:|
| Völlig abgelegen von jeglichem Handel | +2 | +3 |
| Abgelegen von jeglichem Handel | +1 | +2 |
| Handelsroute / Kleiner Handels-Hafen | 0 | +1 |
| Handelsstadt / Großer Handels-Hafen | -1 | 0 |
| Handelszentrum | -2 | -1 |

### Herstellungsort

- Import, wird nicht hergestellt
- Teilweiser Import, Herstellung im Reich
- Herstellung im Reich
- Herstellung in der Region
- Herstellung direkt vor Ort

Bestätigte additive Modifikatoren:

| Herstellungsort | Rüstungen/Waffen | Artefakte |
|---|---:|---:|
| Import, wird nicht hergestellt | +2 | +3 |
| Teilweiser Import, Herstellung im Reich | +1 | +2 |
| Herstellung im Reich | 0 | +1 |
| Herstellung in der Region | -1 | 0 |
| Herstellung direkt vor Ort | -2 | -1 |

### Händler

- Kein Laden / kein Händler
- Fahrender Trödelhändler
- Fahrender spezialisierter Händler
- Kleiner General Store
- Großer General Store
- Kleiner spezialisierter Händler
- Spezialisierter Händler
- Großer spezialisierter Händler

Bestätigte additive Modifikatoren:

| Händler | Rüstungen/Waffen | Artefakte |
|---|---:|---:|
| Kein Laden / kein Händler | +3 | +5 |
| Fahrender Trödelhändler | +2 | +4 |
| Fahrender spezialisierter Händler | +1 | +2 |
| Kleiner General Store | +1 | +3 |
| Großer General Store | 0 | +2 |
| Kleiner spezialisierter Händler | 0 | +1 |
| Spezialisierter Händler | -1 | 0 |
| Großer spezialisierter Händler | -2 | -1 |

Regeln zur Spezialisierung:

```text
HaendlerAmOrt
- typ
- warengruppe: Warengruppen-ID | null
```

- Ein Ort kann beliebig viele Händlerdatensätze besitzen.
- Bei `Fahrender spezialisierter Händler`, `Kleiner spezialisierter Händler`, `Spezialisierter Händler` und `Großer spezialisierter Händler` ist `warengruppe` ein Pflichtfeld.
- Das Feld wird als Dropdown aus einer zentral gepflegten Liste der Warengruppen dargestellt.
- Ein spezialisierter Händler erhält seinen Tabellenmodifikator nur für die gewählte Warengruppe.
- Für nicht spezialisierte Händler bleibt `warengruppe` leer (`null`) und der Händler ist auf alle Warengruppen anwendbar.
- Für einen Kauf werden alle auf die Warengruppe anwendbaren Händler ermittelt. Es gilt der niedrigste ihrer Modifikatoren.
- Gibt es keinen anwendbaren Händler, wird der Modifikator von `Kein Laden / kein Händler` verwendet.
- Die Warengruppe eines kaufbaren Gegenstands muss aus derselben zentralen Liste stammen, damit die Spezialisierung eindeutig geprüft werden kann.
- Die initiale Dropdownliste wird aus den tatsächlich vorhandenen Preislistenarten sowie `NK-Waffen`, `Fernkampfwaffen`, `Feuerwaffen`, `Rüstungen`, `Schilde` und `Artefakte` gebildet. Die spätere Datenpflege darf keine freien Schreibvarianten erzeugen.
- Alle 43 so ermittelten Warengruppen bleiben zunächst unter ihrem vorhandenen Namen erhalten; es findet keine Zusammenfassung oder Umbenennung statt.
- Jede Warengruppe besitzt `haendlerSpezialisierbar: boolean`.
- `Miete`, `Post`, `Reisekosten`, `Tavernen-Preise` und `Zoll` erhalten `haendlerSpezialisierbar: false`.
- Die übrigen 38 Warengruppen erhalten `haendlerSpezialisierbar: true`.
- Das durchsuchbare Händler-Dropdown zeigt ausschließlich Warengruppen mit `haendlerSpezialisierbar: true`.
- Preislistenartikel übernehmen zunächst ihre vorhandene `Art` als Warengruppe. Waffen, Rüstungen, Schilde und Artefakte erhalten die festgelegte Warengruppe ihres Ausrüstungsmoduls.

Die Prozentfaktoren des alten W100-Systems werden nicht übernommen.

## Beispielorte

### Straitmor

- Welt: NW
- Region: Orkisches Protektorat Straitmor
- Siedlungsgröße: Metropole
- Hauptspezies: Orks
- Etablierte Minderheiten: Zwerge, Goblins
- Handelsstufe: Handelszentrum
- Herstellungsort: Teilweiser Import, Herstellung im Reich
- Händler:
  - Spezialisierter Händler: Sklaven
  - Spezialisierter Händler: Feuerwaffen
  - Spezialisierter Händler: Rüstungen
  - Spezialisierter Händler: NK-Waffen
  - Spezialisierter Händler: Edelsteine
  - Spezialisierter Händler: Metall
- Lokale Produktion:
  - Feuerwaffen: Orks
  - Rüstungen
  - NK-Waffen

### Zwogón

- Welt: AW
- Region: Großkönigliche Kernprovinz Zwogón
- Siedlungsgröße: Metropole
- Hauptspezies: Zwerge
- Etablierte Minderheiten: Orks, Elfen, Gnome
- Handelsstufe: Handelszentrum
- Herstellungsort: Herstellung direkt vor Ort
- Händler: 38 große spezialisierte Händler; je einer für jede händlerspezialisierbare Warengruppe
- Lokale Produktion: keine Overrides

### Phoenix-Feste

- Welt: NW
- Region: Neuweltliches Protektorat Neu-Zwogón
- Siedlungsgröße: Dorf
- Hauptspezies: Zwerge
- Etablierte Minderheiten: Indianer
- Handelsstufe: Handelsroute / Kleiner Handels-Hafen
- Herstellungsort: Import, wird nicht hergestellt
- Händler: Kleiner General Store
- Lokale Produktion:
  - NK-Waffen: Zwerge
  - Rüstungen

## Herkunft im Charakter

Der Charakter speichert künftig mindestens:

```text
herkunftOrtId
herkunftSnapshot:
- name
- region
- welt
```

Der Snapshot stellt sicher, dass die gedruckte Herkunft stabil bleibt, wenn ein Ort später umbenannt oder gelöscht wird.

### Charaktererschaffung

- `Herkunft` ist über Dropdown auswählbar.
- Eine zusätzliche Formularoption erlaubt das Anlegen eines neuen benannten Ortes.
- Während der Charaktererschaffung ist der Herkunftsort zugleich der Einkaufsort.
- Das bisherige Feld `Heimat` wird ersetzt.
- Das bisherige Headerfeld `Region`, das technisch nur AW/NW enthält, entfällt als eigenständige Eingabe.

### Gedruckter Header

Ausgabeformat:

```text
Straitmor, Orkisches Protektorat Straitmor, NW
```

Es werden keine Siedlungsgröße, Spezies, Handelsstufe, Herstellungsort, Händler oder Produktionsdetails im gedruckten Charakterheader ausgegeben.

## Lokale Persistenz

Vordefinierte Orte können als Client-Konstanten ausgeliefert werden. Neu angelegte oder geänderte Orte werden lokal gespeichert.

Empfohlene Trennung:

```text
nasus:locations                 Index der Orte
nasus:location:<id>            vollständiger Ortsdatensatz
nasus:location-snapshots       Index der Abenteuer-Ortszustände
nasus:location-snapshot:<id>   vollständiger Abenteuer-Ortszustand
nasus:characters               vorhandener Charakterindex
nasus:character:<id>           vollständiger Charakterdatensatz
```

Zugriffe sollen hinter einer kleinen Repository-/Storage-Schnittstelle liegen, damit nach App 1.0 ein Server angebunden werden kann, ohne UI und Regelberechnung neu zu schreiben.

## Meister-Modul

Das Meister-Modul muss ermöglichen:

- vorhandene Orte auszuwählen,
- neue Orte anzulegen,
- alle Ortsstellschrauben zu bearbeiten,
- lokale Produktionseinträge hinzuzufügen, zu ändern und zu entfernen,
- Orte vor oder nach einem Abenteuer zu aktualisieren,
- Änderungen dauerhaft lokal zu speichern,
- einen Ort als aktuellen Einkaufsort festzulegen,
- vordefinierte Ausgangswerte wiederherzustellen, ohne benutzerdefinierte Orte zu verlieren.

### Persistenter Ort und Abenteuer-Ortszustand

```text
AbenteuerOrtszustand
- id
- ortId
- abenteuerName optional
- status: AKTIV | ABGESCHLOSSEN
- ortsdaten: vollständige Kopie aller Ortsstellschrauben
- erstelltAm
- aktualisiertAm
- abgeschlossenAm optional
```

- Jeder Ort besitzt einen persistenten Grundzustand, den das Meister-Modul jederzeit direkt bearbeiten kann.
- Zu Abenteuerbeginn kann optional ein vollständiger Abenteuer-Ortszustand aus dem aktuellen Grundzustand erzeugt werden.
- Während ein Abenteuerzustand aktiv ist, gelten Änderungen nur für diese Kopie.
- Ein Kauf verwendet für den gewählten Ort den aktiven Abenteuerzustand; existiert keiner, wird der persistente Grundzustand verwendet.
- Nach dem Abenteuer kann der Meister den Abenteuerzustand verwerfen, unverändert weiterführen oder ausdrücklich als neuen persistenten Grundzustand übernehmen.
- Die Übernahme ist eine bewusste Aktion und darf nicht automatisch beim Abschluss erfolgen.
- Bereits abgeschlossene Käufe speichern ihre verwendete Ortsversion beziehungsweise Berechnungsgrundlage und werden durch spätere Ortsänderungen nicht rückwirkend verändert.

### Meisterfreigabe eines Gegenstands

```text
Meisterfreigabe
- id
- charakterId
- gegenstandId
- variantenKonfiguration optional
- ortId
- effektiveVerfuegbarkeit: 5 | 6 | 7 | M
- zeitpunkt
- begruendung optional
```

- Eine Freigabe gilt nur für den konkreten Kauf beziehungsweise die konkrete Vergabe.
- Sie ändert weder die Stammdaten des Gegenstands noch die Daten oder Modifikatoren des Ortes.
- Gegenstände mit effektiver Verfügbarkeit `5–7` oder `M` können im Meister-Modul ausdrücklich freigegeben und einem Charakter hinzugefügt werden.
- Ein leerer beziehungsweise mit `OFFEN` markierter Wert kann nicht übersteuert werden. Vor einer Vergabe muss ein echter Verfügbarkeitswert gepflegt werden.
- Die protokollierte effektive Verfügbarkeit ist der Wert nach allen Ortsmodifikatoren und der Begrenzung auf `1..7`; `M` bleibt `M`.

Die Herkunft eines Charakters und der aktuelle Einkaufsort sind getrennte Konzepte. Die Herkunft bleibt im Header; spätere Käufe dürfen an einem anderen Ort stattfinden.

## Einheitliche Berechnungsstruktur

Einheitliche Struktur:

```text
Grundwert 1..7
+ Modifikator Siedlungsgröße
+ Modifikator Handelsstufe
+ Herstellungsortmodifikator:
  - passendes lokales Produktions-Override → Herstellung direkt vor Ort
  - sonst → allgemeiner Herstellungsort des Ortes
+ niedrigster Modifikator aller anwendbaren Händler; ohne Treffer `Kein Laden / kein Händler`
+ Modifikator Völkerzuweisung/Ortsbevölkerung
= effektive Verfügbarkeit, begrenzt auf 1..7
→ zentrale Kaufsperre prüfen: Spieler dürfen nur 1..4 kaufen
```

AW/NW bestimmt den für den Ort anzuwendenden Grundwert. Ruhm und Völkerbeziehungen dürfen in dieser Formel nicht vorkommen.

### Artefakte in NW

Für kaufbare einmalige und permanente Artefaktvarianten wird der vorhandene Listenwert als AW-/Grundverfügbarkeit behandelt:

| Artefaktgrad | NW-Modifikator |
|---:|---:|
| 1–2 | +0 |
| 3–5 | +1 |
| 6–7 | +2 |

Berechnung:

```text
Verfügbarkeit AW = vorhandener numerischer Listenwert
Verfügbarkeit NW = min(7, Verfügbarkeit AW + NW-Modifikator nach Grad)
```

Der vorhandene Wert `Meister` wird als kanonisches `M` geführt. `M` bleibt in AW und NW unverändert und ist ausschließlich im Meister-Modul verfügbar.

Die fachlichen Systementscheidungen dieses Abschnitts sind geklärt. Offen bleibt die inhaltliche Datenpflege der noch nicht bewerteten Ausrüstungsgegenstände und Völkerzuweisungen.

## Vorhandene Rüstungsverfügbarkeiten

Es liegen 28 Datensätze vor:

- 20 Rüstungsbasen,
- 4 Verarbeitungsstufen,
- 4 Anpassungsstufen.

Alle 28 besitzen numerische AW- und NW-Werte von 1 bis 7.

Für alle 28 ist die Völkerzuweisung bestätigt:

```text
Kettenrüstungen (6 Basen):
  voelkerModus: AUSWAHL
  voelker: [Dalkini, Draw, Elfen, Goblins, Orks, Zwerge]

Metallplattenrüstungen (6 Basen):
  voelkerModus: AUSWAHL
  voelker: [Dalkini, Draw, Elfen, Goblins, Orks, Trolle, Zwerge]

Übrige Rüstungsbasen (8), Verarbeitung (4), Anpassung (4):
  voelkerModus: ALLE
  voelker: []

Alle:
  voelkerStatus: BESTÄTIGT
```

Erkennbares Muster:

- einfache Stoff-, Leder- und Eisenrüstungen sind in AW und NW überwiegend gleich,
- Stahl ist in NW regelmäßig um 1 Stufe schlechter als in AW,
- Faltstahl ist in NW regelmäßig um 2 Stufen schlechter als in AW,
- Meisterarbeit und angepasste Rüstung sind in NW um 1 Stufe schlechter,
- Großmeisterarbeit und perfekte Anpassung sind in NW um 2 Stufen schlechter,
- Einzelstücke sind in beiden Welten 7,
- die zusammengesetzte Rüstungsverfügbarkeit wird derzeit als Maximum aus Basis, Verarbeitung und Anpassung gebildet.

Die vollständigen Einzelwerte stehen in der begleitenden Excel-Arbeitskopie.

## Vorhandene Artefaktverfügbarkeiten

Es liegen 399 Gradzeilen vor.

- 350 einmalige Varianten besitzen einen Preis und eine numerische Verfügbarkeit.
- Bei 49 Gradzeilen fehlen sowohl einmaliger Preis als auch einmalige Verfügbarkeit; diese einmaligen Varianten sind nicht kaufbar und daher keine offenen Verfügbarkeitslücken.
- Alle 399 permanenten Varianten besitzen einen Preis.
- Permanente Artefakte: 350 numerische Werte; 49-mal der Meisterwert `Meister`, der kanonisch als `M` geführt wird.
- Die 49 Sonderfälle gehören zu sieben Attributs-Artefakten mit jeweils sieben Graden.
- Die aktuelle App prüft beim Artefaktkauf nur den Preis, nicht die Verfügbarkeit.

`Meister` wird nicht in eine Zahl umgewandelt, sondern als `M` normalisiert. Diese 49 Varianten sind nur im Meister-Modul verfügbar.

Die Völkerzuweisung wird an den 57 Artefakt-Grunddatensätzen gepflegt und von allen Graden sowie einmaligen und permanenten Varianten geerbt:

```text
voelkerModus: AUSWAHL
voelker: [Draw, Elfen, Gnome, Goblins, Orks, Zwerge]
voelkerStatus: BESTÄTIGT
```

## Claude-Implementierungsauftrag nach fachlicher Abnahme

Claude soll erst nach Bestätigung aller offenen Regelwerte:

1. das Ortsdatenmodell und seine kontrollierten Auswahllisten implementieren,
2. `Heimat` durch `Herkunft` ersetzen und bestehende Charakterdaten migrieren,
3. Herkunftsauswahl und Ortsformular in die Charaktererschaffung einbauen,
4. im gedruckten Header ausschließlich `Ort, Region, AW/NW` ausgeben,
5. lokale persistente Speicherung für Orte und Charaktere bereitstellen,
6. das Meister-Modul zur Ortsverwaltung implementieren,
7. alle kaufbaren Ausrüstungsdatensätze mit Verfügbarkeit und Völkerzuweisung versehen,
8. eine zentrale Verfügbarkeitsberechnung für alle Kaufpfade verwenden,
9. insbesondere Artefaktkäufe anhand der Verfügbarkeit sperren,
10. offene und Sonderfall-Daten sichtbar melden und niemals stillschweigend als verfügbar behandeln,
11. Migrationstests, Berechnungstests, Kaufpfadtests und Persistenztests ergänzen.

## Nicht umsetzen, solange offen

- keine Einträge oder Massenwerte in `werte 0.8-claude.xlsx`,
- keine erfundenen Standardverfügbarkeiten,
- keine Verwendung von `0` als Platzhalter,
- keine Ruhm- oder Völkerbeziehungsmodifikatoren,
- keine Übernahme der alten W100-Faktoren,
- keine numerische Umdeutung von `Meister`.
