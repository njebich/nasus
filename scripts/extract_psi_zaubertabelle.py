"""Extrahiert die überarbeitete PSI-Zaubertabelle 1.421 aus der XLSX-Quelle.

Die Arbeitsmappe enthält je PSI-Wert Stammdaten, Zeit-/Reichweitenwerte und für jede der
sieben Zauberstufen getrennte Angaben für Erschwerung, MbS und Wirkung. Die erzeugte JSON-Datei
wird von ``src/views/psi.ts`` angezeigt.

Die XLSX wird als Open-XML-ZIP mit der Python-Standardbibliothek gelesen. Dadurch bleibt der
Importer ohne zusätzliche Projektabhängigkeiten ausführbar.

Aufruf:
    python scripts/extract_psi_zaubertabelle.py
"""
import json
import re
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path


SOURCE_XLSX = Path(
    r"E:\Das Western Rollenspiel\_Aktuelle Daten\Nasus\Nasus Nasus das Western Rollenspiel"
    r"\Die Magie\PSI-Magie\PSI_Magie_Zaubertabelle_1_421.xlsx"
)
OUT_JSON = Path(__file__).parent.parent / "src" / "data" / "psiZaubertabelle.json"
RULES_JSON = Path(__file__).parent.parent / "src" / "data" / "rules.json"

NS = {"x": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}

NAME_TO_REFERENZ = {
    "Telekinese": "psi_telekinese",
    "Telekinese Griff": "psi_telekinese_griff",
    "Höhere Telekinese": "psi_hoehere_telekinese",
    "Telekinetisches Geschoss": "psi_telekinetisches_geschoss",
    "Geschosse ablenken": "psi_geschosse_ablenken",
    "Deformation": "psi_deformation",
    "Destruktion": "psi_destruktion",
    "Empathie": "psi_empathie",
    "Suggestion": "psi_suggestion",
    "Im Schatten verstecken": "psi_im_schatten_verstecken",
    "Im Wald verstecken": "psi_im_wald_verstecken",
    "In der Menge verstecken": "psi_in_der_menge_verstecken",
    "In der Ferne verstecken": "psi_in_der_ferne_verstecken",
    "Pyrokinese": "psi_pyrokinese",
    "Kryokinese": "psi_kryokinese",
}


def column_index(cell_reference: str) -> int:
    letters = re.match(r"[A-Z]+", cell_reference)
    if letters is None:
        raise ValueError(f"Ungültige Zellreferenz: {cell_reference!r}")
    value = 0
    for char in letters.group(0):
        value = value * 26 + ord(char) - ord("A") + 1
    return value - 1


def cell_value(cell: ET.Element) -> str:
    inline = cell.find("x:is", NS)
    if inline is not None:
        return "".join(text.text or "" for text in inline.iterfind(".//x:t", NS)).strip()
    value = cell.find("x:v", NS)
    if value is None or value.text is None:
        return ""
    raw = value.text.strip()
    if cell.get("t") == "n":
        try:
            number = float(raw)
            return str(int(number)) if number.is_integer() else str(number)
        except ValueError:
            pass
    return raw


def read_rows(xlsx: Path) -> list[list[str]]:
    with zipfile.ZipFile(xlsx) as archive:
        root = ET.fromstring(archive.read("xl/worksheets/sheet1.xml"))
    result: list[list[str]] = []
    for row in root.findall(".//x:sheetData/x:row", NS):
        values = [""] * 32
        for cell in row.findall("x:c", NS):
            index = column_index(cell.get("r", ""))
            if index < len(values):
                values[index] = cell_value(cell)
        result.append(values)
    return result


def main() -> None:
    rows = read_rows(SOURCE_XLSX)
    expected_headers = [
        "Name", "Regeltext", "Aurabann", "Ziel", "Eig.", "RW", "VD", "ED", "W.dauer",
        "Erholungszeit EZ in KR", "MpZ",
    ]
    if len(rows) < 3 or rows[1][:11] != expected_headers:
        raise SystemExit("Unerwartete Spaltenstruktur in PSI-Zaubertabelle 1.421")

    result: dict[str, dict] = {}
    for row in rows[2:]:
        name = row[0]
        if not name:
            continue
        referenz = NAME_TO_REFERENZ.get(name)
        if referenz is None:
            raise SystemExit(f"Unbekannter PSI-Name in Zaubertabelle: {name!r}")
        if referenz in result:
            raise SystemExit(f"Doppelter PSI-Eintrag: {referenz}")

        stufen = []
        for stufe in range(7):
            start = 11 + stufe * 3
            stufen.append({
                "erschwerung": row[start],
                "mbs": row[start + 1],
                "wirkung": row[start + 2],
            })

        result[referenz] = {
            "regeltext": row[1],
            "aurabann": row[2],
            "ziel": row[3],
            "eig": row[4],
            "rw": row[5],
            "vd": row[6],
            "ed": row[7],
            "wirkungsdauer": row[8],
            "erholungszeit": row[9],
            "mpz": row[10],
            "stufen": stufen,
        }

    rules = json.loads(RULES_JSON.read_text(encoding="utf-8"))
    psi_referenzen = {
        rule["referenz"] for rule in rules
        if rule.get("kategorie") == "PSI" and rule.get("art") == "Wert"
    }
    missing = psi_referenzen - result.keys()
    extra = result.keys() - psi_referenzen
    if missing:
        raise SystemExit(f"PSI-Referenzen ohne Zaubertabellen-Eintrag: {sorted(missing)}")
    if extra:
        raise SystemExit(f"Zaubertabellen-Einträge ohne PSI-Referenz in rules.json: {sorted(extra)}")

    OUT_JSON.write_text(
        json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    print(f"OK: {len(result)} PSI-Werte aus Version 1.421 -> {OUT_JSON}")


if __name__ == "__main__":
    main()
