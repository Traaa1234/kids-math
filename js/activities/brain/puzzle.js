'use strict';
/* Picture Puzzle game (uses GAMES.puzzleScenes) */
register('puzzle', 'brain', {
  icon: '🧩', title: 'Picture Puzzle', desc: 'Swap the pieces to fix the picture', color: '#f43f5e', bg: '#ffe7ec', custom: true, game: true,
  open(id) { gameShell(id); this.start(); },
  start() {
    gameStop(); G.active = true;
    const [cols, rows] = [[3, 2], [3, 3], [4, 3]][G.level - 1], n = cols * rows;
    const scenes = GAMES.puzzleScenes;
    if (G.scene == null || G.scene >= scenes.length) G.scene = rnd(0, scenes.length - 1);
    const sc = scenes[G.scene], w = 600 / cols, h = 400 / rows;
    let order, g = 0; do { order = shuffle([...Array(n).keys()]); g++; } while (g < 50 && order.filter((v, i) => v === i).length > n / 3);
    Object.assign(G, { cols, rows, n, order, sel: -1, moves: 0, w, h, sc });
    $('#gBody').innerHTML = `<div class="center" style="margin-bottom:10px"><div class="row" style="justify-content:center">${scenes.map((s, i) => `<button class="pill-btn" data-sc="${i}" style="${i === G.scene ? 'background:var(--ac);color:#fff' : ''}">${esc(s.label)}</button>`).join('')}</div></div>
      <p class="center muted" style="margin:6px 0 10px">Tap one piece, then tap another to swap them. Green outline = right spot!</p>
      <div class="pz-board" id="pzBoard" style="grid-template-columns:repeat(${cols},1fr)"></div>
      <div class="center" style="margin-top:12px"><button class="pill-btn" id="pzPeek">👀 Peek at the picture</button></div><div id="pzPeekBox" hidden style="margin-top:10px"><div class="pz-peek"><svg viewBox="0 0 600 400">${sc.svg}</svg></div></div>`;
    $$('[data-sc]').forEach(b => b.onclick = () => { G.scene = +b.dataset.sc; SFX.click(); ACTS.puzzle.start(); });
    $('#pzPeek').onclick = () => { const bx = $('#pzPeekBox'); bx.hidden = !bx.hidden; };
    pzDraw(); pzStats(); gameTimer();
  }
});
function pzStats() { $('#gStats').innerHTML = `<span class="chip">🔄 Swaps: ${G.moves}</span><span class="chip">✅ In place: ${G.order.filter((v, i) => v === i).length} / ${G.n}</span><span class="chip" id="gTime">⏱ ${Math.floor((G.sec || 0) / 60)}:${pad2((G.sec || 0) % 60)}</span>`; }
function pzDraw() {
  const { cols, w, h, sc } = G;
  $('#pzBoard').innerHTML = G.order.map((piece, slot) => { const c = piece % cols, r = Math.floor(piece / cols);
    return `<button class="pz-tile${piece === slot ? ' ok' : ''}${G.sel === slot ? ' sel' : ''}" data-s="${slot}" aria-label="puzzle piece"><svg viewBox="${c * w} ${r * h} ${w} ${h}" preserveAspectRatio="none">${sc.svg}</svg></button>`; }).join('');
  $$('#pzBoard .pz-tile').forEach(b => b.onclick = () => pzTap(+b.dataset.s));
}
function pzTap(s) {
  if (!G.active) return;
  if (G.sel < 0) { G.sel = s; SFX.click(); pzDraw(); return; }
  if (G.sel === s) { G.sel = -1; pzDraw(); return; }
  const a = G.sel; [G.order[a], G.order[s]] = [G.order[s], G.order[a]]; G.sel = -1; G.moves++; SFX.flip();
  const st = statsFor(G.id); st.total++;
  if (G.order[s] === s || G.order[a] === a) { st.correct++; SFX.good(); addXP(3); countToday(); save(); }
  pzDraw(); pzStats();
  if (G.order.every((v, i) => v === i)) {
    G.active = false; $('#pzBoard').classList.add('pz-done'); confetti(70); SFX.level();
    const stars = G.moves <= G.n ? 3 : G.moves <= G.n * 2 ? 2 : 1, time = G.sec;
    G.t = setTimeout(() => gameFinish(stars, `<span class="chip">🔄 ${G.moves} swaps</span><span class="chip">⏱ ${Math.floor(time / 60)}:${pad2(time % 60)}</span>`), 1200);
  }
}
