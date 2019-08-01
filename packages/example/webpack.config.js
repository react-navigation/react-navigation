/* eslint-disable import/no-commonjs */
/* eslint-env node */

const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.module.rules.push({
    test: /@navigation-ex/,
    use: 'babel-loader',
  });

  config.resolve.alias['react'] = require.resolve('react');

  return config;
};
