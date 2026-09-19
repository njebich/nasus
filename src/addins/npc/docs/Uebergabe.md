# NPC-Planung: Übergabeprotokoll

## Lese- und Fortschreibregel

- Neue Einträge immer direkt unter diesem Regelabschnitt einfügen, neueste zuerst. Datum und eine fortlaufende Nummer verwenden, damit die Reihenfolge auch am selben Tag eindeutig bleibt.
- Für einen neuen Chat von oben bis einschließlich des ersten vollständigen Eintrags mit Status **GELÖST** lesen. Am zugehörigen Marker **LESESTOPP** aufhören. Ältere Einträge darunter sind optionale Historie und müssen nicht gelesen werden.
- Ein GELÖST-Eintrag ist ein vollständiger Übergabestand: Er enthält alle weiterhin geltenden Entscheidungen, den Umsetzungs- und Prüfstand, offene Aufgaben, notwendige Quellen und den logisch nächsten Schritt. „Gelöst“ bezeichnet den abgeschlossenen Arbeitsschritt, nicht das gesamte NPC-Projekt.
- Laufende Arbeit als **OFFEN** oder **IN ARBEIT** oben ergänzen. Bei Abschluss einen neuen vollständigen GELÖST-Eintrag voranstellen; relevante Informationen aus dem bisherigen Stand übernehmen und überholte Aussagen im neuen Stand ersetzen. Ältere Einträge unverändert behalten, nicht löschen oder nachträglich umschreiben.
- Neuere Einträge haben Vorrang. Die Historie nur bei konkretem Rückfragebedarf lesen; verlinkte Fachunterlagen nach Bedarf öffnen. Keine offenen Aufgaben ausschließlich unterhalb des neuesten Lesestopps ablegen.
- Nach jedem abgeschlossenen Schritt den logisch nächsten konkret vorschlagen. Ein Vorschlag allein ist kein Ausführungsauftrag. Diese Regel steht auch in der [AGENTS.md](../../../../AGENTS.md).

## 2026-09-20 · 048 · GELÖST — Wirkung von „Rüstung verstärken“ wird vollständig berechnet

Die Wirkungstext-Auswertung berechnet nun auch Rechenausdrücke mit mehreren Divisionen, sobald zusätzlich ein eindeutiger Rechenoperator wie `+`, `-` oder `*` vorkommt. Damit wird `{Magie}/3+{Aura}/3` bei Magie 5 und Aura 4 vollständig zum Faktor 3 ausgewertet, statt als `5/3+4/3` stehenzubleiben. Reine alte Slash-Listen wie `12/1/21` bleiben weiterhin unangetastet. Ein gezielter Regressionstest deckt beide Verhaltensweisen ab. Die bereits erzeugten Laufzeitdaten wurden geprüft, aber die SPOT-Arbeitsmappe auf ausdrücklichen Nutzerwunsch nicht gelesen; der erzeugte Datensatz für „Rüstung verstärken“ enthält am Ende kein literales `&#x20;`.

Geändert sind `src/engine/spruchmagieRw.ts` und `src/engine/spruchmagieRw.test.ts`. Gezielte Prüfung: 1 Testdatei mit 27/27 Tests bestanden. Vollständige Prüfung: 70 Testdateien mit 710/710 Tests bestanden. Produktions-Build einschließlich Waffen-Katalogvalidierung und TypeScript-Prüfung bestanden; die bestehende Warnung zur großen JavaScript-Ausgabedatei bleibt unverändert. Kein Commit/Push. Bestehende lokale Fremdänderungen und unversionierte Dateien wurden erhalten.

### Weiterhin geltender vollständiger NPC-Stand

Maßgeblicher erzeugter Vergleichsstand bleibt die [Gesamtübersicht](Nahkampfvergleich-Gesamtuebersicht.md) mit den beiden importierbaren Straitmor-Wachen in `outputs/straitmor-nahkaempfer-20260913/`. Beide Figuren sind vollständig validiert, gespeichert, exportiert, erneut geparst und rückgelesen. Indianer und Troll besitzen das vereinbarte Axtprofil, RM 20/19, die dokumentierten Eigenschaften, 6.397/6.382 ausgegebene SP, 3/18 Rest-SP und je 4 freie TaP. Ausrüstung und Versorgung kosteten je 1.757,796 D; 3.242,204 D bleiben. Bekannte allgemeine Gegenstände und Kleidung wiegen 10,1 kg beziehungsweise 11,1 kg mit einem Liter Wasser. Belastbare Waffen- und Rüstungsgewichte fehlen weiterhin für einen vollständigen Lasttest.

Weiter geltende Achsenentscheidungen: SSK gehört in Rahmen/Hintergrund; Ausstattung richtet sich nach Profession und schließt erforderliche Rüstungsmanöver ein. Die berufliche Basis der Vergleichswachen beträgt 316 SP beziehungsweise 4,9375 %. Das Restbudget wird gemeinsam auf Fernkampf, Nahkampf, Magie, KI, PSI und bessere Berufsfähigkeiten verteilt; die Regler ergeben zusammen 100 %. Erforderliche Eigenschaften, Attribute und Voraussetzungen werden innerhalb des jeweiligen Anteils finanziert. Die frühere Pflicht „Unbewaffnet = Kreis × 3“ ist verworfen. Klassen bleiben zu prüfende Presets; der allgemeine Generator ist noch nicht auf dieses Zielmodell umgestellt.

Für Spruchmagie bleibt die bestätigte Schulauswahl maßgeblich: gewichtete Auswahl anhand vorhandener Spezies-Eigenschaftsstärken ist die nächste Ausarbeitungsrichtung, ohne feste Schule pro Volk und ohne zirkuläre Neuziehung nach Eigenschaftskäufen. Kampfmagier erhalten mindestens eine Kampfmagieschule, Antimagie und eine weitere unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen mit höchstens einer Kampfmagieschule. Die dokumentierten Erweiterungen für Kreis 3 und Kreis 4+ sowie insgesamt drei/vier/fünf Schulen gelten weiter. Schwerpunktableitung für gemischte Schulen, konkrete CK-Eigenschaftsziele und Finanzierung des Spruchrepertoires bleiben offen. Maßgebliche Fachstände: [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md), [Spruchmagieausbildung](Spruchmagieausbildung.md), [Kampfausbildung](Kampfausbildung.md), [Weitere Achsen](Weitere-Achsen.md), [Budgetgrundlage](Budgetgrundlage.md), [GF/SF-Achsenbeiträge](GF-SF-Achsenbeitraege.md), [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md), [Rüstung](Ruestung.md) sowie [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md).

Weiter offen bleiben die Gewichtung eindeutiger und gemischter Magieschulen, CK-Zielhöhen, Basiskosten/Rest-SP je Volk und Kreis, Spruchanzahl und Schwerpunktverteilung, KI-/PSI-Ausbildung, Bestätigung der neuen WHK- und GF/SF-Paketwerte, vollständige Rollenfinanzierung sowie die Generator- und UI-Umsetzung. Budgetkonflikte bleiben sichtbar; Budgets werden nicht automatisch erhöht oder Pflichtpakete still gekürzt. Bestehende lokale Fremdänderungen sind weiterhin zu erhalten.

Nächster vorgeschlagener Schritt für diese Korrektur: „Rüstung verstärken“ einmal in der App mit Magie 5 und Aura 4 visuell prüfen; der Wirkungstext soll den Faktor 3 ohne nachgestellte HTML-Entität anzeigen. Danach bleibt für die NPC-Arbeit die gewichtete Schulwahl anhand vorhandener Spezies-Eigenschaftsboni der nächste fachliche Schritt. Beide Schritte sind nur vorgeschlagen und noch nicht ausgeführt.

---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

## 2026-09-20 · 047 · GELÖST — SPOT-Wirkungstexte erneut importiert

Die erneut gespeicherte Arbeitsmappe `werte 0.8-claude.xlsx` wurde vollständig mit `scripts/generate_data_ts.py` importiert. Gegenüber dem letzten Laufzeitstand ändern sich ausschließlich 47 Wirkungstexte aus dem Blatt `Werte`: 43 Spruchmagie-Einträge, zwei Talente und zwei Vor-/Nachteile. Betroffen sind vor allem maschinenlesbar vereinheitlichte Rechenausdrücke und Einheiten, darunter die Antimagie-Zonen, Chamäleon, Licht, Rüstung verstärken, Manaspende, Eisenhaut und Großer Golem. Die beiden Mehrfachschuss-Talente sowie Dämmerungs- und Nachtsicht übernehmen ebenfalls die im SPOT gespeicherte Zeichensetzung. Es wurden keine Regeln hinzugefügt oder entfernt.

Geändert sind die erzeugten Projektionen `src/data/rules.json`, `src/data/rules-jsonl/spruchmagie.jsonl`, `src/data/rules-jsonl/talente.jsonl` und `src/data/rules-jsonl/vor-und-nachteile.jsonl`. Der Import schrieb weiterhin 1.615 aktive Regeln in 18 Kategorien. Preislisten, Artefakte, Alchemika, Fernkampf, Waffen, Rüstungen, Schilde, Verfügbarkeiten, Lookups, Völkermaxima, KI-Kanten und Spruchmagie-Details blieben gegenüber dem Repository-Stand unverändert; insbesondere gingen keine zwischengespeicherten Excel-Preise verloren. Die 447 Importwarnungen betreffen weiterhin bewusst mit `#` deaktivierte SPOT-Zeilen.

Vollständige Prüfung: 70 Testdateien mit 709/709 Tests bestanden. Produktions-Build einschließlich Waffen-Katalogvalidierung und TypeScript-Prüfung bestanden; die bestehende Warnung zur großen JavaScript-Ausgabedatei bleibt unverändert. Kein Commit/Push. Die geänderte SPOT-Arbeitsmappe, Obsidian-Sitzungsdaten sowie alle vorhandenen fremden und unversionierten Dateien wurden erhalten und nicht anderweitig verändert.

### Weiterhin geltender vollständiger NPC-Stand

Maßgeblicher erzeugter Vergleichsstand bleibt die [Gesamtübersicht](Nahkampfvergleich-Gesamtuebersicht.md) mit den beiden importierbaren Straitmor-Wachen in `outputs/straitmor-nahkaempfer-20260913/`. Beide Figuren sind vollständig validiert, gespeichert, exportiert, erneut geparst und rückgelesen. Indianer und Troll besitzen das vereinbarte Axtprofil, RM 20/19, die dokumentierten Eigenschaften, 6.397/6.382 ausgegebene SP, 3/18 Rest-SP und je 4 freie TaP. Ausrüstung und Versorgung kosteten je 1.757,796 D; 3.242,204 D bleiben. Bekannte allgemeine Gegenstände und Kleidung wiegen 10,1 kg beziehungsweise 11,1 kg mit einem Liter Wasser. Belastbare Waffen- und Rüstungsgewichte fehlen weiterhin für einen vollständigen Lasttest.

Weiter geltende Achsenentscheidungen: SSK gehört in Rahmen/Hintergrund; Ausstattung richtet sich nach Profession und schließt erforderliche Rüstungsmanöver ein. Die berufliche Basis der Vergleichswachen beträgt 316 SP beziehungsweise 4,9375 %. Das Restbudget wird gemeinsam auf Fernkampf, Nahkampf, Magie, KI, PSI und bessere Berufsfähigkeiten verteilt; die Regler ergeben zusammen 100 %. Erforderliche Eigenschaften, Attribute und Voraussetzungen werden innerhalb des jeweiligen Anteils finanziert. Die frühere Pflicht „Unbewaffnet = Kreis × 3“ ist verworfen. Klassen bleiben zu prüfende Presets; der allgemeine Generator ist noch nicht auf dieses Zielmodell umgestellt.

Für Spruchmagie bleibt die bestätigte Schulauswahl maßgeblich: gewichtete Auswahl anhand vorhandener Spezies-Eigenschaftsstärken ist die nächste Ausarbeitungsrichtung, ohne feste Schule pro Volk und ohne zirkuläre Neuziehung nach Eigenschaftskäufen. Kampfmagier erhalten mindestens eine Kampfmagieschule, Antimagie und eine weitere unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen mit höchstens einer Kampfmagieschule. Die dokumentierten Erweiterungen für Kreis 3 und Kreis 4+ sowie insgesamt drei/vier/fünf Schulen gelten weiter. Schwerpunktableitung für gemischte Schulen, konkrete CK-Eigenschaftsziele und Finanzierung des Spruchrepertoires bleiben offen. Maßgebliche Fachstände: [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md), [Spruchmagieausbildung](Spruchmagieausbildung.md), [Kampfausbildung](Kampfausbildung.md), [Weitere Achsen](Weitere-Achsen.md), [Budgetgrundlage](Budgetgrundlage.md), [GF/SF-Achsenbeiträge](GF-SF-Achsenbeitraege.md), [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md), [Rüstung](Ruestung.md) sowie [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md).

Weiter offen bleiben die Gewichtung eindeutiger und gemischter Magieschulen, CK-Zielhöhen, Basiskosten/Rest-SP je Volk und Kreis, Spruchanzahl und Schwerpunktverteilung, KI-/PSI-Ausbildung, Bestätigung der neuen WHK- und GF/SF-Paketwerte, vollständige Rollenfinanzierung sowie die Generator- und UI-Umsetzung. Budgetkonflikte bleiben sichtbar; Budgets werden nicht automatisch erhöht oder Pflichtpakete still gekürzt. Bestehende lokale Fremdänderungen sind weiterhin zu erhalten.

Nächster vorgeschlagener Schritt für den Re-Import: Die sichtbar geänderten Wirkungstexte in der App stichprobenartig prüfen, besonders Chamäleon, Rüstung verstärken, Eisenhaut und Großer Golem, damit Rechenausdrücke und Trenner im Tooltip wie beabsichtigt erscheinen. Danach bleibt für die NPC-Arbeit die gewichtete Schulwahl anhand vorhandener Spezies-Eigenschaftsboni der nächste fachliche Schritt. Beide Schritte sind nur vorgeschlagen und noch nicht ausgeführt.

---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

## 2026-09-19 · 046 · GELÖST — Planungspaket gesichert und vier Artefakte integriert

Die bereits vorhandenen NPC-Planungsänderungen, der reproduzierbare Straitmor-Vergleich und seine drei geprüften Ausgaben wurden als eigenständiges Paket im Commit `aeb1413` gesichert. Die vier in `werte 0.8-claude.xlsx` neu hinterlegten Artefakte sind nun außerdem in den erzeugten Laufzeitdaten und der Wirkungsberechnung enthalten: Großer Funkentanz, Magische Verkleidung, Manaspende und Durchsichtiger Gegenstand. Alle vier besitzen die Grade 1 bis 7 samt Bar- und Bankpreis. Ihre graduellen Wirkungen und Wirkungsdauern werden aus dem Magiewert berechnet; automatisierte Prüfungen decken Grad 1 und Grad 7 ab.

Der Datengenerator las 70 Artefakt-Basiseinträge und 490 Artefakt-Kostenzeilen aus der Arbeitsmappe. Bei der vollständigen Erzeugung fehlten in derselben Arbeitsmappe jedoch zwischengespeicherte Ergebnisse einzelner Excel-Formeln für Alchemika- und Feuerwaffenpreise. Die dadurch unbeabsichtigt preislosen Neuausgaben wurden nicht übernommen; die bestehenden Laufzeitdateien `alchemika.json` und `fernkampf.json` bleiben erhalten. Geändert werden ausschließlich die Artefakt-Laufzeitdaten und ihre Berechnungslogik. Gezielte Prüfung: 3 Testdateien mit 26/26 Tests bestanden. Vollständige Prüfung: 70 Testdateien mit 709/709 Tests bestanden. Produktions-Build einschließlich Katalogvalidierung und TypeScript-Prüfung bestanden; die bestehende Warnung zur großen JavaScript-Ausgabedatei bleibt unverändert. Temporärdateien, Sicherungskopien, alte Ausgaben und Obsidian-Sitzungsdaten wurden weder gelöscht noch in die beiden Arbeitspakete aufgenommen.

### Weiterhin geltender vollständiger NPC-Stand

Maßgeblicher erzeugter Vergleichsstand bleibt die [Gesamtübersicht](Nahkampfvergleich-Gesamtuebersicht.md) mit den beiden importierbaren Straitmor-Wachen in `outputs/straitmor-nahkaempfer-20260913/`. Beide Figuren sind vollständig validiert, gespeichert, exportiert, erneut geparst und rückgelesen. Indianer und Troll besitzen das vereinbarte Axtprofil, RM 20/19, die dokumentierten Eigenschaften, 6.397/6.382 ausgegebene SP, 3/18 Rest-SP und je 4 freie TaP. Ausrüstung und Versorgung kosteten je 1.757,796 D; 3.242,204 D bleiben. Bekannte allgemeine Gegenstände und Kleidung wiegen 10,1 kg beziehungsweise 11,1 kg mit einem Liter Wasser. Belastbare Waffen- und Rüstungsgewichte fehlen weiterhin für einen vollständigen Lasttest.

Weiter geltende Achsenentscheidungen: SSK gehört in Rahmen/Hintergrund; Ausstattung richtet sich nach Profession und schließt erforderliche Rüstungsmanöver ein. Die berufliche Basis der Vergleichswachen beträgt 316 SP beziehungsweise 4,9375 %. Das Restbudget wird gemeinsam auf Fernkampf, Nahkampf, Magie, KI, PSI und bessere Berufsfähigkeiten verteilt; die Regler ergeben zusammen 100 %. Erforderliche Eigenschaften, Attribute und Voraussetzungen werden innerhalb des jeweiligen Anteils finanziert. Die frühere Pflicht „Unbewaffnet = Kreis × 3“ ist verworfen. Klassen bleiben zu prüfende Presets; der allgemeine Generator ist noch nicht auf dieses Zielmodell umgestellt.

Für Spruchmagie bleibt die bestätigte Schulauswahl maßgeblich: gewichtete Auswahl anhand vorhandener Spezies-Eigenschaftsstärken ist die nächste Ausarbeitungsrichtung, ohne feste Schule pro Volk und ohne zirkuläre Neuziehung nach Eigenschaftskäufen. Kampfmagier erhalten mindestens eine Kampfmagieschule, Antimagie und eine weitere unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen mit höchstens einer Kampfmagieschule. Die dokumentierten Erweiterungen für Kreis 3 und Kreis 4+ sowie insgesamt drei/vier/fünf Schulen gelten weiter. Schwerpunktableitung für gemischte Schulen, konkrete CK-Eigenschaftsziele und Finanzierung des Spruchrepertoires bleiben offen. Maßgebliche Fachstände: [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md), [Spruchmagieausbildung](Spruchmagieausbildung.md), [Kampfausbildung](Kampfausbildung.md), [Weitere Achsen](Weitere-Achsen.md), [Budgetgrundlage](Budgetgrundlage.md), [GF/SF-Achsenbeiträge](GF-SF-Achsenbeitraege.md), [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md), [Rüstung](Ruestung.md) sowie [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md).

Weiter offen bleiben die Gewichtung eindeutiger und gemischter Magieschulen, CK-Zielhöhen, Basiskosten/Rest-SP je Volk und Kreis, Spruchanzahl und Schwerpunktverteilung, KI-/PSI-Ausbildung, Bestätigung der neuen WHK- und GF/SF-Paketwerte, vollständige Rollenfinanzierung sowie die Generator- und UI-Umsetzung. Budgetkonflikte bleiben sichtbar; Budgets werden nicht automatisch erhöht oder Pflichtpakete still gekürzt. Bestehende lokale Fremdänderungen sind weiterhin zu erhalten.

Nächster vorgeschlagener Schritt für die Artefakte: Die vier Einträge in der App bei Grad 1 und Grad 7 visuell prüfen, insbesondere Suche, Kaufoptionen, Preise und Wirkungs-Tooltips. Danach bleibt für die NPC-Arbeit die gewichtete Schulwahl anhand vorhandener Spezies-Eigenschaftsboni der nächste fachliche Schritt. Beide Schritte sind nur vorgeschlagen und noch nicht ausgeführt.

---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

## 2026-09-19 · 045 · GELÖST — Ausrüstungswert bei Bar und Bank sichtbar

Der Wert aller aktuell besessenen Ausrüstung wird nun unmittelbar neben Bar- und Bankguthaben in der Kopfzeile angezeigt. Derselbe Eintrag steht im Geldblock des Charakterbogens. Grundlage ist die bereits zentrale Ausrüstungssumme `dublonenSpent`: Sie umfasst die gespeicherten Kaufpreise aller Inventareinträge multipliziert mit ihrer Anzahl sowie sämtliche belegten Rüstungsslots. Entfernte Ausrüstung zählt nicht mehr; eine Wiederverkaufs- oder Zeitwertberechnung wurde nicht erfunden. Der Tooltip erklärt die Bedeutung als Summe der Kaufpreise.

Umsetzung in `src/main.ts`, `src/views/charakterbogen.ts` und dokumentierende Typbeschreibung in `src/engine/characterSheet.ts`. Ein Charakterbogen-Test belegt die gemeinsame Summe aus drei gleichen Inventargegenständen und einem Rüstungsteil. Gezielte Prüfung: 9/9 Charakterbogen-Tests bestanden. Vollständige Prüfung: 70 Testdateien mit 707/707 Tests bestanden. Produktions-Build einschließlich Waffen-Katalogvalidierung und TypeScript-Prüfung bestanden; die bestehende Warnung zur großen JavaScript-Ausgabedatei bleibt unverändert. Kein Commit/Push. Vorhandene fremde Änderungen und Dateien wurden nicht verändert.

### Weiterhin geltender vollständiger NPC-Stand

Der NPC-Fach- und Umsetzungsstand aus Eintrag 044 gilt unverändert; dieser Arbeitsschritt ändert weder Generatorregeln noch NPC-Dateien. Maßgeblicher erzeugter Vergleichsstand bleibt die [Gesamtübersicht](Nahkampfvergleich-Gesamtuebersicht.md) mit den beiden importierbaren Straitmor-Wachen in `outputs/straitmor-nahkaempfer-20260913/`. Beide Figuren sind vollständig validiert, gespeichert, exportiert, erneut geparst und rückgelesen. Indianer und Troll besitzen das vereinbarte Axtprofil, RM 20/19, die dokumentierten Eigenschaften, 6.397/6.382 ausgegebene SP, 3/18 Rest-SP und je 4 freie TaP. Ausrüstung und Versorgung kosteten je 1.757,796 D; 3.242,204 D bleiben. Bekannte allgemeine Gegenstände und Kleidung wiegen 10,1 kg beziehungsweise 11,1 kg mit einem Liter Wasser. Belastbare Waffen- und Rüstungsgewichte fehlen weiterhin für einen vollständigen Lasttest.

Weiter geltende Achsenentscheidungen: SSK gehört in Rahmen/Hintergrund; Ausstattung richtet sich nach Profession und schließt erforderliche Rüstungsmanöver ein. Die berufliche Basis der Vergleichswachen beträgt 316 SP beziehungsweise 4,9375 %. Das Restbudget wird gemeinsam auf Fernkampf, Nahkampf, Magie, KI, PSI und bessere Berufsfähigkeiten verteilt; die Regler ergeben zusammen 100 %. Erforderliche Eigenschaften, Attribute und Voraussetzungen werden innerhalb des jeweiligen Anteils finanziert. Die frühere Pflicht „Unbewaffnet = Kreis × 3“ ist ausdrücklich verworfen. Klassen bleiben zu prüfende Presets; der allgemeine Generator ist noch nicht auf dieses Zielmodell umgestellt.

Für Spruchmagie bleibt die bestätigte Schulauswahl aus Eintrag 044 maßgeblich: gewichtete Auswahl anhand vorhandener Spezies-Eigenschaftsstärken ist die nächste Ausarbeitungsrichtung, ohne feste Schule pro Volk und ohne zirkuläre Neuziehung nach Eigenschaftskäufen. Kampfmagier erhalten mindestens eine Kampfmagieschule, Antimagie und eine weitere unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen mit höchstens einer Kampfmagieschule. Die dokumentierten Erweiterungen für Kreis 3 und Kreis 4+ sowie insgesamt drei/vier/fünf Schulen gelten weiter. Schwerpunktableitung für gemischte Schulen, konkrete CK-Eigenschaftsziele und Finanzierung des Spruchrepertoires bleiben offen. Maßgebliche Fachstände: [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md), [Spruchmagieausbildung](Spruchmagieausbildung.md), [Kampfausbildung](Kampfausbildung.md), [Weitere Achsen](Weitere-Achsen.md), [Budgetgrundlage](Budgetgrundlage.md), [GF/SF-Achsenbeiträge](GF-SF-Achsenbeitraege.md), [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md), [Rüstung](Ruestung.md) sowie [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md).

Weiter offen bleiben die Gewichtung eindeutiger und gemischter Magieschulen, CK-Zielhöhen, Basiskosten/Rest-SP je Volk und Kreis, Spruchanzahl und Schwerpunktverteilung, KI-/PSI-Ausbildung, Bestätigung der neuen WHK- und GF/SF-Paketwerte, vollständige Rollenfinanzierung sowie die Generator- und UI-Umsetzung. Budgetkonflikte bleiben sichtbar; Budgets werden nicht automatisch erhöht oder Pflichtpakete still gekürzt. Bestehende lokale Fremdänderungen sind weiterhin zu erhalten.

Nächster vorgeschlagener Schritt für die aktuelle Änderung: Die Kopfzeile mit einem ausrüstungsreichen Charakter einmal bei schmaler Fensterbreite visuell prüfen, damit Bar, Bank und Ausrüstungswert gemeinsam gut lesbar bleiben. Danach bleibt für die NPC-Arbeit die gewichtete Schulwahl anhand vorhandener Spezies-Eigenschaftsboni der nächste fachliche Schritt. Beide Schritte sind nur vorgeschlagen und noch nicht ausgeführt.

---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

## 2026-09-13 · 044 · GELÖST — Gesinnung am Ende des Charakterbogens

Die Gesinnungstabelle steht in src/views/charakterbogen.ts jetzt ganz am Schluss, nach dem Waffen-Loadout. Anzeigevoraussetzung (alle 22 Werte gesetzt) und Anmerkungen bleiben erhalten. Charakterbogen-Tests bestanden. Kein Commit/Push. Nächster vorgeschlagener Schritt für diese Änderung: Reihenfolge im Charakterbogen visuell ansehen.

### Weiterhin geltender vollständiger NPC-Stand (unverändert übernommen)

Nutzerauftrag „ja und chars erstellen“ ausgeführt. Maßgeblicher vollständiger Vergleichsstand: [Gesamtübersicht](Nahkampfvergleich-Gesamtuebersicht.md), einschließlich aller Eigenschaften, Fertigkeiten, Talentketten, PP, SP/TaP und Ausstattung. Beide importierbaren NSC-Dateien samt Speicherverlauf und Prüfbericht in `outputs/straitmor-nahkaempfer-20260913/`; Erzeugung über `src/addins/npc/scripts/straitmor-vergleich.mjs`, isolierter Speicher ohne Eingriff in Browsercharaktere. Namen Wache Straitmor – Indianer/Troll; neutrale Gesinnungsplatzhalter explizit dokumentiert. Herkunft Straitmor aus Katalog, NW; Orkisch3, zwergische Schrift2, orkische Kultur3. Städter/Stadt/Einfach, Wache mit vertiefter Meisterausbildung; Aussehen/Schlaf normal.

Bestätigt: Hiebwaffen/Äxte16, Vitalität4, Glück3, Ausweichen6, RM20/19 mit Talentstufen1+2; CK-Ziele und abschließende Steigerungen wie Gesamtübersicht. Indianer STÄ/ATH/SCH/KON/MUT17/17/17/15/13, Troll21/17/15/21/13. SP6397/6382, Rest3/18, je4 TaP frei. Axt nAT/nPA15/15, Schaden W20+3/W20+5, WK9, RBE0. Troll benötigt nach letzter KON/STÄ-Steigerung nur noch RM18, vereinbarte19 erhalten.

Versorgung für Stadtdienst mit Nachfüllen/Essen auf der Wache ergänzt: Tinte, Feldflasche, Rucksack, Gürteltasche, Brot/Käse, Zunderdose/-schwamm, Feuerstein/Stahl. Je1757,796 D ausgegeben,3242,204 D Rest, kein zusätzlicher Geldbeutel. Bekannte Gegenstände/Kleidung10,1 kg, mit1 L Wasser11,1 kg. Waffen-/Rüstungsgewichte fehlen im Modell: vollständige Traglast und davon abhängige Zusatzbelastung weiterhin offen. Volksgröße von der Stange verwendet, keine individuellen Körpermaße erfunden.

Reguläre Kaufmutationen, vollständige Client-/NPC-Validierung, Speicherpunkt, Export/Parsen/Installation/Rücklesen bestanden; keine Validierungsfehler. Bestehende Parserwarnung zur Beschreibungsformel ep_verbraucht dokumentiert, tatsächliche SP-Abrechnung erfolgreich. Keine App-/Regeldaten verändert, kein Commit/Push. Bestehende fremde Änderungen erhalten.

Weiter geltende Achsenentscheidungen: SSK in Rahmen/Hintergrund; Ausstattung an Profession einschließlich RM-Voraussetzungen; berufliche Basis hier316 SP=4,9375 %. Restbudget gemeinsam auf FK/NK/Magie/KI/PSI/bessere Berufsfähigkeiten, Regler zusammen100 %, notwendige Eigenschaften/Attribute/Voraussetzungen innerhalb des jeweiligen Anteils. Unbewaffnet Kreis×3 ausdrücklich verworfen. Klassen als noch zu prüfende Presets; allgemeiner Generator weiterhin nicht entsprechend umgestellt.

Nächster vorgeschlagener Schritt: Beide Dateien in der App importieren und Charakterbögen vergleichen. Danach belastbare Waffen-/Rüstungsgewichte für vollständigen Lasttest ergänzen. Identität/Persönlichkeit bei Bedarf individualisieren. Allgemeine offene Generatoraufgaben und Fachquellen folgen; dortige historische Unbewaffnet-Pflicht ist durch obige Entscheidung aufgehoben. Der Vergleich ist jetzt erzeugt, keine frühere Erzeugungsblockade gilt weiter.
### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

## 2026-09-13 · 043 · GELÖST — Beide Straitmor-Vergleichscharaktere erstellt

Nutzerauftrag „ja und chars erstellen“ ausgeführt. Maßgeblicher vollständiger Vergleichsstand: [Gesamtübersicht](Nahkampfvergleich-Gesamtuebersicht.md), einschließlich aller Eigenschaften, Fertigkeiten, Talentketten, PP, SP/TaP und Ausstattung. Beide importierbaren NSC-Dateien samt Speicherverlauf und Prüfbericht in `outputs/straitmor-nahkaempfer-20260913/`; Erzeugung über `src/addins/npc/scripts/straitmor-vergleich.mjs`, isolierter Speicher ohne Eingriff in Browsercharaktere. Namen Wache Straitmor – Indianer/Troll; neutrale Gesinnungsplatzhalter explizit dokumentiert. Herkunft Straitmor aus Katalog, NW; Orkisch3, zwergische Schrift2, orkische Kultur3. Städter/Stadt/Einfach, Wache mit vertiefter Meisterausbildung; Aussehen/Schlaf normal.

Bestätigt: Hiebwaffen/Äxte16, Vitalität4, Glück3, Ausweichen6, RM20/19 mit Talentstufen1+2; CK-Ziele und abschließende Steigerungen wie Gesamtübersicht. Indianer STÄ/ATH/SCH/KON/MUT17/17/17/15/13, Troll21/17/15/21/13. SP6397/6382, Rest3/18, je4 TaP frei. Axt nAT/nPA15/15, Schaden W20+3/W20+5, WK9, RBE0. Troll benötigt nach letzter KON/STÄ-Steigerung nur noch RM18, vereinbarte19 erhalten.

Versorgung für Stadtdienst mit Nachfüllen/Essen auf der Wache ergänzt: Tinte, Feldflasche, Rucksack, Gürteltasche, Brot/Käse, Zunderdose/-schwamm, Feuerstein/Stahl. Je1757,796 D ausgegeben,3242,204 D Rest, kein zusätzlicher Geldbeutel. Bekannte Gegenstände/Kleidung10,1 kg, mit1 L Wasser11,1 kg. Waffen-/Rüstungsgewichte fehlen im Modell: vollständige Traglast und davon abhängige Zusatzbelastung weiterhin offen. Volksgröße von der Stange verwendet, keine individuellen Körpermaße erfunden.

Reguläre Kaufmutationen, vollständige Client-/NPC-Validierung, Speicherpunkt, Export/Parsen/Installation/Rücklesen bestanden; keine Validierungsfehler. Bestehende Parserwarnung zur Beschreibungsformel ep_verbraucht dokumentiert, tatsächliche SP-Abrechnung erfolgreich. Keine App-/Regeldaten verändert, kein Commit/Push. Bestehende fremde Änderungen erhalten.

Weiter geltende Achsenentscheidungen: SSK in Rahmen/Hintergrund; Ausstattung an Profession einschließlich RM-Voraussetzungen; berufliche Basis hier316 SP=4,9375 %. Restbudget gemeinsam auf FK/NK/Magie/KI/PSI/bessere Berufsfähigkeiten, Regler zusammen100 %, notwendige Eigenschaften/Attribute/Voraussetzungen innerhalb des jeweiligen Anteils. Unbewaffnet Kreis×3 ausdrücklich verworfen. Klassen als noch zu prüfende Presets; allgemeiner Generator weiterhin nicht entsprechend umgestellt.

Nächster vorgeschlagener Schritt: Beide Dateien in der App importieren und Charakterbögen vergleichen. Danach belastbare Waffen-/Rüstungsgewichte für vollständigen Lasttest ergänzen. Identität/Persönlichkeit bei Bedarf individualisieren. Allgemeine offene Generatoraufgaben und Fachquellen folgen; dortige historische Unbewaffnet-Pflicht ist durch obige Entscheidung aufgehoben. Der Vergleich ist jetzt erzeugt, keine frühere Erzeugungsblockade gilt weiter.
### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

## 2026-09-13 · 042 · GELÖST — Straitmor, Orkisch, zwergische Schrift und orkische Kultur

