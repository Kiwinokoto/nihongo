#!/usr/bin/env python3
"""Import 41 additional basic kana recordings from a vetted public-domain Commons series.

Source author's originals: Hakatanoshio117117 (2009), PD-self.
Uses Wikimedia imageinfo for exact original URLs + current licensing metadata,
and persists source SHA-256 manifest; refuses silent upstream changes.
All audio is single-first-utterance MP3, not an uncut triple repetition.
No network requests at site runtime.
"""
from pathlib import Path
from hashlib import sha256
import json,subprocess,urllib.request,urllib.parse,time,sys

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"assets"/"audio"/"kana"
MANIFEST=OUT/"commons-manifest.json"
ROMAJI="ka ki ku ke ko sa shi su se so ta chi tsu te to na ni nu ne no ha hi fu he ho ma mi mu me mo ya yu yo ra ri ru re ro wa wo n".split()
assert len(ROMAJI)==41
def title(name):
 return f"File:Japanese {'hu' if name=='fu' else 'N' if name=='n' else name}.ogg"
def request(url):
 req=urllib.request.Request(url,headers={"User-Agent":"Kotoba-no-Tabi/1.0 (educational website; github.com/Kiwinokoto/nihongo)"})
 with urllib.request.urlopen(req,timeout=25) as resp:
  return resp.read(250_000)
def metadata():
 url="https://commons.wikimedia.org/w/api.php?"+urllib.parse.urlencode({
   "action":"query","format":"json","titles":"|".join(map(title,ROMAJI)),
   "prop":"imageinfo","iiprop":"url|extmetadata","redirects":"1"
 })
 data=json.loads(request(url))["query"]["pages"]
 entries={}
 for pg in data.values():
  if "imageinfo" not in pg:raise ValueError("Missing file or metadata: "+str(pg.get("title")))
  item=pg["imageinfo"][0]
  ext=item.get("extmetadata",{})
  author=ext.get("Artist",{}).get("value","")
  license=ext.get("LicenseShortName",{}).get("value","")
  if license!="Public domain" or "Hakatanoshio117117" not in author:
   raise ValueError("Unverified licence/author: "+pg["title"]+" "+license+" "+author[:80])
  url=item["url"].split("?")[0]
  # Use unique resolved URL (some names are redirects, e.g. chi->ti).
  entries[url]={"source":pg["title"],"url":url,"license":"PD-self","author":"Hakatanoshio117117"}
 # Map original requested titles to the resolved page/image URL.
 for name in ROMAJI:
  file=title(name)
  match=[v for v in entries.values() if v["source"].casefold()==file.casefold()]
  if not match:
   # Commons may redirect title alias; query again with a single explicit title.
   alias="https://commons.wikimedia.org/w/api.php?"+urllib.parse.urlencode({
     "action":"query","format":"json","titles":file,"prop":"imageinfo","iiprop":"url|extmetadata"
   })
   data=json.loads(request(alias))["query"]["pages"]
   value=next((p["imageinfo"][0] for p in data.values() if p.get("imageinfo")),None)
   if value is None:raise ValueError("No redirectable source: "+file)
   ext=value["extmetadata"]
   if ext["LicenseShortName"]["value"]!="Public domain" or "Hakatanoshio117117" not in ext["Artist"]["value"]:
    raise ValueError("Source not confirmed PD-self: "+file)
   match=[{"source":file,"url":value["url"].split("?")[0],"license":"PD-self","author":"Hakatanoshio117117"}]
  entries[name]=match[0]
 return {name:entries[name] for name in ROMAJI}
def download_one(job):
 name,info,prev=job
 raw=request(info["url"])
 if not raw.startswith(b"OggS"):raise ValueError(name+" is not Ogg")
 digest=sha256(raw).hexdigest()
 if prev and prev.get("sha256")!=digest:raise ValueError(name+" upstream SHA256 changed; review manually")
 source=OUT/(name+".source-tmp.ogg")
 destination=OUT/(name+".mp3")
 candidate=OUT/(name+".pending.mp3")
 try:
  source.write_bytes(raw)
  # Recordings generally repeat the same kana three times; keep first utterance.
  subprocess.run(["ffmpeg","-nostdin","-loglevel","error","-y","-i",str(source),
   "-af","atrim=end=0.65,asetpts=PTS-STARTPTS","-ac","1","-ar","22050",
   "-codec:a","libmp3lame","-qscale:a","4",str(candidate)],check=True,timeout=12)
  if candidate.stat().st_size<800:raise ValueError("MP3 unexpectedly small: "+name)
  candidate.replace(destination)
  return name,dict(info,sha256=digest,mp3_sha256=sha256(destination.read_bytes()).hexdigest())
 finally:
  source.unlink(missing_ok=True);candidate.unlink(missing_ok=True)
if __name__=="__main__":
 OUT.mkdir(parents=True,exist_ok=True)
 previous=json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
 info=metadata()
 # Verify current metadata consistently before beginning download.
 assert set(info)==set(ROMAJI)
 results=dict(previous)
 jobs=[(name,info[name],previous.get(name)) for name in ROMAJI
       if not (OUT/(name+".mp3")).exists() or "--force" in sys.argv]
 # Wikimedia rate-limits bulk downloads. Never parallelize or bypass 429.
 for job in jobs:
  name,value=download_one(job)
  results[name]=value
  print(name,"OK",flush=True)
  time.sleep(3)
 assert set(results)==set(ROMAJI)
 # Only source/provider metadata and hashes, no user info, account or cookies.
 MANIFEST.write_text(json.dumps(dict(sorted(results.items())),ensure_ascii=False,indent=2)+"\n")
 print("READY",len(results),"new Commons PD samples; total with existing vowels:",len(results)+5)
