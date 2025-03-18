const noop: any = () => {};

export let useLogger: typeof import('./useLogger').useLogger;
export let useReduxDevToolsExtension: typeof import('./useReduxDevToolsExtension').useReduxDevToolsExtension;

if (process.env.NODE_ENV !== 'production') {
   
  useLogger = require('./useLogger').useLogger;
  useReduxDevToolsExtension =
     
    require('./useReduxDevToolsExtension').useReduxDevToolsExtension;
} else {
  useLogger = noop;
  useReduxDevToolsExtension = noop;
}
