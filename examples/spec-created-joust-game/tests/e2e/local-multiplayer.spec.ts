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
});
