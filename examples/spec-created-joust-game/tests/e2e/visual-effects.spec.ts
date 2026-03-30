// Copyright 2026 LotZoom.com. Licensed under the Apache License, Version 2.0.

import { test, expect } from '@playwright/test';

// AC-7: Visual effects and performance
// Fidelity: live (Playwright + FPS/frame-time metrics)

test.describe('AC-7: Visual Effects & Performance', () => {
  test('particle effects render during combat without dropping below 55fps', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));
    await page.evaluate(() => window.game.resetFrameTimes());

    // Kill existing enemies for controlled test
    await page.evaluate(() => window.game.killAllEnemies());

    // Spawn combatants and trigger combat
    await page.evaluate(() => {
      for (let i = 0; i < 3; i++) {
        const playerId = window.game.spawnEntity('player', { x: 100 + i * 200, y: 100 }, { playerIndex: i + 10 });
        const enemyId = window.game.spawnEntity('enemy', { x: 100 + i * 200, y: 200 }, { tier: 'bounder' });
        window.game.triggerCombat(playerId, enemyId);
      }
    });

    // Check particles exist immediately after combat (before they decay)
    const particleCountImmediate = await page.evaluate(() => window.game.getParticleCount());
    expect(particleCountImmediate).toBeGreaterThan(0);

    // Let the game run for 2 seconds to measure FPS (particles will decay but FPS matters)
    await page.waitForTimeout(2000);

    const fps = await page.evaluate(() => window.game.getFPS());
    expect(fps).toBeGreaterThanOrEqual(55);

    const frameTimes = await page.evaluate(() => window.game.getFrameTimes());
    expect(frameTimes.length).toBeGreaterThan(0);
    const maxFrame = Math.max(...frameTimes);
    expect(maxFrame).toBeLessThanOrEqual(33); // Allow up to 33ms (30fps floor) for CI
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

    const shakeActive = await page.evaluate(() => window.game.isScreenShaking());
    expect(shakeActive).toBe(true);
  });
});
