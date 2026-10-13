// The lens's math, kept apart from WebGL and the DOM so it can be tested on its own.
// The fragment shader (lens-shader.ts) does the same math per pixel; keep the two in step.
//
// Shapes are rounded boxes described by a signed distance field: negative inside, 0 on the edge,
// positive outside. The glass bends what's behind it like a rounded bevel: flat (clear) in the
// middle, tilting more and more toward the edge, so the art bends most at the very edge.

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * The corner radius a browser actually draws: CSS clamps a radius to half the element's smaller
 * side (a 21px radius on a 38px tall pill draws as 19px). The shader must use the same radius, or the
 * glass comes out pinched and egg shaped instead of matching the HTML.
 */
export function clampRadius(radius: number, width: number, height: number) {
  if (!Number.isFinite(radius) || radius < 0) return 0;
  return Math.max(0, Math.min(radius, width / 2, height / 2));
}

/**
 * Signed distance from a point to a rounded box, the point measured from the box's center.
 * halfW and halfH are half the box's size. The radius is clamped like CSS does.
 */
export function sdRoundBox(px: number, py: number, halfW: number, halfH: number, radius: number) {
  const r = clampRadius(radius, halfW * 2, halfH * 2);
  const qx = Math.abs(px) - halfW + r;
  const qy = Math.abs(py) - halfH + r;
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - r;
}

/** The outward normal at a point (the distance field's gradient, by central differences). */
export function sdNormal(px: number, py: number, halfW: number, halfH: number, radius: number, e = 0.75): [number, number] {
  const nx = sdRoundBox(px + e, py, halfW, halfH, radius) - sdRoundBox(px - e, py, halfW, halfH, radius);
  const ny = sdRoundBox(px, py + e, halfW, halfH, radius) - sdRoundBox(px, py - e, halfW, halfH, radius);
  const len = Math.hypot(nx, ny);
  return len < 1e-9 ? [0, 0] : [nx / len, ny / len];
}

/** How far in from the edge the glass bends: the edge depth token, at most 95% of half the element's smaller side. */
export function edgeDepth(depth: number, width: number, height: number) {
  return Math.max(0, Math.min(depth, 0.95 * (Math.min(width, height) / 2)));
}

/**
 * The rounded bevel's profile. t is 0 where the bevel starts (inside) and 1 at the very edge.
 * Returns how much the surface tilts there: 0 in the flat middle, rising steeply to 1 at the edge,
 * like a quarter circle.
 */
export function bevelTilt(t: number) {
  const c = clamp01(t);
  return 1 - Math.sqrt(1 - c * c);
}

/**
 * How far to shift the art sampled at a point inside the glass, in the same units as the input:
 * offset = -normal * (1 - sqrt(1 - t*t)) * depth * bend. Zero outside the bevel and outside the glass.
 */
export function lensOffset(px: number, py: number, halfW: number, halfH: number, radius: number, depth: number, bend: number): [number, number] {
  const d = sdRoundBox(px, py, halfW, halfH, radius);
  const bz = edgeDepth(depth, halfW * 2, halfH * 2);
  if (d > 0 || bz <= 0) return [0, 0];
  const t = clamp01(1 - -d / bz);
  const tilt = bevelTilt(t);
  if (tilt === 0) return [0, 0];
  const [nx, ny] = sdNormal(px, py, halfW, halfH, radius);
  const s = tilt * bz * bend;
  return [-nx * s || 0, -ny * s || 0];
}

/** Which way the light comes from, as a unit vector from a point toward the light. */
export function lightDirection(lightX: number, lightY: number, x: number, y: number): [number, number] {
  const dx = lightX - x;
  const dy = lightY - y;
  const len = Math.hypot(dx, dy);
  return len < 1e-9 ? [0, -1] : [dx / len, dy / len];
}

/** The light's strength at a distance: peak right next to it, softer farther away (same as useGlassLight). */
export function lightStrength(distance: number, reach: number, peak = 1) {
  if (reach <= 0) return peak;
  return peak / (1 + (distance / reach) ** 2);
}

