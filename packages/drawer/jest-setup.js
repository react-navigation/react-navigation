/**
 * eslint-env jest
 */

// No setup

import React from 'react';

[
  'react-native-drawer-layout-polyfill',

  // tests don't test the native bits, so just substitute the same
  // fake polyfill for now
  'react-native-gesture-handler/DrawerLayout',
].forEach(module => {
  jest.mock(module, () => {
    const View = require.requireActual('View');
    class DrawerLayout extends View {
      static positions = {
        Left: 'left',
        Right: 'right',
      };
    }
    return DrawerLayout;
  });
})
