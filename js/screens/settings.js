'use strict';
/* Players, settings, progress report, sticker book */
function profileForm(first) {
  let av = pick(AVATARS), age = 7;
  openModal(`<h2>${first ? 'Welcome to Brainy Quest! 🌟' : '➕ New player'}</h2>${first ? '<p class="center muted" style="margin-top:0">Math, reading and brain games — all in one place.</p>' : ''}
    <div class="field"><label for="pfName">What's your name?</label><input type="text" id="pfName" maxlength="16" placeholder="Type your name" autocomplete="off"></div>
    <div class="field"><label>How old are you?</label><div class="row" id="pfAge">${[4, 5, 6, 7, 8, 9, 10].map(a => `<button class="pill-btn${a === age ? ' on' : ''}" data-age="${a}">${a}</button>`).join('')}</div></div>
    <div class="field"><label>Pick your buddy</label><div class="avatar-grid" id="pfAv">${AVATARS.map(a => `<button class="${a === av ? 'on' : ''}" data-av="${a}" aria-label="buddy ${a}">${a}</button>`).join('')}</div></div>
    <div class="modal-actions"><button class="btn green" id="pfGo">Let's play! ▶</button></div>`, { closable: !first });
  $$('#pfAge button').forEach(b => b.onclick = () => { age = +b.dataset.age; $$('#pfAge button').forEach(x => x.classList.toggle('on', x === b)); SFX.click(); });
  $$('#pfAv button').forEach(b => b.onclick = () => { av = b.dataset.av; $$('#pfAv button').forEach(x => x.classList.toggle('on', x === b)); SFX.click(); });
  const go = () => { const name = $('#pfName').value.trim() || 'Explorer'; newProfile(name, av, age); closeModal(); show('home'); SFX.level(); confetti(60); toast(`Welcome, ${name}! Let's learn and play! 🎉`); };
  $('#pfGo').onclick = go; $('#pfName').onkeydown = e => { if (e.key === 'Enter') go(); };
  setTimeout(() => $('#pfName').focus(), 100);
}
function openPlayers() {
  const list = Object.values(DB.profiles);
  openModal(`<h2>👥 Who's playing?</h2><div class="players">${list.map(p => `<button class="player${p.id === DB.current ? ' cur' : ''}" data-pid="${p.id}"><span class="av">${p.avatar}</span>${esc(p.name)}<small>Level ${levelInfo(p.xp).lvl} · ⭐ ${p.stars}</small></button>`).join('')}<button class="player" id="newPlayer"><span class="av">➕</span>New player<small>&nbsp;</small></button></div>`, { onClose: renderHome });
  $$('[data-pid]').forEach(b => b.onclick = () => { DB.current = b.dataset.pid; save(); closeModal(); toast(`Hi, ${P().name}! ${P().avatar}`); });
  $('#newPlayer').onclick = () => profileForm(false);
}
function reportHTML() {
  const p = P(), ids = WORLDS.flatMap(w => worldIds(w.id)).filter(id => p.stats[id] && (p.stats[id].total || p.stats[id].rounds));
  const tot = ids.reduce((a, id) => a + (p.stats[id].total || 0), 0), cor = ids.reduce((a, id) => a + (p.stats[id].correct || 0), 0);
  if (!ids.length) return '<p class="muted">No activities played yet.</p>';
  const lvStars = (id, n) => { const b = (p.best[id] || {})[n]; if (b == null) return '–'; return ACTS[id].timed ? '🏅' + b : '★'.repeat(b) + '☆'.repeat(3 - b); };
  return `<p class="muted" style="margin:0 0 8px">Level ${levelInfo(p.xp).lvl} · ${p.xp} XP · ⭐ ${p.stars} · ${tot} answers · ${tot ? Math.round(cor / tot * 100) : 0}% correct · ${p.learned.length} sight words learned · 🔥 streak: ${p.streak} day(s)</p>
    <div style="overflow-x:auto"><table class="report"><tr><th>Activity</th><th>Rounds</th><th>Correct</th><th>🌱</th><th>🌳</th><th>🚀</th></tr>${ids.map(id => { const s = p.stats[id];
      return `<tr><td>${ACTS[id].icon} ${ACTS[id].title}</td><td>${s.rounds}</td><td>${s.total ? Math.round(s.correct / s.total * 100) + '%' : '–'}</td><td>${lvStars(id, 1)}</td><td>${lvStars(id, 2)}</td><td>${lvStars(id, 3)}</td></tr>`; }).join('')}</table></div>`;
}
function openSettings() {
  const p = P();
  const vo = voices.length ? voices.map(v => { const g = voiceGender(v); return `<option value="${esc(v.voiceURI)}"${v === pickVoice() ? ' selected' : ''}>${g === 'f' ? '♀ ' : g === 'm' ? '♂ ' : ''}${esc(v.name)} (${esc(v.lang)})</option>`; }).join('') : '<option value="">Default voice</option>';
  openModal(`<h2>⚙️ Settings</h2>
    <div class="field"><label for="setName">Name</label><input type="text" id="setName" maxlength="16" value="${esc(p.name)}"></div>
    <div class="field"><label>Buddy</label><div class="avatar-grid" id="setAv">${AVATARS.map(a => `<button class="${a === p.avatar ? 'on' : ''}" data-av="${a}">${a}</button>`).join('')}</div></div>
    <div class="toggle-row"><span>🔊 Sound effects</span><button class="switch" role="switch" aria-checked="${p.settings.sound}" data-set="sound" aria-label="Sound effects"></button></div>
    <div class="toggle-row"><span>🗣️ Read questions out loud</span><button class="switch" role="switch" aria-checked="${p.settings.autoRead}" data-set="autoRead" aria-label="Read questions out loud"></button></div>
    <div class="field"><label for="setVoice">Reading voice</label><div class="row"><select id="setVoice" style="flex:1;min-width:0">${vo}</select><button class="pill-btn" id="testVoice">▶ Test</button></div></div>
    <div class="row" style="gap:12px">
      <div class="field" style="flex:1;min-width:140px"><label for="setRate">Reading speed</label><select id="setRate">${[[.75, '🐢 Slow'], [.9, '🙂 Normal'], [1.05, '🐇 Fast']].map(([v, l]) => `<option value="${v}"${p.settings.rate === v ? ' selected' : ''}>${l}</option>`).join('')}</select></div>
      <div class="field" style="flex:1;min-width:140px"><label for="setGoal">Daily goal</label><select id="setGoal">${[10, 15, 20, 30, 40].map(v => `<option value="${v}"${p.goal === v ? ' selected' : ''}>${v} right answers</option>`).join('')}</select></div>
    </div>
    <h3>📊 Progress report (for grown-ups)</h3>${reportHTML()}
    <div class="modal-actions"><button class="btn ghost" id="setPlayers">👥 Switch player</button><button class="btn warn" id="setReset">🗑️ Reset progress</button></div>`, { onClose: renderHome });
  $('#setName').oninput = e => { p.name = e.target.value.trim() || 'Explorer'; save(); };
  $$('#setAv button').forEach(b => b.onclick = () => { p.avatar = b.dataset.av; $$('#setAv button').forEach(x => x.classList.toggle('on', x === b)); save(); SFX.click(); });
  $$('[data-set]').forEach(b => b.onclick = () => { const k = b.dataset.set; p.settings[k] = !p.settings[k]; b.setAttribute('aria-checked', p.settings[k]); save(); SFX.click(); });
  $('#setVoice').onchange = e => { p.settings.voice = e.target.value; save(); speak(`Hi ${p.name}! This is my voice.`); };
  $('#testVoice').onclick = () => speak(`Hi ${p.name}! Let's learn together.`);
  $('#setRate').onchange = e => { p.settings.rate = +e.target.value; save(); speak('This is how fast I will read.'); };
  $('#setGoal').onchange = e => { p.goal = +e.target.value; save(); };
  $('#setPlayers').onclick = openPlayers;
  $('#setReset').onclick = e => {
    const b = e.currentTarget;
    if (!b.dataset.sure) { b.dataset.sure = '1'; b.textContent = `Tap again to erase ${p.name}'s progress`; return; }
    const keep = { id: p.id, name: p.name, avatar: p.avatar, age: p.age, settings: p.settings, defaultLevel: p.defaultLevel };
    DB.profiles[p.id] = fixProfile(keep); save(); closeModal(); toast('Progress reset. A fresh start! 🌱');
  };
}
function openStickers() {
  const p = P();
  openModal(`<h2>📒 Sticker Book</h2><p class="center muted" style="margin-top:0">${p.stickers.length} of ${STICKERS.length} collected</p>
    <div class="sticker-grid">${STICKERS.map(s => p.stickers.includes(s) ? `<div class="stk">${s}</div>` : '<div class="stk locked">?</div>').join('')}</div>
    <h3>How to earn stickers</h3><ul style="margin:0;padding-left:22px;line-height:1.8"><li>Get ⭐⭐ or ⭐⭐⭐ in any round or game</li><li>Level up by earning XP</li><li>Finish all 3 daily quests</li></ul>`);
}
