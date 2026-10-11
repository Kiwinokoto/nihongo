"""Vendor the 46 katakana SVGs from the *pinned* AnimCJK LGPL source.
Original headers/copyright remain unchanged. No runtime network calls.
"""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import re
import urllib.request
import xml.etree.ElementTree as ET

COMMIT="ec5e17cca76c87587790bcbce5ea0b4d4fb753d6"
KATA="アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/"assets"/"katakana-strokes"

def get(c):
    url=f"https://raw.githubusercontent.com/parsimonhi/animCJK/{COMMIT}/svgsJaKana/{ord(c)}.svg"
    req=urllib.request.Request(url,headers={"User-Agent":"Kotoba-no-Tabi-assets/1"})
    with urllib.request.urlopen(req,timeout=15) as res:
        raw=res.read()
    text=raw.decode("utf8")
    if "Lesser General Public License" not in text or not re.search(r"--d:[\d.]+s",text):
        raise ValueError("Missing attribution or strokes: "+c)
    if not ET.fromstring(raw).tag.endswith("svg"):
        raise ValueError("Malformed SVG: "+c)
    return c,raw

if __name__=="__main__":
    DEST.mkdir(exist_ok=True,parents=True)
    with ThreadPoolExecutor(max_workers=5) as pool:
        items=list(pool.map(get,KATA))
    for c,data in items:
        (DEST/f"{ord(c)}.svg").write_bytes(data)
    assert len(items)==46
    print(f"Katakana SVGs: {len(items)} pinned to {COMMIT}")
