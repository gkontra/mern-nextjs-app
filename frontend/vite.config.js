import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  css: {
    devSourcemap: true, // https://github.com/vitejs/vite/issues/8656#issuecomment-1159730991
    preprocessorOptions: {
      scss: {
        quietDeps: true, // Unix
        silenceDeprecations: [
          'color-functions',
          'global-builtin',
          'import',
          'legacy-js-api',
          'abs-percent',
          'if-function',
        ],
      },
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'gsap', test: /node_modules[\\/](gsap|@gsap)[\\/]/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
            { name: 'vendor', test: /node_modules[\\/]/, entriesAware: true },
          ],
        },
      },
    },
  },
});
