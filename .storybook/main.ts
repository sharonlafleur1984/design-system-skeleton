import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)', '../src/**/*.mdx'],
  // addon-mcp lets an AI agent read this Storybook and write and test stories (served at /mcp while Storybook runs).
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-mcp'],
  // Life Hub textures, so glass components show on the background they were designed for.
  staticDirs: ['./public'],
  framework: { name: '@storybook/react-vite', options: {} },
};
export default config;
