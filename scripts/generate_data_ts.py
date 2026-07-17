"""
Erzeugt die generierten TypeScript-Datenmodule aus einer werte-*.xlsx.

Betrifft:
  - src/data/rules.ts    (Sheet "Werte", alle Zeilen/Kategorien - die UI-Views
                           entscheiden selbst, welche Kategorien sie anzeigen)
  - src/data/lookups.ts  (Sheets "EP-Stufe-Kreis", "WHK-Spez-Kosten",
                           "Eigenschaften-Kosten" - von SVERWEIS referenziert)
  - src/data/equipment/preisliste.ts       (Sheet "Preisliste")
  - src/data/equipment/artefakte.ts        (Sheets "Artefakt-Basis" + "Artefakt-Kosten")
  - src/data/equipment/verfuegbarkeit.ts   (Sheet "Verfuegbarkeit-Modifikatoren", 2 Bloecke)

Aufruf:
    python scripts/generate_data_ts.py "werte 0.7-claude.xlsx"

Aendert NICHTS an der xlsx - reines Lesen. Ueberschreibt die generierten
.ts-Dateien komplett (sie sind reine Codegen-Artefakte, nicht von Hand pflegen).
"""
import sys
import json
from pathlib import Path

import openpyxl

REPO_ROOT = Path(__file__).resolve().parent.parent
OUT_DATA_DIR = REPO_ROOT / "src" / "data"
OUT_EQUIPMENT_DIR = OUT_DATA_DIR / "equipment"

RULE_COLUMNS = [
    ("Referenz", "referenz"),
    ("Kategorie", "kategorie"),
    ("Beschreibung", "beschreibung"),
    ("Abkürzung", "abkuerzung"),
    ("Info", "info"),
    ("Parent", "parent"),
    ("Art", "art"),
    ("Formel", "formelRaw"),
    ("Pool", "poolRaw"),
    ("Flag", "flag"),
    ("Grad", "grad"),
    ("Kosten", "kostenRaw"),
    ("Verfuegbarkeit", "verfuegbarkeit"),
    ("Mindest-TaW", "mindestTaw"),
    ("Eig-Bonus", "eigBonus"),
    ("Wirkung", "wirkung"),
]
REQUIRED_FIELDS = {"referenz", "kategorie", "art"}

LOOKUP_SHEETS = [
    "EP-Stufe-Kreis", "WHK-Spez-Kosten", "Eigenschaften-Kosten",
    "Sprachstufe-Kosten", "Kulturstufe-Kosten",
]


def cell_to_str(value):
    """Stringify a cell value the way it visually reads in Excel (no '16.0' for ints)."""
    if value is None:
        return None
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value).strip()


def parse_numeric_or_sentinel(value):
    """Returns (numeric_value_or_None, raw_sentinel_text_or_None). Handles cells that are
    sometimes a clean number and sometimes a sentinel string like "------"/"nicht V."/"XXX"
    meaning "not available" - callers keep the raw text for traceability instead of just 0."""
    if value is None:
        return None, None
    if isinstance(value, (int, float)):
        return float(value), None
    text = str(value).strip()
    normalized = text.replace(",", ".").rstrip("D").rstrip("d").strip()
    try:
        return float(normalized), None
    except ValueError:
        return None, text


