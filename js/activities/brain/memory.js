'use strict';
/* Memory Match game */
register('memory', 'brain', {
  icon: '🧠', title: 'Memory Match', desc: 'Flip cards and find the pairs', color: '#0ea5e9', bg: '#e0f2fe', custom: true, game: true,
  open(id) { gameShell(id); this.start(); },
  start() {
    gameStop(); G.active = true;
    const lv = G.level; let pairs, cols;
    if (lv === 1) { pairs = shuffle(GAMES.emoji).slice(0, 6).map(e => [{ t: e }, { t: e }]); cols = 4; }
    else if (lv === 2) { pairs = shuffle(PICS.filter(p => p.w.length <= 5)).slice(0, 8).map(p => [{ t: p.e }, { t: p.w, txt: 1, say: p.w }]); cols = 4; }
    else {
      const used = new Set(); pairs = [];
      while (pairs.length < 10) { const a = rnd(2, 9), b = rnd(2, 9), pr = a * b; if (used.has(pr)) continue; used.add(pr); pairs.push([{ t: `${a}×${b}`, txt: 1 }, { t: String(pr), txt: 1 }]); }
      cols = 5;
    }
    G.cards = shuffle(pairs.flatMap((pr, k) => pr.map(c => ({ ...c, k })))); G.open = []; G.moves = 0; G.found = 0; G.n = pairs.length; G.lock = false;
    $('#gBody').innerHTML = `<p class="center muted" style="margin-top:0">${lv === 1 ? 'Find two cards that are the same!' : lv === 2 ? 'Match each picture with its word!' : 'Match each times fact with its answer!'}</p><div class="mem-grid" style="grid-template-columns:repeat(${cols},auto)">${G.cards.map((c, i) => `<button class="mcard" data-i="${i}" aria-label="card"><span class="in"><span class="b">?</span><span class="f${c.txt ? ' txt' : ''}">${esc(c.t)}</span></span></button>`).join('')}</div>`;
    $$('#gBody .mcard').forEach(b => b.onclick = () => memFlip(+b.dataset.i, b));
    memStats(); gameTimer();
  }
});
function memStats() { $('#gStats').innerHTML = `<span class="chip">🔄 Tries: ${G.moves}</span><span class="chip">✅ Pairs: ${G.found} / ${G.n}</span><span class="chip" id="gTime">⏱ 0:00</span>`; }
function memFlip(i, b) {
  if (G.lock || b.classList.contains('up') || b.classList.contains('done')) return;
  SFX.flip(); b.classList.add('up'); G.open.push([i, b]);
  if (G.cards[i].say) speak(G.cards[i].say);
  if (G.open.length < 2) return;
  G.moves++; const [[i1, b1], [i2, b2]] = G.open; G.open = []; const st = statsFor(G.id); st.total++;
  if (G.cards[i1].k === G.cards[i2].k) {
    G.found++; st.correct++;
    setTimeout(() => { b1.classList.add('done'); b2.classList.add('done'); SFX.good(); }, 350);
    addXP(4); countToday(); save();
    if (G.found === G.n) {
      const n = G.n, stars = G.moves <= n + 3 ? 3 : G.moves <= n * 2 ? 2 : 1, time = G.sec;
      G.t = setTimeout(() => { confetti(50); gameFinish(stars, `<span class="chip">🔄 ${G.moves} tries</span><span class="chip">⏱ ${Math.floor(time / 60)}:${pad2(time % 60)}</span>`); }, 900);
    }
  } else {
    G.lock = true;
    G.t = setTimeout(() => { b1.classList.remove('up'); b2.classList.remove('up'); G.lock = false; }, 950);
  }
  memStats();
  const t = $('#gTime'); if (t) t.textContent = `⏱ ${Math.floor(G.sec / 60)}:${pad2(G.sec % 60)}`;
}
