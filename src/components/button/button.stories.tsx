import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';
import { BothThemes, OnMarble, Row, WithReducedMotion, choice, hidden, marbles, onOff, setting, singleTheme, StatePictures, words } from '../story-helpers';
import { buttonPage } from './button.page';
import { PageShell } from '../page-shell/page-shell';
import { Callout } from '../callout/callout';

const Plus = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M8 3v10M3 8h10" />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Button', variant: 'primary', appearance: 'solid', size: 'medium' },
  argTypes: {
    children: words('Label', 'The words on the button'),
    variant: choice('Variant', 'How important the action is', ['primary', 'secondary', 'tertiary']),
    size: choice('Size', 'How big it is', ['small', 'medium', 'large']),
    appearance: choice('Appearance', 'Solid, or clear glass for artwork', ['solid', 'glass']),
    destructive: onOff('Destructive', 'For actions that remove something'),
    isDisabled: onOff('Disabled', "Turns it off, so it can't be pressed"),
    isPending: onOff('Loading', 'Shows a spinner while the action runs'),
    icon: setting('Icon', 'A decorative icon before the label', { control: false }),
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

/** Every setting, in the Controls tab. */
export const Playground: Story = {};

/** Primary for the one main action, Secondary for other choices, Tertiary for side trips. */
export const Styles: Story = {
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
  name: 'Glass on artwork',
  // On the Docs page, a window onto the header rather than a whole page of empty content.
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, height: '420px' } } },
  render: (_args, { globals }) => <GlassOnArt theme={globals.theme} />,
};

/** Sunrise: glass buttons on all ten marbles, to check the bend and the text on every one, in light and dark mode. */
export const GlassOnEveryMarble: Story = {
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
  name: 'Glass: reduced motion',
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, height: '420px' } } },
  render: (_args, { globals }) => (
    <WithReducedMotion>
      <GlassOnArt theme={globals.theme} />
    </WithReducedMotion>
  ),
};
