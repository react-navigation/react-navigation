const path = require('path');

const monorepoRoot = path.resolve(__dirname, '..');
const nativePackageRoot = path.join(monorepoRoot, 'packages', 'native');

module.exports = {
  project: {
    ios: {
      automaticPodsInstallation: true,
    },
  },
  dependencies: {
    '@react-navigation/native': {
      root: nativePackageRoot,
      platforms: {
        ios: {
          podspecPath: path.join(nativePackageRoot, 'IsFullScreen.podspec'),
        },
        android: null,
      },
    },
  },
};
