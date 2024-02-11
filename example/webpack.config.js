const path = require('path');
const fs = require('fs');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

const packages = path.resolve(__dirname, '..', 'packages');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.module.rules.push({
    test: /\.(js|ts|tsx)$/,
    include: /(packages|example)\/.+/,
    exclude: /node_modules/,
    use: 'babel-loader',
  });

  fs.readdirSync(packages)
    .filter((name) => !name.startsWith('.'))
    .forEach((name) => {
      const pak = require(`../packages/${name}/package.json`);

      if (pak.source == null) {
        return;
      }

      config.resolve.alias[pak.name] = path.resolve(packages, name, pak.source);
    });

  config.resolve.fallback = { crypto: false };

  return config;
};
