import type * as Three from 'three';
import { sharedRenderer } from '../components/orb/orb-render';

// Lantern's cover, lit by its own orb (D60). Sharon's drawing stays the drawing: its glow, the glass's
// inside and the orb are kept as drawn. The renderer (three.js, the one renderer the orbs share) adds
// what real light does, and nothing else:
// - Glass: a clear glass globe the window's shape, in front of the drawn inside, so it bends the
//   orb's glow a little toward the edges.
// - Copper: her shapes as a shallow relief seen straight on, so it stays flat. The parts sit as a real
//   lantern's do: the handle behind the cap with its ends tucked in, the glass and its ring seated into
//   the cap and the base. Front faces look away from the orb, so they keep exactly her color (even light
//   at the page's brightness, D59); only the edges the orb can reach catch its light (the ring's inner
//   edge, the cap's lower lip, the base's upper lip), and the handle is in the cap's shadow. The light
//   is the name's peach, so the copper picks up the word's color, never brighter than the word.
// - Floor: the orb lights the floor and the base shades it, seen from as high as her shadow's
//   flatness says; the shadow is as soft as the orb is big. Drawn as light only, added to the ground.
// Without 3D, or if anything can't be drawn, the cover keeps the drawing exactly as it is. Nothing moves.

// The mark's drawing (lantern-mark.svg, 160 x 175 units). Keep in step with it.
const MARK = {
  cap: { x: 56, y: 38, w: 48, h: 12, r: 4 },
  base: { x: 58, y: 116, w: 44, h: 12, r: 4 },
  window: { x: 54, y: 50, w: 52, h: 66, r: 18 },
  ring: 3.5,
  handle: { cx: 80, cy: 38, r: 17.6, stroke: 5 },
  orb: { cx: 80, cy: 84, r: 11 },
  shadow: { cy: 150, rx: 44, ry: 7 },
  copper: '#8a4f27',
  windowFill: { color: '#fff6e8', opacity: 0.04 },
};
// The name's color: the light the copper picks up, and the brightest it may get.
const NAME = '#f7c9a6';
// The orb's own color (its gradient's middle stop): the light on the floor.
const ORB = '#ffe3b0';
// Parts of the drawing the renderer redraws, so the drawn ones are hidden once it has.
const REDRAWN = ['floor', 'copper', 'lip', 'accent'];

type THREE = typeof Three;
interface Mark {
  left: number;
  top: number;
  scale: number;
  coverW: number;
  coverH: number;
  ground: string;
  svg: SVGSVGElement;
}

/** Lights the cover in place: `cover` holds the mark (`svg.mark`) and the text. Safe to call twice. */
export async function lightCover(cover: HTMLElement | null) {
  if (!cover || cover.dataset.lit) return;
  const svg = cover.querySelector<SVGSVGElement>('svg.mark');
  if (!svg) return;
  let three;
  try {
    three = await sharedRenderer();
  } catch {
    return; // No 3D here: the drawing stays as it is.
  }
  const style = getComputedStyle(svg);
  const width = svg.width.baseVal.value;
  const mark: Mark = {
    left: parseFloat(style.left) || 0,
    top: parseFloat(style.top) || 0,
    scale: width / 160,
    coverW: cover.clientWidth,
    coverH: cover.clientHeight,
    ground: getComputedStyle(cover).backgroundColor,
    svg,
  };
  const { THREE, renderer } = three;
  const saved = { toneMapping: renderer.toneMapping, shadows: renderer.shadowMap.enabled };
  try {
    const floor = drawFloor(THREE, renderer, mark);
    const glass = await drawGlass(THREE, renderer, mark);
    const copper = drawCopper(THREE, renderer, mark);
    if (cover.dataset.lit) return;
    svg.before(floor);
    svg.after(glass, copper, accents(svg));
    for (const el of Array.from(svg.querySelectorAll<SVGElement>('[data-lm]'))) if (REDRAWN.includes(el.dataset.lm ?? '')) el.style.visibility = 'hidden';
    cover.dataset.lit = 'true';
  } catch {
    // Anything the renderer couldn't draw: the drawing stays as it is.
  } finally {
    renderer.setRenderTarget(null);
    renderer.toneMapping = saved.toneMapping;
    renderer.shadowMap.enabled = saved.shadows;
  }
}

const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

function layer(canvas: HTMLCanvasElement, x: number, y: number, w: number, h: number) {
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, { position: 'absolute', left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, pointerEvents: 'none' });
  return canvas;
}

