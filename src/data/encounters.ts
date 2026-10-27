// Random encounters in each capital's wild section (map layer `encounters`, property `table`). The demo
// never switches them on (`story.zetwal_return` is a later chapter's flag), so none can happen here; in the
// full game each one is a real battle. `foes` name them for the Foes page.

import type { EncounterTable } from '../engine/content.ts';

/**
 * Story flags that chapters not built yet will set (owner decision, Oct 14: Chapter 1's only fight is the
 * scripted boar; the wild sections turn violent when the story brings the party back). Maps may read them.
 */
export const LATER_STORY_FLAGS: readonly string[] = [
  /** The party returns to Zetwal later in the story: the Cane Road's ambushes begin. */
  'story.zetwal_return',
  /** Chapter 10: the fleet sails for Xaraguá (Z-4 The Seventh Stone closes then, unfinished). */
  'story.fleet_sailed',
];

export const ENCOUNTERS: Readonly<Record<string, EncounterTable>> = {
  // Scripted fights (data/battles.ts), listed here so the Foes page shows them. No map rolls on this table.
  wilds: {
    id: 'wilds',
    groups: [
      {
        id: 'boar',
        weight: 0,
        level: 3,
        foes: ['Cane-field boar'],
        intro: 'A boar bursts out of the cane.',
        won: 'The boar crashes away into the cane.',
        fled: 'You back away from the boar.',
      },
    ],
  },
  // Zetwal: the Cane Road beyond the east gate.
  cane_road: {
    id: 'cane_road',
    groups: [
      {
        id: 'bandits',
        weight: 3,
        level: 6,
        foes: ['Road Bandit', 'Road Bandit'],
        intro: 'Two bandits step out of the cane, knives low. "Festival toll, archivist. Everything you carry."',
        won: 'They drop their knives and vanish between the stalks.',
        fled: 'You sprint back down the road. Their laughter follows you.',
      },
      {
        id: 'smugglers',
        weight: 2,
        level: 7,
        foes: ['Smuggler', 'Smuggler', 'Lookout'],
        intro: 'Smugglers, hauling Crown-stamped crates through the field. "You saw nothing. Say it."',
        won: 'The smugglers abandon a crate and scatter toward the mangroves.',
        fled: 'You slip away before the lookout can whistle for more.',
      },
      {
        id: 'hushers',
        weight: 1,
        level: 9,
        foes: ['Quiet Crown Zealot', 'Quiet Crown Zealot'],
        intro: 'Two veiled figures rise from the ditch without a sound. "Hush, little archivist. Where is your sister?"',
        won: 'The veiled pair back away into the cane, still watching you.',
        fled: 'You run. When you look back, the road behind you is empty.',
      },
    ],
  },
};
