import { expect, jest, test } from '@jest/globals';

import {
  CommonActions,
  type ParamListBase,
  type RouterConfigOptions,
  TabActions,
  type TabNavigationState,
  TabRouter,
} from '../index';

jest.mock('nanoid/non-secure', () => ({ nanoid: () => 'test' }));

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
    key: 'tab-test',
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz', params: { answer: 42 } },
      { key: 'qux-test', name: 'qux', params: { name: 'Jane' } },
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
    key: 'tab-test',
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-test', name: 'baz', params: { answer: 42 } },
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
    key: 'tab-test',
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-0', name: 'baz', params: { answer: 42 } },
      { key: 'qux-test', name: 'qux', params: { name: 'Jane' } },
    ],
    history: [
      { type: 'route', key: 'bar-test' },
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
    key: 'tab-test',
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
    key: 'tab-test',
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-test', name: 'baz', params: { answer: 42 } },
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
    key: 'tab-test',
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
    key: 'tab-test',
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
    key: 'tab-test',
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
    key: 'tab-test',
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
    key: 'tab-test',
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
    key: 'tab-test',
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
      { key: 'foo-test', name: 'foo' },
      { key: 'fiz-test', name: 'fiz', params: { fruit: 'apple' } },
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
      { key: 'foo-test', name: 'foo' },
      { key: 'fiz-test', name: 'fiz' },
    ],
    history: [{ type: 'route', key: 'foo-test' }],
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
      { key: 'foo-test', name: 'foo' },
      { key: 'fiz-test', name: 'fiz', params: { fruit: 'apple' } },
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
      { key: 'foo-test', name: 'foo' },
      { key: 'fiz-test', name: 'fiz', params: { fruit: 'apple' } },
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
    | 'limitedHistory'
    | 'none';
  expectedRoute: string | undefined;
}>([
  { backBehavior: 'firstRoute', expectedRoute: 'bar' },
  { backBehavior: 'initialRoute', expectedRoute: 'bar' },
  { backBehavior: 'order', expectedRoute: 'baz' },
  { backBehavior: 'history', expectedRoute: 'baz' },
  { backBehavior: 'fullHistory', expectedRoute: 'baz' },
  { backBehavior: 'limitedHistory', expectedRoute: 'baz' },
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

    let state: TabNavigationState<ParamListBase> = {
      stale: false,
      type: 'tab',
      key: 'tab-test',
      index: 0,
      routeNames: ['bar', 'baz', 'qux'],
      routes: [
        { key: 'bar-old', name: 'bar' },
        { key: 'baz-old', name: 'baz' },
        { key: 'qux-old', name: 'qux', params: { answer: 42 } },
      ],
      history: [{ type: 'route', key: 'bar-old' }],
      preloadedRouteKeys: [],
    };

    state = router.getStateForRouteFocus(state, 'baz-old');
    state = router.getStateForRouteFocus(state, 'qux-old');

    state = router.getStateForRouteNamesChange(state, {
      ...options,
      routeKeyChanges: ['qux'],
    });

    expect(state.history.at(-1)?.key).toBe('qux-test');

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

test.each<{ backBehavior: 'history' | 'fullHistory' | 'limitedHistory' }>([
  { backBehavior: 'history' },
  { backBehavior: 'fullHistory' },
  { backBehavior: 'limitedHistory' },
])(
  'does not add an unfocused route with a changed key to $backBehavior',
  ({ backBehavior }) => {
    const router = TabRouter({ backBehavior });
    const options: RouterConfigOptions = {
      routeNames: ['bar', 'baz', 'qux'],
      routeParamList: {},
      routeGetIdList: {},
    };

    let state: TabNavigationState<ParamListBase> = {
      stale: false,
      type: 'tab',
      key: 'tab-test',
      index: 0,
      routeNames: ['bar', 'baz', 'qux'],
      routes: [
        { key: 'bar-old', name: 'bar' },
        { key: 'baz-old', name: 'baz' },
        { key: 'qux-old', name: 'qux' },
      ],
      history: [{ type: 'route', key: 'bar-old' }],
      preloadedRouteKeys: [],
    };

    state = router.getStateForRouteFocus(state, 'baz-old');
    state = router.getStateForRouteFocus(state, 'qux-old');
    state = router.getStateForRouteNamesChange(state, {
      ...options,
      routeKeyChanges: ['baz'],
    });

    expect(state.routes[1]?.key).toBe('baz-test');
    expect(state.history.map((item) => item.key)).toEqual([
      'bar-old',
      'qux-old',
    ]);

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

  let state: TabNavigationState<ParamListBase> = {
    stale: false,
    type: 'tab',
    key: 'tab-test',
    index: 0,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-old', name: 'bar' },
      { key: 'baz-old', name: 'baz' },
      { key: 'qux-old', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'bar-old' }],
    preloadedRouteKeys: [],
  };

  state = router.getStateForRouteFocus(state, 'qux-old');
  state = router.getStateForRouteNamesChange(state, {
    ...options,
    routeKeyChanges: ['bar'],
  });

  expect(state.history).toEqual([
    { type: 'route', key: 'bar-test' },
    { type: 'route', key: 'baz-old' },
    { type: 'route', key: 'qux-old' },
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
          { key: 'baz-old', name: 'baz' },
          { key: 'qux-test', name: 'qux' },
        ],
        history: [{ type: 'route', key: 'bar-test' }],
        stale: false,
        type: 'tab',
        preloadedRouteKeys: ['baz-old', 'qux-test'],
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

test('creates a new route when the ID changes with navigate', () => {
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
          {
            key: 'baz',
            name: 'baz',
            path: '/baz/1',
            state: {
              stale: false,
              type: 'stack',
              key: 'nested',
              index: 0,
              routeNames: ['child'],
              routes: [{ key: 'child', name: 'child' }],
            },
          },
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
      { key: 'baz-test', name: 'baz', params: { foo: 'a' } },
      { key: 'bar', name: 'bar' },
    ],
    history: [{ type: 'route', key: 'baz-test' }],
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
      { key: 'bar-test', name: 'bar', params: { foo: 'a' } },
    ],
    history: [
      { type: 'route', key: 'baz' },
      { type: 'route', key: 'bar-test' },
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
      { key: 'bar-test', name: 'bar', params: { id: '2' } },
    ],
    history: [
      { type: 'route', key: 'baz' },
      { type: 'route', key: 'bar-test' },
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
      { key: 'bar-test', name: 'bar', params: { id: '2' } },
    ],
    history: [{ type: 'route', key: 'baz' }],
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

test('creates a new route when the ID changes with jumpTo', () => {
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
          {
            key: 'baz',
            name: 'baz',
            path: '/baz/1',
            state: {
              stale: false,
              type: 'stack',
              key: 'nested',
              index: 0,
              routeNames: ['child'],
              routes: [{ key: 'child', name: 'child' }],
            },
          },
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
      { key: 'baz-test', name: 'baz', params: { foo: 'a' } },
      { key: 'bar', name: 'bar' },
    ],
    history: [{ type: 'route', key: 'baz-test' }],
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
      { key: 'bar-test', name: 'bar', params: { foo: 'a' } },
    ],
    history: [
      { type: 'route', key: 'baz' },
      { type: 'route', key: 'bar-test' },
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
    key: 'tab-test',
    index: 0,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz' },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'bar-test' }],
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
    key: 'tab-test',
    index: 2,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz' },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'bar-test' },
      { type: 'route', key: 'qux-test' },
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
    key: 'tab-test',
    index: 1,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz' },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'qux-test' },
      { type: 'route', key: 'baz-test' },
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
    key: 'tab-test',
    index: 0,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz' },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'bar-test' }],
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
    key: 'tab-test',
    index: 2,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz' },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'bar-test' },
      { type: 'route', key: 'qux-test' },
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
    key: 'tab-test',
    index: 1,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz' },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'bar-test' },
      { type: 'route', key: 'qux-test' },
      { type: 'route', key: 'baz-test' },
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
    key: 'tab-test',
    index: 1,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz' },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'bar-test' },
      { type: 'route', key: 'baz-test' },
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
    key: 'tab-test',
    index: 0,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz' },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'bar-test' }],
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
    key: 'tab-test',
    index: 0,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz' },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'bar-test' }],
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
    key: 'tab-test',
    index: 0,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz' },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'bar-test' }],
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
    key: 'tab-test',
    index: 1,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz' },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'baz-test' }],
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
    key: 'tab-test',
    index: 1,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz' },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'baz-test' }],
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
    { type: 'route', key: 'baz-0', params: { answer: 42 } },
    { type: 'route', key: 'qux-0' },
  ]);

  state = router.getStateForAction(
    state,
    CommonActions.navigate('bar'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.history).toEqual([
    { type: 'route', key: 'baz-0', params: { answer: 42 } },
    { type: 'route', key: 'qux-0' },
    { type: 'route', key: 'bar-0' },
  ]);

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('baz'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.history).toEqual([
    { type: 'route', key: 'baz-0', params: { answer: 42 } },
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
    { type: 'route', key: 'baz-0', params: { answer: 42 } },
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
    { type: 'route', key: 'baz-0', params: { answer: 42 } },
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
    { type: 'route', key: 'baz-0', params: { answer: 42 } },
    { type: 'route', key: 'qux-0' },
    { type: 'route', key: 'bar-0' },
  ]);

  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.history).toEqual([
    { type: 'route', key: 'baz-0', params: { answer: 42 } },
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

  expect(state.routes[1].params).toEqual({ value: 'first' });
  expect(state.history[1].params).toEqual({ value: 'first' });

  state = router.getStateForAction(
    state,
    CommonActions.navigate('qux', { value: 'second' }),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.routes[2].params).toEqual({ value: 'second' });
  expect(state.history[2].params).toEqual({ value: 'second' });

  state = router.getStateForAction(
    state,
    CommonActions.setParams({ value: 'updated with setParams' }),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.routes[2].params).toEqual({ value: 'updated with setParams' });
  expect(state.history[2].params).toEqual({ value: 'updated with setParams' });

  state = router.getStateForAction(
    state,
    CommonActions.replaceParams({ value: 'replaced params' }),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.routes[2].params).toEqual({ value: 'replaced params' });
  expect(state.history[2].params).toEqual({ value: 'replaced params' });

  state = router.getStateForAction(
    state,
    CommonActions.navigate('baz', { value: 'updated' }),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.routes[1].params).toEqual({ value: 'updated' });
  expect(state.history[3].params).toEqual({ value: 'updated' });

  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.index).toBe(2);
  expect(state.routes[2].params).toEqual({ value: 'replaced params' });

  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.index).toBe(1);
  expect(state.routes[1].params).toEqual({ value: 'first' });
});

test('preserves params updated by source with SET_PARAMS and backBehavior: fullHistory', () => {
  const router = TabRouter({ backBehavior: 'fullHistory' });
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  state = router.getStateForAction(
    state,
    CommonActions.navigate('baz', { preserved: true, value: 'old' }),
    options
  ) as TabNavigationState<ParamListBase>;

  state = router.getStateForAction(
    state,
    CommonActions.navigate('qux'),
    options
  ) as TabNavigationState<ParamListBase>;

  state = router.getStateForAction(
    state,
    {
      ...CommonActions.setParams({ value: 'updated' }),
      source: state.routes[1].key,
    },
    options
  ) as TabNavigationState<ParamListBase>;

  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.index).toBe(1);
  expect(state.routes[1].params).toEqual({
    preserved: true,
    value: 'updated',
  });
});

