'use strict';
/* =====================================================================
   ABACUS (soroban) — drawing, bead-by-bead steps for + − × ÷, and a
   step player. Used by the Abacus Lab screen and the abacus activities.

   A soroban rod: 1 "heaven" bead above the bar (worth 5) and 4 "earth"
   beads below (worth 1 each). Beads count when they touch the bar.
   When a rod runs out of beads we use "friends":
     5-friends  (pairs that make 5):  1+4, 2+3
     10-friends (pairs that make 10): 1+9, 2+8, 3+7, 4+6, 5+5
   ===================================================================== */
const AB = { W: 60, PAD: 14, H: 252 };
const AB_PLACE = ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands', 'hundred-thousands', 'millions'];
const AB_SHORT = ['ones', 'tens', 'hundreds', 'thousands', '10 thous.', '100 thous.', 'millions'];
const abDigits = (n, R) => String(n).padStart(R, '0').split('').map(Number);
const abValue = d => Number(d.join(''));
const abLen = n => String(n).length;
const plu = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

/* ---------- drawing ---------- */
const abX = i => AB.PAD + i * AB.W + AB.W / 2;
const abBeadOn = (v, k) => k === 'h' ? v >= 5 : +k < v % 5;
const abShift = (v, k) => abBeadOn(v, k) ? (k === 'h' ? 30 : -30) : 0;
function abacusSVG(R, { digits = null, showDigits = true, interactive = false, hl = -1 } = {}) {
  const d = digits || Array(R).fill(0), W = R * AB.W + AB.PAD * 2;
  const bead = (i, k, y) => { const x = abX(i), v = d[i];
    return `<g class="ab-b ${k === 'h' ? 'h' : 'e'}${abBeadOn(v, k) ? ' on' : ''}" data-i="${i}" data-k="${k}" style="transform:translateY(${abShift(v, k)}px)"${interactive ? ` role="button" aria-label="${k === 'h' ? 'heaven bead (5)' : 'earth bead (1)'} on the ${AB_PLACE[R - 1 - i]} rod"` : ''}><polygon points="${x - 25},${y + 10} ${x - 10},${y} ${x + 10},${y} ${x + 25},${y + 10} ${x + 10},${y + 20} ${x - 10},${y + 20}"/></g>`; };
  let s = `<svg class="abacus${interactive ? ' ab-int' : ''}" viewBox="0 0 ${W} ${AB.H}" width="${W}" role="img" aria-label="Abacus with ${R} rods">`;
  s += `<rect x="4" y="4" width="${W - 8}" height="198" rx="12" class="ab-frame"/>`;
  for (let i = 0; i < R; i++) s += `<rect class="ab-hl${i === hl ? ' on' : ''}" data-i="${i}" x="${abX(i) - 28}" y="9" width="56" height="188" rx="9"/>`;
  for (let i = 0; i < R; i++) s += `<line x1="${abX(i)}" y1="9" x2="${abX(i)}" y2="197" class="ab-rod"/>`;
  s += `<rect x="8" y="64" width="${W - 16}" height="8" rx="2" class="ab-bar"/>`;
  for (let i = 0; i < R; i++) { s += bead(i, 'h', 12); for (let k = 0; k < 4; k++) s += bead(i, String(k), 104 + k * 22); }
  for (let i = 0; i < R; i++) {
    const lead = d.slice(0, i + 1).every(x => x === 0) && i < R - 1;
    s += `<text x="${abX(i)}" y="228" class="ab-dig${lead ? ' lead' : ''}"${showDigits ? '' : ' visibility="hidden"'}>${d[i]}</text><text x="${abX(i)}" y="246" class="ab-pl">${AB_SHORT[R - 1 - i]}</text>`;
  }
  return s + '</svg>';
}
/** Live abacus in `host`. Returns { set(digits, hl), get(), value() }. interactive: click beads to move them. */
function abacusView(host, R, { digits = null, interactive = false, showDigits = true, onChange = null } = {}) {
  let d = digits ? [...digits] : Array(R).fill(0);
  host.innerHTML = abacusSVG(R, { digits: d, interactive, showDigits });
  const svg = host.querySelector('svg');
  const paint = (hl = -1) => {
    $$('.ab-b', svg).forEach(g => { const v = d[+g.dataset.i], k = g.dataset.k; g.classList.toggle('on', abBeadOn(v, k)); g.style.transform = `translateY(${abShift(v, k)}px)`; });
    $$('.ab-hl', svg).forEach(r => r.classList.toggle('on', +r.dataset.i === hl));
    $$('.ab-dig', svg).forEach((t, i) => { t.textContent = d[i]; t.classList.toggle('lead', d.slice(0, i + 1).every(x => x === 0) && i < R - 1); });
  };
  const api = { get: () => [...d], value: () => abValue(d), set(nd, hl = -1) { d = [...nd]; paint(hl); }, svg };
  if (interactive) svg.addEventListener('click', e => {
    const g = e.target.closest('.ab-b'); if (!g) return;
    const i = +g.dataset.i, k = g.dataset.k, v = d[i];
    if (k === 'h') d[i] = v >= 5 ? v - 5 : v + 5;
    else { const cur = v % 5, kk = +k; d[i] = (v >= 5 ? 5 : 0) + (kk < cur ? kk : kk + 1); }
    SFX.click(); paint(); onChange && onChange(api.get());
  });
  return api;
}
const abRodWords = x => { const p = []; if (x >= 5) p.push('heaven bead (5)'); if (x % 5) p.push(`${plu(x % 5, 'earth bead')} (${x % 5})`); return p.length ? p.join(' + ') : 'no beads at the bar (0)'; };

