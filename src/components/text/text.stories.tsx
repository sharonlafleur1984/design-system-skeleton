import type { Meta, StoryObj } from '@storybook/react-vite';
import { Body, Heading, Label, Note } from './text';
import { BothThemes, Row, choice, hidden, setting, words } from '../story-helpers';
import { textPage } from './text.page';

const meta: Meta<typeof Heading> = {
  title: 'Components/Text',
  component: Heading,
  tags: ['autodocs'],
  argTypes: {
    children: words('Text', 'The words of the heading'),
    level: setting('Level', 'Its rank in the page outline, h1 to h6. One h1 per page', { control: { type: 'inline-radio' }, options: [1, 2, 3, 4, 5, 6] }),
    variant: choice('Variant', 'How it looks, whatever its level', ['display', 'title', 'heading', 'subheading']),
    className: hidden,
  },
  parameters: { componentPage: textPage },
};
export default meta;
type Story = StoryObj<typeof Heading>;

/** Every text part: Heading in its four looks, Body in three sizes, Label and Note. */
export const Styles: Story = {
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
