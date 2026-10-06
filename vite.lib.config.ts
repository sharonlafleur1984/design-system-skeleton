import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Builds the package other repos install: the components as JavaScript, one CSS file for
// their styles, and one font file per theme. Storybook doesn't use this; it reads src directly.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: false,
    // One CSS file per entry: the components' styles, and each theme's fonts.
    cssCodeSplit: true,
    lib: {
      entry: {
        index: 'src/components/index.ts',
        'fonts-after-graduation': 'src/fonts/after-graduation.css',
        'fonts-life-hub': 'src/fonts/life-hub.css',
      },
      formats: ['es'],
    },
    rollupOptions: {
      // The app brings its own copy of these, so there's only ever one React.
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^react-aria-components($|\/)/, /^@react-aria\//],
    },
  },
});
