import {
  CommonActions,
  ParamListBase,
  RouterConfigOptions,
  TabActions,
  TabNavigationState,
  TabRouter,
} from '..';

jest.mock('nanoid/non-secure', () => ({ nanoid: () => 'test' }));

it('gets initial state from route names and params with initialRouteName', () => {
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
  });
});

it('gets initial state from route names and params without initialRouteName', () => {
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
  });
});

it('gets rehydrated state from partial state', () => {
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
  });
});

it("doesn't rehydrate state if it's not stale", () => {
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
  };

  expect(
    router.getRehydratedState(state, {
      routeNames: [],
      routeParamList: {},
      routeGetIdList: {},
    })
  ).toBe(state);
});

it('restores correct history on rehydrating with backBehavior: order', () => {
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
  });
});

it('restores correct history on rehydrating with backBehavior: history', () => {
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
  });
});

it('restores correct history on rehydrating with backBehavior: firstRoute', () => {
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
  });
});

it('restores correct history on rehydrating with backBehavior: initialRoute', () => {
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
  });
});

it('restores correct history on rehydrating with backBehavior: none', () => {
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
  });
});

it('gets state on route names change', () => {
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
  });
});

it('preserves focused route on route names change', () => {
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
    history: [{ type: 'route', key: 'baz-test' }],
    stale: false,
    type: 'tab',
  });
});

it('falls back to first route if route is removed on route names change', () => {
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
  });
});

it('handles navigate action', () => {
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
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar'],
        routes: [
          { key: 'baz-1', name: 'baz' },
          { key: 'bar-1', name: 'bar' },
        ],
        history: [{ type: 'route', key: 'bar-1' }],
      },
      CommonActions.navigate({ key: 'bar-1', params: { answer: 42 } }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar'],
    routes: [
      { key: 'baz-1', name: 'baz' },
      { key: 'bar-1', name: 'bar', params: { answer: 42 } },
    ],
    history: [
      { type: 'route', key: 'baz-1' },
      { type: 'route', key: 'bar-1' },
    ],
  });

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar'],
        routes: [
          { key: 'baz', name: 'baz' },
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
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar'],
    routes: [
      { key: 'baz', name: 'baz', params: { answer: 42 } },
      { key: 'bar', name: 'bar' },
    ],
    history: [{ type: 'route', key: 'baz' }],
  });

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
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
  ).toBe(null);
});

it("doesn't navigate to nonexistent screen", () => {
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
  ).toBe(null);

  expect(
    router.getStateForAction(
      {
        stale: false,
        type: 'tab',
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar'],
        routes: [
          { key: 'baz', name: 'baz' },
          { key: 'bar', name: 'bar' },
        ],
        history: [{ type: 'route', key: 'bar' }],
      },
      CommonActions.navigate({
        name: 'foo',
        key: 'test',
        params: { answer: 42 },
      }),
      options
    )
  ).toBe(null);
});

it('handles jump to action', () => {
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

it("doesn't jump to nonexistent screen", () => {
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
  ).toBe(null);
});

it('handles back action with backBehavior: history', () => {
  const router = TabRouter({ backBehavior: 'history' });
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toEqual(null);

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

it('handles back action with backBehavior: order', () => {
  const router = TabRouter({ backBehavior: 'order' });
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toEqual(null);

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
  ).toEqual(null);
});

it('handles back action with backBehavior: initialRoute', () => {
  const router = TabRouter({ backBehavior: 'initialRoute' });
  const options: RouterConfigOptions = {
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {},
    routeGetIdList: {},
  };

  let state = router.getInitialState(options);

  expect(
    router.getStateForAction(state, CommonActions.goBack(), options)
  ).toEqual(null);

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
  ).toEqual(null);
});

it('handles back action with backBehavior: initialRoute and initialRouteName', () => {
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
  ).toEqual(null);

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
  ).toEqual(null);
});

it('handles back action with backBehavior: none', () => {
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
  ).toEqual(null);
});

it('updates route key history on navigate and jump to', () => {
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

it('updates route key history on focus change', () => {
  const router = TabRouter({ backBehavior: 'history' });

  const state = {
    index: 0,
    key: 'tab-test',
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-0', name: 'baz', params: { answer: 42 } },
      { key: 'qux-0', name: 'qux', params: { name: 'Jane' } },
    ],
    history: [{ type: 'route' as const, key: 'bar-0' }],
    stale: false as const,
    type: 'tab' as const,
  };

  expect(router.getStateForRouteFocus(state, 'bar-0').history).toEqual([
    { type: 'route', key: 'bar-0' },
  ]);

  expect(router.getStateForRouteFocus(state, 'baz-0').history).toEqual([
    { type: 'route', key: 'bar-0' },
    { type: 'route', key: 'baz-0' },
  ]);
});

it('adds path on navigate if provided', () => {
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
      CommonActions.navigate({
        name: 'bar',
        path: '/foo/bar',
      }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
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
      CommonActions.navigate({
        name: 'bar',
        params: { fruit: 'orange' },
        path: '/foo/baz',
      }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
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

it("doesn't remove existing path on navigate if not provided", () => {
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
      CommonActions.navigate({ name: 'bar' }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
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

it("doesn't merge params on navigate to an existing screen", () => {
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

it('merges params on navigate to an existing screen if merge: true', () => {
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
      CommonActions.navigate({
        name: 'bar',
        merge: true,
      }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
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
      CommonActions.navigate({
        name: 'bar',
        params: { fruit: 'orange' },
        merge: true,
      }),
      options
    )
  ).toEqual({
    stale: false,
    type: 'tab',
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

it("doesn't merge params on jump to an existing screen", () => {
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
