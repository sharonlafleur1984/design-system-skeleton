import type { Meta, StoryObj } from '@storybook/react-vite';
import { singleTheme } from '../components/story-helpers';
import { SwatchGroup } from './Swatch';
import { namesWith } from './tokens';

const meta: Meta = { title: 'Foundations/Colors', parameters: { layout: 'padded' } };
export default meta;
type Story = StoryObj;

/** Shared names every theme defines. Switch the theme in the toolbar to compare. The Designer Toolkit is always dark, so the Mode switch doesn't change it. */
export const Shared: Story = {
  render: () => (
    <>
      <SwatchGroup title="Ink (text)" names={namesWith('color-ink-')} />
      <SwatchGroup title="Surface" names={namesWith('color-surface-')} />
      <SwatchGroup title="Border" names={namesWith('color-border-')} />
      <SwatchGroup title="Accent" names={namesWith('color-accent-')} />
    </>
  ),
};

/** Status colors: every theme uses the same names, and each theme picks its own colors to fit its palette. Never color alone: pair with an icon or label. The Designer Toolkit: fire red for errors, lit honey for warnings, lake green for success, peach for info. */
export const Status: Story = {
  render: () => (
    <>
      {['error', 'warning', 'success', 'info', 'neutral'].map((s) => (
        <SwatchGroup key={s} title={s[0].toUpperCase() + s.slice(1)} names={namesWith(`color-status-${s}-`)} />
      ))}
    </>
  ),
};

/** Colors only one product has, like Life Hub's seven areas. */
export const ThisThemeOnly: Story = {
  name: 'This theme only',
  render: (_args, { globals }) => {
    const theme = singleTheme(globals.theme);
    if (theme === 'life-hub') return <SwatchGroup title="Life Hub areas" names={namesWith('color-area-', 'life-hub')} />;
    if (theme === 'designer-toolkit')
      return (
        <p>
          The Designer Toolkit has no extra colors beyond its palette. Color only communicates: bright rust for the main action,
          honey only for warnings. It is always dark, so the prototype it frames stays the brightest thing on screen.
        </p>
      );
    return <p>After Graduation has no extra colors. Paths and categories use icons and labels instead.</p>;
  },
};

/** Every color in the current theme's palette, grouped by family. For Life Hub, these are the Figma library's colors, unchanged. For the Designer Toolkit, Sharon's six Fireside anchors plus honey for warnings, each a 100 to 900 ramp; rust also has bright and bright-hover for filled buttons. */
export const Palette: Story = {
  render: (_args, { globals }) => {
    const theme = singleTheme(globals.theme);
    const names = namesWith('palette-', theme);
    // Numbered shades (sea-nymph-100) group by everything before the number; named ones (paper-off-white) by the first word.
    const family = (n: string) => {
      const rest = n.replace(/^palette-/, '');
      return /-\d+$/.test(rest) ? rest.replace(/-\d+$/, '') : rest.split('-')[0];
    };
    const families = [...new Set(names.map(family))];
    return (
      <>
        {families.map((f) => (
          <SwatchGroup key={f} title={f.replace(/-/g, ' ')} names={names.filter((n) => family(n) === f)} />
        ))}
      </>
    );
  },
};
