import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';
import { BothThemes, OnMarble, Row, WithReducedMotion, marbles, singleTheme } from '../story-helpers';
import { PageShell } from '../page-shell/page-shell';

const Plus = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M8 3v10M3 8h10" />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Add school', variant: 'primary', size: 'medium' },
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
          '**Glass (Oct 12):** a clear glass button for artwork. The container lights it from the page\'s one light (`useGlassLight`). When the container passes its art (the page shell does; Life Hub screens pass their marble with `imageArt`), it is lens glass: one WebGL canvas behind the group paints the art and bends it at the button\'s curved edge, strongest at the very edge and clear in the middle, with a 1px rim brightest facing the light, a soft highlight inside it and a shadow falling away from it. The label and icon stay crisp HTML on top and never bend or blur. A pressed button swells about 2% and settles back; on phones, tilting nudges the light. All motion is off with Reduce motion. With no WebGL, a lost graphics context, Reduce transparency or Increase contrast, it shows the classic glass recipe instead.',
          '',
          '**Do:** Start the label with a verb that says what happens ("Add school"). **Don\'t:** Use "Submit" or "Click here".',
          '',
          '**Accessibility:** Built on React Aria\'s Button: a real `<button>` that works the same with mouse, touch, keyboard and screen readers. Focus ring always visible. Destructive buttons say what they remove, so color is never the only signal. Loading stays focusable, blocks repeat presses and is announced. Glass turns solid when Reduce Transparency or Increase Contrast is on. Glass button text uses `button-glass-ink` with a soft text shadow (`glass-lens-halo`) and keeps 4.5:1 on the header red and on every Life Hub marble; the lens canvas is decorative and hidden from screen readers, and focus rings, keyboard behavior and touch targets are unchanged.',
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
        <Button>Add school</Button>
        <Button icon={<Plus />}>Add school</Button>
      </Row>
      <Row label="Secondary">
        <Button variant="secondary">Compare</Button>
        <Button variant="secondary" icon={<Plus />}>Compare</Button>
      </Row>
      <Row label="Tertiary">
        <Button variant="tertiary">See all</Button>
        <Button variant="tertiary" icon={<Plus />}>See all</Button>
      </Row>
    </BothThemes>
  ),
};

export const Sizes: Story = {
  render: () => (
    <BothThemes>
      <Row label="Small">
        <Button size="small">Save</Button>
      </Row>
      <Row label="Medium">
        <Button size="medium">Save</Button>
      </Row>
      <Row label="Large">
        <Button size="large">Save</Button>
      </Row>
    </BothThemes>
  ),
};

export const States: Story = {
  render: () => (
    <BothThemes>
      {(['primary', 'secondary', 'tertiary'] as const).map((variant) => (
        <Row key={variant} label={variant}>
          <Button variant={variant}>Rest</Button>
          <Button variant={variant} data-state="hover">Hover</Button>
          <Button variant={variant} data-state="pressed">Pressed</Button>
          <Button variant={variant} disabled>Disabled</Button>
          <Button variant={variant} loading>Loading</Button>
        </Row>
      ))}
    </BothThemes>
  ),
};

export const Destructive: Story = {
  render: () => (
    <BothThemes>
      <Row label="Destructive">
        <Button destructive>Delete plan</Button>
        <Button destructive variant="secondary">Delete plan</Button>
        <Button destructive variant="tertiary">Delete plan</Button>
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
    <Button variant="glass" size="large" icon={<Plus />}>Add school</Button>
    <Button variant="glass">Compare</Button>
    <Button variant="glass" size="small">Pill</Button>
    <Button variant="glass" disabled>Disabled</Button>
  </>
);

// After Graduation: glass buttons in the real page shell header (Settings at the top right, a row in the header).
function OnHeaderArt({ glassLens = true }: { glassLens?: boolean }) {
  return (
    <div data-theme="after-graduation">
      <PageShell
        title="After Graduation"
        subtitle="Alex, get ready for Season 2"
        glassLens={glassLens}
        actions={<Button variant="glass" size="small" icon={<Gear />}>Settings</Button>}
        navigation={<div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)' }}>{glassRow}</div>}
      >
        <p style={{ margin: 0 }}>The page goes here.</p>
      </PageShell>
    </div>
  );
}

function GlassOnArt({ theme, glassLens = true }: { theme: unknown; glassLens?: boolean }) {
  return singleTheme(theme) === 'life-hub' ? <OnMarble lens={glassLens}>{glassRow}</OnMarble> : <OnHeaderArt glassLens={glassLens} />;
}

/**
 * Glass buttons as lens glass on the artwork each product controls: After Graduation's header, and
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
          <Button variant="glass" icon={<Plus />}>Add to {m.name}</Button>
          <Button variant="glass" size="small">Pill</Button>
        </OnMarble>
      ))}
    </div>
  ),
};

/** The fallback: no WebGL, a lost graphics context, or Reduce transparency or Increase contrast. The classic glass recipe. */
export const GlassFallback: Story = {
  name: 'Glass: fallback',
  parameters: { layout: 'fullscreen' },
  render: (_args, { globals }) => <GlassOnArt theme={globals.theme} glassLens={false} />,
};

/** With Reduce motion on: still lens glass, but presses don't swell and phone tilt is off. */
export const GlassReducedMotion: Story = {
  name: 'Glass: reduced motion',
  parameters: { layout: 'fullscreen' },
  render: (_args, { globals }) => (
    <WithReducedMotion>
      <GlassOnArt theme={globals.theme} />
    </WithReducedMotion>
  ),
};
