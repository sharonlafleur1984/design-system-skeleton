# Changelog

What changed in each version, newest first. Apps pin a version, so this is how they know what an update brings. Every release pull request adds its version here.

Versions follow [semantic versioning](https://semver.org/): before 1.0, a minor version (0.4.0) can rename things, and the old names keep working as deprecated aliases for at least one version.

## Unreleased

### Renamed (old names still work, marked deprecated)

- **Components use React Aria's names:** Chip is Tag, Segmented control is ToggleButtonGroup, Divider is Separator (now built on React Aria's Separator), ProgressMeter is ProgressBar (now built on React Aria's ProgressBar).
- **Callout tones** are info, warning, success, error and neutral. due, settled, overdue and quiet still work.
- **Props:** `isDisabled`, `isSelected`, `defaultSelected` and `isPending` replace `disabled`, `checked`, `defaultChecked` and `loading`.
- **Page shell:** `material` replaces `glassLens`.

### Added

- **Action tile in every theme:** a `fill` prop (card, raised, sunken, accent, inverse), soft-light states (focus is a glow; chosen shows the theme's mark, or `chosenIcon`, and Glass turns milky), and Glass that follows the page's light on a plain background. Tiles default to `material="default"`, except on the page shell header, where they're Glass.
- **`clearArt`** (experimental): lens glass on a background the system doesn't paint.
- **Glass card for empty states:** a card holding only an empty state can be `material="glass"`; it goes back to `default` once it has content.
- **Glass light:** edges facing a neighbor catch less light, edges away from the light take the surroundings' colors, chosen (milky) tiles cast fuller shadows, daylight highlights are warm, and shadows take the color of the surface they fall on.
- **Fireside**, the designer toolkit's theme: always dark, in Retro's colors.
- **Theme names:** Spotlight (After Graduation), Sunrise (Life Hub), Fireside (designer toolkit).
- **Materials:** a `material` prop, `default` or `glass`, on Button (glass style), Action tile, Card, Tag, Toggle button group and Page shell.
- **Select:** a visible `label`.
- **Focus ring tokens** (`focus.ring.*`) in the base.
- **Fonts for every theme** at `fonts/<theme>.css`.
- **Releases** attach a ready-built package file, so apps don't download the whole repo or its build tools.

### Changed

- Error callouts have their own symbol (×), so they never differ from warnings by color alone.
- **Glass tiles with Reduce transparency or Increase contrast** turn solid, with a line and the mark on a chosen tile. Before, they had no fill when the lens was off.
- A theme can't set spacing, sizes or corners; they always come from the base.

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
