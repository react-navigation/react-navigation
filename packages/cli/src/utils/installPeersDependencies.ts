import shell from 'shelljs';
import getLogger from './logger';

const logger = getLogger();

const installPeersDependencies = (metaData: any, installer: string) => {
  logger.log('Install Peers Dependencies ...');
  if (metaData.peerDependencies) {
    /**
     * construct packages string
     */
    let packages = Object.entries(metaData.peerDependencies).reduce(
      (packagesStr, [pack, version]: [string, string]) => {
        if (['react', 'react-native'].includes(pack)) {
          return packagesStr;
        }

        let versionStr = '';
        if (installer !== 'expo') {
          versionStr = version ? `@${version.replace(/ /g, '')}` : '';
        }

        return `${packagesStr} "${pack}${versionStr}"`;
      },
      ''
    );

    logger.log('Peers dependencies to install :');
    logger.log('===============================');
    logger.log(packages.split(' ').join('\n').substr(1));
    logger.log('===============================');

    /**
     * install packages
     */
    const install = (command: string): void => {
      logger.log(command);
      shell.exec(command);
    };

    if (['expo', 'yarn'].includes(installer)) {
      // yarn and expo
      install(
        `npx ${installer} add ${packages} ${
          installer === 'yarn' ? ` --save` : ''
        }`
      );
    } else {
      // npm
      install(`${installer} install ${packages} --save`);
    }
  }
};

export default installPeersDependencies;
