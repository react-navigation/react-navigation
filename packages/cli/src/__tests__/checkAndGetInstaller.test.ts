import { vol as mockVol } from 'memfs';
import checkAndGetInstaller from '../utils/checkAndGetInstaller';
import shell from 'shelljs';

/**
 * Mocking fs
 */
jest.mock('fs', () => mockVol);

/**
 * mocking shell which function
 */
let shellWhich: any = { npm: true, yarn: true };
shell.which = (command: string) => shellWhich[command];

/**
 * Creating default memfs volume and helper
 */
const ROOT_PATH = 'projectRoot';

const defaultDirectoriesStructure = {
  [ROOT_PATH]: {
    childDir: {
      childDir2: {
        'readme.md': 'test',
      },
    },
  },
};

const addToProjectRoot = (elementsToAdd: any): any => {
  return {
    ...defaultDirectoriesStructure,
    [ROOT_PATH]: {
      ...defaultDirectoriesStructure[ROOT_PATH],
      ...elementsToAdd,
    },
  };
};

/**
 * Tests
 */
describe('Checks tests cases', () => {
  it('No package.json', async () => {
    mockVol.fromNestedJSON(defaultDirectoriesStructure, '/testTmp');

    const runTest = (path: string): void => {
      const { installer, rootDirectory, state } = checkAndGetInstaller(path);
      expect(installer).toBe(null);
      expect(rootDirectory).toBe(null);
      expect(state.isExpoFound).toBe(false);
      expect(state.isPackageJsonFound).toBe(false);
      expect(state.isNpmPackageLockFound).toBe(false);
      expect(state.isYarnPackageLockFound).toBe(false);
    };

    runTest('/testTmp/projectRoot/childDir/childDir2');
    runTest('/testTmp/projectRoot');
  });

  it('Package.json and expo', async () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      addToProjectRoot({
        'package.json': JSON.stringify({ dependencies: { expo: '^2.0.0' } }),
      }),
      '/testTmp'
    );

    const runTest = (path: string): void => {
      const { installer, rootDirectory, state } = checkAndGetInstaller(path);
      expect(installer).toBe('expo');
      expect(rootDirectory).toBe('/testTmp/projectRoot');
      expect(state.isExpoFound).toBe(true);
      expect(state.isPackageJsonFound).toBe(true);
      expect(state.isNpmPackageLockFound).toBe(false);
      expect(state.isYarnPackageLockFound).toBe(false);
    };

    runTest('/testTmp/projectRoot/childDir/childDir2');
    runTest('/testTmp/projectRoot');
  });

  it('Package.json and yarn.lock (alone)', async () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      addToProjectRoot({
        'yarn.lock': '{}',
        'package.json': JSON.stringify({ dependencies: { super: '^2.0.0' } }),
      }),
      '/testTmp'
    );

    const runTest = (path: string): void => {
      const { installer, rootDirectory, state } = checkAndGetInstaller(path);
      expect(installer).toBe('yarn');
      expect(rootDirectory).toBe('/testTmp/projectRoot');
      expect(state.isExpoFound).toBe(false);
      expect(state.isPackageJsonFound).toBe(true);
      expect(state.isNpmPackageLockFound).toBe(false);
      expect(state.isYarnPackageLockFound).toBe(true);
    };

    runTest('/testTmp/projectRoot/childDir/childDir2');
    runTest('/testTmp/projectRoot');
  });

  it('Package.json and package.lock (alone)', async () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      addToProjectRoot({
        'package.lock': '{}',
        'package.json': JSON.stringify({ dependencies: { super: '^2.0.0' } }),
      }),
      '/testTmp'
    );

    const runTest = (path: string): void => {
      const { installer, rootDirectory, state } = checkAndGetInstaller(path);
      expect(installer).toBe('npm');
      expect(rootDirectory).toBe('/testTmp/projectRoot');
      expect(state.isExpoFound).toBe(false);
      expect(state.isPackageJsonFound).toBe(true);
      expect(state.isNpmPackageLockFound).toBe(true);
      expect(state.isYarnPackageLockFound).toBe(false);
    };

    runTest('/testTmp/projectRoot/childDir/childDir2');
    runTest('/testTmp/projectRoot');
  });

  it('Package.json and expo and yarn.lock and package.lock', async () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      addToProjectRoot({
        'yarn.lock': '{}',
        'package.lock': '{}',
        'package.json': JSON.stringify({ dependencies: { expo: '^2.0.0' } }),
      }),
      '/testTmp'
    );

    const runTest = (path: string): void => {
      const { installer, rootDirectory, state } = checkAndGetInstaller(path);
      expect(installer).toBe('expo');
      expect(rootDirectory).toBe('/testTmp/projectRoot');
      expect(state.isExpoFound).toBe(true);
      expect(state.isPackageJsonFound).toBe(true);
      expect(state.isNpmPackageLockFound).toBe(true);
      expect(state.isYarnPackageLockFound).toBe(true);
    };

    runTest('/testTmp/projectRoot/childDir/childDir2');
    runTest('/testTmp/projectRoot');
  });

  it('Package.json and yarn.lock and package.lock', async () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      addToProjectRoot({
        'yarn.lock': '{}',
        'package.lock': '{}',
        'package.json': JSON.stringify({ dependencies: { supper: '^2.0.0' } }),
      }),
      '/testTmp'
    );

    const runTest = (path: string): void => {
      const { installer, rootDirectory, state } = checkAndGetInstaller(path);
      expect(installer).toBe('yarn');
      expect(rootDirectory).toBe('/testTmp/projectRoot');
      expect(state.isExpoFound).toBe(false);
      expect(state.isPackageJsonFound).toBe(true);
      expect(state.isNpmPackageLockFound).toBe(true);
      expect(state.isYarnPackageLockFound).toBe(true);
    };

    runTest('/testTmp/projectRoot/childDir/childDir2');
    runTest('/testTmp/projectRoot');
  });

  it('Package.json and no expo, no yarn.lock, no package.lock and yarn installed', async () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      addToProjectRoot({
        'package.json': JSON.stringify({ dependencies: { supper: '^2.0.0' } }),
      }),
      '/testTmp'
    );

    const runTest = (path: string): void => {
      const { installer, rootDirectory, state } = checkAndGetInstaller(path);
      expect(installer).toBe('yarn');
      expect(rootDirectory).toBe('/testTmp/projectRoot');
      expect(state.isExpoFound).toBe(false);
      expect(state.isPackageJsonFound).toBe(true);
      expect(state.isNpmPackageLockFound).toBe(false);
      expect(state.isYarnPackageLockFound).toBe(false);
    };

    shellWhich.yarn = true;
    runTest('/testTmp/projectRoot/childDir/childDir2');
    runTest('/testTmp/projectRoot');
  });

  it('Package.json and no expo, no yarn.lock, no package.lock and yarn not installed', async () => {
    mockVol.reset();
    mockVol.fromNestedJSON(
      addToProjectRoot({
        'package.json': JSON.stringify({ dependencies: { supper: '^2.0.0' } }),
      }),
      '/testTmp'
    );

    const runTest = (path: string): void => {
      const { installer, rootDirectory, state } = checkAndGetInstaller(path);
      expect(installer).toBe('npm');
      expect(rootDirectory).toBe('/testTmp/projectRoot');
      expect(state.isExpoFound).toBe(false);
      expect(state.isPackageJsonFound).toBe(true);
      expect(state.isNpmPackageLockFound).toBe(false);
      expect(state.isYarnPackageLockFound).toBe(false);
    };

    /**
     * Yarn installed already
     * ( we remove it, test and then install it back again )
     */
    // test
    shellWhich.yarn = false;
    runTest('/testTmp/projectRoot/childDir/childDir2');
    runTest('/testTmp/projectRoot');
  });
});
