import { CommonActions } from '@react-navigation/core';
import { TabRouter, TabActions, TabNavigationState } from '../src';

jest.mock('shortid', () => () => 'test');

it('gets initial state from route names and params with initialRouteName', () => {
  const router = TabRouter({ initialRouteName: 'baz' });

  expect(
    router.getInitialState({
      routeNames: ['bar', 'baz', 'qux'],
      routeParamList: {
        baz: { answer: 42 },
        qux: { name: 'Jane' },
      },
    })
  ).toEqual({
    index: 1,
    key: 'tab-test',
    routeKeyHistory: [],
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz', params: { answer: 42 } },
      { key: 'qux-test', name: 'qux', params: { name: 'Jane' } },
    ],
    stale: false,
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
    })
  ).toEqual({
    index: 0,
    key: 'tab-test',
    routeKeyHistory: [],
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz', params: { answer: 42 } },
      { key: 'qux-test', name: 'qux', params: { name: 'Jane' } },
    ],
    stale: false,
  });
});

it('gets rehydrated state from partial state', () => {
  const router = TabRouter({});

  const options = {
    routeNames: ['bar', 'baz', 'qux'],
    routeParamList: {
      baz: { answer: 42 },
      qux: { name: 'Jane' },
    },
  };

  expect(
    router.getRehydratedState(
      {
        routes: [{ key: 'bar-0', name: 'bar' }, { key: 'qux-1', name: 'qux' }],
      },
      options
    )
  ).toEqual({
    index: 0,
    key: 'tab-test',
    routeKeyHistory: [],
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-test', name: 'baz', params: { answer: 42 } },
      { key: 'qux-1', name: 'qux', params: { name: 'Jane' } },
    ],
    stale: false,
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
    routeKeyHistory: [],
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-0', name: 'baz', params: { answer: 42 } },
      { key: 'qux-test', name: 'qux', params: { name: 'Jane' } },
    ],
    stale: false,
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
    routeKeyHistory: [],
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-1', name: 'baz', params: { answer: 42 } },
      { key: 'qux-2', name: 'qux', params: { name: 'Jane' } },
    ],
    stale: false,
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
    index: 2,
    key: 'tab-test',
    routeKeyHistory: [],
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz', params: { answer: 42 } },
      { key: 'qux-test', name: 'qux', params: { name: 'Jane' } },
    ],
    stale: false,
  });

  expect(
    router.getRehydratedState(
      {
        index: 1,
        routeKeyHistory: ['bar-test', 'qux-test', 'foo-test'],
        routes: [],
      },
      options
    )
  ).toEqual({
    index: 1,
    key: 'tab-test',
    routeKeyHistory: ['bar-test', 'qux-test'],
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz', params: { answer: 42 } },
      { key: 'qux-test', name: 'qux', params: { name: 'Jane' } },
    ],
    stale: false,
  });
});

it("doesn't rehydrate state if it's not stale", () => {
  const router = TabRouter({});

  const state = {
    index: 0,
    key: 'tab-test',
    routeKeyHistory: [],
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-test', name: 'bar' },
      { key: 'baz-test', name: 'baz', params: { answer: 42 } },
      { key: 'qux-test', name: 'qux', params: { name: 'Jane' } },
    ],
    stale: false as const,
  };

  expect(
    router.getRehydratedState(state, {
      routeNames: [],
      routeParamList: {},
    })
  ).toBe(state);
});

it('gets state on route names change', () => {
  const router = TabRouter({});

  expect(
    router.getStateForRouteNamesChange(
      {
        index: 0,
        key: 'tab-test',
        routeKeyHistory: [],
        routeNames: ['bar', 'baz', 'qux'],
        routes: [
          { key: 'bar-test', name: 'bar' },
          { key: 'baz-test', name: 'baz', params: { answer: 42 } },
          { key: 'qux-test', name: 'qux', params: { name: 'Jane' } },
        ],
        stale: false,
      },
      {
        routeNames: ['qux', 'baz', 'foo', 'fiz'],
        routeParamList: {
          qux: { name: 'John' },
          fiz: { fruit: 'apple' },
        },
      }
    )
  ).toEqual({
    index: 0,
    key: 'tab-test',
    routeKeyHistory: [],
    routeNames: ['qux', 'baz', 'foo', 'fiz'],
    routes: [
      { key: 'qux-test', name: 'qux', params: { name: 'Jane' } },
      { key: 'baz-test', name: 'baz', params: { answer: 42 } },
      { key: 'foo-test', name: 'foo' },
      { key: 'fiz-test', name: 'fiz', params: { fruit: 'apple' } },
    ],
    stale: false,
  });
});

