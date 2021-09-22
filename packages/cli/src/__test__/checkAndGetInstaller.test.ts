import { vol } from 'memfs';
import checkAndGetInstaller from '../utils/checkAndGetInstaller';

jest.mock('fs');

const defaultDirectoriesStructure = {
  projectRoot: {
    childDir: {
      childDir2: {
        'readme.md': 'test',
      },
    },
  },
};

it('No package.json', async () => {
  vol.reset();

  vol.fromNestedJSON(
    defaultDirectoriesStructure,
    'tmp' // cwd
  );

  let installer = checkAndGetInstaller('/tmp/projectRoot/childDir/childDir2');
  expect(installer).toBe(null);
  installer = checkAndGetInstaller('/tmp/projectRoot');
  expect(installer).toBe(null);
});

it('Package.json and expo', async () => {
  vol.reset();

  vol.fromNestedJSON(
    {
      ...defaultDirectoriesStructure,
      'package.json': "{ dependencies: { expo: '^2.0.0' } }",
    },
    'tmp' // cwd
  );

  let installer = checkAndGetInstaller('/tmp/projectRoot/childDir/childDir2');
  expect(installer).toBe('expo');
  installer = checkAndGetInstaller('/tmp/projectRoot');
  expect(installer).toBe('expo');
});

it('Package.json and yarn.lock (alone)', async () => {
  vol.reset();

  vol.fromNestedJSON(
    {
      ...defaultDirectoriesStructure,
      'yarn.lock': '{}',
      'package.json': "{ dependencies: { super: '^2.0.0' } }",
    },
    'tmp' // cwd
  );

  let installer = checkAndGetInstaller('/tmp/projectRoot/childDir/childDir2');
  expect(installer).toBe('yarn');
  installer = checkAndGetInstaller('/tmp/projectRoot');
  expect(installer).toBe('yarn');
});

it('Package.json and package.lock (alone)', async () => {
  vol.reset();

  vol.fromNestedJSON(
    {
      ...defaultDirectoriesStructure,
      'package.lock': '{}',
      'package.json': "{ dependencies: { super: '^2.0.0' } }",
    },
    'tmp' // cwd
  );

  let installer = checkAndGetInstaller('/tmp/projectRoot/childDir/childDir2');
  expect(installer).toBe('npm');
  installer = checkAndGetInstaller('/tmp/projectRoot');
  expect(installer).toBe('npm');
});

it('Package.json and expo and yarn.lock and package.lock', async () => {
  vol.reset();

  vol.fromNestedJSON(
    {
      ...defaultDirectoriesStructure,
      'yarn.lock': '{}',
      'package.lock': '{}',
      'package.json': "{ dependencies: { expo: '^2.0.0' } }",
    },
    'tmp' // cwd
  );

  let installer = checkAndGetInstaller('/tmp/projectRoot/childDir/childDir2');
  expect(installer).toBe('expo');
  installer = checkAndGetInstaller('/tmp/projectRoot');
  expect(installer).toBe('expo');
});