Neuester Abschluss mit Vorrang: Beide stammen laut Nutzer aus Straitmor. Orkisch3, zwergische Schrift2, orkische Kultur3 konkret gewählt. Katalogreferenzen ssk_sprache_orkisch/ssk_schrift_zwerge/ssk_kultur_orks vorhanden; Kosten50+30+40=120 bereits enthalten. Keine zusätzliche Sprache/Kultur gekauft, Rest3/18 SP und je4 TaP unverändert. Gesamtübersicht und Vergleich aktualisiert. Frühere offene Herkunft/SSK-Angaben unten sind erledigt. Weiter offen Identitätsdetails soweit benötigt, Versorgung/Verbrauch/Transport/Geldbeutel, Beschaffbarkeit/Passform/Traglast und vollständiger Charakter-/Exporttest. Nächster Vorschlag: Ausrüstung und Versorgung einschließlich Traglast abschließend prüfen; noch keine weiteren Käufe. Nur Dokumentation und Katalogprüfung, keine Laufzeitänderung oder Tests.

Aktueller Abschluss: [Gesamtübersicht](Nahkampfvergleich-Gesamtuebersicht.md) als konsolidierte Referenz erstellt und im Vergleichsprotokoll verlinkt. Enthält alle aktuellen Eigenschaften/Attribute, Fertigkeiten und Talente, Kampf-/LE-Werte, PP, Ausrüstung und vollständige bisherige SP-/TaP-Rechnung. Keine neuen Käufe. Eigenschaftskosten aus Volks-/Kostendaten erneut geprüft:4131/4125 SP, Gesamt6397/6382, Rest3/18; je4 TaP. Offene Punkte ausdrücklich getrennt: konkrete SSK und Welt/Identität, Versorgung/Verbrauch/Transport/Geldbeutel, Beschaffbarkeit/Passform/Traglast, vollständiger Charakter- und Exporttest. Bisherige Budgetrechnung ist kein vollständiger Charaktertest. Nächster Vorschlag: Herkunft und SSK konkret wählen, danach Ausrüstung/Versorgung prüfen. Nur Dokumentation, keine Charakterdateien oder Generatoränderungen, kein Commit/Push. Vollständiger weiterhin geltender Fach- und Entscheidungsstand folgt; die Gesamtübersicht ist für die aktuellen Vergleichswerte maßgeblich.

Neuester Abschluss mit Vorrang: Nutzer bestätigt Indianer SCH15→17 (93 SP), Troll-Fokus KON/LE und STÄ umgesetzt mit jeweils19→21 (je117, zusammen234 SP), Varianten gegengeprüft. Neue Rest-SP3/18, Gesamtausgaben6397/6382; TaP je4 frei. Indianer STÄ/ATH/SCH/KON/MUT17/17/17/15/13, Troll21/17/15/21/13. Indianer PA-Basis12 statt11, ein PP von nPA auf gPA umverteilt: n15/15 g5/5 m22/22; Troll n15/15 g5/4 m22/22. Je16 PP, AT/PA8/8. Schaden W20+3/W20+5, Mittel13,5/15,5. LE12/23/18 vs14/27/21, Ausdauer68/82, Gesundheit13/15, Trefferschwelle9. AW beide weiterhin15/11,g2/m22 trotz SCH-Rundung. RM20/19 und RBE0,Vit4/Glück3 unverändert. Höhere Trollwerte21 sind zusätzliche Vertiefung, ändern nicht globalen CK-Zielbereich. Kosten/Grenzen/Rundung/PP geprüft, nur Dokumentation. Frühere Eigenschafts-/Rest-/LE-/Schadenswerte unten ersetzt. Nächster Vorschlag: Gesamtübersicht und offene Pflichtangaben abschließen; konkrete SSK, Versorgung/Last/Beschaffung und vollständiger Charaktertest bleiben offen.

Aktueller Abschluss mit Vorrang: Nutzer bestätigt SF Ausweichen6 für beide, je54 SP. Jetzt als Kauf in Vergleichsplanung übernommen; AW defensiv15/offensiv11, g2/m22. Rest96/252 SP, Gesamtausgaben6304/6148. Je4 TaP frei; RM20/19 mit Talentstufen1+2 und RBE0 bleiben. GF/SF46/45 Punkte, Kosten414/405. Axtproben15/15,5/4,22/22, Schaden13,5/14,5, alle übrigen Werte unverändert. Kosten/Rundung/Rest geprüft, nur Dokumentation, keine Charakter-/Generatoränderung oder Laufzeittests. Vorherige Aussagen SF0/AW13/9/Rest150/306 und noch nicht gekaufte AW6-Variante unten ersetzt. Nächster Vorschlag: kompakte Gesamtübersicht beider Vergleichsprofile mit offenen Pflichtangaben erstellen, keine weiteren Käufe. Konkrete SSK-Identitäten und vollständige Versorgung/Traglast/Beschaffung bleiben offen.

Neuester Abschluss mit Vorrang: Nutzer bestätigt RM20 beim Indianer/RM19 beim Troll und Talentstufen1+2. Jetzt als Käufe in Vergleichsplanung übernommen: Mehrkosten72/63 SP, Gesamtausgaben6250/6094, Rest150/306 SP. Je16 TaP ausgegeben,4 frei, Maximum20 durch vollständige Kette freigeschaltet. RH30 ergibt bei beiden RBE0/KBE0. AW bei SF0 jetzt defensiv13/offensiv9/g2/m22; Axtproben15/15,5/4,22/22, Schaden13,5/14,5 bleiben. RM12 als Berufsmindestziel enthalten; darüberliegende Käufe sind zusätzlicher Null-RBE-Ausbildungswunsch. GF/SF gesamt40/39 Punkte. Vitalität4/Glück3, Hintergrund und Ausrüstung unverändert. Vergleichsdokument oben aktualisiert, Budgets/Maximum/Kette/RBE nachgerechnet; keine Charakter-/Generatoränderung oder Laufzeittests. Frühere Aussagen RM12/20 freie TaP/Rest222/369 und noch nicht gekaufte RBE0-Variante unten ersetzt. Nächster Vorschlag: SF Ausweichen6 für54 SP → defensiv15/offensiv11, Rest96/252; noch nicht gekauft. Konkrete SSK und Versorgung/Last/Beschaffung weiterhin offen.

Aktueller Abschluss mit Vorrang: Nutzer senkt Vitalität auf4, Glück3 bleibt. Attributkosten740, Ersparnis160 SP je NPC, Rest222/369 SP, Gesamtausgaben6178/6031. Keine Vitalitätsfreischaltung nötig. Ausdauer68/77, Gesundheit13/14, LE12/23/18 bzw.13/26/20, Trefferschwelle9. AW aktuell mit RM12/KBE2 und AW-SF0 bei beiden defensiv11/offensiv7/g2/m22; bei RBE0 hypothetisch13/9/2/22. Talentkette RM1+2 kostet2+14=16 von20 TaP, erlaubt Maximum20. RM20/19 kostet zusätzlich72/63 SP, Rest dann150/306; nur Variante, nicht gekauft. RM24 benötigt32 TaP und passt nicht auf Stufe0. Frühere Vitalität5/Freischaltungsblockade unten überholt. Details und AW-Steigerungsvarianten oben im Vergleich/Eigenschaften dokumentiert. Nächster Vorschlag: RM-Talente1+2 und RM20/19 für RBE0 wählen, danach AW prüfen; aktuell RM12 und20 freie TaP erhalten. Nur Dokumentation und Formel-/Kettenprüfung, kein vollständiger Charaktertest oder Generatoränderung.

Neueste Prüfung: Keine Käufe geändert. +6 RM auf18 ergibt RBE1/3 bzw.0,1, jeweils1 KBE; +12 auf24 ergibt0. Minimalziele Indianer20/Troll19, Mehrkosten72/63 SP, hypothetischer Rest−10/146. Über RM12 Talentfreischaltung erforderlich (+8 für Ziele19/20, +12 für24), TaP/Ketten ungeprüft. Neu erkannt: Attributmaximum auf Kreis0 regulär4 laut fertigkeitenGrenzen.ts; gewünschte Vitalität5 benötigt ebenfalls Freischaltung. Früherer Kostenvergleich ist kein Legalitätsnachweis; Vitalität nicht eigenmächtig geändert. Details oben im Nahkampfvergleich. Nächster Vorschlag: beide Freischaltungen/TaP prüfen, anschließend10 fehlende Indianer-SP klären. Aktuelle tatsächlich geplante RM12 und Rest62/209 bleiben bestehen. Nur Dokumentation/Rechnung.

Aktueller Abschluss mit Vorrang: Beide Städter, Terrain Stadt, soziale Lage Einfach, Aussehen/Schlaf Normal als konkrete Vergleichsauswahl. Vollständige Beiträge/Referenzen/Zusammenführung oben im Nahkampfvergleich dokumentiert. Hintergrund-GF12 Punkte=108 SP neu, GF/SF insgesamt32 Punkte=288 SP inklusive RM12. WHK-Hintergrund erst addieren und dann per Maximum mit bestehenden Ausbildungszielen zusammenführen; zusätzliche Käufe Kaufmann2 (11), Krämer2 (5), Gemeinvolk3 (6), Stadt4 (7), insgesamt29 SP neu, WHK insgesamt352. Wald8 aus Ausbildung bleibt erhalten. Pflichtmerkmale0 SP. Netto137 SP je NPC; Gesamtausgaben6338/6191, Rest62/209 SP. Ausrüstung/PP/Attribute/CK-Ziele unverändert; Rüstung2 KBE. Konkrete SSK-Identitäten und Versorgung/Last/Beschaffbarkeit weiterhin offen; keine vollständigen NPCs behauptet. Pools/Kosten/Minima und Gesamtsummen geprüft, nur Dokumentation, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere offene Hintergrundauswahl und Rest199/346 unten ersetzt. Nächster Vorschlag: Pflichtvoraussetzungen und Einsatzfähigkeit gezielt prüfen, beginnend mit konkreter SSK-Zuordnung und Ausweichen/Belastung; Rest bis dahin erhalten. Noch kein Auftrag für weitere Käufe.

Neueste Nutzerentscheidung mit Vorrang: Berufs-/Ausrüstungspaket Wache enthält Rüstungsmanöver mindestens12; ersetzt dort bisherige reine Bedarfsbelegung2/1. Keine globale Vorgabe12 für andere Berufe. Mindestziele per Maximum und vorhandene Käufe einmal anrechnen. Je108 SP, zusätzlich90/99 gegenüber vorherigem Vergleich. Rest Indianer199/Troll346 SP. Bei RH30 RBE1,3333/1,1, beide2 KBE. Berufsbasis inklusive RM316 SP=4,9375 %, GF/SF gesamt20 Punkte. WHK323 und SSK120 unverändert. Ausrüstung, CK-Ziele, H/S16, Vit5/Glück3, PP-Verteilung unverändert. Vergleich, GF/SF- und Rüstungsfachdokument oben ergänzt; Kosten/Maximum/RBE geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere RM2/1,3KBE,Rest289/445-Angaben unten ersetzt. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und Pflichtmerkmale bestimmen, Beiträge zusammenführen, Rest prüfen. Noch nicht beauftragt.

Aktueller Abschluss mit Vorrang: gemeinsame Wache als Vergleichsannahme gewählt, WHK-Güte Meister, protokollierender Dienst. SSK120 SP (Sprache3/Kultur3/Schrift2, konkrete Identität offen), Berufsbasis208 SP=3,25 % (WHK136 + GF/SF72). Bestehendes breites Wache-WHK-Beispiel auf323 SP finanziert, Mehrkosten187, inklusive ausdrücklich als Entwurf gekennzeichneter Führung8. Zeughausrüstung von der Stange kostet1561 D bei RH30; RM2/1 für18/9 SP ergeben RBE3/2,9333 und jeweils3 KBE. Kleidung/Arbeitsmittel92,137 D, mit Axt97 D Gesamtausstattung1750,137 D innerhalb5000 D, ausgewählter Umfang ohne vollständige Versorgung/Lastprüfung. Rest jetzt289/445 SP. Endwerte/Artikel/Annahmen und offene Auswahlen oben im Nahkampfvergleich vollständig dokumentiert. Aussehen/Schlaf und Lebenswelt/Terrain/Soziallage sowie konkrete SSK bleiben offen; keine fertigen NPCs behauptet. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und neutrale Pflichtmerkmale wählen, Beiträge zusammenführen, Rest neu rechnen; noch nicht ausgeführt. Nur Dokumentation und Kosten-/Rüstungsprüfung, keine Laufzeit-/Charakteränderung oder Tests. Frühere Budgetreste und Aussagen zu noch nicht bezahlter beruflicher Basis unten sind ersetzt.

Neuester Abschluss mit Vorrang: Nutzer bestätigt Vitalität 5 und Glück 3 für beide Nahkämpfer. Je 600+300=900 SP ab 0, Attributminimum damit erfüllt ohne Zusatzabzug. Rest jetzt Indianer 822/Troll 969 SP vor SSK/Hintergrund/beruflicher Basis und weiteren Grundausgaben. Ausdauer 71/80, Gesundheit 14/15, LE Kopf/Brust/Unterleib 13/24/18 bzw. 14/26/20, Trefferschwelle beide 10. Axtproben n15/15 g5/4 m22/22 und Durchschnittsschaden 13,5/14,5 unverändert. Ausgearbeitet in Nahkampfvergleich und Eigenschaften-und-Attribute; Formeln arithmetisch geprüft, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere Restwerte und offene Attributziele unten sind ersetzt. Nächster Vorschlag: SSK und konkrete berufliche Basis einschließlich Ausstattung/Rüstungsmanöver bepreisen; Beruf und Hintergrund noch zu wählen. Keine weiteren Ausgaben beauftragt.

Abschluss dieses Schritts mit Vorrang: CK-Zielprofil jetzt in Axtvergleich übernommen. Indianer STÄ/ATH/SCH/KON/MUT 17/17/15/15/13, Troll 19/17/15/19/13. Beide H/S16, gleiche Eisenäxte zweihändig. nAT/nPA vor PP 12/11; je 3/4 PP für Ziel 15/15, Rest 9 als 7 gute / 2 meisterliche (Ganzzahlnäherung 3:1). PP gAT/gPA/mAT/mPA 4/3/1/1. Endwerte 15/15, 5/4, 22/22; 0 PP frei, AT/PA-Investition 8/8, Grenzen eingehalten. Schaden W20+3 / W20+4, Durchschnitt 13,5/14,5. Rest-SP 1722/1869 vor weiteren Grundausgaben unverändert. Aktuelle Rechnung oben im Nahkampfvergleich dokumentiert; frühere Zahlen unten sind Zwischenstände. Nächster Vorschlag: Vitalität und geringer Glück mit Zielwerten/Kosten ergänzen, noch nicht beauftragt. Nur Dokumentation und arithmetische Prüfung, keine Laufzeittests oder Charakter-/Generatoränderungen.

Neuester Stand mit Vorrang: Nutzer bestätigt CK-Nahkämpfer-Zielbereich 13–17 auf Stufe 0 und Stärke zwingend mit hoher Priorität, unabhängig vom vorigen Axtbeispiel. Konkrete Gewichtung auf Auftrag ausgearbeitet: Stärke 17, Athletik 17, Schnelligkeit 15, Konstitution 15, Mut 13. Profilentwurf in Eigenschaften-und-Attribute.md dokumentiert; höhere Volksminima erhalten, keine Prozentgewichte erfunden. Kosten vom Sockel Indianer 912 / Troll 540 SP (enthält dessen frühere 120 SP). Mit H/S16 rechnerischer Rest 1722/1869 vor weiteren Grundausgaben. Ziele gegen Volksobergrenzen und Kostentabelle geprüft. Alte Kampfwerte unten gehören zum früheren 9er-Vergleich, nicht zum neuen Zielprofil. Nächster Vorschlag: Axtkampfwerte einschließlich PP und Schaden mit Zielprofil neu rechnen, danach Vitalität/Glück; noch nicht ausgeführt. Keine Laufzeit-/Charakteränderung, kein Commit/Push.

Aktueller Schritt mit Vorrang: Nutzer setzt CK-relevante Eigenschaften auf mindestens 9. Hier Athletik/Schnelligkeit/Mut sowie Konstitution; Stärke als Waffen-/Schadenswert ebenfalls bereits über 9. Attribute Vitalität/Glück erhalten kein 9er-Minimum. Indianer kein Zukauf; Troll SCH 5 auf 9 für 120 SP. Hiebwaffen/Äxte weiterhin 16/16. Jetzt nAT/nPA vor PP 9/8 bzw. 10/8; beide erreichen 15/15 regelkonform. Indianer gAT/gPA 2/2, mAT/mPA 22/21 (Rest 3, Näherung g:m=2:1); Troll 3/2 und 22/21 (Rest 4, exakt 3:1). Je 16 PP verbraucht, AT/PA-Ausgaben 8/8. Vorherige Troll-Blockade gelöst. Schaden 9,5/14,5 unverändert. SP-Reste nach Sockel/Ausbildung/CK-Minimum 2634/2289, Differenz 345; weitere Grundausgaben fehlen. Vollständiger aktueller Vergleich oben in Nahkampfvergleich-Indianer-Troll.md. Nächster Vorschlag: Vitalität und geringer Glück mit Kostenvarianten ergänzen, noch keine Ziele/Käufe beschlossen. Nur Dokumentation; Sockel/Kostentabelle und Rechnungen geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere Zwischenwerte im übernommenen Stand sind durch diese Angaben ersetzt.

Ergebnis: [Nahkampfvergleich Indianer / Troll](Nahkampfvergleich-Indianer-Troll.md) als Planungsrechnung angelegt. Beide Hiebwaffen 12 / Äxte 12 für je 480 SP; beide Axt aus Eisen, Gesellenarbeit, Von der Stange, Standardschaft für je 97 D. Rest nach Volkssockel und diesen Käufen 2794 / 2569 SP, noch vor weiteren Grundausgaben. Keine Charakterdateien oder Generatorlogik geändert. Kosten und Katalogwerte abgeglichen; keine Laufzeittests, kein Commit/Push.

### Neue Entscheidungen mit Vorrang vor dem übernommenen Fachstand

SSK gehört in Rahmen/Hintergrund. Ausstattung an Profession binden und ihre SP-Voraussetzungen einschließlich Rüstungsmanöver erfassen. Berufliche Basis ca. 3–5 % der gesamten SP als diskutierter Ansatz; Abgrenzung zu WHK mindestens 5 % / Attributen mindestens 3 % noch offen. Anschließend gemeinsames Restbudget mit Reglern für FK/NK/Spruchmagie/KI/PSI und bessere Berufsfähigkeiten, Summe 100 %. Jeder Zweig finanziert passende Eigenschaften, Attribute und Voraussetzungen mit. Magiegrundwerte vor Repertoire. Klassen als zu prüfende Presets.

Unbewaffnet = Kreis × 3 ist ausdrücklich verworfen. Alle entsprechenden Aussagen im unten übernommenen Stand und älteren Fachunterlagen sind überholt, keine neue Pflicht beschlossen. Frühere Grafikgruppierung durch SSK-/Professionsentscheidung ebenfalls überholt. Fachunterlagen noch nicht umfassend umgestellt; vor Implementierung abgleichen.

Nahkampfvergleich: gewichtete Eigenschaftsbestandteile von AW/AT/PA, zusätzlich Konstitution und Vitalität, geringer Glück. Hiebwaffen und Äxte immer gleich hoch, aktuell beide 12. Indianer Stärke 10 erfüllt die Zweihandanforderung der Axt, Troll Stärke 19 auch einhändig. Griffart jetzt für beide zweihändig bestätigt. nAT/nPA vor Poolverteilung Indianer 8/7, Troll 9/5; je 12 unvergebene PP. Schaden W20−1 / W20+4, Durchschnitt vor Rüstung 9,5 / 14,5. WK zweihändig je 9. Berechnung gegen Waffenpool-, Schadens- und Griffdarstellung geprüft; keine zusätzlichen SP-Ausgaben. Vollständige Rechnung im Vergleichsdokument. Nächster Vorschlag: 12 PP nach identischer Priorität verteilen; noch nicht beauftragt.

### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 041 · GELÖST — Gesamtübersicht beider Nahkämpfer erstellt

Aktueller Abschluss: [Gesamtübersicht](Nahkampfvergleich-Gesamtuebersicht.md) als konsolidierte Referenz erstellt und im Vergleichsprotokoll verlinkt. Enthält alle aktuellen Eigenschaften/Attribute, Fertigkeiten und Talente, Kampf-/LE-Werte, PP, Ausrüstung und vollständige bisherige SP-/TaP-Rechnung. Keine neuen Käufe. Eigenschaftskosten aus Volks-/Kostendaten erneut geprüft:4131/4125 SP, Gesamt6397/6382, Rest3/18; je4 TaP. Offene Punkte ausdrücklich getrennt: konkrete SSK und Welt/Identität, Versorgung/Verbrauch/Transport/Geldbeutel, Beschaffbarkeit/Passform/Traglast, vollständiger Charakter- und Exporttest. Bisherige Budgetrechnung ist kein vollständiger Charaktertest. Nächster Vorschlag: Herkunft und SSK konkret wählen, danach Ausrüstung/Versorgung prüfen. Nur Dokumentation, keine Charakterdateien oder Generatoränderungen, kein Commit/Push. Vollständiger weiterhin geltender Fach- und Entscheidungsstand folgt; die Gesamtübersicht ist für die aktuellen Vergleichswerte maßgeblich.

Neuester Abschluss mit Vorrang: Nutzer bestätigt Indianer SCH15→17 (93 SP), Troll-Fokus KON/LE und STÄ umgesetzt mit jeweils19→21 (je117, zusammen234 SP), Varianten gegengeprüft. Neue Rest-SP3/18, Gesamtausgaben6397/6382; TaP je4 frei. Indianer STÄ/ATH/SCH/KON/MUT17/17/17/15/13, Troll21/17/15/21/13. Indianer PA-Basis12 statt11, ein PP von nPA auf gPA umverteilt: n15/15 g5/5 m22/22; Troll n15/15 g5/4 m22/22. Je16 PP, AT/PA8/8. Schaden W20+3/W20+5, Mittel13,5/15,5. LE12/23/18 vs14/27/21, Ausdauer68/82, Gesundheit13/15, Trefferschwelle9. AW beide weiterhin15/11,g2/m22 trotz SCH-Rundung. RM20/19 und RBE0,Vit4/Glück3 unverändert. Höhere Trollwerte21 sind zusätzliche Vertiefung, ändern nicht globalen CK-Zielbereich. Kosten/Grenzen/Rundung/PP geprüft, nur Dokumentation. Frühere Eigenschafts-/Rest-/LE-/Schadenswerte unten ersetzt. Nächster Vorschlag: Gesamtübersicht und offene Pflichtangaben abschließen; konkrete SSK, Versorgung/Last/Beschaffung und vollständiger Charaktertest bleiben offen.

Aktueller Abschluss mit Vorrang: Nutzer bestätigt SF Ausweichen6 für beide, je54 SP. Jetzt als Kauf in Vergleichsplanung übernommen; AW defensiv15/offensiv11, g2/m22. Rest96/252 SP, Gesamtausgaben6304/6148. Je4 TaP frei; RM20/19 mit Talentstufen1+2 und RBE0 bleiben. GF/SF46/45 Punkte, Kosten414/405. Axtproben15/15,5/4,22/22, Schaden13,5/14,5, alle übrigen Werte unverändert. Kosten/Rundung/Rest geprüft, nur Dokumentation, keine Charakter-/Generatoränderung oder Laufzeittests. Vorherige Aussagen SF0/AW13/9/Rest150/306 und noch nicht gekaufte AW6-Variante unten ersetzt. Nächster Vorschlag: kompakte Gesamtübersicht beider Vergleichsprofile mit offenen Pflichtangaben erstellen, keine weiteren Käufe. Konkrete SSK-Identitäten und vollständige Versorgung/Traglast/Beschaffung bleiben offen.

Neuester Abschluss mit Vorrang: Nutzer bestätigt RM20 beim Indianer/RM19 beim Troll und Talentstufen1+2. Jetzt als Käufe in Vergleichsplanung übernommen: Mehrkosten72/63 SP, Gesamtausgaben6250/6094, Rest150/306 SP. Je16 TaP ausgegeben,4 frei, Maximum20 durch vollständige Kette freigeschaltet. RH30 ergibt bei beiden RBE0/KBE0. AW bei SF0 jetzt defensiv13/offensiv9/g2/m22; Axtproben15/15,5/4,22/22, Schaden13,5/14,5 bleiben. RM12 als Berufsmindestziel enthalten; darüberliegende Käufe sind zusätzlicher Null-RBE-Ausbildungswunsch. GF/SF gesamt40/39 Punkte. Vitalität4/Glück3, Hintergrund und Ausrüstung unverändert. Vergleichsdokument oben aktualisiert, Budgets/Maximum/Kette/RBE nachgerechnet; keine Charakter-/Generatoränderung oder Laufzeittests. Frühere Aussagen RM12/20 freie TaP/Rest222/369 und noch nicht gekaufte RBE0-Variante unten ersetzt. Nächster Vorschlag: SF Ausweichen6 für54 SP → defensiv15/offensiv11, Rest96/252; noch nicht gekauft. Konkrete SSK und Versorgung/Last/Beschaffung weiterhin offen.

Aktueller Abschluss mit Vorrang: Nutzer senkt Vitalität auf4, Glück3 bleibt. Attributkosten740, Ersparnis160 SP je NPC, Rest222/369 SP, Gesamtausgaben6178/6031. Keine Vitalitätsfreischaltung nötig. Ausdauer68/77, Gesundheit13/14, LE12/23/18 bzw.13/26/20, Trefferschwelle9. AW aktuell mit RM12/KBE2 und AW-SF0 bei beiden defensiv11/offensiv7/g2/m22; bei RBE0 hypothetisch13/9/2/22. Talentkette RM1+2 kostet2+14=16 von20 TaP, erlaubt Maximum20. RM20/19 kostet zusätzlich72/63 SP, Rest dann150/306; nur Variante, nicht gekauft. RM24 benötigt32 TaP und passt nicht auf Stufe0. Frühere Vitalität5/Freischaltungsblockade unten überholt. Details und AW-Steigerungsvarianten oben im Vergleich/Eigenschaften dokumentiert. Nächster Vorschlag: RM-Talente1+2 und RM20/19 für RBE0 wählen, danach AW prüfen; aktuell RM12 und20 freie TaP erhalten. Nur Dokumentation und Formel-/Kettenprüfung, kein vollständiger Charaktertest oder Generatoränderung.

Neueste Prüfung: Keine Käufe geändert. +6 RM auf18 ergibt RBE1/3 bzw.0,1, jeweils1 KBE; +12 auf24 ergibt0. Minimalziele Indianer20/Troll19, Mehrkosten72/63 SP, hypothetischer Rest−10/146. Über RM12 Talentfreischaltung erforderlich (+8 für Ziele19/20, +12 für24), TaP/Ketten ungeprüft. Neu erkannt: Attributmaximum auf Kreis0 regulär4 laut fertigkeitenGrenzen.ts; gewünschte Vitalität5 benötigt ebenfalls Freischaltung. Früherer Kostenvergleich ist kein Legalitätsnachweis; Vitalität nicht eigenmächtig geändert. Details oben im Nahkampfvergleich. Nächster Vorschlag: beide Freischaltungen/TaP prüfen, anschließend10 fehlende Indianer-SP klären. Aktuelle tatsächlich geplante RM12 und Rest62/209 bleiben bestehen. Nur Dokumentation/Rechnung.

Aktueller Abschluss mit Vorrang: Beide Städter, Terrain Stadt, soziale Lage Einfach, Aussehen/Schlaf Normal als konkrete Vergleichsauswahl. Vollständige Beiträge/Referenzen/Zusammenführung oben im Nahkampfvergleich dokumentiert. Hintergrund-GF12 Punkte=108 SP neu, GF/SF insgesamt32 Punkte=288 SP inklusive RM12. WHK-Hintergrund erst addieren und dann per Maximum mit bestehenden Ausbildungszielen zusammenführen; zusätzliche Käufe Kaufmann2 (11), Krämer2 (5), Gemeinvolk3 (6), Stadt4 (7), insgesamt29 SP neu, WHK insgesamt352. Wald8 aus Ausbildung bleibt erhalten. Pflichtmerkmale0 SP. Netto137 SP je NPC; Gesamtausgaben6338/6191, Rest62/209 SP. Ausrüstung/PP/Attribute/CK-Ziele unverändert; Rüstung2 KBE. Konkrete SSK-Identitäten und Versorgung/Last/Beschaffbarkeit weiterhin offen; keine vollständigen NPCs behauptet. Pools/Kosten/Minima und Gesamtsummen geprüft, nur Dokumentation, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere offene Hintergrundauswahl und Rest199/346 unten ersetzt. Nächster Vorschlag: Pflichtvoraussetzungen und Einsatzfähigkeit gezielt prüfen, beginnend mit konkreter SSK-Zuordnung und Ausweichen/Belastung; Rest bis dahin erhalten. Noch kein Auftrag für weitere Käufe.

Neueste Nutzerentscheidung mit Vorrang: Berufs-/Ausrüstungspaket Wache enthält Rüstungsmanöver mindestens12; ersetzt dort bisherige reine Bedarfsbelegung2/1. Keine globale Vorgabe12 für andere Berufe. Mindestziele per Maximum und vorhandene Käufe einmal anrechnen. Je108 SP, zusätzlich90/99 gegenüber vorherigem Vergleich. Rest Indianer199/Troll346 SP. Bei RH30 RBE1,3333/1,1, beide2 KBE. Berufsbasis inklusive RM316 SP=4,9375 %, GF/SF gesamt20 Punkte. WHK323 und SSK120 unverändert. Ausrüstung, CK-Ziele, H/S16, Vit5/Glück3, PP-Verteilung unverändert. Vergleich, GF/SF- und Rüstungsfachdokument oben ergänzt; Kosten/Maximum/RBE geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere RM2/1,3KBE,Rest289/445-Angaben unten ersetzt. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und Pflichtmerkmale bestimmen, Beiträge zusammenführen, Rest prüfen. Noch nicht beauftragt.

Aktueller Abschluss mit Vorrang: gemeinsame Wache als Vergleichsannahme gewählt, WHK-Güte Meister, protokollierender Dienst. SSK120 SP (Sprache3/Kultur3/Schrift2, konkrete Identität offen), Berufsbasis208 SP=3,25 % (WHK136 + GF/SF72). Bestehendes breites Wache-WHK-Beispiel auf323 SP finanziert, Mehrkosten187, inklusive ausdrücklich als Entwurf gekennzeichneter Führung8. Zeughausrüstung von der Stange kostet1561 D bei RH30; RM2/1 für18/9 SP ergeben RBE3/2,9333 und jeweils3 KBE. Kleidung/Arbeitsmittel92,137 D, mit Axt97 D Gesamtausstattung1750,137 D innerhalb5000 D, ausgewählter Umfang ohne vollständige Versorgung/Lastprüfung. Rest jetzt289/445 SP. Endwerte/Artikel/Annahmen und offene Auswahlen oben im Nahkampfvergleich vollständig dokumentiert. Aussehen/Schlaf und Lebenswelt/Terrain/Soziallage sowie konkrete SSK bleiben offen; keine fertigen NPCs behauptet. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und neutrale Pflichtmerkmale wählen, Beiträge zusammenführen, Rest neu rechnen; noch nicht ausgeführt. Nur Dokumentation und Kosten-/Rüstungsprüfung, keine Laufzeit-/Charakteränderung oder Tests. Frühere Budgetreste und Aussagen zu noch nicht bezahlter beruflicher Basis unten sind ersetzt.

Neuester Abschluss mit Vorrang: Nutzer bestätigt Vitalität 5 und Glück 3 für beide Nahkämpfer. Je 600+300=900 SP ab 0, Attributminimum damit erfüllt ohne Zusatzabzug. Rest jetzt Indianer 822/Troll 969 SP vor SSK/Hintergrund/beruflicher Basis und weiteren Grundausgaben. Ausdauer 71/80, Gesundheit 14/15, LE Kopf/Brust/Unterleib 13/24/18 bzw. 14/26/20, Trefferschwelle beide 10. Axtproben n15/15 g5/4 m22/22 und Durchschnittsschaden 13,5/14,5 unverändert. Ausgearbeitet in Nahkampfvergleich und Eigenschaften-und-Attribute; Formeln arithmetisch geprüft, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere Restwerte und offene Attributziele unten sind ersetzt. Nächster Vorschlag: SSK und konkrete berufliche Basis einschließlich Ausstattung/Rüstungsmanöver bepreisen; Beruf und Hintergrund noch zu wählen. Keine weiteren Ausgaben beauftragt.

Abschluss dieses Schritts mit Vorrang: CK-Zielprofil jetzt in Axtvergleich übernommen. Indianer STÄ/ATH/SCH/KON/MUT 17/17/15/15/13, Troll 19/17/15/19/13. Beide H/S16, gleiche Eisenäxte zweihändig. nAT/nPA vor PP 12/11; je 3/4 PP für Ziel 15/15, Rest 9 als 7 gute / 2 meisterliche (Ganzzahlnäherung 3:1). PP gAT/gPA/mAT/mPA 4/3/1/1. Endwerte 15/15, 5/4, 22/22; 0 PP frei, AT/PA-Investition 8/8, Grenzen eingehalten. Schaden W20+3 / W20+4, Durchschnitt 13,5/14,5. Rest-SP 1722/1869 vor weiteren Grundausgaben unverändert. Aktuelle Rechnung oben im Nahkampfvergleich dokumentiert; frühere Zahlen unten sind Zwischenstände. Nächster Vorschlag: Vitalität und geringer Glück mit Zielwerten/Kosten ergänzen, noch nicht beauftragt. Nur Dokumentation und arithmetische Prüfung, keine Laufzeittests oder Charakter-/Generatoränderungen.

Neuester Stand mit Vorrang: Nutzer bestätigt CK-Nahkämpfer-Zielbereich 13–17 auf Stufe 0 und Stärke zwingend mit hoher Priorität, unabhängig vom vorigen Axtbeispiel. Konkrete Gewichtung auf Auftrag ausgearbeitet: Stärke 17, Athletik 17, Schnelligkeit 15, Konstitution 15, Mut 13. Profilentwurf in Eigenschaften-und-Attribute.md dokumentiert; höhere Volksminima erhalten, keine Prozentgewichte erfunden. Kosten vom Sockel Indianer 912 / Troll 540 SP (enthält dessen frühere 120 SP). Mit H/S16 rechnerischer Rest 1722/1869 vor weiteren Grundausgaben. Ziele gegen Volksobergrenzen und Kostentabelle geprüft. Alte Kampfwerte unten gehören zum früheren 9er-Vergleich, nicht zum neuen Zielprofil. Nächster Vorschlag: Axtkampfwerte einschließlich PP und Schaden mit Zielprofil neu rechnen, danach Vitalität/Glück; noch nicht ausgeführt. Keine Laufzeit-/Charakteränderung, kein Commit/Push.

