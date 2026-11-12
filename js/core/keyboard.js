'use strict';
/* Keyboard shortcuts */
/* ---------------- keyboard ---------------- */
document.addEventListener('keydown', e => {
  if ($('#overlay').classList.contains('on')) { if (e.key === 'Escape' && modalClosable) closeModal(); return; }
  if (e.target.matches('input, select, textarea')) return;
  const scr = ($('.screen.on') || {}).id;
  if (scr === 'flash') { flashKeys(e); return; }
  if (scr !== 'play' || !S.q || S.ended) return;
  if (!$('#explain').hidden && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); advance(); return; }
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const k = S.q.kind;
  if (k === 'number') { if (/^[0-9]$/.test(e.key)) numKey(e.key); else if (e.key === 'Backspace') numKey('del'); else if (e.key === 'Enter') numKey('ok'); }
  else if (k === 'choice') { const n = +e.key; if (n >= 1 && n <= 9) { const b = $$('#answerArea .choice')[n - 1]; if (b && !b.disabled) b.click(); } }
  else if (k === 'spell') { if (/^[a-z]$/i.test(e.key)) spellKey(e.key.toLowerCase()); else if (e.key === 'Backspace') spellBack(); else if (e.key === 'Enter') spellCheck(); }
  else if (k === 'tiles') { if (e.key === 'Backspace' && S.tl.built.length && !S.locked) { S.tl.built.pop(); tilesDraw(); } else if (e.key === 'Enter') tilesCheck(); }
});
