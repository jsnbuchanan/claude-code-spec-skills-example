export interface Vector2 {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  type: 'player' | 'enemy' | 'egg';
  position: Vector2;
  velocity: Vector2;
  width: number;
  height: number;
}

export interface Player extends Entity {
  type: 'player';
  playerIndex: number;
  score: number;
  lives: number;
  isFlapping: boolean;
  hasShield: boolean;
  lanceHeight: number;
}

export type EnemyTier = 'bounder' | 'hunter' | 'shadow_lord';

export interface Enemy extends Entity {
  type: 'enemy';
  tier: EnemyTier;
}

export interface Egg extends Entity {
  type: 'egg';
  hatchTimer: number;
  hatchTimeout: number;
  sourceTier: EnemyTier;
}

export interface CombatResult {
  winner: string;
  loser: string;
  eggSpawned: boolean;
}

export interface WaveState {
  waveNumber: number;
  enemies: Enemy[];
  allDefeated: boolean;
}

export type GameMode = 'classic' | 'survival' | 'versus';

export interface LeaderboardEntry {
  name: string;
  score: number;
  mode: GameMode;
  timestamp: number;
}

export interface GameTestAPI {
  getPlayerPosition(playerIndex?: number): Vector2 | null;
  getLastCombatResult(): CombatResult | null;
  getEntities(type?: Entity['type']): Entity[];
  getWaveEnemies(waveNumber?: number): Enemy[];
  getWaveState(): WaveState;
  getFPS(): number;
  getFrameTimes(): number[];
  getParticleCount(): number;
  getScore(playerIndex?: number): number;
  setTestMode(enabled: boolean): void;
  spawnEntity(type: Entity['type'], position: Vector2, options?: Record<string, unknown>): string;
  killAllEnemies(): void;
  triggerCombat(entityA: string, entityB: string): CombatResult | null;
}

declare global {
  interface Window {
    game: GameTestAPI;
  }
}