Aktueller Schritt mit Vorrang: Nutzer setzt CK-relevante Eigenschaften auf mindestens 9. Hier Athletik/Schnelligkeit/Mut sowie Konstitution; Stärke als Waffen-/Schadenswert ebenfalls bereits über 9. Attribute Vitalität/Glück erhalten kein 9er-Minimum. Indianer kein Zukauf; Troll SCH 5 auf 9 für 120 SP. Hiebwaffen/Äxte weiterhin 16/16. Jetzt nAT/nPA vor PP 9/8 bzw. 10/8; beide erreichen 15/15 regelkonform. Indianer gAT/gPA 2/2, mAT/mPA 22/21 (Rest 3, Näherung g:m=2:1); Troll 3/2 und 22/21 (Rest 4, exakt 3:1). Je 16 PP verbraucht, AT/PA-Ausgaben 8/8. Vorherige Troll-Blockade gelöst. Schaden 9,5/14,5 unverändert. SP-Reste nach Sockel/Ausbildung/CK-Minimum 2634/2289, Differenz 345; weitere Grundausgaben fehlen. Vollständiger aktueller Vergleich oben in Nahkampfvergleich-Indianer-Troll.md. Nächster Vorschlag: Vitalität und geringer Glück mit Kostenvarianten ergänzen, noch keine Ziele/Käufe beschlossen. Nur Dokumentation; Sockel/Kostentabelle und Rechnungen geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere Zwischenwerte im übernommenen Stand sind durch diese Angaben ersetzt.

Ergebnis: [Nahkampfvergleich Indianer / Troll](Nahkampfvergleich-Indianer-Troll.md) als Planungsrechnung angelegt. Beide Hiebwaffen 12 / Äxte 12 für je 480 SP; beide Axt aus Eisen, Gesellenarbeit, Von der Stange, Standardschaft für je 97 D. Rest nach Volkssockel und diesen Käufen 2794 / 2569 SP, noch vor weiteren Grundausgaben. Keine Charakterdateien oder Generatorlogik geändert. Kosten und Katalogwerte abgeglichen; keine Laufzeittests, kein Commit/Push.

### Neue Entscheidungen mit Vorrang vor dem übernommenen Fachstand

SSK gehört in Rahmen/Hintergrund. Ausstattung an Profession binden und ihre SP-Voraussetzungen einschließlich Rüstungsmanöver erfassen. Berufliche Basis ca. 3–5 % der gesamten SP als diskutierter Ansatz; Abgrenzung zu WHK mindestens 5 % / Attributen mindestens 3 % noch offen. Anschließend gemeinsames Restbudget mit Reglern für FK/NK/Spruchmagie/KI/PSI und bessere Berufsfähigkeiten, Summe 100 %. Jeder Zweig finanziert passende Eigenschaften, Attribute und Voraussetzungen mit. Magiegrundwerte vor Repertoire. Klassen als zu prüfende Presets.

Unbewaffnet = Kreis × 3 ist ausdrücklich verworfen. Alle entsprechenden Aussagen im unten übernommenen Stand und älteren Fachunterlagen sind überholt, keine neue Pflicht beschlossen. Frühere Grafikgruppierung durch SSK-/Professionsentscheidung ebenfalls überholt. Fachunterlagen noch nicht umfassend umgestellt; vor Implementierung abgleichen.

Nahkampfvergleich: gewichtete Eigenschaftsbestandteile von AW/AT/PA, zusätzlich Konstitution und Vitalität, geringer Glück. Hiebwaffen und Äxte immer gleich hoch, aktuell beide 12. Indianer Stärke 10 erfüllt die Zweihandanforderung der Axt, Troll Stärke 19 auch einhändig. Griffart jetzt für beide zweihändig bestätigt. nAT/nPA vor Poolverteilung Indianer 8/7, Troll 9/5; je 12 unvergebene PP. Schaden W20−1 / W20+4, Durchschnitt vor Rüstung 9,5 / 14,5. WK zweihändig je 9. Berechnung gegen Waffenpool-, Schadens- und Griffdarstellung geprüft; keine zusätzlichen SP-Ausgaben. Vollständige Rechnung im Vergleichsdokument. Nächster Vorschlag: 12 PP nach identischer Priorität verteilen; noch nicht beauftragt.

### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 040 · GELÖST — Indianer SCH17, Troll KON21/STÄ21

Neuester Abschluss mit Vorrang: Nutzer bestätigt Indianer SCH15→17 (93 SP), Troll-Fokus KON/LE und STÄ umgesetzt mit jeweils19→21 (je117, zusammen234 SP), Varianten gegengeprüft. Neue Rest-SP3/18, Gesamtausgaben6397/6382; TaP je4 frei. Indianer STÄ/ATH/SCH/KON/MUT17/17/17/15/13, Troll21/17/15/21/13. Indianer PA-Basis12 statt11, ein PP von nPA auf gPA umverteilt: n15/15 g5/5 m22/22; Troll n15/15 g5/4 m22/22. Je16 PP, AT/PA8/8. Schaden W20+3/W20+5, Mittel13,5/15,5. LE12/23/18 vs14/27/21, Ausdauer68/82, Gesundheit13/15, Trefferschwelle9. AW beide weiterhin15/11,g2/m22 trotz SCH-Rundung. RM20/19 und RBE0,Vit4/Glück3 unverändert. Höhere Trollwerte21 sind zusätzliche Vertiefung, ändern nicht globalen CK-Zielbereich. Kosten/Grenzen/Rundung/PP geprüft, nur Dokumentation. Frühere Eigenschafts-/Rest-/LE-/Schadenswerte unten ersetzt. Nächster Vorschlag: Gesamtübersicht und offene Pflichtangaben abschließen; konkrete SSK, Versorgung/Last/Beschaffung und vollständiger Charaktertest bleiben offen.

Aktueller Abschluss mit Vorrang: Nutzer bestätigt SF Ausweichen6 für beide, je54 SP. Jetzt als Kauf in Vergleichsplanung übernommen; AW defensiv15/offensiv11, g2/m22. Rest96/252 SP, Gesamtausgaben6304/6148. Je4 TaP frei; RM20/19 mit Talentstufen1+2 und RBE0 bleiben. GF/SF46/45 Punkte, Kosten414/405. Axtproben15/15,5/4,22/22, Schaden13,5/14,5, alle übrigen Werte unverändert. Kosten/Rundung/Rest geprüft, nur Dokumentation, keine Charakter-/Generatoränderung oder Laufzeittests. Vorherige Aussagen SF0/AW13/9/Rest150/306 und noch nicht gekaufte AW6-Variante unten ersetzt. Nächster Vorschlag: kompakte Gesamtübersicht beider Vergleichsprofile mit offenen Pflichtangaben erstellen, keine weiteren Käufe. Konkrete SSK-Identitäten und vollständige Versorgung/Traglast/Beschaffung bleiben offen.

Neuester Abschluss mit Vorrang: Nutzer bestätigt RM20 beim Indianer/RM19 beim Troll und Talentstufen1+2. Jetzt als Käufe in Vergleichsplanung übernommen: Mehrkosten72/63 SP, Gesamtausgaben6250/6094, Rest150/306 SP. Je16 TaP ausgegeben,4 frei, Maximum20 durch vollständige Kette freigeschaltet. RH30 ergibt bei beiden RBE0/KBE0. AW bei SF0 jetzt defensiv13/offensiv9/g2/m22; Axtproben15/15,5/4,22/22, Schaden13,5/14,5 bleiben. RM12 als Berufsmindestziel enthalten; darüberliegende Käufe sind zusätzlicher Null-RBE-Ausbildungswunsch. GF/SF gesamt40/39 Punkte. Vitalität4/Glück3, Hintergrund und Ausrüstung unverändert. Vergleichsdokument oben aktualisiert, Budgets/Maximum/Kette/RBE nachgerechnet; keine Charakter-/Generatoränderung oder Laufzeittests. Frühere Aussagen RM12/20 freie TaP/Rest222/369 und noch nicht gekaufte RBE0-Variante unten ersetzt. Nächster Vorschlag: SF Ausweichen6 für54 SP → defensiv15/offensiv11, Rest96/252; noch nicht gekauft. Konkrete SSK und Versorgung/Last/Beschaffung weiterhin offen.

Aktueller Abschluss mit Vorrang: Nutzer senkt Vitalität auf4, Glück3 bleibt. Attributkosten740, Ersparnis160 SP je NPC, Rest222/369 SP, Gesamtausgaben6178/6031. Keine Vitalitätsfreischaltung nötig. Ausdauer68/77, Gesundheit13/14, LE12/23/18 bzw.13/26/20, Trefferschwelle9. AW aktuell mit RM12/KBE2 und AW-SF0 bei beiden defensiv11/offensiv7/g2/m22; bei RBE0 hypothetisch13/9/2/22. Talentkette RM1+2 kostet2+14=16 von20 TaP, erlaubt Maximum20. RM20/19 kostet zusätzlich72/63 SP, Rest dann150/306; nur Variante, nicht gekauft. RM24 benötigt32 TaP und passt nicht auf Stufe0. Frühere Vitalität5/Freischaltungsblockade unten überholt. Details und AW-Steigerungsvarianten oben im Vergleich/Eigenschaften dokumentiert. Nächster Vorschlag: RM-Talente1+2 und RM20/19 für RBE0 wählen, danach AW prüfen; aktuell RM12 und20 freie TaP erhalten. Nur Dokumentation und Formel-/Kettenprüfung, kein vollständiger Charaktertest oder Generatoränderung.

Neueste Prüfung: Keine Käufe geändert. +6 RM auf18 ergibt RBE1/3 bzw.0,1, jeweils1 KBE; +12 auf24 ergibt0. Minimalziele Indianer20/Troll19, Mehrkosten72/63 SP, hypothetischer Rest−10/146. Über RM12 Talentfreischaltung erforderlich (+8 für Ziele19/20, +12 für24), TaP/Ketten ungeprüft. Neu erkannt: Attributmaximum auf Kreis0 regulär4 laut fertigkeitenGrenzen.ts; gewünschte Vitalität5 benötigt ebenfalls Freischaltung. Früherer Kostenvergleich ist kein Legalitätsnachweis; Vitalität nicht eigenmächtig geändert. Details oben im Nahkampfvergleich. Nächster Vorschlag: beide Freischaltungen/TaP prüfen, anschließend10 fehlende Indianer-SP klären. Aktuelle tatsächlich geplante RM12 und Rest62/209 bleiben bestehen. Nur Dokumentation/Rechnung.

Aktueller Abschluss mit Vorrang: Beide Städter, Terrain Stadt, soziale Lage Einfach, Aussehen/Schlaf Normal als konkrete Vergleichsauswahl. Vollständige Beiträge/Referenzen/Zusammenführung oben im Nahkampfvergleich dokumentiert. Hintergrund-GF12 Punkte=108 SP neu, GF/SF insgesamt32 Punkte=288 SP inklusive RM12. WHK-Hintergrund erst addieren und dann per Maximum mit bestehenden Ausbildungszielen zusammenführen; zusätzliche Käufe Kaufmann2 (11), Krämer2 (5), Gemeinvolk3 (6), Stadt4 (7), insgesamt29 SP neu, WHK insgesamt352. Wald8 aus Ausbildung bleibt erhalten. Pflichtmerkmale0 SP. Netto137 SP je NPC; Gesamtausgaben6338/6191, Rest62/209 SP. Ausrüstung/PP/Attribute/CK-Ziele unverändert; Rüstung2 KBE. Konkrete SSK-Identitäten und Versorgung/Last/Beschaffbarkeit weiterhin offen; keine vollständigen NPCs behauptet. Pools/Kosten/Minima und Gesamtsummen geprüft, nur Dokumentation, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere offene Hintergrundauswahl und Rest199/346 unten ersetzt. Nächster Vorschlag: Pflichtvoraussetzungen und Einsatzfähigkeit gezielt prüfen, beginnend mit konkreter SSK-Zuordnung und Ausweichen/Belastung; Rest bis dahin erhalten. Noch kein Auftrag für weitere Käufe.

Neueste Nutzerentscheidung mit Vorrang: Berufs-/Ausrüstungspaket Wache enthält Rüstungsmanöver mindestens12; ersetzt dort bisherige reine Bedarfsbelegung2/1. Keine globale Vorgabe12 für andere Berufe. Mindestziele per Maximum und vorhandene Käufe einmal anrechnen. Je108 SP, zusätzlich90/99 gegenüber vorherigem Vergleich. Rest Indianer199/Troll346 SP. Bei RH30 RBE1,3333/1,1, beide2 KBE. Berufsbasis inklusive RM316 SP=4,9375 %, GF/SF gesamt20 Punkte. WHK323 und SSK120 unverändert. Ausrüstung, CK-Ziele, H/S16, Vit5/Glück3, PP-Verteilung unverändert. Vergleich, GF/SF- und Rüstungsfachdokument oben ergänzt; Kosten/Maximum/RBE geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere RM2/1,3KBE,Rest289/445-Angaben unten ersetzt. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und Pflichtmerkmale bestimmen, Beiträge zusammenführen, Rest prüfen. Noch nicht beauftragt.

Aktueller Abschluss mit Vorrang: gemeinsame Wache als Vergleichsannahme gewählt, WHK-Güte Meister, protokollierender Dienst. SSK120 SP (Sprache3/Kultur3/Schrift2, konkrete Identität offen), Berufsbasis208 SP=3,25 % (WHK136 + GF/SF72). Bestehendes breites Wache-WHK-Beispiel auf323 SP finanziert, Mehrkosten187, inklusive ausdrücklich als Entwurf gekennzeichneter Führung8. Zeughausrüstung von der Stange kostet1561 D bei RH30; RM2/1 für18/9 SP ergeben RBE3/2,9333 und jeweils3 KBE. Kleidung/Arbeitsmittel92,137 D, mit Axt97 D Gesamtausstattung1750,137 D innerhalb5000 D, ausgewählter Umfang ohne vollständige Versorgung/Lastprüfung. Rest jetzt289/445 SP. Endwerte/Artikel/Annahmen und offene Auswahlen oben im Nahkampfvergleich vollständig dokumentiert. Aussehen/Schlaf und Lebenswelt/Terrain/Soziallage sowie konkrete SSK bleiben offen; keine fertigen NPCs behauptet. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und neutrale Pflichtmerkmale wählen, Beiträge zusammenführen, Rest neu rechnen; noch nicht ausgeführt. Nur Dokumentation und Kosten-/Rüstungsprüfung, keine Laufzeit-/Charakteränderung oder Tests. Frühere Budgetreste und Aussagen zu noch nicht bezahlter beruflicher Basis unten sind ersetzt.

Neuester Abschluss mit Vorrang: Nutzer bestätigt Vitalität 5 und Glück 3 für beide Nahkämpfer. Je 600+300=900 SP ab 0, Attributminimum damit erfüllt ohne Zusatzabzug. Rest jetzt Indianer 822/Troll 969 SP vor SSK/Hintergrund/beruflicher Basis und weiteren Grundausgaben. Ausdauer 71/80, Gesundheit 14/15, LE Kopf/Brust/Unterleib 13/24/18 bzw. 14/26/20, Trefferschwelle beide 10. Axtproben n15/15 g5/4 m22/22 und Durchschnittsschaden 13,5/14,5 unverändert. Ausgearbeitet in Nahkampfvergleich und Eigenschaften-und-Attribute; Formeln arithmetisch geprüft, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere Restwerte und offene Attributziele unten sind ersetzt. Nächster Vorschlag: SSK und konkrete berufliche Basis einschließlich Ausstattung/Rüstungsmanöver bepreisen; Beruf und Hintergrund noch zu wählen. Keine weiteren Ausgaben beauftragt.

Abschluss dieses Schritts mit Vorrang: CK-Zielprofil jetzt in Axtvergleich übernommen. Indianer STÄ/ATH/SCH/KON/MUT 17/17/15/15/13, Troll 19/17/15/19/13. Beide H/S16, gleiche Eisenäxte zweihändig. nAT/nPA vor PP 12/11; je 3/4 PP für Ziel 15/15, Rest 9 als 7 gute / 2 meisterliche (Ganzzahlnäherung 3:1). PP gAT/gPA/mAT/mPA 4/3/1/1. Endwerte 15/15, 5/4, 22/22; 0 PP frei, AT/PA-Investition 8/8, Grenzen eingehalten. Schaden W20+3 / W20+4, Durchschnitt 13,5/14,5. Rest-SP 1722/1869 vor weiteren Grundausgaben unverändert. Aktuelle Rechnung oben im Nahkampfvergleich dokumentiert; frühere Zahlen unten sind Zwischenstände. Nächster Vorschlag: Vitalität und geringer Glück mit Zielwerten/Kosten ergänzen, noch nicht beauftragt. Nur Dokumentation und arithmetische Prüfung, keine Laufzeittests oder Charakter-/Generatoränderungen.

Neuester Stand mit Vorrang: Nutzer bestätigt CK-Nahkämpfer-Zielbereich 13–17 auf Stufe 0 und Stärke zwingend mit hoher Priorität, unabhängig vom vorigen Axtbeispiel. Konkrete Gewichtung auf Auftrag ausgearbeitet: Stärke 17, Athletik 17, Schnelligkeit 15, Konstitution 15, Mut 13. Profilentwurf in Eigenschaften-und-Attribute.md dokumentiert; höhere Volksminima erhalten, keine Prozentgewichte erfunden. Kosten vom Sockel Indianer 912 / Troll 540 SP (enthält dessen frühere 120 SP). Mit H/S16 rechnerischer Rest 1722/1869 vor weiteren Grundausgaben. Ziele gegen Volksobergrenzen und Kostentabelle geprüft. Alte Kampfwerte unten gehören zum früheren 9er-Vergleich, nicht zum neuen Zielprofil. Nächster Vorschlag: Axtkampfwerte einschließlich PP und Schaden mit Zielprofil neu rechnen, danach Vitalität/Glück; noch nicht ausgeführt. Keine Laufzeit-/Charakteränderung, kein Commit/Push.

Aktueller Schritt mit Vorrang: Nutzer setzt CK-relevante Eigenschaften auf mindestens 9. Hier Athletik/Schnelligkeit/Mut sowie Konstitution; Stärke als Waffen-/Schadenswert ebenfalls bereits über 9. Attribute Vitalität/Glück erhalten kein 9er-Minimum. Indianer kein Zukauf; Troll SCH 5 auf 9 für 120 SP. Hiebwaffen/Äxte weiterhin 16/16. Jetzt nAT/nPA vor PP 9/8 bzw. 10/8; beide erreichen 15/15 regelkonform. Indianer gAT/gPA 2/2, mAT/mPA 22/21 (Rest 3, Näherung g:m=2:1); Troll 3/2 und 22/21 (Rest 4, exakt 3:1). Je 16 PP verbraucht, AT/PA-Ausgaben 8/8. Vorherige Troll-Blockade gelöst. Schaden 9,5/14,5 unverändert. SP-Reste nach Sockel/Ausbildung/CK-Minimum 2634/2289, Differenz 345; weitere Grundausgaben fehlen. Vollständiger aktueller Vergleich oben in Nahkampfvergleich-Indianer-Troll.md. Nächster Vorschlag: Vitalität und geringer Glück mit Kostenvarianten ergänzen, noch keine Ziele/Käufe beschlossen. Nur Dokumentation; Sockel/Kostentabelle und Rechnungen geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere Zwischenwerte im übernommenen Stand sind durch diese Angaben ersetzt.

Ergebnis: [Nahkampfvergleich Indianer / Troll](Nahkampfvergleich-Indianer-Troll.md) als Planungsrechnung angelegt. Beide Hiebwaffen 12 / Äxte 12 für je 480 SP; beide Axt aus Eisen, Gesellenarbeit, Von der Stange, Standardschaft für je 97 D. Rest nach Volkssockel und diesen Käufen 2794 / 2569 SP, noch vor weiteren Grundausgaben. Keine Charakterdateien oder Generatorlogik geändert. Kosten und Katalogwerte abgeglichen; keine Laufzeittests, kein Commit/Push.

### Neue Entscheidungen mit Vorrang vor dem übernommenen Fachstand

SSK gehört in Rahmen/Hintergrund. Ausstattung an Profession binden und ihre SP-Voraussetzungen einschließlich Rüstungsmanöver erfassen. Berufliche Basis ca. 3–5 % der gesamten SP als diskutierter Ansatz; Abgrenzung zu WHK mindestens 5 % / Attributen mindestens 3 % noch offen. Anschließend gemeinsames Restbudget mit Reglern für FK/NK/Spruchmagie/KI/PSI und bessere Berufsfähigkeiten, Summe 100 %. Jeder Zweig finanziert passende Eigenschaften, Attribute und Voraussetzungen mit. Magiegrundwerte vor Repertoire. Klassen als zu prüfende Presets.

Unbewaffnet = Kreis × 3 ist ausdrücklich verworfen. Alle entsprechenden Aussagen im unten übernommenen Stand und älteren Fachunterlagen sind überholt, keine neue Pflicht beschlossen. Frühere Grafikgruppierung durch SSK-/Professionsentscheidung ebenfalls überholt. Fachunterlagen noch nicht umfassend umgestellt; vor Implementierung abgleichen.

Nahkampfvergleich: gewichtete Eigenschaftsbestandteile von AW/AT/PA, zusätzlich Konstitution und Vitalität, geringer Glück. Hiebwaffen und Äxte immer gleich hoch, aktuell beide 12. Indianer Stärke 10 erfüllt die Zweihandanforderung der Axt, Troll Stärke 19 auch einhändig. Griffart jetzt für beide zweihändig bestätigt. nAT/nPA vor Poolverteilung Indianer 8/7, Troll 9/5; je 12 unvergebene PP. Schaden W20−1 / W20+4, Durchschnitt vor Rüstung 9,5 / 14,5. WK zweihändig je 9. Berechnung gegen Waffenpool-, Schadens- und Griffdarstellung geprüft; keine zusätzlichen SP-Ausgaben. Vollständige Rechnung im Vergleichsdokument. Nächster Vorschlag: 12 PP nach identischer Priorität verteilen; noch nicht beauftragt.

### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 039 · GELÖST — Ausweichen6 übernommen

Aktueller Abschluss mit Vorrang: Nutzer bestätigt SF Ausweichen6 für beide, je54 SP. Jetzt als Kauf in Vergleichsplanung übernommen; AW defensiv15/offensiv11, g2/m22. Rest96/252 SP, Gesamtausgaben6304/6148. Je4 TaP frei; RM20/19 mit Talentstufen1+2 und RBE0 bleiben. GF/SF46/45 Punkte, Kosten414/405. Axtproben15/15,5/4,22/22, Schaden13,5/14,5, alle übrigen Werte unverändert. Kosten/Rundung/Rest geprüft, nur Dokumentation, keine Charakter-/Generatoränderung oder Laufzeittests. Vorherige Aussagen SF0/AW13/9/Rest150/306 und noch nicht gekaufte AW6-Variante unten ersetzt. Nächster Vorschlag: kompakte Gesamtübersicht beider Vergleichsprofile mit offenen Pflichtangaben erstellen, keine weiteren Käufe. Konkrete SSK-Identitäten und vollständige Versorgung/Traglast/Beschaffung bleiben offen.

Neuester Abschluss mit Vorrang: Nutzer bestätigt RM20 beim Indianer/RM19 beim Troll und Talentstufen1+2. Jetzt als Käufe in Vergleichsplanung übernommen: Mehrkosten72/63 SP, Gesamtausgaben6250/6094, Rest150/306 SP. Je16 TaP ausgegeben,4 frei, Maximum20 durch vollständige Kette freigeschaltet. RH30 ergibt bei beiden RBE0/KBE0. AW bei SF0 jetzt defensiv13/offensiv9/g2/m22; Axtproben15/15,5/4,22/22, Schaden13,5/14,5 bleiben. RM12 als Berufsmindestziel enthalten; darüberliegende Käufe sind zusätzlicher Null-RBE-Ausbildungswunsch. GF/SF gesamt40/39 Punkte. Vitalität4/Glück3, Hintergrund und Ausrüstung unverändert. Vergleichsdokument oben aktualisiert, Budgets/Maximum/Kette/RBE nachgerechnet; keine Charakter-/Generatoränderung oder Laufzeittests. Frühere Aussagen RM12/20 freie TaP/Rest222/369 und noch nicht gekaufte RBE0-Variante unten ersetzt. Nächster Vorschlag: SF Ausweichen6 für54 SP → defensiv15/offensiv11, Rest96/252; noch nicht gekauft. Konkrete SSK und Versorgung/Last/Beschaffung weiterhin offen.

Aktueller Abschluss mit Vorrang: Nutzer senkt Vitalität auf4, Glück3 bleibt. Attributkosten740, Ersparnis160 SP je NPC, Rest222/369 SP, Gesamtausgaben6178/6031. Keine Vitalitätsfreischaltung nötig. Ausdauer68/77, Gesundheit13/14, LE12/23/18 bzw.13/26/20, Trefferschwelle9. AW aktuell mit RM12/KBE2 und AW-SF0 bei beiden defensiv11/offensiv7/g2/m22; bei RBE0 hypothetisch13/9/2/22. Talentkette RM1+2 kostet2+14=16 von20 TaP, erlaubt Maximum20. RM20/19 kostet zusätzlich72/63 SP, Rest dann150/306; nur Variante, nicht gekauft. RM24 benötigt32 TaP und passt nicht auf Stufe0. Frühere Vitalität5/Freischaltungsblockade unten überholt. Details und AW-Steigerungsvarianten oben im Vergleich/Eigenschaften dokumentiert. Nächster Vorschlag: RM-Talente1+2 und RM20/19 für RBE0 wählen, danach AW prüfen; aktuell RM12 und20 freie TaP erhalten. Nur Dokumentation und Formel-/Kettenprüfung, kein vollständiger Charaktertest oder Generatoränderung.

Neueste Prüfung: Keine Käufe geändert. +6 RM auf18 ergibt RBE1/3 bzw.0,1, jeweils1 KBE; +12 auf24 ergibt0. Minimalziele Indianer20/Troll19, Mehrkosten72/63 SP, hypothetischer Rest−10/146. Über RM12 Talentfreischaltung erforderlich (+8 für Ziele19/20, +12 für24), TaP/Ketten ungeprüft. Neu erkannt: Attributmaximum auf Kreis0 regulär4 laut fertigkeitenGrenzen.ts; gewünschte Vitalität5 benötigt ebenfalls Freischaltung. Früherer Kostenvergleich ist kein Legalitätsnachweis; Vitalität nicht eigenmächtig geändert. Details oben im Nahkampfvergleich. Nächster Vorschlag: beide Freischaltungen/TaP prüfen, anschließend10 fehlende Indianer-SP klären. Aktuelle tatsächlich geplante RM12 und Rest62/209 bleiben bestehen. Nur Dokumentation/Rechnung.

Aktueller Abschluss mit Vorrang: Beide Städter, Terrain Stadt, soziale Lage Einfach, Aussehen/Schlaf Normal als konkrete Vergleichsauswahl. Vollständige Beiträge/Referenzen/Zusammenführung oben im Nahkampfvergleich dokumentiert. Hintergrund-GF12 Punkte=108 SP neu, GF/SF insgesamt32 Punkte=288 SP inklusive RM12. WHK-Hintergrund erst addieren und dann per Maximum mit bestehenden Ausbildungszielen zusammenführen; zusätzliche Käufe Kaufmann2 (11), Krämer2 (5), Gemeinvolk3 (6), Stadt4 (7), insgesamt29 SP neu, WHK insgesamt352. Wald8 aus Ausbildung bleibt erhalten. Pflichtmerkmale0 SP. Netto137 SP je NPC; Gesamtausgaben6338/6191, Rest62/209 SP. Ausrüstung/PP/Attribute/CK-Ziele unverändert; Rüstung2 KBE. Konkrete SSK-Identitäten und Versorgung/Last/Beschaffbarkeit weiterhin offen; keine vollständigen NPCs behauptet. Pools/Kosten/Minima und Gesamtsummen geprüft, nur Dokumentation, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere offene Hintergrundauswahl und Rest199/346 unten ersetzt. Nächster Vorschlag: Pflichtvoraussetzungen und Einsatzfähigkeit gezielt prüfen, beginnend mit konkreter SSK-Zuordnung und Ausweichen/Belastung; Rest bis dahin erhalten. Noch kein Auftrag für weitere Käufe.

Neueste Nutzerentscheidung mit Vorrang: Berufs-/Ausrüstungspaket Wache enthält Rüstungsmanöver mindestens12; ersetzt dort bisherige reine Bedarfsbelegung2/1. Keine globale Vorgabe12 für andere Berufe. Mindestziele per Maximum und vorhandene Käufe einmal anrechnen. Je108 SP, zusätzlich90/99 gegenüber vorherigem Vergleich. Rest Indianer199/Troll346 SP. Bei RH30 RBE1,3333/1,1, beide2 KBE. Berufsbasis inklusive RM316 SP=4,9375 %, GF/SF gesamt20 Punkte. WHK323 und SSK120 unverändert. Ausrüstung, CK-Ziele, H/S16, Vit5/Glück3, PP-Verteilung unverändert. Vergleich, GF/SF- und Rüstungsfachdokument oben ergänzt; Kosten/Maximum/RBE geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere RM2/1,3KBE,Rest289/445-Angaben unten ersetzt. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und Pflichtmerkmale bestimmen, Beiträge zusammenführen, Rest prüfen. Noch nicht beauftragt.

Aktueller Abschluss mit Vorrang: gemeinsame Wache als Vergleichsannahme gewählt, WHK-Güte Meister, protokollierender Dienst. SSK120 SP (Sprache3/Kultur3/Schrift2, konkrete Identität offen), Berufsbasis208 SP=3,25 % (WHK136 + GF/SF72). Bestehendes breites Wache-WHK-Beispiel auf323 SP finanziert, Mehrkosten187, inklusive ausdrücklich als Entwurf gekennzeichneter Führung8. Zeughausrüstung von der Stange kostet1561 D bei RH30; RM2/1 für18/9 SP ergeben RBE3/2,9333 und jeweils3 KBE. Kleidung/Arbeitsmittel92,137 D, mit Axt97 D Gesamtausstattung1750,137 D innerhalb5000 D, ausgewählter Umfang ohne vollständige Versorgung/Lastprüfung. Rest jetzt289/445 SP. Endwerte/Artikel/Annahmen und offene Auswahlen oben im Nahkampfvergleich vollständig dokumentiert. Aussehen/Schlaf und Lebenswelt/Terrain/Soziallage sowie konkrete SSK bleiben offen; keine fertigen NPCs behauptet. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und neutrale Pflichtmerkmale wählen, Beiträge zusammenführen, Rest neu rechnen; noch nicht ausgeführt. Nur Dokumentation und Kosten-/Rüstungsprüfung, keine Laufzeit-/Charakteränderung oder Tests. Frühere Budgetreste und Aussagen zu noch nicht bezahlter beruflicher Basis unten sind ersetzt.

Neuester Abschluss mit Vorrang: Nutzer bestätigt Vitalität 5 und Glück 3 für beide Nahkämpfer. Je 600+300=900 SP ab 0, Attributminimum damit erfüllt ohne Zusatzabzug. Rest jetzt Indianer 822/Troll 969 SP vor SSK/Hintergrund/beruflicher Basis und weiteren Grundausgaben. Ausdauer 71/80, Gesundheit 14/15, LE Kopf/Brust/Unterleib 13/24/18 bzw. 14/26/20, Trefferschwelle beide 10. Axtproben n15/15 g5/4 m22/22 und Durchschnittsschaden 13,5/14,5 unverändert. Ausgearbeitet in Nahkampfvergleich und Eigenschaften-und-Attribute; Formeln arithmetisch geprüft, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere Restwerte und offene Attributziele unten sind ersetzt. Nächster Vorschlag: SSK und konkrete berufliche Basis einschließlich Ausstattung/Rüstungsmanöver bepreisen; Beruf und Hintergrund noch zu wählen. Keine weiteren Ausgaben beauftragt.

Abschluss dieses Schritts mit Vorrang: CK-Zielprofil jetzt in Axtvergleich übernommen. Indianer STÄ/ATH/SCH/KON/MUT 17/17/15/15/13, Troll 19/17/15/19/13. Beide H/S16, gleiche Eisenäxte zweihändig. nAT/nPA vor PP 12/11; je 3/4 PP für Ziel 15/15, Rest 9 als 7 gute / 2 meisterliche (Ganzzahlnäherung 3:1). PP gAT/gPA/mAT/mPA 4/3/1/1. Endwerte 15/15, 5/4, 22/22; 0 PP frei, AT/PA-Investition 8/8, Grenzen eingehalten. Schaden W20+3 / W20+4, Durchschnitt 13,5/14,5. Rest-SP 1722/1869 vor weiteren Grundausgaben unverändert. Aktuelle Rechnung oben im Nahkampfvergleich dokumentiert; frühere Zahlen unten sind Zwischenstände. Nächster Vorschlag: Vitalität und geringer Glück mit Zielwerten/Kosten ergänzen, noch nicht beauftragt. Nur Dokumentation und arithmetische Prüfung, keine Laufzeittests oder Charakter-/Generatoränderungen.

Neuester Stand mit Vorrang: Nutzer bestätigt CK-Nahkämpfer-Zielbereich 13–17 auf Stufe 0 und Stärke zwingend mit hoher Priorität, unabhängig vom vorigen Axtbeispiel. Konkrete Gewichtung auf Auftrag ausgearbeitet: Stärke 17, Athletik 17, Schnelligkeit 15, Konstitution 15, Mut 13. Profilentwurf in Eigenschaften-und-Attribute.md dokumentiert; höhere Volksminima erhalten, keine Prozentgewichte erfunden. Kosten vom Sockel Indianer 912 / Troll 540 SP (enthält dessen frühere 120 SP). Mit H/S16 rechnerischer Rest 1722/1869 vor weiteren Grundausgaben. Ziele gegen Volksobergrenzen und Kostentabelle geprüft. Alte Kampfwerte unten gehören zum früheren 9er-Vergleich, nicht zum neuen Zielprofil. Nächster Vorschlag: Axtkampfwerte einschließlich PP und Schaden mit Zielprofil neu rechnen, danach Vitalität/Glück; noch nicht ausgeführt. Keine Laufzeit-/Charakteränderung, kein Commit/Push.

