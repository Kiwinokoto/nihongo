"""Create original deterministic Japanese storybook SVG scenery (no third-party assets)."""
from pathlib import Path
from random import Random

OUT = Path(__file__).resolve().parents[1] / "assets"
rng = Random(42)
HEAD = '''<svg xmlns="http://www.w3.org/2000/svg" width="900" height="550" viewBox="0 0 900 550">
<defs>
  <linearGradient id="sky" x2="0" y2="1"><stop stop-color="#dbeee6"/><stop offset="1" stop-color="#f5e8d9"/></linearGradient>
  <linearGradient id="hill" x2="0" y2="1"><stop stop-color="#a3beaa"/><stop offset="1" stop-color="#b7c9a4"/></linearGradient>
  <linearGradient id="water" x2="1" y2="1"><stop stop-color="#91beb6"/><stop offset="1" stop-color="#bad8cc"/></linearGradient>
  <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
</defs>'''
def tree(x,y,s=1,pink=True):
    b=[f'<g transform="translate({x} {y}) scale({s})">']
    b += ['<path d="M0 0 Q-4 -35 -2 -77 M-2 -56 Q-27 -82 -39 -82 M-2 -48 Q20 -80 40 -80" fill="none" stroke="#81685a" stroke-width="8" stroke-linecap="round"/>']
    color=("#efbcb6","#f5cdcc","#ffd8d0","#e6aaad") if pink else ("#789e84","#92b59a","#aec8a1","#a9bf94")
    for _ in range(39 if pink else 25):
        cx=rng.randrange(-54,54);cy=rng.randrange(-122,-67);r=rng.randrange(10,19)
        b.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{rng.choice(color)}" opacity=".91"/>')
    b.append('</g>')
    return "".join(b)
def house(x,y,scale=1,tea=False):
    walls="#f9e8d2" if tea else "#f8ede0"
    roof="#a96966" if tea else "#586e65"
    return f'''<g transform="translate({x} {y}) scale({scale})">
     <ellipse cx="0" cy="4" rx="62" ry="11" fill="#5e8164" opacity=".24"/>
     <path d="M-43 -1 V-59 H43 V-1Z" fill="{walls}" stroke="#bdaf91" stroke-width="2"/>
     <path d="M-59 -57 L0 -102 L59 -57 L44 -49 L0 -84 L-44 -49 Z" fill="{roof}"/>
     <rect x="-11" y="-44" width="24" height="43" rx="2" fill="#866b5b"/>
     <rect x="-36" y="-44" width="18" height="21" fill="#b6cdb8" stroke="#9e7b64" stroke-width="3"/>
     <rect x="24" y="-44" width="16" height="21" fill="#b6cdb8" stroke="#9e7b64" stroke-width="3"/>
     <path d="M-54 -58 L0 -97 L54 -58" fill="none" stroke="#e2c1b2" stroke-width="3"/>
    </g>'''
def shrine(x,y,s=1):
    return f'''<g transform="translate({x} {y}) scale({s})" fill="none" stroke="#af6063" stroke-width="10">
      <path d="M-38 8V-65 M38 8V-65 M-53 -64 Q0 -58 54 -64 M-49 -78 Q0 -63 49 -78" stroke-linecap="round"/>
      <path d="M-40 -51H40" stroke-width="5"/>
    </g>'''
def train(x,y,s=1):
    return f'''<g transform="translate({x} {y}) scale({s})">
    <path d="M-80 12H83" stroke="#756d60" stroke-width="7"/><path d="M-80 24H83" stroke="#756d60" stroke-width="4"/>
    <rect x="-51" y="-43" width="104" height="58" rx="15" fill="#e8d8b3" stroke="#7b968c" stroke-width="4"/>
    <rect x="-39" y="-31" width="27" height="24" rx="4" fill="#a7c9c3"/>
    <rect x="-6" y="-31" width="27" height="24" rx="4" fill="#a7c9c3"/>
    <rect x="30" y="-31" width="13" height="24" rx="3" fill="#a7c9c3"/>
    <circle cx="-25" cy="16" r="7" fill="#6d7771"/><circle cx="30" cy="16" r="7" fill="#6d7771"/>
    </g>'''
def garden_lantern(x,y,s=1):
    return f'''<g transform="translate({x} {y}) scale({s})" fill="#a8a69a">
    <rect x="-4" y="-12" width="8" height="26"/><path d="M-17 -12H17L10 -23H-10Z"/>
    <path d="M-12 -12V0H12V-12" fill="#eee5cb"/><path d="M-5 -11V0M5 -11V0" stroke="#ac9480" stroke-width="2"/>
    </g>'''
