import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';
import { BothThemes, OnMarble, Row, WithReducedMotion, choice, hidden, marbles, onOff, setting, singleTheme, StatePictures, words } from '../story-helpers';
import { buttonPage } from './button.page';
import { PageShell } from '../page-shell/page-shell';
import { Callout } from '../callout/callout';
import { expect, fn, userEvent, within } from 'storybook/test';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const Plus = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M8 3v10M3 8h10" />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Button',
    variant: 'primary',
    appearance: 'solid',
    size: 'medium',
    destructive: false,
    isDisabled: false,
    isPending: false,
    // What the Actions tab lists as you use the button.
    onPress: fn(),
    onPressStart: fn(),
    onPressEnd: fn(),
    onHoverStart: fn(),
    onHoverEnd: fn(),
    onFocus: fn(),
    onBlur: fn(),
    ...pageArgs,
  } as Meta<typeof Button>['args'],
  argTypes: {
    children: words('Label', 'The words on the button\n\n`children`'),
    variant: choice('Variant', 'How important the action is\n\n`variant`', ['primary', 'secondary', 'tertiary']),
    appearance: choice('Style', 'Solid, or clear glass for any background except glass\n\n`appearance`', ['solid', 'glass']),
    size: choice('Size', 'How big it is\n\n`size`', ['small', 'medium', 'large']),
    destructive: onOff('Destructive', 'For actions that remove something\n\n`destructive`'),
    isDisabled: onOff('Disabled', "Turns it off, so it can't be pressed\n\n`isDisabled`"),
    isPending: onOff('Loading', 'Shows a spinner while the action runs\n\n`isPending`'),
    icon: setting('Icon', 'A decorative icon before the label', { control: false }),
    ...pageArgTypes({ states: ['rest', 'hover', 'pressed', 'focus', 'disabled', 'loading'], glass: true }),
    onPress: hidden,
    onPressStart: hidden,
    onPressEnd: hidden,
    onHoverStart: hidden,
    onHoverEnd: hidden,
    onFocus: hidden,
    onBlur: hidden,
    material: hidden,
    loading: hidden,
    disabled: hidden,
    'data-state': hidden,
    className: hidden,
  },
  parameters: { componentPage: buttonPage },
};
export default meta;
type Story = StoryObj<typeof Button>;

/** Button's page. Every setting is in the Controls tab. */
export const Overview: Story = {
  ...pageStory(),
  tags: ['page'],
  // The Interactions tab: checks the Try it out button does what it promises, with the settings picked.
  play: async ({ args, canvasElement, step }) => {
    const window = canvasElement.querySelector<HTMLElement>('.sb-try__window');
    if (!window || (args as unknown as Record<string, unknown>).sbState !== 'rest' || Object.values(args).includes('all')) return;
    const button = within(window).getByRole('button', { name: String(args.children) });
    await step('Press Tab to reach it: the focus ring shows', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });
    await step(args.isDisabled || args.isPending ? 'Press Enter: nothing runs' : 'Press Enter: its action runs once', async () => {
      await userEvent.keyboard('{Enter}');
      await expect(args.onPress).toHaveBeenCalledTimes(args.isDisabled || args.isPending ? 0 : 1);
    });
  },
};
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
export const UsageRules: Story = { ...pageStory('usage'), name: 'Usage rules', tags: ['page', 'section'] };
export const Accessibility: Story = { ...pageStory('a11y'), tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related'), tags: ['page', 'section'] };

// Test stories: screenshot and accessibility tests run on them; they stay out of the sidebar.

/** Every setting at its default. */
export const Playground: Story = { tags: ['!dev'] };

/** Primary for the one main action, Secondary for other choices, Tertiary for side trips. */
export const Styles: Story = {
  tags: ['!dev'],
  name: 'Variants',
  render: () => (
    <BothThemes>
      <Row label="Primary">
        <Button>Button</Button>
        <Button icon={<Plus />}>Button</Button>
      </Row>
      <Row label="Secondary">
        <Button variant="secondary">Button</Button>
        <Button variant="secondary" icon={<Plus />}>Button</Button>
      </Row>
      <Row label="Tertiary">
        <Button variant="tertiary">Button</Button>
        <Button variant="tertiary" icon={<Plus />}>Button</Button>
      </Row>
    </BothThemes>
  ),
};

/** Medium almost everywhere. Small in dense lists, Large for the main action on a phone. */
export const Sizes: Story = {
  tags: ['!dev'],
  render: () => (
    <BothThemes>
      <Row label="Small">
        <Button size="small">Button</Button>
      </Row>
      <Row label="Medium">
        <Button size="medium">Button</Button>
      </Row>
      <Row label="Large">
        <Button size="large">Button</Button>
      </Row>
    </BothThemes>
  ),
};

/** Every state, side by side: rest, hover, pressed, disabled and loading. */
export const States: Story = {
  tags: ['!dev'],
  render: () => (
    <BothThemes>
      <StatePictures>
        {(['primary', 'secondary', 'tertiary'] as const).map((variant) => (
          <Row key={variant} label={variant}>
            <Button variant={variant}>Rest</Button>
            <Button variant={variant} data-state="hover">Hover</Button>
            <Button variant={variant} data-state="pressed">Pressed</Button>
            <Button variant={variant} isDisabled>Disabled</Button>
            <Button variant={variant} isPending>Loading</Button>
          </Row>
        ))}
      </StatePictures>
    </BothThemes>
  ),
};

/** For actions that remove something. The label says what goes, so red is never the only signal. */
export const Destructive: Story = {
  tags: ['!dev'],
  render: () => (
    <BothThemes>
      <Row label="Destructive">
        <Button destructive>Delete</Button>
        <Button destructive variant="secondary">Delete</Button>
        <Button destructive variant="tertiary">Delete</Button>
      </Row>
    </BothThemes>
  ),
};

const Gear = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="2.25" />
    <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" />
  </svg>
);

