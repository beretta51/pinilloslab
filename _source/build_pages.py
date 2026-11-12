# Builds every page of the site that is not the walk itself, in the walk's look ("the room": the app's own colour, the title as on
# its wall, the text on paper):
#   /<app>/privacy/ and /<app>/support/   the words come from policies/<app>.html and policies/<app>-support.html
#   /privacy/                             the site's own policy, from policies/site.html
#   /<app>/, /about/, /contact/, /wealth-square/   plain text pages for search engines and browsers without JavaScript;
#                                         everyone else is sent straight to that room of the walk
# policies/ is the only copy of those words: edit them there, then run scripts/build_site.py.
#   python3 -I build_pages.py site  <outdir>   the site's addresses (<app>/privacy/index.html …)
#   python3 -I build_pages.py proto <outdir>   flat files beside the walk (takekit-privacy.html …), for a prototype
import base64, html, json, os, re, sys
S = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, S)
import sitedata
ROOTDIR = sitedata.ROOT
POL = f'{ROOTDIR}/policies'
MODE, OUT = sys.argv[1], sys.argv[2]
PROTO = MODE == 'proto'
D = sitedata.load()
INK, PAPER = '#0B0B10', '#F4F1E8'
APPS = [a for a in D['apps'] if a['k'] != 'trovelo']   # Trovelo's pages live on its own site
url = (lambda k, p: f'{k}-{p}.html') if PROTO else (lambda k, p: f'/{k}/{p}/')
home = (lambda k: f'./#{k}') if PROTO else (lambda k: f'/#{k}')
ROOT = './' if PROTO else '/'
esc = lambda s: html.escape(s, quote=True)
# the arrows are drawn ones, the same as in the walk (arrows.json): ico() swaps each arrow character of a button's label for its drawing
ARW = json.load(open(f'{S}/arrows.json', encoding='utf-8'))
ico = lambda s: re.sub('[→←↗↓↑]', lambda m: '<svg class="ar" viewBox="0 0 24 24" aria-hidden="true"><path d="' + ARW[m.group(0)] + '"/></svg>', s)


def clean(inner):
    def a(m):
        tag, body = m.group(1), m.group(2)
        href = re.search(r'href="([^"]*)"', tag).group(1) if 'href=' in tag else '#'
        text = re.sub(r'<[^>]+>', '', body).replace('↗', '').replace('&#8599;', '').strip()
        if href.startswith('mailto:'):
            return f'<a href="{href}">{text}</a>'
        if 'reddit-cta' in tag:
            return f'<a class="pill h" href="{href}" target="_blank" rel="noopener">{text} ↗</a>'
        g = re.fullmatch(r'/(\w+)/(privacy|support)/?', href)
        if g:
            return f'<a href="{url(g.group(1), g.group(2))}">{text}</a>'
        g = re.fullmatch(r'/(\w+)/?', href)
        if g:
            return '<a href="' + home(g.group(1)) + '">' + text + '</a>'
        if href in ('/', 'https://pinilloslab.com', 'https://pinilloslab.com/'):
            return f'<a href="{ROOT}">{text}</a>'
        if PROTO and href.startswith('/'):   # a file of the site itself (the fonts' licence) sits beside a prototype
            href = href[1:]
        return f'<a href="{href}" target="_blank" rel="noopener">{text}</a>'
    inner = re.sub(r'<a\b([^>]*)>(.*?)</a>', a, inner, flags=re.S)
    KEEP = 'p|ul|ol|li|strong|em|br|b|i|code|table|thead|tbody|tr|th|td'
    inner = re.sub(r'<(/?)(' + KEEP + r')\b[^>]*>', r'<\1\2>', inner)
    inner = re.sub(r'<(?!/?(?:' + KEEP + r'|a)\b)[^>]+>', '', inner)
    inner = inner.replace('<table>', '<div class="tw"><table>').replace('</table>', '</table></div>')   # a wide table scrolls sideways inside the sheet
    return re.sub(r'\s*\n\s*', '\n', inner).strip()


