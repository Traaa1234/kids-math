'use strict';
/* Activity "placevalue" — Place value, expanded form and rounding */

register('placevalue', 'math', {
  icon: '🧱', title: 'Place Value', desc: 'Ones, tens, hundreds and rounding', color: '#3b82f6', bg: '#e6efff',
  gen(lv) {
    const t = Math.random();
    const blocksQ = n => ({ key: 'w' + n, kind: 'number', answer: n, prompt: `What number do the blocks show?<div class="visual" style="border:none;background:none;padding:6px">${baseTen(n, false)}</div>`,
      say: 'What number do the blocks show?', hint: 'Count big blocks first: hundreds, then tens (10, 20, 30…), then ones.',
      visual(v) { v.innerHTML = baseTen(n) + pvTable(n) + `<div class="cap">${expanded(n)} = <b>${n}</b></div>`; } });
    const valueQ = (n, maxPl) => {
      const s = String(n), opts = [];
      for (let p = 0; p <= maxPl; p++) if (s[s.length - 1 - p] !== '0') opts.push(p);
      const p = pick(opts), d = +s[s.length - 1 - p], ans = d * 10 ** p;
      const shown = [...s].map((c, i) => i === s.length - 1 - p ? `<span class="hl-digit">${c}</span>` : c).join('');
      const vals = [...new Set([d, d * 10, d * 100, d * 1000].slice(0, maxPl + 2))];
      return { key: 'v' + n + p, kind: 'choice', answer: ans, prompt: `What is the <b>value</b> of the underlined digit?<span class="big">${shown}</span>`,
        say: `What is the value of the ${d} in ${n}?`, choices: ch(shuffle(vals)), cols: vals.length === 3 ? 3 : 2,
        hint: 'Which place is it in? Ones, tens, hundreds…', noAutoVisual: false,
        visual(v) { v.innerHTML = pvTable(n, p) + `<div class="cap">The ${d} is in the <b>${PLACE[p]}</b> place, so it is worth <b>${ans}</b>.</div>`; } };
    };
    if (lv === 1) {
      const n = rnd(11, 99);
      if (t < .6) return blocksQ(n);
      const tens = Math.floor(n / 10);
      return { key: 't' + n, kind: 'choice', answer: tens, prompt: `How many <b>tens</b> are in<span class="big">${n}</span>`, say: `How many tens are in ${n}?`,
        choices: numChoices(tens, [n % 10, tens + 1, Math.max(0, tens - 1)]), hint: 'The tens digit is on the left.',
        visual(v) { v.innerHTML = baseTen(n) + pvTable(n, 1); } };
    }
    if (lv === 2) {
      const n = rnd(100, 999);
      if (t < .4) return blocksQ(n);
      return valueQ(n, 2);
    }
    const n = rnd(1000, 9999);
    if (t < .33) {
      return { key: 'e' + n, kind: 'number', answer: n, prompt: `Write the number:<span class="big" style="font-size:clamp(1.6rem,6vw,2.6rem)">${expanded(n)}</span>`,
        say: `What number is ${expanded(n).replace(/\+/g, 'plus')}?`, hint: 'Put each digit in its place: thousands, hundreds, tens, ones.',
        visual(v) { v.innerHTML = pvTable(n) + `<div class="cap">${expanded(n)} = <b>${n}</b></div>`; } };
    }
    if (t < .7) {
      const to = pick([10, 100]); let m = rnd(100, 999); if (m % to === 0) m += rnd(1, to - 1);
      const low = Math.floor(m / to) * to, high = low + to, ans = m - low >= to / 2 ? high : low;
      return { key: 'r' + m + to, kind: 'choice', answer: ans, prompt: `Round to the nearest <b>${to}</b>:<span class="big">${m}</span>`, say: `Round ${m} to the nearest ${to}.`,
        choices: ch(shuffle([...new Set([low, high, Math.max(0, low - to), high + to])])), hint: `Is it closer to ${low} or ${high}? Halfway or more rounds up.`,
        visual(v) { v.innerHTML = numberLine(low, high, { marks: [{ v: m, label: m, color: '#ff7a45' }, { v: low + to / 2, label: 'halfway', color: '#a3a3a3' }] }) + `<div class="cap">${m} is ${ans === high ? 'at or past' : 'before'} the halfway point (${low + to / 2}), so it rounds to <b>${ans}</b>.</div>`; } };
    }
    return valueQ(n, 3);
  }
});
