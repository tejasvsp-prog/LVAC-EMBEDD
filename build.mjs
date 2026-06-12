// Assemble the single-file, Wix-embeddable index.html from src/.
//
// JSX in src/app.jsx is PRE-COMPILED to plain JS with Babel at build time,
// so the browser runs vanilla JavaScript — no @babel/standalone in the page.
// (In-browser Babel on a ~400KB inline script is a common cause of blank
// screens on real hosts.) React + ReactDOM still load from the CDN.
//
// The official L.A.V.C. logo is embedded as a base64 data URI so the bundle
// is fully self-contained.
//
// Usage: node build.mjs   (or: npm run build)

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import * as babel from "@babel/core";

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, "src");

const css = readFileSync(join(SRC, "styles.css"), "utf8");
const islot = readFileSync(join(SRC, "image-slot.js"), "utf8");
const appJsx = readFileSync(join(SRC, "app.jsx"), "utf8");

// Compile JSX -> plain JS (classic runtime: React.createElement, which the
// React UMD global provides).
const { code: appJs } = babel.transformSync(appJsx, {
  presets: [["@babel/preset-react", { runtime: "classic" }]],
  filename: "app.jsx",
  compact: false,
});

// Keep inline <script> bodies from closing the tag early.
const esc = (s) => s.replace(/<\/script>/gi, "<\\/script>");

const logoB64 = readFileSync(join(SRC, "assets", "lavc-logo.png")).toString("base64");
const logoUri = `data:image/png;base64,${logoB64}`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Lansing AI Summit &amp; Workforce Forum &middot; 2026</title>
  <meta name="description" content="A one-day hybrid event connecting students, veterans, small business owners, and employers around the future of AI-powered work." />
  <link rel="icon" href="${logoUri}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,300..700&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" />
  <style>
${css}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>window.LAVC_LOGO_SRC = "${logoUri}";</script>
  <script crossorigin="anonymous" src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
  <script crossorigin="anonymous" src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
  <script>
${esc(islot)}
  </script>
  <script>
${esc(appJs)}
  </script>
</body>
</html>
`;

writeFileSync(join(ROOT, "index.html"), html);
console.log(`index.html: ${html.length.toLocaleString()} bytes (compiled JS, no in-browser Babel)`);
