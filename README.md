# Design system

- **[See it live in Storybook](https://designsystemskeleton.netlify.app/)**, and switch themes with the picker above every story.
- **[Read the project wiki](https://github.com/sharonlafleur1984/design-system-skeleton/wiki)**: the dashboard, roadmap and decisions.

> **This is a work in progress.** In this day of AI design, things are moving fast, and I'm moving a million miles a minute to get relevant design experience for this new age as I look for my next career opportunity. I'd love to share what I'm learning with whoever I end up with next. You can see the whole thing in all its messy glory, but don't expect it to be polished.

One design system for all my products: a shared base, with a theme for each product.

**The problem:** each of my products was defining its own colors, spacing and type. A fix in one never reached the others, and the After Graduation prototype alone had 98 different hex colors in its CSS.

**The fix:** one system underneath, a different look on top.

- **The shared base:** structure and naming, the spacing scale, type line heights and weights, radius, the status names and rules (error, warning, success, info, neutral: always with an icon and a label, text always readable), and accessibility rules.
- **A theme per product:** Life Hub, After Graduation and my designer toolkit (Fireside) each bring their own colors (status colors included), fonts and personality.

Fix something in the base once, and every product gets it.

## How it stays honest

Four automatic checks run on every pull request:

- **The contract:** every theme defines every shared token name, so any component works in any theme.
- **Readability:** every text color meets WCAG 2.2 AA contrast (4.5:1) on the surfaces it sits on.
- **The token lock:** every token value for every theme is saved in `tests/token-lock/`. Any change shows up in the pull request as a before and after, and fails until it's approved with `npm run test:update`.
- **Visual tests:** every Storybook story is screenshotted at phone, tablet and desktop and compared with the approved screenshots. If something looks different, the check says so on the pull request. Add the `update-screenshots` label and the biggest changes appear right there, before and after. Nothing reaches `main` until you merge.

## Try it

**[See it in Storybook](https://designsystemskeleton.netlify.app/)**, and switch themes with the picker above every story.

Or run it yourself:

```bash
npm install
npm run storybook   # opens Storybook; switch themes in the toolbar
npm test            # contract, contrast and token lock
npm run build-storybook && npm run test:visual   # visual tests
```

## Use it in an app

Apps install one version's package file from its [GitHub Release](https://github.com/sharonlafleur1984/design-system-skeleton/releases), so an update only arrives when the app chooses it. The file holds only the built components, theme CSS and fonts, not the whole repo:

```bash
npm install https://github.com/sharonlafleur1984/design-system-skeleton/releases/download/v0.4.0/design-system-skeleton-0.4.0.tgz
```

Release files start at v0.4.0. Earlier versions install from their tag instead (`github:sharonlafleur1984/design-system-skeleton#v0.3.0`). What changed in each version: [CHANGELOG.md](CHANGELOG.md).

Then load the theme, its fonts, the base page styles and the component styles once, set the theme on the page, and import components:

```ts
import 'design-system-skeleton/themes/after-graduation.css';
import 'design-system-skeleton/fonts/after-graduation.css';
import 'design-system-skeleton/base.css';
import 'design-system-skeleton/components.css';
import { Button } from 'design-system-skeleton';
// <html data-theme="after-graduation">
```

To use a text style by name, load the text style classes too, then put a class on any element:

```ts
import 'design-system-skeleton/text-styles.css';
// <h1 class="ds-text-display-l">  <p class="ds-text-body-default">  <h2 class="ds-text-label">
```

There's one class per type style (`ds-text-display-cover` to `ds-text-code`), one per control size (`ds-text-control-small`, `-medium`, `-large`), and `ds-text-button` and `ds-text-tab`. They work in every theme. Every style is listed in Storybook under Foundations, Type, Text styles.

To release a version:

1. Open a pull request that bumps `version` in `package.json` and moves the Unreleased notes in `CHANGELOG.md` under that version.
2. Merge it, then tag `main` with the version (`v0.4.0`).
3. The tag runs `.github/workflows/release.yml`, which tests and builds the package and attaches the file to a new GitHub Release.

Anything marked `@experimental` (the glass light and lens code) may change in any version.

## Where things are

- `tokens/base/`: the shared base
- `tokens/themes/<product>/`: each product's colors, fonts and shadows
- After Graduation's color rules: [Decisions](../../wiki/Decisions)
- `scripts/build-tokens.mjs`: turns the tokens into CSS variables, one file per theme, and the text style classes (`build/text-styles.css`)
- `src/components/`: the components, each with its Storybook page
- `src/fonts/`: each theme's fonts, served from the package (Fireside: Newsreader, Instrument Sans and JetBrains Mono)
- `src/base.css`: the page's background, text color and body type
- `src/tokens-docs/`: the Storybook pages for colors, type, space, radius and shadow
- [Wiki](../../wiki): the Dashboard, Roadmap and Decisions

Tokens use the [W3C design tokens format](https://www.designtokens.org/tr/drafts/format/) (DTCG) and are built with [Style Dictionary](https://styledictionary.com/).

Part of [how I work](https://github.com/sharonlafleur1984/how-i-work).