Aktueller Schritt mit Vorrang: Nutzer setzt CK-relevante Eigenschaften auf mindestens 9. Hier Athletik/Schnelligkeit/Mut sowie Konstitution; Stärke als Waffen-/Schadenswert ebenfalls bereits über 9. Attribute Vitalität/Glück erhalten kein 9er-Minimum. Indianer kein Zukauf; Troll SCH 5 auf 9 für 120 SP. Hiebwaffen/Äxte weiterhin 16/16. Jetzt nAT/nPA vor PP 9/8 bzw. 10/8; beide erreichen 15/15 regelkonform. Indianer gAT/gPA 2/2, mAT/mPA 22/21 (Rest 3, Näherung g:m=2:1); Troll 3/2 und 22/21 (Rest 4, exakt 3:1). Je 16 PP verbraucht, AT/PA-Ausgaben 8/8. Vorherige Troll-Blockade gelöst. Schaden 9,5/14,5 unverändert. SP-Reste nach Sockel/Ausbildung/CK-Minimum 2634/2289, Differenz 345; weitere Grundausgaben fehlen. Vollständiger aktueller Vergleich oben in Nahkampfvergleich-Indianer-Troll.md. Nächster Vorschlag: Vitalität und geringer Glück mit Kostenvarianten ergänzen, noch keine Ziele/Käufe beschlossen. Nur Dokumentation; Sockel/Kostentabelle und Rechnungen geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere Zwischenwerte im übernommenen Stand sind durch diese Angaben ersetzt.

Ergebnis: [Nahkampfvergleich Indianer / Troll](Nahkampfvergleich-Indianer-Troll.md) als Planungsrechnung angelegt. Beide Hiebwaffen 12 / Äxte 12 für je 480 SP; beide Axt aus Eisen, Gesellenarbeit, Von der Stange, Standardschaft für je 97 D. Rest nach Volkssockel und diesen Käufen 2794 / 2569 SP, noch vor weiteren Grundausgaben. Keine Charakterdateien oder Generatorlogik geändert. Kosten und Katalogwerte abgeglichen; keine Laufzeittests, kein Commit/Push.

### Neue Entscheidungen mit Vorrang vor dem übernommenen Fachstand

SSK gehört in Rahmen/Hintergrund. Ausstattung an Profession binden und ihre SP-Voraussetzungen einschließlich Rüstungsmanöver erfassen. Berufliche Basis ca. 3–5 % der gesamten SP als diskutierter Ansatz; Abgrenzung zu WHK mindestens 5 % / Attributen mindestens 3 % noch offen. Anschließend gemeinsames Restbudget mit Reglern für FK/NK/Spruchmagie/KI/PSI und bessere Berufsfähigkeiten, Summe 100 %. Jeder Zweig finanziert passende Eigenschaften, Attribute und Voraussetzungen mit. Magiegrundwerte vor Repertoire. Klassen als zu prüfende Presets.

Unbewaffnet = Kreis × 3 ist ausdrücklich verworfen. Alle entsprechenden Aussagen im unten übernommenen Stand und älteren Fachunterlagen sind überholt, keine neue Pflicht beschlossen. Frühere Grafikgruppierung durch SSK-/Professionsentscheidung ebenfalls überholt. Fachunterlagen noch nicht umfassend umgestellt; vor Implementierung abgleichen.

Nahkampfvergleich: gewichtete Eigenschaftsbestandteile von AW/AT/PA, zusätzlich Konstitution und Vitalität, geringer Glück. Hiebwaffen und Äxte immer gleich hoch, aktuell beide 12. Indianer Stärke 10 erfüllt die Zweihandanforderung der Axt, Troll Stärke 19 auch einhändig. Griffart jetzt für beide zweihändig bestätigt. nAT/nPA vor Poolverteilung Indianer 8/7, Troll 9/5; je 12 unvergebene PP. Schaden W20−1 / W20+4, Durchschnitt vor Rüstung 9,5 / 14,5. WK zweihändig je 9. Berechnung gegen Waffenpool-, Schadens- und Griffdarstellung geprüft; keine zusätzlichen SP-Ausgaben. Vollständige Rechnung im Vergleichsdokument. Nächster Vorschlag: 12 PP nach identischer Priorität verteilen; noch nicht beauftragt.

### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 038 · GELÖST — RM20/19 samt Talenten übernommen, RBE0

Neuester Abschluss mit Vorrang: Nutzer bestätigt RM20 beim Indianer/RM19 beim Troll und Talentstufen1+2. Jetzt als Käufe in Vergleichsplanung übernommen: Mehrkosten72/63 SP, Gesamtausgaben6250/6094, Rest150/306 SP. Je16 TaP ausgegeben,4 frei, Maximum20 durch vollständige Kette freigeschaltet. RH30 ergibt bei beiden RBE0/KBE0. AW bei SF0 jetzt defensiv13/offensiv9/g2/m22; Axtproben15/15,5/4,22/22, Schaden13,5/14,5 bleiben. RM12 als Berufsmindestziel enthalten; darüberliegende Käufe sind zusätzlicher Null-RBE-Ausbildungswunsch. GF/SF gesamt40/39 Punkte. Vitalität4/Glück3, Hintergrund und Ausrüstung unverändert. Vergleichsdokument oben aktualisiert, Budgets/Maximum/Kette/RBE nachgerechnet; keine Charakter-/Generatoränderung oder Laufzeittests. Frühere Aussagen RM12/20 freie TaP/Rest222/369 und noch nicht gekaufte RBE0-Variante unten ersetzt. Nächster Vorschlag: SF Ausweichen6 für54 SP → defensiv15/offensiv11, Rest96/252; noch nicht gekauft. Konkrete SSK und Versorgung/Last/Beschaffung weiterhin offen.

Aktueller Abschluss mit Vorrang: Nutzer senkt Vitalität auf4, Glück3 bleibt. Attributkosten740, Ersparnis160 SP je NPC, Rest222/369 SP, Gesamtausgaben6178/6031. Keine Vitalitätsfreischaltung nötig. Ausdauer68/77, Gesundheit13/14, LE12/23/18 bzw.13/26/20, Trefferschwelle9. AW aktuell mit RM12/KBE2 und AW-SF0 bei beiden defensiv11/offensiv7/g2/m22; bei RBE0 hypothetisch13/9/2/22. Talentkette RM1+2 kostet2+14=16 von20 TaP, erlaubt Maximum20. RM20/19 kostet zusätzlich72/63 SP, Rest dann150/306; nur Variante, nicht gekauft. RM24 benötigt32 TaP und passt nicht auf Stufe0. Frühere Vitalität5/Freischaltungsblockade unten überholt. Details und AW-Steigerungsvarianten oben im Vergleich/Eigenschaften dokumentiert. Nächster Vorschlag: RM-Talente1+2 und RM20/19 für RBE0 wählen, danach AW prüfen; aktuell RM12 und20 freie TaP erhalten. Nur Dokumentation und Formel-/Kettenprüfung, kein vollständiger Charaktertest oder Generatoränderung.

Neueste Prüfung: Keine Käufe geändert. +6 RM auf18 ergibt RBE1/3 bzw.0,1, jeweils1 KBE; +12 auf24 ergibt0. Minimalziele Indianer20/Troll19, Mehrkosten72/63 SP, hypothetischer Rest−10/146. Über RM12 Talentfreischaltung erforderlich (+8 für Ziele19/20, +12 für24), TaP/Ketten ungeprüft. Neu erkannt: Attributmaximum auf Kreis0 regulär4 laut fertigkeitenGrenzen.ts; gewünschte Vitalität5 benötigt ebenfalls Freischaltung. Früherer Kostenvergleich ist kein Legalitätsnachweis; Vitalität nicht eigenmächtig geändert. Details oben im Nahkampfvergleich. Nächster Vorschlag: beide Freischaltungen/TaP prüfen, anschließend10 fehlende Indianer-SP klären. Aktuelle tatsächlich geplante RM12 und Rest62/209 bleiben bestehen. Nur Dokumentation/Rechnung.

Aktueller Abschluss mit Vorrang: Beide Städter, Terrain Stadt, soziale Lage Einfach, Aussehen/Schlaf Normal als konkrete Vergleichsauswahl. Vollständige Beiträge/Referenzen/Zusammenführung oben im Nahkampfvergleich dokumentiert. Hintergrund-GF12 Punkte=108 SP neu, GF/SF insgesamt32 Punkte=288 SP inklusive RM12. WHK-Hintergrund erst addieren und dann per Maximum mit bestehenden Ausbildungszielen zusammenführen; zusätzliche Käufe Kaufmann2 (11), Krämer2 (5), Gemeinvolk3 (6), Stadt4 (7), insgesamt29 SP neu, WHK insgesamt352. Wald8 aus Ausbildung bleibt erhalten. Pflichtmerkmale0 SP. Netto137 SP je NPC; Gesamtausgaben6338/6191, Rest62/209 SP. Ausrüstung/PP/Attribute/CK-Ziele unverändert; Rüstung2 KBE. Konkrete SSK-Identitäten und Versorgung/Last/Beschaffbarkeit weiterhin offen; keine vollständigen NPCs behauptet. Pools/Kosten/Minima und Gesamtsummen geprüft, nur Dokumentation, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere offene Hintergrundauswahl und Rest199/346 unten ersetzt. Nächster Vorschlag: Pflichtvoraussetzungen und Einsatzfähigkeit gezielt prüfen, beginnend mit konkreter SSK-Zuordnung und Ausweichen/Belastung; Rest bis dahin erhalten. Noch kein Auftrag für weitere Käufe.

Neueste Nutzerentscheidung mit Vorrang: Berufs-/Ausrüstungspaket Wache enthält Rüstungsmanöver mindestens12; ersetzt dort bisherige reine Bedarfsbelegung2/1. Keine globale Vorgabe12 für andere Berufe. Mindestziele per Maximum und vorhandene Käufe einmal anrechnen. Je108 SP, zusätzlich90/99 gegenüber vorherigem Vergleich. Rest Indianer199/Troll346 SP. Bei RH30 RBE1,3333/1,1, beide2 KBE. Berufsbasis inklusive RM316 SP=4,9375 %, GF/SF gesamt20 Punkte. WHK323 und SSK120 unverändert. Ausrüstung, CK-Ziele, H/S16, Vit5/Glück3, PP-Verteilung unverändert. Vergleich, GF/SF- und Rüstungsfachdokument oben ergänzt; Kosten/Maximum/RBE geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere RM2/1,3KBE,Rest289/445-Angaben unten ersetzt. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und Pflichtmerkmale bestimmen, Beiträge zusammenführen, Rest prüfen. Noch nicht beauftragt.

Aktueller Abschluss mit Vorrang: gemeinsame Wache als Vergleichsannahme gewählt, WHK-Güte Meister, protokollierender Dienst. SSK120 SP (Sprache3/Kultur3/Schrift2, konkrete Identität offen), Berufsbasis208 SP=3,25 % (WHK136 + GF/SF72). Bestehendes breites Wache-WHK-Beispiel auf323 SP finanziert, Mehrkosten187, inklusive ausdrücklich als Entwurf gekennzeichneter Führung8. Zeughausrüstung von der Stange kostet1561 D bei RH30; RM2/1 für18/9 SP ergeben RBE3/2,9333 und jeweils3 KBE. Kleidung/Arbeitsmittel92,137 D, mit Axt97 D Gesamtausstattung1750,137 D innerhalb5000 D, ausgewählter Umfang ohne vollständige Versorgung/Lastprüfung. Rest jetzt289/445 SP. Endwerte/Artikel/Annahmen und offene Auswahlen oben im Nahkampfvergleich vollständig dokumentiert. Aussehen/Schlaf und Lebenswelt/Terrain/Soziallage sowie konkrete SSK bleiben offen; keine fertigen NPCs behauptet. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und neutrale Pflichtmerkmale wählen, Beiträge zusammenführen, Rest neu rechnen; noch nicht ausgeführt. Nur Dokumentation und Kosten-/Rüstungsprüfung, keine Laufzeit-/Charakteränderung oder Tests. Frühere Budgetreste und Aussagen zu noch nicht bezahlter beruflicher Basis unten sind ersetzt.

Neuester Abschluss mit Vorrang: Nutzer bestätigt Vitalität 5 und Glück 3 für beide Nahkämpfer. Je 600+300=900 SP ab 0, Attributminimum damit erfüllt ohne Zusatzabzug. Rest jetzt Indianer 822/Troll 969 SP vor SSK/Hintergrund/beruflicher Basis und weiteren Grundausgaben. Ausdauer 71/80, Gesundheit 14/15, LE Kopf/Brust/Unterleib 13/24/18 bzw. 14/26/20, Trefferschwelle beide 10. Axtproben n15/15 g5/4 m22/22 und Durchschnittsschaden 13,5/14,5 unverändert. Ausgearbeitet in Nahkampfvergleich und Eigenschaften-und-Attribute; Formeln arithmetisch geprüft, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere Restwerte und offene Attributziele unten sind ersetzt. Nächster Vorschlag: SSK und konkrete berufliche Basis einschließlich Ausstattung/Rüstungsmanöver bepreisen; Beruf und Hintergrund noch zu wählen. Keine weiteren Ausgaben beauftragt.

Abschluss dieses Schritts mit Vorrang: CK-Zielprofil jetzt in Axtvergleich übernommen. Indianer STÄ/ATH/SCH/KON/MUT 17/17/15/15/13, Troll 19/17/15/19/13. Beide H/S16, gleiche Eisenäxte zweihändig. nAT/nPA vor PP 12/11; je 3/4 PP für Ziel 15/15, Rest 9 als 7 gute / 2 meisterliche (Ganzzahlnäherung 3:1). PP gAT/gPA/mAT/mPA 4/3/1/1. Endwerte 15/15, 5/4, 22/22; 0 PP frei, AT/PA-Investition 8/8, Grenzen eingehalten. Schaden W20+3 / W20+4, Durchschnitt 13,5/14,5. Rest-SP 1722/1869 vor weiteren Grundausgaben unverändert. Aktuelle Rechnung oben im Nahkampfvergleich dokumentiert; frühere Zahlen unten sind Zwischenstände. Nächster Vorschlag: Vitalität und geringer Glück mit Zielwerten/Kosten ergänzen, noch nicht beauftragt. Nur Dokumentation und arithmetische Prüfung, keine Laufzeittests oder Charakter-/Generatoränderungen.

Neuester Stand mit Vorrang: Nutzer bestätigt CK-Nahkämpfer-Zielbereich 13–17 auf Stufe 0 und Stärke zwingend mit hoher Priorität, unabhängig vom vorigen Axtbeispiel. Konkrete Gewichtung auf Auftrag ausgearbeitet: Stärke 17, Athletik 17, Schnelligkeit 15, Konstitution 15, Mut 13. Profilentwurf in Eigenschaften-und-Attribute.md dokumentiert; höhere Volksminima erhalten, keine Prozentgewichte erfunden. Kosten vom Sockel Indianer 912 / Troll 540 SP (enthält dessen frühere 120 SP). Mit H/S16 rechnerischer Rest 1722/1869 vor weiteren Grundausgaben. Ziele gegen Volksobergrenzen und Kostentabelle geprüft. Alte Kampfwerte unten gehören zum früheren 9er-Vergleich, nicht zum neuen Zielprofil. Nächster Vorschlag: Axtkampfwerte einschließlich PP und Schaden mit Zielprofil neu rechnen, danach Vitalität/Glück; noch nicht ausgeführt. Keine Laufzeit-/Charakteränderung, kein Commit/Push.

Aktueller Schritt mit Vorrang: Nutzer setzt CK-relevante Eigenschaften auf mindestens 9. Hier Athletik/Schnelligkeit/Mut sowie Konstitution; Stärke als Waffen-/Schadenswert ebenfalls bereits über 9. Attribute Vitalität/Glück erhalten kein 9er-Minimum. Indianer kein Zukauf; Troll SCH 5 auf 9 für 120 SP. Hiebwaffen/Äxte weiterhin 16/16. Jetzt nAT/nPA vor PP 9/8 bzw. 10/8; beide erreichen 15/15 regelkonform. Indianer gAT/gPA 2/2, mAT/mPA 22/21 (Rest 3, Näherung g:m=2:1); Troll 3/2 und 22/21 (Rest 4, exakt 3:1). Je 16 PP verbraucht, AT/PA-Ausgaben 8/8. Vorherige Troll-Blockade gelöst. Schaden 9,5/14,5 unverändert. SP-Reste nach Sockel/Ausbildung/CK-Minimum 2634/2289, Differenz 345; weitere Grundausgaben fehlen. Vollständiger aktueller Vergleich oben in Nahkampfvergleich-Indianer-Troll.md. Nächster Vorschlag: Vitalität und geringer Glück mit Kostenvarianten ergänzen, noch keine Ziele/Käufe beschlossen. Nur Dokumentation; Sockel/Kostentabelle und Rechnungen geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere Zwischenwerte im übernommenen Stand sind durch diese Angaben ersetzt.

Ergebnis: [Nahkampfvergleich Indianer / Troll](Nahkampfvergleich-Indianer-Troll.md) als Planungsrechnung angelegt. Beide Hiebwaffen 12 / Äxte 12 für je 480 SP; beide Axt aus Eisen, Gesellenarbeit, Von der Stange, Standardschaft für je 97 D. Rest nach Volkssockel und diesen Käufen 2794 / 2569 SP, noch vor weiteren Grundausgaben. Keine Charakterdateien oder Generatorlogik geändert. Kosten und Katalogwerte abgeglichen; keine Laufzeittests, kein Commit/Push.

### Neue Entscheidungen mit Vorrang vor dem übernommenen Fachstand

SSK gehört in Rahmen/Hintergrund. Ausstattung an Profession binden und ihre SP-Voraussetzungen einschließlich Rüstungsmanöver erfassen. Berufliche Basis ca. 3–5 % der gesamten SP als diskutierter Ansatz; Abgrenzung zu WHK mindestens 5 % / Attributen mindestens 3 % noch offen. Anschließend gemeinsames Restbudget mit Reglern für FK/NK/Spruchmagie/KI/PSI und bessere Berufsfähigkeiten, Summe 100 %. Jeder Zweig finanziert passende Eigenschaften, Attribute und Voraussetzungen mit. Magiegrundwerte vor Repertoire. Klassen als zu prüfende Presets.

Unbewaffnet = Kreis × 3 ist ausdrücklich verworfen. Alle entsprechenden Aussagen im unten übernommenen Stand und älteren Fachunterlagen sind überholt, keine neue Pflicht beschlossen. Frühere Grafikgruppierung durch SSK-/Professionsentscheidung ebenfalls überholt. Fachunterlagen noch nicht umfassend umgestellt; vor Implementierung abgleichen.

Nahkampfvergleich: gewichtete Eigenschaftsbestandteile von AW/AT/PA, zusätzlich Konstitution und Vitalität, geringer Glück. Hiebwaffen und Äxte immer gleich hoch, aktuell beide 12. Indianer Stärke 10 erfüllt die Zweihandanforderung der Axt, Troll Stärke 19 auch einhändig. Griffart jetzt für beide zweihändig bestätigt. nAT/nPA vor Poolverteilung Indianer 8/7, Troll 9/5; je 12 unvergebene PP. Schaden W20−1 / W20+4, Durchschnitt vor Rüstung 9,5 / 14,5. WK zweihändig je 9. Berechnung gegen Waffenpool-, Schadens- und Griffdarstellung geprüft; keine zusätzlichen SP-Ausgaben. Vollständige Rechnung im Vergleichsdokument. Nächster Vorschlag: 12 PP nach identischer Priorität verteilen; noch nicht beauftragt.

### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 037 · GELÖST — Vitalität4, AW und RM-Talentkette geprüft

Aktueller Abschluss mit Vorrang: Nutzer senkt Vitalität auf4, Glück3 bleibt. Attributkosten740, Ersparnis160 SP je NPC, Rest222/369 SP, Gesamtausgaben6178/6031. Keine Vitalitätsfreischaltung nötig. Ausdauer68/77, Gesundheit13/14, LE12/23/18 bzw.13/26/20, Trefferschwelle9. AW aktuell mit RM12/KBE2 und AW-SF0 bei beiden defensiv11/offensiv7/g2/m22; bei RBE0 hypothetisch13/9/2/22. Talentkette RM1+2 kostet2+14=16 von20 TaP, erlaubt Maximum20. RM20/19 kostet zusätzlich72/63 SP, Rest dann150/306; nur Variante, nicht gekauft. RM24 benötigt32 TaP und passt nicht auf Stufe0. Frühere Vitalität5/Freischaltungsblockade unten überholt. Details und AW-Steigerungsvarianten oben im Vergleich/Eigenschaften dokumentiert. Nächster Vorschlag: RM-Talente1+2 und RM20/19 für RBE0 wählen, danach AW prüfen; aktuell RM12 und20 freie TaP erhalten. Nur Dokumentation und Formel-/Kettenprüfung, kein vollständiger Charaktertest oder Generatoränderung.

Neueste Prüfung: Keine Käufe geändert. +6 RM auf18 ergibt RBE1/3 bzw.0,1, jeweils1 KBE; +12 auf24 ergibt0. Minimalziele Indianer20/Troll19, Mehrkosten72/63 SP, hypothetischer Rest−10/146. Über RM12 Talentfreischaltung erforderlich (+8 für Ziele19/20, +12 für24), TaP/Ketten ungeprüft. Neu erkannt: Attributmaximum auf Kreis0 regulär4 laut fertigkeitenGrenzen.ts; gewünschte Vitalität5 benötigt ebenfalls Freischaltung. Früherer Kostenvergleich ist kein Legalitätsnachweis; Vitalität nicht eigenmächtig geändert. Details oben im Nahkampfvergleich. Nächster Vorschlag: beide Freischaltungen/TaP prüfen, anschließend10 fehlende Indianer-SP klären. Aktuelle tatsächlich geplante RM12 und Rest62/209 bleiben bestehen. Nur Dokumentation/Rechnung.

Aktueller Abschluss mit Vorrang: Beide Städter, Terrain Stadt, soziale Lage Einfach, Aussehen/Schlaf Normal als konkrete Vergleichsauswahl. Vollständige Beiträge/Referenzen/Zusammenführung oben im Nahkampfvergleich dokumentiert. Hintergrund-GF12 Punkte=108 SP neu, GF/SF insgesamt32 Punkte=288 SP inklusive RM12. WHK-Hintergrund erst addieren und dann per Maximum mit bestehenden Ausbildungszielen zusammenführen; zusätzliche Käufe Kaufmann2 (11), Krämer2 (5), Gemeinvolk3 (6), Stadt4 (7), insgesamt29 SP neu, WHK insgesamt352. Wald8 aus Ausbildung bleibt erhalten. Pflichtmerkmale0 SP. Netto137 SP je NPC; Gesamtausgaben6338/6191, Rest62/209 SP. Ausrüstung/PP/Attribute/CK-Ziele unverändert; Rüstung2 KBE. Konkrete SSK-Identitäten und Versorgung/Last/Beschaffbarkeit weiterhin offen; keine vollständigen NPCs behauptet. Pools/Kosten/Minima und Gesamtsummen geprüft, nur Dokumentation, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere offene Hintergrundauswahl und Rest199/346 unten ersetzt. Nächster Vorschlag: Pflichtvoraussetzungen und Einsatzfähigkeit gezielt prüfen, beginnend mit konkreter SSK-Zuordnung und Ausweichen/Belastung; Rest bis dahin erhalten. Noch kein Auftrag für weitere Käufe.

Neueste Nutzerentscheidung mit Vorrang: Berufs-/Ausrüstungspaket Wache enthält Rüstungsmanöver mindestens12; ersetzt dort bisherige reine Bedarfsbelegung2/1. Keine globale Vorgabe12 für andere Berufe. Mindestziele per Maximum und vorhandene Käufe einmal anrechnen. Je108 SP, zusätzlich90/99 gegenüber vorherigem Vergleich. Rest Indianer199/Troll346 SP. Bei RH30 RBE1,3333/1,1, beide2 KBE. Berufsbasis inklusive RM316 SP=4,9375 %, GF/SF gesamt20 Punkte. WHK323 und SSK120 unverändert. Ausrüstung, CK-Ziele, H/S16, Vit5/Glück3, PP-Verteilung unverändert. Vergleich, GF/SF- und Rüstungsfachdokument oben ergänzt; Kosten/Maximum/RBE geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere RM2/1,3KBE,Rest289/445-Angaben unten ersetzt. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und Pflichtmerkmale bestimmen, Beiträge zusammenführen, Rest prüfen. Noch nicht beauftragt.

Aktueller Abschluss mit Vorrang: gemeinsame Wache als Vergleichsannahme gewählt, WHK-Güte Meister, protokollierender Dienst. SSK120 SP (Sprache3/Kultur3/Schrift2, konkrete Identität offen), Berufsbasis208 SP=3,25 % (WHK136 + GF/SF72). Bestehendes breites Wache-WHK-Beispiel auf323 SP finanziert, Mehrkosten187, inklusive ausdrücklich als Entwurf gekennzeichneter Führung8. Zeughausrüstung von der Stange kostet1561 D bei RH30; RM2/1 für18/9 SP ergeben RBE3/2,9333 und jeweils3 KBE. Kleidung/Arbeitsmittel92,137 D, mit Axt97 D Gesamtausstattung1750,137 D innerhalb5000 D, ausgewählter Umfang ohne vollständige Versorgung/Lastprüfung. Rest jetzt289/445 SP. Endwerte/Artikel/Annahmen und offene Auswahlen oben im Nahkampfvergleich vollständig dokumentiert. Aussehen/Schlaf und Lebenswelt/Terrain/Soziallage sowie konkrete SSK bleiben offen; keine fertigen NPCs behauptet. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und neutrale Pflichtmerkmale wählen, Beiträge zusammenführen, Rest neu rechnen; noch nicht ausgeführt. Nur Dokumentation und Kosten-/Rüstungsprüfung, keine Laufzeit-/Charakteränderung oder Tests. Frühere Budgetreste und Aussagen zu noch nicht bezahlter beruflicher Basis unten sind ersetzt.

Neuester Abschluss mit Vorrang: Nutzer bestätigt Vitalität 5 und Glück 3 für beide Nahkämpfer. Je 600+300=900 SP ab 0, Attributminimum damit erfüllt ohne Zusatzabzug. Rest jetzt Indianer 822/Troll 969 SP vor SSK/Hintergrund/beruflicher Basis und weiteren Grundausgaben. Ausdauer 71/80, Gesundheit 14/15, LE Kopf/Brust/Unterleib 13/24/18 bzw. 14/26/20, Trefferschwelle beide 10. Axtproben n15/15 g5/4 m22/22 und Durchschnittsschaden 13,5/14,5 unverändert. Ausgearbeitet in Nahkampfvergleich und Eigenschaften-und-Attribute; Formeln arithmetisch geprüft, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere Restwerte und offene Attributziele unten sind ersetzt. Nächster Vorschlag: SSK und konkrete berufliche Basis einschließlich Ausstattung/Rüstungsmanöver bepreisen; Beruf und Hintergrund noch zu wählen. Keine weiteren Ausgaben beauftragt.

Abschluss dieses Schritts mit Vorrang: CK-Zielprofil jetzt in Axtvergleich übernommen. Indianer STÄ/ATH/SCH/KON/MUT 17/17/15/15/13, Troll 19/17/15/19/13. Beide H/S16, gleiche Eisenäxte zweihändig. nAT/nPA vor PP 12/11; je 3/4 PP für Ziel 15/15, Rest 9 als 7 gute / 2 meisterliche (Ganzzahlnäherung 3:1). PP gAT/gPA/mAT/mPA 4/3/1/1. Endwerte 15/15, 5/4, 22/22; 0 PP frei, AT/PA-Investition 8/8, Grenzen eingehalten. Schaden W20+3 / W20+4, Durchschnitt 13,5/14,5. Rest-SP 1722/1869 vor weiteren Grundausgaben unverändert. Aktuelle Rechnung oben im Nahkampfvergleich dokumentiert; frühere Zahlen unten sind Zwischenstände. Nächster Vorschlag: Vitalität und geringer Glück mit Zielwerten/Kosten ergänzen, noch nicht beauftragt. Nur Dokumentation und arithmetische Prüfung, keine Laufzeittests oder Charakter-/Generatoränderungen.

Neuester Stand mit Vorrang: Nutzer bestätigt CK-Nahkämpfer-Zielbereich 13–17 auf Stufe 0 und Stärke zwingend mit hoher Priorität, unabhängig vom vorigen Axtbeispiel. Konkrete Gewichtung auf Auftrag ausgearbeitet: Stärke 17, Athletik 17, Schnelligkeit 15, Konstitution 15, Mut 13. Profilentwurf in Eigenschaften-und-Attribute.md dokumentiert; höhere Volksminima erhalten, keine Prozentgewichte erfunden. Kosten vom Sockel Indianer 912 / Troll 540 SP (enthält dessen frühere 120 SP). Mit H/S16 rechnerischer Rest 1722/1869 vor weiteren Grundausgaben. Ziele gegen Volksobergrenzen und Kostentabelle geprüft. Alte Kampfwerte unten gehören zum früheren 9er-Vergleich, nicht zum neuen Zielprofil. Nächster Vorschlag: Axtkampfwerte einschließlich PP und Schaden mit Zielprofil neu rechnen, danach Vitalität/Glück; noch nicht ausgeführt. Keine Laufzeit-/Charakteränderung, kein Commit/Push.

Aktueller Schritt mit Vorrang: Nutzer setzt CK-relevante Eigenschaften auf mindestens 9. Hier Athletik/Schnelligkeit/Mut sowie Konstitution; Stärke als Waffen-/Schadenswert ebenfalls bereits über 9. Attribute Vitalität/Glück erhalten kein 9er-Minimum. Indianer kein Zukauf; Troll SCH 5 auf 9 für 120 SP. Hiebwaffen/Äxte weiterhin 16/16. Jetzt nAT/nPA vor PP 9/8 bzw. 10/8; beide erreichen 15/15 regelkonform. Indianer gAT/gPA 2/2, mAT/mPA 22/21 (Rest 3, Näherung g:m=2:1); Troll 3/2 und 22/21 (Rest 4, exakt 3:1). Je 16 PP verbraucht, AT/PA-Ausgaben 8/8. Vorherige Troll-Blockade gelöst. Schaden 9,5/14,5 unverändert. SP-Reste nach Sockel/Ausbildung/CK-Minimum 2634/2289, Differenz 345; weitere Grundausgaben fehlen. Vollständiger aktueller Vergleich oben in Nahkampfvergleich-Indianer-Troll.md. Nächster Vorschlag: Vitalität und geringer Glück mit Kostenvarianten ergänzen, noch keine Ziele/Käufe beschlossen. Nur Dokumentation; Sockel/Kostentabelle und Rechnungen geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere Zwischenwerte im übernommenen Stand sind durch diese Angaben ersetzt.

Ergebnis: [Nahkampfvergleich Indianer / Troll](Nahkampfvergleich-Indianer-Troll.md) als Planungsrechnung angelegt. Beide Hiebwaffen 12 / Äxte 12 für je 480 SP; beide Axt aus Eisen, Gesellenarbeit, Von der Stange, Standardschaft für je 97 D. Rest nach Volkssockel und diesen Käufen 2794 / 2569 SP, noch vor weiteren Grundausgaben. Keine Charakterdateien oder Generatorlogik geändert. Kosten und Katalogwerte abgeglichen; keine Laufzeittests, kein Commit/Push.

### Neue Entscheidungen mit Vorrang vor dem übernommenen Fachstand

SSK gehört in Rahmen/Hintergrund. Ausstattung an Profession binden und ihre SP-Voraussetzungen einschließlich Rüstungsmanöver erfassen. Berufliche Basis ca. 3–5 % der gesamten SP als diskutierter Ansatz; Abgrenzung zu WHK mindestens 5 % / Attributen mindestens 3 % noch offen. Anschließend gemeinsames Restbudget mit Reglern für FK/NK/Spruchmagie/KI/PSI und bessere Berufsfähigkeiten, Summe 100 %. Jeder Zweig finanziert passende Eigenschaften, Attribute und Voraussetzungen mit. Magiegrundwerte vor Repertoire. Klassen als zu prüfende Presets.

Unbewaffnet = Kreis × 3 ist ausdrücklich verworfen. Alle entsprechenden Aussagen im unten übernommenen Stand und älteren Fachunterlagen sind überholt, keine neue Pflicht beschlossen. Frühere Grafikgruppierung durch SSK-/Professionsentscheidung ebenfalls überholt. Fachunterlagen noch nicht umfassend umgestellt; vor Implementierung abgleichen.

Nahkampfvergleich: gewichtete Eigenschaftsbestandteile von AW/AT/PA, zusätzlich Konstitution und Vitalität, geringer Glück. Hiebwaffen und Äxte immer gleich hoch, aktuell beide 12. Indianer Stärke 10 erfüllt die Zweihandanforderung der Axt, Troll Stärke 19 auch einhändig. Griffart jetzt für beide zweihändig bestätigt. nAT/nPA vor Poolverteilung Indianer 8/7, Troll 9/5; je 12 unvergebene PP. Schaden W20−1 / W20+4, Durchschnitt vor Rüstung 9,5 / 14,5. WK zweihändig je 9. Berechnung gegen Waffenpool-, Schadens- und Griffdarstellung geprüft; keine zusätzlichen SP-Ausgaben. Vollständige Rechnung im Vergleichsdokument. Nächster Vorschlag: 12 PP nach identischer Priorität verteilen; noch nicht beauftragt.

### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 036 · GELÖST — RBE0 geprüft; Talentfreischaltungen offen

Neueste Prüfung: Keine Käufe geändert. +6 RM auf18 ergibt RBE1/3 bzw.0,1, jeweils1 KBE; +12 auf24 ergibt0. Minimalziele Indianer20/Troll19, Mehrkosten72/63 SP, hypothetischer Rest−10/146. Über RM12 Talentfreischaltung erforderlich (+8 für Ziele19/20, +12 für24), TaP/Ketten ungeprüft. Neu erkannt: Attributmaximum auf Kreis0 regulär4 laut fertigkeitenGrenzen.ts; gewünschte Vitalität5 benötigt ebenfalls Freischaltung. Früherer Kostenvergleich ist kein Legalitätsnachweis; Vitalität nicht eigenmächtig geändert. Details oben im Nahkampfvergleich. Nächster Vorschlag: beide Freischaltungen/TaP prüfen, anschließend10 fehlende Indianer-SP klären. Aktuelle tatsächlich geplante RM12 und Rest62/209 bleiben bestehen. Nur Dokumentation/Rechnung.

