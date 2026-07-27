/** @type {import('@babel/core').TransformOptions} */
module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    overrides: [
      {
        exclude: (filename) => filename?.includes('/node_modules/'),
        plugins: ['@babel/plugin-transform-strict-mode'],
      },
      {
        include: (filename) => filename?.includes('/packages/'),
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
