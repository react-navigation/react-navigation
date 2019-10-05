/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');
const project = require('../package.json');
const escape = require('escape-string-regexp');

const projectDependencies = Object.keys({
  ...project.dependencies,
  ...project.peerDependencies,
});

module.exports = {
  projectRoot: __dirname,
  watchFolders: [path.resolve(__dirname, '..')],

  resolver: {
    blacklistRE: blacklist([
      new RegExp(
        `^${escape(
          path.resolve(__dirname, 'node_modules', project.name)
        )}\\/.*$`
      ),
      new RegExp(
        `^${escape(path.resolve(__dirname, '..', 'node_modules'))}\\/.*$`
      ),
    ]),

    providesModuleNodeModules: [
      '@expo/vector-icons',
      '@babel/runtime',
      'react-navigation',
      ...projectDependencies,
    ],
  },
};
