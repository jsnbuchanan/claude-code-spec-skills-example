import { test, expect } from '@playwright/test';

// AC-1: Flap-to-fly physics at 60fps
// Fidelity: live (Playwright against Vite dev server)

test.describe('AC-1: Flap Physics', () => {
  test('player gains upward velocity on flap and falls under gravity', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);

    // Enable test mode for deterministic state
    await page.evaluate(() => window.game.setTestMode(true));

    // Get initial position
    const initialPos = await page.evaluate(() => window.game.getPlayerPosition(0));
    expect(initialPos).not.toBeNull();

    // Press flap key
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(100);

    // Character should have moved upward (Y decreases in screen coords)
    const afterFlap = await page.evaluate(() => window.game.getPlayerPosition(0));
    expect(afterFlap).not.toBeNull();
    expect(afterFlap!.y).toBeLessThan(initialPos!.y);

    // Wait for gravity to pull back down
    await page.waitForTimeout(500);
    const afterGravity = await page.evaluate(() => window.game.getPlayerPosition(0));
    expect(afterGravity!.y).toBeGreaterThan(afterFlap!.y);
  });

  test('character lands on platforms with correct collision', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));

    // Let character fall to a platform
    await page.waitForTimeout(1000);

    const pos = await page.evaluate(() => window.game.getPlayerPosition(0));
    expect(pos).not.toBeNull();

    // Character should be resting on a platform (not falling infinitely)
    const posAfterWait = await page.evaluate(() => window.game.getPlayerPosition(0));
    expect(posAfterWait!.y).toBe(pos!.y);
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
