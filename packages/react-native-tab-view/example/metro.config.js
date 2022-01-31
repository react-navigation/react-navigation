/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const fs = require('fs');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const { getDefaultConfig } = require('@expo/metro-config');
const escape = require('escape-string-regexp');

const root = path.resolve(__dirname, '..');
const pak = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8')
);

const defaultConfig = getDefaultConfig(__dirname);

const modules = [
  '@babel/runtime',
  '@expo/vector-icons',
  ...Object.keys({
    ...pak.dependencies,
    ...pak.peerDependencies,
  }),
];

module.exports = {
  ...defaultConfig,

  projectRoot: __dirname,
  watchFolders: [root],

  resolver: {
    ...defaultConfig.resolver,

    blacklistRE: exclusionList([
      new RegExp(`^${escape(path.join(root, 'node_modules'))}\\/.*$`),
    ]),

    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
  },
};