/** Her small curved highlights, on top of the lit copper. */
function accents(svg: SVGSVGElement) {
  const copy = svg.cloneNode(true) as SVGSVGElement;
  for (const el of Array.from(copy.children)) if (el.tagName !== 'defs' && (el as SVGElement).dataset.lm !== 'accent') el.remove();
  copy.removeAttribute('role');
  copy.removeAttribute('aria-label');
  copy.setAttribute('aria-hidden', 'true');
  copy.style.pointerEvents = 'none';
  return copy;
}

/** Linear light, averaged from `sum`, as an sRGB picture. */
function toCanvas(sum: Float32Array, W: number, H: number) {
  const out = document.createElement('canvas');
  out.width = W;
  out.height = H;
  const ctx = out.getContext('2d');
  if (!ctx) throw new Error('No 2D canvas.');
  const img = ctx.createImageData(W, H);
  const enc = (c: number) => {
    c = Math.max(0, Math.min(1, c));
    return c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;
  };
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const s = ((H - 1 - y) * W + x) * 4;
      const d = (y * W + x) * 4;
      for (let k = 0; k < 3; k++) img.data[d + k] = Math.round(255 * enc(sum[s + k]));
      img.data[d + 3] = 255;
    }
  ctx.putImageData(img, 0, 0);
  return out;
}

/** A point inside the unit ball, for sampling a light that has a size. */
function inBall() {
  for (;;) {
    const p = [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1];
    if (p[0] ** 2 + p[1] ** 2 + p[2] ** 2 <= 1) return p;
  }
}

// ---- The floor: the orb's light on it, and the base's shadow.
function drawFloor(THREE: THREE, renderer: Three.WebGLRenderer, m: Mark) {
  const S = m.scale;
  const r = dpr();
  const W = Math.round(m.coverW * r);
  const H = Math.round(m.coverH * r);
  // Seen from just above: a circle on the floor looks as flat as her shadow.
  const tilt = Math.asin(MARK.shadow.ry / MARK.shadow.rx);
  const cos = Math.cos(tilt);
  const at = (v: number) => m.top + S * v; // a drawing height on the cover
  const floorY = at(MARK.shadow.cy);
  const orbH = (floorY - at(MARK.orb.cy)) / cos;
  const baseLow = (floorY - at(MARK.base.y + MARK.base.h)) / cos;
  const centerX = m.left + S * MARK.orb.cx;

  const scene = new THREE.Scene();
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(20000, 20000), new THREE.MeshStandardMaterial({ color: new THREE.Color(m.ground), roughness: 1, metalness: 0 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  const base = new THREE.Mesh(new THREE.CylinderGeometry((S * MARK.base.w) / 2, (S * MARK.base.w) / 2, S * MARK.base.h, 64), new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }));
  base.position.set(0, baseLow + (S * MARK.base.h) / 2, 0);
  base.castShadow = true;
  scene.add(base);

  const camera = new THREE.OrthographicCamera(-m.coverW / 2, m.coverW / 2, m.coverH / 2, -m.coverH / 2, 1, 10000);
  camera.position.set(0, Math.sin(tilt) * 4000, cos * 4000);
  camera.lookAt(0, 0, 0);
  // The floor under the lantern lands where her shadow is.
  camera.setViewOffset(W, H, -(centerX - m.coverW / 2) * r, -(floorY - m.coverH / 2) * r, W, H);

  // The light the lit surface uses (D59): as strong as the drawing's own floor glow, the shadows Sharon picked.
  const lamp = new THREE.PointLight(new THREE.Color(ORB), 1.1 * Math.PI * orbH * orbH, 0, 2);
  lamp.castShadow = true;
  lamp.shadow.mapSize.set(1024, 1024);
  lamp.shadow.camera.near = 1;
  lamp.shadow.camera.far = 5000;
  scene.add(lamp);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setSize(W, H, false);
  const target = new THREE.WebGLRenderTarget(W, H, { type: THREE.FloatType });
  const buf = new Float32Array(W * H * 4);
  const sum = new Float32Array(W * H * 4);
  // The orb is a ball, not a point: its light is sampled through it, which softens the shadow's edge.
  const n = 48;
  for (let i = 0; i < n; i++) {
    const [x, y, z] = inBall();
    const radius = S * MARK.orb.r;
    lamp.position.set(x * radius, orbH + y * radius, z * radius);
    renderer.setRenderTarget(target);
    renderer.setClearColor(0x000000, 1);
    renderer.render(scene, camera);
    renderer.readRenderTargetPixels(target, 0, 0, W, H, buf);
    for (let k = 0; k < buf.length; k++) sum[k] += buf[k] / n;
  }
  renderer.setRenderTarget(null);
  renderer.setClearColor(0x000000, 0);
  target.dispose();
  scene.traverse((o) => (o as Three.Mesh).geometry?.dispose());
  const out = layer(toCanvas(sum, W, H), 0, 0, m.coverW, m.coverH);
  // Light only: it adds to the ground, so the ground is never covered.
  out.style.mixBlendMode = 'plus-lighter';
  return out;
}

