import type { Meta, StoryObj } from '@storybook/react-vite';
import { AreaScreen, type Mode } from './glass-cards';
import { areaNames, areas, findArea } from './areas';

type Args = { area: string; mode: Mode };

const meta: Meta<Args> = {
  title: 'Explorations/Life Hub glass cards',
  // Life Hub only: lock the toolbar's theme so the page around it is Life Hub too.
  globals: { theme: 'life-hub' },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Exploration, not in the library yet. Life Hub cards as glass on each area\'s marble, lit by one sun in the header (top right). ' +
          'Light mode shows the light as shade and shadow; dark mode shows it as highlights. Buttons are the real React Aria Button. ' +
          'The edge bend shows in Chrome and Edge only. Every value is an estimate until it becomes a token.',
      },
    },
  },
  args: { area: 'Dashboard', mode: 'light' },
  argTypes: {
    area: { control: 'select', options: areaNames },
    mode: { control: 'inline-radio', options: ['light', 'dark'] },
  },
};
export default meta;
type Story = StoryObj<Args>;

const pair = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' } as const;

/** One area, in the mode picked in the controls. */
export const Area: Story = {
  render: ({ area, mode }) => <AreaScreen area={findArea(area)} mode={mode} />,
};

/** One area, light and dark side by side. */
export const LightAndDark: Story = {
  argTypes: { mode: { table: { disable: true } } },
  render: ({ area }) => (
    <div style={pair}>
      <AreaScreen area={findArea(area)} mode="light" />
      <AreaScreen area={findArea(area)} mode="dark" />
    </div>
  ),
};

/** Every area in light and dark, to check they read as the same glass. */
export const AllAreas: Story = {
  argTypes: { area: { table: { disable: true } }, mode: { table: { disable: true } } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
      {areas.map((a) => (
        <section key={a.name} aria-label={a.name} style={pair}>
          <AreaScreen area={a} mode="light" />
          <AreaScreen area={a} mode="dark" />
        </section>
      ))}
    </div>
  ),
};
