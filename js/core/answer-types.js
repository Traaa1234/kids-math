'use strict';
/* How each kind of answer is shown: choice, number, spell, tiles, pick */
/* ---------------- answer renderers ----------------
   ANSWER_TYPES maps a question's `kind` to the function that draws its answer area.
   Add a new kind from any later file:  ANSWER_TYPES.myKind = (q, area) => { ... submit(value, element) ... }
   (see js/visuals/abacus.js for the 'abacus' kind). */
const ANSWER_TYPES = { choice: renderChoices, number: renderNumpad, spell: renderSpell, tiles: renderTiles, pick: renderPick };
function renderChoices(q, area) {
  const g = el('div', 'choices' + (q.cols ? ' c' + q.cols : '') + (q.choiceClass ? ' ' + q.choiceClass : ''));
  q.choices.forEach((c, i) => {
    const b = el('button', 'choice', `<span class="k">${i + 1}</span>${c.label}`);
    b.onclick = () => { if (S.locked) return; submit(c.val, b); if (b.classList.contains('wrong')) b.disabled = true; };
    g.appendChild(b);
  });
  area.appendChild(g);
  S.reveal = () => { $$('.choice', g).forEach((b, i) => { const v = q.choices[i].val; if (q.check ? q.check(v) : String(v) === String(q.answer)) b.classList.add('right'); }); };
}
function renderNumpad(q, area) {
  area.innerHTML = `<div class="ansline">${q.pre || ''}<div class="ansbox" id="ansBox"><span class="ph">?</span></div>${q.post || ''}</div>
    <div class="numpad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button data-k="${n}">${n}</button>`).join('')}<button class="del" data-k="del" aria-label="Delete">⌫</button><button data-k="0">0</button><button class="go" data-k="ok" aria-label="Check answer">✓</button></div>`;
  $$('.numpad button', area).forEach(b => b.onclick = () => numKey(b.dataset.k));
  S.onWrong = () => { S.input = ''; setTimeout(() => { const b = $('#ansBox'); if (b) { b.classList.remove('wrong'); drawAns(); } }, 450); };
  S.reveal = () => { S.input = String(q.answer); drawAns(); $('#ansBox').classList.add('right'); };
}
function drawAns() { const b = $('#ansBox'); if (b) b.innerHTML = S.input ? esc(S.input) : '<span class="ph">?</span>'; }
function numKey(k) {
  if (S.locked || !S.q || S.q.kind !== 'number') return;
  if (k === 'ok') { if (!S.input) { setFB('Type your answer first! ✏️', 'bad'); return; } submit(Number(S.input), $('#ansBox')); return; }
  SFX.click();
  if (k === 'del') S.input = S.input.slice(0, -1);
  else if (S.input.length < 6) S.input = (S.input === '0' ? '' : S.input) + k;
  drawAns();
}
function renderSpell(q, area) {
  S.sp = { fill: {}, used: new Set() };
  const row = el('div', 'spellrow');
  [...q.word].forEach((c, i) => {
    if (q.blanks.includes(i)) { const b = el('button', 'sbox blank'); b.dataset.i = i; b.setAttribute('aria-label', 'blank letter'); b.onclick = () => spellClear(i); row.appendChild(b); }
    else row.appendChild(el('span', 'sbox', esc(c)));
  });
  const bank = el('div', 'bank');
  q.bank.forEach((c, ti) => { const t = el('button', 'ltile', esc(c)); t.dataset.t = ti; t.onclick = () => spellTile(ti); bank.appendChild(t); });
  const chk = el('div', 'center', '<button class="btn green" id="spellChk">Check ✓</button>');
  area.append(row, bank, chk);
  $('#spellChk').onclick = spellCheck;
  spellDraw();
  S.onWrong = () => {
    q.blanks.forEach(i => { const f = S.sp.fill[i]; if (f && f.ch !== q.word[i]) { S.sp.used.delete(f.t); delete S.sp.fill[i]; } });
    setTimeout(spellDraw, 350);
  };
  S.onRight = () => $$('.sbox.blank', row).forEach(b => b.classList.add('right'));
  S.reveal = () => { q.blanks.forEach(i => S.sp.fill[i] = { ch: q.word[i], t: -1 }); spellDraw(); $$('.sbox.blank', row).forEach(b => b.classList.add('right')); };
}
function spellCur() { return S.q.blanks.find(i => !S.sp.fill[i]); }
function spellTile(ti) {
  if (S.locked) return; const i = spellCur(); if (i === undefined) return;
  SFX.click(); S.sp.fill[i] = { ch: S.q.bank[ti], t: ti }; S.sp.used.add(ti); spellDraw();
  if (spellCur() === undefined) setTimeout(spellCheck, 300);
}
function spellClear(i) { if (S.locked) return; const f = S.sp.fill[i]; if (!f) return; S.sp.used.delete(f.t); delete S.sp.fill[i]; spellDraw(); }
function spellKey(c) { const ti = S.q.bank.findIndex((x, k) => x === c && !S.sp.used.has(k)); if (ti >= 0) spellTile(ti); }
function spellBack() { const f = S.q.blanks.filter(i => S.sp.fill[i]); if (f.length) spellClear(f[f.length - 1]); }
function spellDraw() {
  const cur = spellCur();
  $$('#answerArea .sbox.blank').forEach(b => { const i = +b.dataset.i, f = S.sp.fill[i]; b.textContent = f ? f.ch : ''; b.classList.toggle('cur', i === cur && !S.locked); });
  $$('#answerArea .ltile').forEach(t => t.disabled = S.sp.used.has(+t.dataset.t));
}
function spellCheck() {
  if (S.locked || !S.q || S.q.kind !== 'spell') return;
  if (spellCur() !== undefined) { setFB('Fill in all the boxes first! ✏️', 'bad'); return; }
  submit(S.q.blanks.map(i => S.sp.fill[i].ch).join(''), null);
}
function renderTiles(q, area) {
  S.tl = { built: [] };
  const built = el('div', 'built'), bank = el('div', 'bank');
  q.tiles.forEach((w, ti) => {
    const b = el('button', 'wtile', esc(w)); b.dataset.t = ti;
    b.onclick = () => { if (S.locked) return; SFX.click(); S.tl.built.push(ti); tilesDraw(); if (S.tl.built.length === q.tiles.length) setTimeout(tilesCheck, 350); };
    bank.appendChild(b);
  });
  const chk = el('div', 'center', '<button class="btn green" id="tilesChk">Check ✓</button>');
  area.append(built, bank, chk);
  $('#tilesChk').onclick = tilesCheck;
  const ans = q.answer.split(' ');
  S.onWrong = () => {
    let k = 0; while (k < S.tl.built.length && q.tiles[S.tl.built[k]] === ans[k]) k++;
    S.tl.built = S.tl.built.slice(0, k);
    setTimeout(() => { built.classList.remove('wrong'); tilesDraw(); }, 450);
  };
  S.onRight = () => $$('.wtile', built).forEach(b => b.classList.add('ok'));
  S.reveal = () => { const used = new Set(); S.tl.built = ans.map(w => { const t = q.tiles.findIndex((x, i) => x === w && !used.has(i)); used.add(t); return t; }); setTimeout(() => { tilesDraw(); $$('.wtile', built).forEach(b => b.classList.add('ok')); }, 460); };
}
function tilesDraw() {
  const built = $('#answerArea .built'); if (!built) return;
  built.innerHTML = '';
  S.tl.built.forEach((ti, pos) => { const b = el('button', 'wtile', esc(S.q.tiles[ti])); b.onclick = () => { if (S.locked) return; S.tl.built.splice(pos, 1); tilesDraw(); }; built.appendChild(b); });
  $$('#answerArea .bank .wtile').forEach(b => b.disabled = S.tl.built.includes(+b.dataset.t));
}
function tilesCheck() {
  if (S.locked || !S.q || S.q.kind !== 'tiles') return;
  if (S.tl.built.length < S.q.tiles.length) { setFB('Use all the words! 🧩', 'bad'); return; }
  submit(S.tl.built.map(t => S.q.tiles[t]).join(' '), $('#answerArea .built'));
}
function renderPick(q, area) {
  $$('#qPrompt .pw').forEach(b => b.onclick = () => { if (S.locked || b.disabled) return; submit(+b.dataset.i, b); if (b.classList.contains('wrong')) b.disabled = true; });
  if (q.pickHelp) area.innerHTML = `<p class="center muted" style="margin:0">${q.pickHelp}</p>`;
  S.reveal = () => $$('#qPrompt .pw').forEach(b => { if (q.check(+b.dataset.i)) b.classList.add('right'); });
}
