import { CommonActions } from '@react-navigation/core';
import { TabRouter } from '../src';

jest.mock('shortid', () => () => 'test');

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
      { type: 'JUMP_TO', payload: { name: 'bar' } }
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

it('handles history back action', () => {
  const router = TabRouter({});

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
      { type: 'GO_BACK' }
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 1,
    routeNames: ['baz', 'bar'],
    routeKeyHistory: [],
    routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
  });
});

it('handles order back action', () => {
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
      { type: 'GO_BACK' }
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar'],
    routeKeyHistory: [],
    routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
  });
});

it('handles initialRoute back action', () => {
  const router = TabRouter({ backBehavior: 'initialRoute' });

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
      { type: 'GO_BACK' }
    )
  ).toEqual({
    stale: false,
    key: 'root',
    index: 0,
    routeNames: ['baz', 'bar'],
    routeKeyHistory: [],
    routes: [{ key: 'baz', name: 'baz' }, { key: 'bar', name: 'bar' }],
  });
});

it('handles none back action', () => {
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
      { type: 'GO_BACK' }
    )
  ).toEqual(null);
});
