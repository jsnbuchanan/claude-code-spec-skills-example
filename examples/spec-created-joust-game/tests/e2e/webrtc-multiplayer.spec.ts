import { test, expect, chromium } from '@playwright/test';

// AC-6: WebRTC multiplayer
// Fidelity: integration (Playwright dual browser context)

test.describe('AC-6: WebRTC Multiplayer', () => {
  test('two peers connect and see each other in real-time', async () => {
    const browser = await chromium.launch();

    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Player 1 creates a room
    await page1.goto('/');
    await page1.waitForFunction(() => window.game !== undefined);
    await page1.evaluate(() => window.game.setTestMode(true));

    // Simulate room creation — get invite code
    // This will be wired to the actual networking module
    const roomCode = await page1.evaluate(() => {
      // @ts-expect-error — networking API not yet implemented
      return window.game.createRoom?.() ?? 'test-room';
    });

    // Player 2 joins via room code
    await page2.goto(`/?room=${roomCode}`);
    await page2.waitForFunction(() => window.game !== undefined);

    // Wait for connection
    await page2.waitForTimeout(3000);

    // Verify both contexts see two players
    const p1Entities = await page1.evaluate(() => window.game.getEntities('player'));
    const p2Entities = await page2.evaluate(() => window.game.getEntities('player'));

    expect(p1Entities.length).toBe(2);
    expect(p2Entities.length).toBe(2);

    // Player 1 moves — Player 2 should see the update
    await page1.keyboard.press('ArrowUp');
    await page1.waitForTimeout(200);

    const p1Pos = await page1.evaluate(() => window.game.getPlayerPosition(0));
    const p2SeesP1 = await page2.evaluate(() => window.game.getPlayerPosition(0));

    // Positions should be approximately synced (within latency tolerance)
    expect(Math.abs(p1Pos!.y - p2SeesP1!.y)).toBeLessThan(50);

    await context1.close();
    await context2.close();
    await browser.close();
  });
});
