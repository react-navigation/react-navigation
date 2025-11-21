/** @type {import('@babel/core').TransformOptions} */
module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    overrides: [
      {
        exclude: /\/node_modules\//,
        plugins: ['@babel/plugin-transform-strict-mode'],
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
