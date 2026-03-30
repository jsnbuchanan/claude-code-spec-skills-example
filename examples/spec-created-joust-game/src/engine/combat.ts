import type { Entity, Player, CombatResult } from '../types';
import { getEntity, removeEntity, createEggEntity } from './entities';
import * as C from './constants';

export function resolveCombat(entityAId: string, entityBId: string): CombatResult | null {
  const a = getEntity(entityAId);
  const b = getEntity(entityBId);
  if (!a || !b) return null;

  // Lance height = lower Y position wins (higher on screen)
  const aLanceY = a.position.y;
  const bLanceY = b.position.y;

  let winner: Entity;
  let loser: Entity;

  if (aLanceY < bLanceY) {
    winner = a;
    loser = b;
  } else if (bLanceY < aLanceY) {
    winner = b;
    loser = a;
  } else {
    return null; // same height — no winner
  }

  let eggSpawned = false;

  if (loser.type === 'enemy') {
    // Enemies are removed and drop an egg
    const tier = (loser as any).tier ?? 'bounder';
    createEggEntity({ ...loser.position }, tier);
    removeEntity(loser.id);
    eggSpawned = true;
  } else if (loser.type === 'player') {
    // Players lose a life and respawn — not removed
    const player = loser as Player;
    player.lives--;
    if (player.lives <= 0) {
      removeEntity(player.id);
    } else {
      // Respawn at spawn point
      const spawn = C.PLAYER_SPAWNS[player.playerIndex] ?? C.PLAYER_SPAWNS[0];
      player.position = { ...spawn };
      player.velocity = { x: 0, y: 0 };
    }
  }

  return {
    winner: winner.id,
    loser: loser.id,
    eggSpawned,
  };
}
