import program from 'commander';
import installPackage from './commands/addPackage';
import getLogger from './utils/logger';

const logger = getLogger();

/**
 * CLI setup
 */
program.version('1.0.0').description('CLI To Setup React-Navigation');

program
  .command('add <package>')
  .alias('a')
  .description('install your required package')
  .action(installPackage)
  .option('-i, --installer <installer>', 'Choose the installer to use manually')
  .option('-V, --verbose', 'output in verbose mode')
  .option('-d, --debug', 'output extra debugging')
  .on('option:installer', function () {
    process.env.installer = program.opts().installer;
  })
  .on('option:verbose', function () {
    logger.setIsVerbose(program.opts().verbose);
  })
  .on('option:debug', function () {
    logger.setIsDebug(program.opts().debug);
  });

program.parse(process.argv);