/** Device pixel ratio for the lens canvas: at least 1, at most 2. */
export function capDpr(dpr: number | undefined) {
  return Math.min(2, Math.max(1, Number.isFinite(dpr) && dpr ? dpr : 1));
}

/**
 * Press: how swollen the glass is, 0 to 1, a given time after the press. It swells quickly (the first
 * quarter), then settles back to rest by the end. Returns 0 once the time is up.
 */
export function pressSwell(elapsed: number, duration: number) {
  if (!(duration > 0) || elapsed < 0 || elapsed >= duration) return 0;
  const rise = duration * 0.25;
  if (elapsed < rise) {
    const t = elapsed / rise;
    return 1 - (1 - t) * (1 - t); // ease out
  }
  const t = (elapsed - rise) / (duration - rise);
  return 1 - t * t * (3 - 2 * t); // smooth settle
}

/** A rectangle grown around its center by a scale (the press swell), with its radius grown too and clamped. */
export function swellRect(x: number, y: number, w: number, h: number, radius: number, scale: number) {
  const nw = w * scale;
  const nh = h * scale;
  return { x: x - (nw - w) / 2, y: y - (nh - h) / 2, w: nw, h: nh, r: clampRadius(radius * scale, nw, nh) };
}

/**
 * Phone tilt. Device orientation nudges the light a little, so highlights drift as the phone moves.
 * A slow-moving "rest" follows the phone's position, so holding the phone at any angle is rest, and
 * the nudge eases back to nothing when the phone is still. The nudge itself is smoothed so it never
 * jitters. x and y run from -1 to 1 (times the tilt reach, in px, gives the light's shift).
 */
export interface TiltState {
  /** The resting angles the phone is held at, in degrees (null until the first reading). */
  restBeta: number | null;
  restGamma: number | null;
  /** The latest reading. */
  beta: number;
  gamma: number;
  /** The smoothed nudge, -1 to 1. */
  x: number;
  y: number;
}

export const tiltRest: TiltState = { restBeta: null, restGamma: null, beta: 0, gamma: 0, x: 0, y: 0 };

export interface TiltTuning {
  /** Degrees of tilt away from rest that give the full nudge. */
  fullTilt: number;
  /** How long the rest takes to catch up with the phone, in ms (time constant). */
  restMs: number;
  /** How long the nudge takes to follow the phone, in ms (time constant). */
  smoothMs: number;
}

export const tiltTuning: TiltTuning = { fullTilt: 20, restMs: 1200, smoothMs: 140 };

/** Moves the tilt state forward by dt ms, with a new reading or none. */
export function tiltStep(state: TiltState, reading: { beta: number | null; gamma: number | null } | null, dt: number, tuning: TiltTuning = tiltTuning): TiltState {
  let { restBeta, restGamma, beta, gamma } = state;
  if (reading && reading.beta != null && reading.gamma != null && Number.isFinite(reading.beta) && Number.isFinite(reading.gamma)) {
    beta = reading.beta;
    gamma = reading.gamma;
    if (restBeta == null || restGamma == null) {
      restBeta = beta;
      restGamma = gamma;
    }
  }
  if (restBeta == null || restGamma == null) return { ...state };
  const step = Math.max(0, dt);
  const restK = 1 - Math.exp(-step / tuning.restMs);
  restBeta += (beta - restBeta) * restK;
  restGamma += (gamma - restGamma) * restK;
  const clamp1 = (v: number) => Math.max(-1, Math.min(1, v));
  const tx = clamp1((gamma - restGamma) / tuning.fullTilt);
  const ty = clamp1((beta - restBeta) / tuning.fullTilt);
  const k = 1 - Math.exp(-step / tuning.smoothMs);
  return { restBeta, restGamma, beta, gamma, x: state.x + (tx - state.x) * k, y: state.y + (ty - state.y) * k };
}

/** True while the tilt nudge is still visibly moving or away from rest. */
export function tiltMoving(state: TiltState, epsilon = 0.002) {
  if (state.restBeta == null || state.restGamma == null) return false;
  return Math.abs(state.x) > epsilon || Math.abs(state.y) > epsilon || Math.abs(state.beta - state.restBeta) > 0.05 || Math.abs(state.gamma - state.restGamma) > 0.05;
}
