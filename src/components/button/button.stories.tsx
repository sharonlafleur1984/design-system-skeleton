import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';
import { BothThemes, OnMarble, Row, WithReducedMotion, marbles, singleTheme, StatePictures } from '../story-helpers';
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
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'tertiary'] },
    appearance: { name: 'Appearance', control: 'inline-radio', options: ['solid', 'glass'] },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Starts an action. From the Figma "Button" set (Style, Size, Destructive, Is Enabled, Show Icon).',
          '',
          '**When to use:** Primary for the one main action on a screen. Secondary for other choices. Tertiary for side trips. Glass only on artwork the design system controls: After Graduation\'s header and Life Hub\'s marble.',
          '',
          '**When not to:** To go to another page, use a link. Never put two primary buttons side by side. Never use Glass on a plain page or on a photo the system doesn\'t control; use Secondary there.',
          '',
          '**Solid and glass:** `appearance="solid"` (the default) is the button in its style (primary, secondary or tertiary). `appearance="glass"` is a clear glass button for artwork. The container lights it from the page\'s one light (`useGlassLight`). When the container passes its art (the page shell does; Life Hub screens pass their marble with `imageArt`), Glass is drawn by one WebGL canvas behind the group that paints the art and bends it at the button\'s curved edge, strongest at the very edge and clear in the middle, with a 1px rim brightest facing the light, a soft highlight inside it and a shadow falling away from it. The label and icon stay crisp HTML on top and never bend or blur. A pressed button swells about 2%, label and all, and settles back; on phones, tilting nudges the light. All motion is off with Reduce motion. With no WebGL, a lost graphics context, Reduce transparency or Increase contrast, it shows a frosted look instead. The glass build is due for a review (issue #60).',
          '',
          '**Do:** Start the label with a verb that says what happens ("Save changes"). **Don\'t:** Use "Submit" or "Click here".',
          '',
          '**Accessibility:** Built on React Aria\'s Button: a real `<button>` that works the same with mouse, touch, keyboard and screen readers. Focus ring always visible. Destructive buttons say what they remove, so color is never the only signal. Loading stays focusable, blocks repeat presses and is announced. Glass turns solid when Reduce Transparency or Increase Contrast is on. Glass button text uses `button-glass-ink`, with no text shadow, and keeps 4.5:1 on the header red and on every Life Hub marble; the lens canvas is decorative and hidden from screen readers, and focus rings, keyboard behavior and touch targets are unchanged.',
        ].join('\n'),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Styles: Story = {
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
 * Glass buttons on the artwork each product controls: After Graduation's header, and
 * Life Hub's marble (the Dashboard's). Pick the theme in the toolbar. The small one is a pill.
 */
export const GlassOnArtwork: Story = {
  name: 'Glass on artwork',
  parameters: { layout: 'fullscreen' },
  render: (_args, { globals }) => <GlassOnArt theme={globals.theme} />,
};

/** Life Hub: glass buttons on all ten marbles, to check the bend and the text on every one, in light and dark mode. */
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
  parameters: { layout: 'fullscreen' },
  render: (_args, { globals }) => (
    <WithReducedMotion>
      <GlassOnArt theme={globals.theme} />
    </WithReducedMotion>
  ),
};
