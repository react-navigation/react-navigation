const path = require('path');
const fs = require('fs');

const packages = path.resolve(__dirname, '..', '..', 'packages');

const alias = Object.fromEntries(
  fs
    .readdirSync(packages)
    .filter((name) => !name.startsWith('.'))
    .map((name) => [
      `@react-navigation/${name}`,
      path.resolve(
        packages,
        name,
        require(`../../packages/${name}/package.json`).source
      ),
    ])
);

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['..'],
        alias: {
          'react-native': 'react-native-web',
          ...alias,
        },
      },
    ],
  ],
};
