// The lens renderer: one WebGL canvas behind a group of glass on artwork. It draws the artwork (as a
// texture) bent at each glass shape's curved edge, plus the glass's body, rim, inner highlight and
// shadow, all lit from the page's one light. Text never goes through here: it stays HTML on top.
// The math matches lens-math.ts; keep the two in step.

export const MAX_LENS_RECTS = 16;

/** One piece of glass, in canvas device pixels. */
export interface LensRect {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Corner radius, already clamped to half the smaller side. */
  r: number;
  /** Light strength at this glass (0 to 1), from useGlassLight's distance falloff. */
  k: number;
  /** The glass's opacity (a disabled tile is half see-through). */
  alpha: number;
  /** How far the shadow falls, as a multiple of the token (hover lifts the glass a little). */
  lift: number;
}

/** A color as 0 to 1 floats: red, green, blue and alpha (the alpha is the strength). */
export type Rgba = [number, number, number, number];

/** The glass's look, from the theme's glass.lens tokens. Lengths in device pixels. */
export interface LensLook {
  body: Rgba;
  tint: Rgba;
  rimLit: Rgba;
  rimFaint: Rgba;
  highlight: Rgba;
  shadow: Rgba;
  rimWidth: number;
  shadowDistance: number;
  shadowBlur: number;
  bend: number;
  edgeDepth: number;
  split: number;
}

export interface LensFrame {
  /** The light, in canvas device pixels (0,0 is the canvas's top left). */
  light: [number, number];
  dpr: number;
  rects: LensRect[];
  look: LensLook;
}

export interface LensRenderer {
  /** Uploads the artwork behind the glass. Its size is the canvas's size. */
  setArt(source: TexImageSource): void;
  draw(frame: LensFrame): void;
  /** False once the browser has taken the context away. */
  readonly ok: boolean;
  dispose(): void;
}

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
#define MAX ${MAX_LENS_RECTS}
uniform sampler2D art;
uniform vec2 res;
uniform vec2 light;
uniform vec4 rects[MAX];
uniform vec4 props[MAX]; // radius, light strength, opacity, lift
uniform int count;
uniform float dpr, bend, bezel, split, rimWidth, shadowDist, shadowBlur;
uniform vec4 body, tint, rimLit, rimFaint, highlight, shadowColor;

float sdBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.) + length(max(q, 0.)) - r;
}
vec4 artAt(vec2 p) { return texture2D(art, clamp(p / res, 0., 1.)); }

