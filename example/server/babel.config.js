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
  presets: [
    '@babel/preset-env',
    '@babel/preset-flow',
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
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
