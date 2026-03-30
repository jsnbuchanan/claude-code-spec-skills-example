import { test, expect } from '@playwright/test';

// AC-5: Local 2-player on same keyboard
// Fidelity: live (Playwright multi-key input)

test.describe('AC-5: Local Multiplayer', () => {
  test('two players control independent characters with separate key bindings', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));

    // Spawn two players
    await page.evaluate(() => {
      window.game.spawnEntity('player', { x: 200, y: 300 }, { playerIndex: 0 });
      window.game.spawnEntity('player', { x: 600, y: 300 }, { playerIndex: 1 });
    });

    const p1Before = await page.evaluate(() => window.game.getPlayerPosition(0));
    const p2Before = await page.evaluate(() => window.game.getPlayerPosition(1));
    expect(p1Before).not.toBeNull();
    expect(p2Before).not.toBeNull();

    // Player 1 flaps (Arrow Up), Player 2 stays
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(200);

    const p1After = await page.evaluate(() => window.game.getPlayerPosition(0));
    const p2After = await page.evaluate(() => window.game.getPlayerPosition(1));

    // P1 should have moved up, P2 should be unchanged
    expect(p1After!.y).toBeLessThan(p1Before!.y);
    expect(p2After!.y).toBe(p2Before!.y);

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

    // Spawn players and an enemy
    await page.evaluate(() => {
      window.game.spawnEntity('player', { x: 200, y: 100 }, { playerIndex: 0 });
      window.game.spawnEntity('player', { x: 600, y: 100 }, { playerIndex: 1 });
      window.game.spawnEntity('enemy', { x: 400, y: 200 }, { tier: 'bounder' });
    });

    // Both players should see the same enemy
    const enemies = await page.evaluate(() => window.game.getEntities('enemy'));
    expect(enemies.length).toBe(1);

    // Player 1 defeats the enemy
    const players = await page.evaluate(() => window.game.getEntities('player'));
    const result = await page.evaluate(
      ([pId, eId]) => window.game.triggerCombat(pId, eId),
      [players[0].id, enemies[0].id]
    );
    expect(result).not.toBeNull();

    // Enemy should be gone for both players (shared world)
    const remainingEnemies = await page.evaluate(() => window.game.getEntities('enemy'));
    expect(remainingEnemies.length).toBe(0);
  });
});
