import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Card, CardBody, CardFooter, CardHeader } from './card';
import { Button } from '../button/button';
import { BothThemes, Row, storyIcons } from '../story-helpers';
import type { Appearance } from '../material';
import type { IconPosition } from '../tile-header';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'A surface for related content, in every theme. Solid or Glass, with nothing on it until you add its parts.',
          '',
          '**Parts:** `CardHeader` (an optional icon, a label and the title), `CardBody` (the main content: text in the body style, or anything else) and `CardFooter` (buttons, and an optional quiet `note`). Each part has its type already chosen from the theme, so every card reads the same way. The text parts (Heading, Body, Label, Note) work on their own too: see Text.',
          '',
          '**Solid and glass:** `appearance="solid"` (the starting look) is the theme\'s card surface with a soft shadow. `appearance="glass"` is clear glass: its edge, highlight and shadow come from the page\'s light, its text takes the color of what it sits on, and on artwork the design system paints (Life Hub\'s marble, Spotlight\'s header) it bends the art at its edges.',
          '',
          '**Icons:** give the header an `icon`, in an icon tile, `filled` (a soft background) or `plain`, in four sizes. `iconPosition="top"` puts it above the label; `"start"` puts it before the label and title.',
          '',
          '**Never pressable:** the buttons and links on a card are pressed, never the card itself, so a card has no hover or pressed state. For a whole tile that\'s a link or button, use **Tile**. To switch between sections of a page, use **Action tile**.',
          '',
          '**Do:** let the shadow lift the card; no borders needed. **Don\'t:** nest cards inside cards.',
          '',
          '**Accessibility:** the title is a real heading. Its `level` (h3 by default) sets its rank in the page outline without changing its look. Pick the card\'s own element with `as` (for example `section` or `article`). With Reduce transparency or Increase contrast on, Glass turns solid.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Card>;

const grid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, calc(var(--space-10) * 4)), 1fr))', gap: 'var(--space-3)', flex: '1 1 auto' };

const ExampleButton = () => (
  <Button size="small" variant="secondary">
    Button
  </Button>
);

type PlaygroundArgs = {
  appearance: Appearance;
  showIcon: boolean;
  iconPosition: IconPosition;
  iconVariant: 'filled' | 'plain';
  showLabel: boolean;
  title: string;
  showBody: boolean;
  showButton: boolean;
  showNote: boolean;
};

/** Try it: pick Solid or Glass, and turn each part on or off. */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: { appearance: 'solid', showIcon: true, iconPosition: 'top', iconVariant: 'filled', showLabel: true, title: 'Title', showBody: true, showButton: true, showNote: true },
  argTypes: {
    appearance: { name: 'Appearance', control: 'inline-radio', options: ['solid', 'glass'] },
    showIcon: { name: 'Icon', control: 'boolean' },
    iconPosition: { name: 'Icon position', control: 'inline-radio', options: ['top', 'start'], if: { arg: 'showIcon' } },
    iconVariant: { name: 'Icon background', control: 'inline-radio', options: ['filled', 'plain'], if: { arg: 'showIcon' } },
    showLabel: { name: 'Label', control: 'boolean' },
    title: { name: 'Title' },
    showBody: { name: 'Body', control: 'boolean' },
    showButton: { name: 'Button', control: 'boolean' },
    showNote: { name: 'Note', control: 'boolean' },
  },
  render: ({ appearance, showIcon, iconPosition, iconVariant, showLabel, title, showBody, showButton, showNote }) => (
    <div style={grid}>
      <Card appearance={appearance}>
        <CardHeader icon={showIcon ? storyIcons.calendar : undefined} iconPosition={iconPosition} iconVariant={iconVariant} label={showLabel ? 'Label' : undefined} title={title} />
        {showBody && <CardBody>Body text. A sentence or two about what this card holds.</CardBody>}
        {(showButton || showNote) && <CardFooter note={showNote ? 'Note' : undefined}>{showButton && <ExampleButton />}</CardFooter>}
      </Card>
    </div>
  ),
};

/** The two appearances on the theme's own page: Solid (the card surface) and Glass (clear, only its edge light and shadow). Drag the sun to move the light. */
export const SolidAndGlass: Story = {
  name: 'Solid and glass',
  render: () => (
    <BothThemes>
      <div style={grid}>
        {(['solid', 'glass'] as Appearance[]).map((a) => (
          <Card key={a} appearance={a}>
            <CardHeader label={a === 'glass' ? 'Glass' : 'Solid'} title="Title" />
            <CardBody>Body text.</CardBody>
            <CardFooter note="Note">
              <ExampleButton />
            </CardFooter>
          </Card>
        ))}
      </div>
    </BothThemes>
  ),
};

/** The parts, alone and together: header, body and footer, each with its type already chosen. */
export const Parts: Story = {
  render: () => (
    <BothThemes>
      <div style={grid}>
        <Card>
          <CardHeader title="Header only" />
        </Card>
        <Card>
          <CardHeader label="Label" title="Header and body" />
          <CardBody>Body text. A sentence or two about what this card holds.</CardBody>
        </Card>
        <Card>
          <CardHeader label="Label" title="All three" />
          <CardBody>Body text. A sentence or two about what this card holds.</CardBody>
          <CardFooter note="Note">
            <ExampleButton />
          </CardFooter>
        </Card>
      </div>
    </BothThemes>
  ),
};

/** Icons in the header: on top or at the start, with a soft background (filled) or without (plain). */
export const Icons: Story = {
  render: () => (
    <BothThemes>
      {(['top', 'start'] as IconPosition[]).map((position) => (
        <Row key={position} label={position === 'top' ? 'Top' : 'Start'}>
          <div style={grid}>
            {(['filled', 'plain'] as const).map((variant) => (
              <Card key={variant}>
                <CardHeader icon={storyIcons.calendar} iconPosition={position} iconVariant={variant} label={variant === 'filled' ? 'Filled' : 'Plain'} title="Title" />
                <CardBody>Body text.</CardBody>
              </Card>
            ))}
          </div>
        </Row>
      ))}
    </BothThemes>
  ),
};

/** A card that holds only an empty state: what's missing, and the one action that fills it. */
export const EmptyState: Story = {
  render: () => (
    <BothThemes>
      <div style={grid}>
        {(['glass', 'solid'] as Appearance[]).map((a) => (
          <Card key={a} appearance={a}>
            <CardHeader icon={storyIcons.book} title="Nothing here yet" />
            <CardBody>Add the first item to see it here.</CardBody>
            <CardFooter>
              <ExampleButton />
            </CardFooter>
          </Card>
        ))}
      </div>
    </BothThemes>
  ),
};
