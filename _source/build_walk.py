# Builds the walk (the home of pinilloslab.com) from walk-template.html and the pieces in this folder.
#   SITE=1 python3 -I build_walk.py   writes ../index.html: the real page, with the site's head (head.html) and its text version
#   python3 -I build_walk.py          writes out/pinilloslab-recorrido.html: a prototype to try things before they go live
# Run it through scripts/build_site.py, which also makes the other pages.
import base64, html, json, os, re, subprocess, sys
S = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, S)
import sitedata
ROOT = os.path.dirname(S)
SITE = os.environ.get('SITE') == '1'
R = f'{ROOT}/images'
TR = os.path.expanduser('~/Documents/GitHub/troveloapp')
N = 4  # slides per app shown on the floating device
os.makedirs(f'{S}/sh6', exist_ok=True)
os.makedirs(f'{S}/ic', exist_ok=True)
os.makedirs(f'{S}/tvr', exist_ok=True)
apps = ['trovelo', 'dimmly', 'percha', 'solid', 'gridborne', 'dummo', 'takekit']
icons = {'trovelo': 'trovelo.png', 'dimmly': 'dimmly.png', 'percha': 'percha.webp', 'solid': 'solid.png', 'gridborne': 'gridborne.webp', 'dummo': 'dummo.png', 'takekit': 'takekit.png'}
b = lambda f, m='jpeg': f'data:image/{m};base64,' + base64.b64encode(open(f, 'rb').read()).decode()
sh = {}
for a in apps:
    sh[a] = []
    for n in range(1, (1 if a in ('trovelo', 'dimmly', 'percha', 'solid', 'gridborne', 'takekit', 'dummo') else N) + 1):  # apps with a recreation keep one slide as the fallback
        src, out = f'{R}/{a}-{n}.webp', f'{S}/sh6/{a}-{n}.jpg'
        if not os.path.exists(src):
            continue
        if not os.path.exists(out):
            subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '52', '-Z', '440', src, '--out', out], capture_output=True)
        sh[a].append(b(out))
for k, f in icons.items():
    out = f'{S}/ic/{k}.jpg'
    if not os.path.exists(out):
        subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '-Z', '132', f'{R}/{f}', '--out', out], capture_output=True)
ic = {k: b(f'{S}/ic/{k}.jpg') for k in icons}


# ---------- Trovelo's recreation, taken from its own website: the two iPhones' markup, the styles, the engine and Scene1 ----------
def balanced_div(src, start):
    i, d = start, 0
    for m in re.finditer(r'<div\b|</div>', src[start:]):
        d += 1 if m.group(0) != '</div>' else -1
        if d == 0:
            return src[start:start + m.end()]
    raise ValueError('unbalanced')


