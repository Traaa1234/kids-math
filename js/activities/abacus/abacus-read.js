'use strict';
/* Activity "abacus-read" — read the number on an abacus, or build a number on it (uses the 'abacus' answer kind) */
register('abacus-read', 'abacus', {
  icon: '👀', title: 'Read & Build', desc: 'Read the beads, or build the number yourself', color: '#d97706', bg: '#fff4dc',
  gen(lv) {
    const R = lv === 1 ? 1 : lv === 2 ? 2 : rnd(3, 4);
    const n = lv === 1 ? rnd(0, 9) : rnd(10 ** (R - 1), 10 ** R - 1), d = abDigits(n, R);
    const explainPic = v => { v.innerHTML = `<div class="ab-stage">${abacusSVG(R, { digits: d })}</div><ol class="steps">${d.map((x, i) => `<li><b>${cap(AB_PLACE[R - 1 - i])}</b>: ${abRodWords(x)} = <b>${x}</b></li>`).join('')}</ol><div class="cap">Put the digits together: <b>${n}</b> — ${numWords(n)}</div>`; };
    if (Math.random() < .5) {
      return { key: 'r' + n, kind: 'number', answer: n, prompt: `What number does the abacus show?<div class="ab-stage">${abacusSVG(R, { digits: d, showDigits: false })}</div>`,
        say: 'What number does the abacus show?', hint: 'Top bead = 5, each bottom bead = 1. Only beads touching the bar count. Read each rod from left to right.', visual: explainPic };
    }
    return { key: 'b' + n, kind: 'abacus', rods: R, answer: n, prompt: `Build this number on the abacus:<span class="big">${n}</span>`, say: `Build ${numWords(n)} on the abacus.`,
      hint: 'Tap beads to move them to the bar. Top bead = 5, bottom beads = 1 each.', visual: explainPic, noAutoVisual: true };
  }
});
