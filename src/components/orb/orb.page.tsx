import type { ComponentPageInfo } from '../../../.storybook/component-page';
import { OrbSection } from './orb-example';

const marble = { backdrop: 'marble', area: 'time', texture: 'texture-seagull.jpg', palette: 'seagull' } as const;
// On its own page the orb sits in the middle, like every component's example. Everywhere else it starts on the right, two thirds down.
const center = { x: 0.5, y: 0.5 };

// Storybook only: what the Orb's page says (the component page template).
export const orbPage: ComponentPageInfo = {
  updated: '2026-10-15',
  summary: 'Shows where the light comes from while you explore glass, as a glowing glass marble you can drag.',
  status: 'ready',
  builtWith: { source: 'src/components/orb/orb.tsx' },
  isLight: true,
  useFor: ['Exploring light on glass, one component at a time: drag the orb, and every rim, highlight and shadow follows.'],
  useForNotes: ["It glows in the theme's color. On a Sunrise area, set palette to the area's color family."],
  useElse: [{ job: 'A full page: its light stays still where it was placed (the light tokens)', instead: { name: 'Page shell', title: 'Components/Page shell' } }],
  do: {
    example: <OrbSection {...marble} start={center} label="One orb, lighting the glass beside it" />,
    rules: ['One orb per section. It starts on the right, two thirds down, except here on its own page.', 'Its color is the area’s own.'],
  },
  dont: {
    example: <OrbSection backdrop="header" start={center} label="An orb on a full page's header" />,
    rules: ['An orb on a full page.', "A full page's light never moves, so it never gets an orb."],
  },
  keys: [
    { keys: ['Tab'], result: 'Moves focus to the orb.' },
    { keys: ['Arrow keys'], result: 'Moves the light a little.' },
    { keys: ['Shift', 'Arrow keys'], result: 'Moves the light farther.' },
  ],
  screenReader: { pattern: 'name, button', example: 'Light. Drag it, or use the arrow keys to move it., button' },
  accessibility: [
    'The button is at least 44 by 44 pixels (56 for large), larger than the marble, so it is easy to grab.',
    "Nothing moves on its own, so there's no motion to reduce.",
  ],
  imports: ['Orb', 'ORB_START'],
  tokens: ['--orb-color-[part]', '--orb-size-[size]', '--orb-target-[size]', '--orb-glow-[reach]', '--orb-glow-scale-[size]', '--orb-shine-[part]'],
  related: [
    { name: 'Glass', title: 'Foundations/Glass' },
    { name: 'Page shell', title: 'Components/Page shell' },
  ],
};
