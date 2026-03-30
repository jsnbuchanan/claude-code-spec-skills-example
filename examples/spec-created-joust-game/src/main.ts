import type { GameTestAPI, Vector2, Entity, Enemy, CombatResult, GameMode } from './types';
import { initRenderer, render } from './renderer/renderer';
import { emitParticles, getParticleCount, clearParticles } from './renderer/particles';
import { triggerScreenShake, isScreenShaking } from './renderer/screen-effects';
import { initKeyboard, getPlayerInput, clearJustPressed } from './input/keyboard';
import {
  clearEntities, getEntitiesByType, createPlayer, createEnemy,
  getEntity, getPlayers, getEnemies, removeEntity,
} from './engine/entities';
import { updatePhysics, flap, entitiesOverlap } from './engine/physics';
import { resolveCombat } from './engine/combat';
import { tick as eggTick, createEgg, collectEgg } from './engine/egg';
import {
  spawnWave, getWaveState, getWaveEnemies, checkWaveComplete,
  advanceWave, resetWaves, getCurrentWave,
} from './engine/waves';
import { createHUD, updateHUD } from './ui/hud';
import { createMenu, hideMenu, showMenu, type MenuAction } from './ui/menu';
import { submitScore } from './leaderboard';
import { createRoom as peerCreateRoom, joinRoom as peerJoinRoom, getConnectionState as peerGetConnectionState, sendPeerMessage, onPeerMessage, disconnect } from './networking/peer';
import * as C from './engine/constants';

// Frame timing
let lastTime = 0;
let fps = 0;
let frameCount = 0;
let fpsTimer = 0;
const frameTimes: number[] = [];
let testMode = false;
let lastCombatResult: CombatResult | null = null;
let gameRunning = false;
let currentMode: GameMode = 'classic';
let waveAdvanceTimer = 0;
const WAVE_ADVANCE_DELAY = 500; // ms delay before next wave

// FPS tracking
function recordFrame(dt: number): void {
  frameTimes.push(dt);
  frameCount++;
  fpsTimer += dt;
  if (fpsTimer >= 1000) {
    fps = Math.round((frameCount * 1000) / fpsTimer);
    frameCount = 0;
    fpsTimer = 0;
  }
}

// Main game loop
function gameLoop(timestamp: number): void {
  if (!gameRunning) return;

  const dt = lastTime ? Math.min(timestamp - lastTime, 33) : 16; // cap at ~30fps min
  lastTime = timestamp;
  recordFrame(dt);

  // Process player input
  const players = getPlayers();
  for (const player of players) {
    const input = getPlayerInput(player.playerIndex);
    if (input.flap) flap(player);
    if (input.left) player.velocity.x = -C.HORIZONTAL_SPEED;
    if (input.right) player.velocity.x = C.HORIZONTAL_SPEED;
    player.lanceHeight = player.position.y;
  }

  // Update physics
  updatePhysics(dt);

  // Update egg timers
  eggTick(dt);

  // Check for wave completion (classic / survival modes)
  if (currentMode !== 'versus' && checkWaveComplete()) {
    waveAdvanceTimer += dt;
    if (waveAdvanceTimer >= WAVE_ADVANCE_DELAY) {
      advanceWave();
      waveAdvanceTimer = 0;
    }
  } else {
    waveAdvanceTimer = 0;
  }

  // Check combat collisions (player vs enemy)
  for (const player of players) {
    for (const enemy of getEnemies()) {
      if (entitiesOverlap(player, enemy)) {
        const combatPos = { ...enemy.position };
        const result = resolveCombat(player.id, enemy.id);
        if (result) {
          lastCombatResult = result;
          emitParticles(combatPos, 20);
          triggerScreenShake(6, 300);
        }
      }
    }
  }

  // Check egg collection (player overlaps egg → score)
  const eggs = getEntitiesByType('egg');
  for (const player of players) {
    for (const egg of eggs) {
      if (entitiesOverlap(player, egg)) {
        const { scoreAwarded } = collectEgg(egg.id, player.playerIndex);
        player.score += scoreAwarded;
        finalScore = Math.max(finalScore, player.score);
      }
    }
  }

  // AI enemy movement
  for (const enemy of getEnemies()) {
    // Flap to stay airborne — only flap when falling and below a target height
    const targetY = 100 + Math.random() * 300; // vary target altitude
    if (enemy.velocity.y > 0 && enemy.position.y > targetY) {
      // Only flap sometimes to create natural bobbing
      if (Math.random() < 0.15) {
        enemy.velocity.y = C.FLAP_IMPULSE * 0.5;
      }
    }
    // Reverse at screen edges
    if (enemy.position.x <= 10) {
      enemy.velocity.x = Math.abs(enemy.velocity.x);
    } else if (enemy.position.x >= C.WORLD_WIDTH - enemy.width - 10) {
      enemy.velocity.x = -Math.abs(enemy.velocity.x);
    }
    // Occasionally change direction
    if (Math.random() < 0.005) {
      enemy.velocity.x = -enemy.velocity.x;
    }
  }

  // Check game over (all players dead)
  const alivePlayers = getPlayers();
  if (alivePlayers.length === 0 && !testMode) {
    endGame();
    return;
  }

  // Sync state over network
  if (peerGetConnectionState() === 'connected') {
    for (const player of players) {
      sendPeerMessage({
        type: 'position',
        playerIndex: player.playerIndex,
        position: player.position,
        velocity: player.velocity,
      });
    }
  }

  // Render
  render(dt);

  // Update HUD
  updateHUD(players, getWaveState());

  clearJustPressed();
  requestAnimationFrame(gameLoop);
}

