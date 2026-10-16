import { readdirSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Builds the package other repos install: the components as JavaScript with one CSS file for
// their styles, the page's base styles, and one font file per theme. Storybook doesn't use this; it reads src directly.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: false,
    // One CSS file per entry: the components' styles, the base styles, the text style classes, and each theme's fonts.
    cssCodeSplit: true,
    lib: {
      entry: {
        index: 'src/components/index.ts',
        base: 'src/base.css',
        // One font file per theme, found by name (src/fonts/<theme>.css).
        ...Object.fromEntries(readdirSync('src/fonts').filter((f) => f.endsWith('.css')).map((f) => [`fonts-${f.replace('.css', '')}`, `src/fonts/${f}`])),
        // Text style classes (.ds-text-body-default), generated from the tokens by npm run tokens.
        'text-styles': 'build/text-styles.css',
      },
      formats: ['es'],
    },
    rollupOptions: {
      // The app brings its own copy of these, so there's only ever one React (and three.js, which draws the orb).
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^react-aria-components($|\/)/, /^@react-aria\//, /^three($|\/)/],
    },
  },
});
