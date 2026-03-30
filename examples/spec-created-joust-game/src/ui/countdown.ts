// Copyright 2026 LotZoom.com. Licensed under the Apache License, Version 2.0.

// Retro-style "READY PLAYER 1" + 3..2..1..FIGHT countdown with beeps

const BEEP_FREQ = [440, 440, 440, 880]; // 3, 2, 1 = A4; FIGHT = A5
const BEEP_DURATION = [0.15, 0.15, 0.15, 0.3];

function playBeep(freqHz: number, durationSec: number): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freqHz;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationSec);
    setTimeout(() => ctx.close(), (durationSec + 0.1) * 1000);
  } catch {
    // Audio not available — skip
  }
}

function createOverlay(container: HTMLElement): HTMLDivElement {
  const overlay = document.createElement('div');
  overlay.setAttribute('data-testid', 'countdown-overlay');
  overlay.style.cssText = `
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: rgba(0, 0, 0, 0.75); z-index: 120;
    pointer-events: none;
  `;
  container.appendChild(overlay);
  return overlay;
}

function createText(text: string, fontSize: number, color: string): HTMLDivElement {
  const el = document.createElement('div');
  el.textContent = text;
  el.style.cssText = `
    font-family: monospace; font-size: ${fontSize}px; color: ${color};
    text-transform: uppercase; letter-spacing: 6px;
    text-shadow: 0 0 20px ${color}, 0 0 40px ${color}44;
    opacity: 0; transition: opacity 0.15s, transform 0.15s;
    transform: scale(0.5);
  `;
  return el;
}

function animateIn(el: HTMLElement): void {
  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'scale(1)';
  });
}

function animateOut(el: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    el.style.opacity = '0';
    el.style.transform = 'scale(1.5)';
    setTimeout(resolve, 200);
  });
}

function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function showCountdown(
  playerCount: number,
  container: HTMLElement,
): Promise<void> {
  const overlay = createOverlay(container);

  // READY PLAYER 1 (or READY PLAYERS)
  const readyLabel = playerCount > 1 ? 'READY PLAYERS' : 'READY PLAYER 1';
  const readyEl = createText(readyLabel, 42, '#ffaa00');
  overlay.appendChild(readyEl);
  animateIn(readyEl);
  playBeep(330, 0.2);
  await wait(1500);
  await animateOut(readyEl);
  overlay.removeChild(readyEl);

  // 3..2..1..FIGHT
  const steps = ['3', '2', '1', 'FIGHT!'];
  for (let i = 0; i < steps.length; i++) {
    const isFight = i === 3;
    const el = createText(steps[i], isFight ? 64 : 80, isFight ? '#ff4400' : '#ffffff');
    overlay.appendChild(el);
    animateIn(el);
    playBeep(BEEP_FREQ[i], BEEP_DURATION[i]);
    await wait(isFight ? 600 : 800);
    await animateOut(el);
    overlay.removeChild(el);
  }

  overlay.remove();
}