let finalScore = 0;

function endGame(): void {
  gameRunning = false;
  // Auto-submit score with a default name (no blocking prompt)
  if (finalScore > 0) {
    submitScore('Player', finalScore, currentMode);
  }
  // Render continues to show last frame — menu overlay returns
  showMenu();
}

function startGame(mode: GameMode, playerCount: number): void {
  clearEntities();
  clearParticles();
  resetWaves();
  lastCombatResult = null;
  finalScore = 0;
  currentMode = mode;
  gameRunning = true;
  lastTime = 0;

  // Spawn players
  for (let i = 0; i < playerCount; i++) {
    createPlayer(C.PLAYER_SPAWNS[i], i);
  }

  // Spawn first wave (except versus mode)
  if (mode !== 'versus') {
    spawnWave(1);
  }

  hideMenu();
  requestAnimationFrame(gameLoop);
}

// Handle menu actions
function handleMenuAction(action: MenuAction): void {
  if (action.type === 'start') {
    startGame(action.mode, action.players);
  } else if (action.type === 'online') {
    // Online mode — check URL for room code
    const params = new URLSearchParams(window.location.search);
    const roomCode = params.get('room');
    if (roomCode) {
      peerJoinRoom(roomCode);
    } else {
      const code = peerCreateRoom();
      alert(`Share this room code: ${code}`);
    }
  }
}

// Initialize
async function init(): Promise<void> {
  const container = document.getElementById('game-container')!;

  // Init renderer
  await initRenderer(container);

  // Init input
  initKeyboard();

  // Create HUD
  const hud = createHUD();
  container.appendChild(hud);

  // Create menu
  const menu = createMenu(handleMenuAction);
  container.appendChild(menu);

  // Handle network messages
  onPeerMessage((msg) => {
    if (msg.type === 'position') {
      const players = getPlayers();
      const remotePlayer = players.find((p) => p.playerIndex !== 0);
      if (remotePlayer) {
        remotePlayer.position = msg.position;
        remotePlayer.velocity = msg.velocity;
      }
    }
  });

  // Check for room code in URL
  const params = new URLSearchParams(window.location.search);
  const roomCode = params.get('room');
  if (roomCode) {
    await peerJoinRoom(roomCode);
    startGame('classic', 2);
  }

  // Auto-start in test mode
  if (testMode) {
    startGame('classic', 1);
  }

  // Expose test API
  setupTestAPI();
}

function setupTestAPI(): void {
  const api: GameTestAPI = {
    getPlayerPosition(playerIndex = 0) {
      const players = getPlayers();
      const player = players.find((p) => p.playerIndex === playerIndex);
      return player ? { ...player.position } : null;
    },
    getLastCombatResult() {
      return lastCombatResult;
    },
    getEntities(type?: Entity['type']) {
      return getEntitiesByType(type).map((e) => ({
        ...e,
        position: { ...e.position },
        velocity: { ...e.velocity },
      }));
    },
    getWaveEnemies(waveNumber?: number) {
      return getWaveEnemies(waveNumber) as Enemy[];
    },
    getWaveState() {
      return getWaveState();
    },
    getFPS() {
      return fps;
    },
    getFrameTimes() {
      return [...frameTimes];
    },
    resetFrameTimes() {
      frameTimes.length = 0;
      frameCount = 0;
      fpsTimer = 0;
    },
    getParticleCount() {
      return getParticleCount();
    },
    getScore(playerIndex = 0) {
      const players = getPlayers();
      const player = players.find((p) => p.playerIndex === playerIndex);
      return player?.score ?? 0;
    },
    setTestMode(enabled: boolean) {
      testMode = enabled;
      if (enabled && !gameRunning) {
        startGame('classic', 1);
      }
    },
    spawnEntity(type, position, options = {}) {
      if (type === 'player') {
        const player = createPlayer(position, (options.playerIndex as number) ?? 0);
        return player.id;
      } else if (type === 'enemy') {
        const enemy = createEnemy(position, (options.tier as string as any) ?? 'bounder');
        return enemy.id;
      } else if (type === 'egg') {
        createEgg(position, (options.tier as string as any) ?? 'bounder');
        return '';
      }
      return '';
    },
    killAllEnemies() {
      const enemies = getEnemies();
      for (const enemy of enemies) {
        removeEntity(enemy.id);
      }
    },
    triggerCombat(entityAId, entityBId) {
      // Capture positions before combat resolves (may remove entities)
      const entityB = getEntity(entityBId);
      const combatPos = entityB ? { ...entityB.position } : { x: 400, y: 300 };
      const result = resolveCombat(entityAId, entityBId);
      if (result) {
        lastCombatResult = result;
        emitParticles(combatPos, 20);
        triggerScreenShake(6, 300);
      }
      return result;
    },
    isScreenShaking() {
      return isScreenShaking();
    },
    createRoom() {
      return peerCreateRoom();
    },
    joinRoom(code: string) {
      peerJoinRoom(code);
    },
    getConnectionState() {
      return peerGetConnectionState();
    },
  };

  window.game = api;
}

init().catch(console.error);
