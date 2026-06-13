import { expect, test } from '@jest/globals';

import { validatePathConfig } from '../validatePathConfig';

test('accepts a valid root and nested config', () => {
  expect(() =>
    validatePathConfig({
      path: 'app',
      initialRouteName: 'Home',
      screens: {
        Home: 'home',
        Profile: {
          path: 'profile/:id',
          exact: true,
          alias: ['user'],
          parse: { id: Number },
          stringify: { id: String },
          shared: true,
          screens: {
            Settings: 'settings',
          },
        },
      },
    })
  ).not.toThrow();
});

test('throws if the config is not an object', () => {
  expect(() => validatePathConfig('feed')).toThrow(
    'Expected the configuration to be an object, but got "feed".'
  );
  expect(() => validatePathConfig(null)).toThrow(
    'Expected the configuration to be an object, but got null.'
  );
});

test('throws for a property with the wrong type', () => {
  expect(() => validatePathConfig({ path: 42 })).toThrow(
    "path (expected 'string', got 'number')"
  );
});

test('throws if an array property is not an array', () => {
  expect(() =>
    validatePathConfig({
      screens: {
        Home: {
          alias: 'start',
        },
      },
    })
  ).toThrow("alias (expected 'Array', got 'string')");
});

test('throws for extraneous properties', () => {
  expect(() => validatePathConfig({ path: 'app', title: 'Home' })).toThrow(
    'title (extraneous)'
  );
});

test('rejects nested-only properties at the root level', () => {
  const run = () => validatePathConfig({ exact: true, alias: ['home'] });

  expect(run).toThrow('exact (extraneous)');
  expect(run).toThrow('alias (extraneous)');
});

test('throws if a top-level path contains param patterns', () => {
  expect(() => validatePathConfig({ path: 'users/:id' })).toThrow(
    "Found invalid path 'users/:id'. The 'path' in the top-level configuration cannot contain patterns for params."
  );
});

test('ignores properties explicitly set to undefined', () => {
  expect(() =>
    validatePathConfig({ path: undefined, screens: undefined })
  ).not.toThrow();
});
