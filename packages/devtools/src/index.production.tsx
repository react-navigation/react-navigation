const noop = () => {};

export const {
  useLogger,
  useReduxDevToolsExtension,
}: typeof import('./index.development') = {
  useLogger: noop,
  useReduxDevToolsExtension: noop,
};
