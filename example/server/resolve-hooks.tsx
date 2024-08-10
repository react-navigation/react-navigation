import 'mock-require-assets';

import Module from 'module';

// We need to make sure that .web.xx extensions are resolved before .xx
// @ts-expect-error: _extensions doesn't exist in the type definitions
Module._extensions = Object.fromEntries(
  // @ts-expect-error _extensions doesn't exist in the type definitions
  Object.entries(Module._extensions).sort((a, b) => {
    return b[0].split('.').length - a[0].split('.').length;
  })
);

// Set __DEV__ that expo needs
// @ts-expect-error __DEV__ doesn't exist in the type definitions
globalThis.__DEV__ = process.env.NODE_ENV !== 'production';
