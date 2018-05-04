/* eslint-disable import/no-commonjs */

const path = require('path');
const glob = require('glob-to-regexp');
const blacklist = require('metro-bundler/src/blacklist');
const pak = require('../package.json');

const dependencies = Object.keys(pak.dependencies);
const peerDependencies = Object.keys(pak.peerDependencies);

module.exports = {
  getProjectRoots() {
    return [__dirname, path.resolve(__dirname, '..')];
  },
  getProvidesModuleNodeModules() {
    return [...dependencies, ...peerDependencies];
  },
  getBlacklistRE() {
    return blacklist([
      glob(`${path.resolve(__dirname, '..')}/node_modules/*`),
      glob(`${__dirname}/node_modules/*/{${dependencies.join(',')}}`, {
        extended: true,
      }),
    ]);
  },
};
