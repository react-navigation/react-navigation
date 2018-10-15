/* eslint-disable import/no-commonjs */

const path = require('path');
const glob = require('glob-to-regexp');
const blacklist = require('metro/src/blacklist');
const pak = require('../package.json');
const pak2 = require('./package.json');

const dependencies = Object.keys(pak.dependencies);
const localDependencies = Object.keys(pak2.dependencies);
const peerDependencies = Object.keys(pak.peerDependencies);

module.exports = {
  getProjectRoots() {
    return [__dirname, path.resolve(__dirname, '..')];
  },
  getProvidesModuleNodeModules() {
    return [...dependencies, ...localDependencies, ...peerDependencies];
  },
  getBlacklistRE() {
    return blacklist([glob(`${path.resolve(__dirname, '..')}/node_modules/*`)]);
  },
};
