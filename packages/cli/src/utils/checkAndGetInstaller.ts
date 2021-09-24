import shell from 'shelljs';
import fs from 'fs';
import path from 'path';
import isExpoADependency from './isExpoADependency';

export interface ICheckAndGetInstallerReturn {
  installer: string | null;
  state: ICheckState;
  rootDirectory: string | null;
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
  const userPickedInstaller = process.env.installer || null;
  let precDir: string = '';

  const result: ICheckAndGetInstallerReturn = {
    installer: userPickedInstaller || null,
    state: {
      isPackageJsonFound: false,
      isExpoFound: false,
      isYarnPackageLockFound: false,
      isNpmPackageLockFound: false,
      isYarnInstalled: false,
      isNpmInstalled: false,
    },
    rootDirectory: null,
  };

  // check if yarn command is installed
  if (shell.which('yarn')) {
    result.state.isYarnInstalled = true;
  }

  // check if yarn command is installed
  if (shell.which('npm')) {
    result.state.isNpmInstalled = true;
  }

  /**
   * traversing
   */
  while (dir !== precDir) {
    const packageJsonFile = path.resolve(dir, 'package.json');

    if (fs.existsSync(packageJsonFile)) {
      const stat = fs.statSync(packageJsonFile);
      if (!stat.isDirectory()) {
        result.rootDirectory = dir || null;
        result.state.isPackageJsonFound = true;
        const packageJsonText = fs.readFileSync(packageJsonFile, 'utf8');

        // ---- expo is a dependency -----
        if (isExpoADependency(packageJsonText)) {
          result.state.isExpoFound = true;
          result.installer = userPickedInstaller || 'expo';
        }
        // ---- yarn lock -----
        if (fs.existsSync(path.resolve(dir, 'yarn.lock'))) {
          result.state.isYarnPackageLockFound = true;
          result.installer = result.installer || userPickedInstaller || 'yarn';
        }
        // ---- npm lock -----
        if (fs.existsSync(path.resolve(dir, 'package.lock'))) {
          result.state.isNpmPackageLockFound = true;
          result.installer = result.installer || userPickedInstaller || 'npm';
        }

        // ---- no expo, no lock ----
        if (!result.installer) {
          if (result.state.isYarnInstalled) {
            result.installer = userPickedInstaller || 'yarn';
          } else if (result.state.isNpmInstalled) {
            result.installer = userPickedInstaller || 'npm';
          }
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
