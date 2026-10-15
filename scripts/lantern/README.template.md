Lantern is a design system with three unique themes: Spotlight, Sunrise, and Fireside. Sharing a single foundation, each provides its own unique glow.

Supported by React Aria components and semantic tokens, Lantern plays with light and glass, gently encouraging them to bring out the best in each other, with every component visibly responding to a single source of light.

## How Lantern works

Lantern wasn't created in Figma. It was built straight from the code.

1. The tokens, components and docs all start in a GitHub repo.
2. Builds with Claude turn them into this page, live previews and all.
3. Changes made here go back as a pull request, so nothing drifts.
4. Once merged, the next build brings them back.

Every component can be tried live in [Storybook](https://designsystemskeleton.netlify.app).

Decisions, guides and the full story behind each one are in the [design-system-skeleton wiki](https://github.com/sharonlafleur1984/design-system-skeleton/wiki).

## Themes

Pick a theme at the top to see every token and preview in it.

| Theme | Product | Look |
| --- | --- | --- |
| Spotlight, Spotlight dark | After Graduation | Crimson on warm white, with a header lit from one light |
| Sunrise, Sunrise dark | Life Hub | Warm ink on marble, one marble color per life area |
| Fireside | Designer toolkit | Copper on deep teal, dark only for now |

## Writing

- Use plain labels in examples, like "Button", "Label" and "Option 1". Never use one product's copy.
- Use sentence case for every heading, button and label.
- Don't use emoji. Status always carries a word, never color alone.
- Use React Aria's names: Tag, Toggle button group, Separator and Progress bar. Not chip, segmented control, divider or progress meter.
- Use the same five status names everywhere (info, warning, success, error and neutral).

## Color

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

## Type

Each theme has its own faces. Use the text styles by role (display, heading, body, label, data, code), never a raw size.

| Theme | Titles | Everything else | Code |
| --- | --- | --- | --- |
| Spotlight | Atkinson Hyperlegible Next (Cinzel for the cover title only) | Atkinson Hyperlegible Next | The device's mono font |
| Sunrise | Fraunces | Figtree | The device's mono font |
| Fireside | Newsreader | Instrument Sans | JetBrains Mono |

## Space, corners and shadow

- Take space from the `space-` steps, and page gutters and section gaps from the `layout-` tokens.
- Each theme picks its roundness, and every corner follows the component's size (`radius-` tokens).
- Use shadows for things that float or lift, like a hovered tile (`shadow-hover`) or a popover (`shadow-float`).

## Light and glass

- A page has one light, an orb, toward the bottom right. Glass rims, highlights and shadows all come from it.
- The light is only ever an orb. Rays belong to After Graduation's own header, not the system.
- Glass goes on any background except other glass. With Reduce transparency or More contrast, it turns solid.

## Motion

- Hover fades in over 140ms, a press over 80ms, and a panel opens over 220ms.
- With Reduce motion, only color fades are left.
- Nothing moves on its own for more than 5 seconds.

## Lantern's mark

The mark is a copper camp lantern with one amber orb inside, on night iron. Set it on a dark ground only.

Its four colors belong to Lantern. Use them for the mark and the cover only, never in a product.

| Color | Value |
| --- | --- |
| Night iron | `#2a1a12` |
| Copper | `#b5672f` |
| Amber flame | `#f6b25a` |
| Peach glow | `#f7c9a6` |

## Icons

There's no shared icon set yet; the Icon component isn't started yet. Examples use simple line icons drawn in the text color. Don't draw a product's logo.

## Components and their status

Every component has one of four statuses.

- **Ready:** in the code on `main`.
- **Pending:** built, and waiting in a pull request.
- **On hold:** planned, waiting until a product needs it.
- **Not started:** planned, nothing built yet.

{{STATUS_TABLE}}
