// The testers' saves (owner, Nov 16): the beta testers are part way through the Chapter 1 demo that has been live since
// Oct 22 (commit f426968), and the update must not lose their progress. The fixture holds every autosave the Oct 22
// build's scripted route made, as the save codes that build wrote (tests/fixtures/live-oct22-saves.json). Each must load
// on this build where it was made and play on; and from every point of the story, the Oct 22 progress plays on to the
// end of the chapter on this build's route (the quests added since, Z-4 and Z-5 among them, are done on the way).

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SAVE_STORAGE_KEY } from '../src/config.ts';
import { CONTENT } from '../src/data/content.ts';
import { SAVE_FALLBACKS } from '../src/data/saveFallbacks.ts';
import { GameLogic } from '../src/engine/game.ts';
import { decodeSave, type SaveData } from '../src/engine/save.ts';
import { standable } from '../src/engine/saveCompat.ts';
import { Sim, parseRoute } from '../src/engine/sim.ts';
import { applySave, loadStoredSave, newGame, placeSave } from '../src/engine/state.ts';
import { loadMaps, newGameSim, readJson, winBattles } from '../tools/sim-setup.ts';

const maps = loadMaps();
const LIVE = JSON.parse(readFileSync(new URL('./fixtures/live-oct22-saves.json', import.meta.url), 'utf8')) as { mark: string; code: string }[];
const ROUTE = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));

function decoded(code: string): SaveData {
  const r = decodeSave(code);
  if (!r.ok) throw new Error(r.error);
  return r.data;
}

describe("the testers' Oct 22 saves", () => {
  it('are all there: the whole chapter, from the plaza to the end card', () => {
    expect(LIVE.length).toBeGreaterThan(40);
    expect(decoded(LIVE.at(-1)!.code).flags['act1.complete']).toBeTruthy();
  });

  it('the save sits where it always did (same storage key, same code), and every one loads where it was made', () => {
    expect(SAVE_STORAGE_KEY).toBe('bloodlines-quest.save');
    for (const s of LIVE) {
      const store = new Map<string, string>([[SAVE_STORAGE_KEY, s.code]]);
      const storage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) };
      expect(loadStoredSave(storage, SAVE_STORAGE_KEY, maps, SAVE_FALLBACKS), `@${s.mark}`).toMatchObject({ status: 'loaded' });
      const data = decoded(s.code);
      const placed = placeSave(data, maps, SAVE_FALLBACKS)!;
      expect(placed, `@${s.mark}`).not.toBeNull();
      expect(placed.moved, `@${s.mark} ${data.mapId} ${data.x},${data.y}`).toBe(false);
      // Loaded as the browser does, the field is free and the party can walk away.
      const state = newGame(maps[placed.data.mapId]!, '');
      applySave(state, placed.data);
      const sim = new Sim(new GameLogic(maps, CONTENT, state));
      winBattles(sim);
      sim.logic.reset();
      for (const e of sim.logic.enterMap()) if (e.kind === 'battle') sim.onBattle?.(e.battle);
      for (let i = 0; i < 40 && sim.logic.mode !== 'field'; i++) {
        if (sim.logic.mode === 'dialogue') sim.run(['skip']);
        else sim.press('confirm');
      }
      const p = sim.logic.state.player;
      expect(sim.logic.mode, `@${s.mark}`).toBe('field');
      expect(standable(maps[p.mapId]!, p.pos, p.era, sim.logic.state.flags), `@${s.mark}`).toBe(true);
      // Nothing is lost: every flag the save had is still set (gold, party, quests, the story so far).
      for (const [k, v] of Object.entries(data.flags)) if (v !== false && v !== 0 && !/^(fight|battle)\./.test(k)) expect(sim.logic.state.flags.has(k), `@${s.mark} ${k}`).toBe(true);
    }
  });

  // From each point of the story: this build's route up to that point, with the Oct 22 save's progress put in its place
  // (the flags of the last Oct 22 autosave before it), then this build's route on to the end card.
  const marks = ROUTE.flatMap((it, i) => (it.kind === 'mark' ? [{ name: it.name, i }] : []));
  for (const [n, m] of marks.entries()) {
    const before = new Set(marks.slice(0, n).map((x) => x.name));
    const prior = LIVE.filter((s) => before.has(s.mark) || s.mark === 'start').at(-1);
    if (!prior) continue;
    it(`progress saved before @${m.name} plays on to the end of the chapter`, () => {
      const sim = newGameSim(maps);
      sim.run(ROUTE.slice(0, m.i));
      sim.logic.state.flags.load(decoded(prior.code).flags as never);
      sim.run(ROUTE.slice(m.i));
      expect(sim.logic.state.flags.isSet('act1.complete')).toBe(true);
    });
  }
});
