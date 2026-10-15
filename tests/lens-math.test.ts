// The lens's math (src/components/glass-lens/lens-math.ts): the shapes, the bevel, the light and
// the motion. The fragment shader does the same math per pixel.
import { describe, expect, it } from 'vitest';
import {
  bevelTilt,
  capDpr,
  clampRadius,
  edgeDepth,
  lensOffset,
  lightDirection,
  lightStrength,
  easeToward,
  pressSwell,
  sdNormal,
  sdRoundBox,
  swellRect,
  tiltMoving,
  tiltRest,
  tiltStep,
} from '../src/components/glass-lens/lens-math';

describe('corner radius', () => {
  it('is clamped to half the smaller side, as browsers draw it', () => {
    // A 21px radius on a 38px tall pill draws as 19px.
    expect(clampRadius(21, 120, 38)).toBe(19);
    expect(clampRadius(12, 24, 24)).toBe(12);
    expect(clampRadius(9999, 80, 24)).toBe(12);
    expect(clampRadius(8, 100, 40)).toBe(8);
  });
  it('is never negative or NaN', () => {
    expect(clampRadius(-4, 10, 10)).toBe(0);
    expect(clampRadius(Number.NaN, 10, 10)).toBe(0);
  });
  it('makes a pill a true stadium: the end is a half circle', () => {
    // 120 x 38 with a too-big radius: every point on the round end is exactly 19 from its center.
    const hw = 60;
    const hh = 19;
    const cx = hw - hh;
    for (const a of [-80, -45, 0, 45, 80]) {
      const t = (a * Math.PI) / 180;
      expect(sdRoundBox(cx + 19 * Math.cos(t), 19 * Math.sin(t), hw, hh, 21)).toBeCloseTo(0, 6);
    }
  });
});

describe('distance field', () => {
  it('is negative inside, zero on the edge and positive outside', () => {
    expect(sdRoundBox(0, 0, 50, 20, 8)).toBeCloseTo(-20);
    expect(sdRoundBox(50, 0, 50, 20, 8)).toBeCloseTo(0);
    expect(sdRoundBox(60, 0, 50, 20, 8)).toBeCloseTo(10);
  });
  it('rounds the corners', () => {
    // The corner of the box is outside a rounded box, by r * (sqrt 2 - 1).
    expect(sdRoundBox(50, 20, 50, 20, 8)).toBeCloseTo(8 * (Math.SQRT2 - 1));
  });
  it('has normals that point straight out on the sides and diagonally at the corners', () => {
    const [rx, ry] = sdNormal(48, 0, 50, 20, 8);
    expect(rx).toBeCloseTo(1);
    expect(ry).toBeCloseTo(0);
    const [tx, ty] = sdNormal(0, -18, 50, 20, 8);
    expect(tx).toBeCloseTo(0);
    expect(ty).toBeCloseTo(-1);
    const [cx, cy] = sdNormal(47, 17, 50, 20, 8);
    expect(cx).toBeCloseTo(Math.SQRT1_2, 2);
    expect(cy).toBeCloseTo(Math.SQRT1_2, 2);
  });
});

describe('rounded bevel', () => {
  it('is flat in the middle and tilts most at the edge', () => {
    expect(bevelTilt(0)).toBe(0);
    expect(bevelTilt(1)).toBe(1);
    expect(bevelTilt(0.5)).toBeCloseTo(1 - Math.sqrt(0.75));
    // Steepest at the edge: the last tenth tilts more than the first half.
    expect(bevelTilt(1) - bevelTilt(0.9)).toBeGreaterThan(bevelTilt(0.5) - bevelTilt(0));
  });
  it('clamps the edge depth to 95% of half the height', () => {
    expect(edgeDepth(22, 300, 120)).toBe(22);
    expect(edgeDepth(22, 120, 32)).toBeCloseTo(15.2);
  });
  it('bends the art inward at the edge, not at all in the middle, and never outside', () => {
    expect(lensOffset(0, 0, 100, 40, 12, 22, 1)).toEqual([0, 0]);
    expect(lensOffset(120, 0, 100, 40, 12, 22, 1)).toEqual([0, 0]);
    const [ox, oy] = lensOffset(99.5, 0, 100, 40, 12, 22, 1);
    expect(ox).toBeLessThan(-5); // pulls the art from further in
    expect(oy).toBeCloseTo(0);
    // offset = -normal * (1 - sqrt(1 - t^2)) * depth * bend
    const t = 1 - 10 / 22;
    expect(lensOffset(90, 0, 100, 40, 12, 22, 1)[0]).toBeCloseTo(-(1 - Math.sqrt(1 - t * t)) * 22);
    expect(lensOffset(90, 0, 100, 40, 12, 22, 2)[0]).toBeCloseTo(2 * lensOffset(90, 0, 100, 40, 12, 22, 1)[0]);
  });
});

