import enquirer from 'enquirer';
import fetch from 'node-fetch';
import ora from 'ora';
import shell from 'shelljs';

import addReactNativeGestureHandlerImport from '../utils/addReactNativeGestureHandlerImport';
import checkAndGetInstaller from '../utils/checkAndGetInstaller';
import { exec } from '../utils/exec';
import installPeersDependencies from '../utils/installPeersDependencies';
import getLogger from '../utils/logger';
import { TextStyle } from '../utils/textStyle';

const logger = getLogger();

const installPackage = async (pack: string): Promise<any> => {
  /**
   * Fetching package meta data
   */
  const startingFetchingText = 'Fetching package metadata';
  const fetchMetaSpinner = ora(
    `${TextStyle.stepStart}${startingFetchingText}`
  ).start();
  const [packName, version = 'latest'] = pack.split('@');

  let metaData: any;

  try {
    let response = await fetch(
      `https://registry.npmjs.org/@react-navigation/${packName}/${version}`
    );

    metaData = await response.json();

    if (typeof metaData === 'string' && metaData.includes('Not Found')) {
      fetchMetaSpinner.fail(
        'Package not found! Please enter a valid React-Navigation Package!'
      );
      return;
    }

    fetchMetaSpinner.succeed(`${TextStyle.stepDone}${startingFetchingText}`);
    logger.verbose(`${TextStyle.highlight}Meta data${TextStyle.reset}`);
    logger.verbose(metaData);
  } catch (e: any) {
    fetchMetaSpinner.fail(
      'Error fetching meta data! Check the package name is right or your network!'
    );
    logger.error(`${TextStyle.failed}${e.message}${TextStyle.reset}`);
    return;
  }

  const checkInstallerText = 'Check and determining installer';
  const getInstallerSpinner = ora(
    `${TextStyle.stepStart}${checkInstallerText}`
  ).start();

  /**
   * Get installer after check
   * - Use expo if we find expo in the dependencies of package.json
   * - Use yarn if the user has yarn.lock file
   * - Use npm if the user has package-json.lock
   * - If no lockfile is present, use yarn if it's installed, otherwise npm
   * */
  const {
    installer,
    state: getInstallerState,
    rootDirectory,
  } = checkAndGetInstaller(process.cwd());

  if (installer) {
    getInstallerSpinner.succeed(`${TextStyle.stepDone}${checkInstallerText}`);
  } else {
    getInstallerSpinner.fail();
  }

  logger.verbose(
    `Installer: ${TextStyle.highlight}${installer}\nrootDirectory: ${TextStyle.highlight}${rootDirectory}${TextStyle.reset}\n`
  );
  logger.debug({ installer, getInstallerState, rootDirectory });
  /**
   * No installer
   */
  if (!installer) {
    if (!getInstallerState.isPackageJsonFound) {
      throw new Error(
        'No root project was found! No package.json was found. Make sure your project already have one.'
      );
    }

    if (!getInstallerState.isNpmInstalled) {
      throw new Error(
        'Npm not installed. Make sure you have a working node installation and npm! And try again!'
      );
    }
  }

  /**
   * Install package
   */
  logger.log(`\n`);
  const installPackageSpinner = ora(
    `${TextStyle.stepStart}Install ${TextStyle.highlight}${pack} ${TextStyle.stepStart}package\n`
  ).start();

  const install = (command: string): void => {
    logger.log(`${TextStyle.command}${command}${TextStyle.reset}`);
    const out = exec(command);
    logger.log('\n');
    if (out.status === 0) {
      installPackageSpinner.succeed(
        `${TextStyle.highlight}${TextStyle.bold}${pack} ${TextStyle.stepDone}package installed successfully${TextStyle.reset}`
      );
    } else {
      installPackageSpinner.fail(
        `${TextStyle.highlight}${pack} ${TextStyle.failed}package installation failed\n`
      );
    }
  };

  shell.cd(rootDirectory as string);

  let versionStr = '';
  if (installer !== 'expo') {
    versionStr = version ? `@${version.replace(/ /g, '')}` : '';
  }

  if (['expo', 'yarn'].includes(installer as string)) {
    // expo and yarn
    install(
      `npx ${installer} add @react-navigation/${packName}${versionStr}${
        installer === 'yarn' ? ` --save` : ''
      }`
    );
  } else {
    // npm
    install(
      `${installer} install @react-navigation/${packName}${versionStr} --save`
    );
  }

  /**
   * Install dependencies
   */
  logger.log(`\n`);
  const installPeersSpinner = ora(
    `${TextStyle.stepStart}Installing peer dependencies\n${TextStyle.reset}`
  ).start();
  const out = installPeersDependencies(metaData, installer as string);

  logger.log('\n');
  if (out && out.status === 0) {
    installPeersSpinner.succeed(
      `${TextStyle.stepDone}Peer dependencies installed successfully${TextStyle.reset}`
    );
  } else {
    if (out) {
      /**
       * Installation executed and failed
       */
      installPeersSpinner.fail(
        `${TextStyle.failed}Failed to install peer dependencies${TextStyle.reset}`
      );
    } else {
      /**
       * No peer dependencies in meta data
       */
      installPeersSpinner.succeed(
        `${TextStyle.stepDone}No peers dependencies in meta data${TextStyle.reset}`
      );
    }
  }

  /**
   * Add `import ${quote}react-native-gesture-handler${quote}` to index.(ts|js)
   */
  if (
    metaData.peerDependencies?.hasOwnProperty('react-native-gesture-handler')
  ) {
    logger.log(`\n`);
    logger.log(
      `${TextStyle.highlight}Package have react-native-gesture-handler as peer dependency!${TextStyle.reset}`
    );

    await addReactNativeGestureHandlerImport(
      rootDirectory as string,
      async () =>
        /**
         * Reverting because we reverted the order of enabled with disabled and that's to have yep on one click (UX).
         * As most of the time that what people want.
         */
        !(
          (await enquirer.prompt({
            name: 'addAutoImportValue',
            type: 'toggle',
            message: 'Do you want the import to be added automatically?',
            enabled: 'Nope',
            disabled: 'Yep',
          } as any)) as any
        ).addAutoImportValue
    );
  }
};

export default installPackage;
