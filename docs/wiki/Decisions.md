# Decisions

**Last updated:** October 15, 2026

Newest first.

## Contents

Each decision has an ID (D1 is the oldest), so a pull request or another document can point to it: "see D12." A new decision takes the next number.

| ID | Date | Decision |
|---|---|---|
| D62 | Oct 16, 2026 | Fireside gets a full light look, built from the toolkit's light work area |
| D61 | Oct 15, 2026 | Fireside's light mode changes only the work area (replaced by D62) |
| D57 | Oct 15, 2026 | The orb: one glowing glass marble in the theme's color, the light you drag when exploring glass |
| D56 | Oct 15, 2026 | The component page is a story; every planned part has a page and a status |
| D55 | Oct 15, 2026 | Glass works on plain backgrounds too; never glass on glass |
| D52 | Oct 15, 2026 | One page template for every component's Docs tab |
| D51 | Oct 15, 2026 | Motion: open and close, a leaving curve, switching views and loading |
| D50 | Oct 15, 2026 | Storybook: the theme picker sits on the page, and Compare all works on every story |
| D49 | Oct 15, 2026 | Each theme picks its roundness (Square, Standard or Round); every corner follows the part's size |
| D48 | Oct 15, 2026 | Card is a surface with typed parts; Tile is the clickable one; Action tile is for navigation; Solid and Glass everywhere |
| D46 | Oct 14, 2026 | Action tile titles one size smaller; action tiles fit their space |
| D45 | Oct 14, 2026 | One light per page, shown in Storybook as a sun on every glass story; a softer focus glow |
| D44 | Oct 14, 2026 | States stories are still pictures; Playground is where states are tried |
| D43 | Oct 14, 2026 | Fireside type: Newsreader for titles, Instrument Sans for everything else |
| D42 | Oct 14, 2026 | Glass light follows the surroundings; glass cards only while empty; accessibility fallbacks for Glass tiles |
| D41 | Oct 14, 2026 | Glass goes back to the shader demo, with its settings in every theme |
| D40 | Oct 14, 2026 | Action tile works in every theme; Glass is the lens and follows the light; states are soft light |
| D39 | Oct 14, 2026 | Releases attach a ready-built package file |
| D38 | Oct 14, 2026 | The repo follows how-i-work; ESLint checks the code |
| D37 | Oct 14, 2026 | Adding a theme is one folder |
| D36 | Oct 14, 2026 | Two materials: Default and Glass |
| D35 | Oct 14, 2026 | Components use React Aria's names; "theme" is the one word; themes are Spotlight, Sunrise and Fireside |
| D34 | Oct 14, 2026 | Fireside is the third theme, for the designer toolkit |
| D33 | Oct 12, 2026 | Action tiles and glass buttons use lens glass |
| D32 | Oct 8, 2026 | Storybook backgrounds: artwork lives only in Page shell |
| D31 | Oct 8, 2026 | Page-switching tiles never stack; on phones they become the bottom bar |
| D30 | Oct 7, 2026 | Max content width is 1024px, shared by every product |
| D29 | Oct 7, 2026 | Running text stops at a 70-character measure |
| D28 | Oct 7, 2026 | Page shell: the sheet is as wide as the header's content, with a margin on every screen size |
| D27 | Oct 7, 2026 | Settings: a full-size dialog, opened from the top right of the header |
| D26 | Oct 7, 2026 | One light position and one glass recipe for every product |
| D25 | Oct 7, 2026 | After Graduation's red is crimson |
| D24 | Oct 7, 2026 | Each theme picks its own status colors |
| D23 | Oct 7, 2026 | Motion: one timing scale, two moods (calm and energetic) |
| D22 | Oct 7, 2026 | Home and Office trade colors |
| D21 | Oct 7, 2026 | After Graduation's dark mode is warm charcoal |
| D20 | Oct 7, 2026 | Life Hub's new look: glass cards, one sun, warm neutral buttons, Fraunces and Figtree |
| D19 | Oct 7, 2026 | Dark mode follows the device, and each theme designs its own |
| D18 | Oct 6, 2026 | Apps install the design system from GitHub, pinned to a version |
| D17 | Oct 6, 2026 | Controls get their own type style; Large buttons are 40px tall |
| D16 | Oct 6, 2026 | Life Hub follows the same type rule as After Graduation |
| D15 | Oct 4, 2026 | After Graduation's React rebuild uses React Aria Components |
| D14 | Oct 4, 2026 | After Graduation page shell: the page is a sheet rising out of the header |
| D13 | Oct 4, 2026 | After Graduation type: a real scale, Cinzel title, Atkinson Hyperlegible Next |
| D12 | Oct 4, 2026 | After Graduation uses glass for controls on artwork |
| D11 | Oct 4, 2026 | Big spaces shrink to about two thirds on phones; new layout-title-gap |
| D10 | Oct 3, 2026 | Label styles named by purpose: label and label-meta |
| D9 | Oct 3, 2026 | Two link levels, set in the skeleton, colored by each theme |
| D8 | Oct 3, 2026 | Storybook is the source of truth, guarded by a token lock and visual tests |
| D7 | Oct 3, 2026 | Each theme sets its own text sizes, and headings shrink on phones |
| D6 | Sep 27, 2026 | Life Hub glass is for controls only |
| D5 | Sep 26, 2026 | After Graduation is quiet by default: color only communicates |
| D4 | Sep 26, 2026 | Life Hub's Figma library doesn't change |
| D3 | Sep 26, 2026 | Code is the source of truth for tokens |
| D2 | Sep 26, 2026 | One shared base, a theme for each product, in its own repo |
| D1 | Sep 26, 2026 | Structure taken from the Life Hub Library |

## Decisions

<details>
<summary><b>D62 · Oct 16, 2026:</b> Fireside gets a full light look, built from the toolkit's light work area</summary>

