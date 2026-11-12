# 🌟 Brainy Quest (kids-math)

Math, reading and brain games for kids up to age 10 — in one friendly app.
Plain HTML, CSS and JavaScript: **no installs, no accounts, no internet needed** (except the font).

## ▶ Play it

- **Online:** https://traaa1234.github.io/kids-math/ (works on computers, tablets and phones)
- **On your computer:** double-click `index.html`. It opens in your browser.
- **One single file to share:** run `node tools/bundle.js`, then send `dist/brainy-quest.html`
  (email, USB stick, tablet). Everything is inside that one file.

Progress is saved in the browser on that device. Several kids can each have their own player.

## What's inside

| World | Activities |
|---|---|
| 🔢 Math | Add & Subtract · Multiply & Divide · Times Table Race · Place Value · Fractions · Tell the Time · Money · Compare Numbers · Patterns · Word Problems · Math Lab (free play) |
| 📚 Reading | Sight Word Cards (200 words) · Word Hunt · Picture Words · Sound It Out · Spelling Bee · Rhyme Time · Opposites & Synonyms · Sentence Builder · Word Detective · Story Time |
| 🧩 Brain Games | Memory Match · Odd One Out · Picture Puzzle |

Every quiz activity has 🌱 Easy, 🌳 Medium and 🚀 Hard levels, read-aloud questions, hints, a
second try, and a picture explanation (ten-frames, base-ten blocks, step-by-step columns,
arrays, number lines, clocks, coins, fraction bars…). Kids earn XP, stars, stickers, daily
quests and streaks. Grown-ups get a progress report under ⚙️.

## 🛠 Adding features

The app is built from small plug-in files. To add an activity:

1. Copy `js/activities/_template.js` to `js/activities/<world>/<id>.js` and edit it.
2. Add one `<script>` line for it in `index.html`.
3. Open `index.html?selfcheck` — it generates thousands of questions and reports any problems.

Full guide: **[docs/DEVELOPER-GUIDE.md](docs/DEVELOPER-GUIDE.md)** (folder layout, question format,
picture tools, adding a new subject/world, custom screens, saving data).

## Project layout

```
index.html              the app page — lists every css/js file
css/                    base.css · play.css · visuals.css · screens.css
js/core/                engine, registry (plug-in system), saving, sounds, speech, rewards, home
js/visuals/             math picture tools
js/data/                word lists, stories, brain-game pictures
js/activities/<world>/  one file per activity
js/screens/             custom screens: flashcards, Math Lab, settings
js/worlds.js            the sections on the home screen
js/dev/self-check.js    automatic tester (index.html?selfcheck)
tools/                  bundle.js (single-file build) · syntax-check.js
```

## Commands (need Node.js)

```bash
node tools/syntax-check.js   # every file parses, all files are loaded, no name clashes
node tools/bundle.js         # make dist/brainy-quest.html
```
