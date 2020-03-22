module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],

    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@react-navigation/core': '../packages/core/src',
            '@react-navigation/native': '../packages/native/src',
            'react-navigation': '../packages/react-navigation/src',
            'react-navigation-animated-switch':
              '../packages/animated-switch/src',
            'react-navigation-drawer': '../packages/drawer/src',
            'react-navigation-material-bottom-tabs':
              '../packages/material-bottom-tabs/src',
            'react-navigation-stack': '../packages/stack/src',
            'react-navigation-tabs': '../packages/tabs/src',
          },
        },
      ],
    ],
  };
};
