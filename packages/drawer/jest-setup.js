/* eslint-env jest */

import NativeModules from 'NativeModules';

Object.assign(NativeModules, {
  RNGestureHandlerModule: {
    attachGestureHandler: jest.fn(),
    createGestureHandler: jest.fn(),
    dropGestureHandler: jest.fn(),
    updateGestureHandler: jest.fn(),
    State: {},
    Directions: {},
  },
  ReanimatedModule: {
    createNode: jest.fn(),
    configureProps: jest.fn(),
    configureNativeProps: jest.fn(),
    connectNodes: jest.fn(),
    disconnectNodes: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
  PlatformConstants: {
    forceTouchAvailable: false,
  },
});

jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: {
    View: require('react-native').Animated.View,
    Text: require('react-native').Animated.Text,
    Clock: jest.fn(),
    Value: jest.fn(),
    onChange: jest.fn(),
    interpolate: jest.fn(),
    abs: jest.fn(),
    add: jest.fn(),
    sub: jest.fn(),
    and: jest.fn(),
    block: jest.fn(),
    call: jest.fn(),
    clockRunning: jest.fn(),
    cond: jest.fn(),
    divide: jest.fn(),
    eq: jest.fn(),
    event: jest.fn(),
    greaterThan: jest.fn(),
    lessThan: jest.fn(),
    max: jest.fn(),
    min: jest.fn(),
    multiply: jest.fn(),
    neq: jest.fn(),
    or: jest.fn(),
    set: jest.fn(),
    spring: jest.fn(),
    startClock: jest.fn(),
    stopClock: jest.fn(),
    timing: jest.fn(),
  },
  Easing: {
    out: jest.fn(),
  },
}));
