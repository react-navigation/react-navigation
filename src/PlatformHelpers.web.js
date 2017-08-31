/* @flow */

export const Linking = {
  addEventListener: () => {},
  removeEventListener: () => {},
  getInitialURL: () => Promise.reject('Unsupported platform'),
};

export const BackHandler = {
  addEventListener: () => {},
};

export const isLoggingEnabled = !!process.env.REACT_NAV_LOGGING;
