import type { Vector2, EnemyTier, Egg, Enemy } from '../types';
import { createEggEntity, createEnemy, getNextTier, removeEntity, getEggs, getEnemies, clearEntities as clearAll } from './entities';
import * as C from './constants';

export { clearAll as clearEntities };

export function createEgg(position: Vector2, sourceTier: EnemyTier): Egg {
  return createEggEntity(position, sourceTier);
}

export function collectEgg(eggId: string, _playerIndex: number): { scoreAwarded: number } {
  removeEntity(eggId);
  return { scoreAwarded: C.EGG_SCORE_VALUE };
}

export function tick(dtMs: number): void {
  const eggs = getEggs();
  for (const egg of eggs) {
    egg.hatchTimer += dtMs;
    if (egg.hatchTimer >= egg.hatchTimeout) {
      // Hatch into next tier enemy
      const nextTier = getNextTier(egg.sourceTier);
      removeEntity(egg.id);
      createEnemy({ ...egg.position }, nextTier);
    }
  }
}

export function getEntities(type: 'egg'): Egg[];
export function getEntities(type: 'enemy'): (Enemy & { tier: EnemyTier })[];
export function getEntities(type: string): any[] {
  if (type === 'egg') return getEggs();
  if (type === 'enemy') return getEnemies();
  return [];
}
