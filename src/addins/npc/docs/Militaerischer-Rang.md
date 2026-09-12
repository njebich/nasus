# NPC-Erstellung: Militärischer Rang

Stand: 12. September 2026. Bestätigtes Konzept für den künftigen NPC-Generator; noch nicht implementiert.

Militärischer Rang ist rein beschreibend. Er verändert keine Fertigkeiten, Eigenschaften, Budgets oder sonstigen berechneten Werte. Beruf, Amt/Dienststellung, soziale Lage und Rechtsstand bleiben unabhängig davon.

Standardauswahl: „Kein militärischer Rang“. Bei militärischer Auswahl bestimmt Heer/Infanterie, Kavallerie oder Marine die angebotenen Rangbezeichnungen. Die Liste ist eine vereinfachte Spielweltordnung mit Anlehnung an das 18. und 19. Jahrhundert, keine allgemeingültige historische Rangtabelle.

## Bestätigte Rangliste

Aufsteigend innerhalb der regulären Laufbahn; Rekrut und Kadett/Seekadett kennzeichnen Ausbildung.

| Ranggruppe | Heer / Infanterie | Kavallerie | Marine |
|---|---|---|---|
| Rekrutenausbildung | Rekrut | Rekrut | Rekrut |
| Mannschaften | Soldat | Reiter | Matrose |
| Erfahrene Mannschaften | Gefreiter | Gefreiter | Vollmatrose |
| Unteroffiziere | Korporal | Korporal | Maat |
| Unteroffiziere | Sergeant | Sergeant | Obermaat |
| Höhere Unteroffiziere | Feldwebel | Wachtmeister | Bootsmann |
| Höhere Unteroffiziere | Oberfeldwebel | Oberwachtmeister | Oberbootsmann |
| Offiziersausbildung | Kadett | Kadett | Seekadett |
| Niedrigste Offiziere | Fähnrich | Kornett | Noch keine zusätzliche Bezeichnung festgelegt |
| Untere Offiziere | Leutnant | Leutnant | Leutnant zur See |
| Untere Offiziere | Oberleutnant | Oberleutnant | Oberleutnant zur See |
| Hauptleute | Hauptmann | Rittmeister | Kapitänleutnant |
| Stabsoffiziere | Major | Major | Korvettenkapitän |
| Stabsoffiziere | Oberstleutnant | Oberstleutnant | Fregattenkapitän |
| Stabsoffiziere | Oberst | Oberst | Kapitän zur See |
| Generalität / Admiralität | Generalmajor | Generalmajor | Konteradmiral |
| Generalität / Admiralität | Generalleutnant | Generalleutnant | Vizeadmiral |
| Generalität / Admiralität | General | General | Admiral |
| Außerordentlicher Spitzenrang | Feldmarschall | Feldmarschall | Großadmiral |

Fähnrich und Kornett sind ausdrücklich niedrigste Offiziersränge unter Leutnant. Brigadier und Kommodore werden nicht aufgenommen.

## Zusatzangaben

Bei militärischer Auswahl erscheinen optionale Zusatzangaben als Dropdowns, nicht als Freitextfelder:

| Zusatzangabe | Auswahlstand |
|---|---|
| Einheit | Dropdown; bestätigter Katalog unten |
| Dienststellung | Dropdown; bestätigter Katalog unten; beschreibt die Funktion unabhängig vom Rang |
| Status | Aktiv, Reserve, ausgeschieden, desertiert |

Bei „Kein militärischer Rang“ werden die militärischen Zusatzangaben ausgeblendet. Die Dropdown-Vorgabe betrifft diese militärischen Zusatzangaben; die bedingten Freitextfelder des Rechtsstands bleiben wie vereinbart.

## Einheit – bestätigte Dropdown-Auswahl

Die Auswahl beschreibt den Verbandstyp, keinen individuellen Einheitsnamen wie „3. Kavallerieregiment“. Die Einträge sind Spielweltkategorien, keine durchgehende Größenskala; Marinestation bezeichnet beispielsweise eine Einrichtung. Leere Tabellenzellen sind keine Auswahloptionen.

| Heer / Infanterie | Kavallerie | Marine |
|---|---|---|
| Keine Zuordnung | Keine Zuordnung | Keine Zuordnung |
| Trupp | Trupp | Boot |
| Gruppe | Patrouille | Schiff |
| Zug | Zug | Schiffsdivision |
| Kompanie | Eskadron | Flottille |
| Bataillon | Regiment | Geschwader |
| Regiment | Brigade | Flotte |
| Brigade | Division | Marinestation |
| Division | Korps | Marineoberkommando |
| Korps | Armee | |
| Armee | Heeresgruppe | |
| Heeresgruppe | | |

## Dienststellung – bestätigte Dropdown-Auswahl

| Heer / Infanterie | Kavallerie | Marine |
|---|---|---|
| Keine besondere Dienststellung | Keine besondere Dienststellung | Keine besondere Dienststellung |
| Truppführer | Truppführer | Bootsführer |
| Gruppenführer | Patrouillenführer | Geschützführer |
| Zugführer | Zugführer | Wachoffizier |
| Stellvertretender Einheitsführer | Stellvertretender Einheitsführer | Zweiter Offizier |
| Kompaniechef | Eskadronchef | Erster Offizier |
| Bataillonskommandeur | Regimentskommandeur | Schiffskommandant |
| Regimentskommandeur | Brigadekommandeur | Flottillenchef |
| Brigadekommandeur | Divisionskommandeur | Geschwaderchef |
| Divisionskommandeur | Korpskommandeur | Flottenchef |
| Korpskommandeur | Armeekommandeur | Stationskommandant |
| Armeekommandeur | Oberbefehlshaber | Oberbefehlshaber |
| Oberbefehlshaber | Stabsoffizier | Stabsoffizier |
| Stabsoffizier | Adjutant | Adjutant |
| Adjutant | Quartiermeister | Quartiermeister |
| Quartiermeister | Ausbilder | Ausbilder |
| Ausbilder | | |

Rang und Dienststellung sind frei kombinierbar, ohne rangabhängige Sperren. Beispielsweise kann ein Leutnant vorübergehend eine Kompanie führen oder ein Hauptmann als Adjutant dienen. Fachaufgaben wie Arzt, Koch oder Handwerker werden weiterhin über die separate Berufsauswahl beschrieben.
