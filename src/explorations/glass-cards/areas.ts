// Life Hub areas for the glass cards exploration. Every value was tuned by eye in the Oct 6 to 7 review
// and is an estimate until it becomes a token.
//
// layer:       half the area's 900 and half Life Hub ink, laid over the marble in dark mode.
// layerAlpha:  how strongly that layer covers the marble, set so every area's swirl shows about as much.
// frost:       how white the light mode glass is, set so every marble shows through about the same.
// highlight:   dark mode rim strength, evened out so rims look equally bright on every background.
// shadowLight, shadowDark: shadow strength, evened out for brightness and how busy each marble is.
export interface Area {
  name: string;
  palette: string;
  texture: string;
  layer: string;
  layerAlpha: number;
  frost: number;
  highlight: number;
  shadowLight: number;
  shadowDark: number;
}

export const areas: Area[] = [
  { name: 'Dashboard', palette: 'Earth Moss', texture: 'texture-sage-cream.jpg', layer: '#2d3224', layerAlpha: 0.82, frost: 0.83, highlight: 0.992, shadowLight: 1.05, shadowDark: 1.16 },
  { name: 'Time', palette: 'Seagull', texture: 'texture-seagull.jpg', layer: '#1d3948', layerAlpha: 0.85, frost: 0.9, highlight: 0.976, shadowLight: 1.04, shadowDark: 1.0 },
  { name: 'Finance', palette: 'Sea Nymph', texture: 'texture-sea-nymph.jpg', layer: '#28302e', layerAlpha: 0.83, frost: 0.8, highlight: 0.947, shadowLight: 1.09, shadowDark: 1.25 },
  { name: 'Parenting', palette: 'Lilacs & Lavender', texture: 'texture-lilacs-lavender.jpg', layer: '#3a2f34', layerAlpha: 0.91, frost: 0.84, highlight: 0.89, shadowLight: 1.69, shadowDark: 1.8 },
  { name: 'Health', palette: 'Berry Pie', texture: 'texture-berry-pie.jpg', layer: '#4d2a2e', layerAlpha: 0.82, frost: 0.89, highlight: 1.0, shadowLight: 0.68, shadowDark: 0.68 },
  { name: 'Home', palette: 'Gold Sand', texture: 'texture-gold-sand.jpg', layer: '#3b321f', layerAlpha: 0.84, frost: 0.87, highlight: 0.983, shadowLight: 0.88, shadowDark: 0.93 },
  { name: 'Office', palette: 'Morning Latte', texture: 'texture-morning-latte.jpg', layer: '#423834', layerAlpha: 0.88, frost: 0.78, highlight: 0.996, shadowLight: 0.95, shadowDark: 0.91 },
  { name: 'Professional', palette: 'Nocturnal Navy', texture: 'texture-nocturnal-navy.jpg', layer: '#242a34', layerAlpha: 0.86, frost: 0.79, highlight: 0.91, shadowLight: 1.17, shadowDark: 1.62 },
  { name: 'Personal growth', palette: 'Sunflower Medley', texture: 'texture-sunflower-medley.jpg', layer: '#4c331d', layerAlpha: 0.87, frost: 0.95, highlight: 0.992, shadowLight: 0.78, shadowDark: 0.75 },
];

export const areaNames = areas.map((a) => a.name);
export const findArea = (name: string) => areas.find((a) => a.name === name) ?? areas[0];