const glassRow = (
  <>
    <Button appearance="glass" size="large" icon={<Plus />}>Button</Button>
    <Button appearance="glass">Button</Button>
    <Button appearance="glass" size="small">Small</Button>
    <Button appearance="glass" isDisabled>Disabled</Button>
  </>
);

// After Graduation: glass buttons in the real page shell header (Settings at the top right, a row in the header).
function OnHeaderArt() {
  return (
    <div data-theme="after-graduation">
      <PageShell
        title="Page title"
        subtitle="Subtitle"
        actions={<Button appearance="glass" size="small" icon={<Gear />}>Settings</Button>}
        navigation={<div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)' }}>{glassRow}</div>}
      >
        <p style={{ margin: 0 }}>Page content</p>
      </PageShell>
    </div>
  );
}

function GlassOnArt({ theme }: { theme: unknown }) {
  const t = singleTheme(theme);
  // Fireside's glass and light recipe is still open (designer-toolkit wiki, Skin).
  if (t === 'designer-toolkit') return <Callout tone="info">Fireside's glass hasn't been designed yet.</Callout>;
  return t === 'life-hub' ? <OnMarble>{glassRow}</OnMarble> : <OnHeaderArt />;
}

/**
 * Clear glass on the artwork the design system paints: Spotlight's header and Sunrise's marble. Its
 * rim, highlight and shadow come from the page's light, and the art bends at its curved edge while the
 * label stays crisp. Glass works on a plain page too (frosted, with nothing to bend), never on glass (D55).
 * Without WebGL, or with Reduce transparency or Increase contrast, it turns frosted.
 */
export const GlassOnArtwork: Story = {
  tags: ['!dev'],
  name: 'Glass on artwork',
  // On the Docs page, a window onto the header rather than a whole page of empty content.
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, height: '420px' } } },
  render: (_args, { globals }) => <GlassOnArt theme={globals.theme} />,
};

/** Sunrise: glass buttons on all ten marbles, to check the bend and the text on every one, in light and dark mode. */
export const GlassOnEveryMarble: Story = {
  tags: ['!dev'],
  name: 'Glass on every marble',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      {marbles.map((m) => (
        <OnMarble key={m.texture} marble={m}>
          <Button appearance="glass" icon={<Plus />}>Button</Button>
          <Button appearance="glass" size="small">Small</Button>
        </OnMarble>
      ))}
    </div>
  ),
};

/** With Reduce motion on: still Glass, but presses don't swell and phone tilt is off. */
export const GlassReducedMotion: Story = {
  tags: ['!dev'],
  name: 'Glass: reduced motion',
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, height: '420px' } } },
  render: (_args, { globals }) => (
    <WithReducedMotion>
      <GlassOnArt theme={globals.theme} />
    </WithReducedMotion>
  ),
};
