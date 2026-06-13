import { expect, test } from '@jest/globals';

import { getStateFromHref } from '../getStateFromHref';

test('gets navigation state from an absolute path', () => {
  expect(
    getStateFromHref(
      '/profile/jane',
      {
        config: {
          screens: {
            Profile: 'profile/:user',
          },
        },
      },
      undefined
    )
  ).toEqual({
    routes: [
      {
        name: 'Profile',
        params: { user: 'jane' },
        path: '/profile/jane',
      },
    ],
  });
});

test('gets navigation state from a prefixed URL', () => {
  expect(
    getStateFromHref(
      'example://app/settings?tab=privacy',
      {
        prefixes: ['example://app'],
        config: {
          screens: {
            Settings: {
              path: 'settings',
              parse: {
                tab: String,
              },
            },
          },
        },
      },
      undefined
    )
  ).toEqual({
    routes: [
      {
        name: 'Settings',
        params: { tab: 'privacy' },
        path: '/settings?tab=privacy',
      },
    ],
  });
});

test('throws when href is filtered out', () => {
  expect(() =>
    getStateFromHref(
      'example://app/settings',
      {
        prefixes: ['example://app'],
        filter: () => false,
      },
      undefined
    )
  ).toThrow(
    "Failed to parse href 'example://app/settings'. It doesn't match the filter specified in linking config."
  );
});

test("throws when href doesn't match prefixes", () => {
  expect(() =>
    getStateFromHref(
      'example://app/settings',
      {
        prefixes: ['example://other'],
      },
      undefined
    )
  ).toThrow(
    "Got invalid href 'example://app/settings'. It must start with '/' or match one of the prefixes: 'example://other'."
  );
});

test('throws when relative href has no prefixes', () => {
  expect(() => getStateFromHref('settings', undefined, undefined)).toThrow(
    "Failed to parse href 'settings'. It doesn't start with '/' and no prefixes are defined in linking config."
  );
});
