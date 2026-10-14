// Every theme's built tokens, found by file name, so a new theme shows up in the Foundations pages
// with no change here.
const files = import.meta.glob<{ default: Record<string, string | number> }>('../../build/json/*.json', { eager: true });
const byTheme = (suffix: string) =>
  Object.fromEntries(
    Object.entries(files)
      .filter(([path]) => path.endsWith(suffix) && (suffix !== '.json' || !path.endsWith('.screen-classes.json')))
      .map(([path, mod]) => [path.split('/').pop()!.replace(suffix, ''), mod.default]),
  );

export const themes = byTheme('.json') as Record<string, Record<string, string | number>>;

export type ScreenSizes = { compact: string; medium: string; expanded: string };
/** Tokens that change by screen class, with their phone, tablet and desktop sizes. */
export const screenClasses = byTheme('.screen-classes.json') as unknown as Record<string, Record<string, ScreenSizes>>;

/** Token names that start with a prefix, in their original order. */
export const namesWith = (prefix: string, theme = 'after-graduation') =>
  Object.keys(themes[theme]).filter((n) => n.startsWith(prefix));
