import type { Preview } from '@storybook/react-vite';
import '../src/base.css';
import themes from '../build/themes.json';
import '../build/text-styles.css';
import { BothThemes, LightScene, ThemeContext, singleTheme, storyBackgrounds, storyBackgroundsCss, type ThemeChoice } from '../src/components/story-helpers';

// Every theme's tokens and fonts, found by file name, so a new theme needs no change here.
import.meta.glob('../build/css/*.css', { eager: true });
import.meta.glob('../src/fonts/*.css', { eager: true });

// The toolbar's theme picker sets data-theme, which switches every token at once.
// Stories show one product at a time; "All" shows them side by side for comparing.
// A theme marked alwaysDark in its theme.json (Fireside) doesn't change with the Mode switch.
const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Theme: each product has its own',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [...themes.map((t) => ({ value: t.id, title: t.name })), { value: 'both', title: 'All' }],
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
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: themes[0].id, mode: 'light' },
  decorators: [
    (Story, context) => {
      const choice = (context.globals.theme ?? themes[0].id) as ThemeChoice;
      document.documentElement.setAttribute('data-theme', singleTheme(choice));
      // Always set, so screenshots don't change with the test machine's own light or dark setting.
      document.documentElement.setAttribute('data-mode', context.globals.mode === 'dark' ? 'dark' : 'light');
      // With "All" picked, every component story is drawn once per theme, each labeled. Full-screen
      // stories (a whole page) and the Foundations pages show one theme at a time.
      const sideBySide = choice === 'both' && context.title.startsWith('Components/') && context.parameters.layout !== 'fullscreen';
      return (
        <ThemeContext.Provider value={choice}>
          <style>{storyBackgroundsCss}</style>
          {/* Every story that shows glass gets the page's light, as a sun you can move. */}
          <LightScene>
            {sideBySide ? (
              <BothThemes>
                <Story />
              </BothThemes>
            ) : (
              <Story />
            )}
          </LightScene>
        </ThemeContext.Provider>
      );
    },
  ],
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    options: {
      // Welcome comes first, so Storybook opens on it and every component starts collapsed.
      // Inside a component, its stories come first and its Docs page last.
      // Storybook copies this function as plain JavaScript, so it can't use anything from outside
      // it or carry TypeScript types.
      storySort: (a, b) => {
        const wa = a.title === 'Welcome' ? 0 : 1;
        const wb = b.title === 'Welcome' ? 0 : 1;
        if (wa !== wb) return wa - wb;
        if (a.title !== b.title) return 0;
        return (a.type === 'docs' ? 1 : 0) - (b.type === 'docs' ? 1 : 0);
      },
    },
    // The paint bucket in the toolbar: Page or On artwork, in the theme picked (story-helpers).
    // No default, so stories keep their plain canvas unless they ask for one, like Action tile.
    backgrounds: { options: storyBackgrounds },
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
