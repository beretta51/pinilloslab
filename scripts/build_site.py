#!/usr/bin/env python3
"""Builds pinilloslab.com.

    python3 scripts/build_site.py

Run it after any change to the sources, then commit and push: GitHub Pages serves this folder as it is.

Where things are written once:
  _source/walk-template.html   the walk (the home): the rooms, the avatar, what each wall says
  _source/head.html            the home's title, description, sharing tags and structured data
  _source/site-meta.json       each address's title and description, and what each app is
  policies/<app>.html          each app's privacy policy   } plain documents: an optional "<!-- updated: … -->"
  policies/<app>-support.html  each app's support page     } line, then one <h2> per section
  policies/site.html           the site's own privacy policy

What it makes (never edit these by hand):
  index.html                               the walk
  <app>/privacy/, <app>/support/, privacy/ the pages, in the walk's look
  <app>/, about/, contact/, wealth-square/ plain text pages at the old addresses: search engines read them, browsers are
                                           sent on to that room of the walk (/#dimmly, /#about …)
  trovelo/…                                forwarders to troveloapp.com
  sitemap.xml
"""
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "_source"
SITE = "https://pinilloslab.com"


def run(*args, **env):
    r = subprocess.run([sys.executable, "-I", *map(str, args)], env=dict(os.environ, **env))
    if r.returncode:
        sys.exit("build_site: %s failed" % args[0])


run(SRC / "build_walk.py", SITE="1")
run(SRC / "build_pages.py", "site", ROOT)

# ─── Trovelo moved to troveloapp.com (1 Nov 2026) ─────────────────────────
# Its old addresses stay alive as forwarders, so links in old mails, posts
# and app versions still land on the right page. The Trovelo Publisher pages
# and the TikTok file under trovelo/ are real pages and stay as they are.
REDIRECTS = {
    "trovelo": "https://troveloapp.com/",
    "trovelo/press": "https://troveloapp.com/press/",
    "trovelo/privacy": "https://troveloapp.com/privacy/",
    "trovelo/support": "https://troveloapp.com/support/",
    "trovelo/help": "https://troveloapp.com/help/",
    "trovelo/help/add-places-to-your-days": "https://troveloapp.com/help/add-places-to-your-days/",
}
# Pinterest checks its tag on pinilloslab.com/trovelo/.
EXTRA_HEAD = {
    "trovelo": '<meta name="p:domain_verify" content="7396fc109f5ed8aafdc524c564dbf98c"/>\n',
}
FORWARDER = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trovelo has moved to troveloapp.com</title>
<link rel="canonical" href="{to}">
<meta http-equiv="refresh" content="0; url={to}">
{extra}<script>location.replace("{to}" + location.search + location.hash);</script>
</head>
<body>
<p>Trovelo now lives at <a href="{to}">{to}</a>.</p>
</body>
</html>
"""
for d, to in REDIRECTS.items():
    out_dir = ROOT / d
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "index.html").write_text(FORWARDER.format(to=to, extra=EXTRA_HEAD.get(d, "")), encoding="utf-8")
    print("→ " + d + "/index.html  →  " + to)

# ─── sitemap.xml: the pages that are pages (the old addresses that only lead to a room are left out) ───
APPS = ["dimmly", "percha", "solid", "gridborne", "dummo", "takekit"]
urls = [("/", "1.0")] + [("/%s/support/" % a, "0.6") for a in APPS] + [("/%s/privacy/" % a, "0.4") for a in APPS] + [("/privacy/", "0.3")]
(ROOT / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + "".join("  <url><loc>%s%s</loc><priority>%s</priority></url>\n" % (SITE, u, p) for u, p in urls)
    + "</urlset>\n", encoding="utf-8")
print("✓ sitemap.xml  (%d addresses)" % len(urls))
print("\nDone.")
