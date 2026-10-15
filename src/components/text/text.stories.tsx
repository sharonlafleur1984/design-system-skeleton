import type { Meta, StoryObj } from '@storybook/react-vite';
import { Body, Heading, Label, Note } from './text';
import { BothThemes, Row } from '../story-helpers';

const meta: Meta<typeof Heading> = {
  title: 'Components/Text',
  component: Heading,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'The text parts, each with its type style already chosen from the theme: **Heading**, **Body**, **Label** and **Note**. Card\'s parts use the same styles, so a heading on a card and a heading on a page always match. Built on React Aria\'s Heading and Text.',
          '',
          '**Heading:** `variant` sets its look (`display`, `title` (the default), `heading` or `subheading`); `level` (1 to 6) sets its rank in the page outline for screen readers. Keep them separate: a card title can be an h2 on one page and an h3 on another and look the same. One h1 per page.',
          '',
          '**Body:** running text, `large` for reading, `default` for most text, `small` for dense places. **Label:** a small line that names what follows, in the theme\'s label style. **Note:** a quiet side note, like "Updated 2 hours ago."',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Heading>;

/** Every text part in the theme picked in the toolbar. */
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
