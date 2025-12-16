const path = require('path');
const fs = require('fs');

const packages = path.resolve(__dirname, '..', '..', 'packages');

const alias = Object.fromEntries(
  fs
    .readdirSync(packages)
    .filter((dir) => !dir.startsWith('.'))
    .map((dir) => [dir, require(`../../packages/${dir}/package.json`)])
    .flatMap(([dir, pak]) =>
      Object.entries(pak.exports || {})
        .reverse()
        .filter(([, value]) => value.source != null)
        .map(([key, value]) => [
          path.join(pak.name, key),
          path.resolve(packages, dir, value.source),
        ])
    )
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
