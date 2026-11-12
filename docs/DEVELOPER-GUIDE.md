# Developer guide

Brainy Quest is plain HTML/CSS/JS with **no build step and no dependencies**. Every file in
`js/` is a classic `<script>` listed in `index.html`; they share one global scope and load in
order. That is what lets the app open by double-clicking `index.html` (even from a USB stick).

## How the pieces fit

```
index.html ──loads──▶ core (helpers, registry, saving, engine…)
                     ▶ worlds.js          addWorld(...)      → home-screen sections
                     ▶ data/*.js          word lists, stories, pictures
                     ▶ activities/*/*.js  register(id, world, {...}) → tiles
                     ▶ screens/*.js       custom screens (flashcards, Math Lab, settings)
                     ▶ main.js            starts the app (must be last)
```

- **Registry** (`js/core/registry.js`): `register(id, world, definition)` adds an activity.
  The home screen, daily quests and the grown-up progress report all read from it.
- **Engine** (`js/core/engine.js`): runs a round of 10 questions (or a timed round), handles
  first/second tries, hints, the explanation panel, XP, stars, stickers and the result screen.
- **Answer types** (`js/core/answer-types.js`): how each kind of answer is drawn.
- **Saving** (`js/core/store.js`): everything per player lives in `localStorage` under
  `brainyQuest.v1`. New fields get defaults in `fixProfile()` so old saves keep working.

## Add a quiz activity (most common)

1. Copy `js/activities/_template.js` → `js/activities/math/my-thing.js`.
2. Change the id, world, icon, title, colors, and write `gen(level)`.
3. Add `<script src="js/activities/math/my-thing.js"></script>` in `index.html` under the
   right world comment. Tiles appear in script order (or set `order: 25` etc.).
4. Open `index.html?selfcheck`, then play it in `index.html`.
5. Run `node tools/syntax-check.js` before committing.

### Activity definition

| Field | Meaning |
|---|---|
| `icon`, `title`, `desc`, `color`, `bg` | Tile and screen look |
| `gen(level)` | Returns one question. `level` is 1, 2 or 3 |
| `makeRound(level)` | *Instead of gen*: return an array of questions (used by Story Time) |
| `len` | Questions per round (default 10) |
| `timed: 60, goals: [8,15,22]` | Timed round; star thresholds for score |
| `order` | Position on the home screen |
| `hidden: true` | Keep the code but hide the tile |
| `custom: true, open(id)` | A screen of your own instead of the quiz engine (see below) |
| `game: true` | Custom brain game that reports stars through `gameFinish()` |
| `mastery()` | Custom text for the bottom of the tile |

### Question object (returned by `gen`)

| Field | Meaning |
|---|---|
| `kind` | `'choice'` · `'number'` (on-screen number pad) · `'spell'` (fill missing letters) · `'tiles'` (put words in order) · `'pick'` (tap a word inside the prompt) |
| `prompt` | HTML for the question. Handy classes: `big`, `emo`, `wp` (word problem), `qbox` (yellow ? box) |
| `answer` | The right value. Compared as text, so `12` and `'12'` match |
| `check(value)` | Optional custom checker (return true if right) |
| `key` | Unique text for this question — stops repeats in a round |
| `say` | Text read aloud (auto-read is on by default). `alwaysSpeak: true` reads it even when auto-read is off |
| `hint` | Shown after the first wrong try |
| `visual(el)` | Fills `el` with a picture. Shown by **🔍 Show me** and automatically after a miss (`noAutoVisual: true` to stop that). `showLabel` renames the button |
| `explain` | HTML (or function returning HTML) shown after the second miss |
| `answerText` / `answerHTML` | How the answer is written in the explanation |
| `after()` | Runs after a correct answer (e.g. say the word) |
| `sayAnswer` | Read aloud with the explanation |
| choice: `choices` | `[{ label: 'html', val: value }]`. Use `ch(['a','b'])` for plain text and `numChoices(answer, [nearMisses])` for numbers. Optional `cols: 3`, `choiceClass: 'sym' / 'emo' / 'pics' / 'sm'` |
| number: `pre`, `post` | Text before/after the answer box (e.g. `post: '¢'`) |
| spell: `word`, `blanks`, `bank` | Word, indexes of missing letters, letter tiles to choose from |
| tiles: `tiles` | Shuffled words; `answer` is the sentence |
| pick: `check(i)` | Prompt contains `<button class="pw" data-i="i">` words |
| story: `passage`, `passageKey`, `storyTitle` | Shows a story panel above the question |

### Helpers you can use (`js/core/util.js`)

`rnd(a,b)` random whole number · `pick(arr)` · `shuffle(arr)` · `esc(text)` make text HTML-safe ·
`cap(text)` · `ch(list)` · `numChoices(answer, extras)` · `speak(text)` · `SFX.good()` etc.

### Picture tools (`js/visuals/math-visuals.js`)

`tenFrames(a,b,'+'|'-')` · `baseTen(n)` · `pvTable(n, place)` · `vertHTML(a,b,op)` ·
`columnStepper(el,a,b,'+'|'-')` · `arrayDots(rows,cols)` · `areaModel(x,y)` · `shareGroups(total,groups)` ·
`longDivHTML(a,d)` · `numberLine(min,max,{marks,hops})` · `pieSVG(n,d)` · `barSVG(n,d)` · `fr(n,d)` ·
`clockSVG(h,m,size,{minutes})` · `coinsHTML([25,10,1])` · `countOnHTML(list)` · `emojiGroups([3,4],'🍎')` ·
`barModel(rows)` · `seqHTML(seq, missingIndex, showHops)` · `numWords(n)` · `timeWords(h,m)`

## Add a new subject (world)

```js
// js/worlds.js
addWorld({ id: 'science', title: '🔬 Science World', tag: 'plants, animals and space' });
```
Then register activities with world `'science'` and add their script tags. The home screen,
quests and report pick it up automatically. Daily quests use the first two worlds plus the
least-played activity anywhere.

## Add a custom screen

For something that isn't question-and-answer (like Math Lab):
1. Add a `<section class="screen" id="my-screen">…</section>` to `index.html` (copy the
   Math Lab section for the top bar with the Home button).
2. `register('myid', 'math', { custom: true, icon, title, desc, open() { show('my-screen'); … } })`.
3. For a game that awards stars, use `gameShell(id)` and `gameFinish(stars, html)` from
   `js/core/games.js` (see `activities/brain/memory.js`).

## Add content without code

- **Stories:** `js/data/stories.js` — copy an entry. The first answer in each list is correct.
- **Sight words / picture words:** `js/data/words.js`.
- **Sentences, rhymes, opposites, word-detective sentences:** at the top of each reading activity file.
- **Puzzle pictures / odd-one-out sets:** `js/data/brain-games.js`.

## Checking your work

- `index.html?selfcheck` — runs ~17,000 generated questions through validity checks
  (one right choice, whole-number answers, pictures render…) using a temporary player.
- `node tools/syntax-check.js` — every file parses, every file is loaded, no duplicate names.
- `node tools/bundle.js` — single-file build in `dist/` (not committed).

## Conventions

- One activity per file; file name = activity id.
- Top-level names are global: prefix data with something unique (`RHY1`, `OPP2`, …).
  `syntax-check.js` catches clashes.
- Keep text kid-friendly and short; use `say` for anything a non-reader needs to hear.
- Don't rename an activity id after release — saved progress is stored by id.
