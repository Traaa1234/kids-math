'use strict';
/* Math picture tools — each returns HTML (or fills an element) */
const PLACE = ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands'];
const ONES_W = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS_W = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
function numWords(n) {
  if (n < 20) return ONES_W[n];
  if (n < 100) return TENS_W[Math.floor(n / 10)] + (n % 10 ? '-' + ONES_W[n % 10] : '');
  if (n < 1000) return ONES_W[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + numWords(n % 100) : '');
  return numWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + numWords(n % 1000) : '');
}
function splitPlace(n) { const s = String(n), L = s.length; return [...s].map((d, i) => +d * 10 ** (L - 1 - i)).filter(v => v > 0); }
const expanded = n => n === 0 ? '0' : splitPlace(n).join(' + ');
const fr = (n, d) => `<span class="frac"><span>${n}</span><span>${d}</span></span>`;
const ORD = { 1: ['whole', 'wholes'], 2: ['half', 'halves'], 3: ['third', 'thirds'], 4: ['fourth', 'fourths'], 5: ['fifth', 'fifths'], 6: ['sixth', 'sixths'], 7: ['seventh', 'sevenths'], 8: ['eighth', 'eighths'], 9: ['ninth', 'ninths'], 10: ['tenth', 'tenths'], 12: ['twelfth', 'twelfths'], 11: ['eleventh', 'elevenths'] };
const fracWords = (n, d) => `${numWords(n)} ${ORD[d] ? ORD[d][n === 1 ? 0 : 1] : 'over ' + d}`;

/* ---------- ten frames (add/subtract within 20) ---------- */
function tenFrames(a, b, op) {
  const total = op === '+' ? a + b : a;
  const frames = Math.max(1, Math.ceil(total / 10));
  let h = '<div class="tf-wrap">';
  for (let f = 0; f < frames; f++) {
    h += '<div class="tf">';
    for (let i = 0; i < 10; i++) {
      const n = f * 10 + i; let c = '';
      if (op === '+') c = n < a ? 'a' : n < a + b ? 'b' : '';
      else c = n < a - b ? 'a' : n < a ? 'x' : '';
      h += `<span class="tfc">${c ? `<i class="${c}"></i>` : ''}</span>`;
    }
    h += '</div>';
  }
  h += '</div>';
  let cap;
  if (op === '+') {
    h += `<div class="legend"><span style="--lc:var(--c-a)">${a}</span><span style="--lc:var(--c-b)">${b}</span></div>`;
    cap = (a < 10 && b < 10 && a + b > 10)
      ? `<b>Make a ten!</b> ${a} + ${10 - a} = 10, then ${a + b - 10} more makes <b>${a + b}</b>.`
      : `Count all the dots: ${a} + ${b} = <b>${a + b}</b>. Tip: start at ${Math.max(a, b)} and count on ${Math.min(a, b)}.`;
  } else {
    cap = (a > 10 && b > a - 10)
      ? `Start with ${a}. Take away ${a - 10} to get to 10, then ${b - (a - 10)} more: <b>${a - b}</b> left.`
      : `Start with ${a} dots. Cross out ${b}. <b>${a - b}</b> are left.`;
  }
  return h + `<div class="cap">${cap}</div>`;
}

