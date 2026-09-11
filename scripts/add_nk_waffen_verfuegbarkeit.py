# One-off: NK-Waffen Verfuegbarkeit (AW/NW) + Herstellerzuweisung, per den bestaetigten
# Grundentscheidungen 32-40 in nasus-spec/nasus-spec/04-Verfuegbarkeiten-und-Herkunftsorte.md.
# Schreibt NUR neue Spalten am Sheet-Ende an (keine Einfuegung) - bestehende formelbasierte
# Spaltenverweise anderswo im Workbook bleiben unberuehrt.
import sys
import openpyxl

PATH = sys.argv[1] if len(sys.argv) > 1 else "werte 0.8-claude.xlsx"

METALLLISTE_7 = "Dalkini, Draw, Elfen, Goblins, Orks, Trolle, Zwerge"

# ---------------------------------------------------------------------------
# NK-Material (Punkt 32/34): globale Materialreferenz, AW/NW + Herstellerzuweisung.
MATERIAL_AW_NW = {
    "Eisen": (1, 1), "Stahl": (1, 2), "Qualitätsstahl": (2, 4), "Faltstahl": (3, 5),
    "Mithril": (7, 7), "Kolharz": (5, 7), "Alchemistensilb.": (5, 6), "Nasium": (7, 7),
    "Diamantspat": (7, 7), "Adamandit": ("M", "M"), "Holz": (1, 1), "Knochen": (1, 1),
    "Stein": (1, 1), "Schwarzfels": (5, 1), "Leder": (1, 1), "Hartholz": (2, 2),
    "Vulkanglas": (7, 3), "Chitin": (5, 2), "Bronze": (1, 1),
}
MATERIAL_VOLK = {
    "Mithril": "Elfen, Zwerge", "Nasium": "Elfen, Zwerge",
    "Alchemistensilb.": "Dalkini, Elfen, Goblins, Orks, Zwerge",
    "Diamantspat": "Draw", "Schwarzfels": "Indianer, Katzen", "Vulkanglas": "Indianer, Katzen",
    "Kolharz": "Zentauren",
    "Eisen": METALLLISTE_7, "Stahl": METALLLISTE_7, "Qualitätsstahl": METALLLISTE_7,
    "Faltstahl": METALLLISTE_7, "Bronze": METALLLISTE_7, "Adamandit": METALLLISTE_7,
    "Holz": "ALLE", "Knochen": "ALLE", "Stein": "ALLE", "Leder": "ALLE", "Hartholz": "ALLE",
    "Chitin": "ALLE",
}
MATERIAL_RENAME = {"Kolhartz": "Kolharz", "Schwarzfells": "Schwarzfels"}

# ---------------------------------------------------------------------------
# NK-Fertigung (Punkt 35): identisch zur bestaetigten Schildfertigung.
FERTIGUNG_AW_NW = {
    "Ausschuss": (1, 1), "Goblin Massenfab.": (1, 1), "Massenfabrikation": (1, 1),
    "Gesellenarbeit": (1, 1), "Meisterarbeit": (2, 3), "Großmeisterarbeit": (3, 5),
    "Einzelstück": (7, 7),
}

# ---------------------------------------------------------------------------
# NK-Anpassung (Punkt 36): identisch zu den bestaetigten Ruestungswerten.
ANPASSUNG_AW_NW = {
    "Von der Stange": (1, 1), "angepasst": (2, 3), "Perfekt angepasst": (3, 5),
}

# ---------------------------------------------------------------------------
# NK-Schaftmaterial (Punkt 37): globale Materialreferenz je Metall, Verstaerkt/Voll aendern
# die Verfuegbarkeit nicht.
SCHAFT_AW_NW = {
    "Standard": (1, 1),
    "Eisen Verstärkt": (1, 1), "Eisen Voll": (1, 1),
    "Stahl Verstärkt": (1, 2), "Stahl Voll": (1, 2),
    "Qualitätsstahl": (2, 4), "Qualitätsstahl Voll": (2, 4),
    "Faltstahl Verstärkt": (3, 5), "Faltstahl Voll": (3, 5),
    "Mithril Verstärkt": (7, 7), "Mithril Voll": (7, 7),
    "Adamandit Verstärkt": ("M", "M"), "Adamandit Voll": ("M", "M"),
    "Bronze Verstärkt": (1, 1), "Bronze Voll": (1, 1),
}
SCHAFT_VOLK = {
    "Standard": "ALLE",
    "Mithril Verstärkt": "Elfen, Zwerge", "Mithril Voll": "Elfen, Zwerge",
    "Eisen Verstärkt": METALLLISTE_7, "Eisen Voll": METALLLISTE_7,
    "Stahl Verstärkt": METALLLISTE_7, "Stahl Voll": METALLLISTE_7,
    "Qualitätsstahl": METALLLISTE_7, "Qualitätsstahl Voll": METALLLISTE_7,
    "Faltstahl Verstärkt": METALLLISTE_7, "Faltstahl Voll": METALLLISTE_7,
    "Adamandit Verstärkt": METALLLISTE_7, "Adamandit Voll": METALLLISTE_7,
    "Bronze Verstärkt": METALLLISTE_7, "Bronze Voll": METALLLISTE_7,
}
SCHAFT_RENAME = {"Adamandit Verst.": "Adamandit Verstärkt", "Adamantit Voll": "Adamandit Voll"}

