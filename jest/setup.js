/* eslint-env jest */
/* eslint-disable import/no-extraneous-dependencies */

import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

const error = console.error;

console.error = (...args) =>
  // Suppress error messages regarding error boundary in tests
  /(Consider adding an error boundary to your tree to customize error handling behavior|React will try to recreate this component tree from scratch using the error boundary you provided|Error boundaries should implement getDerivedStateFromError)/m.test(
    args[0]
  )
    ? void 0
    : error(...args);
