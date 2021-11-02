const noop: any = () => {};

export let useReduxDevToolsExtension: typeof import('./useReduxDevToolsExtension').default;
export let useFlipper: typeof import('./useFlipper').default;

if (process.env.NODE_ENV !== 'production') {
  useReduxDevToolsExtension = require('./useReduxDevToolsExtension').default;
  useFlipper = require('./useFlipper').default;
} else {
  useReduxDevToolsExtension = noop;
  useFlipper = noop;
}