test('preserves params updated by source with REPLACE_PARAMS and backBehavior: fullHistory', () => {
  const router = TabRouter({ backBehavior: 'fullHistory' });
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  state = router.getStateForAction(
    state,
    CommonActions.navigate('baz', { preserved: true, value: 'old' }),
    options
  ) as TabNavigationState<ParamListBase>;

  state = router.getStateForAction(
    state,
    CommonActions.navigate('qux'),
    options
  ) as TabNavigationState<ParamListBase>;

  state = router.getStateForAction(
    state,
    {
      ...CommonActions.replaceParams({ value: 'replaced' }),
      source: state.routes[1].key,
    },
    options
  ) as TabNavigationState<ParamListBase>;

  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.index).toBe(1);
  expect(state.routes[1].params).toEqual({ value: 'replaced' });
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

test('handles screen preloading', () => {
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
    preloadedRouteKeys: ['bar-test'],
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz-test', name: 'baz' },
      { key: 'bar-test', name: 'bar', params: { answer: 43 } },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'baz-test' }],
  });

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
    preloadedRouteKeys: ['bar-test'],
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz-test', name: 'baz' },
      { key: 'bar-test', name: 'bar', params: { answer: 43 } },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'baz-test' }],
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
    preloadedRouteKeys: ['bar-test'],
    key: 'root',
    index: 2,
    routeNames: ['baz', 'bar', 'qux'],
    routes: [
      { key: 'baz-test', name: 'baz' },
      {
        key: 'bar-test',
        name: 'bar',
        params: { answer: 43 },
      },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'qux-test' }],
  });
});

