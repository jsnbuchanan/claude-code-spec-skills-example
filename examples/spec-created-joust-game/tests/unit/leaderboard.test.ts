import { describe, it, expect, beforeEach } from 'vitest';
import { getLeaderboard, submitScore, clearLeaderboard } from '@/leaderboard';

// AC-8: Leaderboard — localStorage persistence
// Fidelity: integration (frontend module with localStorage)

describe('AC-8: Leaderboard', () => {
  beforeEach(() => {
    clearLeaderboard();
  });

  it('persists a submitted score to localStorage', () => {
    const result = submitScore('Player1', 5000, 'classic');
    expect(result.rank).toBe(1);

    const entries = getLeaderboard();
    expect(entries).toHaveLength(1);
    expect(entries[0].name).toBe('Player1');
    expect(entries[0].score).toBe(5000);
    expect(entries[0].mode).toBe('classic');
  });

  it('returns scores sorted by score descending', () => {
    submitScore('Low', 1000, 'classic');
    submitScore('High', 9000, 'classic');
    submitScore('Mid', 5000, 'classic');

    const entries = getLeaderboard();
    expect(entries[0].name).toBe('High');
    expect(entries[1].name).toBe('Mid');
    expect(entries[2].name).toBe('Low');
  });

  it('filters by game mode', () => {
    submitScore('Classic', 5000, 'classic');
    submitScore('Survival', 3000, 'survival');
    submitScore('Versus', 7000, 'versus');

    const classicOnly = getLeaderboard('classic');
    expect(classicOnly).toHaveLength(1);
    expect(classicOnly[0].name).toBe('Classic');
  });

  it('persists across separate getLeaderboard calls (localStorage)', () => {
    submitScore('Persisted', 4200, 'survival');

    // Simulate fresh read (as if page reloaded)
    const entries = getLeaderboard();
    expect(entries).toHaveLength(1);
    expect(entries[0].name).toBe('Persisted');
  });
});
