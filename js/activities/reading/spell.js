'use strict';
/* Activity "spell" — Spelling Bee: hear the word, fill missing letters */

register('spell', 'reading', {
  icon: '🐝', title: 'Spelling Bee', desc: 'Hear the word and fill in the letters', color: '#eab308', bg: '#fff8d6',
  gen(lv) {
    let word, emoji = '';
    if (Math.random() < .5) { const p = pick(PICS.filter(p => picLevel(p, lv))); word = p.w; emoji = p.e; }
    else { word = pick(SW.filter(x => lv === 1 ? x.w.length === 3 : lv === 2 ? x.w.length >= 4 && x.w.length <= 5 : x.w.length >= 6)).w; }
    const nb = lv === 1 ? 1 : lv === 2 ? 2 : Math.max(3, Math.floor(word.length / 2));
    const blanks = shuffle([...Array(word.length).keys()]).slice(0, nb).sort((a, b) => a - b);
    const missing = blanks.map(i => word[i]);
    const bank = [...missing]; const size = lv === 1 ? 4 : lv === 2 ? 6 : 8;
    while (bank.length < size) { const c = pick('abcdefghijklmnoprstuwy'.split('')); if (!missing.includes(c)) bank.push(c); }
    return { key: word, kind: 'spell', word, blanks, bank: shuffle(bank), answer: missing.join(''), answerText: word,
      prompt: `${emoji ? `<span class="emo">${emoji}</span>` : '<span class="emo" style="font-size:3.5rem">🐝</span><br>'}Listen and fill in the missing letter${nb > 1 ? 's' : ''}!`,
      say: word, alwaysSpeak: true, hint: 'Say the word slowly and listen for each sound. Tap 🔊 to hear it again.',
      explain: `It is spelled <b>${word.toUpperCase().split('').join(' - ')}</b>.`, sayAnswer: `${word}. ${word.split('').join(', ')}. ${word}.`,
      after() { speak(word); } };
  }
});
