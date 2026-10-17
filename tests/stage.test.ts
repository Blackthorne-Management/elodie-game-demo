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

  it('Chapter 1: Mother walks out through the east gate; Grandmother turns to the drawer for the locket', () => {
    const elodie = stageCues(script('elodie_talk'));
    expect(elodie).toContainEqual(expect.objectContaining({ do: 'exit', actor: 'npc:elodie' }));
    const locket = stageCues(script('anicette_talk'));
    expect(locket.filter((c: StageCue) => c.do === 'face' && c.actor === 'npc:anicette')).toHaveLength(2);
  });
});
