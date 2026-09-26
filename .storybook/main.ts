import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)', '../src/**/*.mdx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  // Life Hub textures, so glass components show on the background they were designed for.
  staticDirs: ['./public'],
  framework: { name: '@storybook/react-vite', options: {} },
};
export default config;
