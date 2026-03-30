import { test, expect } from '@playwright/test';

// AC-4: Wave progression
// Fidelity: live (Playwright + window.game API)

test.describe('AC-4: Wave Progression', () => {
  test('next wave spawns with more/stronger enemies after clearing wave', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));

    const wave1 = await page.evaluate(() => window.game.getWaveState());
    expect(wave1.waveNumber).toBe(1);

    const wave1Enemies = await page.evaluate(() => window.game.getWaveEnemies(1));
    expect(wave1Enemies.length).toBeGreaterThan(0);

    // Kill all enemies to advance wave
    await page.evaluate(() => window.game.killAllEnemies());
    await page.waitForTimeout(1000);

    const wave2 = await page.evaluate(() => window.game.getWaveState());
    expect(wave2.waveNumber).toBe(2);

    const wave2Enemies = await page.evaluate(() => window.game.getWaveEnemies(2));
    const hasMoreEnemies = wave2Enemies.length > wave1Enemies.length;
    const hasHigherTier = wave2Enemies.some(
      (e: any) => e.tier === 'hunter' || e.tier === 'shadow_lord'
    );
    expect(hasMoreEnemies || hasHigherTier).toBe(true);

    const waveText = await page.locator('[data-testid="wave-counter"]').textContent();
    expect(waveText).toContain('Wave 2');
  });

  test('enemy tier progression follows Bounder -> Hunter -> Shadow Lord', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));

    // Wave 1 should have bounders
    const wave1 = await page.evaluate(() => window.game.getWaveEnemies(1));
    expect(wave1.every((e: any) => e.tier === 'bounder')).toBe(true);

    // Advance to wave 4+ to see hunters (HUNTER_INTRO_WAVE = 3)
    for (let i = 0; i < 4; i++) {
      await page.evaluate(() => window.game.killAllEnemies());
      await page.waitForTimeout(800);
    }

    // Get the current wave number and its enemies
    const currentWave = await page.evaluate(() => window.game.getWaveState());
    const waveNum = currentWave.waveNumber;
    const enemies = await page.evaluate(
      (wn) => window.game.getWaveEnemies(wn),
      waveNum
    );
    const tiers = enemies.map((e: any) => e.tier);
    // Should include higher tiers by wave 5
    expect(tiers.some((t: string) => t !== 'bounder')).toBe(true);
  });
});
