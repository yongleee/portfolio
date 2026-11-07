"""Check a portfolio project's SVG artwork before it ships.

Usage:
    python3 -I check_artwork.py public/projects/<slug> [--forbid TERM ...]

Checks, in order:
  1. every .svg in the folder parses as XML
  2. each file's viewBox ratio matches the slot its name starts with (warning only:
     ProjectPage.tsx / Projects.tsx are the source of truth for slot ratios)
  3. no forbidden term appears in a file name or in SVG text/comments (case-insensitive)
  4. every /projects/<slug>/... path in src/config.ts exists on disk

Exits 1 if any hard check (1, 3, 4) fails.
"""

import argparse
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

# Width/height ratio per slot, by file-name prefix. Keep in sync with the aspect classes
# in ProjectPage.tsx (hero 16/7, feeds 16/10, process 4/3) and the h-44 work-log card.
SLOT_RATIOS = {
    "card": 1200 / 352,
    "hero": 16 / 7,
    "architecture": 16 / 10,
    "detail": 16 / 10,
    "process": 4 / 3,
}
RATIO_TOLERANCE = 0.03


def slot_for(name: str) -> str | None:
    return next((slot for slot in SLOT_RATIOS if name.startswith(slot)), None)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("folder", type=Path, help="public/projects/<slug>")
    parser.add_argument("--forbid", nargs="*", default=[], help="terms that must not appear")
    args = parser.parse_args()

    folder: Path = args.folder.resolve()
    if not folder.is_dir():
        print(f"FAIL  {folder} is not a directory")
        return 1

    failed = False
    forbid = [t.lower() for t in args.forbid if t]
    svgs = sorted(folder.glob("*.svg"))
    if not svgs:
        print(f"FAIL  no .svg files in {folder}")
        return 1

    for svg in svgs:
        raw = svg.read_text(encoding="utf-8")

        try:
            root = ET.fromstring(raw)
        except ET.ParseError as e:
            print(f"FAIL  {svg.name}: invalid XML ({e})")
            failed = True
            continue

        slot = slot_for(svg.stem)
        box = root.get("viewBox", "").split()
        if slot and len(box) == 4:
            ratio = float(box[2]) / float(box[3])
            want = SLOT_RATIOS[slot]
            if abs(ratio - want) / want > RATIO_TOLERANCE:
                print(f"warn  {svg.name}: ratio {ratio:.2f}, slot '{slot}' expects {want:.2f}")
        elif not slot:
            print(f"warn  {svg.name}: name doesn't start with a slot ({', '.join(SLOT_RATIOS)})")

        haystack = f"{svg.name}\n{raw}".lower()
        for term in forbid:
            if term in haystack:
                print(f"FAIL  {svg.name}: contains forbidden term '{term}'")
                failed = True

    for term in forbid:
        if term in folder.name.lower():
            print(f"FAIL  folder name '{folder.name}' contains forbidden term '{term}'")
            failed = True

    # public/projects/<slug> -> repo root is three levels up.
    config = folder.parents[2] / "src" / "config.ts"
    if config.is_file():
        paths = re.findall(rf"['\"](/projects/{re.escape(folder.name)}/[^'\"]+)['\"]", config.read_text())
        if not paths:
            print(f"warn  src/config.ts references no /projects/{folder.name}/ paths")
        for p in paths:
            if not (folder.parents[1] / p.lstrip("/")).is_file():
                print(f"FAIL  config.ts points at missing file {p}")
                failed = True
    else:
        print(f"warn  {config} not found; skipped path check")

    print(f"{'FAILED' if failed else 'OK'}  checked {len(svgs)} SVGs in {folder.name}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
