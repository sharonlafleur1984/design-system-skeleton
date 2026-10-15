Lantern is a design system with a theme for each product: Spotlight, Sunrise and Fireside. Every page has one light, and every component takes its highlights and shadows from it. Move the light, and everything shifts a little. Each part is built on React Aria so anyone can use it.

## Where the truth lives

- **The code is the source of truth.** Lantern is built from the design-system-skeleton repo (this copy is from `{{REF}}`) and rebuilt when the code changes.
- **Storybook shows the same parts, live.** [Open Storybook](https://designsystemskeleton.netlify.app) to try each one.
- **Changes go back as a pull request.** A change made here never stays only in Lantern. Ask Claude to turn it into a pull request.
- **Previews run the repo's own styles,** so a token edited on this page won't change them. The edit goes into the pull request, and the next rebuild shows it.

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
- Use no emoji. Status always carries a word, never color alone.
- Use React Aria's names: Tag, Toggle button group, Separator and Progress bar. Not chip, segmented control, divider or progress meter.
- Use the same five status names everywhere (info, warning, success, error and neutral).

## Color

- Set text in `color-ink-primary` on `color-surface-page` or `color-surface-card`. Set quieter text in `color-ink-secondary`.
- Set text on artwork, like Spotlight's header and glass on it, in `color-ink-on-art`. It never flips in dark mode.
- Fill the one main action, like the primary button, with `color-accent-base`. Its hover is `color-accent-hover`.
- Show the focus ring in `color-border-focus`, solid, on every part.

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
- Each theme picks its roundness, and every corner follows the part's size (`radius-` tokens).
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

There's no shared icon set yet; Icon is Not started. Examples use simple line icons drawn in the text color. Don't draw a product's logo.

## Parts and their status

Every part has one of four statuses.

- **Ready:** in the code on `main`.
- **Pending:** built, and waiting in a pull request.
- **On hold:** planned, waiting until a product needs it.
- **Not started:** planned, nothing built yet.

{{STATUS_TABLE}}
