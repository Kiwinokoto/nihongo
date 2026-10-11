"""Procedurally paint two original, self-contained storybook SVG panoramas.
No external art, fonts, or third-party image copies. Standard library only.
"""
from pathlib import Path
from random import Random
OUT=Path(__file__).resolve().parents[1]/"assets"/"art"
rng=Random(247)
def header(sunx=1254):
 return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 460">
 <defs>
  <linearGradient id="sky" x2="0" y2="1"><stop stop-color="#b6d7df"/><stop offset=".58" stop-color="#f3dcbb"/><stop offset="1" stop-color="#f6e3cc"/></linearGradient>
  <linearGradient id="hill" x2="0" y2="1"><stop stop-color="#90b3a0"/><stop offset="1" stop-color="#709a8b"/></linearGradient>
  <linearGradient id="water" x2="0" y2="1"><stop stop-color="#b3d8ce"/><stop offset="1" stop-color="#688e97"/></linearGradient>
  <linearGradient id="paving" x2="0" y2="1"><stop stop-color="#dfc4a8"/><stop offset="1" stop-color="#ad9c8c"/></linearGradient>
  <radialGradient id="glow"><stop stop-color="#ffe8b4" stop-opacity=".9"/><stop offset="1" stop-color="#ffe8b4" stop-opacity="0"/></radialGradient>
 </defs>
 <rect width="1400" height="460" fill="url(#sky)"/>
 <circle cx="{sunx}" cy="83" r="124" fill="url(#glow)"/><circle cx="{sunx}" cy="83" r="51" fill="#fff0c9" opacity=".84"/>
 <path d="M0 248L190 136L322 223L533 70L733 252L943 139L1144 250L1304 110L1400 188V460H0Z" fill="#a8bebb" opacity=".78"/>
 <path d="M0 275L215 190L396 260L648 152L829 286L1008 173L1220 256L1400 179V460H0Z" fill="#89aca3" opacity=".84"/>
 <path d="M0 316Q190 225 345 320Q546 215 741 304Q962 208 1400 315V460H0Z" fill="url(#hill)"/>
 <path d="M0 349Q261 268 485 351Q818 276 1400 343V460H0Z" fill="#93b49c"/>
 '''
def petals(seed=5,n=80):
 rng=Random(seed)
 return ''.join(f'<ellipse cx="{rng.randrange(1400)}" cy="{rng.randrange(35,425)}" rx="{rng.choice((1,2,3,4))}" ry="2" fill="{rng.choice(("#f8cfd0","#f4d8bd","#fff1df"))}" opacity="{rng.choice((".5",".6",".8"))}" transform="rotate({rng.randrange(-80,80)})"/>' for _ in range(n))
def tree(x,y,s=1):
 rng=Random(int(x+y))
 t=f'<g transform="translate({x} {y}) scale({s})"><path d="M0 0Q9 -67 -9 -163M0 -92Q-42 -129 -65 -134M1 -112Q44 -143 67 -159" stroke="#715e59" stroke-width="13" fill="none" stroke-linecap="round"/>'
 colors=['#ecb8b9','#f4c5c8','#f9d2cf','#fff0d9','#dba7ab']
 for i in range(34):
  xx=rng.randrange(-91,93);yy=rng.randrange(-200,-111)
  r=rng.randrange(12,24)
  t+=f'<circle cx="{xx}" cy="{yy}" r="{r}" fill="{colors[i%5]}" opacity=".93"/>'
 return t+'</g>'
def house(x,y,s=1,roof='#956e70'):
 return f'''<g transform="translate({x} {y}) scale({s})">
  <path d="M0 0V-121H179V0Z" fill="#e6cfb1" stroke="#9d8874" stroke-width="3"/>
  <path d="M-20 -120L86 -195L204 -120L185 -105L86 -163L-5 -106Z" fill="{roof}" stroke="#6d6560" stroke-width="3"/>
  <path d="M68 0V-75H118V0Z" fill="#9c8273"/><circle cx="104" cy="-32" r="3.5" fill="#e1c6a5"/>
  <path d="M16 -104h34v45H16ZM129 -104h34v45h-34Z" fill="#a4c9ba" stroke="#ae8b74" stroke-width="7"/>
  <path d="M20 -59h30m96 0h25" stroke="#a0846f" stroke-width="3"/>
  <path d="M4 0h175" stroke="#806b62" stroke-width="6"/>
 </g>'''
def lamp(x,y):
 return f'''<g transform="translate({x} {y})"><circle r="37" cy="-54" fill="url(#glow)"/>
 <path d="M0 0v-77" stroke="#656663" stroke-width="6"/><rect x="-12" y="-93" width="24" height="32" rx="7" fill="#f3d8a8" stroke="#a97969" stroke-width="3"/>
 <path d="M-7 -87v20M0 -88v22M7 -87v20" stroke="#c69b78" stroke-width="1.5"/><path d="M-17 -93h34" stroke="#56595e" stroke-width="4"/></g>'''
def couple(x,y,scale=1):
 # Two original adult travelers with matching subtle red thread charms.
 people=[]
 for dx,coat,head in [(-23,'#476d69','#2f4546'),(27,'#64718c','#4d4142')]:
  people.append(f'''<g transform="translate({x+dx} {y}) scale({scale})">
   <path d="M-8 -45l-3 45m19 -45l5 45" stroke="#445053" stroke-width="12" stroke-linecap="round"/>
   <path d="M-24 -119Q0 -132 24 -119L29 -52Q0 -38 -29 -54Z" fill="{coat}"/>
   <path d="M-26 -108L-30 -64M27 -108l29 42" stroke="{coat}" stroke-width="10" stroke-linecap="round"/>
   <path d="M-5 -139v17" stroke="#d5ac91" stroke-width="12"/>
   <ellipse cy="-155" rx="19" ry="24" fill="#e0b69b"/>
   <path d="M-21 -158Q-20 -182 8 -181Q22 -175 21 -153Q10 -166 0 -167Q-6 -153 -21 -158Z" fill="{head}"/>
   <path d="M20 -85q22 8 18 23" stroke="#d99f8c" stroke-width="2" fill="none"/>
   <circle cx="37" cy="-59" r="5" fill="#c27e85"/></g>''')
 return ''.join(people)
def ikemen_travellers():
 # Two original adult handsome travelling companions, seated close together.
 # Gentle eye contact, matching omamori charms; no borrowed anime characters.
 def traveler(x,scale,coat,hair,highlight,accent,turn=0):
  return f'''<g transform="translate({x} 455) scale({scale}) rotate({turn} 0 -153)">
    <ellipse cx="3" cy="-10" rx="105" ry="23" fill="#566f66" opacity=".19"/>
    <!-- coat silhouette and lapels -->
    <path d="M-82 1Q-94 -58 -74 -106Q-42 -139 -21 -145L33 -146Q66 -140 87 -97Q101 -50 87 2Z" fill="{coat}" stroke="#516263" stroke-width="3"/>
    <path d="M-39 -134L0 -84L31 -138L45 -122L10 -72L-7 -72L-52 -119Z" fill="#efe0cc"/>
    <path d="M-67 -100Q-31 -74 -10 -53M55 -110Q40 -86 12 -59" fill="none" stroke="{highlight}" stroke-width="4" opacity=".7"/>
    <path d="M-37 -105L-13 -30M40 -102L17 -26" stroke="#4c5a57" opacity=".7" stroke-width="5"/>
    <path d="M-78 -24Q-55 -9 -36 -7M63 -18Q77 -14 88 -2" fill="none" stroke="{highlight}" stroke-width="3"/>
    <!-- satchel strap with matching tiny blossom charm -->
    <path d="M-58 -113Q-15 -81 37 -7" fill="none" stroke="#806a60" stroke-width="11"/>
    <path d="M-58 -113Q-15 -81 37 -7" fill="none" stroke="#bb9582" stroke-width="4"/>
    <path d="M33 -28v15" stroke="#bb8787" stroke-width="3"/>
    <circle cx="33" cy="-10" r="10" fill="#f7d4ca" stroke="#b36f79" stroke-width="2"/>
    <path d="M33 -17l4 5-4 8-5-8Z" fill="{accent}"/>
    <!-- neck and face -->
    <path d="M-16 -152v32Q0 -105 19 -124v-36Z" fill="#dab09a"/>
    <ellipse cx="2" cy="-197" rx="48" ry="62" fill="#edc6ad" stroke="#b78a80" stroke-width="2"/>
    <path d="M-43 -189Q-56 -191 -51 -171Q-41 -166 -40 -175" fill="#e8bba3" stroke="#b78a80" stroke-width="2"/>
    <path d="M43 -190Q54 -194 52 -175Q46 -166 41 -177" fill="#e7b8a4" stroke="#b78a80" stroke-width="2"/>
    <!-- hair silhouette and individual locks -->
    <path d="M-51 -194Q-65 -264 -16 -272Q36 -290 54 -247Q69 -231 47 -193L34 -235Q15 -230 5 -237Q-24 -215 -47 -216Z" fill="{hair}"/>
    <path d="M-49 -226Q-20 -265 8 -267Q-3 -241 -24 -222M-7 -267Q28 -278 47 -244Q28 -252 21 -228M44 -245Q65 -219 45 -202" fill="none" stroke="{highlight}" opacity=".8" stroke-width="5" stroke-linecap="round"/>
    <!-- swept fringe -->
    <path d="M-35 -254Q-7 -231 4 -226Q-6 -208 -22 -205L-40 -205M11 -254Q34 -243 41 -225L23 -212L6 -224" fill="{hair}"/>
    <!-- expressive brows and almond eyes -->
    <path d="M-28 -194Q-15 -200 -5 -194M12 -197Q25 -203 35 -195" fill="none" stroke="{hair}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M-28 -187Q-18 -179 -6 -186M14 -187Q25 -180 34 -186" stroke="#66565a" stroke-width="2.5" fill="none"/>
    <ellipse cx="-17" cy="-184" rx="3.2" ry="4.5" fill="#4d5858"/>
    <ellipse cx="23" cy="-185" rx="3.2" ry="4.5" fill="#4d5858"/>
    <path d="M6 -176l-4 10 5 2" fill="none" stroke="#c08e87" stroke-width="2"/>
    <path d="M-6 -153Q4 -145 17 -155" fill="none" stroke="#9f6f71" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="-31" cy="-166" rx="12" ry="5" fill="#dc9a9c" opacity=".33"/>
    <ellipse cx="31" cy="-167" rx="12" ry="5" fill="#dc9a9c" opacity=".33"/>
  </g>'''
 return (traveler(960,1.21,"#3d6268","#293f47","#627881","#d89099",5)
       +traveler(1170,1.22,"#e2c8ab","#806554","#b99479","#d89099",-7))

def shrine(x,y,s=.7):
 return f'''<g transform="translate({x} {y}) scale({s})" fill="#af7b76" stroke="#70585e" stroke-width="4">
 <path d="M0 0v-115M120 0v-115M-24 -112h169v18H-24ZM-18 -145h159v17H-18Z"/>
 <path d="M47 -94v75M76 -94v75" stroke="#896c67" stroke-width="3"/></g>'''
def base_ground():
 return '<path d="M0 395Q215 332 419 387Q793 320 1400 386V460H0Z" fill="#71958a" opacity=".63"/>'
def village():
 v=[header(1185),base_ground(),
    '<path d="M427 460Q561 315 712 359Q875 401 1058 460Z" fill="url(#water)"/>',
    '<path d="M424 460Q529 362 611 361M970 454Q825 382 756 364" fill="none" stroke="#dce0c8" stroke-width="13"/>',
    '<path d="M0 460L228 326H480L665 460Z" fill="url(#paving)" opacity=".93"/>',
    house(54,349,.92,'#957577'),house(1135,346,.78,'#8e7771'),
    house(874,314,.43,'#b17d78'),
    '<path d="M583 382Q696 290 824 382" stroke="#a96763" stroke-width="19" fill="none"/>',
    '<path d="M576 383Q690 299 831 383M581 386H828" stroke="#e0ad8b" stroke-width="5" fill="none"/>',
    '<path d="M587 385v33m35-51v51m35-65v64m35-70v75m35-72v70m35-64v45m34-22v30" stroke="#a86b63" stroke-width="6"/>',
    shrine(1013,287,.28),tree(256,358,1.3),tree(1374,375,1.15),
    lamp(342,382),lamp(981,396),ikemen_travellers(),petals(10,90),
    '<path d="M0 450Q302 421 458 442" stroke="#7e9e83" stroke-width="6" fill="none"/>',
    '</svg>']
 return ''.join(v)
def train():
 v=[header(1120),base_ground(),
    '<path d="M0 460L342 309H1400V460Z" fill="url(#paving)"/>',
    '<path d="M0 393H1400M0 405H1400M0 427H1400" stroke="#7b7a73" stroke-width="6" opacity=".7"/>',
    '<path d="M0 400H1400M0 429H1400" stroke="#d6ccb4" stroke-width="9"/>']
 # cream/terracotta train with roof and large windows
 v += ['''<g transform="translate(204 193)">
 <rect x="0" y="0" rx="37" width="685" height="168" fill="#d8aa81" stroke="#876b63" stroke-width="5"/>
 <path d="M13 27Q19 -7 63 -11h556Q667 -5 674 26Z" fill="#ede0c3"/>
 <rect x="15" y="56" width="652" height="96" rx="8" fill="#ac7467"/>
 <path d="M23 54h642v18H23Z" fill="#ead1b5"/>
 <g fill="#afcbd0" stroke="#f1e1c5" stroke-width="5">
 <rect x="47" y="21" rx="9" width="72" height="88"/><rect x="141" y="21" rx="9" width="72" height="88"/>
 <rect x="243" y="21" rx="9" width="72" height="88"/><rect x="334" y="21" rx="9" width="72" height="88"/>
 <rect x="434" y="21" rx="9" width="72" height="88"/><rect x="529" y="21" rx="9" width="72" height="88"/></g>
 <rect x="617" y="16" rx="12" width="50" height="130" fill="#dbc7aa" stroke="#f0e0c4" stroke-width="5"/>
 <path d="M625 64h34" stroke="#8b9b9b" stroke-width="4"/>
 <circle cx="39" cy="140" r="11" fill="#f1d3ac"/><circle cx="584" cy="140" r="11" fill="#f1d3ac"/>
 <path d="M0 167h685" stroke="#4d5f62" stroke-width="11"/></g>''',
 '''<g fill="#756d66" stroke="#5c6464" stroke-width="8"><circle cx="275" cy="360" r="15"/>
 <circle cx="723" cy="360" r="15"/></g>''',
 '''<g transform="translate(1010 173)"><path d="M0 193V-19H339V193Z" fill="#dec7ac"/>
 <path d="M-28 5L85 -71H333L372 5Z" fill="#806d66"/>
 <path d="M6 19H333V112H6Z" fill="#d5c4aa"/>
 <path d="M13 30H325V73H13Z" fill="#97ada4"/>
 <path d="M18 111h310" stroke="#897a6a" stroke-width="6"/>
 <path d="M29 194V107M312 194V107" stroke="#826e68" stroke-width="14"/></g>''',
 tree(1394,340,.86),tree(43,331,.91),
 lamp(952,382), lamp(1294,390),couple(1147,434,.5),
 '<path d="M1029 366h240" stroke="#a89584" stroke-width="8"/>',
 # suitcases and matched omamori tag
 '<g transform="translate(1224 376)"><rect x="0" y="0" width="37" height="50" rx="5" fill="#65798a" stroke="#425d66" stroke-width="3"/>'
 '<path d="M10 0v-9h18V0" fill="none" stroke="#49585e" stroke-width="4"/>'
 '<rect x="25" y="19" width="9" height="15" rx="3" fill="#dba4ad"/></g>',
 petals(22,85),'</svg>']
 return ''.join(v)
def travellers_reward():
    """Tighter second chapter of the *same* original scene, never used as hero."""
    base=header(1160).replace('viewBox="0 0 1400 460"', 'viewBox="773 33 615 409"')
    return ''.join([base,
       '<path d="M750 460Q1070 330 1500 445V510H750Z" fill="#829b8e" opacity=".64"/>',
       '<path d="M815 460Q1000 369 1180 408Q1300 390 1430 445" stroke="#eedbc7" stroke-width="8" fill="none"/>',
       tree(843,355,.53), tree(1390,386,.72),
       lamp(837,395),lamp(1312,400),ikemen_travellers(),petals(116,52),
       '</svg>'])

if __name__=="__main__":
 OUT.mkdir(parents=True,exist_ok=True)
 for name,svg in [('village-path.svg',village()),('katakana-platform.svg',train()),('travellers-closeup.svg',travellers_reward())]:
  (OUT/name).write_text(svg,encoding='utf8')
  print(name,len(svg))