/* ---------- step generator ---------- */
function abSim(R, withAns) { return { R, d: Array(R).fill(0), ans: withAns ? Array(R).fill(0) : null, frames: [], pre: '' }; }
function abSnap(s, which, p, text, tag = '') {
  s.frames.push({ d: [...s.d], ans: s.ans && [...s.ans], which, hl: p == null ? -1 : s.R - 1 - p, text: (s.pre ? s.pre + ' ' : '') + text, tag });
  s.pre = '';
}
const abRod = p => `${cap(AB_PLACE[p])} rod`;
function abAdd(s, which, p, n) {
  if (!n) return;
  const a = s[which], i = s.R - 1 - p, v = a[i], R = abRod(p);
  if (v + n <= 9) {
    const e = v % 5;
    if (n < 5 && e + n <= 4) { a[i] += n; abSnap(s, which, p, `${R}: push <b>${plu(n, 'earth bead')} up</b> to the bar.`, `+${n}`); }
    else if (n >= 5) { a[i] += n; abSnap(s, which, p, `${R}: push the <b>heaven bead down</b> (+5)${n > 5 ? ` and <b>${plu(n - 5, 'earth bead')} up</b> (+${n - 5})` : ''}.`, `+${n}`); }
    else {
      const f = 5 - n;
      abSnap(s, which, p, `${R}: not enough earth beads to add ${n}. Use a <b>5-friend</b>: ${n} and ${f} make 5, so <b>+${n} = +5 − ${f}</b>.`, `+5 −${f}`);
      a[i] += 5; abSnap(s, which, p, `${R}: push the <b>heaven bead down</b>.`, '+5');
      a[i] -= f; abSnap(s, which, p, `${R}: push <b>${plu(f, 'earth bead')} down</b>. The rod now shows ${a[i]}.`, `−${f}`);
    }
  } else {
    const f = 10 - n;
    abSnap(s, which, p, `${R}: ${v} + ${n} is more than 9. Use a <b>10-friend</b>: ${n} and ${f} make 10, so <b>+${n} = −${f} + 10</b>. Take away ${f} here, then add 1 to the ${AB_PLACE[p + 1]} rod.`, `−${f} +10`);
    abSub(s, which, p, f);
    abAdd(s, which, p + 1, 1);
  }
}
function abSub(s, which, p, n) {
  if (!n) return;
  const a = s[which], i = s.R - 1 - p, v = a[i], R = abRod(p);
  if (v >= n) {
    const e = v % 5;
    if (n < 5 && e >= n) { a[i] -= n; abSnap(s, which, p, `${R}: push <b>${plu(n, 'earth bead')} down</b>, away from the bar.`, `−${n}`); }
    else if (n >= 5) { a[i] -= n; abSnap(s, which, p, `${R}: push the <b>heaven bead up</b> (−5)${n > 5 ? ` and <b>${plu(n - 5, 'earth bead')} down</b> (−${n - 5})` : ''}.`, `−${n}`); }
    else {
      const f = 5 - n;
      abSnap(s, which, p, `${R}: not enough earth beads to take away ${n}. Use a <b>5-friend</b>: <b>−${n} = +${f} − 5</b>.`, `+${f} −5`);
      a[i] += f; abSnap(s, which, p, `${R}: push <b>${plu(f, 'earth bead')} up</b>.`, `+${f}`);
      a[i] -= 5; abSnap(s, which, p, `${R}: push the <b>heaven bead up</b>. The rod now shows ${a[i]}.`, '−5');
    }
  } else {
    const f = 10 - n;
    abSnap(s, which, p, `${R}: we can't take ${n} from ${v}. Use a <b>10-friend</b>: <b>−${n} = −10 + ${f}</b>. Take 1 from the ${AB_PLACE[p + 1]} rod, then add ${f} here.`, `−10 +${f}`);
    abSub(s, which, p + 1, 1);
    abAdd(s, which, p, f);
  }
}
/** Add / take away a whole number, one place at a time from the LEFT (the abacus way). shift = place of its ones digit. */
function abNum(s, which, num, shift, sign, intro = '') {
  const ds = String(num);
  [...ds].forEach((c, k) => {
    const dig = +c, p = shift + ds.length - 1 - k; if (!dig) return;
    s.pre = (intro ? intro + ' ' : '') + `<span class="ab-cue">${sign > 0 ? 'Add' : 'Take away'} ${dig} ${dig === 1 ? AB_PLACE[p].replace(/s$/, '') : AB_PLACE[p]}.</span>`; intro = '';
    sign > 0 ? abAdd(s, which, p, dig) : abSub(s, which, p, dig);
  });
}
function abSet(s, which, num, text) { s[which] = abDigits(num, s.R); abSnap(s, which, null, text, '='); }
const abPlaceList = n => { const ds = String(n); return [...ds].map((c, k) => `${c} on the ${AB_PLACE[ds.length - 1 - k]} rod`).join(', '); };

