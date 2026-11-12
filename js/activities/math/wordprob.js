'use strict';
/* Activity "wordprob" — Word problems with picture groups and bar models */

const KIDS = [['Mia', 'she'], ['Leo', 'he'], ['Ava', 'she'], ['Sam', 'he'], ['Zoe', 'she'], ['Omar', 'he'], ['Ivy', 'she'], ['Raj', 'he'], ['Nina', 'she'], ['Ben', 'he'], ['Lily', 'she'], ['Max', 'he']];
const THINGS = [['🍎', 'apple', 'apples'], ['🍪', 'cookie', 'cookies'], ['🎈', 'balloon', 'balloons'], ['⭐', 'sticker', 'stickers'], ['🐟', 'fish', 'fish'], ['🧁', 'cupcake', 'cupcakes'], ['🐚', 'shell', 'shells'], ['✏️', 'pencil', 'pencils'], ['🍓', 'strawberry', 'strawberries'], ['🚗', 'toy car', 'toy cars']];
register('wordprob', 'math', {
  icon: '📝', title: 'Word Problems', desc: 'Math stories with pictures and bar models', color: '#0d9488', bg: '#dff7f3',
  gen(lv) {
    const [N, pr] = pick(KIDS); let [N2] = pick(KIDS); if (N2 === N) N2 = N === 'Max' ? 'Ivy' : 'Max';
    const [e, , pl] = pick(THINGS), Pr = cap(pr);
    const types = lv === 1 ? ['add', 'sub', 'join'] : lv === 2 ? ['add', 'sub', 'cmp', 'join', 'mul'] : ['mul', 'div', 'two', 'cmp', 'two2'];
    const t = pick(types); let text, ans, vis, eq;
    const big = lv > 1;
    if (t === 'add') { const a = big ? rnd(12, 60) : rnd(2, 9), b = big ? rnd(10, 39) : rnd(1, 9); ans = a + b; eq = `${a} + ${b} = ${ans}`;
      text = `${N} has ${a} ${e} ${pl}. ${Pr} gets ${b} more. How many ${pl} does ${N} have now?`;
      vis = ans <= 24 ? emojiGroups([a, b], e) : barModel([{ label: 'Total ?', parts: [{ v: a, color: '#ff7a45' }, { v: b, color: '#5b6cff' }] }]); }
    else if (t === 'join') { const a = big ? rnd(10, 50) : rnd(2, 8), b = big ? rnd(10, 45) : rnd(2, 8); ans = a + b; eq = `${a} + ${b} = ${ans}`;
      text = `${N} picked ${a} ${e} ${pl}. ${N2} picked ${b}. How many ${pl} did they pick in all?`;
      vis = ans <= 24 ? emojiGroups([a, b], e) : barModel([{ label: N, parts: [{ v: a, color: '#ff7a45' }] }, { label: N2, parts: [{ v: b, color: '#5b6cff' }] }]); }
    else if (t === 'sub') { const a = big ? rnd(30, 90) : rnd(5, 15), b = big ? rnd(10, a - 5) : rnd(1, a - 1); ans = a - b; eq = `${a} − ${b} = ${ans}`;
      text = `${N} has ${a} ${e} ${pl}. ${Pr} gives ${b} to a friend. How many ${pl} does ${N} have left?`;
      vis = a <= 24 ? emojiGroups([a], e, { cross: b }) + `<div class="cap">The faded ones were given away.</div>` : barModel([{ label: 'Start', parts: [{ v: ans, color: '#16a34a', text: '? left' }, { v: b, color: '#a3a3a3', text: `${b} given` }] }]); }
    else if (t === 'cmp') { const b = big ? rnd(10, 40) : rnd(2, 8), a = b + (big ? rnd(5, 30) : rnd(1, 6)); ans = a - b; eq = `${a} − ${b} = ${ans}`;
      text = `${N} has ${a} ${e} ${pl}. ${N2} has ${b}. How many more ${pl} does ${N} have than ${N2}?`;
      vis = barModel([{ label: N, parts: [{ v: b, color: '#ff7a45' }, { v: a - b, color: '#16a34a', text: '?' }] }, { label: N2, parts: [{ v: b, color: '#5b6cff' }] }]) + `<div class="cap">The green part is how many more.</div>`; }
    else if (t === 'mul') { const g = lv === 2 ? rnd(2, 5) : rnd(3, 9), k = lv === 2 ? rnd(2, 5) : rnd(3, 12); ans = g * k; eq = `${g} × ${k} = ${ans}`;
      text = `There are ${g} bags. Each bag has ${k} ${e} ${pl}. How many ${pl} are there in all?`;
      vis = ans <= 40 ? emojiGroups(Array(g).fill(k), e, { op: '' }) + `<div class="cap">${g} groups of ${k}</div>` : areaModel(Math.max(g, k), Math.min(g, k)); }
    else if (t === 'div') { const g = rnd(2, 8), k = rnd(2, 9); ans = k; eq = `${g * k} ÷ ${g} = ${k}`;
      text = `${N} shares ${g * k} ${e} ${pl} equally into ${g} boxes. How many ${pl} go in each box?`;
      vis = emojiGroups(Array(g).fill(k), e, { op: '' }) + `<div class="cap">${g * k} shared into ${g} equal boxes → ${k} in each</div>`; }
    else if (t === 'two') { const g = rnd(3, 6), k = rnd(4, 10), c = rnd(2, g * k - 2); ans = g * k - c; eq = `${g} × ${k} = ${g * k}, then ${g * k} − ${c} = ${ans}`;
      text = `${N} buys ${g} packs of ${pl}. Each pack has ${k} ${e}. ${Pr} gives away ${c}. How many ${pl} does ${N} have left?`;
      vis = `<ol class="steps"><li>First find the total: ${g} packs × ${k} = <b>${g * k}</b></li><li>Then take away the ones given away: ${g * k} − ${c} = <b>${ans}</b></li></ol>`; }
    else { const a = rnd(20, 60), b = rnd(10, 30), c = rnd(5, 25); ans = a + b - c; eq = `${a} + ${b} = ${a + b}, then ${a + b} − ${c} = ${ans}`;
      text = `${N} had ${a} ${e} ${pl}. ${Pr} found ${b} more, then gave ${c} to ${N2}. How many ${pl} does ${N} have now?`;
      vis = `<ol class="steps"><li>Add the ones found: ${a} + ${b} = <b>${a + b}</b></li><li>Take away the ones given: ${a + b} − ${c} = <b>${ans}</b></li></ol>`; }
    return { key: text, kind: 'number', answer: ans, prompt: `<div class="wp">${text}</div>`, say: text, hint: 'Draw it or use the picture! Do you need to join, take away, or make groups?',
      visual(v) { v.innerHTML = vis + `<div class="cap">Number sentence: <b>${eq}</b></div>`; } };
  }
});
