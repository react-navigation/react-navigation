const path = require('path');
const fs = require('fs');

const packages = path.resolve(__dirname, '..', '..', 'packages');

const alias = Object.fromEntries(
  fs
    .readdirSync(packages)
    .filter((name) => !name.startsWith('.'))
    .map((name) => [name, require(`../../packages/${name}/package.json`)])
    .filter(([, pak]) => pak.exports['.'].source != null)
    .map(([name, pak]) => [
      pak.name,
      path.resolve(packages, name, pak.exports['.'].source),
    ])
);

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['..'],
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          'react-native': 'react-native-web',
          ...alias,
        },
      },
    ],
  ],
};
