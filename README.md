# Design system

One design system for all my products: a shared base, with a theme for each product.

**The problem:** each of my products was defining its own colors, spacing and type. A fix in one never reached the others, and the After Graduation prototype alone had 98 different hex colors in its CSS.

**The fix:** one system underneath, a different look on top.

- **The shared base:** structure and naming, the spacing scale, type line heights and weights, radius, one status color set (error, warning, success, info, neutral), and accessibility rules.
- **A theme per product:** Life Hub, After Graduation and, later, my designer toolkit each bring their own colors, fonts and personality.

Fix something in the base once, and every product gets it.

## How it stays honest

Three automatic checks run on every pull request:

- **The contract:** every theme defines every shared token name, so any component works in any theme.
- **Readability:** every text color meets WCAG 2.2 AA contrast (4.5:1) on the surfaces it sits on.
- **Life Hub stays true to Figma:** every Life Hub color, mapping, spacing, radius and text style must match the Figma library exactly (`tests/life-hub-figma.json`).

## Try it

**[See it in Storybook](https://designsystemskeleton.netlify.app/)**, and switch themes in the toolbar.

Or run it yourself:

```bash
npm install
npm run storybook   # opens Storybook; switch themes in the toolbar
npm test            # contract and contrast checks
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
