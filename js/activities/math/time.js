'use strict';
/* Activity "time" — Tell the time and elapsed time */

register('time', 'math', {
  icon: '⏰', title: 'Tell the Time', desc: 'Read clocks and figure out "how long"', color: '#0ea5e9', bg: '#e0f4fd',
  gen(lv) {
    const readQ = (h, m) => {
      const ans = fmtTime(h, m), nx = h % 12 + 1, pv = (h + 10) % 12 + 1, opts = new Set([ans]);
      const cands = [fmtTime(nx, m), fmtTime(pv, m), m === 0 ? fmtTime(h, 30) : fmtTime(h, 0), Number.isInteger(m / 5) && m / 5 >= 1 ? fmtTime(m / 5, (h * 5) % 60) : null, fmtTime(h, (m + 5) % 60), fmtTime(h, (m + 55) % 60)];
      for (const c of shuffle(cands)) { if (c && opts.size < 4) opts.add(c); }
      return { key: 't' + ans, kind: 'choice', answer: ans, prompt: `What time is it?<div>${clockSVG(h, m, 200)}</div>`, say: 'What time does the clock show?',
        choices: ch(shuffle([...opts])), hint: 'Short hand = hour. Long orange hand = minutes (count by 5s).',
        visual(v) { v.innerHTML = clockSVG(h, m, 230, { minutes: true }) + `<div class="cap">The <b>short hand</b> is ${m === 0 ? 'on' : 'just past'} <b>${h}</b>. The <b>long hand</b> points to ${m === 0 ? '12 → o\'clock' : `the ${m / 5 % 1 === 0 ? m / 5 : 'mark for'} → <b>${m}</b> minutes`}.<br>It is <b>${ans}</b> — ${timeWords(h, m)}.</div>`; } };
    };
    if (lv === 1) return readQ(rnd(1, 12), pick([0, 30]));
    if (lv === 2) return readQ(rnd(1, 12), Math.random() < .5 ? pick([15, 30, 45]) : rnd(1, 11) * 5);
    if (Math.random() < .4) {
      const h = rnd(1, 12), m = rnd(1, 59);
      const q = readQ(h, m); q.hint = 'Count by 5s to the number before the long hand, then add the little marks.'; return q;
    }
    const h = rnd(1, 11), m = rnd(0, 11) * 5, add = pick([15, 20, 30, 40, 45, 50, 75, 90, 105, 120]);
    const tot = h * 60 + m + add, eh = (Math.floor(tot / 60) - 1) % 12 + 1, em = tot % 60, ans = fmtTime(eh, em);
    const wrap = (mins) => { const t2 = ((mins % 720) + 720) % 720; return fmtTime((Math.floor(t2 / 60) + 11) % 12 + 1, t2 % 60); };
    const opts = new Set([ans]); for (const c of shuffle([wrap(tot + 60), wrap(tot - 60), wrap(tot + 10), wrap(tot - 10), wrap(tot - add + (add % 60))])) if (opts.size < 4) opts.add(c);
    const hrs = Math.floor(add / 60), mins = add % 60, durTxt = (hrs ? `${hrs} hour${hrs > 1 ? 's' : ''}` : '') + (hrs && mins ? ' and ' : '') + (mins ? `${mins} minutes` : '');
    return { key: 'e' + h + m + add, kind: 'choice', answer: ans, prompt: `It is <b>${fmtTime(h, m)}</b> now.<div>${clockSVG(h, m, 170)}</div>What time will it be in <b>${durTxt}</b>?`,
      say: `It is ${fmtTime(h, m)}. What time will it be in ${durTxt}?`, choices: ch(shuffle([...opts])), hint: 'Jump the hours first, then count on the minutes.',
      visual(v) {
        const steps = []; let cur = h * 60 + m;
        if (hrs) { cur += hrs * 60; steps.push(`+${hrs} hour${hrs > 1 ? 's' : ''} → ${wrap(cur)}`); }
        if (mins) { cur += mins; steps.push(`+${mins} minutes → ${wrap(cur)}`); }
        v.innerHTML = `<div class="fr-row"><div class="center">${clockSVG(h, m, 140)}<b>${fmtTime(h, m)}</b></div><div class="op-big">→</div><div class="center">${clockSVG(eh, em, 140)}<b>${ans}</b></div></div><ol class="steps">${steps.map(s => `<li>${s}</li>`).join('')}</ol>`;
      } };
  }
});