test('creates a fresh route when preload changes the ID', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['foo', 'bar'],
    routeParamList: {},
    routeGetIdList: {
      bar: ({ params }) => params?.id,
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
        routeNames: ['foo', 'bar'],
        routes: [
          { key: 'foo-test', name: 'foo' },
          {
            key: 'bar-old',
            name: 'bar',
            path: '/bar/1',
            params: { id: '1' },
            state: {
              stale: false,
              type: 'stack',
              key: 'nested',
              index: 0,
              routeNames: ['child'],
              routes: [{ key: 'child-test', name: 'child' }],
            },
          },
        ],
        history: [{ type: 'route', key: 'foo-test' }],
      },
      CommonActions.preload('bar', { id: '2' }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: ['bar-test'],
    key: 'root',
    index: 0,
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo-test', name: 'foo' },
      {
        key: 'bar-test',
        name: 'bar',
        params: { id: '2' },
      },
    ],
    history: [{ type: 'route', key: 'foo-test' }],
  });
});

test('updates the existing route when preload keeps the same ID', () => {
  const router = TabRouter({});
  const options: RouterConfigOptions = {
    routeNames: ['foo', 'bar'],
    routeParamList: {},
    routeGetIdList: {
      bar: ({ params }) => params?.id,
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
        routeNames: ['foo', 'bar'],
        routes: [
          { key: 'foo-test', name: 'foo' },
          {
            key: 'bar-old',
            name: 'bar',
            path: '/bar/1',
            params: { id: '1', value: 'old' },
            state: {
              stale: false,
              type: 'stack',
              key: 'nested',
              index: 0,
              routeNames: ['child'],
              routes: [{ key: 'child-test', name: 'child' }],
            },
          },
        ],
        history: [{ type: 'route', key: 'foo-test' }],
      },
      CommonActions.preload('bar', { id: '1', value: 'updated' }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: ['bar-old'],
    key: 'root',
    index: 0,
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo-test', name: 'foo' },
      {
        key: 'bar-old',
        name: 'bar',
        path: '/bar/1',
        params: { id: '1', value: 'updated' },
        state: {
          stale: false,
          type: 'stack',
          key: 'nested',
          index: 0,
          routeNames: ['child'],
          routes: [{ key: 'child-test', name: 'child' }],
        },
      },
    ],
    history: [{ type: 'route', key: 'foo-test' }],
  });
});