Aktueller Abschluss mit Vorrang: Beide Städter, Terrain Stadt, soziale Lage Einfach, Aussehen/Schlaf Normal als konkrete Vergleichsauswahl. Vollständige Beiträge/Referenzen/Zusammenführung oben im Nahkampfvergleich dokumentiert. Hintergrund-GF12 Punkte=108 SP neu, GF/SF insgesamt32 Punkte=288 SP inklusive RM12. WHK-Hintergrund erst addieren und dann per Maximum mit bestehenden Ausbildungszielen zusammenführen; zusätzliche Käufe Kaufmann2 (11), Krämer2 (5), Gemeinvolk3 (6), Stadt4 (7), insgesamt29 SP neu, WHK insgesamt352. Wald8 aus Ausbildung bleibt erhalten. Pflichtmerkmale0 SP. Netto137 SP je NPC; Gesamtausgaben6338/6191, Rest62/209 SP. Ausrüstung/PP/Attribute/CK-Ziele unverändert; Rüstung2 KBE. Konkrete SSK-Identitäten und Versorgung/Last/Beschaffbarkeit weiterhin offen; keine vollständigen NPCs behauptet. Pools/Kosten/Minima und Gesamtsummen geprüft, nur Dokumentation, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere offene Hintergrundauswahl und Rest199/346 unten ersetzt. Nächster Vorschlag: Pflichtvoraussetzungen und Einsatzfähigkeit gezielt prüfen, beginnend mit konkreter SSK-Zuordnung und Ausweichen/Belastung; Rest bis dahin erhalten. Noch kein Auftrag für weitere Käufe.

Neueste Nutzerentscheidung mit Vorrang: Berufs-/Ausrüstungspaket Wache enthält Rüstungsmanöver mindestens12; ersetzt dort bisherige reine Bedarfsbelegung2/1. Keine globale Vorgabe12 für andere Berufe. Mindestziele per Maximum und vorhandene Käufe einmal anrechnen. Je108 SP, zusätzlich90/99 gegenüber vorherigem Vergleich. Rest Indianer199/Troll346 SP. Bei RH30 RBE1,3333/1,1, beide2 KBE. Berufsbasis inklusive RM316 SP=4,9375 %, GF/SF gesamt20 Punkte. WHK323 und SSK120 unverändert. Ausrüstung, CK-Ziele, H/S16, Vit5/Glück3, PP-Verteilung unverändert. Vergleich, GF/SF- und Rüstungsfachdokument oben ergänzt; Kosten/Maximum/RBE geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere RM2/1,3KBE,Rest289/445-Angaben unten ersetzt. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und Pflichtmerkmale bestimmen, Beiträge zusammenführen, Rest prüfen. Noch nicht beauftragt.

Aktueller Abschluss mit Vorrang: gemeinsame Wache als Vergleichsannahme gewählt, WHK-Güte Meister, protokollierender Dienst. SSK120 SP (Sprache3/Kultur3/Schrift2, konkrete Identität offen), Berufsbasis208 SP=3,25 % (WHK136 + GF/SF72). Bestehendes breites Wache-WHK-Beispiel auf323 SP finanziert, Mehrkosten187, inklusive ausdrücklich als Entwurf gekennzeichneter Führung8. Zeughausrüstung von der Stange kostet1561 D bei RH30; RM2/1 für18/9 SP ergeben RBE3/2,9333 und jeweils3 KBE. Kleidung/Arbeitsmittel92,137 D, mit Axt97 D Gesamtausstattung1750,137 D innerhalb5000 D, ausgewählter Umfang ohne vollständige Versorgung/Lastprüfung. Rest jetzt289/445 SP. Endwerte/Artikel/Annahmen und offene Auswahlen oben im Nahkampfvergleich vollständig dokumentiert. Aussehen/Schlaf und Lebenswelt/Terrain/Soziallage sowie konkrete SSK bleiben offen; keine fertigen NPCs behauptet. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und neutrale Pflichtmerkmale wählen, Beiträge zusammenführen, Rest neu rechnen; noch nicht ausgeführt. Nur Dokumentation und Kosten-/Rüstungsprüfung, keine Laufzeit-/Charakteränderung oder Tests. Frühere Budgetreste und Aussagen zu noch nicht bezahlter beruflicher Basis unten sind ersetzt.

Neuester Abschluss mit Vorrang: Nutzer bestätigt Vitalität 5 und Glück 3 für beide Nahkämpfer. Je 600+300=900 SP ab 0, Attributminimum damit erfüllt ohne Zusatzabzug. Rest jetzt Indianer 822/Troll 969 SP vor SSK/Hintergrund/beruflicher Basis und weiteren Grundausgaben. Ausdauer 71/80, Gesundheit 14/15, LE Kopf/Brust/Unterleib 13/24/18 bzw. 14/26/20, Trefferschwelle beide 10. Axtproben n15/15 g5/4 m22/22 und Durchschnittsschaden 13,5/14,5 unverändert. Ausgearbeitet in Nahkampfvergleich und Eigenschaften-und-Attribute; Formeln arithmetisch geprüft, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere Restwerte und offene Attributziele unten sind ersetzt. Nächster Vorschlag: SSK und konkrete berufliche Basis einschließlich Ausstattung/Rüstungsmanöver bepreisen; Beruf und Hintergrund noch zu wählen. Keine weiteren Ausgaben beauftragt.

Abschluss dieses Schritts mit Vorrang: CK-Zielprofil jetzt in Axtvergleich übernommen. Indianer STÄ/ATH/SCH/KON/MUT 17/17/15/15/13, Troll 19/17/15/19/13. Beide H/S16, gleiche Eisenäxte zweihändig. nAT/nPA vor PP 12/11; je 3/4 PP für Ziel 15/15, Rest 9 als 7 gute / 2 meisterliche (Ganzzahlnäherung 3:1). PP gAT/gPA/mAT/mPA 4/3/1/1. Endwerte 15/15, 5/4, 22/22; 0 PP frei, AT/PA-Investition 8/8, Grenzen eingehalten. Schaden W20+3 / W20+4, Durchschnitt 13,5/14,5. Rest-SP 1722/1869 vor weiteren Grundausgaben unverändert. Aktuelle Rechnung oben im Nahkampfvergleich dokumentiert; frühere Zahlen unten sind Zwischenstände. Nächster Vorschlag: Vitalität und geringer Glück mit Zielwerten/Kosten ergänzen, noch nicht beauftragt. Nur Dokumentation und arithmetische Prüfung, keine Laufzeittests oder Charakter-/Generatoränderungen.

Neuester Stand mit Vorrang: Nutzer bestätigt CK-Nahkämpfer-Zielbereich 13–17 auf Stufe 0 und Stärke zwingend mit hoher Priorität, unabhängig vom vorigen Axtbeispiel. Konkrete Gewichtung auf Auftrag ausgearbeitet: Stärke 17, Athletik 17, Schnelligkeit 15, Konstitution 15, Mut 13. Profilentwurf in Eigenschaften-und-Attribute.md dokumentiert; höhere Volksminima erhalten, keine Prozentgewichte erfunden. Kosten vom Sockel Indianer 912 / Troll 540 SP (enthält dessen frühere 120 SP). Mit H/S16 rechnerischer Rest 1722/1869 vor weiteren Grundausgaben. Ziele gegen Volksobergrenzen und Kostentabelle geprüft. Alte Kampfwerte unten gehören zum früheren 9er-Vergleich, nicht zum neuen Zielprofil. Nächster Vorschlag: Axtkampfwerte einschließlich PP und Schaden mit Zielprofil neu rechnen, danach Vitalität/Glück; noch nicht ausgeführt. Keine Laufzeit-/Charakteränderung, kein Commit/Push.

Aktueller Schritt mit Vorrang: Nutzer setzt CK-relevante Eigenschaften auf mindestens 9. Hier Athletik/Schnelligkeit/Mut sowie Konstitution; Stärke als Waffen-/Schadenswert ebenfalls bereits über 9. Attribute Vitalität/Glück erhalten kein 9er-Minimum. Indianer kein Zukauf; Troll SCH 5 auf 9 für 120 SP. Hiebwaffen/Äxte weiterhin 16/16. Jetzt nAT/nPA vor PP 9/8 bzw. 10/8; beide erreichen 15/15 regelkonform. Indianer gAT/gPA 2/2, mAT/mPA 22/21 (Rest 3, Näherung g:m=2:1); Troll 3/2 und 22/21 (Rest 4, exakt 3:1). Je 16 PP verbraucht, AT/PA-Ausgaben 8/8. Vorherige Troll-Blockade gelöst. Schaden 9,5/14,5 unverändert. SP-Reste nach Sockel/Ausbildung/CK-Minimum 2634/2289, Differenz 345; weitere Grundausgaben fehlen. Vollständiger aktueller Vergleich oben in Nahkampfvergleich-Indianer-Troll.md. Nächster Vorschlag: Vitalität und geringer Glück mit Kostenvarianten ergänzen, noch keine Ziele/Käufe beschlossen. Nur Dokumentation; Sockel/Kostentabelle und Rechnungen geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere Zwischenwerte im übernommenen Stand sind durch diese Angaben ersetzt.

Ergebnis: [Nahkampfvergleich Indianer / Troll](Nahkampfvergleich-Indianer-Troll.md) als Planungsrechnung angelegt. Beide Hiebwaffen 12 / Äxte 12 für je 480 SP; beide Axt aus Eisen, Gesellenarbeit, Von der Stange, Standardschaft für je 97 D. Rest nach Volkssockel und diesen Käufen 2794 / 2569 SP, noch vor weiteren Grundausgaben. Keine Charakterdateien oder Generatorlogik geändert. Kosten und Katalogwerte abgeglichen; keine Laufzeittests, kein Commit/Push.

### Neue Entscheidungen mit Vorrang vor dem übernommenen Fachstand

SSK gehört in Rahmen/Hintergrund. Ausstattung an Profession binden und ihre SP-Voraussetzungen einschließlich Rüstungsmanöver erfassen. Berufliche Basis ca. 3–5 % der gesamten SP als diskutierter Ansatz; Abgrenzung zu WHK mindestens 5 % / Attributen mindestens 3 % noch offen. Anschließend gemeinsames Restbudget mit Reglern für FK/NK/Spruchmagie/KI/PSI und bessere Berufsfähigkeiten, Summe 100 %. Jeder Zweig finanziert passende Eigenschaften, Attribute und Voraussetzungen mit. Magiegrundwerte vor Repertoire. Klassen als zu prüfende Presets.

Unbewaffnet = Kreis × 3 ist ausdrücklich verworfen. Alle entsprechenden Aussagen im unten übernommenen Stand und älteren Fachunterlagen sind überholt, keine neue Pflicht beschlossen. Frühere Grafikgruppierung durch SSK-/Professionsentscheidung ebenfalls überholt. Fachunterlagen noch nicht umfassend umgestellt; vor Implementierung abgleichen.

Nahkampfvergleich: gewichtete Eigenschaftsbestandteile von AW/AT/PA, zusätzlich Konstitution und Vitalität, geringer Glück. Hiebwaffen und Äxte immer gleich hoch, aktuell beide 12. Indianer Stärke 10 erfüllt die Zweihandanforderung der Axt, Troll Stärke 19 auch einhändig. Griffart jetzt für beide zweihändig bestätigt. nAT/nPA vor Poolverteilung Indianer 8/7, Troll 9/5; je 12 unvergebene PP. Schaden W20−1 / W20+4, Durchschnitt vor Rüstung 9,5 / 14,5. WK zweihändig je 9. Berechnung gegen Waffenpool-, Schadens- und Griffdarstellung geprüft; keine zusätzlichen SP-Ausgaben. Vollständige Rechnung im Vergleichsdokument. Nächster Vorschlag: 12 PP nach identischer Priorität verteilen; noch nicht beauftragt.

### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 035 · GELÖST — Gemeinsamer Hintergrund finanziert, Rest 62/209 SP

Aktueller Abschluss mit Vorrang: Beide Städter, Terrain Stadt, soziale Lage Einfach, Aussehen/Schlaf Normal als konkrete Vergleichsauswahl. Vollständige Beiträge/Referenzen/Zusammenführung oben im Nahkampfvergleich dokumentiert. Hintergrund-GF12 Punkte=108 SP neu, GF/SF insgesamt32 Punkte=288 SP inklusive RM12. WHK-Hintergrund erst addieren und dann per Maximum mit bestehenden Ausbildungszielen zusammenführen; zusätzliche Käufe Kaufmann2 (11), Krämer2 (5), Gemeinvolk3 (6), Stadt4 (7), insgesamt29 SP neu, WHK insgesamt352. Wald8 aus Ausbildung bleibt erhalten. Pflichtmerkmale0 SP. Netto137 SP je NPC; Gesamtausgaben6338/6191, Rest62/209 SP. Ausrüstung/PP/Attribute/CK-Ziele unverändert; Rüstung2 KBE. Konkrete SSK-Identitäten und Versorgung/Last/Beschaffbarkeit weiterhin offen; keine vollständigen NPCs behauptet. Pools/Kosten/Minima und Gesamtsummen geprüft, nur Dokumentation, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere offene Hintergrundauswahl und Rest199/346 unten ersetzt. Nächster Vorschlag: Pflichtvoraussetzungen und Einsatzfähigkeit gezielt prüfen, beginnend mit konkreter SSK-Zuordnung und Ausweichen/Belastung; Rest bis dahin erhalten. Noch kein Auftrag für weitere Käufe.

Neueste Nutzerentscheidung mit Vorrang: Berufs-/Ausrüstungspaket Wache enthält Rüstungsmanöver mindestens12; ersetzt dort bisherige reine Bedarfsbelegung2/1. Keine globale Vorgabe12 für andere Berufe. Mindestziele per Maximum und vorhandene Käufe einmal anrechnen. Je108 SP, zusätzlich90/99 gegenüber vorherigem Vergleich. Rest Indianer199/Troll346 SP. Bei RH30 RBE1,3333/1,1, beide2 KBE. Berufsbasis inklusive RM316 SP=4,9375 %, GF/SF gesamt20 Punkte. WHK323 und SSK120 unverändert. Ausrüstung, CK-Ziele, H/S16, Vit5/Glück3, PP-Verteilung unverändert. Vergleich, GF/SF- und Rüstungsfachdokument oben ergänzt; Kosten/Maximum/RBE geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere RM2/1,3KBE,Rest289/445-Angaben unten ersetzt. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und Pflichtmerkmale bestimmen, Beiträge zusammenführen, Rest prüfen. Noch nicht beauftragt.

Aktueller Abschluss mit Vorrang: gemeinsame Wache als Vergleichsannahme gewählt, WHK-Güte Meister, protokollierender Dienst. SSK120 SP (Sprache3/Kultur3/Schrift2, konkrete Identität offen), Berufsbasis208 SP=3,25 % (WHK136 + GF/SF72). Bestehendes breites Wache-WHK-Beispiel auf323 SP finanziert, Mehrkosten187, inklusive ausdrücklich als Entwurf gekennzeichneter Führung8. Zeughausrüstung von der Stange kostet1561 D bei RH30; RM2/1 für18/9 SP ergeben RBE3/2,9333 und jeweils3 KBE. Kleidung/Arbeitsmittel92,137 D, mit Axt97 D Gesamtausstattung1750,137 D innerhalb5000 D, ausgewählter Umfang ohne vollständige Versorgung/Lastprüfung. Rest jetzt289/445 SP. Endwerte/Artikel/Annahmen und offene Auswahlen oben im Nahkampfvergleich vollständig dokumentiert. Aussehen/Schlaf und Lebenswelt/Terrain/Soziallage sowie konkrete SSK bleiben offen; keine fertigen NPCs behauptet. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und neutrale Pflichtmerkmale wählen, Beiträge zusammenführen, Rest neu rechnen; noch nicht ausgeführt. Nur Dokumentation und Kosten-/Rüstungsprüfung, keine Laufzeit-/Charakteränderung oder Tests. Frühere Budgetreste und Aussagen zu noch nicht bezahlter beruflicher Basis unten sind ersetzt.

Neuester Abschluss mit Vorrang: Nutzer bestätigt Vitalität 5 und Glück 3 für beide Nahkämpfer. Je 600+300=900 SP ab 0, Attributminimum damit erfüllt ohne Zusatzabzug. Rest jetzt Indianer 822/Troll 969 SP vor SSK/Hintergrund/beruflicher Basis und weiteren Grundausgaben. Ausdauer 71/80, Gesundheit 14/15, LE Kopf/Brust/Unterleib 13/24/18 bzw. 14/26/20, Trefferschwelle beide 10. Axtproben n15/15 g5/4 m22/22 und Durchschnittsschaden 13,5/14,5 unverändert. Ausgearbeitet in Nahkampfvergleich und Eigenschaften-und-Attribute; Formeln arithmetisch geprüft, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere Restwerte und offene Attributziele unten sind ersetzt. Nächster Vorschlag: SSK und konkrete berufliche Basis einschließlich Ausstattung/Rüstungsmanöver bepreisen; Beruf und Hintergrund noch zu wählen. Keine weiteren Ausgaben beauftragt.

Abschluss dieses Schritts mit Vorrang: CK-Zielprofil jetzt in Axtvergleich übernommen. Indianer STÄ/ATH/SCH/KON/MUT 17/17/15/15/13, Troll 19/17/15/19/13. Beide H/S16, gleiche Eisenäxte zweihändig. nAT/nPA vor PP 12/11; je 3/4 PP für Ziel 15/15, Rest 9 als 7 gute / 2 meisterliche (Ganzzahlnäherung 3:1). PP gAT/gPA/mAT/mPA 4/3/1/1. Endwerte 15/15, 5/4, 22/22; 0 PP frei, AT/PA-Investition 8/8, Grenzen eingehalten. Schaden W20+3 / W20+4, Durchschnitt 13,5/14,5. Rest-SP 1722/1869 vor weiteren Grundausgaben unverändert. Aktuelle Rechnung oben im Nahkampfvergleich dokumentiert; frühere Zahlen unten sind Zwischenstände. Nächster Vorschlag: Vitalität und geringer Glück mit Zielwerten/Kosten ergänzen, noch nicht beauftragt. Nur Dokumentation und arithmetische Prüfung, keine Laufzeittests oder Charakter-/Generatoränderungen.

Neuester Stand mit Vorrang: Nutzer bestätigt CK-Nahkämpfer-Zielbereich 13–17 auf Stufe 0 und Stärke zwingend mit hoher Priorität, unabhängig vom vorigen Axtbeispiel. Konkrete Gewichtung auf Auftrag ausgearbeitet: Stärke 17, Athletik 17, Schnelligkeit 15, Konstitution 15, Mut 13. Profilentwurf in Eigenschaften-und-Attribute.md dokumentiert; höhere Volksminima erhalten, keine Prozentgewichte erfunden. Kosten vom Sockel Indianer 912 / Troll 540 SP (enthält dessen frühere 120 SP). Mit H/S16 rechnerischer Rest 1722/1869 vor weiteren Grundausgaben. Ziele gegen Volksobergrenzen und Kostentabelle geprüft. Alte Kampfwerte unten gehören zum früheren 9er-Vergleich, nicht zum neuen Zielprofil. Nächster Vorschlag: Axtkampfwerte einschließlich PP und Schaden mit Zielprofil neu rechnen, danach Vitalität/Glück; noch nicht ausgeführt. Keine Laufzeit-/Charakteränderung, kein Commit/Push.

Aktueller Schritt mit Vorrang: Nutzer setzt CK-relevante Eigenschaften auf mindestens 9. Hier Athletik/Schnelligkeit/Mut sowie Konstitution; Stärke als Waffen-/Schadenswert ebenfalls bereits über 9. Attribute Vitalität/Glück erhalten kein 9er-Minimum. Indianer kein Zukauf; Troll SCH 5 auf 9 für 120 SP. Hiebwaffen/Äxte weiterhin 16/16. Jetzt nAT/nPA vor PP 9/8 bzw. 10/8; beide erreichen 15/15 regelkonform. Indianer gAT/gPA 2/2, mAT/mPA 22/21 (Rest 3, Näherung g:m=2:1); Troll 3/2 und 22/21 (Rest 4, exakt 3:1). Je 16 PP verbraucht, AT/PA-Ausgaben 8/8. Vorherige Troll-Blockade gelöst. Schaden 9,5/14,5 unverändert. SP-Reste nach Sockel/Ausbildung/CK-Minimum 2634/2289, Differenz 345; weitere Grundausgaben fehlen. Vollständiger aktueller Vergleich oben in Nahkampfvergleich-Indianer-Troll.md. Nächster Vorschlag: Vitalität und geringer Glück mit Kostenvarianten ergänzen, noch keine Ziele/Käufe beschlossen. Nur Dokumentation; Sockel/Kostentabelle und Rechnungen geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere Zwischenwerte im übernommenen Stand sind durch diese Angaben ersetzt.

Ergebnis: [Nahkampfvergleich Indianer / Troll](Nahkampfvergleich-Indianer-Troll.md) als Planungsrechnung angelegt. Beide Hiebwaffen 12 / Äxte 12 für je 480 SP; beide Axt aus Eisen, Gesellenarbeit, Von der Stange, Standardschaft für je 97 D. Rest nach Volkssockel und diesen Käufen 2794 / 2569 SP, noch vor weiteren Grundausgaben. Keine Charakterdateien oder Generatorlogik geändert. Kosten und Katalogwerte abgeglichen; keine Laufzeittests, kein Commit/Push.

### Neue Entscheidungen mit Vorrang vor dem übernommenen Fachstand

SSK gehört in Rahmen/Hintergrund. Ausstattung an Profession binden und ihre SP-Voraussetzungen einschließlich Rüstungsmanöver erfassen. Berufliche Basis ca. 3–5 % der gesamten SP als diskutierter Ansatz; Abgrenzung zu WHK mindestens 5 % / Attributen mindestens 3 % noch offen. Anschließend gemeinsames Restbudget mit Reglern für FK/NK/Spruchmagie/KI/PSI und bessere Berufsfähigkeiten, Summe 100 %. Jeder Zweig finanziert passende Eigenschaften, Attribute und Voraussetzungen mit. Magiegrundwerte vor Repertoire. Klassen als zu prüfende Presets.

Unbewaffnet = Kreis × 3 ist ausdrücklich verworfen. Alle entsprechenden Aussagen im unten übernommenen Stand und älteren Fachunterlagen sind überholt, keine neue Pflicht beschlossen. Frühere Grafikgruppierung durch SSK-/Professionsentscheidung ebenfalls überholt. Fachunterlagen noch nicht umfassend umgestellt; vor Implementierung abgleichen.

Nahkampfvergleich: gewichtete Eigenschaftsbestandteile von AW/AT/PA, zusätzlich Konstitution und Vitalität, geringer Glück. Hiebwaffen und Äxte immer gleich hoch, aktuell beide 12. Indianer Stärke 10 erfüllt die Zweihandanforderung der Axt, Troll Stärke 19 auch einhändig. Griffart jetzt für beide zweihändig bestätigt. nAT/nPA vor Poolverteilung Indianer 8/7, Troll 9/5; je 12 unvergebene PP. Schaden W20−1 / W20+4, Durchschnitt vor Rüstung 9,5 / 14,5. WK zweihändig je 9. Berechnung gegen Waffenpool-, Schadens- und Griffdarstellung geprüft; keine zusätzlichen SP-Ausgaben. Vollständige Rechnung im Vergleichsdokument. Nächster Vorschlag: 12 PP nach identischer Priorität verteilen; noch nicht beauftragt.

### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 034 · GELÖST — Wachenpaket fest mit Rüstungsmanöver 12

Neueste Nutzerentscheidung mit Vorrang: Berufs-/Ausrüstungspaket Wache enthält Rüstungsmanöver mindestens12; ersetzt dort bisherige reine Bedarfsbelegung2/1. Keine globale Vorgabe12 für andere Berufe. Mindestziele per Maximum und vorhandene Käufe einmal anrechnen. Je108 SP, zusätzlich90/99 gegenüber vorherigem Vergleich. Rest Indianer199/Troll346 SP. Bei RH30 RBE1,3333/1,1, beide2 KBE. Berufsbasis inklusive RM316 SP=4,9375 %, GF/SF gesamt20 Punkte. WHK323 und SSK120 unverändert. Ausrüstung, CK-Ziele, H/S16, Vit5/Glück3, PP-Verteilung unverändert. Vergleich, GF/SF- und Rüstungsfachdokument oben ergänzt; Kosten/Maximum/RBE geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere RM2/1,3KBE,Rest289/445-Angaben unten ersetzt. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und Pflichtmerkmale bestimmen, Beiträge zusammenführen, Rest prüfen. Noch nicht beauftragt.

Aktueller Abschluss mit Vorrang: gemeinsame Wache als Vergleichsannahme gewählt, WHK-Güte Meister, protokollierender Dienst. SSK120 SP (Sprache3/Kultur3/Schrift2, konkrete Identität offen), Berufsbasis208 SP=3,25 % (WHK136 + GF/SF72). Bestehendes breites Wache-WHK-Beispiel auf323 SP finanziert, Mehrkosten187, inklusive ausdrücklich als Entwurf gekennzeichneter Führung8. Zeughausrüstung von der Stange kostet1561 D bei RH30; RM2/1 für18/9 SP ergeben RBE3/2,9333 und jeweils3 KBE. Kleidung/Arbeitsmittel92,137 D, mit Axt97 D Gesamtausstattung1750,137 D innerhalb5000 D, ausgewählter Umfang ohne vollständige Versorgung/Lastprüfung. Rest jetzt289/445 SP. Endwerte/Artikel/Annahmen und offene Auswahlen oben im Nahkampfvergleich vollständig dokumentiert. Aussehen/Schlaf und Lebenswelt/Terrain/Soziallage sowie konkrete SSK bleiben offen; keine fertigen NPCs behauptet. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und neutrale Pflichtmerkmale wählen, Beiträge zusammenführen, Rest neu rechnen; noch nicht ausgeführt. Nur Dokumentation und Kosten-/Rüstungsprüfung, keine Laufzeit-/Charakteränderung oder Tests. Frühere Budgetreste und Aussagen zu noch nicht bezahlter beruflicher Basis unten sind ersetzt.

Neuester Abschluss mit Vorrang: Nutzer bestätigt Vitalität 5 und Glück 3 für beide Nahkämpfer. Je 600+300=900 SP ab 0, Attributminimum damit erfüllt ohne Zusatzabzug. Rest jetzt Indianer 822/Troll 969 SP vor SSK/Hintergrund/beruflicher Basis und weiteren Grundausgaben. Ausdauer 71/80, Gesundheit 14/15, LE Kopf/Brust/Unterleib 13/24/18 bzw. 14/26/20, Trefferschwelle beide 10. Axtproben n15/15 g5/4 m22/22 und Durchschnittsschaden 13,5/14,5 unverändert. Ausgearbeitet in Nahkampfvergleich und Eigenschaften-und-Attribute; Formeln arithmetisch geprüft, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere Restwerte und offene Attributziele unten sind ersetzt. Nächster Vorschlag: SSK und konkrete berufliche Basis einschließlich Ausstattung/Rüstungsmanöver bepreisen; Beruf und Hintergrund noch zu wählen. Keine weiteren Ausgaben beauftragt.

Abschluss dieses Schritts mit Vorrang: CK-Zielprofil jetzt in Axtvergleich übernommen. Indianer STÄ/ATH/SCH/KON/MUT 17/17/15/15/13, Troll 19/17/15/19/13. Beide H/S16, gleiche Eisenäxte zweihändig. nAT/nPA vor PP 12/11; je 3/4 PP für Ziel 15/15, Rest 9 als 7 gute / 2 meisterliche (Ganzzahlnäherung 3:1). PP gAT/gPA/mAT/mPA 4/3/1/1. Endwerte 15/15, 5/4, 22/22; 0 PP frei, AT/PA-Investition 8/8, Grenzen eingehalten. Schaden W20+3 / W20+4, Durchschnitt 13,5/14,5. Rest-SP 1722/1869 vor weiteren Grundausgaben unverändert. Aktuelle Rechnung oben im Nahkampfvergleich dokumentiert; frühere Zahlen unten sind Zwischenstände. Nächster Vorschlag: Vitalität und geringer Glück mit Zielwerten/Kosten ergänzen, noch nicht beauftragt. Nur Dokumentation und arithmetische Prüfung, keine Laufzeittests oder Charakter-/Generatoränderungen.

Neuester Stand mit Vorrang: Nutzer bestätigt CK-Nahkämpfer-Zielbereich 13–17 auf Stufe 0 und Stärke zwingend mit hoher Priorität, unabhängig vom vorigen Axtbeispiel. Konkrete Gewichtung auf Auftrag ausgearbeitet: Stärke 17, Athletik 17, Schnelligkeit 15, Konstitution 15, Mut 13. Profilentwurf in Eigenschaften-und-Attribute.md dokumentiert; höhere Volksminima erhalten, keine Prozentgewichte erfunden. Kosten vom Sockel Indianer 912 / Troll 540 SP (enthält dessen frühere 120 SP). Mit H/S16 rechnerischer Rest 1722/1869 vor weiteren Grundausgaben. Ziele gegen Volksobergrenzen und Kostentabelle geprüft. Alte Kampfwerte unten gehören zum früheren 9er-Vergleich, nicht zum neuen Zielprofil. Nächster Vorschlag: Axtkampfwerte einschließlich PP und Schaden mit Zielprofil neu rechnen, danach Vitalität/Glück; noch nicht ausgeführt. Keine Laufzeit-/Charakteränderung, kein Commit/Push.

Aktueller Schritt mit Vorrang: Nutzer setzt CK-relevante Eigenschaften auf mindestens 9. Hier Athletik/Schnelligkeit/Mut sowie Konstitution; Stärke als Waffen-/Schadenswert ebenfalls bereits über 9. Attribute Vitalität/Glück erhalten kein 9er-Minimum. Indianer kein Zukauf; Troll SCH 5 auf 9 für 120 SP. Hiebwaffen/Äxte weiterhin 16/16. Jetzt nAT/nPA vor PP 9/8 bzw. 10/8; beide erreichen 15/15 regelkonform. Indianer gAT/gPA 2/2, mAT/mPA 22/21 (Rest 3, Näherung g:m=2:1); Troll 3/2 und 22/21 (Rest 4, exakt 3:1). Je 16 PP verbraucht, AT/PA-Ausgaben 8/8. Vorherige Troll-Blockade gelöst. Schaden 9,5/14,5 unverändert. SP-Reste nach Sockel/Ausbildung/CK-Minimum 2634/2289, Differenz 345; weitere Grundausgaben fehlen. Vollständiger aktueller Vergleich oben in Nahkampfvergleich-Indianer-Troll.md. Nächster Vorschlag: Vitalität und geringer Glück mit Kostenvarianten ergänzen, noch keine Ziele/Käufe beschlossen. Nur Dokumentation; Sockel/Kostentabelle und Rechnungen geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere Zwischenwerte im übernommenen Stand sind durch diese Angaben ersetzt.

Ergebnis: [Nahkampfvergleich Indianer / Troll](Nahkampfvergleich-Indianer-Troll.md) als Planungsrechnung angelegt. Beide Hiebwaffen 12 / Äxte 12 für je 480 SP; beide Axt aus Eisen, Gesellenarbeit, Von der Stange, Standardschaft für je 97 D. Rest nach Volkssockel und diesen Käufen 2794 / 2569 SP, noch vor weiteren Grundausgaben. Keine Charakterdateien oder Generatorlogik geändert. Kosten und Katalogwerte abgeglichen; keine Laufzeittests, kein Commit/Push.

### Neue Entscheidungen mit Vorrang vor dem übernommenen Fachstand

SSK gehört in Rahmen/Hintergrund. Ausstattung an Profession binden und ihre SP-Voraussetzungen einschließlich Rüstungsmanöver erfassen. Berufliche Basis ca. 3–5 % der gesamten SP als diskutierter Ansatz; Abgrenzung zu WHK mindestens 5 % / Attributen mindestens 3 % noch offen. Anschließend gemeinsames Restbudget mit Reglern für FK/NK/Spruchmagie/KI/PSI und bessere Berufsfähigkeiten, Summe 100 %. Jeder Zweig finanziert passende Eigenschaften, Attribute und Voraussetzungen mit. Magiegrundwerte vor Repertoire. Klassen als zu prüfende Presets.

Unbewaffnet = Kreis × 3 ist ausdrücklich verworfen. Alle entsprechenden Aussagen im unten übernommenen Stand und älteren Fachunterlagen sind überholt, keine neue Pflicht beschlossen. Frühere Grafikgruppierung durch SSK-/Professionsentscheidung ebenfalls überholt. Fachunterlagen noch nicht umfassend umgestellt; vor Implementierung abgleichen.

Nahkampfvergleich: gewichtete Eigenschaftsbestandteile von AW/AT/PA, zusätzlich Konstitution und Vitalität, geringer Glück. Hiebwaffen und Äxte immer gleich hoch, aktuell beide 12. Indianer Stärke 10 erfüllt die Zweihandanforderung der Axt, Troll Stärke 19 auch einhändig. Griffart jetzt für beide zweihändig bestätigt. nAT/nPA vor Poolverteilung Indianer 8/7, Troll 9/5; je 12 unvergebene PP. Schaden W20−1 / W20+4, Durchschnitt vor Rüstung 9,5 / 14,5. WK zweihändig je 9. Berechnung gegen Waffenpool-, Schadens- und Griffdarstellung geprüft; keine zusätzlichen SP-Ausgaben. Vollständige Rechnung im Vergleichsdokument. Nächster Vorschlag: 12 PP nach identischer Priorität verteilen; noch nicht beauftragt.

### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 033 · GELÖST — Wache, SSK und Zeughausrüstung finanziert

Aktueller Abschluss mit Vorrang: gemeinsame Wache als Vergleichsannahme gewählt, WHK-Güte Meister, protokollierender Dienst. SSK120 SP (Sprache3/Kultur3/Schrift2, konkrete Identität offen), Berufsbasis208 SP=3,25 % (WHK136 + GF/SF72). Bestehendes breites Wache-WHK-Beispiel auf323 SP finanziert, Mehrkosten187, inklusive ausdrücklich als Entwurf gekennzeichneter Führung8. Zeughausrüstung von der Stange kostet1561 D bei RH30; RM2/1 für18/9 SP ergeben RBE3/2,9333 und jeweils3 KBE. Kleidung/Arbeitsmittel92,137 D, mit Axt97 D Gesamtausstattung1750,137 D innerhalb5000 D, ausgewählter Umfang ohne vollständige Versorgung/Lastprüfung. Rest jetzt289/445 SP. Endwerte/Artikel/Annahmen und offene Auswahlen oben im Nahkampfvergleich vollständig dokumentiert. Aussehen/Schlaf und Lebenswelt/Terrain/Soziallage sowie konkrete SSK bleiben offen; keine fertigen NPCs behauptet. Nächster Vorschlag: gemeinsame Hintergrundauswahlen und neutrale Pflichtmerkmale wählen, Beiträge zusammenführen, Rest neu rechnen; noch nicht ausgeführt. Nur Dokumentation und Kosten-/Rüstungsprüfung, keine Laufzeit-/Charakteränderung oder Tests. Frühere Budgetreste und Aussagen zu noch nicht bezahlter beruflicher Basis unten sind ersetzt.

