'use strict';
/* Odd One Out (uses GAMES.oddGroups) */
// GAMES (puzzle scenes, odd-one-out groups) comes from the original "Learning Games" app.
register('oddone', 'brain', {
  icon: '🦉', title: 'Odd One Out', desc: 'Which one does not belong? Think!', color: '#14b8a6', bg: '#dcf7f3',
  gen(lv) {
    const g = pick(GAMES.oddGroups[['easy', 'medium', 'hard'][lv - 1]]);
    const order = shuffle([0, 1, 2, 3]), ansPos = order.indexOf(g.oddIndex);
    return { key: g.items.join(''), kind: 'choice', answer: ansPos, prompt: '🦉 Which one does <b>not</b> belong?', say: 'Which one does not belong?',
      choices: order.map((oi, pos) => ({ label: g.items[oi], val: pos })), choiceClass: 'emo', hint: 'What do three of them have in common?',
      answerText: g.items[g.oddIndex], explain: g.hint ? `Clue: <b>${esc(g.hint)}</b>` : '' };
  }
});