/** All frames for a problem. op: '+', '-', '×', '÷'. Returns { R, frames, withAns, result, rem }. */
function abacusFrames(op, a, b) {
  let s, R, result, rem = 0;
  if (op === '+') {
    result = a + b; R = Math.max(abLen(result), 2); s = abSim(R);
    abSnap(s, 'd', null, 'Start with a clear abacus — no beads touch the bar, so it shows 0.');
    abSet(s, 'd', a, `Set <b>${a}</b>: ${abPlaceList(a)}.`);
    abNum(s, 'd', b, 0, 1, `Now add <b>${b}</b>, starting from the biggest place.`);
    abSnap(s, 'd', null, `🎉 Read the rods: ${a} + ${b} = <b>${result}</b>`, '=');
  } else if (op === '-') {
    result = a - b; R = Math.max(abLen(a), 2); s = abSim(R);
    abSnap(s, 'd', null, 'Start with a clear abacus.');
    abSet(s, 'd', a, `Set <b>${a}</b>: ${abPlaceList(a)}.`);
    abNum(s, 'd', b, 0, -1, `Now take away <b>${b}</b>, starting from the biggest place.`);
    abSnap(s, 'd', null, `🎉 Read the rods: ${a} − ${b} = <b>${result}</b>`, '=');
  } else if (op === '×') {
    result = a * b; R = Math.max(abLen(result), 2); s = abSim(R);
    abSnap(s, 'd', null, 'Start with a clear abacus.');
    if (b <= 5 && a <= 20) {
      abSnap(s, 'd', null, `${a} × ${b} means <b>${b} groups of ${a}</b>. We add ${a}, ${b} times.`);
      for (let t = 1; t <= b; t++) abNum(s, 'd', a, 0, 1, `<b>Group ${t} of ${b}:</b> add ${a}.`);
    } else {
      abSnap(s, 'd', null, `Break it into small multiplications: each digit of ${a} times each digit of ${b}. Add every answer in its place.`);
      const A = String(a), B = String(b);
      [...B].forEach((cb, jb) => { const db = +cb, pb = B.length - 1 - jb;
        [...A].forEach((ca, ja) => { const da = +ca, pa = A.length - 1 - ja; if (!da || !db) return;
          const x = da * 10 ** pa, y = db * 10 ** pb, prod = da * db;
          abNum(s, 'd', prod, pa + pb, 1, `<b>${x} × ${y} = ${x * y}</b> (${da} × ${db} = ${prod}). Add ${x * y}.`);
        });
      });
    }
    abSnap(s, 'd', null, `🎉 Read the rods: ${a} × ${b} = <b>${result}</b>`, '=');
  } else {
    result = Math.floor(a / b); rem = a % b; R = Math.max(abLen(a), 2); s = abSim(R, true);
    abSet(s, 'd', a, `Set <b>${a}</b> on the top abacus. The bottom abacus will hold the answer.`);
    for (let k = abLen(a) - 1; k >= 0; k--) {
      const work = abValue(s.d), chunk = Math.floor(work / 10 ** k), q = Math.floor(chunk / b);
      if (!chunk) continue;
      if (!q) { abSnap(s, 'd', k, `How many ${b}s fit in <b>${chunk}</b>? None — so we look one rod further right.`, '0'); continue; }
      abSnap(s, 'd', k, `How many ${b}s fit in <b>${chunk}</b>? <b>${q}</b>, because ${q} × ${b} = ${q * b}.`, `${q}×${b}`);
      abNum(s, 'd', q * b * 10 ** k, 0, -1, `Take away ${q} × ${b * 10 ** k} = ${q * b * 10 ** k}.`);
      s.pre = `<span class="ab-cue">Write ${q} in the answer.</span>`; abAdd(s, 'ans', k, q);
    }
    abSnap(s, 'd', null, `🎉 ${a} ÷ ${b} = <b>${result}</b>${rem ? ` with <b>${rem}</b> left over (remainder ${rem} on the top abacus)` : ''}.`, '=');
  }
  return { R, frames: s.frames, withAns: !!s.ans, result, rem };
}

