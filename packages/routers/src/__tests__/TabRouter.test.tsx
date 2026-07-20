import { beforeEach, expect, jest, test } from '@jest/globals';

import {
  CommonActions,
  type ParamListBase,
  type RouterConfigOptions,
  TabActions,
  type TabNavigationState,
  TabRouter,
} from '../index';

jest.mock('nanoid/non-secure', () => {
  const m = { nanoid: () => String(++m.__key), __key: 0 };

  return m;
});

beforeEach(() => {
  require('nanoid/non-secure').__key = 0;
});

test('gets initial state from route names and params with initialRouteName', () => {
  const router = TabRouter({ initialRouteName: 'baz' });

  expect(
    router.getInitialState({
      routeNames: ['bar', 'baz', 'qux'],
      routeParamList: {
        baz: { answer: 42 },
        qux: { name: 'Jane' },
      },
      routeGetIdList: {},
    })
  ).toEqual({
    index: 1,
    key: 'tab-4',
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-1', name: 'bar' },
      { key: 'baz-2', name: 'baz', params: { answer: 42 } },
      { key: 'qux-3', name: 'qux', params: { name: 'Jane' } },
    ],
    history: [
      { type: 'route', key: 'bar-1' },
      { type: 'route', key: 'baz-2' },
    ],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });
});

test('gets initial state from route names and params without initialRouteName', () => {
  const router = TabRouter({});

  expect(
    router.getInitialState({
      routeNames: ['bar', 'baz', 'qux'],
      routeParamList: {
        baz: { answer: 42 },
        qux: { name: 'Jane' },
      },
      routeGetIdList: {},
    })
  ).toEqual({
    index: 0,
    key: 'tab-4',
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-1', name: 'bar' },
      { key: 'baz-2', name: 'baz', params: { answer: 42 } },
      { key: 'qux-3', name: 'qux', params: { name: 'Jane' } },
    ],
    history: [{ type: 'route', key: 'bar-1' }],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });
});

test('gets rehydrated state from partial state', () => {
  const router = TabRouter({});

  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {
      baz: { answer: 42 },
      qux: { name: 'Jane' },
    },
    routeGetIdList: {},
  };

  expect(
    router.getRehydratedState(
      {
        routes: [
          { key: 'bar-0', name: 'bar' },
          { key: 'qux-1', name: 'qux' },
        ],
      },
      options
    )
  ).toEqual({
    index: 0,
    key: 'tab-2',
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-1', name: 'baz', params: { answer: 42 } },
      { key: 'qux-1', name: 'qux', params: { name: 'Jane' } },
    ],
    history: [{ type: 'route', key: 'bar-0' }],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });

  expect(
    router.getRehydratedState(
      {
        routes: [{ key: 'baz-0', name: 'baz' }],
      },
      options
    )
  ).toEqual({
    index: 1,
    key: 'tab-5',
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-3', name: 'bar' },
      { key: 'baz-0', name: 'baz', params: { answer: 42 } },
      { key: 'qux-4', name: 'qux', params: { name: 'Jane' } },
    ],
    history: [
      { type: 'route', key: 'bar-3' },
      { type: 'route', key: 'baz-0' },
    ],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });

  expect(
    router.getRehydratedState(
      {
        index: 2,
        routes: [
          { key: 'bar-0', name: 'bar' },
          { key: 'baz-1', name: 'baz' },
          { key: 'qux-2', name: 'qux' },
        ],
      },
      options
    )
  ).toEqual({
    index: 2,
    key: 'tab-6',
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-1', name: 'baz', params: { answer: 42 } },
      { key: 'qux-2', name: 'qux', params: { name: 'Jane' } },
    ],
    history: [
      { type: 'route', key: 'bar-0' },
      { type: 'route', key: 'qux-2' },
    ],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });

  expect(
    router.getRehydratedState(
      {
        index: 1,
        routes: [
          { key: 'bar-0', name: 'bar' },
          { key: 'qux-2', name: 'qux' },
        ],
      },
      options
    )
  ).toEqual({
    index: 2,
    key: 'tab-8',
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-7', name: 'baz', params: { answer: 42 } },
      { key: 'qux-2', name: 'qux', params: { name: 'Jane' } },
    ],
    history: [
      { type: 'route', key: 'bar-0' },
      { type: 'route', key: 'qux-2' },
    ],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });

  expect(
    router.getRehydratedState(
      {
        index: 4,
        routes: [],
      },
      options
    )
  ).toEqual({
    index: 0,
    key: 'tab-12',
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-9', name: 'bar' },
      { key: 'baz-10', name: 'baz', params: { answer: 42 } },
      { key: 'qux-11', name: 'qux', params: { name: 'Jane' } },
    ],
    history: [{ type: 'route', key: 'bar-9' }],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });

  expect(
    router.getRehydratedState(
      {
        index: 1,
        history: [
          { type: 'route', key: 'bar-test' },
          { type: 'route', key: 'qux-test' },
          { type: 'route', key: 'foo-test' },
        ],
        routes: [],
      },
      options
    )
  ).toEqual({
    index: 0,
    key: 'tab-16',
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-13', name: 'bar' },
      { key: 'baz-14', name: 'baz', params: { answer: 42 } },
      { key: 'qux-15', name: 'qux', params: { name: 'Jane' } },
    ],
    history: [{ type: 'route', key: 'bar-13' }],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });
});

test("doesn't rehydrate state if it's not stale", () => {
  const router = TabRouter({});

  const state: TabNavigationState<ParamListBase> = {
    index: 0,
    key: 'tab-test',
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz', params: { answer: 42 } },
      { key: 'qux-test', name: 'qux', params: { name: 'Jane' } },
    ],
    history: [{ type: 'route', key: 'bar-test' }],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  };

  expect(
    router.getRehydratedState(state, {
      routeNames: [],
      routeParamList: {},
      routeGetIdList: {},
    })
  ).toBe(state);
});

test('removes invalid preloaded route keys on rehydration', () => {
  const router = TabRouter({});

  expect(
    router.getRehydratedState(
      {
        index: 0,
        routes: [
          { key: 'bar-0', name: 'bar' },
          { key: 'baz-0', name: 'baz' },
          { key: 'qux-0', name: 'qux' },
        ],
        preloadedRouteKeys: ['baz-0', 'missing'],
      },
      {
        routeNames: ['bar', 'baz', 'qux'],
        routeParamList: {},
        routeGetIdList: {},
      }
    )
  ).toEqual({
    index: 0,
    key: 'tab-1',
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-0', name: 'baz' },
      { key: 'qux-0', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'bar-0' }],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: ['baz-0'],
  });
});

