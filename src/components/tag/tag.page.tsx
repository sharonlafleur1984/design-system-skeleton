import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { DocLink, docsPath } from '../../../.storybook/component-page';
import { Tag, TagGroup } from './tag';

// Storybook only: what Tag's Docs page says (the component page template).
export const tagPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Filters a list, picks from a short set, or shows tags someone can remove.',
  reactAria: { name: 'TagGroup', href: 'https://react-aria.adobe.com/TagGroup' },
  status: 'ready',
  useFor: ['Filtering a list, like Unread.', 'Picking one or more options from a short set, or showing tags someone can remove.'],
  useElse: [
    <>
      An action: use <DocLink href={docsPath('Components/Button')}>Button</DocLink>.
    </>,
    <>
      More than eight options: use <DocLink href={docsPath('Components/Select')}>Select</DocLink>.
    </>,
  ],
  do: {
    example: (
      <TagGroup label="Label" selectionMode="multiple" defaultSelectedKeys={['1']}>
        <Tag id="1">Tag 1</Tag>
        <Tag id="2">Tag 2</Tag>
        <Tag id="3">Tag 3</Tag>
      </TagGroup>
    ),
    text: 'Keep labels to one or two words, and give the group a label.',
  },
  dont: {
    example: (
      <TagGroup aria-label="Label" selectionMode="multiple">
        <Tag id="1">Everything that is still waiting</Tag>
        <Tag id="2">Things done this week</Tag>
      </TagGroup>
    ),
    text: 'Write long labels, or let color mean something on its own.',
  },
  keys: [
    { keys: ['Tab'], does: 'Moves focus into the group, one stop for every tag' },
    { keys: ['←', '→'], does: 'Moves between tags' },
    { keys: ['Space', 'Enter'], does: 'Selects or clears the tag' },
    { keys: ['Delete', 'Backspace'], does: 'Removes the tag, when tags can be removed' },
  ],
  screenReader: { pattern: '[Label], row, selected', example: 'Tag 1, row, selected' },
  accessibility: [
    'Selected tags show a check mark as well as a fill.',
    'The group needs a visible label or an aria-label.',
    'Remove buttons are 24px, the WCAG minimum, and screen readers hear “Remove” with the tag’s name.',
  ],
  imports: ['TagGroup', 'Tag'],
  tokens: ['--color-accent-[state]', '--color-surface-glass', '--control-height-[size]', '--radius-medium', '--material-blur', '--color-border-focus'],
  related: [
    { name: 'Toggle button group', href: docsPath('Components/Toggle button group') },
    { name: 'Select', href: docsPath('Components/Select') },
    { name: 'Glass', href: '/?path=/story/foundations-glass--playground' },
  ],
};
