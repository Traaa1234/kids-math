'use strict';
/* Activity "muldiv" — Multiply & divide with arrays, equal groups, box method, long division */

register('muldiv', 'math', {
  icon: '✖️', title: 'Multiply & Divide', desc: 'See arrays, equal groups and the box method', color: '#ec4899', bg: '#fdeaf4',
  gen(lv) {
    if (Math.random() < .55) {
      let a, b;
      if (lv === 1) { a = pick([1, 2, 3, 4, 5, 10]); b = rnd(1, 10); }
      else if (lv === 2) { a = rnd(2, 12); b = rnd(2, 12); }
      else if (Math.random() < .6) { a = rnd(12, 99); b = rnd(2, 9); } else { a = rnd(11, 25); b = rnd(11, 19); }
      const small = a <= 12 && b <= 12;
      return { key: a + 'x' + b, kind: 'number', answer: a * b, prompt: `<span class="big">${a} × ${b} = <span class="qbox">?</span></span>`, say: `${a} times ${b}`,
        hint: small ? `${a} rows of ${b}. Skip count by ${b}!` : 'Break the big number into tens and ones.',
        visual(v) { v.innerHTML = small ? arrayDots(a, b) : areaModel(a, b); } };
    }
    let d, q;
    if (lv === 1) { d = pick([2, 5, 10]); q = rnd(1, 10); } else if (lv === 2) { d = rnd(2, 12); q = rnd(2, 12); } else { d = rnd(2, 9); q = rnd(11, 99); }
    const a = d * q;
    return { key: a + '/' + d, kind: 'number', answer: q, prompt: `<span class="big">${a} ÷ ${d} = <span class="qbox">?</span></span>`, say: `${a} divided by ${d}`,
      hint: `Think: what number times ${d} makes ${a}?`,
      visual(v) { v.innerHTML = a <= 144 ? shareGroups(a, d) : longDivHTML(a, d); } };
  }
});
