import type { Meta, StoryObj } from '@storybook/react-vite';
import { pageStory } from '../../.storybook/component-page';
import { plannedPage } from './planned';

// Storybook only: a planned part's page, with its status. Nothing is built yet (planned.ts).
const meta: Meta = { title: 'Components/Color picker', parameters: { componentPage: plannedPage('Components/Color picker') } };
export default meta;
type Story = StoryObj;

export const Overview: Story = { ...pageStory(), tags: ['page'] };
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
