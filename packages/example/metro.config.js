/* eslint-disable import/no-extraneous-dependencies */

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
      '@expo/vector-icons',
      '@react-native-community/masked-view',
      'escape-string-regexp',
      'query-string',
      'react',
      'react-native',
      'react-native-gesture-handler',
      'react-native-reanimated',
      'react-native-safe-area-context',
      'react-native-screens',
      'react-native-paper',
      'react-native-tab-view',
      'shortid',
      'use-subscription',
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
