import { Application, Graphics } from 'pixi.js';
import type { Entity, Player, Enemy, Egg } from '../types';
import { getEntitiesByType } from '../engine/entities';
import { getParticles, updateParticles } from './particles';
import { updateScreenShake } from './screen-effects';
import * as C from '../engine/constants';

let app: Application | null = null;
let gameGraphics: Graphics | null = null;
let animFrame = 0;

const COLORS = {
  player0Body: 0x4488ff,
  player0Rider: 0xeecc44,
  player1Body: 0xff4444,
  player1Rider: 0x44ee44,
  bounderBody: 0x55aa55,
  bounderRider: 0x338833,
  hunterBody: 0xccaa33,
  hunterRider: 0x887722,
  shadowBody: 0xaa44cc,
  shadowRider: 0x662288,
  egg: 0xffeedd,
  eggCrack: 0xcc8844,
  platform: 0x556677,
  platformTop: 0x778899,
  lava: 0xff4400,
  lavaGlow: 0xff6600,
  background: 0x111122,
  particle: 0xffaa00,
  lance: 0xcccccc,
  beak: 0xff8800,
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

  animFrame += dt * 0.01;
  const g = gameGraphics;
  g.clear();

  const shake = updateScreenShake(dt);
  app.stage.position.set(shake.offsetX, shake.offsetY);

  // Lava with animated glow
  const lavaFlicker = 0.6 + Math.sin(animFrame * 3) * 0.15;
  g.rect(0, C.WORLD_HEIGHT - 25, C.WORLD_WIDTH, 25);
  g.fill({ color: COLORS.lava, alpha: 0.9 });
  // Glow layers
  g.rect(0, C.WORLD_HEIGHT - 35, C.WORLD_WIDTH, 12);
  g.fill({ color: COLORS.lavaGlow, alpha: lavaFlicker * 0.4 });
  g.rect(0, C.WORLD_HEIGHT - 42, C.WORLD_WIDTH, 8);
  g.fill({ color: COLORS.lavaGlow, alpha: lavaFlicker * 0.15 });

  // Platforms with top highlight
  for (const plat of C.PLATFORMS) {
    g.rect(plat.x, plat.y + 3, plat.width, 6);
    g.fill(COLORS.platform);
    g.rect(plat.x, plat.y, plat.width, 4);
    g.fill(COLORS.platformTop);
  }

  // Entities
  const entities = getEntitiesByType();
  for (const entity of entities) {
    drawEntity(g, entity);
  }

  // Particles
  updateParticles(dt);
  for (const p of getParticles()) {
    const alpha = 1 - p.life / p.maxLife;
    g.circle(p.x, p.y, p.size);
    g.fill({ color: p.color, alpha });
  }
}

function drawEntity(g: Graphics, entity: Entity): void {
  if (entity.type === 'player') {
    drawBird(g, entity as Player, true);
  } else if (entity.type === 'enemy') {
    drawBird(g, entity as any, false);
  } else if (entity.type === 'egg') {
    drawEgg(g, entity as Egg);
  }
}

