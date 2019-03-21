/* eslint-disable import/no-commonjs, import/no-extraneous-dependencies */

const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');
const escape = require('escape-string-regexp');
const pak = require('../package.json');

const peerDependencies = Object.keys(pak.peerDependencies);

module.exports = {
  projectRoot: __dirname,
  watchFolders: [path.resolve(__dirname, '..')],

  resolver: {
    blacklistRE: blacklist([
      new RegExp(
        `^${escape(path.resolve(__dirname, '..', 'node_modules'))}\\/.*$`
      ),
    ]),

    providesModuleNodeModules: ['@babel/runtime', ...peerDependencies],
  },
};
