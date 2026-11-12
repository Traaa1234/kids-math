'use strict';
/* Small helpers shared by every file */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const pad2 = n => String(n).padStart(2, '0');
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const ch = (arr) => arr.map(v => (typeof v === 'object' ? v : { label: esc(v), val: v }));

function numChoices(ans, extra = []) {
  const set = new Set([ans]);
  for (const c of extra) { if (set.size >= 4) break; if (Number.isInteger(c) && c >= 0) set.add(c); }
  for (const c of shuffle([ans + 1, ans - 1, ans + 2, ans - 2, ans + 10, ans - 10, ans + 5])) { if (set.size >= 4) break; if (c >= 0) set.add(c); }
  let guard = 0; while (set.size < 4 && guard++ < 50) set.add(ans + rnd(3, 20));
  return shuffle([...set]).map(v => ({ label: String(v), val: v }));
}

function todayStr(off = 0) { const d = new Date(); d.setDate(d.getDate() + off); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
