"""
Sicherheitskopie einer werte-*.xlsx anlegen.

Aufruf:
    python scripts/backup_werte.py "werte 0.7-claude.xlsx"

Legt eine Kopie mit Zeitstempel im Ordner "backups/" an, z.B.:
    backups/werte 0.7-claude_2026-07-16_1432.xlsx

Nichts an der Originaldatei wird veraendert.
"""
import sys
import shutil
from pathlib import Path
from datetime import datetime


def backup(werte_path: str) -> Path:
    src = Path(werte_path)
    if not src.exists():
        raise SystemExit(f"Datei nicht gefunden: {src}")

    backup_dir = src.parent / "backups"
    backup_dir.mkdir(exist_ok=True)

    timestamp = datetime.now().strftime("%Y-%m-%d_%H%M")
    dest = backup_dir / f"{src.stem}_{timestamp}{src.suffix}"

    shutil.copy2(src, dest)
    return dest


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Aufruf: python scripts/backup_werte.py \"werte 0.7-claude.xlsx\"")
        sys.exit(1)

    dest = backup(sys.argv[1])
    print(f"Sicherheitskopie angelegt: {dest}")
