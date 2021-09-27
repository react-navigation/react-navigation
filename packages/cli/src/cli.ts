#!/usr/bin/env node
/* eslint-disable babel/no-invalid-this */

import program, { Command } from 'commander';
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
  .on('option:installer', function (this: Command) {
    process.env.installer = this.opts().installer;
  })
  .on('option:verbose', function (this: Command) {
    logger.setIsVerbose(this.opts().verbose);
  })
  .on('option:debug', function (this: Command) {
    logger.setIsDebug(this.opts().debug);
  });

program.parse(process.argv);
