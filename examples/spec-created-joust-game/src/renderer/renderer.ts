// Copyright 2026 LotZoom.com. Licensed under the Apache License, Version 2.0.

import { Application, Graphics, Container, Sprite, Assets, Texture } from 'pixi.js';
import type { Entity, Player, Enemy, Egg } from '../types';
import { getEntitiesByType } from '../engine/entities';
import { getParticles, updateParticles } from './particles';
import { updateScreenShake } from './screen-effects';
import * as C from '../engine/constants';

let app: Application | null = null;
let backgroundGfx: Graphics | null = null;
let entityGfx: Graphics | null = null;
let particleGfx: Graphics | null = null;
let entityLayer: Container | null = null;
let animFrame = 0;

// Avatar texture cache
const avatarTextures: Map<string, Texture> = new Map();

// Per-player display objects for sprite heads
interface PlayerDisplay {
  container: Container;
  bodyGfx: Graphics;
  headSprite: Sprite | null;
}
const playerDisplays: Map<string, PlayerDisplay> = new Map();

// Animation constants
const TRIUMPH_DURATION = 800;
const DEATH_DURATION = 500;

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

async function preloadAvatars(): Promise<void> {
  const keys = ['brian', 'les', 'matt', 'trent'];
  for (const key of keys) {
    try {
      const texture = await Assets.load(`/players/${key}.png`);
      avatarTextures.set(key, texture);
    } catch {
      // Avatar not found — skip
    }
  }
}

export async function initRenderer(container: HTMLElement): Promise<Application> {
  app = new Application();
  await app.init({
    width: C.WORLD_WIDTH,
    height: C.WORLD_HEIGHT,
    backgroundColor: COLORS.background,
    antialias: true,
  });
  container.appendChild(app.canvas);

  // Layered stage
  backgroundGfx = new Graphics();
  app.stage.addChild(backgroundGfx);

  entityLayer = new Container();
  app.stage.addChild(entityLayer);

  entityGfx = new Graphics();
  entityLayer.addChild(entityGfx);

  particleGfx = new Graphics();
  app.stage.addChild(particleGfx);

  await preloadAvatars();

  return app;
}

export function render(dt: number): void {
  if (!backgroundGfx || !entityGfx || !particleGfx || !entityLayer || !app) return;

  animFrame += dt * 0.01;

  const shake = updateScreenShake(dt);
  app.stage.position.set(shake.offsetX, shake.offsetY);

  // --- Background layer: lava + platforms ---
  const bg = backgroundGfx;
  bg.clear();

  const lavaFlicker = 0.6 + Math.sin(animFrame * 3) * 0.15;
  bg.rect(0, C.WORLD_HEIGHT - 25, C.WORLD_WIDTH, 25);
  bg.fill({ color: COLORS.lava, alpha: 0.9 });
  bg.rect(0, C.WORLD_HEIGHT - 35, C.WORLD_WIDTH, 12);
  bg.fill({ color: COLORS.lavaGlow, alpha: lavaFlicker * 0.4 });
  bg.rect(0, C.WORLD_HEIGHT - 42, C.WORLD_WIDTH, 8);
  bg.fill({ color: COLORS.lavaGlow, alpha: lavaFlicker * 0.15 });

  for (const plat of C.PLATFORMS) {
    bg.rect(plat.x, plat.y + 3, plat.width, 6);
    bg.fill(COLORS.platform);
    bg.rect(plat.x, plat.y, plat.width, 4);
    bg.fill(COLORS.platformTop);
  }

  // --- Entity layer: enemies/eggs on shared Graphics, players on containers ---
  entityGfx.clear();
  const entities = getEntitiesByType();
  const activePlayerIds = new Set<string>();

  for (const entity of entities) {
    if (entity.type === 'player') {
      const player = entity as Player;
      activePlayerIds.add(player.id);
      renderPlayer(player, dt);
    } else if (entity.type === 'enemy') {
      drawBird(entityGfx, entity as Enemy, false);
    } else if (entity.type === 'egg') {
      drawEgg(entityGfx, entity as Egg);
    }
  }

  // Clean up removed player displays
  for (const [id, display] of playerDisplays) {
    if (!activePlayerIds.has(id)) {
      entityLayer.removeChild(display.container);
      display.container.destroy({ children: true });
      playerDisplays.delete(id);
    }
  }

  // --- Particle layer ---
  particleGfx.clear();
  updateParticles(dt);
  for (const p of getParticles()) {
    const alpha = 1 - p.life / p.maxLife;
    particleGfx.circle(p.x, p.y, p.size);
    particleGfx.fill({ color: p.color, alpha });
  }
}

