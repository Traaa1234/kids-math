'use strict';
/* Shared shell for custom brain games (levels bar, timer, finish) */
const G = {};
function gameStop() { clearTimeout(G.t); clearInterval(G.clock); G.active = false; }
function gameShell(id) {
  const a = ACTS[id]; G.id = id; G.level = levelFor(id);
  $('#gTitle').innerHTML = `${a.icon} ${a.title}`; renderGameLevels(); show('game');
}
function renderGameLevels() {
  $('#gLevels').innerHTML = LEVELS.map(l => `<button class="${l.n === G.level ? 'on' : ''}" data-lv="${l.n}">${l.label}</button>`).join('');
  $$('#gLevels button').forEach(b => b.onclick = () => { const n = +b.dataset.lv; if (n === G.level) return; G.level = n; P().lastLevel[G.id] = n; save(); SFX.click(); renderGameLevels(); ACTS[G.id].start(); });
}
function gameFinish(stars, line) {
  gameStop();
  const id = G.id, lv = G.level, p = P(), st = statsFor(id);
  st.rounds++; p.best[id] = p.best[id] || {}; p.best[id][lv] = Math.max(p.best[id][lv] || 0, stars);
  finishRound({ stars, head: ['💪 Good practice!', '👍 Nice work!', '🎉 Great job!', '🏆 Amazing!'][stars], line, id, lv, again: () => ACTS[id].start(),
    canUp: stars === 3 && lv < 3, up: () => { G.level = lv + 1; P().lastLevel[id] = G.level; save(); renderGameLevels(); ACTS[id].start(); } });
}
function gameTimer() { G.sec = 0; clearInterval(G.clock); G.clock = setInterval(() => { G.sec++; const t = $('#gTime'); if (t) t.textContent = `⏱ ${Math.floor(G.sec / 60)}:${pad2(G.sec % 60)}`; }, 1000); }
