const noop: any = () => {};

export let useLogger: typeof import('./useLogger').useLogger;
export let useReduxDevToolsExtension: typeof import('./useReduxDevToolsExtension').useReduxDevToolsExtension;

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  useLogger = require('./useLogger').useLogger;
  useReduxDevToolsExtension =
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('./useReduxDevToolsExtension').useReduxDevToolsExtension;
} else {
  useLogger = noop;
  useReduxDevToolsExtension = noop;
}
