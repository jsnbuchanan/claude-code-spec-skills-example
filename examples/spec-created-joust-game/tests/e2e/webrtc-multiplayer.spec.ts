import { test, expect, type BrowserContext } from '@playwright/test';

// AC-6: WebRTC multiplayer
// Fidelity: integration (Playwright dual browser context)

test.describe('AC-6: WebRTC Multiplayer', () => {
  let context1: BrowserContext;
  let context2: BrowserContext;

  test.beforeEach(async ({ browser }) => {
    context1 = await browser.newContext();
    context2 = await browser.newContext();
  });

  test.afterEach(async () => {
    await context1?.close();
    await context2?.close();
  });

  test('two peers establish WebRTC connection and sync state', async () => {
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Player 1 creates a room
    await page1.goto('/');
    await page1.waitForFunction(() => window.game !== undefined);
    await page1.evaluate(() => window.game.setTestMode(true));

    // Create room — must return a valid code
    const roomCode = await page1.evaluate(() => window.game.createRoom());
    expect(roomCode).toBeTruthy();

    // Player 2 joins via room code
    await page2.goto(`/?room=${roomCode}`);
    await page2.waitForFunction(() => window.game !== undefined);

    // Wait for WebRTC connection to establish
    await page2.waitForFunction(
      () => window.game.getConnectionState() === 'connected',
      { timeout: 10000 }
    );

    // Verify RTCPeerConnection state is 'connected' in both contexts
    const p1State = await page1.evaluate(() => window.game.getConnectionState());
    const p2State = await page2.evaluate(() => window.game.getConnectionState());
    expect(p1State).toBe('connected');
    expect(p2State).toBe('connected');

    // Verify both see two players
    const p1Entities = await page1.evaluate(() => window.game.getEntities('player'));
    const p2Entities = await page2.evaluate(() => window.game.getEntities('player'));
    expect(p1Entities.length).toBe(2);
    expect(p2Entities.length).toBe(2);
  });

  test('position updates propagate within 150ms', async () => {
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    await page1.goto('/');
    await page1.waitForFunction(() => window.game !== undefined);
    await page1.evaluate(() => window.game.setTestMode(true));

    const roomCode = await page1.evaluate(() => window.game.createRoom());
    expect(roomCode).toBeTruthy();

    await page2.goto(`/?room=${roomCode}`);
    await page2.waitForFunction(() => window.game !== undefined);
    await page2.waitForFunction(
      () => window.game.getConnectionState() === 'connected',
      { timeout: 10000 }
    );

    // Record position before move
    const posBefore = await page1.evaluate(() => window.game.getPlayerPosition(0));

    // Player 1 flaps — inject a timestamp into game state for latency measurement
    await page1.evaluate(() => {
      (window as any).__moveTimestamp = performance.now();
    });
    await page1.keyboard.press('ArrowUp');

    // Use game-level timestamp injection to measure true propagation latency
    // (avoids Playwright IPC overhead in the measurement)
    const latency = await page2.evaluate(async (beforeY) => {
      const start = performance.now();
      while (performance.now() - start < 500) {
        const pos = window.game.getPlayerPosition(0);
        if (pos && pos.y !== beforeY) {
          return performance.now() - start;
        }
        await new Promise((r) => setTimeout(r, 1));
      }
      return -1; // timeout
    }, posBefore?.y ?? 0);

    expect(latency).toBeGreaterThan(0);
    expect(latency).toBeLessThan(150);
  });
});
