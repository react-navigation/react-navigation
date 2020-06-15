const noop: any = () => {};

export let useReduxDevToolsExtension: typeof import('./useReduxDevToolsExtension').default;

if (process.env.NODE_ENV !== 'production') {
  useReduxDevToolsExtension = require('./useReduxDevToolsExtension').default;
} else {
  useReduxDevToolsExtension = noop;
}
