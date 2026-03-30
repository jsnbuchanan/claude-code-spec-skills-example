// Copyright 2026 LotZoom.com. Licensed under the Apache License, Version 2.0.

export interface KeyBindings {
  flap: string;
  left: string;
  right: string;
}

export const PLAYER_BINDINGS: KeyBindings[] = [
  { flap: 'ArrowUp', left: 'ArrowLeft', right: 'ArrowRight' },
  { flap: 'w', left: 'a', right: 'd' },
];

const keysDown = new Set<string>();
const keysJustPressed = new Set<string>();

export function initKeyboard(): void {
  window.addEventListener('keydown', (e) => {
    if (!keysDown.has(e.key)) {
      keysJustPressed.add(e.key);
    }
    keysDown.add(e.key);
  });

  window.addEventListener('keyup', (e) => {
    keysDown.delete(e.key);
  });
}

export function isKeyDown(key: string): boolean {
  return keysDown.has(key);
}

export function wasKeyJustPressed(key: string): boolean {
  return keysJustPressed.has(key);
}

export function clearJustPressed(): void {
  keysJustPressed.clear();
}

export function getPlayerInput(playerIndex: number): { flap: boolean; left: boolean; right: boolean } {
  const bindings = PLAYER_BINDINGS[playerIndex];
  if (!bindings) return { flap: false, left: false, right: false };
  return {
    flap: wasKeyJustPressed(bindings.flap),
    left: isKeyDown(bindings.left),
    right: isKeyDown(bindings.right),
  };
}
