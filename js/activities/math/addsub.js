'use strict';
/* Activity "addsub" — Add & subtract with ten-frames, blocks and a step-by-step column stepper */

register('addsub', 'math', {
  icon: '➕', title: 'Add & Subtract', desc: 'Ten-frames, blocks and carrying step by step', color: '#ff7a45', bg: '#fff0e6',
  gen(lv) {
    const add = Math.random() < .5; let a, b;
    if (lv === 1) { if (add) { a = rnd(1, 10); b = rnd(1, 10); } else { a = rnd(5, 20); b = rnd(1, Math.min(10, a)); } }
    else if (lv === 2) { if (add) { a = rnd(10, 99); b = rnd(10, 99); } else { a = rnd(30, 99); b = rnd(10, a - 1); } }
    else {
      if (add) { a = rnd(100, 999); b = rnd(100, 999); }
      else { a = Math.random() < .3 ? rnd(2, 9) * 100 + rnd(0, 9) : rnd(200, 999); b = rnd(100, a - 1); }
    }
    const ans = add ? a + b : a - b, op = add ? '+' : '−';
    return {
      key: a + op + b, kind: 'number', answer: ans,
      prompt: lv === 1 ? `<span class="big">${a} ${op} ${b} = <span class="qbox">?</span></span>` : vertHTML(a, b, op),
      say: `${a} ${add ? 'plus' : 'minus'} ${b}`,
      hint: lv === 1 ? (add ? 'Start at the bigger number and count on.' : 'Count back, or cross some dots out!') : (add ? 'Start with the ones. 10 or more? Carry 1!' : 'Start with the ones. Top digit smaller? Regroup!'),
      visual(v) {
        if (lv === 1) { v.innerHTML = tenFrames(a, b, add ? '+' : '-'); return; }
        v.innerHTML = `<div class="b10-row">${b10Num(a)}<div class="op-big">${op}</div>${b10Num(b)}</div><div class="cap">Tap <b>Next step</b> to solve it one column at a time 👇</div>`;
        columnStepper(v, a, b, add ? '+' : '-');
      },
      explain: lv === 1 ? 'Look at the dots below to see why.' : 'Use the <b>Next step</b> button below to walk through every column.'
    };
  }
});
