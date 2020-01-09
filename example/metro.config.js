/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const fs = require('fs');
const escape = require('escape-string-regexp');
const blacklist = require('metro-config/src/defaults/blacklist');

const root = path.resolve(__dirname, '..');
const packages = path.resolve(__dirname, '..', 'packages');

const modules = ['@babel/runtime', '@expo/vector-icons']
  .concat(
    ...fs
      .readdirSync(packages)
      .filter(p => !p.startsWith('.'))
      .map(p => {
        const pak = JSON.parse(
          fs.readFileSync(path.join(packages, p, 'package.json'), 'utf8')
        );

        const deps = [];

        if (pak.dependencies) {
          deps.push(...Object.keys(pak.dependencies));
        }

        if (pak.peerDependencies) {
          deps.push(...Object.keys(pak.peerDependencies));
        }

        return deps;
      })
  )
  .sort()
  .filter(
    (m, i, self) =>
      self.lastIndexOf(m) === i && !m.startsWith('@react-navigation/')
  );

module.exports = {
  projectRoot: __dirname,
  watchFolders: [root],

  resolver: {
    blacklistRE: blacklist(
      fs
        .readdirSync(packages)
        .map(p => path.join(packages, p))
        .map(
          it => new RegExp(`^${escape(path.join(it, 'node_modules'))}\\/.*$`)
        )
    ),

    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, '..', 'node_modules', name);
      return acc;
    }, {}),
  },

  server: {
    enhanceMiddleware: middleware => {
      return (req, res, next) => {
        const assets = '/packages/stack/src/views/assets';

        if (req.url.startsWith(assets)) {
          req.url = req.url.replace(
            assets,
            '/assets/../packages/stack/src/views/assets'
          );
        }

        return middleware(req, res, next);
      };
    },
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