test('restores correct history on rehydrating with backBehavior: order', () => {
  const router = TabRouter({ backBehavior: 'order' });

  const options: RouterConfigOptions = {
    routeNames: ['foo', 'bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  expect(
    router.getRehydratedState(
      {
        index: 2,
        routes: [
          { key: 'foo-0', name: 'foo' },
          { key: 'bar-0', name: 'bar' },
          { key: 'baz-0', name: 'baz' },
          { key: 'qux-0', name: 'qux' },
        ],
      },
      options
    )
  ).toEqual({
    key: 'tab-1',
    index: 2,
    routeNames: ['foo', 'bar', 'baz', 'qux'],
    routes: [
      { key: 'foo-0', name: 'foo' },
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-0', name: 'baz' },
      { key: 'qux-0', name: 'qux' },
    ],
    history: [
      { key: 'foo-0', type: 'route' },
      { key: 'bar-0', type: 'route' },
      { key: 'baz-0', type: 'route' },
    ],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });
});

test('restores correct history on rehydrating with backBehavior: history', () => {
  const router = TabRouter({ backBehavior: 'history' });

  const options: RouterConfigOptions = {
    routeNames: ['foo', 'bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  expect(
    router.getRehydratedState(
      {
        index: 2,
        routes: [
          { key: 'foo-0', name: 'foo' },
          { key: 'bar-0', name: 'bar' },
          { key: 'baz-0', name: 'baz' },
          { key: 'qux-0', name: 'qux' },
        ],
      },
      options
    )
  ).toEqual({
    key: 'tab-1',
    index: 2,
    routeNames: ['foo', 'bar', 'baz', 'qux'],
    routes: [
      { key: 'foo-0', name: 'foo' },
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-0', name: 'baz' },
      { key: 'qux-0', name: 'qux' },
    ],
    history: [{ key: 'baz-0', type: 'route' }],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });
});

test('restores correct history on rehydrating with backBehavior: fullHistory', () => {
  const router = TabRouter({ backBehavior: 'fullHistory' });

  const options: RouterConfigOptions = {
    routeNames: ['foo', 'bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  expect(
    router.getRehydratedState(
      {
        index: 2,
        routes: [
          { key: 'foo-0', name: 'foo' },
          { key: 'bar-0', name: 'bar' },
          { key: 'baz-0', name: 'baz' },
          { key: 'qux-0', name: 'qux' },
        ],
      },
      options
    )
  ).toEqual({
    key: 'tab-1',
    index: 2,
    routeNames: ['foo', 'bar', 'baz', 'qux'],
    routes: [
      { key: 'foo-0', name: 'foo' },
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-0', name: 'baz' },
      { key: 'qux-0', name: 'qux' },
    ],
    history: [{ key: 'baz-0', type: 'route' }],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });
});

test('restores correct history on rehydrating with backBehavior: firstRoute', () => {
  const router = TabRouter({
    backBehavior: 'firstRoute',
    initialRouteName: 'bar',
  });

  const options: RouterConfigOptions = {
    routeNames: ['foo', 'bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  expect(
    router.getRehydratedState(
      {
        index: 2,
        routes: [
          { key: 'foo-0', name: 'foo' },
          { key: 'bar-0', name: 'bar' },
          { key: 'baz-0', name: 'baz' },
          { key: 'qux-0', name: 'qux' },
        ],
      },
      options
    )
  ).toEqual({
    key: 'tab-1',
    index: 2,
    routeNames: ['foo', 'bar', 'baz', 'qux'],
    routes: [
      { key: 'foo-0', name: 'foo' },
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-0', name: 'baz' },
      { key: 'qux-0', name: 'qux' },
    ],
    history: [
      { key: 'foo-0', type: 'route' },
      { key: 'baz-0', type: 'route' },
    ],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });
});

test('restores correct history on rehydrating with backBehavior: initialRoute', () => {
  const router = TabRouter({
    backBehavior: 'initialRoute',
    initialRouteName: 'bar',
  });

  const options: RouterConfigOptions = {
    routeNames: ['foo', 'bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  expect(
    router.getRehydratedState(
      {
        index: 2,
        routes: [
          { key: 'foo-0', name: 'foo' },
          { key: 'bar-0', name: 'bar' },
          { key: 'baz-0', name: 'baz' },
          { key: 'qux-0', name: 'qux' },
        ],
      },
      options
    )
  ).toEqual({
    key: 'tab-1',
    index: 2,
    routeNames: ['foo', 'bar', 'baz', 'qux'],
    routes: [
      { key: 'foo-0', name: 'foo' },
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-0', name: 'baz' },
      { key: 'qux-0', name: 'qux' },
    ],
    history: [
      { key: 'bar-0', type: 'route' },
      { key: 'baz-0', type: 'route' },
    ],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });
});

test('restores correct history on rehydrating with backBehavior: none', () => {
  const router = TabRouter({ backBehavior: 'none' });

  const options: RouterConfigOptions = {
    routeNames: ['foo', 'bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  expect(
    router.getRehydratedState(
      {
        index: 2,
        routes: [
          { key: 'foo-0', name: 'foo' },
          { key: 'bar-0', name: 'bar' },
          { key: 'baz-0', name: 'baz' },
          { key: 'qux-0', name: 'qux' },
        ],
      },
      options
    )
  ).toEqual({
    key: 'tab-1',
    index: 2,
    routeNames: ['foo', 'bar', 'baz', 'qux'],
    routes: [
      { key: 'foo-0', name: 'foo' },
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-0', name: 'baz' },
      { key: 'qux-0', name: 'qux' },
    ],
    history: [{ key: 'baz-0', type: 'route' }],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });
});

test('gets state on route names change', () => {
  const router = TabRouter({});

  expect(
    router.getStateForRouteNamesChange(
      {
        index: 0,
        key: 'tab-test',
        routeNames: ['bar', 'baz', 'qux'],
        routes: [
          { key: 'bar-test', name: 'bar' },
          { key: 'baz-test', name: 'baz', params: { answer: 42 } },
          { key: 'qux-test', name: 'qux', params: { name: 'Jane' } },
        ],
        history: [{ type: 'route', key: 'bar-test' }],
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
      },
      {
        routeNames: ['qux', 'baz', 'foo', 'fiz'],
        routeParamList: {
          qux: { name: 'John' },
          fiz: { fruit: 'apple' },
        },
        routeGetIdList: {},
        routeKeyChanges: [],
      }
    )
  ).toEqual({
    index: 0,
    key: 'tab-test',
    routeNames: ['qux', 'baz', 'foo', 'fiz'],
    routes: [
      { key: 'qux-test', name: 'qux', params: { name: 'Jane' } },
      { key: 'baz-test', name: 'baz', params: { answer: 42 } },
      { key: 'foo-1', name: 'foo' },
      { key: 'fiz-2', name: 'fiz', params: { fruit: 'apple' } },
    ],
    history: [{ type: 'route', key: 'qux-test' }],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });

  expect(
    router.getStateForRouteNamesChange(
      {
        index: 0,
        key: 'tab-test',
        routeNames: ['bar', 'baz'],
        routes: [
          { key: 'bar-test', name: 'bar' },
          { key: 'baz-test', name: 'baz', params: { answer: 42 } },
        ],
        history: [{ type: 'route', key: 'bar-test' }],
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
      },
      {
        routeNames: ['foo', 'fiz'],
        routeParamList: {},
        routeGetIdList: {},
        routeKeyChanges: [],
      }
    )
  ).toEqual({
    index: 0,
    key: 'tab-test',
    routeNames: ['foo', 'fiz'],
    routes: [
      { key: 'foo-3', name: 'foo' },
      { key: 'fiz-4', name: 'fiz' },
    ],
    history: [{ type: 'route', key: 'foo-3' }],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });
});

test('preserves focused route on route names change', () => {
  const router = TabRouter({});

  expect(
    router.getStateForRouteNamesChange(
      {
        index: 1,
        key: 'tab-test',
        routeNames: ['bar', 'baz', 'qux'],
        routes: [
          { key: 'bar-test', name: 'bar' },
          { key: 'baz-test', name: 'baz', params: { answer: 42 } },
          { key: 'qux-test', name: 'qux', params: { name: 'Jane' } },
        ],
        history: [{ type: 'route', key: 'baz-test' }],
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
      },
      {
        routeNames: ['qux', 'foo', 'fiz', 'baz'],
        routeParamList: {
          qux: { name: 'John' },
          fiz: { fruit: 'apple' },
        },
        routeGetIdList: {},
        routeKeyChanges: [],
      }
    )
  ).toEqual({
    index: 3,
    key: 'tab-test',
    routeNames: ['qux', 'foo', 'fiz', 'baz'],
    routes: [
      { key: 'qux-test', name: 'qux', params: { name: 'Jane' } },
      { key: 'foo-1', name: 'foo' },
      { key: 'fiz-2', name: 'fiz', params: { fruit: 'apple' } },
      { key: 'baz-test', name: 'baz', params: { answer: 42 } },
    ],
    history: [
      { type: 'route', key: 'qux-test' },
      { type: 'route', key: 'baz-test' },
    ],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });
});

test('falls back to first route if route is removed on route names change', () => {
  const router = TabRouter({ initialRouteName: 'fiz' });

  expect(
    router.getStateForRouteNamesChange(
      {
        index: 1,
        key: 'tab-test',
        routeNames: ['bar', 'baz', 'qux'],
        routes: [
          { key: 'bar-test', name: 'bar' },
          { key: 'baz-test', name: 'baz', params: { answer: 42 } },
          { key: 'qux-test', name: 'qux', params: { name: 'Jane' } },
        ],
        history: [{ type: 'route', key: 'baz-test' }],
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
      },
      {
        routeNames: ['qux', 'foo', 'fiz'],
        routeParamList: {
          qux: { name: 'John' },
          fiz: { fruit: 'apple' },
        },
        routeGetIdList: {},
        routeKeyChanges: [],
      }
    )
  ).toEqual({
    index: 0,
    key: 'tab-test',
    routeNames: ['qux', 'foo', 'fiz'],
    routes: [
      { key: 'qux-test', name: 'qux', params: { name: 'Jane' } },
      { key: 'foo-1', name: 'foo' },
      { key: 'fiz-2', name: 'fiz', params: { fruit: 'apple' } },
    ],
    history: [{ type: 'route', key: 'qux-test' }],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });
});

test('focuses the most recent route in history if focused route is removed on route names change', () => {
  const router = TabRouter({ backBehavior: 'history' });

  const state = router.getStateForRouteNamesChange(
    {
      index: 2,
      key: 'tab-test',
      routeNames: ['bar', 'baz', 'qux'],
      routes: [
        { key: 'bar-test', name: 'bar' },
        { key: 'baz-test', name: 'baz' },
        { key: 'qux-test', name: 'qux' },
      ],
      history: [
        { type: 'route', key: 'bar-test' },
        { type: 'route', key: 'baz-test' },
        { type: 'route', key: 'qux-test' },
      ],
      stale: false,
      type: 'tab',
      preloadedRouteKeys: [],
    },
    {
      routeNames: ['bar', 'baz'],
      routeParamList: {},
      routeGetIdList: {},
      routeKeyChanges: [],
    }
  );

  expect(state).toEqual({
    index: 1,
    key: 'tab-test',
    routeNames: ['bar', 'baz'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz' },
    ],
    history: [
      { type: 'route', key: 'bar-test' },
      { type: 'route', key: 'baz-test' },
    ],
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
  });
});

test.each<{
  backBehavior:
    | 'firstRoute'
    | 'initialRoute'
    | 'order'
    | 'history'
    | 'fullHistory'
    | 'none';
  expectedRoute: string | undefined;
}>([
  { backBehavior: 'firstRoute', expectedRoute: 'bar' },
  { backBehavior: 'initialRoute', expectedRoute: 'bar' },
  { backBehavior: 'order', expectedRoute: 'baz' },
  { backBehavior: 'history', expectedRoute: 'baz' },
  { backBehavior: 'fullHistory', expectedRoute: 'baz' },
  { backBehavior: 'none', expectedRoute: undefined },
])(
  'updates history when the focused route key changes with backBehavior: $backBehavior',
  ({ backBehavior, expectedRoute }) => {
    const router = TabRouter({ backBehavior, initialRouteName: 'bar' });
    const options: RouterConfigOptions = {
      routeNames: ['bar', 'baz', 'qux'],
      routeParamList: { qux: { answer: 42 } },
      routeGetIdList: {},
    };

    let state = router.getInitialState(options);

    state = router.getStateForRouteFocus(state, 'baz-2');
    state = router.getStateForRouteFocus(state, 'qux-3');

    state = router.getStateForRouteNamesChange(state, {
      ...options,
      routeKeyChanges: ['qux'],
    });

    expect(state.history.at(-1)?.key).toBe('qux-5');

    const nextState = router.getStateForAction(
      state,
      CommonActions.goBack(),
      options
    );

    expect(
      nextState?.routes[nextState.index ?? nextState.routes.length - 1]?.name
    ).toBe(expectedRoute);
  }
);

test.each<{ backBehavior: 'history' | 'fullHistory' }>([
  { backBehavior: 'history' },
  { backBehavior: 'fullHistory' },
])(
  'does not add an unfocused route with a changed key to $backBehavior',
  ({ backBehavior }) => {
    const router = TabRouter({ backBehavior });
    const options: RouterConfigOptions = {
      routeNames: ['bar', 'baz', 'qux'],
      routeParamList: {},
      routeGetIdList: {},
    };

    let state = router.getInitialState(options);

    state = router.getStateForRouteFocus(state, 'baz-2');
    state = router.getStateForRouteFocus(state, 'qux-3');
    state = router.getStateForRouteNamesChange(state, {
      ...options,
      routeKeyChanges: ['baz'],
    });

    expect(state.routes[1]?.key).toBe('baz-5');
    expect(state.history.map((item) => item.key)).toEqual(['bar-1', 'qux-3']);

    const nextState = router.getStateForAction(
      state,
      CommonActions.goBack(),
      options
    );
    const focusedRoute =
      nextState == null || nextState.index == null
        ? undefined
        : nextState.routes[nextState.index];

    expect(focusedRoute?.name).toBe('bar');
  }
);

test('rebuilds order history when an unfocused route key changes', () => {
  const router = TabRouter({ backBehavior: 'order' });
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  state = router.getStateForRouteFocus(state, 'qux-3');
  state = router.getStateForRouteNamesChange(state, {
    ...options,
    routeKeyChanges: ['bar'],
  });

  expect(state.history).toEqual([
    { type: 'route', key: 'bar-5' },
    { type: 'route', key: 'baz-2' },
    { type: 'route', key: 'qux-3' },
  ]);
});

test('removes stale preloaded route keys on route names change', () => {
  const router = TabRouter({});

  expect(
    router.getStateForRouteNamesChange(
      {
        index: 0,
        key: 'tab-test',
        routeNames: ['bar', 'baz', 'qux'],
        routes: [
          { key: 'bar-test', name: 'bar' },
          { key: 'baz-test', name: 'baz' },
          { key: 'qux-test', name: 'qux' },
        ],
        history: [{ type: 'route', key: 'bar-test' }],
        stale: false,
        type: 'tab',
        preloadedRouteKeys: ['baz-test', 'qux-test'],
      },
      {
        routeNames: ['bar', 'baz'],
        routeParamList: {},
        routeGetIdList: {},
        routeKeyChanges: ['baz'],
      }
    ).preloadedRouteKeys
  ).toEqual([]);
});

test('handles navigate action', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz'],
    routeParamList: {},
    routeGetIdList: {},
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar'],
        routes: [
          { key: 'baz', name: 'baz', params: { color: 'tomato' } },
          { key: 'bar', name: 'bar' },
        ],
        history: [{ type: 'route', key: 'bar' }],
      },
      CommonActions.navigate('baz', { answer: 42 }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar'],
    routes: [
      { key: 'baz', name: 'baz', params: { answer: 42 } },
      { key: 'bar', name: 'bar' },
    ],
    history: [{ type: 'route', key: 'baz' }],
  });
});

test('merges params on navigate when specified', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz'],
    routeParamList: {},
    routeGetIdList: {},
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar'],
        routes: [
          { key: 'baz', name: 'baz', params: { color: 'tomato' } },
          { key: 'bar', name: 'bar' },
        ],
        history: [{ type: 'route', key: 'bar' }],
      },
      CommonActions.navigate('baz', { answer: 42 }, { merge: true }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar'],
    routes: [
      { key: 'baz', name: 'baz', params: { color: 'tomato', answer: 42 } },
      { key: 'bar', name: 'bar' },
    ],
    history: [{ type: 'route', key: 'baz' }],
  });
});

