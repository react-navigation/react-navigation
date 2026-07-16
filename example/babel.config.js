/** @type {import('@babel/core').TransformOptions} */
module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    overrides: [
      {
        exclude: (filename = '') => /\/node_modules\//.test(filename),
        plugins: ['@babel/plugin-transform-strict-mode'],
      },
      {
        include: (filename = '') => /\/packages\//.test(filename),
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
