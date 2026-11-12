'use strict';
/* Activity "opposites" — Opposites and synonyms */

const OPP1 = [['hot', 'cold'], ['big', 'small'], ['up', 'down'], ['happy', 'sad'], ['fast', 'slow'], ['day', 'night'], ['wet', 'dry'], ['open', 'closed'], ['in', 'out'], ['yes', 'no'], ['top', 'bottom'], ['old', 'new'], ['tall', 'short'], ['full', 'empty'], ['loud', 'quiet'], ['hard', 'easy']];
const OPP2 = [['early', 'late'], ['push', 'pull'], ['first', 'last'], ['win', 'lose'], ['light', 'dark'], ['thick', 'thin'], ['inside', 'outside'], ['above', 'below'], ['begin', 'end'], ['always', 'never'], ['strong', 'weak'], ['awake', 'asleep'], ['true', 'false'], ['brave', 'afraid'], ['remember', 'forget'], ['arrive', 'leave'], ['smooth', 'rough'], ['shallow', 'deep']];
const SYN = [['big', 'large'], ['small', 'tiny'], ['happy', 'glad'], ['fast', 'quick'], ['smart', 'clever'], ['begin', 'start'], ['shout', 'yell'], ['close', 'shut'], ['angry', 'mad'], ['scared', 'afraid'], ['tired', 'sleepy'], ['jump', 'leap'], ['gift', 'present'], ['rock', 'stone'], ['pretty', 'beautiful'], ['hard', 'difficult'], ['easy', 'simple'], ['end', 'finish'], ['talk', 'speak'], ['grin', 'smile'], ['cold', 'chilly'], ['quiet', 'silent'], ['sad', 'unhappy']];
register('opposites', 'reading', {
  icon: '🔄', title: 'Opposites & Synonyms', desc: 'Words that mean the opposite or the same', color: '#7c3aed', bg: '#efe7ff',
  gen(lv) {
    let list, mode;
    if (lv === 1) { list = OPP1; mode = 'opp'; }
    else if (lv === 2) { list = Math.random() < .3 ? OPP1 : OPP2; mode = 'opp'; }
    else if (Math.random() < .6) { list = SYN; mode = 'syn'; } else { list = OPP2; mode = 'opp'; }
    const pair = pick(list), flip = Math.random() < .5, t = flip ? pair[1] : pair[0], ans = flip ? pair[0] : pair[1];
    const related = new Set(list.filter(p => p.includes(t)).flat());
    const pool = shuffle(list.flat().filter(w => !related.has(w)));
    const choices = shuffle([ans, ...[...new Set(pool)].slice(0, 3)]);
    const word = mode === 'opp' ? 'the <b>opposite</b> of' : 'the <b>same</b> as';
    return { key: mode + t, kind: 'choice', answer: ans, prompt: `Which word means ${word}<span class="big">${t}</span>`, say: `Which word means the ${mode === 'opp' ? 'opposite' : 'same'} as ${t}?`,
      choices: ch(choices), hint: mode === 'opp' ? `Opposites are as different as can be — like hot and cold.` : 'Synonyms mean almost the same thing — like big and large.',
      explain: mode === 'opp' ? `<b>${t}</b> and <b>${ans}</b> are opposites.` : `<b>${t}</b> and <b>${ans}</b> are synonyms — they mean the same thing.`, after() { speak(`${t}, ${ans}`); } };
  }
});
