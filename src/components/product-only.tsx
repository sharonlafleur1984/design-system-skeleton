import type { Decorator } from '@storybook/react-vite';
import { Callout } from './callout/callout';
import { themeNames, type Theme } from './story-helpers';

// Storybook-only. Not exported from the component library.

/**
 * For components only After Graduation has so far. With Life Hub or the Designer Toolkit picked in
 * the toolbar, the story shows only a message that that product's skin hasn't been made yet, so a
 * missing skin never looks like a broken theme switcher. "Both" and After Graduation show the
 * After Graduation component.
 */
export const afterGraduationOnly: Decorator = (Story, context) => {
  const theme = context.globals.theme as Theme | 'both' | undefined;
  if (theme === 'life-hub' || theme === 'designer-toolkit') {
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