test('preserves params when preload updates the focused route with fullHistory', () => {
  const router = TabRouter({ backBehavior: 'fullHistory' });
  const options: RouterConfigOptions = {
    routeNames: ['foo', 'bar'],
    routeParamList: {},
    routeGetIdList: {
      bar: ({ params }) => params?.id,
    },
  };

  let state: TabNavigationState<ParamListBase> = {
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 1,
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo-test', name: 'foo' },
      { key: 'bar-old', name: 'bar', params: { id: '1', value: 'old' } },
    ],
    history: [
      {
        type: 'route',
        key: 'bar-old',
        params: { id: '1', value: 'old' },
      },
    ],
  };

  state = router.getStateForAction(
    state,
    CommonActions.preload('bar', { id: '1', value: 'updated' }),
    options
  ) as TabNavigationState<ParamListBase>;

  state = router.getStateForAction(
    state,
    CommonActions.navigate('foo'),
    options
  ) as TabNavigationState<ParamListBase>;

  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.index).toBe(1);
  expect(state.routes[1].params).toEqual({ id: '1', value: 'updated' });
});

test('preserves params when preload updates an unfocused route with fullHistory', () => {
  const router = TabRouter({ backBehavior: 'fullHistory' });
  const options: RouterConfigOptions = {
    routeNames: ['foo', 'bar'],
    routeParamList: {},
    routeGetIdList: {
      bar: ({ params }) => params?.id,
    },
  };

  let state: TabNavigationState<ParamListBase> = {
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'root',
    index: 0,
    routeNames: ['foo', 'bar'],
    routes: [
      { key: 'foo-test', name: 'foo' },
      { key: 'bar-old', name: 'bar', params: { id: '1', value: 'old' } },
    ],
    history: [
      {
        type: 'route',
        key: 'bar-old',
        params: { id: '1', value: 'old' },
      },
      { type: 'route', key: 'foo-test' },
    ],
  };

  state = router.getStateForAction(
    state,
    CommonActions.preload('bar', { id: '1', value: 'updated' }),
    options
  ) as TabNavigationState<ParamListBase>;

  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.index).toBe(1);
  expect(state.routes[1].params).toEqual({ id: '1', value: 'updated' });
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
    preloadedRouteKeys: ['bar-test'],
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar'],
    routes: [
      { key: 'baz-test', name: 'baz' },
      { key: 'bar-test', name: 'bar', params: { answer: 43 } },
    ],
    history: [
      { type: 'route', key: 'baz-test' },
      { type: 'route', key: 'bar-test' },
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
    preloadedRouteKeys: ['bar-test'],
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar'],
    routes: [
      { key: 'baz-test', name: 'baz' },
      { key: 'bar-test', name: 'bar', params: { answer: 43 } },
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
      { key: 'bar-test', name: 'bar', params: { answer: 43 } },
    ],
    history: [
      { type: 'route', key: 'baz-test' },
      { type: 'route', key: 'bar-test', params: { answer: 43 } },
    ],
  });
});


