# Design system: Dashboard

**Last updated:** September 26, 2026

One design system for all of Sharon's products: a shared base, with a theme for each product.

**Hypothesis:** Sharon's products can each keep their own look while sharing one base, so they're faster to build, consistent, and accessible by default.

**Problem to solve:** each product defines its own colors, spacing and type, so a fix in one never reaches the others. The After Graduation prototype alone has 98 hex colors in its CSS.

**What does success look like?** All three products use the base, a fix to the base reaches every product, and every theme passes the contrast checks automatically.

## At a glance

| | |
|---|---|
| **Where we are** | Tokens for two themes and Storybook pages to compare them. No components yet. |
| **Themes** | Life Hub, After Graduation. The designer toolkit comes later. |
| **Next milestone** | Themes reviewed (aiming for Oct 2026) |

Where we're going: [Roadmap](Roadmap). Why things were decided: [Decisions](Decisions). Every task: [Issues](https://github.com/sharonlafleur1984/design-system-skeleton/issues).

## Needs your decision

<details>
<summary><b>After Graduation colors to merge.</b> The prototype has 98 hex colors in its CSS; the theme uses 26.</summary>

- **5 reds** (#C8202E, #E0203A, #FF3B55, #D63A48, #B00020). The theme keeps #C8202E as the main accent, #E0203A for highlights, and #8A1420 for hover. The other three still need a home or should be cut.
- **Muted and disabled text are the same color** (#C9AAB0). Life Hub uses two. One more step is needed if disabled should look different.
- **The accent is red, and so is "error."** Errors will always carry an icon and a label, never color alone. Worth a look on real screens.
- **Shadows:** the prototype has two. "Hover" copies "rest" for now.
- **Fonts:** the prototype loads Lexend at 300, 400 and 600. The base uses 500 for subheadings, so 500 needs to be added. There's no data font yet; it uses Lexend.

</details>

## Links

| What | Link |
|---|---|
| Code repository | [sharonlafleur1984/design-system-skeleton](https://github.com/sharonlafleur1984/design-system-skeleton) |
| Life Hub's original design (private) | [Figma, Life Hub Library](https://www.figma.com/design/gVTJl0ARMijPyuMpeprg5c/Life-Hub-Library) |
| Storybook | Not published yet. Run `npm run storybook`. |
