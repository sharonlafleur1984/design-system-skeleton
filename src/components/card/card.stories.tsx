import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Card, CardBody, CardFooter, CardHeader } from './card';
import { Button } from '../button/button';
import { BothThemes, Row, choice, hidden, onOff, setting, storyIcons, words } from '../story-helpers';
import { cardPage } from './card.page';
import type { Appearance } from '../material';
import type { IconPosition } from '../tile-header';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  args: {
    appearance: 'solid',
    children: (
      <>
        <CardHeader label="Label" title="Title" />
        <CardBody>Body text.</CardBody>
      </>
    ),
    ...pageArgs,
  } as Meta<typeof Card>['args'],
  argTypes: {
    appearance: choice('Style', 'Solid, or clear glass that takes its light from the page\n\n`appearance`', ['solid', 'glass']),
    as: setting('Element', 'The HTML element, like section or article\n\n`as`', { control: false }),
    children: setting('Parts', 'CardHeader, CardBody and CardFooter, or anything else\n\n`children`', { control: false }),
    ...pageArgTypes({ glass: true }),
    material: hidden,
    variant: hidden,
    interactive: hidden,
    className: hidden,
  },
  parameters: { componentPage: cardPage },
};
export default meta;
type Story = StoryObj<typeof Card>;

/** Card's page. Every setting is in the Controls tab. */
export const Overview: Story = { ...pageStory(), tags: ['page'] };
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
export const UsageRules: Story = { ...pageStory('usage'), name: 'Usage rules', tags: ['page', 'section'] };
export const Accessibility: Story = { ...pageStory('a11y'), tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related'), tags: ['page', 'section'] };

// Test stories: screenshot and accessibility tests run on them; they stay out of the sidebar.

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

/** Every setting, in the Controls tab. */
export const Playground: StoryObj<PlaygroundArgs> = {
  tags: ['!dev'],
  args: { appearance: 'solid', showIcon: true, iconPosition: 'top', iconVariant: 'filled', showLabel: true, title: 'Title', showBody: true, showButton: true, showNote: true },
  argTypes: {
    showIcon: onOff('Icon', 'An icon in the header, in an icon tile'),
    iconPosition: { ...choice('Icon position', 'Above the label, or before the label and title', ['top', 'start']), if: { arg: 'showIcon' } },
    iconVariant: { ...choice('Icon background', 'A soft background behind the icon, or the icon alone', ['filled', 'plain']), if: { arg: 'showIcon' } },
    showLabel: onOff('Label', 'A small line above the title'),
    title: words('Title', "The card's name"),
    showBody: onOff('Body', 'The main content'),
    showButton: onOff('Button', 'A button in the footer'),
    showNote: onOff('Note', 'A quiet note in the footer'),
    // The component's own props this story doesn't use.
    ...Object.fromEntries(['as', 'children'].map((k) => [k, hidden])),
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

/** Solid (the theme's card surface, the starting look) and Glass (clear, only its edge light and shadow). Drag the sun to move the light. */
export const SolidAndGlass: Story = {
  tags: ['!dev'],
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

/** The parts, alone and together: header, body and footer. Use only the ones the content needs. */
export const Parts: Story = {
  tags: ['!dev'],
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
  tags: ['!dev'],
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
  tags: ['!dev'],
  name: 'Empty state',
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
