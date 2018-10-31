/**
 * eslint-env jest
 */

jest.mock('react-native-gesture-handler', () => ({
  PanGestureHandler: 'PanGestureHandler',
  BaseButton: 'BaseButton',
}));

import React from 'react';
