import type { Preview } from '@storybook/react-vite';
import '../src/base.css';
import themes from '../build/themes.json';
import '../build/text-styles.css';
import '../src/components/corners.css';
import { Controls, Description, Primary, Stories, Subtitle, Title } from '@storybook/addon-docs/blocks';
import { DocsThemePicker, THEME_CHOICE_EVENT, ThemePicker } from './theme-picker';
import { ComponentPage, useComponentPage } from './component-page';
import { CompareAll, LightScene, ThemeContext, singleTheme, storyBackgrounds, storyBackgroundsCss, type ThemeChoice } from '../src/components/story-helpers';

// Every theme's tokens and fonts, found by file name, so a new theme needs no change here.
import.meta.glob('../build/css/*.css', { eager: true });
import.meta.glob('../src/fonts/*.css', { eager: true });

// The toolbar's theme picker sets data-theme, which switches every token at once.
// Stories show one product at a time; "Compare all" shows every story once per theme, side by side
// (a story that already shows every theme sets parameters.compareAll = false).
// The same picker sits on the page above each story (theme-picker.tsx), because a menu in the toolbar is
// easy to miss. Screenshot tests hide it with the global picker:hide.
// A theme marked alwaysDark in its theme.json (Fireside) doesn't change with the Mode switch.
/**
 * Every Docs page. A component (parameters.componentPage) gets the component template; any other page
 * gets its name, what it's for, the theme picker once at the top, then its stories.
 */
function DocsPage() {
  const page = useComponentPage();
  if (page) return <ComponentPage {...page} />;
  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      <DocsThemePicker />
      <Primary />
      <Controls />
      {/* The first story is already shown above with its controls, so the list starts with the second. */}
      <Stories includePrimary={false} />
    </>
  );
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Theme: each product has its own',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [...themes.map((t) => ({ value: t.id, title: t.name })), { value: 'both', title: 'Compare all' }],
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
    // Not in the toolbar: screenshot tests set picker:hide so the on-page picker stays out of the pictures.
    picker: { description: 'Show or hide the theme picker on the page' },
    // Set from the bar above the story: one of the theme's backgrounds (its theme.json), or empty for the plain page.
    background: { description: "A theme's background behind the story" },
  },
  initialGlobals: { theme: themes[0].id, mode: 'light' },
  decorators: [
    (Story, context) => {
      const choice = (context.globals.theme ?? themes[0].id) as ThemeChoice;
      document.documentElement.setAttribute('data-theme', singleTheme(choice));
      // The bar above the story (theme-picker.tsx): its settings, so a Docs page's bar can show them too.
      const root = document.documentElement;
      const mode = context.globals.mode === 'dark' ? 'dark' : 'light';
      // A background only counts while a theme on show has it, so switching to a theme without any shows its plain page.
      const shownThemes = (themes as { id: string; backgrounds?: { file: string }[] }[]).filter((t) => choice === 'both' || t.id === choice);
      const picked = typeof context.globals.background === 'string' ? context.globals.background : '';
      const background = shownThemes.some((t) => t.backgrounds?.some((b) => b.file === picked)) ? picked : '';
      if (background) {
        root.dataset.sbBackdrop = '';
        root.style.setProperty('--story-backdrop', `url('${background}')`);
      } else {
        delete root.dataset.sbBackdrop;
        root.style.removeProperty('--story-backdrop');
      }
      if (root.dataset.themeChoice !== choice || root.dataset.sbMode !== mode || (root.dataset.sbBackground ?? '') !== background) {
        root.dataset.themeChoice = choice;
        root.dataset.sbMode = mode;
        root.dataset.sbBackground = background;
        window.dispatchEvent(new Event(THEME_CHOICE_EVENT));
      }
      // Always set, so screenshots don't change with the test machine's own light or dark setting.
      document.documentElement.setAttribute('data-mode', context.globals.mode === 'dark' ? 'dark' : 'light');
      return (
        <ThemeContext.Provider value={choice}>
          <style>{storyBackgroundsCss}</style>
          {/* Every story that shows glass gets the page's light, as a sun you can move. */}
          {context.viewMode !== 'docs' && context.globals.picker !== 'hide' && <ThemePicker theme={choice} mode={mode} background={background} />}
          <LightScene>
            {choice === 'both' && context.parameters.compareAll !== false ? <CompareAll render={(theme) => Story({ globals: { ...context.globals, theme } })} /> : <Story />}
          </LightScene>
        </ThemeContext.Provider>
      );
    },
  ],
  parameters: {
    // Every Docs page: the theme picker once at the top, under the name and what it's for.
    // The Controls tab shows what each setting does, not only its name (the template's What it does).
    controls: { expanded: true },
    docs: {
      page: DocsPage,
    },
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