/* ---------- base-ten blocks ---------- */
function baseTen(n, labels = true) {
  const parts = [[Math.floor(n / 1000), 'blk-th', 'thousand', '1000'], [Math.floor(n / 100) % 10, 'blk-h', 'hundred', ''], [Math.floor(n / 10) % 10, 'blk-t', 'ten', ''], [n % 10, 'blk-o', 'one', '']];
  let h = '<div class="b10">';
  parts.forEach(([k, cls, name, txt]) => {
    if (!k) return;
    h += `<div class="grp"><div class="items${cls === 'blk-o' ? ' ones' : ''}">${`<span class="${cls}">${txt}</span>`.repeat(k)}</div>${labels ? `<small>${k} ${name}${k > 1 ? 's' : ''}</small>` : ''}</div>`;
  });
  if (n === 0) h += '<small class="muted">zero — no blocks!</small>';
  return h + '</div>';
}
const b10Num = n => `<div class="b10-num">${baseTen(n)}<div class="lbl">${n}</div></div>`;
function pvTable(n, hlPlace = -1) {
  const digits = String(n).split('').map(Number); const w = Math.max(2, digits.length);
  while (digits.length < w) digits.unshift(0);
  const names = ['Ones', 'Tens', 'Hundreds', 'Thousands'];
  let th = '', td = '';
  for (let i = 0; i < w; i++) { const pl = w - 1 - i; th += `<th>${names[pl]}</th>`; td += `<td class="${pl === hlPlace ? 'hl' : ''}">${digits[i]}</td>`; }
  return `<table class="pv-table"><tr>${th}</tr><tr>${td}</tr></table>`;
}

