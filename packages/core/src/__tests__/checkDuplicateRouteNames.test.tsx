import { expect, test } from '@jest/globals';
import type { NavigationState } from '@react-navigation/routers';

import { checkDuplicateRouteNames } from '../checkDuplicateRouteNames';

test('returns no duplicates when nested route names are unique', () => {
  const state: NavigationState = {
    key: 'stack-1',
    index: 0,
    routeNames: ['Home'],
    type: 'stack',
    stale: false,
    routes: [
      {
        key: 'home-1',
        name: 'Home',
        state: {
          routeNames: ['Feed', 'Profile'],
          routes: [{ name: 'Feed' }, { name: 'Profile' }],
        },
      },
    ],
  };

  expect(checkDuplicateRouteNames(state)).toEqual([]);
});

test('detects a nested navigator reusing its parent route name', () => {
  const state: NavigationState = {
    key: 'stack-1',
    index: 0,
    routeNames: ['Home'],
    type: 'stack',
    stale: false,
    routes: [
      {
        key: 'home-1',
        name: 'Home',
        state: {
          routeNames: ['Home', 'Settings'],
          routes: [{ name: 'Home' }, { name: 'Settings' }],
        },
      },
    ],
  };

  expect(checkDuplicateRouteNames(state)).toEqual([['Home', 'Home > Home']]);
});

test('reports the full location path for deeply nested duplicates', () => {
  const state: NavigationState = {
    key: 'stack-1',
    index: 0,
    routeNames: ['Root'],
    type: 'stack',
    stale: false,
    routes: [
      {
        key: 'root-1',
        name: 'Root',
        state: {
          routeNames: ['Profile'],
          routes: [
            {
              name: 'Profile',
              state: {
                routeNames: ['Profile'],
                routes: [{ name: 'Profile' }],
              },
            },
          ],
        },
      },
    ],
  };

  expect(checkDuplicateRouteNames(state)).toEqual([
    ['Root > Profile', 'Root > Profile > Profile'],
  ]);
});
