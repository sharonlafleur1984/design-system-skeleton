import { describe, expect, it } from 'vitest';
import { defaultModeForTheme } from '../.storybook/theme-mode';

describe('theme mode defaults', () => {
  const themes = [
    { id: 'spotlight' },
    { id: 'designer-toolkit', defaultMode: 'dark' as const },
  ];

  it('defaults to light unless a theme names another mode', () => {
    expect(defaultModeForTheme('spotlight', themes)).toBe('light');
    expect(defaultModeForTheme('designer-toolkit', themes)).toBe('dark');
  });
});
