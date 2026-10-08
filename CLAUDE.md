# CLAUDE.md

Start here. This file tells Claude (and any developer) where everything lives, so only the needed file gets opened.

## What this is

Design system: one shared base (structure, naming, scales, status names and rules, accessibility) with a theme for each of Sharon's products (Life Hub, After Graduation, and later a designer toolkit).

## Rules

- **How I work:** follow [how-i-work](https://github.com/sharonlafleur1984/how-i-work) for the process and skills.
- **Public repo.** Tokens and components only. No personal data.
- **Every fact needs a source link,** or a label saying it's an estimate.
- **Ask before changing or deleting anything.** A recommendation is not approval.
- **Wiki pages are edited in `docs/wiki/`,** never in the GitHub Wiki tab.
- **Code and Storybook are the source of truth.** Figma is for ideas and follows the code. A token change must update the token lock (`npm run test:update`); a visual change needs the `update-screenshots` label. Both are reviewed in the pull request.
- **Base or theme?** A value every product shares goes in `tokens/base/`. A product's look goes in `tokens/themes/<product>/`. A new shared name must be added to every theme, or the contract test fails.
- **Never color alone:** status colors always come with an icon or a label.
- **Status colors:** the names and rules are shared; each theme picks its own values in `tokens/themes/<product>/status.json`.

## Where everything is

Start with [`docs/wiki/Documents.md`](docs/wiki/Documents.md): every document in this repo and when to open it. When you add or remove a document, update its row there and in the private Notion index in the same pass.

## Skills to use

- `product-manager` for roadmap, backlog and status
- `product-designer` for design, token decisions and the component library
- `ux-writer` for any words people will read
- `product-engineer` for any code work
- `working-with-sharon` for how to write to Sharon

## AI tools for component work

Interactive components are built on [React Aria Components](https://react-aria.adobe.com/) and styled with our tokens only (see Decisions, Oct 4). Adobe's React Aria skill lives in `.claude/skills/react-aria` (refresh it with `npx skills update`). Two helpers are set up in `.mcp.json` (an MCP server is a plug-in that gives an AI agent extra tools):

- **react-aria:** looks up React Aria's docs and examples. Check it before building or changing an interactive component.
- **storybook:** reads this Storybook and writes and tests stories. It only works while `npm run storybook` is running.

## Outside the repo (private)

- Life Hub's original design: [Figma, Life Hub Library](https://www.figma.com/design/gVTJl0ARMijPyuMpeprg5c/Life-Hub-Library)
- Project entry: Notion, Projects, "Design system"
