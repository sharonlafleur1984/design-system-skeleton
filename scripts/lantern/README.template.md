Updated {{UPDATED}}

Lantern is a design system with three unique themes: Spotlight, Sunrise, and Fireside. Sharing a single foundation, each provides its own unique glow.

Supported by React Aria components and semantic tokens, Lantern plays with light and glass, gently encouraging them to bring out the best in each other, with every component visibly responding to a single source of light.

## Themes

| Theme | Modes | Look |
| --- | --- | --- |
| [Spotlight](https://designsystemskeleton.netlify.app/?path=/story/foundations-colors--palette&globals=theme:after-graduation) | Light, Dark, Auto, System | Crimson on warm white, with anime styling and visuals |
| [Sunrise](https://designsystemskeleton.netlify.app/?path=/story/foundations-colors--palette&globals=theme:life-hub) | Light, Dark, Auto, System | Glass on marble, an experiment with light and glass |
| [Fireside](https://designsystemskeleton.netlify.app/?path=/story/foundations-colors--palette&globals=theme:designer-toolkit) | Light, Dark, Auto, System | A simpler approach: basic components with subtle glass accents |

## [Color](https://designsystemskeleton.netlify.app/?path=/story/foundations-colors--shared)

- Set text in `color-ink-primary` on `color-surface-page` or `color-surface-card`. Set quieter text in `color-ink-secondary`.
- Set text on artwork, like Spotlight's header and glass on it, in `color-ink-on-art`. It never flips in dark mode.
- Fill the one main action, like the primary button, with `color-accent-base`. Its hover is `color-accent-hover`.
- Show the focus ring in `color-border-focus`, solid, on every component.

Each status has four tokens, and always comes with an icon or a word.

| Token ends in | Use it for |
| --- | --- |
| `-surface` | The background |
| `-accent` | The icon |
| `-accent-strong` | The border |
| `-ink` | The text |

## [Type](https://designsystemskeleton.netlify.app/?path=/story/foundations-type--scale)

Each theme has its own faces. Use the text styles by role (display, heading, body, label, data, code), never a raw size.

| Theme | Titles | Everything else | Code |
| --- | --- | --- | --- |
| Spotlight | Atkinson Hyperlegible Next (Cinzel for the cover title only) | Atkinson Hyperlegible Next | The device's mono font |
| Sunrise | Fraunces | Figtree | The device's mono font |
| Fireside | Newsreader | Instrument Sans | JetBrains Mono |

## [Space, corners and shadow](https://designsystemskeleton.netlify.app/?path=/story/foundations-space-radius-and-shadow--space)

- Take space from the `space-` steps, and page gutters and section gaps from the `layout-` tokens.
- Each theme picks its roundness, and every corner follows the component's size (`radius-` tokens).
- Use shadows for things that float or lift, like a hovered tile (`shadow-hover`) or a popover (`shadow-float`).

## [Light and glass](https://designsystemskeleton.netlify.app/?path=/story/foundations-glass--playground)

- A page has one light, an orb, toward the bottom right. Glass rims, highlights and shadows all come from it.
- The light is only ever an orb. Rays belong to After Graduation's own header, not the system.
- Glass goes on any background except other glass. With Reduce transparency or More contrast, it turns solid.

## [Motion](https://designsystemskeleton.netlify.app/?path=/story/foundations-motion--moments)

- Hover fades in over 140ms, a press over 80ms, and a panel opens over 220ms.
- With Reduce motion, only color fades are left.
- Nothing moves on its own for more than 5 seconds.

## Icons

There's no shared icon set yet; the Icon component isn't started yet. Examples use simple line icons drawn in the text color. Don't draw a product's logo.

## Components and their status

Every component has one of four statuses.

- **Ready:** in the code on `main`.
- **Pending:** built, and waiting in a pull request.
- **On hold:** planned, waiting until a product needs it.
- **Not started:** planned, nothing built yet.

{{STATUS_TABLE}}

## How Lantern works

Lantern wasn't created in Figma. It was built straight from the code.

1. The tokens, components and docs all start in a GitHub repo.
2. Builds with Claude turn them into this page, live previews and all.
3. Changes made here go back as a pull request, so nothing drifts.
4. Once merged, the next build brings them back.

Interact with the entire component library in [Storybook](https://designsystemskeleton.netlify.app).

The full story behind the journey can be found in the [lantern-design-system](https://github.com/sharonlafleur1984/lantern-design-system/wiki) wiki page.