- **Decided by:** Sharon, who asked for the full light mode: the toolkit doesn't have to use it, but other projects should have it.
- **Decision:** Fireside has a full light look, like Spotlight and Sunrise: light values for every color, status, link, card border, glass and shadow. It starts from the toolkit's light work area (pale blue-gray page #dfeaed, dark teal text #14262b), with white cards and a deeper copper primary (rust 600, #8b4e33) so it passes 4.5:1 on light. Every value comes from Fireside's own palette. The dark values are unchanged and now live in `tokens/themes/designer-toolkit/dark/`.
- **Why:** other projects may want Fireside in light mode. The designer toolkit can keep its dark chrome by using dark mode with the light work area.
- **Other options:** a warm cream page (#f8f0e8) with copper rust 500; it was set aside to match the light work area the toolkit already has.
- **Replaces:** D61.

</details>

<details>
<summary><b>D61 · Oct 15, 2026:</b> Fireside's light mode changes only the work area (replaced by D62)</summary>

- **Decided by:** Sharon
- **Decision:** Fireside has a light mode, but the shell and most components stay dark in both modes. Light mode changes only the work area: the background behind the prototype and the wiki, the text on it (it turns dark), the wiki's lines, and the selected page in the wiki's side nav, which shows the primary color. These are five Fireside-only tokens, `shell-work-*`, with the toolkit's own values from its shell (designer-toolkit-code `src/styles/shell.css`). Checkboxes on the wiki stay gray in both modes.
- **Why:** the toolkit's shell already switches its work area between light and dark, so the design system should know it. Everything else is chrome, which stays dark.
- **Other options:** a full light Fireside, with light values for every color.

</details>

<details>
<summary><b>D57 · Oct 15, 2026:</b> The orb: one glowing glass marble in the theme's color, the light you drag when exploring glass</summary>

- **Decided by:** Sharon, after three first directions ("not a big fan of any of these"): "take the primary color of an area and apply it as a light source with lots and lots of glowing"; "the stroke seems to be even all the way around… that would never happen"; "a little brighter"; "these orbs should go into my design library… the color will change based on the theme."
- **One orb, in the library:** `Orb` (and `ORB_START`, on the right, two thirds down) replaces the three looks Storybook had: the page light's flat yellow dot, the Glass playground's dot with a glow, and Try it out's sun with a core and halo.
- **The look:** a small glass marble, darker at the top, with a bright crescent where light catches its top edge and light pooling at the bottom. Its rim isn't the same thickness all the way round: thick and bright along the bottom, thin at the top. Its light spills out as a wide bloom of its own color.
- **Its color is the theme's:** Spotlight's red, Fireside's peach copper, and in Sunrise the area's own color family (Dashboard's Earth Moss by default; `palette` sets another, like `seagull` for Time). Tokens: `orb.color.*` in each theme; size, glow and shine in the base (`orb.*`).
- **Still true (D45):** orb only, no rays; it starts on the right of its section, two thirds down (Sharon: "bottom right, but not all the way at the bottom, like 2/3 down"); drag it or use the arrow keys (Shift moves farther); its button is 44px; nothing moves on its own, so there's no motion to reduce. Full pages (the page shell) never get an orb: their light stays still at `light-from-right` and `light-top`.
- **On its own page, centered (Sharon):** the Orb's page shows it in the middle of its examples, like any other component. Everywhere else it starts on the right, two thirds down. `defaultPosition` sets where an orb that keeps its own place starts.
- **Storybook:** a page for Orb under Components, and a test story with the orb on every theme's real background. Try it out's hint now says "Drag the light to move it".

</details>

<details>
<summary><b>D56 · Oct 15, 2026:</b> The component page is a story; every planned part has a page and a status</summary>

- **Decided by:** Sharon, designing the page with Claude on a canvas, and approving the parts list (Oct 15).
- **A story, not a Docs page:** so Storybook's bottom panel (Controls, Actions, Interactions, Accessibility) works on it. Sidebar entries per part: Overview, Try it out, Usage rules, Accessibility and Related, each opening the one page at that section. The old stories stay as test stories, hidden from the sidebar (tag `!dev`), so screenshot and accessibility tests still run on them. Replaces D52's Docs tab, Examples and the theme picker's Mode and Background.
- **Neutral grays:** the page's own grays have no hue, so they never shift how a theme's colors look (Sharon, Oct 15).
- **The order:** Theme (Spotlight, Sunrise, Fireside or All) and Mode (the page's own light or dark), on the table headers' gray, name and what it does (the status and updated date live in the table, not up top), every description in the same body text; Try it out (the part on its own window, left-aligned; Show code and Copy code; then a table of Is it ready to use, When do I use it, When don't I use it, and What codebase it's built with, React Aria or ours, linked); Usage rules (use it for this, don't use it for this); Accessibility (Trigger, Result and Notes); For engineers, folded; Related.
- **Status:** Ready, Pending, On hold or Not started, a dot and a word. Anything not built shows an empty state in Try it out and "No design file yet (Figma or Claude)" until it has one. A built part says nothing about a design file: its code is the design.
- **Controls:** a plain name with the code name under it, what it does, radio buttons. Every option list ends with All: one All is a labeled row, two a labeled grid, Mode's All shows light and dark windows side by side, and State's All shows rest, hover, pressed, focus, disabled and loading. Page settings: Mode (Light, Dark, Auto: dark 7 PM to 7 AM, System), Background (Spotlight's header art and landscape lanes, Sunrise's marble in all ten colors; hidden for Fireside) and a System choice for every device setting a part reacts to: Motion, Contrast, Transparency.
- **Glass:** on any background except other glass (PR #71). On header art, a sun you drag moves the art's bright spot and the glass light.
- **A part with nothing to change** drops the Try it out heading and its sidebar entry, but keeps the part and the table.
- **Motion:** hover 140ms, press 80ms, code panel opens in 220ms; Reduce motion keeps only color fades.
- **Compare all:** three equal columns when they fit, otherwise one per row; never two plus one.
- **Accessibility fixes from the canvas review:** no pale text, white text only on a code bar dark enough for it, check results are words not buttons, every choice group named by its label, the first column of each table as row headings, key styling only on real keys.
- **Applies to:** every part under Components and Patterns, built or planned. Foundations keep their own layout.

</details>

<details>
<summary><b>D55 · Oct 15, 2026:</b> Glass works on plain backgrounds too; never glass on glass</summary>

- **Decided by:** Sharon
- **Decision:** glass buttons and action tiles can go on plain backgrounds, not only on artwork. The one rule left: never glass on glass, like a glass button on a glass card.
- **Updates:** the Oct 12 line "Only on artwork the system controls" and the Oct 4 rule that glass is for controls on artwork.
- **Tradeoff:** lens glass bends the art behind it, so it still needs artwork the system controls. On a plain background there's nothing to bend, so glass shows the classic frosted recipe, not the lens.
- **Why:** Sharon decided this while reviewing the Style control (Solid or Glass) for the Storybook docs page template.
- **Details:** Components, Button and Action tile in Storybook (When to use and When not to).

</details>

<details>
<summary><b>D52 · Oct 15, 2026:</b> One page template for every component's Docs tab</summary>

- **Decided by:** Sharon ("This is the template I want you to use for every single page"; "I liked the radio buttons better ... I just care about the content")
- **Neutral grays:** the page's own grays have no hue, so they never shift how a theme's colors look (Sharon, Oct 15).
- **The order:** updated date, name, what it does in one line, the React Aria part and a status (Ready, In review or Experimental, a dot and a word), the theme picker, Try it, When to use (use it for, use something else for), Examples (one story each, with a heading, one line and its code), Do and don't, Accessibility (keys, what a screen reader says, the four standard checks, anything different), For engineers (import, props, tokens; folded away) and Related.
- **One layout, many pages:** the layout lives in `.storybook/component-page.tsx`; each component fills it with a `<name>.page.tsx` file and `parameters.componentPage`. A page can't drift from the others, and a new component gets the whole layout by filling in one object.
- **Controls:** every setting has a plain name and says what it does ("Disabled: turns it off, so it can't be pressed"); yes-or-no settings read Off and On. Storybook's own radio buttons stay.
- **Applies to:** every page under Components, and Settings under Patterns. Foundations pages keep their own layout, since they show tokens, not a component.

</details>

<details>
<summary><b>D51 · Oct 15, 2026:</b> Motion: open and close, a leaving curve, switching views and loading</summary>

- **Decided by:** Sharon ("what all motion tokens are available in aria that I can take advantage of and add here?"; "where are all of the other different motions that you just told me about")
- **What React Aria gives:** no motion tokens, since it's unstyled, but the moments to animate: overlays mark when they're opening (`data-entering`) and closing (`data-exiting`), and React Aria waits for the animation before removing them ([React Aria: animation](https://react-spectrum.adobe.com/react-aria/styling.html#animation)).
- **Open and close (`motion.open`, `motion.close`):** overlays fade in and grow from 96% over 220ms, and close in 140ms on the leaving curve, because the person is already done with them. Select's menu and the Settings dialog use it. With Reduce motion they only fade.
- **A leaving curve (`motion.easing.in`):** starts slowly and speeds away, for things closing or being removed. Material 3's standard accelerate curve ([Material 3: easing and duration](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)). Arriving uses `out`, back and forth uses `in-out`.
- **Switching views (`motion.switch`):** a 140ms fade when tabs or action tiles change what's shown. Nothing moves, so it's kept with Reduce motion.
- **Loading (`motion.spin`):** one spinner turn every 800ms; the Button's spinner used a fixed value before.
- **The Motion page** shows each one with a real component to try: Select, Tabs and Button. Every value is shared by all themes. The numbers are estimates, chosen to sit on the existing steps.

</details>

<details>
<summary><b>D50 · Oct 15, 2026:</b> Storybook: the theme picker sits on the page, and Compare all works on every story</summary>

- **Decided by:** Sharon ("I don't think it's super clear that the drop-down is up there or how it works"; "if I use the all option in the drop-down, I don't actually see all")
- **On the page:** a Theme picker (Spotlight, Sunrise, Fireside, Compare all) above every story, and once at the top of every Docs page, under the name and what it's for. It changes the same setting as the toolbar, so the two always agree. Controls hidden in a menu are found and used less ([NN/g](https://www.nngroup.com/articles/find-navigation-desktop-not-hamburger)), and seeing which theme is on means never having to remember it (Nielsen: visibility of system status, recognition over recall).
- **Mode and Background in the same bar:** Light or Dark as a button set (two choices), left out for a theme that's always dark; and a Background menu only when the theme has patterned backgrounds, listed in its `theme.json` (Sunrise's marbles). Only what applies to the theme on show appears (Sharon).
- **Storybook's own look:** the picker and the theme names in Compare all are neutral gray in system type, the same in every theme, so they're never mistaken for the component on show.
- **Compare all, everywhere:** handled once in the preview, so every story, Foundations pages included, shows once per theme, side by side, each under its theme's name as a heading. "All" worked only on stories built with a helper before; a choice that works on some pages and not others breaks trust (Nielsen: consistency and standards). Renamed "Compare all" because it says what you get.
- **Moods say what's the default and what changes it:** each theme's default mood first (Spotlight energetic, Sunrise calm, Fireside energetic for now), read from its tokens. Under it, each change with what triggers it: "When a page asks for it" (the other mood, with `data-motion`) and "When someone turns on Reduce motion" (fade only, and where people find the setting). The demos use plain labels (Item 1, Done), never one product's words.
- **Screenshots:** the tests hide the picker (`picker:hide`), so it stays out of every picture.

</details>

<details>
<summary><b>D49 · Oct 15, 2026:</b> Each theme picks its roundness (Square, Standard or Round); every corner follows the part's size</summary>

- **Decided by:** Sharon ("Spotlight is pretty round. Sunrise would be in the middle and Fireside is a little more boxy"; "ideally it looks the same shape no matter what size it is"; "call that one square and maybe we can call that standard")
- **One setting per theme:** `shape.roundness`, picked by name: Spotlight is Round (0.9), Sunrise is Standard (0.6), Fireside is Square (0.2). The numbers are estimates, chosen by eye. A test fails if a theme sets a number instead of a name. Like [Radix Themes' radius setting](https://www.radix-ui.com/themes/docs/theme/radius).
- **The same shape at every size:** a corner is worked out from the part's own size (`src/components/corners.css`), so a small button is the same shape as a large one. Controls take height × roundness ÷ 2 (at 1 a button would be a pill). Surfaces take padding × roundness × 1.6, from the padding rather than the height, so a tall card never turns into a blob. Rows inside a panel take the panel's corner minus its padding, so the corners line up.
- **Limits:** checkboxes stop short of round, so one never reads as a radio button; icon tiles stop short of a circle, so one never reads as a profile picture. Switches, progress bars and tags follow the theme too, so Fireside is square throughout (Sharon: "follow"). Only small round marks (a callout's status dot, the loading spinner) stay circles.
- **Changes D37's rule for radius only:** spacing and sizes still stay in the base. The fixed radius tokens (`radius-control`, `radius-button`, `radius-chip`, `shell-sheet-radius`, and the old fixed `radius-card` and `radius-panel`) are gone. Components use the worked-out ones: `--radius-small`, `--radius-medium`, `--radius-large`, `--radius-box`, `--radius-card` and `--radius-panel`.
- **One word: radius** (Sharon, Oct 15: "make it all say radius"). These were first called corner tokens; the page title, the story and the tokens now all say radius.
- **Not yet:** a density setting for spacing. Other libraries keep spacing shared and offer at most one "denser or roomier" setting ([Radix scaling](https://www.radix-ui.com/themes/docs/theme/spacing)); add one only when a product needs it.

</details>

<details>
<summary><b>D48 · Oct 15, 2026:</b> Card is a surface with typed parts; Tile is the clickable one; Action tile is for navigation; Solid and Glass everywhere</summary>

- **Decided by:** Sharon ("the look that you have for action tile should become the look for the card"; "we would only use action tiles if there's navigation"; "I'm only using solid and glass")
- **Decided by:** Sharon, again ("a card is acting like a surface area"; "regular tiles … a card that is acting like a button … would be a different component"; "Actually, I like note")
- **Card is a surface, never pressable:** the action tile's look for any content, Solid or Glass, with no hover or pressed state. The buttons and links on it are pressed, never the card. Its parts have their type set by role: `CardHeader` (an optional icon, a label and the title, a real heading at h3 unless `level` says otherwise), `CardBody` (body text) and `CardFooter` (buttons and an optional quiet `note`). Card, Tile and Action tile share one stylesheet, so they can't drift apart. Same model as [Carbon's tiles](https://carbondesignsystem.com/components/tile/usage/): base, clickable and selectable.
- **Tile:** the clickable one. A whole tile that's a link (`href`) or a button (`onPress`), with an icon, title and description and the tile's hover, pressed and focus states.
- **Text parts on their own:** `Heading` (display, title, heading, subheading), `Body` (large, default, small), `Label` and `Note`, each in the theme's type style ([Polaris Text](https://polaris.shopify.com/components/typography/text) works the same way). "Note" stays, not "Caption" (Sharon).
- **Icon tile:** an icon in a tile, `filled` (a soft background) or `plain`, small, medium, large or xlarge. Card, Tile and Action tile headers take one at the top or at the start (`iconPosition`). Like Atlassian's Icon tile.
- **Removed:** Card's opaque, translucent and transparent, and Action tile's fills (card, raised, sunken, accent and inverse). Accent was the same color as chosen, so an accent tile looked chosen; raised and sunken were really the hover and pressed looks, which are states. `variant`, `interactive` and `fill` are ignored now, so nothing breaks.
- **Solid and Glass:** every component that can be glass has `appearance`, Button included, `solid` (the starting look) or `glass`, the name Atlassian and Fluent use for a look ([Figma: variant properties](https://help.figma.com/hc/en-us/articles/360056440594)). It replaces `material`, whose "default" no one recognized; `material` still works. Button keeps Glass as one of its styles, always real glass.
- **Glass cards anywhere:** any card can be Glass, not only an empty one. Replaces D42's "glass cards only while empty" and D36's material names.
- **Action tile is navigation:** tiles switch the page's content, like tabs, and become the bottom bar on phones. A link or button that looks like a tile is a Tile. Tiles with `href` or `onPress` still work, but are deprecated.
- **Stories that each do one job:** Card: Playground, Solid and glass, Parts, Icons, Empty state. Tile: Playground, Solid and glass, States. Icon tile: Playground, Sizes and backgrounds. Text: Styles. Action tile: Playground, Solid and glass, States, Navigation. Links and buttons are explained on Card's Docs page instead of a story of identical tiles.
- **Not yet:** the name. "Action tile" could become "Navigation tiles" now that navigation is its only job; Sharon to decide.

</details>

<details>
<summary><b>D46 · Oct 14, 2026:</b> Action tile titles one size smaller; action tiles fit their space</summary>

- **Decided by:** Sharon ("that text feels too big")
- **Title size:** each theme picks (`action-tile.title-large`). Sunrise and Fireside use their heading style (20px and 16px); Spotlight uses its title style (20px), because its heading is no bigger than its body text. Long words wrap inside the tile instead of spilling out.
- **Fireside text color:** a tile's label and description use `action-tile.ink-soft`. Fireside's is its warm grey (#bebbad), not its honey-yellow secondary, which read wrong next to the cream title. Spotlight and Sunrise keep their secondary text color.
- **Label:** the label above the title keeps the theme's label size and spacing but uses the lighter weight of its meta style, so it sits quietly and the title is read first (Sharon: the label was too big for the hierarchy).
- **Layout:** action tiles sit as many across as fit at 12rem or more each, so a narrow column gets fewer, roomier tiles instead of squeezed ones. Page-switching tiles keep D31: three across on tablet and up, the bottom bar on phones.

</details>

<details>
<summary><b>D45 · Oct 14, 2026:</b> One light per page, shown in Storybook as a sun on every glass story; a softer focus glow</summary>

- **Decided by:** Sharon ("we need to show a light source on any surface that shows glass"; "the focus is too much")
- **One light per page:** an element marked `data-glass-light` is the page's light (`PAGE_LIGHT`). Glass with no light of its own is lit from the nearest one around it, so every glass on the page shares one light. Moving it (then firing `LIGHT_CHANGE`) moves every rim, highlight and shadow. A glass group's own `source` or `light` still wins, and with no page light the light tokens are used as before.
- **Storybook:** each theme panel lights its glass from its own real background (the same art and light as the Glass playground), so glass looks the same in every story as it does in the playground. Groups inside a lit panel don't light themselves (`LitContext`), and a lens leaves glass inside a nested lit container to that container's lens.
- **Storybook:** every story that shows glass gets the page light as a small sun. Every movable light in Storybook starts on the right of its section, two thirds down (D57), and is only an orb, with no rays. A full page (the page shell) keeps its light still, where it sits on the real page (updated Oct 15). Drag it, or focus it and use the arrow keys. Stories with their own light (the Glass playground's sun, the page shell's wheel) keep theirs.
- **Balanced light (Sharon: "not balanced, so it's not natural"):**
  - Story panels and self-lit tile groups use the same long reach as the Glass playground, so every tile catches the sun about equally.
  - A bug in the shared glass recipe put the inner highlight on the far edge and the shade on the lit edge (an inset shadow shows opposite its offset). They're swapped back.
  - The lens treats the light as above the page, so every edge turned toward it catches some light, softly, with the brightest edge the one facing it most, instead of one hot edge and nothing elsewhere.
- **Focus glow:** a soft line of light right at the tile's edge with a small bloom, instead of a wide halo, and still no ring. Its color (Sharon):
  - On dark or colored backgrounds (dark mode, Fireside, the page shell header): half white, half the lightest step on the theme's primary color line (`color.border.focus-glow-on-dark`).
  - On light backgrounds: the theme's primary color itself (Spotlight's red, Sunrise's charcoal), because a near-white glow disappears on a light page and keyboard users couldn't see focus (`color.border.focus-glow`).
  - It surrounds the tile evenly and doesn't respond to the light: while focus shows, the tile's edge stops catching the light (its rim, inner highlight and shade, and the lens's edge light step aside), so the glow is the same all the way round (Sharon).

</details>

<details>
<summary><b>D44 · Oct 14, 2026:</b> States stories are still pictures; Playground is where states are tried</summary>

- **Decided by:** Sharon ("It feels like I shouldn't get a hover if I have a hover")
- **What:** each component's States story shows every state as a still picture. The examples ignore the mouse and keyboard, so hovering the "Hover" example no longer stacks a real hover on top of the pinned one. A line above them says so and points to Playground, where the states can be tried for real.
- **Where:** `StatePictures` in `src/components/story-helpers.tsx`, used by the States stories of Action tile, Button, Card, Checkbox, Link, Tabs, Tag and Toggle button group.

</details>

<details>
<summary><b>D42 · Oct 14, 2026:</b> Glass light follows the surroundings; glass cards only while empty; accessibility fallbacks for Glass tiles</summary>

- **Decided by:** Sharon (the empty-card idea, and yes to the light-physics review's fixes and the two items taken from the [liquid-glass skill](https://github.com/haider-nawaz/liquid-glass-skill))
- **Gaps:** an edge facing a neighbor that sits between it and the light catches less light (up to 60% less, never all of it, since the light also comes from above).
- **Edges take the surroundings' color:** away from the light, the very edge mirrors the colors around it, as real glass does at a glancing angle, instead of a white line.
- **Milky glass is one even layer:** a chosen Glass tile casts a fuller shadow (it scatters light instead of letting it through), but nothing shades its inside: no bending, no blur pulling its shadow in, no inner highlight band, just the average of what's behind under the theme's frost. Only its edge catches the light (Sharon: no inner shadow).
- **Warm daylight:** the lit edge and highlight are warm white in Spotlight, Sunrise's light mode and Fireside; Sunrise at night stays neutral.
- **Shadows are the surface, darker and cooler:** a shadow is mixed from the color it falls on (on a plain page, the page's own color), as a painter would, with the theme's shadow color only nudging the hue. It fades out gradually and never wraps onto the lit side.
- **Glass on a card is for empty states only:** a card that holds just an empty state can be Glass, since there's nothing to read yet; once it has content, the app sets it back to Default. The [Card's Empty state story](https://designsystemskeleton.netlify.app/?path=/story/components-card--empty-state) shows both.
- **Reduce transparency and Increase contrast on Glass tiles:** the lens is off, so there's no light: the tile turns solid in its theme's color, its text still passes, and it drops the painted rim. An unchosen tile has no edge, and a chosen tile shows a line in its text color plus its mark, so it never depends on the fill. Increase contrast looks the same with no shadows at all, on tiles and glass buttons (Sharon's call). Before, a Glass tile had no fill at all when the lens was off.
- **Every change glides (Sharon: "smooth as glass, nothing jarring or quick"):** the lens eases each glass's light, lift, milk and opacity over the slow motion step, and the light itself over the fast step, so hovering, choosing, disabling and moving the sun all fade instead of jumping. CSS state changes on tiles and glass buttons ease in and out on the base and slow steps (fills on the slow step, in time with the lens); the press stays on the fast step so a tap still answers, and its swell now rises gently too. Reduced motion skips all of it. The look is unchanged.
- **Not taken from the liquid-glass skill:** its code and Apple-only APIs. It has no light or shadow guidance.

</details>

<details>
<summary><b>D41 · Oct 14, 2026:</b> Glass goes back to the shader demo, with its settings in every theme</summary>

- **Decided by:** Sharon ("I am not going to be happy until I have this again")
- **What:** the lens drawing code is the Oct 14 shader demo's (from #54) again, with only two fixes that don't change how it looks: it can draw on a clear background, and its shadow never shows through the glass. The experiments since (painted shadows, two-sided rims, caustics) are dropped.
- **Settings:** matched side by side to Sharon's screenshot of the demo's grid panel and written into each theme's `glass.lens` tokens: a faintly milky body (10% white), no tint, a bright line on the edge facing the light, bend 1.5, edge depth 28px, a soft shadow 14px away from the light with a 34px blur. Shadow strength fits each background: 40% on Spotlight's red, 16% on Sunrise's light marble, 50% on Fireside.
- **Fixes found while matching:** a Glass tile's own layer was filtering the lens again and smearing its bend (the marble barely bent); glass buttons drew their own border under the lens's edge, so they looked thicker than tiles.
- **Clear, not frosted (follow-up):** white reads as light on a dark page but as frost on a light one. Sunrise's light mode has no white body and a gentle inner band; its dark mode keeps the demo's sheen; Spotlight and Fireside use a 4% body. The bevel scales with the piece (at most just over half its height), so short buttons stay clear in the middle instead of turning milky.
- **Edges drawn by light only:** the rim away from the light is down to 4% white, so there's no fixed border; the edge brightens and fades as the light moves.
- **Shadows rest close:** 4px from the light with a 14px blur, so glass reads as lying near the page, not floating high above it. The shadow appears only on the side away from the light (never a halo on the lit side), with a fine deeper line where the glass meets the page, and is paler in the middle because glass lets light through.
- **Light behaves differently in the dark:** on dark backgrounds (Sunrise at night, Fireside) shadow has little to darken, so the glass is shown by light: almost no white film, a bright edge where the light hits, and faint shadows. On light backgrounds the shadow carries more of the form.
- **Chosen Glass is milky** (Sharon's pick): frost strength per theme, measured so the text keeps at least 4.5:1 (Sunrise 13.5, Sunrise at night 4.7, Fireside 8.3, Spotlight 4.7).

</details>

<details>
<summary><b>D40 · Oct 14, 2026:</b> Action tile works in every theme; Glass is the lens and follows the light; states are soft light</summary>

- **Decided by:** Sharon
- **Why:** Action tile was built for Spotlight's red header only. On anything else its text disappeared, and Sunrise and Fireside had no tile at all.
- **Default:** a solid fill with an inviting shadow and light catching the edge (the cards' lighting). `fill` picks the inside color from the theme's own surfaces: card (the default), raised, sunken, accent or inverse. The text color switches with it, so every choice passes contrast in light and dark mode.
- **Glass is the lens, everywhere.** The old frosted recipe is only the fallback when the lens can't draw (no WebGL, Reduce transparency, Increase contrast). On a plain background Glass is fully clear: nothing bends, but its edge, highlight and shadow face the page's light and follow it when it moves. On art the design system paints, it also bends the art. Its shadow falls only outside the glass.
- **Page shell:** tiles on the header are Glass unless they ask for Default, so After Graduation's header keeps its glass tiles with no change in the app.
- **States, soft light, no hard lines:** hover rises with a deeper shadow and a faint tint; pressed sinks back; chosen shows the theme's mark (Spotlight's star, a check in Sunrise and Fireside, or any icon through `chosenIcon`) and sits flat: Default takes the accent fill, Glass turns milky, the theme's frost (`action-tile.chosen-frost`) over a blur of what's behind it, chosen by Sharon over raised and tinted on Oct 14; its text sits on top at its usual color, untouched by the frost or the light; focus is a soft glow with no ring; disabled fades to half with no shadow.
- **Foundations → Glass:** a playground on the real background of the theme picked in the toolbar, in light and dark mode (Spotlight's header, Sunrise's marble, Fireside's page). Drag the sun, or use the arrow keys, and every rim, highlight and shadow follows; in Spotlight the sun is the header's own light, so the wheel and rays move too. Sliders for bend, edge depth, color split, edge light and shadow; the values Sharon picks become each theme's glass-lens tokens.

</details>

<details>
<summary><b>D39 · Oct 14, 2026:</b> Releases attach a ready-built package file</summary>

- **Decided by:** Sharon (approved with the audit list)
- **Why:** installing from a GitHub tag downloads the whole repo (about 280 MB with its screenshots) and builds it on the app's machine. A release file has only the built components, theme CSS and fonts.
- **How:** a version tag (`v0.4.0`) runs `.github/workflows/release.yml`. It runs the tests, packs the package with `npm pack` and attaches the file to a GitHub Release. Apps install that file's link.
- **First release file:** v0.4.0. A workflow only runs from the tagged commit, so v0.3.0 and earlier keep installing from their tag.
- **CHANGELOG.md** lists what changed in each version. Every release pull request moves the Unreleased notes under its version.
- **Experimental:** `useGlassLight`, `imageArt`, `shellArt` and `LensOptions` are marked `@experimental` until the glass review ([issue #60](https://github.com/sharonlafleur1984/design-system-skeleton/issues/60)). They may change in any version.
- **Not yet:** fonts as separate files. The package build inlines font files into the font CSS; changing that could break how After Graduation loads its fonts, so it waits for its own pull request.

</details>

<details>
<summary><b>D38 · Oct 14, 2026:</b> The repo follows how-i-work; ESLint checks the code</summary>

- **Decided by:** Sharon
- **CLAUDE.md** gets the rules the how-i-work template added since this repo started: every commit names its Claude session, main is protected, work finishes with a pull request, and Netlify changes update "How everything connects." It also records this week's rules: one word (theme), spacing in the base, adding a theme is one folder, React Aria's names, plain labels in stories.
- **`docs/voice.md`:** how the design system sounds, and the words it uses (theme, base, token, material, React Aria's component names, the status names).
- **ESLint** runs on every pull request. It checks for code mistakes only: React hook rules, accessibility in JSX (jsx-a11y) and TypeScript's recommended rules. It found 4 errors, all fixed.
- **Not added:** Prettier (it would reformat every file and protects nothing a reviewer needs) and Stylelint (the component CSS tests already ban raw colors, sizes and weights, and now unknown tokens and stray breakpoints).
- **Focus ring tokens:** `focus.ring.width` and three offsets in the base, used by every component instead of hand-typed 2px. Nothing looks different.
- **One breakpoint list:** `src/components/breakpoints.ts`, matching the token build. A test checks every media query uses it.
- **Node 22** is declared (`.nvmrc` and `engines`).

</details>

<details>
<summary><b>D37 · Oct 14, 2026:</b> Adding a theme is one folder</summary>

- **Decided by:** Sharon
- **Decision:** a theme is one folder in `tokens/themes/`, with a `theme.json` that names it, plus a fonts file. Storybook, the Foundations pages, the visual tests and the package find it on their own; no theme names are typed into code. Each theme's write-up lives here, on [Themes](Themes). Each product's own docs only name its theme and link here.
- **New checks:** a component can't use a token that doesn't exist; a theme can't set the same token twice; a theme can't set spacing, sizes or corners, dark mode included; every theme has a `theme.json` and a fonts file.
- **Explorations** are screenshotted only in the theme they were made for (84 fewer screenshots).
- **Why:** before, a theme's name was typed into about 10 files, and a missed one failed quietly. The fourth theme is coming.
- **How to:** [Add a theme](Add-a-theme).

</details>

<details>
<summary><b>D36 · Oct 14, 2026:</b> Two materials: Default and Glass</summary>

- **Decided by:** Sharon
- **Decision:** every component with a glass look has a `material` setting with two looks. **Default** is the subtle frosted look (the shared recipe in `glass.css`). **Glass** bends the art behind it at its edge (until now called "lens glass").
- **Which components:** Button (its glass style), Action tile, Card, Tag, Toggle button group (its sliding indicator) and Page shell (the tiles and buttons in its header).
- **Starting looks stay the same:** action tiles, glass buttons and the page shell start as Glass; cards, tags and toggle button groups start as Default. Nothing changes until someone switches.
- **Where it shows:** Glass only shows on artwork the system controls (a theme's header art, Life Hub's marble). On a plain page both look the same.
- **Why:** "lens" and "classic glass" were confusing names, and Glass doesn't read as glass as much as hoped. Clear names now; a deeper look later.
- **Open:** review the glass build ([issue #60](https://github.com/sharonlafleur1984/design-system-skeleton/issues/60)).
- **Details:** `src/components/material.ts`; stories "Glass on artwork" and "Default on artwork" under Button and Action tile.

</details>

<details>
<summary><b>D35 · Oct 14, 2026:</b> Components use React Aria's names; "theme" is the one word; themes are Spotlight, Sunrise and Fireside</summary>

- **Decided by:** Sharon
- **One word: theme.** It's what React Aria, Storybook and most design systems call it, so any designer recognizes it. Not "skin."
- **Theme names:** Spotlight (After Graduation), Sunrise (Life Hub), Fireside (the designer toolkit). Each is a kind of light. The folders under `tokens/themes/` keep their product names.
- **Component names follow React Aria** where one exists, so a designer coming in knows what each one is:

  | Was | Now |
  |---|---|
  | Chip, ChipGroup | Tag, TagGroup |
  | Segmented control (SegmentedControl, Segment) | Toggle button group (ToggleButtonGroup, ToggleButton) |
  | Divider | Separator, now built on React Aria's Separator |
  | ProgressMeter | ProgressBar, now built on React Aria's ProgressBar |
  | Callout tones due, settled, overdue, quiet | warning, success, error, neutral (the status color names) |

- **Prop names follow React Aria too:** `isDisabled`, `isSelected`, `defaultSelected` and `isPending` replace `disabled`, `checked`, `defaultChecked` and `loading`.
- **Nothing breaks:** the old names still work as aliases, marked deprecated, so apps can update when they're ready.
- **Error callouts** get their own symbol (×), so they never differ from warnings by color alone.
- **Storybook:** it opens on a Welcome page with every component collapsed. Inside a component, stories come first and Docs last. Component stories use plain labels (Button, Label, Tab 1) instead of one product's copy.

</details>

<details>
<summary><b>D43 · Oct 14, 2026:</b> Fireside type: Newsreader for titles, Instrument Sans for everything else</summary>

- **Decided by:** Sharon
- **Decision:** the designer toolkit's theme (Fireside) uses **Newsreader** for titles only: display, page and document titles, and headings. Its optical-size axis is on, so big titles get the fine display cut and small headings the sturdier text cut. **Instrument Sans** is for all body text and the whole interface. Newsreader is never used for tabs, buttons, labels or controls. **JetBrains Mono** is for code, IDs, file names and keyboard keys. All three are free (OFL) and served from this package.
- **The mood:** editorial and calm for reading, crisp for the interface. Taken from Sharon's sample: a SemiBold Newsreader display, Instrument Sans body, interface text from 12 to 14px in weights 400, 500 and 600.
- **Sizes (desktop):** cover title 56 on 60, page and editor title 32 on 40 (`display-l`), document title 20 on 28 (`heading-title`), headings 16 on 24 and 14 on 20, reading text 16 on 24 (`body-large`), interface text 14 on 20 (`body-default`), notes 12 on 16 (`body-small`), dates 12 on 16 (`label-meta`), section labels 10 on 16 (`label`), code 12 on 20. Titles shrink on tablets and phones. Sharon is fine with adjusting sizes later; the hierarchy is the point.
- **Keeps the toolkit's hierarchy:** section label < meta < body < headings < document title < page title, the same order as today's toolkit (9, 11, 12, 13, 15px). A test checks the order.
- **Section labels are 10px, up from the toolkit's 9px.** Sharon approved raising it (Oct 14). Instrument Sans in capitals at 9px ran together; 10px is the smallest size that reads well, checked in Storybook, with the letters spaced out (0.08em). It's the one size off the 4-point grid besides 14px, and only for this label.
- **Sample sizes moved to the grid:** the sample's 58 on 60 display, 18 on 27 body, 28px editor title and 11px interface text became 56 on 60, 16 on 24, 32 (28 on tablets) and 12, so every size follows the shared 4-point rule (Oct 4 and Oct 6).
- **I, l and 1 look alike in Instrument Sans,** and so do O and 0. Fine in words, but wherever one character matters (codes, IDs, file names, versions, keyboard keys), use the code style. Shown in Foundations, Type, Small text legibility.
- **Dates in capitals use regular weight (400),** not light. Instrument Sans has no light weight, and a faked one blurs.
- **New for every theme:** a `code` text style and `font.family.code`. After Graduation and Life Hub use the device's own monospace font, so nothing loads and nothing they show changes. `font.optical-sizing` (auto) is shared too.
- **New: text style classes.** One class per style, like `ds-text-body-default`, generated from the tokens into `text-styles.css`, so an app can use a whole style by name. They work in every theme and follow screen sizes. One composite token per style was considered, but a single value can't follow the phone and tablet sizes, so each style stays a group of tokens (size, line height, weight, letter spacing, family) with a class on top.
- **Replaces:** "Borrowed for now: type" in Oct 14, "Fireside is the third theme." Cinzel and Atkinson Hyperlegible Next are gone from Fireside.
- **Other options:** keeping the 9px label (too small in Instrument Sans capitals); the sample's exact sizes (off the shared grid); Newsreader for buttons and tabs (Sharon ruled it out).
- **Not done yet:** the toolkit itself still uses its own sizes. Adopting these styles there is a separate step.
- **Details:** Foundations, Type in Storybook (Text styles, Light and dark, Small text legibility, Do and don't, In context).
- **Sources:** [Newsreader](https://fonts.google.com/specimen/Newsreader), [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans), [JetBrains Mono](https://www.jetbrains.com/lp/mono/), [MDN font-optical-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing), [Design Tokens Format 2025.10, typography](https://designtokens.org/TR/2025.10/format/)

</details>

<details>
<summary><b>D34 · Oct 14, 2026:</b> Fireside is the third theme, for the designer toolkit</summary>

- **Decided by:** Sharon
- **Decision:** the designer toolkit's Fireside skin is a theme here, `tokens/themes/designer-toolkit`, and appears in Storybook's Theme picker as "Designer toolkit (Fireside)". It is always dark, so it has no dark folder and the Mode switch doesn't change it.
- **Colors:** Retro, the colors Sharon picked to update Fireside (the toolkit's shell preview, Oct 13). **Peach copper (#E1A36F) is the primary color:** the main button, focus and the selected item, with near-black text on it. It replaces bright rust. Behind it: a deep teal-black page (#08161A), teal panels, cream text, and soft yellow for supporting text. Status colors keep their jobs: red for danger, green for success, yellow for warnings. Every text pair passes 4.5:1 (tests/tokens.test.ts).
- **Spacing, sizes and corners come from the shared base** (`tokens/base/`), like every other skin. The theme overrides none of them, so a change to the base reaches the toolkit too. This replaces the Oct 12 toolkit theme (closed #53), which set its own tighter spacing, control heights and corners.
- **Kept from the first Fireside palette:** the color ramps on Foundations, Colors, Palette (near-black, cream, peach, rust, fire red, lake green, honey). Retro has no ramps yet, and no component uses a ramp directly.
- **Borrowed for now:** type and motion come from After Graduation until the toolkit picks its own (Skin: Still open).
- **Not made yet:** Fireside skins for Action tile, Page shell and Settings, and Fireside's glass. Those stories say so when Fireside is picked, the same way they do for Life Hub.
- **Why:** the toolkit's Skin page says Fireside is a theme in this design system, but it only existed as a copy inside designer-toolkit-code, so it never showed in Storybook.
- **How:** "Both, side by side" is now "All, side by side" and shows all three themes. Visual tests screenshot every story in Fireside too.

</details>

<details>
<summary><b>D33 · Oct 12, 2026:</b> Action tiles and glass buttons use lens glass</summary>

- **Decided by:** Sharon
- **Decision:** action tiles and glass buttons are lens glass. The lens bends the artwork behind the glass at its curved edge, strongest at the very edge and clear in the middle, with almost no blur. It never bends or blurs the text or icons; they stay crisp on top.
- **Only on artwork the system controls:** After Graduation's header and Life Hub's marble backgrounds. Everything else keeps the current glass.
- **The light model stays:** one light position (Oct 7), each glass lit from its own direction, softer with distance, and the reach setting.
- **Look:** a 5% white body with a 4% theme tint, a 1px rim brightest facing the light, a soft highlight inside that edge, and a shadow 2px away from the light (24px blur, 20%). The edge curves 22px in, with a faint color split. All in `glass.lens` tokens, so each theme can tune them.
- **Motion:** the glass moves over the art as the page scrolls. A pressed tile or button swells about 2%, text and all, and settles back in 300ms. Classic glass (no lens) keeps the button's small press shrink instead; the difference is fine (Oct 13). On phones, tilting nudges the light a little, then it eases back to rest. On iPhone, motion access is asked for on the first tap on a tile or button, never on load. Reduced motion, from the device or from Settings, turns all of it off.
- **Fallbacks:** with no WebGL, a lost graphics context, Reduce transparency or Increase contrast, the glass shows the current recipe. Never a blank tile.
- **Why:** Apple-style liquid glass that stays crisp and reliable. The SVG bend smeared the art in Chrome.
- **Other options:** blur-only frosted glass; the SVG backdrop bend.
- **How:** one WebGL canvas behind each group of glass paints the known art and draws every glass in it. New: Button `variant="glass"`, `useGlassLight`'s `lens` option, `shellArt` and `imageArt`, and the `glass.lens` and `button.glass-ink` tokens.
- **Details:** Components, Action tile and Button in Storybook (lens glass stories, fallback and reduced motion).

</details>

<details>
<summary><b>D32 · Oct 8, 2026:</b> Storybook backgrounds: artwork lives only in Page shell</summary>

- **Decided by:** Sharon
- **Decision:** Storybook's built-in Backgrounds button offers two backgrounds per theme, made from tokens: **Page** (what a product's pages sit on) and **On artwork** (a plain color glass controls float on: After Graduation's header red, Life Hub's marble). Components made for artwork, like Action tile, open on On artwork. The full illustration (light, rays and wheel) lives only in Page shell, which shows the real tiles in context.
- **Why:** Action tile's stories painted their own copy of the rays with hard-coded values, so tiles looked different there than in the page shell. One home for the art means nothing to keep in sync, and any future glass component gets the same backgrounds for free.
- **How:** `storyBackgrounds` and `storyBackgroundsCss` in `story-helpers.tsx`; the side-by-side "Both" view uses the same Page background. No default, so other stories look the same as before.
- **Source:** [Storybook backgrounds](https://storybook.js.org/docs/essentials/backgrounds)

</details>

<details>
<summary><b>D31 · Oct 8, 2026:</b> Page-switching tiles never stack; on phones they become the bottom bar</summary>

- **Decided by:** Sharon
- **Decision:** tiles that switch pages stay three across on tablet and up, with titles wrapping to two lines on small tablets if needed. On phones (under 600px) the same tiles become the bottom bar: an icon and a short name each, with a soft pill behind the chosen one. Tiles that are plain links or buttons still stack on phones. The switch is by screen size, not by the width of the tile row.
- **Why:** the tiles were stacking on tablets up to about 648px, because the row sits inside the page margins. Three across fits at every tablet width (measured 600 to 839px, nothing overflows). Phones were always meant to use the bottom bar, as in the After Graduation prototype.
- **How:** it's one set of tabs with two looks, so keyboard, screen readers and the chosen page stay the same on every screen. New tile props `icon` and `shortTitle`; new token `bottom-bar.icon` (24px).
- **Details:** Components, Page shell, With navigation in Storybook (renamed from With episodes).

</details>

<details>
<summary><b>D30 · Oct 7, 2026:</b> Max content width is 1024px, shared by every product</summary>

- **Decided by:** Sharon
- **Decision:** the max content width (how wide a page's content gets) is 1024px, as `layout.content-max` in the shared base. It replaces After Graduation's `shell.content-max` (920px, which had no recorded source).
- **Why:** 920px left a lot of red on each side, and the design system serves more than After Graduation. 1024px is the [US Web Design System](https://designsystem.digital.gov/utilities/layout-grid/)'s default container. Running text stays readable at any width because of the 70-character measure.
- **Other options:** 960px ([GOV.UK](https://design-system.service.gov.uk/styles/layout/)); 1200px (almost no red on a 1280px laptop).
- **Next:** shared for now. A product can get its own value later if it needs one.

</details>

<details>
<summary><b>D29 · Oct 7, 2026:</b> Running text stops at a 70-character measure</summary>

- **Decided by:** Sharon
- **Decision:** paragraphs and list items are never wider than `type.measure`, 70ch (about 70 characters), in every product. The page's max content width is separate: tiles, tables and cards still use the full width.
- **Why:** inside the 920px sheet, text ran about 95 to 100 characters per line. Readable lines are 45 to 75 characters ([Baymard](https://baymard.com/blog/line-length-readability)), and [WCAG 1.4.8](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html) caps them at 80.
- **Next:** starting value. Revisit if it looks wrong once real episode content is on the page.
- **Details:** Foundations, Type, Measure in Storybook.

</details>

<details>
<summary><b>D28 · Oct 7, 2026:</b> Page shell: the sheet is as wide as the header's content, with a margin on every screen size</summary>

- **Decided by:** Sharon
- **Decision:** the page sheet is never wider than the header's content. On wide screens both cap at the max content width. On every screen size the sheet sits in from the screen sides by the same space as the header's content, so the two always line up. This replaces the Oct 4 rule that the sheet ran edge to edge on tablet and phone.
- **Why:** on desktop the sheet ran much wider than the header, so the page didn't line up with it. On phones the sheet touched the screen sides and lost its margin.
- **Tokens (After Graduation only):** `shell.sheet-inset` now 16 / 24 / 24, matching `layout.gutter`.
- **Names:** the width cap is the **max content width** (often called the container). The space between the screen side and the content is the **margin** (Material 3's term); gutters are the space between columns.

</details>

<details>
<summary><b>D27 · Oct 7, 2026:</b> Settings: a full-size dialog, opened from the top right of the header</summary>

- **Decided by:** Sharon
- **Decision:** app-wide settings open in a full-size dialog, modeled on Claude's, from a Settings button at the top right of the header on every screen size. Eight sections: Account, Appearance, Accessibility, Plan, Family, Notifications, Privacy and data, Help and legal. On phones the section list comes first and each section opens with a Back button. Changes apply right away, with no Save button. Anything the device can tell us defaults to Match device; if the device asks for reduced motion, motion stays reduced.
- **Why:** top right is where people look for app-wide settings; on the page it would read as settings for that page. The Motion setting also gives people a way to stop the header wheel.
- **Research:** Settings research in the After Graduation wiki (sections, defaults, and the research behind each accessibility setting).
- **Details:** Patterns, Settings in Storybook; [#42](https://github.com/sharonlafleur1984/design-system-skeleton/issues/42).

</details>

<details>
<summary><b>D26 · Oct 7, 2026:</b> One light position and one glass recipe for every product</summary>

- **Decided by:** Sharon
- **Decision:** the light source sits in one shared place (`light-from-right`, `light-top`): After Graduation's wheel and Life Hub's sun. Every glass surface on a page, cards and tiles, in light and dark mode, is lit from it with one shared recipe (glass.css): rim, glint, highlight, shade and shadow. Each theme sets the recipe's settings in tokens. Glass on artwork bends the art behind it and softens it a little.
- **Why:** the light direction decides how every piece of glass looks, so it has to agree everywhere. One recipe means a fix reaches both products.
- **Also decided:** the wheel turns as the page opens and then rests (WCAG 2.2.2); action tiles rise 2px on hover and don't underline.

</details>

<details>
<summary><b>D25 · Oct 7, 2026:</b> After Graduation's red is crimson</summary>

- **Decided by:** Sharon
- **Decision:** After Graduation's red ramp moves from cherry to crimson (600 is #cb1b2c), with the same steps, so components don't change. Its status colors are tuned to match: error moves to rust (#ca5d34) so it never looks like the crimson button, and warning, success and info sit with the gold. Dark mode follows.
- **Why:** crimson looks richer and warmer, and less juvenile. White on the crimson button passes 5.6:1, up from 4.8:1.
- **Replaces:** the cherry red (#d03656) in Sep 26, "After Graduation is quiet by default."
- **Details:** comparison under Explorations, After Graduation crimson.

</details>

<details>
<summary><b>D24 · Oct 7, 2026:</b> Each theme picks its own status colors</summary>

- **Decided by:** Sharon
- **Decision:** the base keeps the status names (error, warning, success, info, neutral) and the rules: always with an icon and a label, and text that passes 4.5:1. Each theme picks its own status values, so they fit its palette, type and card styling. Life Hub keeps today's set, which matches its Figma library. After Graduation gets a set tuned to its palette.
- **Why:** each product has its own look on purpose. One shared status set couldn't match both palettes.
- **Trade-off:** a fix to a status color no longer reaches every product at once.
- **Replaces:** part of Sep 26, "One shared base, a theme for each product," which put one status color set in the base.

</details>

<details>
<summary><b>D23 · Oct 7, 2026:</b> Motion: one timing scale, two moods (calm and energetic)</summary>

- **Decided by:** Sharon
- **Decision:** every product shares one timing scale for controls (80, 140, 220 and 380ms, two easings, a 60ms stagger), so buttons, toggles and tabs feel the same on every page. Arrivals and celebrations use a mood: calm (settles, never bounces) or energetic (snaps in and overshoots). Life Hub defaults to calm, After Graduation to energetic, and any page can switch with `data-motion`. Reduced motion always gets calm, with fades only. After Graduation's header entrance gets its own slower tokens (about 1.4 times the prototype's speed) so it can stay dramatic while cards and lists keep the quicker energetic arrival.
- **Why:** the components had hard-coded their own speeds, and Life Hub's quiet rules didn't fit After Graduation's anime look. Saving energetic for earned moments keeps it from wearing thin.
- **Sources:** timing from the Life Hub Figma Glass, Motion, Sizing page; header animation from the [After Graduation prototype](https://afterhighschool.netlify.app/).
- **Other options:** one calm system for every product; picking the mood for each whole page, including its controls.

</details>

<details>
<summary><b>D22 · Oct 7, 2026:</b> Home and Office trade colors</summary>

- **Decided by:** Sharon
- **Decision:** Home is now Morning Latte and Office is now Gold Sand. Each area's marble, glass tuning and dark layer moved with its colors.
- **Details:** [#33](https://github.com/sharonlafleur1984/design-system-skeleton/pull/33)

</details>

<details>
<summary><b>D21 · Oct 7, 2026:</b> After Graduation's dark mode is warm charcoal</summary>

- **Decided by:** Sharon
- **Decision:** After Graduation's dark mode uses warm charcoal surfaces. The deep red stays on buttons and the header, so it is the one thing that stands out, and the header's red glows faintly down from the top right. Text is the theme's light page color (#fcf9f8). Red links and text use a lighter red so they pass on charcoal. Cards are glass in dark mode, lit from the header's light; light mode cards stay solid.
- **Why:** neutral dark keeps the red meaningful. Using the light page color for text keeps every dark color in the palette.
- **Other options:** deep wine surfaces that carry the header's red down the page (B in the review).
- **Details:** [#29](https://github.com/sharonlafleur1984/design-system-skeleton/pull/29)

</details>

<details>
<summary><b>D20 · Oct 7, 2026:</b> Life Hub's new look: glass cards, one sun, warm neutral buttons, Fraunces and Figtree</summary>

- **Decided by:** Sharon
- **Decision:** Life Hub cards are glass on each area's marble. One sun in the header (top right) lights everything: rims are brightest facing it, shadows fall away from it, and light weakens with distance. Light mode shows the light as shade and shadow; dark mode as highlights. Buttons are warm neutral (ink in light, light warm gray in dark) with a thin line of light on the top edge, at about half the card's light. Color is kept for meaning (status) and place (the marble). Titles use Fraunces with its Soft axis; everything else, numbers included, uses Figtree.
- **Why:** glass on marble is Life Hub's signature. Area-colored buttons borrowed status meanings (berry read as Delete, gold as a warning), and a green button fought half the marbles. The serif-on-cream look felt like every AI product; Fraunces's soft endings feel poured, like marbling.
- **Replaces:** Sep 27, "Life Hub glass is for controls only." Buttons inside a glass card have no blur of their own, so it is still never glass on glass.
- **Other options:** solid cards with glass controls (the old rule); area-colored or gold buttons; Newsreader and Archivo; a monospace data font.
- **Details:** [#28](https://github.com/sharonlafleur1984/design-system-skeleton/pull/28), exploration in [#27](https://github.com/sharonlafleur1984/design-system-skeleton/pull/27). Per-area values are estimates from the Oct 6 to 7 review.

</details>

<details>
<summary><b>D19 · Oct 7, 2026:</b> Dark mode follows the device, and each theme designs its own</summary>

- **Decided by:** Sharon
- **Decision:** dark mode switches on with the device setting, with no switch in the products. Each theme has its own dark version, kept in `tokens/themes/<theme>/dark`, which may only change values of tokens the theme already has. Life Hub's dark mode lays each area's own night layer (half its 900, half ink) over its marble, matched so every area's swirl shows about the same. Storybook has a Light/Dark switch for review.
- **Why:** four looks (two themes, light and dark) without new names for components to learn. Following the device is what people expect and needs nothing to build.
- **Other options:** a switch in each product; one shared dark palette for every theme; neutral charcoal surfaces (lost each area's marble).
- **Details:** [#28](https://github.com/sharonlafleur1984/design-system-skeleton/pull/28)

</details>

<details>
<summary><b>D18 · Oct 6, 2026:</b> Apps install the design system from GitHub, pinned to a version</summary>

- **Decided by:** Sharon
- **Decision:** After Graduation (and later Life Hub) installs this design system straight from GitHub, pinned to a version tag. Updating the design system is a deliberate pull request in the app. Every component is built here first, on React Aria, with a Storybook page; apps only arrange components on a page and own the data.
- **Why:** it builds the same on a laptop, in CI and on Netlify, and an app always knows exactly which version it was built on, which makes the Important Dates rebuild a fair test of the system.
- **Other options:** pointing the app at the folder next door (instant, but only works on one laptop); publishing to npm (a release step for every change, too much while the system changes daily).
- **Sources:** [npm, installing from GitHub](https://docs.npmjs.com/cli/v11/commands/npm-install), [npm prepare script](https://docs.npmjs.com/cli/v11/using-npm/scripts#life-cycle-scripts), [Vite library mode](https://vite.dev/guide/build#library-mode)

</details>

<details>
<summary><b>D17 · Oct 6, 2026:</b> Controls get their own type style; Large buttons are 40px tall</summary>

- **Decided by:** Sharon
- **Decision:** each theme sets a size, line height and weight for Small, Medium and Large controls. For now both themes use the same values: 12 on 16, 14 on 20 and 16 on 24, medium weight. Large buttons are 40px tall instead of 48. Checkbox and Switch labels use Medium.
- **Why:** the fonts already make each product's buttons look different, so different sizes or weights would add difference for its own sake. 48px is a call-to-action size and felt too big as a regular option. 14px button labels with 16px body text is the standard pairing.
- **Other options:** bigger, semibold After Graduation buttons (14 / 16 / 20); a third font just for buttons (breaks the two-families rule); keeping Large at 48.
- **Details:** [#23](https://github.com/sharonlafleur1984/design-system-skeleton/pull/23)
- **Sources:** [Material 3 type scale tokens](https://m3.material.io/styles/typography/type-scale-tokens), [WCAG 2.5.8 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [Apple accessibility guidelines](https://developer.apple.com/design/human-interface-guidelines/accessibility)

</details>

<details>
<summary><b>D16 · Oct 6, 2026:</b> Life Hub follows the same type rule as After Graduation</summary>

- **Decided by:** Sharon
- **Decision:** Life Hub's type follows the Oct 4 After Graduation rule. Sizes follow a modular scale rounded to the 4-point grid, and line heights are ratios picked so size times ratio is a multiple of 4. Life Hub keeps its own fonts and its own sizes within that rule.
- **Why:** both products share one foundation, and each theme picks its own values within it. Code leads and Figma follows, so some of Life Hub's 16 Figma sizes will move to fit the scale.
- **Other options:** keep Life Hub's Figma sizes and snap only line heights to the grid (keeps the Figma match, but makes Life Hub an exception to the shared rule).
- **Note:** Sharon made this call earlier, but it wasn't logged, so a later status note listed it as open.
- **Sources:** [Material 3 type scale tokens](https://m3.material.io/styles/typography/type-scale-tokens), [Carbon type sets](https://carbondesignsystem.com/elements/typography/type-sets/)

</details>

<details>
<summary><b>D15 · Oct 4, 2026:</b> After Graduation's React rebuild uses React Aria Components</summary>

- **Decided by:** Sharon
- **Decision:** interactive components in the After Graduation rebuild (accordion rows, tabs, bottom navigation, dialogs, date pickers) are built on React Aria Components and styled with our tokens. One library everywhere; no mixing.
- **Why:** the planner is built around dates, and some students have an IEP or 504 plan. React Aria handles focus, keyboard and screen reader behavior and tests it with real screen readers every release, including date pickers. AI can write UI fast, but it often misses these basics, and automated tests catch only part of them.
- **Other options:** Base UI (newest, strongest shadcn and AI-prototyping ecosystem, but no date components and focus is left to us); Base UI plus React Aria only for dates (two styles of code); Base UI with dates built ourselves (most code to own, highest accessibility risk). Radix was ruled out: updates slowed after WorkOS bought it.
- **Also decided (Oct 4):** this design system's own components (Button, Checkbox, Switch and Link) move onto React Aria too, so After Graduation uses one library. Life Hub keeps using the tokens; it picks up these components if its dashboard is ever built in React. The solid-glass fallback from [#4](https://github.com/sharonlafleur1984/design-system-skeleton/pull/4) is built into the new versions.
- **Details:** [After Graduation #34](https://github.com/sharonlafleur1984/after-graduation/issues/34)
- **Sources:** [Untitled UI, Base UI vs React Aria](https://www.untitledui.com/blog/base-ui-vs-react-aria), [React Aria AI tools](https://react-aria.adobe.com/ai), [Web4All 2025 on AI-generated UI](https://dl.acm.org/doi/10.1145/3800424.3800430)

</details>

<details>
<summary><b>D14 · Oct 4, 2026:</b> After Graduation page shell: the page is a sheet rising out of the header</summary>

- **Decided by:** Sharon
- **Decision:** the header runs edge to edge and the page is a sheet that rises over its bottom edge. On desktop the sheet sits 16px in from the screen sides, so the header's red frames the page all the way down. On tablet and phone the sheet runs edge to edge.
- **Why:** the header card floated on its own and didn't feel connected to the page. On wide screens the content is capped at 920px, so the frame uses space that was empty anyway; on narrow screens a frame would squeeze the content.
- **Tokens (After Graduation only):** `shell.sheet-inset` 0 / 0 / 16, `shell.sheet-overlap` 24 / 32 / 40, `shell.sheet-radius` (radius-panel), `shell.frame`. All spacing is on the space scale, checked by a test.
- **Other options:** keep the floating card and let its light spill onto the page (subtler, but the header still floats); a sheet with the frame on every screen size.

</details>

<details>
<summary><b>D13 · Oct 4, 2026:</b> After Graduation type: a real scale, Cinzel title, Atkinson Hyperlegible Next</summary>

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
<summary><b>D12 · Oct 4, 2026:</b> After Graduation uses glass for controls on artwork</summary>

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
<summary><b>D11 · Oct 4, 2026:</b> Big spaces shrink to about two thirds on phones; new layout-title-gap</summary>

- **Decided by:** Sharon
- **Decision:** the rule for responsive tokens: the bigger something is, the more it shrinks on a phone, to about two thirds of desktop. Page edges, section spacing and big headings change by screen class. Body text, small headings and spacing inside components never do. `layout-section` is now 24 / 32 / 40px (was 32 / 48 / 64; Sharon then took it one step smaller than the first proposal, 32 / 40 / 48, because it felt like too much space). Every layout value must be a step on the space scale, checked by a test. New `layout-title-gap` is the space under a page title: 16 / 20 / 24px.
- **Why:** Chase's site had made-up spacing that was the same on phone and desktop, and there was no token for the space under a page title.
- **Sources:** [GOV.UK spacing](https://design-system.service.gov.uk/styles/spacing), [GOV.UK type scale](https://design-system.service.gov.uk/styles/type-scale), [Carbon type sets](https://carbondesignsystem.com/elements/typography/type-sets/), [Material window size classes (SAP Fiori)](https://www.sap.com/design-system/fiori-design-android/foundations/layout)

</details>

<details>
<summary><b>D10 · Oct 3, 2026:</b> Label styles named by purpose: label and label-meta</summary>

- **Decided by:** Sharon
- **Decision:** `label-caps` is renamed `label` (introduces a section, like NEXT STEPS). New `label-meta` describes an item: every date and short piece of metadata, in capitals, gray, at a new light weight (300), one step lighter than body text. Never below 300. `label-banner` is removed: it did the same job as `label` and nothing used it. Styles are named by what they're for, not how they look. Pick a style, never a weight: a test fails if a component sets a raw font weight.
- **Why:** dates were using the bold section-label style, so they competed with the task name. "caps" described a look that every label shares.
- **Other options:** `label-caps` and `label-caps-meta`; dates in `data-small` (sentence case, no new style).
- **Figma:** rename "Label/Caps" to "Label" and remove "Label/Banner" in the Life Hub library next time it's open.
<summary><b>D9 · Oct 3, 2026:</b> Two link levels, set in the skeleton, colored by each theme</summary>

- **Decided by:** Sharon
- **Decision:** links have two levels. Inline: inside a sentence, at its size. Quiet: side trips and small controls (View task, Show full year, sources), one step smaller and gray. The skeleton sets the names, underline and behavior; each theme sets colors and the quiet size. Links never bold. Page actions that look like links (Show full year) are buttons: `LinkButton`.
- **Why:** Chase's site had grown 4 link styles, and the least important link (View task) was the loudest. The design system had no link style because the Life Hub Figma library didn't have one.
- **Other options:** links as a typography style only, with no component (loses focus, tap area and the link-or-button rule).

</details>

<details>
<summary><b>D8 · Oct 3, 2026:</b> Storybook is the source of truth, guarded by a token lock and visual tests</summary>

- **Decided by:** Sharon
- **Decision:** Figma is for ideas; the exact rules live in code and Storybook. Two checks guard against drift: a token lock (every token value saved in the repo, any change shown and approved in the pull request) and visual tests (every story screenshotted at phone, tablet and desktop, compared with approved screenshots). The Life Hub Figma export test is retired; the token lock replaces it and covers both themes.
- **Why:** the Figma test only covered Life Hub, and checked a frozen export instead of the system itself. After Graduation had no guard at all.
- **Other options:** Chromatic for visual tests (nicer review screen, but another account to manage).
- **Replaces:** Sep 26, "Life Hub's Figma library doesn't change." Figma now follows the code.

</details>

<details>
<summary><b>D7 · Oct 3, 2026:</b> Each theme sets its own text sizes, and headings shrink on phones</summary>

- **Decided by:** Sharon
- **Decision:** text sizes move from the shared base into each theme. Life Hub keeps its 16 Figma sizes. After Graduation gets sizes measured from its site (biggest is 48px, not 112px). Display and title sizes, plus page gutter and section spacing, get phone, tablet and desktop values using Material 3 screen classes (under 600px, 600 to 839px, 840px and up). Text sizes and spacing are written in rem so they grow with the reader's own text-size setting.
- **Also for After Graduation:** display styles use regular weight, line height 1.15 to 1.25 and no negative letter spacing. Mochiy Pop One has one weight and tall letters, so weight 600 was a fake bold and line height 1.02 made lines collide.
- **Why:** After Graduation was borrowing Life Hub's much larger sizes, and desktop-sized headings were using up phone screens.
- **Other options:** fluid sizing with CSS clamp (smoother, but harder to show in Storybook and Figma); cutting the scale to 12 styles (would break the Life Hub Figma match).
- **Details:** [Material 3 window size classes](https://m3.material.io/foundations/layout/applying-layout/window-size-classes)

</details>

<details>
<summary><b>D6 · Sep 27, 2026:</b> Life Hub glass is for controls only</summary>

- **Decided by:** Sharon
- **Decision:** liquid glass goes on controls: buttons, the top bar, navigation and pills. Content cards and callouts stay solid or lightly translucent, with no blur, so there is never glass on glass. After Graduation stays solid everywhere (updated Oct 4: glass for controls on artwork).
- **Why:** closest to Apple's Liquid Glass guidance (glass is the layer that floats above content) and easiest to read.
- **Other options:** glass everywhere as in the Figma file, with a solid fallback; or both.
- **Sources:** [Meet Liquid Glass, WWDC25](https://developer.apple.com/videos/play/wwdc2025/219/), [CSS-Tricks](https://css-tricks.com/getting-clarity-on-apples-liquid-glass/)

</details>

<details>
<summary><b>D5 · Sep 26, 2026:</b> After Graduation is quiet by default: color only communicates</summary>

- **Decided by:** Sharon
- **Decision:** neutral screens. Cherry red (#d03656; crimson #cb1b2c since Oct 7) marks the one next step: the main button, the current step, focus. Gold marks a real win. Status colors mean status, always with an icon and a label. Everything else is neutral. Paths and categories use icons and labels, not colors. Cards sit on shadows instead of borders.
- **Why:** the product already has lots of graphics, so the system stays simple. The prototype had 98 colors, and a screen with seven colors gave no clear place to look.
- **How it was chosen:** 6 color directions built with color theory (OKLCH ramps, contrast checked). The race-car red stayed, softened toward cherry for an anime feel, which also moves it a little further from the error red.
- **Other options:** red with teal, sky, mint or lavender support colors; berry and indigo; a teal-led palette.

</details>

<details>
<summary><b>D4 · Sep 26, 2026:</b> Life Hub's Figma library doesn't change</summary>

- **Decided by:** Sharon
- **Decision:** the Life Hub theme matches the Figma library exactly: all 112 colors including Sunflower Medley, every semantic mapping, spacing, radius, and all 16 text styles under their Figma names. A test checks this on every pull request.
- **Why:** the first version dropped Sunflower Medley and two text styles, renamed the text styles, and mapped one area accent wrong. The test caught the last one.

</details>

<details>
<summary><b>D3 · Sep 26, 2026:</b> Code is the source of truth for tokens</summary>

- **Decided by:** Sharon
- **Decision:** tokens live in code. Figma follows the code.
- **Why:** two of the three products are built in code, and After Graduation has no Figma file.
- **Other options:** Figma as the source, synced into code.

</details>

<details>
<summary><b>D2 · Sep 26, 2026:</b> One shared base, a theme for each product, in its own repo</summary>

- **Decided by:** Sharon
- **Decision:** a shared base (structure, naming, scales, status colors, accessibility) with a theme per product, in its own repo. (Updated Oct 7: status colors moved to each theme; the base keeps their names and rules.)
- **Why:** three products will use it (Life Hub, After Graduation, a designer toolkit), and Life Hub needs it soon. Life Hub's Figma library already had the structure Sharon wants.
- **Other options:** start inside After Graduation and move it later; separate systems per product.

</details>

<details>
<summary><b>D1 · Sep 26, 2026:</b> Structure taken from the Life Hub Library</summary>

- **Decided by:** Sharon
- **Decision:** the base copies the Life Hub Library's structure: a 4-point spacing scale, radius by purpose, ink, surface, border and accent names, one status set (updated Oct 7: one set of status names; each theme picks the values), and the type roles (display, heading, body, label, data).
- **Why:** it's already set up the way Sharon wants a design system organized. Only the look changes per product.

</details>
