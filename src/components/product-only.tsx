import { useContext, type ReactNode } from 'react';
import type { Decorator } from '@storybook/react-vite';
import { Callout } from './callout/callout';
import { PanelThemeContext, singleTheme, themeNames } from './story-helpers';

// Storybook-only. Not exported from the component library.

/**
 * For components only After Graduation has so far. With another theme picked in the toolbar, the
 * story shows only a message that that theme's version hasn't been made yet, so a missing one never
 * looks like a broken theme switcher. With "All" picked, each theme's panel shows its own: the
 * component in Spotlight's panel, the message in the others.
 */
export const afterGraduationOnly: Decorator = (Story, context) => (
  <AfterGraduationOnly choice={context.globals.theme}>
    <Story />
  </AfterGraduationOnly>
);

function AfterGraduationOnly({ choice, children }: { choice: unknown; children: ReactNode }) {
  const theme = useContext(PanelThemeContext) ?? singleTheme(choice);
  if (theme !== 'after-graduation') {
    return (
      <div style={{ padding: 'var(--space-4)' }}>
        <Callout tone="info">This component hasn't been made for the {themeNames[theme]} theme yet.</Callout>
      </div>
    );
  }
  return <div data-theme="after-graduation">{children}</div>;
}
