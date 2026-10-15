import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useGlassLight } from '../glass-light/glass-light';
import { AppearanceContext } from '../material';
import { ActionTile, ActionTileGroup } from '../action-tile/action-tile';
import { Button } from '../button/button';
import { Orb } from '../orb/orb';
import { PageShell } from '../page-shell/page-shell';
import { singleTheme, SUN_START, type Theme } from '../story-helpers';
import { firesideArt, sunriseArt } from './story-art';
import { LIGHT_CHANGE } from './lens';

// Storybook only: the Glass playground. The glass sits on the real background of the theme picked in
// the toolbar, in light or dark mode.
// - Sunrise and Fireside explore the light: the light is only an orb (no rays), starting at the bottom
//   right. Drag it (or use the arrow keys) and every rim, highlight and shadow follows.
// - Spotlight is a full page (its header), so the light stays still where it sits on the real page
//   (the light tokens Sharon placed): no orb, and nothing moves it.

const pageBackground: Partial<Record<Theme, string>> = {
  'life-hub': "linear-gradient(var(--color-area-dashboard-night), var(--color-area-dashboard-night)), url('texture-sage-cream.jpg') center / cover",
  'designer-toolkit': 'radial-gradient(90% 70% at 100% 0%, var(--shell-glow), transparent 70%), var(--color-surface-page)',
};

/** The glass to try: two tiles (one chosen) and three glass buttons. */
function GlassSet() {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
      <ActionTileGroup aria-label="Tiles">
        <ActionTile onPress={() => {}} label="Label" title="Title" description="Description" />
        <ActionTile onPress={() => {}} data-state="chosen" label="Chosen" title="Title" description="Description" />
      </ActionTileGroup>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <Button appearance="glass">Button</Button>
        <Button appearance="glass">Button</Button>
        <Button appearance="glass">Button</Button>
      </div>
    </div>
  );
}

/** A theme's page background with its own lens, lit by the sun. Text is the theme's own, so it suits light and dark mode. */
function ThemePage({ theme, children }: { theme: Theme; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const lens = useMemo(() => ({ art: theme === 'life-hub' ? sunriseArt : firesideArt }), [theme]);
  // A long reach: the edge light stays strong wherever the sun is, as it would outdoors.
  useGlassLight(ref, { source: '[data-sun]', selector: '.ds-glass', lens, reach: 6 });
  const style: CSSProperties = {
    position: 'relative',
    isolation: 'isolate',
    minBlockSize: '100vh',
    padding: 'var(--space-7) var(--layout-gutter)',
    background: pageBackground[theme] ?? 'var(--color-surface-page)',
    color: 'var(--color-ink-primary)',
  };
  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
}

type Args = { bend: number; edgeDepth: number; colorSplit: number; edgeLight: number; shadow: number; themeSettings?: boolean };

function GlassPlayground({ theme, bend, edgeDepth, colorSplit, edgeLight, shadow, themeSettings }: Args & { theme: Theme }) {
  const set = <GlassSet />;
  const ref = useRef<HTMLDivElement>(null);
  // Where the orb is, as a share of the page. It starts at the bottom right.
  const [sun, setSun] = useState(SUN_START);
  const spotlight = theme === 'after-graduation';

  useEffect(() => {
    window.dispatchEvent(new Event(LIGHT_CHANGE));
  }, [sun, theme, bend, edgeDepth, colorSplit, edgeLight, shadow]);

  // The Demo story shows each theme's own glass settings; the Playground's controls override them.
  const tuning = themeSettings ? ({ position: 'relative' } as CSSProperties) : ({
    position: 'relative',
    ['--glass-lens-bend' as string]: String(bend),
    ['--glass-lens-edge-depth' as string]: `${edgeDepth}px`,
    ['--glass-lens-color-split' as string]: String(colorSplit),
    ['--glass-lens-rim-width' as string]: '1px',
    ['--glass-lens-rim-lit' as string]: 'rgba(255, 255, 255, 0.9)',
    ['--glass-lens-highlight' as string]: `rgba(255, 255, 255, ${edgeLight.toFixed(2)})`,
    ['--glass-lens-rim-faint' as string]: 'rgba(255, 255, 255, 0.04)',
    ['--glass-lens-body' as string]: 'rgba(255, 255, 255, 0.1)',
    ['--glass-lens-tint' as string]: 'rgba(255, 255, 255, 0)',
    ['--glass-lens-shadow-color' as string]: `rgba(0, 0, 0, ${shadow.toFixed(2)})`,
    ['--glass-lens-shadow-distance' as string]: '4px',
    ['--glass-lens-shadow-blur' as string]: '14px',
  } as CSSProperties);
  const intro = "Glass bends what's behind it at its curved edge, and its rim and shadow come from one light.";

  return (
    <div ref={ref} style={tuning}>
      {!spotlight && <Orb data-sun="" position={sun} onPositionChange={setSun} />}
      {spotlight ? (
        <PageShell title="Spotlight" navigation={set}>
          <p style={{ margin: 0, maxInlineSize: '60ch' }}>{intro} This is a full page, so the light stays where it sits on the real page.</p>
        </PageShell>
      ) : (
        <ThemePage theme={theme}>
          <h1 style={{ margin: 0, fontFamily: 'var(--type-heading-title-family)' }}>Glass</h1>
          <p style={{ maxInlineSize: '60ch', marginBlockEnd: 'var(--space-6)' }}>{intro} Drag the light, or focus it and use the arrow keys.</p>
          <AppearanceContext.Provider value="glass">{set}</AppearanceContext.Provider>
        </ThemePage>
      )}
    </div>
  );
}

const meta: Meta<Args> = {
  title: 'Foundations/Glass',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Glass (the lens), on the real background of the theme picked in the toolbar, in light or dark mode: Spotlight's header, Sunrise's marble, Fireside's page. What's behind the glass bends at its curved edge, and its rim, highlight and shadow come from one light. In Sunrise and Fireside the light is an orb you can drag; Spotlight is a full page, so its light stays still. Tune the controls; the values that look right become each theme's glass-lens tokens.",
      },
    },
  },
  args: { bend: 1.5, edgeDepth: 28, colorSplit: 0.02, edgeLight: 0.38, shadow: 0.42 },
  argTypes: {
    bend: { name: 'Bend', control: { type: 'range', min: 0, max: 3, step: 0.1 } },
    edgeDepth: { name: 'Edge depth (px)', control: { type: 'range', min: 4, max: 64, step: 1 } },
    colorSplit: { name: 'Color split', control: { type: 'range', min: 0, max: 0.12, step: 0.005 } },
    edgeLight: { name: 'Edge light', control: { type: 'range', min: 0, max: 0.6, step: 0.02 } },
    shadow: { name: 'Shadow', control: { type: 'range', min: 0, max: 0.6, step: 0.02 } },
    themeSettings: { table: { disable: true } },
  },
  render: (args, { globals }) => <GlassPlayground {...args} theme={singleTheme(globals.theme)} />,
};
export default meta;

/** Tune the glass with the controls. In Sunrise and Fireside, drag the light too. */
export const Playground: StoryObj<Args> = {};

/** Each theme's own glass, matched side by side to the Oct 14 shader demo: a faintly milky body, the view bending at the round ends, a bright line along the edge facing the sun, and a soft shadow falling away from it. */
export const Demo: StoryObj<Args> = { args: { themeSettings: true }, argTypes: { bend: { table: { disable: true } }, edgeDepth: { table: { disable: true } }, colorSplit: { table: { disable: true } }, edgeLight: { table: { disable: true } }, shadow: { table: { disable: true } } } };

