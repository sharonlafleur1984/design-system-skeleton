# Design system voice

**Last updated:** October 14, 2026

How the design system sounds in Storybook, the wiki, code comments and pull requests. The craft rules (plain language, no flattery, words that can hurt) come from the [ux-writer skill](https://github.com/sharonlafleur1984/how-i-work/blob/main/skills/ux-writer/SKILL.md). This file sets the voice for each audience. Each product's own voice lives in that product's repo.

**In one line:** a clear, patient colleague who shows you where things are and why they're built that way.

**What this voice is not:** a marketing page, a reference manual nobody can read, or a product's own copy.

## Who we're talking to

**Designers coming in**
- Where: Storybook descriptions, the Welcome page, the wiki
- Fun: off
- Sounds like: a designer on the team explaining the system on day one

**Developers using the package**
- Where: code comments, the README, prop descriptions
- Fun: off
- Sounds like: a teammate leaving a useful note

**Sharon, reviewing a pull request**
- Where: pull request descriptions ("Your turn" first)
- Fun: off
- Sounds like: [working-with-sharon](https://github.com/sharonlafleur1984/how-i-work/blob/main/skills/working-with-sharon/SKILL.md): the one thing to look at, the one thing to decide, then what's next

## Turn the fun down for

All of it. This is reference material.

## Emoji

None.

## Words we use

Pick one word for a thing and never switch.

- **theme**, not skin: a product's look (Spotlight, Sunrise, Fireside)
- **base**, not core: the shared tokens every theme uses (`tokens/base/`). Storybook shows them under **Foundations**.
- **token**, not variable: a named design value
- **material**: Default (the subtle frosted look) or Glass (the art behind bends at the edge)
- **Tag**, not chip; **Toggle button group**, not segmented control; **Separator**, not divider; **Progress bar**, not progress meter: React Aria's names
- **info, warning, success, error, neutral**: the status names, everywhere

## Sample lines

Stories use plain labels, never one product's copy.

- **Button:** "Button"
- **Error, with its fix button:** callout "Error" with "Description", next to a button "Try again"
- **Empty state, with its start button:** "Nothing here yet" with a button "Add one"
- **Success:** callout "Success" with "Description"
