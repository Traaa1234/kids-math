#!/usr/bin/env node
/* Quick check that every JS file parses, that index.html loads them all, and that
   no two files declare the same top-level name (they share one global scope).
   Usage: node tools/syntax-check.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const loaded = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
let bad = 0;
const all = fs.readdirSync(path.join(root, 'js'), { recursive: true }).filter(f => f.endsWith('.js')).map(f => 'js/' + f.split(path.sep).join('/'));
const optional = ['js/activities/_template.js', 'js/dev/self-check.js'];
for (const f of all) if (!loaded.includes(f) && !optional.includes(f)) { console.log(`⚠  ${f} is not loaded by index.html`); bad++; }
for (const f of loaded) if (!fs.existsSync(path.join(root, f))) { console.log(`✖  index.html loads missing file ${f}`); bad++; }
const seen = {};
for (const f of [...loaded, ...optional]) {
  const src = fs.readFileSync(path.join(root, f), 'utf8');
  try { new vm.Script(src, { filename: f }); } catch (e) { console.log(`✖  ${f}: ${e.message}`); bad++; continue; }
  if (optional.includes(f)) continue;
  for (const m of src.matchAll(/^(?:const|let|function)\s+([A-Za-z_$][\w$]*)/gm)) {
    if (seen[m[1]]) { console.log(`✖  "${m[1]}" is declared in both ${seen[m[1]]} and ${f}`); bad++; } else seen[m[1]] = f;
  }
}
console.log(bad ? `\n${bad} problem(s) found.` : `✅ ${loaded.length} scripts OK, no duplicate names.`);
process.exit(bad ? 1 : 0);
