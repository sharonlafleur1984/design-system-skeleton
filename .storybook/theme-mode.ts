export type ThemeModeMeta = { id: string; defaultMode?: 'light' | 'dark' };

export const defaultModeForTheme = (theme: string, themes: readonly ThemeModeMeta[]): 'light' | 'dark' =>
  themes.find((candidate) => candidate.id === theme)?.defaultMode ?? 'light';
