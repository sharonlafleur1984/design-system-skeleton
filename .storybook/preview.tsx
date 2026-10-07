import type { Preview } from '@storybook/react-vite';
import '../build/css/life-hub.css';
import '../build/css/after-graduation.css';
import '../src/fonts/life-hub.css';
import '../src/fonts/after-graduation.css';
import '../src/base.css';
import { ThemeContext, singleTheme, type ThemeChoice } from '../src/components/story-helpers';

// The toolbar's theme picker sets data-theme, which switches every token at once.
// Stories show one product at a time; "Both" shows them side by side for comparing.
const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Product theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'after-graduation', title: 'After Graduation' },
          { value: 'life-hub', title: 'Life Hub' },
          { value: 'both', title: 'Both, side by side' },
        ],
        dynamicTitle: true,
      },
    },
    mode: {
      description: 'Light or dark mode. Products follow the device setting; this switch is for review.',
      toolbar: {
        title: 'Mode',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark (Life Hub only so far)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'after-graduation', mode: 'light' },
  decorators: [
    (Story, context) => {
      const choice = (context.globals.theme ?? 'after-graduation') as ThemeChoice;
      document.documentElement.setAttribute('data-theme', singleTheme(choice));
      // Always set, so screenshots don't change with the test machine's own light or dark setting.
      document.documentElement.setAttribute('data-mode', context.globals.mode === 'dark' ? 'dark' : 'light');
      return (
        <ThemeContext.Provider value={choice}>
          <Story />
        </ThemeContext.Provider>
      );
    },
  ],
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    // Material 3 screen classes. Pick one in the toolbar to see the tokens change.
    viewport: {
      options: {
        compact: { name: 'Phone (compact)', styles: { width: '390px', height: '844px' }, type: 'mobile' },
        medium: { name: 'Tablet (medium)', styles: { width: '768px', height: '1024px' }, type: 'tablet' },
        expanded: { name: 'Desktop (expanded)', styles: { width: '1280px', height: '800px' }, type: 'desktop' },
      },
    },
  },
};
export default preview;
