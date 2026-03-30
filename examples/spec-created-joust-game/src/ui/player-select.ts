import type { PlayerAvatar } from '../types';

const AVATARS: { name: string; imageKey: string; src: string }[] = [
  { name: 'Brian', imageKey: 'brian', src: '/players/brian.png' },
  { name: 'Les', imageKey: 'les', src: '/players/les.png' },
  { name: 'Matt', imageKey: 'matt', src: '/players/matt.png' },
  { name: 'Trent', imageKey: 'trent', src: '/players/trent.png' },
];

export function showPlayerSelect(
  playerLabel: string,
  container: HTMLElement,
): Promise<PlayerAvatar> {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.setAttribute('data-testid', 'player-select');
    overlay.style.cssText = `
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: rgba(10, 10, 30, 0.95); z-index: 110;
      color: white; font-family: monospace;
    `;

    const heading = document.createElement('h2');
    heading.textContent = `Select Your Jouster \u2014 ${playerLabel}`;
    heading.style.cssText = 'font-size: 24px; margin-bottom: 32px; color: #ffaa00;';
    overlay.appendChild(heading);

    const grid = document.createElement('div');
    grid.style.cssText = `
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 16px; margin-bottom: 24px;
    `;

    function pick(avatar: PlayerAvatar) {
      overlay.remove();
      resolve(avatar);
    }

    for (const av of AVATARS) {
      const btn = document.createElement('button');
      btn.setAttribute('data-testid', `avatar-${av.imageKey}`);
      btn.style.cssText = `
        display: flex; flex-direction: column; align-items: center;
        padding: 16px 24px; background: #222; border: 2px solid #444;
        cursor: pointer; transition: border-color 0.15s, transform 0.15s;
        min-width: 120px;
      `;
      btn.addEventListener('mouseenter', () => {
        btn.style.borderColor = '#ffaa00';
        btn.style.transform = 'scale(1.05)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.borderColor = '#444';
        btn.style.transform = 'scale(1)';
      });

      const img = document.createElement('img');
      img.src = av.src;
      img.alt = av.name;
      img.style.cssText = 'width: 64px; height: 64px; object-fit: contain; margin-bottom: 8px;';
      btn.appendChild(img);

      const label = document.createElement('span');
      label.textContent = av.name;
      label.style.cssText = 'color: white; font-family: monospace; font-size: 14px;';
      btn.appendChild(label);

      btn.addEventListener('click', () => {
        pick({ name: av.name, imageKey: av.imageKey, isDefault: false });
      });

      grid.appendChild(btn);
    }

    overlay.appendChild(grid);

    // New Player button
    const newBtn = document.createElement('button');
    newBtn.setAttribute('data-testid', 'avatar-new');
    newBtn.textContent = 'New Player';
    newBtn.style.cssText = `
      padding: 12px 32px; background: #333; border: 2px solid #555;
      color: white; font-family: monospace; font-size: 16px; cursor: pointer;
      transition: border-color 0.15s;
    `;
    newBtn.addEventListener('mouseenter', () => { newBtn.style.borderColor = '#aaa'; });
    newBtn.addEventListener('mouseleave', () => { newBtn.style.borderColor = '#555'; });
    newBtn.addEventListener('click', () => {
      pick({ name: 'Player', imageKey: '', isDefault: true });
    });
    overlay.appendChild(newBtn);

    container.appendChild(overlay);
  });
}
