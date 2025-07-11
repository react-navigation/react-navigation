const path = require('path');
const { withMetroConfig } = require('react-native-monorepo-config');
// eslint-disable-next-line import-x/no-extraneous-dependencies
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = withMetroConfig(getDefaultConfig(__dirname), {
  root: path.resolve(__dirname, '..'),
  dirname: __dirname,
});

/** @type {import('metro-config').MetroConfig} */
module.exports = {
  ...defaultConfig,

  resolver: {
    ...defaultConfig.resolver,

    resolveRequest: (context, realModuleName, platform) => {
      // We mock out react-native-gesture-handler and react-native-reanimated on web
      // This is an additional measure to ensure they don't get added accidentally
      if (
        platform === 'web' &&
        (realModuleName === 'react-native-gesture-handler' ||
          realModuleName === 'react-native-reanimated')
      ) {
        throw new Error(
          `The module '${realModuleName}' should not be imported on Web.`
        );
      }

      return defaultConfig.resolver.resolveRequest(
        context,
        realModuleName,
        platform
      );
    },
  },

  server: {
    ...defaultConfig.server,

    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        // When an asset is imported outside the project root, it has wrong path on Android
        // So we fix the path to correct one
        if (/\/packages\/.+\.png\?.+$/.test(req.url)) {
          req.url = `/assets/../${req.url}`;
        }

        return middleware(req, res, next);
      };
    },
  },
};
