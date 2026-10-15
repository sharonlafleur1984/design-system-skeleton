import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import cover from '../../scripts/lantern/cover.html?raw';
import { lightCover } from './cover-light';

// Lantern's cover, the same one Lantern shows (scripts/lantern/cover.html is the one source), for
// Storybook's Welcome page. It's drawn 960 x 288 and scaled down to fit narrower pages, as Lantern
// does, and lit by its orb where there's 3D (D60).
// The cover's own page rules (the body's margin) belong to Lantern's preview frame, not this page;
// its script is Lantern's way of lighting it, done here by the effect below.
const markup = cover.replace(/body\s*\{[^}]*\}/, '').replace(/<script[\s\S]*?<\/script>/g, '');

export function LanternCover() {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth ? Math.min(1, el.clientWidth / 960) : 1);
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    const watch = new ResizeObserver(fit);
    watch.observe(el);
    return () => watch.disconnect();
  }, []);
  useEffect(() => {
    void lightCover(box.current?.querySelector<HTMLElement>('.cover') ?? null);
  }, []);
  return (
    // sb-unstyled: Storybook's docs styles stay off the cover, so it looks as it does in Lantern.
    <div ref={box} className="sb-unstyled" style={{ height: 288 * scale, marginBlockEnd: 'var(--space-6, 24px)', overflow: 'hidden' }}>
      <div style={{ inlineSize: 960, transform: `scale(${scale})`, transformOrigin: 'top left' }} dangerouslySetInnerHTML={{ __html: markup }} />
    </div>
  );
}
