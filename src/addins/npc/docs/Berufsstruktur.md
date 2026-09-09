# NPC-Erstellung: Berufe, Professionsgüte und Amt

Stand: 9. September 2026. Die 30 festen Berufe sind vom Nutzer als Draft angenommen. Fertigkeitszuordnung und Schwerpunkte sind Ausarbeitungsvorschläge. Der Generator ist noch nicht implementiert.

## Auswahlstruktur

- Direkte Auswahl eines der 30 Berufe; ersetzt den bisherigen Entwurf Berufsgruppe → Unterberuf.
- Professionsgüte separat auswählen. Optional Zweitberuf mit eigener Güte; gemeinsame Fertigkeiten zusammenführen und tatsächliche Endkosten nur einmal berechnen.
- Schwerpunkte konkretisieren den Beruf, ohne weitere feste Berufe einzuführen.
- Amt als unabhängigen Vektor ergänzen; siehe [Amt](Amt.md). Beruf, Amt, militärischer Rang, soziale Lage und Rechtsstand bleiben getrennt.
- Magieform, Ausrichtung, Religion und Weihe bleiben eigene Auswahlen. Heiler erhalten nicht automatisch Magie.

Beispiel: **Wache · Meister · Amt: Sheriff**. Andere berufliche Hintergründe sind ebenfalls möglich.

## Die 30 festen Berufe

Die WHK-Namen wurden gegen `src/data/rules-jsonl/whk.jsonl` geprüft. Die Zuordnung ist ein Vorschlag für Bausteine, keine Pflichtkaufliste. Bei Alternativen die zum Schwerpunkt passende Ausbildung wählen. Schwerpunkte sind erzählerische Ausrichtungen, keine Behauptung gleichnamiger Regelspezialisierungen.

| Nr. | Beruf | Kern (WHK, sofern nicht anders angegeben) | Mögliche Nebenfertigkeiten (WHK) | Schwerpunkte / Aufgabe im Abenteuer |
|---:|---|---|---|---|
| 1 | Wache | Ermittlung, Rechtskunde | Führung, Etikette | Tor-, Stadt-, Leibwache; Kontrollen und Schutz |
| 2 | Soldat | Militärtheorie; Kampf separat | Überleben, Führung | Infanterist, Musketier, Kavallerist, Artillerist |
| 3 | Kopfgeldjäger | Ermittlung, Überleben | Rechtskunde, Jäger | Gesuchte aufspüren, verfolgen und überstellen |
| 4 | Revolverheld | Schusswaffenausbildung separat | Feuerwaffenbauer, Ermittlung | Duellist, Begleitschutz, angeheuerter Schütze |
| 5 | Kundschafter | Überleben, Geografie | Ermittlung, Militärtheorie | Wege erkunden, Spuren deuten, Aufklärung |
| 6 | Jäger | Jäger, Überleben | Pflanzenkunde, Viehwirtschaft | Jagd, Fallen und Wildnisversorgung |
| 7 | Viehhirte | Viehwirtschaft, Abrichten | Überleben, Landwirtschaft | Viehtrieb, Pferdehaltung, gestohlene Tiere |
| 8 | Bauer | Landwirtschaft | Viehwirtschaft, Pflanzenkunde, Hauswirtschaft | Ackerbau, Obstbau; Höfe, Ernte und Vorräte |
| 9 | Prospektor | Geologie | Bergbau, Geografie, Überleben | Erz- und Goldsuche; Lagerstätten beurteilen |
| 10 | Bergmann | Bergbau | Geologie, Mechanikus | Stollen, Förderung und Gefahren unter Tage |
| 11 | Fuhrmann | Fuhrmann, Logistik | Abrichten, Mechanikus, Geografie | Frachtwagen, Postkutsche, Überlandtransporte |
| 12 | Matrose | Seefahrt | Seiler, Bootsbauer, Geografie | Decksdienst, Steuermann, Bootsmann; Reisen und Havarien |
| 13 | Schmuggler | Logistik, Diebeskunst | Kaufmann, Rechtskunde; Fuhrmann oder Seefahrt | Heimliche Fracht und Grenzübertritte |
| 14 | Händler | Kaufmann | Buchhaltung, Rechtskunde, Wirtschaftslehre | Krämer, Großhandel, Wanderhandel; Waren und Kontakte |
| 15 | Wirt | Gastgewerbe | Koch, Hauswirtschaft, Buchhaltung | Saloon, Herberge; Unterkunft und örtliche Informationen |
| 16 | Journalist | Ermittlung, Schriftstellerei | Fotografie, Drucker, Rechtskunde | Reporter, Herausgeber; Nachforschungen und Enthüllungen |
| 17 | Künstler | Musizieren, Schauspielkunst oder Tänzer | Schriftstellerei, Etikette | Musiker, Schauspieler, Schausteller; Auftritte und Ablenkung |
| 18 | Dieb | Diebeskunst | Ermittlung, Kaufmann | Taschendieb, Einbrecher; Zugänge erkunden und Beute beschaffen |
| 19 | Glücksspieler | Spielpraxis und Menschenkenntnis; genaue Regelabbildung offen | Schauspielkunst; Diebeskunst bei Falschspiel | Kartenspieler, Falschspieler; Spielschulden und Täuschung |
| 20 | Schmied | Schmied | Metallurgie, Gießer | Werkzeuge, Beschläge, allgemeine Metallreparaturen |
| 21 | Waffenschmied | Waffenschmied oder Feuerwaffenbauer | Schmied, Metallurgie, Mechanikus | Nahkampfwaffen oder Feuerwaffen; Herstellung und Wartung |
| 22 | Rüstschmied | Rüstungsschmied | Schmied, Metallurgie, Lederbearbeitung | Rüstungen herstellen, anpassen und reparieren |
| 23 | Mechaniker | Mechanikus | Physik, Schmied; Eisenbahner nach Schwerpunkt | Maschinen, Geräte, Eisenbahntechnik; Defekte und Sabotage |
| 24 | Zimmermann | Zimmerei, Holzbearbeitung | Architektur, Bootsbauer | Gebäude, Befestigungen und Holzreparaturen |
| 25 | Arzt | Medizin | Biologie, Chemie | Diagnose, Chirurgie, Behandlung von Krankheiten und Verletzungen |
| 26 | Heiler | Medizin, Pflanzenkunde | Biologie, Hauswirtschaft | Kräuter, Wundversorgung, traditionelle Behandlung; Magie separat |
| 27 | Alchemist | Alchemie | Chemie, Pflanzenkunde, Metallurgie | Stoffanalyse, Tränke, Gifte; konkrete Produkte regelabhängig |
| 28 | Magier | Magietheorie und separate magische Ausbildung | Passendes Wissensgebiet, Schriftstellerei | Funktion und Ausrichtung aus der Magieauswahl |
| 29 | Gelehrter | Fachgebiet, etwa Geschichte, Biologie oder Sprachwissenschaft | Schriftstellerei, passende weitere Wissensgebiete | Forscher, Übersetzer; Funde und Überlieferungen einordnen |
| 30 | Verwalter | Administration, Buchhaltung | Rechtskunde, Logistik, Führung | Orte, Betriebe, Güter; Akten und Ressourcen |

