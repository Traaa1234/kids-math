'use strict';
/* =====================================================================
   REGISTRY — the plug-in system.
   Every activity calls register(id, world, definition) in its own file.
   The home screen, daily quests and progress report are built from this
   list, so adding a feature = add one file + one <script> tag.
   See docs/DEVELOPER-GUIDE.md for the full definition format.
   ===================================================================== */
const ACTS = {};      // id -> activity definition
const WORLDS = [];    // sections on the home screen, in display order

/** Add a home-screen section, e.g. addWorld({ id: 'science', title: '🔬 Science World', tag: 'plants, animals, space' }) */
function addWorld(world) {
  if (WORLDS.some(w => w.id === world.id)) throw new Error(`World "${world.id}" is already defined`);
  WORLDS.push(world);
}

/** Register an activity. `order` is optional; by default tiles appear in the order their scripts load. */
let regCount = 0;
function register(id, world, def) {
  if (ACTS[id]) throw new Error(`Activity id "${id}" is used twice`);
  if (!def.custom && typeof def.gen !== 'function' && typeof def.makeRound !== 'function') throw new Error(`Activity "${id}" needs gen(level) or makeRound(level), or custom: true with open()`);
  if (def.custom && typeof def.open !== 'function') throw new Error(`Custom activity "${id}" needs open()`);
  ACTS[id] = Object.assign({ id, world, order: (++regCount) * 10, color: '#5b6cff', bg: '#eef0ff', desc: '' }, def, { id, world });
  return ACTS[id];
}

/** Activity ids in a world, sorted for display. Activities can be hidden with `hidden: true`. */
function worldIds(worldId) {
  return Object.values(ACTS).filter(a => a.world === worldId && !a.hidden).sort((a, b) => a.order - b.order).map(a => a.id);
}
