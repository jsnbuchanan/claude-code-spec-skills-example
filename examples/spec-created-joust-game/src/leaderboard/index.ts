// Copyright 2026 LotZoom.com. Licensed under the Apache License, Version 2.0.

import type { LeaderboardEntry, GameMode } from '../types';

const STORAGE_KEY = 'joust-leaderboard';

export function getLeaderboard(mode?: GameMode): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const entries: LeaderboardEntry[] = JSON.parse(raw);
    const filtered = mode ? entries.filter((e) => e.mode === mode) : entries;
    return filtered.sort((a, b) => b.score - a.score);
  } catch {
    return [];
  }
}

export function submitScore(name: string, score: number, mode: GameMode): { rank: number } {
  const entries = getLeaderboard();
  const entry: LeaderboardEntry = { name, score, mode, timestamp: Date.now() };
  entries.push(entry);
  entries.sort((a, b) => b.score - a.score);
  const top100 = entries.slice(0, 100);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(top100));
  const rank = top100.findIndex((e) => e === entry) + 1;
  return { rank };
}

export function clearLeaderboard(): void {
  localStorage.removeItem(STORAGE_KEY);
}
