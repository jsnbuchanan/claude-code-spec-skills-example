// Copyright 2026 LotZoom.com. Licensed under the Apache License, Version 2.0.

import type { Vector2 } from '../types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: number;
  size: number;
}

const particles: Particle[] = [];

export function emitParticles(position: Vector2, count: number, color = 0xffaa00): void {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: position.x,
      y: position.y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6 - 2,
      life: 0,
      maxLife: 30 + Math.random() * 30,
      color,
      size: 2 + Math.random() * 3,
    });
  }
}

export function updateParticles(dt: number): void {
  const scale = dt / 16;
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * scale;
    p.y += p.vy * scale;
    p.vy += 0.1 * scale;
    p.life += scale;
    if (p.life >= p.maxLife) {
      particles.splice(i, 1);
    }
  }
}

export function getParticles(): Particle[] {
  return particles;
}

export function getParticleCount(): number {
  return particles.length;
}

export function clearParticles(): void {
  particles.length = 0;
}
