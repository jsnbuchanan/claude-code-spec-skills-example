import { test, expect } from '@playwright/test';

// AC-2: Lance-height combat
// Fidelity: live (Playwright + window.game test API)

test.describe('AC-2: Lance Combat', () => {
  test('higher lance wins combat, egg spawns, particles play', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));

    // Kill existing enemies to isolate the test
    await page.evaluate(() => window.game.killAllEnemies());

    // Spawn player at high position, enemy far away horizontally so egg isn't auto-collected
    const playerId = await page.evaluate(() =>
      window.game.spawnEntity('player', { x: 100, y: 100 }, { playerIndex: 2 })
    );

    const enemyId = await page.evaluate(() =>
      window.game.spawnEntity('enemy', { x: 500, y: 200 }, { tier: 'bounder' })
    );

    // Trigger combat
    const result = await page.evaluate(
      ([a, b]) => window.game.triggerCombat(a, b),
      [playerId, enemyId]
    );

    expect(result).not.toBeNull();
    expect(result!.winner).toBe(playerId);
    expect(result!.loser).toBe(enemyId);
    expect(result!.eggSpawned).toBe(true);

    // Particles should be active immediately after combat
    const particleCount = await page.evaluate(() => window.game.getParticleCount());
    expect(particleCount).toBeGreaterThan(0);

    // Egg should exist (spawned at enemy position, far from player)
    const eggs = await page.evaluate(() => window.game.getEntities('egg'));
    expect(eggs.length).toBeGreaterThanOrEqual(1);
  });

  test('lower lance loses combat', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));

    // Player below enemy
    const playerId = await page.evaluate(() =>
      window.game.spawnEntity('player', { x: 400, y: 300 })
    );
    const enemyId = await page.evaluate(() =>
      window.game.spawnEntity('enemy', { x: 400, y: 100 }, { tier: 'bounder' })
    );

    const result = await page.evaluate(
      ([a, b]) => window.game.triggerCombat(a, b),
      [playerId, enemyId]
    );

    expect(result).not.toBeNull();
    expect(result!.winner).toBe(enemyId);
    expect(result!.loser).toBe(playerId);
  });
});
