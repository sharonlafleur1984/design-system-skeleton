import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { Card, CardBody, CardFooter, CardHeader } from './card';
import { Button } from '../button/button';

// Storybook only: what Card's page says (the component page template).
export const cardPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Holds related content on one surface, with a header, a body and a footer.',
  status: 'ready',
  builtWith: { source: 'src/components/card/card.tsx' },
  useFor: ['A group of related content with a title, like a summary with its next step.', 'An empty state: what’s missing, and the one action that fills it.'],
  useElse: [
    { job: 'A whole tile that’s one link or button', instead: { name: 'Tile', title: 'Components/Tile' } },
    { job: 'Switching between sections of a page', instead: { name: 'Action tile', title: 'Components/Action tile' } },
    { job: 'Text without a surface', instead: { name: 'Text', title: 'Components/Text' } },
  ],
  do: {
    example: (
      <Card>
        <CardHeader label="Label" title="Title" />
        <CardBody>Body text.</CardBody>
        <CardFooter>
          <Button size="small" variant="secondary">
            Button
          </Button>
        </CardFooter>
      </Card>
    ),
    rules: ['Let the shadow lift the card.', 'No borders needed.'],
  },
  dont: {
    example: (
      <Card>
        <CardHeader title="Title" />
        <Card>
          <CardHeader title="Title" level={4} />
          <CardBody>Body text.</CardBody>
        </Card>
      </Card>
    ),
    rules: ['Nest a card inside a card.'],
  },
  keys: [{ keys: ['Tab'], result: 'Moves to the buttons and links on it. The card itself isn’t interactive.' }],
  screenReader: { pattern: '[Title], heading, level [n]', example: 'Title, heading, level 3' },
  accessibility: [
    'The title is a real heading. level (h3 by default) sets its rank without changing its look.',
    'Pick the card’s own element with as, for example section or article.',
    'With Reduce transparency or Increase contrast on, Glass turns solid.',
  ],
  imports: ['Card', 'CardHeader', 'CardBody', 'CardFooter'],
  tokens: ['--color-surface-card', '--shadow-rest', '--radius-card', '--type-heading-title-[part]', '--type-body-default-[part]', '--space-4'],
  related: [
    { name: 'Tile', title: 'Components/Tile' },
    { name: 'Text', title: 'Components/Text' },
    { name: 'Icon tile', title: 'Components/Icon tile' },
  ],
};