def read_rules(wb):
    ws = wb["Werte"]
    headers = {}
    for c in range(1, ws.max_column + 1):
        v = ws.cell(row=1, column=c).value
        if v:
            headers[v.strip()] = c

    missing_headers = [h for h, _ in RULE_COLUMNS if h not in headers]
    if missing_headers:
        raise SystemExit(f"Erwartete Spalten fehlen im 'Werte'-Sheet: {missing_headers}")

    rules = []
    warnings = []
    seen_referenz = {}
    for r in range(2, ws.max_row + 1):
        raw = {}
        for header, field in RULE_COLUMNS:
            raw[field] = cell_to_str(ws.cell(row=r, column=headers[header]).value)
        if all(v is None for v in raw.values()):
            continue

        entry = {k: v for k, v in raw.items() if v is not None}
        entry["sourceRow"] = r

        missing_required = REQUIRED_FIELDS - entry.keys()
        if missing_required:
            warnings.append(f"Zeile {r}: fehlende Pflichtfelder {missing_required} - uebersprungen")
            continue

        ref_lower = entry["referenz"].lower()
        if ref_lower in seen_referenz:
            warnings.append(
                f"Zeile {r}: doppelte Referenz '{entry['referenz']}' "
                f"(zuerst Zeile {seen_referenz[ref_lower]}) - uebersprungen"
            )
            continue
        seen_referenz[ref_lower] = r

        rules.append(entry)

    return rules, warnings


def read_lookup_sheet(wb, sheet_name):
    ws = wb[sheet_name]
    headers = []
    for c in range(1, ws.max_column + 1):
        v = ws.cell(row=1, column=c).value
        if v:
            headers.append((c, v.strip()))

    rows = []
    for r in range(2, ws.max_row + 1):
        row = {}
        for c, header in headers:
            val = cell_to_str(ws.cell(row=r, column=c).value)
            if val is not None:
                row[header] = val
        if row:
            rows.append(row)
    return rows


def read_generic_rows(wb, sheet_name, name_header):
    """Liest ein Sheet generisch: jede Zeile wird ein Dict aus {original Spaltenname: Wert}
    (nur nicht-leere Zellen) plus sourceRow und ein normalisiertes "name"-Feld (Wert der
    per name_header benannten Spalte). Passend fuer die vielen kleinen, strukturell simplen
    Modifikator-Tabellen (NK-Material, Ruestung-Verarbeitung, etc.) - spart 10+ fast-identische
    read_*-Funktionen."""
    ws = wb[sheet_name]
    headers = []
    for c in range(1, ws.max_column + 1):
        v = ws.cell(row=1, column=c).value
        if v:
            headers.append((c, v.strip()))

    rows = []
    for r in range(2, ws.max_row + 1):
        row = {}
        for c, header in headers:
            val = cell_to_str(ws.cell(row=r, column=c).value)
            if val is not None:
                row[header] = val
        if not row:
            continue
        row["sourceRow"] = r
        row["name"] = row.get(name_header, "")
        rows.append(row)
    return rows


def read_preisliste(wb):
    ws = wb["Preisliste"]
    rows = []
    for r in range(2, ws.max_row + 1):
        art = cell_to_str(ws.cell(row=r, column=1).value)
        name = cell_to_str(ws.cell(row=r, column=2).value)
        if not art and not name:
            continue
        anzahl_val, _ = parse_numeric_or_sentinel(ws.cell(row=r, column=3).value)
        einheit = cell_to_str(ws.cell(row=r, column=4).value)
        gewicht_val, gewicht_roh = parse_numeric_or_sentinel(ws.cell(row=r, column=5).value)
        preis_val, preis_roh = parse_numeric_or_sentinel(ws.cell(row=r, column=6).value)
        notiz = cell_to_str(ws.cell(row=r, column=7).value)
        whk = cell_to_str(ws.cell(row=r, column=8).value)
        spezialisierung = cell_to_str(ws.cell(row=r, column=9).value)

        entry = {"sourceRow": r, "art": art, "name": name}
        if anzahl_val is not None:
            entry["anzahl"] = anzahl_val
        if einheit:
            entry["einheit"] = einheit
        if gewicht_val is not None:
            entry["gewichtKg"] = gewicht_val
        elif gewicht_roh:
            entry["gewichtRoh"] = gewicht_roh
        entry["preisAvailable"] = preis_val is not None
        if preis_val is not None:
            entry["preisDublonen"] = preis_val
        elif preis_roh:
            entry["preisRoh"] = preis_roh
        if notiz:
            entry["notiz"] = notiz
        if whk:
            entry["whkCraftSkill"] = whk
        if spezialisierung:
            entry["spezialisierung"] = spezialisierung
        rows.append(entry)
    return rows


