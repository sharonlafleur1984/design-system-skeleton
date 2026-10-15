import { useEffect, useRef, type RefObject } from 'react';
import { resolveColor, type GlassArt } from '../glass-lens/lens-art';
import { colorBehind, pageRgb } from '../orb/orb';
import { sharedRenderer } from '../orb/orb-render';

// A surface lit by the page's light, drawn by a real renderer (three.js) instead of a hand-tuned glow.
// The surface's own background (the same art the glass lens uses, or its plain color) becomes a
// matte surface in a 3D scene, with a point light hanging just above it where the light is. The
// renderer works out how the light falls off with distance and angle, so it brightens the pattern it
// falls on instead of covering it, and parts far from the light keep their own look (an even
// ambient light equal to the page's own brightness). The result is drawn into a canvas behind the
// surface's content. One renderer is shared with the orbs, so a page holds one 3D context.
//
// Experimental (D59). Without 3D, nothing is drawn and the surface keeps its own background.

export interface LitSurfaceOptions {
  /** The art the surface shows (the same art its glass lens uses). Leave out for a plain background. */
  art?: GlassArt;
  /** Where the light is, as a share of the surface: 0 is the left or top edge, 1 the right or bottom. */
  light: { x: number; y: number };
  /** The light's color, any CSS color. */
  color: string;
  /** How high above the surface the light hangs, in CSS pixels. Higher spreads it wider and softer. */
  height: number;
  /** How much brighter the spot right under the light is than the surface itself: 1.5 is 150% brighter. */
  strength?: number;
  /** False to draw nothing (for example while the light is off). */
  enabled?: boolean;
}

/**
 * Draws `surface`'s background, lit by the light, into `canvas` (which sits behind its content). Pass
 * null for `surface` to light the canvas's own parent (as LitBackground does).
 */
export function useLitSurface(surface: RefObject<HTMLElement | null> | null, canvas: RefObject<HTMLCanvasElement | null>, { art, light, color, height, strength = 1.5, enabled = true }: LitSurfaceOptions) {
  const frame = useRef(0);
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    let retry: ReturnType<typeof setTimeout> | undefined;
    cancelAnimationFrame(frame.current);
    // One drawing per frame at most, while the light is dragged.
    frame.current = requestAnimationFrame(() => {
      const out = canvas.current;
      const el = surface ? surface.current : (out?.parentElement ?? null);
      if (!el || !out) return;
      drawLit(el, out, { art, light, color, height, strength }).then((ok) => {
        // The art isn't ready (an image loading): try again shortly.
        if (!ok && live) retry = setTimeout(() => live && drawLit(el, out, { art, light, color, height, strength }), 250);
      });
    });
    return () => {
      live = false;
      cancelAnimationFrame(frame.current);
      clearTimeout(retry);
    };
  }, [surface, canvas, art, light.x, light.y, color, height, strength, enabled]);
}

async function drawLit(el: HTMLElement, out: HTMLCanvasElement, { art, light, color, height, strength }: Required<Omit<LitSurfaceOptions, 'enabled' | 'art'>> & { art?: GlassArt }) {
  let three;
  try {
    three = await sharedRenderer();
  } catch {
    return true; // No 3D here: the surface keeps its own background.
  }
  const { THREE, renderer } = three;
  const box = el.getBoundingClientRect();
  if (!box.width || !box.height) return true;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = Math.round(box.width * dpr);
  const H = Math.round(box.height * dpr);

  // The surface as it looks unlit: its color, then its art.
  const painted = document.createElement('canvas');
  painted.width = W;
  painted.height = H;
  const ctx = painted.getContext('2d');
  if (!ctx) return true;
  ctx.scale(dpr, dpr);
  ctx.fillStyle = colorBehind(el);
  ctx.fillRect(0, 0, box.width, box.height);
  if (art && !art.paint(ctx, { width: box.width, height: box.height }, el)) return false;

  // A light surface already reflects most light, so the same lamp would burn it out to white. The lamp
  // is scaled to how light the surface is, so it looks equally bright on dark and light surfaces.
  const sample = ctx.getImageData(0, 0, W, H).data;
  let lum = 0;
  for (let i = 0; i < sample.length; i += 4 * 16) lum += (0.2126 * sample[i] + 0.7152 * sample[i + 1] + 0.0722 * sample[i + 2]) / 255;
  lum /= sample.length / (4 * 16);
  const lampStrength = strength * (1 - 0.8 * lum);
  // A plain page (the theme's own page color) has no color to blend with, so its light is pure white.
  const page = pageRgb(el);
  const mean = [0, 0, 0];
  for (let i = 0; i < sample.length; i += 4 * 16) for (let k = 0; k < 3; k++) mean[k] += sample[i + k];
  const n = sample.length / (4 * 16);
  const plain = !!page && mean.reduce((d, v, k) => d + Math.abs(v / n - page[k]), 0) / (3 * 255) < 0.06;

  const texture = new THREE.CanvasTexture(painted);
  texture.colorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  // The camera looks straight down at the surface, one unit per CSS pixel, (0, 0) at its top left.
  const camera = new THREE.OrthographicCamera(0, box.width, 0, -box.height, 0.1, 5000);
  camera.position.set(0, 0, 1000);
  const geometry = new THREE.PlaneGeometry(box.width, box.height);
  const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 1, metalness: 0 });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(box.width / 2, -box.height / 2, 0);
  scene.add(plane);
  // Even light at the page's own brightness, so parts far from the light look as they always do.
  scene.add(new THREE.AmbientLight(0xffffff, Math.PI));
  // The light: falls off with distance squared and with angle, as real light does.
  const rgb = plain ? [255, 255, 255, 1] : (resolveColor(color, el) ?? [255, 255, 255, 1]);
  const lamp = new THREE.PointLight(new THREE.Color(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`), lampStrength * Math.PI * height * height, 0, 2);
  lamp.position.set(light.x * box.width, -light.y * box.height, height);
  scene.add(lamp);

  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setSize(W, H, false);
  renderer.render(scene, camera);
  out.width = W;
  out.height = H;
  out.getContext('2d')?.drawImage(renderer.domElement, 0, 0);
  geometry.dispose();
  material.dispose();
  texture.dispose();
  return true;
}
