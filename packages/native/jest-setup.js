/**
 * @flow
 * eslint-env jest
 */

import React from 'react';

// See https://github.com/facebook/jest/issues/2208
jest.mock('Linking', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  openURL: jest.fn(),
  canOpenURL: jest.fn(),
  getInitialURL: jest
    .fn()
    .mockImplementation((value: string) => Promise.resolve(value)),
}));

// See https://github.com/facebook/react-native/issues/11659
jest.mock('ScrollView', () => {
  // $FlowExpectedError
  const RealComponent = require.requireActual('ScrollView');
  class ScrollView extends RealComponent {
    scrollTo = () => {};
  }
  return ScrollView;
});

// Mock setState so it waits using setImmediate before actually being called,
// so we can use jest's mock timers to control it.
// setState in the test renderer is sync instead of async like react and react-native.
// This doesn't work with our NavigationContainer tests which test react-navigation's
// behaviour against the async nature of setState.
const setState = React.Component.prototype.setState;
// $FlowExpectedError
Object.defineProperty(React.Component.prototype, 'setState', {
  value: function() {
    setImmediate(() => {
      setState.apply(this, arguments);
    });
  },
});

// $FlowExpectedError
Date.now = jest.fn(() => 0);
