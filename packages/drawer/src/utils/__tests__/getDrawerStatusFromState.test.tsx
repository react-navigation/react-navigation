import { expect, test } from '@jest/globals';
import type {
  DrawerNavigationState,
  ParamListBase,
} from '@react-navigation/native';

import { getDrawerStatusFromState } from '../getDrawerStatusFromState';

const createState = (
  overrides: Partial<DrawerNavigationState<ParamListBase>>
): DrawerNavigationState<ParamListBase> => ({
  key: 'drawer-1',
  index: 0,
  routeNames: ['Home'],
  routes: [{ key: 'home-1', name: 'Home' }],
  preloadedRouteKeys: [],
  type: 'drawer',
  stale: false,
  default: 'closed',
  history: [{ type: 'route', key: 'home-1' }],
  ...overrides,
});

test('returns the status of the most recent drawer entry', () => {
  expect(
    getDrawerStatusFromState(
      createState({
        history: [
          { type: 'route', key: 'home-1' },
          { type: 'drawer', status: 'open' },
        ],
      })
    )
  ).toBe('open');
});

test('uses the last drawer entry when there are multiple', () => {
  expect(
    getDrawerStatusFromState(
      createState({
        history: [
          { type: 'drawer', status: 'open' },
          { type: 'drawer', status: 'closed' },
        ],
      })
    )
  ).toBe('closed');
});

test('falls back to the default status when there is no drawer entry', () => {
  expect(
    getDrawerStatusFromState(
      createState({
        default: 'open',
        history: [{ type: 'route', key: 'home-1' }],
      })
    )
  ).toBe('open');
});

test('throws for a state without history', () => {
  expect(() =>
    getDrawerStatusFromState({
      ...createState({}),
      // @ts-expect-error history is intentionally missing to test the guard
      history: undefined,
    })
  ).toThrow("Couldn't find the drawer status in the state object.");
});
