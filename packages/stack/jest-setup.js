/**
 * eslint-env jest
 */

jest.mock('react-native-gesture-handler', () => ({
  PanGestureHandler: 'PanGestureHandler',
}));

import React from 'react';
