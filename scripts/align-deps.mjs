#!/usr/bin/env node

import { glob, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import semver from 'semver';

const root = fileURLToPath(new URL('../', import.meta.url));
const rootPackage = JSON.parse(
  await readFile(path.join(root, 'package.json'), 'utf8')
);

const workspaces = (
  await Promise.all(
    rootPackage.workspaces.map((workspace) =>
      Array.fromAsync(glob(workspace, { cwd: root }))
    )
  )
).flat();

const packages = await Promise.all(
  workspaces.map(async (workspace) => {
    const content = await readFile(
      path.join(root, workspace, 'package.json'),
      'utf8'
    );

    return JSON.parse(content);
  })
);

const highestDependencyVersions = packages.reduce((acc, pkg) => {
  Object.entries({
    ...pkg.optionalDependencies,
    ...pkg.devDependencies,
    ...pkg.dependencies,
  }).forEach(([name, version]) => {
    if (version.startsWith('workspace:')) {
      return;
    }

    if (
      !acc[name] ||
      semver.gt(
        semver.coerce(version).version,
        semver.coerce(acc[name]).version
      )
    ) {
      acc[name] = version;
    }
  });

  return acc;
}, {});

await Promise.all(
  packages.map(async (pkg) => {
    for (const type of [
      'optionalDependencies',
      'devDependencies',
      'dependencies',
    ]) {
      if (!pkg[type]) {
        continue;
      }

      Object.entries(pkg[type]).forEach(([name, version]) => {
        if (version.startsWith('workspace:')) {
          return;
        }

        if (highestDependencyVersions[name]) {
          pkg[type][name] = highestDependencyVersions[name];
        }
      });
    }
  })
);