function drawBird(g: Graphics, entity: Player | Enemy, isPlayer: boolean): void {
  const { x, y } = entity.position;
  const w = entity.width;
  const h = entity.height;
  const cx = x + w / 2;
  const cy = y + h / 2;

  const facingRight = entity.velocity.x >= 0;
  const dir = facingRight ? 1 : -1;

  let bodyColor: number;
  let riderColor: number;

  if (isPlayer) {
    const p = entity as Player;
    bodyColor = p.playerIndex === 0 ? COLORS.player0Body : COLORS.player1Body;
    riderColor = p.playerIndex === 0 ? COLORS.player0Rider : COLORS.player1Rider;
  } else {
    const e = entity as Enemy;
    if (e.tier === 'hunter') {
      bodyColor = COLORS.hunterBody;
      riderColor = COLORS.hunterRider;
    } else if (e.tier === 'shadow_lord') {
      bodyColor = COLORS.shadowBody;
      riderColor = COLORS.shadowRider;
    } else {
      bodyColor = COLORS.bounderBody;
      riderColor = COLORS.bounderRider;
    }
  }

  // Wing animation
  const idOffset = (entity as any).id?.charCodeAt?.(2) || 0;
  const wingFlap = Math.sin(animFrame * 8 + idOffset) * 0.5;
  const wingY = entity.velocity.y < -1 ? -6 : wingFlap * 4;

  // --- Bird body (ostrich/buzzard shape) ---
  // Body oval
  g.ellipse(cx, cy + 4, w * 0.45, h * 0.3);
  g.fill(bodyColor);

  // Tail feathers
  g.moveTo(cx - dir * w * 0.4, cy + 2);
  g.lineTo(cx - dir * w * 0.7, cy - 4);
  g.lineTo(cx - dir * w * 0.65, cy + 6);
  g.lineTo(cx - dir * w * 0.4, cy + 6);
  g.fill(bodyColor);

  // Wings
  const wingBaseY = cy + wingY;
  // Left wing
  g.moveTo(cx - 4, cy);
  g.lineTo(cx - w * 0.6, wingBaseY - 8);
  g.lineTo(cx - w * 0.3, wingBaseY - 2);
  g.lineTo(cx - 4, cy + 2);
  g.fill({ color: bodyColor, alpha: 0.85 });
  // Right wing
  g.moveTo(cx + 4, cy);
  g.lineTo(cx + w * 0.6, wingBaseY - 8);
  g.lineTo(cx + w * 0.3, wingBaseY - 2);
  g.lineTo(cx + 4, cy + 2);
  g.fill({ color: bodyColor, alpha: 0.85 });

  // Neck
  g.moveTo(cx + dir * 4, cy - 2);
  g.lineTo(cx + dir * 8, cy - 10);
  g.lineTo(cx + dir * 12, cy - 10);
  g.lineTo(cx + dir * 8, cy + 2);
  g.fill(bodyColor);

  // Head
  g.circle(cx + dir * 12, cy - 12, 5);
  g.fill(bodyColor);

  // Eye
  g.circle(cx + dir * 13, cy - 13, 1.5);
  g.fill(0xffffff);
  g.circle(cx + dir * 13.5, cy - 13, 0.8);
  g.fill(0x000000);

  // Beak
  g.moveTo(cx + dir * 16, cy - 12);
  g.lineTo(cx + dir * 22, cy - 11);
  g.lineTo(cx + dir * 16, cy - 9);
  g.fill(COLORS.beak);

  // Legs (dangling when airborne, tucked when on platform)
  const onGround = Math.abs(entity.velocity.y) < 0.5;
  if (onGround) {
    // Standing legs
    g.moveTo(cx - 4, cy + h * 0.3);
    g.lineTo(cx - 6, cy + h * 0.55);
    g.lineTo(cx - 10, cy + h * 0.55);
    g.stroke({ color: bodyColor, width: 2 });
    g.moveTo(cx + 4, cy + h * 0.3);
    g.lineTo(cx + 2, cy + h * 0.55);
    g.lineTo(cx - 2, cy + h * 0.55);
    g.stroke({ color: bodyColor, width: 2 });
  } else {
    // Dangling legs
    g.moveTo(cx - 4, cy + h * 0.3);
    g.lineTo(cx - 5, cy + h * 0.5);
    g.stroke({ color: bodyColor, width: 1.5 });
    g.moveTo(cx + 4, cy + h * 0.3);
    g.lineTo(cx + 3, cy + h * 0.5);
    g.stroke({ color: bodyColor, width: 1.5 });
  }

  // --- Rider on top ---
  // Rider body
  g.ellipse(cx, cy - 6, 5, 7);
  g.fill(riderColor);

  // Rider head
  g.circle(cx, cy - 16, 4);
  g.fill(0xffcc99);

  // Helmet
  g.arc(cx, cy - 17, 5, Math.PI, 0);
  g.fill(riderColor);

  // Lance
  const lanceStartX = cx + dir * 6;
  const lanceStartY = cy - 8;
  const lanceEndX = cx + dir * 28;
  const lanceEndY = cy - 6;
  g.moveTo(lanceStartX, lanceStartY);
  g.lineTo(lanceEndX, lanceEndY);
  g.stroke({ color: COLORS.lance, width: 2 });
  // Lance tip
  g.moveTo(lanceEndX, lanceEndY);
  g.lineTo(lanceEndX + dir * 6, lanceEndY - 2);
  g.lineTo(lanceEndX + dir * 2, lanceEndY + 2);
  g.fill(COLORS.lance);

  // Shield for player
  if (isPlayer && (entity as Player).hasShield) {
    g.circle(cx, cy, w * 0.6);
    g.stroke({ color: 0x44ffff, width: 2, alpha: 0.5 });
  }
}

function drawEgg(g: Graphics, egg: Egg): void {
  const cx = egg.position.x + egg.width / 2;
  const cy = egg.position.y + egg.height / 2;

  // Egg shape
  g.ellipse(cx, cy, egg.width * 0.5, egg.height * 0.6);
  g.fill(COLORS.egg);

  // Spots
  g.circle(cx - 2, cy - 2, 1.5);
  g.fill({ color: COLORS.eggCrack, alpha: 0.4 });
  g.circle(cx + 3, cy + 1, 1);
  g.fill({ color: COLORS.eggCrack, alpha: 0.4 });

  // Hatch warning
  const progress = egg.hatchTimer / egg.hatchTimeout;
  if (progress > 0.3) {
    // Crack lines
    const intensity = Math.min(progress * 1.5, 1);
    g.moveTo(cx - 2, cy - egg.height * 0.4);
    g.lineTo(cx + 1, cy);
    g.lineTo(cx - 3, cy + egg.height * 0.3);
    g.stroke({ color: COLORS.eggCrack, width: 1.5, alpha: intensity });
  }
  if (progress > 0.7) {
    // Shaking effect
    const shake = Math.sin(animFrame * 20) * 2;
    g.ellipse(cx + shake, cy, egg.width * 0.55, egg.height * 0.65);
    g.stroke({ color: 0xff4400, width: 1.5, alpha: progress });
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
