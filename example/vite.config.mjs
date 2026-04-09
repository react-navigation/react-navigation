import fs from 'node:fs';
import path from 'node:path';

import config from 'react-native-builder-bob/vite-config';
import { defineConfig, mergeConfig } from 'vite';

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

export default defineConfig((env) =>
  mergeConfig(config(env), {
    resolve: {
      dedupe: [
        ...new Set(
          packages.flatMap((pack) => Object.keys(pack.peerDependencies ?? {}))
        ),
      ],
    },
  })
);
