import fetch from 'node-fetch';
import shell from 'shelljs';
import ora from 'ora';
import checkAndGetInstaller from '../utils/checkAndGetInstaller';
import installPeersDependencies from '../utils/installPeersDependencies';
import addReactNativeGestureHandlerImport from '../utils/addReactNativeGestureHandlerImport';
import getLogger from '../utils/logger';
import enquirer from 'enquirer';

const logger = getLogger();

const installPackage = async (pack: string): Promise<any> => {
  /**
   * Fetching package meta data
   */
  logger.log('Fetching package metadata ...');
  const fetchMetaSpinner = ora('Fetching package metadata').start();
  const [packName, version = 'latest'] = pack.split('@');

  let metaData;

  try {
    let response = await fetch(
      `https://registry.npmjs.org/@react-navigation/${packName}/${version}`
    );

    metaData = await response.json();

    fetchMetaSpinner.succeed();
    fetchMetaSpinner.stop();

    logger.verbose('Meta data');
    logger.verbose(metaData);
  } catch (e) {
    logger.error('Please enter a valid React-Navigation Package');
  }

  const getInstallerSpinner = ora('Check and determining installer').start();

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
    getInstallerSpinner.succeed();
  } else {
    getInstallerSpinner.fail();
  }

  logger.verbose(`Installer: ${installer}\nrootDirectory: ${rootDirectory}`);
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
  const installPackageSpinner = ora(`Install ${pack} package\n`).start();

  const install = (command: string): void => {
    logger.log(command);
    const out = shell.exec(command);
    if (out.code === 0) {
      installPackageSpinner.succeed(`${pack} package installed successfully`);
    } else {
      installPackageSpinner.fail(`${pack} package installation failed`);
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
  const installPeersSpinner = ora('Installing peer dependencies\n').start();
  const out = installPeersDependencies(metaData, installer as string);
  if (out && out.code === 0) {
    installPeersSpinner.succeed('Peer dependencies installed successfully');
  } else {
    if (out) {
      /**
       * Installation executed and failed
       */
      installPeersSpinner.fail('Failed to install peer dependencies');
    } else {
      /**
       * No peer dependencies in meta data
       */
      installPeersSpinner.succeed('No peers dependencies in meta data');
    }
  }

  /**
   * Add `import ${quote}react-native-gesture-handler${quote}` to index.(ts|js)
   */
  if (
    metaData.peerDependencies?.hasOwnProperty('react-native-gesture-handler')
  ) {
    logger.log('Package have react-native-gesture-handler as peer dependency!');

    const { didAddImport } = await addReactNativeGestureHandlerImport(
      rootDirectory as string,
      async () =>
        /**
         * Reverting because we reverted the order of enabled with disabled and that's to have yep on one click (UX).
         * As most of the time that what people want.
         */
        !((await enquirer.prompt({
          name: 'addAutoImportValue',
          type: 'toggle',
          message: 'Do you want the import to be added automatically?',
          enabled: 'Nope',
          disabled: 'Yep',
        } as any)) as any).addAutoImportValue
    );

    if (!didAddImport) {
      ora().succeed('react-native-gesture-handler import already exists');
    }
  }
};

export default installPackage;