// ---- The glass, in front of the drawn inside.
async function drawGlass(THREE: THREE, renderer: Three.WebGLRenderer, m: Mark) {
  const S = m.scale;
  const r = dpr();
  const win = { x: m.left + S * MARK.window.x, y: m.top + S * MARK.window.y, w: S * MARK.window.w, h: S * MARK.window.h, r: S * MARK.window.r };
  const pad = 4;
  const W = Math.round((win.w + 2 * pad) * r);
  const H = Math.round((win.h + 2 * pad) * r);

  // What the glass looks through: the drawn glow, the glass's inside and the orb.
  const inside = m.svg.cloneNode(true) as SVGSVGElement;
  for (const el of Array.from(inside.children)) if (el.tagName !== 'defs' && !['glow', 'inside', 'orb'].includes((el as SVGElement).dataset.lm ?? '')) el.remove();
  inside.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  inside.removeAttribute('class');
  inside.removeAttribute('style');
  const picture = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(inside.outerHTML)}`;
  });
  const behind = document.createElement('canvas');
  behind.width = W;
  behind.height = H;
  const ctx = behind.getContext('2d');
  if (!ctx) throw new Error('No 2D canvas.');
  ctx.fillStyle = m.ground;
  ctx.fillRect(0, 0, W, H);
  ctx.drawImage(picture, (m.left - (win.x - pad)) * r, (m.top - (win.y - pad)) * r, 160 * S * r, 175 * S * r);
  const texture = new THREE.CanvasTexture(behind);
  texture.colorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = texture;
  // What the glass reflects: the night around it, the page's own color.
  const night = new THREE.Scene();
  night.background = new THREE.Color(m.ground);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(night).texture;
  pmrem.dispose();
  scene.environment = env;
  const hw = win.w / 2 + pad;
  const hh = win.h / 2 + pad;
  const camera = new THREE.OrthographicCamera(-hw, hw, hh, -hh, 0.1, 1000);
  camera.position.set(0, 0, 200);
  const glass = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    transmission: 1,
    ior: 1.5,
    thickness: 10,
    roughness: 0,
    // Her window's faint warm fill is the glass's own tint.
    attenuationColor: new THREE.Color(MARK.windowFill.color),
    attenuationDistance: win.w / MARK.windowFill.opacity,
  });
  const geometry = new THREE.LatheGeometry(roundedProfile(THREE, win.w, win.h, win.r), 128);
  scene.add(new THREE.Mesh(geometry, glass));
  renderer.shadowMap.enabled = false;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setSize(W, H, false);
  renderer.setClearColor(0x000000, 0);
  renderer.render(scene, camera);
  const out = document.createElement('canvas');
  out.width = W;
  out.height = H;
  out.getContext('2d')?.drawImage(renderer.domElement, 0, 0);
  geometry.dispose();
  glass.dispose();
  texture.dispose();
  env.dispose();
  layer(out, win.x - pad, win.y - pad, win.w + 2 * pad, win.h + 2 * pad);
  out.style.clipPath = `inset(${pad}px round ${win.r}px)`;
  return out;
}

/** A rounded rectangle's right half, as a lathe profile (so turning it makes a round part that shape). */
function roundedProfile(THREE: THREE, w: number, h: number, rx: number) {
  const a = w / 2;
  const b = h / 2;
  const points = [new THREE.Vector2(0.001, -b)];
  for (let i = 0; i <= 16; i++) {
    const t = -Math.PI / 2 + (i / 16) * (Math.PI / 2);
    points.push(new THREE.Vector2(a - rx + rx * Math.cos(t), -b + rx + rx * Math.sin(t)));
  }
  for (let i = 0; i <= 16; i++) {
    const t = (i / 16) * (Math.PI / 2);
    points.push(new THREE.Vector2(a - rx + rx * Math.cos(t), b - rx + rx * Math.sin(t)));
  }
  points.push(new THREE.Vector2(0.001, b));
  return points;
}

// ---- The copper: a shallow relief, lit only where the orb reaches.
function drawCopper(THREE: THREE, renderer: Three.WebGLRenderer, m: Mark) {
  const S = m.scale;
  const r = dpr();
  const w = 160 * S;
  const h = 175 * S;
  const W = Math.round(w * r);
  const H = Math.round(h * r);
  const X = (u: number) => S * u;
  const Y = (v: number) => -S * v;

  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, Math.PI)); // the page's own brightness (D59)
  const camera = new THREE.OrthographicCamera(0, w, 0, -h, 0.1, 2000);
  camera.position.set(0, 0, 500);
  // Lacquered copper: her color, under a clear coat that reflects the light in its own color.
  const copper = new THREE.MeshPhysicalMaterial({ color: MARK.copper, roughness: 0.6, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.3 });
  const depth = S * 8;
  const bevel = S * 1.5;
  const geometries: Three.BufferGeometry[] = [];
  const add = (geometry: Three.BufferGeometry, x: number, y: number) => {
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, copper);
    mesh.position.set(x, y, -depth / 2);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  };
  // Cap and base, in front. The bevel grows the outline, so the shape is drawn that much smaller.
  for (const part of [MARK.cap, MARK.base]) {
    const x = X(part.x) + bevel;
    const y = Y(part.y + part.h) + bevel;
    const pw = S * part.w - 2 * bevel;
    const ph = S * part.h - 2 * bevel;
    const pr = Math.max(0.1, S * part.r - bevel);
    const shape = new THREE.Shape();
    shape.moveTo(x + pr, y);
    shape.lineTo(x + pw - pr, y);
    shape.quadraticCurveTo(x + pw, y, x + pw, y + pr);
    shape.lineTo(x + pw, y + ph - pr);
    shape.quadraticCurveTo(x + pw, y + ph, x + pw - pr, y + ph);
    shape.lineTo(x + pr, y + ph);
    shape.quadraticCurveTo(x, y + ph, x, y + ph - pr);
    shape.lineTo(x, y + pr);
    shape.quadraticCurveTo(x, y, x + pr, y);
    add(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 8, curveSegments: 16 }), 0, 0);
  }
  // The glass's ring: a round wire set back behind the cap and base's front.
  const win = MARK.window;
  const a = (S * win.w) / 2;
  const b = (S * win.h) / 2;
  const rr = S * win.r;
  const cx = X(win.x + win.w / 2);
  const cy = Y(win.y + win.h / 2);
  const loop: Three.Vector3[] = [];
  const corner = (x: number, y: number, from: number) => {
    for (let i = 0; i <= 12; i++) {
      const t = from + (i / 12) * (Math.PI / 2);
      loop.push(new THREE.Vector3(cx + x + rr * Math.cos(t), cy + y + rr * Math.sin(t), 0));
    }
  };
  corner(a - rr, b - rr, 0);
  corner(-a + rr, b - rr, Math.PI / 2);
  corner(-a + rr, -b + rr, Math.PI);
  corner(a - rr, -b + rr, -Math.PI / 2);
  add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(loop, true, 'catmullrom', 0), 400, (S * MARK.ring) / 2, 24, true), 0, 0);
  // The handle, behind the cap, its ends inside it.
  add(new THREE.TorusGeometry(S * MARK.handle.r, (S * MARK.handle.stroke) / 2, 24, 128, Math.PI), X(MARK.handle.cx), Y(MARK.handle.cy));

  // The orb, inside the glass, level with the ring.
  const lamp = new THREE.PointLight(new THREE.Color(NAME), 1, 0, 2);
  lamp.position.set(X(MARK.orb.cx), Y(MARK.orb.cy), -depth / 2);
  lamp.castShadow = true;
  lamp.shadow.mapSize.set(1024, 1024);
  lamp.shadow.camera.near = 1;
  lamp.shadow.camera.far = 1000;
  scene.add(lamp);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setSize(W, H, false);
  renderer.setClearColor(0x000000, 0);
  const read = document.createElement('canvas');
  read.width = W;
  read.height = H;
  const ctx = read.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('No 2D canvas.');
  const luminance = (rgb: [number, number, number]) => {
    const lin = (c: number) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
  };
  const hex = parseInt(NAME.slice(1), 16);
  const ceiling = luminance([hex >> 16, (hex >> 8) & 255, hex & 255]);
  const brightest = (intensity: number) => {
    lamp.intensity = intensity;
    renderer.render(scene, camera);
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(renderer.domElement, 0, 0);
    const d = ctx.getImageData(0, 0, W, H).data;
    let max = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 250) max = Math.max(max, luminance([d[i], d[i + 1], d[i + 2]]));
    return max;
  };
  // As bright as it can be with the brightest copper edge no brighter than the name.
  let lo = 1;
  let hi = 1e7;
  for (let i = 0; i < 24; i++) {
    const mid = Math.sqrt(lo * hi);
    if (brightest(mid) > ceiling) hi = mid;
    else lo = mid;
  }
  brightest(lo);
  const out = document.createElement('canvas');
  out.width = W;
  out.height = H;
  out.getContext('2d')?.drawImage(renderer.domElement, 0, 0);
  geometries.forEach((g) => g.dispose());
  copper.dispose();
  lamp.shadow.map?.dispose();
  return layer(out, m.left, m.top, w, h);
}
