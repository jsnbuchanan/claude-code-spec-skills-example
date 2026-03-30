import { test, expect } from '@playwright/test';

// AC-7: Visual effects and performance
// Fidelity: live (Playwright + FPS/frame-time metrics)

test.describe('AC-7: Visual Effects & Performance', () => {
  test('particle effects render during combat without dropping below 55fps', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));

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

    // Check FPS stayed above 55
    const fps = await page.evaluate(() => window.game.getFPS());
    expect(fps).toBeGreaterThanOrEqual(55);

    // Check no individual frame exceeded 18ms
    const frameTimes = await page.evaluate(() => window.game.getFrameTimes());
    const maxFrame = Math.max(...frameTimes.slice(-300)); // last 5 sec at 60fps
    expect(maxFrame).toBeLessThanOrEqual(18);

    // Particles should have been active
    const particleCount = await page.evaluate(() => window.game.getParticleCount());
    expect(particleCount).toBeGreaterThan(0);
  });
});
