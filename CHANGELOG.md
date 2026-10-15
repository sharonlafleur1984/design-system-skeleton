# Changelog

What changed in each version, newest first. Apps pin a version, so this is how they know what an update brings. Every release pull request adds its version here.

Versions follow [semantic versioning](https://semver.org/): before 1.0, a minor version (0.4.0) can rename things, and the old names keep working as deprecated aliases for at least one version.

## Unreleased

### Renamed (old names still work, marked deprecated)

- **Components use React Aria's names:** Chip is Tag, Segmented control is ToggleButtonGroup, Divider is Separator (now built on React Aria's Separator), ProgressMeter is ProgressBar (now built on React Aria's ProgressBar).
- **Callout tones** are info, warning, success, error and neutral. due, settled, overdue and quiet still work.
- **Props:** `isDisabled`, `isSelected`, `defaultSelected` and `isPending` replace `disabled`, `checked`, `defaultChecked` and `loading`.
- **Solid and Glass:** `appearance` (`solid` or `glass`) replaces `material` (`default` or `glass`) on Action tile, Card, Tag, Toggle button group and Page shell, and replaces Page shell's `glassLens`. Button's glass style is always real glass now.

### Added

- **Orb:** the light you drag when exploring glass, a glowing glass marble in the theme's color (`Orb`, `ORB_START`, tokens `--orb-*`). In Sunrise, `palette` sets an area's color family. `size` is small (16px), medium (32px) or large (48px), and `look` is glow (the default, lit from inside), tinted (glass in the page's color) or clear (colorless, like a bubble). It's drawn with three.js, now a dependency apps install alongside React.
- **Storybook: every part has a page.** The component page is a story now, so Controls, Actions, Interactions and Accessibility work on it. Every planned part has a page with its status (Ready, Pending, On hold or Not started), so the sidebar shows the whole library.
- **Fireside**, the designer toolkit's theme: always dark, in Retro's colors.
- **Theme names:** Spotlight (After Graduation), Sunrise (Life Hub), Fireside (designer toolkit).
- **Card, rebuilt:** a surface with the action tile's look, Solid or Glass, never pressable. Parts with their type set by role: `CardHeader` (icon, label and title), `CardBody` and `CardFooter` (buttons and a `note`).
- **Tile:** a whole tile that's a link (`href`) or button (`onPress`), with an icon, title and description.
- **Icon tile:** an icon in a tile, `filled` or `plain`, in four sizes. Card, Tile and Action tile headers take one at the top or the start (`iconPosition`).
- **Text parts:** `Heading`, `Body`, `Label` and `Note`, each in the theme's type style.
- **Motion:** overlays open and close (`--motion-open-duration`, `--motion-open-scale`, `--motion-close-duration`), a leaving curve (`--motion-easing-in`), views fade in when they switch (`--motion-switch-duration`), and a spinner speed (`--motion-spin-duration`). Select's menu and the Settings dialog now animate out as well as in.
- **Roundness per theme:** `shape.roundness`, Square (Fireside), Standard (Sunrise) or Round (Spotlight). Every radius is worked out from it and the part's size, so a part keeps its shape at every size. Use `--radius-small`, `--radius-medium`, `--radius-large`, `--radius-box`, `--radius-card` and `--radius-panel`.
- **Action tile in every theme:** navigation that switches the page's content, like tabs, with soft-light states (focus is a glow; chosen shows the theme's mark, or `chosenIcon`, and Glass turns milky) and Glass that follows the page's light on a plain background. In the page shell header tiles start as Glass.
- **One light per page** (experimental): mark an element `data-glass-light` (`PAGE_LIGHT`) and every glass around it is lit from it; fire `LIGHT_CHANGE` after moving it. Both are exported.
- **`clearArt`** (experimental): lens glass on a background the system doesn't paint.
- **Glass light:** edges facing a neighbor catch less light, edges away from the light take the surroundings' colors, chosen (milky) tiles are one even layer with a fuller shadow, daylight highlights are warm, shadows take the color of the surface they fall on, and every change glides (off with reduced motion).
- **Select:** a visible `label`.
- **Focus ring tokens** (`focus.ring.*`) in the base.
- **Fonts for every theme** at `fonts/<theme>.css`.
- **Releases** attach a ready-built package file, so apps don't download the whole repo or its build tools.

### Changed

- **Every component's Docs page uses one template** (D52): what it does, when to use it, examples, do and don't, accessibility, then props, tokens and import for engineers. Controls give every setting a plain name and say what it does.
- **Foundations, Space, radius and shadow:** the Corners story is called Radius, like the page and the tokens. The Shadow story shows a solid and a glass card under the page's light (drag the sun to move it), and says what uses each shadow token.
- Error callouts have their own symbol (×), so they never differ from warnings by color alone.
- **Switch:** a narrower track (40px, was 44px) and a smaller knob (16px, was 18px) with the same 3px gap on every side.
- A theme can't set spacing or sizes; they always come from the base. It picks its roundness by name.
- **Card:** opaque, translucent and transparent are gone; `variant` and `interactive` are ignored. Cards are Solid or Glass.
- **Action tile:** for navigation only. Fills are gone (`fill` is ignored: every Solid tile uses the card surface). Tiles with `href` or `onPress` still work but are deprecated: use Tile.
- **Glass with Reduce transparency or Increase contrast** turns solid with almost no edge, and a chosen tile shows a line and its mark. Increase contrast also drops the shadows.

### Removed

- The fixed radius tokens `radius-control`, `radius-button`, `radius-chip`, `shell-sheet-radius` and the old fixed `radius-card` and `radius-panel`: use the worked-out `--radius-*` values instead.

### Experimental

These may change in any version, even a patch: `useGlassLight`, `imageArt`, `shellArt` and `LensOptions` (the glass light and lens code). See [issue #60](https://github.com/sharonlafleur1984/design-system-skeleton/issues/60).

## 0.3.0: October 7, 2026

- **Tabs** and **Segmented control** on React Aria.
- **Chip** on React Aria's TagGroup.
- **Checkbox, Switch and Link** moved onto React Aria.
- **Life Hub:** glass cards, warm neutral buttons, Fraunces and Figtree, the other nine marble textures, and dark mode.
- **After Graduation:** dark mode in warm charcoal.
- **Controls** get their own type style; Large buttons are 40px tall.

## 0.2.0: October 6, 2026

The first version apps could install: the components, the base styles, one CSS file per theme and the fonts.
