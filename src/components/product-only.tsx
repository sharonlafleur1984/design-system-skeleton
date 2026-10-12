import type { Decorator } from '@storybook/react-vite';
import { Callout } from './callout/callout';

// Storybook-only. Not exported from the component library.

/**
 * For components only After Graduation has so far. With Life Hub picked in the toolbar, the story
 * shows only a message that Life Hub's skin hasn't been made yet, so a missing skin never looks
 * like a broken theme switcher. "Both" and After Graduation show the After Graduation component.
 */
export const afterGraduationOnly: Decorator = (Story, context) => {
  if (context.globals.theme === 'life-hub') {
    return (
      <div style={{ padding: 'var(--space-4)' }}>
        <Callout tone="info">The Life Hub skin for this component hasn't been created yet.</Callout>
      </div>
    );
  }
  return (
    <div data-theme="after-graduation">
      <Story />
    </div>
  );
};