/* ---------- vertical problem + step-by-step column method ---------- */
function vertHTML(a, b, op) {
  const A = String(a), B = String(b), w = Math.max(A.length, B.length);
  const c = (t, k = '') => `<div class="${k}">${t}</div>`;
  let h = c('') + [...A.padStart(w, ' ')].map(d => c(d.trim())).join('');
  h += c(op) + [...B.padStart(w, ' ')].map(d => c(d.trim())).join('');
  for (let i = 0; i <= w; i++) h += c('', 'rule');
  return `<div class="colgrid qv" style="grid-template-columns:repeat(${w + 1},1.2em)">${h}</div>`;
}
function addFrames(a, b) {
  const A = String(a), B = String(b), w = Math.max(A.length, B.length) + 1;
  const xs = A.padStart(w, ' ').split(''), ys = B.padStart(w, ' ').split('');
  const carry = Array(w).fill(''), res = Array(w).fill(''), frames = [];
  const snap = (hl, text) => frames.push({ carry: [...carry], res: [...res], hl, text });
  snap(-1, 'Line up the numbers by place value. We start with the <b>ones</b> on the right.');
  let c = 0;
  for (let i = w - 1; i >= 0; i--) {
    const hasX = xs[i] !== ' ', hasY = ys[i] !== ' ';
    if (!hasX && !hasY && !c) break;
    const x = hasX ? +xs[i] : 0, y = hasY ? +ys[i] : 0, s = x + y + c, place = PLACE[w - 1 - i];
    res[i] = String(s % 10);
    const terms = [hasX ? x : null, hasY ? y : null, c ? `${c} <small>(carried)</small>` : null].filter(t => t !== null);
    let t;
    if (terms.length === 1) t = `<b>${cap(place)}:</b> nothing to add here — bring down the ${s}.`;
    else t = `<b>${cap(place)}:</b> ${terms.join(' + ')} = ${s}.`;
    if (s >= 10) { carry[i - 1] = '1'; t += ` Write <b>${s % 10}</b> and carry <b>1</b> to the ${PLACE[w - i]}.`; c = 1; }
    else { if (terms.length > 1) t += ` Write <b>${s}</b>.`; c = 0; }
    snap(i, t);
  }
  snap(-1, `🎉 Done! ${a} + ${b} = <b>${a + b}</b>`);
  return { w, xs, ys, op: '+', frames };
}
function subFrames(a, b) {
  const A = String(a), B = String(b), w = A.length;
  const orig = A.split('').map(Number), top = [...orig], ys = B.padStart(w, ' ').split('');
  const changed = Array(w).fill(false), res = Array(w).fill(''), frames = [];
  const snap = (hl, text) => frames.push({ top: [...top], changed: [...changed], res: [...res], hl, text });
  snap(-1, 'Bigger number on top. We start subtracting with the <b>ones</b> on the right.');
  for (let i = w - 1; i >= 0; i--) {
    const y = ys[i] === ' ' ? 0 : +ys[i], place = PLACE[w - 1 - i];
    if (top[i] < y) {
      let j = i - 1; while (j >= 0 && top[j] === 0) j--;
      const before = top[i], jBefore = top[j];
      top[j] -= 1; changed[j] = true;
      for (let k = j + 1; k < i; k++) { top[k] = 9; changed[k] = true; }
      top[i] += 10; changed[i] = true;
      snap(i, `<b>${cap(place)}:</b> ${before} is smaller than ${y}, so we <b>regroup</b>. Take 1 from the ${PLACE[w - 1 - j]} (${jBefore} → ${top[j]})${j < i - 1 ? ', the zeros in between become 9s' : ''}. Now the ${place} have <b>${top[i]}</b>.`);
    }
    const d = top[i] - y; res[i] = String(d);
    snap(i, `<b>${cap(place)}:</b> ${top[i]} − ${y} = <b>${d}</b>.`);
  }
  const fin = [...res]; for (let k = 0; k < w - 1 && fin[k] === '0'; k++) fin[k] = '';
  frames.push({ top: [...top], changed: [...changed], res: fin, hl: -1, text: `🎉 Done! ${a} − ${b} = <b>${a - b}</b>` });
  return { w, orig, ys, op: '−', frames };
}
function colGridHTML(d, f) {
  const c = (t, k = '') => `<div class="${k}">${t == null ? '' : t}</div>`, hl = i => i === f.hl ? ' hl' : '';
  let h = '';
  if (d.op === '+') {
    h += c('', 'sm'); for (let i = 0; i < d.w; i++) h += c(f.carry[i], 'sm' + hl(i));
    h += c(''); for (let i = 0; i < d.w; i++) h += c(d.xs[i].trim(), hl(i));
    h += c('+'); for (let i = 0; i < d.w; i++) h += c(d.ys[i].trim(), hl(i));
  } else {
    h += c('', 'sm'); for (let i = 0; i < d.w; i++) h += c(f.changed[i] ? f.top[i] : '', 'sm' + hl(i));
    h += c(''); for (let i = 0; i < d.w; i++) h += c(d.orig[i], (f.changed[i] ? 'strike' : '') + hl(i));
    h += c('−'); for (let i = 0; i < d.w; i++) h += c(d.ys[i].trim(), hl(i));
  }
  for (let i = 0; i <= d.w; i++) h += c('', 'rule');
  h += c(''); for (let i = 0; i < d.w; i++) h += c(f.res[i], 'res' + hl(i));
  return `<div class="colgrid" style="grid-template-columns:repeat(${d.w + 1},1.25em)">${h}</div>`;
}
function columnStepper(host, a, b, op) {
  const d = op === '+' ? addFrames(a, b) : subFrames(a, b);
  let k = 0;
  const root = el('div', 'colm', `<div class="cg"></div><div class="coltext"></div><div class="colbtns"><button class="mini" data-d="-1">◀ Back</button><span class="muted cnt"></span><button class="mini go" data-d="1">Next step ▶</button></div>`);
  host.appendChild(root);
  const draw = () => {
    $('.cg', root).innerHTML = colGridHTML(d, d.frames[k]);
    $('.coltext', root).innerHTML = d.frames[k].text;
    $('.cnt', root).textContent = `Step ${k + 1} of ${d.frames.length}`;
    $('[data-d="-1"]', root).disabled = k === 0; $('[data-d="1"]', root).disabled = k === d.frames.length - 1;
  };
  $$('[data-d]', root).forEach(b => b.onclick = () => { k = Math.max(0, Math.min(d.frames.length - 1, k + +b.dataset.d)); SFX.click(); draw(); });
  draw();
}