test('handles Home/Search repeated navigation with backBehavior: limitedHistory', () => {
  // Simulates: Home → Search → Home → Search → Home → Search
  // Expected Back sequence: Search → Home → Search → Home → exit
  const router = TabRouter({ backBehavior: 'limitedHistory' });
  const options: RouterConfigOptions = {
    routeNames: ['Home', 'Search', 'Cart', 'Profile'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  // Initial state: on Home
  expect(state.index).toBe(0);
  expect(state.routes[state.index].name).toBe('Home');
  expect(state.history).toEqual([
    { type: 'route', key: 'Home-test' },
  ]);

  // Navigate: Home → Search
  state = router.getStateForAction(
    state,
    TabActions.jumpTo('Search'),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(state.index).toBe(1);
  expect(state.routes[state.index].name).toBe('Search');

  // Navigate: Search → Home
  state = router.getStateForAction(
    state,
    TabActions.jumpTo('Home'),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(state.index).toBe(0);
  expect(state.routes[state.index].name).toBe('Home');

  // Navigate: Home → Search
  state = router.getStateForAction(
    state,
    TabActions.jumpTo('Search'),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(state.index).toBe(1);

  // Navigate: Search → Home
  state = router.getStateForAction(
    state,
    TabActions.jumpTo('Home'),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(state.index).toBe(0);

  // Navigate: Home → Search
  state = router.getStateForAction(
    state,
    TabActions.jumpTo('Search'),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(state.index).toBe(1);
  expect(state.routes[state.index].name).toBe('Search');

  // Now we're on Search after: Home → Search → Home → Search → Home → Search
  // History should be bounded: [Home, Search, Home, Search]
  expect(state.history).toEqual([
    { type: 'route', key: 'Home-test' },
    { type: 'route', key: 'Search-test' },
    { type: 'route', key: 'Home-test' },
    { type: 'route', key: 'Search-test' },
  ]);

  // Back 1: Search → Home
  const back1 = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(back1.index).toBe(0);
  expect(back1.routes[back1.index].name).toBe('Home');
  expect(back1.history).toEqual([
    { type: 'route', key: 'Home-test' },
    { type: 'route', key: 'Search-test' },
    { type: 'route', key: 'Home-test' },
  ]);

  // Back 2: Home → Search
  const back2 = router.getStateForAction(
    back1,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(back2.index).toBe(1);
  expect(back2.routes[back2.index].name).toBe('Search');
  expect(back2.history).toEqual([
    { type: 'route', key: 'Home-test' },
    { type: 'route', key: 'Search-test' },
  ]);

  // Back 3: Search → Home
  const back3 = router.getStateForAction(
    back2,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(back3.index).toBe(0);
  expect(back3.routes[back3.index].name).toBe('Home');
  expect(back3.history).toEqual([
    { type: 'route', key: 'Home-test' },
  ]);

  // Back 4: Home → exit (null)
  const back4 = router.getStateForAction(
    back3,
    CommonActions.goBack(),
    options
  );
  expect(back4).toBeNull();
});

test('limitedHistory does not create unlimited history with repeated switching', () => {
  const router = TabRouter({ backBehavior: 'limitedHistory' });
  const options: RouterConfigOptions = {
    routeNames: ['Home', 'Search', 'Cart', 'Profile'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  // Switch between Home and Search 100 times
  for (let i = 0; i < 100; i++) {
    state = router.getStateForAction(
      state,
      TabActions.jumpTo('Search'),
      options
    ) as TabNavigationState<ParamListBase>;

    state = router.getStateForAction(
      state,
      TabActions.jumpTo('Home'),
      options
    ) as TabNavigationState<ParamListBase>;
  }

  // History should be bounded — each tab at most 2 entries = max 4
  const routeHistory = state.history.filter((h) => h.type === 'route');
  expect(routeHistory.length).toBeLessThanOrEqual(4);

  // Specifically: we're on Home after the last switch
  // History should be [Search, Home, Search, Home]
  expect(state.history).toEqual([
    { type: 'route', key: 'Search-test' },
    { type: 'route', key: 'Home-test' },
    { type: 'route', key: 'Search-test' },
    { type: 'route', key: 'Home-test' },
  ]);
});

test('limitedHistory preserves normal back behavior for Cart and Profile tabs', () => {
  const router = TabRouter({ backBehavior: 'limitedHistory' });
  const options: RouterConfigOptions = {
    routeNames: ['Home', 'Search', 'Cart', 'Profile'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  // Navigate: Home → Cart
  state = router.getStateForAction(
    state,
    TabActions.jumpTo('Cart'),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(state.index).toBe(2);
  expect(state.routes[state.index].name).toBe('Cart');
  expect(state.history).toEqual([
    { type: 'route', key: 'Home-test' },
    { type: 'route', key: 'Cart-test' },
  ]);

  // Back from Cart → Home
  const back1 = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(back1.index).toBe(0);
  expect(back1.routes[back1.index].name).toBe('Home');

  // Back from Home → exit (null)
  const back2 = router.getStateForAction(
    back1,
    CommonActions.goBack(),
    options
  );
  expect(back2).toBeNull();

  // Navigate: Home → Profile
  state = router.getStateForAction(
    back1,
    TabActions.jumpTo('Profile'),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(state.index).toBe(3);
  expect(state.routes[state.index].name).toBe('Profile');

  // Back from Profile → Home
  const back3 = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(back3.index).toBe(0);
  expect(back3.routes[back3.index].name).toBe('Home');
});

test('limitedHistory with multiple tabs visited in sequence', () => {
  const router = TabRouter({ backBehavior: 'limitedHistory' });
  const options: RouterConfigOptions = {
    routeNames: ['Home', 'Search', 'Cart', 'Profile'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  // Navigate: Home → Search → Cart → Profile
  state = router.getStateForAction(
    state,
    TabActions.jumpTo('Search'),
    options
  ) as TabNavigationState<ParamListBase>;

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('Cart'),
    options
  ) as TabNavigationState<ParamListBase>;

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('Profile'),
    options
  ) as TabNavigationState<ParamListBase>;

  expect(state.index).toBe(3);
  expect(state.history).toEqual([
    { type: 'route', key: 'Home-test' },
    { type: 'route', key: 'Search-test' },
    { type: 'route', key: 'Cart-test' },
    { type: 'route', key: 'Profile-test' },
  ]);

  // Back from Profile → Cart
  const back1 = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(back1.routes[back1.index].name).toBe('Cart');

  // Back from Cart → Search
  const back2 = router.getStateForAction(
    back1,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(back2.routes[back2.index].name).toBe('Search');

  // Back from Search → Home
  const back3 = router.getStateForAction(
    back2,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(back3.routes[back3.index].name).toBe('Home');

  // Back from Home → exit (null)
  const back4 = router.getStateForAction(
    back3,
    CommonActions.goBack(),
    options
  );
  expect(back4).toBeNull();
});

test('limitedHistory caps at 2 occurrences per route across many tabs', () => {
  const router = TabRouter({ backBehavior: 'limitedHistory' });
  const options: RouterConfigOptions = {
    routeNames: ['A', 'B', 'C'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  // Navigate: A → B → C → A → B → C → A
  const sequence = ['B', 'C', 'A', 'B', 'C', 'A'];
  for (const tab of sequence) {
    state = router.getStateForAction(
      state,
      TabActions.jumpTo(tab),
      options
    ) as TabNavigationState<ParamListBase>;
  }

  // Currently on A. Each route should appear at most 2 times
  const keyCounts = new Map<string, number>();
  for (const item of state.history) {
    if (item.type === 'route') {
      keyCounts.set(item.key, (keyCounts.get(item.key) ?? 0) + 1);
    }
  }

  for (const [, count] of keyCounts) {
    expect(count).toBeLessThanOrEqual(2);
  }

  // Total history should be at most 2 * 3 = 6
  expect(state.history.length).toBeLessThanOrEqual(6);
});

test('restores correct history on rehydrating with backBehavior: limitedHistory', () => {
  const router = TabRouter({ backBehavior: 'limitedHistory' });

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
    key: 'tab-test',
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

test('handles back action with backBehavior: limitedHistory', () => {
  const router = TabRouter({ backBehavior: 'limitedHistory' });
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  // Back from initial state should return null
  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toBeNull();

  // bar → qux
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
    key: 'tab-test',
    index: 0,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz' },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [{ type: 'route', key: 'bar-test' }],
  });

  // bar → qux → baz
  state = router.getStateForAction(
    state,
    TabActions.jumpTo('baz'),
    options
  ) as TabNavigationState<ParamListBase>;

  // Back from baz → qux
  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toEqual({
    stale: false,
    type: 'tab',
    preloadedRouteKeys: [],
    key: 'tab-test',
    index: 2,
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz' },
      { key: 'qux-test', name: 'qux' },
    ],
    history: [
      { type: 'route', key: 'bar-test' },
      { type: 'route', key: 'qux-test' },
    ],
  });
});

test('limitedHistory does not break nested stack navigator back behavior', () => {
  // When a tab has a nested stack, GO_BACK at the tab level should return null
  // if the router can't handle it (it propagates to the nested stack).
  // The tab router only handles GO_BACK when there's history to pop.
  const router = TabRouter({ backBehavior: 'limitedHistory' });
  const options: RouterConfigOptions = {
    routeNames: ['Home', 'Search'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  // On initial route with no history to pop, GO_BACK returns null
  // This allows nested navigators (like stacks) to handle the back action
  const result = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  );
  expect(result).toBeNull();

  // Navigate to Search
  state = router.getStateForAction(
    state,
    TabActions.jumpTo('Search'),
    options
  ) as TabNavigationState<ParamListBase>;

  // Now GO_BACK should work at tab level (Search → Home)
  const backResult = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(backResult.index).toBe(0);
  expect(backResult.routes[backResult.index].name).toBe('Home');

  // After going back to Home, GO_BACK returns null again
  // allowing any nested stack to handle its own back
  const nestedBack = router.getStateForAction(
    backResult,
    CommonActions.goBack(),
    options
  );
  expect(nestedBack).toBeNull();
});


test('handles YouTube-style tab navigation: Home → Shorts → Profile → Shorts → Profile → Home', () => {
  const router = TabRouter({ backBehavior: 'limitedHistory' });
  const options: RouterConfigOptions = {
    routeNames: ['Home', 'Shorts', 'Profile'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);
  expect(state.routes[state.index].name).toBe('Home');
  expect(state.history).toEqual([{ type: 'route', key: 'Home-test' }]);

  // Home → Shorts
  state = router.getStateForAction(
    state,
    TabActions.jumpTo('Shorts'),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(state.routes[state.index].name).toBe('Shorts');

  // Shorts → Profile
  state = router.getStateForAction(
    state,
    TabActions.jumpTo('Profile'),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(state.routes[state.index].name).toBe('Profile');

  // Profile → Shorts
  state = router.getStateForAction(
    state,
    TabActions.jumpTo('Shorts'),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(state.routes[state.index].name).toBe('Shorts');

  // Shorts → Profile
  state = router.getStateForAction(
    state,
    TabActions.jumpTo('Profile'),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(state.routes[state.index].name).toBe('Profile');

  // Profile → Home
  state = router.getStateForAction(
    state,
    TabActions.jumpTo('Home'),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(state.routes[state.index].name).toBe('Home');

  // History maintains sensible tab navigation history capped at 2 entries per tab:
  // [Home, Shorts, Profile, Shorts, Profile, Home]
  expect(state.history).toEqual([
    { type: 'route', key: 'Home-test' },
    { type: 'route', key: 'Shorts-test' },
    { type: 'route', key: 'Profile-test' },
    { type: 'route', key: 'Shorts-test' },
    { type: 'route', key: 'Profile-test' },
    { type: 'route', key: 'Home-test' },
  ]);

  // Back sequence from Home:
  // 1. Back → Profile
  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(state.routes[state.index].name).toBe('Profile');

  // 2. Back → Shorts
  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(state.routes[state.index].name).toBe('Shorts');

  // 3. Back → Profile
  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(state.routes[state.index].name).toBe('Profile');

  // 4. Back → Shorts
  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(state.routes[state.index].name).toBe('Shorts');

  // 5. Back → Home (returned to Home!)
  state = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  ) as TabNavigationState<ParamListBase>;
  expect(state.routes[state.index].name).toBe('Home');

  // 6. Back → null (exit app, no more history)
  const exitState = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  );
  expect(exitState).toBeNull();
});

test('repeated tab switching between non-home tabs eventually returns user to Home without endless trap', () => {
  const router = TabRouter({ backBehavior: 'limitedHistory' });
  const options: RouterConfigOptions = {
    routeNames: ['Home', 'Shorts', 'Profile'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  // User starts at Home, then switches between Shorts and Profile 20 times
  for (let i = 0; i < 20; i++) {
    state = router.getStateForAction(
      state,
      TabActions.jumpTo('Shorts'),
      options
    ) as TabNavigationState<ParamListBase>;

    state = router.getStateForAction(
      state,
      TabActions.jumpTo('Profile'),
      options
    ) as TabNavigationState<ParamListBase>;
  }

  // History is bounded: Home at bottom, followed by at most 2 Shorts and 2 Profiles
  expect(state.history.length).toBeLessThanOrEqual(5);
  expect(state.history[0]).toEqual({ type: 'route', key: 'Home-test' });

  // Pressing back will navigate through the recent history and ALWAYS return to Home in at most 4 steps
  let backCount = 0;
  while (state.routes[state.index].name !== 'Home') {
    state = router.getStateForAction(
      state,
      CommonActions.goBack(),
      options
    ) as TabNavigationState<ParamListBase>;
    backCount++;
    expect(backCount).toBeLessThanOrEqual(4);
  }

  expect(state.routes[state.index].name).toBe('Home');

  // Next back exits
  const exitState = router.getStateForAction(
    state,
    CommonActions.goBack(),
    options
  );
  expect(exitState).toBeNull();
});
