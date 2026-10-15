// Draws the orb with a real renderer (three.js) instead of faking glass with CSS gradients: a glass
// ball (refractive index 1.5) with a glowing core inside, lit from the top right and reflecting a
// studio room (three.js's built-in RoomEnvironment, so nothing is downloaded). The renderer works out
// what CSS can't: the bright edges where glass reflects the most, the core bent and enlarged through
// the glass, the sharp highlight and the room's reflections.
//
// Each orb is drawn once into a picture and cached by its look, size and colors. One renderer is
// shared by every orb, so the page never holds more than one 3D context. three.js loads only the
// first time an orb is drawn.

export type OrbLook = 'clear' | 'glow';

export interface OrbColors {
  light: string;
  glow: string;
  halo: string;
  body: string;
}

const LOOKS = {
  // Clear glass: you see through it to a small bright core; its color is a tint.
  clear: { core: 0.5, coreWhite: 0.6, emissive: 0.35, attenuation: 1.6, backdrop: 'light' as const },
  // Glows: the light is inside the ball, a big bright core shining out through the glass. Its color is
  // half white, half the lightest step of the page's color (as the focus glow, D45), and the glass
  // glows in it too, so the ball blends into its light.
  glow: { core: 0.78, coreWhite: 0.5, emissive: 1.6, attenuation: 2.2, backdrop: 'light' as const },
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
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return { THREE, renderer, env };
  })();
  return shared;
}

const cache = new Map<string, Promise<string>>();

/** The orb as a picture (a data URL), `px` pixels across. */
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
  // What the glass bends: its own light color, so the inside reads the same on any background.
  scene.background = color(colors[l.backdrop]);

  // The ball fills the picture exactly, so there's no gap at its edge.
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.set(0, 0, 4);

  const geometries = [new THREE.SphereGeometry(l.core, 64, 64), new THREE.SphereGeometry(1, 128, 128)];
  const core = new THREE.MeshBasicMaterial({ color: color(colors.light).lerp(new THREE.Color('#ffffff'), l.coreWhite) });
  const glass = new THREE.MeshPhysicalMaterial({
    color: color(colors.glow),
    transmission: 1,
    ior: 1.5,
    thickness: 1.4,
    roughness: 0.04,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    attenuationColor: color(colors.body),
    attenuationDistance: l.attenuation,
    // The orb is a light, so the glass glows a little in its own color, and the room's walls in its edge stay faint.
    emissive: look === 'glow' ? color(colors.light).lerp(new THREE.Color('#ffffff'), 0.5) : color(colors.glow),
    emissiveIntensity: l.emissive,
    envMapIntensity: 0.7,
  });
  scene.add(new THREE.Mesh(geometries[0], core), new THREE.Mesh(geometries[1], glass));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(1.2, 1.5, 4);
  scene.add(key, new THREE.AmbientLight(0xffffff, 0.25));

  renderer.setSize(px, px, false);
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL('image/png');
  geometries.forEach((g) => g.dispose());
  core.dispose();
  glass.dispose();
  return url;
}
