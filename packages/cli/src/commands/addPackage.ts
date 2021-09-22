import fetch from 'node-fetch';
import checkAndGetInstaller from '../utils/checkAndGetInstaller';
import getLogger from '../utils/logger';

const logger = getLogger();

const installPackage = async (pack: string): Promise<any> => {
  /**
   * Fetching package meta data
   */
  logger.log('Fetching package metadata ...');
  const [packName, version = 'latest'] = pack.split('@');

  let metaData;

  try {
    let response = await fetch(
      `https://registry.npmjs.org/@react-navigation/${packName}/${version}`
    );

    metaData = await response.json();

    logger.verbose('Meta data');
    logger.verbose(metaData);
  } catch (e) {
    logger.error('Please enter a valid React-Navigation Package');
  }

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

  logger.verbose(`Installer: ${installer}\nrootDirectory: ${rootDirectory}`);
  logger.debug({ installer, getInstallerState, rootDirectory });
};

export default installPackage;
