// Chapter 1, The Festival of the Gaze (Zetwal; the guide's Act I, 5.5; owner decision Oct 14: the story is
// told in chapters). The id and flags keep the old `act1` name so saves stay valid. the objectives the Journal lists, in order, with Anissa's hints for each
// (guide 6.2 rule 4: from a nudge to the answer), and the notes the Journal keeps.

import type { JournalNote, QuestDef } from '../engine/quests.ts';

export const ACT1: QuestDef = {
  id: 'act1',
  title: 'Chapter 1: The Festival of the Gaze',
  maps: ['zetwal-town', 'zetwal-house', 'zetwal-temple', 'zetwal-square', 'zetwal-hall', 'zetwal-market', 'zetwal-road'],
  objectives: [
    {
      id: 'festival',
      title: "Mother's address",
      detail: 'Mother speaks from the stage at the north of the plaza. Go and listen.',
      done: { flag: 'story.heard_speech' },
      goals: [{ map: 'zetwal-town', at: { x: 17, y: 4 } }],
      hints: [
        "Gigi... isn't Mother about to speak? Everyone's going north.",
        'The stage is at the top of the plaza, past the fountain.',
        "Mother's on the stage, north of the fountain. Let's stand in front of her and talk to her.",
      ],
    },
    {
      id: 'farewell',
      title: 'See Mother off',
      detail: 'Her carriage waits at the east gate, at the end of the road south-east of the plaza.',
      done: { flag: 'story.elodie_left' },
      goals: [{ map: 'zetwal-town', at: { x: 36, y: 20 } }],
      hints: [
        'Mother said the east gate. She will not wait forever.',
        'The road goes east from below the plaza, all the way to the gate.',
        "Follow the road south-east of the plaza to the carriage. Mother's standing beside it.",
      ],
    },
    {
      id: 'anicette',
      title: 'Grandmother is waiting',
      detail: "Mother says Grandmother Anicette has something for you, at home in Grandfather's study.",
      done: { flag: 'item.sun_locket' },
      goals: [{ map: 'zetwal-house', at: { x: 12, y: 4 } }],
      hints: [
        'Grandmother is at home. I want to see what she has for you.',
        'Home is the house on the north-west side of the plaza.',
        "Go in our front door, north-west of the plaza. Grandmother's in the study, on the right.",
      ],
    },
    {
      id: 'first_echo',
      title: 'What the Locket remembers',
      detail: 'Stand on the shimmering tiles by the map table and press Echo. Then talk to the people there.',
      done: { flag: 'story.warroom_echo' },
      goals: [{ map: 'zetwal-house', at: { x: 14, y: 6 } }],
      // In the memory: the aide by the shelves has the night orders (review 1, finding 2).
      echoGoals: [{ map: 'zetwal-house', at: { x: 12, y: 4 } }],
      hints: [
        'The air by the map table is shimmering, Gigi. Do you see it?',
        'Stand on the shimmering tiles and press Echo. I will hold the door.',
        "In the memory you're Grandfather. Talk to the aide by the shelves; he has something for you.",
      ],
    },
    {
      id: 'hide_orders',
      title: 'Leave word for later',
      detail: 'Grandfather keeps copies of his papers under the loose board by the window seat. Leave the night orders there.',
      done: { flag: 'anchor.night_orders' },
      // The copy is only in the memory: in the present, back to the shimmer; in it, the aide for the copy (it
      // is gone after a return), then the board by the window.
      goals: [{ map: 'zetwal-house', at: { x: 14, y: 6 } }],
      echoGoals: [
        { if: { notFlag: 'echo.orders_copy' }, map: 'zetwal-house', at: { x: 12, y: 4 } },
        { map: 'zetwal-house', at: { x: 17, y: 2 } },
      ],
      hints: [
        "Grandfather hid things for later, didn't he? Grandmother always says so.",
        'The aide said where the copy goes: the loose board by the window.',
        'As Grandfather, take the orders to the window seat in the corner and leave them under the board.',
      ],
    },
    {
      id: 'read_orders',
      title: 'Fifty years under the floor',
      detail: 'Return to the present on the shimmering tiles, then look under the window seat.',
      done: { flag: 'clue.night_orders' },
      // In the memory, the shimmer back out; in the present, the board (review 1, finding 2: an early return,
      // story.warroom_returned, is not the orders in hand).
      goals: [{ map: 'zetwal-house', at: { x: 17, y: 2 } }],
      echoGoals: [{ map: 'zetwal-house', at: { x: 14, y: 6 } }],
      hints: [
        'Come back, Gigi. I want to see if it is still there.',
        'Press Echo on the shimmering tiles to come back, then look under the window seat.',
        'Back on the shimmering tiles, press Echo. Then face the window seat and look.',
      ],
    },
    {
      id: 'bridge',
      title: 'Cross to the Temple island',
      detail: 'The rope bridge has fallen. The night orders: turn the winch to lower the Chain Bridge, then drive the iron pin through the pawl.',
      done: { flag: 'story.bridge_crossed' },
      // In the present: the bridgehead shimmer, then (pinned) across. In the memory: the winch, the pawl, then the
      // shimmer back out (review 1, finding 2).
      goals: [
        { if: { flag: 'anchor.chain_bridge' }, map: 'zetwal-town', at: { x: 31, y: 9 } },
        { map: 'zetwal-town', at: { x: 28, y: 10 } },
      ],
      echoGoals: [
        { if: { flag: 'anchor.chain_bridge' }, map: 'zetwal-town', at: { x: 28, y: 10 } },
        { if: { flag: 'echo.chain_bridge_down' }, map: 'zetwal-town', at: { x: 29, y: 8 } },
        { map: 'zetwal-town', at: { x: 28, y: 8 } },
      ],
      hints: [
        'Gigi, what if the old bridge could just... go back?',
        'The air shimmers at the bridgehead, by the old winch. Grandfather was there that night.',
        'Use the Locket at the bridgehead. As Grandfather, turn the winch, pin the pawl, then come back and cross.',
      ],
    },
    {
      id: 'grandfather',
      title: 'Find Grandfather',
      detail: 'Grandfather is at the Gaze lamp, inside the temple.',
      done: { flag: 'story.met_patricio' },
      goals: [{ map: 'zetwal-temple', at: { x: 13, y: 3 } }],
      hints: [
        'Grandfather will be at the lamp. He always is, on this night.',
        "The temple is north of the landing. He'll be inside, by the lamp.",
        'Walk east from the bridge, then north into the temple. Grandfather is beside the lamp.',
      ],
    },
    {
      id: 'lamp',
      title: 'The reading of the names',
      detail: 'The Gaze lamp will not take a flame. Grandfather asks you to try.',
      done: { flag: 'story.anissa_woke' },
      goals: [{ map: 'zetwal-temple', at: { x: 14, y: 3 } }],
      hints: [
        'Will you try the lamp, Gigi? Grandfather asked you.',
        'Stand in front of the lamp and try to light it.',
        'Face the lamp in the middle of the temple and press A.',
      ],
    },
    {
      id: 'dock',
      title: 'A canoe at the dock',
      detail: 'Someone has come across the water to the island dock, south of the temple.',
      done: { flag: 'story.yari_asked' },
      goals: [{ map: 'zetwal-temple', at: { x: 14, y: 12 } }],
      hints: [
        'Someone came across the water. I saw a canoe.',
        'The dock is at the south end of the island.',
        'Go south from the temple to the dock and talk to whoever came.',
      ],
    },
    // Batch D (Oct 19): after Yari, the Journal walks the city the short way, so the gold arrow does too: the
    // island's work first ("I have work at the archive"), then the Hall, the Cane Road, the city's errands on the
    // way back, and the island again to sail. `island` and `town` only order what the side quests already reward
    // (no story XP), and the boar is still met at level 3, as the battle tutorial expects (tests/battle.test.ts).
    {
      id: 'island',
      title: 'Work on the island',
      detail: 'Before crossing back: the cane cutter is waiting by the name stones, and the senior archivist is in the Temple Archive.',
      done: { all: [{ flag: 'side.cane_name.stones' }, { flag: 'side.overdue.accepted' }, { flag: 'lore.zetwal_ash_wars_temple' }] },
      noXp: true,
      goals: [
        { if: { notFlag: 'side.cane_name.stones' }, map: 'zetwal-temple', at: { x: 8, y: 4 } },
        { if: { notFlag: 'side.overdue.accepted' }, map: 'zetwal-archive', at: { x: 14, y: 4 } },
        { map: 'zetwal-archive', at: { x: 2, y: 2 } },
      ],
      hints: [
        'You told Yari you had work at the archive, Gigi. And that cane cutter by the name stones looks lost.',
        'The name stones are west of the temple. The archive is through the door at the back of the temple.',
        "Talk to the cane cutter at the name stones, then the senior archivist. Read the temple's Ash Wars record on the history shelf.",
      ],
    },
    // The Envoy's Papers (owner decision, Oct 15: one task at the Hall of the Accord in Chapter 1; in one visit
    // since Batch D, Oct 19: the engraver brings the seal to the clerk's desk).
    {
      id: 'papers',
      title: "The envoy's papers",
      detail: "The Crown boards every boat at Xaraguá. Ask the clerk at the Hall of the Accord, up the steps at the head of the plaza, for envoy papers.",
      done: { flag: 'story.envoy_papers' },
      goals: [
        { if: { flag: 'story.papers_sealed' }, map: 'zetwal-hall', at: { x: 32, y: 5 } },
        { map: 'zetwal-hall', at: { x: 21, y: 25 } },
      ],
      hints: [
        'Yari said we need papers, Gigi. The Hall writes them.',
        "The Hall of the Accord is up the steps at the head of the plaza. The clerk's desk is just inside the doors.",
        "The clerk at his desk inside the Hall's doors, then up the gallery to the Chancellor's office, the first door east.",
      ],
    },
    // The first battle is not optional (owner decision, Oct 16): Yari will not sail until the boar is beaten.
    // On the way in, the shimmer by the gate, if the cane cutter's quest is waiting on it.
    {
      id: 'boar',
      title: 'The boar on the Cane Road',
      detail: 'A boar is charging the cane cutters on the Cane Road, past the east gate. Yari will not sail until it is dealt with.',
      done: { flag: 'encounter.wilds.boar.won' },
      goals: [
        { if: { all: [{ flag: 'side.cane_name.stones' }, { notFlag: 'clue.cane_name' }] }, map: 'zetwal-road', at: { x: 3, y: 14 } },
        { map: 'zetwal-road', at: { x: 9, y: 12 } },
      ],
      // In the Cane Road's memory: the cane worker by the roses, then the shimmer back out.
      echoGoals: [
        { if: { notFlag: 'clue.cane_name' }, map: 'zetwal-road', at: { x: 2, y: 16 } },
        { map: 'zetwal-road', at: { x: 3, y: 14 } },
      ],
      hints: [
        "Yari won't leave the cane cutters with that boar, Gigi. Neither will I.",
        'The Cane Road is past the east gate, at the end of the road south-east of the plaza.',
        'Go out through the east gate onto the Cane Road and walk east into the cane. The boar will find us.',
      ],
    },
    {
      id: 'town',
      title: 'Errands on the way back',
      detail: "Back through the city to the island: the archive's overdue books, the soup vendor's bowls, and the debate on the lawn below the plaza.",
      done: {
        all: [
          { flag: 'side.overdue.soup' },
          { flag: 'side.overdue.ferry' },
          { flag: 'side.overdue.vol2' },
          { flag: 'side.soup.done' },
          { any: [{ flag: 'debate.zetwal_corner.joined' }, { flag: 'debate.zetwal_corner.mediated' }] },
        ],
      },
      noXp: true,
      // In the order they lie on the way back from the east gate: the lawn below the plaza, the vendor, the old
      // neighbor, home, the guard, the docks, and the vendor again.
      goals: [
        { if: { all: [{ notFlag: 'debate.zetwal_corner.joined' }, { notFlag: 'debate.zetwal_corner.mediated' }] }, map: 'zetwal-town', at: { x: 22, y: 17 } },
        {
          if: { any: [{ notFlag: 'side.overdue.soup' }, { all: [{ notFlag: 'side.soup.accepted' }, { notFlag: 'side.soup.done' }] }] },
          map: 'zetwal-town',
          at: { x: 11, y: 12 },
        },
        { if: { all: [{ flag: 'side.soup.accepted' }, { notFlag: 'side.soup.elder' }] }, map: 'zetwal-town', at: { x: 4, y: 11 } },
        { if: { notFlag: 'side.overdue.vol2' }, map: 'zetwal-house', at: { x: 12, y: 4 } },
        { if: { all: [{ flag: 'side.soup.accepted' }, { notFlag: 'side.soup.guard' }] }, map: 'zetwal-town', at: { x: 22, y: 10 } },
        {
          if: { any: [{ notFlag: 'side.overdue.ferry' }, { all: [{ flag: 'side.soup.accepted' }, { notFlag: 'side.soup.ferry' }] }] },
          map: 'zetwal-town',
          at: { x: 9, y: 23 },
        },
        { map: 'zetwal-town', at: { x: 11, y: 12 } },
      ],
      hints: [
        'The overdue books, the soup, and that debate below the plaza, Gigi. All of it is on our way back to the island.',
        'The debate is on the lawn below the plaza. The soup vendor is on the plaza, Grandmother is at home, the ferryman at the docks.',
        'The debate on the lawn, then the soup vendor, the old neighbor, Grandmother, the guard, the ferryman, and the vendor again.',
      ],
    },
    // Every side quest in Pòdlimyè must be done before Yari sails (owner decision, Oct 18). The gold arrow
    // follows what is left of them (engine/guide.ts `followSide`): by now, back on the island.
    {
      id: 'errands',
      title: 'Unfinished business',
      detail: 'Yari will not sail while Pòdlimyè still needs Gianna. Finish every quest on your Quests page first.',
      done: {
        all: [
          { flag: 'side.overdue.done' },
          { flag: 'side.soup.done' },
          { flag: 'side.cane_name.done' },
          { any: [{ flag: 'debate.zetwal_corner.joined' }, { flag: 'debate.zetwal_corner.mediated' }] },
        ],
      },
      followSide: true,
      hints: [
        'We cannot leave yet, Gigi. Your Quests page still has work on it.',
        'Follow the arrow, Gigi. It knows what is left better than I do.',
        "The books back to the archivist, Grann's name in Mother Solange's list, and the cane cutter at the name stones.",
      ],
    },
    {
      id: 'depart',
      title: 'Before the tide',
      detail: "Yari's canoe waits at the island dock. Go to the canoe and tell Yari you are ready to sail.",
      done: { flag: 'act1.complete' },
      goals: [{ map: 'zetwal-temple', at: { x: 16, y: 18 } }],
      hints: [
        "Yari's canoe is at the island dock. Are we going soon, Gigi?",
        'Everything is done in Pòdlimyè. Go to the canoe at the dock.',
        'Go to the dock south of the temple, to the canoe, and tell Yari you are ready.',
      ],
    },
  ],
};