/* ---------- multiplication & division ---------- */
function arrayDots(r, c) {
  let h = '<div class="center"><div class="arr">';
  for (let i = 0; i < r; i++) h += `<div class="arr-row">${'<i></i>'.repeat(c)}<b>${c * (i + 1)}</b></div>`;
  h += '</div></div>';
  const counts = Array.from({ length: r }, (_, i) => c * (i + 1));
  return h + `<div class="cap"><b>${r}</b> row${r > 1 ? 's' : ''} of <b>${c}</b> = <b>${r * c}</b><br>Skip count by ${c}: ${counts.join(', ')}</div>`;
}
function areaModel(x, y) {
  const xp = splitPlace(x), yp = splitPlace(y), prods = [];
  let t = '<table class="area"><tr><th>×</th>' + yp.map(v => `<th>${v}</th>`).join('') + '</tr>';
  xp.forEach((xv, ri) => { t += `<tr><th>${xv}</th>`; yp.forEach((yv, ci) => { const p = xv * yv; prods.push(p); t += `<td class="c${(ri + ci) % 3}">${p}<small>${xv} × ${yv}</small></td>`; }); t += '</tr>'; });
  t += '</table>';
  return t + `<div class="cap"><b>Box method:</b> break the numbers into tens and ones, multiply each box, then add them all.<br><b>${prods.join(' + ')} = ${x * y}</b></div>`;
}
function shareGroups(a, d) {
  const q = a / d, side = Math.ceil(Math.sqrt(q));
  let h = '<div class="groups">';
  for (let g = 0; g < d; g++) h += `<div class="grp-box" style="width:${side * 16 + 22}px">${'<i></i>'.repeat(q)}</div>`;
  return h + `</div><div class="cap">Share ${a} dots into <b>${d}</b> equal groups → <b>${q}</b> in each group.<br>So ${a} ÷ ${d} = <b>${q}</b>. Check: ${q} × ${d} = ${a} ✅</div>`;
}
function longDivHTML(a, d) {
  const s = String(a), steps = []; let cur = 0, started = false;
  for (let i = 0; i < s.length; i++) {
    cur = cur * 10 + +s[i];
    if (!started && cur < d && i < s.length - 1) { steps.push(`${cur} is smaller than ${d}, so look at the first two digits together.`); continue; }
    started = true;
    const q = Math.floor(cur / d), p = q * d, r = cur - p;
    steps.push(`How many ${d}s fit in <b>${cur}</b>? <b>${q}</b>, because ${q} × ${d} = ${p}. Take away: ${cur} − ${p} = ${r}.${i < s.length - 1 ? ` Bring down the next digit → <b>${r * 10 + +s[i + 1]}</b>.` : ''}`);
    cur = r;
  }
  return `<div class="cap">Think: what number × ${d} = ${a}? Let's divide one digit at a time.</div><ol class="steps">${steps.map(x => `<li>${x}</li>`).join('')}</ol><div class="cap">So ${a} ÷ ${d} = <b>${a / d}</b>. Check: ${a / d} × ${d} = ${a} ✅</div>`;
}

/* ---------- number line ---------- */
function numberLine(min, max, { marks = [], hops = [] } = {}) {
  const W = 640, pad = 30, base = hops.length ? 78 : 56, H = base + 36;
  const X = v => pad + (v - min) / ((max - min) || 1) * (W - 2 * pad);
  const span = max - min, steps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000];
  const step = steps.find(s => span / s <= 20) || 10000;
  const first = Math.ceil(min / step) * step, count = Math.floor((max - first) / step) + 1, every = count > 12 ? 2 : 1;
  let s = `<svg class="nline" viewBox="0 0 ${W} ${H}" role="img" aria-label="Number line from ${min} to ${max}"><defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#5b6cff"/></marker></defs>`;
  s += `<line x1="${pad - 14}" y1="${base}" x2="${W - pad + 14}" y2="${base}" stroke="#4a4e69" stroke-width="3" stroke-linecap="round"/>`;
  for (let v = first, k = 0; v <= max; v += step, k++) {
    const x = X(v);
    s += `<line x1="${x}" y1="${base - 8}" x2="${x}" y2="${base + 8}" stroke="#4a4e69" stroke-width="2"/>`;
    if (k % every === 0) s += `<text x="${x}" y="${base + 28}" text-anchor="middle" font-size="15" fill="#4a4e69" font-family="Fredoka,sans-serif">${v}</text>`;
  }
  hops.forEach(hp => {
    const x1 = X(hp.from), x2 = X(hp.to), mx = (x1 + x2) / 2, hg = Math.min(44, Math.abs(x2 - x1) * .55 + 10);
    s += `<path d="M${x1} ${base - 5} Q ${mx} ${base - 5 - hg * 2} ${x2} ${base - 5}" fill="none" stroke="${hp.color || '#5b6cff'}" stroke-width="2.5" marker-end="url(#ah)"/>`;
    if (hp.label) s += `<text x="${mx}" y="${base - hg - 10}" text-anchor="middle" font-size="13" font-weight="700" fill="${hp.color || '#5b6cff'}" font-family="Fredoka,sans-serif">${hp.label}</text>`;
  });
  marks.forEach((m, i) => {
    const x = X(m.v);
    s += `<circle cx="${x}" cy="${base}" r="8" fill="${m.color}" stroke="#fff" stroke-width="2.5"/>`;
    if (m.label != null) s += `<text x="${x}" y="${base - 16 - (i % 2) * 18}" text-anchor="middle" font-size="17" font-weight="700" fill="${m.color}" font-family="Fredoka,sans-serif">${m.label}</text>`;
  });
  return s + '</svg>';
}