Neuester Abschluss mit Vorrang: Nutzer bestätigt Vitalität 5 und Glück 3 für beide Nahkämpfer. Je 600+300=900 SP ab 0, Attributminimum damit erfüllt ohne Zusatzabzug. Rest jetzt Indianer 822/Troll 969 SP vor SSK/Hintergrund/beruflicher Basis und weiteren Grundausgaben. Ausdauer 71/80, Gesundheit 14/15, LE Kopf/Brust/Unterleib 13/24/18 bzw. 14/26/20, Trefferschwelle beide 10. Axtproben n15/15 g5/4 m22/22 und Durchschnittsschaden 13,5/14,5 unverändert. Ausgearbeitet in Nahkampfvergleich und Eigenschaften-und-Attribute; Formeln arithmetisch geprüft, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere Restwerte und offene Attributziele unten sind ersetzt. Nächster Vorschlag: SSK und konkrete berufliche Basis einschließlich Ausstattung/Rüstungsmanöver bepreisen; Beruf und Hintergrund noch zu wählen. Keine weiteren Ausgaben beauftragt.

Abschluss dieses Schritts mit Vorrang: CK-Zielprofil jetzt in Axtvergleich übernommen. Indianer STÄ/ATH/SCH/KON/MUT 17/17/15/15/13, Troll 19/17/15/19/13. Beide H/S16, gleiche Eisenäxte zweihändig. nAT/nPA vor PP 12/11; je 3/4 PP für Ziel 15/15, Rest 9 als 7 gute / 2 meisterliche (Ganzzahlnäherung 3:1). PP gAT/gPA/mAT/mPA 4/3/1/1. Endwerte 15/15, 5/4, 22/22; 0 PP frei, AT/PA-Investition 8/8, Grenzen eingehalten. Schaden W20+3 / W20+4, Durchschnitt 13,5/14,5. Rest-SP 1722/1869 vor weiteren Grundausgaben unverändert. Aktuelle Rechnung oben im Nahkampfvergleich dokumentiert; frühere Zahlen unten sind Zwischenstände. Nächster Vorschlag: Vitalität und geringer Glück mit Zielwerten/Kosten ergänzen, noch nicht beauftragt. Nur Dokumentation und arithmetische Prüfung, keine Laufzeittests oder Charakter-/Generatoränderungen.

Neuester Stand mit Vorrang: Nutzer bestätigt CK-Nahkämpfer-Zielbereich 13–17 auf Stufe 0 und Stärke zwingend mit hoher Priorität, unabhängig vom vorigen Axtbeispiel. Konkrete Gewichtung auf Auftrag ausgearbeitet: Stärke 17, Athletik 17, Schnelligkeit 15, Konstitution 15, Mut 13. Profilentwurf in Eigenschaften-und-Attribute.md dokumentiert; höhere Volksminima erhalten, keine Prozentgewichte erfunden. Kosten vom Sockel Indianer 912 / Troll 540 SP (enthält dessen frühere 120 SP). Mit H/S16 rechnerischer Rest 1722/1869 vor weiteren Grundausgaben. Ziele gegen Volksobergrenzen und Kostentabelle geprüft. Alte Kampfwerte unten gehören zum früheren 9er-Vergleich, nicht zum neuen Zielprofil. Nächster Vorschlag: Axtkampfwerte einschließlich PP und Schaden mit Zielprofil neu rechnen, danach Vitalität/Glück; noch nicht ausgeführt. Keine Laufzeit-/Charakteränderung, kein Commit/Push.

Aktueller Schritt mit Vorrang: Nutzer setzt CK-relevante Eigenschaften auf mindestens 9. Hier Athletik/Schnelligkeit/Mut sowie Konstitution; Stärke als Waffen-/Schadenswert ebenfalls bereits über 9. Attribute Vitalität/Glück erhalten kein 9er-Minimum. Indianer kein Zukauf; Troll SCH 5 auf 9 für 120 SP. Hiebwaffen/Äxte weiterhin 16/16. Jetzt nAT/nPA vor PP 9/8 bzw. 10/8; beide erreichen 15/15 regelkonform. Indianer gAT/gPA 2/2, mAT/mPA 22/21 (Rest 3, Näherung g:m=2:1); Troll 3/2 und 22/21 (Rest 4, exakt 3:1). Je 16 PP verbraucht, AT/PA-Ausgaben 8/8. Vorherige Troll-Blockade gelöst. Schaden 9,5/14,5 unverändert. SP-Reste nach Sockel/Ausbildung/CK-Minimum 2634/2289, Differenz 345; weitere Grundausgaben fehlen. Vollständiger aktueller Vergleich oben in Nahkampfvergleich-Indianer-Troll.md. Nächster Vorschlag: Vitalität und geringer Glück mit Kostenvarianten ergänzen, noch keine Ziele/Käufe beschlossen. Nur Dokumentation; Sockel/Kostentabelle und Rechnungen geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere Zwischenwerte im übernommenen Stand sind durch diese Angaben ersetzt.

Ergebnis: [Nahkampfvergleich Indianer / Troll](Nahkampfvergleich-Indianer-Troll.md) als Planungsrechnung angelegt. Beide Hiebwaffen 12 / Äxte 12 für je 480 SP; beide Axt aus Eisen, Gesellenarbeit, Von der Stange, Standardschaft für je 97 D. Rest nach Volkssockel und diesen Käufen 2794 / 2569 SP, noch vor weiteren Grundausgaben. Keine Charakterdateien oder Generatorlogik geändert. Kosten und Katalogwerte abgeglichen; keine Laufzeittests, kein Commit/Push.

### Neue Entscheidungen mit Vorrang vor dem übernommenen Fachstand

SSK gehört in Rahmen/Hintergrund. Ausstattung an Profession binden und ihre SP-Voraussetzungen einschließlich Rüstungsmanöver erfassen. Berufliche Basis ca. 3–5 % der gesamten SP als diskutierter Ansatz; Abgrenzung zu WHK mindestens 5 % / Attributen mindestens 3 % noch offen. Anschließend gemeinsames Restbudget mit Reglern für FK/NK/Spruchmagie/KI/PSI und bessere Berufsfähigkeiten, Summe 100 %. Jeder Zweig finanziert passende Eigenschaften, Attribute und Voraussetzungen mit. Magiegrundwerte vor Repertoire. Klassen als zu prüfende Presets.

Unbewaffnet = Kreis × 3 ist ausdrücklich verworfen. Alle entsprechenden Aussagen im unten übernommenen Stand und älteren Fachunterlagen sind überholt, keine neue Pflicht beschlossen. Frühere Grafikgruppierung durch SSK-/Professionsentscheidung ebenfalls überholt. Fachunterlagen noch nicht umfassend umgestellt; vor Implementierung abgleichen.

Nahkampfvergleich: gewichtete Eigenschaftsbestandteile von AW/AT/PA, zusätzlich Konstitution und Vitalität, geringer Glück. Hiebwaffen und Äxte immer gleich hoch, aktuell beide 12. Indianer Stärke 10 erfüllt die Zweihandanforderung der Axt, Troll Stärke 19 auch einhändig. Griffart jetzt für beide zweihändig bestätigt. nAT/nPA vor Poolverteilung Indianer 8/7, Troll 9/5; je 12 unvergebene PP. Schaden W20−1 / W20+4, Durchschnitt vor Rüstung 9,5 / 14,5. WK zweihändig je 9. Berechnung gegen Waffenpool-, Schadens- und Griffdarstellung geprüft; keine zusätzlichen SP-Ausgaben. Vollständige Rechnung im Vergleichsdokument. Nächster Vorschlag: 12 PP nach identischer Priorität verteilen; noch nicht beauftragt.

### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 032 · GELÖST — Vitalität 5 und Glück 3 für beide Nahkämpfer

Neuester Abschluss mit Vorrang: Nutzer bestätigt Vitalität 5 und Glück 3 für beide Nahkämpfer. Je 600+300=900 SP ab 0, Attributminimum damit erfüllt ohne Zusatzabzug. Rest jetzt Indianer 822/Troll 969 SP vor SSK/Hintergrund/beruflicher Basis und weiteren Grundausgaben. Ausdauer 71/80, Gesundheit 14/15, LE Kopf/Brust/Unterleib 13/24/18 bzw. 14/26/20, Trefferschwelle beide 10. Axtproben n15/15 g5/4 m22/22 und Durchschnittsschaden 13,5/14,5 unverändert. Ausgearbeitet in Nahkampfvergleich und Eigenschaften-und-Attribute; Formeln arithmetisch geprüft, keine Laufzeittests oder Charakter-/Generatoränderung. Frühere Restwerte und offene Attributziele unten sind ersetzt. Nächster Vorschlag: SSK und konkrete berufliche Basis einschließlich Ausstattung/Rüstungsmanöver bepreisen; Beruf und Hintergrund noch zu wählen. Keine weiteren Ausgaben beauftragt.

Abschluss dieses Schritts mit Vorrang: CK-Zielprofil jetzt in Axtvergleich übernommen. Indianer STÄ/ATH/SCH/KON/MUT 17/17/15/15/13, Troll 19/17/15/19/13. Beide H/S16, gleiche Eisenäxte zweihändig. nAT/nPA vor PP 12/11; je 3/4 PP für Ziel 15/15, Rest 9 als 7 gute / 2 meisterliche (Ganzzahlnäherung 3:1). PP gAT/gPA/mAT/mPA 4/3/1/1. Endwerte 15/15, 5/4, 22/22; 0 PP frei, AT/PA-Investition 8/8, Grenzen eingehalten. Schaden W20+3 / W20+4, Durchschnitt 13,5/14,5. Rest-SP 1722/1869 vor weiteren Grundausgaben unverändert. Aktuelle Rechnung oben im Nahkampfvergleich dokumentiert; frühere Zahlen unten sind Zwischenstände. Nächster Vorschlag: Vitalität und geringer Glück mit Zielwerten/Kosten ergänzen, noch nicht beauftragt. Nur Dokumentation und arithmetische Prüfung, keine Laufzeittests oder Charakter-/Generatoränderungen.

Neuester Stand mit Vorrang: Nutzer bestätigt CK-Nahkämpfer-Zielbereich 13–17 auf Stufe 0 und Stärke zwingend mit hoher Priorität, unabhängig vom vorigen Axtbeispiel. Konkrete Gewichtung auf Auftrag ausgearbeitet: Stärke 17, Athletik 17, Schnelligkeit 15, Konstitution 15, Mut 13. Profilentwurf in Eigenschaften-und-Attribute.md dokumentiert; höhere Volksminima erhalten, keine Prozentgewichte erfunden. Kosten vom Sockel Indianer 912 / Troll 540 SP (enthält dessen frühere 120 SP). Mit H/S16 rechnerischer Rest 1722/1869 vor weiteren Grundausgaben. Ziele gegen Volksobergrenzen und Kostentabelle geprüft. Alte Kampfwerte unten gehören zum früheren 9er-Vergleich, nicht zum neuen Zielprofil. Nächster Vorschlag: Axtkampfwerte einschließlich PP und Schaden mit Zielprofil neu rechnen, danach Vitalität/Glück; noch nicht ausgeführt. Keine Laufzeit-/Charakteränderung, kein Commit/Push.

Aktueller Schritt mit Vorrang: Nutzer setzt CK-relevante Eigenschaften auf mindestens 9. Hier Athletik/Schnelligkeit/Mut sowie Konstitution; Stärke als Waffen-/Schadenswert ebenfalls bereits über 9. Attribute Vitalität/Glück erhalten kein 9er-Minimum. Indianer kein Zukauf; Troll SCH 5 auf 9 für 120 SP. Hiebwaffen/Äxte weiterhin 16/16. Jetzt nAT/nPA vor PP 9/8 bzw. 10/8; beide erreichen 15/15 regelkonform. Indianer gAT/gPA 2/2, mAT/mPA 22/21 (Rest 3, Näherung g:m=2:1); Troll 3/2 und 22/21 (Rest 4, exakt 3:1). Je 16 PP verbraucht, AT/PA-Ausgaben 8/8. Vorherige Troll-Blockade gelöst. Schaden 9,5/14,5 unverändert. SP-Reste nach Sockel/Ausbildung/CK-Minimum 2634/2289, Differenz 345; weitere Grundausgaben fehlen. Vollständiger aktueller Vergleich oben in Nahkampfvergleich-Indianer-Troll.md. Nächster Vorschlag: Vitalität und geringer Glück mit Kostenvarianten ergänzen, noch keine Ziele/Käufe beschlossen. Nur Dokumentation; Sockel/Kostentabelle und Rechnungen geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere Zwischenwerte im übernommenen Stand sind durch diese Angaben ersetzt.

Ergebnis: [Nahkampfvergleich Indianer / Troll](Nahkampfvergleich-Indianer-Troll.md) als Planungsrechnung angelegt. Beide Hiebwaffen 12 / Äxte 12 für je 480 SP; beide Axt aus Eisen, Gesellenarbeit, Von der Stange, Standardschaft für je 97 D. Rest nach Volkssockel und diesen Käufen 2794 / 2569 SP, noch vor weiteren Grundausgaben. Keine Charakterdateien oder Generatorlogik geändert. Kosten und Katalogwerte abgeglichen; keine Laufzeittests, kein Commit/Push.

### Neue Entscheidungen mit Vorrang vor dem übernommenen Fachstand

SSK gehört in Rahmen/Hintergrund. Ausstattung an Profession binden und ihre SP-Voraussetzungen einschließlich Rüstungsmanöver erfassen. Berufliche Basis ca. 3–5 % der gesamten SP als diskutierter Ansatz; Abgrenzung zu WHK mindestens 5 % / Attributen mindestens 3 % noch offen. Anschließend gemeinsames Restbudget mit Reglern für FK/NK/Spruchmagie/KI/PSI und bessere Berufsfähigkeiten, Summe 100 %. Jeder Zweig finanziert passende Eigenschaften, Attribute und Voraussetzungen mit. Magiegrundwerte vor Repertoire. Klassen als zu prüfende Presets.

Unbewaffnet = Kreis × 3 ist ausdrücklich verworfen. Alle entsprechenden Aussagen im unten übernommenen Stand und älteren Fachunterlagen sind überholt, keine neue Pflicht beschlossen. Frühere Grafikgruppierung durch SSK-/Professionsentscheidung ebenfalls überholt. Fachunterlagen noch nicht umfassend umgestellt; vor Implementierung abgleichen.

Nahkampfvergleich: gewichtete Eigenschaftsbestandteile von AW/AT/PA, zusätzlich Konstitution und Vitalität, geringer Glück. Hiebwaffen und Äxte immer gleich hoch, aktuell beide 12. Indianer Stärke 10 erfüllt die Zweihandanforderung der Axt, Troll Stärke 19 auch einhändig. Griffart jetzt für beide zweihändig bestätigt. nAT/nPA vor Poolverteilung Indianer 8/7, Troll 9/5; je 12 unvergebene PP. Schaden W20−1 / W20+4, Durchschnitt vor Rüstung 9,5 / 14,5. WK zweihändig je 9. Berechnung gegen Waffenpool-, Schadens- und Griffdarstellung geprüft; keine zusätzlichen SP-Ausgaben. Vollständige Rechnung im Vergleichsdokument. Nächster Vorschlag: 12 PP nach identischer Priorität verteilen; noch nicht beauftragt.

### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 031 · GELÖST — Axtvergleich mit CK-Zielprofil neu berechnet

Abschluss dieses Schritts mit Vorrang: CK-Zielprofil jetzt in Axtvergleich übernommen. Indianer STÄ/ATH/SCH/KON/MUT 17/17/15/15/13, Troll 19/17/15/19/13. Beide H/S16, gleiche Eisenäxte zweihändig. nAT/nPA vor PP 12/11; je 3/4 PP für Ziel 15/15, Rest 9 als 7 gute / 2 meisterliche (Ganzzahlnäherung 3:1). PP gAT/gPA/mAT/mPA 4/3/1/1. Endwerte 15/15, 5/4, 22/22; 0 PP frei, AT/PA-Investition 8/8, Grenzen eingehalten. Schaden W20+3 / W20+4, Durchschnitt 13,5/14,5. Rest-SP 1722/1869 vor weiteren Grundausgaben unverändert. Aktuelle Rechnung oben im Nahkampfvergleich dokumentiert; frühere Zahlen unten sind Zwischenstände. Nächster Vorschlag: Vitalität und geringer Glück mit Zielwerten/Kosten ergänzen, noch nicht beauftragt. Nur Dokumentation und arithmetische Prüfung, keine Laufzeittests oder Charakter-/Generatoränderungen.

Neuester Stand mit Vorrang: Nutzer bestätigt CK-Nahkämpfer-Zielbereich 13–17 auf Stufe 0 und Stärke zwingend mit hoher Priorität, unabhängig vom vorigen Axtbeispiel. Konkrete Gewichtung auf Auftrag ausgearbeitet: Stärke 17, Athletik 17, Schnelligkeit 15, Konstitution 15, Mut 13. Profilentwurf in Eigenschaften-und-Attribute.md dokumentiert; höhere Volksminima erhalten, keine Prozentgewichte erfunden. Kosten vom Sockel Indianer 912 / Troll 540 SP (enthält dessen frühere 120 SP). Mit H/S16 rechnerischer Rest 1722/1869 vor weiteren Grundausgaben. Ziele gegen Volksobergrenzen und Kostentabelle geprüft. Alte Kampfwerte unten gehören zum früheren 9er-Vergleich, nicht zum neuen Zielprofil. Nächster Vorschlag: Axtkampfwerte einschließlich PP und Schaden mit Zielprofil neu rechnen, danach Vitalität/Glück; noch nicht ausgeführt. Keine Laufzeit-/Charakteränderung, kein Commit/Push.

Aktueller Schritt mit Vorrang: Nutzer setzt CK-relevante Eigenschaften auf mindestens 9. Hier Athletik/Schnelligkeit/Mut sowie Konstitution; Stärke als Waffen-/Schadenswert ebenfalls bereits über 9. Attribute Vitalität/Glück erhalten kein 9er-Minimum. Indianer kein Zukauf; Troll SCH 5 auf 9 für 120 SP. Hiebwaffen/Äxte weiterhin 16/16. Jetzt nAT/nPA vor PP 9/8 bzw. 10/8; beide erreichen 15/15 regelkonform. Indianer gAT/gPA 2/2, mAT/mPA 22/21 (Rest 3, Näherung g:m=2:1); Troll 3/2 und 22/21 (Rest 4, exakt 3:1). Je 16 PP verbraucht, AT/PA-Ausgaben 8/8. Vorherige Troll-Blockade gelöst. Schaden 9,5/14,5 unverändert. SP-Reste nach Sockel/Ausbildung/CK-Minimum 2634/2289, Differenz 345; weitere Grundausgaben fehlen. Vollständiger aktueller Vergleich oben in Nahkampfvergleich-Indianer-Troll.md. Nächster Vorschlag: Vitalität und geringer Glück mit Kostenvarianten ergänzen, noch keine Ziele/Käufe beschlossen. Nur Dokumentation; Sockel/Kostentabelle und Rechnungen geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere Zwischenwerte im übernommenen Stand sind durch diese Angaben ersetzt.

Ergebnis: [Nahkampfvergleich Indianer / Troll](Nahkampfvergleich-Indianer-Troll.md) als Planungsrechnung angelegt. Beide Hiebwaffen 12 / Äxte 12 für je 480 SP; beide Axt aus Eisen, Gesellenarbeit, Von der Stange, Standardschaft für je 97 D. Rest nach Volkssockel und diesen Käufen 2794 / 2569 SP, noch vor weiteren Grundausgaben. Keine Charakterdateien oder Generatorlogik geändert. Kosten und Katalogwerte abgeglichen; keine Laufzeittests, kein Commit/Push.

### Neue Entscheidungen mit Vorrang vor dem übernommenen Fachstand

SSK gehört in Rahmen/Hintergrund. Ausstattung an Profession binden und ihre SP-Voraussetzungen einschließlich Rüstungsmanöver erfassen. Berufliche Basis ca. 3–5 % der gesamten SP als diskutierter Ansatz; Abgrenzung zu WHK mindestens 5 % / Attributen mindestens 3 % noch offen. Anschließend gemeinsames Restbudget mit Reglern für FK/NK/Spruchmagie/KI/PSI und bessere Berufsfähigkeiten, Summe 100 %. Jeder Zweig finanziert passende Eigenschaften, Attribute und Voraussetzungen mit. Magiegrundwerte vor Repertoire. Klassen als zu prüfende Presets.

Unbewaffnet = Kreis × 3 ist ausdrücklich verworfen. Alle entsprechenden Aussagen im unten übernommenen Stand und älteren Fachunterlagen sind überholt, keine neue Pflicht beschlossen. Frühere Grafikgruppierung durch SSK-/Professionsentscheidung ebenfalls überholt. Fachunterlagen noch nicht umfassend umgestellt; vor Implementierung abgleichen.

Nahkampfvergleich: gewichtete Eigenschaftsbestandteile von AW/AT/PA, zusätzlich Konstitution und Vitalität, geringer Glück. Hiebwaffen und Äxte immer gleich hoch, aktuell beide 12. Indianer Stärke 10 erfüllt die Zweihandanforderung der Axt, Troll Stärke 19 auch einhändig. Griffart jetzt für beide zweihändig bestätigt. nAT/nPA vor Poolverteilung Indianer 8/7, Troll 9/5; je 12 unvergebene PP. Schaden W20−1 / W20+4, Durchschnitt vor Rüstung 9,5 / 14,5. WK zweihändig je 9. Berechnung gegen Waffenpool-, Schadens- und Griffdarstellung geprüft; keine zusätzlichen SP-Ausgaben. Vollständige Rechnung im Vergleichsdokument. Nächster Vorschlag: 12 PP nach identischer Priorität verteilen; noch nicht beauftragt.

### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 030 · GELÖST — CK Nahkämpfer: konkrete Eigenschaftsziele auf Stufe 0

Neuester Stand mit Vorrang: Nutzer bestätigt CK-Nahkämpfer-Zielbereich 13–17 auf Stufe 0 und Stärke zwingend mit hoher Priorität, unabhängig vom vorigen Axtbeispiel. Konkrete Gewichtung auf Auftrag ausgearbeitet: Stärke 17, Athletik 17, Schnelligkeit 15, Konstitution 15, Mut 13. Profilentwurf in Eigenschaften-und-Attribute.md dokumentiert; höhere Volksminima erhalten, keine Prozentgewichte erfunden. Kosten vom Sockel Indianer 912 / Troll 540 SP (enthält dessen frühere 120 SP). Mit H/S16 rechnerischer Rest 1722/1869 vor weiteren Grundausgaben. Ziele gegen Volksobergrenzen und Kostentabelle geprüft. Alte Kampfwerte unten gehören zum früheren 9er-Vergleich, nicht zum neuen Zielprofil. Nächster Vorschlag: Axtkampfwerte einschließlich PP und Schaden mit Zielprofil neu rechnen, danach Vitalität/Glück; noch nicht ausgeführt. Keine Laufzeit-/Charakteränderung, kein Commit/Push.

Aktueller Schritt mit Vorrang: Nutzer setzt CK-relevante Eigenschaften auf mindestens 9. Hier Athletik/Schnelligkeit/Mut sowie Konstitution; Stärke als Waffen-/Schadenswert ebenfalls bereits über 9. Attribute Vitalität/Glück erhalten kein 9er-Minimum. Indianer kein Zukauf; Troll SCH 5 auf 9 für 120 SP. Hiebwaffen/Äxte weiterhin 16/16. Jetzt nAT/nPA vor PP 9/8 bzw. 10/8; beide erreichen 15/15 regelkonform. Indianer gAT/gPA 2/2, mAT/mPA 22/21 (Rest 3, Näherung g:m=2:1); Troll 3/2 und 22/21 (Rest 4, exakt 3:1). Je 16 PP verbraucht, AT/PA-Ausgaben 8/8. Vorherige Troll-Blockade gelöst. Schaden 9,5/14,5 unverändert. SP-Reste nach Sockel/Ausbildung/CK-Minimum 2634/2289, Differenz 345; weitere Grundausgaben fehlen. Vollständiger aktueller Vergleich oben in Nahkampfvergleich-Indianer-Troll.md. Nächster Vorschlag: Vitalität und geringer Glück mit Kostenvarianten ergänzen, noch keine Ziele/Käufe beschlossen. Nur Dokumentation; Sockel/Kostentabelle und Rechnungen geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere Zwischenwerte im übernommenen Stand sind durch diese Angaben ersetzt.

Ergebnis: [Nahkampfvergleich Indianer / Troll](Nahkampfvergleich-Indianer-Troll.md) als Planungsrechnung angelegt. Beide Hiebwaffen 12 / Äxte 12 für je 480 SP; beide Axt aus Eisen, Gesellenarbeit, Von der Stange, Standardschaft für je 97 D. Rest nach Volkssockel und diesen Käufen 2794 / 2569 SP, noch vor weiteren Grundausgaben. Keine Charakterdateien oder Generatorlogik geändert. Kosten und Katalogwerte abgeglichen; keine Laufzeittests, kein Commit/Push.

### Neue Entscheidungen mit Vorrang vor dem übernommenen Fachstand

SSK gehört in Rahmen/Hintergrund. Ausstattung an Profession binden und ihre SP-Voraussetzungen einschließlich Rüstungsmanöver erfassen. Berufliche Basis ca. 3–5 % der gesamten SP als diskutierter Ansatz; Abgrenzung zu WHK mindestens 5 % / Attributen mindestens 3 % noch offen. Anschließend gemeinsames Restbudget mit Reglern für FK/NK/Spruchmagie/KI/PSI und bessere Berufsfähigkeiten, Summe 100 %. Jeder Zweig finanziert passende Eigenschaften, Attribute und Voraussetzungen mit. Magiegrundwerte vor Repertoire. Klassen als zu prüfende Presets.

Unbewaffnet = Kreis × 3 ist ausdrücklich verworfen. Alle entsprechenden Aussagen im unten übernommenen Stand und älteren Fachunterlagen sind überholt, keine neue Pflicht beschlossen. Frühere Grafikgruppierung durch SSK-/Professionsentscheidung ebenfalls überholt. Fachunterlagen noch nicht umfassend umgestellt; vor Implementierung abgleichen.

Nahkampfvergleich: gewichtete Eigenschaftsbestandteile von AW/AT/PA, zusätzlich Konstitution und Vitalität, geringer Glück. Hiebwaffen und Äxte immer gleich hoch, aktuell beide 12. Indianer Stärke 10 erfüllt die Zweihandanforderung der Axt, Troll Stärke 19 auch einhändig. Griffart jetzt für beide zweihändig bestätigt. nAT/nPA vor Poolverteilung Indianer 8/7, Troll 9/5; je 12 unvergebene PP. Schaden W20−1 / W20+4, Durchschnitt vor Rüstung 9,5 / 14,5. WK zweihändig je 9. Berechnung gegen Waffenpool-, Schadens- und Griffdarstellung geprüft; keine zusätzlichen SP-Ausgaben. Vollständige Rechnung im Vergleichsdokument. Nächster Vorschlag: 12 PP nach identischer Priorität verteilen; noch nicht beauftragt.

### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 029 · GELÖST — CK-Eigenschaften mindestens 9; beide Axtprofile erreichen 15/15

Aktueller Schritt mit Vorrang: Nutzer setzt CK-relevante Eigenschaften auf mindestens 9. Hier Athletik/Schnelligkeit/Mut sowie Konstitution; Stärke als Waffen-/Schadenswert ebenfalls bereits über 9. Attribute Vitalität/Glück erhalten kein 9er-Minimum. Indianer kein Zukauf; Troll SCH 5 auf 9 für 120 SP. Hiebwaffen/Äxte weiterhin 16/16. Jetzt nAT/nPA vor PP 9/8 bzw. 10/8; beide erreichen 15/15 regelkonform. Indianer gAT/gPA 2/2, mAT/mPA 22/21 (Rest 3, Näherung g:m=2:1); Troll 3/2 und 22/21 (Rest 4, exakt 3:1). Je 16 PP verbraucht, AT/PA-Ausgaben 8/8. Vorherige Troll-Blockade gelöst. Schaden 9,5/14,5 unverändert. SP-Reste nach Sockel/Ausbildung/CK-Minimum 2634/2289, Differenz 345; weitere Grundausgaben fehlen. Vollständiger aktueller Vergleich oben in Nahkampfvergleich-Indianer-Troll.md. Nächster Vorschlag: Vitalität und geringer Glück mit Kostenvarianten ergänzen, noch keine Ziele/Käufe beschlossen. Nur Dokumentation; Sockel/Kostentabelle und Rechnungen geprüft, keine Laufzeittests oder Generator-/Charakteränderungen. Frühere Zwischenwerte im übernommenen Stand sind durch diese Angaben ersetzt.

Ergebnis: [Nahkampfvergleich Indianer / Troll](Nahkampfvergleich-Indianer-Troll.md) als Planungsrechnung angelegt. Beide Hiebwaffen 12 / Äxte 12 für je 480 SP; beide Axt aus Eisen, Gesellenarbeit, Von der Stange, Standardschaft für je 97 D. Rest nach Volkssockel und diesen Käufen 2794 / 2569 SP, noch vor weiteren Grundausgaben. Keine Charakterdateien oder Generatorlogik geändert. Kosten und Katalogwerte abgeglichen; keine Laufzeittests, kein Commit/Push.

### Neue Entscheidungen mit Vorrang vor dem übernommenen Fachstand

SSK gehört in Rahmen/Hintergrund. Ausstattung an Profession binden und ihre SP-Voraussetzungen einschließlich Rüstungsmanöver erfassen. Berufliche Basis ca. 3–5 % der gesamten SP als diskutierter Ansatz; Abgrenzung zu WHK mindestens 5 % / Attributen mindestens 3 % noch offen. Anschließend gemeinsames Restbudget mit Reglern für FK/NK/Spruchmagie/KI/PSI und bessere Berufsfähigkeiten, Summe 100 %. Jeder Zweig finanziert passende Eigenschaften, Attribute und Voraussetzungen mit. Magiegrundwerte vor Repertoire. Klassen als zu prüfende Presets.

Unbewaffnet = Kreis × 3 ist ausdrücklich verworfen. Alle entsprechenden Aussagen im unten übernommenen Stand und älteren Fachunterlagen sind überholt, keine neue Pflicht beschlossen. Frühere Grafikgruppierung durch SSK-/Professionsentscheidung ebenfalls überholt. Fachunterlagen noch nicht umfassend umgestellt; vor Implementierung abgleichen.

Nahkampfvergleich: gewichtete Eigenschaftsbestandteile von AW/AT/PA, zusätzlich Konstitution und Vitalität, geringer Glück. Hiebwaffen und Äxte immer gleich hoch, aktuell beide 12. Indianer Stärke 10 erfüllt die Zweihandanforderung der Axt, Troll Stärke 19 auch einhändig. Griffart jetzt für beide zweihändig bestätigt. nAT/nPA vor Poolverteilung Indianer 8/7, Troll 9/5; je 12 unvergebene PP. Schaden W20−1 / W20+4, Durchschnitt vor Rüstung 9,5 / 14,5. WK zweihändig je 9. Berechnung gegen Waffenpool-, Schadens- und Griffdarstellung geprüft; keine zusätzlichen SP-Ausgaben. Vollständige Rechnung im Vergleichsdokument. Nächster Vorschlag: 12 PP nach identischer Priorität verteilen; noch nicht beauftragt.

### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 028 · GELÖST — Hiebwaffen/Äxte 16 und Zielprüfung 15/15

Aktueller Schritt mit Vorrang: Beide Hiebwaffen und Äxte 16 für je 640 SP. Rechnerischer Rest nach Sockel und Ausbildung 2634 / 2409 SP. nAT/nPA vor PP 9/8 bzw. 10/6. Indianer erreicht 15/15 mit 13 PP; Rest 3 angenähert g:m=2:1, gültige Verteilung gAT/gPA 2/2, mAT/mPA 22/21, alle 16 PP verbraucht und AT/PA-Ausgaben 8/8. Exaktes 3:1 bei Rest 3 nicht möglich. Troll benötigt 14 PP für 15/15, scheitert aber mit den restlichen 2 PP an AT/PA-Balance (bestenfalls 7/9). Kein legales Troll-Endprofil, keine stillen Eigenschaftskäufe. Details im Nahkampfvergleich. Nächster Vorschlag: Troll-Schnelligkeit für PA-Basis steigern, dann erneut verteilen; noch nicht beauftragt. Schaden und Waffe unverändert. Nur Dokumentation, arithmetisch und gegen Poolregeln geprüft, keine Laufzeittests. Frühere 12er-/unvergebene-PP-Angaben unten sind vorheriger Zwischenstand.

Ergebnis: [Nahkampfvergleich Indianer / Troll](Nahkampfvergleich-Indianer-Troll.md) als Planungsrechnung angelegt. Beide Hiebwaffen 12 / Äxte 12 für je 480 SP; beide Axt aus Eisen, Gesellenarbeit, Von der Stange, Standardschaft für je 97 D. Rest nach Volkssockel und diesen Käufen 2794 / 2569 SP, noch vor weiteren Grundausgaben. Keine Charakterdateien oder Generatorlogik geändert. Kosten und Katalogwerte abgeglichen; keine Laufzeittests, kein Commit/Push.

### Neue Entscheidungen mit Vorrang vor dem übernommenen Fachstand

SSK gehört in Rahmen/Hintergrund. Ausstattung an Profession binden und ihre SP-Voraussetzungen einschließlich Rüstungsmanöver erfassen. Berufliche Basis ca. 3–5 % der gesamten SP als diskutierter Ansatz; Abgrenzung zu WHK mindestens 5 % / Attributen mindestens 3 % noch offen. Anschließend gemeinsames Restbudget mit Reglern für FK/NK/Spruchmagie/KI/PSI und bessere Berufsfähigkeiten, Summe 100 %. Jeder Zweig finanziert passende Eigenschaften, Attribute und Voraussetzungen mit. Magiegrundwerte vor Repertoire. Klassen als zu prüfende Presets.

Unbewaffnet = Kreis × 3 ist ausdrücklich verworfen. Alle entsprechenden Aussagen im unten übernommenen Stand und älteren Fachunterlagen sind überholt, keine neue Pflicht beschlossen. Frühere Grafikgruppierung durch SSK-/Professionsentscheidung ebenfalls überholt. Fachunterlagen noch nicht umfassend umgestellt; vor Implementierung abgleichen.