describe('light', () => {
  it('points from the glass toward the light', () => {
    expect(lightDirection(10, 0, 0, 0)).toEqual([1, 0]);
    const [x, y] = lightDirection(100, -100, 0, 0);
    expect(x).toBeCloseTo(Math.SQRT1_2);
    expect(y).toBeCloseTo(-Math.SQRT1_2);
  });
  it('weakens with distance, like useGlassLight', () => {
    expect(lightStrength(0, 500)).toBe(1);
    expect(lightStrength(500, 500)).toBeCloseTo(0.5);
    expect(lightStrength(1000, 500, 0.8)).toBeCloseTo(0.16);
  });
  it('caps the pixel ratio at 2', () => {
    expect(capDpr(3)).toBe(2);
    expect(capDpr(1.5)).toBe(1.5);
    expect(capDpr(undefined)).toBe(1);
  });
});

describe('press', () => {
  it('swells, then settles back to rest by the end', () => {
    expect(pressSwell(0, 300)).toBe(0);
    expect(pressSwell(120, 300)).toBeCloseTo(1);
    // Starts gently: a third of the way into the rise it has swollen well under half.
    expect(pressSwell(40, 300)).toBeLessThan(0.4);
    expect(pressSwell(200, 300)).toBeGreaterThan(0);
    expect(pressSwell(200, 300)).toBeLessThan(1);
    expect(pressSwell(300, 300)).toBe(0);
    expect(pressSwell(1000, 300)).toBe(0);
  });
  it('grows the shape around its center and keeps its radius clamped', () => {
    const r = swellRect(0, 0, 100, 38, 19, 1.02);
    expect(r.w).toBeCloseTo(102);
    expect(r.x).toBeCloseTo(-1);
    expect(r.r).toBeCloseTo(19.38);
    expect(r.r).toBeLessThanOrEqual(r.h / 2);
  });
});

describe('phone tilt', () => {
  it('nudges toward the tilt, smoothed, then eases back when the phone is still', () => {
    let s = tiltStep(tiltRest, { beta: 40, gamma: 0 }, 16);
    expect(s.x).toBe(0);
    s = tiltStep(s, { beta: 40, gamma: 10 }, 16);
    expect(s.x).toBeGreaterThan(0);
    expect(s.x).toBeLessThan(0.5); // smoothed, not a jump
    for (let i = 0; i < 20; i++) s = tiltStep(s, null, 16);
    const peak = s.x;
    expect(peak).toBeGreaterThan(0.2);
    for (let i = 0; i < 600; i++) s = tiltStep(s, null, 16);
    expect(Math.abs(s.x)).toBeLessThan(0.01);
    expect(tiltMoving(s)).toBe(false);
  });
  it('never nudges more than the full amount', () => {
    let s = tiltStep(tiltRest, { beta: 0, gamma: 0 }, 16);
    for (let i = 0; i < 100; i++) s = tiltStep(s, { beta: 0, gamma: 90 }, 16);
    expect(s.x).toBeLessThanOrEqual(1);
  });
  it('ignores empty readings', () => {
    expect(tiltStep(tiltRest, { beta: null, gamma: null }, 16)).toEqual(tiltRest);
  });
});

describe('easing toward a target', () => {
  it('glides part of the way each frame, whatever the frame rate', () => {
    expect(easeToward(0, 1, 100, 100)).toBeCloseTo(1 - Math.exp(-1));
    // Two 50ms frames land where one 100ms frame does.
    expect(easeToward(easeToward(0, 1, 50, 100), 1, 50, 100)).toBeCloseTo(easeToward(0, 1, 100, 100));
    expect(easeToward(0, 1, 1000, 100)).toBeGreaterThan(0.99);
  });
  it('jumps straight there with reduced motion (no time to ease)', () => {
    expect(easeToward(0, 1, 16, 0)).toBe(1);
  });
});
