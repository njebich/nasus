# Korrektur der sechs Goblin-Referenzen

11. September 2026. Spezialisierungsgrenzen korrigiert; SP-/TaP-Budgets, Geld und Ausrüstung unverändert. Niedrigere Nebenwerte finanzieren die höheren Hauptfertigkeiten. Keine neue Budgetquelle, keine neuen Nachteile.

## Bauer · Stufe 0

6395/6400 SP, 5 SP frei; 20/20 TaP. 0 KBE aus Rüstung.

| Wert | Vorher | Nachher |
|---|---:|---:|
| Gefahreninstinkt (sf_gefahreninstinkt) | 6 | 3 |
| Stangenwaffen (nk_stangenwaffen) | 8 | 12 |
| Feuerwaffen (fk_feuerwaffen) | 6 | 10 |
| -> Musketen (fk_spez_feuerwaffen_musketen) | 13 | 10 |
| Vitalität (att_vitalitaet) | 3 | 2 |

## Wachmann · Stufe 0

6396/6400 SP, 4 SP frei; 20/20 TaP. 2 KBE aus Rüstung.

| Wert | Vorher | Nachher |
|---|---:|---:|
| Mut (eig_g_mut) | 10 | 9 |
| Sinnesschärfe (eig_g_sinneschaerfe) | 14 | 13 |
| Willenskraft (eig_g_willenskraft) | 10 | 7 |
| Stangenwaffen (nk_stangenwaffen) | 8 | 23 |
| Feuerwaffen (fk_feuerwaffen) | 8 | 6 |
| -> Musketen (fk_spez_feuerwaffen_musketen) | 10 | 6 |
| -> Pistole (fk_spez_feuerwaffen_pistolen) | 10 | 0 |
| Tragen (sf_tragen) | 8 | 4 |
| Rüstungsmanöver (sf_ruestungsmanoever) | 14 | 6 |
| Ladeschütze Vorderlader (sf_ladeschuetze_vorderlader) | 12 | 11 |
| Rechtskunde (whk_rechtskunde) | 7 | 8 |
| Ermittlung (whk_ermittlung) | 7 | 8 |
| Überleben (whk_ueberleben) | 4 | 6 |

## Schütze · Stufe 0

6395/6400 SP, 5 SP frei; 20/20 TaP. 0 KBE aus Rüstung.

| Wert | Vorher | Nachher |
|---|---:|---:|
| Mut (eig_g_mut) | 8 | 7 |
| Willenskraft (eig_g_willenskraft) | 8 | 7 |
| Klettern (gr_klettern) | 3 | 1 |
| Springen (gr_springen) | 2 | 1 |
| Stangenwaffen (nk_stangenwaffen) | 4 | 6 |
| Feuerwaffen (fk_feuerwaffen) | 18 | 24 |
| Ermittlung (whk_ermittlung) | 7 | 10 |
| Vitalität (att_vitalitaet) | 2 | 1 |

## Nahkämpfer · Stufe 0

6398/6400 SP, 2 SP frei; 20/20 TaP. 0 KBE aus Rüstung.

| Wert | Vorher | Nachher |
|---|---:|---:|
| Mut (eig_g_mut) | 12 | 11 |
| Sinnesschärfe (eig_g_sinneschaerfe) | 12 | 11 |
| Willenskraft (eig_g_willenskraft) | 8 | 7 |
| Klettern (gr_klettern) | 3 | 2 |
| Schleichen (gr_schleichen) | 5 | 2 |
| Verstecken (gr_verstecken) | 5 | 2 |
| Überleben (whk_ueberleben) | 8 | 11 |
| Stangenwaffen (nk_stangenwaffen) | 10 | 16 |
| Unbewaffnet (nk_unbewaffnet) | 6 | 10 |
| Vitalität (att_vitalitaet) | 3 | 2 |

## Hauptmann · Stufe 15

7995/8000 SP, 5 SP frei; 95/95 TaP. 1 KBE aus Rüstung.

| Wert | Vorher | Nachher |
|---|---:|---:|
| Ausdauer (sf_ausdauer) | 9 | 6 |
| Gefahreninstinkt (sf_gefahreninstinkt) | 6 | 4 |
| Selbstbeherrschung (sf_selbstbeherrschung) | 15 | 8 |
| Laufen (gr_laufen) | 6 | 4 |
| Schleichen (gr_schleichen) | 5 | 2 |
| Verstecken (gr_verstecken) | 5 | 2 |
| Schwimmen (gr_schwimmen) | 2 | 1 |
| Springen (gr_springen) | 2 | 0 |
| Klingenwaffen (nk_klingenwaffen) | 12 | 22 |
| Unbewaffnet (nk_unbewaffnet) | 12 | 24 |
| Feuerwaffen (fk_feuerwaffen) | 10 | 6 |
| -> Pistole (fk_spez_feuerwaffen_pistolen) | 20 | 6 |
| Ladeschütze Vorderlader (sf_ladeschuetze_vorderlader) | 12 | 6 |
| Militärtheorie (whk_militaertheorie) | 10 | 15 |
| Kaufmann (whk_kaufmann) | 8 | 4 |
| Vitalität (att_vitalitaet) | 3 | 2 |

## KI-Spezialist · Stufe 15

7995/8000 SP, 5 SP frei; 95/95 TaP. 0 KBE aus Rüstung.

| Wert | Vorher | Nachher |
|---|---:|---:|
| Vitalität (att_vitalitaet) | 2 | 1 |
| Klingenwaffen (nk_klingenwaffen) | 12 | 20 |
| -> Musketen (fk_spez_feuerwaffen_musketen) | 12 | 6 |
| Klettern (gr_klettern) | 3 | 1 |
| Springen (gr_springen) | 4 | 1 |

## Prüfung

Alle gesetzten Regelwerte wurden zusätzlich mit `setValue()` kontrolliert. Zentrale Validierung einschließlich Spezialisierungsgrenzen, AT/PA-Pools und KI-Baumvoraussetzungen bestanden. Die sechs neuen `.nasus.json`-Exporte wurden als reguläre Speicherpunkte erzeugt, erneut eingelesen und geprüft. Kleine Restbudgets von 2–5 SP bleiben ausdrücklich frei. Frühere Archive bleiben historische Ausgangsstände und sollen nicht als aktuelle Referenzen verwendet werden.
