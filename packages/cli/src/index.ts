import program from 'commander';
import installPackage from '@Commands/addPackage';
import getLogger from '@Utils/logger';

const logger = getLogger();

/**
 * CLI setup
 */
program.version('1.0.0').description('CLI To Setup React-Navigation');

program
  .command('add <package>')
  .alias('a')
  .description('install your required package')
  .action(installPackage);

program.parse(process.argv);
