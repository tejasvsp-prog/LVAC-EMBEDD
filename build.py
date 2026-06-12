#!/usr/bin/env python3
"""Assemble the single-file, Wix-embeddable index.html from src/.

Inlines styles.css, image-slot.js, and app.jsx into one HTML document and
embeds the official L.A.V.C. logo as a base64 data URI (so the bundle is
fully self-contained — no external asset requests except the font CDN and
the React/Babel CDNs needed to run the JSX).
"""
import base64
import pathlib

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"

css = (SRC / "styles.css").read_text()
islot = (SRC / "image-slot.js").read_text()
app = (SRC / "app.jsx").read_text()


def esc(s):
    """Prevent inline <script> bodies from closing the tag prematurely."""
    return s.replace("</script>", "<\\/script>").replace("</SCRIPT>", "<\\/SCRIPT>")


islot = esc(islot)
app = esc(app)

logo_b64 = base64.b64encode((SRC / "assets" / "lavc-logo.png").read_bytes()).decode()
logo_uri = "data:image/png;base64," + logo_b64

html = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Lansing AI Summit &amp; Workforce Forum &middot; 2026</title>
  <meta name="description" content="A one-day hybrid event connecting students, veterans, small business owners, and employers around the future of AI-powered work." />
  <link rel="icon" href="{logo_uri}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,300..700&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" />
  <style>
{css}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>window.LAVC_LOGO_SRC = "{logo_uri}";</script>
  <script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>
  <script>
{islot}
  </script>
  <script type="text/babel" data-presets="react">
{app}
  </script>
</body>
</html>
"""

(ROOT / "index.html").write_text(html)
print(f"index.html: {len(html):,} bytes (logo {len(logo_b64):,} b64 chars)")
