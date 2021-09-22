import * as shell from 'shelljs';
import fs from 'fs';
import path from 'path';
import isExpoADependency from './isExpoADependency';

export interface ICheckAndGetInstallerReturn {
  installer: string | null;
  state: ICheckState;
  rootDirectory: string | undefined;
}

export interface ICheckState {
  isPackageJsonFound: boolean;
  isExpoFound: boolean;
  isYarnPackageLockFound: boolean;
  isNpmPackageLockFound: boolean;
  isYarnInstalled: boolean;
  isNpmInstalled: boolean;
}

/**
 * check and get installer
 * traverse upward till finding the root directory through the package.json file
 */
function checkAndGetInstaller(dir: string): ICheckAndGetInstallerReturn {
  let precDir: string = '';

  const result: ICheckAndGetInstallerReturn = {
    installer: null,
    state: {
      isPackageJsonFound: false,
      isExpoFound: false,
      isYarnPackageLockFound: false,
      isNpmPackageLockFound: false,
      isYarnInstalled: false,
      isNpmInstalled: false,
    },
    rootDirectory: undefined,
  };

  /**
   * traversing
   */
  while (dir !== precDir) {
    const packageJsonFile = path.resolve(dir, 'package.json');

    if (fs.existsSync(packageJsonFile)) {
      const stat = fs.statSync(packageJsonFile);
      if (!stat.isDirectory()) {
        result.rootDirectory = dir;
        result.state.isPackageJsonFound = true;
        const packageJsonText = fs.readFileSync(packageJsonFile, 'utf8');
        // ---- expo is a dependency -----
        if (isExpoADependency(packageJsonText)) {
          result.state.isExpoFound = true;
          result.installer = 'expo';
          return result;
        }
        // ---- yarn lock -----
        if (fs.existsSync(path.resolve(dir, 'yarn.lock'))) {
          result.state.isYarnPackageLockFound = true;
          result.installer = 'yarn';
          return result;
        }
        // ---- npm lock -----
        if (fs.existsSync(path.resolve(dir, 'package.lock'))) {
          result.state.isNpmPackageLockFound = true;
          result.installer = 'npm';
          return result;
        }

        // ---- no expo, no lock ----
        // check if yarn command is installed
        if (shell.which('yarn')) {
          result.state.isYarnInstalled = true;
        }

        // check if yarn command is installed
        if (shell.which('npm')) {
          result.state.isNpmInstalled = true;
        }

        if (result.state.isYarnInstalled) {
          result.installer = 'yarn';
        } else if (result.state.isNpmInstalled) {
          result.installer = 'npm';
        }

        return result;
      }
    }
    precDir = dir;
    dir = path.resolve(dir, '..');
  }
  return result;
}

export default checkAndGetInstaller;
