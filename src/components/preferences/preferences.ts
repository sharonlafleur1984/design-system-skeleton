import { useCallback, useEffect, useState } from 'react';

// Appearance and accessibility preferences. Anything the device can tell us defaults to "system"
// (match device) and can be overridden either way, except motion: if the device asks for reduced
// motion, motion stays reduced whatever is picked here. Preferences apply as attributes on <html>,
// which base.css turns into token changes. They're kept in this browser for now; the app will also
// save them to the account so they follow a student between devices.

export type Preferences = {
  /** Light, dark or match device. */
  theme: 'system' | 'light' | 'dark';
  /** More contrast: match device, on, or standard. */
  contrast: 'system' | 'more' | 'standard';
  /** Reduce motion: match device, or on. Device "reduce" always wins. */
  motion: 'system' | 'reduce';
  /** Celebrations and animated moments: match device, on (energetic), or off (calm). */
  celebrations: 'system' | 'on' | 'off';
  /** Reduce transparency: match device, on (solid glass), or standard. */
  transparency: 'system' | 'reduce' | 'standard';
  /** Text size as a percentage of the browser's own size. */
  textSize: 100 | 125 | 150 | 200;
  /** Space between letters and words. */
  textSpacing: 'normal' | 'wide' | 'extra';
  /** Underline every link. */
  underlineLinks: boolean;
};

export const defaultPreferences: Preferences = {
  theme: 'system',
  contrast: 'system',
  motion: 'system',
  celebrations: 'system',
  transparency: 'system',
  textSize: 100,
  textSpacing: 'normal',
  underlineLinks: true,
};

const KEY = 'ds-preferences';

function read(): Preferences {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultPreferences, ...JSON.parse(raw) } : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
}

function setAttr(el: HTMLElement, name: string, value: string | null) {
  if (value === null) el.removeAttribute(name);
  else el.setAttribute(name, value);
}

/** Applies preferences to the page. Call before first paint (for example in a small inline script) to avoid a flash. */
export function applyPreferences(p: Preferences, root: HTMLElement = document.documentElement) {
  setAttr(root, 'data-mode', p.theme === 'system' ? null : p.theme);
  setAttr(root, 'data-contrast', p.contrast === 'system' ? null : p.contrast);
  setAttr(root, 'data-reduce-motion', p.motion === 'reduce' ? '' : null);
  setAttr(root, 'data-motion', p.celebrations === 'on' ? 'energetic' : p.celebrations === 'off' ? 'calm' : null);
  setAttr(root, 'data-transparency', p.transparency === 'system' ? null : p.transparency);
  setAttr(root, 'data-text-spacing', p.textSpacing === 'normal' ? null : p.textSpacing);
  setAttr(root, 'data-underline-links', p.underlineLinks ? '' : null);
  root.style.fontSize = p.textSize === 100 ? '' : `${p.textSize}%`;
}

/** Reads and saves preferences, and applies every change right away (no Save button). */
export function usePreferences(options: { apply?: boolean } = {}) {
  const { apply = true } = options;
  const [prefs, setPrefs] = useState<Preferences>(read);
  useEffect(() => {
    if (apply) applyPreferences(prefs);
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      // Private windows can block storage; preferences still work for this visit.
    }
  }, [prefs, apply]);
  const set = useCallback(<K extends keyof Preferences>(key: K, value: Preferences[K]) => setPrefs((p) => ({ ...p, [key]: value })), []);
  const reset = useCallback(() => setPrefs(defaultPreferences), []);
  return { prefs, set, reset };
}
