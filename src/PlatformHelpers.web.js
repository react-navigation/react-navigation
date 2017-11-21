/* @flow */

export const Linking = {
  addEventListener: () => {},
  removeEventListener: () => {},
  getInitialURL: (() => Promise.reject('Unsupported platform'): () => Promise<
    string
  >),
};

export const BackHandler = {
  addEventListener: () => {},
};
