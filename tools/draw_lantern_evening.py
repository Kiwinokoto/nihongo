"""Original festival evening triptych for the optional Kotoba no Tabi story.
No third-party visual assets; generated solely from Python stdlib.
"""
from pathlib import Path
from random import Random

OUT = Path(__file__).resolve().parents[1] / "assets" / "stories"

def defs():
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 580" width="1000" height="580">
<defs>
 <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
  <stop stop-color="#263d51"/><stop offset=".52" stop-color="#637078"/><stop offset="1" stop-color="#d7a995"/>
 </linearGradient>
 <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
  <stop stop-color="#64786f"/><stop offset="1" stop-color="#435c57"/>
 </linearGradient>
 <radialGradient id="gold"><stop stop-color="#ffe2a1" stop-opacity=".95"/>
  <stop offset=".37" stop-color="#efba86" stop-opacity=".48"/><stop offset="1" stop-color="#ffc487" stop-opacity="0"/></radialGradient>
 <radialGradient id="vignette"><stop offset=".53" stop-color="#071d2a" stop-opacity="0"/>
  <stop offset="1" stop-color="#112c3d" stop-opacity=".45"/></radialGradient>
 <pattern id="kimono" width="20" height="20" patternUnits="userSpaceOnUse">
  <path d="M3 10Q10 2 17 10Q10 18 3 10Z" stroke="#9db3a4" stroke-width="1.5" opacity=".25" fill="none"/>
 </pattern>
