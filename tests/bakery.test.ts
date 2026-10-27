// Z-5 Bread With No Debt (Chapter 1, the harbor bakery; ported Oct 27 from the full game's quest/tests/sideQuestsMid.test.ts):
// walked through in the simulator from the route's own save once Chapter 1's errands are done (the route never takes it),
// paid once, never offered before the errands (so never on the gold arrow's way), closed when Yari sails.

import { describe, expect, it } from 'vitest';
import { BAKERY, BAKERY_TOWN_DOOR, Z5 } from '../src/data/bakery.ts';
import { RPG } from '../src/data/rpg.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { mysteryQuests } from '../src/engine/guide.ts';
import { gold, localPillar, sharedXp } from '../src/engine/rpg.ts';
import { settleRewards, sideQuestStatus } from '../src/engine/sideQuests.ts';
import { Sim, parseRoute } from '../src/engine/sim.ts';
import { loadMaps, newGameSim, readJson } from '../tools/sim-setup.ts';

const maps = loadMaps();
const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));
const quest = SIDE_QUESTS.find((q) => q.id === 'no_debt')!;

/** The game as the route leaves it at a marker. */
function simAt(mark: string): Sim {
  const sim = newGameSim(maps);
  for (const item of route) {
    if (item.kind === 'mark' && item.name === mark) return sim;
    sim.run([item]);
  }
  throw new Error(`No mark @${mark}`);
}

/** Press A through a conversation's lines until it offers a choice, then pick the k-th. */
function choose(sim: Sim, k: number): void {
  for (let i = 0; i < 40 && sim.logic.mode === 'dialogue' && sim.logic.view().kind !== 'choice'; i++) sim.run(['confirm']);
  expect(sim.logic.view().kind).toBe('choice');
  sim.run([...(k > 0 ? [`down*${k}`] : []), 'confirm']);
}

/** Chapter 1's own errands done (the route's mark), the captain's tract read, back over the bridge to the plaza. */
function errandsDone(): Sim {
  const sim = simAt('side-quests-done');
  sim.logic.state.flags.set(Z5.tract, true);
  sim.run(['goto 2,9', 'left']);
  expect(sim.logic.map.id).toBe('zetwal-town');
  return sim;
}

describe('Z-5 Bread With No Debt (Pòdlimyè, the harbor bakery)', () => {
  it('the guard, the hooded ones\' bread, the bakery\'s, the thumbprint, the grain store\'s memory, the baker; then her shop', () => {
    const sim = errandsDone();
    const flags = sim.logic.state.flags;
    settleRewards(flags, RPG, SIDE_QUESTS);
    expect(mysteryQuests(SIDE_QUESTS, flags).map((q) => q.id)).toContain('no_debt');
    sim.run(['goto 21,10', 'right', 'confirm']);
    choose(sim, 0);
    sim.run(['skip']);
    expect(sideQuestStatus(flags, quest)).toBe('active');
    sim.run(['goto 23,8', 'up', 'confirm', 'skip']);
    expect(flags.isSet(Z5.table)).toBe(true);
    sim.run([`goto ${BAKERY_TOWN_DOOR.x},${BAKERY_TOWN_DOOR.y + 1}`, 'up']);
    expect(sim.logic.map.id).toBe('zetwal-bakery');
    sim.run([`goto ${BAKERY.baker.x},${BAKERY.baker.y + 1}`, 'up', 'confirm', 'skip']);
    expect(flags.isSet(Z5.bakery)).toBe(true);
    sim.run(['goto 7,2', 'up', 'confirm', 'skip']);
    expect(flags.isSet(Z5.thumbprint)).toBe(true);
    sim.run(['goto 7,3', 'echo', 'skip']);
    expect(sim.logic.era).toBe('echo');
    expect(flags.isSet(Z5.order)).toBe(true);
    sim.run(['echo', 'skip']);
    expect(sim.logic.era).toBe('present');
    sim.run([`goto ${BAKERY.baker.x},${BAKERY.baker.y + 1}`, 'up', 'confirm', 'skip']);
    expect(flags.isSet(Z5.done)).toBe(true);
    const influence = localPillar(flags, RPG, 'influence', 'zetwal');
    const purse = gold(flags, RPG);
    const xp = sharedXp(flags, RPG);
    expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).toContain('no_debt');
    expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).not.toContain('no_debt');
    expect(gold(flags, RPG) - purse).toBe(30);
    expect(sharedXp(flags, RPG) - xp).toBe(0);
    expect(localPillar(flags, RPG, 'influence', 'zetwal') - influence).toBe(1);
    // From now on she sells bread at cost.
    expect(RPG.shops.zetwal_bakery!.stock).toEqual(['harbor_bread']);
    expect(RPG.items.harbor_bread!.price).toBeLessThan(RPG.items.kasav?.price ?? RPG.items.mango!.price);
  });

  it('not offered before Chapter 1\'s errands are done (never on the gold arrow\'s way); closed when Yari sails', () => {
    const flags = simAt('side-quests').logic.state.flags;
    flags.set(Z5.tract, true);
    expect(mysteryQuests(SIDE_QUESTS, flags).map((q) => q.id)).not.toContain('no_debt');
    const end = simAt('end-card').logic.state.flags;
    expect(sideQuestStatus(end, quest)).toBe('unknown');
    end.set(Z5.accepted, true);
    expect(sideQuestStatus(end, quest)).toBe('closed');
  });

  it('the store room\'s memory is open only once the guard has asked, and has no anchor', () => {
    expect(maps['zetwal-bakery']!.anchors).toEqual([]);
    const sim = errandsDone();
    sim.run([`goto ${BAKERY_TOWN_DOOR.x},${BAKERY_TOWN_DOOR.y + 1}`, 'up', `goto ${BAKERY.baker.x},${BAKERY.baker.y + 1}`, 'up', 'confirm', 'skip']);
    expect(sim.logic.state.flags.isSet(Z5.bakery)).toBe(false);
    sim.run(['goto 7,3', 'echo']);
    expect(sim.logic.era).toBe('present');
  });
});
