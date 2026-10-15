import type { Meta, StoryObj } from '@storybook/react-vite';
import { pageStory } from '../../.storybook/component-page';
import { plannedPage } from './planned';

// Storybook only: a planned part's page, with its status. Nothing is built yet (planned.ts).
const meta: Meta = { title: 'Patterns/Bottom bar', parameters: { componentPage: plannedPage('Patterns/Bottom bar') } };
export default meta;
type Story = StoryObj;

export const Overview: Story = { ...pageStory(), tags: ['page'] };
export const TryItOut: Story = { ...pageStory('try'), name: 'Try it out', tags: ['page', 'section'] };
export const Related: Story = { ...pageStory('related'), tags: ['page', 'section'] };
