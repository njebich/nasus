"""LLM-031 (DEC-1402..DEC-1406, RC-107): neue Spalte 'Schadensart' (Scharf/Durchbohrend/Stumpf)
in NK-Waffen-Basis, Boegen, Armbrust und Feuerwaffen ergaenzen und befuellen.

Nicht klassifiziert (in DEC-1402..1406 nicht genannt -> leer gelassen, Rueckfrage an den Owner):
die Armklingen-Familienmitglieder Drei Langklauen/Klaue/Pranke/Zwei Klauen sowie die sieben
exotischen Unbewaffnet-Kampfstile (DEC-1200: out of scope). Blasrohre: eigener Katalog, ausgenommen.
Auskommentierte ('#') Zeilen bleiben ohne Wert.
"""
import re
import sys
from copy import copy
from pathlib import Path

ROOT = Path(r"E:\Das Western Rollenspiel\LLM")
sys.path.insert(0, str(ROOT / ".python-deps"))
sys.path.insert(0, str(ROOT / "scripts"))
from openpyxl import load_workbook
from backup_werte import backup

WERTE = ROOT / "werte 0.8-claude.xlsx"
SCH, DUR, STU = "Scharf", "Durchbohrend", "Stumpf"


def norm(text):
    return re.sub(r"[^0-9a-zäöüß]", "", str(text).lower())


def nk_schadensart(haupt, spez, name):
    """Gibt (Wert|None) zurueck; None = bewusst unklassifiziert; wirft bei unbekanntem Fall."""
    n = norm(name)
    if haupt == "Hiebwaffen":
        if spez == "Äxte":
            return SCH
        if spez == "Beidhand-Hiebwaffen":
            if n in {"barbarendoppelaxt", "berdysch", "langaxt", "langberdysch", "trollaxt"}:
                return SCH
            return STU
        if spez in ("Stumpfe Hiebwaffen", "Kettenwaffen"):
            return STU
    elif haupt == "Klingenwaffen":
        return DUR if n.startswith("wolfsmesser") else SCH
    elif haupt == "Stichwaffen":
        if spez == "Dolche":
            return SCH if n == "sichel" else DUR
        if spez == "Fechtwaffen":
            if n in {"gladius", "gladiusmitgriffkorb", "gladiuskurz", "kurzschwert", "wakizashi",
                     "armklingen", "panzerarmmitklinge"} or n.startswith("ninjat"):
                return SCH
            return DUR
    elif haupt == "Stangenwaffen":
        if spez == "Hellebarden":
            return SCH
        if spez == "Lanzen":
            return DUR
        if spez == "Speere":
            return SCH if n in {"glefe", "naginata"} else DUR
        if spez == "Stäbe":
            return STU if n.startswith("kampfstab") or n.startswith("stab60cm") else SCH
    elif haupt == "Unbewaffnet":
        if spez == "Armklingen":
            if n in {"armklingen", "armklingenelfisch", "panzerarmmitklinge"}:
                return SCH
            if n == "orchidee5klingen":
                return DUR
            if n == "tonfa":
                return STU
            return None  # Klauen-Familie: nicht in DEC-1403 genannt
        if spez == "Messer":
            return SCH if n in {"enterhakenohneseil", "sichel"} else DUR
        if spez in ("Schild", "Unbewaffnet"):
            return STU
        if spez == "Peitschen":
            return SCH if "dornen" in n else STU
        return None  # exotische Kampfstile (DEC-1200)
    raise SystemExit(f"Unbekannter Fall: {haupt}/{spez}/{name}")


def add_column(ws):
    col = ws.max_column + 1
    header = ws.cell(1, ws.max_column)
    new = ws.cell(1, col, "Schadensart")
    new._style = copy(header._style)
    ws.column_dimensions[new.column_letter].width = 14
    return col


def main():
    wb = load_workbook(WERTE)
    for s in ("NK-Waffen-Basis", "Boegen", "Armbrust", "Feuerwaffen"):
        if "Schadensart" in [c.value for c in wb[s][1]]:
            raise SystemExit(f"{s} hat bereits eine Schadensart-Spalte")
    print("Backup:", backup(str(WERTE)))
    stats = {}

    ws = wb["NK-Waffen-Basis"]
    h = {c.value: c.column for c in ws[1] if c.value}
    col = add_column(ws)
    leer = []
    for r in range(2, ws.max_row + 1):
        name = ws.cell(r, h["Waffe"]).value
        if name is None:
            continue
        if str(name).startswith("#"):
            continue
        val = nk_schadensart(ws.cell(r, h["Hauptfertigkeit"]).value, ws.cell(r, h["Spezialisierung"]).value, name)
        if val is None:
            leer.append(f"Z.{r} {ws.cell(r, h['Spezialisierung']).value}/{name}")
            continue
        ws.cell(r, col, val)
        stats[val] = stats.get(val, 0) + 1
    print("NK-Waffen-Basis:", stats, "| ohne Wert:", len(leer))
    for item in leer:
        print("  leer:", item)

    for sheet in ("Boegen", "Armbrust", "Feuerwaffen"):
        ws = wb[sheet]
        col = add_column(ws)
        n = {STU: 0, DUR: 0}
        for r in range(2, ws.max_row + 1):
            name = ws.cell(r, 1).value
            if name is None:
                continue
            val = STU if norm(name) == "balläster" else DUR
            ws.cell(r, col, val)
            n[val] += 1
        print(f"{sheet}:", n)
    wb.save(WERTE)


if __name__ == "__main__":
    main()