# ---------------------------------------------------------------------------
# NK-Waffen-Basis (Punkt 38/39/40): Grundverfuegbarkeit 1/1 fuer alle kaufbaren Zeilen,
# NICHT KAUFBAR fuer die 17 natuerlichen Angriffe/Kampfstile (per Waffe-Name identifiziert,
# nicht per Spezialisierung - "Ruestungsmodifikator"-Zeilen wie Eisenkappenstiefel/
# Veteranenhand bleiben trotz Spezialisierung=Unbewaffnet kaufbar, siehe Punkt 38 Wortlaut).
NICHT_KAUFBAR_WAFFEN = {"Unbewaffnet", "Biss", "Huftritt"}
NICHT_KAUFBAR_SPEZIALISIERUNGEN = {
    "Boxen", "Elfische Kunst der Selbstverteidigung", "Goblinische Kampfkunst",
    "Katzenmenschen Kampfkunst", "Orkisch' Raufen", "Ringen", "Schattenkampf",
}

# 17 der 20 in Punkt 39 genannten Datenzeilen sind eindeutig per Name identifizierbar (die
# uebrigen 3 gehoeren zur "doppelten Fertigkeitsfuehrung" von Armklingen elfisch/Bat'leth
# orkisch - diese zweite Zeile existiert im aktuellen Sheet nicht, wird hier NICHT erzeugt).
# "Trolltöter Widerhaken" bleibt ausdruecklich ALLE (Troll ist hier das Ziel, nicht der
# Hersteller). "Orkischer Kampfhandschuh" (Ruestungsmodifikator-Zeile) wird NICHT zugewiesen -
# Punkt 39 zaehlt nur "Waffenmodelle", nicht die Ruestungsmodifikator-Sonderzeilen.
WAFFEN_VOLK = {
    "Armklingen elfisch": "Elfen", "Streitaxt elfisch": "Elfen",
    "Bat'leth  orkisch": "Orks", "Dolch ork, Blutrinne": "Orks",
    "Dolch orkisch, breit": "Orks", "Dolch orkisch, mit 3 eingedrehten Klingen": "Orks",
    "Kriegsbeil orkisch ": "Orks", "Ork`sche": "Orks", "Ork-Flegel": "Orks",
    "Streitaxt orkisch": "Orks",
    "Doppelaxt zwergisch": "Zwerge", "Doppelbeil Zw. kurz ": "Zwerge",
    "Streitaxt goblinisch": "Goblins",
    "Dornenkeule  troll,": "Trolle", "Keule  troll,, eisenbeschlagen": "Trolle",
    "Trollaxt": "Trolle", "Trollschlegel": "Trolle",
}


def col_letter(idx):
    return openpyxl.utils.get_column_letter(idx)


def append_columns(ws, names):
    """Haengt neue Header ans Sheet-Ende an, gibt {name: column_index} zurueck."""
    start = ws.max_column + 1
    out = {}
    for i, name in enumerate(names):
        c = start + i
        ws.cell(row=1, column=c, value=name)
        out[name] = c
    return out


def find_col(ws, header):
    for c in range(1, ws.max_column + 1):
        if ws.cell(row=1, column=c).value == header:
            return c
    raise KeyError(header)