/* ---------- step player ---------- */
const abSpeakable = t => t.replace(/<[^>]+>/g, '').replace(/−/g, ' minus ').replace(/\+/g, ' plus ').replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/🎉/g, '');
function abacusPlayer(host, op, a, b) {
  const F = abacusFrames(op, a, b), n = F.frames.length, sym = { '+': '+', '-': '−', '×': '×', '÷': '÷' }[op];
  let k = 0, timer = null, talk = false;
  const root = el('div', 'ab-player', `<div class="ab-eq"></div>
    <div class="ab-views"><div class="ab-view"><div class="ab-lab">${F.withAns ? '🧮 Working number' : '🧮 Abacus'}</div><div class="ab-a"></div></div>${F.withAns ? '<div class="ab-view"><div class="ab-lab">⭐ Answer</div><div class="ab-a2"></div></div>' : ''}</div>
    <div class="ab-move"><span class="ab-tag"></span></div><div class="coltext ab-text"></div>
    <div class="colbtns"><button class="mini" data-d="-1">◀ Back</button><span class="muted cnt"></span><button class="mini go" data-d="1">Next step ▶</button></div>
    <div class="colbtns" style="margin-top:6px"><button class="mini" data-play>▶ Play all</button><button class="mini" data-talk aria-pressed="false">🔇 Read steps</button><button class="mini" data-restart>⟲ Start over</button></div>`);
  host.appendChild(root);
  const va = abacusView($('.ab-a', root), F.R), vb = F.withAns ? abacusView($('.ab-a2', root), F.R) : null;
  const stop = () => { clearInterval(timer); timer = null; $('[data-play]', root).textContent = '▶ Play all'; };
  const draw = () => {
    const f = F.frames[k], last = k === n - 1;
    va.set(f.d, f.which === 'd' ? f.hl : -1); if (vb) vb.set(f.ans, f.which === 'ans' ? f.hl : -1);
    $('.ab-text', root).innerHTML = f.text;
    const tag = $('.ab-tag', root); tag.textContent = f.tag; tag.hidden = !f.tag || f.tag === '=';
    $('.ab-eq', root).innerHTML = `${a} ${sym} ${b} = <span class="${last ? 'ab-res' : 'qbox'}">${last ? F.result + (F.rem ? ` r ${F.rem}` : '') : '?'}</span>`;
    $('.cnt', root).textContent = `Step ${k + 1} of ${n}`;
    $('[data-d="-1"]', root).disabled = k === 0; $('[data-d="1"]', root).disabled = last;
    if (talk) speak(abSpeakable(f.text));
    if (last && k > 0) SFX.good();
  };
  $$('[data-d]', root).forEach(btn => btn.onclick = () => { stop(); k = Math.max(0, Math.min(n - 1, k + +btn.dataset.d)); SFX.click(); draw(); });
  $('[data-restart]', root).onclick = () => { stop(); k = 0; draw(); };
  $('[data-talk]', root).onclick = e => { talk = !talk; e.currentTarget.textContent = talk ? '🔊 Reading steps' : '🔇 Read steps'; e.currentTarget.setAttribute('aria-pressed', talk); if (talk) speak(abSpeakable(F.frames[k].text)); else hush(); };
  $('[data-play]', root).onclick = e => {
    if (timer) { stop(); return; }
    if (k >= n - 1) k = 0;
    e.currentTarget.textContent = '⏸ Pause'; draw();
    timer = setInterval(() => { if (!root.isConnected || k >= n - 1) { stop(); return; } k++; draw(); }, talk ? 4200 : 1700);
  };
  draw();
  return root;
}

