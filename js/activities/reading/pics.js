'use strict';
/* Activity "pics" — Match pictures and words */

register('pics', 'reading', {
  icon: '🖼️', title: 'Picture Words', desc: 'Match words and pictures', color: '#d946ef', bg: '#fbe9fd',
  gen(lv) {
    const pool = PICS.filter(p => picLevel(p, lv)), t = pick(pool);
    const same = shuffle(pool.filter(x => x.w !== t.w && x.w[0] === t.w[0]));
    const others = [...same, ...shuffle(pool.filter(x => x.w !== t.w && x.w[0] !== t.w[0]))].slice(0, 3);
    if (Math.random() < .6) {
      return { key: 'p' + t.w, kind: 'choice', answer: t.w, prompt: `<span class="emo">${t.e}</span>What is this? Tap the word.`, say: 'What is this? Tap the word.',
        choices: ch(shuffle([t, ...others]).map(x => x.w)), hint: 'Say the picture name slowly. What sound does it start with?', answerText: t.w, after() { speak(t.w); } };
    }
    return { key: 'w' + t.w, kind: 'choice', answer: t.w, prompt: `Read the word, then tap its picture!<span class="big">${t.w}</span>`, say: 'Read the word, then tap the matching picture.',
      choices: shuffle([t, ...others]).map(x => ({ label: x.e, val: x.w })), choiceClass: 'emo', hint: 'Sound out each letter of the word.', answerText: `${t.w} ${t.e}`, after() { speak(t.w); } };
  }
});
