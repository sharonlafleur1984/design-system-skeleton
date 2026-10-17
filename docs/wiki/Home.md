# Design system: Dashboard

**Last updated:** October 14, 2026

One design system for all of Sharon's products: a shared base, with a theme for each product.

**Hypothesis:** Sharon's products can each keep their own look while sharing one base, so they're faster to build, consistent, and accessible by default.

**Problem to solve:** each product defines its own colors, spacing and type, so a fix in one never reaches the others. The After Graduation prototype alone has 98 hex colors in its CSS.

**What does success look like?** All three products use the base, a fix to the base reaches every product, and every theme passes the contrast checks automatically.

## At a glance

| | |
|---|---|
| **Where we are** | [Storybook is live](https://designsystemskeleton.netlify.app/) with 14 components (Select is new; four now use React Aria's names) and a Settings pattern, built on React Aria. After Graduation uses the system ([pinned to v0.2.0](https://github.com/sharonlafleur1984/after-graduation/blob/main/package.json)). Life Hub doesn't use it yet. From v0.4.0, apps install a small release file instead of the whole repo. |
| **Themes** | Spotlight (After Graduation), Sunrise (Life Hub) and Fireside (the designer toolkit, always dark). What makes each one: [Themes](Themes). |
| **Next up** | What After Graduation's pages need next: a [phone bottom bar](https://github.com/sharonlafleur1984/lantern-design-system/issues/41), an [icon set](https://github.com/sharonlafleur1984/lantern-design-system/issues/40) and a [settings menu](https://github.com/sharonlafleur1984/lantern-design-system/issues/42). No dates set. |

Where we're going: [Roadmap](Roadmap). Why things were decided: [Decisions](Decisions). Every task: [Issues](https://github.com/sharonlafleur1984/lantern-design-system/issues).

## Needs your decision

- **Fireside's font:** Fireside uses After Graduation's fonts until you pick one.
- **A header for every theme:** a proposal is coming, built from Spotlight's page shell, the Sunrise sky header and the Fireside toolbar.
- **Tag v0.3.0:** the tag was never created. It goes on the commit that bumped the version, so apps can pin it.

## Links

| What | Link |
|---|---|
| Code repository | [sharonlafleur1984/lantern-design-system](https://github.com/sharonlafleur1984/lantern-design-system) |
| Life Hub's original design (private) | [Figma, Life Hub Library](https://www.figma.com/design/gVTJl0ARMijPyuMpeprg5c/Life-Hub-Library) |
| Storybook | [designsystemskeleton.netlify.app](https://designsystemskeleton.netlify.app/) |
