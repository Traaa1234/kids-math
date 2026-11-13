'use strict';
/* Quiz engine: rounds, scoring, hints, explanations, results */
/* =====================================================================
   QUIZ ENGINE
   ===================================================================== */
const S = {};
const LEVELS = [{ n: 1, label: '🌱 Easy' }, { n: 2, label: '🌳 Medium' }, { n: 3, label: '🚀 Hard' }];
const PRAISE = ['Great job! 🎉', 'Awesome! 🌟', 'You got it! ✨', 'Super! 🚀', 'Brilliant! 💡', 'Way to go! 🙌', 'Fantastic! 🎈', 'Nailed it! 🎯', 'Wow! 🤩', 'Correct! ✅'];
const ENCOURAGE = ['Almost! Try again. 💪', 'Hmm, look again 👀', 'You can do it!', 'Take your time. 🐢', 'Check the picture! 🔍', 'So close!'];

function statsFor(id) { const p = P(); return p.stats[id] || (p.stats[id] = { rounds: 0, correct: 0, total: 0 }); }
function levelFor(id) { const p = P(); return p.lastLevel[id] || p.defaultLevel || 1; }

function openAct(id) {
  const a = ACTS[id]; if (!a) return;
  SFX.click(); hush();
  document.documentElement.style.setProperty('--ac', a.color);
  if (a.custom) { const st = statsFor(id); if (!a.game) { st.rounds++; save(); } a.open(id); return; }
  stopRound();
  S.id = id; S.act = a; S.level = levelFor(id);
  $('#actIcon').textContent = a.icon; $('#actName').textContent = a.title;
  $('#buddyFace').textContent = P().avatar;
  renderLevels(); show('play'); startRound();
}
function renderLevels() {
  $('#levels').innerHTML = LEVELS.map(l => `<button class="${l.n === S.level ? 'on' : ''}" data-lv="${l.n}" aria-pressed="${l.n === S.level}">${l.label}</button>`).join('');
  $$('#levels button').forEach(b => b.onclick = () => { const n = +b.dataset.lv; if (n === S.level) return; S.level = n; P().lastLevel[S.id] = n; save(); renderLevels(); SFX.click(); startRound(); });
}
function startRound() {
  stopRound();
  const a = S.act;
  Object.assign(S, { qi: 0, results: [], combo: 0, recent: new Set(), score: 0, locked: false, ended: false, q: null });
  S.round = a.makeRound ? a.makeRound(S.level) : null;
  S.len = a.timed ? Infinity : (S.round ? S.round.length : (a.len || 10));
  $('#dots').hidden = !!a.timed; $('#timer').hidden = !a.timed;
  $('#passageWrap').hidden = true; $('#passageWrap').dataset.key = '';
  if (a.timed) { S.timeLeft = a.timed; updTimer(); S.timerT = setInterval(tickTimer, 1000); }
  buddy(a.timed ? 'Go go go! ⚡' : pick(["Let's go! 🚀", 'You can do it!', 'Ready? Here we go!', 'I believe in you! 💛']));
  updCombo(); nextQ();
}
function stopRound() { clearInterval(S.timerT); clearTimeout(S.nextT); S.timerT = null; S.nextT = null; }
function tickTimer() {
  if (S.ended) return;
  S.timeLeft--; updTimer();
  if (S.timeLeft <= 5 && S.timeLeft > 0) SFX.tick();
  if (S.timeLeft <= 0) endRound();
}
function updTimer() { $('#timer i').style.width = (Math.max(0, S.timeLeft) / S.act.timed * 100) + '%'; updCombo(); }
function updCombo() {
  const c = $('#combo');
  if (S.act && S.act.timed) c.textContent = `⏱ ${Math.max(0, S.timeLeft)}s · ✅ ${S.score}`;
  else c.textContent = S.combo >= 2 ? `🔥 ×${S.combo}` : '';
  if (S.combo >= 2) { c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); }
}
function renderDots() {
  if (S.act.timed) return;
  let h = '';
  for (let i = 0; i < S.len; i++) h += `<span class="dot ${S.results[i] || (i === S.qi ? 'cur' : '')}"></span>`;
  $('#dots').innerHTML = h;
}
function buddy(msg, mood) {
  $('#buddySay').textContent = msg;
  const f = $('#buddyFace'); f.className = 'face'; void f.offsetWidth; if (mood) f.classList.add(mood);
}
function setFB(t, cls) { const f = $('#feedback'); f.textContent = t; f.className = 'feedback ' + (cls || ''); }

