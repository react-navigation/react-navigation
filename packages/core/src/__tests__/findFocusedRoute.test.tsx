import { expect, test } from '@jest/globals';

import { findFocusedRoute } from '../findFocusedRoute';

test('returns route when there is no nested state', () => {
  expect(
    findFocusedRoute({
      routes: [{ name: 'Home', params: { user: 'jane' } }],
    })
  ).toEqual({ name: 'Home', params: { user: 'jane' } });
});

test('returns focused route from nested state', () => {
  expect(
    findFocusedRoute({
      index: 1,
      routes: [
        { name: 'Home' },
        {
          name: 'Profile',
          state: {
            index: 1,
            routes: [
              { name: 'Feed' },
              {
                name: 'Details',
                state: {
                  routes: [{ name: 'Comments' }],
                },
              },
            ],
          },
        },
      ],
    })
  ).toEqual({ name: 'Comments' });
});

test('uses last route when nested state has no index', () => {
  expect(
    findFocusedRoute({
      routes: [
        {
          name: 'Home',
          state: {
            routes: [{ name: 'Feed' }, { name: 'Profile' }],
          },
        },
      ],
    })
  ).toEqual({ name: 'Profile' });
});

test('returns undefined when there are no routes', () => {
  expect(findFocusedRoute({ routes: [] })).toBeUndefined();
});