def sections(slug):
    """policies/<slug>.html: an optional '<!-- updated: … -->' line, then one <h2> per section."""
    f = f'{POL}/{slug}.html'
    if not os.path.exists(f):
        raise SystemExit('Missing text: ' + f)
    raw = open(f, encoding='utf-8').read()
    m = re.search(r'<!--\s*updated:\s*(.*?)\s*-->', raw)
    parts = re.split(r'<h2[^>]*>(.*?)</h2>', raw[m.end():] if m else raw)
    if len(parts) < 3:
        raise SystemExit('No <h2> sections in ' + f)
    out = [(html.unescape(re.sub(r'<[^>]+>', '', parts[i])).strip(), clean(parts[i + 1])) for i in range(1, len(parts), 2)]
    return out, (m.group(1) if m else '')


CSS = open(f'{S}/pages.css', encoding='utf-8').read() + '\n.app .t1{font-size:clamp(50px,6.2vw,94px)}.app .t2{font-size:.62em;line-height:1.05;margin-top:.12em}.sheet h2.big{font:800 26px/1.15 var(--display);letter-spacing:-.02em;text-transform:none;margin:0 0 10px}'
# the typefaces are the site's own files: beside the page in a prototype, at /fonts/ on the site
FONTS = open(f'{S}/fonts-core.css', encoding='utf-8').read().replace('url(fonts/', 'url(fonts/' if PROTO else 'url(/fonts/')
HEAD = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>%(title)s</title><meta name="description" content="%(desc)s">
%(extra)s<style>%(fonts)s:root{--app:%(c)s;--on:%(o)s}
%(css)s</style></head>
<body class="%(kind)s">
<div class="grain" aria-hidden="true"></div>
<header class="nav"><a class="brand" href="%(root)s">Pinillos <i>LAB</i></a><a class="mbtn" href="%(root)s#menu">MENU</a></header>
<main class="wrap">
 <aside class="side">
  <a class="pill" href="%(home)s">← %(back)s</a>
  <h1 class="t1">%(w1)s<span class="t2">%(w2)s</span></h1>
  <img class="icon" src="%(icon)s" alt="" width="74" height="74">
  <div class="row">%(row)s</div>
 </aside>
 <div class="main">%(main)s</div>
