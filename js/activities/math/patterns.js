'use strict';
/* Activity "patterns" — Picture and number patterns */

register('patterns', 'math', {
  icon: '🔁', title: 'Patterns', desc: 'What comes next? Find the rule', color: '#8b5cf6', bg: '#f0e9ff',
  gen(lv) {
    if (lv === 1 && Math.random() < .45) {
      const sets = [['🔴', '🔵', '🟡'], ['🍎', '🍌', '🍇'], ['⭐', '🌙', '☀️'], ['🐶', '🐱', '🐭'], ['🟩', '🟨', '🟥'], ['🐸', '🦆', '🐟']];
      const s = pick(sets), unit = pick([[0, 1], [0, 0, 1], [0, 1, 1], [0, 1, 2]]).map(i => s[i]);
      const seq = Array.from({ length: unit.length * 3 }, (_, i) => unit[i % unit.length]).slice(0, unit.length === 2 ? 7 : 8);
      const ans = seq[seq.length - 1], shown = seq.slice(0, -1);
      return { key: 'e' + seq.join(''), kind: 'choice', answer: ans, prompt: `What comes next?<div class="seq">${shown.map(e => `<span class="n">${e}</span>`).join('')}<span class="n q">?</span></div>`,
        say: 'What comes next in the pattern?', choices: ch(shuffle(s)), cols: 3, choiceClass: 'emo', hint: 'Say the pattern out loud. Which part repeats?',
        visual(v) { v.innerHTML = `<div class="seq">${[0, 1, 2].map(() => `<span class="n" style="background:#f0e9ff">${unit.join('')}</span>`).join('<span class="hop">|</span>')}</div><div class="cap">The part <b>${unit.join(' ')}</b> repeats over and over.</div>`; } };
    }
    let seq, rule;
    if (lv === 1) { const st = pick([1, 2, 5, 10]), s0 = st === 1 ? rnd(1, 15) : st * rnd(0, 5); seq = Array.from({ length: 5 }, (_, i) => s0 + st * i); rule = `Count by ${st}s: add ${st} each time.`; }
    else if (lv === 2) {
      const st = pick([3, 4, 5, 10, 25, -2, -5, -10]), s0 = st > 0 ? (st === 25 ? 0 : rnd(1, 20)) : rnd(30, 60);
      seq = Array.from({ length: 5 }, (_, i) => s0 + st * i); rule = st > 0 ? `Add ${st} each time.` : `Subtract ${-st} each time — counting backward.`;
    } else {
      const t = rnd(0, 4);
      if (t === 0) { const s0 = rnd(1, 5); seq = [0, 1, 2, 3, 4].map(i => s0 * 2 ** i); rule = 'Double it (× 2) each time.'; }
      else if (t === 1) { const s0 = rnd(1, 10); seq = [s0]; for (let i = 1; i < 5; i++) seq.push(seq[i - 1] + i); rule = 'Add 1, then 2, then 3, then 4 — the jump grows by 1.'; }
      else if (t === 2) { const k = rnd(1, 4); seq = [0, 1, 2, 3, 4].map(i => (k + i) ** 2); rule = `Square numbers: ${k}×${k}, ${k + 1}×${k + 1}, ${k + 2}×${k + 2}…`; }
      else if (t === 3) { seq = [0, 1, 2, 3, 4].map(i => 3 ** i); rule = 'Multiply by 3 each time.'; }
      else { const st = pick([7, 9, 11, 12]), s0 = rnd(80, 120); seq = [0, 1, 2, 3, 4].map(i => s0 - st * i); rule = `Subtract ${st} each time.`; }
    }
    const qi = lv === 1 ? pick([2, 3, 4]) : rnd(1, 4), ans = seq[qi];
    return { key: 's' + seq.join(','), kind: 'choice', answer: ans, prompt: `What number is missing?${seqHTML(seq, qi, false)}`,
      say: 'What number is missing? ' + seq.map((x, i) => i === qi ? 'blank' : x).join(', '),
      choices: numChoices(ans, [ans + (seq[1] - seq[0]), ans - (seq[1] - seq[0])]), hint: 'How much does it change from one number to the next?',
      visual(v) { v.innerHTML = seqHTML(seq, qi, true) + `<div class="cap"><b>Rule:</b> ${rule}</div>`; } };
  }
});