function nextQ() {
  if (S.ended) return;
  if (S.qi >= S.len) return endRound();
  let q;
  if (S.round) q = S.round[S.qi];
  else {
    for (let k = 0; k < 20; k++) { q = S.act.gen(S.level); const key = q.key || q.say || q.prompt; if (!S.recent.has(key)) { S.recent.add(key); break; } }
  }
  Object.assign(S, { q, tries: 0, locked: false, input: '', onWrong: null, onRight: null, reveal: null });
  renderQ(); renderDots();
}
function renderQ() {
  const q = S.q;
  setPassage(q);
  $('#qPrompt').innerHTML = q.prompt;
  $('#sayBtn').hidden = !q.say;
  const v = $('#qVisual'); v.innerHTML = ''; v.hidden = true;
  $('#btnShow').hidden = !q.visual; $('#btnShow').textContent = q.showLabel || '🔍 Show me';
  $('#tools').hidden = !q.visual;
  setFB('');
  $('#explain').hidden = true; $('#explain').innerHTML = '';
  const area = $('#answerArea'); area.innerHTML = ''; area.hidden = false;
  ANSWER_TYPES[q.kind](q, area);
  if (q.visualOpen) showVisual();
  const p = P();
  if (q.say && !S.act.timed && (p.settings.autoRead || q.alwaysSpeak)) setTimeout(() => { if (S.q === q) speak(q.say, { btn: $('#sayBtn') }); }, 250);
}
$('#sayBtn').onclick = () => S.q && speak(S.q.say, { btn: $('#sayBtn') });
$('#btnShow').onclick = () => { const v = $('#qVisual'); if (v.hidden) { showVisual(); SFX.click(); } else { v.hidden = true; $('#btnShow').textContent = S.q.showLabel || '🔍 Show me'; } };
function showVisual() {
  const v = $('#qVisual'); if (!S.q.visual) return;
  v.innerHTML = ''; S.q.visual(v); v.hidden = false; $('#btnShow').textContent = '🙈 Hide';
}

function submit(val, target) {
  if (S.locked || S.ended) return;
  const q = S.q, p = P(), st = statsFor(S.id);
  const ok = q.check ? q.check(val) : String(val).trim().toLowerCase() === String(q.answer).trim().toLowerCase();
  const card = $('#card');
  if (ok) {
    S.locked = true; const first = S.tries === 0;
    S.results.push(first ? 'good' : 'ok'); S.combo = first ? S.combo + 1 : 0;
    S.score++; st.correct++; st.total++;
    target && target.classList.add('right'); S.onRight && S.onRight();
    card.classList.remove('flash-good', 'shake'); void card.offsetWidth; card.classList.add('flash-good');
    SFX.good(); if (S.combo >= 3 && S.combo % 3 === 0) setTimeout(SFX.combo, 300);
    const gain = first ? 10 + Math.min(10, Math.max(0, S.combo - 2) * 2) : 5;
    if (first) p.stars++;
    const r = (target || card).getBoundingClientRect(); floaty(`+${gain} XP`, r.left + r.width / 2, Math.max(60, r.top));
    if (!S.act.timed && S.combo >= 3) confetti(14);
    setFB(pick(PRAISE), 'good');
    buddy(S.combo >= 3 ? `🔥 ${S.combo} in a row! Amazing!` : pick(PRAISE), 'happy');
    addXP(gain); countToday(); save(); updCombo(); renderDots();
    if (q.after && !S.act.timed) q.after();
    S.nextT = setTimeout(advance, S.act.timed ? 350 : (q.after ? 1700 : 1250));
  } else {
    S.tries++; S.combo = 0; updCombo(); SFX.bad();
    if (target) { target.classList.remove('wrong'); void target.offsetWidth; target.classList.add('wrong'); }
    card.classList.remove('shake', 'flash-good'); void card.offsetWidth; card.classList.add('shake');
    if (S.act.timed) {
      S.locked = true; st.total++; S.results.push('miss'); save();
      setFB(`Oops! ${q.answerText || q.answer}`, 'bad'); S.reveal && S.reveal();
      S.nextT = setTimeout(advance, 900); return;
    }
    S.onWrong && S.onWrong(target);
    if (S.tries === 1) {
      setFB('Not quite — try again! ' + (q.hint ? '💡 ' + q.hint : ''), 'bad');
      buddy(pick(ENCOURAGE), 'sad');
      if (q.visual && $('#qVisual').hidden && !q.noAutoVisual) showVisual();
    } else {
      S.locked = true; S.results.push('miss'); st.total++; save(); renderDots(); showExplain();
    }
  }
}
function showExplain() {
  const q = S.q, ex = $('#explain');
  setFB('');
  buddy("That's OK! Now we know how. 💛", 'sad');
  if (q.visual && $('#qVisual').hidden) showVisual();
  S.reveal && S.reveal();
  const exp = typeof q.explain === 'function' ? q.explain() : (q.explain || '');
  ex.innerHTML = `<h4>💡 The answer is: <span style="color:var(--good)">${q.answerHTML || esc(q.answerText != null ? q.answerText : q.answer)}</span></h4>${exp ? `<div>${exp}</div>` : ''}<div class="center" style="margin-top:12px"><button class="btn green" id="exNext">Got it! Next ▶</button></div>`;
  ex.hidden = false;
  $('#exNext').onclick = advance;
  setTimeout(() => ex.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'nearest' }), 50);
  if (q.sayAnswer) speak(q.sayAnswer);
}
function advance() { if (S.ended) return; clearTimeout(S.nextT); S.qi++; nextQ(); }

