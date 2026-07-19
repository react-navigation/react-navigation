import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

import config from 'react-native-builder-bob/vite-config';
import { defaultServerConditions, defineConfig, mergeConfig } from 'vite';

import pack from '../package.json' with { type: 'json' };

const root = path.join(import.meta.dirname, '..');
const packages = pack.workspaces.flatMap((workspace) =>
  fs
    .globSync(path.posix.join(workspace, 'package.json'), {
      cwd: root,
    })
    .map((packageJsonPath) =>
      JSON.parse(fs.readFileSync(path.join(root, packageJsonPath), 'utf8'))
    )
);

export default defineConfig((env) => {
  const base = config(env);
  const conditions = ['@react-navigation/source'];

  return mergeConfig(base, {
    appType: 'custom',
    resolve: {
      conditions,
      dedupe: [
        ...new Set(
          packages.flatMap((pack) => Object.keys(pack.peerDependencies ?? {}))
        ),
      ],
    },
    ssr: {
      noExternal:
        /^(?:@expo|@react-native-vector-icons|@react-navigation|expo(?:-|$)|react-native(?:-|$))/,
      resolve: {
        conditions: [...defaultServerConditions, ...conditions],
      },
      optimizeDeps: {
        esbuildOptions: {
          ...base.optimizeDeps.esbuildOptions,
          plugins: [
            {
              name: 'externalize-react',
              setup(build) {
                build.onResolve(
                  { filter: /^react(?:-dom)?(?:\/.*)?$/ },
                  ({ path }) => ({ external: true, path })
                );
              },
            },
          ],
        },
        include: [
          'expo',
          '@expo-google-fonts/nunito',
          '@expo-google-fonts/outfit',
          '@expo-google-fonts/roboto-slab',
          '@expo-google-fonts/space-grotesk',
          '@react-native-vector-icons/feather',
          '@react-native-vector-icons/ionicons',
          '@react-native-vector-icons/material-design-icons',
          '@expo/react-native-action-sheet',
          'react-native-safe-area-context',
          'react-native-web',
        ],
      },
    },
    plugins: [
      {
        name: 'server-rendering',
        configureServer(server) {
          return () => {
            server.middlewares.use(async (request, response, next) => {
              const accept = request.headers.accept;

              if (
                request.method !== 'GET' ||
                (accept !== '*/*' && !accept?.includes('text/html'))
              ) {
                next();
                return;
              }

              try {
                const template = await server.transformIndexHtml(
                  request.originalUrl,
                  fs.readFileSync(
                    path.join(import.meta.dirname, 'index.html'),
                    'utf8'
                  )
                );

                const [before, after] = template.split('<!--ssr-outlet-->');

                if (after == null) {
                  throw new Error('SSR outlet was not found in index.html');
                }

                const { render } = await server.ssrLoadModule('/server.tsx');

                const stream = await render(
                  new URL(request.originalUrl, 'http://localhost')
                );

                response.setHeader('Content-Type', 'text/html');
                response.write(before);

                await pipeline(stream, response, { end: false });

                response.end(after);
              } catch (error) {
                if (error instanceof Error) {
                  server.ssrFixStacktrace(error);
                }

                if (response.headersSent) {
                  response.destroy(error);
                  return;
                }

                next(error);
              }
            });
          };
        },
      },
    ],
  });
});
