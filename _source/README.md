# The source of pinilloslab.com

The site is built from this folder by one command, run from the repository's root:

    python3 scripts/build_site.py

Then commit and push. GitHub Pages serves the repository as it is (this folder, starting with `_`, is not published).

## What is where

| To change… | Edit |
| --- | --- |
| A room of the walk, the avatar, what a wall says, the awards | `walk-template.html` |
| The home's title, description, sharing image, structured data | `head.html` |
| The title or description of another address; what each app is | `site-meta.json` |
| An app's privacy policy or support page | `../policies/<app>.html`, `../policies/<app>-support.html` |
| The site's own privacy policy | `../policies/site.html` |
| The look of the Privacy and Support pages | `pages.css` |
| An app's live recreation on its phone | `<xx>_scene.css` / `<xx>_scene.js` (and its pieces in `dm/ pc/ so/ gb/ du/ tk/`) |
| The avatar's sculpted shape | `sculpt.js`, then `node sculpt.js` (writes `avatar.json`) |

`build_walk.py` makes `../index.html`; `build_pages.py` makes every other page; `sitedata.py` reads what both need.

## Trying a change before it goes live

    python3 -I _source/build_walk.py

writes a stand-alone prototype to `_source/out/` (not committed). To see the real thing locally, build the site and serve the
repository's root: `python3 -m http.server 8934`.

## Notes

- Nothing is loaded from other servers: the typefaces (`../fonts/`) and the 3D engine (`../three.min.js`, three.js r128, MIT) are
  the site's own files, and the page stores nothing in the browser. The privacy policy says so; keep it true.
- Trovelo's recreation was taken from its own site and is kept in `tv_cache.json`. `TROVELO=refresh python3 -I _source/build_walk.py`
  takes it again from `~/Documents/GitHub/troveloapp`.
- The site as it was before the walk is the tag `sitio-anterior-2026-11-12`.
