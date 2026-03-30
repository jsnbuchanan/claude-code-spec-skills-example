import { test, expect } from '@playwright/test';

// AC-1: Flap-to-fly physics at 60fps
// Fidelity: live (Playwright against Vite dev server)

test.describe('AC-1: Flap Physics', () => {
  test('player gains >50px upward within 300ms of flap and falls under gravity', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));

    // Get initial position
    const initialPos = await page.evaluate(() => window.game.getPlayerPosition(0));
    expect(initialPos).not.toBeNull();

    // Press flap key and measure within 300ms window
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(250);

    const afterFlap = await page.evaluate(() => window.game.getPlayerPosition(0));
    expect(afterFlap).not.toBeNull();
    // Must rise >50px (Y decreases in screen coords)
    expect(initialPos!.y - afterFlap!.y).toBeGreaterThan(50);

    // Wait for gravity to pull back down
    await page.waitForTimeout(800);
    const afterGravity = await page.evaluate(() => window.game.getPlayerPosition(0));
    expect(afterGravity!.y).toBeGreaterThan(afterFlap!.y);
  });

  test('character lands on platforms with correct collision', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));

    // Let character fall to a platform
    await page.waitForTimeout(1500);

    const pos = await page.evaluate(() => window.game.getPlayerPosition(0));
    expect(pos).not.toBeNull();

    // Wait additional time and verify character is resting (not falling)
    await page.waitForTimeout(500);
    const posAfterRest = await page.evaluate(() => window.game.getPlayerPosition(0));
    expect(posAfterRest).not.toBeNull();

    // Y should be stable (resting on platform)
    expect(Math.abs(posAfterRest!.y - pos!.y)).toBeLessThan(2);
  });

  test('screen-wraps horizontally', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));

    // Move player to right edge and verify wrap
    await page.evaluate(() => {
      window.game.spawnEntity('player', { x: 790, y: 300 }, { playerIndex: 0 });
    });

    // Press right movement to push past edge
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(500);
    await page.keyboard.up('ArrowRight');

    const pos = await page.evaluate(() => window.game.getPlayerPosition(0));
    expect(pos).not.toBeNull();
    // Should have wrapped to left side
    expect(pos!.x).toBeLessThan(100);
  });

  test('maintains 60fps during gameplay', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));

    // Let game run for a moment
    await page.waitForTimeout(2000);

    const fps = await page.evaluate(() => window.game.getFPS());
    expect(fps).toBeGreaterThanOrEqual(55);
  });
});
