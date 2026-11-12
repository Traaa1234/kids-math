'use strict';
/* Story passages with tap-to-hear and read-along highlighting */
/* ---------------- story passage ---------------- */
function passageHTML(src) {
  let text = '', html = '';
  src.split('\n').forEach(para => {
    if (!para.trim()) return;
    html += '<p>';
    para.trim().split(/\s+/).forEach(tok => { if (text) text += ' '; const s = text.length; text += tok; html += `<span class="w" data-s="${s}" data-e="${text.length}">${esc(tok)}</span> `; });
    html += '</p>';
  });
  return { html, text };
}
function setPassage(q) {
  const pw = $('#passageWrap');
  if (!q.passage) { pw.hidden = true; pw.dataset.key = ''; return; }
  pw.hidden = false;
  if (pw.dataset.key === q.passageKey) return;
  pw.dataset.key = q.passageKey;
  $('#storyTitle').textContent = q.storyTitle;
  const { html, text } = passageHTML(q.passage);
  $('#passage').innerHTML = html; S.passageText = text;
  $$('#passage .w').forEach(w => w.onclick = () => speak(w.textContent.replace(/[^A-Za-z0-9'’-]/g, '')));
}
$('#readStory').onclick = () => {
  const btn = $('#readStory'), spans = $$('#passage .w');
  if (btn.dataset.on) { hush(); return; }
  btn.dataset.on = '1'; btn.textContent = '⏹ Stop';
  speak(S.passageText, {
    rate: Math.min(P().settings.rate, .9),
    onboundary: e => { const i = e.charIndex; spans.forEach(sp => sp.classList.toggle('hl', +sp.dataset.s <= i && i < +sp.dataset.e)); },
    onend: () => { spans.forEach(sp => sp.classList.remove('hl')); delete btn.dataset.on; btn.textContent = '🔊 Read to me'; }
  });
};
