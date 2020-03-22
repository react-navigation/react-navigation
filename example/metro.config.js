const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const packages = path.resolve(root, 'packages');

// Get the list of dependencies for all packages in the monorepo
const modules = ['@expo/vector-icons']
  .concat(
    ...fs
      // List all packages under `packages/`
      .readdirSync(packages)
      // Ignore hidden files such as .DS_Store
      .filter((p) => !p.startsWith('.'))
      .map((p) => {
        const pak = JSON.parse(
          fs.readFileSync(path.join(packages, p, 'package.json'), 'utf8')
        );

        // We need to collect list of deps that this package imports
        // Collecting both dependencies are peerDependencies should do it
        return Object.keys({
          ...pak.dependencies,
          ...pak.peerDependencies,
        });
      })
  )
  .sort()
  .filter(
    (m, i, self) =>
      // Remove duplicates
      self.lastIndexOf(m) === i
  );

module.exports = {
  projectRoot: __dirname,

  // We need to watch the root of the monorepo
  // This lets Metro find the monorepo packages automatically using haste
  // This also lets us import modules from monorepo root
  watchFolders: [root],

  resolver: {
    // When we import a package from the monorepo, metro won't be able to find their deps
    // We need to specify them in `extraNodeModules` to tell metro where to find them
    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(root, 'node_modules', name);
      return acc;
    }, {}),
  },

  server: {
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        // When an asset is imported outside the project root, it has wrong path on Android
        // This happens for the back button in stack, so we fix the path to correct one
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
    getTransformOptions: () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
