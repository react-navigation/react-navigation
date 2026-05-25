import { glob, readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';
import { URL } from 'node:url';
import { styleText } from 'node:util';

// eslint-disable-next-line import-x/no-extraneous-dependencies
import semver from 'semver';

const root = new URL('../', import.meta.url);
const dependencyFields = ['dependencies', 'devDependencies'];
const command = process.argv[2];

if (command !== 'check' && command !== 'align') {
  process.stderr.write(
    `${styleText('red', 'Usage:')} ${process.argv[1]} <check|align>\n`
  );

  process.exit(1);
}

const rootPackage = JSON.parse(
  await readFile(new URL('package.json', root), 'utf8')
);

const packagePaths = await Array.fromAsync(
  glob(
    [
      'package.json',
      ...rootPackage.workspaces.map((workspace) => `${workspace}/package.json`),
    ],
    {
      cwd: root,
    }
  )
);

const packages = await Promise.all(
  packagePaths.toSorted().map(async (packagePath) => ({
    json: JSON.parse(await readFile(new URL(packagePath, root), 'utf8')),
    path: packagePath,
    url: new URL(packagePath, root),
  }))
);

const entries = packages.flatMap((pkg) =>
  dependencyFields.flatMap((field) =>
    Object.entries(pkg.json[field] ?? {}).map(([dependency, version]) => ({
      dependency,
      field,
      pkg,
      version,
    }))
  )
);

const exampleVersions = new Map(
  entries
    .filter(({ pkg }) => pkg.path === 'example/package.json')
    .map(({ dependency, field, pkg, version }) => [
      dependency,
      {
        source: `${pkg.path} ${field}.${dependency}`,
        version,
      },
    ])
);

const expectedVersions = new Map(exampleVersions);

for (const entry of entries) {
  if (exampleVersions.has(entry.dependency)) {
    continue;
  }

  const expected = expectedVersions.get(entry.dependency);
  const currentVersion = semver.coerce(entry.version);
  const expectedVersion =
    expected == null ? undefined : semver.coerce(expected.version);

  if (
    expected == null ||
    (currentVersion != null &&
      expectedVersion != null &&
      semver.gt(currentVersion, expectedVersion)) ||
    (currentVersion == null &&
      expectedVersion == null &&
      entry.version.localeCompare(expected.version) > 0)
  ) {
    expectedVersions.set(entry.dependency, {
      source: `${entry.pkg.path} ${entry.field}.${entry.dependency}`,
      version: entry.version,
    });
  }
}

const differences = entries
  .filter(({ dependency, version }) => {
    return expectedVersions.get(dependency)?.version !== version;
  })
  .map((entry) => ({
    ...entry,
    expected: expectedVersions.get(entry.dependency),
  }));

if (differences.length === 0) {
  process.stdout.write(
    `${styleText('green', 'Dependency versions are aligned.')}\n`
  );
  process.exit(0);
}

if (command === 'check') {
  process.stderr.write(
    `${styleText('red', 'Dependency version differences found:')}\n`
  );

  for (const [dependency, dependencies] of Map.groupBy(
    differences,
    (difference) => difference.dependency
  )) {
    const [{ expected }] = dependencies;

    process.stderr.write(
      `\n${styleText('bold', dependency)}: expected ${styleText(
        'green',
        expected.version
      )} from ${styleText('gray', expected.source)}\n`
    );

    for (const { field, pkg, version } of dependencies) {
      process.stderr.write(
        `  - ${styleText(
          'gray',
          `${pkg.path} ${field}.${dependency}`
        )}: ${styleText('red', version)}\n`
      );
    }
  }

  process.exit(1);
}

for (const { dependency, expected, field, pkg } of differences) {
  pkg.json[field][dependency] = expected.version;
}

await Promise.all(
  [...new Set(differences.map(({ pkg }) => pkg))].map(({ json, url }) =>
    writeFile(url, `${JSON.stringify(json, null, 2)}\n`)
  )
);

process.stdout.write(`${styleText('green', 'Dependency versions aligned.')}\n`);
