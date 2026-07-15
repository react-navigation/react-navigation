import { expect, test } from '@jest/globals';

import { getStateFromRouteParams } from '../getStateFromRouteParams';

test('returns undefined for missing or non-object params', () => {
  expect(getStateFromRouteParams(undefined)).toBeUndefined();
  expect(getStateFromRouteParams({})).toBeUndefined();
  expect(getStateFromRouteParams({ foo: 'bar' })).toBeUndefined();
});

test('passes through a valid nested state', () => {
  const state = { index: 1, routes: [{ name: 'Home' }, { name: 'Profile' }] };

  expect(getStateFromRouteParams({ state })).toBe(state);
});

test('ignores a state whose routes are missing names', () => {
  expect(getStateFromRouteParams({ state: { routes: [{}] } })).toBeUndefined();
});

test('builds a state from screen and params', () => {
  expect(
    getStateFromRouteParams({ screen: 'Profile', params: { id: 1 } })
  ).toEqual({
    routes: [{ name: 'Profile', params: { id: 1 } }],
  });
});

test('includes the path when provided', () => {
  expect(
    getStateFromRouteParams({ screen: 'Profile', path: '/profile' })
  ).toEqual({
    routes: [{ name: 'Profile', path: '/profile' }],
  });
});

test('recursively builds nested state from nested screen params', () => {
  expect(
    getStateFromRouteParams({
      screen: 'Root',
      params: { screen: 'Profile', params: { id: 1 } },
    })
  ).toEqual({
    routes: [
      {
        name: 'Root',
        params: { screen: 'Profile', params: { id: 1 } },
        state: {
          routes: [{ name: 'Profile', params: { id: 1 } }],
        },
      },
    ],
  });
});
