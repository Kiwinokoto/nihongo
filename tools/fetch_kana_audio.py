#!/usr/bin/env python3
"""Fetch five public-domain kana samples from Wikimedia Commons and normalize to MP3.
Source: Hakatanoshio117117, recorded 2009, dedicated to the public domain.
Check current Commons file pages before redistributing. Pinned URLs listed in licences.
"""
from pathlib import Path
from hashlib import md5,sha256
from subprocess import run
import urllib.request,urllib.parse,time
root=Path(__file__).resolve().parents[1]
output=root/'assets'/'audio'/'kana'
output.mkdir(parents=True,exist_ok=True)
# SHA-256 of the original, untranscoded files reviewed for public-domain licensing.
SOURCE_SHA256={
    "A":"37d8b51acbdec5f1a4768520c4ad94a14f21f1230f33a2d7f50406ca9b32aff6",
    "E":"d529d33b371fd63b3edeb2e3be5e785d90d4fba66281be9b55076a477a3ee297",
    "I":"39a55eee1bd2dbacbee318c7c7a4f499d905b909dcf0b3400961b1142801e9f2",
    "O":"daafc582b17287df5707038bdd08e43754e44c03b08b723e2afa81015155c198",
    "U":"45abe18943e57e1d0bbe68e57a2a617f2ce917b5af44baf1e057390d292b231d",
}

for n,c in enumerate("AEIOU"):
    name=f"Ja-{c}.oga" if c in "AE" else f"Japanese_{c}.ogg"
    digest=md5(name.encode()).hexdigest()
    url=f"https://upload.wikimedia.org/wikipedia/commons/{digest[0]}/{digest[:2]}/{urllib.parse.quote(name)}"
    dest=output/(c.lower()+".mp3")
    if dest.exists(): continue
    req=urllib.request.Request(url,headers={'User-Agent':'Kotoba-no-Tabi/1.0 (educational website; https://github.com/Kiwinokoto/nihongo)'})
    try:
        with urllib.request.urlopen(req,timeout=12) as r: raw=r.read(150_000)
        if not raw.startswith(b'OggS'):raise ValueError('not a valid Ogg Vorbis audio')
        if sha256(raw).hexdigest()!=SOURCE_SHA256[c]:raise ValueError("source checksum changed: "+c)
        src=output/(c.lower()+'.ogg')
        src.write_bytes(raw)
        try:
            run(['ffmpeg','-loglevel','error','-y','-i',str(src),'-ac','1','-ar','22050','-codec:a','libmp3lame','-qscale:a','4',str(dest)],check=True)
        finally:
            src.unlink(missing_ok=True)
        print(c,'OK',sha256(raw).hexdigest(),dest.stat().st_size,flush=True)
    except Exception as e: print(c,'UNAVAILABLE',type(e).__name__,str(e)[:120],flush=True)
    time.sleep(3)
