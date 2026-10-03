import type { Preview } from '@storybook/react-vite';
import '../build/css/life-hub.css';
import '../build/css/after-graduation.css';
import './fonts.css';
import './preview.css';

// The toolbar's theme picker sets data-theme, which switches every token at once.
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
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'after-graduation' },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? 'after-graduation';
      document.documentElement.setAttribute('data-theme', theme);
      return <Story />;
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
