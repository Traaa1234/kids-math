'use strict';
/* Confetti, floating XP, toasts */
/* ---------------- effects ---------------- */
function confetti(n = 40) {
  if (REDUCED) return;
  const colors = ['#ff7a45', '#ffc83d', '#22c55e', '#5b6cff', '#ec4899', '#14b8a6', '#a78bfa'];
  for (let i = 0; i < n; i++) {
    const c = el('div', 'confetti');
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = 1.3 + Math.random() * 1.4 + 's';
    c.style.animationDelay = Math.random() * .3 + 's';
    document.body.appendChild(c); setTimeout(() => c.remove(), 3200);
  }
}
function floaty(text, x, y) { const f = el('div', 'floaty', esc(text)); f.style.left = x + 'px'; f.style.top = y + 'px'; document.body.appendChild(f); setTimeout(() => f.remove(), 1200); }
const tq = []; let tBusy = false;
function toast(msg) { tq.push(msg); if (!tBusy) nextToast(); }
function nextToast() {
  const m = tq.shift(); const t = $('#toast');
  if (!m) { tBusy = false; return; }
  tBusy = true; t.textContent = m; t.classList.add('on');
  setTimeout(() => { t.classList.remove('on'); setTimeout(nextToast, 380); }, 2500);
}
