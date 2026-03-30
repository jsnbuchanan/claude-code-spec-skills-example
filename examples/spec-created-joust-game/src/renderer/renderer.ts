import { Application, Graphics } from 'pixi.js';
import type { Entity, Player, Enemy, Egg } from '../types';
import { getEntitiesByType } from '../engine/entities';
import { getParticles, updateParticles } from './particles';
import { updateScreenShake } from './screen-effects';
import * as C from '../engine/constants';

let app: Application | null = null;
let gameGraphics: Graphics | null = null;

const COLORS = {
  player0: 0x4488ff,
  player1: 0xff4444,
  bounder: 0x66cc66,
  hunter: 0xcccc44,
  shadow_lord: 0xcc44cc,
  egg: 0xffffff,
  platform: 0x666666,
  lava: 0xff4400,
  background: 0x1a1a2e,
  particle: 0xffaa00,
};

export async function initRenderer(container: HTMLElement): Promise<Application> {
  app = new Application();
  await app.init({
    width: C.WORLD_WIDTH,
    height: C.WORLD_HEIGHT,
    backgroundColor: COLORS.background,
    antialias: true,
  });
  container.appendChild(app.canvas);

  gameGraphics = new Graphics();
  app.stage.addChild(gameGraphics);

  return app;
}

export function render(dt: number): void {
  if (!gameGraphics || !app) return;

  const g = gameGraphics;
  g.clear();

  // Apply screen shake
  const shake = updateScreenShake(dt);
  app.stage.position.set(shake.offsetX, shake.offsetY);

  // Draw lava at bottom (with simple glow effect)
  g.rect(0, C.WORLD_HEIGHT - 20, C.WORLD_WIDTH, 20);
  g.fill({ color: COLORS.lava, alpha: 0.8 });
  // Lava glow
  g.rect(0, C.WORLD_HEIGHT - 30, C.WORLD_WIDTH, 10);
  g.fill({ color: COLORS.lava, alpha: 0.3 });

  // Draw platforms
  for (const plat of C.PLATFORMS) {
    g.rect(plat.x, plat.y, plat.width, 8);
    g.fill(COLORS.platform);
  }

  // Draw entities
  const entities = getEntitiesByType();
  for (const entity of entities) {
    drawEntity(g, entity);
  }

  // Draw particles
  updateParticles(dt);
  const particles = getParticles();
  for (const p of particles) {
    const alpha = 1 - p.life / p.maxLife;
    g.circle(p.x, p.y, p.size);
    g.fill({ color: p.color, alpha });
  }
}

function drawEntity(g: Graphics, entity: Entity): void {
  const { x, y } = entity.position;

  if (entity.type === 'player') {
    const player = entity as Player;
    const color = player.playerIndex === 0 ? COLORS.player0 : COLORS.player1;

    // Body
    g.rect(x, y, entity.width, entity.height);
    g.fill(color);

    // Lance (small triangle pointing forward)
    const lanceDir = player.velocity.x >= 0 ? 1 : -1;
    const lanceX = lanceDir > 0 ? x + entity.width : x;
    g.moveTo(lanceX, y + 8);
    g.lineTo(lanceX + lanceDir * 12, y + 12);
    g.lineTo(lanceX, y + 16);
    g.fill(0xdddddd);

    // Shield indicator
    if (player.hasShield) {
      g.circle(x + entity.width / 2, y + entity.height / 2, entity.width / 2 + 4);
      g.stroke({ color: 0x44ffff, width: 2, alpha: 0.6 });
    }
  } else if (entity.type === 'enemy') {
    const enemy = entity as Enemy;
    const color = COLORS[enemy.tier] ?? COLORS.bounder;
    g.rect(x, y, entity.width, entity.height);
    g.fill(color);

    // Wings
    g.moveTo(x - 4, y + 10);
    g.lineTo(x, y + 5);
    g.lineTo(x, y + 15);
    g.fill({ color, alpha: 0.7 });
    g.moveTo(x + entity.width + 4, y + 10);
    g.lineTo(x + entity.width, y + 5);
    g.lineTo(x + entity.width, y + 15);
    g.fill({ color, alpha: 0.7 });
  } else if (entity.type === 'egg') {
    g.ellipse(x + entity.width / 2, y + entity.height / 2, entity.width / 2, entity.height / 2);
    g.fill(COLORS.egg);

    // Hatch progress indicator
    const egg = entity as Egg;
    const progress = egg.hatchTimer / egg.hatchTimeout;
    if (progress > 0.5) {
      g.ellipse(x + entity.width / 2, y + entity.height / 2, entity.width / 2, entity.height / 2);
      g.stroke({ color: 0xff0000, width: 2, alpha: progress });
    }
  }
}

export function getApp(): Application | null {
  return app;
}

export function destroyRenderer(): void {
  if (app) {
    app.destroy(true);
    app = null;
    gameGraphics = null;
  }
}
