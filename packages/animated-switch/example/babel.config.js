module.exports = {
  presets: ['expo'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          'react-navigation-animated-switch': '../src/index',
        },
      },
    ],
  ],
};
