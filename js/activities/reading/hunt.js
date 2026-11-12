'use strict';
/* Activity "hunt" — Hear a sight word, find it */

register('hunt', 'reading', {
  icon: '👂', title: 'Word Hunt', desc: 'Listen, then find the sight word', color: '#6366f1', bg: '#eceeff',
  gen(lv) {
    const pool = lv === 1 ? SW.slice(0, 60) : lv === 2 ? SW.slice(40, 130) : SW.slice(100);
    const w = pick(pool);
    const ok = x => x.w !== w.w && x.r !== w.r;
    let others = shuffle(SW.filter(x => ok(x) && (x.w[0] === w.w[0] || Math.abs(x.w.length - w.w.length) <= 1))).slice(0, 3);
    while (others.length < 3) { const x = pick(SW); if (ok(x) && !others.includes(x)) others.push(x); }
    return { key: w.w, kind: 'choice', answer: w.w, prompt: `<span class="emo" style="font-size:3.5rem">👂</span><br>Listen, then tap the word you hear!`, say: w.w, alwaysSpeak: true,
      choices: ch(shuffle([w, ...others].map(x => x.w))), hint: 'Tap 🔊 to hear it again. Look at the first letter!',
      explain: `<b>${w.w}</b> sounds like “${w.r}”.`, after() { speak(w.w); } };
  }
});
