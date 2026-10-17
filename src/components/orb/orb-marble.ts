import { Mesh, OrthographicCamera, Scene, ShaderMaterial, SphereGeometry, Vector3, WebGLRenderer } from 'three';

// The orb's marble, drawn by three.js: a sphere of glass lit from the top. Drawn once, and again only
// when its colors, look or size change; nothing animates. The bloom around it is CSS (orb.css).

export type OrbLook = 'glow' | 'clear';

type Rgb = [number, number, number];
export interface MarbleColors {
  light: Rgb;
  glow: Rgb;
  halo: Rgb;
  body: Rgb;
  shade: Rgb;
}

const vertex = /* glsl */ `
varying vec3 vNormal;
void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// glow: a solid, lit marble in the theme's color. clear: mostly see-through glass, with only its rim,
// the crescent at the top and the light pooling at the bottom showing.
const fragment = /* glsl */ `
precision highp float;
varying vec3 vNormal;
uniform vec3 uLight;
uniform vec3 uGlow;
uniform vec3 uHalo;
uniform vec3 uBody;
uniform vec3 uShade;
uniform float uClear;
void main() {
  vec3 n = normalize(vNormal);
  float facing = clamp(n.z, 0.0, 1.0);
  float rim = pow(1.0 - facing, 2.2);
  float top = clamp(n.y * 0.5 + 0.5, 0.0, 1.0);

  vec3 body = mix(uLight, uGlow, smoothstep(0.0, 0.45, facing));
  body = mix(body, uHalo, smoothstep(0.35, 0.8, facing));
  body = mix(body, uBody, smoothstep(0.7, 1.0, facing));
  body = mix(body, uShade, smoothstep(0.55, 1.0, top) * 0.45);

  float crescent = smoothstep(0.78, 0.95, dot(n, normalize(vec3(0.25, 0.8, 0.45))));
  float pool = smoothstep(0.55, 0.95, 1.0 - top) * (1.0 - facing * 0.6);
  vec3 lit = body + uLight * pool * 0.55;
  lit = mix(lit, vec3(1.0), crescent * 0.95);
  lit = mix(lit, vec3(1.0), rim * 0.35);

  float solidAlpha = 1.0;
  float clearAlpha = clamp(0.1 + rim * 0.75 + crescent + pool * 0.45, 0.0, 1.0);
  vec3 clearColor = mix(uGlow, vec3(1.0), clamp(rim * 0.8 + crescent + pool * 0.5, 0.0, 1.0));
  vec3 color = mix(lit, clearColor, uClear);
  float alpha = mix(solidAlpha, clearAlpha, uClear);
  gl_FragColor = vec4(color * alpha, alpha);
}`;

export interface Marble {
  /** Draws it again with new colors, look or size. */
  update: (options: { size: number; look: OrbLook; colors: MarbleColors }) => void;
  dispose: () => void;
}

/** Red, green and blue as 0 to 1, straight from the page's own color, so what's drawn matches the CSS. */
const rgb = (c: Rgb) => new Vector3(c[0] / 255, c[1] / 255, c[2] / 255);

/** Starts drawing the marble into the canvas. Returns null when the browser has no WebGL, so the CSS marble stays. */
export function createMarble(canvas: HTMLCanvasElement): Marble | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, premultipliedAlpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 3;
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    uniforms: {
      uLight: { value: new Vector3() },
      uGlow: { value: new Vector3() },
      uHalo: { value: new Vector3() },
      uBody: { value: new Vector3() },
      uShade: { value: new Vector3() },
      uClear: { value: 0 },
    },
  });
  const geometry = new SphereGeometry(1, 64, 64);
  scene.add(new Mesh(geometry, material));

  return {
    update({ size, look, colors }) {
      renderer.setSize(size, size, false);
      const u = material.uniforms;
      u.uLight.value = rgb(colors.light);
      u.uGlow.value = rgb(colors.glow);
      u.uHalo.value = rgb(colors.halo);
      u.uBody.value = rgb(colors.body);
      u.uShade.value = rgb(colors.shade);
      u.uClear.value = look === 'clear' ? 1 : 0;
      renderer.render(scene, camera);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
