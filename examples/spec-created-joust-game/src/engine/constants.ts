// Copyright 2026 LotZoom.com. Licensed under the Apache License, Version 2.0.

// Game world dimensions
export const WORLD_WIDTH = 800;
export const WORLD_HEIGHT = 600;

// Physics
export const GRAVITY = 0.4;
export const FLAP_IMPULSE = -8;
export const MAX_FALL_SPEED = 6;
export const HORIZONTAL_SPEED = 3;
export const HORIZONTAL_DRAG = 0.95;

// Entity sizes
export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 40;
export const ENEMY_WIDTH = 40;
export const ENEMY_HEIGHT = 40;
export const EGG_WIDTH = 18;
export const EGG_HEIGHT = 22;

// Egg lifecycle
export const EGG_HATCH_TIMEOUT = 5000; // ms
export const EGG_SCORE_VALUE = 250;

// Wave config
export const BASE_ENEMIES_PER_WAVE = 3;
export const ENEMIES_INCREMENT_PER_WAVE = 1;
export const HUNTER_INTRO_WAVE = 3;
export const SHADOW_LORD_INTRO_WAVE = 6;

// Enemy speeds (multiplier of base)
export const ENEMY_SPEED: Record<string, number> = {
  bounder: 1.5,
  hunter: 2.5,
  shadow_lord: 3.5,
};

// Platforms (x, y, width)
export const PLATFORMS = [
  { x: 0, y: 550, width: 800 },     // ground
  { x: 100, y: 420, width: 200 },    // left mid
  { x: 500, y: 420, width: 200 },    // right mid
  { x: 250, y: 300, width: 300 },    // center upper
  { x: 50, y: 180, width: 150 },     // left high
  { x: 600, y: 180, width: 150 },    // right high
  { x: 300, y: 100, width: 200 },    // top center
];

// Player spawn positions (on the mid platforms)
export const PLAYER_SPAWNS = [
  { x: 150, y: 420 - 32 },  // on left mid platform
  { x: 550, y: 420 - 32 },  // on right mid platform
];

// Lives
export const STARTING_LIVES = 3;
