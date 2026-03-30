import type { Enemy, EnemyTier, WaveState } from '../types';
import { createEnemy, getEnemies } from './entities';
import * as C from './constants';

let currentWave = 0;
const waveHistory: Map<number, Enemy[]> = new Map();

export function resetWaves(): void {
  currentWave = 0;
  waveHistory.clear();
}

export function getCurrentWave(): number {
  return currentWave;
}

export function spawnWave(waveNumber: number): Enemy[] {
  currentWave = waveNumber;
  const enemyCount = C.BASE_ENEMIES_PER_WAVE + (waveNumber - 1) * C.ENEMIES_INCREMENT_PER_WAVE;
  const enemies: Enemy[] = [];

  for (let i = 0; i < enemyCount; i++) {
    let tier: EnemyTier = 'bounder';
    if (waveNumber >= C.SHADOW_LORD_INTRO_WAVE && Math.random() < 0.3) {
      tier = 'shadow_lord';
    } else if (waveNumber >= C.HUNTER_INTRO_WAVE && Math.random() < 0.5) {
      tier = 'hunter';
    }

    const x = Math.random() * (C.WORLD_WIDTH - C.ENEMY_WIDTH);
    const y = 50 + Math.random() * 100;
    const enemy = createEnemy({ x, y }, tier);
    enemies.push(enemy);
  }

  waveHistory.set(waveNumber, enemies);
  return enemies;
}

export function getWaveEnemies(waveNumber?: number): Enemy[] {
  if (waveNumber !== undefined) {
    return waveHistory.get(waveNumber) ?? [];
  }
  return getEnemies();
}

export function getWaveState(): WaveState {
  const enemies = getEnemies();
  return {
    waveNumber: currentWave,
    enemies,
    allDefeated: enemies.length === 0 && currentWave > 0,
  };
}

export function checkWaveComplete(): boolean {
  if (currentWave === 0) return false;
  return getEnemies().length === 0;
}

export function advanceWave(): Enemy[] {
  return spawnWave(currentWave + 1);
}
