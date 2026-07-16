import 'mock-require-assets';

import Module from 'module';

const FONT_REGEX = /\.(eot|woff|woff2|ttf|otf)$/;

// @ts-expect-error: _load doesn't exist in the type definitions
const load = Module._load;

// @ts-expect-error: _load doesn't exist in the type definitions
Module._load = (request: string, parent: unknown, isMain: boolean) => {
  if (FONT_REGEX.test(request)) {
    return request;
  }

  return load(request, parent, isMain);
};

// We need to make sure that .web.xx extensions are resolved before .xx
// @ts-expect-error: _extensions doesn't exist in the type definitions
Module._extensions = Object.fromEntries(
  // @ts-expect-error _extensions doesn't exist in the type definitions
  Object.entries(Module._extensions).sort((a, b) => {
    return b[0].split('.').length - a[0].split('.').length;
  })
);

// Set __DEV__ that expo needs
Object.assign(globalThis, {
  __DEV__: process.env.NODE_ENV !== 'production',
});