export const JOURNAL_NOTES: readonly JournalNote[] = [
  {
    id: 'locket',
    when: 'item.sun_locket',
    title: 'The Sun Locket',
    text: 'Grandfather made it the year of the Accord. Where the air shimmers, press Echo to step into what the place remembers. Only anchors carry a change back.',
  },
  {
    id: 'night_orders',
    when: 'clue.night_orders',
    title: 'Night orders (Grandfather)',
    text: 'Raise the Chain Bridge to the Temple island at dusk. To lower: turn the winch, then drive the iron pin through the pawl, or she creeps back up by morning.',
  },
  // Changes carried back from the Echo by anchors (the changed object also glows on the way back).
  {
    id: 'changed_night_orders',
    when: 'anchor.night_orders',
    title: 'Something changed',
    text: "Grandfather's night orders are under the loose floorboard by the study window now, where he left them fifty years ago.",
  },
  {
    id: 'changed_chain_bridge',
    when: 'anchor.chain_bridge',
    title: 'Something changed',
    text: 'The Chain Bridge is down in the present: young Patricio pinned the pawl, and it has held for fifty years.',
  },
];

/** Every chapter, in order (the demo has one; the full game adds Chapter 2): the Journal and the quest arrows. */
export const CHAPTERS: readonly QuestDef[] = [ACT1];
