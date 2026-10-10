"""Generate an original tiny illustrated food-stall lane for Kotoba no Tabi.
Everything is vector geometry; no photos, licensed third-party art or fonts.
"""
from pathlib import Path
from random import Random

OUT=Path(__file__).resolve().parents[1]/"assets"/"food-lane.svg"
rng=Random(128)

def lantern(x,y,r=15):
 return f'''<g><circle cx="{x}" cy="{y+14}" r="{r*3}" fill="#efba8e" opacity=".12"/>
 <path d="M{x} {y-23}V{y-12}" stroke="#354853" stroke-width="2"/>
 <rect x="{x-r}" y="{y-r}" width="{r*2}" height="{r*3}" rx="{r*.65}" fill="#f5d1a4" stroke="#a97562" stroke-width="1.5"/>
 <path d="M{x-8} {y-12}V{y+22}M{x+8} {y-12}V{y+22}" stroke="#d6a482" stroke-width="1.4" opacity=".65"/>
 <path d="M{x} {y+30}v9" stroke="#ca9a7e" stroke-width="2"/></g>'''

def shop(x,w,roof,y=208):
 return f'''<g transform="translate({x} 0)">
   <path d="M0 {y+5}V{y-74}H{w}V{y+5}" fill="#e4c5a5" stroke="#876a5b" stroke-width="3"/>
   <path d="M-14 {y-66}L{w/2} {y-112}L{w+14} {y-66}L{w+2} {y-52}H-2Z" fill="{roof}" stroke="#6e6364" stroke-width="3"/>
   <rect x="8" y="{y-58}" width="{w-16}" height="24" fill="#f6dcbc" opacity=".92"/>
   <path d="M10 {y-33}H{w-10}" stroke="#7e5552" stroke-width="4"/>
   <path d="M0 {y-5}H{w}" stroke="#644f4c" stroke-width="12"/>
   </g>'''

def scene():
 a=['''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 300" width="900" height="300">
 <defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#6e8c91"/><stop offset="1" stop-color="#edbd9e"/></linearGradient>
 <linearGradient id="street" x2="0" y2="1"><stop stop-color="#b8af98"/><stop offset="1" stop-color="#968c7b"/></linearGradient></defs>
 <rect width="900" height="300" fill="url(#sky)"/>
 <circle cx="743" cy="63" r="39" fill="#ffe1b4" opacity=".75"/>
 <path d="M0 169Q120 74 275 167Q400 90 590 177Q751 83 900 154V300H0Z" fill="#789588"/>
 <path d="M0 199Q250 136 460 200Q665 139 900 192V300H0Z" fill="#719488"/>
 <path d="M0 300L200 192H696L900 300Z" fill="url(#street)"/>''',
 shop(96,205,"#a5666b"),shop(362,200,"#698a81"),shop(640,165,"#b27e66"),
 '<path d="M0 32Q219 54 440 25Q667 50 900 30" fill="none" stroke="#394f58" stroke-width="3"/>']
 for x,y,r in [(62,36,12),(167,40,15),(270,35,11),(390,32,14),(515,34,12),(627,30,13),(735,39,14),(852,33,13)]:
  a.append(lantern(x,y,r))
 # Fish on the central grill, crossed skewers on the left stall, round takoyaki on the right.
 a += ['''<g transform="translate(462 167)" fill="none" stroke="#71675a">
  <path d="M-33 0Q0 -18 30 0Q0 19 -33 0Z" fill="#c0bca7" stroke-width="2"/>
  <path d="M30 0L49 -14V14Z" fill="#c0bca7" stroke-width="2"/>
  <circle cx="-23" cy="-2" r="2" fill="#576762" stroke="none"/>
  <path d="M-14 -8l7 9m7-13l7 22m8-20l7 8" stroke="#778780" stroke-width="2"/>
  </g>''',
 '''<g stroke="#806352" stroke-width="4" stroke-linecap="round">
  <path d="M149 168l98 21M156 193l95 -26"/>
  </g>''',
 '''<g fill="#bb8b66" stroke="#edc89c" stroke-width="2">
  <ellipse cx="175" cy="173" rx="11" ry="8"/><ellipse cx="204" cy="179" rx="11" ry="8"/>
  <ellipse cx="188" cy="186" rx="11" ry="8"/><ellipse cx="221" cy="178" rx="10" ry="8"/>
  </g>''',
 '''<g fill="#d4a36c" stroke="#9b7463" stroke-width="1.6">
  <circle cx="705" cy="177" r="10"/><circle cx="730" cy="172" r="10"/>
  <circle cx="755" cy="177" r="10"/><circle cx="779" cy="172" r="10"/>
  </g>''']
 # small bowls on counter
 for x in [437,475,510]:
  a.append(f'<path d="M{x-10} 187q10 20 20 0Z" fill="#f0e0c7" stroke="#a78975" stroke-width="1.3"/>')
 # sparkle and loose petals
 for _ in range(50):
  x=rng.randrange(900);y=rng.randrange(70,300);r=rng.choice([1,2,2,3])
  a.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{rng.choice(["#f2dcba","#eec4b8","#cde1cf"])}" opacity=".58"/>')
 a.append('</svg>')
 return ''.join(a)

if __name__=="__main__":
 OUT.write_text(scene(),encoding="utf-8")
 print(f"Generated {OUT.name}: {OUT.stat().st_size} bytes")
