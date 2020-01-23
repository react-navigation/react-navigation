module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          'react-native-tab-view': '../src/index',
        },
      },
    ],
  ],
};
