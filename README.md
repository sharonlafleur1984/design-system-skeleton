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

## Where things are

- `tokens/base/`: the shared base
- `tokens/themes/<product>/`: each product's colors, fonts and shadows
- After Graduation's color rules: [Decisions](../../wiki/Decisions)
- `scripts/build-tokens.mjs`: turns the tokens into CSS variables, one file per theme
- `src/tokens-docs/`: the Storybook pages for colors, type, space, radius and shadow
- [Wiki](../../wiki): the Dashboard, Roadmap and Decisions

Tokens use the [W3C design tokens format](https://www.designtokens.org/tr/drafts/format/) (DTCG) and are built with [Style Dictionary](https://styledictionary.com/).

Part of [how I work](https://github.com/sharonlafleur1984/how-i-work).
