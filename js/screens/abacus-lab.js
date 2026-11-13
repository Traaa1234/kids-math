'use strict';
/* Abacus Lab screen: free play + challenges, and step-by-step + − × ÷ on a soroban */
const ABL = { tab: 'play', target: null, ops: { '+': [47, 38], '-': [82, 47], '×': [23, 4], '÷': [156, 6] } };
const ABL_TABS = [['play', '🖐️ Play & Learn'], ['+', '➕ Add'], ['-', '➖ Subtract'], ['×', '✖️ Multiply'], ['÷', '➗ Divide']];
const ABL_INFO = {
  '+': 'On the abacus we add from the <b>left</b> (biggest place first). When a rod runs out of beads, we use <b>5-friends</b> and <b>10-friends</b>.',
  '-': 'Set the first number, then take away the second one place by place, from the left. If a rod is too small, borrow with a <b>10-friend</b>.',
  '×': 'Small problems: add the number again and again. Bigger ones: multiply digit by digit and add each answer on the right rods.',
  '÷': 'Division takes away equal groups. Each step asks “how many fit?”, takes them off the top abacus, and writes the answer on the bottom abacus.'
};
const ABL_LIMITS = { '+': [9999, 9999], '-': [9999, 9999], '×': [999, 99], '÷': [9999, 99] };

register('abacus-lab', 'abacus', {
  icon: '🧮', title: 'Abacus Lab', desc: 'Move the beads and watch + − × ÷ step by step', color: '#b45309', bg: '#fdf0dc', custom: true,
  open() { show('abacus'); ablTabs(); ablRender(); },
  mastery() { return '🧮 Explore!'; }
});
function ablTabs() {
  $('#ablTabs').innerHTML = ABL_TABS.map(([k, l]) => `<button class="${k === ABL.tab ? 'on' : ''}" data-abtab="${k}">${l}</button>`).join('');
  $$('#ablTabs button').forEach(b => b.onclick = () => { ABL.tab = b.dataset.abtab; SFX.click(); ablTabs(); ablRender(); });
}
function ablRender() { hush(); const b = $('#ablBody'); if (ABL.tab === 'play') ablPlay(b); else ablOp(b, ABL.tab); }

function ablPlay(b) {
  ABL.target = null;
  b.innerHTML = `<div class="ab-how"><div><span class="ab-dot h"></span><b>Heaven bead</b> (top) = <b>5</b></div><div><span class="ab-dot e"></span><b>Earth bead</b> (bottom) = <b>1</b> each</div><div>Beads only count when they <b>touch the middle bar</b>. Each rod is a place: ones, tens, hundreds…</div></div>
    <p class="center muted" style="margin:10px 0 0">Tap a bead to move it!</p>
    <div class="big-eq" id="ablNum">0</div><div class="center muted" id="ablWords" style="font-size:1.1rem">zero</div>
    <div class="ab-stage" id="ablAb"></div>
    <div class="lab-ctrls"><button class="pill-btn" id="ablChal">🎯 Challenge me!</button><button class="pill-btn" id="ablSay">🔊 Say it</button><button class="pill-btn" id="ablClear">🧽 Clear</button><button class="pill-btn" id="ablShow">✨ Show me a number</button></div>
    <div class="ab-chal" id="ablTarget" hidden></div>`;
  const v = abacusView($('#ablAb'), 5, { interactive: true, onChange: upd });
  function upd() {
    const n = v.value(); $('#ablNum').textContent = n; $('#ablWords').textContent = numWords(n);
    if (ABL.target != null && n === ABL.target) {
      const t = ABL.target; ABL.target = null; SFX.good(); confetti(30); addXP(5); countToday(); save();
      $('#ablTarget').innerHTML = `🎉 Yes! That's <b>${t}</b>! <button class="pill-btn" id="ablNext">Next challenge ▶</button>`;
      $('#ablNext').onclick = challenge; speak(`Yes! That's ${t}!`);
    }
  }
  function challenge() {
    const lv = P().defaultLevel || 1, max = [9, 99, 9999][lv - 1];
    let t; do { t = rnd(lv === 1 ? 1 : 10, max); } while (t === v.value());
    ABL.target = t; const tb = $('#ablTarget'); tb.hidden = false;
    tb.innerHTML = `🎯 Make <b>${t}</b> on the abacus! <span class="muted">(${numWords(t)})</span>`;
    speak(`Make ${t} on the abacus.`); SFX.click();
  }
  $('#ablChal').onclick = challenge;
  $('#ablSay').onclick = () => speak(numWords(v.value()));
  $('#ablClear').onclick = () => { v.set(Array(5).fill(0)); upd(); SFX.click(); };
  $('#ablShow').onclick = () => { const n = rnd(1, 999); v.set(abDigits(n, 5)); upd(); speak(numWords(n)); };
}

function ablOp(b, op) {
  const [a0, b0] = ABL.ops[op], [maxA, maxB] = ABL_LIMITS[op], sym = { '+': '+', '-': '−', '×': '×', '÷': '÷' }[op];
  b.innerHTML = `<p class="center muted" style="margin-top:0">${ABL_INFO[op]}</p>
    <div class="ab-inputs"><input type="number" id="abA" min="0" max="${maxA}" value="${a0}" aria-label="first number"><span class="op-big">${sym}</span><input type="number" id="abB" min="${op === '÷' ? 1 : 0}" max="${maxB}" value="${b0}" aria-label="second number">
      <button class="btn" id="abGo">Show steps ▶</button><button class="pill-btn" id="abRand">🎲 New problem</button></div>
    <div class="center muted" id="abWarn" style="min-height:1.2em"></div><div id="abPlay"></div>
    <div class="ab-friends"><div>🤝 <b>5-friends</b> (make 5): 1 + 4 · 2 + 3</div><div>🤝 <b>10-friends</b> (make 10): 1 + 9 · 2 + 8 · 3 + 7 · 4 + 6 · 5 + 5</div></div>`;
  const go = () => {
    let a = Math.abs(parseInt($('#abA').value, 10) || 0), c = Math.abs(parseInt($('#abB').value, 10) || 0), warn = '';
    if (a > maxA) { a = maxA; warn = `Biggest first number here is ${maxA}.`; }
    if (c > maxB) { c = maxB; warn = `Biggest second number here is ${maxB}.`; }
    if (op === '-' && c > a) { [a, c] = [c, a]; warn = 'We swapped them so the bigger number comes first.'; }
    if (op === '÷' && c < 1) { c = 1; warn = "We can't divide by 0, so we used 1."; }
    $('#abA').value = a; $('#abB').value = c; $('#abWarn').textContent = warn;
    ABL.ops[op] = [a, c]; $('#abPlay').innerHTML = ''; abacusPlayer($('#abPlay'), op, a, c); SFX.click();
  };
  const rand = () => {
    let a, c;
    if (op === '+') { a = rnd(10, 999); c = rnd(5, 999); }
    else if (op === '-') { a = rnd(30, 999); c = rnd(5, a); }
    else if (op === '×') { if (Math.random() < .4) { a = rnd(3, 15); c = rnd(2, 5); } else { a = rnd(11, 99); c = rnd(2, 9); } }
    else { c = rnd(2, 9); a = c * rnd(5, 99) + (Math.random() < .25 ? rnd(1, c - 1) : 0); }
    $('#abA').value = a; $('#abB').value = c; go();
  };
  $('#abGo').onclick = go; $('#abRand').onclick = rand;
  $$('.ab-inputs input', b).forEach(i => i.onkeydown = e => { if (e.key === 'Enter') go(); });
  go();
}
