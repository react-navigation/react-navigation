/* eslint-disable import/no-commonjs, import/no-extraneous-dependencies */
/* eslint-env node */

const path = require('path');
const fs = require('fs');
const escape = require('escape-string-regexp');
const blacklist = require('metro-config/src/defaults/blacklist');

module.exports = {
  projectRoot: __dirname,
  watchFolders: [path.resolve(__dirname, '..', '..')],

  resolver: {
    blacklistRE: blacklist(
      [
        ...fs
          .readdirSync(path.resolve(__dirname, '..'))
          .filter(d => d !== 'example'),
        '..',
      ].map(
        it =>
          new RegExp(
            `^${escape(
              path.resolve(__dirname, '..', it, 'node_modules')
            )}\\/.*$`
          )
      )
    ),

    providesModuleNodeModules: [
      '@babel/runtime',
      'react',
      'react-native',
      'react-native-gesture-handler',
      'react-native-reanimated',
      'react-native-safe-area-view',
      'react-native-tab-view',
      'shortid',
    ],
  },

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
