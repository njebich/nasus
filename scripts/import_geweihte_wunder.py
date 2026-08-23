"""Import the Geweihte-Wunder sheet from werte 0.8-claude.xlsx.

The Werte workbook is the single source for the client-side miracle table. This
importer intentionally uses only Python's standard library, so it adds no dependency.

Usage: python scripts/import_geweihte_wunder.py
"""
import json
import re
import zipfile
from pathlib import Path, PurePosixPath
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'werte 0.8-claude.xlsx'
DEST = ROOT / 'src' / 'data' / 'geweihteWunder.ts'
SHEET_NAME = 'Geweihte-Wunder'

HEADERS = {
    'Typ': 'typ',
    'Name': 'name',
    'Gebet': 'gebet',
    'Wirkung': 'wirkung',
    'Ziel': 'ziel',
    'RW': 'rw',
    'VD': 'vd',
    'ED': 'ed',
    'WD': 'wd',
    'MinKarma': 'minKarma',
    'Malus': 'malus',
    'KPP': 'kpp',
}

NS_MAIN = {'x': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
NS_REL = {'r': 'http://schemas.openxmlformats.org/package/2006/relationships'}
REL_ID = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id'


def column_index(reference: str) -> int:
    letters = re.match(r'[A-Z]+', reference).group(0)
    result = 0
    for letter in letters:
        result = result * 26 + ord(letter) - ord('A') + 1
    return result - 1


def text_content(element: ET.Element | None) -> str:
    if element is None:
        return ''
    return ''.join(node.text or '' for node in element.iterfind('.//x:t', NS_MAIN))


def read_sheet_rows(path: Path, sheet_name: str) -> list[list[object]]:
    with zipfile.ZipFile(path) as archive:
        workbook = ET.fromstring(archive.read('xl/workbook.xml'))
        sheet = next(
            (item for item in workbook.findall('x:sheets/x:sheet', NS_MAIN)
             if item.attrib.get('name') == sheet_name),
            None,
        )
        if sheet is None:
            raise ValueError(f'Arbeitsblatt {sheet_name!r} fehlt in {path.name}')

        relationships = ET.fromstring(archive.read('xl/_rels/workbook.xml.rels'))
        targets = {item.attrib['Id']: item.attrib['Target'] for item in relationships.findall('r:Relationship', NS_REL)}
        target = targets[sheet.attrib[REL_ID]].lstrip('/')
        sheet_path = target if target.startswith('xl/') else str(PurePosixPath('xl') / target)

        shared_strings: list[str] = []
        if 'xl/sharedStrings.xml' in archive.namelist():
            shared = ET.fromstring(archive.read('xl/sharedStrings.xml'))
            shared_strings = [text_content(item) for item in shared.findall('x:si', NS_MAIN)]

        sheet_xml = ET.fromstring(archive.read(sheet_path))
        rows: list[list[object]] = []
        for row in sheet_xml.findall('x:sheetData/x:row', NS_MAIN):
            values: list[object] = []
            for cell in row.findall('x:c', NS_MAIN):
                index = column_index(cell.attrib['r'])
                while len(values) <= index:
                    values.append('')
                cell_type = cell.attrib.get('t')
                value_node = cell.find('x:v', NS_MAIN)
                raw = value_node.text if value_node is not None and value_node.text is not None else ''
                if cell_type == 's':
                    value: object = shared_strings[int(raw)]
                elif cell_type == 'inlineStr':
                    value = text_content(cell.find('x:is', NS_MAIN))
                elif cell_type == 'b':
                    value = raw == '1'
                elif cell_type in {'str', 'e'}:
                    value = raw
                elif raw == '':
                    value = ''
                else:
                    number = float(raw)
                    value = int(number) if number.is_integer() else number
                values[index] = value
            rows.append(values)
        return rows


def main() -> None:
    rows = read_sheet_rows(SRC, SHEET_NAME)
    if not rows:
        raise ValueError(f'{SHEET_NAME!r} ist leer')
    headers = [str(value).strip() for value in rows[0]]
    if headers != list(HEADERS):
        raise ValueError(f'Unerwartete Spalten: {headers!r}')

    entries = []
    for row_number, values in enumerate(rows[1:], start=2):
        values += [''] * (len(headers) - len(values))
        raw = dict(zip(headers, values))
        if not any(value != '' for value in raw.values()):
            continue
        entry = {field: raw[header] for header, field in HEADERS.items()}
        for field in ('minKarma', 'malus'):
            if not isinstance(entry[field], (int, float)):
                raise ValueError(f'{field} muss in Zeile {row_number} numerisch sein')
            entry[field] = int(entry[field])
        for field in ('typ', 'name', 'gebet', 'wirkung', 'ziel', 'rw', 'vd', 'ed', 'wd', 'kpp'):
            entry[field] = str(entry[field])
        entries.append(entry)

    if len(entries) != 60:
        raise ValueError(f'Erwarte 60 Wunder, bekam {len(entries)}')
    if any(not entry['name'] for entry in entries):
        raise ValueError('Alle Wunder muessen einen Namen haben')

    ts = (
        "// Generiert aus dem Tab Geweihte-Wunder in werte 0.8-claude.xlsx via scripts/import_geweihte_wunder.py - nicht von Hand bearbeiten.\n"
        "// Die Werte-Arbeitsmappe ist die gepflegte Quelle fuer alle 60 Wunder. KPP bleibt Rohtext,\n"
        "// da neben Zahlen auch Formeln vorkommen (z.B. 'Karma * 10').\n\n"
        "export interface GeweihterWunderEintrag {\n"
        "  typ: string;\n"
        "  name: string;\n"
        "  gebet: string;\n"
        "  wirkung: string;\n"
        "  ziel: string;\n"
        "  rw: string;\n"
        "  vd: string;\n"
        "  ed: string;\n"
        "  wd: string;\n"
        "  minKarma: number;\n"
        "  malus: number;\n"
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