</main>
</body></html>
'''


def extra(path, title, desc, go=None, ld=None):
    """The site's pages say where they live and how they look when shared; a plain page also sends browsers on to its room."""
    if PROTO:
        return ''
    u = sitedata.SITE + path
    x = (f'<link rel="canonical" href="{u}">\n<link rel="icon" type="image/svg+xml" href="/favicon.svg">\n<link rel="apple-touch-icon" href="/images/pinilloslab-logo.png">\n'
         f'<meta property="og:type" content="website">\n<meta property="og:site_name" content="Pinillos Lab">\n<meta property="og:url" content="{u}">\n<meta property="og:title" content="{esc(title)}">\n'
         f'<meta property="og:description" content="{esc(desc)}">\n<meta property="og:image" content="{sitedata.SITE}/images/og.png">\n<meta name="twitter:card" content="summary_large_image">\n')
    if ld:
        x += '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False).replace('</', '<\\/') + '</script>\n'
    if go is not None:
        x += '<script>location.replace(' + json.dumps(go) + ')</script>\n'
    return x


def write(rel, doc):
    # arrows only ever appear in buttons (pills): the policies' own words are left as written
    doc = re.sub(r'<a class="pill[^>]*>.*?</a>', lambda m: ico(m.group(0)), doc, flags=re.S)
    f = f'{OUT}/{rel}'
    os.makedirs(os.path.dirname(f), exist_ok=True)
    open(f, 'w', encoding='utf-8').write(doc)


def crumbs(*items):
    return {'@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': sitedata.SITE + p} for i, (n, p) in enumerate(items)]}


def webpage(title, path, *trail, **more):
    return dict({'@context': 'https://schema.org', '@type': 'WebPage', 'name': title, 'url': sitedata.SITE + path, 'inLanguage': 'en', 'isPartOf': {'@id': sitedata.SITE + '/#website'}, 'breadcrumb': crumbs(('Pinillos Lab', '/'), *trail)}, **more)


mark = 'data:image/svg+xml;base64,' + base64.b64encode(b'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74 74"><rect width="74" height="74" rx="19" fill="#0B0B10"/><rect x="6" y="6" width="62" height="62" rx="14" fill="#E4FF3A"/><text x="37" y="54" font-family="-apple-system,Helvetica,Arial,sans-serif" font-weight="800" font-size="48" text-anchor="middle" fill="#0B0B10">P</text></svg>').decode()
R = D['routes']
n = 0
for a in APPS:
    k, name, store = a['k'], a['name'], a['store']
    icon = 'data:image/jpeg;base64,' + base64.b64encode(open(f'{S}/ic/{k}.jpg', 'rb').read()).decode()
    base = dict(c=a['c'], o=a['o'], css=CSS, fonts=FONTS, root=ROOT, home=home(k), back=name, icon=icon)
    row = lambda other, otherT: f'<a class="pill k" href="{store}" target="_blank" rel="noopener">Get {name} on the App Store ↗</a><a class="pill" href="{other}">{otherT} →</a>'
    # Privacy: one sheet of paper
    secs, upd = sections(k)
    t, d = f'{name} · Privacy policy · Pinillos Lab', R.get(f'/{k}/privacy', {}).get('description', f'Privacy policy for {name}, an app by Pinillos Lab.')
    main = '<article class="sheet">' + (f'<p class="lab dim">Last updated: {upd}</p>' if upd else '') + ''.join(f'<section><h2 class="lab">— {tt}</h2>{b}</section>' for tt, b in secs) + '</article>'
    page = HEAD % dict(base, kind='privacy', title=esc(t), desc=esc(d), extra=extra(f'/{k}/privacy/', t, d, ld=webpage(t, f'/{k}/privacy/', (name, f'/{k}/'), ('Privacy policy', f'/{k}/privacy/'))),
                       w1='Privacy', w2='policy', row=row(url(k, 'support'), 'Support'), main=main)
    # Support: the way to reach him first, in ink; then one card per subject
    ssecs, _ = sections(k + '-support')
    t2, d2 = f'{name} · Support · Pinillos Lab', f'Help and support for {name}, an app by Pinillos Lab.'
    cards = ''.join(f'<section class="sheet card{" dark" if i == 0 else ""}"><h2 class="lab">{"" if i == 0 else "— "}{tt}</h2>{b}</section>' for i, (tt, b) in enumerate(ssecs))
    spage = HEAD % dict(base, kind='support', title=esc(t2), desc=esc(d2), extra=extra(f'/{k}/support/', t2, d2, ld=webpage(t2, f'/{k}/support/', (name, f'/{k}/'), ('Support', f'/{k}/support/'))),
                        w1='Support', w2='center', row=row(url(k, 'privacy'), 'Privacy policy'), main='<div class="cards">' + cards + '</div>')
    for kind, doc in (('privacy', page), ('support', spage)):
        write(f'{k}-{kind}.html' if PROTO else f'{k}/{kind}/index.html', doc)
        n += 1
    print(k.ljust(10), 'privacy', len(secs), 'sections', upd.ljust(14), '· support', len(ssecs), 'cards')

# The site's own privacy policy (pinilloslab.com/privacy): the first room's colour, the lab's mark in place of an app icon
secs, upd = sections('site')
t, d = 'Privacy policy · Pinillos Lab', R['/privacy']['description']
main = '<article class="sheet">' + (f'<p class="lab dim">Last updated: {upd}</p>' if upd else '') + ''.join(f'<section><h2 class="lab">— {tt}</h2>{b}</section>' for tt, b in secs) + '</article>'
doc = HEAD % dict(c='#E4FF3A', o=INK, css=CSS, fonts=FONTS, root=ROOT, home=ROOT, back='Pinillos Lab', icon=mark, kind='privacy', title=esc(t), desc=esc(d), extra=extra('/privacy/', t, d, ld=webpage(t, '/privacy/', ('Privacy policy', '/privacy/'))),
                  w1='Privacy', w2='policy', row=f'<a class="pill k" href="{ROOT}#contact">Contact →</a>', main=main)
write('privacy.html' if PROTO else 'privacy/index.html', doc)
n += 1
print('site'.ljust(10), 'privacy', len(secs), 'sections', upd)

if not PROTO:
    # Each app's own address, About, Contact: real pages with real words for whoever reads without JavaScript; a browser goes on to the room.
    def plain(rel, path, go, c, o, icon, w1, w2, row, body, crumb, ld_type='WebPage', entity=None):
        m = R[path.rstrip('/')]
        ld = webpage(m['title'], path, (crumb, path), description=m['description'])
        ld['@type'] = ld_type
        if entity:
            ld['mainEntity'] = entity
        write(rel, HEAD % dict(c=c, o=o, css=CSS, fonts=FONTS, root=ROOT, home=go, back='Pinillos Lab', icon=icon, kind='privacy app', title=esc(m['title']), desc=esc(m['description']),
                               extra=extra(path, m['title'], m['description'], go=go, ld=ld), w1=w1, w2=w2, row=row, main='<article class="sheet">' + body + '</article>'))

    for a in APPS:
        k, name = a['k'], a['name']
        icon = 'data:image/jpeg;base64,' + base64.b64encode(open(f'{S}/ic/{k}.jpg', 'rb').read()).decode()
        body = (f'<p class="lab dim">{esc(a["small"])}</p><section><h2 class="big">{esc(name)}, {esc(a["tag"])}.</h2><p>{esc(a["about"])}</p></section>'
                f'<section><h2 class="lab">— More</h2><ul><li><a href="{a["store"]}">{esc(name)} on the App Store</a></li><li><a href="/{k}/support/">Support</a></li><li><a href="/{k}/privacy/">Privacy policy</a></li><li><a href="/">All the apps by Pinillos Lab</a></li></ul></section>')
        plain(f'{k}/index.html', f'/{k}/', f'/#{k}', a['c'], a['o'], icon, esc(name), esc(a['tag']),
              f'<a class="pill k" href="{a["store"]}" target="_blank" rel="noopener">Get {esc(name)} on the App Store ↗</a><a class="pill" href="/{k}/support/">Support →</a><a class="pill" href="/{k}/privacy/">Privacy policy →</a>', body, name,
              entity={'@type': 'SoftwareApplication', 'name': name, 'description': a['about'], 'operatingSystem': D['meta']['apps'][k].get('os', ''), 'installUrl': a['store'], 'url': f'{sitedata.SITE}/{k}/', 'author': {'@id': sitedata.SITE + '/#eduardo'}})
        n += 1
    # Wealth Square is not out yet and has no room: its old address stays alive and leads home
    ws = D['meta']['apps'].get('wealth-square', {})
    plain('wealth-square/index.html', '/wealth-square/', '/', '#17171C', PAPER, mark, 'Wealth Square', 'coming soon',
          '<a class="pill" href="/">See the apps →</a>', f'<p class="lab dim">macOS · in development</p><section><h2 class="big">Wealth Square</h2><p>{esc(ws.get("about", ""))} Not ready to show yet.</p></section>', 'Wealth Square')
    ab = D['about']
    stops = ''.join(f'<section><h2 class="lab">— {esc(b)} · {esc(s)}</h2><p>{esc(t)}</p></section>' for b, s, t in ab[1:])
    aw = ''.join(f'<li><strong>{y} · {esc(r)}</strong> — {esc(nm)}, {esc(pl.replace(" · ", ", "))}</li>' for y, r, nm, pl in D['awards'])
    plain('about/index.html', '/about/', '/#about', '#17171C', PAPER, mark, 'About', 'me', '<a class="pill" href="/">See the apps →</a><a class="pill" href="/contact/">Contact →</a>',
          f'<p class="lab dim">{esc(ab[0][1])}</p><section><h2 class="big">Eduardo Pinillos</h2><p>{esc(ab[0][2].replace(" Walk with me.", ""))}</p></section>{stops}<section><h2 class="lab">— Recognition</h2><ul>{aw}</ul></section>',
          'About', ld_type='AboutPage', entity={'@id': sitedata.SITE + '/#eduardo'})
    plain('contact/index.html', '/contact/', '/#contact', INK, PAPER, mark, 'Got an', 'idea?', f'<a class="pill h" href="{sitedata.REDDIT}" target="_blank" rel="noopener">Reddit me ↗</a>',
          f'<p class="lab dim">Contact</p><section><h2 class="big">Reddit is the best way to reach me.</h2><p>Message me at <a href="{sitedata.REDDIT}">u/beretta51</a>, or write to <a href="mailto:{sitedata.EMAIL}">{sitedata.EMAIL}</a>. A real person reads every message.</p></section>',
          'Contact', ld_type='ContactPage')
    n += 3
print('wrote', n, 'pages to', OUT, '(' + MODE + ')')
