import type { Entity, CombatResult } from '../types';
import { getEntity, removeEntity, createEggEntity } from './entities';

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
    // Same height — no winner
    return null;
  }

  // Remove loser
  removeEntity(loser.id);

  // Spawn egg at loser's position if loser is enemy
  let eggSpawned = false;
  if (loser.type === 'enemy') {
    const tier = (loser as any).tier ?? 'bounder';
    createEggEntity({ ...loser.position }, tier);
    eggSpawned = true;
  }

  return {
    winner: winner.id,
    loser: loser.id,
    eggSpawned,
  };
}
