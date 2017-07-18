/* eslint-disable import/no-commonjs */

const path = require('path');
const escape = require('escape-string-regexp');
const blacklist = require('react-native/packager/blacklist');

module.exports = {
  getProjectRoots() {
    return [__dirname, path.resolve(__dirname, '..')];
  },
  getProvidesModuleNodeModules() {
    return ['react-native', 'react', 'prop-types'];
  },
  getBlacklistRE() {
    return blacklist([
      new RegExp(
        `^${escape(path.resolve(__dirname, '..', 'node_modules'))}\\/.*$`
      ),
    ]);
  },
};
