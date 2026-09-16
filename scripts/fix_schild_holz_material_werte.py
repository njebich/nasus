"""LLM-019: Schild-Material Holz/Hartholz falsch bepreist/bemalust korrigieren.

DEC-1212 (Preis-Faktor) / DEC-1215 (Staerke-Malus-Mod): beide Holz-Materialien
weichen von der parallelen Waffen-Material-Tabelle ab (dort matchen 17/19
gemeinsame Materialien exakt), nur diese zwei Zeilen im Sheet "Schild-Material"
waren falsch:
  - Hart Holz Preis-Faktor: 3 -> 0.3 (Kommastellen-Fehler, machte Hartholz 3x
    teurer als Eisen statt 17x billiger wie in der Waffentabelle).
  - Holz Staerke-Malus-Mod: -6 -> -3.
  - Hart Holz Staerke-Malus-Mod: -5 -> -2 (beide bislang exakt Faktor 2 zu stark).
"""
import shutil
import sys
from datetime import datetime
from pathlib import Path

import openpyxl

XLSX_PATH = Path(r"E:\Das Western Rollenspiel\LLM\werte 0.8-claude.xlsx")


def main():
    backup_path = XLSX_PATH.with_name(
        f"werte 0.8-claude_backup_{datetime.now():%Y-%m-%d_%H%M}.xlsx"
    )
    shutil.copy2(XLSX_PATH, backup_path)
    print(f"Backup angelegt: {backup_path}")

    wb = openpyxl.load_workbook(XLSX_PATH, data_only=False)
    ws = wb["Schild-Material"]

    holz = ws.cell(row=2, column=1).value
    hart_holz = ws.cell(row=3, column=1).value
    assert holz == "Holz", f"Zeile 2 ist nicht 'Holz', sondern {holz!r}"
    assert hart_holz == "Hart Holz", f"Zeile 3 ist nicht 'Hart Holz', sondern {hart_holz!r}"

    assert ws.cell(row=2, column=2).value == -6
    ws.cell(row=2, column=2).value = -3

    assert ws.cell(row=3, column=2).value == -5
    ws.cell(row=3, column=2).value = -2

    assert ws.cell(row=3, column=10).value == 3
    ws.cell(row=3, column=10).value = 0.3

    wb.save(XLSX_PATH)
    print("Schild-Material Holz/Hart Holz korrigiert.")


if __name__ == "__main__":
    sys.exit(main())
