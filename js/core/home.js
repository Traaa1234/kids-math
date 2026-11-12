'use strict';
/* Home screen: header, goal, quests, activity tiles */
/* ---------------- home ---------------- */
function renderHome() {
  const p = P(); if (!p) return;
  updateHUD(); ensureMission();
  const ms = p.mission;
  $('#missions').innerHTML = ms.ids.map(id => { const a = ACTS[id], done = ms.done.includes(id);
    return `<button class="mission-item${done ? ' done' : ''}" data-act="${id}"><span style="font-size:1.4rem">${a.icon}</span><span class="t">Play a round of <b>${a.title}</b></span><span class="ck">${done ? '✅' : '▶'}</span></button>`; }).join('');
  const tiles = ids => ids.map(tileHTML).join('');
  // One section per world (see js/worlds.js); tiles come from every registered activity in that world.
  $('#worlds').innerHTML = WORLDS.map(w => { const ids = worldIds(w.id); if (!ids.length) return '';
    return `<div class="world"><div class="world-head"><h2>${w.title}</h2><span class="tag">${w.tag || ''}</span></div><div class="tiles">${tiles(ids)}</div></div>`; }).join('');
  const cnt = p.today.date === todayStr() ? p.today.count : 0;
  const left = p.goal - cnt;
  $('#homeSay').textContent = p.avatar + ' ' + (cnt === 0 ? pick([`Hi ${p.name}! What should we learn today?`, `Welcome back, ${p.name}! Pick a quest to start.`, `Ready for an adventure, ${p.name}?`])
    : left > 0 ? `Only ${left} more right answer${left > 1 ? 's' : ''} to reach today's goal!` : `You did it today, ${p.name}! You're a superstar! ⭐`);
}
function tileHTML(id) {
  const a = ACTS[id], p = P(); const st = p.stats[id]; const played = st && st.rounds > 0;
  const best = p.best[id] || {};
  let mast = '';
  if (a.timed) mast = played ? `🏅 Best: ${Math.max(0, ...Object.values(best))}` : '';
  else if (a.mastery) mast = a.mastery();
  else { const b = Math.max(0, ...Object.values(best)); mast = [0, 1, 2].map(i => `<span class="${i < b ? '' : 'off'}">★</span>`).join(''); }
  const quest = p.mission && p.mission.ids.includes(id) && !p.mission.done.includes(id);
  const flag = quest ? '<span class="flag quest">QUEST</span>' : !played ? '<span class="flag">NEW</span>' : '';
  return `<button class="tile" data-act="${id}" style="--tc:${a.color};--tbg:${a.bg}">${flag}<span class="ic">${a.icon}</span><h4>${a.title}</h4><p>${a.desc}</p><span class="mast">${mast}</span></button>`;
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (t) { openAct(t.dataset.act); return; }
  if (e.target.closest('[data-home]')) goHome();
});
function goHome() { stopRound(); hush(); if (typeof gameStop === 'function') gameStop(); show('home'); }
