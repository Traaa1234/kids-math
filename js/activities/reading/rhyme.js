'use strict';
/* Activity "rhyme" — Rhyming words */

const RHY1 = [['cat', 'hat', 'bat', 'mat', 'rat', 'sat'], ['dog', 'log', 'frog', 'fog', 'jog'], ['sun', 'run', 'fun', 'bun'], ['cake', 'lake', 'make', 'bake', 'snake'], ['ring', 'king', 'sing', 'wing', 'swing'], ['bee', 'tree', 'see', 'three', 'free'], ['star', 'car', 'jar', 'far'], ['moon', 'spoon', 'soon', 'noon'], ['boat', 'goat', 'coat', 'float'], ['fish', 'dish', 'wish'], ['bed', 'red', 'sled', 'fed'], ['bell', 'shell', 'well', 'smell'], ['sock', 'rock', 'clock', 'block'], ['night', 'light', 'bright', 'right'], ['pig', 'dig', 'big', 'wig'], ['hop', 'top', 'mop', 'stop']];
const RHY3 = [['bear', 'chair', 'hair', 'pear', 'where', 'square'], ['blue', 'shoe', 'two', 'zoo', 'flew', 'through'], ['sky', 'pie', 'eye', 'high', 'fly', 'tie'], ['head', 'bread', 'said', 'red', 'bed'], ['kite', 'night', 'white', 'bite', 'light'], ['snow', 'go', 'toe', 'slow', 'dough'], ['phone', 'bone', 'own', 'grown', 'stone'], ['door', 'floor', 'more', 'four', 'roar'], ['cute', 'boot', 'fruit', 'suit', 'flute']];
register('rhyme', 'reading', {
  icon: '🎵', title: 'Rhyme Time', desc: 'Find words that sound alike at the end', color: '#e11d48', bg: '#ffe8ee',
  gen(lv) {
    const fams = lv === 3 ? RHY3 : RHY1, fi = rnd(0, fams.length - 1), fam = shuffle(fams[fi]);
    const otherWords = shuffle(fams.filter((_, i) => i !== fi).flat());
    if (lv === 2 && Math.random() < .5) {
      const three = fam.slice(0, 3), odd = otherWords[0];
      return { key: 'o' + three.join(), kind: 'choice', answer: odd, prompt: 'Three words rhyme. Tap the one that <b>does NOT</b> rhyme!', say: 'Three words rhyme. Which one does not rhyme? ' + shuffle([...three, odd]).join(', '),
        choices: ch(shuffle([...three, odd])), hint: 'Say each word. Listen to the ending sound.', explain: `${three.join(', ')} all rhyme. <b>${odd}</b> does not.` };
    }
    const target = fam[0], ans = fam[1];
    let others = otherWords;
    if (lv === 2) others = [...otherWords.filter(w => w[0] === target[0]), ...otherWords.filter(w => w[0] !== target[0])];
    return { key: target + ans, kind: 'choice', answer: ans, prompt: `Which word rhymes with<span class="big">${target}</span>`, say: `Which word rhymes with ${target}?`,
      choices: ch(shuffle([ans, ...others.slice(0, 3)])), hint: `Say “${target}” and each word. Which ending sounds the same?`, explain: `<b>${target}</b> and <b>${ans}</b> end with the same sound.`, after() { speak(`${target}, ${ans}`); } };
  }
});
