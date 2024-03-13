const noop: any = () => {};

export let useReduxDevToolsExtension: typeof import('./useReduxDevToolsExtension').useReduxDevToolsExtension;

if (process.env.NODE_ENV !== 'production') {
  useReduxDevToolsExtension =
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('./useReduxDevToolsExtension').useReduxDevToolsExtension;
} else {
  useReduxDevToolsExtension = noop;
}
