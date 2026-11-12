'use strict';
/* Activity "fractions" — Fractions: name, pick, compare, equivalent, add */

register('fractions', 'math', {
  icon: '🍕', title: 'Fractions', desc: 'Pizzas, bars and equal parts', color: '#f97316', bg: '#fff1e0',
  gen(lv) {
    const whatFrac = (dens) => {
      const d = pick(dens), n = rnd(1, d - 1), pie = lv === 1 || Math.random() < .5;
      const cand = [[n, d], [d - n, d], [n, d + 1], [Math.min(n + 1, d - 1), d], [n, Math.max(2, d - 1)], [1, d]];
      const seen = new Set(), opts = [];
      for (const [a, b] of cand) { const k = a + '/' + b; if (a > 0 && a < b && !seen.has(k)) { seen.add(k); opts.push(k); } if (opts.length === 4) break; }
      const picture = pie ? pieSVG(n, d, 150) : barSVG(n, d, 300, 56);
      return { key: 'f' + n + d + pie, kind: 'choice', answer: n + '/' + d, answerHTML: fr(n, d), prompt: `What fraction is <b>shaded</b>?<div style="margin-top:8px">${picture}</div>`,
        say: 'What fraction is shaded?', choices: shuffle(opts).map(k => { const [a, b] = k.split('/'); return { label: `<span style="font-size:1.5em">${fr(a, b)}</span>`, val: k }; }),
        hint: 'Count ALL the equal parts (bottom number), then the shaded parts (top number).',
        visual(v) { v.innerHTML = `<div class="fr-row">${pieSVG(n, d, 110)}${barSVG(n, d, 220, 44)}</div><div class="cap">There are <b>${d}</b> equal parts and <b>${n}</b> are shaded, so it is ${fr(n, d)} — ${fracWords(n, d)}.</div>`; } };
    };
    if (lv === 1) return whatFrac([2, 3, 4]);
    if (lv === 2) {
      if (Math.random() < .5) return whatFrac([3, 4, 5, 6, 8]);
      const d = pick([2, 3, 4, 5, 6, 8]), n = rnd(1, d - 1), seen = new Set([n + '/' + d]), opts = [[n, d]];
      while (opts.length < 4) { const b = pick([2, 3, 4, 5, 6, 8]), a = rnd(1, b - 1); if (a * d !== n * b && !seen.has(a + '/' + b)) { seen.add(a + '/' + b); opts.push([a, b]); } }
      return { key: 'p' + n + d, kind: 'choice', answer: n + '/' + d, answerHTML: fr(n, d), prompt: `Which picture shows<span class="big">${fr(n, d)}</span>`, say: `Which picture shows ${fracWords(n, d)}?`,
        choices: shuffle(opts).map(([a, b]) => ({ label: pieSVG(a, b, 104, '#14b8a6'), val: a + '/' + b })), choiceClass: 'pics',
        hint: `Look for ${d} equal parts with ${n} shaded.`,
        visual(v) { v.innerHTML = `<div class="fr-row">${pieSVG(n, d, 110, '#14b8a6')}</div><div class="cap">${fr(n, d)} means the whole is cut into <b>${d}</b> equal parts and <b>${n}</b> of them are shaded.</div>`; } };
    }
    const t = Math.random();
    if (t < .4) {
      const dens = [2, 3, 4, 5, 6, 8, 10, 12];
      let b = pick(dens), a = rnd(1, b - 1), d, c;
      if (Math.random() < .25) { const k = pick([2, 3]); if (b * k <= 12) { d = b * k; c = a * k; } }
      if (!d) { d = pick(dens); c = rnd(1, d - 1); }
      const L = a * d, R = c * b, ans = L > R ? '>' : L < R ? '<' : '=';
      return { key: `c${a}${b}${c}${d}`, kind: 'choice', answer: ans, prompt: `Compare:<span class="big">${fr(a, b)} <span class="qbox">?</span> ${fr(c, d)}</span>`,
        say: `Is ${fracWords(a, b)} greater than, less than, or equal to ${fracWords(c, d)}?`,
        choices: [{ label: '&lt;', val: '<' }, { label: '=', val: '=' }, { label: '&gt;', val: '>' }], cols: 3, choiceClass: 'sym',
        hint: 'Picture both as bars of the same size. Which shaded part is longer?',
        visual(v) { v.innerHTML = `<div class="fr-stack"><div class="lab">${fr(a, b)} ${barSVG(a, b, 300, 40, '#ff7a45')}</div><div class="lab">${fr(c, d)} ${barSVG(c, d, 300, 40, '#5b6cff')}</div></div><div class="cap">${fr(a, b)} ${ans} ${fr(c, d)} — compare the lengths of the shaded parts. 🐊 The open mouth faces the bigger one.</div>`; } };
    }
    if (t < .7) {
      const b = pick([2, 3, 4, 5, 6]), a = rnd(1, b - 1), k = pick([2, 3, 4]), d = b * k;
      return { key: `e${a}${b}${d}`, kind: 'number', answer: a * k, prompt: `Fill in the missing number:<span class="big">${fr(a, b)} = ${fr('?', d)}</span>`, say: `${fracWords(a, b)} equals how many ${ORD[d] ? ORD[d][1] : 'parts of ' + d}?`,
        post: `<span style="font-size:1.4rem">/ ${d}</span>`, hint: `The bottom went from ${b} to ${d} — that's × ${k}. Do the same to the top!`,
        visual(v) { v.innerHTML = `<div class="fr-stack"><div class="lab">${fr(a, b)} ${barSVG(a, b, 300, 40, '#ff7a45')}</div><div class="lab">${fr(a * k, d)} ${barSVG(a * k, d, 300, 40, '#5b6cff')}</div></div><div class="cap">Same amount shaded! ${fr(a, b)} = ${fr(a + ' × ' + k, b + ' × ' + k)} = ${fr(a * k, d)}</div>`; } };
    }
    const d = pick([4, 5, 6, 8, 10, 12]), a = rnd(1, d - 2), c = rnd(1, d - 1 - a);
    return { key: `s${a}${c}${d}`, kind: 'number', answer: a + c, prompt: `Add:<span class="big">${fr(a, d)} + ${fr(c, d)} = ${fr('?', d)}</span>`, say: `${fracWords(a, d)} plus ${fracWords(c, d)}`,
      post: `<span style="font-size:1.4rem">/ ${d}</span>`, hint: 'Same-size parts! Just add the top numbers.',
      visual(v) {
        let s = `<svg width="300" height="46" viewBox="0 0 300 46" style="max-width:100%;height:auto">`; const cw = 296 / d;
        for (let i = 0; i < d; i++) s += `<rect x="${(2 + i * cw).toFixed(1)}" y="2" width="${cw.toFixed(1)}" height="42" rx="3" fill="${i < a ? '#ff7a45' : i < a + c ? '#5b6cff' : '#fff'}" stroke="#4a4e69" stroke-width="2"/>`;
        v.innerHTML = `<div class="center">${s}</svg></div><div class="cap">${a} orange parts + ${c} blue parts = <b>${a + c}</b> parts out of ${d} → ${fr(a + c, d)}</div>`;
      } };
  }
});
