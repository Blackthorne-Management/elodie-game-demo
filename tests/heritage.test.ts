// Skin tones by heritage (owner direction, Oct 29): most of Zetwal's townsfolk share its Haitian heritage's tones
// (LAND_SKIN) and a few are immigrants from elsewhere; the Quiet Crown comes from everywhere. And the festival crowds
// are many different people (owner, Oct 29: "too many duplicate people").

import { describe, expect, it } from 'vitest';
import { LAND_SKIN, NPC_SPRITES } from '../src/assets.config.ts';
import { CONTENT } from '../src/data/content.ts';
import { crowdLooks, crowdSpots, nearEnough } from '../src/engine/crowd.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { Rng } from '../src/engine/rng.ts';
import { isOpen } from '../src/engine/world.ts';
import { loadMaps } from '../tools/sim-setup.ts';

const maps = loadMaps();
/** The named people (their looks are their own) and the Crown's consul (the Crown comes from everywhere). */
const OWN = new Set(['gianna', 'patricio_young', 'anissa', 'elodie', 'anicette', 'patricio_old', 'yari', 'echo_solange', 'crown_consul']);
const skinOf = (look: string) => NPC_SPRITES[look]!.skin;

describe('skin tones by land (owner direction, Oct 29)', () => {
  it('zetwal: most townsfolk share its heritage, and a few are immigrants', () => {
    const looks = new Set<string>();
    for (const [id, map] of Object.entries(maps)) {
      if (!id.startsWith('zetwal-')) continue;
      for (const n of map.npcs) looks.add(CONTENT.npcs[n.npc]!.look);
      for (const z of map.crowds) for (const l of z.looks) looks.add(l);
    }
    const folk = [...looks].filter((l) => !OWN.has(l) && !l.startsWith('quiet_crown_'));
    const local = new Set(LAND_SKIN.zetwal);
    const immigrants = folk.filter((l) => !local.has(skinOf(l)));
    expect(folk.length).toBeGreaterThanOrEqual(10);
    expect(immigrants.length).toBeGreaterThanOrEqual(1);
    expect(immigrants.length / folk.length, immigrants.join(', ')).toBeLessThanOrEqual(0.25);
  });

  it('the Quiet Crown comes from everywhere', () => {
    const tones = new Set(Object.keys(NPC_SPRITES).filter((l) => l.startsWith('quiet_crown_')).map(skinOf));
    expect(tones.size).toBeGreaterThanOrEqual(4);
  });
});

describe('the crowds are many different people (owner, Oct 29)', () => {
  const zones = Object.values(maps).flatMap((m) => m.crowds.map((z) => ({ map: m, z })));

  it('every crowd has at least as many looks as people, and the festival twenty-four', () => {
    for (const { z } of zones) expect(new Set(z.looks).size, z.id).toBeGreaterThanOrEqual(z.count);
    const plaza = maps['zetwal-town']!.crowds.find((z) => z.id === 'plaza_festival')!;
    expect(new Set(plaza.looks).size).toBeGreaterThanOrEqual(24);
    // Different people, not one drawing in other colours: hair, headgear, build and what they carry differ.
    const shapes = plaza.looks.map((l) => {
      const c = NPC_SPRITES[l]!;
      return `${c.hairStyle}/${c.headgear ?? '-'}/${c.build ?? 'normal'}/${c.robe ? 'robe' : 'legs'}/${(c.accessories ?? []).join('+')}/${c.beard ? 'beard' : ''}`;
    });
    expect(new Set(shapes).size).toBeGreaterThanOrEqual(20);
  });

  it('nobody stands near someone who looks the same', () => {
    for (const { map, z } of zones) {
      const open = (p: { x: number; y: number }) => isOpen(map, 'present', p, new FlagStore());
      for (let seed = 0; seed < 20; seed++) {
        const rng = new Rng(seed);
        const spots = crowdSpots(z, open, rng);
        const looks = crowdLooks(spots, z.looks, rng);
        for (let i = 0; i < spots.length; i++) {
          for (let j = i + 1; j < spots.length; j++) {
            if (looks[i] === looks[j]) expect(nearEnough(spots[i]!, spots[j]!), `${z.id} seed ${seed}: ${looks[i]}`).toBe(false);
          }
        }
      }
    }
  });

  it('keeps away from the people already there who look the same, and wears every look once before twice', () => {
    const spots = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }];
    for (let seed = 0; seed < 30; seed++) {
      const looks = crowdLooks(spots, ['a', 'b', 'c', 'd'], new Rng(seed), [{ at: { x: 1, y: 1 }, look: 'a' }]);
      expect(looks).not.toContain('a');
      expect(new Set(looks).size).toBe(3);
    }
    expect(crowdLooks(spots, ['a'], new Rng(1))).toEqual(['a', 'a', 'a']); // one look: it has to repeat
  });
});