test("doesn't navigate to nonexistent screen", () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar'],
    routeParamList: {},
    routeGetIdList: {},
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar' },
        ],
        history: [{ type: 'route', key: 'bar' }],
      },
      CommonActions.navigate('non-existent'),
      options
    )
  ).toBeNull();

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar' },
        ],
        history: [{ type: 'route', key: 'bar' }],
      },
      CommonActions.navigate('foo', { answer: 42 }),
      options
    )
  ).toBeNull();
});

test('ensures unique ID for navigate', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {
      baz: ({ params }) => params?.foo,
      bar: ({ params }) => params?.foo,
    },
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 0,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar' },
        ],
        history: [{ type: 'route', key: 'baz' }],
      },
      CommonActions.navigate('baz', { foo: 'a' }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz-1', name: 'baz', params: { foo: 'a' } },
      { key: 'bar', name: 'bar' },
    ],
    history: [{ type: 'route', key: 'baz-1' }],
  });

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 0,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar' },
        ],
        history: [{ type: 'route', key: 'bar' }],
      },
      CommonActions.navigate('bar', { foo: 'a' }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz', name: 'baz' },
      { key: 'bar-2', name: 'bar', params: { foo: 'a' } },
    ],
    history: [
      { type: 'route', key: 'baz' },
      { type: 'route', key: 'bar-2' },
    ],
  });
});

