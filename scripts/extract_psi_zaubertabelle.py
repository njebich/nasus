"""Extrahiert die Tabellenspalten (Eig./ST.1-7/RW/W.dauer/E.zeit/MpZ/Wirkung) fuer alle 15
PSI-Werte aus der Originalquelle "PSI Magie Zaubertabelle 1.42.docx" (Sheet/Tabelle existiert nur
als Word-Tabelle, nicht in werte-0.8-claude.xlsx - Nutzer 2026-07-21: "i see no wirkung in the
xlsx. Wirkung can be found in psi magie zaubertabelle 1.42").

Schreibt src/data/psiZaubertabelle.json (Begleit-Datei, analog spruchmagieDetails.json/
KI_DAUER/kiFaehigkeiten.ts) - die xlsx bleibt alleinige Quelle fuer die Kern-Werte (art/eigBonus/
kostenRaw/mindestTaw/parent, siehe psi.jsonl), diese Datei liefert nur zusaetzliche Anzeigespalten
fuer views/psi.ts.

pandoc/python-docx sind in dieser Umgebung nicht installiert (siehe Memory
reference-nasus-rules-doc) - .docx ist ein ZIP aus XML, daher direktes Parsen von
word/document.xml per xml.etree (Stdlib, keine Zusatz-Dependency).

Aufruf:
    python scripts/extract_psi_zaubertabelle.py
"""
import json
import re
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

SOURCE_DOCX = Path(
    r"E:\Das Western Rollenspiel\_Aktuelle Daten\Nasus\Nasus Nasus das Western Rollenspiel"
    r"\Die Magie\PSI-Magie\PSI Magie Zaubertabelle 1.42.docx"
)
OUT_JSON = Path(__file__).parent.parent / "src" / "data" / "psiZaubertabelle.json"
RULES_JSON = Path(__file__).parent.parent / "src" / "data" / "rules.json"

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


def qn(tag: str) -> str:
    prefix, local = tag.split(":")
    return f"{{{NS[prefix]}}}{local}"


def cell_text(tc: ET.Element) -> str:
    paragraphs = []
    for p in tc.findall(qn("w:p")):
        parts = [t.text or "" for t in p.iter(qn("w:t"))]
        paragraphs.append("".join(parts))
    return "\n".join(p for p in paragraphs if p.strip() != "").strip()


def cell_vmerge(tc: ET.Element) -> str | None:
    tcPr = tc.find(qn("w:tcPr"))
    if tcPr is not None:
        vm = tcPr.find(qn("w:vMerge"))
        if vm is not None:
            return vm.get(qn("w:val")) or "continue"
    return None


# Name, wie er (zeilenumbruchbereinigt) in der Word-Tabelle steht -> Referenz aus psi.jsonl.
NAME_TO_REFERENZ = {
    "Telekinese": "psi_telekinese",
    "TelekineseGriff": "psi_telekinese_griff",
    "HöhereTelekinese": "psi_hoehere_telekinese",
    "TelekinetischesGeschoss": "psi_telekinetisches_geschoss",
    "Geschosseablenken": "psi_geschosse_ablenken",
    "Deformation": "psi_deformation",
    "Destruktion": "psi_destruktion",
    "Empathie": "psi_empathie",
    "Suggestion": "psi_suggestion",
    "Im Schattenverstecken": "psi_im_schatten_verstecken",
    "Im Waldverstecken": "psi_im_wald_verstecken",
    "In der Menge verstecken": "psi_in_der_menge_verstecken",
    "In der Ferneverstecken": "psi_in_der_ferne_verstecken",
    "Pyrokinese": "psi_pyrokinese",
    "Kryokinese": "psi_kryokinese",
}


def parse_tables(document_xml: bytes) -> list[list[list[dict]]]:
    root = ET.fromstring(document_xml)
    body = root.find(qn("w:body"))
    tables = []
    for tbl in body.iter(qn("w:tbl")):
        rows = []
        for tr in tbl.findall(qn("w:tr")):
            cells = []
            for tc in tr.findall(qn("w:tc")):
                cells.append({"text": cell_text(tc), "vmerge": cell_vmerge(tc)})
            rows.append(cells)
        tables.append(rows)
    return tables


def main() -> None:
    with zipfile.ZipFile(SOURCE_DOCX) as zf:
        document_xml = zf.read("word/document.xml")
    tables = parse_tables(document_xml)

    result: dict[str, dict] = {}
    # zuletzt gesehene Wirkung je Tabelle - fuer vMerge="continue"-Zellen (die 4 "verstecken"-
    # Faehigkeiten in Tabelle 2 teilen sich EINEN Wirkungstext, siehe vMerge restart/continue).
    last_wirkung: str | None = None

    # Tabelle 0 ist nur der schwarze "PSI Magie"-Titelbalken - ueberspringen.
    for table in tables[1:]:
        header = [c["text"] for c in table[0]]
        is_headered = header and header[0] == "Name"
        data_rows = table[1:] if is_headered else table
        i = 0
        while i < len(data_rows):
            row = data_rows[i]
            name_cell = row[0]["text"].replace("\n", "")
            if name_cell == "":
                # Fortsetzungszeile (Wirkung ueber gridSpan) einer vorherigen Namenszeile - kommt
                # in Tabelle 1 (Telekinese-Ast) vor, wo Wirkung eine eigene Zeile statt eigener
                # Spalte ist. Wird unten schon mitgelesen (siehe wirkung_row), hier ueberspringen.
                i += 1
                continue

            referenz = NAME_TO_REFERENZ.get(name_cell)
            if referenz is None:
                raise SystemExit(f"Unbekannter PSI-Name in Zaubertabelle: {name_cell!r}")

            cells = [c["text"].replace("\n", " / ") for c in row]
            eig, st1, st2, st3, st4, st5, st6, st7, rw, wd, ed, mpz = cells[1:13]

            if len(row) >= 14:
                # Tabelle 2: Wirkung ist Spalte 14 (eigene Zelle je Zeile, ggf. vertikal gemerged).
                wirkung_cell = row[13]
                if wirkung_cell["vmerge"] == "continue" or wirkung_cell["text"] == "" and wirkung_cell["vmerge"] is not None:
                    wirkung = last_wirkung or ""
                else:
                    wirkung = wirkung_cell["text"].replace("\n", " / ")
                last_wirkung = wirkung
                i += 1
            else:
                # Tabelle 1: Wirkung steht in der naechsten Zeile (gridSpan=12, Spalte 2).
                wirkung_row = data_rows[i + 1]
                wirkung = wirkung_row[1]["text"].replace("\n", " / ")
                i += 2

            result[referenz] = {
                "st1": st1, "st2": st2, "st3": st3, "st4": st4, "st5": st5, "st6": st6, "st7": st7,
                "rw": rw, "wd": wd, "ed": ed, "mpz": mpz, "wirkung": wirkung,
            }

    rules = json.loads(RULES_JSON.read_text(encoding="utf-8"))
    psi_referenzen = {r["referenz"] for r in rules if r.get("kategorie") == "PSI" and r.get("art") == "Wert"}
    missing = psi_referenzen - result.keys()
    extra = result.keys() - psi_referenzen
    if missing:
        raise SystemExit(f"PSI-Referenzen ohne Zaubertabellen-Eintrag: {sorted(missing)}")
    if extra:
        raise SystemExit(f"Zaubertabellen-Eintraege ohne PSI-Referenz in rules.json: {sorted(extra)}")

    OUT_JSON.write_text(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
    print(f"OK: {len(result)} PSI-Werte -> {OUT_JSON}")


if __name__ == "__main__":
    main()
