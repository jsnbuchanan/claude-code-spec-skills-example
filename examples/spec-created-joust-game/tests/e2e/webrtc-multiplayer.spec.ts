import { test, expect, type Browser, type BrowserContext } from '@playwright/test';

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

    // Create room and get invite code
    const roomCode = await page1.evaluate(() => {
      return (window.game as any).createRoom?.() ?? 'test-room';
    });

    // Player 2 joins via room code
    await page2.goto(`/?room=${roomCode}`);
    await page2.waitForFunction(() => window.game !== undefined);

    // Wait for WebRTC connection
    await page2.waitForTimeout(3000);

    // Verify RTCPeerConnection state is 'connected' in both contexts
    const p1ConnectionState = await page1.evaluate(() => {
      return (window.game as any).getConnectionState?.() ?? 'unknown';
    });
    const p2ConnectionState = await page2.evaluate(() => {
      return (window.game as any).getConnectionState?.() ?? 'unknown';
    });
    expect(p1ConnectionState).toBe('connected');
    expect(p2ConnectionState).toBe('connected');

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

    const roomCode = await page1.evaluate(() => {
      return (window.game as any).createRoom?.() ?? 'test-room';
    });

    await page2.goto(`/?room=${roomCode}`);
    await page2.waitForFunction(() => window.game !== undefined);
    await page2.waitForTimeout(3000);

    // Player 1 moves
    const moveBefore = await page1.evaluate(() => window.game.getPlayerPosition(0));
    await page1.keyboard.press('ArrowUp');

    // Measure latency: poll peer B for position update
    const startTime = Date.now();
    let synced = false;
    while (Date.now() - startTime < 500) {
      const p2SeesP1 = await page2.evaluate(() => window.game.getPlayerPosition(0));
      if (p2SeesP1 && moveBefore && p2SeesP1.y !== moveBefore.y) {
        synced = true;
        const latency = Date.now() - startTime;
        expect(latency).toBeLessThan(150);
        break;
      }
      await page2.waitForTimeout(10);
    }
    expect(synced).toBe(true);
  });
});
