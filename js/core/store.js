'use strict';
/* Saved data: players, levels, XP */
/* ---------------- storage / profiles ---------------- */
const STORE = 'brainyQuest.v1';
let DB = (() => { try { const d = JSON.parse(localStorage.getItem(STORE)); if (d && d.profiles) return d; } catch (e) {} return { current: null, profiles: {} }; })();
function save() { try { localStorage.setItem(STORE, JSON.stringify(DB)); } catch (e) {} }
function P() { return DB.profiles[DB.current]; }
const AVATARS = ['🦊', '🐼', '🐯', '🦁', '🐸', '🐵', '🐰', '🐨', '🦄', '🐲', '🐧', '🐶', '🐱', '🦉', '🐙', '🦖', '🐢', '🦋'];
const STICKERS = ['🦄', '🐉', '🦖', '🐙', '🦋', '🐬', '🦁', '🐼', '🦊', '🐯', '🐸', '🐧', '🦉', '🐢', '🦜', '🐝', '🌈', '⭐', '🌙', '☀️', '🌋', '🏰', '🚀', '🛸', '🎈', '🎨', '🎸', '🥁', '🏆', '👑', '💎', '🔮', '🍩', '🍦', '🍉', '🍓', '🧁', '🍕', '⚽', '🏀', '🎯', '🧩', '🪐', '☄️', '🌻', '🌵', '🍄', '🐳'];
const LEVEL_TITLES = ['Explorer', 'Adventurer', 'Thinker', 'Star Seeker', 'Brain Builder', 'Word Wizard', 'Number Ninja', 'Super Scholar', 'Quest Champion', 'Legend'];

function fixProfile(p) {
  const def = { xp: 0, stars: 0, stickers: [], streak: 0, lastDay: '', today: { date: '', count: 0 }, goal: 15, best: {}, stats: {}, lastLevel: {}, learned: [], mission: null, seenStories: [], age: 7,
    settings: { sound: true, autoRead: true, voice: '', rate: 0.9 } };
  for (const k in def) if (p[k] === undefined) p[k] = def[k];
  for (const k in def.settings) if (p.settings[k] === undefined) p.settings[k] = def.settings[k];
  return p;
}
Object.values(DB.profiles).forEach(fixProfile);
if (DB.current && !DB.profiles[DB.current]) DB.current = Object.keys(DB.profiles)[0] || null;

function newProfile(name, avatar, age) {
  const id = 'p' + Date.now().toString(36) + rnd(10, 99);
  const p = fixProfile({ id, name, avatar, age });
  const lv = age <= 6 ? 1 : age <= 8 ? 2 : 3;
  p.defaultLevel = lv;
  DB.profiles[id] = p; DB.current = id; save(); return p;
}
function levelInfo(xp) { let lvl = 1, need = 100, rest = xp; while (rest >= need) { rest -= need; lvl++; need = 100 + (lvl - 1) * 25; } return { lvl, cur: rest, need }; }
const levelTitle = l => LEVEL_TITLES[Math.min(l - 1, LEVEL_TITLES.length - 1)];
