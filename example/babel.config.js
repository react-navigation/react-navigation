const path = require('path');
const fs = require('fs');

const packages = path.resolve(__dirname, '..', 'packages');

/** @type {import('@babel/core').TransformOptions} */
module.exports = function (api) {
  api.cache(true);

  const alias = Object.fromEntries(
    fs
      .readdirSync(packages)
      .filter((name) => !name.startsWith('.'))
      .map((name) => {
        const pak = require(`../packages/${name}/package.json`);

        if (pak.source == null) {
          return null;
        }

        return [pak.name, path.resolve(packages, name, pak.source)];
      })
      .filter(Boolean)
  );

  return {
    presets: ['babel-preset-expo'],
    overrides: [
      {
        exclude: /\/node_modules\//,
        plugins: [
          '@babel/plugin-transform-strict-mode',
          [
            'module-resolver',
            {
              extensions: ['.tsx', '.ts', '.js', '.json'],
              alias,
            },
          ],
        ],
      },
      {
        include: /\/packages\//,
        presets: [
          [
            'module:react-native-builder-bob/babel-preset',
            { modules: 'commonjs' },
          ],
        ],
      },
    ],
  };
};
