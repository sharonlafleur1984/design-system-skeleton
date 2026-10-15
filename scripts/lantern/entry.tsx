// The Lantern bundle: every built part, and a mount function each preview calls. Built by
// build-lantern.mjs into components/bundle.js, one classic script that assigns window.Lantern.
// React is bundled in, since the library needs React 19 and Lantern's previews offer only 18.
import { createElement, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import * as library from '../../src/components';
// Every part's page words, by name; build-lantern.mjs writes this module from the page files.
import { pages } from 'lantern:pages';

// Lantern's theme ids, and the repo's theme and mode each one shows.
const themes: Record<string, { theme: string; mode: 'light' | 'dark' }> = {
  spotlight: { theme: 'after-graduation', mode: 'light' },
  'spotlight-dark': { theme: 'after-graduation', mode: 'dark' },
  sunrise: { theme: 'life-hub', mode: 'light' },
  'sunrise-dark': { theme: 'life-hub', mode: 'dark' },
  fireside: { theme: 'designer-toolkit', mode: 'dark' },
};

/** Shows a part's example (its "Use it for this" example from Storybook) in the theme Lantern has picked. */
function mount(el: HTMLElement, name: string) {
  const example = pages[name]?.do?.example as ReactNode;
  const root = createRoot(el);
  const draw = () => {
    const picked = themes[document.documentElement.dataset.theme ?? ''] ?? themes.spotlight;
    el.setAttribute('data-theme', picked.theme);
    el.setAttribute('data-mode', picked.mode);
    root.render(createElement('div', { className: 'lantern-preview' }, example));
  };
  draw();
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

export default { ...library, mount };