it('handles navigate action', () => {
  const router = TabRouter({});

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar'],
        routeKeyHistory: [],
        routes: [{ key: 'baz-1', name: 'baz' }, { key: 'bar-1', name: 'bar' }],
      },
      CommonActions.navigate({ key: 'bar-1', params: { answer: 42 } })
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar'],
    routeKeyHistory: ['bar-1'],
    routes: [
      { key: 'baz-1', name: 'baz' },
      { key: 'bar-1', name: 'bar', params: { answer: 42 } },
    ],
  });

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar'],
        routeKeyHistory: [],
        routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
      },
      CommonActions.navigate('baz', { answer: 42 })
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar'],
    routeKeyHistory: ['bar'],
    routes: [
      { key: 'baz', name: 'baz', params: { answer: 42 } },
      { key: 'bar', name: 'bar' },
    ],
  });

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar'],
        routeKeyHistory: [],
        routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
      },
      CommonActions.navigate('non-existent')
    )
  ).toBe(null);
});

it('handles jump to action', () => {
  const router = TabRouter({});

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 0,
        routeNames: ['baz', 'bar'],
        routeKeyHistory: [],
        routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
      },
      TabActions.jumpTo('bar')
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar'],
    routeKeyHistory: ['baz'],
    routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
  });
});

it('handles back action with backBehavior: history', () => {
  const router = TabRouter({ backBehavior: 'history' });

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 0,
        routeNames: ['baz', 'bar'],
        routeKeyHistory: ['bar'],
        routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
      },
      CommonActions.goBack()
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar'],
    routeKeyHistory: [],
    routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
  });

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 0,
        routeNames: ['baz', 'bar'],
        routeKeyHistory: [],
        routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
      },
      CommonActions.goBack()
    )
  ).toBe(null);
});

it('handles back action with backBehavior: order', () => {
  const router = TabRouter({ backBehavior: 'order' });

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar'],
        routeKeyHistory: [],
        routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
      },
      CommonActions.goBack()
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar'],
    routeKeyHistory: [],
    routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
  });

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 0,
        routeNames: ['baz', 'bar'],
        routeKeyHistory: [],
        routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
      },
      CommonActions.goBack()
    )
  ).toBe(null);
});

it('handles back action with backBehavior: initialRoute', () => {
  const router = TabRouter({
    backBehavior: 'initialRoute',
    initialRouteName: 'bar',
  });

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 0,
        routeNames: ['baz', 'bar'],
        routeKeyHistory: [],
        routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
      },
      CommonActions.goBack()
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar'],
    routeKeyHistory: [],
    routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
  });

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar'],
        routeKeyHistory: [],
        routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
      },
      CommonActions.goBack()
    )
  ).toBe(null);
});

it('handles back action with backBehavior: none', () => {
  const router = TabRouter({ backBehavior: 'none' });

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 0,
        routeNames: ['baz', 'bar'],
        routeKeyHistory: [],
        routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
      },
      CommonActions.goBack()
    )
  ).toEqual(null);
});

it('updates route key history on navigate and jump to', () => {
  const router = TabRouter({ backBehavior: 'history' });

  let state: TabNavigationState = {
    index: 1,
    key: 'tab-test',
    routeKeyHistory: [],
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-0', name: 'baz', params: { answer: 42 } },
      { key: 'qux-0', name: 'qux', params: { name: 'Jane' } },
    ],
    stale: false as const,
  };

  expect(state.routeKeyHistory).toEqual([]);

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('qux')
  ) as TabNavigationState;

  expect(state.routeKeyHistory).toEqual(['baz-0']);

  state = router.getStateForAction(
    state,
    CommonActions.navigate('bar')
  ) as TabNavigationState;

  expect(state.routeKeyHistory).toEqual(['baz-0', 'qux-0']);

  state = router.getStateForAction(
    state,
    TabActions.jumpTo('baz')
  ) as TabNavigationState;

  expect(state.routeKeyHistory).toEqual(['qux-0', 'bar-0']);

  state = router.getStateForAction(
    state,
    CommonActions.goBack()
  ) as TabNavigationState;

  expect(state.routeKeyHistory).toEqual(['qux-0']);

  state = router.getStateForAction(
    state,
    CommonActions.goBack()
  ) as TabNavigationState;

  expect(state.routeKeyHistory).toEqual([]);
});

it('updates route key history on focus change', () => {
  const router = TabRouter({ backBehavior: 'history' });

  const state = {
    index: 0,
    key: 'tab-test',
    routeKeyHistory: [],
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-0', name: 'baz', params: { answer: 42 } },
      { key: 'qux-0', name: 'qux', params: { name: 'Jane' } },
    ],
    stale: false as const,
  };

  expect(router.getStateForRouteFocus(state, 'bar-0').routeKeyHistory).toEqual(
    []
  );

  expect(router.getStateForRouteFocus(state, 'baz-0').routeKeyHistory).toEqual([
    'bar-0',
  ]);
});
