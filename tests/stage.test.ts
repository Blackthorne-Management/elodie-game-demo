// Stage directions (owner rule, Oct 17: story moments are shown, not told): every staged scene names real looks
// and only moves people who are on stage; and Chapter 1's goodbyes are acted out, not narrated.

import { describe, expect, it } from 'vitest';
import { NPC_SPRITES } from '../src/assets.config.ts';
import { CONTENT } from '../src/data/content.ts';
import { stageCues, stageProblems, type StageCue } from '../src/engine/stage.ts';
import type { DialogueScript } from '../src/engine/dialogue.ts';

const looks = new Set(Object.keys(NPC_SPRITES));
const script = (id: string): DialogueScript => CONTENT.dialogue[id]!;

describe('stage directions', () => {
  it('every staged scene uses looks that exist and moves only people on stage', () => {
    const problems = Object.values(CONTENT.dialogue).flatMap((d) => stageProblems(d, looks, new Set(Object.keys(CONTENT.npcs))));
    expect(problems).toEqual([]);
  });

  it('flags a walk before an entrance, an unknown look, and a camera on nobody', () => {
    const bad: DialogueScript = {
      id: 'bad',
      start: 'a',
      nodes: {
        a: {
          lines: [
            { text: '', stage: [{ do: 'walk', actor: 'x', to: { x: 1, y: 1 } }] },
            { text: '', stage: [{ do: 'place', actor: 'y', look: 'nobody', at: { x: 1, y: 1 } }] },
            { text: '', stage: [{ do: 'look', actor: 'z' }] },
          ],
        },
      },
    };
    expect(stageProblems(bad, looks)).toHaveLength(3);
  });

});

// Chapter 1, the same in the demo and the full game (owner, Oct 17: identical up to leaving Zetwal).
describe('Chapter 1 is acted out on the map', () => {
  it('Mother walks out through the east gate; Grandmother turns to the drawer for the locket', () => {
    const elodie = stageCues(script('elodie_talk'));
    expect(elodie).toContainEqual(expect.objectContaining({ do: 'exit', actor: 'npc:elodie' }));
    const locket = stageCues(script('anicette_talk'));
    expect(locket.filter((c: StageCue) => c.do === 'face' && c.actor === 'npc:anicette')).toHaveLength(2);
  });

  // Demo review, Oct 17 (finding 7): the lamp night and Yari's arrival are shown, not told.
  it('the lamp: the island lights up, the pilgrims come in for the names, and a hooded figure watches, then leaves', () => {
    const cues = stageCues(script('gaze_lamp'));
    expect(cues).toContainEqual({ do: 'sync' }); // the lamp and the lanterns catch
    const entered = cues.filter((c) => c.do === 'enter').map((c) => c.actor);
    expect(entered).toEqual(expect.arrayContaining(['pilgrim_a', 'pilgrim_b', 'pilgrim_c', 'pilgrim_d', 'hooded']));
    const exits = cues.filter((c) => c.do === 'exit');
    expect(exits.map((c) => c.actor).sort()).toEqual(['hooded', 'pilgrim_a', 'pilgrim_b', 'pilgrim_c', 'pilgrim_d']);
    expect(exits.find((c) => c.actor === 'hooded')).toMatchObject({ to: { x: 15, y: 18 } }); // down to the dock
  });

  it("Yari comes up from her canoe to meet them, and turns to Gianna", () => {
    const cues = stageCues(script('yari_talk'));
    expect(cues).toContainEqual(expect.objectContaining({ do: 'enter', actor: 'yari', from: { x: 16, y: 18 } }));
    expect(cues).toContainEqual({ do: 'face', actor: 'yari', facing: 'player' });
  });
});
