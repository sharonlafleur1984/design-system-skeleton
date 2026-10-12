import type { Decorator } from '@storybook/react-vite';
import { Callout } from './callout/callout';

// Storybook-only. Not exported from the component library.

/**
 * For components only After Graduation has so far. Always shows the After Graduation look, and
 * when the toolbar is set to another theme, says so above the story, so a locked theme never
 * looks like a broken theme switcher.
 */
export const afterGraduationOnly: Decorator = (Story, context) => {
  const locked = context.globals.theme !== 'after-graduation';
  return (
    <div data-theme="after-graduation">
      {locked && (
        <div style={{ padding: 'var(--space-4)' }}>
          <Callout tone="info">Only After Graduation has this component so far, so it shows the After Graduation look.</Callout>
        </div>
      )}
      <Story />
    </div>
  );
};
