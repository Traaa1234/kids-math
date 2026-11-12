'use strict';
/* =====================================================================
   TEMPLATE — copy this file to start a new activity.
   1. Copy to js/activities/<world>/<your-id>.js and rename the id below.
   2. Add  <script src="js/activities/<world>/<your-id>.js"></script>  to index.html
      (in the section for that world; tiles appear in script order).
   3. Open index.html?selfcheck to test it, then open index.html to play it.
   This file itself is NOT loaded by the app.
   ===================================================================== */
register('double', 'math', {
  icon: '✌️',                       // emoji shown on the tile
  title: 'Doubles',                 // tile + screen title
  desc: 'Double a number in your head',
  color: '#06b6d4',                 // accent color (buttons, active level)
  bg: '#e0f7fb',                    // tile icon background

  // Called once per question. lv is 1 (Easy), 2 (Medium) or 3 (Hard).
  gen(lv) {
    const n = lv === 1 ? rnd(1, 10) : lv === 2 ? rnd(11, 50) : rnd(51, 500);
    return {
      key: 'd' + n,                 // used to avoid repeats within a round
      kind: 'number',               // 'number' | 'choice' | 'spell' | 'tiles' | 'pick'
      answer: n * 2,
      prompt: `What is double <span class="big">${n}</span>`,   // HTML
      say: `What is double ${n}?`,  // read aloud (optional)
      hint: 'Double means add the number to itself.',          // shown after 1st miss
      // Optional picture: shown by the 🔍 Show me button and after a miss.
      visual(v) { v.innerHTML = (n <= 20 ? tenFrames(n, n, '+') : areaModel(n, 2)); },
      explain: `${n} + ${n} = ${n * 2}`                          // shown after 2nd miss
    };
  }
});
