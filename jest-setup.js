/* @flow */

// See https://github.com/facebook/jest/issues/2208
jest.mock('Linking', () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    openURL: jest.fn(),
    canOpenURL: jest.fn(),
    getInitialURL: jest.fn().mockImplementation((value: string) => Promise.resolve(value)),
  }
});
