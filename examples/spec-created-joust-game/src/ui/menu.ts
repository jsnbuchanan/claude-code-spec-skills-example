import type { GameMode } from '../types';
import { getLeaderboard } from '../leaderboard';

export type MenuAction = { type: 'start'; mode: GameMode; players: number } | { type: 'online' } | { type: 'leaderboard' };

let menuContainer: HTMLDivElement | null = null;
let onAction: ((action: MenuAction) => void) | null = null;

function createButton(text: string, testId: string, onClick: () => void): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.setAttribute('data-testid', testId);
  btn.style.cssText = `
    display: block; width: 200px; margin: 8px auto; padding: 12px;
    background: #333; color: white; border: 2px solid #666;
    font-family: monospace; font-size: 16px; cursor: pointer;
  `;
  btn.addEventListener('mouseenter', () => { btn.style.borderColor = '#aaa'; });
  btn.addEventListener('mouseleave', () => { btn.style.borderColor = '#666'; });
  btn.addEventListener('click', onClick);
  return btn;
}

export function createMenu(actionHandler: (action: MenuAction) => void): HTMLDivElement {
  onAction = actionHandler;
  menuContainer = document.createElement('div');
  menuContainer.id = 'main-menu';
  menuContainer.setAttribute('data-testid', 'main-menu');
  menuContainer.style.cssText = `
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: rgba(26, 26, 46, 0.95); z-index: 100; color: white;
    font-family: monospace;
  `;

  const title = document.createElement('h1');
  title.textContent = 'JOUST';
  title.style.cssText = 'font-size: 48px; margin-bottom: 32px; color: #ffaa00;';
  menuContainer.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Browser Battle Arena';
  subtitle.style.cssText = 'font-size: 18px; margin-bottom: 48px; color: #888;';
  menuContainer.appendChild(subtitle);

  menuContainer.appendChild(createButton('Classic Mode', 'btn-classic', () => {
    onAction?.({ type: 'start', mode: 'classic', players: 1 });
  }));
  menuContainer.appendChild(createButton('Survival Mode', 'btn-survival', () => {
    onAction?.({ type: 'start', mode: 'survival', players: 1 });
  }));
  menuContainer.appendChild(createButton('Versus (2P Local)', 'btn-versus', () => {
    onAction?.({ type: 'start', mode: 'versus', players: 2 });
  }));
  menuContainer.appendChild(createButton('Online', 'btn-online', () => {
    onAction?.({ type: 'online' });
  }));
  menuContainer.appendChild(createButton('Leaderboard', 'leaderboard-button', () => {
    showLeaderboard();
  }));

  return menuContainer;
}

function showLeaderboard(): void {
  if (!menuContainer) return;

  // Clear menu content
  while (menuContainer.firstChild) {
    menuContainer.removeChild(menuContainer.firstChild);
  }

  const title = document.createElement('h2');
  title.textContent = 'Leaderboard';
  title.style.cssText = 'font-size: 32px; margin-bottom: 24px; color: #ffaa00;';
  menuContainer.appendChild(title);

  const list = document.createElement('div');
  list.setAttribute('data-testid', 'leaderboard-list');
  list.style.cssText = 'max-width: 400px; width: 100%;';

  const entries = getLeaderboard();
  if (entries.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'No scores yet!';
    empty.style.color = '#888';
    list.appendChild(empty);
  } else {
    for (const entry of entries.slice(0, 10)) {
      const row = document.createElement('div');
      row.setAttribute('data-testid', 'leaderboard-entry');
      row.style.cssText = `
        display: flex; justify-content: space-between;
        padding: 8px 16px; margin: 4px 0; background: #333;
        border-left: 3px solid #ffaa00;
      `;
      const name = document.createElement('span');
      name.textContent = entry.name;
      const score = document.createElement('span');
      score.textContent = String(entry.score);
      score.style.color = '#ffaa00';
      row.appendChild(name);
      row.appendChild(score);
      list.appendChild(row);
    }
  }

  menuContainer.appendChild(list);

  const backBtn = createButton('Back', 'btn-back', () => {
    hideMenu();
    const parent = menuContainer?.parentElement;
    if (parent && onAction) {
      parent.removeChild(menuContainer!);
      menuContainer = createMenu(onAction);
      parent.appendChild(menuContainer);
    }
  });
  menuContainer.appendChild(backBtn);
}

export function showMenu(): void {
  if (menuContainer) menuContainer.style.display = 'flex';
}

export function hideMenu(): void {
  if (menuContainer) menuContainer.style.display = 'none';
}

export function isMenuVisible(): boolean {
  return menuContainer?.style.display !== 'none';
}