/* ---------- 'abacus' answer kind: build the number on the abacus ---------- */
ANSWER_TYPES.abacus = (q, area) => {
  area.innerHTML = '<div class="ab-stage" id="abAns"></div><div class="center" style="margin-top:8px"><span class="big-eq" id="abAnsNum" style="font-size:1.6rem">0</span></div><div class="center" style="margin-top:8px"><button class="btn green" id="abAnsChk">Check ✓</button></div>';
  const v = abacusView($('#abAns'), q.rods, { interactive: true, showDigits: false, onChange: () => { $('#abAnsNum').textContent = v.value(); } });
  $('#abAnsChk').onclick = () => submit(v.value(), $('#abAns'));
  S.onWrong = () => setTimeout(() => $('#abAns') && $('#abAns').classList.remove('wrong'), 450);
  S.reveal = () => { v.set(abDigits(q.answer, q.rods)); $('#abAnsNum').textContent = q.answer; };
};

/* ---------- deep test used by the self-check ---------- */
function abacusSelfTest() {
  const errors = []; let checked = 0;
  const cases = [];
  for (let t = 0; t < 400; t++) {
    const a = rnd(0, 9999), b = rnd(0, 9999);
    cases.push(['+', a, b], ['-', Math.max(a, b), Math.min(a, b)], ['×', rnd(0, 999), rnd(0, 99)], ['×', rnd(1, 20), rnd(1, 5)], ['÷', rnd(1, 9999), rnd(1, 99)]);
  }
  cases.push(['+', 9999, 1], ['-', 10000 - 1, 9999], ['-', 1000, 1], ['÷', 1000, 7], ['×', 999, 99]);
  for (const [op, a, b] of cases) {
    checked++;
    try {
      const F = abacusFrames(op, a, b), last = F.frames[F.frames.length - 1];
      const want = op === '+' ? a + b : op === '-' ? a - b : op === '×' ? a * b : Math.floor(a / b);
      const got = op === '÷' ? abValue(last.ans) : abValue(last.d);
      if (got !== want) errors.push(`abacus ${a} ${op} ${b}: got ${got}, expected ${want}`);
      if (op === '÷' && abValue(last.d) !== a % b) errors.push(`abacus ${a} ÷ ${b}: remainder ${abValue(last.d)}, expected ${a % b}`);
      if (F.frames.some(f => [...f.d, ...(f.ans || [])].some(x => x < 0 || x > 9 || !Number.isInteger(x)))) errors.push(`abacus ${a} ${op} ${b}: a rod went outside 0–9`);
      if (F.frames.some(f => /undefined|NaN/.test(f.text))) errors.push(`abacus ${a} ${op} ${b}: step text has undefined/NaN`);
    } catch (e) { errors.push(`abacus ${a} ${op} ${b}: ${e.message}`); }
  }
  return { checked, errors };
}
