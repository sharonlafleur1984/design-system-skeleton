import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Button } from '../button/button';
import { useGlassLight } from '../glass-light/glass-light';
import { LIGHT_CHANGE } from '../glass-lens/lens';
import { clearArt, imageArt, resolveColor, type GlassArt } from '../glass-lens/lens-art';
import { firesideArt } from '../glass-lens/story-art';
import { LitContext } from '../material';
import { Orb, ORB_START } from './orb';
import type { OrbLook } from './orb-render';

// Storybook only: a section with glass in it, lit by an orb you can drag. Used on the Orb's page and
// in its test stories. Not exported from the component library.

export type OrbBackdrop = 'header' | 'marble' | 'fireside' | 'light';

/** Spotlight's header red, lightest at the light, as Try it out paints it. The glass bends the same paint. */
function headerArt(sun: { x: number; y: number }): GlassArt {
  return {
    paint(ctx, { width, height }, container) {
      const color = (css: string) => {
        const c = resolveColor(css, container) ?? [0, 0, 0, 0];
        return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;
      };
      const lx = width * sun.x;
      const ly = height * sun.y;
      const r = Math.max(Math.hypot(lx, ly), Math.hypot(width - lx, ly), Math.hypot(lx, height - ly), Math.hypot(width - lx, height - ly));
      const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, r);
      g.addColorStop(0, color('var(--color-accent-base)'));
      g.addColorStop(0.3, color('var(--color-accent-hover)'));
      g.addColorStop(0.9, color('var(--shell-frame)'));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
      return true;
    },
  };
}

export interface OrbSectionProps {
  backdrop: OrbBackdrop;
  /** For a Sunrise marble: its area and texture, and the color family its orb glows in. */
  area?: string;
  texture?: string;
  palette?: string;
  /** Where the orb starts. Defaults to the right, two thirds down, like every orb; the Orb's own page centers it. */
  start?: { x: number; y: number };
  /** The orb's look. Defaults to glow, like every orb. */
  look?: OrbLook;
  /** A name for the section, for screen readers. */
  label: string;
}

export function OrbSection({ backdrop, area = 'dashboard', texture = 'texture-sage-cream.jpg', palette, start = ORB_START, look, label }: OrbSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [sun, setSun] = useState(start);
  const night = `var(--color-area-${area}-night)`;
  const lens = useMemo(
    () => ({ art: backdrop === 'header' ? headerArt(sun) : backdrop === 'marble' ? imageArt({ src: texture, overlay: night }) : backdrop === 'fireside' ? firesideArt : clearArt() }),
    [backdrop, texture, night, sun],
  );
  useGlassLight(ref, { selector: '.ds-glass', lens, reach: 6, source: '[data-sun]' });
  useLayoutEffect(() => {
    window.dispatchEvent(new Event(LIGHT_CHANGE));
  }, [sun]);

  // Spotlight's header and Fireside are their own themes; the marble and the light page are Sunrise's
  // (its glass text follows the page's text, so it reads on a light page).
  const theme = backdrop === 'header' ? 'after-graduation' : backdrop === 'fireside' ? 'designer-toolkit' : 'life-hub';
  const background: Record<OrbBackdrop, string> = {
    header: `radial-gradient(circle farthest-corner at ${sun.x * 100}% ${sun.y * 100}%, var(--color-accent-base) 0, var(--color-accent-hover) 30%, var(--shell-frame) 90%)`,
    marble: `linear-gradient(${night}, ${night}), url('${texture}') center / cover`,
    fireside: 'radial-gradient(90% 70% at 100% 0%, var(--shell-glow), transparent 70%), var(--color-surface-page)',
    light: 'var(--color-surface-page)',
  };
  const style: CSSProperties = {
    position: 'relative',
    isolation: 'isolate',
    overflow: 'clip',
    minBlockSize: 200,
    padding: 'var(--space-6)',
    borderRadius: 'var(--radius-panel)',
    background: background[backdrop],
    // A plain page has no edge of its own, so a hairline marks the section.
    boxShadow: backdrop === 'light' ? 'inset 0 0 0 1px var(--color-border-default)' : undefined,
    color: backdrop === 'header' ? 'var(--color-ink-on-art)' : 'var(--color-ink-primary)',
  };
  return (
    <section ref={ref} aria-label={label} data-theme={theme} data-mode={backdrop === 'fireside' ? 'dark' : backdrop === 'light' ? 'light' : undefined} style={style}>
      <Orb data-sun="" position={sun} onPositionChange={setSun} palette={palette} look={look} />
      <LitContext.Provider value>
        <Button appearance="glass">Button</Button>
      </LitContext.Provider>
    </section>
  );
}
