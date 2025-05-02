/* global console */
/* eslint-disable import-x/no-extraneous-dependencies */
import 'react-native-gesture-handler/jestSetup';

import { setUpTests } from 'react-native-reanimated';

setUpTests();

const error = console.error;

console.error = (...args) =>
  // Suppress error messages regarding error boundary in tests
  /(Consider adding an error boundary to your tree to customize error handling behavior|React will try to recreate this component tree from scratch using the error boundary you provided|Error boundaries should implement getDerivedStateFromError)/m.test(
    args[0]
  )
    ? void 0
    : error(...args);
