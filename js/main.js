'use strict';
/* Startup — runs last, after every activity has registered */
(function init() {
  const d = $('#deco');
  ['⭐', '✏️', '➕', '📚', '🔤', '🎈', '☁️', '🧩', '🔢', '🌈'].forEach((e, i) => { const s = el('span', null, e); s.style.left = (i * 10 + rnd(0, 6)) + '%'; s.style.animationDuration = rnd(22, 38) + 's'; s.style.animationDelay = -rnd(0, 30) + 's'; d.appendChild(s); });
  $('#whoBtn').onclick = openPlayers; $('#settingsBtn').onclick = openSettings; $('#stickerBtn').onclick = openStickers;
  // Developer check: open index.html?selfcheck to test every activity (see docs/DEVELOPER-GUIDE.md)
  if (/[?&]selfcheck/.test(location.search)) { const s = el('script'); s.src = 'js/dev/self-check.js'; document.body.appendChild(s); return; }
  show('home');
  if (!P()) profileForm(true);
})();
