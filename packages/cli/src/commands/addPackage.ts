import fetch from 'node-fetch';
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

    logger.debug('Meta data');
    logger.debug(metaData);
  } catch (e) {
    logger.error('Please enter a valid React-Navigation Package');
  }
};

export default installPackage;
