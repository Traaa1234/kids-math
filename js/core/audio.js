'use strict';
/* Sound effects (Web Audio, no files needed) */
/* ---------------- sound ---------------- */
let actx = null;
function tone(f, type = 'sine', dur = .15, vol = .18, delay = 0) {
  const p = P(); if (p && !p.settings.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    const t = actx.currentTime + delay, o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + dur + .03);
  } catch (e) {}
}
const SFX = {
  good() { tone(523, 'sine', .12); tone(659, 'sine', .12, .18, .09); tone(784, 'sine', .24, .18, .18); },
  bad() { tone(310, 'triangle', .18, .14); tone(240, 'triangle', .26, .12, .15); },
  click() { tone(900, 'sine', .05, .06); },
  flip() { tone(600, 'triangle', .07, .08); },
  level() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 'square', .15, .06, i * .12)); tone(1319, 'sine', .5, .14, .5); },
  sticker() { [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, 'sine', .12, .1, i * .07)); },
  tick() { tone(1250, 'sine', .04, .05); },
  combo() { tone(988, 'sine', .08, .1); tone(1319, 'sine', .14, .1, .07); },
  star(i) { tone(660 + i * 220, 'sine', .25, .15); }
};