test('removes stale history entries when getId changes the key', () => {
  const router = TabRouter({ backBehavior: 'history' });
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar'],
    routeParamList: {},
    routeGetIdList: {
      bar: ({ params }) => params?.id,
    },
  };

  const state = router.getStateForAction(
    {
      stale: false,
      type: 'tab',
      preloadedRouteKeys: [],
      key: 'root',
      index: 1,
      routeNames: ['baz', 'bar'],
      routes: [
        { key: 'baz', name: 'baz' },
        { key: 'bar', name: 'bar', params: { id: '1' } },
      ],
      history: [
        { type: 'route', key: 'baz' },
        { type: 'route', key: 'bar' },
      ],
    },
    TabActions.jumpTo('bar', { id: '2' }),
    options
  );

  expect(state).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar'],
    routes: [
      { key: 'baz', name: 'baz' },
      { key: 'bar-1', name: 'bar', params: { id: '2' } },
    ],
    history: [
      { type: 'route', key: 'baz' },
      { type: 'route', key: 'bar-1' },
    ],
  });

  expect(
    router.getStateForAction(
      state as TabNavigationState<ParamListBase>,
      CommonActions.goBack(),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar'],
    routes: [
      { key: 'baz', name: 'baz' },
      { key: 'bar-1', name: 'bar', params: { id: '2' } },
    ],
    history: [{ type: 'route', key: 'baz' }],
  });
});

test('goes back to the previous tab after navigate creates a new route instance', () => {
  const router = TabRouter({ backBehavior: 'history' });
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar'],
    routeParamList: {},
    routeGetIdList: {
      bar: ({ params }) => params?.id,
    },
  };

  let state = router.getInitialState(options);

  state = router.getStateForAction(
    state,
    {
      type: 'NAVIGATE',
      payload: {
        name: 'bar',
        path: '/bar/1',
        params: { id: '1', value: 'first' },
      },
    },
    options
  ) as TabNavigationState<ParamListBase>;

  state = router.getStateForAction(
    state,
    CommonActions.pushParams({ id: '1', value: 'pushed' }),
    options
  ) as TabNavigationState<ParamListBase>;

  state = router.getStateForAction(
    state,
    CommonActions.navigate('bar', { id: '2', value: 'second' }),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.routes[1]).toEqual({
    key: 'bar-5',
    name: 'bar',
    params: { id: '2', value: 'second' },
    path: undefined,
  });

  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.routes[state.index]).toEqual({
    key: 'baz-1',
    name: 'baz',
    params: undefined,
  });
});

test('handles jump to action', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz'],
    routeParamList: {},
    routeGetIdList: {},
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 0,
        routeNames: ['baz', 'bar'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar' },
        ],
        history: [{ type: 'route', key: 'baz' }],
      },
      TabActions.jumpTo('bar'),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar'],
    routes: [
      { key: 'baz', name: 'baz' },
      { key: 'bar', name: 'bar' },
    ],
    history: [
      { type: 'route', key: 'baz' },
      { type: 'route', key: 'bar' },
    ],
  });
});

test("doesn't jump to nonexistent screen", () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar'],
    routeParamList: {},
    routeGetIdList: {},
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar' },
        ],
        history: [{ type: 'route', key: 'bar' }],
      },
      TabActions.jumpTo('foo', { answer: 42 }),
      options
    )
  ).toBeNull();
});

test('ensures unique ID for jump to', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {
      baz: ({ params }) => params?.foo,
      bar: ({ params }) => params?.foo,
    },
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 0,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar' },
        ],
        history: [{ type: 'route', key: 'baz' }],
      },
      TabActions.jumpTo('baz', { foo: 'a' }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz-1', name: 'baz', params: { foo: 'a' } },
      { key: 'bar', name: 'bar' },
    ],
    history: [{ type: 'route', key: 'baz-1' }],
  });

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 0,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar' },
        ],
        history: [{ type: 'route', key: 'bar' }],
      },
      TabActions.jumpTo('bar', { foo: 'a' }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz', name: 'baz' },
      { key: 'bar-2', name: 'bar', params: { foo: 'a' } },
    ],
    history: [
      { type: 'route', key: 'baz' },
      { type: 'route', key: 'bar-2' },
    ],
  });
});

test('handles back action with backBehavior: history', () => {
  const router = TabRouter({ backBehavior: 'history' });
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toBeNull();

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('qux'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'tab-4',
    index: 0,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-1', name: 'bar' },
      { key: 'baz-2', name: 'baz' },
      { key: 'qux-3', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'bar-1' }],
  });

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('baz'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'tab-4',
    index: 2,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-1', name: 'bar' },
      { key: 'baz-2', name: 'baz' },
      { key: 'qux-3', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'bar-1' },
      { type: 'route', key: 'qux-3' },
    ],
  });

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('bar'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'tab-4',
    index: 1,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-1', name: 'bar' },
      { key: 'baz-2', name: 'baz' },
      { key: 'qux-3', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'qux-3' },
      { type: 'route', key: 'baz-2' },
    ],
  });
});

test('handles back action with backBehavior: fullHistory', () => {
  const router = TabRouter({ backBehavior: 'fullHistory' });
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toBeNull();

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('qux'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'tab-4',
    index: 0,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-1', name: 'bar' },
      { key: 'baz-2', name: 'baz' },
      { key: 'qux-3', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'bar-1' }],
  });

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('baz'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'tab-4',
    index: 2,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-1', name: 'bar' },
      { key: 'baz-2', name: 'baz' },
      { key: 'qux-3', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'bar-1' },
      { type: 'route', key: 'qux-3' },
    ],
  });

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('bar'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'tab-4',
    index: 1,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-1', name: 'bar' },
      { key: 'baz-2', name: 'baz' },
      { key: 'qux-3', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'bar-1' },
      { type: 'route', key: 'qux-3' },
      { type: 'route', key: 'baz-2' },
    ],
  });
});

test('handles back action with backBehavior: order', () => {
  const router = TabRouter({ backBehavior: 'order' });
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toBeNull();

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('qux'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'tab-4',
    index: 1,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-1', name: 'bar' },
      { key: 'baz-2', name: 'baz' },
      { key: 'qux-3', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'bar-1' },
      { type: 'route', key: 'baz-2' },
    ],
  });

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('baz'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'tab-4',
    index: 0,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-1', name: 'bar' },
      { key: 'baz-2', name: 'baz' },
      { key: 'qux-3', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'bar-1' }],
  });

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('bar'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toBeNull();
});

