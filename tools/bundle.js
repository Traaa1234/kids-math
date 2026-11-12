#!/usr/bin/env node
/* Bundle the app into ONE html file you can email, put on a USB stick, or open offline.
   Usage:  node tools/bundle.js        →  dist/brainy-quest.html
   Inlines every local <link rel="stylesheet"> and <script src> from index.html.
   No dependencies — only Node.js. */
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
let html = read('index.html');
let files = 0;
html = html.replace(/<link rel="stylesheet" href="(?!https?:)([^"]+)">/g, (_, href) => { files++; return `<style>\n/* ${href} */\n${read(href)}</style>`; });
html = html.replace(/<script src="(?!https?:)([^"]+)"><\/script>/g, (_, src) => { files++; return `<script>\n/* ${src} */\n${read(src).replace(/<\/script/gi, '<\\/script')}</script>`; });
const out = path.join(root, 'dist', 'brainy-quest.html');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`Bundled ${files} files → ${path.relative(root, out)} (${Math.round(html.length / 1024)} KB)`);
