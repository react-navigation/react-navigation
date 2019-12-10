/* eslint-env jest */

jest.mock('@react-native-community/masked-view', () => () => null);

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');

  const SafeAreaContext = React.createContext({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  return {
    __esModule: true,

    SafeAreaContext,
    SafeAreaProvider: SafeAreaContext.Provider,
    SafeAreaConsumer: SafeAreaContext.Consumer,
  };
});

jest.mock('react-native-gesture-handler', () => ({
  PanGestureHandler: 'PanGestureHandler',
  BaseButton: 'BaseButton',
  State: {
    UNDETERMINED: 0,
    FAILED: 1,
    BEGAN: 2,
    CANCELLED: 3,
    ACTIVE: 4,
    END: 5,
  },
}));

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);
