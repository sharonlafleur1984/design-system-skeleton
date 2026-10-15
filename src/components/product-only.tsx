import type { Decorator } from '@storybook/react-vite';
import { Callout } from './callout/callout';
import { singleTheme, themeNames } from './story-helpers';

// Storybook-only. Not exported from the component library.

/**
 * For components only After Graduation has so far. With another theme picked in the toolbar, the
 * story shows only a message that that theme's version hasn't been made yet, so a missing one never
 * looks like a broken theme switcher. "All" and After Graduation show the After Graduation component.
 */
export const afterGraduationOnly: Decorator = (Story, context) => {
  const theme = singleTheme(context.globals.theme);
  // A component page says this in its own Try it out windows (componentPage.onlyIn), and keeps its theme bar.
  if (context.tags.includes('page')) return <Story />;
  if (theme !== 'after-graduation') {
    return (
      <div style={{ padding: 'var(--space-4)' }}>
        <Callout tone="info">This component hasn't been made for the {themeNames[theme]} theme yet.</Callout>
      </div>
    );
  }
  return (
    <div data-theme="after-graduation">
      <Story />
    </div>
  );
};
