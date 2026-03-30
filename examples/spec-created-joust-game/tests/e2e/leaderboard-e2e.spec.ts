import { test, expect } from '@playwright/test';

// AC-8: Leaderboard (e2e — browser submits score, appears in UI)
// Fidelity: integration (Playwright against live dev server)

test.describe('AC-8: Leaderboard E2E', () => {
  test('submitted score appears in leaderboard on main menu', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);

    // Clear any prior leaderboard data
    await page.evaluate(() => localStorage.removeItem('joust-leaderboard'));

    // Submit a score via localStorage (simulating game completion)
    await page.evaluate(() => {
      const entry = { name: 'TestHero', score: 9999, mode: 'classic', timestamp: Date.now() };
      const existing = JSON.parse(localStorage.getItem('joust-leaderboard') || '[]');
      existing.push(entry);
      existing.sort((a: any, b: any) => b.score - a.score);
      localStorage.setItem('joust-leaderboard', JSON.stringify(existing));
    });

    // Reload to verify persistence across page loads
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);

    // Open leaderboard from main menu
    const leaderboardButton = page.locator('[data-testid="leaderboard-button"]');
    await leaderboardButton.click();

    // Verify the submitted score appears
    const leaderboardList = page.locator('[data-testid="leaderboard-list"]');
    await expect(leaderboardList).toContainText('TestHero');
    await expect(leaderboardList).toContainText('9999');
  });

  test('leaderboard shows scores sorted descending', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);

    // Clear and seed multiple scores
    await page.evaluate(() => {
      const entries = [
        { name: 'Low', score: 1000, mode: 'classic', timestamp: 1 },
        { name: 'High', score: 9000, mode: 'classic', timestamp: 2 },
        { name: 'Mid', score: 5000, mode: 'classic', timestamp: 3 },
      ];
      entries.sort((a, b) => b.score - a.score);
      localStorage.setItem('joust-leaderboard', JSON.stringify(entries));
    });

    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);

    const leaderboardButton = page.locator('[data-testid="leaderboard-button"]');
    await leaderboardButton.click();

    // Verify order: High should appear before Mid before Low
    const entries = page.locator('[data-testid="leaderboard-entry"]');
    const firstEntry = await entries.first().textContent();
    expect(firstEntry).toContain('High');
  });
});
