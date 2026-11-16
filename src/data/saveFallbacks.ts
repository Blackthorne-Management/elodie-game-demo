// Saves across fixes (guide 9.1, Claude's call, Nov 13): what a save made on an earlier build needs to load on this
// one (engine/saveCompat.ts).
//
// - renames: when a fix renames a map, an item or a flag, add `old: 'new'` here (and leave it here), so a save made
//   before the fix keeps that place, that item (in the bag, worn or shown) or that story step.
// - safeSpawns: where each chapter can always be picked up, in story order: the latest one whose `after` flag is set
//   is where a save goes when its map is gone. The demo has Chapter 1 alone, so its one start is the plaza.

import type { SaveFallbacks } from '../engine/saveCompat.ts';
import { RPG } from './rpg.ts';

export const SAVE_FALLBACKS: SaveFallbacks = {
  renames: {
    maps: {},
    items: {},
    // Nov 14 (owner): the name is spelled Sebastien.
    flags: { 'story.sebastian_met': 'story.sebastien_met' },
  },
  safeSpawns: [
    { after: '', map: 'zetwal-town', spawn: 'start' },
  ],
  items: Object.keys(RPG.items),
};
