import type { Decorator } from '@storybook/react-vite';
import { Callout } from './callout/callout';
import { singleTheme, themeNames } from './story-helpers';

// Storybook-only. Not exported from the component library.

/**
 * For components only After Graduation has so far. With another theme picked in the toolbar, the
 * story shows only a message that that theme's skin hasn't been made yet, so a missing skin never
 * looks like a broken theme switcher. "All" and After Graduation show the After Graduation component.
 */
export const afterGraduationOnly: Decorator = (Story, context) => {
  const theme = singleTheme(context.globals.theme);
  if (theme !== 'after-graduation') {
    return (
      <div style={{ padding: 'var(--space-4)' }}>
        <Callout tone="info">The {themeNames[theme]} skin for this component hasn't been created yet.</Callout>
      </div>
    );
  }
  return (
    <div data-theme="after-graduation">
      <Story />
    </div>
  );
};
