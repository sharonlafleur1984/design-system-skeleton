// Draws the orb with a real renderer (three.js) instead of faking glass with CSS gradients: a glass
// ball (refractive index 1.5) with a glowing core inside, lit from the top right and reflecting a
// studio room (three.js's built-in RoomEnvironment, so nothing is downloaded). The renderer works out
// what CSS can't: the bright edges where glass reflects the most, the core bent and enlarged through
// the glass, the sharp highlight and the room's reflections.
//
// Each orb is drawn once into a picture and cached by its look, size and colors. One renderer is
// shared by every orb, so the page never holds more than one 3D context. three.js loads only the
// first time an orb is drawn.

export type OrbLook = 'glow' | 'tinted' | 'clear';

export interface OrbColors {
  light: string;
  glow: string;
  halo: string;
  body: string;
}

const LOOKS = {
  // Glows: the light is inside the ball, a big bright core shining out through the glass. Its color is
  // half white, half the lightest step of the page's color (as the focus glow, D45), and the glass
  // glows in it too, so the ball blends into its light.
  glow: { core: 0.78, coreWhite: 0.5, emissive: 1.6, attenuation: 2.2, seeThrough: false },
  // Tinted glass: you look through glass in the page's color to a small bright core.
  tinted: { core: 0.5, coreWhite: 0.6, emissive: 0.35, attenuation: 1.6, seeThrough: false },
  // Completely clear: no core and no color, so the page behind shows straight through; only the
  // highlights and the reflections at its edge say it's glass.
  clear: { core: 0, coreWhite: 0, emissive: 0, attenuation: Infinity, seeThrough: true },
};

type Three = typeof import('three');
let shared: Promise<{ THREE: Three; renderer: import('three').WebGLRenderer; env: import('three').Texture }> | undefined;

function setup() {
  shared ??= (async () => {
    const probe = document.createElement('canvas');
    if (!probe.getContext('webgl2')) throw new Error('No WebGL here; the CSS orb stays.');
    const THREE = await import('three');
    const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.01).texture;
    pmrem.dispose();
    return { THREE, renderer, env };
  })();
  return shared;
}

const cache = new Map<string, Promise<string>>();

/** The orb as a picture (a data URL), for `px` pixels on screen (drawn at twice that, for sharpness). */
export function renderOrb(px: number, look: OrbLook, colors: OrbColors): Promise<string> {
  const key = [px, look, colors.light, colors.glow, colors.halo, colors.body].join('|');
  let picture = cache.get(key);
  if (!picture) {
    picture = draw(px, look, colors);
    cache.set(key, picture);
    picture.catch(() => cache.delete(key));
  }
  return picture;
}

async function draw(px: number, look: OrbLook, colors: OrbColors) {
  const { THREE, renderer, env } = await setup();
  const l = LOOKS[look];
  const color = (c: string) => new THREE.Color(c);
  const scene = new THREE.Scene();
  scene.environment = env;
  // What the glass bends: its own light color, so the inside reads the same on any background. Clear
  // glass is drawn on black instead, and the black becomes see-through afterwards (below).
  // Smooth glass (roughness 0) and a sharp studio room keep the reflections crisp.
  scene.background = l.seeThrough ? new THREE.Color('#000000') : color(colors.light);

  // The ball fills the picture, a hair past its edges: rays that only skim the glass there miss
  // everything and draw a dotted dark rim, so that sliver is left outside the picture.
  const camera = new THREE.OrthographicCamera(-0.975, 0.975, 0.975, -0.975, 0.1, 10);
  camera.position.set(0, 0, 4);

  const geometries = [new THREE.SphereGeometry(l.core || 0.01, 64, 64), new THREE.SphereGeometry(1, 128, 128)];
  const core = new THREE.MeshBasicMaterial({ color: color(colors.light).lerp(new THREE.Color('#ffffff'), l.coreWhite) });
  // Clear glass: nothing of its own, only what its surface reflects (brightest at the edges) and the
  // highlights.
  const glass = l.seeThrough
    ? new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#000000'), roughness: 0, ior: 1.5, clearcoat: 1, clearcoatRoughness: 0, envMapIntensity: 1.2 })
    : new THREE.MeshPhysicalMaterial({
    color: color(colors.glow),
    transmission: 1,
    ior: 1.5,
    thickness: 1.4,
    roughness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0,
    attenuationColor: color(colors.body),
    attenuationDistance: l.attenuation,
    // The orb is a light, so the glass glows a little in its own color, and the room's walls in its edge stay faint.
    emissive: look === 'glow' ? color(colors.light).lerp(new THREE.Color('#ffffff'), 0.5) : color(colors.glow),
    emissiveIntensity: l.emissive,
    envMapIntensity: 0.7,
  });
  scene.add(new THREE.Mesh(geometries[1], glass));
  if (l.core) scene.add(new THREE.Mesh(geometries[0], core));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(1.2, 1.5, 4);
  scene.add(key, new THREE.AmbientLight(0xffffff, 0.25));

  // Drawn at twice the size and shrunk by the browser, so every edge and reflection stays sharp.
  const drawn = Math.min(px * 2, 1024);
  renderer.setSize(drawn, drawn, false);
  renderer.render(scene, camera);
  const url = l.seeThrough ? blackToClear(renderer.domElement) : renderer.domElement.toDataURL('image/png');
  geometries.forEach((g) => g.dispose());
  core.dispose();
  glass.dispose();
  return url;
}

/** Clear glass was drawn on black: each pixel's brightness becomes how much it covers the page, so
 * black turns see-through and the reflections and highlights stay. */
function blackToClear(source: HTMLCanvasElement) {
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source, 0, 0);
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = image.data;
  for (let i = 0; i < d.length; i += 4) {
    const a = Math.max(d[i], d[i + 1], d[i + 2]);
    if (a === 0) {
      d[i + 3] = 0;
      continue;
    }
    d[i] = (d[i] * 255) / a;
    d[i + 1] = (d[i + 1] * 255) / a;
    d[i + 2] = (d[i + 2] * 255) / a;
    d[i + 3] = a;
  }
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL('image/png');
}
