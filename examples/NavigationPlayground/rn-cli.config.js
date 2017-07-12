/**
 * RN CLI Config that allows Exponent to work with this project
 *
 * Extends the base rn-cli.config.js at the root of the project to use a custom transfomer and a
 * special blacklist.
 */

const fs = require('fs');
const path = require('path');
const blacklist = require('react-native/packager/blacklist');
const config = require('react-native/packager/rn-cli.config');

const examples = getDirectories(path.join(__dirname, '..'));
const CURRENT_EXAMPLE = 'NavigationPlayground';

const getBlacklistForExample = (example) => [
  ...examples.filter(x => x !== example).map(exampleName => new RegExp(`${path.resolve(__dirname, '..')}/${exampleName}/(.*)`))
];

config.getBlacklist = () => [
  new RegExp(
    `${path.resolve(__dirname, '../..')}/node_modules/react-native/(.*)`
  ),
  new RegExp(`${path.resolve(__dirname, '../..')}/node_modules/react/(.*)`),
  ...getBlacklistForExample(CURRENT_EXAMPLE)
];

config.getBlacklistRE = () => blacklist(config.getBlacklist());

config.getTransformModulePath = () =>
  path.resolve(__dirname, 'transformer.js');

config.getTransformOptions = () => ({
  reactNativePath: path.resolve(__dirname, 'node_modules/react-native/'),
  reactPath: path.resolve(__dirname, 'node_modules/react/'),
});

config.getProjectRoots = () => getRoots();
config.getAssetRoots = () => getRoots();

function getRoots() {
  return [path.join(__dirname, '..', '..')];
}

function getDirectories (srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
}

module.exports = config;
