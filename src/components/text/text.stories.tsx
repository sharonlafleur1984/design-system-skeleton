import type { Meta, StoryObj } from '@storybook/react-vite';
import { Body, Heading, Label, Note } from './text';
import { BothThemes, Row, choice, hidden, setting, words } from '../story-helpers';
import { textPage } from './text.page';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const meta: Meta<typeof Heading> = {
  title: 'Components/Text',
  component: Heading,
  args: {
    children: 'Title',
    level: 2,
    variant: 'title',
    ...pageArgs,
  } as Meta<typeof Heading>['args'],
  argTypes: {
    children: words('Text', 'The words of the heading\n\n`children`'),
    level: setting('Level', 'Its rank in the page outline, h1 to h6. One h1 per page\n\n`level`', { control: { type: 'inline-radio' }, options: [1, 2, 3, 4, 5, 6] }),
    variant: choice('Variant', 'How it looks, whatever its level\n\n`variant`', ['display', 'title', 'heading', 'subheading']),
    ...pageArgTypes(),
    className: hidden,
  },
  parameters: { componentPage: textPage },
};
export default meta;
type Story = StoryObj<typeof Heading>;

/** Text's page. Every setting is in the Controls tab. */
export const Overview: Story = { ...pageStory(), tags: ['page'] };
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
export const UsageRules: Story = { ...pageStory('usage'), name: 'Usage rules', tags: ['page', 'section'] };
export const Accessibility: Story = { ...pageStory('a11y'), tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related'), tags: ['page', 'section'] };

// Test stories: screenshot and accessibility tests run on them; they stay out of the sidebar.

/** Every text part: Heading in its four looks, Body in three sizes, Label and Note. */
export const Styles: Story = {
  tags: ['!dev'],
  render: () => (
    <BothThemes>
      <Row label="Heading">
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <Heading level={2} variant="display">Display</Heading>
          <Heading level={2} variant="title">Title</Heading>
          <Heading level={3} variant="heading">Heading</Heading>
          <Heading level={4} variant="subheading">Subheading</Heading>
        </div>
      </Row>
      <Row label="Body">
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <Body size="large">Body large, for reading.</Body>
          <Body>Body, for most text.</Body>
          <Body size="small">Body small, for dense places.</Body>
        </div>
      </Row>
      <Row label="Label">
        <Label>Label</Label>
      </Row>
      <Row label="Note">
        <Note>Note</Note>
      </Row>
    </BothThemes>
  ),
};
