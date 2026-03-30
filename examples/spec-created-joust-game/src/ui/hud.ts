// Copyright 2026 LotZoom.com. Licensed under the Apache License, Version 2.0.

import type { Player, WaveState } from '../types';

let hudContainer: HTMLDivElement | null = null;

function createSpan(testId: string, text: string, style?: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.setAttribute('data-testid', testId);
  span.textContent = text;
  if (style) span.style.cssText = style;
  return span;
}

export function createHUD(): HTMLDivElement {
  hudContainer = document.createElement('div');
  hudContainer.id = 'hud';
  hudContainer.style.cssText = `
    position: absolute; top: 0; left: 0; right: 0;
    padding: 8px 16px; display: flex; justify-content: space-between;
    color: white; font-family: monospace; font-size: 14px;
    pointer-events: none; z-index: 10;
  `;

  const scoresDiv = document.createElement('div');
  scoresDiv.setAttribute('data-testid', 'player-scores');
  scoresDiv.appendChild(createSpan('p1-score', 'P1: 0'));
  scoresDiv.appendChild(createSpan('p2-score', '', 'margin-left: 24px'));
  hudContainer.appendChild(scoresDiv);

  const waveDiv = document.createElement('div');
  waveDiv.setAttribute('data-testid', 'wave-counter');
  waveDiv.textContent = 'Wave 0';
  hudContainer.appendChild(waveDiv);

  const livesDiv = document.createElement('div');
  livesDiv.setAttribute('data-testid', 'player-lives');
  livesDiv.appendChild(createSpan('p1-lives', ''));
  livesDiv.appendChild(createSpan('p2-lives', ''));
  hudContainer.appendChild(livesDiv);

  return hudContainer;
}

export function updateHUD(players: Player[], waveState: WaveState): void {
  if (!hudContainer) return;

  const p1Score = hudContainer.querySelector('[data-testid="p1-score"]');
  const p2Score = hudContainer.querySelector('[data-testid="p2-score"]');
  const waveCounter = hudContainer.querySelector('[data-testid="wave-counter"]');
  const p1Lives = hudContainer.querySelector('[data-testid="p1-lives"]');
  const p2Lives = hudContainer.querySelector('[data-testid="p2-lives"]');

  const p1 = players.find((p) => p.playerIndex === 0);
  const p2 = players.find((p) => p.playerIndex === 1);

  if (p1Score && p1) p1Score.textContent = `P1: ${p1.score}`;
  if (p2Score && p2) p2Score.textContent = `P2: ${p2.score}`;
  if (waveCounter) waveCounter.textContent = `Wave ${waveState.waveNumber}`;
  if (p1Lives && p1) p1Lives.textContent = `\u2665 ${p1.lives}`;
  if (p2Lives && p2) p2Lives.textContent = `\u2665 ${p2.lives}`;
}
