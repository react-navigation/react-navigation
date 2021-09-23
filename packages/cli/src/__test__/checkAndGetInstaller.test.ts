import { vol } from 'memfs';
import checkAndGetInstaller from '../utils/checkAndGetInstaller';
import shell from 'shelljs';

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

it('Package.json and yarn.lock and package.lock', async () => {
  vol.reset();

  vol.fromNestedJSON(
    {
      ...defaultDirectoriesStructure,
      'yarn.lock': '{}',
      'package.lock': '{}',
      'package.json': "{ dependencies: { supper: '^2.0.0' } }",
    },
    'tmp' // cwd
  );

  let installer = checkAndGetInstaller('/tmp/projectRoot/childDir/childDir2');
  expect(installer).toBe('yarn');
  installer = checkAndGetInstaller('/tmp/projectRoot');
  expect(installer).toBe('yarn');
});

it('Package.json and no expo, no yarn.lock, no package.lock and yarn installed', async () => {
  vol.reset();

  vol.fromNestedJSON(
    {
      ...defaultDirectoriesStructure,
      'package.json': "{ dependencies: { supper: '^2.0.0' } }",
    },
    'tmp' // cwd
  );

  function runTest() {
    let installer = checkAndGetInstaller('/tmp/projectRoot/childDir/childDir2');
    expect(installer).toBe('yarn');
    installer = checkAndGetInstaller('/tmp/projectRoot');
    expect(installer).toBe('yarn');
  }

  if (shell.which('yarn')) {
    runTest();
  } else {
    /**
     * No yarn installed
     */
    // install
    shell.exec('npm i -g yarn');
    runTest();
    // remove
    shell.exec('npm uninstall -g yarn');
  }
});

it('Package.json and no expo, no yarn.lock, no package.lock and yarn not installed', async () => {
  vol.reset();

  vol.fromNestedJSON(
    {
      ...defaultDirectoriesStructure,
      'package.json': "{ dependencies: { supper: '^2.0.0' } }",
    },
    'tmp' // cwd
  );

  const runTest = () => {
    let installer = checkAndGetInstaller('/tmp/projectRoot/childDir/childDir2');
    expect(installer).toBe('npm');
    installer = checkAndGetInstaller('/tmp/projectRoot');
    expect(installer).toBe('npm');
  };

  if (shell.which('yarn')) {
    /**
     * Yarn installed already
     * ( we remove it, test and then install it back again )
     */
    // get yarn version
    const yarnVersion = shell.exec('yarn -v');
    // remove
    shell.exec('npm uninstall -g yarn');
    runTest();
    shell.exec(`npm i -g yarn@${yarnVersion}`);
  } else {
    /**
     * No yarn installed
     */
    runTest();
  }
});
