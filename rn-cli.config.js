// Copyright 2004-present Facebook. All Rights Reserved.

/**
 * React Native CLI configuration file.
 * Make it possible to run examples by starting the packager
 * from the root of this repo. That way the packager can
 * see both the react-navigation code and the examples.
 */

const blacklist = require('react-native/packager/blacklist');
const config = require('react-native/packager/rn-cli.config');

const examples = [
  'NavigationPlayground',
  'HelloHybrid',
  'LinkingExample',
  'ReduxExample',
  'Chat',
];

config.getBlacklist = () => (
  examples.reduce((a, example) => a.concat([
    ...config.getBlacklistForExample(example),
    new RegExp(`examples/${example}/__exponent/(.*)`),
  ]), [])
);

config.getBlacklistForExample = (example) => ([
  ...examples.filter(x => x !== example).map(x => new RegExp(`examples/${x}/node_modules/react-native/(.*)`)),
  ...examples.filter(x => x !== example).map(x => new RegExp(`examples/${x}/node_modules/react/(.*)`)),
  new RegExp(`examples/${example}/node_modules/react-navigation/(.*)`),
]);

config.getBlacklistRE = () => blacklist(config.getBlacklist());

config.getProjectRoots = () => getRoots();
config.getAssetRoots = () => getRoots();

function getRoots() {
  return [
    __dirname,
  ];
}

module.exports = config;
