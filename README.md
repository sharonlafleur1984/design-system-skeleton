# Design system

One design system for all my products: a shared base, with a theme for each product.

**The problem:** each of my products was defining its own colors, spacing and type. A fix in one never reached the others, and the After Graduation prototype alone had 98 different hex colors in its CSS.

**The fix:** one system underneath, a different look on top.

- **The shared base:** structure and naming, the spacing scale, type line heights and weights, radius, one status color set (error, warning, success, info, neutral), and accessibility rules.
- **A theme per product:** Life Hub, After Graduation and, later, my designer toolkit each bring their own colors, fonts and personality.

Fix something in the base once, and every product gets it.

## How it stays honest

Four automatic checks run on every pull request:

- **The contract:** every theme defines every shared token name, so any component works in any theme.
- **Readability:** every text color meets WCAG 2.2 AA contrast (4.5:1) on the surfaces it sits on.
- **The token lock:** every token value for every theme is saved in `tests/token-lock/`. Any change shows up in the pull request as a before and after, and fails until it's approved with `npm run test:update`.
- **Visual tests:** every Storybook story is screenshotted at phone, tablet and desktop and compared with the approved screenshots. To approve a change on purpose, add the `update-screenshots` label to the pull request.

## Try it

**[See it in Storybook](https://designsystemskeleton.netlify.app/)**, and switch themes in the toolbar.

Or run it yourself:

```bash
npm install
npm run storybook   # opens Storybook; switch themes in the toolbar
npm test            # contract, contrast and token lock
npm run build-storybook && npm run test:visual   # visual tests
```

## Use it in an app

Apps install a tagged version straight from GitHub, so an update only arrives when the app chooses it:

```bash
npm install github:sharonlafleur1984/design-system-skeleton#v0.2.0
```

Then load the theme, its fonts and the component styles once, set the theme on the page, and import components:

```ts
import 'design-system-skeleton/themes/after-graduation.css';
import 'design-system-skeleton/fonts/after-graduation.css';
import 'design-system-skeleton/components.css';
import { Button } from 'design-system-skeleton';
// <html data-theme="after-graduation">
```

Installing runs `npm run build:lib`, which turns `src/components` into the package in `dist/`. To release a change, merge it, then tag `main` with the next version.

## Where things are

- `tokens/base/`: the shared base
- `tokens/themes/<product>/`: each product's colors, fonts and shadows
- After Graduation's color rules: [Decisions](../../wiki/Decisions)
- `scripts/build-tokens.mjs`: turns the tokens into CSS variables, one file per theme
- `src/components/`: the components, each with its Storybook page
- `src/fonts/`: each theme's fonts
- `src/tokens-docs/`: the Storybook pages for colors, type, space, radius and shadow
- [Wiki](../../wiki): the Dashboard, Roadmap and Decisions

Tokens use the [W3C design tokens format](https://www.designtokens.org/tr/drafts/format/) (DTCG) and are built with [Style Dictionary](https://styledictionary.com/).

Part of [how I work](https://github.com/sharonlafleur1984/how-i-work).
