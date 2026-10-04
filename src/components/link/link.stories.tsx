import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Link, LinkButton } from './link';
import { BothThemes } from '../story-helpers';

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  args: { level: 'inline', href: '#', children: 'Important Dates' },
  parameters: {
    docs: {
      description: {
        component: [
          'Two link levels, shared by every product. Each theme sets the colors and the quiet size.',
          '',
          '**Inline:** a link inside a sentence, at the sentence\'s size. "See everything in Important Dates."',
          '',
          '**Quiet:** a side trip or a small control, one step smaller and gray: View task, Show full year, sources.',
          '',
          '**Link or LinkButton?** If it goes somewhere, use `Link`. If it does something on the page (Show full year, Restore all), use `LinkButton`: it looks the same but is a real button.',
          '',
          '**When not to:** for the main action on a screen, use a Button. Never add a third link level for one spot.',
          '',
          '**Do:** keep the underline; it\'s what says "link" without relying on color. **Don\'t:** make links bold.',
          '',
          '**Accessibility:** soft underline at rest, full on hover and focus; visible focus ring; quiet links get a larger tap area; outside links say "(opens in a new tab)" to screen readers.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Link>;

export const Playground: Story = {};

const row: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)' };
const body: CSSProperties = { margin: 0, fontSize: 'var(--type-body-default-size)', lineHeight: 'var(--type-body-default-line-height)' };

export const Levels: Story = {
  render: () => (
    <BothThemes>
      <p style={body}>
        See everything in <Link href="#">Important Dates</Link>.
      </p>
      <div style={row}>
        <span style={body}>Credit check with the Alta counselor</span>
        <Link level="quiet" href="#">View task</Link>
      </div>
      <p style={body}>
        Source: <Link level="quiet" href="https://studentaid.gov" external>Federal Student Aid</Link>
      </p>
    </BothThemes>
  ),
};

export const LinkButtons: Story = {
  render: () => (
    <BothThemes>
      <div style={row}>
        <strong style={body}>Junior Year</strong>
        <LinkButton aria-expanded={false}>Show full year</LinkButton>
      </div>
      <div style={row}>
        <span style={body}>2 cards hidden</span>
        <LinkButton>Restore all</LinkButton>
      </div>
    </BothThemes>
  ),
};

const hover: CSSProperties = { color: 'var(--link-inline-color-hover)', textDecorationColor: 'currentColor' };
const quietHover: CSSProperties = { color: 'var(--link-quiet-color-hover)', textDecorationColor: 'currentColor' };
const focus: CSSProperties = { outline: '2px solid var(--color-border-focus)', outlineOffset: '2px' };

/** Hover and focus, shown side by side. Hover and focus look the same, plus a focus ring for keyboards. */
export const States: Story = {
  render: () => (
    <BothThemes>
      <div style={{ ...row, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        <Link href="#">Rest</Link>
        <Link href="#" style={hover}>Hover</Link>
        <Link href="#" style={{ ...hover, ...focus }}>Focus</Link>
      </div>
      <div style={{ ...row, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        <Link level="quiet" href="#">Rest</Link>
        <Link level="quiet" href="#" style={quietHover}>Hover</Link>
        <Link level="quiet" href="#" style={{ ...quietHover, ...focus }}>Focus</Link>
      </div>
    </BothThemes>
  ),
};