</defs>'''
def lamp(x,y,scale=1):
    return f'''<g transform="translate({x} {y}) scale({scale})">
    <circle r="86" cy="45" fill="url(#gold)"/>
    <path d="M0 -35V-11" stroke="#342f38" stroke-width="2"/>
    <rect x="-20" y="-13" width="40" height="59" rx="16" fill="#efd1ab" stroke="#b87d65" stroke-width="2"/>
    <ellipse cy="-11" rx="16" ry="6" fill="#b9806e"/>
    <path d="M-12 -7V39M0 -8V43M12 -7V39" stroke="#cb9277" stroke-width="1.4" opacity=".7"/>
    <ellipse cy="46" rx="17" ry="5" fill="#a36d64"/>
    <path d="M0 50v13M-7 52v11M7 52v11" stroke="#d2ac80" stroke-width="1.6"/>
    </g>'''
def pine(x,y,s):
    return f'''<g transform="translate({x} {y}) scale({s})">
    <path d="M0 15 Q-10 -90 -5 -210M-5 -142Q-70 -185 -90 -172M-6 -132Q53 -192 100 -180" stroke="#35494b" stroke-width="16" fill="none"/>
    <ellipse cx="-60" cy="-182" rx="76" ry="45" fill="#416258"/>
    <ellipse cx="52" cy="-203" rx="88" ry="51" fill="#4d685b"/>
    <ellipse cx="0" cy="-233" rx="78" ry="61" fill="#506f62"/>
    <ellipse cx="-27" cy="-224" rx="45" ry="23" fill="#658276" opacity=".34"/>
    </g>'''
def stall(x,y,w=180,colour="#a65f63"):
    return f'''<g transform="translate({x} {y})">
    <path d="M0 0V-130H{w}V0" fill="#dbc4a5" opacity=".60"/>
    <path d="M-19 -125L{w/2} -173L{w+20} -125L{w+9} -108H-9Z" fill="{colour}" stroke="#7a4b53" stroke-width="4"/>
    <path d="M8 -106H{w-8}V-55H8Z" fill="#eacda9"/>
    <path d="M10 -106V-55M{w-11} -106V-55" stroke="#735d54" stroke-width="6"/>
    <rect x="0" y="-55" width="{w}" height="18" rx="3" fill="#7e5751"/>
    <path d="M15 -46Q55 -76 85 -46Q122 -73 {w-12} -42" fill="none" stroke="#f9deae" stroke-width="5" opacity=".7"/>
    </g>'''
def person(x,y,s=1,coat="#486b66",side=1,book=False,charm=False):
    # Adults: longer-legged proportions, original anonymous designs.
    direction=f"translate({x} {y}) scale({s*side} {s})"
    detail= '''<path d="M-19 -100L-40 -125L-36 -152L-13 -144" stroke="#d5a893" stroke-width="13" fill="none" stroke-linecap="round"/>''' if book else ""
    journal='''<g transform="translate(-50 -148) rotate(-12)">
        <rect x="-11" y="-3" width="32" height="42" rx="3" fill="#e9d3ab" stroke="#9a826a" stroke-width="3"/>
        <path d="M-2 4V31M5 4V31" stroke="#8e8a74" stroke-width="1"/></g>''' if book else ""
    lucky='''<path d="M28 -94Q45 -78 38 -57" stroke="#c7ad82" stroke-width="3" fill="none"/>
      <rect x="32" y="-59" width="16" height="19" rx="6" fill="#e2a3a4" stroke="#f4d7b5" stroke-width="2"/>''' if charm else ""
    return f'''<g transform="{direction}">
    <ellipse cy="6" rx="35" ry="9" fill="#1e4143" opacity=".25"/>
    <path d="M-16 -59L-18 3M15 -59L18 3" stroke="#303e43" stroke-width="17" stroke-linecap="round"/>
    <path d="M-40 -136Q0 -157 38 -136L43 -62Q0 -34 -38 -62Z" fill="{coat}" stroke="#314852" stroke-width="2"/>
    <path d="M-40 -136Q-50 -109 -51 -72M39 -136Q49 -109 51 -80" stroke="{coat}" stroke-width="17" fill="none" stroke-linecap="round"/>
    <path d="M-30 -132L0 -108L29 -132M0 -108V-57" fill="none" stroke="#d6c6ae" stroke-width="5" opacity=".72"/>
    <path d="M-31 -115L-22 -68L19 -59L30 -108" fill="url(#kimono)" opacity=".55"/>
    <rect x="-8" y="-165" width="16" height="20" rx="6" fill="#ddb49a"/>
    <ellipse cx="0" cy="-178" rx="24" ry="28" fill="#ddb49a"/>
    <path d="M-27 -185Q-21 -217 9 -214Q29 -211 25 -183Q11 -190 1 -202Q-4 -192 -27 -185" fill="#283b43"/>
    <path d="M-25 -182Q-21 -157 -11 -157" fill="#283b43"/>
    <circle cx="15" cy="-177" r="2" fill="#4c4e4c" opacity=".70"/>
    {detail}{journal}{lucky}
    </g>'''
def base(seed,night=False):
    rng=Random(seed)
    body=[defs(),'<rect width="1000" height="580" fill="url(#sky)"/>',
      '<circle cx="772" cy="114" r="44" fill="#f1dcb4" opacity=".78"/>',
      '<circle cx="772" cy="114" r="87" fill="url(#gold)" opacity=".4"/>',
      '<path d="M0 365L80 246L181 324L301 191L466 369L615 237L788 382L894 258L1000 348V580H0Z" fill="#516b6c" opacity=".45"/>',
      '<path d="M0 390Q240 323 450 377Q720 306 1000 373V580H0Z" fill="#5f8078"/>',
      '<path d="M0 441Q170 378 350 432Q577 353 1000 424V580H0Z" fill="url(#floor)"/>',
      '<path d="M0 580L170 405L880 397L1000 580Z" fill="#a48d80" opacity=".66"/>',
      '<path d="M252 414L125 580M755 406L937 580" stroke="#d8b29a" stroke-width="3" opacity=".4"/>',
      pine(60,400,1.15),pine(945,398,1.2),
      stall(99,399,175,"#a75e67"),stall(715,398,172,"#798d83")]
    for i in range(80):
        x=rng.randrange(1000);y=rng.randrange(423,580)
        body.append(f'<ellipse cx="{x}" cy="{y}" rx="{rng.randrange(1,6)}" ry="1.4" fill="#f6d6a4" opacity=".3"/>')
    for x,y,s in [(80,49,.84),(210,37,.64),(345,62,.84),(498,42,.62),(641,51,.78),(793,31,.73),(912,55,.86)]:
        body.append(lamp(x,y,s))
    body.append('<path d="M0 26Q250 52 500 29Q735 44 1000 30" stroke="#263a45" stroke-width="3" fill="none"/>')
    return body
def blossom(x,y):
    return f'''<g transform="translate({x} {y})" fill="#edc9c5" opacity=".9">
    <ellipse cy="-9" rx="6" ry="11"/><ellipse cx="8" cy="-1" rx="10" ry="6" transform="rotate(35 8 -1)"/>
    <ellipse cx="5" cy="9" rx="6" ry="10" transform="rotate(-25 5 9)"/>
    <ellipse cx="-8" cy="8" rx="6" ry="10" transform="rotate(35 -8 8)"/>
    <ellipse cx="-9" cy="-3" rx="9" ry="6"/><circle r="3" fill="#d1a373"/></g>'''
def scene(index):
    b=base(100+index)
    if index==1:
        b += [person(363,498,1.03,coat="#4c7971",book=True,charm=True),
              '<path d="M506 447Q586 426 640 452" stroke="#f3ddc1" stroke-width="3" stroke-dasharray="4 15" fill="none" opacity=".8"/>',
              '<path d="M481 484Q506 478 522 487" stroke="#dbb69a" stroke-width="5" fill="none"/>']
    elif index==2:
        b += [person(388,505,1.01,coat="#4c7971",book=True,charm=True),
              person(605,504,1.05,coat="#566782",side=-1,charm=True),
              '<path d="M470 366Q493 355 523 365" fill="none" stroke="#ffe2b2" stroke-width="3" opacity=".6"/>']
    else:
        b += [person(456,509,1.05,coat="#4c7971",book=True,charm=True),
              person(559,507,1.05,coat="#566782",side=-1,charm=True),
              '<path d="M400 326Q510 192 637 325Z" fill="#e6c9a7" stroke="#9c8582" stroke-width="7"/>',
              '<path d="M510 214V386" stroke="#98746b" stroke-width="6" fill="none"/>',
              '<path d="M402 326Q510 357 635 326" fill="none" stroke="#a68a83" stroke-width="5"/>',
              '<path d="M510 215Q479 282 460 334M510 215Q546 277 580 333" stroke="#c3a991" stroke-width="3" fill="none"/>']
        rng=Random(5)
        for _ in range(85):
            x=rng.randrange(1000);y=rng.randrange(100,580)
            b.append(f'<path d="M{x} {y}l-6 17" stroke="#d6e1da" stroke-width="1.7" opacity=".35"/>')
    for p in [(108,220),(151,253),(874,246),(928,297)]:
        b.append(blossom(*p))
    b.append('<rect width="1000" height="580" fill="url(#vignette)"/>')
    b.append('</svg>')
    return ''.join(b)
if __name__=="__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for i in range(1,4):
        (OUT/f"lantern-{i}.svg").write_text(scene(i),encoding="utf-8")
    print("Generated three original festival scenes")
