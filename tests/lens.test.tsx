// @vitest-environment jsdom
// Lens glass (src/components/glass-lens/lens.ts): falls back to the classic glass when it can't draw,
// turns motion off with reduced motion, and never asks for motion access without a tap.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ActionTile, ActionTileGroup, Button, PageShell } from '../src/components';
import { attachLens, resetTiltPermission } from '../src/components/glass-lens/lens';
import type { LensFrame, LensRenderer } from '../src/components/glass-lens/lens-shader';
import type { GlassArt } from '../src/components/glass-lens/lens-art';

// jsdom has no layout observers.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= NoopObserver as unknown as typeof ResizeObserver;

// Frames run only when the test says so, at a time the test picks.
let frames: FrameRequestCallback[] = [];
let now = 0;
function flush(at: number) {
  now = at;
  const run = frames;
  frames = [];
  run.forEach((f) => f(at));
}
const settle = () => new Promise((r) => setTimeout(r, 0)); // lets MutationObservers report

let matches: Record<string, boolean> = {};
beforeEach(() => {
  frames = [];
  now = 0;
  matches = {};
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    frames.push(cb);
    return frames.length;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  vi.spyOn(performance, 'now').mockImplementation(() => now);
  window.matchMedia = ((q: string) => ({ matches: !!matches[q], media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
  // jsdom has no canvas: getContext returns null, like a browser without WebGL.
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => null);
  resetTiltPermission();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  document.documentElement.removeAttribute('data-reduce-motion');
  document.documentElement.removeAttribute('data-transparency');
  delete (window as unknown as { DeviceOrientationEvent?: unknown }).DeviceOrientationEvent;
  document.body.innerHTML = '';
});

describe('without WebGL', () => {
  it('keeps the classic glass on action tiles and glass buttons: no canvas, no lens, nothing blank', () => {
    render(
      <PageShell title="After Graduation" actions={<Button variant="glass">Settings</Button>} navigation={
        <ActionTileGroup aria-label="Next steps">
          <ActionTile title="Explore Schools" description="Select your favorites" onPress={() => {}} />
        </ActionTileGroup>
      }>
        <p>Page</p>
      </PageShell>,
    );
    flush(16);
    expect(document.querySelector('.ds-lens-canvas')).toBeNull();
    const tile = screen.getByRole('button', { name: /Explore Schools/ });
    const button = screen.getByRole('button', { name: 'Settings' });
    for (const el of [tile, button]) {
      expect(el).toHaveProperty('className', expect.stringContaining('ds-glass'));
      expect(el.hasAttribute('data-lens')).toBe(false);
    }
    expect(tile.textContent).toContain('Explore Schools');
  });
});

// A stand-in renderer, so the controller can run in jsdom.
function setup() {
  const draws: LensFrame[] = [];
  const renderer: LensRenderer = { ok: true, setArt() {}, draw: (f) => void draws.push(f), dispose() {} };
  const createRenderer = vi.fn(() => renderer);
  // The art canvas needs a 2D context.
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(((type: string) =>
    type === '2d' ? ({ setTransform() {}, clearRect() {} } as unknown as CanvasRenderingContext2D) : null) as typeof HTMLCanvasElement.prototype.getContext);
  const art: GlassArt = { paint: () => true };
  const root = document.createElement('div');
  const glass = document.createElement('button');
  glass.className = 'ds-lens';
  glass.textContent = 'Add school';
  root.append(glass);
  document.body.append(root);
  vi.spyOn(root, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 400, 200));
  // Like a browser, the glass's box includes its scale (the press swell), around its center.
  vi.spyOn(glass, 'getBoundingClientRect').mockImplementation(() => {
    const k = Number(glass.style.scale || 1);
    return new DOMRect(40 - (100 * k - 100) / 2, 40 - (38 * k - 38) / 2, 100 * k, 38 * k);
  });
  Object.defineProperty(glass, 'offsetWidth', { configurable: true, get: () => 100 });
  const stop = attachLens(root, { art, light: () => ({ x: 400, y: 0 }) }, { createRenderer });
  return { root, glass, draws, createRenderer, stop };
}

describe('lens', () => {
  it('draws the glass and steps the element\'s own fill aside', () => {
    const { glass, draws, root, stop } = setup();
    flush(16);
    expect(draws.length).toBe(1);
    expect(glass.getAttribute('data-lens')).toBe('on');
    const canvas = root.querySelector('canvas.ds-lens-canvas');
    expect(canvas?.getAttribute('aria-hidden')).toBe('true');
    stop();
    expect(root.querySelector('canvas')).toBeNull();
    expect(glass.hasAttribute('data-lens')).toBe(false);
  });

  it('falls back with Reduce transparency (device or Settings) and never starts WebGL', () => {
    matches['(prefers-reduced-transparency: reduce)'] = true;
    const a = setup();
    flush(16);
    expect(a.createRenderer).not.toHaveBeenCalled();
    expect(a.glass.hasAttribute('data-lens')).toBe(false);
    a.stop();
    matches = {};
    document.documentElement.setAttribute('data-transparency', 'reduce');
    const b = setup();
    flush(16);
    expect(b.createRenderer).not.toHaveBeenCalled();
    expect(b.root.querySelector('canvas')).toBeNull();
    b.stop();
  });

  it('falls back when the graphics context is lost', () => {
    const { glass, root, stop } = setup();
    flush(16);
    root.querySelector('canvas')!.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
    expect(glass.hasAttribute('data-lens')).toBe(false);
    stop();
  });

  it('swells a pressed glass a little and settles it back', async () => {
    const { glass, draws, stop } = setup();
    flush(16);
    const rest = draws.at(-1)!.rects[0].w;
    now = 100;
    glass.setAttribute('data-pressed', 'true');
    await settle();
    flush(100 + 75);
    expect(draws.at(-1)!.rects[0].w).toBeGreaterThan(rest);
    // The element swells with its glass, so a fill it paints itself never comes loose from the rim.
    expect(Number(glass.style.scale)).toBeCloseTo(draws.at(-1)!.rects[0].w / rest);
    flush(100 + 400);
    expect(draws.at(-1)!.rects[0].w).toBeCloseTo(rest);
    expect(glass.style.scale).toBe('');
    stop();
  });

  it('glides into a new state instead of jumping (chosen turning milky)', async () => {
    const { glass, draws, stop } = setup();
    flush(16);
    expect(draws.at(-1)!.rects[0].milk).toBe(0);
    glass.style.setProperty('--glass-milk', '1');
    await settle();
    flush(32);
    const first = draws.at(-1)!.rects[0].milk!;
    // One frame in, it has only started: no jump.
    expect(first).toBeGreaterThan(0);
    expect(first).toBeLessThan(0.3);
    // It keeps drawing on its own until it arrives: most of the way within the slow motion step, all of it soon after.
    for (let t = 48; t <= 1200; t += 16) flush(t);
    const milks = draws.map((d) => d.rects[0].milk!);
    expect(milks.at(-1)).toBe(1);
    // Every step moves forward, never back.
    milks.slice(1).forEach((m, i) => expect(m).toBeGreaterThanOrEqual(milks[i]));
    stop();
  });

  it('jumps straight to a new state with reduced motion', async () => {
    document.documentElement.setAttribute('data-reduce-motion', '');
    const { glass, draws, stop } = setup();
    flush(16);
    glass.style.setProperty('--glass-milk', '1');
    await settle();
    flush(32);
    expect(draws.at(-1)!.rects[0].milk).toBe(1);
    stop();
  });

  it('turns press motion off with reduced motion', async () => {
    document.documentElement.setAttribute('data-reduce-motion', '');
    const { glass, draws, stop } = setup();
    flush(16);
    const rest = draws.at(-1)!.rects[0].w;
    now = 100;
    glass.setAttribute('data-pressed', 'true');
    await settle();
    flush(100 + 75);
    expect(draws.at(-1)!.rects[0].w).toBe(rest);
    stop();
  });
});

describe('phone tilt', () => {
  function withPermissionPrompt() {
    const requestPermission = vi.fn(() => Promise.resolve('granted' as const));
    (window as unknown as { DeviceOrientationEvent: unknown }).DeviceOrientationEvent = { requestPermission };
    return requestPermission;
  }

  it('never asks for motion access on load, only on the first tap on the glass', async () => {
    const requestPermission = withPermissionPrompt();
    const listen = vi.spyOn(window, 'addEventListener');
    const { glass, root, stop } = setup();
    flush(16);
    expect(requestPermission).not.toHaveBeenCalled();
    expect(listen.mock.calls.some(([type]) => type === 'deviceorientation')).toBe(false);
    root.click(); // a tap that isn't on the glass
    expect(requestPermission).not.toHaveBeenCalled();
    glass.click();
    expect(requestPermission).toHaveBeenCalledTimes(1);
    await settle();
    expect(listen.mock.calls.some(([type]) => type === 'deviceorientation')).toBe(true);
    glass.click();
    expect(requestPermission).toHaveBeenCalledTimes(1);
    stop();
  });

  it('is off with reduced motion: no prompt, no listening', () => {
    document.documentElement.setAttribute('data-reduce-motion', '');
    const requestPermission = withPermissionPrompt();
    const listen = vi.spyOn(window, 'addEventListener');
    const { glass, stop } = setup();
    flush(16);
    glass.click();
    expect(requestPermission).not.toHaveBeenCalled();
    expect(listen.mock.calls.some(([type]) => type === 'deviceorientation')).toBe(false);
    stop();
  });

  it('is off with the device asking for reduced motion, even where no prompt is needed', () => {
    matches['(prefers-reduced-motion: reduce)'] = true;
    (window as unknown as { DeviceOrientationEvent: unknown }).DeviceOrientationEvent = {};
    const listen = vi.spyOn(window, 'addEventListener');
    const { stop } = setup();
    flush(16);
    expect(listen.mock.calls.some(([type]) => type === 'deviceorientation')).toBe(false);
    stop();
  });

  it('does nothing when access is denied', async () => {
    const requestPermission = vi.fn(() => Promise.resolve('denied' as const));
    (window as unknown as { DeviceOrientationEvent: unknown }).DeviceOrientationEvent = { requestPermission };
    const listen = vi.spyOn(window, 'addEventListener');
    const { glass, stop } = setup();
    glass.click();
    await settle();
    expect(listen.mock.calls.some(([type]) => type === 'deviceorientation')).toBe(false);
    glass.click();
    expect(requestPermission).toHaveBeenCalledTimes(1);
    stop();
  });
});
