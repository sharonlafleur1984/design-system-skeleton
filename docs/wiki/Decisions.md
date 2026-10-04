# Decisions

**Last updated:** October 4, 2026

Newest first.

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
