import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './separator';
import { BothThemes, choice, hidden } from '../story-helpers';
import { separatorPage } from './separator.page';
import { pageArgTypes, pageArgs, pageStory } from '../../../.storybook/component-page';

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  args: { orientation: 'horizontal', ...pageArgs } as Meta<typeof Separator>['args'],
  argTypes: {
    orientation: choice('Orientation', 'A line across, or up and down between items in a row\n\n`orientation`', ['horizontal', 'vertical']),
    ...pageArgTypes(),
    className: hidden,
  },
  parameters: { componentPage: separatorPage },
};
export default meta;
type Story = StoryObj<typeof Separator>;

/** Separator's page. Every setting is in the Controls tab. */
export const Overview: Story = { ...pageStory(), tags: ['page'] };
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
export const UsageRules: Story = { ...pageStory('usage'), name: 'Usage rules', tags: ['page', 'section'] };
export const Accessibility: Story = { ...pageStory('a11y'), tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related'), tags: ['page', 'section'] };

// Test stories: screenshot and accessibility tests run on them; they stay out of the sidebar.

/** Every setting, in the Controls tab. */
export const Playground: Story = { tags: ['!dev'] };

/** Horizontal between stacked groups, vertical between items in a row. */
export const Orientations: Story = {
  tags: ['!dev'],
  render: () => (
    <BothThemes>
      <span>Item 1</span>
      <Separator />
      <span>Item 2</span>
      <div style={{ display: 'flex', gap: 'var(--space-3)', blockSize: '24px' }}>
        <span>Item 1</span>
        <Separator orientation="vertical" />
        <span>Item 2</span>
      </div>
    </BothThemes>
  ),
};
