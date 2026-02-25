import { emitKeypressEvents } from 'node:readline';
import { styleText } from 'node:util';

import react from '@vitejs/plugin-react';
import { defineConfig, transformWithEsbuild } from 'vite';
import commonjs from 'vite-plugin-commonjs';

function shortcuts() {
  return {
    name: 'shortcuts',
    configureServer(server) {
      const keys = [
        {
          key: 'u',
          description: 'show server url',
          action: () => {
            server.config.logger.info('');
            server.printUrls();
          },
        },
        {
          key: 'o',
          description: 'open in browser',
          action: () => server.openBrowser(),
        },
        {
          key: '?',
          description: 'show url and shortcuts',
          action: () => {
            server.config.logger.info('');
            server.printUrls();
            help();
          },
        },
      ];

      const help = () => {
        server.config.logger.info('');

        for (const s of keys) {
          server.config.logger.info(
            styleText('dim', '  ➜  Press ') +
              styleText('bold', s.key) +
              styleText('dim', ` │ `) +
              styleText('reset', s.description)
          );
        }
      };

      // Prevent Vite's default readline-based shortcuts on initial start.
      // On restart, Vite calls the internal bindCLIShortcuts directly (bypassing this),
      // so shortcuts are set up in the returned function below which runs on every start.
      server.bindCLIShortcuts = () => {
        help();
      };

      return () => {
        if (!server.httpServer || !process.stdin.isTTY || process.env.CI) {
          return;
        }

        emitKeypressEvents(process.stdin);

        process.stdin.setRawMode(true);

        const onKeypress = async (str, key) => {
          if (key?.ctrl && key.name === 'c') {
            server.close();
            process.exit(130);
          }

          if (key?.ctrl || key?.meta || !str) {
            return;
          }

          const shortcut = keys.find((s) => s.key === str);

          if (!shortcut) {
            return;
          }

          process.stdin.off('keypress', onKeypress);

          try {
            await shortcut.action();
          } finally {
            process.stdin.on('keypress', onKeypress);
          }
        };

        process.stdin.on('keypress', onKeypress);

        server.httpServer.on('close', () => {
          process.stdin.off('keypress', onKeypress);

          if (process.stdin.listenerCount('keypress') === 0) {
            process.stdin.setRawMode(false);
          }
        });
      };
    },
  };
}

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
  plugins: [jsx(/\/(@expo|expo-.+)\//), commonjs(), react(), shortcuts()],
  define: {
    __DEV__: JSON.stringify(mode !== 'production'),
    'process.env.EXPO_OS': JSON.stringify('web'),
    global: 'globalThis',
  },
  resolve: {
    extensions,
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
