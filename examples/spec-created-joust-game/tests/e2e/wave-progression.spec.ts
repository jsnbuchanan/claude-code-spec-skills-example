import { test, expect } from '@playwright/test';

// AC-4: Wave progression
// Fidelity: live (Playwright + window.game API)

test.describe('AC-4: Wave Progression', () => {
  test('next wave spawns with more/stronger enemies after clearing wave', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));

    // Check initial wave
    const wave1 = await page.evaluate(() => window.game.getWaveState());
    expect(wave1.waveNumber).toBe(1);

    const wave1Enemies = await page.evaluate(() => window.game.getWaveEnemies(1));
    expect(wave1Enemies.length).toBeGreaterThan(0);

    // Kill all enemies to advance wave
    await page.evaluate(() => window.game.killAllEnemies());
    await page.waitForTimeout(500);

    // Verify wave 2
    const wave2 = await page.evaluate(() => window.game.getWaveState());
    expect(wave2.waveNumber).toBe(2);

    const wave2Enemies = await page.evaluate(() => window.game.getWaveEnemies(2));
    expect(wave2Enemies.length).toBeGreaterThan(wave1Enemies.length);

    // Verify wave counter is displayed
    const waveText = await page.locator('[data-testid="wave-counter"]').textContent();
    expect(waveText).toContain('2');
  });
});
