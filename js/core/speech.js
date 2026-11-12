'use strict';
/* Read-aloud (browser speech synthesis) */
/* ---------------- speech ---------------- */
let voices = [];
const FEMALE = ['female', 'woman', 'samantha', 'victoria', 'karen', 'susan', 'allison', 'ava', 'zira', 'hazel', 'tessa', 'moira', 'fiona', 'serena', 'kate', 'salli', 'joanna', 'kimberly', 'kendra', 'ivy', 'amy', 'emma', 'jenny', 'aria', 'libby', 'natasha', 'sonia', 'clara', 'olivia', 'grace', 'maisie', 'heather', 'catherine', 'linda', 'michelle', 'sandy', 'ana'];
const MALE = ['male', 'daniel', 'alex', 'fred', 'david', 'mark', 'aaron', 'tom', 'oliver', 'rishi', 'james', 'arthur', 'matthew', 'guy', 'ryan', 'brian', 'george', 'william', 'john', 'paul', 'michael', 'eric', 'christopher', 'roger', 'steffan'];
function voiceGender(v) {
  const n = (v.name || '').toLowerCase().replace(/[^a-z ]/g, ' ');
  const words = n.split(/\s+/);
  if (words.includes('female') || FEMALE.some(h => words.includes(h))) return 'f';
  if (words.includes('male') || MALE.some(h => words.includes(h))) return 'm';
  return '';
}
function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  voices = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang || ''))
    .sort((a, b) => (voiceGender(a) === 'f' ? 0 : 1) - (voiceGender(b) === 'f' ? 0 : 1) || (/natural|online/i.test(b.name) - /natural|online/i.test(a.name)) || a.name.localeCompare(b.name));
}
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
function pickVoice() {
  const p = P();
  return voices.find(v => p && v.voiceURI === p.settings.voice)
    || voices.find(v => voiceGender(v) === 'f' && /en[-_]US/i.test(v.lang))
    || voices.find(v => /en[-_]US/i.test(v.lang)) || voices[0];
}
const stripEmoji = s => String(s).replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}]/gu, '').replace(/\s+/g, ' ').trim();
function speak(text, opt = {}) {
  if (!('speechSynthesis' in window) || !text) { opt.onend && opt.onend(); return; }
  const u = new SpeechSynthesisUtterance(stripEmoji(text));
  const v = pickVoice(); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-US';
  u.rate = opt.rate || (P() ? P().settings.rate : .9); u.pitch = 1.05;
  const btn = opt.btn; if (btn) btn.classList.add('talking');
  u.onend = u.onerror = () => { btn && btn.classList.remove('talking'); opt.onend && opt.onend(); };
  if (opt.onboundary) u.onboundary = opt.onboundary;
  const go = () => speechSynthesis.speak(u);
  if (speechSynthesis.speaking || speechSynthesis.pending) { speechSynthesis.cancel(); setTimeout(go, 90); } else go();
}
function hush() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }
