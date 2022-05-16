import type { SpawnSyncReturns } from 'child_process';

import { exec } from './exec';
import getLogger from './logger';
import { TextStyle } from './textStyle';

const logger = getLogger();

const installPeersDependencies = (
  metaData: any,
  installer: string
): SpawnSyncReturns<any> | null => {
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

    logger.log(`\n${TextStyle.highlight}Peers dependencies to install :`);
    logger.log(`${TextStyle.underline}===============================`);
    logger.log(TextStyle.green + packages.split(' ').join('\n').substr(1));
    logger.log(
      `${TextStyle.underline}===============================${TextStyle.reset}\n`
    );

    /**
     * install packages
     */
    const install = (command: string): SpawnSyncReturns<any> => {
      logger.log(`${TextStyle.command}${command}${TextStyle.reset}`);
      return exec(command);
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
