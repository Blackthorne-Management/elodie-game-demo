// Every puzzle (guide 6.2): where it starts, the story flags that are true when the player reaches
// it, and what counts as solved. Each has puzzles/<id>/solution.json (inputs that solve it from a
// fresh save) and puzzles/<id>/cheats.json (input lists that must NOT solve it); tests replay both.

import type { Condition } from '../engine/conditions.ts';
import type { FlagSnapshot } from '../engine/flags.ts';

export interface PuzzleDef {
  id: string;
  title: string;
  map: string;
  spawn: string;
  /** Flags already set when the player reaches the puzzle. */
  flags: FlagSnapshot;
  goal: Condition;
}

const BEFORE_LOCKET: FlagSnapshot = {
  'party.anissa': true,
  'story.festival_intro': true,
  'story.heard_speech': true,
  'story.elodie_left': true,
  'story.house_entered': true,
};

export const PUZZLES: readonly PuzzleDef[] = [
  {
    id: 'warroom_orders',
    title: "The Marshal's night orders (tutorial: Echo and anchors)",
    map: 'zetwal-house',
    spawn: 'study',
    flags: { ...BEFORE_LOCKET, 'item.sun_locket': true },
    goal: { flag: 'clue.night_orders' },
  },
  {
    id: 'zetwal_bridge',
    title: 'The Chain Bridge to the Temple island (signature puzzle: bridge)',
    map: 'zetwal-town',
    spawn: 'bridgehead',
    flags: {
      ...BEFORE_LOCKET,
      'item.sun_locket': true,
      'story.warroom_intro': true,
      'story.warroom_echo': true,
      'story.warroom_returned': true,
      'anchor.night_orders': true,
      'clue.night_orders': true,
    },
    goal: { flag: 'story.bridge_crossed' },
  },
  // Z-4 The Seventh Stone (secret, Chapter 1; PUZZLES.md S-ZET, difficulty 2): after the lamp, the mourner's quest taken.
  // Watch the first reading in the temple's memory, carve the seventh stone there with the stonecutter's chisel, then
  // touch the stones in the reading's order (3, 1, 5, 2, 6, 4, 7) and open the drawer under Solange's plinth.
  {
    id: 'zetwal_stones',
    title: 'The Seventh Stone: the first reading, the sun on the seventh, the stones in order (secret; PUZZLES.md S-ZET)',
    map: 'zetwal-temple',
    spawn: 'temple_start',
    flags: {
      ...BEFORE_LOCKET,
      'item.sun_locket': true,
      'story.warroom_intro': true,
      'story.warroom_echo': true,
      'story.warroom_returned': true,
      'anchor.night_orders': true,
      'clue.night_orders': true,
      'anchor.chain_bridge': true,
      'story.bridge_crossed': true,
      'story.temple_arrived': true,
      'story.lamp_lit': true,
      'story.anissa_woke': true,
      'story.yari_landed': true,
      'story.yari_asked': true,
      'side.seventh_stone.accepted': true,
    },
    goal: { flag: 'side.seventh_stone.done' },
  },
];