function getOrCreatePlayerDisplay(player: Player): PlayerDisplay {
  let display = playerDisplays.get(player.id);
  if (display) return display;

  const container = new Container();
  const bodyGfx = new Graphics();
  container.addChild(bodyGfx);

  let headSprite: Sprite | null = null;
  if (player.avatar && !player.avatar.isDefault && avatarTextures.has(player.avatar.imageKey)) {
    headSprite = new Sprite(avatarTextures.get(player.avatar.imageKey)!);
    headSprite.anchor.set(0.5, 1.0);
    headSprite.width = 26;
    headSprite.height = 26;
    container.addChild(headSprite);
  }

  entityLayer!.addChild(container);
  display = { container, bodyGfx, headSprite };
  playerDisplays.set(player.id, display);
  return display;
}

function renderPlayer(player: Player, dt: number): void {
  const display = getOrCreatePlayerDisplay(player);
  const { container, bodyGfx, headSprite } = display;

  // Position container at entity world position
  container.position.set(player.position.x, player.position.y);

  // Draw bird body (local coords, origin = entity top-left)
  bodyGfx.clear();
  drawBirdBody(bodyGfx, player, true);

  const w = player.width;
  const h = player.height;
  const cx = w / 2;
  const cy = h / 2;

  if (headSprite) {
    // Update head animation
    applyHeadAnimation(headSprite, bodyGfx, player, dt, cx, cy);
  } else {
    // Procedural rider head (default / new player)
    const riderColor = player.playerIndex === 0 ? COLORS.player0Rider : COLORS.player1Rider;

    if (player.isDying && player.deathTimer > 0) {
      drawDeathFace(bodyGfx, cx, cy - 16, player.deathTimer / DEATH_DURATION);
      player.deathTimer -= dt;
      if (player.deathTimer <= 0) player.isDying = false;
    } else {
      bodyGfx.circle(cx, cy - 16, 4);
      bodyGfx.fill(0xffcc99);
      bodyGfx.arc(cx, cy - 17, 5, Math.PI, 0);
      bodyGfx.fill(riderColor);
    }
  }
}

function applyHeadAnimation(
  sprite: Sprite,
  bodyGfx: Graphics,
  player: Player,
  dt: number,
  cx: number,
  cy: number,
): void {
  const headBaseY = cy - 18;

  // Death animation — hide sprite, draw death face
  if (player.isDying && player.deathTimer > 0) {
    sprite.visible = false;
    drawDeathFace(bodyGfx, cx, cy - 16, player.deathTimer / DEATH_DURATION);
    player.deathTimer -= dt;
    if (player.deathTimer <= 0) {
      player.isDying = false;
      sprite.visible = true;
    }
    return;
  }

  sprite.visible = true;

  // Movement bobble
  player.headBobblePhase += Math.abs(player.velocity.x) * dt * 0.005;
  const bobY = Math.sin(player.headBobblePhase * 4) * 2.5;

  // Tilt toward movement direction
  const targetTilt = -player.velocity.x * 0.04;
  player.headTiltAngle += (targetTilt - player.headTiltAngle) * 0.15;

  // Triumph animation
  if (player.triumphTimer > 0) {
    player.triumphTimer -= dt;
    const t = Math.max(player.triumphTimer / TRIUMPH_DURATION, 0);
    const bounce = Math.sin(t * Math.PI * 6) * 5;
    const scalePulse = 1.0 + Math.sin(t * Math.PI * 4) * 0.15;
    sprite.position.set(cx, headBaseY + bounce);
    sprite.scale.set(scalePulse * (26 / sprite.texture.width));
    sprite.rotation = Math.sin(t * Math.PI * 8) * 0.2;
    return;
  }

  // Normal bobble
  sprite.position.set(cx, headBaseY + bobY);
  sprite.rotation = player.headTiltAngle;

  // Reset scale to normal
  const baseScale = 26 / sprite.texture.width;
  sprite.scale.set(baseScale);
}

function drawDeathFace(g: Graphics, cx: number, cy: number, progress: number): void {
  const shake = Math.sin(progress * 40) * 3 * progress;

  // Head circle
  g.circle(cx + shake, cy, 5);
  g.fill(0xffcc99);

  // X eyes
  const eyeSize = 2.5;
  const leftEyeX = cx + shake - 2.5;
  const rightEyeX = cx + shake + 2.5;
  const eyeY = cy - 1.5;

  // Left X
  g.moveTo(leftEyeX - eyeSize, eyeY - eyeSize);
  g.lineTo(leftEyeX + eyeSize, eyeY + eyeSize);
  g.stroke({ color: 0x000000, width: 2 });
  g.moveTo(leftEyeX + eyeSize, eyeY - eyeSize);
  g.lineTo(leftEyeX - eyeSize, eyeY + eyeSize);
  g.stroke({ color: 0x000000, width: 2 });

  // Right X
  g.moveTo(rightEyeX - eyeSize, eyeY - eyeSize);
  g.lineTo(rightEyeX + eyeSize, eyeY + eyeSize);
  g.stroke({ color: 0x000000, width: 2 });
  g.moveTo(rightEyeX + eyeSize, eyeY - eyeSize);
  g.lineTo(rightEyeX - eyeSize, eyeY + eyeSize);
  g.stroke({ color: 0x000000, width: 2 });

  // O mouth
  g.circle(cx + shake, cy + 3, 2);
  g.stroke({ color: 0x000000, width: 1.5 });
}