def read_artefakt_basis(wb):
    ws = wb["Artefakt-Basis"]
    cols = [
        ("Referenz", "referenz"), ("Name", "name"), ("Beschreibung", "beschreibung"),
        ("Zaubergrad", "zaubergrad"), ("Mana-Basis", "manaBasis"),
        ("Vorbereitungszeit-sec", "vorbereitungszeitSec"), ("Effektdauer-sec", "effektdauerSec"),
        ("Wirkungsdauer-Basis", "wirkungsdauerBasis"), ("Wirkungsdauer-Einheit", "wirkungsdauerEinheit"),
        ("Wirkung-Basis", "wirkungBasis"), ("Wirkung-Einheit", "wirkungEinheit"), ("Eigenschaft", "eigenschaft"),
    ]
    headers = {}
    for c in range(1, ws.max_column + 1):
        v = ws.cell(row=1, column=c).value
        if v:
            headers[v.strip()] = c

    rows = []
    for r in range(2, ws.max_row + 1):
        entry = {}
        for header, field in cols:
            if header not in headers:
                continue
            entry[field] = cell_to_str(ws.cell(row=r, column=headers[header]).value)
        entry = {k: v for k, v in entry.items() if v is not None}
        if not entry.get("referenz"):
            continue
        entry["sourceRow"] = r
        rows.append(entry)
    return rows


def read_artefakt_kosten(wb):
    ws = wb["Artefakt-Kosten"]
    rows = []
    for r in range(2, ws.max_row + 1):
        referenz = cell_to_str(ws.cell(row=r, column=1).value)
        if not referenz:
            continue
        entry = {
            "sourceRow": r,
            "referenz": referenz,
            "name": cell_to_str(ws.cell(row=r, column=2).value),
            "grad": cell_to_str(ws.cell(row=r, column=3).value),
            "kostenEinmalig": cell_to_str(ws.cell(row=r, column=4).value),
            "verfuegbarkeitEinmalig": cell_to_str(ws.cell(row=r, column=5).value),
            "kostenPermanent": cell_to_str(ws.cell(row=r, column=6).value),
            "verfuegbarkeitPermanent": cell_to_str(ws.cell(row=r, column=7).value),
        }
        # Leere Zellen komplett weglassen statt "null" zu schreiben (konsistent mit den
        # anderen read_*-Funktionen) - TS-Seite kann sonst leicht null mit undefined verwechseln.
        rows.append({k: v for k, v in entry.items() if v is not None})
    return rows


def read_verfuegbarkeit_modifikatoren(wb):
    ws = wb["Verfuegbarkeit-Modifikatoren"]
    markt = []
    legende = []
    in_legende_block = False
    for r in range(2, ws.max_row + 1):
        a = ws.cell(row=r, column=1).value
        b = ws.cell(row=r, column=2).value
        c = ws.cell(row=r, column=3).value
        if a is None and b is None and c is None:
            continue
        if a == "Grund-Verfuegbarkeit (Legende)":
            in_legende_block = True
            continue
        if in_legende_block and a == "Wert":
            continue  # zweite Kopfzeile des Legende-Blocks
        if in_legende_block:
            entry = {"wert": cell_to_str(a), "bedeutung": cell_to_str(b), "wuerfelwurf": cell_to_str(c)}
            legende.append({k: v for k, v in entry.items() if v is not None})
        else:
            entry = {"kategorie": cell_to_str(a), "auspraegung": cell_to_str(b), "faktor": cell_to_str(c)}
            markt.append({k: v for k, v in entry.items() if v is not None})
    return markt, legende


def ts_literal(value):
    """Render a Python value (str/int/dict/list) as a TS literal via JSON
    (JSON syntax is valid TS/JS object-literal syntax for our purposes)."""
    return json.dumps(value, ensure_ascii=False)


