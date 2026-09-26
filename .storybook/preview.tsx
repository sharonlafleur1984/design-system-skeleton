import type { Preview } from '@storybook/react-vite';
import '../build/css/life-hub.css';
import '../build/css/after-graduation.css';
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
  parameters: { a11y: { test: 'error' }, layout: 'padded' },
};
export default preview;
