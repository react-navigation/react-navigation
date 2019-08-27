import { CommonActions } from '@react-navigation/core';
import { DrawerRouter } from '../src';

jest.mock('shortid', () => () => 'test');

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
      { type: 'OPEN_DRAWER' }
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
      { type: 'CLOSE_DRAWER' }
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
      { type: 'TOGGLE_DRAWER' }
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
      { type: 'TOGGLE_DRAWER' }
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