GF/SF, Waffen, Ausrüstung und gegebenenfalls Magie sind pro Baustein gesondert auszuarbeiten. WHK allein bilden die Kompetenz von Kampfberufen nicht ab. Waffenwartung beim Revolverhelden bedeutet keine automatische handwerkliche Meisterschaft. Magietheorie allein erzeugt keine Zauberfähigkeit. Beim Händler bleibt die vereinbarte zusätzliche Sprache auf Stufe 2 bestehen.

## Professionsgüte

| Güte | WHK-Wertebereich |
|---|---:|
| Laie | 0–4 |
| Geselle | 5–8 |
| Meister | 9–12 |
| Experte | 13–16 |
| Großmeister | 17–20 |
| Koryphäe | 21–24 |

Vorgeschlagene Anwendung: Die Güte legt den Zielbereich der beruflichen Kernfertigkeit fest, Nebenfertigkeiten liegen darunter. Sie ist unabhängig von Kreis, Amt, sozialer Lage und militärischem Rang. Kampf und Magie benötigen eigene Kompetenzziele; die WHK-Skala nicht ungeprüft übertragen.

## Nächste Ausarbeitung je Berufsbaustein

Ein erster [Ausrüstungsdraft für alle 30 Berufe](Berufsausruestung.md) ordnet vorhandene Artikel mit ihren Herstellungs-Spezialisierungen zu und benennt fehlende Arbeitsmittel. Konkrete Kampfbausteine und endgültige Mengen bleiben separat auszuarbeiten.

1. Alltag, Aufgabe im Abenteuer und Schwerpunkt konkretisieren.
2. Kernfertigkeiten mit Regelreferenzen und Ziel je Güte festlegen.
3. Wenige Nebenfertigkeiten und GF/SF ergänzen; schwache Bereiche zulassen.
4. Kampf- und gegebenenfalls Magieziele samt Voraussetzungen bestimmen.
5. Arbeitsmittel, Verbrauchsmittel und Waffenoptionen gemäß gemeinsamem Template zuordnen.
6. Beiträge aus Terrain, Lebenswelt, sozialer Lage und Zweitberuf zusammenführen; tatsächliche Endkosten einmal verbuchen.
7. Budgetverträglichkeit gegen Referenzen prüfen und unerfüllbare Anforderungen sichtbar machen.

Offen bleiben insbesondere die Regelabbildung des Glücksspielers, konkrete Spezialisierungen, Beiträge je Güte und Budgetkalibrierung. Noch keine automatische Punktevergabe aus diesem Draft ableiten. Die bisherigen sieben Rollenprofile bleiben Arbeitsbeispiele: Infanterist und Musketier sind Soldatenschwerpunkte, Kampfmagier eine Magierausrichtung.
