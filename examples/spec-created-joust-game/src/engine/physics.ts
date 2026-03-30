import type { Entity, Player } from '../types';
import * as C from './constants';
import { getEntitiesByType } from './entities';

export function applyGravity(entity: Entity, dt: number): void {
  entity.velocity.y += C.GRAVITY * (dt / 16);
  if (entity.velocity.y > C.MAX_FALL_SPEED) {
    entity.velocity.y = C.MAX_FALL_SPEED;
  }
}

export function applyVelocity(entity: Entity, dt: number): void {
  const scale = dt / 16;
  entity.position.x += entity.velocity.x * scale;
  entity.position.y += entity.velocity.y * scale;
}

export function applyHorizontalDrag(entity: Entity): void {
  entity.velocity.x *= C.HORIZONTAL_DRAG;
  if (Math.abs(entity.velocity.x) < 0.1) {
    entity.velocity.x = 0;
  }
}

export function screenWrap(entity: Entity): void {
  // Horizontal wrap
  if (entity.position.x > C.WORLD_WIDTH) {
    entity.position.x = -entity.width;
  } else if (entity.position.x + entity.width < 0) {
    entity.position.x = C.WORLD_WIDTH;
  }
  // Vertical clamp — can't fly off top or fall past lava
  if (entity.position.y < -entity.height) {
    entity.position.y = -entity.height;
    entity.velocity.y = Math.max(entity.velocity.y, 0);
  }
  if (entity.position.y > C.WORLD_HEIGHT - 30) {
    // Hit lava — reset to a platform
    entity.position.y = C.WORLD_HEIGHT - 30 - entity.height;
    entity.velocity.y = -3; // bounce up a bit
  }
}

export function flap(player: Player): void {
  player.velocity.y = C.FLAP_IMPULSE;
  player.isFlapping = true;
}

export function checkPlatformCollision(entity: Entity): boolean {
  for (const platform of C.PLATFORMS) {
    const entityBottom = entity.position.y + entity.height;
    const entityRight = entity.position.x + entity.width;
    const platformRight = platform.x + platform.width;

    // Check horizontal overlap
    if (entity.position.x < platformRight && entityRight > platform.x) {
      // Check if entity is falling onto platform
      if (entity.velocity.y >= 0 && entityBottom >= platform.y && entityBottom <= platform.y + 10) {
        entity.position.y = platform.y - entity.height;
        entity.velocity.y = 0;
        if ((entity as Player).isFlapping !== undefined) {
          (entity as Player).isFlapping = false;
        }
        return true;
      }
    }
  }
  return false;
}

export function updatePhysics(dt: number): void {
  const allEntities = getEntitiesByType();
  for (const entity of allEntities) {
    applyGravity(entity, dt);
    applyVelocity(entity, dt);
    checkPlatformCollision(entity);
    screenWrap(entity);
    if (entity.type === 'player') {
      applyHorizontalDrag(entity);
    }
  }
}

export function entitiesOverlap(a: Entity, b: Entity): boolean {
  return (
    a.position.x < b.position.x + b.width &&
    a.position.x + a.width > b.position.x &&
    a.position.y < b.position.y + b.height &&
    a.position.y + a.height > b.position.y
  );
}