def main():
    wb = openpyxl.load_workbook(PATH)  # nicht read_only - wir schreiben.
    report = []

    # --- NK-Material ---------------------------------------------------
    ws = wb["NK-Material"]
    name_col = find_col(ws, "Waffe")
    volk_col = 11  # header-loser Volk-Spalte, siehe generate_data_ts.py header_overrides.
    cols = append_columns(ws, ["Verfuegbarkeit-AW", "Verfuegbarkeit-NW"])
    for r in range(2, ws.max_row + 1):
        raw_name = ws.cell(row=r, column=name_col).value
        if raw_name is None:
            continue
        stripped = raw_name.strip()
        name = MATERIAL_RENAME.get(stripped, stripped)
        if name != raw_name:
            ws.cell(row=r, column=name_col, value=name)
        aw, nw = MATERIAL_AW_NW[name]
        ws.cell(row=r, column=cols["Verfuegbarkeit-AW"], value=aw)
        ws.cell(row=r, column=cols["Verfuegbarkeit-NW"], value=nw)
        ws.cell(row=r, column=volk_col, value=MATERIAL_VOLK[name])
    report.append(f"NK-Material: {ws.max_row - 1} Zeilen aktualisiert")

    # --- NK-Fertigung ----------------------------------------------------
    ws = wb["NK-Fertigung"]
    name_col = find_col(ws, "Fertigung")
    cols = append_columns(ws, ["Verfuegbarkeit-AW", "Verfuegbarkeit-NW"])
    for r in range(2, ws.max_row + 1):
        name = ws.cell(row=r, column=name_col).value
        if name is None:
            continue
        aw, nw = FERTIGUNG_AW_NW[name.strip()]
        ws.cell(row=r, column=cols["Verfuegbarkeit-AW"], value=aw)
        ws.cell(row=r, column=cols["Verfuegbarkeit-NW"], value=nw)
    report.append(f"NK-Fertigung: {ws.max_row - 1} Zeilen aktualisiert")

    # --- NK-Anpassung ------------------------------------------------------
    ws = wb["NK-Anpassung"]
    name_col = find_col(ws, "Anpassung")
    cols = append_columns(ws, ["Verfuegbarkeit-AW", "Verfuegbarkeit-NW"])
    for r in range(2, ws.max_row + 1):
        name = ws.cell(row=r, column=name_col).value
        if name is None:
            continue
        aw, nw = ANPASSUNG_AW_NW[name.strip()]
        ws.cell(row=r, column=cols["Verfuegbarkeit-AW"], value=aw)
        ws.cell(row=r, column=cols["Verfuegbarkeit-NW"], value=nw)
    report.append(f"NK-Anpassung: {ws.max_row - 1} Zeilen aktualisiert")

    # --- NK-Schaftmaterial ---------------------------------------------
    ws = wb["NK-Schaftmaterial"]
    name_col = find_col(ws, "Verstärkung des Schafts")
    volk_col = find_col(ws, "Volk")
    cols = append_columns(ws, ["Verfuegbarkeit-AW", "Verfuegbarkeit-NW"])
    for r in range(2, ws.max_row + 1):
        raw_name = ws.cell(row=r, column=name_col).value
        if raw_name is None:
            continue
        stripped = raw_name.strip()
        name = SCHAFT_RENAME.get(stripped, stripped)
        if name != raw_name:
            ws.cell(row=r, column=name_col, value=name)
        aw, nw = SCHAFT_AW_NW[name]
        ws.cell(row=r, column=cols["Verfuegbarkeit-AW"], value=aw)
        ws.cell(row=r, column=cols["Verfuegbarkeit-NW"], value=nw)
        ws.cell(row=r, column=volk_col, value=SCHAFT_VOLK[name])
    report.append(f"NK-Schaftmaterial: {ws.max_row - 1} Zeilen aktualisiert")

    # --- NK-Waffen-Basis -------------------------------------------------
    ws = wb["NK-Waffen-Basis"]
    haupt_col = find_col(ws, "Hauptfertigkeit")
    spez_col = find_col(ws, "Spezialisierung")
    waffe_col = find_col(ws, "Waffe")
    volk_col = find_col(ws, "Volk")
    cols = append_columns(ws, ["Verfuegbarkeit-AW", "Verfuegbarkeit-NW"])
    kaufbar = 0
    nicht_kaufbar = 0
    volk_gesetzt = 0
    for r in range(2, ws.max_row + 1):
        waffe = ws.cell(row=r, column=waffe_col).value
        if waffe is None:
            continue
        spez = ws.cell(row=r, column=spez_col).value
        if waffe in NICHT_KAUFBAR_WAFFEN or spez in NICHT_KAUFBAR_SPEZIALISIERUNGEN:
            ws.cell(row=r, column=cols["Verfuegbarkeit-AW"], value="NICHT KAUFBAR")
            ws.cell(row=r, column=cols["Verfuegbarkeit-NW"], value="NICHT KAUFBAR")
            nicht_kaufbar += 1
            continue
        ws.cell(row=r, column=cols["Verfuegbarkeit-AW"], value=1)
        ws.cell(row=r, column=cols["Verfuegbarkeit-NW"], value=1)
        kaufbar += 1
        if waffe in WAFFEN_VOLK:
            ws.cell(row=r, column=volk_col, value=WAFFEN_VOLK[waffe])
            volk_gesetzt += 1
    report.append(
        f"NK-Waffen-Basis: {kaufbar} kaufbar (1/1), {nicht_kaufbar} NICHT KAUFBAR, "
        f"{volk_gesetzt} Volk-Zuweisungen gesetzt"
    )

    wb.save(PATH)
    print("\n".join(report))


if __name__ == "__main__":
    main()
