import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// AC-3: Egg lifecycle — hatch timeout and collection
// Fidelity: integration (game logic with controllable clock)

describe('AC-3: Egg Lifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('hatches into a stronger enemy when not collected within timeout', async () => {
    const { createEgg, getEntities, tick } = await import('@/engine/egg');

    // Spawn an egg from a defeated bounder
    createEgg({ x: 400, y: 300 }, 'bounder');

    const eggsBefore = getEntities('egg');
    expect(eggsBefore).toHaveLength(1);

    // Advance past hatch timeout
    const HATCH_TIMEOUT_MS = 5000;
    for (let i = 0; i < HATCH_TIMEOUT_MS / 16; i++) {
      tick(16);
    }

    // Egg should be gone, replaced by a higher-tier enemy
    const eggsAfter = getEntities('egg');
    expect(eggsAfter).toHaveLength(0);

    const enemies = getEntities('enemy');
    expect(enemies).toHaveLength(1);
    // Bounder egg hatches into hunter (next tier)
    expect(enemies[0].tier).toBe('hunter');
  });

  it('awards score when player collects egg before hatch timeout', async () => {
    const { createEgg, collectEgg, getEntities } = await import('@/engine/egg');

    createEgg({ x: 400, y: 300 }, 'bounder');
    expect(getEntities('egg')).toHaveLength(1);

    // Collect the egg
    const result = collectEgg(getEntities('egg')[0].id, 0);

    expect(result.scoreAwarded).toBeGreaterThan(0);
    expect(getEntities('egg')).toHaveLength(0);
    // No enemy should spawn
    expect(getEntities('enemy')).toHaveLength(0);
  });
});
