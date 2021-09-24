import shell, { ShellString } from 'shelljs';
import getLogger from './logger';

const logger = getLogger();

const installPeersDependencies = (
  metaData: any,
  installer: string
): ShellString | null => {
  logger.log('Install Peers Dependencies ...');
  if (metaData.peerDependencies) {
    /**
     * construct packages string
     */
    let packages = Object.entries(metaData.peerDependencies).reduce(
      (packagesStr, [pack, version]) => {
        if (['react', 'react-native'].includes(pack)) {
          return packagesStr;
        }

        let versionStr = '';
        if (installer !== 'expo') {
          versionStr = version
            ? `@${(version as string).replace(/ /g, '')}`
            : '';
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
    const install = (command: string): ShellString => {
      logger.log(command);
      return shell.exec(command);
    };

    if (['expo', 'yarn'].includes(installer)) {
      // yarn and expo
      return install(
        `npx ${installer} add ${packages} ${
          installer === 'yarn' ? ` --save` : ''
        }`
      );
    } else {
      // npm
      return install(`${installer} install ${packages} --save`);
    }
  } else {
    return null;
  }
};

export default installPeersDependencies;