Nahkampfvergleich: gewichtete Eigenschaftsbestandteile von AW/AT/PA, zusätzlich Konstitution und Vitalität, geringer Glück. Hiebwaffen und Äxte immer gleich hoch, aktuell beide 12. Indianer Stärke 10 erfüllt die Zweihandanforderung der Axt, Troll Stärke 19 auch einhändig. Griffart jetzt für beide zweihändig bestätigt. nAT/nPA vor Poolverteilung Indianer 8/7, Troll 9/5; je 12 unvergebene PP. Schaden W20−1 / W20+4, Durchschnitt vor Rüstung 9,5 / 14,5. WK zweihändig je 9. Berechnung gegen Waffenpool-, Schadens- und Griffdarstellung geprüft; keine zusätzlichen SP-Ausgaben. Vollständige Rechnung im Vergleichsdokument. Nächster Vorschlag: 12 PP nach identischer Priorität verteilen; noch nicht beauftragt.

### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 027 · GELÖST — Zweihandäxte: nAT/nPA, PP und Durchschnittsschaden

Ergebnis: [Nahkampfvergleich Indianer / Troll](Nahkampfvergleich-Indianer-Troll.md) als Planungsrechnung angelegt. Beide Hiebwaffen 12 / Äxte 12 für je 480 SP; beide Axt aus Eisen, Gesellenarbeit, Von der Stange, Standardschaft für je 97 D. Rest nach Volkssockel und diesen Käufen 2794 / 2569 SP, noch vor weiteren Grundausgaben. Keine Charakterdateien oder Generatorlogik geändert. Kosten und Katalogwerte abgeglichen; keine Laufzeittests, kein Commit/Push.

### Neue Entscheidungen mit Vorrang vor dem übernommenen Fachstand

SSK gehört in Rahmen/Hintergrund. Ausstattung an Profession binden und ihre SP-Voraussetzungen einschließlich Rüstungsmanöver erfassen. Berufliche Basis ca. 3–5 % der gesamten SP als diskutierter Ansatz; Abgrenzung zu WHK mindestens 5 % / Attributen mindestens 3 % noch offen. Anschließend gemeinsames Restbudget mit Reglern für FK/NK/Spruchmagie/KI/PSI und bessere Berufsfähigkeiten, Summe 100 %. Jeder Zweig finanziert passende Eigenschaften, Attribute und Voraussetzungen mit. Magiegrundwerte vor Repertoire. Klassen als zu prüfende Presets.

Unbewaffnet = Kreis × 3 ist ausdrücklich verworfen. Alle entsprechenden Aussagen im unten übernommenen Stand und älteren Fachunterlagen sind überholt, keine neue Pflicht beschlossen. Frühere Grafikgruppierung durch SSK-/Professionsentscheidung ebenfalls überholt. Fachunterlagen noch nicht umfassend umgestellt; vor Implementierung abgleichen.

Nahkampfvergleich: gewichtete Eigenschaftsbestandteile von AW/AT/PA, zusätzlich Konstitution und Vitalität, geringer Glück. Hiebwaffen und Äxte immer gleich hoch, aktuell beide 12. Indianer Stärke 10 erfüllt die Zweihandanforderung der Axt, Troll Stärke 19 auch einhändig. Griffart jetzt für beide zweihändig bestätigt. nAT/nPA vor Poolverteilung Indianer 8/7, Troll 9/5; je 12 unvergebene PP. Schaden W20−1 / W20+4, Durchschnitt vor Rüstung 9,5 / 14,5. WK zweihändig je 9. Berechnung gegen Waffenpool-, Schadens- und Griffdarstellung geprüft; keine zusätzlichen SP-Ausgaben. Vollständige Rechnung im Vergleichsdokument. Nächster Vorschlag: 12 PP nach identischer Priorität verteilen; noch nicht beauftragt.

### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 026 · GELÖST — Vergleich: Hiebwaffen 12, Äxte 12 und gleiche Eisenäxte

Ergebnis: [Nahkampfvergleich Indianer / Troll](Nahkampfvergleich-Indianer-Troll.md) als Planungsrechnung angelegt. Beide Hiebwaffen 12 / Äxte 12 für je 480 SP; beide Axt aus Eisen, Gesellenarbeit, Von der Stange, Standardschaft für je 97 D. Rest nach Volkssockel und diesen Käufen 2794 / 2569 SP, noch vor weiteren Grundausgaben. Keine Charakterdateien oder Generatorlogik geändert. Kosten und Katalogwerte abgeglichen; keine Laufzeittests, kein Commit/Push.

### Neue Entscheidungen mit Vorrang vor dem übernommenen Fachstand

SSK gehört in Rahmen/Hintergrund. Ausstattung an Profession binden und ihre SP-Voraussetzungen einschließlich Rüstungsmanöver erfassen. Berufliche Basis ca. 3–5 % der gesamten SP als diskutierter Ansatz; Abgrenzung zu WHK mindestens 5 % / Attributen mindestens 3 % noch offen. Anschließend gemeinsames Restbudget mit Reglern für FK/NK/Spruchmagie/KI/PSI und bessere Berufsfähigkeiten, Summe 100 %. Jeder Zweig finanziert passende Eigenschaften, Attribute und Voraussetzungen mit. Magiegrundwerte vor Repertoire. Klassen als zu prüfende Presets.

Unbewaffnet = Kreis × 3 ist ausdrücklich verworfen. Alle entsprechenden Aussagen im unten übernommenen Stand und älteren Fachunterlagen sind überholt, keine neue Pflicht beschlossen. Frühere Grafikgruppierung durch SSK-/Professionsentscheidung ebenfalls überholt. Fachunterlagen noch nicht umfassend umgestellt; vor Implementierung abgleichen.

Nahkampfvergleich: gewichtete Eigenschaftsbestandteile von AW/AT/PA, zusätzlich Konstitution und Vitalität, geringer Glück. Hiebwaffen und Äxte immer gleich hoch, aktuell beide 12. Indianer Stärke 10 erfüllt die Zweihandanforderung der Axt, Troll Stärke 19 auch einhändig. Griffart noch offen. Nächster konkreter Vorschlag: beide zweihändig führen, danach weitere Eigenschaften/Attribute vergleichen; kein Auftrag für diese weiteren Käufe.

### Übernommener vollständiger Fachstand; obige Änderungen haben Vorrang

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 025 · GELÖST — Achsendiagramm von oben nach unten

Ergebnis: Nutzer wünscht ausdrücklich eine Leserichtung von oben nach unten. Diagramm als vertikale Folge der vier Themengruppen mit untereinander angeordneten Achsen dargestellt. SP-Markierungen und fachlicher Stand unverändert; Gruppierung ist keine starre Eingabereihenfolge. Gespeicherte Fassung in Achsen-Diagramm.md angepasst. Nur Dokumentation, keine Laufzeitänderung oder App-Tests; kein Commit oder Push. Weiterhin nächster Vorschlag: Pflichtminima, Vertiefungen und offene Zielwerte pro SP-Achse ordnen, beginnend mit CK-Eigenschaftszielen und Schulgewichtung. Vollständiger weiterhin geltender Stand folgt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 024 · GELÖST — Diagramm aller NPC-Erstellungsachsen

Ergebnis: [Achsendiagramm](Achsen-Diagramm.md) erstellt. Alle Auswahlbereiche des Templates und der weiteren Achsen gruppiert, direkte SP-Käufe, mittelbare SP-Wirkung, Kosten/Gutschriften und offene Weihe-Kosten unterschieden. Schlaf ausdrücklich 0 SP; Geld und TaP separat. Berechnungsfolge mit Speziessockel, gewichteter Schulwahl, CK-Zielen, Basiskosten und anschließendem Repertoire erhalten. Gegen aktuelle Planungsunterlagen abgeglichen; nur Dokumentation, keine Generatoränderung oder Laufzeittests. Keine neuen Regelentscheidungen, kein Commit oder Push in diesem Schritt. Nächster Vorschlag: Pflichtminima, Vertiefungen und offene Zielwerte pro SP-Achse ordnen. Der vollständige weiterhin geltende Stand folgt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Aktuell Achsendiagramm als Orientierung erstellt; keine neuen Ausbildungsregeln bestätigt. Fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 023 · GELÖST — NPC-Magieplanung für Commit gesichert

Ergebnis dieses Schritts: Nutzer beauftragt lokalen Commit des aktuellen NPC-Planungsstands. Umfang: Spruchmagieausbildung, Eigenschaften und Attribute, Weitere Achsen und dieses Übergabeprotokoll. Dokumentationsprüfung ohne Whitespacefehler; keine Laufzeitänderungen oder App-Tests. Dieser Übergabestand wird im selben Commit gesichert; tatsächlichen Commit-Hash im Git-Protokoll prüfen. Kein Push beauftragt. Andere lokale Regel-, Excel-, Ausrüstungs- und Exportänderungen bleiben außerhalb. Weitere fachliche Ausarbeitung zurückgestellt. Weiter geltend: Auswahlrichtung korrigiert: Bereits hohe speziesbedingte Eigenschaften begünstigen passende zufällige Schulen; anschließend CK-Eigenschaftsziele ergänzen. INT und WIL als allgemeine Magierschwerpunkte bestätigt. Goblins geprüft: Schnelligkeitssockel 16/Bonus +3 passt zu Luftbeschwörung; keine Zufallswahrscheinlichkeiten erfunden. Dokumentation aktualisiert, keine Generatoränderung. Weiter geltend: Alle 330 Sprüche in zwölf Schulen geprüft; keine fehlenden Boni und keine Abweichung bei Referenz/Schule/Bonus zwischen JSONL und Laufzeitkatalog. Neben fünf Beschwörungsschulen nur Hellsicht eindeutig (Sinnesschärfe 11/11). Heilung KON 28/32, Antimagie WIL 35/53, Beherrschung AUS 18/28, Illusion SIN 15/23 jeweils mit Ausnahmen; Veränderung sieben und Verzauberung zehn unterschiedliche Eigenschaften. Vollständige Verteilung und Ausnahmen in Eigenschaften und Attribute. Keine automatische Zuordnung aus Häufigkeiten beschlossen. Nur Dokumentation. Weiter geltend: Planungsreihenfolge korrigiert: CK (nur NPC-Kategorie) mit passenden Schwerpunkt-Eigenschaften und Zielhöhen vor der Restverteilung finanzieren, dann übrige Basiskosten und Rest-SP bestimmen, erst daraus Spruchanzahl ableiten. Zielhöhen noch offen, keine belastbare Restbudgetzahl behauptet. Bei Kampfmagiern leitet sich ein Schwerpunkt aus dem Eigenschaftsbonus der ersten gewählten Schule ab. Geprüfte Zuordnung: Magiebeschwörung/Ausstrahlung, Feuerbeschwörung/Mut, Wasserbeschwörung/Athletik, Erdbeschwörung/Stärke, Luftbeschwörung/Schnelligkeit. Alle betroffenen Katalogeinträge geprüft. Nur Dokumentation aktualisiert. Weiter geltend: Fünfte Schule für Kampfmagier ab Kreis 4 zufällig aus allen übrigen Schulen bestätigt. Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, etwa drei insgesamt; keine eigene Kampfmagie-Obergrenze für Kampfmagier. Unterschiedliche Schulen und Gesamtzahl gelten weiter. Dokumentation abgeglichen, Generator unverändert. Weiter geltend: Höhere Schulvorauswahl dokumentiert. Kampfmagier erhalten eine weitere unterschiedliche Kampfmagieschule, gemäß bestehender Kreisfolge als vierte Schule auf Kreis 3. Andere Spruchmagier erhalten zwei weitere unterschiedliche Zufallsschulen, eine auf Kreis 3 und eine ab Kreis 4, mit höchstens einer Kampfmagieschule insgesamt. Fünfte Schule für Kampfmagier wird zufällig ohne Einschränkung der Schulart gezogen. Nur Dokumentation; Staffelung gegen Gesamtzahl 3/4/5 geprüft. Weiter geltend: Kampfmagieschulen abschließend als Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung festgelegt; alle fünf Namen im aktuellen Spruchmagiekatalog gefunden. Antimagie zählt separat. Fachplanung und Achsenübersicht aktualisiert; nur Dokumentation. Weiterhin bestätigt: Höchstens eine Kampfmagieschule unter den drei zufälligen Schulen nicht als Kampfmagier eingeordneter Spruchmagier bestätigt und in Fachplanung sowie Achsenübersicht ergänzt. Null Kampfmagieschulen ist ebenfalls zulässig. Auch einschließlich zusätzlicher Schulplätze gilt für andere Spruchmagier höchstens eine Kampfmagieschule insgesamt. Dokumentationsabgleich erfolgt; keine Generatoränderung oder Laufzeittests. Weiter geltender Stand: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Lokaler Commit ist jetzt beauftragt; kein Push.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 022 · GELÖST — Speziesstärken gewichten Schulwahl; INT und WIL für Magier

Ergebnis dieses Schritts: Auswahlrichtung korrigiert: Bereits hohe speziesbedingte Eigenschaften begünstigen passende zufällige Schulen; anschließend CK-Eigenschaftsziele ergänzen. INT und WIL als allgemeine Magierschwerpunkte bestätigt. Goblins geprüft: Schnelligkeitssockel 16/Bonus +3 passt zu Luftbeschwörung; keine Zufallswahrscheinlichkeiten erfunden. Dokumentation aktualisiert, keine Generatoränderung. Weiter geltend: Alle 330 Sprüche in zwölf Schulen geprüft; keine fehlenden Boni und keine Abweichung bei Referenz/Schule/Bonus zwischen JSONL und Laufzeitkatalog. Neben fünf Beschwörungsschulen nur Hellsicht eindeutig (Sinnesschärfe 11/11). Heilung KON 28/32, Antimagie WIL 35/53, Beherrschung AUS 18/28, Illusion SIN 15/23 jeweils mit Ausnahmen; Veränderung sieben und Verzauberung zehn unterschiedliche Eigenschaften. Vollständige Verteilung und Ausnahmen in Eigenschaften und Attribute. Keine automatische Zuordnung aus Häufigkeiten beschlossen. Nur Dokumentation. Weiter geltend: Planungsreihenfolge korrigiert: CK (nur NPC-Kategorie) mit passenden Schwerpunkt-Eigenschaften und Zielhöhen vor der Restverteilung finanzieren, dann übrige Basiskosten und Rest-SP bestimmen, erst daraus Spruchanzahl ableiten. Zielhöhen noch offen, keine belastbare Restbudgetzahl behauptet. Bei Kampfmagiern leitet sich ein Schwerpunkt aus dem Eigenschaftsbonus der ersten gewählten Schule ab. Geprüfte Zuordnung: Magiebeschwörung/Ausstrahlung, Feuerbeschwörung/Mut, Wasserbeschwörung/Athletik, Erdbeschwörung/Stärke, Luftbeschwörung/Schnelligkeit. Alle betroffenen Katalogeinträge geprüft. Nur Dokumentation aktualisiert. Weiter geltend: Fünfte Schule für Kampfmagier ab Kreis 4 zufällig aus allen übrigen Schulen bestätigt. Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, etwa drei insgesamt; keine eigene Kampfmagie-Obergrenze für Kampfmagier. Unterschiedliche Schulen und Gesamtzahl gelten weiter. Dokumentation abgeglichen, Generator unverändert. Weiter geltend: Höhere Schulvorauswahl dokumentiert. Kampfmagier erhalten eine weitere unterschiedliche Kampfmagieschule, gemäß bestehender Kreisfolge als vierte Schule auf Kreis 3. Andere Spruchmagier erhalten zwei weitere unterschiedliche Zufallsschulen, eine auf Kreis 3 und eine ab Kreis 4, mit höchstens einer Kampfmagieschule insgesamt. Fünfte Schule für Kampfmagier wird zufällig ohne Einschränkung der Schulart gezogen. Nur Dokumentation; Staffelung gegen Gesamtzahl 3/4/5 geprüft. Weiter geltend: Kampfmagieschulen abschließend als Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung festgelegt; alle fünf Namen im aktuellen Spruchmagiekatalog gefunden. Antimagie zählt separat. Fachplanung und Achsenübersicht aktualisiert; nur Dokumentation. Weiterhin bestätigt: Höchstens eine Kampfmagieschule unter den drei zufälligen Schulen nicht als Kampfmagier eingeordneter Spruchmagier bestätigt und in Fachplanung sowie Achsenübersicht ergänzt. Null Kampfmagieschulen ist ebenfalls zulässig. Auch einschließlich zusätzlicher Schulplätze gilt für andere Spruchmagier höchstens eine Kampfmagieschule insgesamt. Dokumentationsabgleich erfolgt; keine Generatoränderung oder Laufzeittests. Weiter geltender Stand: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neueste Auswahlrichtung: Spezies-Eigenschaftssockel → dadurch gewichtete Schulwahl unter bestehenden Pflicht-/Obergrenzen → CK-Eigenschaften einschließlich allgemeiner Magierschwerpunkte INT/WIL und schulabhängigem Schwerpunkt auf Zielhöhen ergänzen → Basiskosten/Rest-SP → Spruchrepertoire. Gewichtungsformel und Stärke der Tendenz, Behandlung gemischter Schulen sowie Zielhöhen offen. Keine feste Schule je Volk, keine neue Antimagiepflicht für andere Spruchmagier. Erste Schule bleibt beim Kampfmagier für einen Schwerpunkt maßgeblich, ihre Auswahl wird jetzt durch vorhandene Stärken begünstigt. Auswahl erhalten, keine zirkulären Neuziehungen nach Eigenschaftskäufen. Goblins SCH 16 (+3), ATH 12, AUS 11, STÄ 7, MUT 5 am regulären Sockel geprüft. Vollständiger neuer Abschnitt in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Gewichtung der Schulwahl aus bereits vorhandenen Spezies-Eigenschaftsboni für eindeutige und gemischte Schulen ausarbeiten und an mehreren Spezies vergleichen. Danach INT-/WIL- und weitere CK-Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 021 · GELÖST — Eigenschaftsboni aller Spruchmagieschulen geprüft

Ergebnis dieses Schritts: Alle 330 Sprüche in zwölf Schulen geprüft; keine fehlenden Boni und keine Abweichung bei Referenz/Schule/Bonus zwischen JSONL und Laufzeitkatalog. Neben fünf Beschwörungsschulen nur Hellsicht eindeutig (Sinnesschärfe 11/11). Heilung KON 28/32, Antimagie WIL 35/53, Beherrschung AUS 18/28, Illusion SIN 15/23 jeweils mit Ausnahmen; Veränderung sieben und Verzauberung zehn unterschiedliche Eigenschaften. Vollständige Verteilung und Ausnahmen in Eigenschaften und Attribute. Keine automatische Zuordnung aus Häufigkeiten beschlossen. Nur Dokumentation. Weiter geltend: Planungsreihenfolge korrigiert: CK (nur NPC-Kategorie) mit passenden Schwerpunkt-Eigenschaften und Zielhöhen vor der Restverteilung finanzieren, dann übrige Basiskosten und Rest-SP bestimmen, erst daraus Spruchanzahl ableiten. Zielhöhen noch offen, keine belastbare Restbudgetzahl behauptet. Bei Kampfmagiern leitet sich ein Schwerpunkt aus dem Eigenschaftsbonus der ersten gewählten Schule ab. Geprüfte Zuordnung: Magiebeschwörung/Ausstrahlung, Feuerbeschwörung/Mut, Wasserbeschwörung/Athletik, Erdbeschwörung/Stärke, Luftbeschwörung/Schnelligkeit. Alle betroffenen Katalogeinträge geprüft. Nur Dokumentation aktualisiert. Weiter geltend: Fünfte Schule für Kampfmagier ab Kreis 4 zufällig aus allen übrigen Schulen bestätigt. Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, etwa drei insgesamt; keine eigene Kampfmagie-Obergrenze für Kampfmagier. Unterschiedliche Schulen und Gesamtzahl gelten weiter. Dokumentation abgeglichen, Generator unverändert. Weiter geltend: Höhere Schulvorauswahl dokumentiert. Kampfmagier erhalten eine weitere unterschiedliche Kampfmagieschule, gemäß bestehender Kreisfolge als vierte Schule auf Kreis 3. Andere Spruchmagier erhalten zwei weitere unterschiedliche Zufallsschulen, eine auf Kreis 3 und eine ab Kreis 4, mit höchstens einer Kampfmagieschule insgesamt. Fünfte Schule für Kampfmagier wird zufällig ohne Einschränkung der Schulart gezogen. Nur Dokumentation; Staffelung gegen Gesamtzahl 3/4/5 geprüft. Weiter geltend: Kampfmagieschulen abschließend als Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung festgelegt; alle fünf Namen im aktuellen Spruchmagiekatalog gefunden. Antimagie zählt separat. Fachplanung und Achsenübersicht aktualisiert; nur Dokumentation. Weiterhin bestätigt: Höchstens eine Kampfmagieschule unter den drei zufälligen Schulen nicht als Kampfmagier eingeordneter Spruchmagier bestätigt und in Fachplanung sowie Achsenübersicht ergänzt. Null Kampfmagieschulen ist ebenfalls zulässig. Auch einschließlich zusätzlicher Schulplätze gilt für andere Spruchmagier höchstens eine Kampfmagieschule insgesamt. Dokumentationsabgleich erfolgt; keine Generatoränderung oder Laufzeittests. Weiter geltender Stand: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Vollständige Schulprüfung in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): sechs eindeutige Schulen (fünf Beschwörungsschulen je 22/22, Hellsicht SIN 11/11). Gemischte Schulen: Heilung KON 28/32, WIL 2, SIN 1, ATH 1; Antimagie WIL 35/53, SIN 16, INT 2; Beherrschung AUS 18/28, MUT 4, WIL 4, INT 2; Illusion SIN 15/23, AUS 6, INT 1, SCH 1. Veränderung sieben Eigenschaften ohne Mehrheit, Verzauberung alle zehn. Häufigkeiten zählen Katalogeinträge einschließlich Varianten, sind keine NPC-Auswahlgewichte. Schwerpunktableitung für gemischte Schulen bleibt offen; keine neue Pflichtzuordnung.

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Schwerpunktableitung für gemischte Schulen festlegen (typischer Hauptbonus oder vorgesehene Kernzauber), danach CK-Matrix und Eigenschaftszielhöhen je Kreis ausarbeiten. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 020 · GELÖST — CK-Eigenschaften vor Restbudget und Spruchrepertoire

Ergebnis dieses Schritts: Planungsreihenfolge korrigiert: CK (nur NPC-Kategorie) mit passenden Schwerpunkt-Eigenschaften und Zielhöhen vor der Restverteilung finanzieren, dann übrige Basiskosten und Rest-SP bestimmen, erst daraus Spruchanzahl ableiten. Zielhöhen noch offen, keine belastbare Restbudgetzahl behauptet. Bei Kampfmagiern leitet sich ein Schwerpunkt aus dem Eigenschaftsbonus der ersten gewählten Schule ab. Geprüfte Zuordnung: Magiebeschwörung/Ausstrahlung, Feuerbeschwörung/Mut, Wasserbeschwörung/Athletik, Erdbeschwörung/Stärke, Luftbeschwörung/Schnelligkeit. Alle betroffenen Katalogeinträge geprüft. Nur Dokumentation aktualisiert. Weiter geltend: Fünfte Schule für Kampfmagier ab Kreis 4 zufällig aus allen übrigen Schulen bestätigt. Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, etwa drei insgesamt; keine eigene Kampfmagie-Obergrenze für Kampfmagier. Unterschiedliche Schulen und Gesamtzahl gelten weiter. Dokumentation abgeglichen, Generator unverändert. Weiter geltend: Höhere Schulvorauswahl dokumentiert. Kampfmagier erhalten eine weitere unterschiedliche Kampfmagieschule, gemäß bestehender Kreisfolge als vierte Schule auf Kreis 3. Andere Spruchmagier erhalten zwei weitere unterschiedliche Zufallsschulen, eine auf Kreis 3 und eine ab Kreis 4, mit höchstens einer Kampfmagieschule insgesamt. Fünfte Schule für Kampfmagier wird zufällig ohne Einschränkung der Schulart gezogen. Nur Dokumentation; Staffelung gegen Gesamtzahl 3/4/5 geprüft. Weiter geltend: Kampfmagieschulen abschließend als Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung festgelegt; alle fünf Namen im aktuellen Spruchmagiekatalog gefunden. Antimagie zählt separat. Fachplanung und Achsenübersicht aktualisiert; nur Dokumentation. Weiterhin bestätigt: Höchstens eine Kampfmagieschule unter den drei zufälligen Schulen nicht als Kampfmagier eingeordneter Spruchmagier bestätigt und in Fachplanung sowie Achsenübersicht ergänzt. Null Kampfmagieschulen ist ebenfalls zulässig. Auch einschließlich zusätzlicher Schulplätze gilt für andere Spruchmagier höchstens eine Kampfmagieschule insgesamt. Dokumentationsabgleich erfolgt; keine Generatoränderung oder Laufzeittests. Weiter geltender Stand: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- CK-Eigenschaftsziele gehören zu den Basisausgaben vor dem Spruchrepertoire. Vorhandene Prioritätenmatrix ist Entwurf; konkrete Zielhöhen je Volk/Kreis und vollständige CK-Zuordnung offen. Erste Schulwahl vor Eigenschaftsverteilung festhalten; beim Kampfmagier daraus Eigenschaftsschwerpunkt ableiten (Magie/Ausstrahlung, Feuer/Mut, Wasser/Athletik, Erde/Stärke, Luft/Schnelligkeit). Geordnete Auswahl erhalten; erste Schule nicht automatisch mit Schwerpunktschule gleichsetzen. Rest-SP = Gesamt-SP minus tatsächliche Basisausgaben inklusive CK-Steigerungen; keine doppelten Kosten, TaP/Geld separat. WHK-/Attributminima zählen über echte Käufe. Positive reale Eigenschaftsboni separat ausweisen; Referenzziele 20/15/10 bei Bonus 0 bleiben. Vollständiger Ablauf in [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md).

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** CK-Matrix und Eigenschaftszielhöhen je Kreis ausarbeiten, beginnend beim Kampfmagier mit schulabhängigem Schwerpunkt. Danach Basiskosten und Rest-SP je Volk/Kreis berechnen, erst anschließend Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ableiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 019 · GELÖST — Freie Zufallsschulen für Kampfmagier bestätigt

Ergebnis dieses Schritts: Fünfte Schule für Kampfmagier ab Kreis 4 zufällig aus allen übrigen Schulen bestätigt. Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, etwa drei insgesamt; keine eigene Kampfmagie-Obergrenze für Kampfmagier. Unterschiedliche Schulen und Gesamtzahl gelten weiter. Dokumentation abgeglichen, Generator unverändert. Weiter geltend: Höhere Schulvorauswahl dokumentiert. Kampfmagier erhalten eine weitere unterschiedliche Kampfmagieschule, gemäß bestehender Kreisfolge als vierte Schule auf Kreis 3. Andere Spruchmagier erhalten zwei weitere unterschiedliche Zufallsschulen, eine auf Kreis 3 und eine ab Kreis 4, mit höchstens einer Kampfmagieschule insgesamt. Fünfte Schule für Kampfmagier wird zufällig ohne Einschränkung der Schulart gezogen. Nur Dokumentation; Staffelung gegen Gesamtzahl 3/4/5 geprüft. Weiter geltend: Kampfmagieschulen abschließend als Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung festgelegt; alle fünf Namen im aktuellen Spruchmagiekatalog gefunden. Antimagie zählt separat. Fachplanung und Achsenübersicht aktualisiert; nur Dokumentation. Weiterhin bestätigt: Höchstens eine Kampfmagieschule unter den drei zufälligen Schulen nicht als Kampfmagier eingeordneter Spruchmagier bestätigt und in Fachplanung sowie Achsenübersicht ergänzt. Null Kampfmagieschulen ist ebenfalls zulässig. Auch einschließlich zusätzlicher Schulplätze gilt für andere Spruchmagier höchstens eine Kampfmagieschule insgesamt. Dokumentationsabgleich erfolgt; keine Generatoränderung oder Laufzeittests. Weiter geltender Stand: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 wird zufällig aus allen übrigen Schulen gezogen; ihre Zufallsplätze dürfen weitere Kampfmagieschulen ergeben, ohne eigene Kampfmagie-Obergrenze. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Die Auswahl des Schwerpunkts bleibt offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Für Spruchmagie je Kreis Spruchanzahl je Schule/Grad und Schwerpunkt-/Nebenschulverteilung ausarbeiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 018 · GELÖST — Zusätzliche Schulen und globale Kampfmagiegrenze

Ergebnis dieses Schritts: Höhere Schulvorauswahl dokumentiert. Kampfmagier erhalten eine weitere unterschiedliche Kampfmagieschule, gemäß bestehender Kreisfolge als vierte Schule auf Kreis 3. Andere Spruchmagier erhalten zwei weitere unterschiedliche Zufallsschulen, eine auf Kreis 3 und eine ab Kreis 4, mit höchstens einer Kampfmagieschule insgesamt. Fünfte Schule für Kampfmagier bleibt offen. Nur Dokumentation; Staffelung gegen Gesamtzahl 3/4/5 geprüft. Weiter geltend: Kampfmagieschulen abschließend als Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung festgelegt; alle fünf Namen im aktuellen Spruchmagiekatalog gefunden. Antimagie zählt separat. Fachplanung und Achsenübersicht aktualisiert; nur Dokumentation. Weiterhin bestätigt: Höchstens eine Kampfmagieschule unter den drei zufälligen Schulen nicht als Kampfmagier eingeordneter Spruchmagier bestätigt und in Fachplanung sowie Achsenübersicht ergänzt. Null Kampfmagieschulen ist ebenfalls zulässig. Auch einschließlich zusätzlicher Schulplätze gilt für andere Spruchmagier höchstens eine Kampfmagieschule insgesamt. Dokumentationsabgleich erfolgt; keine Generatoränderung oder Laufzeittests. Weiter geltender Stand: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze gilt für alle gewählten Schulen gemeinsam. Andere Spruchmagier ergänzen je eine Zufallsschule auf Kreis 3 und ab Kreis 4. Kampfmagier ergänzen eine weitere unterschiedliche Kampfmagieschule auf Kreis 3; deren fünfte Schule ab Kreis 4 bleibt offen. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Fünfte Schule für Kampfmagier und Auswahl des Schwerpunkts bleiben offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Die fünfte Schule für Kampfmagier ab Kreis 4 festlegen; Vorschlag: zufällig aus den noch nicht gewählten Schulen. Danach für Spruchmagie je Kreis Spruchanzahl und Schwerpunkt-/Nebenschulverteilung ausarbeiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 017 · GELÖST — Fünf Beschwörungsschulen als Kampfmagieschulen definiert

Ergebnis dieses Schritts: Kampfmagieschulen abschließend als Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung festgelegt; alle fünf Namen im aktuellen Spruchmagiekatalog gefunden. Antimagie zählt separat. Fachplanung und Achsenübersicht aktualisiert; nur Dokumentation. Weiterhin bestätigt: Höchstens eine Kampfmagieschule unter den drei zufälligen Schulen nicht als Kampfmagier eingeordneter Spruchmagier bestätigt und in Fachplanung sowie Achsenübersicht ergänzt. Null Kampfmagieschulen ist ebenfalls zulässig. Grenze für zusätzliche Schulplätze ab Kreis 3 bleibt offen. Dokumentationsabgleich erfolgt; keine Generatoränderung oder Laufzeittests. Weiter geltender Stand: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze bezieht sich auf die drei Zufallsschulen; zusätzliche Plätze ab Kreis 3 bleiben zu definieren. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Kampfmagieschulen sind genau Magiebeschwörung, Feuerbeschwörung, Wasserbeschwörung, Erdbeschwörung und Luftbeschwörung. Antimagie zählt separat. Zusätzliche Vorauswahl ab Kreis 3, dort geltende Kampfmagie-Obergrenze für andere Spruchmagier und Auswahl des Schwerpunkts bleiben offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Vorauswahl zusätzlicher Schulplätze ab Kreis 3 einschließlich der Kampfmagie-Obergrenze für andere Spruchmagier festlegen. Danach für Spruchmagie je Kreis Spruchanzahl und Schwerpunkt-/Nebenschulverteilung ausarbeiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 016 · GELÖST — Höchstens eine Kampfmagieschule unter drei Zufallsschulen

Ergebnis dieses Schritts: Höchstens eine Kampfmagieschule unter den drei zufälligen Schulen nicht als Kampfmagier eingeordneter Spruchmagier bestätigt und in Fachplanung sowie Achsenübersicht ergänzt. Null Kampfmagieschulen ist ebenfalls zulässig. Grenze für zusätzliche Schulplätze ab Kreis 3 bleibt offen. Dokumentationsabgleich erfolgt; keine Generatoränderung oder Laufzeittests. Weiter geltender Stand: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen, darunter höchstens eine Kampfmagieschule (null oder eine). Diese Obergrenze bezieht sich auf die drei Zufallsschulen; zusätzliche Plätze ab Kreis 3 bleiben zu definieren. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Auswahlpool Kampfmagieschulen, zusätzliche Vorauswahl ab Kreis 3 und Auswahl des Schwerpunkts bleiben offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Kampfmagieschulen-Pool und Vorauswahl zusätzlicher Schulplätze ab Kreis 3 festlegen. Danach für Spruchmagie je Kreis Spruchanzahl und Schwerpunkt-/Nebenschulverteilung ausarbeiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 015 · GELÖST — Schulvorauswahl für Kampfmagier und andere Spruchmagier

Ergebnis: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neue bestätigte Schulvorauswahl bei Spruchmagie: Kampfmagier mindestens eine Kampfmagieschule plus Antimagie plus eine weitere zufällige, unterschiedliche Schule; andere Spruchmagier drei unterschiedliche Schulen zufällig vorausfüllen. Zufallsauswahl bei Neuberechnung erhalten. Gesamtzahl weiter Kreis 0–2 drei, Kreis 3 vier, ab Kreis 4 fünf; Kreis+ unverändert; eine Schwerpunktschule. Auswahlpool Kampfmagieschulen, zusätzliche Vorauswahl ab Kreis 3 und Auswahl des Schwerpunkts bleiben offen. Details in [Spruchmagieausbildung](Spruchmagieausbildung.md). Nur Dokumentation, keine Generatorumsetzung; gegen vorhandene Schulenzahl im Template und Planungsstand abgeglichen.

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Kampfmagieschulen-Pool und Vorauswahl zusätzlicher Schulplätze ab Kreis 3 festlegen. Danach für Spruchmagie je Kreis Spruchanzahl und Schwerpunkt-/Nebenschulverteilung ausarbeiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 014 · GELÖST — Spruchmagie-Probenziele 20/15/10 und Maximumregel

