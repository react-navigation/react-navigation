const noop: any = () => {};

export let useReduxDevToolsExtension: typeof import('./useReduxDevToolsExtension').useReduxDevToolsExtension;

if (process.env.NODE_ENV !== 'production') {
  useReduxDevToolsExtension =
    require('./useReduxDevToolsExtension').useReduxDevToolsExtension;
} else {
  useReduxDevToolsExtension = noop;
}