/* ---------- fractions ---------- */
function pieSVG(n, d, size = 120, color = '#ff7a45') {
  const r = size / 2 - 4, c = size / 2;
  let s = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${n} of ${d} parts shaded">`;
  if (d === 1) s += `<circle cx="${c}" cy="${c}" r="${r}" fill="${n ? color : '#fff'}" stroke="#4a4e69" stroke-width="3"/>`;
  else for (let i = 0; i < d; i++) {
    const a0 = i / d * 2 * Math.PI - Math.PI / 2, a1 = (i + 1) / d * 2 * Math.PI - Math.PI / 2;
    const p = (a) => `${(c + r * Math.cos(a)).toFixed(2)} ${(c + r * Math.sin(a)).toFixed(2)}`;
    s += `<path d="M${c} ${c} L${p(a0)} A${r} ${r} 0 0 1 ${p(a1)} Z" fill="${i < n ? color : '#fff'}" stroke="#4a4e69" stroke-width="2.5" stroke-linejoin="round"/>`;
  }
  return s + '</svg>';
}
function barSVG(n, d, w = 280, h = 46, color = '#5b6cff') {
  const cw = (w - 4) / d;
  let s = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="max-width:100%;height:auto" role="img" aria-label="${n} of ${d} parts shaded">`;
  for (let i = 0; i < d; i++) s += `<rect x="${(2 + i * cw).toFixed(2)}" y="2" width="${cw.toFixed(2)}" height="${h - 4}" rx="3" fill="${i < n ? color : '#fff'}" stroke="#4a4e69" stroke-width="2"/>`;
  return s + '</svg>';
}

/* ---------- clock ---------- */
function clockSVG(h, m, size = 190, { minutes = false } = {}) {
  const ext = minutes ? 26 : 0, vb = 200 + ext * 2;
  let s = `<svg class="clock" width="${size}" height="${size}" viewBox="${-ext} ${-ext} ${vb} ${vb}" role="img" aria-label="Clock">`;
  s += `<circle cx="100" cy="100" r="95" fill="#fff" stroke="#4a4e69" stroke-width="6"/>`;
  for (let i = 0; i < 60; i++) {
    const a = i * 6 * Math.PI / 180, big = i % 5 === 0, r1 = big ? 80 : 86;
    s += `<line x1="${100 + r1 * Math.sin(a)}" y1="${100 - r1 * Math.cos(a)}" x2="${100 + 91 * Math.sin(a)}" y2="${100 - 91 * Math.cos(a)}" stroke="${big ? '#4a4e69' : '#c9c5d8'}" stroke-width="${big ? 3 : 1.5}"/>`;
  }
  for (let k = 1; k <= 12; k++) {
    const a = k * 30 * Math.PI / 180;
    s += `<text x="${100 + 66 * Math.sin(a)}" y="${100 - 66 * Math.cos(a) + 7}" text-anchor="middle" font-size="20" font-weight="700" fill="#2b2d42" font-family="Fredoka,sans-serif">${k}</text>`;
    if (minutes) s += `<text x="${100 + 112 * Math.sin(a)}" y="${100 - 112 * Math.cos(a) + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="#5b6cff" font-family="Fredoka,sans-serif">${pad2((k * 5) % 60)}</text>`;
  }
  const ha = ((h % 12) + m / 60) * 30 * Math.PI / 180, ma = m * 6 * Math.PI / 180;
  s += `<line x1="100" y1="100" x2="${100 + 46 * Math.sin(ha)}" y2="${100 - 46 * Math.cos(ha)}" stroke="#2b2d42" stroke-width="8" stroke-linecap="round"/>`;
  s += `<line x1="100" y1="100" x2="${100 + 74 * Math.sin(ma)}" y2="${100 - 74 * Math.cos(ma)}" stroke="#ff7a45" stroke-width="5" stroke-linecap="round"/>`;
  return s + `<circle cx="100" cy="100" r="7" fill="#2b2d42"/></svg>`;
}
const fmtTime = (h, m) => `${h}:${pad2(m)}`;
function timeWords(h, m) {
  const nx = h % 12 + 1;
  if (m === 0) return `${numWords(h)} o'clock`;
  if (m === 15) return `quarter past ${numWords(h)}`;
  if (m === 30) return `half past ${numWords(h)}`;
  if (m === 45) return `quarter to ${numWords(nx)}`;
  if (m < 30) return `${numWords(m)} minute${m > 1 ? 's' : ''} past ${numWords(h)}`;
  return `${numWords(60 - m)} minute${60 - m > 1 ? 's' : ''} to ${numWords(nx)}`;
}