def write_rules_ts(rules, warnings):
    # Data goes into a plain .json file, not inlined as a TS array literal: tsc's structural
    # checking of ~1300+ distinct object literals against an interface with many optional
    # fields hits TS2590 ("union type too complex to represent"). A JSON import + single
    # `as unknown as RuleEntry[]` cast at the boundary sidesteps that entirely.
    json_rows = []
    for entry in rules:
        ordered = {k: entry[k] for k in [
            "referenz", "kategorie", "beschreibung", "abkuerzung", "info", "parent", "art",
            "formelRaw", "poolRaw", "flag", "grad", "kostenRaw", "verfuegbarkeit",
            "mindestTaw", "eigBonus", "wirkung", "sourceRow",
        ] if k in entry}
        json_rows.append(ordered)

    json_path = OUT_DATA_DIR / "rules.json"
    json_path.write_text(json.dumps(json_rows, ensure_ascii=False, indent=None), encoding="utf-8")

    lines = []
    lines.append("// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.")
    lines.append("// Quelle: Sheet \"Werte\" (-> rules.json). Enthaelt ALLE Kategorien; welche")
    lines.append("// UI-Views welche Kategorien anzeigen, wird in src/views/*.ts entschieden.")
    lines.append("import rulesJson from './rules.json';")
    lines.append("")
    lines.append("export type Art = 'Wert' | 'Auswahl' | 'Formel' | 'Pool' | 'Fixwert' | 'Lookup';")
    lines.append("")
    lines.append("export interface RuleEntry {")
    lines.append("  referenz: string;")
    lines.append("  kategorie: string;")
    lines.append("  beschreibung?: string;")
    lines.append("  abkuerzung?: string;")
    lines.append("  info?: string;")
    lines.append("  parent?: string;")
    lines.append("  art: Art;")
    lines.append("  formelRaw?: string;")
    lines.append("  poolRaw?: string;")
    lines.append("  flag?: string;")
    lines.append("  grad?: string;")
    lines.append("  kostenRaw?: string;")
    lines.append("  verfuegbarkeit?: string;")
    lines.append("  mindestTaw?: string;")
    lines.append("  eigBonus?: string;")
    lines.append("  wirkung?: string;")
    lines.append("  sourceRow: number;")
    lines.append("}")
    lines.append("")
    lines.append("export const RULES = rulesJson as unknown as RuleEntry[];")
    lines.append("")

    if warnings:
        lines.append("// Codegen-Warnungen (siehe Konsolen-Ausgabe beim Generieren):")
        for w in warnings:
            lines.append(f"// - {w}")
        lines.append("")

    out_path = OUT_DATA_DIR / "rules.ts"
    out_path.write_text("\n".join(lines), encoding="utf-8")
    return out_path


def write_lookups_ts(wb):
    tables = {}
    for sheet_name in LOOKUP_SHEETS:
        if sheet_name not in wb.sheetnames:
            print(f"WARNUNG: Lookup-Sheet '{sheet_name}' nicht gefunden - uebersprungen.")
            continue
        tables[sheet_name] = read_lookup_sheet(wb, sheet_name)

    json_path = OUT_DATA_DIR / "lookups.json"
    json_path.write_text(json.dumps(tables, ensure_ascii=False, indent=None), encoding="utf-8")

    lines = []
    lines.append("// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.")
    lines.append("// Quelle: die per SVERWEIS referenzierten Lookup-Sheets (-> lookups.json).")
    lines.append("import lookupsJson from './lookups.json';")
    lines.append("")
    lines.append("export type LookupRow = Record<string, string>;")
    lines.append("")
    lines.append("export const LOOKUP_TABLES = lookupsJson as unknown as Record<string, LookupRow[]>;")
    lines.append("")

    out_path = OUT_DATA_DIR / "lookups.ts"
    out_path.write_text("\n".join(lines), encoding="utf-8")
    return out_path


