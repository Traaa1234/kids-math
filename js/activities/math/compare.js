'use strict';
/* Activity "compare" — Compare numbers and expressions (< = >) */

register('compare', 'math', {
  icon: '🐊', title: 'Compare Numbers', desc: 'Greater than, less than, equal', color: '#22c55e', bg: '#e5f9ec',
  gen(lv) {
    let a, b, A, B, va, vb;
    if (lv === 1) { a = rnd(0, 20); b = Math.random() < .2 ? a : rnd(0, 20); }
    else if (lv === 2) { a = rnd(100, 999); b = Math.random() < .15 ? a : Math.random() < .55 ? Math.floor(a / 100) * 100 + rnd(0, 99) : rnd(100, 999); }
    if (lv < 3) { A = a; B = b; va = a; vb = b; }
    else {
      const ex = () => { const t = rnd(0, 2); if (t === 0) { const x = rnd(2, 9), y = rnd(2, 9); return [`${x} × ${y}`, x * y]; } if (t === 1) { const x = rnd(10, 60), y = rnd(5, 30); return [`${x} + ${y}`, x + y]; } const x = rnd(30, 90), y = rnd(5, 29); return [`${x} − ${y}`, x - y]; };
      let e1, e2, g = 0; do { e1 = ex(); e2 = ex(); g++; } while (g < 60 && (Math.abs(e1[1] - e2[1]) > 8 || (e1[1] === e2[1] && Math.random() < .5)));
      [A, va] = e1; [B, vb] = e2;
    }
    const ans = va > vb ? '>' : va < vb ? '<' : '=';
    return { key: `${A}?${B}`, kind: 'choice', answer: ans, prompt: `<span class="big">${A} <span class="qbox">?</span> ${B}</span>`,
      say: `Is ${A} greater than, less than, or equal to ${B}?`.replace(/×/g, 'times').replace(/−/g, 'minus'),
      choices: [{ label: '&lt;', val: '<' }, { label: '=', val: '=' }, { label: '&gt;', val: '>' }], cols: 3, choiceClass: 'sym',
      hint: lv === 3 ? 'Work out each side first, then compare.' : 'The 🐊 mouth always opens toward the bigger number.',
      visual(v) {
        const lo = Math.min(va, vb), hi = Math.max(va, vb);
        const step = lv === 2 ? 100 : 10, min = lv === 1 ? 0 : Math.floor(lo / step) * step, max = lv === 1 ? 20 : Math.max(min + step, Math.ceil((hi + 1) / step) * step);
        let cap = va === vb ? `Both are <b>${va}</b>, so they are equal: <b>=</b>` : `<b>${hi}</b> is further right on the number line, so it is bigger.<br>${va} ${ans} ${vb} &nbsp;🐊 <i>the alligator eats the bigger number!</i>`;
        if (lv === 2 && va !== vb) { const sa = String(va), sb = String(vb); let i = 0; while (sa[i] === sb[i]) i++; cap += `<br>Check the digits from the left: the first different place is the <b>${PLACE[2 - i]}</b> (${sa[i]} vs ${sb[i]}).`; }
        if (lv === 3) cap = `${A} = <b>${va}</b> and ${B} = <b>${vb}</b>.<br>` + cap;
        v.innerHTML = numberLine(min, max, { marks: [{ v: va, label: va, color: '#ff7a45' }, { v: vb, label: vb, color: '#5b6cff' }] }) + `<div class="cap">${cap}</div>`;
      } };
  }
});
