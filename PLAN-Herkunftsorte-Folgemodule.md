# Plan: Herkunftsorte – Folgemodule

Stand: 2026-07-19

## Abgeschlossen in diesem Arbeitsblock

- Claude-Auftrag 1: Ortsmodell, kontrollierte Auswahllisten und drei Beispielorte.
- Claude-Auftrag 2: `Heimat`/altes Weltfeld migriert; Herkunft als Orts-ID plus stabiler Snapshot; Druck `Ort, Region, AW/NW`.
- Claude-Auftrag 3: Herkunftsdropdown und Formular für einen neuen benannten Ort in der Charaktererschaffung.

## Späteres Ortsverwaltungsmodul – nur geplant

### Claude-Auftrag 4: Persistenzschicht

1. Kleine Repository-Schnittstelle für Orte, Charaktere und Abenteuer-Ortszustände definieren.
2. Vordefinierte Orte mit lokal angelegten/geänderten Orten zusammenführen.
3. Grundzustände und aktive/abgeschlossene Abenteuerzustände getrennt speichern.
4. Migration und Reload-Verhalten testen.

### Claude-Auftrag 5: Meister-Modul

1. Ortsliste und Editor für sämtliche Ortsstellschrauben bauen.
2. Händler und lokale Produktion hinzufügen, ändern und entfernen.
3. Abenteuerzustand erzeugen, weiterführen oder verwerfen.
4. Übernahme als neuen Grundzustand als ausdrückliche Aktion anbieten.
5. Wiederherstellung vordefinierter Ausgangswerte testen, ohne benutzerdefinierte Orte zu verlieren.

## Bewusste Modulgrenze

- Keine Implementierung von Auftrag 4 oder 5 in diesem Arbeitsblock.
- Verfügbarkeiten beginnen in einer neuen Sitzung als eigenes Modul.
