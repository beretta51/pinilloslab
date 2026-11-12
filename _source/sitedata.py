# What the site says, read from the places where it is written once:
#   walk-template.html  the rooms (apps, About stops, awards)
#   site-meta.json      each address's title and description, and what each app is
# Used by build_walk.py (the text version of the home) and build_pages.py (the plain pages).
import json, os, re
S = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(S)
SITE = 'https://pinilloslab.com'
EMAIL = 'nocion.exento_8u@icloud.com'
REDDIT = 'https://www.reddit.com/user/beretta51'


def load():
    t = open(f'{S}/walk-template.html', encoding='utf-8').read()
    meta = json.load(open(f'{S}/site-meta.json', encoding='utf-8'))
    apps = []
    for big, small, tag, k, c, o, u in re.findall(r"\{app:1,big:'([^']*)',small:'([^']*)',tag:'([^']*)',k:'(\w+)',.*?c:'(#\w+)',o:('#\w+'|INK|PAPER),.*?u:'([^']*)'\}", t):
        o = {'INK': '#0B0B10', 'PAPER': '#F4F1E8'}.get(o, o.strip("'"))
        apps.append(dict(k=k, name=big, small=small, tag=tag, c=c, o=o, store=u, about=meta['apps'].get(k, {}).get('about', '')))
    if len(apps) != 7:
        raise SystemExit('sitedata: expected 7 apps in walk-template.html, found %d' % len(apps))
    hi = re.search(r'const HOME=\[\s*\{big:"([^"]*)",small:\'([^\']*)\',txt:\'([^\']*)\'', t)
    seg = t[t.index('const ABOUT=['):t.index('];', t.index('const ABOUT=['))]
    about = re.findall(r"\{big:'([^']*)',small:'([^']*)',txt:'([^']*)'", seg)
    aw = t[t.index('const AWARDS=') + 13:t.index(']];', t.index('const AWARDS=')) + 2]
    awards = json.loads(aw.replace("'", '"'))
    if not (hi and len(about) >= 5 and len(awards) >= 6):
        raise SystemExit('sitedata: could not read the home, About or awards from walk-template.html')
    return dict(apps=apps, hi=hi.groups(), about=about, awards=awards, routes=meta['routes'], meta=meta)
