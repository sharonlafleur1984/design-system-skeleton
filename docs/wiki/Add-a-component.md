# Add a component

**Last updated:** October 14, 2026

A component is one folder in `src/components/`. Each theme restyles it through tokens, so it's built once.

## Before you start

- **Is it in React Aria?** Check the [React Aria components](https://react-aria.adobe.com/) (or the `react-aria` MCP helper). If it's there, build on it and use its name and prop names (`isDisabled`, `isSelected`), even if Figma calls it something else.
- **Is it shared?** A component every product could use goes here. One product's screen stays in that product's repo.

## Steps

1. **Make the folder.** `src/components/<name>/` with three files, named in kebab case:
   - `<name>.tsx`: the component
   - `<name>.css`: its styles
   - `<name>.stories.tsx`: its Storybook page
2. **Build it.** Wrap the React Aria component, add a `ds-<name>` class, and import the CSS file. Separator is the smallest example to copy.
3. **Style it with tokens only.** Every color, size, weight and shadow is a `var(--token)`. The tests fail on raw values (1px and 2px hairlines are allowed), on a `var()` that isn't a token, and on screen-size breakpoints other than the shared ones in `breakpoints.ts`. Focus rings use `--focus-ring-*`. Status colors always come with an icon or a label.
4. **Can it be glass?** Give it an `appearance` prop (`'solid' | 'glass'`) and use `resolveAppearance` and `lensClass` from `material.ts`.
5. **Export it.** Add the component and its props type to `src/components/index.ts`. That's what the package ships.
6. **Write the stories.** Title `Components/<Name>`, with `tags: ['autodocs']` and a description that covers:
   - what it is, and which React Aria component it's built on
   - **When to use** and **When not to**
   - **Accessibility:** what screen readers hear and which keys work

   Start with a `Playground`, then one story per variant or state. Use plain labels ("Button", "Label", "Option 1"), never one product's copy ([voice](../../blob/main/docs/voice.md)). Wrap variants in `BothThemes` from `story-helpers.tsx` so every theme shows side by side.
7. **Test it.** Add a `describe` block to `tests/components.test.tsx`: its role and name, its keyboard behavior, and no axe errors.
8. **Check it.** Run `npm test`, `npm run typecheck` and `npm run lint`, then look at it in every theme in `npm run storybook`.
9. **Open a pull request.** Add the `update-screenshots` label so its stories get screenshots in every theme. Add the component to the [Changelog](../../blob/main/CHANGELOG.md) under Unreleased.

## Renaming a component

Keep the old name as a deprecated alias, so apps keep working until they move:

```ts
/** @deprecated Renamed to Separator, React Aria's name. Kept so existing apps keep working. */
export const Divider = Separator;
```

Export the alias from `index.ts` too, and list the rename in the Changelog.

## Related

- [How it fits together](Architecture)
- [Decisions](Decisions)
