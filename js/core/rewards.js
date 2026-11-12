'use strict';
/* XP, stickers, daily goal, streak, daily quests */
/* ---------------- rewards ---------------- */
function addXP(n) {
  const p = P(); const before = levelInfo(p.xp).lvl; p.xp += n; const after = levelInfo(p.xp).lvl;
  if (after > before) {
    SFX.level(); confetti(90);
    const s = grantSticker();
    toast(`🎊 Level up! You're Level ${after} — ${levelTitle(after)}!${s ? '  New sticker: ' + s : ''}`);
  }
  updateHUD();
}
function grantSticker() {
  const p = P(); const locked = STICKERS.filter(s => !p.stickers.includes(s));
  if (!locked.length) return null;
  const s = pick(locked); p.stickers.push(s); SFX.sticker(); return s;
}
function countToday() {
  const p = P(), d = todayStr();
  if (p.today.date !== d) p.today = { date: d, count: 0 };
  if (p.lastDay !== d) {
    p.streak = p.lastDay === todayStr(-1) ? p.streak + 1 : 1; p.lastDay = d;
    if (p.streak > 1) toast(`🔥 ${p.streak} days in a row! Keep it up!`);
  }
  p.today.count++;
  if (p.today.count === p.goal) { toast('🎯 Daily goal reached! +30 XP'); confetti(60); addXP(30); }
}
function updateHUD() {
  const p = P(); if (!p) return;
  const li = levelInfo(p.xp);
  $('#hudAv').textContent = p.avatar; $('#hudName').textContent = `Hi, ${p.name}!`;
  $('#hudLvl').textContent = `Level ${li.lvl} · ${levelTitle(li.lvl)}`;
  $('#hudXp').style.width = (li.cur / li.need * 100) + '%';
  $('#hudXpTxt').textContent = `${li.cur} / ${li.need} XP`;
  $('#hudStars').textContent = p.stars; $('#hudStk').textContent = `${p.stickers.length}/${STICKERS.length}`;
  const streakAlive = p.lastDay === todayStr() || p.lastDay === todayStr(-1);
  $('#hudStreak').textContent = streakAlive ? p.streak : 0;
  const cnt = p.today.date === todayStr() ? p.today.count : 0;
  const pct = Math.min(100, cnt / p.goal * 100);
  $('#goalRing').style.background = `conic-gradient(var(--good-2) ${pct}%, #eef0f7 0)`;
  $('#goalTxt').textContent = `${Math.min(cnt, p.goal)}/${p.goal}`;
  $('#goalSub').textContent = cnt >= p.goal ? 'Goal done! Every extra answer is bonus XP. 🌟' : `Get ${p.goal} answers right today!`;
}

/* ---------------- missions ---------------- */
function ensureMission() {
  const p = P(), d = todayStr();
  if (p.mission && p.mission.date === d && p.mission.ids.every(id => ACTS[id])) return;
  // Quests: one activity from each of the first two worlds, plus the least-played activity anywhere.
  const quiz = id => !ACTS[id].custom || ACTS[id].game;
  const lists = WORLDS.map(w => worldIds(w.id).filter(quiz)).filter(l => l.length);
  const picks = lists.slice(0, 2).map(pick);
  const rest = shuffle(lists.flat().filter(x => !picks.includes(x))).sort((a, b) => ((p.stats[a] || {}).rounds || 0) - ((p.stats[b] || {}).rounds || 0));
  p.mission = { date: d, ids: [...picks, ...rest].slice(0, 3), done: [], rewarded: false }; save();
}
function missionDone(id) {
  const p = P(); const ms = p.mission;
  if (!ms || ms.date !== todayStr() || !ms.ids.includes(id) || ms.done.includes(id)) return '';
  ms.done.push(id);
  if (ms.done.length === ms.ids.length && !ms.rewarded) {
    ms.rewarded = true; const s = grantSticker(); addXP(50);
    return `<p class="center"><b>🗺️ All daily quests done!</b> +50 XP${s ? ' and a bonus sticker ' + s : ''}</p>`;
  }
  return `<p class="center">🗺️ Daily quest complete! (${ms.done.length}/${ms.ids.length})</p>`;
}