function endRound() {
  if (S.ended) return; S.ended = true; stopRound();
  const a = S.act, p = P(), id = S.id, lv = S.level, st = statsFor(id);
  st.rounds++; p.best[id] = p.best[id] || {};
  let stars, head, line;
  if (a.timed) {
    const prev = p.best[id][lv] || 0, isBest = S.score > prev;
    if (isBest) p.best[id][lv] = S.score;
    const g = a.goals; stars = S.score >= g[2] ? 3 : S.score >= g[1] ? 2 : S.score >= g[0] ? 1 : 0;
    line = `<span class="chip">⚡ ${S.score} correct in ${a.timed} s</span><span class="chip">🏅 Best: ${Math.max(prev, S.score)}</span>${isBest && S.score > 0 ? '<span class="chip" style="background:#fff3c4">🎉 New record!</span>' : ''}`;
  } else {
    const good = S.results.filter(r => r === 'good').length, okc = S.results.filter(r => r === 'ok').length;
    const ratio = (good + okc * .5) / S.len;
    stars = ratio >= .9 ? 3 : ratio >= .7 ? 2 : ratio >= .4 ? 1 : 0;
    p.best[id][lv] = Math.max(p.best[id][lv] || 0, stars);
    line = `<span class="chip">✅ ${good + okc} / ${S.len} right</span><span class="chip">🎯 ${good} on the first try</span>`;
  }
  head = ['💪 Good practice!', '👍 Nice work!', '🎉 Great job!', '🏆 Amazing!'][stars];
  finishRound({ stars, head, line, id, lv, again: startRound, canUp: stars === 3 && lv < 3, up: () => { S.level = lv + 1; P().lastLevel[id] = S.level; save(); renderLevels(); startRound(); } });
}
/* shared result screen (quiz rounds + brain games) */
function finishRound({ stars, head, line, id, lv, again, canUp, up }) {
  const p = P();
  const bonus = stars * 10; if (bonus) addXP(bonus);
  const sticker = stars >= 2 ? grantSticker() : null;
  const mission = stars >= 1 ? missionDone(id) : '';
  save();
  const m = openModal(`<h2>${head}</h2><div class="bigstars"><span>⭐</span><span>⭐</span><span>⭐</span></div>
    <div class="result-stats">${line}${bonus ? `<span class="chip">✨ +${bonus} bonus XP</span>` : ''}</div>
    ${sticker ? `<div class="center"><p style="margin:6px 0">You earned a new sticker!</p><div class="stk newly" style="width:88px;height:88px;margin:0 auto;font-size:54px">${sticker}</div></div>` : stars < 2 ? '<p class="center muted">Get 2 or 3 stars to win a sticker!</p>' : '<p class="center muted">Your sticker book is full — wow!</p>'}
    ${mission}
    <div class="modal-actions"><button class="btn ghost" id="rHome">🏠 Home</button><button class="btn" id="rAgain">🔁 Play again</button>${canUp ? '<button class="btn green" id="rUp">🚀 Try a harder level</button>' : ''}</div>`, { closable: false });
  $$('.bigstars span', m).forEach((s, i) => { if (i < stars) setTimeout(() => { s.classList.add('on'); SFX.star(i); }, 350 + i * 380); });
  if (stars >= 2) setTimeout(() => confetti(70), 400);
  buddy(stars >= 2 ? 'You are amazing! 🏆' : 'Practice makes progress! 🌱', stars >= 2 ? 'happy' : null);
  $('#rHome').onclick = () => { closeModal(); goHome(); };
  $('#rAgain').onclick = () => { closeModal(); again(); };
  if (canUp) $('#rUp').onclick = () => { closeModal(); up(); };
}
