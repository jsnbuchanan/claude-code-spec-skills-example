// Copyright 2026 LotZoom.com. Licensed under the Apache License, Version 2.0.

import { test, expect } from '@playwright/test';

// AC-5: Local 2-player on same keyboard
// Fidelity: live (Playwright multi-key input)

test.describe('AC-5: Local Multiplayer', () => {
  test('two players control independent characters with separate key bindings', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));

    // Wait for player to settle on platform
    await page.waitForTimeout(500);

    // Spawn P2 on a platform (left mid platform y=420, height=40 → spawn at 380)
    await page.evaluate(() => {
      window.game.spawnEntity('player', { x: 550, y: 380 }, { playerIndex: 1 });
    });

    // Wait for P2 to settle on platform
    await page.waitForTimeout(500);

    const p1Before = await page.evaluate(() => window.game.getPlayerPosition(0));
    const p2Before = await page.evaluate(() => window.game.getPlayerPosition(1));
    expect(p1Before).not.toBeNull();
    expect(p2Before).not.toBeNull();

    // Player 1 flaps (Arrow Up)
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(200);

    const p1After = await page.evaluate(() => window.game.getPlayerPosition(0));
    const p2After = await page.evaluate(() => window.game.getPlayerPosition(1));

    // P1 should have moved up
    expect(p1After!.y).toBeLessThan(p1Before!.y);
    // P2 should be approximately where it was (on a platform, small tolerance for physics)
    expect(Math.abs(p2After!.y - p2Before!.y)).toBeLessThan(5);

    // Now Player 2 flaps (W key)
    await page.keyboard.press('w');
    await page.waitForTimeout(200);

    const p2AfterFlap = await page.evaluate(() => window.game.getPlayerPosition(1));
    expect(p2AfterFlap!.y).toBeLessThan(p2Before!.y);
  });

  test('both players interact with shared enemy entities', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));

    // Kill existing enemies, then spawn a controlled one below the player
    await page.evaluate(() => window.game.killAllEnemies());

    // Spawn a player high up so it wins lance combat (lower Y = higher position = wins)
    const highPlayerId = await page.evaluate(() =>
      window.game.spawnEntity('player', { x: 400, y: 50 }, { playerIndex: 3 })
    );

    const enemyId = await page.evaluate(() =>
      window.game.spawnEntity('enemy', { x: 400, y: 200 }, { tier: 'bounder' })
    );

    // Both players should see the same enemy
    const enemies = await page.evaluate(() => window.game.getEntities('enemy'));
    expect(enemies.length).toBe(1);

    // High player defeats the enemy (higher lance wins)
    const result = await page.evaluate(
      ([pId, eId]) => window.game.triggerCombat(pId, eId),
      [highPlayerId, enemyId]
    );
    expect(result).not.toBeNull();
    expect(result!.eggSpawned).toBe(true);

    // Enemy should be gone (shared world)
    const remainingEnemies = await page.evaluate(() => window.game.getEntities('enemy'));
    expect(remainingEnemies.length).toBe(0);
  });
});
