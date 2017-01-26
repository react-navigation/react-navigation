/**
 * RN CLI Config that allows Exponent to work with this project
 *
 * Extends the base rn-cli.config.js at the root of the project to use a custom transfomer and a
 * special blacklist.
 */

const path = require('path');
const config = require('../../../rn-cli.config');

config.getBlacklist = () => [
  new RegExp(`${path.resolve(__dirname, '../../..')}/node_modules/react-native/(.*)`),
  new RegExp(`${path.resolve(__dirname, '../../..')}/node_modules/react/(.*)`),
  ...config.getBlacklistForExample('NavigationPlayground'),
  new RegExp(`^${path.resolve(__dirname, '..')}/package.json$`),
];

config.getTransformModulePath = () => path.resolve(__dirname, './transformer.js');

config.getTransformOptions = () => ({
  reactNativePath: path.resolve(__dirname, '../node_modules/react-native/'),
  reactPath: path.resolve(__dirname, '../node_modules/react/'),
});

module.exports = config;