test('handles back action with backBehavior: initialRoute', () => {
  const router = TabRouter({ backBehavior: 'initialRoute' });
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toBeNull();

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('qux'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'tab-4',
    index: 0,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-1', name: 'bar' },
      { key: 'baz-2', name: 'baz' },
      { key: 'qux-3', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'bar-1' }],
  });

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('baz'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'tab-4',
    index: 0,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-1', name: 'bar' },
      { key: 'baz-2', name: 'baz' },
      { key: 'qux-3', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'bar-1' }],
  });

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('bar'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toBeNull();
});

test('handles back action with backBehavior: initialRoute and initialRouteName', () => {
  const router = TabRouter({
    backBehavior: 'initialRoute',
    initialRouteName: 'baz',
  });

  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toBeNull();

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('qux'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'tab-4',
    index: 1,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-1', name: 'bar' },
      { key: 'baz-2', name: 'baz' },
      { key: 'qux-3', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'baz-2' }],
  });

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('bar'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'tab-4',
    index: 1,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-1', name: 'bar' },
      { key: 'baz-2', name: 'baz' },
      { key: 'qux-3', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'baz-2' }],
  });

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('baz'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toBeNull();
});

test('handles back action with backBehavior: none', () => {
  const router = TabRouter({ backBehavior: 'none' });
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('baz'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toBeNull();
});

test('updates route key history on navigate and jump to with backBehavior: history', () => {
  const router = TabRouter({ backBehavior: 'history' });
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state: TabNavigationState<ParamListBase> = {
    index: 1,
    key: 'tab-test',
    routeNames: ['bar', 'baz', 'qux'],
    history: [{ type: 'route', key: 'baz-0' }],
    routes: [
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-0', name: 'baz', params: { answer: 42 } },
      { key: 'qux-0', name: 'qux', params: { name: 'Jane' } },
    ],
    stale: false as const,
    type: 'tab',
    preloadedRouteKeys: [],
  };

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('qux'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.history).toEqual([
    { type: 'route', key: 'baz-0' },
    { type: 'route', key: 'qux-0' },
  ]);

  state = router.getStateForAction(
    state,
    CommonActions.navigate('bar'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.history).toEqual([
    { type: 'route', key: 'baz-0' },
    { type: 'route', key: 'qux-0' },
    { type: 'route', key: 'bar-0' },
  ]);

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('baz'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.history).toEqual([
    { type: 'route', key: 'qux-0' },
    { type: 'route', key: 'bar-0' },
    { type: 'route', key: 'baz-0' },
  ]);

  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.history).toEqual([
    { type: 'route', key: 'qux-0' },
    { type: 'route', key: 'bar-0' },
  ]);

  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.history).toEqual([{ type: 'route', key: 'qux-0' }]);
});

test('updates route key history on focus change with backBehavior: history', () => {
  const router = TabRouter({ backBehavior: 'history' });

  let state: TabNavigationState<ParamListBase> = {
    index: 0,
    key: 'tab-test',
    routeNames: ['bar', 'baz', 'qux'],
    preloadedRouteKeys: [],
    routes: [
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-0', name: 'baz', params: { answer: 42 } },
      { key: 'qux-0', name: 'qux', params: { name: 'Jane' } },
    ],
    history: [{ type: 'route' as const, key: 'bar-0' }],
    stale: false,
    type: 'tab',
  };

  state = router.getStateForRouteFocus(state, 'bar-0');

  expect(state.history).toEqual([{ type: 'route', key: 'bar-0' }]);

  state = router.getStateForRouteFocus(state, 'baz-0');

  expect(state.history).toEqual([
    { type: 'route', key: 'bar-0' },
    { type: 'route', key: 'baz-0' },
  ]);

  state = router.getStateForRouteFocus(state, 'qux-0');

  expect(state.history).toEqual([
    { type: 'route', key: 'bar-0' },
    { type: 'route', key: 'baz-0' },
    { type: 'route', key: 'qux-0' },
  ]);

  state = router.getStateForRouteFocus(state, 'baz-0');

  expect(state.history).toEqual([
    { type: 'route', key: 'bar-0' },
    { type: 'route', key: 'qux-0' },
    { type: 'route', key: 'baz-0' },
  ]);
});

test('updates route key history on navigate and jump to with backBehavior: fullHistory', () => {
  const router = TabRouter({ backBehavior: 'fullHistory' });
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state: TabNavigationState<ParamListBase> = {
    index: 1,
    key: 'tab-test',
    routeNames: ['bar', 'baz', 'qux'],
    history: [{ type: 'route', key: 'baz-0' }],
    routes: [
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-0', name: 'baz', params: { answer: 42 } },
      { key: 'qux-0', name: 'qux', params: { name: 'Jane' } },
    ],
    stale: false as const,
    type: 'tab',
    preloadedRouteKeys: [],
  };

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('qux'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.history).toEqual([
    { type: 'route', key: 'baz-0' },
    { type: 'route', key: 'qux-0' },
  ]);

  state = router.getStateForAction(
    state,
    CommonActions.navigate('bar'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.history).toEqual([
    { type: 'route', key: 'baz-0' },
    { type: 'route', key: 'qux-0' },
    { type: 'route', key: 'bar-0' },
  ]);

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('baz'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.history).toEqual([
    { type: 'route', key: 'baz-0' },
    { type: 'route', key: 'qux-0' },
    { type: 'route', key: 'bar-0' },
    { type: 'route', key: 'baz-0' },
  ]);

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('baz'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.history).toEqual([
    { type: 'route', key: 'baz-0' },
    { type: 'route', key: 'qux-0' },
    { type: 'route', key: 'bar-0' },
    { type: 'route', key: 'baz-0' },
  ]);

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('baz'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.history).toEqual([
    { type: 'route', key: 'baz-0' },
    { type: 'route', key: 'qux-0' },
    { type: 'route', key: 'bar-0' },
    { type: 'route', key: 'baz-0' },
  ]);

  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.history).toEqual([
    { type: 'route', key: 'baz-0' },
    { type: 'route', key: 'qux-0' },
    { type: 'route', key: 'bar-0' },
  ]);

  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.history).toEqual([
    { type: 'route', key: 'baz-0' },
    { type: 'route', key: 'qux-0' },
  ]);
});

test('preserves params in history with backBehavior: fullHistory', () => {
  const router = TabRouter({ backBehavior: 'fullHistory' });
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState({
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  });

  state = router.getStateForAction(
    state,
    CommonActions.navigate('baz', { value: 'first' }),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.routes[1]?.params).toEqual({ value: 'first' });
  expect(state.history[1]?.params).toEqual({ value: 'first' });

  state = router.getStateForAction(
    state,
    CommonActions.navigate('qux', { value: 'second' }),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.routes[2]?.params).toEqual({ value: 'second' });
  expect(state.history[2]?.params).toEqual({ value: 'second' });

  state = router.getStateForAction(
    state,
    CommonActions.navigate('baz', { value: 'updated' }),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.routes[1]?.params).toEqual({ value: 'updated' });
  expect(state.history[3]?.params).toEqual({ value: 'updated' });

  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.index).toBe(2);
  expect(state.routes[2]?.params).toEqual({ value: 'second' });

  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.index).toBe(1);
  expect(state.routes[1]?.params).toEqual({ value: 'first' });
});

test('keeps initial params on goBack with backBehavior: fullHistory', () => {
  const router = TabRouter({ backBehavior: 'fullHistory' });
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz'],
    routeParamList: { bar: { initial: true } },
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  state = router.getStateForAction(
    state,
    CommonActions.navigate('baz'),
    options
  ) as TabNavigationState<ParamListBase>;

  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.index).toBe(0);
  expect(state.routes[0]?.params).toEqual({ initial: true });
});

