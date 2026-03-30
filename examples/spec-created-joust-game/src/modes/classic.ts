import { spawnWave, checkWaveComplete, advanceWave, getWaveState, resetWaves } from '../engine/waves';
import { tick as eggTick } from '../engine/egg';

let waveAdvanceTimer = 0;
const WAVE_ADVANCE_DELAY = 1000; // ms between waves

export function initClassicMode(): void {
  resetWaves();
  spawnWave(1);
}

export function updateClassicMode(dt: number): void {
  eggTick(dt);

  if (checkWaveComplete()) {
    waveAdvanceTimer += dt;
    if (waveAdvanceTimer >= WAVE_ADVANCE_DELAY) {
      advanceWave();
      waveAdvanceTimer = 0;
    }
  } else {
    waveAdvanceTimer = 0;
  }
}

export function getClassicState() {
  return getWaveState();
}
