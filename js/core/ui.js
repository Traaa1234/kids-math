'use strict';
/* Screens and dialog box */
/* ---------------- screens & modal ---------------- */
function show(id) {
  $$('.screen').forEach(s => s.classList.toggle('on', s.id === id));
  window.scrollTo(0, 0);
  if (id === 'home') renderHome();
}
let modalClose = null, modalClosable = true;
function openModal(html, { onClose = null, closable = true } = {}) {
  const m = $('#modal');
  m.innerHTML = (closable ? '<button class="iconbtn close-x" data-close aria-label="Close">✕</button>' : '') + html;
  $('#overlay').classList.add('on'); modalClose = onClose; modalClosable = closable;
  $$('[data-close]', m).forEach(b => b.onclick = closeModal);
  return m;
}
function closeModal() { $('#overlay').classList.remove('on'); const f = modalClose; modalClose = null; f && f(); }
$('#overlay').addEventListener('click', e => { if (e.target.id === 'overlay' && modalClosable) closeModal(); });