// Draw bird body + rider torso + lance — everything except the rider head
function drawBirdBody(g: Graphics, entity: Player | Enemy, isPlayer: boolean): void {
  const w = entity.width;
  const h = entity.height;
  const cx = w / 2;
  const cy = h / 2;

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

  const idOffset = (entity as any).id?.charCodeAt?.(2) || 0;
  const wingFlap = Math.sin(animFrame * 8 + idOffset) * 0.5;
  const wingY = entity.velocity.y < -1 ? -6 : wingFlap * 4;

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
  g.moveTo(cx - 4, cy);
  g.lineTo(cx - w * 0.6, wingBaseY - 8);
  g.lineTo(cx - w * 0.3, wingBaseY - 2);
  g.lineTo(cx - 4, cy + 2);
  g.fill({ color: bodyColor, alpha: 0.85 });
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

  // Bird head
  g.circle(cx + dir * 12, cy - 12, 5);
  g.fill(bodyColor);
  g.circle(cx + dir * 13, cy - 13, 1.5);
  g.fill(0xffffff);
  g.circle(cx + dir * 13.5, cy - 13, 0.8);
  g.fill(0x000000);
  g.moveTo(cx + dir * 16, cy - 12);
  g.lineTo(cx + dir * 22, cy - 11);
  g.lineTo(cx + dir * 16, cy - 9);
  g.fill(COLORS.beak);

  // Legs
  const onGround = Math.abs(entity.velocity.y) < 0.5;
  if (onGround) {
    g.moveTo(cx - 4, cy + h * 0.3);
    g.lineTo(cx - 6, cy + h * 0.55);
    g.lineTo(cx - 10, cy + h * 0.55);
    g.stroke({ color: bodyColor, width: 2 });
    g.moveTo(cx + 4, cy + h * 0.3);
    g.lineTo(cx + 2, cy + h * 0.55);
    g.lineTo(cx - 2, cy + h * 0.55);
    g.stroke({ color: bodyColor, width: 2 });
  } else {
    g.moveTo(cx - 4, cy + h * 0.3);
    g.lineTo(cx - 5, cy + h * 0.5);
    g.stroke({ color: bodyColor, width: 1.5 });
    g.moveTo(cx + 4, cy + h * 0.3);
    g.lineTo(cx + 3, cy + h * 0.5);
    g.stroke({ color: bodyColor, width: 1.5 });
  }

  // Rider body (torso)
  g.ellipse(cx, cy - 6, 5, 7);
  g.fill(riderColor);

  // Lance
  const lanceStartX = cx + dir * 6;
  const lanceStartY = cy - 8;
  const lanceEndX = cx + dir * 28;
  const lanceEndY = cy - 6;
  g.moveTo(lanceStartX, lanceStartY);
  g.lineTo(lanceEndX, lanceEndY);
  g.stroke({ color: COLORS.lance, width: 2 });
  g.moveTo(lanceEndX, lanceEndY);
  g.lineTo(lanceEndX + dir * 6, lanceEndY - 2);
  g.lineTo(lanceEndX + dir * 2, lanceEndY + 2);
  g.fill(COLORS.lance);

  // Shield
  if (isPlayer && (entity as Player).hasShield) {
    g.circle(cx, cy, w * 0.6);
    g.stroke({ color: 0x44ffff, width: 2, alpha: 0.5 });
  }
}

