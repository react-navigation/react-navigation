export const Linking = {
  addEventListener: () => {},
  removeEventListener: () => {},
  getInitialURL: () => Promise.reject('Unsupported platform'),
};

export const BackHandler = {
  addEventListener: () => {},
};
