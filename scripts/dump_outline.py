from __future__ import annotations

from itertools import count
from pathlib import Path
import sys

from docx import Document


def main() -> None:
    if len(sys.argv) < 2:
        candidates = [p for p in Path.cwd().glob("*.docx") if "новожилов" in p.name.lower()]
        if not candidates:
            print("Usage: python scripts/dump_outline.py <docx_path>")
            return
        path = candidates[0]
    else:
        path = Path(sys.argv[1]).expanduser()
    if not path.is_file():
        print(f"File not found: {path}")
        return
    doc = Document(str(path))
    for i, p in zip(count(), doc.paragraphs):
        text = p.text.strip()
        if not text:
            continue
        style = p.style.name if p.style else ""
        print(f"{i:04d} | {style} | {text}")


if __name__ == "__main__":
    main()
