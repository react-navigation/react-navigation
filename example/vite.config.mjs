import react from '@vitejs/plugin-react';
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

/** @type {import('vite').UserConfig} */
export default {
  plugins: [commonjs(), react()],
  define: {
    '__DEV__': JSON.stringify(process.env.NODE_ENV !== 'production'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.EXPO_OS': JSON.stringify('web'),
    'global': 'globalThis',
  },
  resolve: {
    extensions: extensions,
    conditions: ['source', 'module', 'browser', 'development'],
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
};
