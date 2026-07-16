const path = require('path');
const fs = require('fs');

const condition = '@react-navigation/source';
const packages = path.resolve(__dirname, '..', '..', 'packages');

const alias = Object.fromEntries(
  fs
    .readdirSync(packages)
    .filter((dir) => !dir.startsWith('.'))
    .map((dir) => [dir, require(`../../packages/${dir}/package.json`)])
    .flatMap(([dir, pak]) =>
      Object.entries(pak.exports || {})
        .reverse()
        .map(([key, value]) => {
          const target = typeof value === 'string' ? value : value[condition];

          return target == null
            ? null
            : [
                path.join(pak.name, key.replace(/\/\*$/, '')),
                path.resolve(packages, dir, target.replace(/\/\*$/, '')),
              ];
        })
        .filter(Boolean)
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
          'react-native': require.resolve('react-native-web'),
          ...alias,
        },
      },
    ],
  ],
};
