import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Link, LinkButton } from './link';
import { BothThemes, StatePictures, choice, hidden, onOff, words } from '../story-helpers';
import { linkPage } from './link.page';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  args: { level: 'inline', href: '#', children: 'Link', external: false, isDisabled: false, ...pageArgs } as Meta<typeof Link>['args'],
  argTypes: {
    children: words('Label', 'The words of the link\n\n`children`'),
    level: choice('Level', 'Inline inside a sentence, Quiet for a side trip\n\n`level`', ['inline', 'quiet']),
    href: words('Goes to', 'The page or place it opens\n\n`href`'),
    external: onOff('Outside site', 'Opens in a new tab, with a marker that says so\n\n`external`'),
    isDisabled: onOff('Disabled', "Turns it off, so it can't be followed\n\n`isDisabled`"),
    ...pageArgTypes({ states: ['rest', 'disabled'] }),
    className: hidden,
  },
  parameters: { componentPage: linkPage },
};
export default meta;
type Story = StoryObj<typeof Link>;

/** Link's page. Every setting is in the Controls tab. */
export const Overview: Story = { ...pageStory(), tags: ['page'] };
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
export const UsageRules: Story = { ...pageStory('usage'), name: 'Usage rules', tags: ['page', 'section'] };
export const Accessibility: Story = { ...pageStory('a11y'), tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related'), tags: ['page', 'section'] };

// Test stories: screenshot and accessibility tests run on them; they stay out of the sidebar.

/** Every setting, in the Controls tab. */
export const Playground: Story = { tags: ['!dev'] };

const row: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)' };
const body: CSSProperties = { margin: 0, fontSize: 'var(--type-body-default-size)', lineHeight: 'var(--type-body-default-line-height)' };

/** Inline inside a sentence, Quiet for a side trip, and an outside link that opens a new tab. */
export const Levels: Story = {
  tags: ['!dev'],
  render: () => (
    <BothThemes>
      <p style={body}>
        Body text with an <Link href="#">inline link</Link>.
      </p>
      <div style={row}>
        <span style={body}>Body text</span>
        <Link level="quiet" href="#">Quiet link</Link>
      </div>
      <p style={body}>
        Source: <Link level="quiet" href="https://example.com" external>External link</Link>
      </p>
    </BothThemes>
  ),
};

/** LinkButton: looks like a link but does something on this page, like Show more. */
export const LinkButtons: Story = {
  tags: ['!dev'],
  render: () => (
    <BothThemes>
      <div style={row}>
        <strong style={body}>Section title</strong>
        <LinkButton aria-expanded={false}>Show more</LinkButton>
      </div>
      <div style={row}>
        <span style={body}>Body text</span>
        <LinkButton>Link button</LinkButton>
      </div>
    </BothThemes>
  ),
};

const hover: CSSProperties = { color: 'var(--link-inline-color-hover)', textDecorationColor: 'currentColor' };
const quietHover: CSSProperties = { color: 'var(--link-quiet-color-hover)', textDecorationColor: 'currentColor' };
const focus: CSSProperties = { outline: '2px solid var(--color-border-focus)', outlineOffset: '2px' };

/** Rest, hover and focus side by side. Focus looks like hover, plus a focus ring. */
export const States: Story = {
  tags: ['!dev'],
  render: () => (
    <BothThemes>
      <StatePictures>
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
      </StatePictures>
    </BothThemes>
  ),
};
