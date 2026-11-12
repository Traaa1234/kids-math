'use strict';
/* Activity "race" — 60-second times-table race (timed round) */

register('race', 'math', {
  icon: '⚡', title: 'Times Table Race', desc: 'How many can you get in 60 seconds?', color: '#f59e0b', bg: '#fff6d9', timed: 60, goals: [8, 15, 22],
  gen(lv) {
    const tabs = lv === 1 ? [2, 5, 10] : lv === 2 ? [2, 3, 4, 5, 6, 7, 8, 9, 10] : [3, 4, 6, 7, 8, 9, 11, 12];
    const a = pick(tabs), b = rnd(lv === 3 ? 2 : 1, lv === 3 ? 12 : 10), ans = a * b;
    const [x, y] = Math.random() < .5 ? [a, b] : [b, a];
    return { key: x + 'x' + y, kind: 'choice', answer: ans, answerText: `${x} × ${y} = ${ans}`, prompt: `<span class="big">${x} × ${y}</span>`, say: `${x} times ${y}`,
      choices: numChoices(ans, [a * (b + 1), a * Math.max(1, b - 1), (a + 1) * b, ans + 2]) };
  }
});
