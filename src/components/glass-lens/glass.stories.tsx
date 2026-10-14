import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { useGlassLight } from '../glass-light/glass-light';
import { MaterialContext } from '../material';
import { ActionTile, ActionTileGroup } from '../action-tile/action-tile';
import { Button } from '../button/button';
import { PageShell } from '../page-shell/page-shell';
import { singleTheme, type Theme } from '../story-helpers';
import { imageArt, resolveColor, type GlassArt } from './lens-art';
import { LIGHT_CHANGE } from './lens';

// Storybook only: the Glass playground. The glass sits on the real background of the theme picked in
// the toolbar, in light or dark mode, and the sun is the page's one light: drag it (or use the arrow
// keys) and every rim, highlight and shadow follows. In Spotlight the sun is the header's own light,
// so the wheel and its rays move with it.

/** Sunrise's page: the Dashboard marble under its night layer (clear in light mode), as its pages show it. */
const sunriseArt = imageArt({ src: 'texture-sage-cream.jpg', overlay: 'var(--color-area-dashboard-night)' });

/** Fireside's page: its dark surface with the warm glow from the top right, as its pages show it. */
const firesideArt: GlassArt = {
  paint(ctx, { width, height }, container) {
    const color = (css: string) => {
      const c = resolveColor(css, container) ?? [0, 0, 0, 0];
      return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;
    };
    ctx.fillStyle = color('var(--color-surface-page)');
    ctx.fillRect(0, 0, width, height);
    // radial-gradient(90% 70% at 100% 0%, glow, transparent 70%): an ellipse, so scale a circle.
    const rx = width * 0.9;
    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(1, (height * 0.7) / rx);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, color('var(--shell-glow)'));
    g.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(-width, 0, width, rx);
    ctx.restore();
    return true;
  },
};

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
        <Button variant="glass">Button</Button>
        <Button variant="glass">Button</Button>
        <Button variant="glass">Button</Button>
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
  const ref = useRef<HTMLDivElement>(null);
  // Where the sun is, as a share of the page.
  const [sun, setSun] = useState({ x: 0.8, y: 0.12 });
  const spotlight = theme === 'after-graduation';

  useEffect(() => {
    // In Spotlight the sun is the header's own light: its art (the red, the rays, the wheel) moves too.
    const shell = ref.current?.querySelector<HTMLElement>('.ds-shell');
    if (shell && ref.current) {
      const page = ref.current.getBoundingClientRect();
      const r = shell.getBoundingClientRect();
      shell.style.setProperty('--light-from-right', `${((1 - sun.x) * 100).toFixed(1)}%`);
      shell.style.setProperty('--light-top', `${(sun.y * page.height - (r.top - page.top)).toFixed(0)}px`);
    }
    window.dispatchEvent(new Event(LIGHT_CHANGE));
  }, [sun, theme, bend, edgeDepth, colorSplit, edgeLight, shadow]);

  const moveTo = (e: PointerEvent<HTMLElement>) => {
    const r = ref.current!.getBoundingClientRect();
    setSun({ x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) });
  };
  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    const d = ({ ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] } as Record<string, number[]>)[e.key];
    if (!d) return;
    e.preventDefault();
    setSun((s) => ({ x: Math.min(1, Math.max(0, s.x + d[0])), y: Math.min(1, Math.max(0, s.y + d[1])) }));
  };

  // The Demo story shows each theme's own glass settings; the Playground's controls override them.
  const tuning = themeSettings ? ({ position: 'relative' } as CSSProperties) : ({
    position: 'relative',
    ['--glass-lens-bend' as string]: String(bend),
    ['--glass-lens-edge-depth' as string]: `${edgeDepth}px`,
    ['--glass-lens-color-split' as string]: String(colorSplit),
    ['--glass-lens-rim-width' as string]: '1px',
    ['--glass-lens-rim-lit' as string]: 'rgba(255, 255, 255, 0.9)',
    ['--glass-lens-highlight' as string]: `rgba(255, 255, 255, ${edgeLight.toFixed(2)})`,
    ['--glass-lens-rim-faint' as string]: `rgba(255, 255, 255, ${(edgeLight * 0.47).toFixed(2)})`,
    ['--glass-lens-body' as string]: 'rgba(255, 255, 255, 0.1)',
    ['--glass-lens-tint' as string]: 'rgba(255, 255, 255, 0)',
    ['--glass-lens-shadow-color' as string]: `rgba(0, 0, 0, ${shadow.toFixed(2)})`,
    ['--glass-lens-shadow-distance' as string]: '14px',
    ['--glass-lens-shadow-blur' as string]: '34px',
  } as CSSProperties);
  const sunStyle: CSSProperties = {
    position: 'absolute',
    left: `${sun.x * 100}%`,
    top: `${sun.y * 100}%`,
    zIndex: 5,
    inlineSize: 'var(--space-6)',
    blockSize: 'var(--space-6)',
    marginInlineStart: 'calc(var(--space-6) / -2)',
    marginBlockStart: 'calc(var(--space-6) / -2)',
    padding: 0,
    border: 'none',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #fff7d6 0 30%, #f5c542 45%, rgba(245, 197, 66, 0) 72%)',
    boxShadow: '0 0 32px 12px rgba(245, 197, 66, 0.35)',
    cursor: 'grab',
    touchAction: 'none',
  };
  const intro = "Glass bends what's behind it at its curved edge, and its rim and shadow come from one light. Drag the sun, or focus it and use the arrow keys.";

  return (
    <div ref={ref} style={tuning}>
      <button
        type="button"
        data-sun=""
        aria-label="Sun. Drag it, or use the arrow keys to move the light."
        style={sunStyle}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          moveTo(e);
        }}
        onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && moveTo(e)}
        onKeyDown={onKey}
      />
      {spotlight ? (
        <PageShell title="Glass" subtitle="Drag the sun" navigation={<GlassSet />}>
          <p style={{ margin: 0, maxInlineSize: '60ch' }}>{intro} In Spotlight the sun is the header&apos;s own light, so the wheel and its rays follow it.</p>
        </PageShell>
      ) : (
        <ThemePage theme={theme}>
          <h1 style={{ margin: 0, fontFamily: 'var(--type-heading-title-family)' }}>Glass</h1>
          <p style={{ maxInlineSize: '60ch', marginBlockEnd: 'var(--space-6)' }}>{intro}</p>
          <MaterialContext.Provider value="glass">
            <GlassSet />
          </MaterialContext.Provider>
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
          "The Glass material (the lens), on the real background of the theme picked in the toolbar, in light or dark mode: Spotlight's header, Sunrise's marble, Fireside's page. What's behind the glass bends at its curved edge, and its rim, highlight and shadow come from one light. Drag the sun to move it. Tune the controls; the values that look right become each theme's glass-lens tokens.",
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

/** Drag the sun, and tune the glass with the controls. */
export const Playground: StoryObj<Args> = {};

/** Each theme's own glass, matched side by side to the Oct 14 shader demo: a faintly milky body, the view bending at the round ends, a bright line along the edge facing the sun, and a soft shadow falling away from it. */
export const Demo: StoryObj<Args> = { args: { themeSettings: true }, argTypes: { bend: { table: { disable: true } }, edgeDepth: { table: { disable: true } }, colorSplit: { table: { disable: true } }, edgeLight: { table: { disable: true } }, shadow: { table: { disable: true } } } };
