'use strict';
/* =====================================================================
   SELF-CHECK — open index.html?selfcheck
   Generates hundreds of questions for every quiz activity and level and
   checks that each one is valid: exactly one right choice, whole-number
   answers, spelling/tiles match, pictures render without errors.
   Uses a temporary player and never touches saved progress.
   ===================================================================== */
(function selfCheck() {
  save = () => {};                                   // never write to real storage
  DB = { current: 'selfcheck', profiles: { selfcheck: fixProfile({ id: 'selfcheck', name: 'Checker', avatar: '🤖', age: 7 }) } };
  const PER_LEVEL = 300, errs = [], counts = {};
  const fail = (id, lv, msg, q) => errs.push(`${id} · level ${lv} · ${msg}${q && q.key ? ` · key=${String(q.key).slice(0, 60)}` : ''}`);
  const t0 = performance.now();
  for (const id of Object.keys(ACTS)) {
    const a = ACTS[id]; if (a.custom) continue;
    counts[id] = 0;
    for (const lv of [1, 2, 3]) {
      for (let k = 0; k < (a.makeRound ? 15 : PER_LEVEL); k++) {
        let qs;
        try { qs = a.makeRound ? a.makeRound(lv) : [a.gen(lv)]; } catch (e) { fail(id, lv, 'crashed: ' + e.message); break; }
        for (const q of qs) {
          counts[id]++;
          try {
            if (!ANSWER_TYPES[q.kind]) fail(id, lv, 'unknown kind ' + q.kind, q);
            if (q.kind === 'abacus' && (!Number.isInteger(q.answer) || String(q.answer).length > q.rods)) fail(id, lv, 'abacus answer does not fit the rods', q);
            if (q.kind === 'choice') {
              const vals = q.choices.map(c => String(c.val));
              if (new Set(vals).size !== vals.length) fail(id, lv, 'duplicate choices ' + vals, q);
              const right = q.choices.filter(c => q.check ? q.check(c.val) : String(c.val) === String(q.answer)).length;
              if (right !== 1) fail(id, lv, `${right} correct choices (should be 1)`, q);
            } else if (q.kind === 'number') {
              if (!Number.isInteger(q.answer) || q.answer < 0) fail(id, lv, 'answer is not a whole number: ' + q.answer, q);
            } else if (q.kind === 'spell') {
              if (q.blanks.map(i => q.word[i]).join('') !== q.answer) fail(id, lv, 'spelling answer mismatch', q);
              if (!q.blanks.every(i => q.bank.includes(q.word[i]))) fail(id, lv, 'letter bank is missing a letter', q);
            } else if (q.kind === 'tiles') {
              if ([...q.tiles].sort().join() !== q.answer.split(' ').sort().join()) fail(id, lv, 'tiles do not match answer', q);
            } else if (q.kind === 'pick') {
              const d = el('div', null, q.prompt), idx = $$('.pw', d).map(b => +b.dataset.i);
              if (!idx.some(i => q.check(i))) fail(id, lv, 'no correct word to pick', q);
            }
            if (/undefined|NaN/.test(q.prompt)) fail(id, lv, 'prompt contains undefined/NaN', q);
            if (q.visual) { const v = el('div'); q.visual(v); if (/undefined|NaN/.test(v.innerHTML)) fail(id, lv, 'picture contains undefined/NaN', q); }
            if (typeof q.explain === 'function') q.explain();
          } catch (e) { fail(id, lv, 'error: ' + e.message, q); }
        }
      }
    }
  }
  // Activities (or tools) can add their own deeper tests with selfTest() → array of problem messages.
  for (const id of Object.keys(ACTS)) {
    if (typeof ACTS[id].selfTest !== 'function') continue;
    try { const r = ACTS[id].selfTest(); counts[id] = (counts[id] || 0) + r.checked; r.errors.forEach(m => fail(id, '-', m)); } catch (e) { fail(id, '-', 'selfTest crashed: ' + e.message); }
  }
  const total = Object.values(counts).reduce((s, n) => s + n, 0), ms = Math.round(performance.now() - t0);
  const unique = [...new Set(errs)];
  window.SELF_CHECK = { total, errors: unique, counts };
  document.title = (unique.length ? '❌ ' : '✅ ') + 'Self-check';
  openModal(`<h2>${unique.length ? '❌ Problems found' : '✅ All activities passed'}</h2>
    <p class="center muted">${total.toLocaleString()} questions checked in ${ms} ms across ${Object.keys(counts).length} quiz activities and 3 levels.</p>
    ${unique.length ? `<ol class="steps">${unique.slice(0, 40).map(e => `<li>${esc(e)}</li>`).join('')}</ol>` : ''}
    <table class="report"><tr><th>Activity</th><th>Questions</th></tr>${Object.entries(counts).map(([id, n]) => `<tr><td>${ACTS[id].icon} ${ACTS[id].title} <span class="muted">(${id})</span></td><td>${n}</td></tr>`).join('')}</table>
    <div class="modal-actions"><button class="btn" onclick="location.href=location.pathname">Open the app</button></div>`, { closable: false });
  console.log('SELF-CHECK', window.SELF_CHECK);
})();
