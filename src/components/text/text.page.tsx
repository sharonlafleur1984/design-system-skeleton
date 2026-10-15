import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { DocLink, docsPath } from '../../../.storybook/component-page';
import { Body, Heading } from './text';

// Storybook only: what Text's Docs page says (the component page template).
export const textPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Sets text in the theme’s type styles: Heading, Body, Label and Note.',
  status: 'ready',
  useFor: ['Headings and running text on a page, so they match the headings and text on cards.', 'A small line that names what follows (Label), or a quiet side note (Note).'],
  useElse: [
    <>
      Text on a surface, with a title and a footer: use <DocLink href={docsPath('Components/Card')}>Card</DocLink>.
    </>,
    <>
      Words that go somewhere: use <DocLink href={docsPath('Components/Link')}>Link</DocLink>.
    </>,
    <>
      A message about what happened, like an error: use <DocLink href={docsPath('Components/Callout')}>Callout</DocLink>.
    </>,
  ],
  do: {
    example: (
      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <Heading level={2}>Title</Heading>
        <Body>Body text.</Body>
      </div>
    ),
    text: 'A real Heading at the level the page needs, with its look set by variant.',
  },
  dont: {
    example: (
      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <Body size="large">
          <strong>Title</strong>
        </Body>
        <Body>Body text.</Body>
      </div>
    ),
    text: 'Fake a heading with bold body text. Screen readers can’t find it in the page outline.',
  },
  keys: [{ keys: ['Tab'], does: 'Skips it: it isn’t interactive' }],
  screenReader: { pattern: '[Text], heading, level [n]', example: 'Title, heading, level 2' },
  accessibility: [
    'A heading’s level (1 to 6) is its rank in the page outline; variant is only its look. Keep them separate.',
    'One h1 per page.',
  ],
  imports: ['Heading', 'Body', 'Label', 'Note'],
  tokens: ['--type-display-m-[part]', '--type-heading-[variant]-[part]', '--type-body-[size]-[part]', '--type-label-[part]', '--color-ink-secondary'],
  related: [
    { name: 'Card', href: docsPath('Components/Card') },
    { name: 'Type', href: '/?path=/story/foundations-type--text-styles' },
  ],
};
