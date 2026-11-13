'use strict';
/* Activity "abacus-math" — solve + − × ÷ problems; the 🧮 button replays the solution bead by bead */
register('abacus-math', 'abacus', {
  icon: '🧠', title: 'Abacus Math', desc: 'Solve it, then watch the beads show how', color: '#92400e', bg: '#fbead3',
  gen(lv) {
    const ops = lv === 1 ? ['+', '-'] : lv === 2 ? ['+', '-', '×'] : ['+', '-', '×', '÷'];
    const op = pick(ops); let a, b;
    if (op === '+') { if (lv === 1) { a = rnd(1, 9); b = rnd(1, 9); } else if (lv === 2) { a = rnd(10, 99); b = rnd(10, 99); } else { a = rnd(100, 999); b = rnd(100, 999); } }
    else if (op === '-') { if (lv === 1) { a = rnd(5, 18); b = rnd(1, Math.min(9, a)); } else if (lv === 2) { a = rnd(20, 99); b = rnd(5, a); } else { a = rnd(200, 999); b = rnd(50, a); } }
    else if (op === '×') { if (lv === 2) { a = rnd(2, 12); b = rnd(2, 5); } else { a = rnd(11, 99); b = rnd(2, 9); } }
    else { b = rnd(2, 9); a = b * rnd(11, 99); }
    const ans = op === '+' ? a + b : op === '-' ? a - b : op === '×' ? a * b : a / b;
    const sym = { '+': '+', '-': '−', '×': '×', '÷': '÷' }[op], word = { '+': 'plus', '-': 'minus', '×': 'times', '÷': 'divided by' }[op];
    return { key: a + op + b, kind: 'number', answer: ans, prompt: `<span class="big">${a} ${sym} ${b} = <span class="qbox">?</span></span>`, say: `${a} ${word} ${b}`,
      hint: 'Tap 🧮 Show it on the abacus to see every bead move.', showLabel: '🧮 Show it on the abacus',
      visual(v) { abacusPlayer(v, op, a, b); }, explain: 'Step through the abacus below to see how the beads find the answer.' };
  },
  selfTest: abacusSelfTest
});