def write_json_backed_module(out_dir, module_name, export_name, type_lines, ts_type_expr, data):
    """Writes {module_name}.json + {module_name}.ts (JSON import + typed export). Used for every
    generated data module - keeps data out of TS array literals (see write_rules_ts for why)."""
    json_path = out_dir / f"{module_name}.json"
    json_path.write_text(json.dumps(data, ensure_ascii=False, indent=None), encoding="utf-8")

    lines = ["// GENERIERT von scripts/generate_data_ts.py - nicht von Hand bearbeiten.", ""]
    lines.append(f"import {module_name}Json from './{module_name}.json';")
    lines.append("")
    lines.extend(type_lines)
    lines.append("")
    lines.append(f"export const {export_name} = {module_name}Json as unknown as {ts_type_expr};")
    lines.append("")

    out_path = out_dir / f"{module_name}.ts"
    out_path.write_text("\n".join(lines), encoding="utf-8")
    return out_path


def write_preisliste_ts(wb):
    rows = read_preisliste(wb)
    type_lines = [
        "export interface PreislisteRow {",
        "  sourceRow: number;",
        "  art?: string;",
        "  name?: string;",
        "  anzahl?: number;",
        "  einheit?: string;",
        "  gewichtKg?: number;",
        "  gewichtRoh?: string;",
        "  preisAvailable: boolean;",
        "  preisDublonen?: number;",
        "  preisRoh?: string;",
        "  notiz?: string;",
        "  whkCraftSkill?: string;",
        "  spezialisierung?: string;",
        "}",
    ]
    path = write_json_backed_module(OUT_EQUIPMENT_DIR, "preisliste", "PREISLISTE", type_lines, "PreislisteRow[]", rows)
    print(f"{path}: {len(rows)} Preisliste-Eintraege geschrieben.")


def write_artefakte_ts(wb):
    basis = read_artefakt_basis(wb)
    kosten = read_artefakt_kosten(wb)
    type_lines = [
        "export interface ArtefaktBasis {",
        "  sourceRow: number;",
        "  referenz: string;",
        "  name?: string;",
        "  beschreibung?: string;",
        "  zaubergrad?: string;",
        "  manaBasis?: string;",
        "  vorbereitungszeitSec?: string;",
        "  effektdauerSec?: string;",
        "  wirkungsdauerBasis?: string;",
        "  wirkungsdauerEinheit?: string;",
        "  wirkungBasis?: string;",
        "  wirkungEinheit?: string;",
        "  eigenschaft?: string;",
        "}",
        "export interface ArtefaktKosten {",
        "  sourceRow: number;",
        "  referenz: string;",
        "  name?: string;",
        "  grad?: string;",
        "  kostenEinmalig?: string;",
        "  verfuegbarkeitEinmalig?: string;",
        "  kostenPermanent?: string;",
        "  verfuegbarkeitPermanent?: string;",
        "}",
    ]
    data = {"basis": basis, "kosten": kosten}
    path = write_json_backed_module(
        OUT_EQUIPMENT_DIR, "artefakte", "ARTEFAKTE_RAW", type_lines,
        "{ basis: ArtefaktBasis[]; kosten: ArtefaktKosten[] }", data,
    )
    # Re-export as two flat consts for convenient importing (same underlying data/module).
    with open(OUT_EQUIPMENT_DIR / "artefakte.ts", "a", encoding="utf-8") as f:
        f.write("export const ARTEFAKT_BASIS = ARTEFAKTE_RAW.basis;\n")
        f.write("export const ARTEFAKT_KOSTEN = ARTEFAKTE_RAW.kosten;\n")
    print(f"{path}: {len(basis)} Artefakt-Basis, {len(kosten)} Artefakt-Kosten-Eintraege geschrieben.")


