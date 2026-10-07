# Decisions

**Last updated:** October 7, 2026

Newest first.

<details>
<summary><b>Oct 7, 2026:</b> Life Hub's new look: glass cards, one sun, warm neutral buttons, Fraunces and Figtree</summary>

- **Decided by:** Sharon
- **Decision:** Life Hub cards are glass on each area's marble. One sun in the header (top right) lights everything: rims are brightest facing it, shadows fall away from it, and light weakens with distance. Light mode shows the light as shade and shadow; dark mode as highlights. Buttons are warm neutral (ink in light, light warm gray in dark) with a thin line of light on the top edge, at about half the card's light. Color is kept for meaning (status) and place (the marble). Titles use Fraunces with its Soft axis; everything else, numbers included, uses Figtree.
- **Why:** glass on marble is Life Hub's signature. Area-colored buttons borrowed status meanings (berry read as Delete, gold as a warning), and a green button fought half the marbles. The serif-on-cream look felt like every AI product; Fraunces's soft endings feel poured, like marbling.
- **Replaces:** Sep 27, "Life Hub glass is for controls only." Buttons inside a glass card have no blur of their own, so it is still never glass on glass.
- **Other options:** solid cards with glass controls (the old rule); area-colored or gold buttons; Newsreader and Archivo; a monospace data font.
- **Details:** [#28](https://github.com/sharonlafleur1984/design-system-skeleton/pull/28), exploration in [#27](https://github.com/sharonlafleur1984/design-system-skeleton/pull/27). Per-area values are estimates from the Oct 6 to 7 review.

</details>

<details>
<summary><b>Oct 7, 2026:</b> Dark mode follows the device, and each theme designs its own</summary>

- **Decided by:** Sharon
- **Decision:** dark mode switches on with the device setting, with no switch in the products. Each theme has its own dark version, kept in `tokens/themes/<theme>/dark`, which may only change values of tokens the theme already has. Life Hub's dark mode lays each area's own night layer (half its 900, half ink) over its marble, matched so every area's swirl shows about the same. Storybook has a Light/Dark switch for review. After Graduation's dark mode comes later.
- **Why:** four looks (two themes, light and dark) without new names for components to learn. Following the device is what people expect and needs nothing to build.
- **Other options:** a switch in each product; one shared dark palette for every theme; neutral charcoal surfaces (lost each area's marble).
- **Details:** [#28](https://github.com/sharonlafleur1984/design-system-skeleton/pull/28)

</details>

<details>
<summary><b>Oct 6, 2026:</b> Apps install the design system from GitHub, pinned to a version</summary>

- **Decided by:** Sharon
- **Decision:** After Graduation (and later Life Hub) installs this design system straight from GitHub, pinned to a version tag. Updating the design system is a deliberate pull request in the app. Every component is built here first, on React Aria, with a Storybook page; apps only arrange components on a page and own the data.
- **Why:** it builds the same on a laptop, in CI and on Netlify, and an app always knows exactly which version it was built on, which makes the Important Dates rebuild a fair test of the system.
- **Other options:** pointing the app at the folder next door (instant, but only works on one laptop); publishing to npm (a release step for every change, too much while the system changes daily).
- **Sources:** [npm, installing from GitHub](https://docs.npmjs.com/cli/v11/commands/npm-install), [npm prepare script](https://docs.npmjs.com/cli/v11/using-npm/scripts#life-cycle-scripts), [Vite library mode](https://vite.dev/guide/build#library-mode)

</details>

<details>
<summary><b>Oct 6, 2026:</b> Controls get their own type style; Large buttons are 40px tall</summary>

- **Decided by:** Sharon
- **Decision:** each theme sets a size, line height and weight for Small, Medium and Large controls. For now both themes use the same values: 12 on 16, 14 on 20 and 16 on 24, medium weight. Large buttons are 40px tall instead of 48. Checkbox and Switch labels use Medium.
- **Why:** the fonts already make each product's buttons look different, so different sizes or weights would add difference for its own sake. 48px is a call-to-action size and felt too big as a regular option. 14px button labels with 16px body text is the standard pairing.
- **Other options:** bigger, semibold After Graduation buttons (14 / 16 / 20); a third font just for buttons (breaks the two-families rule); keeping Large at 48.
- **Details:** [#23](https://github.com/sharonlafleur1984/design-system-skeleton/pull/23)
- **Sources:** [Material 3 type scale tokens](https://m3.material.io/styles/typography/type-scale-tokens), [WCAG 2.5.8 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [Apple accessibility guidelines](https://developer.apple.com/design/human-interface-guidelines/accessibility)

</details>

<details>
<summary><b>Oct 6, 2026:</b> Life Hub follows the same type rule as After Graduation</summary>

- **Decided by:** Sharon
- **Decision:** Life Hub's type follows the Oct 4 After Graduation rule. Sizes follow a modular scale rounded to the 4-point grid, and line heights are ratios picked so size times ratio is a multiple of 4. Life Hub keeps its own fonts and its own sizes within that rule.
- **Why:** both products share one foundation, and each theme picks its own values within it. Code leads and Figma follows, so some of Life Hub's 16 Figma sizes will move to fit the scale.
- **Other options:** keep Life Hub's Figma sizes and snap only line heights to the grid (keeps the Figma match, but makes Life Hub an exception to the shared rule).
- **Note:** Sharon made this call earlier, but it wasn't logged, so a later status note listed it as open.
- **Sources:** [Material 3 type scale tokens](https://m3.material.io/styles/typography/type-scale-tokens), [Carbon type sets](https://carbondesignsystem.com/elements/typography/type-sets/)

</details>

<details>
<summary><b>Oct 4, 2026:</b> After Graduation's React rebuild uses React Aria Components</summary>

- **Decided by:** Sharon
- **Decision:** interactive components in the After Graduation rebuild (accordion rows, tabs, bottom navigation, dialogs, date pickers) are built on React Aria Components and styled with our tokens. One library everywhere; no mixing.
- **Why:** the planner is built around dates, and some students have an IEP or 504 plan. React Aria handles focus, keyboard and screen reader behavior and tests it with real screen readers every release, including date pickers. AI can write UI fast, but it often misses these basics, and automated tests catch only part of them.
- **Other options:** Base UI (newest, strongest shadcn and AI-prototyping ecosystem, but no date components and focus is left to us); Base UI plus React Aria only for dates (two styles of code); Base UI with dates built ourselves (most code to own, highest accessibility risk). Radix was ruled out: updates slowed after WorkOS bought it.
- **Also decided (Oct 4):** this design system's own components (Button, Checkbox, Switch and Link) move onto React Aria too, so After Graduation uses one library. Life Hub keeps using the tokens; it picks up these components if its dashboard is ever built in React. The solid-glass fallback from [#4](https://github.com/sharonlafleur1984/design-system-skeleton/pull/4) is built into the new versions.
- **Details:** [After Graduation #34](https://github.com/sharonlafleur1984/after-graduation/issues/34)
- **Sources:** [Untitled UI, Base UI vs React Aria](https://www.untitledui.com/blog/base-ui-vs-react-aria), [React Aria AI tools](https://react-aria.adobe.com/ai), [Web4All 2025 on AI-generated UI](https://dl.acm.org/doi/10.1145/3800424.3800430)

</details>

<details>
<summary><b>Oct 4, 2026:</b> After Graduation page shell: the page is a sheet rising out of the header</summary>

- **Decided by:** Sharon
- **Decision:** the header runs edge to edge and the page is a sheet that rises over its bottom edge. On desktop the sheet sits 16px in from the screen sides, so the header's red frames the page all the way down. On tablet and phone the sheet runs edge to edge.
- **Why:** the header card floated on its own and didn't feel connected to the page. On wide screens the content is capped at 920px, so the frame uses space that was empty anyway; on narrow screens a frame would squeeze the content.
- **Tokens (After Graduation only):** `shell.sheet-inset` 0 / 0 / 16, `shell.sheet-overlap` 24 / 32 / 40, `shell.sheet-radius` (radius-panel), `shell.frame`. All spacing is on the space scale, checked by a test.
- **Other options:** keep the floating card and let its light spill onto the page (subtler, but the header still floats); a sheet with the frame on every screen size.

</details>

<details>
<summary><b>Oct 4, 2026:</b> After Graduation type: a real scale, Cinzel title, Atkinson Hyperlegible Next</summary>

- **Decided by:** Sharon
- **Decision:** After Graduation's sizes follow a modular scale: base 16px, steps of about 1.25, rounded to the 4-point grid. Line heights are stored as ratios, the W3C tokens standard, each picked so size times ratio is a multiple of 4, the way Carbon does it (14px is the one size off the grid, for small UI text). Cinzel is only for the main title (display-cover), like a logo. Every other heading and all text use Atkinson Hyperlegible Next. Section titles are bold so they stand out from bold labels.
- **Sizes (phone / tablet / desktop):** title 28 / 48 / 52 (`display-cover`); section titles 24 / 28 / 32 (`display-l`); the header subtitle 20 / 24 / 24 (`display-m`); card titles 20; body 16 on 24; labels 12 on 16. Sharon picked a 52px title over 64 (64 broke the golden header) and a 28px subtitle over 32, 24 and 20, then took it to 24 once the header's contrast improved.
- **Layout:** the header uses golden-ratio proportions: the title fits the left 61.8%, the art sits in the right 38.2%. Spacing stays on the 4-point tokens.
- **Why:** the Oct 3 sizes were measured from the prototype, not designed, so steps were uneven and section titles got lost on phones. Mochiy Pop One felt childish and hard to scan. A typography rule of thumb: two families at most, contrast from structure (a serif title, a sans for the rest), hierarchy from size and weight.
- **Other options:** Lexend for the rest (felt too young); Saira, Archivo or Barlow for headings (a third family, harder to read); a Fibonacci type scale (1.618 is too steep for an app).
- **Replaces:** Oct 3, "After Graduation gets sizes measured from its site," and the Mochiy Pop One display rules.
- **Sources:** [Design Tokens Format 2025.10](https://designtokens.org/TR/2025.10/format/), [MDN line-height](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height), [Carbon type sets](https://carbondesignsystem.com/elements/typography/type-sets/), [Tim Brown, More Meaningful Typography](https://alistapart.com/article/more-meaningful-typography/), [Cloud Four, responsive type sizing](https://cloudfour.com/?p=4059), [Material 3 type scale](https://m3.material.io/styles/typography/type-scale-tokens), [Google Fonts, pairing within a family](https://fonts.google.com/knowledge/choosing_type/pairing_typefaces_within_a_family_superfamily), [Cinzel and Mushoku Tensei's title style](https://madegooddesigns.com/?p=10586), [WCAG 1.4.12 text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)

</details>

<details>
<summary><b>Oct 4, 2026:</b> After Graduation uses glass for controls on artwork</summary>

- **Decided by:** Sharon
- **Decision:** controls that float on artwork (header episode buttons, lane school tags, bottom navigation) are glass. Page controls and content stay solid. This updates the Sep 27 rule that After Graduation stays solid everywhere.
- **One light source:** every effect follows the light where the header's rays start. The art darkens smoothly with distance from it, rays fade as they travel, and each glass rim is brightest on the side facing it, with a faint glint opposite. Highlights with no light source (glows, blobs) are not allowed.
- **Unselected glass:** perfectly clear, no fill, no blur. Lines behind it bend near the edge like real glass (an SVG displacement on a live copy of the art, so it works in Safari; profile after [kube.io](https://kube.io/blog/liquid-glass-css-svg/)). The light falloff keeps white text at 4.5:1 or better.
- **Selected glass:** frosted white with deep red text, the art behind blurred so every episode looks the same, and lit by its own star: a soft pool of light around the ✦, and one wave of light from the star when picked that fades out completely.
- **Rim:** 1px, eased in and out, adapted from [react-glass-rim](https://github.com/royroki/react-glass-rim) (MIT).
- **Tokens:** `color.surface.glass-on-art` (clear), `color.surface.glass-on-art-selected`, `material.blur-on-art`, `material.blur-on-art-selected`, `material.refraction-band`, `material.refraction-max`, `glass.rim.width`, `glass.rim.color`, `shadow.glass-on-art`. Life Hub maps them to its own glass.
- **Reduce Transparency:** the art copy is hidden; buttons turn solid.
- **Why:** Sharon wanted the look of iOS folder glass, with light that behaves naturally.
- **Other options:** a sliding glass lens or a power-up aura for the selected state (previewed, not picked); white-tinted glass (looked milky, and white text failed contrast).
- **Sources:** [Apple HIG, Materials](https://developer.apple.com/design/human-interface-guidelines/materials), [Meet Liquid Glass, WWDC25](https://developer.apple.com/videos/play/wwdc2025/219/), [WCAG 2.2 contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

</details>

<details>
<summary><b>Oct 4, 2026:</b> Big spaces shrink to about two thirds on phones; new layout-title-gap</summary>

- **Decided by:** Sharon
- **Decision:** the rule for responsive tokens: the bigger something is, the more it shrinks on a phone, to about two thirds of desktop. Page edges, section spacing and big headings change by screen class. Body text, small headings and spacing inside components never do. `layout-section` is now 24 / 32 / 40px (was 32 / 48 / 64; Sharon then took it one step smaller than the first proposal, 32 / 40 / 48, because it felt like too much space). Every layout value must be a step on the space scale, checked by a test. New `layout-title-gap` is the space under a page title: 16 / 20 / 24px.
- **Why:** Chase's site had made-up spacing that was the same on phone and desktop, and there was no token for the space under a page title.
- **Sources:** [GOV.UK spacing](https://design-system.service.gov.uk/styles/spacing), [GOV.UK type scale](https://design-system.service.gov.uk/styles/type-scale), [Carbon type sets](https://carbondesignsystem.com/elements/typography/type-sets/), [Material window size classes (SAP Fiori)](https://www.sap.com/design-system/fiori-design-android/foundations/layout)

</details>

<details>
<summary><b>Oct 3, 2026:</b> Label styles named by purpose: label and label-meta</summary>

- **Decided by:** Sharon
- **Decision:** `label-caps` is renamed `label` (introduces a section, like NEXT STEPS). New `label-meta` describes an item: every date and short piece of metadata, in capitals, gray, at a new light weight (300), one step lighter than body text. Never below 300. `label-banner` is removed: it did the same job as `label` and nothing used it. Styles are named by what they're for, not how they look. Pick a style, never a weight: a test fails if a component sets a raw font weight.
- **Why:** dates were using the bold section-label style, so they competed with the task name. "caps" described a look that every label shares.
- **Other options:** `label-caps` and `label-caps-meta`; dates in `data-small` (sentence case, no new style).
- **Figma:** rename "Label/Caps" to "Label" and remove "Label/Banner" in the Life Hub library next time it's open.
<summary><b>Oct 3, 2026:</b> Two link levels, set in the skeleton, colored by each theme</summary>

- **Decided by:** Sharon
- **Decision:** links have two levels. Inline: inside a sentence, at its size. Quiet: side trips and small controls (View task, Show full year, sources), one step smaller and gray. The skeleton sets the names, underline and behavior; each theme sets colors and the quiet size. Links never bold. Page actions that look like links (Show full year) are buttons: `LinkButton`.
- **Why:** Chase's site had grown 4 link styles, and the least important link (View task) was the loudest. The design system had no link style because the Life Hub Figma library didn't have one.
- **Other options:** links as a typography style only, with no component (loses focus, tap area and the link-or-button rule).

</details>

<details>
<summary><b>Oct 3, 2026:</b> Storybook is the source of truth, guarded by a token lock and visual tests</summary>

- **Decided by:** Sharon
- **Decision:** Figma is for ideas; the exact rules live in code and Storybook. Two checks guard against drift: a token lock (every token value saved in the repo, any change shown and approved in the pull request) and visual tests (every story screenshotted at phone, tablet and desktop, compared with approved screenshots). The Life Hub Figma export test is retired; the token lock replaces it and covers both themes.
- **Why:** the Figma test only covered Life Hub, and checked a frozen export instead of the system itself. After Graduation had no guard at all.
- **Other options:** Chromatic for visual tests (nicer review screen, but another account to manage).
- **Replaces:** Sep 26, "Life Hub's Figma library doesn't change." Figma now follows the code.

</details>

<details>
<summary><b>Oct 3, 2026:</b> Each theme sets its own text sizes, and headings shrink on phones</summary>

- **Decided by:** Sharon
- **Decision:** text sizes move from the shared base into each theme. Life Hub keeps its 16 Figma sizes. After Graduation gets sizes measured from its site (biggest is 48px, not 112px). Display and title sizes, plus page gutter and section spacing, get phone, tablet and desktop values using Material 3 screen classes (under 600px, 600 to 839px, 840px and up). Text sizes and spacing are written in rem so they grow with the reader's own text-size setting.
- **Also for After Graduation:** display styles use regular weight, line height 1.15 to 1.25 and no negative letter spacing. Mochiy Pop One has one weight and tall letters, so weight 600 was a fake bold and line height 1.02 made lines collide.
- **Why:** After Graduation was borrowing Life Hub's much larger sizes, and desktop-sized headings were using up phone screens.
- **Other options:** fluid sizing with CSS clamp (smoother, but harder to show in Storybook and Figma); cutting the scale to 12 styles (would break the Life Hub Figma match).
- **Details:** [Material 3 window size classes](https://m3.material.io/foundations/layout/applying-layout/window-size-classes)

</details>

<details>
<summary><b>Sep 27, 2026:</b> Life Hub glass is for controls only</summary>

- **Decided by:** Sharon
- **Decision:** liquid glass goes on controls: buttons, the top bar, navigation and pills. Content cards and callouts stay solid or lightly translucent, with no blur, so there is never glass on glass. After Graduation stays solid everywhere (updated Oct 4: glass for controls on artwork).
- **Why:** closest to Apple's Liquid Glass guidance (glass is the layer that floats above content) and easiest to read.
- **Other options:** glass everywhere as in the Figma file, with a solid fallback; or both.
- **Sources:** [Meet Liquid Glass, WWDC25](https://developer.apple.com/videos/play/wwdc2025/219/), [CSS-Tricks](https://css-tricks.com/getting-clarity-on-apples-liquid-glass/)

</details>

<details>
<summary><b>Sep 26, 2026:</b> After Graduation is quiet by default: color only communicates</summary>

- **Decided by:** Sharon
- **Decision:** neutral screens. Cherry red (#d03656) marks the one next step: the main button, the current step, focus. Gold marks a real win. Status colors mean status, always with an icon and a label. Everything else is neutral. Paths and categories use icons and labels, not colors. Cards sit on shadows instead of borders.
- **Why:** the product already has lots of graphics, so the system stays simple. The prototype had 98 colors, and a screen with seven colors gave no clear place to look.
- **How it was chosen:** 6 color directions built with color theory (OKLCH ramps, contrast checked). The race-car red stayed, softened toward cherry for an anime feel, which also moves it a little further from the error red.
- **Other options:** red with teal, sky, mint or lavender support colors; berry and indigo; a teal-led palette.

</details>

<details>
<summary><b>Sep 26, 2026:</b> Life Hub's Figma library doesn't change</summary>

- **Decided by:** Sharon
- **Decision:** the Life Hub theme matches the Figma library exactly: all 112 colors including Sunflower Medley, every semantic mapping, spacing, radius, and all 16 text styles under their Figma names. A test checks this on every pull request.
- **Why:** the first version dropped Sunflower Medley and two text styles, renamed the text styles, and mapped one area accent wrong. The test caught the last one.

</details>

<details>
<summary><b>Sep 26, 2026:</b> Code is the source of truth for tokens</summary>

- **Decided by:** Sharon
- **Decision:** tokens live in code. Figma follows the code.
- **Why:** two of the three products are built in code, and After Graduation has no Figma file.
- **Other options:** Figma as the source, synced into code.

</details>

<details>
<summary><b>Sep 26, 2026:</b> One shared base, a theme for each product, in its own repo</summary>

- **Decided by:** Sharon
- **Decision:** a shared base (structure, naming, scales, status colors, accessibility) with a theme per product, in its own repo.
- **Why:** three products will use it (Life Hub, After Graduation, a designer toolkit), and Life Hub needs it soon. Life Hub's Figma library already had the structure Sharon wants.
- **Other options:** start inside After Graduation and move it later; separate systems per product.

</details>

<details>
<summary><b>Sep 26, 2026:</b> Structure taken from the Life Hub Library</summary>

- **Decided by:** Sharon
- **Decision:** the base copies the Life Hub Library's structure: a 4-point spacing scale, radius by purpose, ink, surface, border and accent names, one status set, and the type roles (display, heading, body, label, data).
- **Why:** it's already set up the way Sharon wants a design system organized. Only the look changes per product.

</details>
