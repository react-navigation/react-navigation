import react from '@vitejs/plugin-react';
import { defineConfig, transformWithEsbuild } from 'vite';
import commonjs from 'vite-plugin-commonjs';

const extensions = [
  '.web.tsx',
  '.tsx',
  '.web.ts',
  '.ts',
  '.web.jsx',
  '.jsx',
  '.web.js',
  '.js',
  '.web.mjs',
  '.mjs',
  '.json',
];

const jsx = (regex) => ({
  name: 'js-as-jsx',
  enforce: 'pre',
  async transform(code, id) {
    if (id.endsWith('.js') && regex.test(id)) {
      return transformWithEsbuild(code, id, {
        loader: 'jsx',
        jsx: 'automatic',
      });
    }

    return null;
  },
});

/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => ({
  plugins: [jsx(/\/(@expo|expo-.+)\//), commonjs(), react()],
  define: {
    __DEV__: JSON.stringify(mode !== 'production'),
    'process.env.EXPO_OS': JSON.stringify('web'),
    global: 'globalThis',
  },
  resolve: {
    extensions: extensions,
    conditions: ['source', 'module', 'browser', mode],
    alias: {
      'react-native': 'react-native-web',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: extensions,
      jsx: 'automatic',
      loader: {
        '.js': 'jsx',
      },
    },
  },
}));
