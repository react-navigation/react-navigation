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
    exclude: /node_modules/,
    use: 'babel-loader',
  });

  config.resolve.plugins = config.resolve.plugins.filter(
    p => !(p instanceof ModuleScopePlugin)
  );

  Object.assign(config.resolve.alias, {
    react: path.resolve(__dirname, 'node_modules', 'react'),
    'react-native': path.resolve(__dirname, 'node_modules', 'react-native-web'),
    'react-native-web': path.resolve(
      __dirname,
      'node_modules',
      'react-native-web'
    ),
    'react-native-reanimated': path.resolve(
      __dirname,
      'node_modules',
      'react-native-reanimated-web'
    ),
    '@expo/vector-icons/MaterialCommunityIcons': require.resolve(
      '@expo/vector-icons/MaterialCommunityIcons'
    ),
  });

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
