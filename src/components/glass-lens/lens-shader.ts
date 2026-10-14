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
vec3 artAt(vec2 p) { return texture2D(art, clamp(p / res, 0., 1.)).rgb; }

void main() {
  vec2 p = vec2(gl_FragCoord.x, res.y - gl_FragCoord.y);

  // Soft shadows, cast away from the light.
  float sh = 0.;
  for (int i = 0; i < MAX; i++) {
    if (i >= count) break;
    vec4 r = rects[i];
    vec4 pr = props[i];
    vec2 h = r.zw * .5;
    vec2 c = r.xy + h;
    vec2 away = normalize(c - light + 1e-4) * shadowDist * pr.w;
    float ds = sdBox(p - c - away, h, pr.x);
    sh = max(sh, (1. - smoothstep(0., max(shadowBlur * pr.w, 1.), ds)) * shadowColor.a * pr.z);
  }
  vec4 outc = vec4(shadowColor.rgb * sh, sh);

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
      vec3 g = vec3(artAt(p + off * (1. + split)).r, artAt(p + off).g, artAt(p + off * (1. - split)).b);
      g = mix(g, body.rgb, body.a);
      g = mix(g, tint.rgb, tint.a);
      // Light: the rim facing the light is brightest; a soft band inside it catches the light too.
      vec2 L = normalize(light - p + 1e-4);
      float facing = max(dot(n, L), 0.);
      float k = pr.y;
      float rim = 1. - smoothstep(0., rimWidth * 1.2, abs(d + rimWidth * .5));
      float band = smoothstep(.55, 1., t);
      g += rim * (rimFaint.rgb * rimFaint.a + rimLit.rgb * rimLit.a * pow(facing, 2.) * k);
      g += band * highlight.rgb * highlight.a * pow(facing, 3.) * k;
      float a = (1. - smoothstep(-.5 * dpr, .5 * dpr, d)) * pr.z;
      outc = vec4(clamp(g, 0., 1.) * a, a) + outc * (1. - a);
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
