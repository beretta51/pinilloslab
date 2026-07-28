#!/usr/bin/env python3
"""Prerender SPA routes as real static pages for GitHub Pages.

The site is a single-page app (index.html) whose router swaps title/meta
per path at runtime. Crawlers that don't execute JavaScript (GPTBot,
ClaudeBot, PerplexityBot…) would otherwise get a 404 for /trovelo,
/dimmly, etc. This script copies index.html into each route directory
with the route's own <title>, meta description, canonical, Open Graph
tags, and a page-specific JSON-LD block — so every URL returns a real
200 page, while the inline SPA still takes over in the browser.

Run after every edit to index.html:

    python3 scripts/build_routes.py

Route titles/descriptions are read from the ROUTES object inside
index.html's router, and app data from the JSON-LD graph in <head>,
so there is a single source of truth. The script fails loudly if any
expected marker in index.html goes missing.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://pinilloslab.com"

html = (ROOT / "index.html").read_text(encoding="utf-8")

# ─── Routes to prerender ────────────────────────────────────────────────
# dir: output directory (dir/index.html). app: name in the JSON-LD graph.
# Privacy pages that already exist as hand-written static files
# (trovelo/privacy, dummo/privacy) are left untouched.
PAGES = [
    {"route": "/about", "dir": "about", "type": "AboutPage"},
    {"route": "/contact", "dir": "contact", "type": "ContactPage"},
    {"route": "/privacy", "dir": "privacy", "type": "WebPage", "policy": "Pinilloslab.com"},
    {"route": "/trovelo", "dir": "trovelo", "app": "Trovelo"},
    {"route": "/dimmly", "dir": "dimmly", "app": "Dimmly"},
    {"route": "/percha", "dir": "percha", "app": "Percha"},
    {"route": "/solid", "dir": "solid", "app": "Solid"},
    {"route": "/gridborne", "dir": "gridborne", "app": "Gridborne"},
    {"route": "/wealth-square", "dir": "wealth-square", "app": "Wealth Square"},
    {"route": "/dummo", "dir": "dummo", "app": "Dummo"},
    {"route": "/takekit", "dir": "takekit", "app": "TakeKit"},
    {"route": "/dimmly/privacy", "dir": "dimmly/privacy", "type": "WebPage", "crumb": "Dimmly"},
    {"route": "/percha/privacy", "dir": "percha/privacy", "type": "WebPage", "crumb": "Percha"},
    {"route": "/solid/privacy", "dir": "solid/privacy", "type": "WebPage", "crumb": "Solid"},
    {"route": "/gridborne/privacy", "dir": "gridborne/privacy", "type": "WebPage", "crumb": "Gridborne"},
    {"route": "/takekit/privacy", "dir": "takekit/privacy", "type": "WebPage", "crumb": "TakeKit"},
]


def unquote_js(raw):
    """Decode a JS single-quoted string literal (handles \\' and \\uXXXX)."""
    return json.loads('"' + raw.replace("\\'", "'").replace('"', '\\"') + '"')


# ─── Extract per-route title/description from the router's ROUTES object ──
route_meta = {}
route_re = re.compile(
    r"'(/[a-z-]+(?:/privacy)?)':\s*\{\s*"
    r"title:\s*'((?:\\.|[^'\\])*)',\s*"
    r"description:\s*'((?:\\.|[^'\\])*)'\s*\}"
)
for m in route_re.finditer(html):
    route_meta[m.group(1)] = {
        "title": unquote_js(m.group(2)),
        "description": unquote_js(m.group(3)),
    }

# ─── Extract app nodes from the JSON-LD graph in <head> ───────────────────
ld_match = re.search(r'<script type="application/ld\+json">\n(.*?)\n</script>', html, re.S)
if not ld_match:
    sys.exit("JSON-LD block not found in index.html")
graph = json.loads(ld_match.group(1))["@graph"]
item_list = next(n for n in graph if n["@type"] == "ItemList")
app_nodes = {li["item"]["name"]: li["item"] for li in item_list["itemListElement"]}


# ─── Helpers ──────────────────────────────────────────────────────────────
def esc_attr(s):
    return s.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;").replace(">", "&gt;")


def must_replace(doc, needle, replacement):
    """Replace exactly once; fail loudly if a future index.html edit
    removes the marker, so we never silently produce broken pages."""
    if needle not in doc:
        sys.exit("Marker not found in index.html: " + needle)
    return doc.replace(needle, replacement, 1)


def must_replace_re(doc, pattern, replacement):
    m = re.search(pattern, doc)
    if not m:
        sys.exit("Marker not found in index.html: " + pattern)
    return must_replace(doc, m.group(0), replacement)


def page_json_ld(page, url, meta):
    crumbs = [{"@type": "ListItem", "position": 1, "name": "Pinillos Lab", "item": SITE + "/"}]
    if page.get("crumb"):
        crumbs.append({
            "@type": "ListItem", "position": 2, "name": page["crumb"],
            "item": SITE + "/" + page["crumb"].lower() + "/",
        })
    self_name = page.get("app") or meta["title"].split(" — ")[0]
    crumbs.append({"@type": "ListItem", "position": len(crumbs) + 1, "name": self_name, "item": url})

    node = {
        "@type": page.get("type", "WebPage"),
        "@id": url,
        "url": url,
        "name": meta["title"],
        "description": meta["description"],
        "isPartOf": {"@id": SITE + "/#website"},
        "breadcrumb": {"@type": "BreadcrumbList", "itemListElement": crumbs},
        "inLanguage": "en",
    }

    if page.get("app"):
        app = json.loads(json.dumps(app_nodes[page["app"]]))
        if app.get("url"):
            app["installUrl"] = app["url"]
            app["downloadUrl"] = app["url"]
        app["url"] = url
        app["mainEntityOfPage"] = url
        node["mainEntity"] = app
    elif page["route"] == "/about":
        node["mainEntity"] = {"@id": SITE + "/#eduardo"}

    return {"@context": "https://schema.org", "@graph": [node]}


# ─── Privacy policies: render the APP_PRIVACY map to static HTML ──────────
# The five generated /{app}/privacy pages used to ship an empty
# <div id="privacy-content"> filled by JS at runtime, so without
# JavaScript — an App Store reviewer's crawler, a reader-mode save, a bot —
# they had zero words of policy. We read the same JS map that the SPA uses
# so there is still one source of truth, and bake the markup in.

def js_object_to_json(src):
    """Convert the APP_PRIVACY object literal to JSON.

    Scans character by character rather than regexing, because the policy
    strings contain apostrophes, HTML tags and colons that would otherwise
    look like structure.
    """
    out, i, n = [], 0, len(src)
    while i < n:
        c = src[i]
        if c == "'":                        # JS single-quoted string
            i += 1
            buf = []
            while i < n and src[i] != "'":
                if src[i] == "\\":
                    nxt = src[i + 1]
                    buf.append("'" if nxt == "'" else src[i:i + 2])
                    i += 2
                    continue
                buf.append('\\"' if src[i] == '"' else src[i])
                i += 1
            i += 1
            out.append('"' + "".join(buf) + '"')
            continue
        if c.isalpha() or c == "_":         # bare key -> quoted key
            j = i
            while j < n and (src[j].isalnum() or src[j] in "_$"):
                j += 1
            word = src[i:j]
            k = j
            while k < n and src[k] in " \t\n":
                k += 1
            if k < n and src[k] == ":":
                out.append('"' + word + '"')
                i = j
                continue
            out.append(word)
            i = j
            continue
        if c == "," and src[i + 1:].lstrip()[:1] in ("}", "]"):
            i += 1                          # trailing comma
            continue
        out.append(c)
        i += 1
    return "".join(out)


def extract_app_privacy(doc):
    # Some entries write `updated: PRIVACY_DEFAULT_DATE` instead of a literal,
    # so resolve the constants the map leans on before parsing.
    consts = dict(re.findall(r"const ([A-Z_]+) = '((?:\\.|[^'\\])*)';", doc))
    start = doc.index("const APP_PRIVACY = {") + len("const APP_PRIVACY = ")
    depth, i, in_str = 0, start, False
    while i < len(doc):
        ch = doc[i]
        if in_str:
            if ch == "\\":
                i += 2
                continue
            if ch == "'":
                in_str = False
        elif ch == "'":
            in_str = True
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                frag = doc[start:i + 1]
                for name, value in consts.items():
                    frag = frag.replace(name, "'" + value + "'")
                return json.loads(js_object_to_json(frag))
        i += 1
    sys.exit("APP_PRIVACY block not found in index.html")


def render_privacy(data):
    """Same markup renderPrivacy() builds in the browser."""
    html_out = ""
    if data.get("updated"):
        html_out += '<div class="privacy-updated">Last updated: %s</div>' % data["updated"]
    for sec in data["sections"]:
        html_out += "<section><h3>— %s</h3>" % sec["h"]
        if sec.get("p"):
            html_out += "<p>%s</p>" % sec["p"]
        if sec.get("list"):
            html_out += "<ul>" + "".join("<li>%s</li>" % li for li in sec["list"]) + "</ul>"
        if sec.get("p2"):
            html_out += "<p>%s</p>" % sec["p2"]
        html_out += "</section>"
    return html_out


APP_PRIVACY = extract_app_privacy(html)


# ─── Build ────────────────────────────────────────────────────────────────
for page in PAGES:
    meta = route_meta.get(page["route"])
    if not meta:
        sys.exit("Route not found in index.html ROUTES: " + page["route"])
    url = SITE + page["route"] + "/"

    doc = html
    doc = must_replace_re(doc, r"<title>[^<]*</title>", "<title>" + esc_attr(meta["title"]) + "</title>")
    doc = must_replace_re(doc, r'<meta name="description" content="[^"]*">',
                          '<meta name="description" content="' + esc_attr(meta["description"]) + '">')
    doc = must_replace(doc, '<link rel="canonical" href="https://pinilloslab.com/">',
                       '<link rel="canonical" href="' + url + '">')
    doc = must_replace(doc, '<meta property="og:url" content="https://pinilloslab.com/">',
                       '<meta property="og:url" content="' + url + '">')
    doc = must_replace_re(doc, r'<meta property="og:title" content="[^"]*">',
                          '<meta property="og:title" content="' + esc_attr(meta["title"]) + '">')
    doc = must_replace_re(doc, r'<meta property="og:description" content="[^"]*">',
                          '<meta property="og:description" content="' + esc_attr(meta["description"]) + '">')
    doc = must_replace_re(doc, r'<meta name="twitter:title" content="[^"]*">',
                          '<meta name="twitter:title" content="' + esc_attr(meta["title"]) + '">')
    doc = must_replace_re(doc, r'<meta name="twitter:description" content="[^"]*">',
                          '<meta name="twitter:description" content="' + esc_attr(meta["description"]) + '">')

    # Root-relative assets: the copies live one or two directories deep, so
    # images/… and fonts/… must become /images/… and /fonts/… (absolute
    # https://pinilloslab.com/images/… URLs are untouched — the patterns
    # only match a quote or paren directly before the folder name).
    doc = doc.replace('"images/', '"/images/')
    doc = doc.replace('"fonts/', '"/fonts/')
    doc = doc.replace("url(fonts/", "url(/fonts/")

    # Privacy pages: bake the policy in so the page has real text without JS.
    policy_name = page.get("policy") or page.get("crumb")
    if policy_name:
        name = policy_name
        if name not in APP_PRIVACY:
            sys.exit("No APP_PRIVACY entry for " + name)
        doc = must_replace(doc, "<!-- Filled dynamically via APP_PRIVACY map in JS -->",
                           render_privacy(APP_PRIVACY[name]))
        if page.get("crumb"):
            doc = must_replace(doc, '<span id="privacy-app-name">Trovelo</span>',
                               '<span id="privacy-app-name">' + esc_attr(name) + "</span>")

    # Page-specific JSON-LD (breadcrumb + main entity), alongside the site graph.
    ld = ('<script type="application/ld+json">\n'
          + json.dumps(page_json_ld(page, url, meta), indent=2, ensure_ascii=False)
          + "\n</script>\n")
    doc = must_replace(doc, "</head>", ld + "</head>")

    out_dir = ROOT / page["dir"]
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "index.html").write_text(doc, encoding="utf-8")
    print("✓ " + page["dir"] + "/index.html  ←  " + meta["title"])

print("\nDone. %d routes prerendered." % len(PAGES))