def write_verfuegbarkeit_ts(wb):
    markt, legende = read_verfuegbarkeit_modifikatoren(wb)
    type_lines = [
        "export interface MarktModifikatorRow { kategorie?: string; auspraegung?: string; faktor?: string; }",
        "export interface VerfuegbarkeitLegendeRow { wert?: string; bedeutung?: string; wuerfelwurf?: string; }",
    ]
    data = {"markt": markt, "legende": legende}
    path = write_json_backed_module(
        OUT_EQUIPMENT_DIR, "verfuegbarkeit", "VERFUEGBARKEIT_RAW", type_lines,
        "{ markt: MarktModifikatorRow[]; legende: VerfuegbarkeitLegendeRow[] }", data,
    )
    with open(OUT_EQUIPMENT_DIR / "verfuegbarkeit.ts", "a", encoding="utf-8") as f:
        f.write("export const MARKT_MODIFIKATOR = VERFUEGBARKEIT_RAW.markt;\n")
        f.write("export const VERFUEGBARKEIT_LEGENDE = VERFUEGBARKEIT_RAW.legende;\n")
    print(f"{path}: {len(markt)} Markt-Modifikator-, {len(legende)} Verfuegbarkeit-Legende-Eintraege geschrieben.")


GENERIC_ROW_TYPE_LINES = [
    "export type GenericRow = Record<string, string> & { sourceRow: number; name: string };",
]


def write_weapons_ts(wb):
    # Phase 7 (bestaetigt mit Nutzer): NUR Basis-Waffe/-Schild, keine Material/Anpassung/
    # Schaftmaterial/Fertigung-Komposition - die genaue Preisformel dafuer ist noch offen
    # (vertagt auf Phase 9). NK-Waffen-Basis enthaelt sowohl Waffen als auch Schilde
    # (Spezialisierung="Schild").
    rows = read_generic_rows(wb, "NK-Waffen-Basis", "Waffe")
    data = {"basis": rows}
    path = write_json_backed_module(
        OUT_EQUIPMENT_DIR, "weapons", "WEAPONS_RAW", GENERIC_ROW_TYPE_LINES,
        "{ basis: GenericRow[] }", data,
    )
    with open(OUT_EQUIPMENT_DIR / "weapons.ts", "a", encoding="utf-8") as f:
        f.write("export const NK_WAFFEN_BASIS = WEAPONS_RAW.basis;\n")
    print(f"{path}: {len(rows)} NK-Waffen-Basis-Eintraege (Waffen+Schilde) geschrieben.")


def write_armor_ts(wb):
    basis = read_generic_rows(wb, "Ruestung-Basis", "Ruestungsteil")
    verarbeitung = read_generic_rows(wb, "Ruestung-Verarbeitung", "Verarbeitung")
    anpassung = read_generic_rows(wb, "Ruestung-Anpassung", "Anpassung")
    data = {"basis": basis, "verarbeitung": verarbeitung, "anpassung": anpassung}
    path = write_json_backed_module(
        OUT_EQUIPMENT_DIR, "armor", "ARMOR_RAW", GENERIC_ROW_TYPE_LINES,
        "{ basis: GenericRow[]; verarbeitung: GenericRow[]; anpassung: GenericRow[] }", data,
    )
    with open(OUT_EQUIPMENT_DIR / "armor.ts", "a", encoding="utf-8") as f:
        f.write("export const RUESTUNG_BASIS = ARMOR_RAW.basis;\n")
        f.write("export const RUESTUNG_VERARBEITUNG = ARMOR_RAW.verarbeitung;\n")
        f.write("export const RUESTUNG_ANPASSUNG = ARMOR_RAW.anpassung;\n")
    print(
        f"{path}: {len(basis)} Ruestung-Basis, {len(verarbeitung)} Verarbeitung, "
        f"{len(anpassung)} Anpassung geschrieben."
    )


