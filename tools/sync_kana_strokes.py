"""Vendor official AnimCJK kana stroke-order SVGs, pinned to an upstream commit.

Kana SVG graphics are AnimCJK © FM-SH, available under LGPL-3.0-or-later.
See licenses/ANIMCJK.md and licenses/LGPL-3.0.txt.
No runtime dependency on upstream/CDN. Only run manually for intentional updates.
"""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import json
import re
import urllib.request
import xml.etree.ElementTree as ET

SOURCE_COMMIT = "ec5e17cca76c87587790bcbce5ea0b4d4fb753d6"
BASE = f"https://raw.githubusercontent.com/parsimonhi/animCJK/{SOURCE_COMMIT}"
ROOT = Path(__file__).resolve().parents[1]
KANA = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん"

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Kotoba-no-Tabi-asset-sync/1"})
    with urllib.request.urlopen(req, timeout=18) as response:
        return response.read()

def get_character(c):
    raw = fetch(f"{BASE}/svgsJaKana/{ord(c)}.svg")
    tree = ET.fromstring(raw)
    if not tree.tag.endswith("svg"):
        raise ValueError("Not SVG: " + c)
    svg = raw.decode("utf-8")
    if "Lesser General Public License" not in svg:
        raise ValueError("Missing LGPL attribution: " + c)
    delays = re.findall(r'--d:([\d.]+)s', svg)
    if not delays: raise ValueError("Missing animated strokes: " + c)
    return c, raw, len(set(delays))

def main():
    out = ROOT / "assets" / "strokes"
    out.mkdir(parents=True, exist_ok=True)
    with ThreadPoolExecutor(max_workers=6) as ex:
        results = list(ex.map(get_character, KANA))
    for c, raw, _ in results:
        (out / f"{ord(c)}.svg").write_bytes(raw)
    counts = {c: n for c, _, n in results}
    (ROOT / "assets" / "kana-guide-counts.json").write_text(
        json.dumps(counts, ensure_ascii=False, indent=2) + "\n", encoding="utf8"
    )
    lic = ROOT / "licenses"
    lic.mkdir(exist_ok=True)
    (lic / "LGPL-3.0.txt").write_bytes(fetch(f"{BASE}/licenses/LGPL.txt"))
    (lic / "ANIMCJK-COPYING.txt").write_bytes(fetch(f"{BASE}/licenses/COPYING.txt"))
    print(f"Vendored {len(results)} validated kana SVGs, upstream {SOURCE_COMMIT}")
    print("Stroke group counts:", counts)

if __name__ == "__main__":
    main()