test('updates route key history on focus change with backBehavior: fullHistory', () => {
  const router = TabRouter({ backBehavior: 'fullHistory' });

  let state: TabNavigationState<ParamListBase> = {
    index: 0,
    key: 'tab-test',
    routeNames: ['bar', 'baz', 'qux'],
    preloadedRouteKeys: [],
    routes: [
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-0', name: 'baz', params: { answer: 42 } },
      { key: 'qux-0', name: 'qux', params: { name: 'Jane' } },
    ],
    history: [{ type: 'route' as const, key: 'bar-0' }],
    stale: false,
    type: 'tab',
  };

  state = router.getStateForRouteFocus(state, 'bar-0');

  expect(state.history).toEqual([{ type: 'route', key: 'bar-0' }]);

  state = router.getStateForRouteFocus(state, 'baz-0');

  expect(state.history).toEqual([
    { type: 'route', key: 'bar-0' },
    { type: 'route', key: 'baz-0', params: { answer: 42 } },
  ]);

  state = router.getStateForRouteFocus(state, 'qux-0');

  expect(state.history).toEqual([
    { type: 'route', key: 'bar-0' },
    { type: 'route', key: 'baz-0', params: { answer: 42 } },
    { type: 'route', key: 'qux-0', params: { name: 'Jane' } },
  ]);

  state = router.getStateForRouteFocus(state, 'baz-0');

  expect(router.getStateForRouteFocus(state, 'baz-0').history).toEqual([
    { type: 'route', key: 'bar-0' },
    { type: 'route', key: 'baz-0', params: { answer: 42 } },
    { type: 'route', key: 'qux-0', params: { name: 'Jane' } },
    { type: 'route', key: 'baz-0', params: { answer: 42 } },
  ]);

  state = router.getStateForRouteFocus(state, 'baz-0');

  expect(router.getStateForRouteFocus(state, 'baz-0').history).toEqual([
    { type: 'route', key: 'bar-0' },
    { type: 'route', key: 'baz-0', params: { answer: 42 } },
    { type: 'route', key: 'qux-0', params: { name: 'Jane' } },
    { type: 'route', key: 'baz-0', params: { answer: 42 } },
  ]);

  state = router.getStateForRouteFocus(state, 'baz-0');

  expect(router.getStateForRouteFocus(state, 'baz-0').history).toEqual([
    { type: 'route', key: 'bar-0' },
    { type: 'route', key: 'baz-0', params: { answer: 42 } },
    { type: 'route', key: 'qux-0', params: { name: 'Jane' } },
    { type: 'route', key: 'baz-0', params: { answer: 42 } },
  ]);
});

test('adds path on navigate if provided', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar' },
          { key: 'qux', name: 'qux' },
        ],
        history: [{ type: 'route', key: 'baz' }],
      },
      {
        type: 'NAVIGATE',
        payload: {
          name: 'bar',
          path: '/foo/bar',
        },
      },
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz', name: 'baz' },
      { key: 'bar', name: 'bar', path: '/foo/bar' },
      { key: 'qux', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'baz' },
      { type: 'route', key: 'bar' },
    ],
  });

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz', name: 'baz' },
          {
            key: 'bar',
            name: 'bar',
            path: '/foo/bar',
          },
          { key: 'qux', name: 'qux' },
        ],
        history: [{ type: 'route', key: 'baz' }],
      },
      {
        type: 'NAVIGATE',
        payload: {
          name: 'bar',
          params: { fruit: 'orange' },
          path: '/foo/baz',
        },
      },
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz', name: 'baz' },
      {
        key: 'bar',
        name: 'bar',
        params: { fruit: 'orange' },
        path: '/foo/baz',
      },
      { key: 'qux', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'baz' },
      { type: 'route', key: 'bar' },
    ],
  });
});

test("doesn't remove existing path on navigate if not provided", () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar', path: '/foo/bar' },
          { key: 'qux', name: 'qux' },
        ],
        history: [{ type: 'route', key: 'baz' }],
      },
      CommonActions.navigate('bar'),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz', name: 'baz' },
      { key: 'bar', name: 'bar', path: '/foo/bar' },
      { key: 'qux', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'baz' },
      { type: 'route', key: 'bar' },
    ],
  });
});

test("doesn't merge params on navigate to an existing screen", () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {
      qux: { color: 'indigo' },
    },
    routeGetIdList: {},
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar', params: { answer: 42 } },
          { key: 'qux', name: 'qux' },
        ],
        history: [{ type: 'route', key: 'baz' }],
      },
      CommonActions.navigate('bar'),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz', name: 'baz' },
      { key: 'bar', name: 'bar' },
      { key: 'qux', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'baz' },
      { type: 'route', key: 'bar' },
    ],
  });

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar' },
          { key: 'qux', name: 'qux' },
        ],
        history: [{ type: 'route', key: 'baz' }],
      },
      CommonActions.navigate('bar', { fruit: 'orange' }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz', name: 'baz' },
      { key: 'bar', name: 'bar', params: { fruit: 'orange' } },
      { key: 'qux', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'baz' },
      { type: 'route', key: 'bar' },
    ],
  });

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar' },
          { key: 'qux', name: 'qux' },
        ],
        history: [{ type: 'route', key: 'baz' }],
      },
      CommonActions.navigate('qux', { test: 12 }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 2,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz', name: 'baz' },
      { key: 'bar', name: 'bar' },
      { key: 'qux', name: 'qux', params: { color: 'indigo', test: 12 } },
    ],
    history: [
      { type: 'route', key: 'baz' },
      { type: 'route', key: 'qux' },
    ],
  });
});

test('merges params on navigate to an existing screen if merge: true', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar', params: { answer: 42 } },
          { key: 'qux', name: 'qux' },
        ],
        history: [{ type: 'route', key: 'baz' }],
      },
      CommonActions.navigate('bar', undefined, {
        merge: true,
      }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz', name: 'baz' },
      { key: 'bar', name: 'bar', params: { answer: 42 } },
      { key: 'qux', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'baz' },
      { type: 'route', key: 'bar' },
    ],
  });

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar', params: { answer: 42 } },
          { key: 'qux', name: 'qux' },
        ],
        history: [{ type: 'route', key: 'baz' }],
      },
      CommonActions.navigate(
        'bar',
        { fruit: 'orange' },
        {
          merge: true,
        }
      ),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz', name: 'baz' },
      { key: 'bar', name: 'bar', params: { answer: 42, fruit: 'orange' } },
      { key: 'qux', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'baz' },
      { type: 'route', key: 'bar' },
    ],
  });
});

test("doesn't merge params on jump to an existing screen", () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar', params: { answer: 42 } },
          { key: 'qux', name: 'qux' },
        ],
        history: [{ type: 'route', key: 'baz' }],
      },
      TabActions.jumpTo('bar'),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz', name: 'baz' },
      { key: 'bar', name: 'bar' },
      { key: 'qux', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'baz' },
      { type: 'route', key: 'bar' },
    ],
  });

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar', params: { answer: 42 } },
          { key: 'qux', name: 'qux' },
        ],
        history: [{ type: 'route', key: 'baz' }],
      },
      TabActions.jumpTo('bar', { fruit: 'orange' }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz', name: 'baz' },
      { key: 'bar', name: 'bar', params: { fruit: 'orange' } },
      { key: 'qux', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'baz' },
      { type: 'route', key: 'bar' },
    ],
  });
});

test('adds route key to preloadedRouteKeys with preload', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {
      bar: ({ params }) => `bar-${params?.answer}`,
    },
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 0,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar', params: { answer: 42 } },
          { key: 'qux', name: 'qux' },
        ],
        history: [{ type: 'route', key: 'baz' }],
      },
      CommonActions.preload('qux'),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: ['qux'],
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz', name: 'baz' },
      { key: 'bar', name: 'bar', params: { answer: 42 } },
      { key: 'qux', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'baz' }],
  });
});

