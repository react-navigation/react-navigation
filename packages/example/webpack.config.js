const path = require('path');
const fs = require('fs');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');
// eslint-disable-next-line import/no-extraneous-dependencies
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.module.rules.push({
    test: /\.(js|ts|tsx)$/,
    include: /packages\/.+/,
    use: 'babel-loader',
  });

  config.resolve.plugins = config.resolve.plugins.filter(
    p => !(p instanceof ModuleScopePlugin)
  );

  config.resolve.alias['react'] = path.resolve(
    __dirname,
    'node_modules',
    'react'
  );
  config.resolve.alias['react-native'] = path.resolve(
    __dirname,
    'node_modules',
    'react-native-web'
  );
  config.resolve.alias['react-native-web'] = path.resolve(
    __dirname,
    'node_modules',
    'react-native-web'
  );

  config.resolve.alias[
    '@expo/vector-icons/MaterialCommunityIcons'
  ] = require.resolve('@expo/vector-icons/MaterialCommunityIcons');

  fs.readdirSync(path.join(__dirname, '..')).forEach(name => {
    config.resolve.alias[`@react-navigation/${name}`] = path.resolve(
      __dirname,
      '..',
      name,
      'src'
    );
  });

  return config;
};
