"""One-off: parse Paladin-Geweihtensystem_Wundertabellen.txt (markdown table, root of repo)
into src/data/geweihteWunder.ts. This is a hand-supplied reference doc, NOT part of the
werte-xlsx codegen pipeline (see project_werte_xlsx_schema memory convention: sheets like
Trefferzonentabelle/PSI-Zaubertabelle that come from a docx/txt instead of the xlsx get their
own one-off script, same pattern here).

Usage: python scripts/import_geweihte_wunder.py
"""
import json
import re
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / 'Paladin-Geweihtensystem_Wundertabellen.txt'
DEST = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'geweihteWunder.ts'

FIELDS = ['typ', 'name', 'art', 'malus', 'minKarma', 'rw', 'vd', 'wd', 'wirkung', 'kpp']


def parse_int_or_none(s: str):
    s = s.strip()
    if not s:
        return None
    try:
        return int(s)
    except ValueError:
        return None


def clean_text(s: str) -> str:
    s = s.strip()
    s = s.replace('<br>', '\n')
    return s


def main():
    lines = SRC.read_text(encoding='utf-8').splitlines()
    # Zeile 1 = Titel-Kommentar, Zeile 3 = Header, Zeile 4 = Trenner ('---'), Datenzeilen ab 5.
    data_lines = [ln for ln in lines[4:] if ln.strip().startswith('|')]

    entries = []
    for ln in data_lines:
        # Fuehrendes/abschliessendes '|' entfernen, dann an '|' splitten.
        cells = ln.strip().strip('|').split('|')
        if len(cells) != len(FIELDS):
            raise ValueError(f'Erwarte {len(FIELDS)} Spalten, bekam {len(cells)}: {ln!r}')
        raw = {f: clean_text(c) for f, c in zip(FIELDS, cells)}
        entry = {
            'typ': raw['typ'],
            'name': raw['name'],
            'art': raw['art'],
            'malus': parse_int_or_none(raw['malus']),
            'minKarma': parse_int_or_none(raw['minKarma']),
            'rw': raw['rw'],
            'vd': raw['vd'],
            'wd': raw['wd'],
            'wirkung': raw['wirkung'],
            'kpp': raw['kpp'],
        }
        entries.append(entry)

    ts = (
        "// Generiert aus Paladin-Geweihtensystem_Wundertabellen.txt via "
        "scripts/import_geweihte_wunder.py - nicht von Hand bearbeiten.\n"
        "// malus/minKarma sind Zahlen wo vorhanden (steuern die Probe-Berechnung/Min.Karma-Sperre\n"
        "// in views/geweihte.ts), sonst null (2 unvollstaendige Platzhalter-Zeilen in der Quelle,\n"
        "// z.B. 'Platzhalter fuer Baumformung'). kpp bleibt Rohtext, da manche Zeilen eine Formel\n"
        "// statt einer Zahl tragen (z.B. 'Karma * 10' bei Heilige Ruestung).\n\n"
        "export interface GeweihterWunderEintrag {\n"
        "  typ: string;\n"
        "  name: string;\n"
        "  art: string;\n"
        "  malus: number | null;\n"
        "  minKarma: number | null;\n"
        "  rw: string;\n"
        "  vd: string;\n"
        "  wd: string;\n"
        "  wirkung: string;\n"
        "  kpp: string;\n"
        "}\n\n"
        "export const GEWEIHTE_WUNDER: GeweihterWunderEintrag[] = "
        + json.dumps(entries, ensure_ascii=False, indent=2)
        + ';\n'
    )
    DEST.write_text(ts, encoding='utf-8')
    print(f'{len(entries)} Wunder-Eintraege geschrieben nach {DEST}')


if __name__ == '__main__':
    main()
