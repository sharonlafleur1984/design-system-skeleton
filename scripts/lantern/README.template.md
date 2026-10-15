Lantern holds the light, and each product's theme is its own light: Spotlight (After Graduation), Sunrise (Life Hub) and Fireside (the designer toolkit). One shared base, with a theme for each product. Every part is built on React Aria Components and styled with tokens only.

## Where the truth lives

- **The code is the source of truth.** Lantern is built from the design-system-skeleton repo (this copy: `{{REF}}`) and rebuilt whenever it changes. Storybook shows the same parts, live: https://designsystemskeleton.netlify.app
- **A change made here goes back to the repo as a pull request,** never only into Lantern. Ask Claude to turn it into one.
- **Previews run the repo's own styles,** so editing a token on this page won't change them. The token goes into the pull request, and the next rebuild shows it.

## Themes

Pick a theme at the top to see every token and preview in it.

| Theme | Product | Look |
| --- | --- | --- |
| Spotlight, Spotlight dark | After Graduation | Crimson on warm white; a header lit from one light |
| Sunrise, Sunrise dark | Life Hub | Warm ink on marble, one marble color per life area |
| Fireside | Designer toolkit | Copper on deep teal; always dark |

## Writing

- Plain labels in examples: "Button", "Label", "Option 1". Never one product's copy.
- Sentence case for every heading, button and label.
- No emoji. Status always carries a word, never color alone.
- Use React Aria's names: Tag (not chip), Toggle button group (not segmented control), Separator (not divider), Progress bar (not progress meter).
- The status names are info, warning, success, error and neutral, everywhere.

## Color

- Set text in `color-ink-primary` on `color-surface-page` and `color-surface-card`; quieter text in `color-ink-secondary`.
- Text on artwork (Spotlight's header, glass on it) is `color-ink-on-art`, which never flips in dark mode.
- `color-accent-base` is the one main action's fill, like the primary button. Hover is `color-accent-hover`.
- Status uses its four tokens per status: `-surface` behind, `-accent` for the icon, `-accent-strong` for borders, `-ink` for text. Always with an icon or a word.
- The focus ring is `color-border-focus`, solid, on every part.

## Type

- Each theme has its own faces. Spotlight: Atkinson Hyperlegible Next, with Cinzel only for the cover title. Sunrise: Fraunces for titles, Figtree for everything else. Fireside: Newsreader for titles, Instrument Sans for everything else, JetBrains Mono for code.
- Use the text styles by role (display, heading, body, label, data, code), never a raw size.

## Space, corners and shadow

- Space comes from the `space-` steps; page gutters and section gaps from `layout-`.
- Each theme picks its roundness, and every corner follows the part's size (`radius-` tokens).
- Shadows are for things that float or lift, like a hovered tile (`shadow-hover`) or a popover (`shadow-float`).

## Light and glass

- A page has one light, an orb, sitting toward the bottom right or top right. Glass rims, highlights and shadows all come from it.
- The light is only ever an orb. Rays belong to After Graduation's own header, not the system.
- Glass goes on any background except other glass. With Reduce transparency or More contrast, it turns solid.

## Motion

- Hover fades in 140ms, a press in 80ms, a panel opens in 220ms.
- With Reduce motion, only color fades are left. Nothing moves on its own for more than 5 seconds.

## Icons

There's no shared icon set yet (Icon is Not started). Examples use simple line icons drawn in the text color. Don't draw a product's logo.

## Parts and their status

Ready is in the code on `main`; Pending is built and waiting in a pull request; On hold waits until a product needs it; Not started is planned.

{{STATUS_TABLE}}
