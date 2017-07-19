/**
 * RN CLI Config that allows Exponent to work with this project
 *
 * Extends the base rn-cli.config.js at the root of the project to use a custom transfomer and a
 * special blacklist.
 */

const fs = require('fs');
const path = require('path');
const blacklist = require('react-native/packager/blacklist');

const CURRENT_EXAMPLE = 'NavigationPlayground';

const examples = getDirectories(path.join(__dirname, '..'));

const getBlacklistForExample = (example) => [
  ...examples.filter(x => x !== example).map(exampleName => new RegExp(`${path.resolve(__dirname, '..')}/${exampleName}/(.*)`))
];

const config = {};

config.getBlacklist = () => [
  new RegExp(
    `${path.resolve(__dirname, '../..')}/node_modules/react-native/(.*)`
  ),
  new RegExp(`${path.resolve(__dirname, '../..')}/node_modules/react/(.*)`),
  new RegExp(`${path.resolve(__dirname, '../..')}/lib-rn/(.*)`),
  new RegExp(`${path.resolve(__dirname, '../..')}/lib/(.*)`),
  ...getBlacklistForExample(CURRENT_EXAMPLE)
];

config.getBlacklistRE = () => blacklist(config.getBlacklist());

function getRoots() {
  return [path.join(__dirname)];
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
}

module.exports = config;