Ergebnis: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Probenziele Stufe 1/2/3 ungefähr 20/15/10 bei Eigenschaftsbonus 0; höchster erforderlicher TaW aus Zielprobe − Magie + jeweiliger Stufenerschwerung über vorhandene und freigeschaltete Stufen entscheidet, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Zielstaffel und Maximumregel sind bestätigt. Spruchanzahl und konkrete Finanzierung bleiben offen. Rechenbeispiel Magie 4, angenommene Erschwerungen 0/8/16 geprüft: TaW-Anforderungen 16/19/22, Maximum 22, Proben 26/18/10. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Für Spruchmagie je Kreis Spruchanzahl und Schwerpunkt-/Nebenschulverteilung ausarbeiten; bestätigte Probenziele 20/15/10 mit Maximum des erforderlichen TaW anwenden. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 013 · GELÖST — Spruchmagie nach Kreis und Probenziel festgehalten

Ergebnis: [Spruchmagieausbildung](Spruchmagieausbildung.md) dokumentiert. Bestätigt: kreisabhängiges Repertoire und Kosten, Ziel Probe ungefähr 20 bei Eigenschaftsbonus 0, feste 14 TaP für Zaubern Stufe 2/3 (je 7 geprüft). Probe = TaW + Magie − Stufenerschwerung bei Bonus 0; kein pauschales TaW-20-Ziel. Reguläre Gradgrenze Kreis+1, ein Hauszauberplatz durch 14 TaP für Grad Kreis+2, nur vorhandene Katalogsprüche. Aura/Magie, Mindestintelligenz und Vorgrad-TaW 10 mitprüfen. Ziel-Zauberstufe, Spruchanzahl und konkrete Finanzierung bleiben offen. Nur Dokumentation geändert, keine Laufzeittests. Kein Commit-/Push-Auftrag für diesen Schritt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Vorheriger Tagesabschluss bleibt historischer Stand. Aktuell Spruchmagieplanung gemäß neuem Auftrag; fremde lokale Änderungen erhalten. Vollständige Rollenbudgetprüfung weiterhin zurückgestellt.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Für Spruchmagie die Ziel-Zauberstufe für Probe ungefähr 20 festlegen; danach je Kreis Spruchanzahl und Schwerpunkt-/Nebenschulverteilung ausarbeiten. KI und PSI anschließend konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 012 · GELÖST — Tagesabschluss und Übergabe für die Fortsetzung

Ergebnis dieses Schritts: Tagesabschluss im Nutzerauftrag. NPC-Planung einschließlich WHK, weiterer Achsen, gemittelter Kampfziele und Budgetgrundlage zusammengeführt. Dieser Stand wird mit AGENTS.md, NPC-Fachunterlagen, Budgetdaten und zugehörigem Berechnungsskript committed und nach origin/main gepusht; der tatsächliche Git-Stand ist im Repository zu prüfen. Andere lokale Regel-/Excel-/Exportänderungen gehören nicht zu diesem Planungscommit und bleiben erhalten. Heute keine weitere fachliche Ausarbeitung.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Tagesabschluss: Nutzer hat Commit und Push der aktuellen Arbeit beauftragt. Nächste Sitzung am hier dokumentierten Stand beginnen; keine vollständige Rollenbudgetprüfung vorziehen. Ausstehende lokale Änderungen außerhalb der NPC-Planung nicht pauschal übernehmen oder zurücksetzen.

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Abschlussprüfung bestanden: Budget-Neuberechnung für elf Völker/33 Datensätze reproduzierbar; verlinkte lokale Fachunterlagen vorhanden. Die Unbewaffnet-Regel steht vor den automatisch erzeugten Einzelwerttabellen, damit erneute Budgetberechnung sie erhält. Keine Laufzeitänderung am Generator; volle App-Tests sind für diesen Planungsstand nicht erfolgt.

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Magische Ausbildungsachse je KI, Spruchmagie und PSI mit Kernfähigkeiten, Fertigkeitszielen und Voraussetzungen konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 011 · GELÖST — Kampfausbildung auf gleiche gemittelte H/S-Werte korrigiert

Ergebnis dieses Schritts: Nutzerkorrektur Spezialisierung = Hauptfertigkeit, bisherige Werte mitteln. [Kampfausbildung](Kampfausbildung.md) auf 5/5 (4,5 aufgerundet), 9/9 und 15/15 korrigiert, Kosten und Proben neu berechnet. Ausgewählte Kampfspezialisierungen werden nach Zusammenführung auf den endgültigen H-Wert nachgezogen; keine ungewählten Spezialisierungen hinzufügen. Diese Rundungs-/Zusammenführungsdetails sind ausdrücklich dokumentierte Auslegung. SF-/Lade-/Pädagoge-Werte bleiben unbestätigter Entwurf. Nur Dokumentation geändert.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H5/S5, Dienst H9/S9, Spezialist H15/S15; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. H/S-Gleichsetzung und Mittelung sind Nutzerauftrag, übrige Zusatzwerte bleiben Entwurf. Bei Zusammenführung und höherem Unbewaffnet-Sockel ausgewählte S auf endgültiges H nachziehen; keine ungewählten S hinzufügen.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Mittelwerte und Kosten neu geprüft: reine NK-H/S-Paare 200/360/600 SP, FK 140/252/420 SP. Dienst und Spezialist sparen jeweils 30 NK-/24 FK-SP gegenüber der vorherigen Verteilung; gerundeter Selbstschutz kostet 5/2 SP mehr. Gemeinsames Feuerwaffenprofil mit Pistolen/Musketen je 15 kostet 495 SP. FK-Basis bleibt bei Dienst/Spezialist gleich, Nahkampf-Basis und Pool verschieben sich; keine identischen Nahkampfproben behaupten.

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 245/450/735/773 SP, FK mit einer Lade-SF 203/378/627/665 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 608 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Magische Ausbildungsachse je KI, Spruchmagie und PSI mit Kernfähigkeiten, Fertigkeitszielen und Voraussetzungen konkretisieren. Weitere Kampfzusätze, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 010 · GELÖST — Kampfausbildung mit konkreten Fertigkeitszielen ausgearbeitet

Ergebnis dieses Schritts: [Kampfausbildung](Kampfausbildung.md) mit Hauptfertigkeits-/Spezialisierungszielen 6/3, 12/6 und 18/12 sowie Ausbilder-Pädagoge 8 konkretisiert. SF-/Lade-/Schildziele, Waffenzuordnung, Kreis-/Überschneidungsregeln, Kosten und Basisproben dokumentiert. Neue Zahlen sind unbestätigter Entwurf. Nur Dokumentation geändert, keine Generator-/Charakteränderung. Vollständige Rollenbudgetprüfung bleibt zurückgestellt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Neuer [Kampfentwurf](Kampfausbildung.md): Selbstschutz H6/S3, Dienst H12/S6, Spezialist H18/S12; Ausbilder gleiches Kampfprofil plus Pädagoge 8. Ausweichen 3/6/9, Selbstbeherrschung 2/4/6, passende Lade-SF 2/4/8. Alle Ziele per Maximum zusammenführen; Unbewaffnet zusätzlich mindestens 3 × Kreis. Schild optional mit eigener Spezialisierung und Elternwert. Feuerwaffen/Armbrüste/Bögen korrekt getrennt. Neue Ziele und Zusatzregeln bleiben unbestätigt.

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Kampfentwurf: Referenzen/Eltern, 25/18-SP-Hauptfertigkeitskosten, NK-Spezialisierungssätze 15/8/4, FK 10/5/3, SF 9 SP/Punkt und reguläre Maxima geprüft. Einzelprofile NK 240/480/765/803 SP, FK mit einer Lade-SF 201/402/651/689 SP ab 0; Kombination Speer-Dienst + Musketen-Selbstschutz 636 SP ohne übrige Pflichten. Basisproben separat nachgerechnet, keine vollständige Talentketten-/Rollenprüfung.

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; Numerische Kampfziele liegen jetzt im Kampfentwurf vor; Bestätigung, magische Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Magische Ausbildungsachse je KI, Spruchmagie und PSI mit Kernfähigkeiten, Fertigkeitszielen und Voraussetzungen konkretisieren. Neue Kampf-, WHK-, GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen. Vollständige Bauern-/Wachen-Budgetprüfung weiterhin zurückgestellt.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Kampfausbildung](Kampfausbildung.md): vollständiger Zahlenentwurf, Referenzen, Zusammenführung, Kosten und Prüfgrenzen.
- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 009 · GELÖST — Weitere Ausbildungs- und Ausrüstungsachsen definiert

Ergebnis dieses Schritts: Nutzer möchte zunächst weitere Achsen definieren. [Auswahlentwurf](Weitere-Achsen.md) für Kampfausbildung, Kampfweise/Einsatz, magische und geweihte Aufgaben, Schriftgebrauch und Ausrüstungszugang erstellt. Neue Optionen sind Vorschläge; nur Dokumentation geändert. Vollständige Bauern-/Wachen-Budgetprüfung auf Nutzerwunsch zurückgestellt.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

- Aktuelle Arbeitsreihenfolge: weitere Achsen konkretisieren, noch keine vollständige Rollenbudgetprüfung. [Weitere Achsen](Weitere-Achsen.md) enthält alle neuen Optionen und offenen Zahlenziele. Kampf getrennt nach Waffenbereichen, Magieform und Aufgaben getrennt, Weihe unabhängig, Schriftbedarf aufgabengebunden, Ausrüstungsbesitz ohne Zusatzbudget. Neue Auswahlen bleiben unbestätigter Entwurf.

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Neue Achsen gegen Template, gesicherten Planungsstand und Eigenschafts-/Attributkonzept abgeglichen. Keine vollständige Prüfung der Kampf-/Magiekataloge; numerische Ausbildungsziele, Fähigkeitenauswahl und Finanzierung stehen aus. Ausrüstung aus Dienstbestand bleibt budgetpflichtig; Spruchmagie-Schulenzahl und SSK-Mindestwerte bleiben erhalten.

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Kampfausbildung je Waffenbereich mit Mindestwerten für Selbstschutz, Dienstausbildung, Spezialist und Ausbilder konkretisieren. Danach KI-/Spruchmagie-/PSI-Aufgaben auf Fähigkeiten und Voraussetzungen abbilden. Neue WHK-/GF/SF-Werte und Achsenoptionen bleiben zur Bestätigung offen; vollständige Bauern-/Wachen-Budgetprüfung später wieder aufnehmen.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Weitere Achsen](Weitere-Achsen.md): vollständiger neuer Auswahlentwurf und aktuelle Fortsetzungsreihenfolge.
- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-13 · 008 · GELÖST — Unbewaffnet mit 3 Punkten pro Kreis festgehalten

Ergebnis dieses Schritts: Nutzerentscheidung Unbewaffnet mit 3 Punkten pro Kreis in Planungsstand, Template, Budgetgrundlage und Folgeaufgaben übernommen. Wörtlich als Mindestziel 3 × Kreis ausgelegt, ohne zusätzlichen Startwert (Kreis 0: 0). Nur Dokumentation geändert, keine Generator- oder Charakteränderungen.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet (`nk_unbewaffnet`) als Mindestziel 3 × Kreis mitziehen: Kreis 0/1/2/3/4/5/6/7 → 0/3/6/9/12/15/18/21. Kreis+ verwendet denselben Kreiswert. Vorhandene höhere Werte und strengere Ausbildungsziele erhalten; nur fehlende Punkte ergänzen. Kosten 25 SP je Punkt, außerhalb des GF/SF-Budgets. Kein zusätzlicher Startbonus: wörtliche Auslegung von „3 pro Kreis“, daher auf Kreis 0 kein Pflichtkauf.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Unbewaffnet-Referenz und Kostenformel `wert*25` im aktuellen Nahkampfkatalog geprüft. Kreis 0–7 liefert Ziele 0/3/6/9/12/15/18/21 und Kosten 0/75/150/225/300/375/450/525 SP ab 0. Beispiel Kreis 2 bei vorhandenem Wert 4: 2 Punkte / 50 SP ergänzen; bei Wert 8 kein Zukauf. Kreis+ erhöht den Zielwert nicht. Regelgrenzen und vollständige Rollenfinanzierung noch nicht geprüft; Konflikte sichtbar melden.

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Bauern- und Wachenprofil auf Stufe 0 mit teurem Troll-Volksminimum vollständig auf Finanzierbarkeit prüfen. WHK-Entwurf und GF/SF-Paketwerte dabei kalibrieren und den bestätigten Rüstungsmanöver-Bedarf aus konkreter Rüstung einrechnen. Bestätigung der neuen WHK-Werte und optionalen militärischen Ausbildungsprofile steht aus.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-12 · 007 · GELÖST — WHK-Alltagsausbildung nach Beruf und Güte konkretisiert

Ergebnis dieses Schritts: [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md) als Planungsentwurf für alle 30 Berufe und sechs Professionsgüten erstellt: K1/K2, zwei Nebenfertigkeiten, Spezialisierungsziel, drei Alltagsfelder und Ergänzung bis zum tatsächlichen 5-%-Minimum. Zusätzlich alle militärischen Ranggruppen mit separat wählbaren Ausbildungsvorschlägen abgedeckt; Rang bleibt beschreibend. Neue Werte nicht ausdrücklich bestätigt. Nur Dokumentation geändert; Generator, Charaktere und Regelkataloge unverändert.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen. Neuer [Entwurf](WHK-Alltagsausbildung.md): K1 je Güte 3/6/10/14/18/22, ergänzende K2 und N1/N2 sowie S. Drei unterschiedliche Alltags-Hauptfertigkeiten mindestens 4. Berufsziele per Maximum ergänzen, echte Hintergrundbeiträge weiterhin addieren; nur Endkosten zählen. Fehlbeträge durch passende Vertiefung ergänzen, keine automatische Güte- oder Budgeterhöhung. Neue Werte und Ergänzungsregeln bleiben unbestätigt.
- Militärischer Rang bleibt rein beschreibend und unabhängig von Beruf, Professionsgüte und Dienststellung. Neue WHK-Führungsprofile sind nur separat wählbare Ausbildungsentwürfe, keine Rangboni. Glücksspiel-Spielpraxis bleibt regeltechnisch offen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet ist Pflicht, Mindestumfang offen und außerhalb des GF/SF-Budgets.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

WHK-Ausarbeitung geprüft: alle 30 Berufsmatrizen gegen den aktuellen Katalog, verwendete Regelreferenzen, sechs Gütekosten (51/74/136/243/391/581 SP) und Elternwerte. Bauer-/Wache-Meister als reine Endwertbeispiele je 323 SP; Troll-Rest 2.444 SP nach Volksminimum, WHK, Attributminimum und Standard-SSK, bei 20 GF/SF-Punkten 2.264 SP. Keine vollständigen Hintergrundziehungen oder Rollenfinanzierung geprüft. Neue Alltagsgrenze 8 für automatische Vertiefung sowie optionale militärische Ziele sind Entwurf.

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Unbewaffnet-Mindestumfang konkretisieren; danach Bauern- und Wachenprofil auf Stufe 0 mit teurem Troll-Volksminimum vollständig auf Finanzierbarkeit prüfen. WHK-Entwurf und GF/SF-Paketwerte dabei kalibrieren und den bestätigten Rüstungsmanöver-Bedarf aus konkreter Rüstung einrechnen. Bestätigung der neuen WHK-Werte und optionalen militärischen Ausbildungsprofile steht aus.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Neue berufliche WHK-Ziele bestätigen und kalibrieren; kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [WHK-Alltagsausbildung](WHK-Alltagsausbildung.md): vollständige Beruf-/Gütematrix, Alltagsfelder, Rangprofile, Kosten und Ergänzungsregeln.
- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-12 · 006 · GELÖST — Rüstungsmanöver an geplante Rüstung gebunden

Ergebnis dieses Schritts: Nutzerbestätigung umgesetzt: Rüstungsmanöver als kleinstes notwendiges Mindestziel aus geplanter Rüstung, tatsächlichen Charakterwerten und KBE-Ziel festgehalten. Vorhandene Käufe anrechnen, höchste Mindestanforderung verwenden, nur fehlende Punkte bezahlen. Tragen bleibt für Materiallast in den Berufspaketen. [Rüstung](Ruestung.md), [GF/SF-Entwurf](GF-SF-Achsenbeitraege.md), Planungsstand und Template abgeglichen. Nur Dokumentation geändert; neue Regel im freien Generator noch nicht implementiert.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Rüstungsmanöver: bestätigt bedarfsabhängig für alle Berufe einschließlich Zivilberufen und Vollgerüstet. RMbedarf = max(0, ceil(RH − (KON/5 + ST)/2 − 6×B)). Höchstes Mindestziel und vorhandene Käufe anrechnen; nur fehlende Punkte ergänzen, einmal gegen GF/SF-/SP-Budget zählen. Maximum- und Budgetkonflikte sichtbar melden. Keine automatische Talentwahl oder Reduzierung von Tragen. Bereits gelernte Werte erhalten; entfallende reine Planungskäufe neu berechnen. Bisherige Vollgerüstet-Maximumplanung ist im Konzept abgelöst, im Assistenten noch nicht umgestellt.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet ist Pflicht, Mindestumfang offen und außerhalb des GF/SF-Budgets.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Neue Rüstungsentscheidung gegen die bestehende Formel in `src/engine/armorComposition.ts` geprüft. Gegenprobe KON 13, ST 15, RH 24: Bedarf bei B=3/2/0 ist RM 0/4/16. Vorhandene RM 2 bei Ziel 2 verlangen zusätzlich 18 SP; vorhandene RM 6 keinen Zukauf. RM 16 erfordert eine passende Freischaltung. Dokumentation angepasst; keine Laufzeittests oder Charakteränderungen.

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** WHK-Alltagsausbildung (mindestens 320 SP auf Stufe 0) und Unbewaffnet-Mindestumfang konkretisieren; anschließend Bauern- und Wachenprofil mit teurem Troll-Volksminimum vollständig auf Finanzierbarkeit prüfen. Neue GF/SF-Paketwerte dabei kalibrieren und den bestätigten Rüstungsmanöver-Bedarf aus der konkreten Rüstung einrechnen.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Berufliche und kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-12 · 005 · GELÖST — Berufs-/Lebensweltbeiträge und Überschneidungen ausgearbeitet

Ergebnis dieses Schritts: [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) für alle 30 Berufe und sieben Lebenswelten erstellt. Beruf je zwei GF und zwei SF mit +2; Lebenswelt weiterhin zwei GF mit +2, keine SF. Unterschiedliche Beiträge addieren, Mindestziele per Maximum ergänzen, gleiche Beitrags-ID nur einmal zählen. Einzelmaximum, Ersatz aus GF-Pools und Überschreitungen der 90-Punkte-Planungsgrenze konkret beschrieben. Neue Paketwerte und Konfliktdetails sind ausgearbeiteter Entwurf, noch keine ausdrücklich bestätigten Nutzerwerte. Nur Dokumentation geändert.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Berufs- und Lebensweltbeiträge sowie additive Zusammenführung, Mindestziele und Konfliktbehandlung sind im [GF/SF-Planungsentwurf](GF-SF-Achsenbeitraege.md) ausgearbeitet. Neue Paketwerte sind noch nicht ausdrücklich bestätigt; der Generator ist unverändert. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet ist Pflicht, Mindestumfang offen und außerhalb des GF/SF-Budgets.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Neue Ausarbeitung: Regelreferenzen und 9-SP-Kosten geprüft; alle 30 Berufe sowie sieben gültige Lebenswelt-Paare abgedeckt. Ein Beruf plus Lebenswelt, Terrain und soziale Lage: 20 Punkte / 180 SP vor Begrenzungen; Troll-Rest 2.267 SP vor weiteren Pflichten. Überschneidungs-, Mindestziel-, Sättigungs- und Grenzbeispiele geprüft. Vollständige Finanzierbarkeit und Generatorverhalten weiterhin ungeprüft. Die bestätigten Terrain-/Lebenswelt-/Soziallagenbeiträge gelten weiter; GF additiv in Schritten höchstens +2, reguläres Maximum 12.

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** WHK-Alltagsausbildung (mindestens 320 SP auf Stufe 0) und Unbewaffnet-Mindestumfang konkretisieren; anschließend Bauern- und Wachenprofil mit teurem Troll-Volksminimum vollständig auf Finanzierbarkeit prüfen. Neue GF/SF-Paketwerte dabei kalibrieren.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

Offen bleiben außerdem die ausdrückliche Bestätigung neuer GF/SF-Paketwerte und Konfliktdetails, Auswahlgewichte der Hintergrundpools und GF/SF-Ziele je Ausbildung. Der neue Entwurf verwendet 90 als automatische Freigabegrenze ohne erfundene Toleranz; Überschreitungen sichtbar klären, keine Pflichtpakete still kürzen. Alle weiteren bestätigten Auswahlen sind im unten verlinkten Planungsstand und Template fortsetzungsrelevant.

1. Berufliche und kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-12 · 004 · GELÖST — GF/SF-Basis 0, Obergrenze ca. 90 Punkte

Ergebnis dieses Schritts: Nutzerentscheidung übernommen: GF/SF-Basis 0, Belegung aus den anderen Achsen, ca. 90 Punkte als Obergrenze auf Stufe 0. Pauschale Verteilung und 94-Punkte-Pflichtbudget verworfen. [Aktueller Fachstand](Grundausbildung-Stufe-0.md). Planungsstand, Budgetgrundlage und Template angepasst; Generator und Charaktere unverändert.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: Basis 0 Punkte. Die Belegung entsteht ausschließlich aus den anderen Achsen (z. B. Beruf und Lebenswelt). Planungsobergrenze ca. 90 gekaufte Punkte, entsprechend ca. 810 SP bei 9 SP/Punkt. Kein Pflichtverbrauch, kein Auffüllen und kein pauschaler SP-Abzug; nur tatsächliche Käufe zählen. Alle GF/SF-Beiträge zählen gemeinsam gegen die Obergrenze, auch berufliche, kämpferische und magische. Konkrete Achsenbeiträge, Zusammenführung und Konfliktbehandlung sind noch auszuarbeiten. Begrenzte Steigerung und Obergrenze höherer Stufen bleiben offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet ist Pflicht, Mindestumfang offen und außerhalb des GF/SF-Budgets.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Neue Budgetrechnung geprüft: 90 Punkte kosten 810 SP. Troll-Rest nach Volksminimum, WHK-/Attribut-Mindestbudget und Standard-SSK: 2.447 SP vor GF/SF, 1.637 SP bei 90 Punkten; mit Schrift 1.607, Händler zusätzlich mit anderer Sprache 1.577 SP. Keine feste Reservierung. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Planung mit Basis 0 und Achsenbeiträgen ist noch nicht im Generator umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** GF/SF-Beiträge aus den anderen Achsen ausarbeiten, beginnend mit Beruf und Lebenswelt. Zusammenführung gleicher Fertigkeiten und Umgang mit der ungefähren Obergrenze klären. Danach WHK-Alltagsausbildung (mindestens 320 SP auf Stufe 0) und Unbewaffnet-Mindestumfang konkretisieren; Bauern- und Wachenprofil samt teurem Troll-Volksminimum auf Finanzierbarkeit prüfen.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

1. Berufliche und kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-12 · 003 · GELÖST — 94 GF/SF-Punkte konkret als Vorschlag verteilt

Ergebnis dieses Schritts: [Konkrete Grundausbildung](Grundausbildung-Stufe-0.md) als noch unbestätigten Vorschlag dokumentiert: GF Körperbeherrschung 10, Laufen 8, Klettern 6, Schwimmen 6, Menschenkenntnis 8, Orientierung 6, Schätzen 4; SF Ausdauer 10, Tragen 8, Gefahreninstinkt 8, Selbstbeherrschung 10, Ausweichen 10. Genau 94 Punkte / 846 SP. Keine Änderung an Generator oder Charakteren.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: 846 SP, entsprechend 94 Punkten. Konkrete Verteilung liegt als Vorschlag vor (siehe oben), Bestätigung offen. Reguläres Maximum 12; sieben Fertigkeiten reichen ohne Talente nur für 84 Punkte. Rollenbezogene GF/SF müssen innerhalb der 94 Punkte umgeschichtet werden. Begrenzte Steigerung und Obergrenze höherer Stufen noch offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet ist Pflicht, Mindestumfang offen und außerhalb des GF/SF-Budgets.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Neuer Vorschlag: zwölf Regelreferenzen, Kostenformeln, Vorteilspflichten und reguläres Maximum geprüft; 48 GF-Punkte / 432 SP plus 46 SF-Punkte / 414 SP ergeben 94 / 846. Troll-Rest bei reservierten Pflichtbudgets weiterhin 1.601 SP vor bedingten Zusätzen. Vollständige Rollenfinanzierung noch nicht geprüft.

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Punkteverteilung ist noch nicht umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Nächster Schritt:** Vorschlag zur GF/SF-Verteilung bestätigen oder korrigieren. Danach WHK-Alltagsausbildung (mindestens 320 SP auf Stufe 0) und Unbewaffnet-Mindestumfang konkretisieren und zusammen mit Attribut- und SSK-Pflichten auf Finanzierbarkeit prüfen. Bauern- und Wachenprofil sowie das teure Troll-Volksminimum dienen als Gegenproben; benötigte Rollen-GF/SF innerhalb der 94 Punkte umschichten.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen bleiben Vorschläge, bis sie bestätigt sind.

### Danach

1. Berufliche und kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-12 · 002 · GELÖST — Übergabe als fortlaufendes Protokoll eingerichtet

Ergebnis dieses Schritts: Neue Einträge stehen oben. Dieser Eintrag enthält den vollständigen gültigen Übergabestand. Die vorherige Dokumentfassung bleibt darunter als Historie erhalten. Projektanweisungen auf diese Lese- und Schreibweise angepasst.

### Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

### Gesicherter Stand

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: 846 SP, entsprechend 94 Punkten. Konkrete Verteilung sowie begrenzte Steigerung und Obergrenze höherer Stufen noch offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet ist Pflicht, Mindestumfang offen und außerhalb des GF/SF-Budgets.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

### Prüfung und Grenzen

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Punkteverteilung ist noch nicht umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

### Logisch nächster Schritt

**Schritt 2: Gemeinsame Grundausbildung für Stufe 0 konkret ausarbeiten.** Zunächst einen begründeten Vorschlag zur Verteilung der 94 GF/SF-Punkte für genau 846 SP erstellen. Die bisher vorgeschlagene Auswahl von sieben Fertigkeiten ist noch nicht bestätigt. Anschließend WHK-Alltagsausbildung und Unbewaffnet-Mindestumfang konkretisieren und zusammen mit Attribut- und SSK-Pflichten auf Finanzierbarkeit prüfen. Ein Bauern- und ein Wachenprofil sowie das teure Troll-Volksminimum dienen als Gegenproben.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen als Vorschläge ausweisen, bis sie bestätigt sind.

### Danach

1. Berufliche und kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

### Weiterführende Dokumente

- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.
---

**LESESTOPP — Ende des neuesten GELÖST-Eintrags. Alles darunter ist optionale Historie.**

---

## 2026-09-12 · 001 · HISTORIE — Ursprüngliches Übergabedokument

Die folgende frühere Fassung ist zur Nachvollziehbarkeit erhalten. Ihre Fortschreibanweisung wird durch die Regel am Dokumentanfang ersetzt.

# NPC-Planung: Übergabe für einen neuen Chat

Zuletzt aktualisiert: 12. September 2026.

## Verbindliche Arbeitsweise

Nach jedem abgeschlossenen Arbeitsschritt den logisch nächsten Schritt konkret vorschlagen. Zugleich dieses Dokument mit Ergebnissen, Entscheidungen, offenen Punkten und dem nächsten Schritt fortschreiben. Vorschlag und bereits beauftragte Umsetzung unterscheiden; offene Regelentscheidungen nicht als bestätigt darstellen.

Diese Nutzerpräferenz ist auch in der projektweiten [AGENTS.md](../../../../AGENTS.md) festgehalten.

## Ziel

Ein NPC-Generator, der aus Volk, Beruf, Lebenswelt, Erfahrung und weiteren Vorgaben spielbare Charaktere mit passender Ausbildung erzeugt. Voraussetzungen sowie SP-, TaP- und Ausrüstungsbudgets müssen eingehalten werden. Nicht erfüllbare Aufträge sichtbar melden; Budgets nicht automatisch zur Finanzierung erhöhen.

## Gesicherter Stand

Der Arbeitsschritt „Planungsgrundlage vereinheitlichen“ ist abgeschlossen. Planungsdokumente und berechnete Budgetdaten sind angepasst; Charakterdateien und Laufzeitberechnung wurden in diesem Schritt nicht geändert.

- Stufe 0 entspricht Kreis 0: 6.400 SP und volle reguläre Volksminima. Allgemein SP = 6.400 + Gesamt-EP; Stufe und Kreis aus der vorhandenen Regeltabelle. Keine Minima-Abschläge und kein eigener Kreis 0+.
- Kreis+ bezeichnet die mittlere Stufe des jeweiligen Kreises.
- Ausrüstungsbudget auf Kreis 0 / Stufe 0: 5.000 D wie beim normalen Spielercharakter. **Das Zusatzbudget für höhere NPC-Kreise und die Kreis+-Interpolation bleiben erhalten.** Die Tabelle in der Budgetgrundlage nennt Gesamtbudgets; das Startbudget nicht nochmals addieren. Die Aussage „wie Spielercharaktere“ hebt die höhere NPC-Geldkurve ausdrücklich nicht auf.
- Rüstung: allgemein höchstens 3 KBE, keine MBE durch Rüstung. Strengere Ziele 0–2 bleiben ausdrücklich wählbar, auch bei Vollrüstung. Ungerundete RBE muss das gewählte Ziel einhalten.
- Einfache Wache: Zeughausrüstung von der Stange, Stoff/Leder überall, Kette Arme/Torso, Eisenbrustplatte; keine automatische Anpassung in ihrer Standardauswahl.
- GF/SF auf Stufe 0: 846 SP, entsprechend 94 Punkten. Konkrete Verteilung sowie begrenzte Steigerung und Obergrenze höherer Stufen noch offen.
- WHK: mindestens aufgerundet 5 % der Gesamt-SP tatsächlich ausgeben; Hauptfertigkeiten und Spezialisierungen zählen gemeinsam. Eigenständige Alltagskompetenz sicherstellen.
- Attribute: mindestens aufgerundet 3 % der Gesamt-SP tatsächlich ausgeben; Eigenschaften zählen nicht mit.
- SSK: Hauptsprache 3 und Herkunftskultur 3 für 90 SP. Bei belegtem Schriftbedarf passende Schrift mindestens 2 für weitere 30 SP; Händler zusätzlich eine andere Sprache 2 für 30 SP.
- Unbewaffnet ist Pflicht, Mindestumfang offen und außerhalb des GF/SF-Budgets.
- Geldbeutel ist mitgeführtes Bargeld, getrennt von Ausrüstungsbudget, Vermögen und sozialer Lage. Bestätigte Stufen bleiben bestehen.
- Zufällige Pflichtmerkmale einmal ziehen und bei Neuberechnungen erhalten. Weitere bestätigte Auswahlen stehen im Planungsstand.

## Prüfung und Grenzen

Die Volkstabellen wurden für alle elf Völker neu berechnet. Trolle haben den höchsten regulären Sockel mit 3.351 SP. Die 15 aufgeführten EP-/SP-Einstiegs- und Mittelpunktwerte wurden gegen die Regeltabelle geprüft. Wiederholte Ausführung von `scripts/budget-baseline.mjs` liefert identische Ergebnisse und erhält redaktionelle Entscheidungen.

Die Referenzmessungen vom 12.09. zeigen weiter Ausbildungsbedarf: fünf von sechs Referenzen unterschreiten das neue WHK-Minimum. Die neue Punkteverteilung ist noch nicht umgesetzt. Bestehende Referenzkopien, Rüstungsfunktionen und vorhandene Rollenbausteine sind keine vollständige Umsetzung des geplanten freien Generators.

Im Arbeitsverzeichnis bestehen weitere lokale Änderungen. Diese erhalten und nicht pauschal zurücksetzen. Historische Prüfberichte belegen ihren damaligen Stand, nicht automatisch die neuen Pflichtbudgets.

## Logisch nächster Schritt

**Schritt 2: Gemeinsame Grundausbildung für Stufe 0 konkret ausarbeiten.** Zunächst einen begründeten Vorschlag zur Verteilung der 94 GF/SF-Punkte für genau 846 SP erstellen. Die bisher vorgeschlagene Auswahl von sieben Fertigkeiten ist noch nicht bestätigt. Anschließend WHK-Alltagsausbildung und Unbewaffnet-Mindestumfang konkretisieren und zusammen mit Attribut- und SSK-Pflichten auf Finanzierbarkeit prüfen. Ein Bauern- und ein Wachenprofil sowie das teure Troll-Volksminimum dienen als Gegenproben.

Dieser nächste Schritt ist vorgeschlagen, noch nicht ausgeführt. Neue Ausbildungsentscheidungen als Vorschläge ausweisen, bis sie bestätigt sind.

## Danach

1. Berufliche und kämpferische Kompetenzziele, Schriftbedarf je Profession und GF/SF-Steigerung für höhere Stufen festlegen.
2. KI-, Spruchmagie- und PSI-Ausbildung mit Voraussetzungen und Budgetbedarf ausarbeiten.
3. Geprüfte Bausteine für Bauer, Händler, Wache, Infanterist, Musketier, Heiler und Kampfmagier erstellen.
4. Generator, Auswahloberfläche und tatsächliche Budgetverteilung umsetzen; Referenzen budgetgerecht erneuern und Speicherung/Export prüfen.

## Weiterführende Dokumente

- [Gesicherter Planungsstand](Planungsstand-2026-09-12.md): bestätigte Auswahlen, Pflichtbudgets und Referenzmessungen.
- [Budgetgrundlage](Budgetgrundlage.md): SP-Modell, erhaltene höhere NPC-Ausrüstungsbudgets und Volkstabellen.
- [Template und Arbeitsaufträge](Template-und-Arbeitsauftraege.md): Eingaben, Ablauf und sieben Rollenprofile.
- [Eigenschaften und Attribute](Eigenschaften-und-Attribute.md): Rollenprioritäten und Vollrüstung.
- [Rüstung](Ruestung.md): Ausrüstungspakete und Zielprüfung.
- [Weiterarbeit](Weiterarbeit.md): ergänzende Umsetzungshinweise und historische Sitzungsstände.

