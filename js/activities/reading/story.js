'use strict';
/* Activity "story" — Read a story, answer questions (stories live in js/data/stories.js) */

register('story', 'reading', {
  icon: '📖', title: 'Story Time', desc: 'Read (or listen to) a story, then answer', color: '#9333ea', bg: '#f3e8ff',
  makeRound(lv) {
    const p = P(), pool = STORIES.filter(s => s.lv === lv);
    let st = shuffle(pool).find(s => !p.seenStories.includes(s.t));
    if (!st) { p.seenStories = p.seenStories.filter(t => !pool.some(s => s.t === t)); st = pick(pool); }
    p.seenStories.push(st.t); save();
    setTimeout(() => buddy('Read the story first, or tap 🔊 Read to me!'), 50);
    return st.qs.map(([q, opts], i) => ({ key: st.t + i, kind: 'choice', passage: st.text, passageKey: st.t, storyTitle: `${st.e} ${st.t}`,
      prompt: `<div class="wp"><b>Question ${i + 1}:</b> ${esc(q)}</div>`, say: q, answer: 0, answerText: opts[0],
      choices: shuffle(opts.map((o, k) => ({ label: esc(o), val: k }))), choiceClass: 'sm', hint: 'Look back at the story. Tap any word to hear it!' }));
  }
});
