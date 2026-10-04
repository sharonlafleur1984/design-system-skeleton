import afterGraduation from '../../build/json/after-graduation.json';
import lifeHub from '../../build/json/life-hub.json';
import agScreens from '../../build/json/after-graduation.screen-classes.json';
import lhScreens from '../../build/json/life-hub.screen-classes.json';

export const themes = { 'after-graduation': afterGraduation, 'life-hub': lifeHub } as unknown as Record<string, Record<string, string | number>>;

export type ScreenSizes = { compact: string; medium: string; expanded: string };
/** Tokens that change by screen class, with their phone, tablet and desktop sizes. */
export const screenClasses = { 'after-graduation': agScreens, 'life-hub': lhScreens } as unknown as Record<string, Record<string, ScreenSizes>>;

/** Token names that start with a prefix, in their original order. */
export const namesWith = (prefix: string, theme = 'after-graduation') =>
  Object.keys(themes[theme]).filter((n) => n.startsWith(prefix));
