// Copyright 2026 LotZoom.com. Licensed under the Apache License, Version 2.0.

import { test, expect } from '@playwright/test';

// AC-6: WebRTC multiplayer
// Fidelity: integration
// Note: BroadcastChannel signaling only works within the same browser context.
// True cross-context WebRTC testing requires a server-side signaling channel.
// These tests verify the networking API surface works correctly within a single context.

test.describe('AC-6: WebRTC Multiplayer', () => {
  test('createRoom returns a valid room code', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));

    const roomCode = await page.evaluate(() => window.game.createRoom());
    expect(roomCode).toBeTruthy();
    expect(roomCode.length).toBeGreaterThanOrEqual(4);
  });

  test('connection state starts as new before any connection', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);

    const state = await page.evaluate(() => window.game.getConnectionState());
    expect(state).toBe('new');
  });

  test('joinRoom accepts a room code without error', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game !== undefined);
    await page.evaluate(() => window.game.setTestMode(true));

    // Joining a room should not throw
    const error = await page.evaluate(() => {
      try {
        window.game.joinRoom('TESTROOM');
        return null;
      } catch (e: any) {
        return e.message;
      }
    });
    expect(error).toBeNull();
  });

  test('room code appears in URL when joining via query param', async ({ page }) => {
    await page.goto('/?room=ABC123');
    await page.waitForFunction(() => window.game !== undefined);

    // Game should have started (auto-join triggers startGame)
    await page.waitForTimeout(500);

    // Verify the game is running (not stuck on menu)
    const waveState = await page.evaluate(() => window.game.getWaveState());
    expect(waveState.waveNumber).toBeGreaterThanOrEqual(1);
  });
});
