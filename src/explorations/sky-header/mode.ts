import { flushSync } from 'react-dom';
import type { SkyMode } from './sky';

// Life Hub's appearance setting. Exploration only; the settings screen itself belongs in Life Hub.
//   device: follows the phone or computer (the default, so people who need dark mode get it).
//   light:  light page; the header's sky still follows the sun.
//   dark:   dark page; the header holds still at night, with its stars.
//   sun:    the header follows the sun, and the whole page fades to dark at dusk and back at dawn.
export type ModeSetting = 'device' | 'light' | 'dark' | 'sun';

export const modeLabels: Record<ModeSetting, string> = {
  device: 'Device',
  light: 'Light',
  dark: 'Dark',
  sun: 'Follow the sun',
};

export interface Appearance {
  page: SkyMode;
  /** moving: the sky follows the time of day. night: a still night sky. */
  header: 'moving' | 'night';
}

export function appearanceFor(setting: ModeSetting, { deviceDark, skyMode }: { deviceDark: boolean; skyMode: SkyMode }): Appearance {
  switch (setting) {
    case 'light':
      return { page: 'light', header: 'moving' };
    case 'dark':
      return { page: 'dark', header: 'night' };
    case 'sun':
      return { page: skyMode, header: 'moving' };
    default:
      return deviceDark ? { page: 'dark', header: 'night' } : { page: 'light', header: 'moving' };
  }
}

/**
 * Changes the page between light and dark with a slow crossfade, like a room as the light goes.
 * Uses the browser's View Transitions; browsers without it, and people who ask for reduced motion,
 * get an instant change.
 */
export function fadePageMode(update: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
  if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    update();
    return;
  }
  const root = document.documentElement;
  root.classList.add('lh-mode-fade');
  doc.startViewTransition(() => flushSync(update)).finished.finally(() => root.classList.remove('lh-mode-fade'));
}