def trovelo():
    src = open(f'{TR}/index.html', encoding='utf-8').read()
    css = max(re.findall(r'<style>(.*?)</style>', src, flags=re.S), key=len)
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    keep, i = [], 0
    while True:
        j = css.find('{', i)
        if j < 0:
            break
        pre, k, d = css[i:j].strip(), j + 1, 1
        while d:
            d += {'{': 1, '}': -1}.get(css[k], 0)
            k += 1
        if pre.startswith('.tvx') or pre.startswith('@keyframes'):  # no @media (the phone is always its full self), no fonts, no page rules
            keep.append(pre + css[j:k])
        i = k
    strip = lambda h: re.sub(r'\s*\n\s*', '\n', re.sub(r'<!--.*?-->', '', h, flags=re.S))
    hero = strip(balanced_div(src, src.index('<div class="ip">', src.index('<div class="ip-wrap h-ip">'))))
    mp = strip(balanced_div(src, src.index('<div class="ip ipm">')))
    code = src[src.index('const HOLE = '):src.index('class Scene2 extends DCLogic')]
    code = re.sub(r"'/images/trovelo/([\w.-]+)'", r"TVIMG['\1']", code)
    used = sorted(set(re.findall(r'/images/trovelo/([\w.-]+)', hero + mp)) | set(re.findall(r"TVIMG\['([\w.-]+)'\]", code)) | {'sf-sprite.png', 'sf-sprite2.png', 'sf-sprite3.png'})
    img = {}
    for n in used:
        f, o = f'{TR}/images/trovelo/{n}', f'{S}/tvr/{n}'
        if not os.path.exists(f) or n.startswith('add-') or n.startswith('iphone-'):
            continue
        if not os.path.exists(o):
            if n.endswith('.png'):   # icon masks: half size keeps them sharp at the phone's size
                w = int(subprocess.run(['sips', '-g', 'pixelWidth', f], capture_output=True, text=True).stdout.split()[-1])
                subprocess.run(['sips', '--resampleWidth', str(w // 2), f, '--out', o], capture_output=True)
            elif os.path.getsize(f) > 60000:
                subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '58', f, '--out', o], capture_output=True)
            else:
                subprocess.run(['cp', f, o])
        img[n] = b(o, 'png' if n.endswith('.png') else 'jpeg')
    return {'css': '\n'.join(keep), 'hero': hero, 'map': mp}, img, code


# ---------- Percha's recreation: its page (pc_scene.*), SF Symbols (sfsym.swift) and the clothing cut-outs prepared by garm.swift ----------
def percha():
    g = {}
    for line in open(f'{S}/pc/g/sizes.txt', encoding='utf-8'):
        p = line.split()
        if len(p) == 3 and os.path.exists(f'{S}/pc/g/{p[0]}.jpg'):
            g[p[0]] = {'j': b(f'{S}/pc/g/{p[0]}.jpg'), 'm': b(f'{S}/pc/g/{p[0]}.png', 'png'), 'w': int(p[1]), 'h': int(p[2])}
    return g


# Trovelo's recreation is kept as taken (tv_cache.json), so the page builds the same everywhere; TROVELO=refresh takes it again from its site's folder.
TVC = f'{S}/tv_cache.json'
if os.environ.get('TROVELO') == 'refresh' or not os.path.exists(TVC):
    tvx, tvimg, tvcode = trovelo()
    json.dump([tvx, tvimg, tvcode], open(TVC, 'w', encoding='utf-8'))
else:
    tvx, tvimg, tvcode = json.load(open(TVC, encoding='utf-8'))
t = open(f'{S}/walk-template.html', encoding='utf-8').read()
rd = lambda f: open(f'{S}/{f}', encoding='utf-8').read()
J = lambda o: json.dumps(o).replace('</', '<\\/')


# ---------- the recreations: one block each at the end of the page, in the order of the walk. The opening script (the rooms and the
# avatar) comes first in the file, so it can start while these are still arriving; each block hands its recreation over when it lands. ----------
def block(name, consts, js, ret):
    return '<script>window.__ui&&__ui(' + json.dumps(name) + ',function(domScreen){' + consts + '\n' + js + '\nreturn ' + ret + '})</script>\n'


# Gridborne: the game's sprites (cut-outs by garm.swift, whole canvas) and portraits; its font, Changa One, comes from Google Fonts
def gridborne():
    g = {}
    for line in open(f'{S}/gb/g/sizes.txt', encoding='utf-8'):
        p = line.split()
        if len(p) == 3 and os.path.exists(f'{S}/gb/g/{p[0]}.jpg'):
            g[p[0]] = {'j': b(f'{S}/gb/g/{p[0]}.jpg'), 'm': b(f'{S}/gb/g/{p[0]}.png', 'png')}
    return g, {f[:-4]: b(f'{S}/gb/p/{f}') for f in sorted(os.listdir(f'{S}/gb/p')) if f.endswith('.jpg')}


blocks = []
# Trovelo: its own website's markup, styles, engine and scene (tv_scene.js wraps them)
if tvx:
    blocks.append(block('trovelo', 'const TVX=' + J(tvx) + ',TVIMG=' + J(tvimg) + ';', rd('tv_scene.js').replace('/*__TVXCODE__*/', tvcode), 'TVP'))
# Dimmly: its page (dim_scene.*), the app's logo from its Xcode project, SF Symbols rendered by sfsym.swift
dlogo = 'data:image/svg+xml;base64,' + base64.b64encode(open(f'{S}/dm/dimmlyLogo.svg', 'rb').read()).decode()
blocks.append(block('dimmly', 'const DIMCSS=' + J(rd('dim_scene.css')) + ',DIMSYM=' + rd('dm/sym.json') + ',DIMLOGO=' + J(dlogo) + ';', rd('dim_scene.js'), 'DMP'))
# Percha: its page (pc_scene.*), SF Symbols and the clothing cut-outs prepared by garm.swift
blocks.append(block('percha', 'const PCCSS=' + J(rd('pc_scene.css')) + ',PCSYM=' + rd('pc/sym.json') + ',PCG=' + J(percha()) + ';', rd('pc_scene.js'), 'PCP'))
# Solid: its page (so_scene.*) and its SF Symbols; fonts (Anton, Archivo, Space Mono) from Google Fonts
blocks.append(block('solid', 'const SOCSS=' + J(rd('so_scene.css')) + ',SOSYM=' + rd('so/sym.json') + ';', rd('so_scene.js'), 'SOP'))
gbg, gbpt = gridborne()
blocks.append(block('gridborne', 'const GBCSS=' + J(rd('gb_scene.css')) + ',GBG=' + J(gbg) + ',GBPT=' + J(gbpt) + ';', rd('gb_scene.js'), 'GBP'))
# Dummo: its page (du_scene.*) and the pieces cut from the Mac editor's own screenshots by dutool.swift (du/a)
duimg = {f.replace('.jpg', '') if f != 'phones.jpg' else f: b(f'{S}/du/a/{f}', 'png' if f.endswith('.png') else 'jpeg') for f in sorted(os.listdir(f'{S}/du/a')) if f.endswith(('.jpg', '.png'))}
blocks.append(block('dummo', 'const DUCSS=' + J(rd('du_scene.css')) + ',DUIMG=' + J(duimg) + ';', rd('du_scene.js'), 'DUP'))
# TakeKit: its page (tk_scene.*), SF Symbols and the camera photo from the app's own marketing art; fonts from Google Fonts
blocks.append(block('takekit', 'const TKCSS=' + J(rd('tk_scene.css')) + ',TKSYM=' + rd('tk/sym.json') + ',TKCAM=' + J(b(f'{S}/tk/cam.jpg')) + ';', rd('tk_scene.js'), 'TKP'))

# the avatar: its few measurements go in the opening script; its sculpted parts follow in a block of their own, so the room and its words
# are on screen while he is still arriving
av = json.loads(rd('avatar.json'))
parts = {k: v for k, v in av.items() if isinstance(v, dict) and 'p' in v}
# Typefaces and the 3D engine are files of the site itself (fonts/, three.min.js): the page asks nobody else for anything.
# The prototype alone keeps a safety net: if its own copy of the engine failed to load in the viewer, it would fetch the public one. The site proper must not have it.
GUARD = '<script>window.THREE||document.write(\'<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"><\\/script>\')</script>' if not SITE else ''
t = t.replace('/*__FONTS__*/', rd('fonts.css')).replace('<!--__THREEGUARD__-->', GUARD)
first = t.replace('__ICONS__', json.dumps(ic)).replace('__SHOTS__', json.dumps(sh)).replace('__AVATAR__', json.dumps({k: v for k, v in av.items() if k not in parts}))
avatar = '<script>window.__av&&__av(' + json.dumps(parts) + ')</script>\n'
body = first + avatar + ''.join(blocks)


def once(doc, a, b):
    if doc.count(a) != 1:
        raise SystemExit('build_walk: expected once in the page: ' + a[:70])
    return doc.replace(a, b)


if not SITE:
    out = body.replace('<!--__STATIC__-->', '')
    os.makedirs(f'{S}/out', exist_ok=True)
    open(f'{S}/out/index.html', 'w', encoding='utf-8').write('<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0}</style>' + out)
    open(f'{S}/out/pinilloslab-recorrido.html', 'w', encoding='utf-8').write(out)
    print('prototype built', len(out), 'in', f'{S}/out')
else:
    # ---------- the real page: the site's head, the pages at their real addresses, and the same words as plain text ----------
    D = sitedata.load()
    e = lambda s: html.escape(s, quote=True)
    body = once(body, "const pageURL=(k,p)=>k+'-'+p+'.html'", "const pageURL=(k,p)=>'/'+k+'/'+p+'/'")
    body = once(body, "{u:'privacy.html',in:1}", "{u:'/privacy/',in:1}")
    body = once(body, '<title>Pinillos Lab · El recorrido</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n', '')
    body = once(body, '<script src="three.min.js">', '<script src="/three.min.js">')
    body = body.replace('url(fonts/', 'url(/fonts/')
    # The text version: what the walk says, as an ordinary page. Search engines, screen readers without the 3D, and browsers that cannot
    # start it read this; where the walk runs it stays out of sight (html.js, set in the head before anything is drawn).
    hi, ab = D['hi'], D['about']
    apps = ''.join(
        '<li><h3><a href="%s">%s</a>, %s</h3><p>%s · %s</p><p><a href="%s">App Store</a> · %s</p></li>' % (
            'https://troveloapp.com/' if a['k'] == 'trovelo' else '/' + a['k'] + '/', e(a['name']), e(a['tag']), e(a['small']), e(a['about']), a['store'],
            '<a href="https://troveloapp.com/support/">Support</a> · <a href="https://troveloapp.com/privacy/">Privacy policy</a>' if a['k'] == 'trovelo'
            else '<a href="/%s/support/">Support</a> · <a href="/%s/privacy/">Privacy policy</a>' % (a['k'], a['k'])) for a in D['apps'])
    static = ('<main id="txt"><h1>Pinillos Lab</h1><p><strong>' + e(hi[0]) + '</strong> ' + e(hi[1]) + '. ' + e(hi[2].replace(' Walk with me.', '')) + '</p>'
              '<h2>Apps</h2><ul>' + apps + '</ul>'
              '<h2><a href="/about/">About me</a></h2><p>' + e(ab[0][1]) + '. ' + e(ab[0][2].replace(' Walk with me.', '')) + '</p><ul>' + ''.join('<li><strong>%s · %s.</strong> %s</li>' % (e(b), e(s), e(t)) for b, s, t in ab[1:]) + '</ul>'
              '<h2>Recognition</h2><ul>' + ''.join('<li>%s · %s — %s, %s</li>' % (y, e(r), e(n), e(p.replace(' · ', ', '))) for y, r, n, p in D['awards']) + '</ul>'
              '<h2><a href="/contact/">Contact</a></h2><p>Got an idea? <a href="' + sitedata.REDDIT + '">Reddit me</a>.</p>'
              '<p><a href="/privacy/">Privacy policy</a></p></main>')
    body = once(body, '<!--__STATIC__-->', static)
    css = ('<style>html,body{margin:0}html.js #txt{display:none}'
           '#txt{position:fixed;inset:0;z-index:99;overflow:auto;background:#F4F1E8;color:#0B0B10;padding:28px max(20px,calc(50vw - 340px)) 60px;font:17px/1.5 "Bricolage Grotesque",system-ui,-apple-system,sans-serif}'
           '#txt h1{font-size:44px;letter-spacing:-.03em;margin:0 0 10px}#txt h2{font-size:24px;margin:34px 0 8px}#txt h3{font-size:18px;margin:0}#txt p{margin:4px 0}#txt ul{padding-left:20px;margin:0}#txt li{margin:12px 0}#txt a{color:inherit}</style>\n')
    head = ('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
            + open(f'{S}/head.html', encoding='utf-8').read() + '<script>document.documentElement.className="js"</script>\n' + css)
    # the page's own styles go in the head; everything from the first piece of the scene on is the body
    cut = body.index('<div id="scr"')
    out = head + body[:cut] + '</head>\n<body>\n' + body[cut:] + '</body>\n</html>\n'
    open(f'{ROOT}/index.html', 'w', encoding='utf-8').write(out)
    print('site built', len(out), '→ index.html')
print('room', len(first), 'avatar', len(avatar), 'then', [len(x) // 1024 for x in blocks])
