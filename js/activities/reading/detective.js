'use strict';
/* Activity "detective" — Find nouns, verbs, adjectives, adverbs, pronouns */

const POS = { n: ['noun', 'a person, place, or thing', '#3b82f6'], v: ['verb', 'an action word', '#10b981'], a: ['adjective', 'a describing word', '#ec4899'], d: ['adverb', 'tells how something happens', '#65a30d'], p: ['pronoun', 'a word like I, he, she, we or they', '#f43f5e'] };
const DET = {
  1: ['The cat/n naps/v.', 'A bird/n sings/v.', 'The boy/n kicks/v the ball/n.', 'My mom/n bakes/v bread/n.', 'The frog/n jumps/v.', 'Dogs/n bark/v at night/n.', 'The baby/n smiles/v.', 'Fish/n swim/v in the pond/n.', 'The girl/n reads/v a book/n.', 'Ducks/n quack/v.'],
  2: ['The tall/a girl/n climbs/v the tree/n.', 'A fluffy/a cat/n sleeps/v on the soft/a bed/n.', 'The hungry/a bear/n eats/v sweet/a honey/n.', 'Red/a apples/n grow/v on trees/n.', 'My little/a brother/n plays/v with blocks/n.', 'The cold/a wind/n blows/v.', 'The brown/a ducks/n swim/v in the blue/a lake/n.', 'A noisy/a truck/n drives/v by.'],
  3: ['She/p quickly/d opened/v the heavy/a door/n.', 'They/p sang/v loudly/d at the happy/a party/n.', 'He/p carefully/d painted/v a bright/a rainbow/n.', 'The old/a turtle/n walked/v slowly/d to the river/n.', 'We/p eagerly/d watched/v the noisy/a parade/n.', 'The clever/a fox/n silently/d crept/v past the hens/n.', 'I/p gently/d hugged/v my tiny/a kitten/n.', 'The proud/a team/n cheered/v wildly/d.']
};
register('detective', 'reading', {
  icon: '🕵️', title: 'Word Detective', desc: 'Find nouns, verbs and describing words', color: '#475569', bg: '#e8edf3',
  gen(lv) {
    const s = pick(DET[lv]);
    const toks = s.split(' ').map(t => { const m = t.match(/^([A-Za-z']+)(?:\/([nvadp]))?([.,!?]*)$/); return { w: m[1], tag: m[2] || '', p: m[3] }; });
    const allowed = lv === 1 ? 'nv' : lv === 2 ? 'nva' : 'nvadp';
    const present = [...new Set(toks.map(t => t.tag).filter(t => t && allowed.includes(t)))];
    const type = pick(present), [name, def, color] = POS[type];
    const correct = toks.map((t, i) => t.tag === type ? i : -1).filter(i => i >= 0);
    const sent = toks.map((t, i) => `<button class="pw" data-i="${i}">${esc(t.w)}</button>${t.p}`).join(' ');
    const plain = toks.map(t => t.w + t.p).join(' ');
    return { key: s + type, kind: 'pick', prompt: `Tap ${correct.length > 1 ? 'a' : 'the'} <b style="color:${color}">${name.toUpperCase()}</b> <small class="muted">(${def})</small><div class="sent">${sent}</div>`,
      say: `Find ${correct.length > 1 ? 'a' : 'the'} ${name}. ${plain}`, check: i => correct.includes(i), answerText: correct.map(i => toks[i].w).join(', '),
      hint: { n: 'Who or what is the sentence about?', v: 'What is someone or something DOING?', a: 'Which word describes what something is like?', d: 'Which word tells HOW? It often ends in -ly.', p: 'Which word stands in for a name?' }[type],
      pickHelp: correct.length > 1 ? 'There is more than one — any of them is right!' : '',
      explain: () => `<div class="sent" style="font-size:1.3rem">${toks.map(t => t.tag ? `<span class="tagged" style="background:${POS[t.tag][2]}" title="${POS[t.tag][0]}">${esc(t.w)}</span>${t.p}` : esc(t.w) + t.p).join(' ')}</div><div class="legend">${[...new Set(toks.map(t => t.tag).filter(Boolean))].map(k => `<span style="--lc:${POS[k][2]}">${POS[k][0]}</span>`).join('')}</div>` };
  }
});