test("doesn't preload nonexistent screen", () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 0,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar' },
          { key: 'qux', name: 'qux' },
        ],
        history: [{ type: 'route', key: 'baz' }],
      },
      CommonActions.preload('far', { answer: 42 }),
      options
    )
  ).toBeNull();
});

test('updates an existing route with preload when the ID changes', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {
      bar: ({ params }) => `bar-${params?.answer}`,
    },
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 0,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz-test', name: 'baz' },
          { key: 'bar-test', name: 'bar', params: { answer: 42 } },
          { key: 'qux-test', name: 'qux' },
        ],
        history: [{ type: 'route', key: 'baz-test' }],
      },
      CommonActions.preload('bar', { answer: 43 }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: ['bar-1'],
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz-test', name: 'baz' },
      { key: 'bar-1', name: 'bar', params: { answer: 43 } },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'baz-test' }],
  });
});

test('replaces the preloaded route key with preload when the ID changes', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {
      bar: ({ params }) => `bar-${params?.answer}`,
    },
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: ['bar-test-old'],
        key: 'root',
        index: 0,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz-test', name: 'baz' },
          {
            key: 'bar-test-old',
            name: 'bar',
            params: { answer: 42, willBe: 'removed' },
          },
          { key: 'qux-test', name: 'qux' },
        ],
        history: [{ type: 'route', key: 'baz-test' }],
      },
      CommonActions.preload('bar', { answer: 43 }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: ['bar-1'],
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz-test', name: 'baz' },
      { key: 'bar-1', name: 'bar', params: { answer: 43 } },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'baz-test' }],
  });
});

test('updates an existing route with preload when the ID matches', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {
      bar: ({ params }) => `bar-${params?.answer}`,
    },
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 0,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz-test', name: 'baz' },
          {
            key: 'bar-test',
            name: 'bar',
            params: { answer: 42, willBe: 'overrode' },
          },
          { key: 'qux-test', name: 'qux' },
        ],
        history: [{ type: 'route', key: 'baz-test' }],
      },
      CommonActions.preload('bar', { answer: 42 }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: ['bar-test'],
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz-test', name: 'baz' },
      {
        key: 'bar-test',
        name: 'bar',
        params: { answer: 42 },
      },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'baz-test' }],
  });
});

test('removes focused route from preloadedRouteKeys on navigate', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {
      bar: ({ params }) => `bar-${params?.answer}`,
    },
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: ['qux-test'],
        key: 'root',
        index: 0,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz-test', name: 'baz' },
          {
            key: 'bar-test',
            name: 'bar',
            params: { answer: 42, willBe: 'merged' },
          },
          { key: 'qux-test', name: 'qux' },
        ],
        history: [{ type: 'route', key: 'baz-test' }],
      },
      CommonActions.navigate('qux'),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 2,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz-test', name: 'baz' },
      {
        key: 'bar-test',
        name: 'bar',
        params: { answer: 42, willBe: 'merged' },
      },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'baz-test' },
      { type: 'route', key: 'qux-test' },
    ],
  });
});

test('removes focused route from preloadedRouteKeys on goBack', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {
      bar: ({ params }) => `bar-${params?.answer}`,
    },
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: ['baz-test'],
        key: 'root',
        index: 2,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz-test', name: 'baz' },
          {
            key: 'bar-test',
            name: 'bar',
            params: { answer: 42, willBe: 'merged' },
          },
          { key: 'qux-test', name: 'qux' },
        ],
        history: [
          { type: 'route', key: 'baz-test' },
          { type: 'route', key: 'qux-test' },
        ],
      },
      CommonActions.goBack(),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz-test', name: 'baz' },
      {
        key: 'bar-test',
        name: 'bar',
        params: { answer: 42, willBe: 'merged' },
      },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'baz-test' }],
  });
});

test('adds an existing route key to preloadedRouteKeys with preload', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {
      bar: ({ params }) => `bar-${params?.answer}`,
    },
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 2,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz-test', name: 'baz' },
          {
            key: 'bar-some',
            name: 'bar',
            params: { answer: 42 },
          },
          { key: 'qux-test', name: 'qux' },
        ],
        history: [
          { type: 'route', key: 'bar-some' },
          { type: 'route', key: 'qux-test' },
        ],
      },
      CommonActions.preload('bar', { answer: 42 }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: ['bar-some'],
    key: 'root',
    index: 2,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz-test', name: 'baz' },
      {
        key: 'bar-some',
        name: 'bar',
        params: { answer: 42 },
      },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'bar-some' },
      { type: 'route', key: 'qux-test' },
    ],
  });
});

test('replaces an existing preloaded route with a fresh route when the ID changes', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {
      bar: ({ params }) => `bar-${params?.answer}`,
    },
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: ['bar-some'],
        key: 'root',
        index: 2,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz-test', name: 'baz' },
          {
            key: 'bar-some',
            name: 'bar',
            path: '/bar/42',
            params: { answer: 42, willBe: 'untouched' },
            history: [
              { type: 'params', params: { answer: 41, value: 'previous' } },
            ],
            state: {
              stale: false,
              type: 'stack',
              key: 'nested',
              index: 0,
              routeNames: ['child'],
              routes: [{ key: 'child-test', name: 'child' }],
            },
          },
          { key: 'qux-test', name: 'qux' },
        ],
        history: [
          { type: 'route', key: 'bar-some' },
          { type: 'route', key: 'qux-test' },
        ],
      },
      CommonActions.preload('bar', { answer: 43 }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: ['bar-1'],
    key: 'root',
    index: 2,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz-test', name: 'baz' },
      {
        key: 'bar-1',
        name: 'bar',
        params: { answer: 43 },
      },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'qux-test' }],
  });
});

test('creates a new preloaded route with preload when the ID changes', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {
      bar: ({ params }) => `bar-${params?.answer}`,
    },
  };

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        preloadedRouteKeys: [],
        key: 'root',
        index: 2,
        routeNames: ['baz', 'bar', 'qux'],
        routes: [
          { key: 'baz-test', name: 'baz' },
          {
            key: 'bar-some',
            name: 'bar',
            params: { answer: 42 },
          },
          { key: 'qux-test', name: 'qux' },
        ],
        history: [
          { type: 'route', key: 'bar-some' },
          { type: 'route', key: 'qux-test' },
        ],
      },
      CommonActions.preload('bar', { answer: 43 }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: ['bar-1'],
    key: 'root',
    index: 2,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz-test', name: 'baz' },
      {
        key: 'bar-1',
        name: 'bar',
        params: { answer: 43 },
      },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'qux-test' }],
  });
});

test('keeps history ending with the focused route when preload replaces it', () => {
  const router = TabRouter({ backBehavior: 'history' });
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar'],
    routeParamList: {},
    routeGetIdList: {
      bar: ({ params }) => `bar-${params?.answer}`,
    },
  };

  const state = router.getStateForAction(
    {
      stale: false,
      type: 'tab',
      preloadedRouteKeys: [],
      key: 'root',
      index: 1,
      routeNames: ['baz', 'bar'],
      routes: [
        { key: 'baz-test', name: 'baz' },
        { key: 'bar-some', name: 'bar', params: { answer: 42 } },
      ],
      history: [
        { type: 'route', key: 'baz-test' },
        { type: 'route', key: 'bar-some' },
      ],
    },
    CommonActions.preload('bar', { answer: 43 }),
    options
  );

  expect(state).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: ['bar-1'],
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar'],
    routes: [
      { key: 'baz-test', name: 'baz' },
      { key: 'bar-1', name: 'bar', params: { answer: 43 } },
    ],
    history: [
      { type: 'route', key: 'baz-test' },
      { type: 'route', key: 'bar-1' },
    ],
  });

  expect(
    router.getStateForAction(
      state as TabNavigationState<ParamListBase>,
      CommonActions.goBack(),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: ['bar-1'],
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar'],
    routes: [
      { key: 'baz-test', name: 'baz' },
      { key: 'bar-1', name: 'bar', params: { answer: 43 } },
    ],
    history: [{ type: 'route', key: 'baz-test' }],
  });
});

