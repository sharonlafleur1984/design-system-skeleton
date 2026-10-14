import { imageArt, resolveColor, type GlassArt } from './lens-art';

// Storybook only: the lens art for each theme's page as the stories paint it (storyBackgroundsCss), so
// glass in a story bends exactly what's behind it. Not exported from the component library.

/** Sunrise's page: the Dashboard marble under its night layer (clear in light mode), as its pages show it. */
export const sunriseArt = imageArt({ src: 'texture-sage-cream.jpg', overlay: 'var(--color-area-dashboard-night)' });

/** Fireside's page (and Spotlight's, in the stories): its surface with the warm glow from the top right. */
export const firesideArt: GlassArt = {
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

/** Pages with the glow in the top corner (Spotlight and Fireside) or the marble (Sunrise). */
export const storyPageArt = (theme: string): GlassArt => (theme === 'life-hub' ? sunriseArt : firesideArt);
