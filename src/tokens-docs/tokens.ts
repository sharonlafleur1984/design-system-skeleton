import afterGraduation from '../../build/json/after-graduation.json';
import lifeHub from '../../build/json/life-hub.json';

export const themes = { 'after-graduation': afterGraduation, 'life-hub': lifeHub } as unknown as Record<string, Record<string, string | number>>;

/** Token names that start with a prefix, in their original order. */
export const namesWith = (prefix: string, theme = 'after-graduation') =>
  Object.keys(themes[theme]).filter((n) => n.startsWith(prefix));