def landscape():
    a=[HEAD,'<rect width="900" height="550" fill="url(#sky)"/>',
       '<circle cx="763" cy="96" r="55" fill="#fff0d1" opacity=".7"/>',
       '<path d="M0 260 Q90 113 180 219 Q280 68 385 210 Q485 128 553 214 Q707 42 890 234L900 366H0Z" fill="#cad6c8"/>',
       '<path d="M258 208L384 67L505 220Z" fill="#b7c9bf"/><path d="M342 116L384 67L429 126L403 115L384 130L367 115Z" fill="#f5f1e5"/>',
       '<path d="M0 315 Q165 203 325 280 Q465 170 617 264 Q768 214 900 280V550H0Z" fill="#aac6ad"/>',
       '<path d="M0 360 Q210 274 344 356 Q479 298 619 345 Q789 286 900 335V550H0Z" fill="url(#hill)"/>',
       '<path d="M0 472 Q190 365 340 453 Q503 395 620 468 Q777 412 900 448V550H0Z" fill="#8fae92"/>',
       '<path d="M0 510Q147 420 261 455Q366 510 498 450Q633 391 900 522V550H0Z" fill="#6d987f" opacity=".45"/>',
       '<path d="M-60 530 Q180 460 290 525 Q423 585 565 477 Q705 405 960 477" fill="none" stroke="#f7e8cb" stroke-width="70" opacity=".75"/>',
       '<path d="M-60 530 Q180 460 290 525 Q423 585 565 477 Q705 405 960 477" fill="none" stroke="#e9dbc2" stroke-width="3" stroke-dasharray="12 14" opacity=".6"/>',
       '<path d="M-30 366Q190 329 301 399Q409 463 528 425Q663 379 928 390" fill="none" stroke="url(#water)" stroke-width="54" opacity=".88"/>']
    for x,y,s in [(40,330,.73),(123,299,.67),(204,340,.8),(460,305,.83),(611,256,.76),(705,332,.93),(865,345,.96)]:
        a.append(tree(x,y,s,False))
    a += [house(149,441,.80),house(563,364,.69,True),shrine(746,280,.76),train(772,475,.75),
          garden_lantern(311,420,.8),garden_lantern(426,420,.85),tree(325,402,1.17),tree(428,421,.76)]
    for i in range(120):
        x=rng.randrange(900);y=rng.randrange(235,550);r=rng.choice([1,2,2,3,4])
        a.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{rng.choice(["#e9c6bd","#fff3dd","#8eb3a2"])}" opacity=".65"/>')
    a.append('</svg>');return "".join(a)
def village():
    a=[HEAD,'<rect width="900" height="550" fill="url(#sky)"/>',
       '<circle cx="690" cy="103" r="90" fill="#fff0d2" opacity=".6"/>',
       '<path d="M0 350Q160 170 314 276Q430 106 607 282Q745 185 900 286V550H0Z" fill="#c0d6be"/>',
       '<path d="M330 288L514 50L717 289Z" fill="#acc7be"/><path d="M454 130L514 50L580 134L542 123L513 148L490 122Z" fill="#f9efe6"/>',
       '<path d="M0 402Q155 315 348 370Q565 260 900 362V550H0Z" fill="#a8c4a6"/>',
       '<path d="M0 498Q210 402 400 457Q580 387 900 452V550H0Z" fill="#8cae91"/>',
       '<path d="M-50 540Q160 424 335 494Q550 543 880 480" fill="none" stroke="#f2debd" stroke-width="92"/>',
       '<path d="M-20 533Q150 423 300 475" fill="none" stroke="#fff1d5" stroke-width="6" stroke-dasharray="8 15"/>',
       house(550,412,1.23,True),house(800,440,.92),garden_lantern(444,453,1.35),
       tree(150,473,1.8),tree(870,443,1.32),tree(368,426,.75,False)]
    for i in range(50):
        x=rng.randrange(900);y=rng.randrange(320,550);r=rng.randrange(2,5)
        a.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#f1c4bf" opacity=".6"/>')
    a.append('</svg>');return "".join(a)
if __name__=="__main__":
    OUT.mkdir(exist_ok=True)
    (OUT/"landscape.svg").write_text(landscape(),encoding="utf-8")
    (OUT/"village.svg").write_text(village(),encoding="utf-8")
    print("Illustrations generated (original SVGs)")
