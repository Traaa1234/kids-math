'use strict';
/* Sight Word Cards screen (custom activity) */
const FC = { cat: 'all', list: [...SW], i: 0 };
register('flash', 'reading', {
  icon: '🃏', title: 'Sight Word Cards', desc: '200 must-know words with sounds', color: '#8b5cf6', bg: '#f1eaff', custom: true,
  open() { show('flash'); fcCats(); fcRender(); setTimeout(fcSay, 350); },
  mastery() { return `✅ ${P().learned.length}/${SW.length} learned`; }
});
function fcCats() {
  const counts = { all: SW.length }; SW.forEach(w => counts[w.c] = (counts[w.c] || 0) + 1);
  const pill = (k, label, color) => `<button class="${FC.cat === k ? 'on' : ''}" data-cat="${k}" style="${FC.cat === k ? `background:${color}` : ''}">${label} (${counts[k] || 0})</button>`;
  $('#fcCats').innerHTML = pill('all', 'All', '#7c3aed') + Object.entries(CATS).map(([k, [l, c]]) => pill(k, l, c)).join('');
  $$('#fcCats button').forEach(b => b.onclick = () => { FC.cat = b.dataset.cat; FC.list = FC.cat === 'all' ? [...SW] : SW.filter(w => w.c === FC.cat); FC.i = 0; SFX.click(); fcCats(); fcRender(); fcSay(); });
}
function fcRender() {
  const w = FC.list[FC.i], p = P(); if (!w) return;
  $('#fcNum').textContent = `Word ${FC.i + 1} of ${FC.list.length}`;
  const [lab, col] = CATS[w.c]; $('#fcBadge').textContent = lab; $('#fcBadge').style.background = col;
  $('#fcWord').textContent = w.w; $('#fcRespell').textContent = `say: “${w.r}”`; $('#fcIpa').textContent = w.i;
  const known = p.learned.includes(w.w);
  $('#fcKnow').classList.toggle('known', known); $('#fcKnow').textContent = known ? '✅ Learned!' : '⭐ I know it!';
  $('#fcLearned').textContent = `✅ ${p.learned.length} / ${SW.length} learned`;
}
const fcSay = () => { const w = FC.list[FC.i]; if (w) speak(w.w, { btn: $('#fcSay') }); };
const fcMove = d => { FC.i = (FC.i + d + FC.list.length) % FC.list.length; SFX.flip(); fcRender(); fcSay(); };
$('#fcSay').onclick = fcSay;
$('#fcSpell').onclick = () => { const w = FC.list[FC.i].w; speak(`${w}. ${w.split('').join(', ')}. ${w}.`, { btn: $('#fcSpell'), rate: .8 }); };
$('#fcKnow').onclick = () => {
  const p = P(), w = FC.list[FC.i].w, k = p.learned.indexOf(w);
  if (k >= 0) p.learned.splice(k, 1);
  else { p.learned.push(w); SFX.good(); addXP(2); if (p.learned.length % 10 === 0) { confetti(50); toast(`🌟 ${p.learned.length} words learned!`); } }
  save(); fcRender();
};
$('#fcPrev').onclick = () => fcMove(-1);
$('#fcNext').onclick = () => fcMove(1);
$('#fcShuf').onclick = () => { FC.list = shuffle(FC.list); FC.i = 0; SFX.click(); fcRender(); fcSay(); };
function flashKeys(e) {
  if (e.key === 'ArrowRight') fcMove(1);
  else if (e.key === 'ArrowLeft') fcMove(-1);
  else if (e.key === ' ') { e.preventDefault(); fcSay(); }
}
