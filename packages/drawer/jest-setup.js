/**
 * eslint-env jest
 */

// No setup

import React from 'react';

jest.mock('./src/views/DrawerLayout', () => {
  const View = require.requireActual('View');
  class DrawerLayout extends View {
    static positions = {
      Left: 'left',
      Right: 'right',
    };
  }
  return DrawerLayout;
});
