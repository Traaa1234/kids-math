'use strict';
/* Activity "phonics" — Beginning sounds, short vowels, blends */

const BLENDS = { sheep: 'sh', ship: 'sh', shark: 'sh', shell: 'sh', chick: 'ch', cheese: 'ch', chair: 'ch', thumb: 'th', whale: 'wh', frog: 'fr', star: 'st', tree: 'tr', train: 'tr', snail: 'sn', snake: 'sn', clock: 'cl', plane: 'pl', crab: 'cr', crown: 'cr', drum: 'dr', dragon: 'dr', flag: 'fl', flower: 'fl', grapes: 'gr', bread: 'br', sled: 'sl', swan: 'sw', skunk: 'sk', glove: 'gl', bridge: 'br' };
const BLEND_EMO = { shell: '🐚', chick: '🐤', thumb: '👍', flag: '🚩', sled: '🛷', swan: '🦢', skunk: '🦨', glove: '🧤', bridge: '🌉' };
register('phonics', 'reading', {
  icon: '🔤', title: 'Sound It Out', desc: 'Beginning sounds, vowels and blends', color: '#0891b2', bg: '#e0f6fa',
  gen(lv) {
    const box = '<span class="qbox" style="min-width:1.6em">?</span>';
    if (lv === 1) {
      const t = pick(PICS.filter(p => p.w.length === 3)), first = t.w[0];
      const letters = new Set([first]); while (letters.size < 4) letters.add(pick('bcdfghjklmnprstvwz'.split('')));
      return { key: 'b' + t.w, kind: 'choice', answer: first, prompt: `<span class="emo">${t.e}</span><span class="big">${box}${t.w.slice(1)}</span>`, say: `What sound does ${t.w} start with?`,
        choices: ch(shuffle([...letters])), choiceClass: 'sym', hint: `Say “${t.w}” slowly. Listen to the very first sound.`, answerText: `${first} — ${t.w}`, after() { speak(t.w); } };
    }
    if (lv === 2) {
      const t = pick(PICS.filter(p => p.w.length === 3 && 'aeiou'.includes(p.w[1]) && !'aeiou'.includes(p.w[0]) && !'aeiouy'.includes(p.w[2])));
      return { key: 'v' + t.w, kind: 'choice', answer: t.w[1], prompt: `<span class="emo">${t.e}</span><span class="big">${t.w[0]}${box}${t.w[2]}</span>`, say: `Which vowel is in the middle of ${t.w}?`,
        choices: ch(['a', 'e', 'i', 'o', 'u']), cols: 5, choiceClass: 'sym', hint: 'Vowels: a, e, i, o, u. Stretch the word: ' + t.w.split('').join('-'), answerText: `${t.w[1]} — ${t.w}`, after() { speak(t.w); } };
    }
    const words = Object.keys(BLENDS), w = pick(words), bl = BLENDS[w], emo = BLEND_EMO[w] || (PICS.find(p => p.w === w) || {}).e || '';
    const opts = new Set([bl]); const all = [...new Set(Object.values(BLENDS))]; while (opts.size < 4) opts.add(pick(all));
    return { key: 'bl' + w, kind: 'choice', answer: bl, prompt: `<span class="emo">${emo}</span><span class="big">${box}${w.slice(bl.length)}</span>`, say: `Which sound starts the word ${w}?`,
      choices: ch(shuffle([...opts])), choiceClass: 'sym', hint: 'Two letters work together to make the starting sound.', answerText: `${bl} — ${w}`,
      explain: `<b>${bl}</b> + <b>${w.slice(bl.length)}</b> = <b>${w}</b>`, after() { speak(w); } };
  }
});
