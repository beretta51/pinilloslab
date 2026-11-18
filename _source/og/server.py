# Serves the site's folder for testing and accepts one thing more: POST /save?name=<file> writes the body into _source/out/og/ (pictures composed in the page).
import http.server, os, re, sys, urllib.parse
ROOT = os.path.expanduser('~/Documents/GitHub/pinilloslab-web')
OUT = os.path.join(ROOT, '_source', 'out', 'og')


class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def log_message(self, *a):
        pass

    def do_POST(self):
        q = urllib.parse.urlparse(self.path)
        name = urllib.parse.parse_qs(q.query).get('name', [''])[0]
        if q.path != '/save' or not re.fullmatch(r'[\w.-]+\.(jpg|png)', name):
            self.send_error(400); return
        n = int(self.headers.get('Content-Length', '0'))
        os.makedirs(OUT, exist_ok=True)
        open(os.path.join(OUT, name), 'wb').write(self.rfile.read(n))
        self.send_response(200); self.end_headers(); self.wfile.write(b'ok')


http.server.ThreadingHTTPServer(('127.0.0.1', 8802), H).serve_forever()
