'use strict';
/* Activity "sentence" — Put scrambled words in order */

const SENTS = {
  1: ['I see a cat.', 'The dog can run.', 'We like to play.', 'My hat is red.', 'Look at the sun.', 'I can jump high.', 'The fish is big.', 'She has a ball.', 'Go to bed now.', 'We read a book.', 'The bird can fly.', 'I love my mom.'],
  2: ['The happy dog ran to the park.', 'My sister likes to paint pictures.', 'We ate pizza for lunch today.', 'The little bird sang a song.', 'Please close the door behind you.', 'Tom found a shiny rock outside.', 'The moon is bright tonight.', 'I brush my teeth every morning.', 'Our cat sleeps on the soft rug.', 'Can you help me find my shoe?'],
  3: ['After school, we walked to the library together.', 'The brave firefighter climbed the tall ladder quickly.', 'My grandmother tells the best stories at bedtime.', 'When it rains, the garden grows very fast.', 'Our class planted twelve seeds in small pots.', 'The curious kitten chased a butterfly across the yard.', 'Before dinner, Dad and I baked fresh bread.', 'The giant whale swam slowly through the deep ocean.']
};
register('sentence', 'reading', {
  icon: '🧱', title: 'Sentence Builder', desc: 'Put the words in the right order', color: '#2563eb', bg: '#e5edff',
  gen(lv) {
    const s = pick(SENTS[lv]), words = s.split(' ');
    let tiles = shuffle(words), g = 0; while (tiles.join(' ') === s && g++ < 10) tiles = shuffle(words);
    return { key: s, kind: 'tiles', tiles, answer: s, answerText: s, prompt: '🧩 Put the words in order to make a sentence!', say: 'Put the words in order to make a sentence.',
      hint: 'The first word starts with a capital letter. The last word has the end mark.', after() { speak(s); } };
  }
});
