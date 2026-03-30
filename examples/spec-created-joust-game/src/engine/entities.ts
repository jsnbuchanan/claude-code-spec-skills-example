import type { Entity, Player, Enemy, Egg, EnemyTier, Vector2, PlayerAvatar } from '../types';
import * as C from './constants';

let nextId = 0;
const entities: Map<string, Entity> = new Map();

export function generateId(): string {
  return `e_${nextId++}`;
}

export function clearEntities(): void {
  entities.clear();
}

export function addEntity(entity: Entity): void {
  entities.set(entity.id, entity);
}

export function removeEntity(id: string): void {
  entities.delete(id);
}

export function getEntity(id: string): Entity | undefined {
  return entities.get(id);
}

export function getEntitiesByType(type?: Entity['type']): Entity[] {
  const all = Array.from(entities.values());
  if (!type) return all;
  return all.filter((e) => e.type === type);
}

export function getPlayers(): Player[] {
  return getEntitiesByType('player') as Player[];
}

export function getEnemies(): Enemy[] {
  return getEntitiesByType('enemy') as Enemy[];
}

export function getEggs(): Egg[] {
  return getEntitiesByType('egg') as Egg[];
}

export function createPlayer(position: Vector2, playerIndex: number, avatar?: PlayerAvatar): Player {
  const player: Player = {
    id: generateId(),
    type: 'player',
    position: { ...position },
    velocity: { x: 0, y: 0 },
    width: C.PLAYER_WIDTH,
    height: C.PLAYER_HEIGHT,
    playerIndex,
    score: 0,
    lives: C.STARTING_LIVES,
    isFlapping: false,
    hasShield: false,
    lanceHeight: 0,
    avatar,
    headBobblePhase: 0,
    headTiltAngle: 0,
    triumphTimer: 0,
    deathTimer: 0,
    isDying: false,
  };
  addEntity(player);
  return player;
}

export function createEnemy(position: Vector2, tier: EnemyTier): Enemy {
  const enemy: Enemy = {
    id: generateId(),
    type: 'enemy',
    position: { ...position },
    velocity: { x: (Math.random() > 0.5 ? 1 : -1) * C.ENEMY_SPEED[tier], y: 0 },
    width: C.ENEMY_WIDTH,
    height: C.ENEMY_HEIGHT,
    tier,
  };
  addEntity(enemy);
  return enemy;
}

export function createEggEntity(position: Vector2, sourceTier: EnemyTier): Egg {
  const egg: Egg = {
    id: generateId(),
    type: 'egg',
    position: { ...position },
    velocity: { x: 0, y: 2 },
    width: C.EGG_WIDTH,
    height: C.EGG_HEIGHT,
    hatchTimer: 0,
    hatchTimeout: C.EGG_HATCH_TIMEOUT,
    sourceTier,
  };
  addEntity(egg);
  return egg;
}

export function getNextTier(tier: EnemyTier): EnemyTier {
  if (tier === 'bounder') return 'hunter';
  if (tier === 'hunter') return 'shadow_lord';
  return 'shadow_lord';
}
