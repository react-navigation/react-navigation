import 'mock-require-assets';

import mock from 'mock-require';
import Module from 'module';

// We need to make sure that .web.xx extensions are resolved before .xx
// @ts-expect-error: _extensions doesn't exist in the type definitions
Module._extensions = Object.fromEntries(
  // @ts-expect-error _extensions doesn't exist in the type definitions
  Object.entries(Module._extensions).sort((a, b) => {
    return b[0].split('.').length - a[0].split('.').length;
  })
);

// Set __DEV__ that expo needs
// @ts-expect-error __DEV__ doesn't exist in the type definitions
global.__DEV__ = process.env.NODE_ENV !== 'production';

// Reanimated doesn't support SSR :(
mock(
  'react-native-reanimated',
  // eslint-disable-next-line import/no-commonjs, @typescript-eslint/no-var-requires
  require('react-native-reanimated/mock')
);

// expo-asset breaks because it imports internals :()
mock(
  'react-native-web/Libraries/Image/AssetRegistry',
  // eslint-disable-next-line import/no-commonjs, @typescript-eslint/no-var-requires
  require('react-native-web/dist/modules/AssetRegistry')
);
