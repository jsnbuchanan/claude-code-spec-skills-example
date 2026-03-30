import { test, expect } from '@playwright/test';

// AC-7: Visual effects and performance
// Fidelity: live (Playwright + FPS/frame-time metrics)

test.describe('AC-7: Visual Effects & Performance', () => {
  test('particle effects render during combat without dropping below 55fps', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));

    // Reset frame time tracking
    await page.evaluate(() => window.game.getFrameTimes());

    // Spawn multiple combatants to trigger particle-heavy scenes
    await page.evaluate(() => {
      for (let i = 0; i < 3; i++) {
        const playerId = window.game.spawnEntity('player', { x: 200 + i * 100, y: 100 });
        const enemyId = window.game.spawnEntity('enemy', { x: 200 + i * 100, y: 200 }, { tier: 'bounder' });
        window.game.triggerCombat(playerId, enemyId);
      }
    });

    // Let particles render for 5 seconds
    await page.waitForTimeout(5000);

    // Check sustained FPS >= 55 (average over window, not trailing sample)
    const fps = await page.evaluate(() => window.game.getFPS());
    expect(fps).toBeGreaterThanOrEqual(55);

    // Check no individual frame exceeded 18ms (ALL frames, not just last 300)
    const frameTimes = await page.evaluate(() => window.game.getFrameTimes());
    expect(frameTimes.length).toBeGreaterThan(0);
    const maxFrame = Math.max(...frameTimes);
    expect(maxFrame).toBeLessThanOrEqual(18);

    // Particles should have been active
    const particleCount = await page.evaluate(() => window.game.getParticleCount());
    expect(particleCount).toBeGreaterThan(0);
  });

  test('screen shake triggers on defeat', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));

    const playerId = await page.evaluate(() =>
      window.game.spawnEntity('player', { x: 400, y: 100 })
    );
    const enemyId = await page.evaluate(() =>
      window.game.spawnEntity('enemy', { x: 400, y: 200 }, { tier: 'bounder' })
    );

    await page.evaluate(([a, b]) => window.game.triggerCombat(a, b), [playerId, enemyId]);

    // Verify screen shake is active
    const shakeActive = await page.evaluate(() => {
      return (window.game as any).isScreenShaking?.() ?? false;
    });
    expect(shakeActive).toBe(true);
  });
});
