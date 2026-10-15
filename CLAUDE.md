# CLAUDE.md

Start here. This file tells Claude (and any developer) where everything lives, so only the needed file gets opened.

## What this is

Design system: one shared base (structure, naming, scales, status names and rules, accessibility) with a theme for each of Sharon's products: Spotlight (After Graduation), Sunrise (Life Hub) and Fireside (the designer toolkit). What makes each theme: [`docs/wiki/Themes.md`](docs/wiki/Themes.md).

## Rules

- **How I work:** follow [how-i-work](https://github.com/sharonlafleur1984/how-i-work) for the process and skills.
- **Public repo.** Tokens and components only. No personal data.
- **Every fact needs a source link,** or a label saying it's an estimate.
- **Ask before changing or deleting anything.** A recommendation is not approval.
- **Wiki pages are edited in `docs/wiki/`,** never in the GitHub Wiki tab.
- **Changing a Netlify site, its `netlify.toml`, or Supabase?** Update [How everything connects](https://github.com/sharonlafleur1984/designer-toolkit/wiki/Connections) in a pull request at the same time.
- **Every commit names its Claude session.** End each commit message with `Claude-Session:` and the link to the session that made it, so any branch can be traced back to where the work happened.
- **Main is protected.** Changes reach main only through a pull request ([cheat sheet](https://github.com/sharonlafleur1984/how-i-work/blob/main/templates/github-ruleset.md)). Remind Sharon if the "Protect main" ruleset is ever missing.
- **Finish with a pull request.** Pushed work always gets one, even when it's small. A branch with no pull request looks abandoned.
- **Code and Storybook are the source of truth.** Figma is for ideas and follows the code. A token change must update the token lock (`npm run test:update`); a visual change needs its screenshots approved (the "Approve the new screenshots" box in the pull request, or the `update-screenshots` label). Both are reviewed in the pull request.
- **Decisions update Storybook in the same pull request.** When a decision changes how something looks or works, update its Storybook docs (component descriptions, Foundations pages, story notes) in the same pull request, and list what changed in the pull request description. If docs keep getting missed anyway, add a test that fails when a decision names a component or token whose Storybook docs weren't touched.
- **One word: theme.** Never "skin." Each theme is named for a kind of light.
- **Base or theme?** A value every product shares goes in `tokens/base/`. A product's look (color, type, motion, art, roundness) goes in `tokens/themes/<product>/`. Spacing and sizes always stay in the base; a test fails if a theme sets them. Radius: a theme picks its roundness by name (Square, Standard or Round), and every radius is worked out from it and the part's size (D49). A new shared name must be added to every theme, or the contract test fails.
- **Adding a theme is one folder.** Follow [`docs/wiki/Add-a-theme.md`](docs/wiki/Add-a-theme.md). Never type a theme's name into code; read `build/themes.json`.
- **React Aria's names.** Components and props use React Aria's names where one exists (Tag, ToggleButtonGroup, `isDisabled`). Old names stay as deprecated aliases until apps have moved off them.
- **Every component's Docs page uses the template** (D52): fill in its `<name>.page.tsx`, never a free-form description.
- **Plain labels in stories.** Component stories say "Button" and "Label," never one product's copy.
- **Never color alone:** status colors always come with an icon or a label.
- **Status colors:** the names and rules are shared; each theme picks its own values in `tokens/themes/<product>/status.json`.

## Where everything is

Start with [`docs/wiki/Documents.md`](docs/wiki/Documents.md): every document in this repo and when to open it. When you add or remove a document, update its row there and in the private Notion index in the same pass.

## Skills to use

- `product-manager` for roadmap, backlog and status
- `product-designer` for design, token decisions and the component library
- `ux-writer` for any words people will read, with [`docs/voice.md`](docs/voice.md) for this project's voice
- `product-engineer` for any code work
- `working-with-sharon` for how to write to Sharon

## AI tools for component work

Interactive components are built on [React Aria Components](https://react-aria.adobe.com/) and styled with our tokens only (see Decisions, Oct 4). Adobe's React Aria skill lives in `.claude/skills/react-aria` (refresh it with `npx skills update`). Two helpers are set up in `.mcp.json` (an MCP server is a plug-in that gives an AI agent extra tools):

- **react-aria:** looks up React Aria's docs and examples. Check it before building or changing an interactive component.
- **storybook:** reads this Storybook and writes and tests stories. It only works while `npm run storybook` is running.

## Lantern, the design system in Claude

Lantern is this design system as a Claude artifact (Design System type), so designs and decks in Claude can use it: https://claude.ai/artifact/WbvH4oqmtQUZcGJyL5XR6J (private; Sharon shares it). The code stays the source of truth:

- `npm run lantern` builds its files from this repo into `lantern/project/` (git-ignored); Claude publishes that folder to the artifact. Rebuild after any change to tokens, a component or a page's words.
- A change made in Lantern goes back here as a pull request, never only into the artifact.

## Outside the repo (private)

- Life Hub's original design: [Figma, Life Hub Library](https://www.figma.com/design/gVTJl0ARMijPyuMpeprg5c/Life-Hub-Library)
- Project entry: Notion, Projects, "Design system"
