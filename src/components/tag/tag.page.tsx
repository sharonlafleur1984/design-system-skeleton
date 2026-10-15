import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { Tag, TagGroup } from './tag';

// Storybook only: what Tag's page says (the component page template).
export const tagPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Filters a list, picks from a short set, or shows tags someone can remove.',
  status: 'ready',
  builtWith: { reactAria: 'TagGroup' },
  useFor: ['Filtering a list, like Unread.', 'Picking one or more options from a short set, or showing tags someone can remove.'],
  useElse: [
    { job: 'An action', instead: { name: 'Button', title: 'Components/Button' } },
    { job: 'More than eight options', instead: { name: 'Select', title: 'Components/Select' } },
  ],
  do: {
    example: (
      <TagGroup label="Label" selectionMode="multiple" defaultSelectedKeys={['1']}>
        <Tag id="1">Tag 1</Tag>
        <Tag id="2">Tag 2</Tag>
        <Tag id="3">Tag 3</Tag>
      </TagGroup>
    ),
    rules: ['Keep labels to one or two words.', 'Give the group a label.'],
  },
  dont: {
    example: (
      <TagGroup aria-label="Label" selectionMode="multiple">
        <Tag id="1">Everything that is still waiting</Tag>
        <Tag id="2">Things done this week</Tag>
      </TagGroup>
    ),
    rules: ['Write long labels.', 'Let color mean something on its own.'],
  },
  keys: [
    { keys: ['Tab'], result: 'Moves focus into the group, one stop for every tag.' },
    { keys: ['←', '→'], result: 'Moves between tags.' },
    { keys: ['Space', 'Enter'], result: 'Selects or clears the tag.' },
    { keys: ['Delete', 'Backspace'], result: 'Removes the tag, when tags can be removed.' },
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
    { name: 'Toggle button group', title: 'Components/Toggle button group' },
    { name: 'Select', title: 'Components/Select' },
    { name: 'Glass', title: 'Foundations/Glass', story: 'playground' },
  ],
};