void main() {
  vec2 p = vec2(gl_FragCoord.x, res.y - gl_FragCoord.y);

  // Shadows, the way a trained painter sees them. The glass floats a little above the page:
  // - Key shadow: its shape, thrown away from the sun. The farther the sun, the longer the throw; the
  //   higher the glass, the wider and softer the penumbra, and the smaller and paler the dark core.
  // - Ambient occlusion: a broad, faint darkening right beneath it, where it blocks light from the sky.
  // - Glass passes light, so its shadow is pale in the middle and darker along the outline, where the
  //   thick edge bends the light away. Just inside that outline the bent light gathers (a caustic).
  // - A shadow deepens the surface it falls on and keeps that surface's own color, a touch cooler.
  float sh = 0.;
  float pool = 0.;
  for (int i = 0; i < MAX; i++) {
    if (i >= count) break;
    vec4 r = rects[i];
    vec4 pr = props[i];
    vec2 h = r.zw * .5;
    vec2 c = r.xy + h;
    vec2 toward = c - light;
    float far = length(toward) + 1e-4;
    vec2 dir = toward / far;
    float height = max(shadowDist * pr.w, dpr);
    float len = clamp(height * far / (600. * dpr), height * .3, height * 2.5);
    float soft = max(shadowBlur * pr.w, dpr);
    float w = soft * 1.3 + len * .5;
    float dk = sdBox(p - c - dir * len, max(h - w * .15, vec2(1.)), pr.x);
    float key = 1. - smoothstep(-w, w * 1.2, dk);
    float d0 = sdBox(p - c, h, pr.x);
    float amb = 1. - smoothstep(-soft * .3, soft * 1.3, d0);
    float bz = max(min(bezel, min(h.x, h.y) * .95), dpr);
    float outline = 1. - smoothstep(-bz * .5, bz * 1.6, -dk);
    float density = mix(.65, 1., outline);
    float sI = 1. - (1. - key * density * .75) * (1. - amb * .25);
    sh = max(sh, clamp(sI * shadowColor.a * .7, 0., .5) * pr.z);
    float ring = smoothstep(0., bz * .6, -dk) * (1. - smoothstep(bz * .6, bz * 2.2, -dk));
    pool = max(pool, ring * key * pr.y * pr.z);
  }
  // Shadows and the caustic fall only outside the glass, so clear glass never shows them through it.
  float inside = 0.;
  for (int i = 0; i < MAX; i++) {
    if (i >= count) break;
    vec2 h = rects[i].zw * .5;
    inside = max(inside, 1. - smoothstep(-dpr, 0., sdBox(p - rects[i].xy - h, h, props[i].x)));
  }
  sh *= 1. - inside;
  pool *= 1. - inside;
  // Transparent dark keeps the surface's own hue as it deepens it; a little blue cools it. The caustic is
  // warm light, like the sun.
  vec3 warm = vec3(1., .93, .8);
  vec3 caustic = warm * rimLit.a * pool * .4;
  vec4 outc = vec4(vec3(.35, .45, .7) * sh * .1 + caustic, max(sh, max(caustic.r, max(caustic.g, caustic.b))));

  // The glass: the art bent at the curved edge, a faint body and tint, a rim facing the light.
  for (int i = 0; i < MAX; i++) {
    if (i >= count) break;
    vec4 r = rects[i];
    vec4 pr = props[i];
    vec2 h = r.zw * .5;
    vec2 c = r.xy + h;
    float rad = pr.x;
    float d = sdBox(p - c, h, rad);
    if (d < dpr) {
      float e = .75 * dpr;
      vec2 n = normalize(vec2(
        sdBox(p - c + vec2(e, 0.), h, rad) - sdBox(p - c - vec2(e, 0.), h, rad),
        sdBox(p - c + vec2(0., e), h, rad) - sdBox(p - c - vec2(0., e), h, rad)) + 1e-5);
      float bz = max(min(bezel, min(h.x, h.y) * .95), 1e-3);
      float t = clamp(1. - (-d) / bz, 0., 1.);
      // A rounded bevel: the surface tilts most at the very edge, so the art bends most there.
      float tilt = 1. - sqrt(1. - t * t);
      vec2 off = -n * tilt * bz * bend;
      // The art can be clear (clearArt: glass on a background the system doesn't paint), so the glass is
      // built premultiplied: the bent art, then the body and tint over it, then the light added on top.
      vec4 mid = artAt(p + off);
      // Blue bends more than red, as in real glass, so the fringes run warm on one side and cool on the other.
      vec4 q = vec4(vec3(artAt(p + off * (1. - split)).r, mid.g, artAt(p + off * (1. + split)).b) * mid.a, mid.a);
      q = vec4(body.rgb * body.a, body.a) + q * (1. - body.a);
      q = vec4(tint.rgb * tint.a, tint.a) + q * (1. - tint.a);
      // Light: the rim facing the light is brightest; a soft band inside it catches the light too.
      vec2 L = normalize(light - p + 1e-4);
      float facing = max(dot(n, L), 0.);
      float k = pr.y;
      float rim = 1. - smoothstep(0., rimWidth * 1.2, abs(d + rimWidth * .5));
      float band = smoothstep(.55, 1., t);
      // The edge of real glass: a thin bright line nearly all the way round (it reflects more at a grazing
      // angle), brightest at two opposite points: where the light comes in, and across from it, where light
      // that went through reflects back out from inside. The sides in between stay dimmer.
      float align = dot(n, L);
      float across = max(-align, 0.);
      float spec = (1. - smoothstep(0., rimWidth * 2.5, abs(d + rimWidth))) * pow(facing, 12.) * k;
      vec3 lit = rim * (rimFaint.rgb * rimFaint.a + rimLit.rgb * rimLit.a * (pow(facing, 2.) + .7 * pow(across, 2.)) * k)
        + spec * rimLit.rgb * rimLit.a
        + band * highlight.rgb * highlight.a * (pow(facing, 3.) + .5 * pow(across, 3.)) * k;
      // Light that went through comes out just inside the far edge as a soft warm glow.
      float exitGlow = exp(-pow((-d - bz * .15) / (bz * .12), 2.)) * pow(across, 2.) * k;
      lit += vec3(1., .93, .8) * highlight.a * exitGlow * .25;
      // The whole form turns from the light: a little lighter on the side that faces it.
      float side = clamp(dot((p - c) / max(h, vec2(1.)), normalize(light - c + 1e-4)) * .5 + .5, 0., 1.);
      lit += highlight.rgb * highlight.a * .1 * side * side * k;
      // Light on clear glass shows as much as it's bright. On art that fills the frame (q.a is 1) this is
      // the same as before: the art, body and tint, plus the light, clamped.
      q.a = clamp(max(q.a, max(lit.r, max(lit.g, lit.b))), 0., 1.);
      q.rgb = min(q.rgb + lit, vec3(q.a));
      float a = (1. - smoothstep(-.5 * dpr, .5 * dpr, d)) * pr.z;
      outc = q * a + outc * (1. - q.a * a);
    }
  }
  gl_FragColor = outc;
}`;

/** Makes a renderer on the canvas, or returns null when WebGL isn't available (the caller falls back). */
export function createLensRenderer(canvas: HTMLCanvasElement): LensRenderer | null {
  let gl: WebGLRenderingContext | null = null;
  try {
    gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false }) as WebGLRenderingContext | null;
  } catch {
    gl = null;
  }
  if (!gl || typeof gl.createShader !== 'function') return null;
  const g = gl;

  let program: WebGLProgram | null = null;
  let texture: WebGLTexture | null = null;
  let uniforms: Record<string, WebGLUniformLocation | null> = {};
  let hasArt = false;

  const build = () => {
    const shader = (type: number, src: string) => {
      const s = g.createShader(type);
      if (!s) throw new Error('lens: no shader');
      g.shaderSource(s, src);
      g.compileShader(s);
      if (!g.getShaderParameter(s, g.COMPILE_STATUS)) throw new Error(`lens: ${g.getShaderInfoLog(s)}`);
      return s;
    };
    const pr = g.createProgram();
    if (!pr) throw new Error('lens: no program');
    g.attachShader(pr, shader(g.VERTEX_SHADER, VERT));
    g.attachShader(pr, shader(g.FRAGMENT_SHADER, FRAG));
    g.linkProgram(pr);
    if (!g.getProgramParameter(pr, g.LINK_STATUS)) throw new Error(`lens: ${g.getProgramInfoLog(pr)}`);
    g.useProgram(pr);
    const buf = g.createBuffer();
    g.bindBuffer(g.ARRAY_BUFFER, buf);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW);
    const loc = g.getAttribLocation(pr, 'a');
    g.enableVertexAttribArray(loc);
    g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
    const tex = g.createTexture();
    g.activeTexture(g.TEXTURE0);
    g.bindTexture(g.TEXTURE_2D, tex);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
    program = pr;
    texture = tex;
    uniforms = {};
    for (const n of ['art', 'res', 'light', 'rects', 'props', 'count', 'dpr', 'bend', 'bezel', 'split', 'rimWidth', 'shadowDist', 'shadowBlur', 'body', 'tint', 'rimLit', 'rimFaint', 'highlight', 'shadowColor'])
      uniforms[n] = g.getUniformLocation(pr, n);
    hasArt = false;
  };

  try {
    build();
  } catch {
    return null;
  }

  // A lost context comes back empty: rebuild the program and wait for the art again.
  canvas.addEventListener('webglcontextrestored', () => {
    try {
      build();
    } catch {
      program = null;
    }
  });

  const rects = new Float32Array(MAX_LENS_RECTS * 4);
  const props = new Float32Array(MAX_LENS_RECTS * 4);

  return {
    get ok() {
      return !!program && !g.isContextLost();
    },
    setArt(source) {
      if (!program || g.isContextLost()) return;
      g.bindTexture(g.TEXTURE_2D, texture);
      g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, false);
      g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, source);
      hasArt = true;
    },
    draw({ light, dpr, rects: list, look }) {
      if (!program || g.isContextLost()) return;
      g.viewport(0, 0, canvas.width, canvas.height);
      g.clearColor(0, 0, 0, 0);
      g.clear(g.COLOR_BUFFER_BIT);
      if (!hasArt) return;
      const n = Math.min(list.length, MAX_LENS_RECTS);
      rects.fill(0);
      props.fill(0);
      for (let i = 0; i < n; i++) {
        const r = list[i];
        rects.set([r.x, r.y, r.w, r.h], i * 4);
        props.set([r.r, r.k, r.alpha, r.lift], i * 4);
      }
      const u = uniforms;
      g.uniform1i(u.art, 0);
      g.uniform2f(u.res, canvas.width, canvas.height);
      g.uniform2f(u.light, light[0], light[1]);
      g.uniform4fv(u.rects, rects);
      g.uniform4fv(u.props, props);
      g.uniform1i(u.count, n);
      g.uniform1f(u.dpr, dpr);
      g.uniform1f(u.bend, look.bend);
      g.uniform1f(u.bezel, look.edgeDepth);
      g.uniform1f(u.split, look.split);
      g.uniform1f(u.rimWidth, look.rimWidth);
      g.uniform1f(u.shadowDist, look.shadowDistance);
      g.uniform1f(u.shadowBlur, look.shadowBlur);
      g.uniform4fv(u.body, look.body);
      g.uniform4fv(u.tint, look.tint);
      g.uniform4fv(u.rimLit, look.rimLit);
      g.uniform4fv(u.rimFaint, look.rimFaint);
      g.uniform4fv(u.highlight, look.highlight);
      g.uniform4fv(u.shadowColor, look.shadow);
      g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
    },
    dispose() {
      try {
        if (texture) g.deleteTexture(texture);
        if (program) g.deleteProgram(program);
        g.getExtension('WEBGL_lose_context')?.loseContext();
      } catch {
        // Already gone.
      }
      program = null;
    },
  };
}
