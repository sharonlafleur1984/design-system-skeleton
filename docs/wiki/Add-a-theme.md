# Add a theme

**Last updated:** October 14, 2026

A theme is one folder. Storybook, the docs pages, the tests and the package all find it on their own.

## Steps

1. **Copy a theme folder.** Copy the closest one in `tokens/themes/` and name the copy after the product, like `tokens/themes/voyager`. The folder's name is the theme's id.
2. **Name it.** Edit `theme.json` in the new folder:
   ```json
   { "name": "Starlight", "product": "Voyager", "order": 4, "alwaysDark": false }
   ```
   `name` is what people see in Storybook's Theme picker. `order` is its place in that list. `defaultMode` is optional and defaults to `light`.
3. **Change the look, not the space.** Change colors, type, motion and art in the theme's files, and pick the roundness in `shape.json`: `square`, `standard` or `round`. Spacing and sizes stay in `tokens/base/`; a test fails if a theme sets them.
4. **Dark mode.** Put dark values in a `dark/` folder inside the theme, only for names the theme already has. Set `defaultMode` to `dark` when dark is the theme's starting mode. A theme that's always dark has no `dark/` folder; set `"alwaysDark": true`. A theme that's mostly dark can still have a light mode for one part: Fireside's `dark/` folder changes only its work area ([D61](Decisions.md)).
5. **Fonts.** Add `src/fonts/<id>.css`, listing only the weights the type tokens use.
6. **Build and test.** Run `npm run test:update`. It builds the tokens, records the new theme's values in the token lock, and runs every check:
   - every shared token name is defined
   - text passes 4.5:1 contrast, in light and dark
   - no token is set twice in the theme
   - spacing is left to the base
7. **Look at it.** Run `npm run storybook`, then pick the new theme in the theme picker above any story.
8. **Write it up.** Add the theme to [Themes](Themes) and add a decision to [Decisions](Decisions).
9. **Open a pull request** and add the `update-screenshots` label, so every story gets screenshots in the new theme.

## What finds the new theme on its own

- The token build (`scripts/build-tokens.mjs`) builds every folder and writes `build/themes.json`.
- Storybook's Theme picker and the side-by-side view read `build/themes.json`.
- The Foundations pages and the visual tests read the built tokens and `build/themes.json`.
- The package serves its tokens at `themes/<id>.css` and its fonts at `fonts/<id>.css`.