test('preserves params when preload replaces the focused route with fullHistory', () => {
  const router = TabRouter({ backBehavior: 'fullHistory' });
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar'],
    routeParamList: {},
    routeGetIdList: {
      bar: ({ params }) => `bar-${params?.answer}`,
    },
  };

  const preloadedState = router.getStateForAction(
    {
      stale: false,
      type: 'tab',
      preloadedRouteKeys: [],
      key: 'root',
      index: 1,
      routeNames: ['baz', 'bar'],
      routes: [
        { key: 'baz-test', name: 'baz' },
        { key: 'bar-some', name: 'bar', params: { answer: 42 } },
      ],
      history: [
        { type: 'route', key: 'baz-test' },
        { type: 'route', key: 'bar-some', params: { answer: 42 } },
      ],
    },
    CommonActions.preload('bar', { answer: 43 }),
    options
  );

  if (preloadedState == null || preloadedState.stale !== false) {
    throw new Error('Expected preload to return a complete state.');
  }

  const navigatedState = router.getStateForAction(
    preloadedState,
    CommonActions.navigate('baz'),
    options
  );

  if (navigatedState == null || navigatedState.stale !== false) {
    throw new Error('Expected navigate to return a complete state.');
  }

  expect(
    router.getStateForAction(navigatedState, CommonActions.goBack(), options)
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar'],
    routes: [
      { key: 'baz-test', name: 'baz' },
      { key: 'bar-1', name: 'bar', params: { answer: 43 } },
    ],
    history: [
      { type: 'route', key: 'baz-test' },
      { type: 'route', key: 'bar-1', params: { answer: 43 } },
    ],
  });
});

test('handles pushParams action', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  const state = router.getStateForAction(
    {
      history: [
        { key: 'baz-test', type: 'route' },
        { key: 'bar-test', params: undefined, type: 'route' },
      ],
      index: 1,
      key: 'tab-test',
      preloadedRouteKeys: [],
      routeNames: ['baz', 'bar', 'qux'],
      routes: [
        { key: 'baz-test', name: 'baz', params: undefined },
        {
          key: 'bar-test',
          name: 'bar',
          params: { age: 25, user: 'john' },
          path: undefined,
        },
        { key: 'qux-test', name: 'qux', params: undefined },
      ],
      stale: false,
      type: 'tab',
    },
    CommonActions.pushParams({ user: 'jane', age: 30 }),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state).toEqual({
    history: [
      { key: 'baz-test', type: 'route' },
      { key: 'bar-test', params: undefined, type: 'route' },
    ],
    index: 1,
    key: 'tab-test',
    preloadedRouteKeys: [],
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz-test', name: 'baz', params: undefined },
      {
        history: [{ params: { age: 25, user: 'john' }, type: 'params' }],
        key: 'bar-test',
        name: 'bar',
        params: { age: 30, user: 'jane' },
        path: undefined,
      },
      { key: 'qux-test', name: 'qux', params: undefined },
    ],
    stale: false,
    type: 'tab',
  });
});

test('handles goBack with route history', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  const state = router.getStateForAction(
    {
      history: [
        { key: 'baz-test', type: 'route' },
        { key: 'bar-test', params: undefined, type: 'route' },
      ],
      index: 1,
      key: 'tab-test',
      preloadedRouteKeys: [],
      routeNames: ['baz', 'bar', 'qux'],
      routes: [
        { key: 'baz-test', name: 'baz', params: undefined },
        {
          history: [{ params: { age: 25, user: 'john' }, type: 'params' }],
          key: 'bar-test',
          name: 'bar',
          params: { age: 30, user: 'jane' },
          path: undefined,
        },
        { key: 'qux-test', name: 'qux', params: undefined },
      ],
      stale: false,
      type: 'tab',
    },
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state).toEqual({
    history: [
      { key: 'baz-test', type: 'route' },
      { key: 'bar-test', params: undefined, type: 'route' },
    ],
    index: 1,
    key: 'tab-test',
    preloadedRouteKeys: [],
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz-test', name: 'baz', params: undefined },
      {
        history: [],
        key: 'bar-test',
        name: 'bar',
        params: { age: 25, user: 'john' },
        path: undefined,
      },
      { key: 'qux-test', name: 'qux', params: undefined },
    ],
    stale: false,
    type: 'tab',
  });
});

test('handles goBack with multiple route history entries', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = {
    stale: false,
    type: 'tab',
    key: 'tab-test',
    index: 1,
    routeNames: ['baz', 'bar', 'qux'],
    history: [
      {
        type: 'route',
        key: 'baz-test',
      },
      {
        type: 'route',
        key: 'bar-test',
      },
    ],
    routes: [
      {
        name: 'baz',
        key: 'baz-test',
      },
      {
        name: 'bar',
        key: 'bar-test',
        params: {
          user: 'john',
          age: 25,
        },
      },
      {
        name: 'qux',
        key: 'qux-test',
      },
    ],
    preloadedRouteKeys: [],
  } as TabNavigationState<ParamListBase>;

  state = router.getStateForAction(
    state,
    CommonActions.pushParams({ user: 'jane', age: 30 }),
    options
  ) as TabNavigationState<ParamListBase>;

  state = router.getStateForAction(
    state,
    CommonActions.pushParams({ user: 'bob', age: 35 }),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.routes[1]?.params).toEqual({ user: 'bob', age: 35 });
  expect(state.routes[1]?.history).toEqual([
    { type: 'params', params: { user: 'john', age: 25 } },
    { type: 'params', params: { user: 'jane', age: 30 } },
  ]);

  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state).toEqual({
    history: [
      { key: 'baz-test', type: 'route' },
      { key: 'bar-test', type: 'route' },
    ],
    index: 1,
    key: 'tab-test',
    preloadedRouteKeys: [],
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz-test', name: 'baz' },
      {
        history: [{ params: { age: 25, user: 'john' }, type: 'params' }],
        key: 'bar-test',
        name: 'bar',
        params: { age: 30, user: 'jane' },
      },
      { key: 'qux-test', name: 'qux' },
    ],
    stale: false,
    type: 'tab',
  });

  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state).toEqual({
    history: [
      { key: 'baz-test', type: 'route' },
      { key: 'bar-test', type: 'route' },
    ],
    index: 1,
    key: 'tab-test',
    preloadedRouteKeys: [],
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz-test', name: 'baz' },
      {
        history: [],
        key: 'bar-test',
        name: 'bar',
        params: { age: 25, user: 'john' },
      },
      { key: 'qux-test', name: 'qux' },
    ],
    stale: false,
    type: 'tab',
  });
});

test('goBack falls back to tab history when route history is empty', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['baz', 'bar', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  const state = router.getStateForAction(
    {
      history: [
        { key: 'baz-test', type: 'route' },
        { key: 'bar-test', params: undefined, type: 'route' },
        { key: 'qux-test', params: undefined, type: 'route' },
      ],
      index: 2,
      key: 'tab-test',
      preloadedRouteKeys: [],
      routeNames: ['baz', 'bar', 'qux'],
      routes: [
        { key: 'baz-test', name: 'baz', params: undefined },
        { key: 'bar-test', name: 'bar', params: undefined },
        { key: 'qux-test', name: 'qux', params: undefined },
      ],
      stale: false,
      type: 'tab',
    },
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state).toEqual({
    history: [
      { key: 'baz-test', type: 'route' },
      { key: 'bar-test', params: undefined, type: 'route' },
    ],
    index: 1,
    key: 'tab-test',
    preloadedRouteKeys: [],
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz-test', name: 'baz', params: undefined },
      { key: 'bar-test', name: 'bar', params: undefined },
      { key: 'qux-test', name: 'qux', params: undefined },
    ],
    stale: false,
    type: 'tab',
  });
});
