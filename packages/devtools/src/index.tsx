export const {
  useLogger,
  useReduxDevToolsExtension,
}: typeof import('./index.development') =
  process.env.NODE_ENV !== 'production'
    ? require('./index.development')
    : require('./index.production');
