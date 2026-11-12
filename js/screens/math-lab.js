'use strict';
/* Math Lab screen: free-play blocks, arrays, fractions, clock, number line */
const LAB = { tab: 'blocks', n: 245, r: 3, c: 4, num: 3, den: 4, h: 3, m: 15, ls: 6, lj: 5, lop: '+' };
const LAB_TABS = [['blocks', '🧱 Blocks'], ['array', '🟠 Arrays'], ['frac', '🍕 Fractions'], ['clock', '⏰ Clock'], ['line', '📏 Number Line']];
register('lab', 'math', {
  icon: '🔬', title: 'Math Lab', desc: 'Build with blocks, arrays, fractions & clocks', color: '#ff7a45', bg: '#fff0e6', custom: true,
  open() { show('lab'); labTabs(); labRender(); },
  mastery() { return '🧪 Explore!'; }
});
function labTabs() {
  $('#labTabs').innerHTML = LAB_TABS.map(([k, l]) => `<button class="${k === LAB.tab ? 'on' : ''}" data-tab="${k}">${l}</button>`).join('');
  $$('#labTabs button').forEach(b => b.onclick = () => { LAB.tab = b.dataset.tab; SFX.click(); hush(); labTabs(); labRender(); });
}
const slider = (k, label, min, max) => `<div class="range"><label for="sl_${k}">${label}: <b id="v_${k}">${LAB[k]}</b></label><input type="range" id="sl_${k}" min="${min}" max="${max}" value="${LAB[k]}" data-k="${k}"></div>`;
function bindSliders(root, out) { $$('input[type=range]', root).forEach(s => s.oninput = () => { LAB[s.dataset.k] = +s.value; $('#v_' + s.dataset.k).textContent = s.value; out(); }); }
function labRender() { const b = $('#labBody'); LABR[LAB.tab](b); }
const LABR = {
  blocks(b) {
    b.innerHTML = `<p class="center muted" style="margin-top:0">Add or take away blocks and watch the number change!</p>
      <div class="lab-ctrls">${[1000, 100, 10, 1].map(v => `<button class="pill-btn" data-add="${v}">+ ${v}</button>`).join('')}</div>
      <div class="lab-ctrls">${[1000, 100, 10, 1].map(v => `<button class="pill-btn" data-add="${-v}">− ${v}</button>`).join('')}<button class="pill-btn" data-rand>🎲 Surprise</button><button class="pill-btn" data-say>🔊 Say it</button></div><div id="labOut"></div>`;
    const out = () => { const n = LAB.n; $('#labOut').innerHTML = `<div class="big-eq">${n}</div><div class="center muted" style="font-size:1.1rem">${numWords(n)}</div><div class="visual">${baseTen(n)}${pvTable(n)}<div class="cap">Expanded form: <b>${expanded(n)}</b></div></div>`; };
    $$('[data-add]', b).forEach(x => x.onclick = () => { LAB.n = Math.max(0, Math.min(9999, LAB.n + +x.dataset.add)); SFX.click(); out(); });
    $('[data-rand]', b).onclick = () => { LAB.n = Math.random() < .7 ? rnd(11, 999) : rnd(1000, 9999); SFX.click(); out(); };
    $('[data-say]', b).onclick = () => speak(numWords(LAB.n));
    out();
  },
  array(b) {
    b.innerHTML = `<p class="center muted" style="margin-top:0">Multiplication is rows of equal groups. Slide to build an array!</p>${slider('r', 'Rows', 1, 12)}${slider('c', 'In each row', 1, 12)}<div class="center"><button class="pill-btn" id="swapArr">🔄 Turn it around</button></div><div id="labOut"></div>`;
    const out = () => { const { r, c } = LAB; $('#labOut').innerHTML = `<div class="big-eq">${r} × ${c} = <span style="color:var(--math)">${r * c}</span></div><div class="visual">${arrayDots(r, c)}</div><div class="cap">Turn-around fact: <b>${c} × ${r} = ${r * c}</b><br>Division facts: <b>${r * c} ÷ ${r} = ${c}</b> and <b>${r * c} ÷ ${c} = ${r}</b></div>`; };
    bindSliders(b, out);
    $('#swapArr').onclick = () => { [LAB.r, LAB.c] = [LAB.c, LAB.r]; SFX.click(); labRender(); };
    out();
  },
  frac(b) {
    b.innerHTML = `<p class="center muted" style="margin-top:0">The bottom number says how many equal parts. The top says how many are shaded.</p>${slider('den', 'Equal parts', 1, 12)}${slider('num', 'Shaded parts', 0, LAB.den)}<div id="labOut"></div>`;
    const numS = $('#sl_num');
    const out = () => {
      numS.max = LAB.den; if (LAB.num > LAB.den) { LAB.num = LAB.den; numS.value = LAB.den; $('#v_num').textContent = LAB.den; }
      const { num, den } = LAB, half = num * 2 === den ? 'exactly one half' : num * 2 > den ? 'more than one half' : 'less than one half';
      let eq = ''; for (const k of [2, 3]) if (den * k <= 24) eq += `<div class="lab">${fr(num * k, den * k)} ${barSVG(num * k, den * k, 300, 34, '#14b8a6')}</div>`;
      $('#labOut').innerHTML = `<div class="big-eq" style="font-size:3rem">${fr(num, den)}</div><div class="center muted" style="font-size:1.1rem">${num === den ? 'one whole!' : fracWords(num, den)} — ${half}</div>
        <div class="visual"><div class="fr-row">${pieSVG(num, den, 170)}${barSVG(num, den, 300, 50)}</div>
        ${num > 0 && num < den ? `<div class="cap">These are all the <b>same amount</b> (equivalent fractions):</div><div class="fr-stack" style="margin-top:8px"><div class="lab">${fr(num, den)} ${barSVG(num, den, 300, 34, '#5b6cff')}</div>${eq}</div>` : ''}</div>`;
    };
    bindSliders(b, out); out();
  },
  clock(b) {
    b.innerHTML = `<p class="center muted" style="margin-top:0">Move the hands and watch how the time changes. Notice the short hand moves slowly too!</p>
      <div class="lab-ctrls"><button class="pill-btn" data-t="-60">− 1 hour</button><button class="pill-btn" data-t="60">+ 1 hour</button><button class="pill-btn" data-t="-5">− 5 min</button><button class="pill-btn" data-t="5">+ 5 min</button><button class="pill-btn" data-t="-1">− 1 min</button><button class="pill-btn" data-t="1">+ 1 min</button><button class="pill-btn" data-say>🔊 Say it</button></div><div id="labOut"></div>`;
    const out = () => { const { h, m } = LAB; $('#labOut').innerHTML = `<div class="visual">${clockSVG(h, m, 260, { minutes: true })}<div class="digital">${fmtTime(h, m)}</div><div class="cap" style="font-size:1.2rem">${cap(timeWords(h, m))}</div></div>`; };
    $$('[data-t]', b).forEach(x => x.onclick = () => { let t = ((LAB.h % 12) * 60 + LAB.m + +x.dataset.t + 720) % 720; LAB.h = Math.floor(t / 60) || 12; LAB.m = t % 60; SFX.tick(); out(); });
    $('[data-say]', b).onclick = () => speak(`It is ${timeWords(LAB.h, LAB.m)}.`);
    out();
  },
  line(b) {
    b.innerHTML = `<p class="center muted" style="margin-top:0">Hop along the number line to add or subtract.</p>${slider('ls', 'Start at', 0, 20)}${slider('lj', 'Hops', 0, 10)}<div class="center"><span class="seg-btns"><button data-op="+" class="${LAB.lop === '+' ? 'on' : ''}">+</button><button data-op="-" class="${LAB.lop === '-' ? 'on' : ''}">−</button></span></div><div id="labOut"></div>`;
    const out = () => {
      const { ls, lop } = LAB, lj = lop === '-' ? Math.min(LAB.lj, ls) : LAB.lj, end = lop === '+' ? ls + lj : ls - lj, hops = [];
      for (let i = 0; i < lj; i++) { const f = lop === '+' ? ls + i : ls - i; hops.push({ from: f, to: lop === '+' ? f + 1 : f - 1, label: String(i + 1), color: lop === '+' ? '#5b6cff' : '#e11d48' }); }
      $('#labOut').innerHTML = `<div class="big-eq">${ls} ${lop === '+' ? '+' : '−'} ${lj} = <span style="color:var(--math)">${end}</span></div><div class="visual">${numberLine(0, 30, { marks: [{ v: ls, label: 'start', color: '#a3a3a3' }, { v: end, label: end, color: '#ff7a45' }], hops })}<div class="cap">${lj === 0 ? 'No hops — you stay where you started!' : `Start at <b>${ls}</b> and hop <b>${lj}</b> ${lop === '+' ? 'forward (right)' : 'back (left)'}. You land on <b>${end}</b>.`}${lop === '-' && LAB.lj > ls ? '<br><i>You can\'t hop past zero here!</i>' : ''}</div></div>`;
    };
    bindSliders(b, out);
    $$('[data-op]', b).forEach(x => x.onclick = () => { LAB.lop = x.dataset.op; $$('[data-op]', b).forEach(y => y.classList.toggle('on', y === x)); SFX.click(); out(); });
    out();
  }
};
