import type { GameTestAPI } from './types';

// Stub game test API — will be implemented in Phase 3
const gameAPI: GameTestAPI = {
  getPlayerPosition: () => null,
  getLastCombatResult: () => null,
  getEntities: () => [],
  getWaveEnemies: () => [],
  getWaveState: () => ({ waveNumber: 0, enemies: [], allDefeated: false }),
  getFPS: () => 0,
  getFrameTimes: () => [],
  getParticleCount: () => 0,
  getScore: () => 0,
  setTestMode: () => {},
  spawnEntity: () => '',
  killAllEnemies: () => {},
  triggerCombat: () => null,
  resetFrameTimes: () => {},
  isScreenShaking: () => false,
  createRoom: () => '',
  joinRoom: () => {},
  getConnectionState: () => 'new',
};

window.game = gameAPI;

console.log('Retro Joust — stub loaded');
