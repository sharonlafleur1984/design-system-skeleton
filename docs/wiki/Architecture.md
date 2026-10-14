# How it fits together

**Last updated:** October 14, 2026

One page on how a value gets from a token file to a product's screen. Open this before changing the build, or when something shows up in one place and not another.

## The path a value takes

1. **Tokens** (`tokens/`): every design value, as JSON in the [DTCG format](https://www.designtokens.org/tr/drafts/format/).
   - `tokens/base/`: values every theme shares. Spacing, sizes, corners, the focus ring, the type scale, motion timing, the status names.
   - `tokens/themes/<id>/`: one folder per theme. Colors, fonts, shadows, motion feel, art. `theme.json` names it; an optional `dark/` folder holds dark values.
2. **Token build** (`scripts/build-tokens.mjs`, run by `npm run tokens`): [Style Dictionary](https://styledictionary.com/) turns each theme plus the base into:
   - `build/css/<id>.css`: CSS variables under `[data-theme="<id>"]`, with dark values under `prefers-color-scheme: dark`
   - `build/json/`: the same values as JSON, for the Foundations pages and the tests
   - `build/themes.json`: every theme's id, name and order. Everything else reads theme names from here.
3. **Components** (`src/components/<name>/`): React components on [React Aria Components](https://react-aria.adobe.com/). Their CSS uses only `var(--token)`, so each theme restyles them without touching the component.
4. **Storybook** (`.storybook/`, `npm run storybook`): loads every theme's CSS and fonts, and the toolbar sets `data-theme`. It's [published on Netlify](https://designsystemskeleton.netlify.app/), with a preview for every pull request.
5. **Package** (`vite.lib.config.ts`, `npm run build:lib`): builds `dist/` from `src/components/index.ts`: the components, one components CSS file, the base styles and each theme's fonts. A version tag attaches it to a GitHub Release ([README](../../blob/main/README.md#use-it-in-an-app)).
6. **Apps** install a release, load one theme's CSS and fonts, and set `data-theme` on the page.

## What checks what

| Check | Runs | Catches |
|---|---|---|
| `tests/tokens.test.ts` | `npm test`, every pull request | A theme missing a shared name, text under 4.5:1 contrast, a theme setting spacing, a token set twice, a theme without `theme.json` or fonts |
| `tests/token-lock.test.ts` | `npm test` | Any token value that changed. Update on purpose with `npm run test:update`. |
| `tests/component-css.test.ts` | `npm test` | Raw colors, sizes or weights in component CSS, a `var()` that isn't a token, a breakpoint that isn't shared |
| `tests/components.test.tsx` | `npm test` | Components that lose their role, name or keyboard behavior, and axe accessibility errors |
| ESLint | `npm run lint` | Code mistakes: React hook rules, accessibility in JSX |
| Screenshots (`tests/visual/`) | Every pull request | Any story that looks different in any theme. Approve with the `update-screenshots` label. |

## Where the materials come from

Components that sit on artwork take a `material`: `default` (the frosted recipe in `glass.css`) or `glass` (one WebGL canvas per group that bends the art behind, in `glass-lens/`). The glass code is experimental until [issue #60](https://github.com/sharonlafleur1984/design-system-skeleton/issues/60).

## Related

- [Add a theme](Add-a-theme)
- [Add a component](Add-a-component)
- [Themes](Themes)