// Draw bird with full procedural rider head — used for enemies
function drawBird(g: Graphics, entity: Player | Enemy, isPlayer: boolean): void {
  const { x, y } = entity.position;

  // Save current transform state by offsetting all drawing
  // We draw at absolute world coords for enemies (not in containers)
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

  const idOffset = (entity as any).id?.charCodeAt?.(2) || 0;
  const wingFlap = Math.sin(animFrame * 8 + idOffset) * 0.5;
  const wingY = entity.velocity.y < -1 ? -6 : wingFlap * 4;

  // Body oval
  g.ellipse(cx, cy + 4, w * 0.45, h * 0.3);
  g.fill(bodyColor);

  // Tail
  g.moveTo(cx - dir * w * 0.4, cy + 2);
  g.lineTo(cx - dir * w * 0.7, cy - 4);
  g.lineTo(cx - dir * w * 0.65, cy + 6);
  g.lineTo(cx - dir * w * 0.4, cy + 6);
  g.fill(bodyColor);

  // Wings
  const wingBaseY = cy + wingY;
  g.moveTo(cx - 4, cy);
  g.lineTo(cx - w * 0.6, wingBaseY - 8);
  g.lineTo(cx - w * 0.3, wingBaseY - 2);
  g.lineTo(cx - 4, cy + 2);
  g.fill({ color: bodyColor, alpha: 0.85 });
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

  // Bird head
  g.circle(cx + dir * 12, cy - 12, 5);
  g.fill(bodyColor);
  g.circle(cx + dir * 13, cy - 13, 1.5);
  g.fill(0xffffff);
  g.circle(cx + dir * 13.5, cy - 13, 0.8);
  g.fill(0x000000);
  g.moveTo(cx + dir * 16, cy - 12);
  g.lineTo(cx + dir * 22, cy - 11);
  g.lineTo(cx + dir * 16, cy - 9);
  g.fill(COLORS.beak);

  // Legs
  const onGround = Math.abs(entity.velocity.y) < 0.5;
  if (onGround) {
    g.moveTo(cx - 4, cy + h * 0.3);
    g.lineTo(cx - 6, cy + h * 0.55);
    g.lineTo(cx - 10, cy + h * 0.55);
    g.stroke({ color: bodyColor, width: 2 });
    g.moveTo(cx + 4, cy + h * 0.3);
    g.lineTo(cx + 2, cy + h * 0.55);
    g.lineTo(cx - 2, cy + h * 0.55);
    g.stroke({ color: bodyColor, width: 2 });
  } else {
    g.moveTo(cx - 4, cy + h * 0.3);
    g.lineTo(cx - 5, cy + h * 0.5);
    g.stroke({ color: bodyColor, width: 1.5 });
    g.moveTo(cx + 4, cy + h * 0.3);
    g.lineTo(cx + 3, cy + h * 0.5);
    g.stroke({ color: bodyColor, width: 1.5 });
  }

  // Rider
  g.ellipse(cx, cy - 6, 5, 7);
  g.fill(riderColor);
  g.circle(cx, cy - 16, 4);
  g.fill(0xffcc99);
  g.arc(cx, cy - 17, 5, Math.PI, 0);
  g.fill(riderColor);

  // Lance
  const lanceEndX = cx + dir * 28;
  const lanceEndY = cy - 6;
  g.moveTo(cx + dir * 6, cy - 8);
  g.lineTo(lanceEndX, lanceEndY);
  g.stroke({ color: COLORS.lance, width: 2 });
  g.moveTo(lanceEndX, lanceEndY);
  g.lineTo(lanceEndX + dir * 6, lanceEndY - 2);
  g.lineTo(lanceEndX + dir * 2, lanceEndY + 2);
  g.fill(COLORS.lance);
}

function drawEgg(g: Graphics, egg: Egg): void {
  const cx = egg.position.x + egg.width / 2;
  const cy = egg.position.y + egg.height / 2;

  g.ellipse(cx, cy, egg.width * 0.5, egg.height * 0.6);
  g.fill(COLORS.egg);

  g.circle(cx - 2, cy - 2, 1.5);
  g.fill({ color: COLORS.eggCrack, alpha: 0.4 });
  g.circle(cx + 3, cy + 1, 1);
  g.fill({ color: COLORS.eggCrack, alpha: 0.4 });

  const progress = egg.hatchTimer / egg.hatchTimeout;
  if (progress > 0.3) {
    const intensity = Math.min(progress * 1.5, 1);
    g.moveTo(cx - 2, cy - egg.height * 0.4);
    g.lineTo(cx + 1, cy);
    g.lineTo(cx - 3, cy + egg.height * 0.3);
    g.stroke({ color: COLORS.eggCrack, width: 1.5, alpha: intensity });
  }
  if (progress > 0.7) {
    const shake = Math.sin(animFrame * 20) * 2;
    g.ellipse(cx + shake, cy, egg.width * 0.55, egg.height * 0.65);
    g.stroke({ color: 0xff4400, width: 1.5, alpha: progress });
  }
}

export function cleanupPlayerDisplays(): void {
  for (const [, display] of playerDisplays) {
    display.container.destroy({ children: true });
  }
  playerDisplays.clear();
}

export function getApp(): Application | null {
  return app;
}

export function destroyRenderer(): void {
  if (app) {
    cleanupPlayerDisplays();
    app.destroy(true);
    app = null;
    backgroundGfx = null;
    entityGfx = null;
    particleGfx = null;
    entityLayer = null;
  }
}