/* ---------- money ---------- */
const COIN = { 1: ['penny', '1¢'], 5: ['nickel', '5¢'], 10: ['dime', '10¢'], 25: ['quarter', '25¢'], 100: ['dollar', '$1'] };
const coinHTML = v => `<span class="coin ${COIN[v][0]}" title="${COIN[v][0]}">${COIN[v][1]}</span>`;
const coinsHTML = list => `<div class="coins">${list.map(coinHTML).join('')}</div>`;
function countOnHTML(list) {
  const sorted = [...list].sort((a, b) => b - a); let run = 0;
  return `<div class="counton">${sorted.map(v => { run += v; return `<div>${coinHTML(v)}<b>${run}¢</b></div>`; }).join('')}</div><div class="cap">Start with the biggest coin and <b>count on</b>: ${(() => { let r = 0; return sorted.map(v => (r += v) + '¢').join(' → '); })()}</div>`;
}

/* ---------- groups & bar models (word problems) ---------- */
function emojiGroups(groups, e, { op = '+', cross = 0 } = {}) {
  let h = '<div class="eg">';
  groups.forEach((n, gi) => {
    if (gi && op) h += `<span class="op">${op}</span>`;
    h += '<div class="box">';
    for (let i = 0; i < n; i++) h += `<span class="${gi === groups.length - 1 && i >= n - cross ? 'gone' : ''}">${e}</span>`;
    h += '</div>';
  });
  return h + '</div>';
}
function barModel(rows) {
  const max = Math.max(...rows.map(r => r.parts.reduce((a, p) => a + p.v, 0)));
  return `<div class="barm">${rows.map(r => `<div class="row"><b>${esc(r.label)}</b><div class="bar">${r.parts.map(p => `<div class="seg" style="flex:0 0 ${(p.v / max * 100).toFixed(2)}%;background:${p.color || '#5b6cff'}">${p.text != null ? p.text : p.v}</div>`).join('')}</div></div>`).join('')}</div>`;
}
function seqHTML(seq, qi, showHops) {
  let h = '<div class="seq">';
  seq.forEach((v, i) => {
    if (i && showHops) { const known = i !== qi && i - 1 !== qi; const d = seq[i] - seq[i - 1]; h += `<span class="hop">${known ? (d >= 0 ? '+' : '−') + Math.abs(d) : '?'} →</span>`; }
    h += `<span class="n${i === qi ? ' q' : ''}">${i === qi ? '?' : v}</span>`;
  });
  return h + '</div>';
}
