import { CommonActions } from '@react-navigation/core';
import { DrawerRouter, DrawerActions } from '../src';

jest.mock('shortid', () => () => 'test');

it('gets initial state from route names and params with initialRouteName', () => {
  const router = DrawerRouter({ initialRouteName: 'baz' });

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
    key: 'drawer-test',
    isDrawerOpen: false,
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
  const router = DrawerRouter({});

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
    key: 'drawer-test',
    isDrawerOpen: false,
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
  const router = DrawerRouter({});

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
    key: 'drawer-test',
    isDrawerOpen: false,
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
    key: 'drawer-test',
    isDrawerOpen: false,
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
    index: 0,
    key: 'drawer-test',
    isDrawerOpen: false,
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
        isDrawerOpen: true,
        routeKeyHistory: ['bar-test', 'qux-test', 'foo-test'],
        routes: [],
      },
      options
    )
  ).toEqual({
    index: 1,
    key: 'drawer-test',
    isDrawerOpen: true,
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
  const router = DrawerRouter({});

  const state = {
    index: 0,
    key: 'drawer-test',
    isDrawerOpen: true,
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

it('handles navigate action', () => {
  const router = DrawerRouter({});

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar'],
        routeKeyHistory: [],
        isDrawerOpen: false,
        routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
      },
      CommonActions.navigate('baz', { answer: 42 })
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar'],
    isDrawerOpen: false,
    routeKeyHistory: ['bar'],
    routes: [
      { key: 'baz', name: 'baz', params: { answer: 42 } },
      { key: 'bar', name: 'bar' },
    ],
  });
});

it('handles navigate action with open drawer', () => {
  const router = DrawerRouter({});

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar'],
        routeKeyHistory: [],
        isDrawerOpen: true,
        routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
      },
      CommonActions.navigate('baz', { answer: 42 })
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar'],
    isDrawerOpen: false,
    routeKeyHistory: ['bar'],
    routes: [
      { key: 'baz', name: 'baz', params: { answer: 42 } },
      { key: 'bar', name: 'bar' },
    ],
  });
});

it('handles open drawer action', () => {
  const router = DrawerRouter({});

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar'],
        routeKeyHistory: [],
        isDrawerOpen: false,
        routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
      },
      DrawerActions.openDrawer()
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar'],
    isDrawerOpen: true,
    routeKeyHistory: [],
    routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
  });

  const state = {
    stale: false as const,
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar'],
    isDrawerOpen: true,
    routeKeyHistory: [],
    routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
  };

  expect(router.getStateForAction(state, DrawerActions.openDrawer())).toBe(
    state
  );
});

it('handles close drawer action', () => {
  const router = DrawerRouter({});

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar'],
        routeKeyHistory: [],
        isDrawerOpen: true,
        routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
      },
      DrawerActions.closeDrawer()
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar'],
    isDrawerOpen: false,
    routeKeyHistory: [],
    routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
  });

  const state = {
    stale: false as const,
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar'],
    isDrawerOpen: false,
    routeKeyHistory: [],
    routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
  };

  expect(router.getStateForAction(state, DrawerActions.closeDrawer())).toBe(
    state
  );
});

it('handles toggle drawer action', () => {
  const router = DrawerRouter({});

  expect(
    router.getStateForAction(
      {
        stale: false,
        key: 'root',
        index: 1,
        routeNames: ['baz', 'bar'],
        routeKeyHistory: [],
        isDrawerOpen: true,
        routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
      },
      DrawerActions.toggleDrawer()
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar'],
    isDrawerOpen: false,
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
        isDrawerOpen: false,
        routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
      },
      DrawerActions.toggleDrawer()
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar'],
    isDrawerOpen: true,
    routeKeyHistory: [],
    routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
  });
});

it('updates route key history on focus change', () => {
  const router = DrawerRouter({ backBehavior: 'history' });

  const state = {
    index: 0,
    key: 'drawer-test',
    isDrawerOpen: false,
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

it('closes drawer on focus change', () => {
  const router = DrawerRouter({ backBehavior: 'history' });

  expect(
    router.getStateForRouteFocus(
      {
        index: 0,
        key: 'drawer-test',
        isDrawerOpen: false,
        routeKeyHistory: [],
        routeNames: ['bar', 'baz', 'qux'],
        routes: [
          { key: 'bar-0', name: 'bar' },
          { key: 'baz-0', name: 'baz' },
          { key: 'qux-0', name: 'qux' },
        ],
        stale: false,
      },
      'baz-0'
    )
  ).toEqual({
    index: 1,
    isDrawerOpen: false,
    key: 'drawer-test',
    routeKeyHistory: ['bar-0'],
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-0', name: 'baz' },
      { key: 'qux-0', name: 'qux' },
    ],
    stale: false,
  });

  expect(
    router.getStateForRouteFocus(
      {
        index: 0,
        key: 'drawer-test',
        isDrawerOpen: true,
        routeKeyHistory: [],
        routeNames: ['bar', 'baz', 'qux'],
        routes: [
          { key: 'bar-0', name: 'bar' },
          { key: 'baz-0', name: 'baz' },
          { key: 'qux-0', name: 'qux' },
        ],
        stale: false,
      },
      'baz-0'
    )
  ).toEqual({
    index: 1,
    isDrawerOpen: false,
    key: 'drawer-test',
    routeKeyHistory: ['bar-0'],
    routeNames: ['bar', 'baz', 'qux'],
    routes: [
      { key: 'bar-0', name: 'bar' },
      { key: 'baz-0', name: 'baz' },
      { key: 'qux-0', name: 'qux' },
    ],
    stale: false,
  });
});