def write_shields_ts(wb):
    # Schild-Komposition (Nutzer 2026-07-17): "die haben auch Anpassung" - Material x Fertigung
    # x Bespannung, analog zu Ruestung-Basis x -Verarbeitung x -Anpassung. Schild-Verplatung
    # (nur Holzschilde) bewusst NICHT gelesen - Stub-Sheet ohne Werte (siehe Entwickeln-Sheet),
    # auf Nutzerwunsch vorerst weggelassen.
    material = read_generic_rows(wb, "Schild-Material", "Material")
    fertigung = read_generic_rows(wb, "Schild-Fertigung", "Fertigung")
    bespannung = read_generic_rows(wb, "Schild-Bespannung", "Bespannung")
    data = {"material": material, "fertigung": fertigung, "bespannung": bespannung}
    path = write_json_backed_module(
        OUT_EQUIPMENT_DIR, "shields", "SHIELDS_RAW", GENERIC_ROW_TYPE_LINES,
        "{ material: GenericRow[]; fertigung: GenericRow[]; bespannung: GenericRow[] }", data,
    )
    with open(OUT_EQUIPMENT_DIR / "shields.ts", "a", encoding="utf-8") as f:
        f.write("export const SCHILD_MATERIAL = SHIELDS_RAW.material;\n")
        f.write("export const SCHILD_FERTIGUNG = SHIELDS_RAW.fertigung;\n")
        f.write("export const SCHILD_BESPANNUNG = SHIELDS_RAW.bespannung;\n")
    print(
        f"{path}: {len(material)} Schild-Material, {len(fertigung)} Schild-Fertigung, "
        f"{len(bespannung)} Schild-Bespannung geschrieben."
    )


def write_voelker_maxima_ts(wb):
    # Eigenschaften-Min/Max je Volk (Nutzer 2026-07-17, werte 0.8): Erstellungs-Min/-Max gelten
    # waehrend der Charaktererstellung, "Max (ab Kreis 3)" (einheitlich 31) danach - siehe
    # state/characterMutations.ts setValue().
    ws = wb["Voelker-Maxima"]
    rows = []
    for r in range(2, ws.max_row + 1):
        volk = ws.cell(row=r, column=1).value
        eigenschaft = ws.cell(row=r, column=2).value
        if not volk or not eigenschaft:
            continue
        rows.append({
            "volk": str(volk).strip(),
            "eigenschaft": str(eigenschaft).strip(),
            "erstellungsMin": ws.cell(row=r, column=3).value,
            "erstellungsMax": ws.cell(row=r, column=4).value,
            "maxAbKreis3": ws.cell(row=r, column=5).value,
            "sourceRow": r,
        })
    type_lines = [
        "export interface VoelkerMaximaRow {",
        "  volk: string;",
        "  eigenschaft: string;",
        "  erstellungsMin: number;",
        "  erstellungsMax: number;",
        "  maxAbKreis3: number;",
        "  sourceRow: number;",
        "}",
    ]
    path = write_json_backed_module(
        OUT_DATA_DIR, "voelkerMaxima", "VOELKER_MAXIMA", type_lines, "VoelkerMaximaRow[]", rows,
    )
    print(f"{path}: {len(rows)} Voelker-Maxima-Eintraege geschrieben.")


def main(xlsx_path):
    path = Path(xlsx_path)
    if not path.exists():
        raise SystemExit(f"Datei nicht gefunden: {path}")

    OUT_DATA_DIR.mkdir(parents=True, exist_ok=True)
    OUT_EQUIPMENT_DIR.mkdir(parents=True, exist_ok=True)

    wb = openpyxl.load_workbook(path, data_only=False)

    rules, warnings = read_rules(wb)
    rules_path = write_rules_ts(rules, warnings)
    print(f"{rules_path}: {len(rules)} Regeln geschrieben.")
    if warnings:
        print(f"{len(warnings)} Warnung(en):")
        for w in warnings:
            print(f"  - {w}")

    lookups_path = write_lookups_ts(wb)
    print(f"{lookups_path}: {len(LOOKUP_SHEETS)} Lookup-Tabellen geschrieben.")

    write_preisliste_ts(wb)
    write_artefakte_ts(wb)
    write_verfuegbarkeit_ts(wb)
    write_weapons_ts(wb)
    write_armor_ts(wb)
    write_shields_ts(wb)
    write_voelker_maxima_ts(wb)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print('Aufruf: python scripts/generate_data_ts.py "werte 0.7-claude.xlsx"')
        sys.exit(1)
    main(sys.argv[1])
