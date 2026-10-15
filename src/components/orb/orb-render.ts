// Draws the orb with a real renderer (three.js) instead of faking glass with CSS gradients: a glass
// ball (refractive index 1.5) with a glowing core inside, lit from the top right and reflecting a
// plain studio (built here, so nothing is downloaded). The renderer works out
// what CSS can't: the bright edges where glass reflects the most, the core bent and enlarged through
// the glass, the sharp highlight and the studio's reflections.
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
  // Completely clear: colorless glass with no core. The real page shows through it on any background;
  // only the reflections, the highlights and the bright edges say it's glass, like a bubble.
  clear: { core: 0, coreWhite: 0, emissive: 0, attenuation: Infinity, seeThrough: true },
};

type Three = typeof import('three');
let shared: Promise<{ THREE: Three; renderer: import('three').WebGLRenderer; env: import('three').Texture; brightEnv: import('three').Texture }> | undefined;

function setup() {
  shared ??= (async () => {
    const probe = document.createElement('canvas');
    if (!probe.getContext('webgl2')) throw new Error('No WebGL here; the CSS orb stays.');
    const THREE = await import('three');
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(studio(THREE, 0.04, 0.5), 0.02).texture;
    // Clear glass reflects a brighter studio: real glass edges reflect a lit room, so they read light,
    // never as a dark outline.
    const brightEnv = pmrem.fromScene(studio(THREE, 0.55, 0.4), 0.02).texture;
    pmrem.dispose();
    return { THREE, renderer, env, brightEnv };
  })();
  return shared;
}

/**
 * What the glass reflects: a plain studio with nothing in it to recognize. A soft sky, lighter above
 * than below (`floor` at the bottom, rising by `rise` to the top), and one round softbox up and to the right (where the page's light sits), plus a
 * faint one low on the left. No walls or furniture, so the reflections read only as light.
 */
function studio(THREE: Three, floor: number, rise: number) {
  const scene = new THREE.Scene();
  const sky = new THREE.SphereGeometry(10, 48, 24);
  const position = sky.getAttribute('position');
  const shades: number[] = [];
  for (let i = 0; i < position.count; i++) {
    const up = (position.getY(i) / 10 + 1) / 2;
    const v = floor + rise * up * up;
    shades.push(v, v, v);
  }
  sky.setAttribute('color', new THREE.Float32BufferAttribute(shades, 3));
  scene.add(new THREE.Mesh(sky, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
  const softbox = (radius: number, strength: number, x: number, y: number, z: number) => {
    const light = new THREE.Mesh(new THREE.CircleGeometry(radius, 64), new THREE.MeshBasicMaterial({ color: new THREE.Color(strength, strength, strength), side: THREE.DoubleSide }));
    light.position.set(x, y, z);
    light.lookAt(0, 0, 0);
    scene.add(light);
  };
  softbox(2.2, 8, 4.5, 5.5, 5);
  softbox(1.4, 1.2, -5, -3, 4);
  return scene;
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
  const { THREE, renderer, env, brightEnv } = await setup();
  const l = LOOKS[look];
  const color = (c: string) => new THREE.Color(c);
  const scene = new THREE.Scene();
  scene.environment = l.seeThrough ? brightEnv : env;
  // What the glass bends: its own light color, so the inside reads the same on any background. (Clear
  // glass is drawn twice, on black and on white; see below.) Smooth glass (roughness 0) and a sharp
  // studio keep the reflections crisp.
  scene.background = color(colors.light);

  // The ball fills the picture, a hair past its edges: rays that only skim the glass there miss
  // everything and draw a dotted dark rim, so that sliver is left outside the picture.
  const camera = new THREE.OrthographicCamera(-0.975, 0.975, 0.975, -0.975, 0.1, 10);
  camera.position.set(0, 0, 4);

  const geometries = [new THREE.SphereGeometry(l.core || 0.01, 64, 64), new THREE.SphereGeometry(1, 128, 128)];
  const core = new THREE.MeshBasicMaterial({ color: color(colors.light).lerp(new THREE.Color('#ffffff'), l.coreWhite) });
  const glass = new THREE.MeshPhysicalMaterial({
    // Clear glass has no color of its own.
    color: l.seeThrough ? new THREE.Color('#ffffff') : color(colors.glow),
    transmission: 1,
    ior: 1.5,
    thickness: 1.4,
    roughness: 0,
    // Clear glass has one surface, so one reflection; a clear coat would add a second film over it.
    clearcoat: l.seeThrough ? 0 : 1,
    clearcoatRoughness: 0,
    attenuationColor: color(colors.body),
    attenuationDistance: l.attenuation,
    // The orb is a light, so the glass glows a little in its own color, and the room's walls in its edge stay faint.
    emissive: look === 'glow' ? color(colors.light).lerp(new THREE.Color('#ffffff'), 0.5) : l.seeThrough ? new THREE.Color('#ffffff') : color(colors.glow),
    emissiveIntensity: l.emissive,
    // Clear glass reflects only about 4% face-on, as real glass does, so the page shows through; its
    // edges reflect almost everything, so they read as a light rim.
    envMapIntensity: l.seeThrough ? 0.35 : 0.7,
  });
  scene.add(new THREE.Mesh(geometries[1], glass));
  if (l.core) scene.add(new THREE.Mesh(geometries[0], core));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(1.2, 1.5, 4);
  scene.add(key, new THREE.AmbientLight(0xffffff, 0.25));

  // Drawn at twice the size and shrunk by the browser, so every edge and reflection stays sharp.
  const drawn = Math.min(px * 2, 1024);
  renderer.setSize(drawn, drawn, false);
  // Clear glass passes the page's own color through untouched (no tone mapping to lift a dark page).
  renderer.toneMapping = l.seeThrough ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
  let url: string;
  if (l.seeThrough) {
    // Clear glass: drawn once on black and once on white. Whatever changes between the two is the
    // background showing through, so it becomes see-through; what stays is the glass's own light
    // (reflections, highlights, bright edges). The real page then shows through on any background.
    const snap = (bg: string) => {
      scene.background = new THREE.Color(bg);
      renderer.render(scene, camera);
      const c = document.createElement('canvas');
      c.width = c.height = drawn;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(renderer.domElement, 0, 0);
      return { ctx, data: ctx.getImageData(0, 0, drawn, drawn) };
    };
    const onBlack = snap('#000000').data.data;
    const white = snap('#ffffff');
    const out = white.data;
    const d = out.data;
    for (let i = 0; i < d.length; i += 4) {
      // How much of the background still shows: the difference between the white and black drawings.
      const through = ((d[i] - onBlack[i]) + (d[i + 1] - onBlack[i + 1]) + (d[i + 2] - onBlack[i + 2])) / (3 * 255);
      const a = Math.min(1, Math.max(0, 1 - through));
      // Sharon wants clear to read truly clear on any page: the faint film of reflection across the
      // face thins toward nothing (a squared, so 17% becomes about 3%), and the glass's light is pure
      // white, so it can only lighten what's behind it: a light rim on dark pages, nearly invisible on
      // light ones, never a dark ring.
      d[i] = d[i + 1] = d[i + 2] = 255;
      d[i + 3] = Math.round(a ** 2 * 255);
    }
    white.ctx.putImageData(out, 0, 0);
    url = white.ctx.canvas.toDataURL('image/png');
  } else {
    renderer.render(scene, camera);
    url = renderer.domElement.toDataURL('image/png');
  }
  geometries.forEach((g) => g.dispose());
  core.dispose();
  glass.dispose();
  return url;
}

